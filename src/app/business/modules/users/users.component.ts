import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
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
    breadcrumbs = this.breadcrumbs_init;

    constructor(
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
    gotobranchsps(type) {
        const navigationExtras: NavigationExtras = {
            queryParams: { type: type}
        };
      this.routerobj.navigate(['provider', 'settings', 'users', 'doctors'], navigationExtras);
       // this.router.navigate(['provider', 'settings','users','doctors']);
    }
    
   
}
