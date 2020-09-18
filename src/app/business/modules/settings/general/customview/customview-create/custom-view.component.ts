import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Messages } from '../../../../../../shared/constants/project-messages';

@Component({
    selector: 'app-custom-view',
    templateUrl: './custom-view.component.html'
})
export class CustomViewComponent implements OnInit {
    customViewName;
    customViewFor = 'Waitlist';
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
    todaysQs: any = [];
    scheduledQs: any = [];
    loading = false;
    viewId;
    isDepartments = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    deptMultiFilterCtrl: FormControl = new FormControl();
    userMultiFilterCtrl: FormControl = new FormControl();
    serviceMultiFilterCtrl: FormControl = new FormControl();
    qMultiFilterCtrl: FormControl = new FormControl();
    scheduleMultiFilterCtrl: FormControl = new FormControl();
    onDestroy = new Subject<void>();
    filterDepList: any = [];
    filterUsersList: any = [];
    filterServiicesList: any = [];
    providerSds: any = [];
    schedulestoDisplay: any = [];
    selectedScheduls: any = [];
    selectedScheduleIds: any = [];
    waitlistMngr: any = [];
    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            url: '/provider/settings/general',
            title: Messages.GENERALSETTINGS
        },
        {
            title: 'Custom View'
        }
    ];
    provider_label;
    servicesList: any = [];
    serviceScheduleCount;
    serviceQCount;
    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices) {
        this.activated_route.queryParams.subscribe((qparams) => {
           // this.loading = true;
            this.viewId = qparams.id;
            this.getWaitlistMgr();
            this.getDepartments();
            this.getUsers();
            this.getProviderServices();
            this.getAccountQs();
            this.getAppointmentSchedules();
            this.provider_label = this.shared_functions.getTerminologyTerm('provider');
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
        this.scheduleMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterSchedulebySearch();
            });
        setTimeout(() => {
            if (this.viewId) {
                this.resetFields();
                this.getView(this.viewId);
            } else {
                this.loading = false;
            }
        }, 1000);
    }
    getProviderServices() {
        return new Promise((resolve) => {
            const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService' };
            if (this.selectedUsersId && this.selectedUsersId.length > 0) {
                params['provider-eq'] = this.selectedUsersId.toString();
            }
            if (this.selectedDeptIds && this.selectedDeptIds.length > 0) {
                params['department-eq'] = this.selectedDeptIds.toString();
            }
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.service_list = data;
                    this.filterServiicesList = this.service_list;
                    resolve();
                });
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
    filterSchedulebySearch() {
        if (!this.schedulestoDisplay) {
            return;
        }
        let search = this.scheduleMultiFilterCtrl.value;
        if (!search) {
            this.todaysQs = this.schedulestoDisplay.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.todaysQs = this.schedulestoDisplay.filter(q => q.name.toLowerCase().indexOf(search) > -1);
    }
    getAccountQs() {
        const params = {};
        let servcIdfrmDept = [];
        if (this.selectedUsersId && this.selectedUsersId.length > 0) {
            params['provider-eq'] = this.selectedUsersId.toString();
        }
        if (this.selectedDepartments.length > 0) {
            for (const dept of this.selectedDepartments) {
                if (dept.serviceIds.length > 0) {
                    servcIdfrmDept.push(dept.serviceIds);
                }
            }
            if (servcIdfrmDept.length > 0) {
                params['service-eq'] = servcIdfrmDept.toString();
            }
           
        }
        this.provider_services.getProviderQueues(params)
            .subscribe(
                (data: any) => {
                    let allQs: any = [];
                    this.qstoDisplay = [];
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
                        if (allQs[ii].queueState === 'ENABLED' && this.qstoDisplay.indexOf(allQs[ii]) === -1) {
                            this.qstoDisplay.push(allQs[ii]);
                        }
                    }
                    this.queuestoDisplay = this.qstoDisplay;
                });
    }
    resetFields() {
        this.selectedDepartments = [];
        this.selectedDeptIds = [];
        this.selectedUsers = [];
        this.selectedUsersId = [];
        this.selectedServices = [];
        this.selectedServiceids = [];
        this.selectedQs = [];
        this.selectedQIds = [];
        this.selectedScheduls = [];
        this.selectedScheduleIds = [];
    }
    getView(viewId) {
        this.provider_services.getCustomViewDetail(viewId)
            .subscribe(
                data => {
                    this.customViewDetails = data;
                    this.customViewName = this.customViewDetails.name;
                    this.customViewFor = this.customViewDetails.type;
                    if (this.waitlistMngr.filterByDept && this.customViewDetails.customViewConditions.departments && this.customViewDetails.customViewConditions.departments.length > 0) {
                        for (let j = 0; j < this.customViewDetails.customViewConditions.departments.length; j++) {
                            for (let i = 0; i < this.departments.length; i++) {
                                if (this.customViewDetails.customViewConditions.departments[j].departmentId === this.departments[i].departmentId) {
                                    if (this.selectedDepartments.indexOf(this.departments[i]) === -1) {
                                        this.selectedDepartments.push(this.departments[i]);
                                    }
                                    if (this.selectedDeptIds.indexOf(this.customViewDetails.customViewConditions.departments[j].departmentId) === -1) {
                                        this.selectedDeptIds.push(this.customViewDetails.customViewConditions.departments[j].departmentId);
                                    }
                                }
                            }
                            
                        }
                    } 
                    if (this.customViewDetails.customViewConditions.users && this.customViewDetails.customViewConditions.users.length > 0) {
                        for (let j = 0; j < this.customViewDetails.customViewConditions.users.length; j++) {
                            for (let i = 0; i < this.filterUsersList.length; i++) {
                                if (this.customViewDetails.customViewConditions.users[j].id === this.filterUsersList[i].id) {
                                    if (this.selectedUsers.indexOf(this.filterUsersList[i]) === -1) {
                                        this.selectedUsers.push(this.filterUsersList[i]);
                                    }
                                    if (this.selectedUsersId.indexOf(this.customViewDetails.customViewConditions.users[j].id) === -1) {
                                        this.selectedUsersId.push(this.customViewDetails.customViewConditions.users[j].id);
                                    }
                                }
                            }
                        }
                    }
                    if (this.customViewDetails.customViewConditions.services && this.customViewDetails.customViewConditions.services.length > 0) {
                        for (let j = 0; j < this.customViewDetails.customViewConditions.services.length; j++) {
                            for (let i = 0; i < this.filterServiicesList.length; i++) {
                                if (this.customViewDetails.customViewConditions.services[j].id === this.filterServiicesList[i].id) {
                                    if (this.selectedServices.indexOf(this.filterServiicesList[i]) === -1) {
                                        this.selectedServices.push(this.filterServiicesList[i]);
                                    }
                                    if (this.selectedServiceids.indexOf(this.customViewDetails.customViewConditions.services[j].id) === -1) {
                                        this.selectedServiceids.push(this.customViewDetails.customViewConditions.services[j].id);
                                    }
                                }
                            }
                        }
                    }
                    if (this.viewId && this.customViewDetails.customViewConditions.queues && this.customViewDetails.customViewConditions.queues.length > 0) {
                        for (let j = 0; j < this.customViewDetails.customViewConditions.queues.length; j++) {
                            for (let i = 0; i < this.queuestoDisplay.length; i++) {
                                if (this.customViewDetails.customViewConditions.queues[j].id === this.queuestoDisplay[i].id) {
                                    if (this.selectedQs.indexOf(this.queuestoDisplay[i]) === -1) {
                                        this.selectedQs.push(this.queuestoDisplay[i]);
                                    }
                                    if (this.selectedQIds.indexOf(this.customViewDetails.customViewConditions.queues[j].id) === -1) {
                                        this.selectedQIds.push(this.customViewDetails.customViewConditions.queues[j].id);
                                    }
                                }
                            }
                        }
                    }
                    if (this.viewId && this.customViewDetails.customViewConditions.schedules && this.customViewDetails.customViewConditions.schedules.length > 0) {
                        for (let j = 0; j < this.customViewDetails.customViewConditions.schedules.length; j++) {
                            for (let i = 0; i < this.schedulestoDisplay.length; i++) {
                                if (this.customViewDetails.customViewConditions.schedules[j].id === this.schedulestoDisplay[i].id) {
                                    if (this.selectedScheduls.indexOf(this.schedulestoDisplay[i]) === -1) {
                                        this.selectedScheduls.push(this.schedulestoDisplay[i]);
                                    }
                                    if (this.selectedScheduleIds.indexOf(this.customViewDetails.customViewConditions.schedules[j].id) === -1) {
                                        this.selectedScheduleIds.push(this.customViewDetails.customViewConditions.schedules[j].id);
                                    }
                                }
                            }
                        }
                    }
                    // console.log(this.users_list);
                    // else {
                    //     this.departmentSelection();
                    // }
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }

    departmentSelection() {
        if (this.customViewDetails.customViewConditions.users && this.customViewDetails.customViewConditions.users.length > 0) {
            for (let j = 0; j < this.customViewDetails.customViewConditions.users.length; j++) {
                for (let i = 0; i < this.filterUsersList.length; i++) {
                    if (this.customViewDetails.customViewConditions.users[j].id === this.filterUsersList[i].id) {
                        if (this.selectedUsers.indexOf(this.filterUsersList[i]) === -1) {
                            this.selectedUsers.push(this.filterUsersList[i]);
                        }
                        if (this.selectedUsersId.indexOf(this.customViewDetails.customViewConditions.users[j].id) === -1) {
                            this.selectedUsersId.push(this.customViewDetails.customViewConditions.users[j].id);
                        }
                    }
                }
                if (j < this.customViewDetails.customViewConditions.users.length) {
                   // this.getProviderServices();
                    if (this.customViewFor === 'Appointment') {
                        this.getAppointmentSchedules();
                    } else {
                        this.getAccountQs();
                    }
                    setTimeout(() => {
                        this.userSelection();
                    }, 500);
                }
            }
        } else {
            this.userSelection();
        }
    }

    userSelection() {
        if (this.customViewDetails.customViewConditions.services && this.customViewDetails.customViewConditions.services.length > 0) {
            for (let j = 0; j < this.customViewDetails.customViewConditions.services.length; j++) {
                for (let i = 0; i < this.filterServiicesList.length; i++) {
                    if (this.customViewDetails.customViewConditions.services[j].id === this.filterServiicesList[i].id) {
                        if (this.selectedServices.indexOf(this.filterServiicesList[i]) === -1) {
                            this.selectedServices.push(this.filterServiicesList[i]);
                        }
                        if (this.selectedServiceids.indexOf(this.customViewDetails.customViewConditions.services[j].id) === -1) {
                            this.selectedServiceids.push(this.customViewDetails.customViewConditions.services[j].id);
                        }
                    }
                }
                if (j < this.customViewDetails.customViewConditions.services.length) {
                    if (this.customViewFor === 'Appointment') {
                        this.getAppointmentSchedules();
                    } else {
                        this.getAccountQs();
                    }
                    setTimeout(() => {
                        // if (this.customViewFor === 'Appointment') {
                        //     this.apptServiceSelection();
                        // } else {
                        //     this.checkinServiceSelection();
                        // }
                    }, 500);
                }
            }
        } else {
            // if (this.customViewFor === 'Appointment') {
            //     this.apptServiceSelection();
            // } else {
            //     this.checkinServiceSelection();
            // }
        }
    }
    setServiceIds(service) {
        this.selectedQs = [];
        this.selectedQIds = [];
        this.selectedScheduls = [];
        this.selectedScheduleIds = [];
        const index = this.selectedServiceids.indexOf(service);
        if (index === -1) {
            this.selectedServiceids.push(service);
        } else {
            this.selectedServiceids.splice(index, 1);
        }
        if (this.customViewFor === 'Appointment') {
            this.apptServiceSelection();
        } else {
            this.checkinServiceSelection();
        }
    }
    queueSelection(queue) {
        const index = this.selectedQIds.indexOf(queue);
        if (index === -1) {
            this.selectedQIds.push(queue);
        } else {
            this.selectedQIds.splice(index, 1);
        }
    }
    setDeptIds(dept) {
        this.selectedUsers = [];
        this.selectedUsersId = [];
        this.selectedServices = [];
        this.selectedServiceids = [];
        this.selectedQs = [];
        this.selectedQIds = [];
        this.selectedScheduls = [];
        this.selectedScheduleIds = [];
        const index = this.selectedDeptIds.indexOf(dept);
        if (index === -1) {
            this.selectedDeptIds.push(dept);
        } else {
            this.selectedDeptIds.splice(index, 1);
        }
        this.getUsers();
        this.getProviderServices();
        if (this.customViewFor === 'Appointment') {
            this.getAppointmentSchedules();
        } else {
            this.getAccountQs();
        }
    }

    setUsersIds(userId) {
        this.selectedServices = [];
        this.selectedServiceids = [];
        this.selectedQs = [];
        this.selectedQIds = [];
        this.selectedScheduls = [];
        this.selectedScheduleIds = [];
        const index = this.selectedUsersId.indexOf(userId);
        if (index === -1) {
            this.selectedUsersId.push(userId);
        } else {
            this.selectedUsersId.splice(index, 1);
        }
         this.getProviderServices();
        if (this.customViewFor === 'Appointment') {
            this.getAppointmentSchedules();
        } else {
            this.getAccountQs();
        }
    }
    checkinServiceSelection() {
        this.qstoDisplay = [];
        if (this.selectedServices && this.selectedServices.length > 0) {
            for (let i = 0; i < this.selectedServices.length; i++) {
                for (let j = 0; j < this.queuestoDisplay.length; j++) {
                    for (let k = 0; k < this.queuestoDisplay[j].services.length; k++) {
                        if (this.queuestoDisplay[j].services[k].id === this.selectedServices[i].id && this.qstoDisplay.indexOf(this.queuestoDisplay[j]) === -1) {
                            this.qstoDisplay.push(this.queuestoDisplay[j]);
                        }
                    }
                }
            }
            this.serviceQCount = this.qstoDisplay.length;
        } else {
            this.qstoDisplay = this.queuestoDisplay;
            this.serviceQCount = this.qstoDisplay.length;
        }
        if (this.viewId && this.customViewDetails.customViewConditions.queues && this.customViewDetails.customViewConditions.queues.length > 0) {
            for (let j = 0; j < this.customViewDetails.customViewConditions.queues.length; j++) {
                for (let i = 0; i < this.queuestoDisplay.length; i++) {
                    if (this.customViewDetails.customViewConditions.queues[j].id === this.queuestoDisplay[i].id) {
                        if (this.selectedQs.indexOf(this.queuestoDisplay[i]) === -1) {
                            this.selectedQs.push(this.queuestoDisplay[i]);
                        }
                        if (this.selectedQIds.indexOf(this.customViewDetails.customViewConditions.queues[j].id) === -1) {
                            this.selectedQIds.push(this.customViewDetails.customViewConditions.queues[j].id);
                        }
                    }
                }
            }
        }
        this.loading = false;
    }

    apptServiceSelection() {
        this.todaysQs = [];
        if (this.selectedServices && this.selectedServices.length > 0) {
            for (let i = 0; i < this.selectedServices.length; i++) {
                for (let j = 0; j < this.schedulestoDisplay.length; j++) {
                    for (let k = 0; k < this.schedulestoDisplay[j].services.length; k++) {
                        if (this.schedulestoDisplay[j].services[k].id === this.selectedServices[i].id && this.todaysQs.indexOf(this.queuestoDisplay[j]) === -1) {
                            this.todaysQs.push(this.schedulestoDisplay[j]);
                        }
                    }
                }
            }
            this.serviceScheduleCount = this.todaysQs.length;
        } else {
            this.todaysQs = this.schedulestoDisplay;
            this.serviceScheduleCount = this.todaysQs.length;
        }
        if (this.viewId && this.customViewDetails.customViewConditions.schedules && this.customViewDetails.customViewConditions.schedules.length > 0) {
            for (let j = 0; j < this.customViewDetails.customViewConditions.schedules.length; j++) {
                for (let i = 0; i < this.schedulestoDisplay.length; i++) {
                    if (this.customViewDetails.customViewConditions.schedules[j].id === this.schedulestoDisplay[i].id) {
                        if (this.selectedScheduls.indexOf(this.schedulestoDisplay[i]) === -1) {
                            this.selectedScheduls.push(this.schedulestoDisplay[i]);
                        }
                        if (this.selectedScheduleIds.indexOf(this.customViewDetails.customViewConditions.schedules[j].id) === -1) {
                            this.selectedScheduleIds.push(this.customViewDetails.customViewConditions.schedules[j].id);
                        }
                    }
                }
            }
        }
        this.loading = false;
    }
    getDepartments() {
        this.provider_services.getDepartments()
            .subscribe(
                (data: any) => {
                    this.isDepartments = true;
                    this.departments = [];
                    this.filterDepList = [];
                    this.departments = data.departments.filter(depart => depart.departmentStatus === 'ACTIVE');
                    this.filterDepList = this.departments;
                    this.getUsers();
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                    this.isDepartments = false;
                }
            );
    }
    getWaitlistMgr() {
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.waitlistMngr = data;
                });
    }

    getAppointmentSchedules() {
        const params = {};
       let servcIdfrmDept = [];
        if (this.selectedDepartments.length > 0) {
            for (const dept of  this.selectedDepartments) {
                if (dept.serviceIds.length > 0) {
                    servcIdfrmDept.push(dept.serviceIds);
                }

            }
            if (servcIdfrmDept.length > 0) {
                params['service-eq'] = servcIdfrmDept.toString();
            }
        }
        if (this.selectedUsersId && this.selectedUsersId.length > 0) {
            params['provider-eq'] = this.selectedUsersId.toString();
        }
        
        this.provider_services.getProviderSchedules(params)
            .subscribe(
                (data) => {
                    let allQs: any = [];
                    this.todaysQs = [];
                    allQs = data;
                    if (this.selectedUsersId.length === 0) {
                        allQs = allQs.concat(this.providerSds);
                    }
                    for (let ii = 0; ii < allQs.length; ii++) {
                        let schedule_arr = [];
                        if (allQs[ii].apptSchedule) {
                            schedule_arr = this.shared_functions.queueSheduleLoop(allQs[ii].apptSchedule);
                        }
                        let display_schedule = [];
                        display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                        allQs[ii]['displayschedule'] = display_schedule;
                    }
                    for (let ii = 0; ii < allQs.length; ii++) {
                        if (allQs[ii].apptState === 'ENABLED' && this.todaysQs.indexOf(allQs[ii]) === -1) {
                            this.todaysQs.push(allQs[ii]);
                        }
                    }
                    this.schedulestoDisplay = this.todaysQs;
                },
                (error) => {
                });
    }

    scheduleSelection(QIds) {
        if (this.selectedScheduleIds.indexOf(QIds) === -1) {
            this.selectedScheduleIds.push(QIds);
        } else {
            this.selectedScheduleIds.splice(this.selectedScheduleIds.indexOf(QIds), 1);
        }
    }
    getUsers() {
        const apiFilter = {};
        apiFilter['userType-eq'] = 'PROVIDER';
        apiFilter['status-eq'] = 'ACTIVE';
        if (this.selectedDeptIds.length > 0) {
            apiFilter['departmentId-eq'] = this.selectedDeptIds.toString();
        }
        this.provider_services.getUsers(apiFilter).subscribe(
            (data: any) => {
                this.users_list = data;
                this.filterUsersList = this.users_list;
            }
        );
    }
    createCustomView() {
        let depids = [];
        if (this.selectedDeptIds.length > 0) {
            for (const id of this.selectedDeptIds) {
                depids.push({ 'departmentId': id });
            }
        } else {
            depids = null;
        }
        let userids = [];
        if (this.selectedUsersId.length > 0) {
            for (const id of this.selectedUsersId) {
                userids.push({ 'id': id });
            }
        } else {
            userids = null;
        }
        let servicesids = [];
        if (this.selectedServiceids.length > 0) {
            for (const id of this.selectedServiceids) {
                servicesids.push({ 'id': id });
            }
        } else {
            servicesids = null;
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
        const sheduleids = [];
        if (this.selectedScheduleIds.length !== 0) {
            for (const id of this.selectedScheduleIds) {
                sheduleids.push({ 'id': id });
            }
        } else {
            for (const id of this.todaysQs) {
                sheduleids.push({ 'id': id.id });
            }
        }
        let customViewInput;
        if (this.customViewFor === 'Waitlist') {
            customViewInput = {
                'name': this.customViewName,
                'merged': true,
                'customViewConditions': {
                    'departments': depids,
                    'users': userids,
                    'services': servicesids,
                    'queues': qids
                },
                'type': this.customViewFor
            };
        } else {
            customViewInput = {
                'name': this.customViewName,
                'merged': true,
                'customViewConditions': {
                    'departments': depids,
                    'users': userids,
                    'services': servicesids,
                    'schedules': sheduleids
                },
                'type': this.customViewFor
            };
        }
        if (this.viewId) {
            this.provider_services.updateCustomView(this.viewId, customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Updated Successfully', { 'panelclass': 'snackbarerror' });
                    this.router.navigate(['provider', 'settings', 'general', 'customview']);
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            this.provider_services.createCustomView(customViewInput).subscribe(
                (data) => {
                    this.shared_functions.openSnackBar('Custom  View Created Successfully', { 'panelclass': 'snackbarerror' });
                    this.router.navigate(['provider', 'settings', 'general', 'customview']);
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'general', 'customview']);
    }
    redirecToGeneral() {
        this.router.navigate(['provider', 'settings' , 'general' , 'customview']);
    }
}
