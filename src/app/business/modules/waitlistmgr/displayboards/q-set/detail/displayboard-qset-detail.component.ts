import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../../shared/constants/project-constants';
import { FormControl } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    departmentList: any = [];
    services_list: any = [];
    actionparam;
    display_schedule: any = [];
    defaultLables: any = [];
    showLabelEdit: any = [];
    selectedCategory = '';
    selectedSortField = '';
    selectedCategoryValue;
    labelDisplayname: any = [];
    labelDefaultvalue: any = [];
    labelOrder: any = [];
    labelsList: any = [];
    statusBoardfor: any = [];
    sortByFieldsList = {};
    displayBoardData: any = [];
    boardName;
    boardDisplayname;
    providerLabels: any = [];
    labelfromConstants = projectConstants.STATUS_BOARD;
    submit_btn;
    id;
    filterByDept = false;
    locName;
    board_count = 0;
    categoryIds: any = [];
    api_loading = false;
    step = 1;
    waitlistStatuses = projectConstants.CHECK_IN_STATUSES_FILTER;
    deptMultiCtrl: any = [];
    servMultiCtrl: any = [];
    qMultiCtrl: any = [];
    public deptMultiFilterCtrl: FormControl = new FormControl();
    public labelMultiFilterCtrl: FormControl = new FormControl();
    private _onDestroy = new Subject<void>();

    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions
    ) {
        this.resetFields();
    }
    ngOnInit() {
        this.deptMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanksMulti();
        });
        this.resetFields();
        const loc_details = this.shared_Functionsobj.getitemFromGroupStorage('loc_id');
        if (loc_details) {
            this.locName = loc_details.place;
        }
        if (this.actionparam === 'add') {
            this.selectedSortField = 'sort_token';
            this.sortByField('sort_token');
        }
    }


    filterBanksMulti() {
        if (!this.departments) {
          return;
        }
        let search = this.deptMultiFilterCtrl.value;
        if (!search) {
            this.departmentList = this.departments.slice();
          return;
        } else {
          search = search.toLowerCase();
        }
        console.log(this.departments);
        console.log(search);
        this.departmentList = this.departments.filter(dept => console.log(dept.departmentName.toLowerCase().indexOf(search)));
        console.log(this.departmentList);
      }

    resetFields() {
        this.boardDisplayname = '';
        this.boardName = '';
        this.labelsList = [];
        this.statusBoardfor = [];
        this.sortByFieldsList = {};
    }
    ngOnChanges() {
        this.api_loading = true;
        this.id = this.qsetId;
        this.resetFields();
        this.actionparam = this.action;
        this.getDepartments();
        this.getProviderQueues();
        this.getProviderServices();
        setTimeout(() => {
            if (this.id) {
                this.getDisplaydashboardbyId(this.id);
                this.submit_btn = Messages.UPDATE_BTN;
            } else {
                this.submit_btn = Messages.SAVE_BTN;
                this.getLabels();
            }
            this.api_loading = false;
        }, 100);
    }
    getDisplaydashboardbyId(id) {
        this.getLabels();
        this.provider_services.getDisplayboardQSetbyId(id).subscribe(data => {
            this.displayBoardData = data;
            this.boardName = this.displayBoardData.name;
            this.boardDisplayname = this.displayBoardData.displayName;
            for (let i = 0; i < this.displayBoardData.queueSetFor.length; i++) {
                this.selectedCategory = this.displayBoardData.queueSetFor[i].type;
                if (this.displayBoardData.queueSetFor[i].type === 'SERVICE') {
                    this.selectedService(this.displayBoardData.queueSetFor[i].id);
                }
                if (this.displayBoardData.queueSetFor[i].type === 'QUEUE') {
                    this.selectedQueues(this.displayBoardData.queueSetFor[i].id);
                }
                if (this.displayBoardData.queueSetFor[i].type === 'DEPARTMENT') {
                    this.selectedDept(this.displayBoardData.queueSetFor[i].id);
                }
            }
            Object.keys(this.displayBoardData.sortBy).forEach(key => {
                this.selectedSortField = key;
                this.sortByField(key);
            });
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
    selectedService(ids) {
        for (let i = 0; i < this.services_list.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                this.serviceSelection(ids[j], 'edit');
                if (this.services_list[i].id === ids[j]) {
                    this.services_list[i].checked = true;
                }
            }
        }
    }
    selectedDept(ids) {
        for (let i = 0; i < this.departments.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                this.departmentSelection(ids[j], 'edit');
                if (this.departments[i].departmentId === ids[j]) {
                    this.departments[i].checked = true;
                }
            }
        }
    }
    selectedQueues(ids) {
        for (let i = 0; i < this.display_schedule.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                this.queueSelection(ids[j], 'edit');
                if (this.display_schedule[i].id === ids[j]) {
                    this.display_schedule[i].checked = true;
                }
            }
        }
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
                'queueSetFor': this.statusBoardfor,
                'sortBy': this.sortByFieldsList
            };
            this.provider_services.createDisplayboardQSet(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('QSET_ADD'), { 'panelclass': 'snackbarerror' });
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
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.displayBoardData.id,
                'name': name,
                'displayName': this.boardDisplayname,
                'fieldList': this.labelsList,
                'queueSetFor': this.statusBoardfor,
                'sortBy': this.sortByFieldsList
            };
            this.provider_services.updateDisplayboardQSet(post_data).subscribe(data => {
                this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('QSET_UPDATE'), { 'panelclass': 'snackbarerror' });
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
        return new Promise((resolve) => {
            const params = { 'status': 'ACTIVE' };
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.services_list = data;
                    if (this.actionparam === 'add' && this.selectedCategory === '' && this.services_list.length > 0) {
                        this.selectedCategory = 'SERVICE';
                    }
                    resolve();
                });
        });
    }
    getDepartments() {
        return new Promise((resolve) => {
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
                        this.filterByDept = this.deptObj.filterByDept;
                        if (this.actionparam === 'add' && this.departments.length > 0 && this.filterByDept) {
                            this.selectedCategory = 'DEPARTMENT';
                        }
                        resolve();
                        this.departmentList = this.departments;
                    },
                    error => {
                        this.shared_Functionsobj.apiErrorAutoHide(this, error);
                    }
                );
        });

    }
    getProviderQueues() {
        return new Promise((resolve) => {
            const activeQueues: any = [];
            let queue_list: any = [];
            this.provider_services.getProviderQueues()
                .subscribe(data => {
                    this.display_schedule = data;
                    if (this.actionparam === 'add' && this.selectedCategory === '' && this.display_schedule.length > 0) {
                        this.selectedCategory = 'QUEUE';
                    }
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
                    resolve();
                });
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
        this.categoryIds = [];
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
    serviceSelection(service, ev) {
        if (ev === 'edit') {
            this.categoryIds.push(service);
        } else {
            const index = this.categoryIds.indexOf(service);
            if (ev.checked && index === -1) {
                this.categoryIds.push(service);
            } else {
                this.categoryIds.splice(index, 1);
            }
        }
        this.statusBoardfor = [{
            'type': 'SERVICE',
            'id': this.categoryIds
        }];
    }
    departmentSelection(dept, ev) {
        console.log(ev);
        if (ev === 'edit') {
            this.categoryIds.push(dept);
        } else {
            const index = this.categoryIds.indexOf(dept);
            if (ev.checked && index === -1) {
                this.categoryIds.push(dept);
            } else {
                this.categoryIds.splice(index, 1);
            }
        }
        this.statusBoardfor = [{
            'type': 'DEPARTMENT',
            'id': this.categoryIds
        }];
    }
    queueSelection(queue, ev) {
        if (ev === 'edit') {
            this.categoryIds.push(queue);
        } else {
            const index = this.categoryIds.indexOf(queue);
            if (ev.checked && index === -1) {
                this.categoryIds.push(queue);
            } else {
                this.categoryIds.splice(index, 1);
            }
        }
        this.statusBoardfor = [{
            'type': 'QUEUE',
            'id': this.categoryIds
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
    sortByField(field) {
        this.sortByFieldsList = new Object();
        this.sortByFieldsList[field] = 'asc';
    }
    getDisplayboardCount() {
        let layout_list: any = [];
        this.provider_services.getDisplayboards()
            .subscribe(
                data => {
                    layout_list = data;
                    this.board_count = layout_list.length;
                });
    }
    showStep(step) {
this.step = step;
    }
}
