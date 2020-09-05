import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';

@Component({
    selector: 'app-waitlist-services',
    templateUrl: './waitlist-services.component.html'
})
export class WaitlistServicesComponent implements OnInit, OnDestroy {
    add_new_serv_cap = Messages.SER_ADD_NEW_SER_CAP;
    est_duration_cap = Messages.SER_EST_DURATION_CAP;
    services_cap = Messages.WAITLIST_SERVICES_CAP;
    min_cap = Messages.SER_MIN_CAP;
    price_cap = Messages.SER_PRICE_CAP;
    isServiceBillable = false;
    api_loading = true;
    service_list: any = [];
    api_error = null;
    api_success = null;
    breadcrumb_moreoptions: any = [];
    breadcrumbs;
    domain: any;
    trackStatus: string;
    serv_list;
    liveTrackStatus: any;
    is_virtual_enbl = true;
    page_count = projectConstants.PERPAGING_LIMIT;
    page = 1;
    pagination: any = {
        startpageval: 1,
        totalCnt: 0,
        perPage: this.page_count
      };
      breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
    ];
    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        public router: Router) { }

    ngOnInit() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.liveTrackStatus = data.livetrack;
                if (!data.virtualService) {
                    this.is_virtual_enbl = false;
                }
            });
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        if (this.domain === 'healthCare' || this.domain === 'veterinaryPetcare') {
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: Messages.WAITLIST_HEALTHCARE_SERVICES,
            });
            this.breadcrumbs = breadcrumbs;
        } else {
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: Messages.WAITLIST_SERVICES_CAP,
            });
            this.breadcrumbs = breadcrumbs;
        }
        this.api_loading = true;
        this.getDomainSubdomainSettings();
        this.getServiceCount();
       // this.getServices();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'q-manager->settings-services', 'classname': 'b-service',
            'actions': [{ 'title': this.add_new_serv_cap, 'type': 'addservice' },
            { 'title': 'Help', 'type': 'learnmore' }]
        };
    }

    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addservice') {
            this.router.navigate(['provider', 'settings', 'q-manager',
                'services', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-services']);
        }
    }
    getServices(pgefilter?) {
        this.api_loading = true;
      //  const filter = { 'scope-eq': 'account' };
        this.provider_services.getProviderServices(pgefilter)
            .subscribe(
                data => {
                    this.service_list = data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    changeServiceStatus(service) {
        this.provider_shared_functions.changeServiceStatus(this, service);
    }
    changeLiveTrackStatus(service) {
        if (service.livetrack === false) {
            this.trackStatus = 'Enable';
        } else {
            this.trackStatus = 'Disable';
        }
        this.provider_services.setServiceLivetrack(this.trackStatus, service.id)
      .subscribe(
        () => {
           this.shared_functions.openSnackBar('Live tracking updated successfully', { ' panelclass': 'snackbarerror' });
           this.service_list = [];
           this.getServices();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

    }

    disableService(service) {
        this.provider_services.disableService(service.id)
            .subscribe(
                () => {
                    this.getServiceCount();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceCount();
                });
    }

    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getServiceCount();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServiceCount();
                });
    }
    editService(service) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'q-manager',
            'services', service.id], navigationExtras);
    }

    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'q-manager',
            'services', service.id]);
    }

    getDomainSubdomainSettings() {
        this.api_loading = true;
        const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
        const domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        this.provider_services.domainSubdomainSettings(domain, sub_domain)
            .subscribe(
                (data: any) => {
                    if (data.serviceBillable) {
                        this.isServiceBillable = true;
                    } else {
                        this.isServiceBillable = false;
                    }
                    this.api_loading = false;
                },
                () => {
                    this.api_loading = false;
                }
            );
    }
    getAppxTime(waitlist) {
        return this.shared_functions.providerConvertMinutesToHourMinute(waitlist);
    }
    handle_pageclick(pg) {
        this.pagination.startpageval = pg;
        this.page = pg;
        const pgefilter = {
            'from' : this.pagination.startpageval,
            'count': this.pagination.totalCnt,
            'serviceType-neq': 'donationService'
          };
          this.setPaginationFilter(pgefilter);
          this.getServices(pgefilter);
      }
      setPaginationFilter(api_filter) {
        api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.page_count : 0;
        api_filter['count'] = this.page_count;
        return api_filter;
      }
      getServiceCount() {
        const filter = {  'serviceType-neq': 'donationService' };
        this.provider_services.getServiceCount(filter)
          .subscribe(
            data => {
              this.pagination.totalCnt = data;
              const pgefilter = {
                'from' : 0,
                'count': this.pagination.totalCnt,
                'serviceType-neq': 'donationService'
              };
              this.setPaginationFilter(pgefilter);
              this.getServices(pgefilter);
            });
      }
      redirecToQmanager() {
        this.routerobj.navigate(['provider', 'settings' , 'q-manager' ]);
      }
      redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-services']);
      }
      addservice() {
        this.router.navigate(['provider', 'settings', 'q-manager', 'services', 'add']);
       }
}
