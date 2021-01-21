import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
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
        private groupService: GroupStorageService,
        private wordProcessor: WordProcessor) {
            this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
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
    redirecToSettings() {
        this.router.navigate(['provider', 'settings']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/customers']);
    }
}
