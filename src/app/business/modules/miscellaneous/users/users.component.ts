import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';

@Component({
    'selector': 'app-branchusers',
    'templateUrl': './users.component.html'
})
export class BranchUsersComponent implements OnInit {
    users_list: any = [];
    breadcrumb_moreoptions: any = [];
    breadcrumbs = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            title: 'Branch SPs'
        }
    ];
    constructor(
        private router: Router,
        private shared_services: ProviderServices,
        private shared_functions: SharedFunctions) {

    }
    ngOnInit() {
        this.getBranchSPs();
    }
    addBranchSP() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add']);
    }
    getBranchSPs() {
        const accountId = this.shared_functions.getitemFromGroupStorage('accountId');
        this.shared_services.getBranchSPs(accountId).subscribe(
            (data: any) => {
                this.users_list = data;
                console.log(this.users_list);
            }
        );
    }
    // gotoBranchspDetails(user) {
    //      console.log(user);
    // }
    manageProvider(accountId) {
        window.open('#/provider/manage/' + accountId, '_blank');
    }
}
