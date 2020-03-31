import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    selectedQueues: any = [];
    selectedQIds: any = [];
    deptObj;
    viewDetailsList: any = [];
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    viewId;
    breadcrumbs = [
        {
            title: 'Dashboard',
            url: '/provider'
        },
        {
            title: 'Custom View'
        }
    ];

    constructor(private _formBuilder: FormBuilder,
        public shared_functions: SharedFunctions,
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
    }
    getView(viewId) {
            this.provider_services.getCustomViewDetail(viewId)
                .subscribe(
                    data => {

                        this.viewDetailsList = data;
                        this.customViewName = this.viewDetailsList.name;
                        this.getDepartments();
                        this.selectedDeptIds = this.viewDetailsList.customViewConditions.departments;
                        console.log(this.selectedDeptIds);
                        for (const id of this.viewDetailsList.customViewConditions.departments) {
                            this.selectedDepts.push(id.departmentId);
                        }
                        this.getUsers();
                        this.selectedUserIds = this.viewDetailsList.customViewConditions.users;
                        for (const id of this.viewDetailsList.customViewConditions.users) {
                            this.selectedDocts.push(id.id);
                        }
                        this.getServices();
                        console.log(this.selectedDocts);
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
    getServices() {
        this.provider_services.getUserServicesList(this.selectedDocts.toString())
            .subscribe(
                data => {
                    this.service_list = data;
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    getQs() {
        this.provider_services.getUserProviderQueues(this.selectedDocts.toString())
            .subscribe(
                (data) => {
                    let allQs: any = [];
                    allQs = data;
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
                        if (allQs[ii].queueState === 'ENABLED') {
                            this.qstoDisplay.push(allQs[ii]);
                        }
                    }
                },
                (error) => {
                    console.log(error);
                });
    }
    depSelected(depIds) {
        console.log(depIds);
     if (this.selectedDepts.indexOf(depIds) === -1) {
             this.selectedDepts.push(depIds);
             this.getUsers();
         } else {
             this.selectedDepts.splice(this.selectedDepts.indexOf(depIds), 1);
         }
    }
    doctorSelected(userIds) {
        // this.users_list[i].selected = !this.users_list[i].selected;
        if (this.selectedDocts.indexOf(userIds) === -1) {
            this.selectedDocts.push(userIds);
            this.getServices();
            // this.users_list[index].selected = true;
        } else {
            this.selectedDocts.splice(this.selectedDocts.indexOf(userIds), 1);
            // this.users_list[index].selected = false;
        }
    }
    servSelected(servIds) {
        if (this.selectedServices.indexOf(servIds) === -1) {
            this.selectedServices.push(servIds);
            this.getQs();
        } else {
            this.selectedServices.splice(this.selectedServices.indexOf(servIds), 1);
        }
    }
    selectedQs(QIds) {
        if (this.selectedQueues.indexOf(QIds) === -1) {
            this.selectedQueues.push(QIds);
        } else {
            this.selectedQueues.splice(this.selectedQueues.indexOf(QIds), 1);
        }
    }
    userFilters() {
        let apiFilter = {};
        apiFilter['userType-eq'] = 'PROVIDER';
        apiFilter['departmentId-eq'] = this.selectedDepts.toString();
        return apiFilter;
    }
    getUsers() {
        let passingFilters = this.userFilters();
        this.provider_services.getUsers(passingFilters).subscribe(
            (data: any) => {
                this.users_list = data;
            }
        );
    }
    createCustomView() {
        let customviewFilter = {};
        customviewFilter['userId-eq'] = this.selectedDocts.toString();
        customviewFilter['departmentId-eq'] = this.selectedDepts.toString();
        customviewFilter['serviceId-eq'] = this.selectedServices.toString();
        customviewFilter['queueId-eq'] = this.selectedQueues.toString();
        const depids = [];
        for (const id of this.selectedDepts) {
            depids.push({'departmentId': id});
        }
        const userids = [];
        for (const id of this.selectedDocts) {
            userids.push({'id': id});
        }
        const servicesids = [];
        for (const id of this.selectedServices) {
            servicesids.push({'id': id});
        }
        const qids = [];
        for (const id of this.selectedQueues) {
            qids.push({'id': id});
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
                (data: any) => {
                    this.shared_functions.openSnackBar('Custom  View Updated Successfully', { 'panelclass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.createCustomView(customViewInput).subscribe(
                (data: any) => {
                    this.shared_functions.openSnackBar('Custom  View Created Successfully', { 'panelclass': 'snackbarerror' });
                }
            );
        }
    }
    depAddClicked() {
        this.getDepartments();
    }
    doctorsAddClicked() {
        this.getUsers();
    }
    servicesAddClicked() {
        this.getServices();
    }
    qAddClicked() {
        this.getQs();
    }
}
