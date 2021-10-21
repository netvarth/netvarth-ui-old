import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-livetrack-settings',
    templateUrl: './livetrack-settings.component.html'
})
export class LiveTrackSettingsComponent implements OnInit {
    breadcrumbs_init: ({ title: string; url: string; } | { title: string; url?: undefined; })[];

    livetrack_status: any;
    livetrack_statusstr: string;
    cust_domain_name = '';
    custs_name = '';
    domain;
    customer_label: any;
    customer_label_upper: any;
    constructor(private provider_services: ProviderServices,
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private router: Router) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.customer_label_upper = this.wordProcessor.firstToUpper(this.customer_label);
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getLiveTrackStatus();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.custs_name = Messages.CUSTOMERS_NAME.replace('[customer]', this.customer_label);
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
                this.livetrack_statusstr = (this.livetrack_status) ? 'On' : 'Off';
            });
    }
    handle_liveTracking(event) {
        const is_livetrack = (event.checked) ? 'Enable' : 'Disable';
        this.provider_services.setLivetrack(is_livetrack)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Locate your' + ' [customer] ' + is_livetrack + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getLiveTrackStatus();
                }
            );
    }
    redirecToGeneral() {
        this.router.navigate(['provider', 'settings', 'general']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/general->livetracking']);
    }
}
