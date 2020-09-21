import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';


@Component({
    selector: 'app-livetrack-settings',
    templateUrl: './livetrack-settings.component.html'
})
export class LiveTrackSettingsComponent implements OnInit {
    livetrack_status: any;
    livetrack_statusstr: string;
    cust_domain_name = '';
    custs_name = '';
    customer_label = this.shared_functions.getTerminologyTerm('customer');
    customer_label_upper = this.shared_functions.firstToUpper(this. customer_label);
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
            title: Messages.LOCATESETTINGS.replace('[customer]', this. customer_label_upper),
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    breadcrumb_moreoptions: any = [];
    domain;
    constructor(private provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private router: Router) {
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getLiveTrackStatus();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.custs_name = Messages.CUSTOMERS_NAME.replace('[customer]', this.customer_label);
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/general->livetracking']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/general->livetracking']);
    }
    getLiveTrackStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.livetrack_status = data.livetrack;
                // console.log(this.livetrack_status);
                this.livetrack_statusstr = (this.livetrack_status) ? 'On' : 'Off';
            });
    }
    handle_liveTracking(event) {
        const is_livetrack = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setLivetrack(is_livetrack)
            .subscribe(
                () => {
                    this.shared_functions.openSnackBar('Live tracking ' + is_livetrack + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                }
            );
    }
    redirecToGeneral() {
        this.router.navigate(['provider', 'settings' , 'general']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/general->livetracking']);
    }
}
