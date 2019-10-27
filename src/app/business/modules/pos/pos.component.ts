import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html'
})
export class POSComponent implements OnInit {
  customer_label = '';
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Billing/POS',
      url: '/provider/settings/pos'
    }
  ];
  payment_settings: any = [];
  breadcrumbs = this.breadcrumbs_init;
  payment_status = false;
  pos_status = false;
  paytmVerified = false;
  payuVerified = false;
  isJaldeeAccount = false;
  payment_statusstr = 'Off';
  pos_statusstr = 'Off';
  frm_public_self_cap = '';
  accountActiveMsg = '';
  domain;

  constructor(private router: Router,
    private shared_functions: SharedFunctions,
    private routerobj: Router,
    private provider_services: ProviderServices) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
    this.getpaymentDetails();
    this.getPOSSettings();
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
    let dataHolder = '';
    const is_check = (event.checked) ? true : false;
    dataHolder = '"onlinePayment": ' + is_check;
    if (this.payment_settings.hasOwnProperty('payTm')) {
      dataHolder += ', "payTm": ' + this.payment_settings['payTm'];
    }
    if (this.payment_settings.hasOwnProperty('payTmLinkedPhoneNumber')) {
      dataHolder += ', "payTmLinkedPhoneNumber": ' + '"' + this.payment_settings['payTmLinkedPhoneNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('dcOrCcOrNb')) {
      dataHolder += ', "dcOrCcOrNb": ' + this.payment_settings['dcOrCcOrNb'];
    }
    if (this.payment_settings.hasOwnProperty('panCardNumber')) {
      dataHolder += ', "panCardNumber": ' + '"' + this.payment_settings['panCardNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('bankAccountNumber')) {
      dataHolder += ', "bankAccountNumber": ' + '"' + this.payment_settings['bankAccountNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('bankName')) {
      dataHolder += ', "bankName": ' + '"' + this.payment_settings['bankName'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('ifscCode')) {
      dataHolder += ', "ifscCode": ' + '"' + this.payment_settings['ifscCode'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('nameOnPanCard')) {
      dataHolder += ', "nameOnPanCard": ' + '"' + this.payment_settings['nameOnPanCard'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('accountHolderName')) {
      dataHolder += ', "accountHolderName": ' + '"' + this.payment_settings['accountHolderName'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('branchCity')) {
      dataHolder += ', "branchCity": ' + '"' + this.payment_settings['branchCity'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('businessFilingStatus')) {
      dataHolder += ', "businessFilingStatus": ' + '"' + this.payment_settings['businessFilingStatus'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('accountType')) {
      dataHolder += ', "accountType": ' + '"' + this.payment_settings['accountType'] + '"';
    }
    const post_Data = '{' + dataHolder + '}';
    this.provider_services.setPaymentSettings(JSON.parse(post_Data))
      .subscribe(
        () => {
          this.getpaymentDetails();
          const status = (is_check) ? 'enabled' : 'disabled';
          this.shared_functions.openSnackBar('Jaldee Pay ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
        },
        error => {
          this.getpaymentDetails();
        }
      );
  }
  gotoItems() {
    this.router.navigate(['provider', 'settings', 'pos', 'items']);
  }
  gotoDiscounts() {
    this.router.navigate(['provider', 'settings', 'pos', 'discounts']);
  }
  gotoCoupons() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupons']);
  }
  gotoTaxSettings() {
    this.router.navigate(['provider', 'settings', 'pos', 'taxsettings']);
  }
  gotoPaymentSettings() {
    this.router.navigate(['provider', 'settings', 'pos', 'paymentsettings']);
  }
  handle_posStatus(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    this.provider_services.setProviderPOSStatus(value).subscribe(data => {
      this.shared_functions.openSnackBar('POS settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.getPOSSettings();
    }, (error) => {
      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getPOSSettings();
    });
  }
  getPOSSettings() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos_status = data['enablepos'];
      this.pos_statusstr = (this.pos_status) ? 'On' : 'Off';
    });
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
}
