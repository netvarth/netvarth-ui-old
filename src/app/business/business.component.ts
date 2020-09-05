import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { ProviderServices } from '../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { CommonDataStorageService } from '../shared/services/common-datastorage.service';
import { ProviderSharedFuctions } from '../ynw_provider/shared/functions/provider-shared-functions';
import { SharedServices } from '../shared/services/shared-services';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { UpdateEmailComponent } from './modules/update-email/update-email.component';

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
  constructor(router: Router,
    public route: ActivatedRoute,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    public dialog: MatDialog,
    public provider_datastorage: CommonDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions) {
    router.events.subscribe(
      (event: RouterEvent): void => {
        this._navigationInterceptor(event);
      }
    );
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.shared_functions.isBusinessOwner()) {
          this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
              if (router.url === '\/provider') {
                setTimeout(() => {
                  if (this.shared_functions.getitemFromGroupStorage('isCheckin') === 0) {
                    if (data.waitlist) {
                      router.navigate(['provider', 'check-ins']);
                    } else if (data.appointment) {
                      router.navigate(['provider', 'appointments']);
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
        this.provider_datastorage.set('terminologies', data.terminologies);
      }
    });
    this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });

    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'skin':
          this.activeSkin = message.selectedSkin;
          this.shared_functions.setitemonLocalStorage('activeSkin', this.activeSkin);
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

  ngOnInit() {
    this.getBusinessProfile();
    this.getLicenseMetaData();
    this.activeSkin = this.shared_functions.getitemfromLocalStorage('activeSkin');
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
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
          if (!localStorage.getItem('newProvider')) {
            this.getAccountContactInfo();
          }
          this.shared_functions.setitemToGroupStorage('accountId', bProfile.id);
          if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
            // calling function which saves the business related details to show in the header
            const subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
            this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
              || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '');
            const pdata = { 'ttype': 'updateuserdetails' };
            this.shared_functions.sendMessage(pdata);
            const statusCode = this.provider_shared_functions.getProfileStatusCode(bProfile);
            if (statusCode === 0) {
            }
            this.shared_functions.setitemToGroupStorage('isCheckin', statusCode);
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
      this.shared_functions.setitemonLocalStorage('license-metadata', data);
    });
  }
}
