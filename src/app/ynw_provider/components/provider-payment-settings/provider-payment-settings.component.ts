import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../shared/constants/project-constants';
import { post } from 'selenium-webdriver/http';

import { Messages } from '../../../shared/constants/project-messages';


@Component({
    selector: 'app-provider-paymentsettings',
    templateUrl: './provider-payment-settings.component.html'
})

export class ProviderPaymentSettingsComponent implements OnInit {

    paytmenabled;
    paytmmobile;
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
    paytmverified = false;
    payuverified = false;
    tabid = 0;
    emailidVerified = false;
    profileQueryExecuted = false;
    breadcrumbs = [
        {
          title: 'Settings',
          url: '/provider/settings'
        },
        {
        title: 'Payment Settings'
        }
      ];
      constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        public provider_shared_functions: ProviderSharedFuctions
      ) {
            this.activated_route.params.subscribe(params => {
                this.tabid = (params.id) ? params.id : 0;
            });

      }
    ngOnInit() {
        this.resetApi();
        this.getPaymentSettings(2);
        this.getTaxpercentage();
        this.getProviderProfile();
    }
    getPaymentSettings(showmsg) {
        this.provider_services.getPaymentSettings()
            .subscribe(data => {
                this.paySettings = data;
                this.paystatus = this.paySettings.onlinePayment || false;
                this.paytmenabled = this.paySettings.payTm || false;
                this.ccenabled = this.paySettings.dcOrCcOrNb || false;
                this.paytmmobile = this.paySettings.payTmLinkedPhoneNumber || '';
                this.pannumber = this.paySettings.panCardNumber || '';
                this.panname = this.paySettings.nameOnPanCard || '';
                this.bankacname = this.paySettings.accountHolderName || '';
                this.bankacnumber = this.paySettings.bankAccountNumber || '';
                this.bankname = this.paySettings.bankName || '';
                this.bankifsc = this.paySettings.ifscCode || '';
                this.bankbranch = this.paySettings.branchCity || '';
                this.bankfiling = this.paySettings.businessFilingStatus || '';
                this.bankactype = this.paySettings.accountType || '';
                this.paytmverified = this.paySettings.payTmVerified	 || false;
                this.payuverified = this.paySettings.payUVerified	 || false;
            });
            if (showmsg === 1) {
                let showmsgs = '';
                if ((this.paytmenabled && !this.paytmverified) || (this.ccenabled && !this.payuverified)) {
                    showmsgs = Messages.PAYSETTING_SAV_SUCC + '. ' + Messages.PAYSETTING_CONTACTADMIN;
                } else {
                    showmsgs = Messages.PAYSETTING_SAV_SUCC;
                }
                this.provider_shared_functions.openSnackBar (showmsgs);
            }
    }
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe (data => {
                this.taxDetails = data;
                this.taxpercentage = this.taxDetails;
            },
        error => {

        });
    }
    showhidepaytype() {
        this.saveEnabled = true;
        console.log('paystatus', this.paystatus);
        if (this.paystatus) {
            this.paystatus = false;
        } else {
            this.paystatus = true;
        }
        this.savePaySettings(true);
        /*const postData = {
            onlinePayment: this.paystatus
        };
        this.provider_services.setPaymentSettings(postData)
            .subscribe(data => {
               console.log('submit ret', data);
               this.provider_shared_functions.openSnackBar(Messages.PAYSETTING_SAV_SUCC);
            },
        error => {
                this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
                this.paystatus = this.paySettings.onlinePayment || false; // setting the old status
        });*/
    }
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
    savePaySettings(includepaystatus) {
        this.resetApi();
        const postData = {'dcOrCcOrNb': false, 'payTm': false};
        // if (includepaystatus) {
           postData['onlinePayment'] =  this.paystatus;
        // }
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            postData['payTm'] = true;
            if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = {status: true, msg: Messages.PAYSETTING_ONLYNUM};
                this.errorExist = true;
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = {status: true, msg: Messages.BPROFILE_PRIVACY_PHONE_10DIGITS};
                    this.errorExist = true;
                } else {
                    postData['payTmLinkedPhoneNumber'] = this.paytmmobile;
                }
            }
        } else {
            postData.payTm = false;
        }

        if (this.ccenabled === true) {
            postData.dcOrCcOrNb = true;
            if (blankpattern.test(this.pannumber)) {
                this.errorExist = true;
                this.showError['pannumber'] = {status: true, msg: Messages.PAYSETTING_PAN};
            }
            if (blankpattern.test(this.bankacnumber)) {
                this.errorExist = true;
                this.showError['bankacnumber'] = {status: true, msg: Messages.PAYSETTING_ACCNO};
            }
            if (blankpattern.test(this.bankname)) {
                this.errorExist = true;
                this.showError['bankname'] = {status: true, msg: Messages.PAYSETTING_BANKNAME};
            }
            if (blankpattern.test(this.bankifsc)) {
                this.errorExist = true;
                this.showError['bankifsc'] = {status: true, msg: Messages.PAYSETTING_IFSC};
            }
            if (blankpattern.test(this.panname)) {
                this.errorExist = true;
                this.showError['panname'] = {status: true, msg: Messages.PAYSETTING_PANNAME};
            }
            if (blankpattern.test(this.bankacname)) {
                this.errorExist = true;
                this.showError['bankacname'] = {status: true, msg: Messages.PAYSETTING_ACMNAME};
            }
            if (blankpattern.test(this.bankbranch)) {
                this.errorExist = true;
                this.showError['bankbranch'] = {status: true, msg: Messages.PAYSETTING_BRANCH};
            }
            if (blankpattern.test(this.bankfiling)) {
                this.errorExist = true;
                this.showError['bankfiling'] = {status: true, msg: Messages.PAYSETTING_FILING};
            }
            if (blankpattern.test(this.bankactype)) {
                this.errorExist = true;
                this.showError['bankactype'] = {status: true, msg: Messages.PAYSETTING_ACTYPE};
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
            postData['dcOrCcOrNb'] = false;
        }
        if (!this.errorExist) {
            console.log('postdata', JSON.stringify(postData));
            this.saveEnabled = false;
            this.provider_services.setPaymentSettings(postData)
                .subscribe (data => {
                    // console.log('save ret', data);
                    this.getPaymentSettings(1);
                    this.saveEnabled = true;
                },
            error => {
                this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
                this.getPaymentSettings(2);
                this.saveEnabled = true;
            });
        }
    }
    saveTaxSettings() {
        const floatpattern = projectConstants.VALIDATOR_FLOAT;
        this.errorExist = false;
        if (!floatpattern.test(this.taxpercentage)) {
            this.errorExist = true;
            this.showError['taxpercentage'] = {status: true, msg: Messages.PAYSETTING_TAXPER};
        } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
            this.errorExist = true;
            this.showError['taxpercentage'] = {status: true, msg: Messages.PAYSETTING_TAXPER};
        }
        if (!this.errorExist) {
            this.savetaxEnabled = false;
            this.provider_services.setTaxpercentage(this.taxpercentage)
                .subscribe (data => {
                    this.provider_shared_functions.openSnackBar (Messages.PAYSETTING_SAV_TAXPER);
                    this.savetaxEnabled = true;
                },
            error => {
                this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
                this.savetaxEnabled = true;
            });
        }
    }
    getProviderProfile() {
        const ob = this;
        this.shared_Functionsobj.getProfile()
        .then(
          success =>  {
           console.log('succ', success);
           this.profileQueryExecuted = true;
           this.emailidVerified =  success['basicInfo']['emailVerified'];
          },
          error => {
            this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
          }
        );
    }
    redirectToEmail() {
        this.router.navigate(['provider', 'change-email']);
    }
    resetApi() {
        this.errorExist = false;
        this.showError = {
            'paytmmobile' : {status: false, msg: ''},
            'pannumber' : {status: false, msg: ''},
            'panname' : {status: false, msg: ''},
            'bankacname' : {status: false, msg: ''},
            'bankacnumber' : {status: false, msg: ''},
            'bankname' : {status: false, msg: ''},
            'bankifsc' : {status: false, msg: ''},
            'bankbranch' : {status: false, msg: ''},
            'bankfiling' : {status: false, msg: ''},
            'bankactype' : {status: false, msg: ''},
            'taxpercentage' : {status: false, msg: ''}
        };
    }
}
