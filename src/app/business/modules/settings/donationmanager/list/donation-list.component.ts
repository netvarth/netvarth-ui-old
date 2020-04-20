import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-donation-causelist',
    templateUrl: './donation-list.component.html'
})
export class DonationCauseListComponent implements OnInit, OnDestroy {
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
            url: '/provider/settings/donation',
            title: 'Donation Manager'
        },
        {
            url: '/provider/settings/donation/causes',
            title: 'Causes'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    domain: any;
    domainList: any = [];
    subDomain;
    userId: any;
    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        public router: Router) {
        this.activated_route.params.subscribe(params => {
            this.userId = params.id;
        }
        );
    }

    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.breadcrumb_moreoptions = {
            'actions': [{ 'title': 'Add Cause', 'type': 'addcause' }]
        };
    }

    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addcause') {
            this.router.navigate(['provider', 'settings', 'donation', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/checkinmanager->settings-services']);
        }
    }
    getServices() {
        this.api_loading = true;
        this.provider_services.getUserServicesList(this.userId)
            .subscribe(
                data => {
                    console.log(data);
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
                    this.getServices();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServices();
                });
    }

    enableService(service) {
        this.provider_services.enableService(service.id)
            .subscribe(
                () => {
                    this.getServices();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getServices();
                });
    }
    editService(service) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'services', service.id], navigationExtras);
    }
    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'services', service.id]);
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
}
