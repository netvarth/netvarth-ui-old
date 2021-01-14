import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../../../../shared/constants/project-messages';

@Component({
    'selector': 'app-custid',
    'templateUrl': './customer-id.component.html'
})
export class CustomerIdSettingsComponent implements OnInit {
    customer_label = this.shared_functions.getTerminologyTerm('customer');
    customer_label_upper = this.shared_functions.firstToUpper(this. customer_label);
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
            title: Messages.CUSTOMER_ID.replace('[customer]', this.customer_label_upper),
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
    domain: any;
    cust_domain_name = '';
    breadcrumb_moreoptions: any = [];
    constructor(
        private provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private shared_Functionsobj: SharedFunctions,
        private routerobj: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.getGlobalSettings();
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollKey': 'customers->custid-settings',
            'actions': [
                { 'title': 'Help', 'type': 'learnmore' }]
        };
    }
    getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.custIdFormat = data.jaldeeIdFormat.customerSeriesEnum;
                this.tempCustIdFormat = data.jaldeeIdFormat;
                if (data.jaldeeIdFormat.patternSettings) {
                    this.prefixName = data.jaldeeIdFormat.patternSettings.prefix;
                    this.suffixName = data.jaldeeIdFormat.patternSettings.suffix;
                } else {
                    this.prefixName = '';
                    this.suffixName = '';
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
        } else if (this.custIdFormat === 'AUTO') {
            this.inputChanged = true;
        }
    }
    updateCustIdConfig() {
        const post_data = {
            'prefix': this.prefixName,
            'suffix': this.suffixName
        };
        if (this.custIdFormat === 'AUTO' && (this.prefixName || this.suffixName)) {
            this.custIdFormat = 'PATTERN';
        }
        if (this.custIdFormat === 'MANUAL') {
            const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                    'message': 'Once you switch to manual mode, auto generation of ' + this.customer_label + ' id won’t be available anymore. Are you sure you want to continue ?'
                }
            });
            dialogrefd.afterClosed().subscribe(result => {
                if (result) {
                    this.provider_services.updateCustIdFormat(this.custIdFormat, post_data).subscribe(
                        (data: any) => {
                            this.shared_Functionsobj.openSnackBar(this.customer_label_upper +  ' Id Configured Successfully');
                            this.inputChanged = false;
                        },
                        (error) => {
                            this.shared_Functionsobj.openSnackBar(error, { 'panelclass': 'snackbarerror' });
                        });
                } else {
                    this.resetCustIdConfig();
                }
            });
        } else {
            this.provider_services.updateCustIdFormat(this.custIdFormat, post_data).subscribe(
                (data: any) => {
                    this.shared_Functionsobj.openSnackBar('Customer Id Configured Successfully');
                    this.inputChanged = false;
                },
                (error) => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelclass': 'snackbarerror' });
                });
        }
    }
    resetCustIdConfig() {
        this.inputChanged = false;
        this.getGlobalSettings();
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/customers->custid-settings']);
        }
    }
    redirecToCustomers() {
        this.routerobj.navigate(['provider', 'settings' , 'customers']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/customers->custid-settings']);
    }
}
