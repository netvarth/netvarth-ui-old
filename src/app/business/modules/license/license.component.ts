import { Component, HostListener, Inject, OnInit, OnDestroy } from '@angular/core';
import { ProviderAuditLogComponent } from '../../../ynw_provider/components/provider-auditlogs/provider-auditlogs.component';
import { UpgradeLicenseComponent } from '../../../ynw_provider/components/upgrade-license/upgrade-license.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';

import * as moment from 'moment';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
// import { constants } from 'fs';
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
    grandTotal;
    netTotal;
    appliedDiscount;
    showAmounts = true;
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
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    tooltipcls = projectConstants.TOOLTIP_CLS;
    reload_adword_api = { status: true };
    type = null;
    loading = true;
    loadingTb = false;
    upgradablepackages = [];
    addonTooltip = '';
    breadcrumb_moreoptions = {
        'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
    };
    upgradedialogRef;
    active_user;
    lichistorydialogRef;
    licenseusedialogRef;
    invoicedialogRef;
    licenseupgardedialogRef;
    upgradesubscriptdialogRef;
    domain;
    statusOfLicense = 0;
    licensePlan;
    annualMonthAmount;
    pendingStatus = 0;
    effectivedate: any = [];
    changelicence = false;
    annualdiscount: any = [];
    licenseDisplayName;
    account_type;
    temp1: any;
    refnumber: any;
    corpSettings: any;
    height: number;
    adon_list: any;
    addon_metric: any = [];
    constructor(private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        private lStorageService: LocalStorageService,
        private routerobj: Router,
        public _sanitizer: DomSanitizer,
        @Inject(DOCUMENT) public document) {
        this.onResize();
        this.license_tooltip = this.wordProcessor.getProjectMesssages('LICENSE_TOOLTIP');
        this.route.params.subscribe((data) => {
            this.type = data.type;
            if (this.type === 'upgrade') {
                const ynw_user = this.groupService.getitemFromGroupStorage('ynw-user');
                this.current_lic = ynw_user.accountLicenseDetails.accountLicense.displayName;
                this.showupgradeLicense();
            }
        });
    }
    ngOnInit() {
        this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.account_type = this.active_user.accountType;
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.loading = true;
        this.addonTooltip = this.wordProcessor.getProjectMesssages('ADDON_TOOLTIP');
        // this.periodicTooltip = this.wordProcessor.getProjectMesssages('PERIOD_TOOLTIP');
        this.getLicenseCorpSettings();
        this.getLicenseDetails();
        this.getLicenseUsage();
        this.getInvoiceList();
        this.getSubscriptionDetail();
        this.getUpgradablePackages();
        this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
        this.loading = false;
        // this.getAnnualDiscountPercentage();
        this.getbillCycle();
        this.getUpgradableaddonPackages();
    }
    getLicenseCorpSettings() {
        this.provider_servicesobj.getLicenseCorpSettings().subscribe(
            (data: any) => {
                this.corpSettings = data;
            }
        );
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
        if (this.licenseupgardedialogRef) {
            this.licenseupgardedialogRef.close();
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
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/license']);
    }
    getLicenseDetails(call_type = 'init') {
        this.license_message = '';
        this.provider_servicesobj.getLicenseDetails()
            .subscribe(data => {
                this.currentlicense_details = data;
                console.log(this.currentlicense_details);
                if (this.currentlicense_details.addons) {
                    this.adon_list = this.currentlicense_details.addons;
                }
                this.current_lic = this.currentlicense_details.accountLicense.displayName;
                const ynw_user = this.groupService.getitemFromGroupStorage('ynw-user');
                ynw_user.accountLicenseDetails = this.currentlicense_details;
                this.groupService.setitemToGroupStorage('ynw-user', ynw_user);
                if (data['accountLicense'] && data['accountLicense']['type'] === 'Trial') {
                    const start_date = (data['accountLicense']['dateApplied']) ? moment(data['accountLicense']['dateApplied']) : null;
                    const end_date = (data['accountLicense']['expiryDate']) ? moment(data['accountLicense']['expiryDate']) : null;
                    let valid_till = 0;
                    if (start_date != null && end_date != null) {
                        valid_till = end_date.diff(start_date, 'days');
                        valid_till = (valid_till < 0) ? 0 : valid_till;
                    }
                    this.license_message = ' till ' + end_date.format('ll');
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
                if (this.upgradablepackages.length > 0) {
                    this.height = 170;
                } else {
                    this.height = 140;
                }
            });
    }
    showupgradeLicense() {
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        if (this.corpSettings && this.corpSettings.isCentralised) {
            this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        } else {
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
                    this.getSubscriptionDetail();
                    this.getLicenseMetaData();
                }
                this.goBacktoPrev();
            });
        }
    }
    goBacktoPrev() {
        const retcheck = this.lStorageService.getitemfromLocalStorage('lic_ret');
        if (retcheck !== undefined && retcheck !== null) {
            setTimeout(() => {
                this.lStorageService.removeitemfromLocalStorage('lic_ret');
                const retcheckarr = retcheck.split('/');
                this.router.navigate(retcheckarr);
            }, 100);
        }
    }
    showLicenceHistory() {
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
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    showLicenseUsage() {
        this.router.navigate(['provider', 'license', 'licenseusage']);
    }
    getInvoiceList() {
        this.provider_servicesobj.getInvoicesWithStatus()
            .subscribe(
                data => {
                    this.invoices = data;
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    showInvoiceStatus() {

        this.router.navigate(['provider', 'license', 'invoicestatus']);

    }
    getUpgradableaddonPackages() {
        this.provider_servicesobj.getUpgradableAddonPackages()
            .subscribe((data: any) => {
                this.addon_metric = data;
            });
    }
    getSubscriptionDetail() {
        this.statusOfLicense = 0;
        this.provider_servicesobj.getLicenseSubscription()
            .subscribe(
                data => {
                    this.license_sub = data;
                    this.licensePlan = this.license_sub.licSubType;
                    this.licenseDisplayName = this.license_sub.licSubTypeDisplayName;
                    if (this.license_sub.subscriptionTo) {
                        this.statusOfLicense = this.license_sub.subscriptionTo;
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                },
                () => {
                    this.getAnnualDiscountPercentage().then(
                        (data) => {
                            this.annualdiscount = data;
                            this.getLicenseMetaData();
                        },
                        (error) => {
                        }
                    );
                }
            );
    }
    getLicenseMetaData() {
        // this.provider_servicesobj.getLicenseMetadata()
        //     .subscribe(
        //         data => {
        this.all_license_metadata = this.lStorageService.getitemfromLocalStorage('license-metadata');
        // this.all_license_metadata = data;
        // const license_meta = {};
        this.license_upgarde_sub = {};
        for (const meta of this.all_license_metadata) {
            if (this.currentlicense_details && this.currentlicense_details['accountLicense']) {
                if (meta['pkgId'] === this.currentlicense_details['accountLicense']['licPkgOrAddonId']) {
                    this.grandTotal = meta['price'] * 12;
                    this.appliedDiscount = this.grandTotal * (this.annualdiscount / 100);
                    this.netTotal = this.grandTotal - this.appliedDiscount;
                    if (meta['type'] === 'Trial' || meta['pkgId'] === 1) {
                        this.showAmounts = false;
                    } else {
                        this.showAmounts = true;
                    }
                    return false;
                }
            }
        }
        //     },
        //     error => {
        //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     }
        // );
    }
    updateSubscription(value) {
        this.provider_servicesobj.changeLicenseSubscription(value)
            .subscribe(
                () => {
                    this.getLicenseDetails('update');
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    goPaymentHistory() {
        this.router.navigate(['provider', 'license', 'payment', 'history']);
    }
    showUnpaidInvoice() {
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        // if (this.corpSettings && this.corpSettings.isCentralised) {
        //     this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        // } else {
        this.loadingTb = true;
        if (this.invoices.length === 1) {
            this.getInvoicePay(this.invoices[0], 1);
        } else {
            this.unpaid_invoice_show = (this.unpaid_invoice_show) ? 0 : 1;
        }
        this.loadingTb = false;
        // }
    }
    getInvoice(invoice) {
        const invoiceJson = JSON.stringify(invoice);
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        if (this.corpSettings && this.corpSettings.isCentralised) {
            this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    invoice: invoiceJson,
                    source: 'license-home'
                }
            };
            this.router.navigate(['provider', 'license', 'Statements'], navigationExtras);

        }
    }

    getInvoicePay(invoice, payMentShow) {
        const invoiceJson = JSON.stringify(invoice);
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        // if (this.corpSettings && this.corpSettings.isCentralised) {
        //     this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        // } else {
        this.temp1 = JSON.parse(invoiceJson);
        const navigationExtras: NavigationExtras = {
            queryParams: {
                invoice: invoiceJson,
                payMent: payMentShow,
                source: 'license-home',
            },
            // skipLocationChange: true,

        };
        this.router.navigate(['provider', 'license', 'Statements'], navigationExtras);
        // }
    }
    openAnnualSection() {
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        if (this.corpSettings && this.corpSettings.isCentralised) {
            this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        } else {
            this.changelicence = true;
        }
    }
    getbillCycle() {
        this.effectivedate = this.provider_servicesobj.getbillCycle()
            .subscribe(data => {
                this.effectivedate = data;
            });
    }
    getAnnualDiscountPercentage() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_servicesobj.getAnnualDiscountPercentage()
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }

    doUpgradeSubcription(value) {
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        if (this.corpSettings && this.corpSettings.isCentralised) {
            this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        } else {
            this.upgradesubscriptdialogRef = this.dialog.open(ConfirmBoxComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                    'message': 'Are you sure you want to change the subscription?'
                }
            });
            this.upgradesubscriptdialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.updateSubscription(value);
                }
                this.changelicence = false;
            });
        }
    }

    cancelAssignServices() {
        this.changelicence = false;
    }

    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/license->' + mod]);
    }
    makePayment(invoice) {
        // if (this.account_type === 'BRANCH' || this.account_type === 'BRANCH_SP') {
        if (this.corpSettings && this.corpSettings.isCentralised) {
            this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
        } else {
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
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('PAYMENT_REDIRECT'));
                                setTimeout(() => {
                                    this.document.getElementById('payuform').submit();
                                }, 2000);
                            } else {
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                            }
                        },
                        error => {
                            this.payment_loading = false;
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        }
                    );
            }
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
    gotoStatements() {
        this.router.navigate(['provider', 'license', 'Statements']);
    }
}
