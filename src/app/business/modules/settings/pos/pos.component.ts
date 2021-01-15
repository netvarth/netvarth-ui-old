import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

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
      title: 'Jaldee Billing',
      url: '/provider/settings/pos'
    }
  ];
  // payment_settings: any = [];
  breadcrumbs = this.breadcrumbs_init;
  // payment_status = false;
  pos_status = false;
  // paytmVerified = false;
  // payuVerified = false;
  // isJaldeeAccount = false;
  // payment_statusstr = 'Off';
  pos_statusstr = 'Off';
  frm_public_self_cap = '';
  // accountActiveMsg = '';
  domain;
  nodiscountError = false;
  noitemError = false;
  itemError = '';
  discountError = '';
  discount_list;
  discount_count = 0;
  item_list;
  item_count = 0;
  // jaldee_pay_cap: string;
  breadcrumb_moreoptions: any = [];
  constructor(private router: Router,
    private routerobj: Router,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    // this.jaldee_pay_cap = Messages.JALDEE_PAY_MSG.replace('[customer]', this.customer_label);
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    // this.getpaymentDetails();
    this.getPOSSettings();
    this.getDiscounts();
    this.getitems();
  }

  getDiscounts() {
    this.provider_services.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.discount_count = this.discount_list.length;
        this.nodiscountError = true;
      },
        (error) => {
          this.discountError = error;
          this.nodiscountError = false;
        }
      );
  }

  getitems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.item_count = this.item_list.length;
        this.noitemError = true;
      },
        (error) => {
          this.itemError = error;
          this.noitemError = false;
        });
  }

  // getpaymentDetails() {
  //   this.provider_services.getPaymentSettings()
  //     .subscribe(
  //       data => {
  //         this.payment_settings = data;
  //         this.payment_status = (data['onlinePayment']) || false;
  //         this.paytmVerified = (data['payTmVerified']) || false;
  //         this.payuVerified = (data['payUVerified']) || false;
  //         this.isJaldeeAccount = (data['isJaldeeAccount']) || false;
  //         this.payment_statusstr = (this.payment_status) ? 'On' : 'Off';
  //         if (this.payment_settings.isJaldeeAccount) {
  //           this.accountActiveMsg = 'You are using Jaldee bank account';
  //         } else {
  //           this.accountActiveMsg = 'You are using your own bank account';
  //         }
  //       });
  // }
  // handle_paymentstatus(event) {
  //   let status;
  //   (event.checked) ? status = 'enable' : status = 'disable';
  //   this.provider_services.changeJaldeePayStatus(status).subscribe(data => {
  //     this.getpaymentDetails();
  //     this.snackbarService.openSnackBar('Jaldee Pay ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
  //   },
  //     error => {
  //       this.getpaymentDetails();
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
  // }
  gotoItems() {
    if (this.noitemError) {
      this.router.navigate(['provider', 'settings', 'pos', 'items']);
    } else {
      this.snackbarService.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoDiscounts() {
    if (this.nodiscountError) {
      this.router.navigate(['provider', 'settings', 'pos', 'discount']);
    } else {
      this.snackbarService.openSnackBar(this.discountError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoCoupons() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
  }
  // gotoTaxSettings() {
  //   this.router.navigate(['provider', 'settings', 'pos', 'taxsettings']);
  // }
  // gotoPaymentSettings() {
  //   this.router.navigate(['provider', 'settings', 'pos', 'paymentsettings']);
  // }
  handle_posStatus(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    this.provider_services.setProviderPOSStatus(value).subscribe(data => {
      this.snackbarService.openSnackBar('Billing settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.getPOSSettings();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getPOSSettings();
    });
  }
  getPOSSettings() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos_status = data['enablepos'];
      this.pos_statusstr = (this.pos_status) ? 'On' : 'Off';
    });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
}
}
