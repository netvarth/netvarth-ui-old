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
            url: '/provider/settings/donationmanager',
            title: 'Donation Manager'
        },
        {
            url: '/provider/settings/donationmanager/causes',
            title: 'Causes'
        }
    ];
    domain: any;
    trackStatus: string;
    cause_list: any = [];
    causes_list: any;

    constructor(private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private routerobj: Router,
        public router: Router) { }

    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getDomainSubdomainSettings();
        this.getServices();
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'donationmanager->causes', 'classname': 'b-service',
            'actions': [{ 'title': 'Add Cause', 'type': 'addcause' },
            { 'title': 'Help', 'type': 'learnmore' }]
        };
    }

    ngOnDestroy() {
    }
    performActions(action) {
        if (action === 'addcause') {
            this.router.navigate(['provider', 'settings', 'donationmanager', 'add']);
        } else if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/donationmanager->causes']);
        }
    }
    getServices() {
        this.api_loading = true;
        const filter = { 'scope-eq': 'account' };
        this.provider_services.getDonationServices()
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
        this.router.navigate(['provider', 'settings', 'donationmanager', service.id], navigationExtras);
    }

    goServiceDetail(service) {
        this.router.navigate(['provider', 'settings', 'donationmanager', service.id]);
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
}
