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
    constructor(private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router, ) {

    }
    ngOnInit() {
    }
    addSalesCode(id) {
        this.provider_services.addSalesCode(id).subscribe(
            data => {
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
}
