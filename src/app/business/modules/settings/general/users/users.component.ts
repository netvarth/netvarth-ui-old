import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../app.component';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LinkProfileComponent } from './linkProfile/linkProfile.component';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';

@Component({

    'selector': 'app-branchusers',
    'templateUrl': './users.component.html'

})

export class BranchUsersComponent implements OnInit {
    users_list: any = [];
    breadcrumb_moreoptions: any = [];
    domain;
    filter_sidebar = false;
    filterapplied = false;
    open_filter = false;
    filter = {
        firstName: '',
        lastName: '',
        primaryMobileNo: '',
        userType: '',
        page_count: projectConstants.PERPAGING_LIMIT,
        page: 1

    };

    filters: any = {
        'firstName': false,
        'lastName': '',
        'primaryMobileNo': false,
        'userType': false

    };

    breadcrumbs = [
        {
            url: '/provider/settings',
            title: 'Settings'

        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Users'
        }
    ];

    userTypesFormfill: any = ['ASSISTANT', 'PROVIDER', 'ADMIN'];
    api_loading: boolean;
    departments: any;
    loadComplete = false;
    user_count: any = 0;
    pagination: any = {
        startpageval: 1,
        totalCnt: 0,
        perPage: this.filter.page_count
    };
    linkprofiledialogRef;
    provId;
    businessConfig: any;
    provider_label = '';
    assistant_label = '';
    changeUserStatusdialogRef;
    constructor(
        private router: Router,
        private routerobj: Router,
        private provider_services: ProviderServices,
        private dialog: MatDialog,
        private shared_functions: SharedFunctions) {
    }

    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        this.getUsers();
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
        this.assistant_label = this.shared_functions.getTerminologyTerm('assistant');
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }

    addBranchSP() {
        const navigationExtras: NavigationExtras = {
            queryParams: { type: 'Add' }
        };
        this.router.navigate(['provider', 'settings', 'general', 'users', 'add'], navigationExtras);
    }
    personalProfile(user) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: 'edit',
                val: user
            }
        };
        this.router.navigate(['provider', 'settings', 'general', 'users', 'add'], navigationExtras);
    }
    // manageOnlineProfile(userId) {
    //     this.routerobj.navigate(['provider', 'settings', 'general', 'users', userId, 'settings', 'bprofile']);
    // }
    manageSettings(userId) {
        this.routerobj.navigate(['provider', 'settings', 'general', 'users', userId, 'settings']);
    }
    linkProfile(userid) {
        this.linkprofiledialogRef = this.dialog.open(LinkProfileComponent, {
            width: '50%',
            data: {
                provId: userid
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            autoFocus: true,
            disableClose: true

        });
        this.linkprofiledialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result === 'reloadlist') {
                    this.getUsers();
                }
            }
        });
    }
    // changeUserStatus(user) {
    //     let passingStatus;
    //     if (user.status === 'ACTIVE') {
    //         passingStatus = 'Disable';
    //     } else {
    //         passingStatus = 'Enable';
    //     }
    //     this.provider_services.disableEnableuser(user.id, passingStatus)
    //         .subscribe(
    //             () => {
    //                 this.getUsers();
    //             },
    //             (error) => {
    //                 this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                 this.getUsers();
    //             });
    // }
    changeUserStatus(user) {
        let passingStatus;
        if (user.status === 'ACTIVE') {
            passingStatus = 'Disable';
        } else {
            passingStatus = 'Enable';
        }
        if (user.userType === 'PROVIDER') {
            let msg;
            if (passingStatus === 'Disable') {
               msg = 'Disabling the ' + this.provider_label + ', will also disable the ' + this.provider_label + '’s services as well as queues/schedules, if any. Continue?';
            } else {
               msg = 'After enabling, make sure to setup services as well as queues/schedules for the ' + this.provider_label + '.';
            }

        this.changeUserStatusdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': msg
            }
        });
        this.changeUserStatusdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.provider_services.disableEnableuser(user.id, passingStatus)
                .subscribe(
                    () => {
                        this.getUsers();
                    },
                    (error) => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.getUsers();
                    });
            }
        });
    } else {
             this.provider_services.disableEnableuser(user.id, passingStatus)
            .subscribe(
                () => {
                    this.getUsers();
                },
                (error) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getUsers();
                });
    }
    }
    getUsers(from_oninit = false) {
        let filter = this.setFilterForApi();
        this.getUsersListCount(filter)
            .then(
                result => {
                    if (from_oninit) { this.user_count = result; }
                    filter = this.setPaginationFilter(filter);
                    this.provider_services.getUsers(filter).subscribe(
                        (data: any) => {
                            this.provider_services.getDepartments().subscribe(
                                (data1: any) => {
                                    this.departments = data1.departments;
                                    this.users_list = data;
                                    this.api_loading = false;
                                    this.loadComplete = true;
                                },

                                (error: any) => {
                                    this.users_list = data;
                                    this.api_loading = false;
                                    this.loadComplete = true;
                                });
                        },

                        (error: any) => {
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
                },
                (error: any) => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    getDepartmentNamebyId(id) {
        let departmentName;
        for (let i = 0; i < this.departments.length; i++) {
            if (this.departments[i].departmentId === id) {
                departmentName = this.departments[i].departmentName;
                break;
            }
        }
        return departmentName;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/general->branchsps']);
        }
    }
    showFilterSidebar() {
        this.filter_sidebar = true;
    }
    hideFilterSidebar() {
        this.filter_sidebar = false;
        this.clearFilter();
    }
    clearFilter() {
        this.resetFilter();
        this.filterapplied = false;
        this.getUsers();
    }
    resetFilter() {
        this.filters = {
            'firstName': false,
            'lastName': false,
            'primaryMobileNo': false,
            'userType': false
        };
        this.filter = {
            firstName: '',
            lastName: '',
            primaryMobileNo: '',
            userType: '',
            page_count: projectConstants.PERPAGING_LIMIT,
            page: 1
        };
    }
    doSearch() {
        this.getUsers();
        if (this.filter.firstName || this.filter.lastName || this.filter.primaryMobileNo || this.filter.userType) {
            this.filterapplied = true;
        } else {
            this.filterapplied = false;
        }
    }
    focusInput(ev, input) {
        const kCode = parseInt(ev.keyCode, 10);
        if (kCode === 13) {
            input.focus();
            this.doSearch();

        }
    }
    setPaginationFilter(api_filter) {
        api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
        api_filter['count'] = this.filter.page_count;
        return api_filter;
    }

    setFilterForApi() {
        const api_filter = {};
        if (this.filter.firstName !== '') {
            api_filter['firstName-eq'] = this.filter.firstName;
        }
        if (this.filter.lastName !== '') {
            api_filter['lastName-eq'] = this.filter.lastName;
        }
        if (this.filter.userType !== '') {
            api_filter['userType-eq'] = this.filter.userType;
        }
        if (this.filter.primaryMobileNo !== '') {
            const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
            const mval = pattern.test(this.filter.primaryMobileNo);
            if (mval) {
                api_filter['primaryMobileNo-eq'] = this.filter.primaryMobileNo;
            } else {
                this.filter.primaryMobileNo = '';
            }
        }
        return api_filter;

    }


    getUsersListCount(filter) {
        return new Promise((resolve, reject) => {
            this.provider_services.getUsersCount(filter)
                .subscribe(
                    data => {
                        this.pagination.totalCnt = data;
                        this.user_count = this.pagination.totalCnt;
                        resolve(data);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    handle_pageclick(pg) {
        this.pagination.startpageval = pg;
        this.filter.page = pg;
        this.getUsers();
      }
    makeDefalutAdmin(id) {
        this.provider_services.makeDefalutAdmin(id)
        .subscribe(
            () => {
                this.getUsers();
            },
            (error) => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.getUsers();
            });

    }
}
