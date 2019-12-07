import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../../shared/constants/project-constants';

@Component({
    selector: 'app-displayboard-qset-detail',
    templateUrl: './displayboard-qset-detail.component.html'
})
export class DisplayboardQSetDetailComponent implements OnInit, OnChanges {
    cancel_btn = Messages.CANCEL_BTN;
    service_caption = Messages.SERVICES_CAP;
    department_cap = Messages.DEPARTMENT_CAP;
    queue_cap = Messages.WORKING_HRS_CAP;
    category = Messages.AUDIT_CATEGORY_CAP;
    sboard_id;
    deptObj;
    @Input() action;
    @Input() qsetId;
    @Input() source;
    @Output() idSelected = new EventEmitter<any>();
    departments: any = [];
    services_list: any = [];
    // breadcrumbs_init = [
    //     {
    //         title: 'Settings',
    //         url: '/provider/settings'
    //     },
    //     {
    //         title: Messages.WAITLIST_MANAGE_CAP,
    //         url: '/provider/settings/q-manager'
    //     },
    //     {
    //         title: 'Queue Statusboards',
    //         url: '/provider/settings/q-manager/displayboards'
    //     },
    //     {
    //         title: 'Queue-Set',
    //         url: '/provider/settings/q-manager/displayboards/q-set'
    //     }
    // ];
    // breadcrumbs = this.breadcrumbs_init;
    actionparam;
    display_schedule: any = [];
    defaultLables: any = [];
    showLabelEdit: any = [];
    selectedCategory = 'SERVICE';
    selectedCategoryValue;
    labelDisplayname: any = [];
    labelDefaultvalue: any = [];
    labelOrder: any = [];
    labelsList: any = [];
    statusBoardfor: any = [];
    displayBoardData: any = [];
    boardName;
    boardDisplayname;
    providerLabels: any = [];
    labelfromConstants = projectConstants.STATUS_BOARD;
    submit_btn;
    id;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private activated_route: ActivatedRoute
    ) {
        this.resetFields();
        // this.activated_route.params.subscribe(params => {
        //     // this.actionparam = params.id;
        // }
        // );
        // this.getProviderServices();
        // this.getDepartments();
        // this.getProviderQueues();
        // alert(this.id);
        // if (this.id) {
        //     this.getDisplaydashboardbyId(this.id);
        //     this.submit_btn = Messages.UPDATE_BTN;
        // } else {
        //     this.submit_btn = Messages.SAVE_BTN;
        //     this.getLabels();
        //     // const breadcrumbs = [];
        //     // this.breadcrumbs_init.map((e) => {
        //     //     breadcrumbs.push(e);
        //     // });
        //     // breadcrumbs.push({
        //     //     title: 'Add'
        //     // });
        //     // this.breadcrumbs = breadcrumbs;
        // }
        // });
    }
    ngOnInit() {
        this.resetFields();
    }
    resetFields() {
        this.boardDisplayname = '';
        this.boardName = '';
        this.labelsList = [];
        this.statusBoardfor = [];
    }
    ngOnChanges() {
        this.id = this.qsetId;
        this.resetFields();
        this.actionparam = this.action;
        // this.id = this.id;
        this.getProviderServices();
        this.getDepartments();
        this.getProviderQueues();
        if (this.id) {
            this.getDisplaydashboardbyId(this.id);
            this.submit_btn = Messages.UPDATE_BTN;
        } else {
            this.submit_btn = Messages.SAVE_BTN;
            this.getLabels();
            // const breadcrumbs = [];
            // this.breadcrumbs_init.map((e) => {
            //     breadcrumbs.push(e);
            // });
            // breadcrumbs.push({
            //     title: 'Add'
            // });
            // this.breadcrumbs = breadcrumbs;
        }
        // });
    }
    getDisplaydashboardbyId(id) {
        this.getLabels();
        this.provider_services.getDisplayboardQSetbyId(id).subscribe(data => {
            this.displayBoardData = data;
            const breadcrumbs = [];
            // this.breadcrumbs_init.map((e) => {
            //     breadcrumbs.push(e);
            // });
            // breadcrumbs.push({
            //     title: this.displayBoardData.displayName
            // });
            // this.breadcrumbs = breadcrumbs;
            this.boardName = this.displayBoardData.name;
            this.boardDisplayname = this.displayBoardData.displayName;
            for (let i = 0; i < this.displayBoardData.statusBoardFor.length; i++) {
                this.selectedCategory = this.displayBoardData.statusBoardFor[i].type;
                this.selectedCategoryValue = this.displayBoardData.statusBoardFor[i].id[0];
                if (this.displayBoardData.statusBoardFor[i].type === 'SERVICE') {
                    this.serviceSelection(this.displayBoardData.statusBoardFor[i].id[0]);
                }
                if (this.displayBoardData.statusBoardFor[i].type === 'QUEUE') {
                    this.queueSelection(this.displayBoardData.statusBoardFor[i].id[0]);
                }
                if (this.displayBoardData.statusBoardFor[i].type === 'DEPARTMENT') {
                    this.departmentSelection(this.displayBoardData.statusBoardFor[i].id[0]);
                }
            }
            for (let i = 0; i < this.displayBoardData.fieldList.length; i++) {
                for (let j = 0; j < this.defaultLables.length; j++) {
                    if (this.displayBoardData.fieldList[i].name === this.defaultLables[j].name) {
                        this.labelDisplayname[j] = this.displayBoardData.fieldList[i].displayName;
                        this.labelOrder[j] = this.displayBoardData.fieldList[i].order;
                        if (this.displayBoardData.fieldList[i].defaultValue) {
                            this.labelDefaultvalue[j] = this.displayBoardData.fieldList[i].defaultValue;
                        }
                        this.defaultLables[j].checked = true;
                        this.labelSelection(j, 'edit');
                    }
                }
            }
        });
    }
    editStatusBoard(id) {
        this.source = 'QLIST';
        this.actionparam = 'edit';
        this.getDisplaydashboardbyId(id);
    }
    goBack() {
        const actionObj = {
            source: 'DBOARD'
        };
        this.idSelected.emit(actionObj);
    }
    onSubmit() {
        let name = '';
        if (this.boardDisplayname) {
            name = this.boardDisplayname.trim().replace(/ /g, ' ');
        }
        if (this.actionparam === 'add') {
            const post_data = {
                'name': name,
                'displayName': this.boardDisplayname,
                'fieldList': this.labelsList,
                'statusBoardFor': this.statusBoardfor
            };
            this.provider_services.createDisplayboardQSet(post_data).subscribe(data => {
                // this.shared_Functionsobj.openSnackBar('Displayboard added successfully', { 'panelclass': 'snackbarerror' });
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('QSET_ADD'), { 'panelclass': 'snackbarerror' });
                // this.getDisplaydashboardbyId(data);
                // this.actionparam = 'view';
                const actionObj = {
                    source: this.source,
                    refresh: true
                };
                if (this.source === 'DBOARD') {
                    this.idSelected.emit(actionObj);
                    return false;
                } else if (this.source === 'QLIST') {
                    this.idSelected.emit(actionObj);
                    return false;
                }
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
            // } else {
            //     this.shared_Functionsobj.openSnackBar('Please enter the name for your queue-set', { 'panelClass': 'snackbarerror' });
            // }
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.displayBoardData.id,
                'name': name,
                'displayName': this.boardDisplayname,
                'fieldList': this.labelsList,
                'statusBoardFor': this.statusBoardfor
            };
            this.provider_services.updateDisplayboardQSet(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('QSET_UPDATE'), { 'panelclass': 'snackbarerror' });
                // this.getDisplaydashboardbyId(this.displayBoardData.id);
                const actionObj = {
                    source: this.source,
                    refresh: true
                };
                if (this.source === 'DBOARD') {
                    this.idSelected.emit(actionObj);
                    return false;
                } else if (this.source === 'QLIST') {
                    this.idSelected.emit(actionObj);
                    return false;
                }
                this.actionparam = 'view';
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    onCancel() {
        console.log(this.source);
        const actionObj = {
            source: this.source
        };
        if (this.source === 'DBOARD') {
            this.idSelected.emit(actionObj);
            return false;
        } else if (this.source === 'QLIST') {
            this.idSelected.emit(actionObj);
            return false;
        }
        if (this.actionparam === 'edit') {
            this.actionparam = 'view';
        } else {
            this.router.navigate(['provider/settings/q-manager/displayboards/q-set']);
        }
    }
    getProviderServices() {
        const params = { 'status': 'ACTIVE' };
        this.provider_services.getServicesList(params)
            .subscribe(data => {
                this.services_list = data;
                this.selectedCategoryValue = this.services_list[0].id;
                this.serviceSelection(this.services_list[0].id);
            });
    }
    getDepartments() {
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
                },
                error => {
                    this.shared_Functionsobj.apiErrorAutoHide(this, error);
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
    getLabels() {
        this.defaultLables = this.labelfromConstants;
        for (let i = 0; i < this.defaultLables.length; i++) {
            this.defaultLables[i].checked = false;
        }
        this.provider_services.getLabelList().subscribe(data => {
            this.providerLabels = data;
            for (let i = 0; i < this.providerLabels.length; i++) {
                this.defaultLables.push({
                    'name': this.providerLabels[i].label,
                    'displayname': this.providerLabels[i].displayName,
                    'label': true,
                    'order': this.defaultLables.length + 1
                });
            }
        });
        this.defaultLables = this.shared_Functionsobj.removeDuplicates(this.defaultLables, 'name');
    }
    labelSelection(index, event, name?) {
        if (event === 'edit') {
            this.showLabelEdit[index] = true;
            this.saveLabels(index);
        } else if (event.checked) {
            this.showLabelEdit[index] = true;
            this.labelDisplayname[index] = this.defaultLables[index].displayname;
            this.labelOrder[index] = this.defaultLables[index].order;
            if (this.defaultLables[index].defaultValue) {
                this.labelDefaultvalue[index] = this.defaultLables[index].defaultValue;
            }
            this.saveLabels(index);
        } else if (!event.checked) {
            this.showLabelEdit[index] = false;
            this.removeLabels(name);
        }
    }
    getLabelName(value, index) {
        for (let i = 0; i < this.labelsList.length; i++) {
            if (this.labelsList[i].name === index.name) {
                this.labelsList[i].displayName = value;
            }
        }
    }
    getLabelvalue(value, index) {
        for (let i = 0; i < this.labelsList.length; i++) {
            if (this.labelsList[i].name === index.name) {
                this.labelsList[i].defaultValue = value;
            }
        }
    }
    getLabelOrder(value, index) {
        for (let i = 0; i < this.labelsList.length; i++) {
            if (this.labelsList[i].name === index.name) {
                this.labelsList[i].order = value;
            }
        }
    }
    removeLabels(name) {
        for (let i = 0; i < this.labelsList.length; i++) {
            if (this.labelsList[i].name === name) {
                this.labelsList.splice(i, 1);
            }
        }
    }
    categorySelection(value) {
        this.selectedCategory = value;
        if (this.selectedCategory === 'SERVICE') {
            this.selectedCategoryValue = this.services_list[0].id;
            this.serviceSelection(this.services_list[0].id);
        } else if (this.selectedCategory === 'QUEUE') {
            this.selectedCategoryValue = this.display_schedule[0].id;
            this.queueSelection(this.display_schedule[0].id);
        } else if (this.selectedCategory === 'DEPARTMENT') {
            this.selectedCategoryValue = this.departments[0].departmentId;
            this.departmentSelection(this.departments[0].departmentId);
        }
    }
    saveLabels(index) {
        this.labelsList.push({
            'name': this.defaultLables[index].name,
            'displayName': this.labelDisplayname[index],
            'defaultValue': this.labelDefaultvalue[index] || '',
            'label': this.defaultLables[index].label,
            'order': this.labelOrder[index]
        });
        this.labelsList = this.shared_Functionsobj.removeDuplicates(this.labelsList, 'name');
    }
    serviceSelection(service) {
        this.statusBoardfor = [{
            'type': 'SERVICE',
            'id': [
                service
            ]
        }];
    }
    departmentSelection(dept) {
        this.statusBoardfor = [{
            'type': 'DEPARTMENT',
            'id': [
                dept
            ]
        }];
    }
    queueSelection(queue) {
        this.statusBoardfor = [{
            'type': 'QUEUE',
            'id': [
                queue
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
