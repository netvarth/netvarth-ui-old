import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../shared/constants/project-constants';


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
    allUsersIds: any = [];
    todaysQs: any = [];
    scheduledQs: any = [];
    loading = true;
    viewId;
    isDepartments = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    deptMultiFilterCtrl: FormControl = new FormControl();
    userMultiFilterCtrl: FormControl = new FormControl();
    serviceMultiFilterCtrl: FormControl = new FormControl();
    qMultiFilterCtrl: FormControl = new FormControl();
    scheduleMultiFilterCtrl : FormControl = new FormControl();
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
            url: '/provider/settings/general',
            title: Messages.GENERALSETTINGS
        },
        {
            title: 'Custom View'
        }
    ];
    provider_label;

    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices) {
        this.activated_route.queryParams.subscribe((qparams) => {
            this.viewId = qparams.id;
            this.getDepartments();
            this.getAccountQs();
            this.getAccountServices();
            this.provider_label = this.shared_functions.getTerminologyTerm('provider');
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
            'scope-eq': 'account',
            'serviceType-neq': 'donationService'
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
                    console.log(this.customViewDetails)
                    this.customViewName = this.customViewDetails.name;
                    this.customViewFor = this.customViewDetails.type;
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
                        if (this.customViewFor === 'Waitlist'){
                            this.getQs();
                        }else {
                            this.getAppointmentSchedules();
                        }
                        
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
                    this.isDepartments = true;
                    this.departments = data.departments;
                    this.filterDepList = data.departments;
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                    this.isDepartments = false;
                }
            );
    }
    getServices() {
        
        let doctorsIds;
        let departmentIds;
        if(this.selectedDeptIds.length > 0){
            departmentIds = this.selectedDeptIds;
        }
        if (this.selectedUsersId.length > 0) {
            doctorsIds = this.selectedUsersId;
        } else {
            doctorsIds = this.allUsersIds;
        }

        let filter;
            if(departmentIds && departmentIds.length > 0){
                 filter = {
                     'department-eq' : departmentIds.toString()
                };
            }
            if (doctorsIds && doctorsIds.length > 0){
                filter = {
                   'provider-eq': doctorsIds.toString()
               };
            }
        this.provider_services.getUserServicesList(filter)
            .subscribe(
                data => {
                    this.service_list = data;
                    console.log("Services by dep :", this.service_list)
                    if (this.selectedUsersId.length === 0 && this.selectedDeptIds.length == 0) {
                        this.service_list = this.service_list.concat(this.providerServices);
                    }
                    console.log(this.service_list)
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

    getAppointmentSchedules() {
        let doctorsIds;
        if (this.selectedUsersId.length > 0) {
            doctorsIds = this.selectedUsersId;
        }
        // } else {
        //     doctorsIds = this.allUsersIds;
        // }
        console.log(doctorsIds)
        return new Promise((resolve, reject) => {
            let filter;
            if(doctorsIds && doctorsIds.length>0){
                 filter = {
                    'provider-eq': doctorsIds.toString()
                };
            }
            this.provider_services.getProviderSchedules(filter)
                .subscribe(
                    (data) => {
                        console.log(data);
                        let allQs: any = [];
                        this.todaysQs = [];
                        this.scheduledQs = [];
                        
                        const activeQs = [];
                        allQs = data;
                        console.log(allQs);
                        const server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
                        const todaydt = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                        const today = new Date(todaydt);
                        const dd = today.getDate();
                        const mm = today.getMonth() + 1;
                        const yyyy = today.getFullYear();
                        let cmon;
                        let cdate;
                        if (mm < 10) {
                            cmon = '0' + mm;
                        } else {
                            cmon = '' + mm;
                        }
                        if (dd < 10) {
                            cdate = '0' + dd;
                        } else {
                            cdate = '' + dd;
                        }
                        const todayDate = yyyy + '-' + cmon + '-' + cdate;
                        for (let ii = 0; ii < allQs.length; ii++) {
                            let schedule_arr = [];
                            // extracting the schedule intervals
                            if (allQs[ii].apptSchedule) {
                                schedule_arr = this.shared_functions.queueSheduleLoop(allQs[ii].apptSchedule);
                            }
                            let display_schedule = [];
                            display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                            allQs[ii]['displayschedule'] = display_schedule;
                            if (allQs[ii].apptState === 'ENABLED') {
                                this.todaysQs.push(allQs[ii]);
                                console.log("qs",this.todaysQs)
                            }
                        }
                        resolve();
                    },
                    (error) => {
                        console.log(error);
                        reject(error);
                    });
        });
    }



    
    deptSelection(depIds) {
        if (this.selectedDeptIds.indexOf(depIds) === -1) {
            this.selectedDeptIds.push(depIds);
            this.getUsers();
        } else {
            this.selectedDeptIds.splice(this.selectedDeptIds.indexOf(depIds), 1);
        }
        this.getServices();
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
        if (this.customViewFor === 'Waitlist'){
            this.getQs();
        }else {
            this.getAppointmentSchedules();
        }
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
        if (this.customViewFor === 'Waitlist'){
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
        }else{
            const qs = [];
            if (this.selectedServices.length > 0) {
                for (let i = 0; i < this.selectedServices.length; i++) {
                    for (let j = 0; j < this.todaysQs.length; j++) {
                        for (let k = 0; k < this.todaysQs[j].services.length; k++) {
                            if (this.selectedServices[i].id === this.todaysQs[j].services[k].id) {
                                qs.push(this.todaysQs[j]);
                            }
                        }
                    }
                }
                this.qstoDisplay = qs;
                return false;
            } else {
                this.qstoDisplay = this.todaysQs;
            }
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
                        this.getAppointmentSchedules();
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
        let customViewInput;
        if(this.customViewFor == 'Waitlist'){
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
        }else {
             customViewInput = {
                'name': this.customViewName,
                'merged': true,
                'customViewConditions': {
                    'departments': depids,
                    'users': userids,
                    'services': servicesids,
                    'schedules': qids
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
}