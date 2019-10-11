import { Component, HostListener, Inject, OnInit, OnDestroy } from '@angular/core';
import { ProviderLicenceInvoiceDetailComponent } from '../../../ynw_provider/components/provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { ProviderLicenseUsageComponent } from '../../../ynw_provider/components/provider-license-usage/provider-license-usage.component';
import { ProviderAuditLogComponent } from '../../../ynw_provider/components/provider-auditlogs/provider-auditlogs.component';
import { UpgradeLicenseComponent } from '../../../ynw_provider/components/upgrade-license/upgrade-license.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

import * as moment from 'moment';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.css']
})

export class LicenseComponent implements OnInit, OnDestroy {
    date_cap = Messages.DATE_COL_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    invoice_cap = Messages.INVOICE_CAP;
    history_cap = Messages.HISTORY_HOME_CAP;
    payment_cap = Messages.PAYMENT_CAP;
    current_license = Messages.CURRENT_PACKAGE_CAP;
    upgrade_license = Messages.UPGRADE_LICENSE;
    license_change = Messages.LICENSE_CHANGE;
    licnse_usage = Messages.LICENSE_USAGE;
    subscription_cap = Messages.SUBSCRIPTION_CAP;
    current_enroll = Messages.CURRENTLY_ENROLLED;
    due_amt = Messages.DUE_AMT_CAP;
    period_cap = Messages.PERIOD_CAP;
    addon_cap = Messages.ADD_ON_CAP;
    no_addon_cap = Messages.NO_ADDON_CAP;
    pay_button = Messages.PAY_BUTTON;
    due_date_cap = Messages.DUE_DATE_CAP;
    learn_more = Messages.LEARN_MORE_CAP;
    currentlicense_details: any = [];
    metrics: any = [];
    invoices: any = [];
    license_sub = null;
    all_license_metadata: any = [];
    license_upgarde_sub = {};
    license_tooltip = '';
    hide_invoiceperiod = false;
    current_lic;
    frm_lic_cap = Messages.FRM_LEVEL_PROVIDER_LICE_MSG;
    frm_addon_cap = Messages.FRM_LEVEL_PROVIDER_LIC_ADDON_MSG;
    breadcrumbs = [
        {
            title: 'License & Invoice'
        }
    ];
    pay_data = {
        amount: 0,
        paymentMode: 'DC', // 'null', changes as per request from Manikandan
        uuid: null,
        purpose: null
    };
    payment_loading = false;
    payment_popup = null;
    isCheckin;
    license_message = '';
    unpaid_invoice_show = 0;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    tooltipcls = projectConstants.TOOLTIP_CLS;
    reload_adword_api = { status: true };
    type = null;
    loading = true;
    loadingTb = false;
    upgradablepackages = [];
    addonTooltip = '';
    breadcrumb_moreoptions = {
           'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]};
    upgradedialogRef;
    active_user;
    lichistorydialogRef;
    licenseusedialogRef;
    invoicedialogRef;
    upgradesubscriptdialogRef;
    domain;
    constructor(private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions,
        private route: ActivatedRoute,
        private shared_functions: SharedFunctions,
        private routerobj: Router,
        public _sanitizer: DomSanitizer,
        @Inject(DOCUMENT) public document) {
        this.onResize();
        this.license_tooltip = this.sharedfunctionObj.getProjectMesssages('LICENSE_TOOLTIP');
        this.route.params.subscribe((data) => {
            this.type = data.type;
            if (this.type === 'upgrade') {
                const ynw_user = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
                this.current_lic = ynw_user.accountLicenseDetails.accountLicense.displayName;
                this.showupgradeLicense();
            }
        });
    }
    ngOnInit() {
        this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = user.sector;
        this.loading = true;
        this.addonTooltip = this.sharedfunctionObj.getProjectMesssages('ADDON_TOOLTIP');
        // this.periodicTooltip = this.sharedfunctionObj.getProjectMesssages('PERIOD_TOOLTIP');
        this.getLicenseDetails();
        this.getLicenseUsage();
        this.getInvoiceList();
        this.getSubscriptionDetail();
        this.getUpgradablePackages();
        this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
        this.loading = false;
    }
    ngOnDestroy() {
        if (this.upgradedialogRef) {
            this.upgradedialogRef.close();
        }
        if (this.lichistorydialogRef) {
            this.lichistorydialogRef.close();
        }
        if (this.licenseusedialogRef) {
            this.licenseusedialogRef.close();
        }
        if (this.invoicedialogRef) {
            this.invoicedialogRef.close();
        }
        if (this.upgradesubscriptdialogRef) {
            this.upgradesubscriptdialogRef.close();
        }
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.innerWidth <= 400) {
            this.hide_invoiceperiod = true;
        } else {
            this.hide_invoiceperiod = false;
        }
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/license']);
        }
    }
    getLicenseDetails(call_type = 'init') {
        this.license_message = '';
        this.provider_servicesobj.getLicenseDetails()
            .subscribe(data => {
                this.currentlicense_details = data;
                this.current_lic = this.currentlicense_details.accountLicense.displayName;
                const ynw_user = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
                ynw_user.accountLicenseDetails = this.currentlicense_details;
                this.sharedfunctionObj.setitemonLocalStorage('ynw-user', ynw_user);
                if (data['accountLicense'] && data['accountLicense']['type'] === 'Trial') {
                    const start_date = (data['accountLicense']['dateApplied']) ? moment(data['accountLicense']['dateApplied']) : null;
                    const end_date = (data['accountLicense']['expiryDate']) ? moment(data['accountLicense']['expiryDate']) : null;
                    let valid_till = 0;
                    if (start_date != null && end_date != null) {
                        valid_till = end_date.diff(start_date, 'days');
                        valid_till = (valid_till < 0) ? 0 : valid_till;
                    }
                    this.license_message = valid_till + ' day trial, till ' + end_date.format('ll');
                }
            });
        if (call_type === 'update') {
            this.getLicenseUsage();
            this.getUpgradablePackages();
            this.getInvoiceList();
            this.getSubscriptionDetail();
            this.reload_adword_api = { status: true };
        }
    }
    getUpgradablePackages() {
        this.provider_servicesobj.getUpgradableLicensePackages()
            .subscribe((data: any) => {
                this.upgradablepackages = data;
            });
    }
    showupgradeLicense() {
        this.upgradedialogRef = this.dialog.open(UpgradeLicenseComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                type: 'upgrade',
                current_license_pkg: this.current_lic
            }
        });
        this.upgradedialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
                this.getLicenseDetails('update');
            }
            this.goBacktoPrev();
        });
    }
    goBacktoPrev() {
        const retcheck = this.sharedfunctionObj.getitemfromLocalStorage('lic_ret');
        if (retcheck !== undefined && retcheck !== null) {
            setTimeout(() => {
                this.sharedfunctionObj.removeitemfromLocalStorage('lic_ret');
                const retcheckarr = retcheck.split('/');
                this.router.navigate(retcheckarr);
            }, 100);
        }
    }
    /*dodelete(addon) {
      if (!addon) {
        return false;
      }
      const add_being_deleted = addon.name;
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        data: {
          'message' : 'Are you sure you wanted to delete the add on \'' + add_being_deleted + '\'?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.deleteaddons(addon.licPkgOrAddonId);
        }
      });
    }
    deleteaddons(itemid) {
      this.provider_servicesobj.deleteAddonPackage(itemid)
       .subscribe(
          data => {
            this.getLicenseDetails();
          },
          error => {
          }
        );
    }*/
    showLicenceHistory() {
        // this.router.navigate(['provider', 'settings', 'license', 'auditlog']);
        this.lichistorydialogRef = this.dialog.open(ProviderAuditLogComponent, {
            width: '50%',
            data: {
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.lichistorydialogRef.afterClosed().subscribe(() => {
        });
    }
    getLicenseUsage() {
        this.provider_servicesobj.getLicenseUsage()
            .subscribe(
                data => {
                    this.metrics = data;
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    showLicenseUsage() {
        this.licenseusedialogRef = this.dialog.open(ProviderLicenseUsageComponent, {
            width: '50%',
            data: {
                metrics: this.metrics
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.licenseusedialogRef.afterClosed().subscribe(() => {
        });
    }
    getInvoiceList() {
        this.provider_servicesobj.getInvoicesWithStatus()
            .subscribe(
                data => {
                    this.invoices = data;
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getSubscriptionDetail() {
        this.provider_servicesobj.getLicenseSubscription()
            .subscribe(
                data => {
                    this.license_sub = data;
                    this.getLicenseMetaData();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    getLicenseMetaData() {
        this.provider_servicesobj.getLicenseMetadata()
            .subscribe(
                data => {
                    this.all_license_metadata = data;
                    const license_meta = {};
                    this.license_upgarde_sub = {};
                    for (const meta of this.all_license_metadata) {
                        if (this.currentlicense_details && this.currentlicense_details['accountLicense']) {
                            if (meta['pkgId'] === this.currentlicense_details['accountLicense']['licPkgOrAddonId']) {
                                license_meta['price'] = meta['price'] || 0;
                                license_meta['discPercFor12Months'] = meta['discPercFor12Months'] || 0;
                                license_meta['discPercFor6Months'] = meta['discPercFor6Months'] || 0;
                                license_meta['current_sub'] = (this.license_sub === 'Monthly') ? 'month' : 'year';
                                if (license_meta['current_sub'] === 'year') {
                                    const year_amount = (license_meta['price'] * 12);
                                    license_meta['price'] = year_amount - (year_amount * license_meta['discPercFor12Months'] / 100);
                                }
                                license_meta['next_sub'] = null;
                                if (license_meta['current_sub'] === 'month' &&
                                    (license_meta['price'] !== 0 || (license_meta['price'] === 0 && license_meta['discPercFor12Months'] === 100))) {
                                    const year_amount = (license_meta['price'] * 12);
                                    license_meta['next_sub'] = [
                                        {
                                            'amount': year_amount - (year_amount * license_meta['discPercFor12Months'] / 100),
                                            'discount_per': license_meta['discPercFor12Months'],
                                            'type': 'year',
                                            'value': 'Annual'
                                        }
                                    ];
                                }
                                this.license_upgarde_sub = license_meta;
                            }
                        }
                    }
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    updateSubscription(value) {
        this.provider_servicesobj.changeLicenseSubscription(value)
            .subscribe(
                () => {
                    this.getLicenseDetails('update');
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    goPaymentHistory() {
        this.router.navigate(['provider', 'license', 'payment', 'history']);
    }
    showUnpaidInvoice() {
        this.loadingTb = true;
        if (this.invoices.length === 1) {
            this.getInvoicePay(this.invoices[0], 1);
        } else {
            this.unpaid_invoice_show = (this.unpaid_invoice_show) ? 0 : 1;
        }
        this.loadingTb = false;
    }
    getInvoice(invoice) {
        this.invoicedialogRef = this.dialog.open(ProviderLicenceInvoiceDetailComponent, {
            width: '50%',
            data: {
                invoice: invoice,
                source: 'license-home'
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.invoicedialogRef.afterClosed().subscribe(() => {
        });
    }
    getInvoicePay(invoice, payMentShow) {
        this.invoicedialogRef = this.dialog.open(ProviderLicenceInvoiceDetailComponent, {
            width: '50%',
            data: {
                invoice: invoice,
                payMent: payMentShow,
                source: 'license-home'
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.invoicedialogRef.afterClosed().subscribe(() => {
        });
    }

    doUpgradeSubcription(value) {
        this.upgradesubscriptdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': 'Are you sure you wanted to change the subscription ?'
            }
        });
        this.upgradesubscriptdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateSubscription(value);
            }
        });
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/license->' + mod]);
        // this.routerobj.navigate(['/provider/learnmore/license->' + mod]);
        // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
        // this.sharedfunctionObj.sendMessage(pdata);
    }
    // getMode(mod) {
    //   let moreOptions = {};
    //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'license', 'subKey': mod };
    //   return moreOptions;
    // }
    makePayment(invoice) {
        this.pay_data.amount = invoice.amount;
        this.pay_data.uuid = invoice.ynwUuid;
        this.pay_data.purpose = 'subscriptionLicenseInvoicePayment';
        if (this.pay_data.uuid && this.pay_data.amount &&
            this.pay_data.amount !== 0 && this.pay_data.paymentMode) {

            this.payment_loading = true;

            this.provider_servicesobj.providerPayment(this.pay_data)
                .subscribe(
                    data => {
                        if (data['response']) {
                            this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
                            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('PAYMENT_REDIRECT'));
                            setTimeout(() => {
                                this.document.getElementById('payuform').submit();
                            }, 2000);
                        } else {
                            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                        }
                    },
                    error => {
                        this.payment_loading = false;
                        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
        }
    }

    gotoAddOns() {
        this.router.navigate(['provider', 'license', 'addons']);
    }
    gotoJaldeeKeywords() {
        this.router.navigate(['provider', 'license', 'keywords']);
    }
    gotoPaymentHistory() {
        this.router.navigate(['provider', 'license', 'payment', 'history']);
    }
}
