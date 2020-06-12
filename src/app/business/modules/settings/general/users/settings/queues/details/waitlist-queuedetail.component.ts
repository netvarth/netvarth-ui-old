import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import * as moment from 'moment';
import { projectConstants } from '../../../../../../../../shared/constants/project-constants';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-userwaitlist-queuedetail',
    templateUrl: './waitlist-queuedetail.component.html'
})

export class WaitlistQueueDetailComponent implements OnInit {
    location_cap = Messages.Q_DET_LOCATION_CAP;
    service_cap = Messages.Q_DET_SERVICE_OFFERD_CAP;
    enabled_cap = Messages.Q_DET_ENABLED_CAP;
    disabled_cap = Messages.Q_DET_DISABLED_CAP;
    schedule_cap = Messages.Q_DET_SCHEDULE_CAP;
    work_hours = Messages.SERVICE_TIME_CAP;
    select_All = Messages.SELECT_ALL;
    start_time_cap = Messages.START_TIME_CAP;
    end_time_cap = Messages.END_TIME_CAP;
    service_time_window_name = Messages.SERVICE_TIME_WINDOW_CAP;
    existing_schedules = Messages.EXISTING_SCHEDULES_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    queue_id = null;
    queue_data;
    display_schedule: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            url: '/provider/settings/general/users',
            title: 'Users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    customer_label = '';
    appointment = false;
    api_loading = false;
    amForm: FormGroup;
    schedule_arr: any = [];
    holdloc_list: any = [];
    loc_list: any = [];
    dstart_time;
    dend_time;
    selday_arr: any = [];
    weekdays = projectConstants.myweekdaysSchedule;
    deptObj;
    departments: any = [];
    Selall = false;
    SelSer = false;
    SelServcall = false;
    services_selected: any = [];
    services_list: any = [];
    serviceIds;
    activeQueues: any = [];
    loc_name;
    capacitylimit = projectConstants.QTY_MAX_VALUE;
    parallellimit = projectConstants.VALIDATOR_MAX150;
    show_dialog = false;
    disableButton = false;
    SelService: any = [];
    serviceSelection: any = [];
    filterbyDept = false;
    showAdvancedSettings = false;
    queue_list: any = [];
    action;
    params;
    waitlist_manager;
    iftokn = false;
    selected_location;
    selected_locationId;
    api_loading1 = true;
    userId: any;
    prefixName = '';
    suffixName = '';
    batchStatus = false;
    showEditSection = false;
    qprefixName = '';
    qsuffixName = '';
    qbatchStatus = false;
    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private _location: Location,
        private activated_route: ActivatedRoute,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_shared_functions: ProviderSharedFuctions) {
        this.activated_route.params.subscribe(params => {
            this.queue_id = params.sid;
            this.userId = params.id;
        });
        this.activated_route.queryParams.subscribe(qparams => {
            this.params = qparams;
            if (this.params.action === 'editFromList') {
                this.action = 'edit';
            } else {
                this.action = qparams.action;
            }
        });
        this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
    }
    getUser() {
        this.provider_services.getUser(this.userId)
            .subscribe((data: any) => {
                this.breadcrumbs.push(
                    {
                        url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
                        title: data.firstName
                    },
                    {
                        url: '/provider/settings/general/users/' + this.userId + '/settings',
                        title: 'Settings'
                    },
                    {
                        url: '/provider/settings/general/users/' + this.userId + '/settings/queues',
                        title: 'Queues'
                    }
                );
                if (this.action === 'add') {
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
        this.getUser();
        this.getWaitlistMgr();
        this.api_loading = true;
        this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
        this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
        this.getProviderServices();
        this.getProviderQueues();
        setTimeout(() => {
            if (this.queue_id !== 'add') {
                this.getQueueDetail();
            } else {
                this.action = this.queue_id;

                this.createForm();
            }
        }, 100);
    }
    getWaitlistMgr() {
        this.api_loading = true;
        this.waitlist_manager = null;
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.waitlist_manager = data;
                    // this.amForm.get('timeSlot').setValue(this.waitlist_manager.trnArndTime);
                    if (this.waitlist_manager.showTokenId) {
                        this.iftokn = true;
                    } else {
                        this.iftokn = false;
                    }
                    this.api_loading = false;
                });
    }
    getProviderLocations() {
        this.provider_services.getProviderLocations()
            .subscribe(data => {
                this.holdloc_list = data;
                this.loc_list = [];
                for (let i = 0; i < this.holdloc_list.length; i++) {
                    if (this.holdloc_list[i].status === 'ACTIVE') {
                        this.loc_list.push(this.holdloc_list[i]);
                    }
                }
                if (this.queue_data) {
                    this.loc_name = this.queue_data.location.place;
                } else if (this.loc_list.length === 1) {
                    this.loc_name = this.loc_list[0];
                }
                if (this.action === 'add') {
                    this.selected_location = this.loc_list[0];
                    this.selected_locationId = this.loc_list[0].id;
                }
                if (this.action === 'add' && this.params.source === 'location_detail' && this.params.locationId) {
                    // this.amForm.get('qlocation').setValue(this.params.locationId);
                    this.selected_locationId = this.params.locationId;
                } else if (this.action === 'add' && this.loc_list.length === 1) {
                    // this.amForm.get('qlocation').setValue(this.loc_list[0].id);
                    this.selected_locationId = this.loc_list[0].id;
                }
            });

    }
    existingScheduletoggle() {
        (this.show_dialog) ? this.show_dialog = false : this.show_dialog = true;
        this.activeQueues = [];
        if (this.show_dialog) {
            for (let ii = 0; ii < this.queue_list.length; ii++) {
                let schedule_arr = [];
                // extracting the schedule intervals
                if (this.queue_list[ii].queueSchedule) {
                    schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_list[ii].queueSchedule);
                }
                let display_schedule = [];
                display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                if (this.queue_list[ii].queueState === 'ENABLED') {
                    this.activeQueues.push(display_schedule[0]);
                }
            }
        }
    }
    advancedClick() {
        (this.showAdvancedSettings) ? this.showAdvancedSettings = false : this.showAdvancedSettings = true;
    }
    isvalid(evt) {
        return this.shared_Functionsobj.isValid(evt);
    }
    isNumeric(evt) {
        return this.shared_Functionsobj.isNumeric(evt);
    }
    changetime(src, passtime) {
        switch (src) {
            case 'start':
                this.dstart_time = passtime;
                break;
            case 'end':
                this.dend_time = passtime;
                break;
        }
    }
    handleDaychecbox(dayindx) {
        const selindx = this.selday_arr.indexOf(dayindx);
        if (selindx === -1) {
            this.selday_arr.push(dayindx);
        } else {
            this.selday_arr.splice(selindx, 1);
        }
        if (this.selday_arr.length === 7) {
            this.Selall = true;
        } else {
            this.Selall = false;
        }
    }
    getQueueDetail() {
        this.api_loading = true;
        this.getProviderQueues();
        this.provider_services.getQueueDetail(this.queue_id)
            .subscribe(
                data => {
                    this.queue_data = data;
                    this.batchStatus = this.queue_data.batch;
                    if (this.queue_data.batchPatternSettings) {
                        this.prefixName = this.queue_data.batchPatternSettings.prefix;
                        this.suffixName = this.queue_data.batchPatternSettings.suffix;
                    }
                    if (!this.queue_data.batchPatternSettings || (!this.queue_data.batchPatternSettings.prefix && !this.queue_data.batchPatternSettings.suffix) || (this.queue_data.batchPatternSettings.prefix === '' && this.queue_data.batchPatternSettings.suffix === '')) {
                        this.showEditSection = true;
                    } else {
                        this.showEditSection = false;
                    }

                    this.appointment = (this.queue_data.appointment === 'Enable') ? true : false;
                    let schedule_arr = [];
                    if (this.queue_data.queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_data.queueSchedule);
                    }
                    this.display_schedule = [];
                    this.display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                    // remove multiple end breadcrumb on edit function
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: this.queue_data.name
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.api_loading = false;
                    if (this.action === 'edit') {
                        this.createForm();
                    }
                },
                () => {
                    this.api_loading = false;
                    this.goBack();
                }
            );
    }
    // get the list of services
    getProviderServices() {
        this.api_loading1 = true;
        const filter = { 'status-eq': 'ACTIVE', 'provider-eq': this.userId };
        this.provider_services.getProviderServices(filter)
            .subscribe(data => {
                this.services_list = data;
            });
        this.api_loading1 = false;
    }
    goBack() {
        // this.router.navigate(['provider', 'settings', 'miscellaneous',
        //     'queues']);
        this._location.back();
        this.api_loading = false;
    }
    addEditProviderQueue() {
        this.action = 'edit';
        this.createForm();
    }
    changeProviderQueueStatus(obj) {
        this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'queue_detail');
    }
    getProviderQueues() {
        const activeQueues: any = [];
        const filter = { 'provider-eq': this.userId };
        this.provider_services.getProviderQueues(filter)
            .subscribe(data => {
                this.queue_list = data;
                for (let ii = 0; ii < this.queue_list.length; ii++) {
                    let schedule_arr = [];
                    // extracting the schedule intervals
                    if (this.queue_list[ii].queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_list[ii].queueSchedule);
                    }
                    let display_schedule = [];
                    display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                    if (this.queue_list[ii].queueState === 'ENABLED') {
                        activeQueues.push(display_schedule[0]);
                    }
                }
                this.provider_shared_functions.setActiveQueues(activeQueues);
            });
    }
    createForm() {
        if (this.action === 'edit') {
            this.amForm = this.fb.group({
                qname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                // qlocation: ['', Validators.compose([Validators.required])],
                qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
                qendtime: [this.dend_time, Validators.compose([Validators.required])],
                qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
                qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])],
                // timeSlot: ['', Validators.compose([Validators.required])],
            });
            this.updateForm();
        } else {
            this.amForm = this.fb.group({
                qname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                // qlocation: ['', Validators.compose([Validators.required])],
                qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
                qendtime: [this.dend_time, Validators.compose([Validators.required])],
                qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
                qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])],
                tokennum: [''],
                // timeSlot: ['', Validators.compose([Validators.required])]
            });
            this.provider_services.getQStartToken()
                .subscribe(
                    (data) => {
                        this.amForm.controls['tokennum'].setValue(data);
                    }
                );
        }
        this.api_loading = false;
        this.getProviderLocations();
    }

    updateForm() {
        const sttime = {
            hour: parseInt(moment(this.queue_data.queueSchedule.timeSlots[0].sTime,
                ['h:mm A']).format('HH'), 10),
            minute: parseInt(moment(this.queue_data.queueSchedule.timeSlots[0].sTime,
                ['h:mm A']).format('mm'), 10)
        };
        const edtime = {
            hour: parseInt(moment(this.queue_data.queueSchedule.timeSlots[0].eTime,
                ['h:mm A']).format('HH'), 10),
            minute: parseInt(moment(this.queue_data.queueSchedule.timeSlots[0].eTime,
                ['h:mm A']).format('mm'), 10)
        };
        this.selected_location = this.queue_data.location;
        this.selected_locationId = this.queue_data.location.id;
        this.amForm.setValue({
            qname: this.queue_data.name || null,
            // qlocation: this.queue_data.location.id || null,
            qstarttime: sttime || null,
            qendtime: edtime || null,
            qcapacity: this.queue_data.capacity || null,
            qserveonce: this.queue_data.parallelServing || null,
            // timeSlot: this.queue_data.timeInterval || 0
        });
        this.qbatchStatus = this.queue_data.batch;
        if (this.queue_data.batchPatternSettings) {
            this.qprefixName = this.queue_data.batchPatternSettings.prefix;
            this.qsuffixName = this.queue_data.batchPatternSettings.suffix;
        }
        if (!this.queue_data.batchPatternSettings || (!this.queue_data.batchPatternSettings.prefix && !this.queue_data.batchPatternSettings.suffix) || (this.queue_data.batchPatternSettings.prefix === '' && this.queue_data.batchPatternSettings.suffix === '')) {
            this.showEditSection = true;
        } else {
            this.showEditSection = false;
        }
        // this.amForm.get('qlocation').disable();
        this.selday_arr = [];
        // extracting the selected days
        for (let j = 0; j < this.queue_data.queueSchedule.repeatIntervals.length; j++) {
            // pushing the day details to the respective array to show it in the page
            this.selday_arr.push(Number(this.queue_data.queueSchedule.repeatIntervals[j]));
        }
        if (this.selday_arr.length === 7) {
            this.Selall = true;
        } else {
            this.Selall = false;
        }
        for (let j = 0; j < this.queue_data.services.length; j++) {
            for (let k = 0; k < this.services_list.length; k++) {
                if (this.queue_data.services[j].id === this.services_list[k].id) {
                    this.services_list[k].checked = true;
                    this.services_selected.push(this.queue_data.services[j].id);
                }
            }
        }
        if (this.services_selected.length === this.services_list.length) {
            this.SelServcall = true;
        }
        this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
        this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
    }

    onSubmit(form_data) {
        if (!form_data.qname.replace(/\s/g, '').length) {
            const error = 'Please enter queue name';
            this.shared_Functionsobj.apiErrorAutoHide(this, error);
            return;
        }
        const selser: any = [];
        let schedulejson: any = [];
        let found = false;
        // Check whether atleast one service is selected
        for (const sel of this.departments) {
            if (sel['checked']) {
                for (let j = 0; j < this.serviceSelection[sel.departmentName].length; j++) {
                    for (let k = 0; k < this.services_list.length; k++) {
                        if (this.services_list[k].name === this.serviceSelection[sel.departmentName][j]) {
                            this.services_list[k].checked = true;
                        }
                    }
                }
            }
        }
        for (const sel of this.services_list) {
            if (sel['checked']) {
                selser.push({ 'id': sel.id });
                found = true;
            }
        }
        if (!found) {
            const error = 'Please select services';
            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            return;
        }
        // Check whether atleast one day is selected
        if (this.selday_arr.length === 0) {
            const error = 'Please select the days';
            this.shared_Functionsobj.apiErrorAutoHide(this, error);
            return;
        } else {
            // Numeric validation
            if (isNaN(form_data.qcapacity)) {
                const error = 'Please enter a numeric value for capacity';
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                return;
            }
            if (!this.shared_Functionsobj.checkIsInteger(form_data.qcapacity)) {
                const error = 'Please enter an integer value for Maximum ' + this.customer_label + 's served';
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                return;
            } else {
                if (form_data.qcapacity === 0) {
                    const error = 'Maximum ' + this.customer_label + 's served should be greater than 0';
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    return;
                }
            }
            // Numeric validation
            if (isNaN(form_data.qserveonce)) {
                const error = 'Please enter a numeric value for ' + this.customer_label + 's served at a time';
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                return;
            }
            if (!this.shared_Functionsobj.checkIsInteger(form_data.qserveonce)) {
                const error = 'Please enter an integer value for ' + this.customer_label + 's served at a time';
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                return;
            } else {
                if (form_data.qserveonce === 0) {
                    const error = this.customer_label + 's served at a time should be greater than 0';
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    return;
                }
            }
            // start and end date validations
            const cdate = new Date();
            let mon;
            mon = (cdate.getMonth() + 1);
            if (mon < 10) {
                mon = '0' + mon;
            }
            const daystr: any = [];
            const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
            for (const cday of this.selday_arr) {
                daystr.push(cday);
            }
            // check whether the start and end times are selected
            if (!this.dstart_time || !this.dend_time) {
                this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelclass': 'snackbarerror' });
                return;
            }
            // today
            const curday = new Date();
            if (this.shared_Functionsobj.getminutesOfDay(this.dstart_time) > this.shared_Functionsobj.getminutesOfDay(this.dend_time)) {
                this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelclass': 'snackbarerror' });
                return;
            }
            const curdate = new Date();
            curdate.setHours(this.dstart_time.hour);
            curdate.setMinutes(this.dstart_time.minute);
            const enddate = new Date();
            enddate.setHours(this.dend_time.hour);
            enddate.setMinutes(this.dend_time.minute);
            const starttime_format = moment(curdate).format('hh:mm A') || null;
            const endtime_format = moment(enddate).format('hh:mm A') || null;
            // building the schedule json section
            schedulejson = {
                'recurringType': 'Weekly',
                'repeatIntervals': daystr,
                'startDate': today,
                'terminator': {
                    'endDate': '',
                    'noOfOccurance': ''
                },
                'timeSlots': [{
                    'sTime': starttime_format,
                    'eTime': endtime_format
                }]
            };
            // generating the data to be posted
            const post_data = {
                'name': form_data.qname,
                'queueSchedule': schedulejson,
                'parallelServing': form_data.qserveonce,
                'capacity': form_data.qcapacity,
                'location': {
                    'id': this.selected_locationId
                },
                'services': selser,
                'tokenStarts': form_data.tokennum,
                'timeInterval': form_data.timeSlot,
                'provider': this.userId,
                'batch': this.qbatchStatus,
                'batchPatternSettings': {
                    'prefix': this.qprefixName,
                    'suffix': this.qsuffixName
                }
            };
            if (this.action === 'edit') {
                this.editProviderQueue(post_data);
            } else {
                this.addProviderQueue(post_data);
            }
        }
    }
    addProviderQueue(post_data) {
        this.disableButton = true;
        this.provider_services.addProviderQueue(post_data)
            .subscribe(
                (data) => {
                    this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_QUEUE_CREATED, { 'panelclass': 'snackbarerror' });
                    this.disableButton = false;
                    this.api_loading = false;
                    this.queue_id = data;
                    this.getQueueDetail();
                    this.action = 'view';
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.disableButton = false;
                }
            );
    }
    // update a queue
    editProviderQueue(post_data) {
        this.disableButton = true;
        post_data.id = this.queue_id;
        this.provider_services.editProviderQueue(post_data)
            .subscribe(
                () => {
                    this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_QUEUE_UPDATED, { 'panelclass': 'snackbarerror' });
                    this.disableButton = false;
                    this.api_loading = false;
                    this.getQueueDetail();
                    if (this.params.action === 'editFromList') {
                        this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'queues']);
                    } else if (this.params.source === 'location_detail') {
                        this._location.back();
                    } else {
                        this.action = 'view';
                    }
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.disableButton = false;
                }
            );
    }
    closeClick() {
        if (this.action === 'edit' && this.params.action !== 'editFromList' && this.params.source !== 'location_detail') {
            this.action = 'view';
        } else {
            this._location.back();
        }
    }
    onChangeLocationSelect(ev) {
        this.selected_location = this.loc_list[ev];
        this.selected_locationId = this.loc_list[ev].id;
    }

    handleselectall() {
        this.Selall = true;
        this.selday_arr = [];
        const wkdaystemp = this.weekdays;
        this.weekdays = [];
        for (let ii = 1; ii <= 7; ii++) {
            this.handleDaychecbox(ii);
        }
        this.weekdays = wkdaystemp;
    }
    handleselectnone() {
        this.Selall = false;
        this.selday_arr = [];
        const wkdaystemp = this.weekdays;
        this.weekdays = [];
        this.weekdays = wkdaystemp;
    }
    selectAllService() {
        for (let i = 0; i < this.services_list.length; i++) {
            this.services_list[i].checked = true;
        }
        this.SelServcall = true;
    }
    deselectAllService() {
        for (let i = 0; i < this.services_list.length; i++) {
            delete this.services_list[i].checked;
        }
        this.SelServcall = false;
    }
    // checks whether a given value is there in the given array
    check_existsinArray(arr, val) {
        let ret = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                ret = i;
            }
        }
        return ret;
    }
    serviceunderdept(index, deptName, deptIndex, serviceid) {
        if (this.serviceSelection[deptName][index]) {
            delete this.serviceSelection[deptName][index];
        } else {
            this.serviceSelection[deptName][index] = serviceid;
        }
        let count = 0;
        for (let i = 0; i < this.serviceSelection[deptName].length; i++) {
            if (!this.serviceSelection[deptName][i]) {
                this.SelServcall = false;
                count++;
            }
        }
        if (count === this.serviceSelection[deptName].length) {
            this.departments[deptIndex].checked = false;
            this.SelService[deptIndex] = false;
        }
        if (count === 0) {
            this.SelServcall = true;
        }
    }
    selectdept() {
        for (let i = 0; i < this.departments.length; i++) {
            this.serviceSelection[this.departments[i].departmentName] = [];
            this.departments[i].checked = true;
            this.SelService[i] = true;
            for (let j = 0; j < this.departments[i].serviceIds.length; j++) {
                this.serviceSelection[this.departments[i].departmentName][j] = this.departments[i].serviceIds[j];
            }
        }
        this.SelServcall = true;
    }
    deselectdept() {
        for (let i = 0; i < this.departments.length; i++) {
            this.SelService[i] = false;
            delete this.departments[i].checked;
        }
        this.SelServcall = false;
    }
    selectdeprtservice(index, event, deptName) {
        this.serviceSelection[deptName] = [];
        for (let i = 0; i < this.departments.length; i++) {
            if (event.checked) {
                this.departments[index].checked = true;
                this.SelService[index] = true;
                if (this.departments[i].departmentName === deptName) {
                    for (let j = 0; j < this.departments[i].serviceIds.length; j++) {
                        this.serviceSelection[deptName][j] = this.departments[i].serviceIds[j];
                    }
                }
            } else {
                this.departments[index].checked = false;
                this.SelService[index] = false;
                this.SelServcall = false;
            }
        }
        let count = 0;
        for (let i = 0; i < this.departments.length; i++) {
            if (this.serviceSelection[this.departments[i].departmentName] && this.serviceSelection[this.departments[i].departmentName].length > 0) {
                for (let j = 0; j < this.serviceSelection[this.departments[i].departmentName].length; j++) {
                    if (this.serviceSelection[this.departments[i].departmentName][j]) {
                        count = i;
                    }
                }
            }
        }
        if (count === this.departments.length) {
            this.SelServcall = false;
        }
    }
    handleServicechecbox(index) {
        this.SelServcall = true;
        if (this.services_list[index].checked) {
            delete this.services_list[index].checked;
        } else {
            this.services_list[index].checked = true;
        }
        for (let i = 0; i < this.services_list.length; i++) {
            if (!this.services_list[i].checked) {
                this.SelServcall = false;
                break;
            }
        }
    }

    changeTimeslotStatus(ev) {
        const status = (ev.checked) ? 'Enable' : 'Disable';
        this.provider_services.changeApptStatus(status, this.queue_id).subscribe(
            () => {
                this.appointment = (status === 'Enable') ? true : false;
                this.getQueueDetail();
            },
            error => {
                this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }

    changeBatchStatus(event) {
        const status = (event.checked) ? 'enabled' : 'disabled';
        this.provider_services.changeBatchStatus(this.queue_id, event.checked).subscribe(data => {
            this.batchStatus = event.checked;
            this.getQueueDetail();
            this.shared_Functionsobj.openSnackBar('Batch mode ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
        });


    }
    addBatchName() {
        const post_data = {
            'prefix': this.prefixName,
            'suffix': this.suffixName
        };
        this.provider_services.updateBatch(this.queue_id, post_data).subscribe(data => {
            this.showEditSection = false;
            this.getQueueDetail();
            // this.shared_Functionsobj.openSnackBar('Successfull', { 'panelclass': 'snackbarerror' });
        });
    }
    editBatchnames() {
        this.showEditSection = true;
    }

    changebatchStatus(event) {
        this.qbatchStatus = event.checked;
        const status = (event.checked) ? 'enabled' : 'disabled';
        if (status === 'enabled') {
            this.showEditSection = true;
        } else {
            this.showEditSection = false;
        }
    }
}
