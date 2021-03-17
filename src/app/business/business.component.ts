import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { ProviderServices } from '../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { CommonDataStorageService } from '../shared/services/common-datastorage.service';
import { ProviderSharedFuctions } from '../ynw_provider/shared/functions/provider-shared-functions';
import { SharedServices } from '../shared/services/shared-services';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEmailComponent } from './modules/update-email/update-email.component';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { GroupStorageService } from '../shared/services/group-storage.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { WordProcessor } from '../shared/services/word-processor.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html'
})
export class BusinessComponent implements OnInit {

  evnt;
  outerscroller = false;
  licenseMetrics: any = [];
  selectedpkgMetrics: any = [];
  apiloading = false;
  activeSkin;
  subscription: Subscription;
  contactInfo: any = [];
  profile: any = [];
  iswiz = false;
  smallMenuSection = false;
  screenWidth;
  bodyHeight;
  constructor(router: Router,
    public route: ActivatedRoute,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    public dialog: MatDialog,
    public provider_datastorage: CommonDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    private lStorageService: LocalStorageService,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private titleService: Title) {
    this.titleService.setTitle('Jaldee Business');
    router.events.subscribe(
      (event: RouterEvent): void => {
        this._navigationInterceptor(event);
      }
    );
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.shared_functions.isBusinessOwner()) {
          this.shared_functions.getGlobalSettings()
            .then(
              (settings: any) => {
                if (router.url === '\/provider') {
                  setTimeout(() => {
                    if (this.groupService.getitemFromGroupStorage('isCheckin') === 0) {
                      if (settings.waitlist) {
                        router.navigate(['provider', 'check-ins']);
                      } else if (settings.appointment) {
                        router.navigate(['provider', 'appointments']);
                      } else if (settings.order) {
                        router.navigate(['provider', 'orders']);
                      } else {
                        router.navigate(['provider', 'settings']);
                      }
                    } else {
                      router.navigate(['provider', 'settings']);
                    }
                  }, 500);
                }
              });
        }
      }
    });

    this.route.data.subscribe((data) => {
      if (data.terminologies) {
        this.wordProcessor.setTerminologies(data.terminologies);
      }
    });
    this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });

    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'skin':
          this.activeSkin = message.selectedSkin;
          this.lStorageService.setitemonLocalStorage('activeSkin', this.activeSkin);
          break;
        case 'hidemenus':
          this.iswiz = message.value;
          break;
        case 'smallMenu':
          this.smallMenuSection = message.value;
          break;
      }
    });
  }
  private _navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.apiloading = true;
    }
    if (event instanceof NavigationEnd) {
      this.apiloading = false;
    }
    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.apiloading = false;
    }
    if (event instanceof NavigationError) {
      this.apiloading = false;
    }
  }
  handleScrollhide(ev) {
    this.outerscroller = ev;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (this.screenWidth <= 991) {
      this.bodyHeight = screenHeight - 160;
    } else {
      this.bodyHeight = screenHeight - 120;
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.onResize();
    this.getBusinessProfile();
    this.getLicenseMetaData();
    this.activeSkin = this.lStorageService.getitemfromLocalStorage('activeSkin');
    if (!this.activeSkin) {
      this.activeSkin = 'skin-blue';
    }
  }
  getAccountContactInfo() {
    this.provider_services.getAccountContactInfo().subscribe(
      data => {
        this.contactInfo = data;
        if (!this.contactInfo.primaryEmail) {
          this.getProfile();
        }
      }
    );
  }
  updateEmailPopup() {
    const dialogref = this.dialog.open(UpdateEmailComponent, {
      width: '40%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        profile: this.profile
      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    );
  }
  getProfile() {
    this.shared_functions.getProfile()
      .then(
        (data: any) => {
          this.profile = data;
          if (this.profile.basicInfo.emailVerified) {
            this.updateEmail(this.profile.basicInfo.email);
          } else {
            this.updateEmailPopup();
          }
        }
      );
  }
  updateEmail(email) {
    const post_data = {
      'primaryEmail': email,
      'primaryPhoneNumber': this.contactInfo.primaryPhoneNumber,
      'contactFirstName': this.contactInfo.contactFirstName,
      'contactLastName': this.contactInfo.contactLastName
    };
    this.provider_services.updateAccountContactInfo(post_data).subscribe(
      data => {
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }

  getProviderLogo(bname = '', bsector = '', bsubsector = '') {
    let blogo;
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          blogo = data;
          let logo = '';
          if (blogo[0]) {
            logo = blogo[0].url;
          } else {
            logo = '';
          }
          // calling function which saves the business related details to show in the header
          this.shared_functions.setBusinessDetailsforHeaderDisp(bname || '', bsector || '', bsubsector || '', logo);
          const pdata = { 'ttype': 'updateuserdetails' };
          this.shared_functions.sendMessage(pdata);
        },
        () => {
        }
      );
  }
  getBusinessProfile() {
    let bProfile: any = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          bProfile = data;
          if (!this.lStorageService.getitemfromLocalStorage('newProvider')) {
            this.getAccountContactInfo();
          }
          this.groupService.setitemToGroupStorage('accountId', bProfile.id);
          if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
            // calling function which saves the business related details to show in the header
            // const subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
            // this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
            //   || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
              || '', bProfile['serviceSector']['displayName'] || '', bProfile['serviceSubSector']['displayName'] || '', '');
            this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '', bProfile['serviceSubSector']['displayName'] || '');
            const pdata = { 'ttype': 'updateuserdetails' };
            this.shared_functions.sendMessage(pdata);
            const statusCode = this.provider_shared_functions.getProfileStatusCode(bProfile);
            if (statusCode === 0) {
            }
            this.groupService.setitemToGroupStorage('isCheckin', statusCode);
          }
        },
        () => { }
      );
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getBussinessProfile()
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  getLicenseMetaData() {
    this.provider_services.getLicenseMetadata().subscribe(data => {
      this.lStorageService.setitemonLocalStorage('license-metadata', data);
    });
  }
  showMenu() {
    this.shared_functions.sendMessage({ ttype: 'showmenu', value: false });
  }
}
