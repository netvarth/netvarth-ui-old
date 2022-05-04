import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../business/services/provider-services.service';
// import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { SharedFunctions } from '../../functions/shared-functions';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
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
  constructor(public sharedFunctionobj: SharedFunctions,
    private sharedServices: SharedServices,
    private activated_route: ActivatedRoute,
    // private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private providerServices: ProviderServices,
    private localStorage: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.activated_route.params.subscribe(
      (qParams) => {
        this.qParams = qParams;
        if (!this.qParams.type) {
          this.loggedIn = this.sharedFunctionobj.checkLogin();
          if (this.loggedIn) {
            this.getDetails();
          }
        } else {
          this.loading = false;
        }
      });
  }
  ngOnInit(): void {
  }
  getDetails() {
    this.isBusinessOwner = this.localStorage.getitemfromLocalStorage('isBusinessOwner');
    this.isBusinessOwner = JSON.parse(this.isBusinessOwner);
    if (!this.isBusinessOwner) {
      if (this.qParams.uid.split('_')[1] === 'appt') {
        this.source = 'consAppt';
        this.getApptDetails();
      } else {
        this.source = 'consCheckin';
        this.getCheckinDetails();
      }
    } else {
      this.type = 'qnrLinkProvider';
      this.userType="provider";
      if (this.qParams.uid.split('_')[1] === 'appt') {
        this.source = 'consAppt';
        this.getProviderApptDetails();
      } else {
        this.source = 'consCheckin';
        this.getProviderWaitlistDetail();
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
}
