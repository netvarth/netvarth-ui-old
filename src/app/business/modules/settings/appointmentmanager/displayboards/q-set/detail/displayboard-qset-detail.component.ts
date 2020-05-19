import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstants } from '../../../../../../../shared/constants/project-constants';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
    servicesList: any = [];
    actionparam;
    display_schedule: any = [];
    display_scheduleList: any = [];
    defaultLabels: any = [];
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
    providerLabelsList: any = [];
    labelfromConstants = projectConstants.STATUS_BOARD;
    submit_btn;
    id;
    filterByDept = false;
    locName;
    board_count = 0;
    deptIds: any = [];
    serviceIds: any = [];
    qIds: any = [];
    api_loading = false;
    multipeLocationAllowed = false;
    step = 1;
    selectedWtlstList: any = [];
    waitlistStatuses = projectConstants.APPT_STATUSES_FILTER;
    providerLabelsCount;
    qMultiCtrl: any = [];
    deptMultiCtrl: any = [];
    servMultiCtrl: any = [];
    labelMultiCtrl: any = [];
    deptMultiFilterCtrl: FormControl = new FormControl();
    serviceMultiFilterCtrl: FormControl = new FormControl();
    qMultiFilterCtrl: FormControl = new FormControl();
    labelMultiFilterCtrl: FormControl = new FormControl();
    onDestroy = new Subject<void>();
    qboardConditions: any = [];
    labelList = new Object();
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions
    ) { }
    ngOnInit() {
        this.getBussinessProfile();
        this.deptMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterDeptbySearch();
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
        this.labelMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.filterLabelbySearch();
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
    ngOnChanges() {
        this.api_loading = true;
        this.id = this.qsetId;
        this.actionparam = this.action;
        this.getDepartments();
        this.getProviderServices();
        this.getProviderQueues();
        this.getLabels();
        setTimeout(() => {
            if (this.id) {
                this.getDisplaydashboardbyId(this.id);
                this.submit_btn = Messages.UPDATE_BTN;
            } else {
                this.submit_btn = Messages.SAVE_BTN;
            }
            this.api_loading = false;
        }, 200);
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.labelsList, event.previousIndex, event.currentIndex);
    }
    filterDeptbySearch() {
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
        this.departmentList = this.departments.filter(dept => dept.departmentName.toLowerCase().indexOf(search) > -1);
    }
    filterServicebySearch() {
        if (!this.services_list) {
            return;
        }
        let search = this.serviceMultiFilterCtrl.value;
        if (!search) {
            this.servicesList = this.services_list.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.servicesList = this.services_list.filter(service => service.name.toLowerCase().indexOf(search) > -1);
    }
    filterQbySearch() {
        if (!this.display_schedule) {
            return;
        }
        let search = this.qMultiFilterCtrl.value;
        if (!search) {
            this.display_scheduleList = this.display_schedule.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.display_scheduleList = this.display_schedule.filter(queue => queue.name.toLowerCase().indexOf(search) > -1);
    }
    filterLabelbySearch() {
        if (!this.providerLabels) {
            return;
        }
        let search = this.labelMultiFilterCtrl.value;
        if (!search) {
            this.providerLabelsList = this.providerLabels.slice();
            return;
        } else {
            search = search.toLowerCase();
        }
        this.providerLabelsList = this.providerLabels.filter(label => label.displayName.toLowerCase().indexOf(search) > -1);
    }
    resetFields() {
        this.boardDisplayname = '';
        this.boardName = '';
        this.labelsList = [];
        this.statusBoardfor = [];
        this.sortByFieldsList = {};
        this.labelList = {};
        this.selectedWtlstList = [];
        this.deptIds = [];
        this.serviceIds = [];
        this.qIds = [];
    }
    getDisplaydashboardbyId(id) {
        this.provider_services.getApptDisplayboardQSetbyId(id).subscribe(data => {
            this.displayBoardData = data;
            this.boardName = this.displayBoardData.name;
            this.boardDisplayname = this.displayBoardData.displayName;
            this.selectedWtlstList = this.displayBoardData.qBoardConditions.apptStatus;
            this.selectedCategory = this.displayBoardData.queueSetFor[0].type;
            Object.keys(this.displayBoardData.qBoardConditions.labels).forEach(key => {
                for (let i = 0; i < this.providerLabels.length; i++) {
                    if (this.providerLabels[i].label === key) {
                        this.providerLabels[i]['selectedValue'] = this.displayBoardData.qBoardConditions.labels[key];
                        this.labelMultiCtrl.push(this.providerLabels[i]);
                        this.labelList[this.providerLabels[i].label] = this.displayBoardData.qBoardConditions.labels[key];
                    }
                }
            });
            if (this.displayBoardData.qBoardConditions.departments && this.displayBoardData.qBoardConditions.departments.length > 0) {
                for (let j = 0; j < this.displayBoardData.qBoardConditions.departments.length; j++) {
                    for (let i = 0; i < this.departments.length; i++) {
                        if (this.displayBoardData.qBoardConditions.departments[j].departmentId === this.departments[i].departmentId) {
                            this.deptMultiCtrl.push(this.departments[i]);
                            this.deptIds.push(this.displayBoardData.qBoardConditions.departments[j].departmentId);
                        }
                    }
                    if (j < this.displayBoardData.qBoardConditions.departments.length) {
                        this.departmentSelection();
                    }
                }
            } else {
                this.departmentSelection();
            }
            Object.keys(this.displayBoardData.sortBy).forEach(key => {
                this.selectedSortField = key;
                this.sortByField(key);
            });
            for (let i = 0; i < this.displayBoardData.fieldList.length; i++) {
                for (let j = 0; j < this.defaultLabels.length; j++) {
                    if (this.displayBoardData.fieldList[i].name === this.defaultLabels[j].name) {
                        this.labelDisplayname[j] = this.displayBoardData.fieldList[i].displayName;
                        this.labelOrder[j] = this.displayBoardData.fieldList[i].order;
                        if (this.displayBoardData.fieldList[i].defaultValue) {
                            this.labelDefaultvalue[j] = this.displayBoardData.fieldList[i].defaultValue;
                        }
                        this.defaultLabels[j].checked = true;
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
    setStatusboardValue() {
        if (this.selectedCategory === 'SERVICE') {
            this.statusBoardfor = [{
                'type': 'SERVICE',
                'id': this.serviceIds
            }];
        }
        if (this.selectedCategory === 'DEPARTMENT') {
            this.statusBoardfor = [{
                'type': 'DEPARTMENT',
                'id': this.deptIds
            }];
        }
        if (this.selectedCategory === 'SCHEDULE') {
            this.statusBoardfor = [{
                'type': 'SCHEDULE',
                'id': this.qIds
            }];
        }
    }
    onSubmit() {
        this.setStatusboardValue();
        let name = '';
        if (this.boardDisplayname) {
            name = this.boardDisplayname.trim().replace(/ /g, ' ');
        }
        const departmentIds = [];
        for (const id of this.deptIds) {
            const ids = {
                'departmentId': id
            };
            departmentIds.push(ids);
        }
        const serviceIds = [];
        for (const id of this.serviceIds) {
            const ids = {
                'id': id
            };
            serviceIds.push(ids);
        }
        const qIds = [];
        for (const id of this.qIds) {
            const ids = {
                'id': id
            };
            qIds.push(ids);
        }
        this.qboardConditions = {
            'departments': departmentIds,
            'services': serviceIds,
            'apptSchedule': qIds,
            'labels': this.labelList,
            'apptStatus': this.selectedWtlstList
        };
        if (this.actionparam === 'add') {
            const post_data = {
                'name': name,
                'displayName': this.boardDisplayname,
                'fieldList': this.labelsList,
                'queueSetFor': this.statusBoardfor,
                'sortBy': this.sortByFieldsList,
                'qBoardConditions': this.qboardConditions
            };
            this.provider_services.createDisplayboardQSetAppointment(post_data).subscribe(data => {
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
                'sortBy': this.sortByFieldsList,
                'qBoardConditions': this.qboardConditions
            };
            this.provider_services.updateDisplayboardQSetAppointment(post_data).subscribe(data => {
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
            this.router.navigate(['provider/settings/appointmentmanager/displayboards/q-set']);
        }
    }
    getProviderServices() {
        return new Promise((resolve) => {
            const params = { 'status-eq': 'ACTIVE', 'serviceType-neq': 'donationService' };
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.services_list = data;
                    this.servicesList = this.services_list;
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
            this.provider_services.getProviderSchedules()
                .subscribe(data => {
                    this.display_schedule = data;
                    this.display_scheduleList = this.display_schedule;
                    if (this.actionparam === 'add' && this.selectedCategory === '' && this.display_schedule.length > 0) {
                        this.selectedCategory = 'SCHEDULE';
                    }
                    for (let ii = 0; ii < this.display_schedule.length; ii++) {
                        let schedule_arr = [];
                        if (this.display_schedule[ii].apptSchedule) {
                            schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.display_schedule[ii].apptSchedule);
                        }
                        queue_list = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                        this.display_schedule[ii].displayQ = queue_list[0];
                        if (this.display_schedule[ii].apptState === 'ENABLED') {
                            activeQueues.push(this.display_schedule[0]);
                        }
                    }
                    this.provider_shared_functions.setActiveQueues(activeQueues);
                    resolve();
                });
        });
    }
    getLabels() {
        this.defaultLabels = this.labelfromConstants;
        for (let i = 0; i < this.defaultLabels.length; i++) {
            this.defaultLabels[i].checked = false;
        }
        this.provider_services.getLabelList().subscribe(data => {
            this.providerLabels = data;
            this.providerLabelsList = this.providerLabels;
            this.providerLabelsCount = this.providerLabels.length;
            for (let i = 0; i < this.providerLabels.length; i++) {
                this.defaultLabels.push({
                    'name': this.providerLabels[i].label,
                    'displayname': this.providerLabels[i].displayName,
                    'label': true,
                    'order': this.defaultLabels.length + 1
                });
            }
        });
        this.defaultLabels = this.shared_Functionsobj.removeDuplicates(this.defaultLabels, 'name');
    }
    labelSelection(index, event, name?) {
        if (event === 'edit') {
            this.showLabelEdit[index] = true;
            this.saveLabels(index);
        } else if (event.checked) {
            this.showLabelEdit[index] = true;
            this.defaultLabels[index].checked = true;
            this.labelDisplayname[index] = this.defaultLabels[index].displayname;
            this.labelOrder[index] = this.defaultLabels[index].order;
            if (this.defaultLabels[index].defaultValue) {
                this.labelDefaultvalue[index] = this.defaultLabels[index].defaultValue;
            }
            this.saveLabels(index);
        } else if (!event.checked) {
            this.showLabelEdit[index] = false;
            this.defaultLabels[index].checked = false;
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
    removeLabels(name) {
        for (let i = 0; i < this.labelsList.length; i++) {
            if (this.labelsList[i].name === name) {
                this.labelsList.splice(i, 1);
            }
        }
    }
    categorySelection(value) {
        this.selectedCategory = value;
        this.deptIds = [];
        this.serviceIds = [];
        this.qIds = [];
        this.departmentList = this.departments;
        this.deptMultiCtrl = [];
        this.departmentSelection();
        this.serviceSelection();
    }
    saveLabels(index) {
        this.labelsList.push({
            'name': this.defaultLabels[index].name,
            'displayName': this.labelDisplayname[index],
            'defaultValue': this.labelDefaultvalue[index] || '',
            'label': this.defaultLabels[index].label,
            'order': this.labelOrder[index]
        });
        this.labelsList = this.shared_Functionsobj.removeDuplicates(this.labelsList, 'name');
    }
    serviceSelection() {
        this.qMultiCtrl = [];
        this.display_scheduleList = [];
        if (this.servMultiCtrl && this.servMultiCtrl.length > 0) {
            for (let i = 0; i < this.servMultiCtrl.length; i++) {
                for (let j = 0; j < this.display_schedule.length; j++) {
                    for (let k = 0; k < this.display_schedule[j].services.length; k++) {
                        if (this.display_schedule[j].services[k].id === this.servMultiCtrl[i].id && this.display_scheduleList.indexOf(this.display_schedule[j]) === -1) {
                            this.display_scheduleList.push(this.display_schedule[j]);
                        }
                    }
                }
            }
        } else {
            this.display_scheduleList = this.display_schedule;
        }
        if (this.actionparam === 'edit' && this.displayBoardData.qBoardConditions.apptSchedule && this.displayBoardData.qBoardConditions.apptSchedule.length > 0) {
            for (let j = 0; j < this.displayBoardData.qBoardConditions.apptSchedule.length; j++) {
                for (let i = 0; i < this.display_schedule.length; i++) {
                    if (this.displayBoardData.qBoardConditions.apptSchedule[j].id === this.display_schedule[i].id) {
                        this.qMultiCtrl.push(this.display_schedule[i]);
                        this.qIds.push(this.displayBoardData.qBoardConditions.apptSchedule[j].id);
                    }
                }
            }
        }
    }
    setServiceIds(service, ev) {
        const index = this.serviceIds.indexOf(service);
        if (index === -1) {
            this.serviceIds.push(service);
        } else {
            this.serviceIds.splice(index, 1);
        }
    }
    departmentSelection() {
        this.servMultiCtrl = [];
        this.qMultiCtrl = [];
        this.servicesList = [];
        if (this.deptMultiCtrl && this.deptMultiCtrl.length > 0) {
            for (let i = 0; i < this.deptMultiCtrl.length; i++) {
                for (let j = 0; j < this.deptMultiCtrl[i].serviceIds.length; j++) {
                    for (let k = 0; k < this.services_list.length; k++) {
                        if (this.services_list[k].id === this.deptMultiCtrl[i].serviceIds[j] && this.servicesList.indexOf(this.services_list[k]) === -1) {
                            this.servicesList.push(this.services_list[k]);
                        }
                    }
                }
            }
        } else {
            this.servicesList = this.services_list;
        }
        if (this.actionparam === 'edit' && this.displayBoardData.qBoardConditions.services && this.displayBoardData.qBoardConditions.services.length > 0) {
            for (let j = 0; j < this.displayBoardData.qBoardConditions.services.length; j++) {
                for (let i = 0; i < this.services_list.length; i++) {
                    if (this.displayBoardData.qBoardConditions.services[j].id === this.services_list[i].id) {
                        this.servMultiCtrl.push(this.services_list[i]);
                        this.serviceIds.push(this.displayBoardData.qBoardConditions.services[j].id);
                    }
                }
                if (j < this.displayBoardData.qBoardConditions.services.length) {
                    this.serviceSelection();
                }
            }
        } else {
            this.serviceSelection();
        }
    }
    setDeptIds(dept, ev) {
        const index = this.deptIds.indexOf(dept);
        if (index === -1) {
            this.deptIds.push(dept);
        } else {
            this.deptIds.splice(index, 1);
        }
    }
    queueSelection(queue, ev) {
        const index = this.qIds.indexOf(queue);
        if (index === -1) {
            this.qIds.push(queue);
        } else {
            this.qIds.splice(index, 1);
        }
    }
    getNamefromId(id, type) {
        let displayName;
        if (type === 'SERVICE') {
            for (let i = 0; i < this.services_list.length; i++) {
                if (this.services_list[i].id === id) {
                    displayName = this.services_list[i].name;
                }
            }
        } else if (type === 'SCHEDULE') {
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
        this.provider_services.getDisplayboardsAppointment()
            .subscribe(
                data => {
                    layout_list = data;
                    this.board_count = layout_list.length;
                });
    }
    getBussinessProfile() {
        const bconf = this.shared_Functionsobj.getitemfromLocalStorage('ynw-bconf');
        this.provider_services.getBussinessProfile()
            .subscribe((data: any) => {
                for (const domains of bconf.bdata) {
                    if (domains.id === data.serviceSector.id) {
                        this.multipeLocationAllowed = domains.multipleLocation;
                    }
                }
            });
    }
    showStep(step) {
        if (step === 5 && this.labelsList.length === 0) {
            this.shared_Functionsobj.openSnackBar('Select atleast one field from the list', { 'panelClass': 'snackbarerror' });
        } else if (this.boardDisplayname === '') {
            this.shared_Functionsobj.openSnackBar('Please enter the name', { 'panelClass': 'snackbarerror' });
        } else {
            this.step = step;
        }
    }
    waitlistSelection(status) {
        if (this.selectedWtlstList.indexOf(status) === -1) {
            this.selectedWtlstList.push(status);
        }
    }
    removeFIeldFromArray(field, index) {
        this.defaultLabels.forEach(element => {
            if (element.name === field) {
                this.defaultLabels[this.defaultLabels.indexOf(element)].checked = false;
                this.showLabelEdit[this.defaultLabels.indexOf(element)] = false;
            }
        });
        this.labelsList.splice(index, 1);
    }
    providerLabelSelection(value, label) {
        this.labelList[label] = value;
    }
}
