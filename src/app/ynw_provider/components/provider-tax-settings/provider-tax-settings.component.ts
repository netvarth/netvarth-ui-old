import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    selector: 'app-provider-settings',
    templateUrl: './provider-tax-settings.component.html'
})

export class ProvidertaxSettingsComponent implements OnInit {

    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Tax Settings'
        }
    ];

    savetaxEnabled = true;
    errorExist = false;
    taxpercentage;
    showError: any = [];
    gstnumber;
    taxDetails: any = [];
    tax_st_cap = Messages.FRM_LEVEL_TAX_SETTINGS_MSG;
    tax_percentage_cap = Messages.PAY_SET_TAX_PER_CAP;
    update_tax_cap = Messages.PAY_SET_UPDATE_TAX_CAP;
    breadcrumb_moreoptions: any = [];
    isCheckin;

    constructor(private shared_functions: SharedFunctions,
       private provider_services: ProviderServices ) {

    }
    ngOnInit() {
        this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
        this.resetApi();
this.getTaxpercentage();
this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'billing' };
    }

    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe(data => {
                this.taxDetails = data;
                this.taxpercentage = this.taxDetails.taxPercentage;
                this.gstnumber = this.taxDetails.gstNumber || '';
            },
                () => {
                });
    }
    taxfieldValidation(setmsgs?) {
        const floatpattern = projectConstants.VALIDATOR_FLOAT;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        this.errorExist = false;
        if (!floatpattern.test(this.taxpercentage)) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['taxpercentage'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_TAXPER') };
            }
        } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['taxpercentage'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_TAXPER') };
            }
        }
        if (blankpattern.test(this.gstnumber)) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['gstnumber'] = { status: true, msg: this.shared_functions.getProjectMesssages('PAYSETTING_GSTNUM') };
            }
        }
        if (!setmsgs) {
            return this.errorExist;
        }
    }

    saveTaxSettings() {
        this.taxfieldValidation(true);
        if (!this.errorExist) {
            this.savetaxEnabled = false;
            const postData = {
                'taxPercentage': this.taxpercentage,
                'gstNumber': this.gstnumber || ''
            };
            this.provider_services.setTaxpercentage(postData)
                .subscribe(() => {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('PAYSETTING_SAV_TAXPER'));
                    this.savetaxEnabled = true;
                },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.savetaxEnabled = true;
                    });
        }
    }
    isNumeric(evt) {
        this.resetApi();
        return this.shared_functions.isNumeric(evt);
    }
    isvalid(evt) {
        return this.shared_functions.isValid(evt);
    }

    resetApi(code?) {
        this.errorExist = false;
        if (code !== undefined) {
            this.showError[code] = { status: false, msg: '' };
        } else {
            this.showError = {
                'taxpercentage': { status: false, msg: '' },
                'gstnumber': { status: false, msg: '' }
            };
        }
    }
    getMode(mod) {
        let moreOptions = {};
        moreOptions = { 'show_learnmore': true, 'scrollKey': 'billing', 'subKey': mod };
        return moreOptions;
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
        this.shared_functions.sendMessage(pdata);
    }
}

