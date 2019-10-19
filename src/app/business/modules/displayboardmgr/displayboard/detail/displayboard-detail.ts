import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../shared/constants/project-constants';

@Component({
    selector: 'app-displayboard-detail',
    templateUrl: './displayboard-detail.html'
})
export class DisplayboardDetailComponent implements OnInit {
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    dept_data;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    api_loading1 = true;
    sboard_id;
    action = 'show';
    deptObj;
    boardInfo = {
        'name': null,
        'displayname': null,
    };
    api_loading: boolean;
    departments: any = [];
    services_list: any = [];
    loading = true;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Displayboards',
            url: '/provider/settings/displayboard/list'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam;
    display_schedule: any = [];
    defaultLables: any = [];
    showLabelEdit: any = [];
    selectedCategory = 'SERVICE';
    fieldDisplayname: any = [];
    filedDefaultvalue: any = [];
    fieldArray: any = [];
    statusBoardfor: any = [];
    displayBoardData: any = [];
    boardName;
    boardDisplayname;
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute
    ) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.action;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.sboard_id = qparams.id;
                this.getProviderServices();
                this.getDepartments();
                this.getProviderQueues();
                this.getLablels();
                if (this.sboard_id) {
                    this.getDisplaydashboardbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
    }
    ngOnInit() {
        this.getLablels();
    }
    getDisplaydashboardbyId(id) {
        this.provider_services.getDisplayboardbyId(id).subscribe(data => {
            this.displayBoardData = data;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: this.displayBoardData.displayName
            });
            this.breadcrumbs = breadcrumbs;

            this.boardName = this.displayBoardData.name;
            this.boardDisplayname = this.displayBoardData.displayName;
            for (let i = 0; i < this.displayBoardData.statusBoardFor.length; i++) {
                this.selectedCategory = this.displayBoardData.statusBoardFor[i].type;
                if (this.displayBoardData.statusBoardFor[i].type === 'SERVICE') {
                    for (let j = 0; j < this.displayBoardData.statusBoardFor[i].id.length; j++) {
                        for (let k = 0; k < this.services_list.length; k++) {
                            if (this.services_list[k].id === this.displayBoardData.statusBoardFor[i].id[j]) {
                                this.services_list[k].checked = true;
                                this.serviceSelection(this.services_list[k]);
                            }
                        }
                    }
                }


                if (this.displayBoardData.statusBoardFor[i].type === 'QUEUE') {
                    for (let j = 0; j < this.displayBoardData.statusBoardFor[i].id.length; j++) {
                        for (let k = 0; k < this.display_schedule.length; k++) {
                            if (this.display_schedule[k].id === this.displayBoardData.statusBoardFor[i].id[j]) {
                                this.display_schedule[k].checked = true;
                                this.queueSelection(this.display_schedule[k]);
                            } else {
                                this.display_schedule[k].checked = false;
                            }
                        }
                    }
                }




                if (this.displayBoardData.statusBoardFor[i].type === 'DEPARTMENT') {
                    for (let j = 0; j < this.displayBoardData.statusBoardFor[i].id.length; j++) {
                        for (let k = 0; k < this.departments.length; k++) {
                            if (this.departments[k].departmentId === this.displayBoardData.statusBoardFor[i].id[j]) {
                                this.departments[k].checked = true;
                                this.departmentSelection(this.departments[k]);
                            } else {
                                this.departments[k].checked = false;
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < this.displayBoardData.fieldList.length; i++) {
                // if (!this.displayBoardData.fieldList[i].label) {
                for (let j = 0; j < this.defaultLables.length; j++) {
                    // alert(this.displayBoardData.fieldList[i].name + '=' + this.defaultLables[j].name);
                    if (this.displayBoardData.fieldList[i].name === this.defaultLables[j].name) {
                        this.fieldDisplayname[i] = this.displayBoardData.fieldList[i].displayName;
                        if (this.displayBoardData.fieldList[i].defaultValue) {
                            this.filedDefaultvalue[i] = this.displayBoardData.fieldList[i].defaultValue;
                        }

                        this.defaultLables[j].checked = true;
                        this.lableSelection(j);
                    }
                    // else {
                    //     this.defaultLables[j].checked = false;
                    // }
                    console.log(this.defaultLables[j].checked);
                }
                // }
            }
            console.log(this.defaultLables);

        });
    }

    editStatusBoard(id) {
        this.actionparam = 'edit';
        this.getDisplaydashboardbyId(id);
    }

    onSubmit() {
        if (this.actionparam === 'add') {
            const post_data = {
                'name': this.boardName,
                'displayName': this.boardDisplayname,
                'fieldList': this.fieldArray,
                'statusBoardFor': this.statusBoardfor
            };
            this.provider_services.createDisplayboard(post_data).subscribe(data => {

            });
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.displayBoardData.id,
                'name': this.boardName,
                'displayName': this.boardDisplayname,
                'fieldList': this.fieldArray,
                'statusBoardFor': this.statusBoardfor
            };
            this.provider_services.updateDisplayboard(post_data).subscribe(data => {

            });
        }
    }
    onCancel() {
        this.router.navigate(['provider/settings/displayboard/list']);
    }

    getProviderServices() {
        this.api_loading1 = true;
        const params = { 'status': 'ACTIVE' };
        this.provider_services.getServicesList(params)
            .subscribe(data => {
                this.services_list = data;
            });
        this.api_loading1 = false;
    }
    getDepartments() {
        this.loading = false;
        this.departments = [];
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.deptObj = data;
                    for (let i = 0; i < this.deptObj.departments.length; i++) {
                        if (this.deptObj.departments[i].departmentStatus === 'ACTIVE') {
                            this.departments.push(this.deptObj.departments[i]);
                        }
                    }
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getProviderQueues() {
        const activeQueues: any = [];
        let queue_list: any = [];
        this.provider_services.getProviderQueues()
            .subscribe(data => {
                this.display_schedule = data;
                for (let ii = 0; ii < this.display_schedule.length; ii++) {
                    let schedule_arr = [];
                    if (this.display_schedule[ii].queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.display_schedule[ii].queueSchedule);
                    }
                    queue_list = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                    this.display_schedule[ii].displayQ = queue_list[0];
                    if (this.display_schedule[ii].queueState === 'ENABLED') {
                        activeQueues.push(this.display_schedule[0]);
                    }
                }
                this.provider_shared_functions.setActiveQueues(activeQueues);
            });
    }
    resetApiErrors() {
    }

    getLablels() {
        this.defaultLables = projectConstants.STATUS_BOARD;
        console.log(this.defaultLables);
    }
    lableSelection(index) {
        (this.defaultLables[index].checked) ? this.showLabelEdit[index] = true : this.showLabelEdit[index] = false;
        this.fieldDisplayname[index] = this.defaultLables[index].displayname;

    }
    categorySelection(value) {
        this.selectedCategory = value;
    }
    saveLabels(index) {
        this.fieldArray.push({
            'name': this.defaultLables[index].name,
            'displayName': this.fieldDisplayname[index],
            // 'defaultValue': 'string',
            'label': this.defaultLables[index].label,
            'order': index
        });
    }
    serviceSelection(service) {
        this.statusBoardfor = [{
            'type': 'SERVICE',
            'id': [
                service.id
            ]
        }];
    }
    departmentSelection(dept) {
        this.statusBoardfor = [{
            'type': 'DEPARTMENT',
            'id': [
                dept.departmentId
            ]
        }];
    }
    queueSelection(queue) {
        this.statusBoardfor = [{
            'type': 'QUEUE',
            'id': [
                queue.id
            ]
        }];
    }
    getNamefromId(id, type) {
        let displayName;
        if (type === 'SERVICE') {
            for (let i = 0; i < this.services_list.length; i++) {
                if (this.services_list[i].id === id) {
                    displayName = this.services_list[i].name;
                }
            }
        } else if (type === 'QUEUE') {
            for (let i = 0; i < this.display_schedule.length; i++) {
                if (this.display_schedule[i].id === id) {
                    displayName = this.display_schedule[i].name + ' ' + this.display_schedule[i].displayQ.dstr + ' ' + this.display_schedule[i].displayQ.time;
                }
            }
        } else if (type === 'DEPARTMENT') {
            for (let i = 0; i < this.departments.length; i++) {
                if (this.departments[i].departmentId === id) {
                    displayName = this.departments[i].departmentName;
                }
            }
        }
        return displayName;
    }
}
