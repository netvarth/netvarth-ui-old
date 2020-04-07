import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-custom-view',
    templateUrl: './custom-view.component.html'
})
export class CustomViewComponent implements OnInit {
    customViewName;
    departments: any = [];
    users_list: any = [];
    service_list: any = [];
    qstoDisplay: any = [];
    queuestoDisplay: any = [];
    selectedDepartments: any = [];
    selectedUsers: any = [];
    selectedServices: any = [];
    selectedQs: any = [];
    selectedDeptIds: any = [];
    selectedUsersId: any = [];
    selectedServiceids: any = [];
    selectedQIds: any = [];
    customViewDetails: any = [];
    providerQs: any = [];
    providerServices: any = [];
    allUsersIds: any = [];
    loading = true;
    viewId;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    deptMultiFilterCtrl: FormControl = new FormControl();
    userMultiFilterCtrl: FormControl = new FormControl();
    serviceMultiFilterCtrl: FormControl = new FormControl();
    qMultiFilterCtrl: FormControl = new FormControl();
    onDestroy = new Subject<void>();
    filterDepList: any = [];
    filterUsersList: any = [];
    filterServiicesList: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            title: 'Custom View'
        }
    ];

    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices) {
        this.activated_route.queryParams.subscribe((qparams) => {
            this.viewId = qparams.id;
            this.getDepartments();
            this.getAccountQs();
            this.getAccountServices();
            if (this.viewId) {
                this.getView(this.viewId);
            } else {
                this.getUsers();
                this.loading = false;
            }
        });
    }
    ngOnInit() {
        this.deptMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterDeptbySearch();
            });
        this.userMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterUserbySearch();
            });
        this.serviceMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterServicebySearch();
            });
        this.qMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterQbySearch();
            });
    }
    filterDeptbySearch() {
        if (!this.filterDepList) {
            return;
        }
        let search = this.deptMultiFilterCtrl.value;
        if (!search) {
            this.departments = this.filterDepList.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.departments = this.filterDepList.filter(dept => dept.departmentName.toLowerCase().indexOf(search) > -1);
    }

    filterUserbySearch() {
        if (!this.filterUsersList) {
            return;
        }
        let search = this.userMultiFilterCtrl.value;
        if (!search) {
            this.users_list = this.filterUsersList.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.users_list = this.filterUsersList.filter(user => user.firstName.toLowerCase().indexOf(search) > -1);
    }
    filterServicebySearch() {
        if (!this.filterServiicesList) {
            return;
        }
        let search = this.serviceMultiFilterCtrl.value;
        if (!search) {
            this.service_list = this.filterServiicesList.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.service_list = this.filterServiicesList.filter(service => service.name.toLowerCase().indexOf(search) > -1);
    }
    filterQbySearch() {
        if (!this.queuestoDisplay) {
            return;
        }
        let search = this.qMultiFilterCtrl.value;
        if (!search) {
            this.qstoDisplay = this.queuestoDisplay.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.qstoDisplay = this.queuestoDisplay.filter(q => q.name.toLowerCase().indexOf(search) > -1);
    }
    getAccountQs() {
        const filter = {
            'scope-eq': 'account'
        };
        this.provider_services.getProviderQueues(filter)
            .subscribe(
                (data: any) => {
                    this.providerQs = data;
                });
    }
    getAccountServices() {
        const filter = {
            'scope-eq': 'account'
        };
        this.provider_services.getProviderServices(filter)
            .subscribe(
                (data: any) => {
                    this.providerServices = data;
                });
    }
    getView(viewId) {
        this.provider_services.getCustomViewDetail(viewId)
            .subscribe(
                data => {
                    this.customViewDetails = data;
                    this.customViewName = this.customViewDetails.name;
                    this.selectedDepartments = [];
                    this.selectedUsers = [];
                    this.selectedServices = [];
                    this.selectedQs = [];
                    for (const id of this.customViewDetails.customViewConditions.departments) {
                        this.selectedDeptIds.push(id.departmentId);
                        for (const dept of this.departments) {
                            if (dept.departmentId === id.departmentId) {
                                this.selectedDepartments.push(dept);
                            }
                        }
                    }
                    this.getUsers();
                    setTimeout(() => {
                        if (this.customViewDetails.customViewConditions.users.length > 0) {
                            for (const id of this.customViewDetails.customViewConditions.users) {
                                this.selectedUsersId.push(id.id);
                                for (const user of this.users_list) {
                                    if (user.id === id.id) {
                                        this.selectedUsers.push(user);
                                    }
                                }
                            }
                        }
                        this.getServices();
                        this.getQs();
                    }, 100);
                    setTimeout(() => {
                        if (this.customViewDetails.customViewConditions.services.length > 0) {
                            for (const id of this.customViewDetails.customViewConditions.services) {
                                this.selectedServiceids.push(id.id);
                                for (const service of this.service_list) {
                                    if (service.id === id.id) {
                                        this.selectedServices.push(service);
                                    }
                                }
                            }
                        }
                        if (this.customViewDetails.customViewConditions.queues.length > 0) {
                            for (const id of this.customViewDetails.customViewConditions.queues) {
                                this.selectedQIds.push(id.id);
                                for (const q of this.qstoDisplay) {
                                    if (q.id === id.id) {
                                        this.selectedQs.push(q);
                                    }
                                }
                            }
                        }
                    }, 250);
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getDepartments() {
        this.provider_services.getDepartments()
            .subscribe(
                (data: any) => {
                    this.departments = data.departments;
                    this.filterDepList = data.departments;
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getServices() {
        let doctorsIds;
        if (this.selectedUsersId.length > 0) {
            doctorsIds = this.selectedUsersId;
        } else {
            doctorsIds = this.allUsersIds;
        }
        this.provider_services.getUserServicesList(doctorsIds.toString())
            .subscribe(
                data => {
                    this.service_list = data;
                    if (this.selectedUsersId.length === 0) {
                        this.service_list = this.service_list.concat(this.providerServices);
                    }
                    this.filterServiicesList = this.service_list;
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    getQs() {
        let doctorsIds;
        if (this.selectedUsersId.length > 0) {
            doctorsIds = this.selectedUsersId;
        } else {
            doctorsIds = this.allUsersIds;
        }
        this.provider_services.getUserProviderQueues(doctorsIds.toString())
            .subscribe(
                (data) => {
                    let allQs: any = [];
                    this.qstoDisplay = [];
                    allQs = data;
                    if (this.selectedUsersId.length === 0) {
                        allQs = allQs.concat(this.providerQs);
                    }
                    for (let ii = 0; ii < allQs.length; ii++) {
                        let schedule_arr = [];
                        if (allQs[ii].queueSchedule) {
                            schedule_arr = this.shared_functions.queueSheduleLoop(allQs[ii].queueSchedule);
                        }
                        let display_schedule = [];
                        display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                        allQs[ii]['displayschedule'] = display_schedule;
                    }
                    for (let ii = 0; ii < allQs.length; ii++) {
                        if (allQs[ii].queueState === 'ENABLED' && this.qstoDisplay.indexOf(allQs[ii]) === -1) {
                            this.qstoDisplay.push(allQs[ii]);
                        }
                    }
                    this.queuestoDisplay = this.qstoDisplay;
                },
                (error) => {

                });
    }
    deptSelection(depIds) {
        if (this.selectedDeptIds.indexOf(depIds) === -1) {
            this.selectedDeptIds.push(depIds);
            this.getUsers();
        } else {
            this.selectedDeptIds.splice(this.selectedDeptIds.indexOf(depIds), 1);
        }
        this.selectedUsers = [];
        this.selectedServices = [];
        this.selectedQs = [];
        this.selectedUsersId = [];
        this.selectedServiceids = [];
        this.selectedQIds = [];
    }
    userSelection(userIds) {
        if (this.selectedUsersId.indexOf(userIds) === -1) {
            this.selectedUsersId.push(userIds);
        } else {
            this.selectedUsersId.splice(this.selectedUsersId.indexOf(userIds), 1);
        }
        this.getQs();
        this.getServices();
        this.selectedServices = [];
        this.selectedQs = [];
        this.selectedServiceids = [];
        this.selectedQIds = [];
    }
    serviceSelection(servIds) {
        if (this.selectedServiceids.indexOf(servIds) === -1) {
            this.selectedServiceids.push(servIds);
        } else {
            this.selectedServiceids.splice(this.selectedServiceids.indexOf(servIds), 1);
        }
        this.qSelectionByService();
        this.selectedQs = [];
        this.selectedQIds = [];
    }
    qSelectionByService() {
        const qs = [];
        if (this.selectedServices.length > 0) {
            for (let i = 0; i < this.selectedServices.length; i++) {
                for (let j = 0; j < this.queuestoDisplay.length; j++) {
                    for (let k = 0; k < this.queuestoDisplay[j].services.length; k++) {
                        if (this.selectedServices[i].id === this.queuestoDisplay[j].services[k].id) {
                            qs.push(this.queuestoDisplay[j]);
                        }
                    }
                }
            }
            this.qstoDisplay = qs;
            return false;
        } else {
            this.qstoDisplay = this.queuestoDisplay;
        }
    }
    qSelection(QIds) {
        if (this.selectedQIds.indexOf(QIds) === -1) {
            this.selectedQIds.push(QIds);
        } else {
            this.selectedQIds.splice(this.selectedQIds.indexOf(QIds), 1);
        }
    }
    getUsers() {
        const apiFilter = {};
        apiFilter['userType-eq'] = 'PROVIDER';
        if (this.selectedDeptIds.length > 0) {
            apiFilter['departmentId-eq'] = this.selectedDeptIds.toString();
        }
        this.provider_services.getUsers(apiFilter).subscribe(
            (data: any) => {
                this.users_list = data;
                this.filterUsersList = data;
                for (const user of this.users_list) {
                    if (this.allUsersIds.indexOf(user.id) === -1) {
                        this.allUsersIds.push(user.id);
                    }
                }
                if (!this.customViewDetails.customViewConditions) {
                    this.getQs();
                    this.getServices();
                }
            }
        );
    }
    createCustomView() {
        const depids = [];
        for (const id of this.selectedDeptIds) {
            depids.push({ 'departmentId': id });
        }
        const userids = [];
        for (const id of this.selectedUsersId) {
            userids.push({ 'id': id });
        }
        const servicesids = [];
        for (const id of this.selectedServiceids) {
            servicesids.push({ 'id': id });
        }
        const qids = [];
        if (this.selectedQIds.length !== 0) {
            for (const id of this.selectedQIds) {
                qids.push({ 'id': id });
            }
        } else {
            for (const id of this.qstoDisplay) {
                qids.push({ 'id': id.id });
            }
        }
        const customViewInput = {
            'name': this.customViewName,
            'merged': true,
            'customViewConditions': {
                'departments': depids,
                'users': userids,
                'services': servicesids,
                'queues': qids
            }
        };
        if (this.viewId) {
            this.provider_services.updateCustomView(this.viewId, customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Updated Successfully', { 'panelclass': 'snackbarerror' });
                    this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.createCustomView(customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Created Successfully', { 'panelclass': 'snackbarerror' });
                    this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
    }
}
