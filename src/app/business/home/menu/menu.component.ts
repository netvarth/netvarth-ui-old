import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { MatDialog } from '@angular/material';
import { ProviderErrorMesagePopupComponent } from '../../modules/provider-error-message-popup/provider-error-message-popup.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  accountType;
  subscription: Subscription;
  inboxUnreadCnt;
  inboxCntFetched;
  alertCnt;
  domain;
  bname;
  bsector = '';
  bsubsector = '';
  blogo = '';
  qAvailability;
  iswiz = false; // is cur page is wizard
  isCheckin;
  customer_label = '';
  appointmentStatus = false;
  checkinStatus = false;
  donationstatus;
  locationExist = false;
  serviceExist = false;
  qExist = false;
  scheduleExist = false;
  profileExist = false;
  constructor(
    private shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    private router: Router,
    private renderer: Renderer2,
    private dialog: MatDialog,
    public provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions
  ) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'messageCount':
          this.inboxUnreadCnt = message.unreadCount;
          this.inboxCntFetched = message.messageFetched;
          break;
        case 'alertCount':
          this.alertCnt = message.alertCnt;
          break;
        case 'hidemenus':
          this.iswiz = message.value;
          break;
        case 'updateuserdetails':
          // this.getUserdetails();
          // this.handleHeaderclassbasedonURL();
          break;
        case 'upgradelicence':
          // this.setLicense();
          // this.getUpgradablePackages();
          break;
        case 'main_loading':
          // this.main_loading = message.action || false;
          break;
        // case 'load_unread_count':
        //   if (!message.action) {
        //   } else if (message.action === 'setzero') {
        //     this.inboxUnreadCnt = 0;
        //     this.inboxCntFetched = true;
        //   }
        //   break;
        // case 'learn_more':
        // this.showLearnMore = true;
        // this.scrollhideclass.emit(false);
        // this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey };
        // this.router.navigate(['/provider/learnmore/' + message.target.scrollKey]);
        // break;
        // case 'faq':
        // this.showLearnMore = true;
        // this.scrollhideclass.emit(false);
        // this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey };
        // this.router.navigate(['/provider/faq/' + message.target.scrollKey]);
        // break;
        case 'instant_q':
          this.qAvailability = message.qAvailability;
          break;
        // case 'popularList':
        //   this.jsonlist = message.target;
        //   if (this.jsonlist) {
        //     this.popular_search(this.jsonlist);
        //   }
        //   break;
        // case 'popularSearchList':
        //   this.jsonlist = message.target;
        //   this.popular_search(this.jsonlist);
        //   break;
        case 'apptStatus':
          this.appointmentStatus = message.apptStatus;
          break;
        case 'checkinStatus':
          this.checkinStatus = message.checkinStatus;
          break;
        case 'donationStatus':
          this.donationstatus = message.donationStatus;
          break;
        case 'serviceChange':
          this.serviceExist = true;
          break;
        case 'qChange':
          this.qExist = true;
          break;
        case 'scheduleChange':
          this.scheduleExist = true;
          break;
        case 'locationChange':
          this.locationExist = true;
          break;
        case 'profileChange':
          this.profileExist = true;
          break;
      }
      this.getBusinessdetFromLocalstorage();
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || './assets/images/img-null.svg';
    }
    if (this.bname === '') {
      this.profileExist = false;
    } else {
      this.profileExist = true;
    }
  }
  closeMenu() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }
  userClicked() {
    this.closeMenu();
    this.router.navigate(['provider/settings/general/users']);
  }
  dashboardClicked() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
    // if (this.isCheckinActive()) {
    //   this.router.navigate(['/provider/check-ins'], { queryParams: { time_type: 1 } });
    // }
  }
  isCheckinActive() {
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
    if (this.isCheckin || this.isCheckin === 0 || this.isCheckin > 3) {
      if (this.isCheckin === 0 || this.isCheckin > 3) {
        return true;
      } else {
        this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
        return false;
      }
    } else {
      this.provider_services.getBussinessProfile()
        .subscribe(
          data => {
            this.isCheckin = this.provider_shared_functions.getProfileStatusCode(data);
            this.shared_functions.setitemToGroupStorage('isCheckin', this.isCheckin);
            if (this.isCheckin === 0) {
              return true;
            } else {
              this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
              return false;
            }
          },
          () => {
          }
        );
    }
  }
  gotoHelp() {
    this.router.navigate(['/provider/' + this.domain + '/help']);
  }
  btnAvailableClicked() {
    this.router.navigate(['provider/settings/q-manager/queues']);
  }
  holidaybtnClicked() {
    this.router.navigate(['provider/settings/general/holidays']);
  }
  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.domain = user.sector;
    this.getBusinessdetFromLocalstorage();
    this.getProviderLocations();
    this.getServices();
    this.getQs();
    this.getSchedules();
    this.isAvailableNow();
    this.getGlobalSettings();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  isAvailableNow() {
    this.shared_service.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
      },
        () => {
        });
  }

  getGlobalSettings() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.appointmentStatus = data.appointment;
        this.donationstatus = data.donationFundRaising;
        this.checkinStatus = data.waitlist;
      });
  }

  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.locationExist = true;
        } else {
          this.locationExist = false;
        }
      });
  }

  getServices() {
    const filter = { 'serviceType-neq': 'donationService' };
    this.provider_services.getProviderServices(filter)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.serviceExist = true;
        } else {
          this.serviceExist = false;
        }
      });
  }

  getSchedules() {
    this.provider_services.getProviderSchedules()
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.scheduleExist = true;
          } else {
            this.scheduleExist = false;
          }
        });
  }

  getQs() {
    this.provider_services.getProviderQueues()
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.qExist = true;
          } else {
            this.qExist = false;
          }
        });
  }
  menuClick(source) {
    console.log(this.locationExist);[]
    if (source === 'checkin') {
      if (!this.checkinStatus || !this.profileExist || !this.locationExist || !this.serviceExist || !this.qExist) {
        let status;
        if (!this.profileExist || !this.locationExist || !this.serviceExist || !this.qExist) {
          status = 'inactive';
        }
        this.showPopup(source, this.checkinStatus, status);
      } else {
        this.router.navigate(['provider/check-ins']);
      }
    } else {
      if (!this.appointmentStatus || !this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
        let status;
        if (!this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
          status = 'inactive';
        }
        this.showPopup(source, this.appointmentStatus, status);
      } else {
        this.router.navigate(['provider/appointments']);
      }
    }
  }
  showPopup(source, status, profileExist) {
    const dialogrefd = this.dialog.open(ProviderErrorMesagePopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'menupopup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source: source,
        status: status,
        profile: profileExist
      }
    });
    dialogrefd.afterClosed().subscribe(result => {

    });
  }
}
