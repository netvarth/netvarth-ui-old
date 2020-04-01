import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute } from '@angular/router';

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
            title: 'Dashboard',
            url: '/provider'
        },
        {
            title: 'Custom View'
        }
    ];

    constructor(public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices) {
        this.activated_route.queryParams.subscribe((qparams) => {
            this.viewId = qparams.id;
            if (this.viewId) {
                this.getView(this.viewId);
            }
        });
    }
    ngOnInit() {
        this.getDepartments();
        this.getUsers();
        this.getAccountQs();
        this.getAccountServices();
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
                    this.getDepartments();
                    this.selectedDeptIds = this.viewDetailsList.customViewConditions.departments;
                    for (const id of this.viewDetailsList.customViewConditions.departments) {
                        this.selectedDepts.push(id.departmentId);
                    }
                    this.getUsers();
                    this.selectedUserIds = this.viewDetailsList.customViewConditions.users;
                    for (const id of this.viewDetailsList.customViewConditions.users) {
                        this.selectedDocts.push(id.id);
                    }
                    this.getServices();
                    this.getQs();
                    this.selectedServiceIds = this.viewDetailsList.customViewConditions.services;
                    for (const id of this.viewDetailsList.customViewConditions.services) {
                        this.selectedServices.push(id.id);
                    }
                    this.selectedQIds = this.viewDetailsList.customViewConditions.queues;
                    for (const id of this.viewDetailsList.customViewConditions.queues) {
                        this.selectedQueues.push(id.id);
                    }
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
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    getQs(dotorsId?) {
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
            // this.getQs();
        } else {
            this.selectedServices.splice(this.selectedServices.indexOf(servIds), 1);
        }
        this.qSelection();
    }
    qSelection() {
        console.log(this.selectedServiceIds);
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
            console.log(qs);
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
                this.getQs(this.selectedDoctors);
                this.getServices(this.selectedDoctors);
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
                }
            );
        } else {
            this.provider_services.createCustomView(customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Created Successfully', { 'panelclass': 'snackbarerror' });
                }
            );
        }
    }
}
