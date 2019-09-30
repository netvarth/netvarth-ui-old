import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    selector: 'app-provider-paymentsettings',
    templateUrl: './provider-payment-settings.component.html',
    styleUrls: ['./provider-payment-settings.component.css']
})

export class ProviderPaymentSettingsComponent implements OnInit {


    jaldee_account_cap = Messages.PAY_SET_JALDEE_ACCOUNT_CAP;
    my_own_account_cap = Messages.PAY_SET_MY_OWN_ACCOUNT_CAP;
    pay_if_mail_verified_cap = Messages.PAY_SET_ONLY_IF_MAIL_VERIFIED_CAP;
    go_to_mail_settings_cap = Messages.PAY_SET_GO_TO_EMAIL_SET_CAP;
    revisit_this_page_cap = Messages.PAY_SET_REVISIT_THIS_PAGE_CAP;
    pay_tm_cap = Messages.PAY_SET_PAYTM_CAP;
    verified_cap = Messages.PAY_SET_VERIFIED_CAP;
    not_verified_cap = Messages.PAY_SET_NOT_VERIFIED_CAP;
    enter_mob_no_cap = Messages.PAY_SET_ENTER_MOB_NO_CAP;
    cc_dc_netbanking_cap = Messages.PAY_SET_CC_DC_NETBANKING_CAP;
    pan_card_number_cap = Messages.PAY_SET_PAN_CARD_NO_CAP;
    name_on_pan_card_cap = Messages.PAY_SET_NAME_ON_PAN_CAP;
    account_holder_name_cap = Messages.PAY_SET_ACCNT_HOLDER_NAME_CAP;
    bank_account_number_cap = Messages.PAY_SET_BANK_ACCNT_NO_CAP;
    bank_name_cap = Messages.PAY_SET_BANK_NAME_CAP;
    ifsc_code_cap = Messages.PAY_SET_IFSC_CAODE_CAP;
    branch_name_cap = Messages.PAY_SET_BRANCH_NAME_CAP;
    business_filing_status_cap = Messages.PAY_SET_BUSINESS_FILING_STATUS_CAP;
    select_cap = Messages.PAY_SET_SELECT_CAP;
    proprietorship_cap = Messages.PAY_SET_PROPRIETORSHIP_CAP;
    individual_cap = Messages.PAY_SET_INDIVIDUAL_CAP;
    partnership_cap = Messages.PAY_SET_PARTNERSHIP_CAP;
    pvt_ltd_cap = Messages.PAY_SET_PRIVATE_LTD_CAP;
    public_ltd_cap = Messages.PAY_SET_PUBLIC_LTD_CAP;
    llp_cap = Messages.PAY_SET_LLP_CAP;
    trust_cap = Messages.PAY_SET_TRUST_CAP;
    societies_cap = Messages.PAY_SET_SOCIETIES_CAP;
    account_type_cap = Messages.PAY_SET_ACCOUNT_TYPE_CAP;
    current_cap = Messages.PAY_SET_CURRENT_CAP;
    savings_cap = Messages.PAY_SET_SAVINGS_CAP;
    cancel_edit_cap = Messages.PAY_SET_CANCEL_EDIT_CAP;
    save_settings_cap = Messages.PAY_SET_SAVE_SETTINGS_CAP;
    change_pay_settings_cap = Messages.PAY_SET_CHANGE_PAYMENT_SETTINGS_CAP;
    save_btn_cap = Messages.SAVE_BTN;
    gst_no_cap = Messages.PAY_SET_GST_NUMBER_CAP;
    tax_percentage_cap = Messages.PAY_SET_TAX_PER_CAP;
    update_tax_cap = Messages.PAY_SET_UPDATE_TAX_CAP;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;

