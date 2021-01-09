import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../../../app.component';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { ShowMessageComponent } from '../../../../../../../../business/modules/show-messages/show-messages.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-user-services',
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
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            url: '/provider/settings/general/users',
            title: 'Users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    domain: any;
    domainList: any = [];
    subDomain;
    userId: any;
    page_count = projectConstants.PERPAGING_LIMIT;
    page = 1;
    pagination: any = {
        startpageval: 1,
        totalCnt: 0,
        perPage: this.page_count
    };
    order = 'status';
    use_metric;
    usage_metric: any;
    adon_info: any;
    adon_total: any;
    adon_used: any;
    disply_name: any;
    warningdialogRef: any;
    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        private dialog: MatDialog,
        public router: Router) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
    }

    ngOnInit() {
        this.getUser();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getServiceCount();
       // this.getServices();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'q-manager->settings-services', 'classname': 'b-service',
            'actions': [{ 'title': this.add_new_serv_cap, 'type': 'addservice' },
            { 'title': 'Help', 'type': 'learnmore' }]
        };
        if (this.domain === 'healthCare' || this.domain === 'veterinaryPetcare')  {
            this.services_cap = projectConstantsLocal.HealthcareService.service_cap;
          }
          this.getLicenseUsage();
    }

    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addservice') {
            this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/q-manager->settings-services']);
        }
    }
    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                    breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: data.firstName,
                    url: '/provider/settings/general/users/add?type=edit&val=' + this.userId
                });
                breadcrumbs.push({
                    title: 'Settings',
                    url: '/provider/settings/general/users/' + this.userId + '/settings'
                });
                breadcrumbs.push({
                    title: 'Services'
                });
                this.breadcrumbs = breadcrumbs;
            });
    }
    getServices(pgefilter?) {
      // const filter = {};
     //   filter['provider-eq'] = this.userId;
        this.api_loading = true;
        this.provider_services.getUserServicesList(pgefilter)
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
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', service.id], navigationExtras);
    }
    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', service.id]);
    }
    getDomainSubdomainSettings() {
        this.provider_services.domainSubdomainSettings(this.domain, this.subDomain)
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

    getServiceCount() {
        const filter = { 'serviceType-neq': 'donationService', 'provider-eq': this.userId };
        this.provider_services.getServiceCount(filter)
            .subscribe(
                data => {
                    this.pagination.totalCnt = data;
                    const pgefilter = {
                        'from': 0,
                        'count': this.pagination.totalCnt,
                        'serviceType-neq': 'donationService',
                        'provider-eq': this.userId
                    };
                    this.setPaginationFilter(pgefilter);
                    this.getServices(pgefilter);
                });
    }
    setPaginationFilter(api_filter) {
        api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.page_count : 0;
        api_filter['count'] = this.page_count;
        return api_filter;
    }
    handle_pageclick(pg) {
        this.pagination.startpageval = pg;
        this.page = pg;
        const pgefilter = {
            'from' : this.pagination.startpageval,
            'count': this.pagination.totalCnt,
            'serviceType-neq': 'donationService',
            'provider-eq': this.userId
          };
          this.setPaginationFilter(pgefilter);
          this.getServices(pgefilter);
      }
      redirecToUserSettings() {
        this.router.navigate(['provider', 'settings', 'general' , 'users' , this.userId , 'settings']);
      }
      addservice() {
        if (this.adon_total === this.adon_used) {
            this.warningdialogRef = this.dialog.open(ShowMessageComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'popup-class'],
                disableClose: true,
                data: {
                    warn: this.disply_name
                }
            });
            this.warningdialogRef.afterClosed().subscribe(result => {

            });
        } else {
            this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'services', 'add']);
        }
       }
       getLicenseUsage() {
        this.provider_services.getLicenseUsage()
            .subscribe(
                data => {
                   this.use_metric = data;
                   this.usage_metric = this.use_metric.metricUsageInfo;
                   this.adon_info = this.usage_metric.filter(sch => sch.metricName === 'Queues/Schedules/Services');
                   this.adon_total = this.adon_info[0].total;
                   this.adon_used = this.adon_info[0].used;
                   this.disply_name = this.adon_info[0].metricName;
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    } 
}
