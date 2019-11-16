import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { ProviderServices } from '../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { CommonDataStorageService } from '../shared/services/common-datastorage.service';
import { ProviderSharedFuctions } from '../ynw_provider/shared/functions/provider-shared-functions';
import { SharedServices } from '../shared/services/shared-services';
import { Subscription } from 'rxjs/Subscription';

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
  constructor(router: Router,
    public route: ActivatedRoute,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public shared_service: SharedServices,
    public provider_datastorage: CommonDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions) {
    router.events.subscribe(
      (event: RouterEvent): void => {
        this._navigationInterceptor(event);
      }
    );

    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (router.url === '\/provider') {
          router.navigate(['provider', 'check-ins']);
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
    this.activeSkin = this.shared_functions.getitemfromLocalStorage('activeSkin');
    if (!this.activeSkin) {
      this.activeSkin = 'skin-blue';
    }
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
            this.shared_functions.setitemonLocalStorage('isCheckin', statusCode);
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
}
