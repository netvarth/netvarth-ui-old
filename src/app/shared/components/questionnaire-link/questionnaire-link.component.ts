import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../business/services/provider-services.service';
// import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { SharedFunctions } from '../../functions/shared-functions';
import { AuthService } from '../../services/auth-service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { DomainConfigGenerator } from '../../services/domain-config-generator.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedServices } from '../../services/shared-services';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-questionnaire-link',
  templateUrl: './questionnaire-link.component.html',
  styleUrls: ['./questionnaire-link.component.css']
})
export class QuestionnaireLinkComponent implements OnInit {
  loggedIn = true;  // To check whether user logged in or not
  isPermitted = true;
  loading = true;
  questionnaire: any = [];
  waitlist: any = [];
  qParams;
  source;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  qnrStatus;
  isBusinessOwner;
  type = 'qnr-link';
  waitlistStatus;
  userType: string;
  customId: any;
  accountConfig: any;
  accountId: any;
  constructor(public sharedFunctionobj: SharedFunctions,
    private sharedServices: SharedServices,
    private activated_route: ActivatedRoute,
    private configService: DomainConfigGenerator,
    private snackbarService: SnackbarService,
    private router: Router,
    private providerServices: ProviderServices,
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.activated_route.params.subscribe(
      (qParams) => {
        this.qParams = qParams;
        this.accountId = qParams['accountId'];
      });
    this.activated_route.queryParams.subscribe((data: any) => {
      if (data['customId']) {
        this.customId = data['customId'];
      }
    })
  }

