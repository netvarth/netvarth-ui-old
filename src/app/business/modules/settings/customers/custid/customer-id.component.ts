import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
@Component({
    'selector': 'app-custid',
    'templateUrl': './customer-id.component.html'
})
export class CustomerIdSettingsComponent implements OnInit {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Customers',
            url: '/provider/settings/customers'
        },
        {
            title: 'Customer Id'
        }
    ];
    formats = {
        auto: { value: 'AUTO', displayName: 'Auto' },
        manual: { value: 'MANUAL', displayName: 'Manual' },
        pattern: { value: 'PATTERN', displayName: 'Pattern' },
    };
    prefixName;
    suffixName;
    custIdFormat: any;
    tempCustIdFormat: any;
    inputChanged = false;
    breadcrumb_moreoptions: any = [];
    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private routerobj: Router,
    ) {
    }

    ngOnInit() {
        this.getGlobalSettings();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.custIdFormat = data.jaldeeIdFormat.customerSeriesEnum;
                this.tempCustIdFormat = data.jaldeeIdFormat;
                if (data.jaldeeIdFormat.patternSettings) {
                    this.prefixName = data.jaldeeIdFormat.patternSettings.prefix;
                    this.suffixName = data.jaldeeIdFormat.patternSettings.suffix;
                }
            });
    }
    formatChanged() {
        if (this.custIdFormat !== this.tempCustIdFormat.customerSeriesEnum) {
            this.inputChanged = true;
        } else if (this.tempCustIdFormat.customerSeriesEnum === this.formats.pattern.value) {
            if (this.prefixName !== this.tempCustIdFormat.patternSettings.prefix || this.suffixName !== this.tempCustIdFormat.patternSettings.suffix) {
                this.inputChanged = true;
            }
        }
    }
    updateCustIdConfig() {
        const post_data = {
            'prefix': this.prefixName,
            'suffix': this.suffixName
        };

        this.provider_services.updateCustIdFormat(this.custIdFormat, post_data).subscribe(
            (data: any) => {
                this.shared_Functionsobj.openSnackBar('Customer Id Configured Successfully');
                this.inputChanged = false;
            },
            (error) => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelclass': 'snackbarerror' });
            });
    }
    resetCustIdConfig() {
        this.inputChanged = false;
        this.getGlobalSettings();
    }
    performActions(action) {
        if (action === 'learnmore') {
        //     this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->jdn']);
        }
    }
}
