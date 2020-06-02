import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

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
    constructor(private router: Router,
        private provider_services: ProviderServices,
        private shared_services: SharedServices,
        private shared_functions: SharedFunctions) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.jaldee_pay_cap = Messages.JALDEE_PAY_MSG.replace('[customer]', this.customer_label);
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
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
            this.shared_functions.openSnackBar('Jaldee Pay ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
        },
            error => {
                this.getpaymentDetails();
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/payments->' + mod]);
      }
}
