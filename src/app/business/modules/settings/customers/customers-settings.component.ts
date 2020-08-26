import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    'selector': 'app-customers-settings',
    'templateUrl': './customers-settings.component.html'
})
export class CustomersSettingsComponent implements OnInit {
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Customers'
        }
    ];
    domain: any;
    breadcrumb_moreoptions: any = [];
    constructor(private router: Router,
        private shared_functions: SharedFunctions) {
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    gotoCustomerIdSettings() {
        this.router.navigate(['provider', 'settings', 'customers', 'custid']);
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/customers']);
        }
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.router.navigate(['/provider/' + this.domain + '/customers->' + mod]);
    }
    redirecToSettings() {
        this.router.navigate(['provider', 'settings']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/customers']);    }
}
