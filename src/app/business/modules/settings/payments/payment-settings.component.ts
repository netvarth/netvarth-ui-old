import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
    'selector': 'app-payment-settings',
    'templateUrl': './payment-settings.component.html'
})
export class PaymentSettingsComponent implements OnInit {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Jaldee Pay'
        }
    ];
    frm_public_self_cap = '';
    jaldee_pay_cap: string;
    payment_statusstr = 'Off';
    accountActiveMsg = '';
    customer_label = '';
    payment_settings: any = [];
    payment_status = false;
    paytmVerified = false;
    payuVerified = false;
    isJaldeeAccount = false;
    domain;
    breadcrumb_moreoptions: any = [];
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private groupService: GroupStorageService,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.jaldee_pay_cap = Messages.JALDEE_PAY_MSG.replace('[customer]', this.customer_label);
        this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.getpaymentDetails();
    }
    gotoTaxSettings() {
        this.router.navigate(['provider', 'settings', 'payments', 'taxsettings']);
    }
    gotoPaymentSettings() {
        this.router.navigate(['provider', 'settings', 'payments', 'paymentsettings']);
    }
    getpaymentDetails() {
        this.provider_services.getPaymentSettings()
            .subscribe(
                data => {
                    this.payment_settings = data;
                    this.payment_status = (data['onlinePayment']) || false;
                    this.paytmVerified = (data['payTmVerified']) || false;
                    this.payuVerified = (data['payUVerified']) || false;
                    this.isJaldeeAccount = (data['isJaldeeAccount']) || false;
                    this.payment_statusstr = (this.payment_status) ? 'On' : 'Off';
                    if (this.payment_settings.isJaldeeAccount) {
                        this.accountActiveMsg = 'You are using Jaldee bank account';
                    } else {
                        this.accountActiveMsg = 'You are using your own bank account';
                    }
                });
    }
    handle_paymentstatus(event) {
        let status;
        (event.checked) ? status = 'enable' : status = 'disable';
        this.provider_services.changeJaldeePayStatus(status).subscribe(data => {
            this.getpaymentDetails();
            this.snackbarService.openSnackBar('Jaldee Pay ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
        },
            error => {
                this.getpaymentDetails();
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/payments']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/payments->' + mod]);
    }
    redirecToJaldeepay() {
        this.router.navigate(['provider', 'settings']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/payments']);
    }
}
