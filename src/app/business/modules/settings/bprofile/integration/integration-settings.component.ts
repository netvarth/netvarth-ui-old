import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
@Component({
    'selector': 'app-integration-settings',
    'templateUrl': './integration-settings.component.html'
})
export class IntegrationSettingsComponent implements OnInit {
    walkinConsumer_status: any;
    walkinConsumer_statusstr = 'Off';
    jaldeeintegration_status: any;
    jaldeeintegration_statusstr: string;
    accountActiveMsg = '';
    cust_domain_name = '';
    customer_label = '';
    domain;
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.getJaldeeIntegrationSettings();
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    }
    getJaldeeIntegrationSettings() {
        this.provider_services.getJaldeeIntegrationSettings().subscribe(
            (data: any) => {
                this.walkinConsumer_status = data.walkinConsumerBecomesJdCons;
                this.walkinConsumer_statusstr = (this.walkinConsumer_status) ? 'On' : 'Off';
            }
        );
    }
    handle_jaldeeWalkinConsumer(event) {
        const is_check = (event.checked) ? 'Enable' : 'Disable';
        const data = {
            'walkinConsumerBecomesJdCons': event.checked
        };
        this.provider_services.setJaldeeIntegration(data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Integration of walk-ins with Jaldee.com ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
                    this.getJaldeeIntegrationSettings();
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getJaldeeIntegrationSettings();
                }
            );
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
    }
    redirecToProfile() {
        this.router.navigate(['provider', 'settings']);
    }
}
