import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-waitlist-services',
    templateUrl: './waitlist-services.component.html'
})
export class WaitlistServicesComponent implements OnInit, OnDestroy {
    add_new_serv_cap = Messages.SER_ADD_NEW_SER_CAP;
    est_duration_cap = Messages.SER_EST_DURATION_CAP;
    min_cap = Messages.SER_MIN_CAP;
    price_cap = Messages.SER_PRICE_CAP;
    isServiceBillable = false;
    api_loading = true;
    service_list: any = [];
    api_error = null;
    api_success = null;
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: 'Services'
        }
    ];
    domain: any;

    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        public router: Router) { }

    ngOnInit() {
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getDomainSubdomainSettings();
        this.getServices();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'checkinmanager->settings-services', 'classname': 'b-service',
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
        }
        else if (action === 'learnmore'){
            this.routerobj.navigate(['/provider/' + this.domain + '/checkinmanager->settings-services']);
        }
    }
    getServices() {
        this.api_loading = true;
        this.provider_services.getServicesList()
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
        this.router.navigate(['provider', 'settings', 'q-manager',
            'services', service.id], navigationExtras);
    }

    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'q-manager',
            'services', service.id]);
    }

    getDomainSubdomainSettings() {
        this.api_loading = true;
        const user_data = this.shared_functions.getitemfromSessionStorage('ynw-user');
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
}
