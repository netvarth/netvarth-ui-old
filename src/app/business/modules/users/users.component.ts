import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            title: 'Users'
        }
    ];
    customer_label = '';
    provider_label = '';

    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
    }
    ngOnInit() {
        
    }
    gotobranchsps() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
    }
    gotocorporate() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'corporate']);
    }
    gotoNonworkingDays() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'holidays']);
    }
    gotoNotifications() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'notifications']);
    }
    gotosaleschannel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'saleschannel']);
    }
    gotothemes() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'skins']);
    }
    gotoJdn() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'jdn']);
    }
   
   
}
