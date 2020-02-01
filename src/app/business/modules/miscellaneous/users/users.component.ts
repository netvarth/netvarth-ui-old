import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    'selector': 'app-branchusers',
    'templateUrl': './users.component.html'
})
export class BranchUsersComponent implements OnInit {
    users_list: any = [];
    breadcrumb_moreoptions: any = [];
    domain;
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
            title: 'Users'
        }
    ];
    api_loading: boolean;
    constructor(
        private router: Router,
        private routerobj: Router,
        private shared_services: ProviderServices,
        private shared_functions: SharedFunctions) {

    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getUsers();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    addBranchSP() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add']);
    }
    personalProfile() {
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', 'additionalinfo']);
    }
    manageOnlineProfile(id) {
        const navigationExtras: NavigationExtras = {
            queryParams: { type: id}
        };
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', 'manageonlineprofile'], navigationExtras);
    }
    getUsers() {
        const accountId = this.shared_functions.getitemFromGroupStorage('accountId');
        const users = [];
        this.shared_services.getUsers().subscribe(
            (data: any) => {
                this.users_list = data;
                // for (let i = 0; i < this.users_list.length; i++) {
                //     if (this.users_list[i]['accountType'] === 'BRANCH') {
                //     } else {
                //         users.push(this.users_list[i]);
                //     }
                // }
                // this.users_list = users;
                this.api_loading = false;
                console.log(this.users_list);
            }
        );
    }
    // gotoBranchspDetails(user) {
    //      console.log(user);
    // }
    manageProvider(accountId) {
        window.open('#/manage/' + accountId, '_blank');
    }
    performActions(action) {
        if (action === 'learnmore') {
          this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->branchsps']);
        }
      }
}
