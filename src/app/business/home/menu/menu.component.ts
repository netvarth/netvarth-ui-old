import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { ProviderDataStorageService } from '../../../ynw_provider/services/provider-datastorage.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
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
  settings;
  showToken = false;
  donationstatus: any;
  count = 0;
  orderstatus;
  minimizeMenu = false;
  showMenu = false;
  enquiryCount;
  isadminPrivilege: any;
  apptstatus: any;
  constructor(
    private shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    private router: Router,
    private renderer: Renderer2,
    public provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private provider_dataStorage: ProviderDataStorageService,
    private titleService: Title
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
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
        case 'waitlistSettings':
          this.showToken = message.value;
          break;
        case 'donationStatus':
          this.donationstatus = message.donationStatus;
          break;
        case 'apptStatus':
          this.apptstatus = message.apptStatus;
          break;
        case 'orderStatus':
          this.orderstatus = message.orderStatus;
          break;
        case 'showmenu':
          this.showMenu = message.value;
          break;
        case 'enquiryCount':
          this.getEnquiryCount();
          break;
      }
      this.getBusinessdetFromLocalstorage();
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || '../../../assets/images/img-null.svg';
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
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    if (this.isCheckin || this.isCheckin === 0 || this.isCheckin > 3) {
      if (this.isCheckin === 0 || this.isCheckin > 3) {
        return true;
      } else {
        this.snackbarService.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
        return false;
      }
    } else {
      this.provider_services.getBussinessProfile()
        .subscribe(
          data => {
            this.isCheckin = this.provider_shared_functions.getProfileStatusCode(data);
            this.groupService.setitemToGroupStorage('isCheckin', this.isCheckin);
            if (this.isCheckin === 0) {
              return true;
            } else {
              this.snackbarService.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
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
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.isadminPrivilege = user.adminPrivilege
    this.domain = user.sector;
    this.getGlobalSettings();
    this.getBusinessdetFromLocalstorage();
    this.isAvailableNow();
    this.getProviderSettings();
    this.getOrderStatus();
    this.getEnquiryCount();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        if (this.domain === 'healthCare' && !this.showToken && this.count === 0) {
          let postData;
          postData = {
            calculationMode: 'NoCalc',
            showTokenId: true
          };
          this.provider_services.setWaitlistMgr(postData)
            .subscribe(
              () => {
                this.count++;
                this.getProviderSettings();
              });
        }
      }, () => {
      });
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
    const settings = this.groupService.getitemFromGroupStorage('settings');
    if (settings) {
      this.donationstatus = settings.donationFundRaising;
      this.apptstatus = settings.appointment;
    } else {
      this.provider_services.getGlobalSettings().subscribe(
        (data: any) => {
          this.donationstatus = data.donationFundRaising;
          this.apptstatus = data.appointment;
        });
    }
  }
  getOrderStatus() {
    this.provider_services.getProviderOrderSettings().subscribe((data: any) => {
      this.orderstatus = data.enableOrder;
    });
  }

  minimizeSideBar() {
    this.minimizeMenu = !this.minimizeMenu;
    this.shared_functions.sendMessage({ ttype: 'smallMenu', value: this.minimizeMenu });
  }
  gotoActiveHome() {
    this.shared_functions.gotoActiveHome();
  }
  showMenuSection() {
    this.showMenu = false;
    this.shared_functions.sendMessage({ ttype: 'showmenu', value: this.showMenu });
  }
  getEnquiryCount() {
    const providerId = 0;
    this.provider_services.getProviderUnreadCount('ENQUIRY', providerId).subscribe(data => {
      this.enquiryCount = data;
    });
  }
  doLogout() {
    this.shared_functions.doLogout()
      .then(
        () => {
          this.provider_dataStorage.setWeightageArray([]);
          this.titleService.setTitle('Jaldee');
          this.router.navigate(['/home']);
        },
        () => {
        }
      );
  }
}
