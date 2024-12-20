import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-saleschannel',
    templateUrl: './saleschannel.component.html'
})
export class SaleschannelComponent implements OnInit {
    id;
    api_error = null;
    api_success = null;
    breadcrumb_moreoptions: any = [];
    sales_code;
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous'
        },
        {
            title: 'Sales Channel'
        }
    ];
    domain: any;
    constructor(private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private router: Router, ) {
    }
    ngOnInit() {
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
        this.getSalesCode();
    }
    addSalesCode(id) {
        this.provider_services.addSalesCode(id).subscribe(
            data => {
                this.api_success = this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('SC_CREATED'), { 'panelclass': 'snackbarerror' });
                this.getSalesCode();
            },
            error => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    getSalesCode() {
        this.provider_services.getSalesCode().subscribe(
            data => {
                this.sales_code = data;
            },
            error => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    onCancel() {
        this.router.navigate(['provider/settings']);
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->saleschannel']);
        }
    }
}