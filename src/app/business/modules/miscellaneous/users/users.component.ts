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

        const navigationExtras: NavigationExtras = {
            queryParams: { type: 'Add' }
        };

        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add'], navigationExtras);
    }
    personalProfile(user) {
        console.log(user);
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: 'edit',
                val: user
            }
        };
        console.log(navigationExtras);
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', 'add'], navigationExtras);
    }
    manageOnlineProfile(name, userId) {
        console.log(userId);
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: name,
                id: userId
            }
        };
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', userId, 'bprofile' ], navigationExtras);
    }
     manageSettings(name,userId) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                id: userId,
                name: name
            }
        };
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', userId ,'settings'],navigationExtras);
    }
    changeUserStatus(user) {
        let passingStatus;
        if (user.status === 'ACTIVE') {
            passingStatus = 'Disable';
        } else {
            passingStatus = 'Enable';
        }
        this.shared_services.disableEnableuser(user.id, passingStatus)
            .subscribe(
                () => {
                    this.getUsers();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getUsers();
                });
    }
    getUsers() {
        const users = [];
        this.shared_services.getUsers().subscribe(
            (data: any) => {
                this.users_list = data;
                this.api_loading = false;
                console.log(this.users_list);
            }
        );
    }
    manageProvider(accountId) {
        window.open('#/manage/' + accountId, '_blank');
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->branchsps']);
        }
    }
}
