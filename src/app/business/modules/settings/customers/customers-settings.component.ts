import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
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
    customer_label = '';
    cust_domain_name = '';
    breadcrumb_moreoptions: any = [];
    constructor(private router: Router,
        private shared_functions: SharedFunctions) {
            this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
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
}