  ngOnInit(): void {
    if (this.customId) {
      this.initProviderConsumer();
    } else {
      if (!this.qParams.type) {
        this.loggedIn = this.sharedFunctionobj.checkLogin();
        if (this.loggedIn) {
          this.getDetails();
        }
      } else {
        this.loading = false;
      }
    }
  }
  /**
   * 
   * @param encId encId/customId which represents the Account
   * @returns the unique provider id which will gives access to the s3
   */
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.sharedServices.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            _this.router.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }

  initProviderConsumer() {
    const _this = this;
    if (!this.localStorage.getitemfromLocalStorage('reqFrom')) {
      this.localStorage.setitemonLocalStorage('reqFrom', 'WEB_LINK');
    }
    this.getAccountIdFromEncId(this.customId).then(
      (uniqueId: any) => {
        _this.configService.getUIAccountConfig(uniqueId).subscribe(
          (uiconfig: any) => {
            _this.accountConfig = uiconfig;
          });
        _this.authService.goThroughLogin().then(
          (status) => {
            if (status) {
              _this.loggedIn = true;
              this.getDetails();
              // const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
              // _this.loggedUser = activeUser;;
            } else {
              _this.loggedIn = false;
              // _this.api_loading = false;
            }
          })
      }
    )


  }
  getDetails() {
    this.isBusinessOwner = this.localStorage.getitemfromLocalStorage('isBusinessOwner');
    this.isBusinessOwner = JSON.parse(this.isBusinessOwner);
    if (!this.isBusinessOwner) {
      let bookingType = this.qParams.uid.split('_')[1];
      if (bookingType === 'appt') {
        this.source = 'consAppt';
        this.getApptDetails();
      } else if (bookingType === 'wl') {
        this.source = 'consCheckin';
        this.getCheckinDetails();
      } else {
        this.source = 'consOrder';
        this.getOrderDetails();
      }
    } else {
      this.type = 'qnrLinkProvider';
      this.userType = "provider";
      let bookingType = this.qParams.uid.split('_')[1];
      if (bookingType === 'appt') {
        this.source = 'consAppt';
        this.getProviderApptDetails();
      } else if (bookingType === 'wl') {
        this.source = 'consCheckin';
        this.getProviderWaitlistDetail();
      } else {
        this.source = 'consOrder';
        this.getProviderOrderDetail();
      }
    }
  }
  // doLogin() {
  //   const dialogRef = this.dialog.open(ConsumerJoinComponent, {
  //     width: '40%',
  //     panelClass: ['loginmainclass', 'popup-class'],
  //     disableClose: true,
  //     data: {
  //       type: 'consumer',
  //       is_provider: false,
  //       test_account: true,
  //       moreparams: { source: 'qnrlink', bypassDefaultredirection: 1 }
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'success') {
  //       this.getDetails();
  //     } else {
  //       this.doLogin();
  //     }
  //   });
  // }
  getProviderWaitlistDetail() {
    this.providerServices.getProviderWaitlistDetailById(this.qParams.uid)
      .subscribe(
        data => {
          this.waitlist = data;
          this.getProviderWaitlistReleasedQnrs();
        });
  }
  getProviderOrderDetail() {
    this.providerServices.getProviderOrderDetailById(this.qParams.uid)
      .subscribe(
        data => {
          this.waitlist = data;
          this.getProviderWaitlistReleasedQnrs();
        });
  }
  getProviderApptDetails() {
    this.providerServices.getAppointmentById(this.qParams.uid)
      .subscribe(
        data => {
          this.waitlist = data;
          this.getProviderApptReleasedQnrs();
        });
  }
  getProviderWaitlistReleasedQnrs() {
    this.providerServices.getWaitlistQuestionnaireByUid(this.qParams.uid).subscribe((data: any) => {
      this.questionnaire = data.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
      if (this.questionnaire.length === 0) {
        this.questionnaire = this.waitlist.questionnaires.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
      }
      this.loading = false;
    });
  }
  getProviderApptReleasedQnrs() {
    this.providerServices.getApptQuestionnaireByUid(this.qParams.uid).subscribe((data: any) => {
      this.questionnaire = data.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
      if (this.questionnaire.length === 0) {
        this.questionnaire = this.waitlist.questionnaires.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
      }
      this.loading = false;
    });
  }
  getOrderDetails() {
    this.sharedServices.getOrderByConsumerUUID(this.qParams.uid, this.qParams.accountId).subscribe(
      (data) => {
        this.waitlist = data;
        this.waitlistStatus = this.waitlist.orderStatus.toLowerCase();
        this.getOrderReleasedQnrs();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.loading = false;
        this.isPermitted = false;
      }
    );
  }
  getCheckinDetails() {
    this.sharedServices.getCheckinByConsumerUUID(this.qParams.uid, this.qParams.accountId).subscribe(
      (data) => {
        this.waitlist = data;
        this.waitlistStatus = this.waitlist.waitlistStatus.toLowerCase();
        this.getWaitlistReleasedQnrs();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.loading = false;
        this.isPermitted = false;
      }
    );
  }
  getApptDetails() {
    this.sharedServices.getAppointmentByConsumerUUID(this.qParams.uid, this.qParams.accountId).subscribe(
      (data) => {
        this.waitlist = data;
        this.waitlistStatus = this.waitlist.apptStatus.toLowerCase();
        this.getApptReleasedQnrs();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.loading = false;
        this.isPermitted = false;
      }
    );
  }
  getWaitlistReleasedQnrs() {
    this.sharedServices.getWaitlistQuestionnaireByUid(this.qParams.uid, this.qParams.accountId)
      .subscribe(
        (data: any) => {
          this.getReleasedQnrs(data);
          this.loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loading = false;
          this.isPermitted = false;
        }
      );
  }
  getOrderReleasedQnrs() {
    this.sharedServices.getOrderQuestionnaireByUid(this.qParams.uid, this.qParams.accountId)
      .subscribe(
        (data: any) => {
          this.getReleasedQnrs(data);
          this.loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loading = false;
          this.isPermitted = false;
        }
      );
  }
  getApptReleasedQnrs() {
    this.sharedServices.getApptQuestionnaireByUid(this.qParams.uid, this.qParams.accountId)
      .subscribe(
        (data: any) => {
          this.getReleasedQnrs(data);
          this.loading = false;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loading = false;
          this.isPermitted = false;
        }
      );
  }
  getReleasedQnrs(data) {
    this.questionnaire = data.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
    const qnrWithStatus = this.waitlist.releasedQnr.filter(qnr => qnr.id === JSON.parse(this.qParams.id));
    this.qnrStatus = qnrWithStatus[0].status;
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.router.navigate(['questionnaire', this.qParams.uid, this.qParams.id, this.qParams.accountId, 'success']);
    }
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
  actionPerformed(status) {
    if (status === 'success') {
      this.loggedIn = true;
      this.getDetails();
    }
  }
  gotoActiveHome() {
    let qParams = {};
    if (this.customId) {
      qParams['accountId'] = this.accountId;
      qParams['customId'] = this.customId;
      if (this.localStorage.getitemfromLocalStorage('theme')) {
        qParams['theme'] = this.localStorage.getitemfromLocalStorage('theme');
      }
    }
    const navigationExtras: NavigationExtras = {
      queryParams: qParams
    };
    this.router.navigate(['/consumer'], navigationExtras);
  }
}