    paytmenabled;
    paytmmobile;
    paytmMerchantKey;
    paytmMerchantId;
    paytmWebsiteApp;
    paytmWebsiteWeb;
    paytmIndustryType;
    ccenabled;
    pannumber;
    panname;
    bankacname;
    bankacnumber;
    bankname;
    bankifsc;
    bankbranch;
    bankfiling;
    bankactype;
    paystatus = false;
    saveEnabled = true;
    savetaxEnabled = true;
    paySettings: any = [];
    taxDetails: any = [];
    showError: any = [];
    errorExist = false;
    taxpercentage;
    gstnumber;
    paytmverified = false;
    payuverified = false;
    tabid = 0;
    emailidVerified = false;
    profileQueryExecuted = false;
    ineditMode = true;
    isJaldeeAccount: Boolean = true;
    optJaldeeAccount;
    maxcnt100 = projectConstants.VALIDATOR_MAX100;
    maxcnt15 = 15;
    maxcnt11 = 11;
    activeLicPkg;
    disableMyAcc = false;
    breadcrumb_moreoptions: any = [];
    customer_label = '';
    payment_set_cap = '';
    isCheckin;
    active_user;
    tax_st_cap = Messages.FRM_LEVEL_TAX_SETTINGS_MSG;

    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Billing/POS',
            url: '/provider/settings/pos'
        },
        {
            title: 'Payment'
        }
    ];
    /**
     * Constructor
     * @param provider_services ProviderServices
     * @param shared_functions SharedFunctions
     * @param router Router
     * @param activated_route ActivatedRoute
     */
    constructor(
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute

    ) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.activated_route.params.subscribe(params => {
            this.tabid = (params.id) ? params.id : 0;
        });
    }
    ngOnInit() {
        this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.resetApi();
        this.getPaymentSettings(2);
        this.getTaxpercentage();
        this.getProviderProfile();
        this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'payment' };
        this.activeLicPkg = this.shared_functions.getitemfromLocalStorage('ynw-user').accountLicenseDetails.accountLicense.name;
        // if (this.activeLicPkg === 'Basic' || this.activeLicPkg === 'Bronze' || this.activeLicPkg === 'Silver') {
        //     this.disableMyAcc = true;
        // }
        this.payment_set_cap = Messages.FRM_LEVEL_PAYMENT_SETTINGS_MSG.replace('[customer]', this.customer_label);
        this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
    }
    /**
     * Function to call the Learn More Page
     * @param mod id of the section
     * @param e event
     */
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/learnmore/payment']);
        // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
        // this.shared_functions.sendMessage(pdata);
    }
    /**
     * Get target for the learnmore
     * @param mod id of the section
     */
    // getMode(mod) {
    //     let moreOptions = {};
    //     moreOptions = { 'show_learnmore': true, 'scrollKey': 'paymentsettings', 'subKey': mod };
    //     return moreOptions;
    // }
    /**
    * Clear all fields
    * @param code field name
    */
    resetApi(code?) {
        this.errorExist = false;
        if (code !== undefined) {
            this.showError[code] = { status: false, msg: '' };
        } else {
            this.showError = {
                'paytmmobile': { status: false, msg: '' },
                'paytmMerchantId': { status: false, msg: '' },
                'paytmMerchantKey': { status: false, msg: '' },
                'paytmIndustryType': { status: false, msg: '' },
                'paytmWebsiteWeb': { status: false, msg: '' },
                'paytmWebsiteApp': { status: false, msg: '' },
                'pannumber': { status: false, msg: '' },
                'panname': { status: false, msg: '' },
                'bankacname': { status: false, msg: '' },
                'bankacnumber': { status: false, msg: '' },
                'bankname': { status: false, msg: '' },
                'bankifsc': { status: false, msg: '' },
                'bankbranch': { status: false, msg: '' },
                'bankfiling': { status: false, msg: '' },
                'bankactype': { status: false, msg: '' },
                'taxpercentage': { status: false, msg: '' },
                'gstnumber': { status: false, msg: '' }
            };
        }
    }
    resetInfo() {
        this.resetApi();
        this.initPaymentSettings(this.paySettings, 1);
    }
    initPaymentSettings(paySettings, type) {
        this.paystatus = paySettings.onlinePayment || false;
        this.paytmmobile = paySettings.payTmLinkedPhoneNumber || '';
        this.paytmMerchantKey = paySettings.paytmMerchantKey || '';
        this.paytmWebsiteWeb = paySettings.paytmWebsiteWeb || '';
        this.paytmWebsiteApp = paySettings.paytmWebsiteApp || '';
        this.paytmIndustryType = paySettings.paytmIndustryType || '';
        this.paytmMerchantId = paySettings.paytmMerchantId || '';
        this.pannumber = paySettings.panCardNumber || '';
        this.panname = paySettings.nameOnPanCard || '';
        this.bankacname = paySettings.accountHolderName || '';
        this.bankacnumber = paySettings.bankAccountNumber || '';
        this.bankname = paySettings.bankName || '';
        this.bankifsc = paySettings.ifscCode || '';
        this.bankbranch = paySettings.branchCity || '';
        this.bankfiling = paySettings.businessFilingStatus || '';
        this.bankactype = paySettings.accountType || '';
        this.paytmverified = paySettings.payTmVerified || false;
        this.payuverified = paySettings.payUVerified || false;
        if (type === 0) {
            this.paytmenabled = paySettings.payTm || false;
            this.ccenabled = paySettings.dcOrCcOrNb || false;
            this.isJaldeeAccount = paySettings.isJaldeeAccount;
            this.optJaldeeAccount = (this.isJaldeeAccount) ? 'enable' : 'disable';
        }
    }
    /**
     * Get Payment Settings
     * @param showmsg for handling success messgaes
     */
    getPaymentSettings(showmsg) {
        this.provider_services.getPaymentSettings()
            .subscribe(data => {
                this.paySettings = data;
                this.initPaymentSettings(this.paySettings, 0);
            });
        if (showmsg === 1) {
            this.tabid = 0;
            let showmsgs = '';
            let panelclass = '';
            let params;
            const duration = projectConstants.TIMEOUT_DELAY_LARGE10;
            if ((this.paytmenabled && !this.paytmverified) || (this.ccenabled && !this.payuverified)) {
                showmsgs = this.shared_functions.getProjectMesssages('PAYSETTING_SAV_SUCC') + '. ' + this.shared_functions.getProjectMesssages('PAYSETTING_CONTACTADMIN');
                panelclass = 'snackbarnormal'; // 'snackbarerror';
                params = { 'duration': duration, 'panelClass': panelclass };
            } else {
                showmsgs = this.shared_functions.getProjectMesssages('PAYSETTING_SAV_SUCC');
                panelclass = 'snackbarnormal';
                params = { 'duration': duration, 'panelClass': panelclass };
            }
            this.shared_functions.openSnackBar(showmsgs, params);
            this.tabid = 1;
            if (document.getElementById('gstno')) {
                document.getElementById('gstno').focus();
            }
        }
    }
    /**
     * Get Tax Percentage
     */
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe(data => {
                this.taxDetails = data;
                if (this.taxDetails != null) {
                    this.taxpercentage = this.taxDetails.taxPercentage;
                    this.gstnumber = this.taxDetails.gstNumber || '';
                }
            },
                () => {
                });
    }
    // showhidepaytype() {
    //     this.saveEnabled = true;
    //     if (this.paystatus) {
    //         this.paystatus = false;
    //     } else {
    //         this.paystatus = true;
    //     }
    //     this.savePaySettings(true);
    //     /*const postData = {
    //         onlinePayment: this.paystatus
    //     };
    //     this.provider_services.setPaymentSettings(postData)
    //         .subscribe(data => {
    //            this.provider_shared_functions.openSnackBar(Messages.PAYSETTING_SAV_SUCC);
    //         },
    //     error => {
    //             this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
    //             this.paystatus = this.paySettings.onlinePayment || false; // setting the old status
    //     });*/
    // }
    /**
     * toggle PayTm/PayU On/Off
     * @param obj selected option PayTm/PayU
     */
    handleChange(obj) {
        this.resetApi();
        this.saveEnabled = true;
        if (obj === 'pay') {
            if (this.paytmenabled) {
                this.paytmenabled = false;
            } else {
                this.paytmenabled = true;
            }
        } else if (obj === 'cc') {
            if (this.ccenabled) {
                this.ccenabled = false;
            } else {
                this.ccenabled = true;
            }
        }
    }
    /**
     * Enable/Disable Jaldee Account
     * @param status enable/disable
     */
    saveAccountPaymentSettings(status) {
        this.provider_services.setPaymentAccountSettings(status)
            .subscribe(() => {
                this.getPaymentSettings(1);
                this.saveEnabled = true;
                // this.handleEditPaySettings(false);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getPaymentSettings(2);
                    this.saveEnabled = true;
                });
    }
    /**
     * Save PayU/PayTM Account Information
     */
    savePaySettings() {
        this.resetApi();
        const postData = { 'dcOrCcOrNb': false, 'payTm': false, 'payU': false };
        postData['onlinePayment'] = this.paystatus;
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            postData['payTm'] = true;
            this.paytmMidBlur();
            this.paytmMkeyBlur();
            this.paytmwebsitewebBlur();
            this.paytmwebsiteAppBlur();
            this.paytmindustrytypeBlur();
            if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ONLYNUM') };
                this.errorExist = true;
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = { status: true, msg: this.shared_functions.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS') };
                    this.errorExist = true;
                } else {
                    postData['payTmLinkedPhoneNumber'] = this.paytmmobile;
                }
            }
            postData['paytmMerchantId'] = this.paytmMerchantId;
            postData['paytmMerchantKey'] = this.paytmMerchantKey;
            // postData['paytmWebsite'] = this.paytmWebsite;
            postData['paytmWebsiteWeb'] = this.paytmWebsiteWeb;
            postData['paytmWebsiteApp'] = this.paytmWebsiteApp;
            postData['paytmIndustryType'] = this.paytmIndustryType;
        } else {
            postData.payTm = false;
        }
        if (this.ccenabled === true) {
            postData['payU'] = true;
            postData.dcOrCcOrNb = true;
            this.panCardBlur();
            this.bankAcnumberBlur();
            this.bankNameBlur();
            this.ifscBlur();
            this.panNameBlur();
            this.acholderNameBlur();
            this.bankBranchBlur();
            if (blankpattern.test(this.bankfiling)) {
                this.errorExist = true;
                this.showError['bankfiling'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_FILING') };
            }

            if (blankpattern.test(this.bankactype)) {
                this.errorExist = true;
                this.showError['bankactype'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ACTYPE') };
            }
            postData['panCardNumber'] = this.pannumber;
            postData['bankAccountNumber'] = this.bankacnumber;
            postData['bankName'] = this.bankname;
            postData['ifscCode'] = this.bankifsc;
            postData['nameOnPanCard'] = this.panname;
            postData['accountHolderName'] = this.bankacname;
            postData['branchCity'] = this.bankbranch;
            postData['businessFilingStatus'] = this.bankfiling;
            postData['accountType'] = this.bankactype;
        } else {
            postData.payU = false;
            postData['dcOrCcOrNb'] = false;
        }
        if (!this.errorExist) {
            this.saveEnabled = false;
            this.provider_services.setPaymentSettings(postData)
                .subscribe(() => {
                    this.getPaymentSettings(1);
                    this.saveEnabled = true;
                },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        // this.getPaymentSettings(2);
                        this.saveEnabled = true;
                    });
        }
    }
    /**
     * funtion to validate tax, return error messages if any
     * @param setmsgs true/false
     */
    // taxfieldValidation(setmsgs?) {
    //     const floatpattern = projectConstants.VALIDATOR_FLOAT;
    //     const blankpattern = projectConstants.VALIDATOR_BLANK;
    //     this.errorExist = false;
    //     if (!floatpattern.test(this.taxpercentage)) {
    //         this.errorExist = true;
    //         if (setmsgs) {
    //             this.showError['taxpercentage'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_TAXPER') };
    //         }
    //     } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
    //         this.errorExist = true;
    //         if (setmsgs) {
    //             this.showError['taxpercentage'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_TAXPER') };
    //         }
    //     }
    //     if (blankpattern.test(this.gstnumber)) {
    //         this.errorExist = true;
    //         if (setmsgs) {
    //             this.showError['gstnumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_GSTNUM') };
    //         }
    //     }
    //     if (!setmsgs) {
    //         return this.errorExist;
    //     }
    // }
    isNumeric(evt) {
        this.resetApi();
        return this.shared_functions.isNumeric(evt);
    }
    isvalid(evt) {
        return this.shared_functions.isValid(evt);
    }
    /**
     * function to update tax settings
     */
    // saveTaxSettings() {
    //     this.taxfieldValidation(true);
    //     if (!this.errorExist) {
    //         this.savetaxEnabled = false;
    //         const postData = {
    //             'taxPercentage': this.taxpercentage,
    //             'gstNumber': this.gstnumber || ''
    //         };
    //         this.provider_services.setTaxpercentage(postData)
    //             .subscribe(() => {
    //                 this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('PAYSETTING_SAV_TAXPER'));
    //                 this.savetaxEnabled = true;
    //             },
    //                 error => {
    //                     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                     this.savetaxEnabled = true;
    //                 });
    //     }
    // }
    /**
     * function to get user profile for checking email id verified or not
     */
    getProviderProfile() {
        this.shared_functions.getProfile()
            .then(
                success => {
                    this.profileQueryExecuted = true;
                    this.emailidVerified = success['basicInfo']['emailVerified'];
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    /**
     * method to redirect to change email page
     */
    redirectToEmail() {
        this.shared_functions.setitemonLocalStorage('e_ret', 'pset');
        this.router.navigate(['provider', 'profile']);
    }

    // handleEditPaySettings(mod) {
    //     if (this.ineditMode && mod === false) {
    //         this.getPaymentSettings(2);
    //     }
    //     this.ineditMode = mod;
    //     if (mod === true) {
    //         setTimeout(() => {
    //             if (this.paymobrefRef) {
    //                 if (this.paymobrefRef.nativeElement) { // adding a small delay to field disabled get off before setting the focus
    //                     this.paymobrefRef.nativeElement.focus();
    //                 }
    //             } else if (this.acholdernameRef) {
    //                 if (this.acholdernameRef.nativeElement) {
    //                     this.acholdernameRef.nativeElement.focus();
    //                 }
    //             }
    //         }, 50);
    //     }
    // }
    checkTaxbuttonDisabled() {
        return true;
    }
    selectedIndexChange(val: number) {
        this.tabid = val;
    }
    /**
     * function called when control lost from paytm field
     */
    paytmBlur() {
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKNUM') };
            } else if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ONLYNUM') };
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = { status: true, msg: this.shared_functions.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS') };
                }
            }
        }
    }
    paytmMidBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmMerchantId)) {
                this.errorExist = true;
                this.showError['paytmMerchantId'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKMID') };
            }
        }
    }
    paytmMkeyBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmMerchantKey)) {
                this.errorExist = true;
                this.showError['paytmMerchantKey'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKMKEY') };
            }
        }
    }
    paytmwebsitewebBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmWebsiteWeb)) {
                this.errorExist = true;
                this.showError['paytmWebsiteWeb'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKWEBSITE') };
            }
        }
    }

    paytmwebsiteAppBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmWebsiteApp)) {
                this.errorExist = true;
                this.showError['paytmWebsiteApp'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKWEBSITEAPP') };
            }
        }
    }

    paytmindustrytypeBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmIndustryType)) {
                this.errorExist = true;
                this.showError['paytmIndustryType'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BLANKINDUSTRYTYPE') };
            }
        }
    }
    panCardBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_PAN') };
        } else if (!alphanumericpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_PANPHANUMERIC') };
        } else if (this.pannumber.length > this.maxcnt15) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_PANMAXLEN15') };
        }
    }
    ifscBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_IFSC') };
        } else if (!alphanumericpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_IFSCALPHANUMERIC') };
        } else if (this.bankifsc.length > this.maxcnt11) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_IFSCMAXLEN11') };
        }
    }
    panNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.panname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_PANNAME') };
        } else if (!charonly.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    acholderNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankacname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ACMNAME') };
        } else if (!charonly.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    bankAcnumberBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        if (blankpattern.test(this.bankacnumber)) {
            this.errorExist = true;
            this.showError['bankacnumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ACCNO') };
        } else {
            if (!numberpattern.test(this.bankacnumber)) {
                this.errorExist = true;
                this.showError['bankacnumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_ACCNO_NUMONLY') };
            }
        }
    }
    bankNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BANKNAME') };
        } else if (!charonly.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    bankBranchBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankbranch.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_BRANCH') };
        } else if (!charonly.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    removSpace(evt) {
        return this.shared_functions.removSpace(evt);
    }

}
