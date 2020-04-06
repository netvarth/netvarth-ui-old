import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-custom-view',
    templateUrl: './custom-view.component.html'
})
export class CustomViewComponent implements OnInit {
    customViewName;
    departments: any = [];
    service_list: any = [];
    selectedDepts: any = [];
    selectedDeptIds: any = [];
    selectedDocts: any = [];
    selectedUserIds: any = [];
    selectedServices: any = [];
    selectedServiceIds: any = [];
    users_list: any = [];
    qstoDisplay: any = [];
    queuestoDisplay: any = [];
    selectedQueues: any = [];
    selectedQIds: any = [];
    deptObj;
    viewDetailsList: any = [];
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    viewId;
    providerQs: any = [];
    providerServices: any = [];
    selectedDoctors: any = [];
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
            this.getUsers();
            this.getAccountQs();
            this.getAccountServices();
            if (this.viewId) {
                this.getView(this.viewId);
            }
        });
    }
    ngOnInit() {
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
                    this.viewDetailsList = data;
                    this.customViewName = this.viewDetailsList.name;
                    this.selectedDeptIds = [];
                    this.selectedUserIds = [];
                    this.selectedServiceIds = [];
                    this.selectedQueues = [];
                    if (this.viewDetailsList && this.viewDetailsList.customViewConditions && this.viewDetailsList.customViewConditions.departments.length > 0) {
                        for (const id of this.viewDetailsList.customViewConditions.departments) {
                            this.selectedDepts.push(id.departmentId);
                            for (const dept of this.departments) {
                                if (dept.departmentId === id.departmentId) {
                                    this.selectedDeptIds.push(dept);
                                }
                            }
                        }
                    }
                    this.getUsers();
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getDepartments() {
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.deptObj = data;
                    this.departments = this.deptObj.departments;
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getServices(dotorsId?) {
        this.selectedServiceIds = [];
        let doctorsIds;
        if (dotorsId) {
            doctorsIds = dotorsId;
        } else {
            doctorsIds = this.selectedDocts;
        }
        this.provider_services.getUserServicesList(doctorsIds.toString())
            .subscribe(
                data => {
                    this.service_list = data;
                    if (this.selectedDocts.length === 0) {
                        this.service_list = this.service_list.concat(this.providerServices);
                    }
                    if (this.viewDetailsList && this.viewDetailsList.customViewConditions && this.viewDetailsList.customViewConditions.services.length > 0) {
                        for (const id of this.viewDetailsList.customViewConditions.services) {
                            this.selectedServices.push(id.id);
                            for (const service of this.service_list) {
                                if (service.id === id.id) {
                                    this.selectedServiceIds.push(service);
                                }
                            }
                        }
                        this.qSelection();
                    }
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    getQs(dotorsId?) {
        this.selectedQIds = [];
        let doctorsIds;
        if (dotorsId) {
            doctorsIds = dotorsId;
        } else {
            doctorsIds = this.selectedDocts;
        }
        this.provider_services.getUserProviderQueues(doctorsIds.toString())
            .subscribe(
                (data) => {
                    let allQs: any = [];
                    this.qstoDisplay = [];
                    allQs = data;
                    if (this.selectedDocts.length === 0) {
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
                    if (this.viewDetailsList && this.viewDetailsList.customViewConditions && this.viewDetailsList.customViewConditions.queues.length > 0) {
                        for (const id of this.viewDetailsList.customViewConditions.queues) {
                            this.selectedQueues.push(id.id);
                            for (const q of this.qstoDisplay) {
                                if (q.id === id.id) {
                                    this.selectedQIds.push(q);
                                }
                            }
                        }
                    }
                },
                (error) => {

                });
    }
    depSelected(depIds) {
        if (this.selectedDepts.indexOf(depIds) === -1) {
            this.selectedDepts.push(depIds);
            this.getUsers();
        } else {
            this.selectedDepts.splice(this.selectedDepts.indexOf(depIds), 1);
        }
    }
    doctorSelected(userIds) {
        if (this.selectedDocts.indexOf(userIds) === -1) {
            this.selectedDocts.push(userIds);
            this.getQs();
            this.getServices();
        } else {
            this.selectedDocts.splice(this.selectedDocts.indexOf(userIds), 1);
        }
        if (this.selectedDocts.length === 0) {
            this.getQs(this.selectedDoctors);
            this.getServices(this.selectedDoctors);
        }
    }
    servSelected(servIds) {
        if (this.selectedServices.indexOf(servIds) === -1) {
            this.selectedServices.push(servIds);
        } else {
            this.selectedServices.splice(this.selectedServices.indexOf(servIds), 1);
        }
        this.qSelection();
    }
    qSelection() {
        const qs = [];
        if (this.selectedServiceIds.length > 0) {
            for (let i = 0; i < this.selectedServiceIds.length; i++) {
                for (let j = 0; j < this.qstoDisplay.length; j++) {
                    for (let k = 0; k < this.qstoDisplay[j].services.length; k++) {
                        if (this.selectedServiceIds[i].id === this.qstoDisplay[j].services[k].id) {
                            qs.push(this.qstoDisplay[j]);
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
    selectedQs(QIds) {
        if (this.selectedQueues.indexOf(QIds) === -1) {
            this.selectedQueues.push(QIds);
        } else {
            this.selectedQueues.splice(this.selectedQueues.indexOf(QIds), 1);
        }
    }
    getUsers() {
        this.selectedUserIds = [];
        const apiFilter = {};
        apiFilter['userType-eq'] = 'PROVIDER';
        if (this.selectedDepts.length > 0) {
            apiFilter['departmentId-eq'] = this.selectedDepts.toString();
        }
        this.provider_services.getUsers(apiFilter).subscribe(
            (data: any) => {
                this.users_list = data;
                for (const user of this.users_list) {
                    if (this.selectedDoctors.indexOf(user.id) === -1) {
                        this.selectedDoctors.push(user.id);
                    }
                }
                if (this.viewDetailsList && this.viewDetailsList.customViewConditions && this.viewDetailsList.customViewConditions.users.length > 0) {
                    for (const id of this.viewDetailsList.customViewConditions.users) {
                        this.selectedDocts.push(id.id);
                        for (const user of this.users_list) {
                            if (user.id === id.id) {
                                this.selectedUserIds.push(user);
                            }
                        }
                    }
                    this.getQs();
                    this.getServices();
                } else {
                    this.getQs(this.selectedDoctors);
                    this.getServices(this.selectedDoctors);
                }
            }
        );
    }
    createCustomView() {
        const depids = [];
        for (const id of this.selectedDepts) {
            depids.push({ 'departmentId': id });
        }
        const userids = [];
        for (const id of this.selectedDocts) {
            userids.push({ 'id': id });
        }
        const servicesids = [];
        for (const id of this.selectedServices) {
            servicesids.push({ 'id': id });
        }
        const qids = [];
        if (this.selectedQueues.length !== 0) {
            for (const id of this.selectedQueues) {
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
                }
            );
        } else {
            this.provider_services.createCustomView(customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Created Successfully', { 'panelclass': 'snackbarerror' });
                    this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
                }
            );
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'customview']);
    }
}
