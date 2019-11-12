import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import * as moment from 'moment';

@Component({
    selector: 'app-waitlist-queues',
    templateUrl: './waitlist-queues.component.html',
    styleUrls: ['./waitlist-queues.component.css']
})
export class WaitlistQueuesComponent implements OnInit, OnDestroy {
    loc_name;
    loc_cap = Messages.LOCATION_CAP;
    schedule_cap = Messages.WAITLIST_SCHEDULE_CAP;
    no_service_cap = Messages.NO_SERVICE_CAP;
    new_serv_cap = Messages.QUEUE_NEW_SERVICE_WIND_CAP;
    max_capacity_cap = Messages.QUEUE_MAX_CAPACITY_CAP;
    no_queue_add = Messages.NO_QUEUE_ADDED;
    work_hours = Messages.SERVICE_TIME_CAP;
    waitlist_cap = Messages.WAITLIST_CAP;
    queue_list: any = [];
    query_executed = false;
    customer_label = '';
    api_error = null;
    api_success = null;
    locations;
    api_loading = true;
    api_load_complete = 0;
    add_button = Messages.ADD_BUTTON;
    tooltip_queueedit = Messages.QUEUENAME_TOOLTIP;
    breadcrumb_moreoptions: any = [];
    Selall = false;
    isAllServicesSelected = false;
    services_selected: any = [];
    services_list: any = [];
    queue_lists = [];
    Disqueue_lists = [];
    Enabqueue_lists = [];
    servicelist = [];
    instantQForm: FormGroup;

    breadcrumbs = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.WAITLIST_MANAGE_CAP,
            url: '/provider/settings/q-manager'
        },
        {
            title: this.work_hours
        }
    ];
    queuedialogRef;
    isCheckin;
    selected_location = null;
    selectedQlocation = null;
    capacitylimit = projectConstants.QTY_MAX_VALUE;
    parallellimit = projectConstants.VALIDATOR_MAX150;
    start_hour;
    start_min;
    amOrPm;
    qstartamOrPm;
    qendamOrPm;


    showedit = false;
    action = 'add';
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    qstart_time;
    qend_time;
    location;
    locid;
    qId;
    now;

    instantQs: any = [];
    scheduledQs: any = [];
    disabledQs: any = [];
    capacityEditable = false;
    parallelServeEditable = false;
    showInstantQFlag = false;
    showAddInstantQBtn = false;
    sTimeEditable = false;
    eTimeEditable = false;
    todaysQs: any = [];
    qAvailability;
    fromDateCaption;
    toDateCaption;
    locationsjson: any = [];
    sqShowFutureCount: any = [];
    sqShowTodayCount: any = [];
    sqShowActiveQFutureCount: any = [];
    sqShowActiveQTodayCount: any = [];
    TodayCheckinsCount: any = [];
    FutureCheckinsCount: any = [];
    TomorrowCheckinsCount: any = [];
    sqTodayCheckinsCount: any = [];
    sqFutureCheckinsCount: any = [];
    sqTomorrowCheckinsCount: any = [];
    todayQcountCaption: any = [];
    futureQcountCaption: any = [];
    todayQLoading: any = [];
    scheduleLoading: any = [];
    domain: any;

    constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        public shared_functions: SharedFunctions,
        private router: Router,
        private routerobj: Router,
        public provider_shared_functions: ProviderSharedFuctions,
        private shared_services: SharedServices,
        public fed_service: FormMessageDisplayService,
        private fb: FormBuilder) { }

    ngOnInit() {
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
        this.api_loading = true;
        if (this.shared_Functionsobj.getitemfromLocalStorage('loc_id')) {
            this.selected_location = this.shared_Functionsobj.getitemfromLocalStorage('loc_id');
        }
        this.breadcrumb_moreoptions = {
            'actions': [{ 'title': this.new_serv_cap, 'type': 'timewindow' },{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
        this.initializeQs();

    }
    ngOnDestroy() {
        if (this.queuedialogRef) {
            this.queuedialogRef.close();
        }
    }
    /**
    *Method executes when try to edit start time
    */
    editStartTime() {
        this.sTimeEditable = true;
        let sttime;
        const curtime = {};
        if (this.action !== 'edit') {
            if (this.fromDateCaption === 'Now') {
                const server_date = this.shared_Functionsobj.getitemfromLocalStorage('sysdate');
                const today = server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                curtime['hour'] = parseInt(moment(new Date(today), ['hh:mm A']).format('HH'), 10);
                curtime['minutes'] = parseInt(moment(new Date(today), ['hh:mm A']).format('mm'), 10);
            } else {
                curtime['hour'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('HH'), 10);
                curtime['minutes'] = parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('mm'), 10);
            }
            sttime = {
                hour: curtime['hour'],
                minute: curtime['minutes']
            };
            this.instantQForm.patchValue({
                dstart_time: sttime || null,
            });
        }
    }
    /**
     *Method executes when try to edit end time
     */
    editEndTime() {
        this.eTimeEditable = true;
        let sttime;
        const curtime = {};
        curtime['hour'] = parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10);
        curtime['minutes'] = parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10);
        sttime = {
            hour: curtime['hour'],
            minute: curtime['minutes']
        };
        this.instantQForm.patchValue({
            dend_time: sttime || null,
        });
    }
    hideInstantQ() {
        this.parallelServeEditable = false;
        this.capacityEditable = false;
        this.eTimeEditable = false;
        this.sTimeEditable = false;
        this.showInstantQFlag = false;
    }

    editInstantQueue(que) {
        if (que.instantQueue) {
            this.action = 'edit';
            this.prepareInstantQForm(que);
        } else {
            this.addEditProviderQueue('edit', que);
        }
    }
    /**
     * Add instant Queue button clicked
     */
    addInstantQBtnClicked() {
        this.action = 'add';
        this.prepareInstantQForm();
    }
    // get the list of locations added for the current provider
    getProviderQueues() {
        this.initializeQs();
    }
    /**
     * Method to get locations
     */
    getLocations() {
        return new Promise((resolve, reject) => {
            this.provider_services.getProviderLocations()
                .subscribe(
                    data => {
                        this.locationsjson = data;
                        this.locations = [];
                        for (let index = 0; index < this.locationsjson.length; index++) {
                            if (this.locationsjson[index].status === 'ACTIVE') {
                                this.locations.push(this.locationsjson[index]);
                                if (!this.selected_location) {
                                    this.selected_location = this.locations[0];
                                }
                            }
                            resolve();
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
    /**
     * Method to change instant Queue's location
     * @param event event
     */
    onChangeLocationSelect(event) {
        const value = event;
        this.selectedQlocation = this.locations[value] || [];
        this.selected_location = this.locations[value] || [];
    }
    /**
     * set values for Instant Queue form while editing
     * @param q queue Object
     */
    updateForm(q) {
        this.qId = q.id;
        this.fromDateCaption = q.queueSchedule.timeSlots[0].sTime;
        this.toDateCaption = q.queueSchedule.timeSlots[0].eTime;
        const sttime = {
            hour: parseInt(moment(q.queueSchedule.timeSlots[0].sTime,
                ['h:mm A']).format('HH'), 10),
            minute: parseInt(moment(q.queueSchedule.timeSlots[0].sTime,
                ['h:mm A']).format('mm'), 10)
        };
        const edtime = {
            hour: parseInt(moment(q.queueSchedule.timeSlots[0].eTime,
                ['h:mm A']).format('HH'), 10),
            minute: parseInt(moment(q.queueSchedule.timeSlots[0].eTime,
                ['h:mm A']).format('mm'), 10)
        };
        this.instantQForm.setValue({
            dstart_time: sttime || null,
            dend_time: edtime || null,
            qcapacity: q.capacity || null,
            qserveonce: q.parallelServing || null
        });
        for (let j = 0; j < q.services.length; j++) {
            for (let k = 0; k < this.services_list.length; k++) {
                if (q.services[j].id === this.services_list[k].id) {
                    this.services_list[k].checked = true;
                    this.services_selected.push(q.services[j].id);
                }
            }
        }
        if (this.services_selected.length === this.services_list.length) {
            this.isAllServicesSelected = true;
        }
        this.loc_name = q.location.place;
        this.location = q.location;
    }
    getQs() {
        return new Promise((resolve, reject) => {
            this.provider_services.getProviderQueues()
                .subscribe(
                    (data) => {
                        let allQs: any = [];
                        this.todaysQs = [];
                        this.scheduledQs = [];
                        this.disabledQs = [];
                        const activeQs = [];
                        allQs = data;
                        const server_date = this.shared_Functionsobj.getitemfromLocalStorage('sysdate');
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
                            if (allQs[ii].queueSchedule) {
                                schedule_arr = this.shared_Functionsobj.queueSheduleLoop(allQs[ii].queueSchedule);
                            }
                            let display_schedule = [];
                            display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                           // alert(JSON.stringify(display_schedule));
                            allQs[ii]['displayschedule'] = display_schedule;
                            // replace instancequeue with new flag
                            if (allQs[ii].isAvailableToday && allQs[ii].queueState === 'ENABLED') {
                                this.todaysQs.push(allQs[ii]);
                               console.log(this.todaysQs);
                            }
                            if (!allQs[ii].instantQueue && allQs[ii].queueState === 'ENABLED') {
                                this.scheduledQs.push(allQs[ii]);
                            }
                            if (allQs[ii].queueState === 'DISABLED') {
                                this.disabledQs.push(allQs[ii]);
                            }
                            if (allQs[ii].queueState === 'ENABLED') {
                                activeQs.push(allQs[ii]);
                            }
                        }
                        for (let ii = 0; ii < this.disabledQs.length; ii++) {
                            if (!this.disabledQs[ii].instantQueue || (this.disabledQs[ii].instantQueue && this.disabledQs[ii].queueSchedule.startDate === todayDate)) {
                                this.disabledQs[ii].showDisableBtn = true;
                            } else {
                                this.disabledQs[ii].showDisableBtn = false;
                            }
                        }
                        this.provider_shared_functions.setActiveQueues(activeQs);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    });
        });
    }
    getServices() {
        const params = { 'status': 'ACTIVE' };
        return new Promise((resolve, reject) => {
            this.provider_services.getServicesList(params)
                .subscribe(data => {
                    this.services_list = data;
                    resolve();
                },
                    (error) => {
                        reject(error);
                    });
        });
    }
    /**
     * To get Available Instant Queue Details
     */
    isAvailableNow() {
        return new Promise((resolve, reject) => {
            this.provider_services.isAvailableNow()
                .subscribe(data => {
                    this.qAvailability = data;
                    const message = {};
                    message['ttype'] = 'instant_q';
                    message['qAvailability'] = this.qAvailability;
                    this.shared_Functionsobj.sendMessage(message);
                    resolve();
                },
                    (error) => {
                        reject(error);
                    });
        });
    }
    /**
     * Method to select all services
     */
    selectAllService() {
        for (let i = 0; i < this.services_list.length; i++) {
            this.services_list[i].checked = true;
            this.servicelist.push(this.services_list[i]);
        }
        this.isAllServicesSelected = true;
    }
    /**
     * Method to deselect all services
     */
    deselectAllService() {
        for (let i = 0; i < this.services_list.length; i++) {
            delete this.services_list[i].checked;
            this.servicelist = [];
        }
        this.isAllServicesSelected = false;
    }
    /**
     * Handling Service Checkbox list
     * @param index index of the service check box selected
     */
    handleServicechecbox(index) {
        this.servicelist = [];
        this.isAllServicesSelected = true;
        if (this.services_list[index].checked) {
            delete this.services_list[index].checked;
        } else {
            this.services_list[index].checked = true;
        }
        for (let i = 0; i < this.services_list.length; i++) {
            if (this.services_list[i].checked === true) {
                this.servicelist.push(this.services_list[i]);
            } else {
                this.isAllServicesSelected = false;
            }
        }
    }
    /**
     * Check validation of fields
     * @param evt Field Object
     */
    isvalid(evt) {
        return this.shared_Functionsobj.isValid(evt);
    }
    /**
     * Check Numeric Validation
     * @param evt Field Object
     */
    isNumeric(evt) {
        return this.shared_Functionsobj.isNumeric(evt);
    }
    /**
     * Make Capacity Editable
     */
    capacityClick() {
        this.capacityEditable = true;
    }
    /**
     * Make Parallel Serving Editable
     */
    servedClick() {
        this.parallelServeEditable = true;
    }
    /**
     * Create form for Instant Queue
     * @param server_date for setting timings
     */
    createForm(server_date) {
        const todaydt = new Date(server_date);
        // tslint:disable-next-line:radix
        this.start_hour = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('HH'));
        // tslint:disable-next-line:radix
        this.start_min = parseInt(moment(new Date(todaydt), ['hh:mm A']).format('mm'));
        this.now = moment(new Date(todaydt), ['hh:mm A']).add(2, 'hours').format('hh:mm A');
        if (!this.qAvailability.availableNow) {
            this.fromDateCaption = 'Now';
            if (this.qAvailability.timeRange) {
                this.toDateCaption = this.qAvailability.timeRange.eTime;
            } else {
                this.toDateCaption = '11:59 PM';
            }
        } else {
            this.fromDateCaption = this.qAvailability.timeRange.eTime;
            this.toDateCaption = '11:59 PM';
        }
        if (this.fromDateCaption === 'Now') {
            this.instantQForm = this.fb.group({
                // tslint:disable-next-line:radix
                dstart_time: [{ hour: parseInt(moment(new Date(todaydt), ['hh:mm A']).format('HH')), minute: parseInt(moment(new Date(todaydt), ['hh:mm A']).format('mm')) }, Validators.compose([Validators.required])],
                // tslint:disable-next-line:radix
                dend_time: [{ hour: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
                qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
                qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])]
            });
        } else {
            this.instantQForm = this.fb.group({
                // tslint:disable-next-line:radix
                dstart_time: [{ hour: parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.fromDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
                // tslint:disable-next-line:radix
                dend_time: [{ hour: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('HH'), 10), minute: parseInt(moment(this.toDateCaption, ['hh:mm A']).format('mm'), 10) }, Validators.compose([Validators.required])],
                qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
                qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])]
            });
        }
    }
    /**
     * Learn more button clicked
     * @param mod
     * @param e
     */
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
        this.shared_Functionsobj.sendMessage(pdata);
    }
    /**
     * Learnmore Sub Section
     * @param mod
     */
    getMode(mod) {
        let moreOptions = {};
        moreOptions = { 'show_learnmore': true, 'scrollKey': 'bprofile', 'subKey': mod };
        return moreOptions;
    }
    /**
     * Navigate to Queue Details Page
     * @param queue queue object for getting queue id
     */
    goQueueDetail(queue) {
        this.router.navigate(['provider', 'settings', 'q-manager',
            'queues', queue.id]);
    }
    /**
     * For clearing api errors
     */
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    /**
     * Method to initiate InstantQ Create/Update
     * @param instantQ instantQ Object
     */
    onSubmit(instantQ) {
        this.resetApiErrors();
        const server_date = this.shared_Functionsobj.getitemfromLocalStorage('sysdate');
        const todaydt = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
        let sTime = instantQ.dstart_time;
        if (isNaN(instantQ.dstart_time.hour)) {
            const curtime = {};
            const todaydt1 = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const toda = new Date(todaydt);
            const today1 = moment(toda).format();
            curtime['hour'] = parseInt(moment(new Date(today1), ['hh:mm A']).format('HH'), 10);
            curtime['minutes'] = parseInt(moment(new Date(today1), ['hh:mm A']).format('mm'), 10);
            sTime = {
                hour: curtime['hour'],
                minute: curtime['minutes']
            };
        }
        const dtoday = yyyy + '-' + mm + '-' + dd;
        const instantScheduleJson = {
            'recurringType': 'Once',
            'startDate': dtoday,
            'terminator': {
                'endDate': null,
                'noOfOccurance': null
            },
            'timeSlots': [{
                'sTime': moment(sTime).format('hh:mm A') || null,
                'eTime': moment(instantQ.dend_time).format('hh:mm A') || null
            }]
        };
        const instantQInput = {};
        const services = [];
        for (let i = 0; i < this.servicelist.length; i++) {
            services.push({ 'id': this.servicelist[i].id });
        }
        if (this.action === 'edit') {
            this.locid = { 'id': this.location.id };
            instantQInput['id'] = this.qId;
        } else {
            if (this.selectedQlocation === null) {
                this.selectedQlocation = this.selected_location;
            }
            this.locid = { 'id': this.selectedQlocation.id };
        }
        instantQInput['location'] = this.locid;
        instantQInput['services'] = services;
        instantQInput['queueSchedule'] = instantScheduleJson;
        instantQInput['name'] = (moment(sTime).format('hh:mm A') || null) + '-' + (moment(instantQ.dend_time).format('hh:mm A') || null);
        instantQInput['onlineCheckin'] = true;
        instantQInput['futureWaitlist'] = false;
        instantQInput['parallelServing'] = instantQ.qserveonce;
        instantQInput['capacity'] = instantQ.qcapacity;
        instantQInput['queueState'] = 'ENABLED';
        instantQInput['instantQueue'] = true;
        if (isNaN(instantQ.qcapacity)) {
            const error = 'Please enter a numeric value for capacity';
            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        } else if (isNaN(instantQ.qserveonce)) {
            const error = 'Please enter a numeric value for ' + this.customer_label + 's served at a time';
            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        } else {
            if (this.action === 'edit') {
                this.updateInstantQ(instantQInput);
            } else {
                this.createInstantQ(instantQInput);
            }
        }
    }
    /**
     * Method to create instant Queue
     * @param post_data input to create Instant Queue
     */
    createInstantQ(post_data) {
        this.provider_services.addInstantQ(post_data)
            .subscribe(
                () => {
                    this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('WAITLIST_QUEUE_CREATED'), { 'panelClass': 'snackbarnormal' });
                    this.showInstantQFlag = false;
                    this.initializeQs();
                },
                (error) => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    /**
     * Method to Update Instant Queue
     * @param post_data input to update Instant Queue
     */
    updateInstantQ(post_data) {
        if (post_data.services.length === 0) {
            const error = 'Please select services';
            this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        } else {
            this.provider_services.editInstantQ(post_data)
                .subscribe(
                    () => {
                        this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('WAITLIST_QUEUE_CREATED'), { 'panelClass': 'snackbarnormal' });
                        this.showInstantQFlag = false;
                        this.initializeQs();
                    },
                    (error) => {
                        this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
        }
    }
    /**
     * ------------------------
     */
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/checkinmanager->settings-time_windows']);
        }
        else{this.addEditProviderQueue('add');}
        
    }
    /**
     * Method to change same day online checkin status
     * @param qObj queue object
     * @param event field checked status
     */
    changeQSameDayOnlineStatus(qObj, index) {
        let chstatusmsg = '';
        if (qObj.onlineCheckIn) {
            chstatusmsg = 'disabled';
        } else {
            chstatusmsg = 'enabled';
        }
        this.provider_services.changeSamedayCheckinStatus(qObj.id, !qObj.onlineCheckIn)
            .subscribe(() => {
                this.shared_Functionsobj.openSnackBar('Same day online check-ins ' + chstatusmsg + ' successfully');
                this.initializeQs();
            },
                error => {
                    this.initializeQs();
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    /**
     * Method to change future checkin status
     * @param qObj queue Object
     * @param event field checked status
     */
    changeQFutureStatus(qObj, index) {
        let chstatusmsg = '';
        if (qObj.futureWaitlist) {
            chstatusmsg = 'disabled';
        } else {
            chstatusmsg = 'enabled';
        }
        this.provider_services.changeFutureCheckinStatus(qObj.id, !qObj.futureWaitlist)
            .subscribe(() => {
                this.shared_Functionsobj.openSnackBar('Future Checkin ' + chstatusmsg + ' successfully');
                this.initializeQs();
            },
                error => {
                    this.initializeQs();
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    /**
     * Call modal box for add/edit scheduled Queue
     * @param type add/edit
     * @param queue queue object if edit
     */
    addEditProviderQueue(type, queue = null) {
        this.provider_shared_functions.addEditQueuePopup(this, type, 'queue_list', queue, this.provider_shared_functions.getActiveQueues());
    }
    /**
     * Method to enable/disable queue status
     * @param obj queue object
     */
    changeProviderQueueStatus(obj) {
        let chgstatus = '';
        let chstatusmsg = '';

        if (obj.queueState === 'ENABLED') {
            chgstatus = 'disable';
            chstatusmsg = 'disabled';
        } else {
            chgstatus = 'enable';
            chstatusmsg = 'enabled';
        }
        let msg = this.shared_Functionsobj.getProjectMesssages('WAITLIST_QUEUE_CHG_STAT').replace('[qname]', obj.name);
        msg = msg.replace('[status]', chstatusmsg);
        this.provider_services.changeProviderQueueStatus(obj.id, chgstatus)
            .subscribe(() => {
                this.shared_Functionsobj.openSnackBar(msg);
                this.initializeQs();
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    /**
     * Method to set scheduled, instant, disabled Queues
     */
    initializeQs() {
        this.api_loading = true;
        this.showInstantQFlag = false;
        this.showAddInstantQBtn = true;
        this.shared_services.getSystemDate()
            .subscribe(
                res => {
                    this.shared_Functionsobj.setitemonLocalStorage('sysdate', res);
                    this.getQs().then(
                        () => {
                            this.isAvailableNow().then(
                                () => {
                                    if (this.todaysQs.length === 0 && !this.qAvailability.availableNow) {
                                        this.prepareInstantQForm();
                                        this.showAddInstantQBtn = false;
                                    }
                                }
                            );
                            this.api_loading = false;
                        },
                        () => {
                            this.api_loading = false;
                        }
                    );
                });
    }
    /**
     * Method to set values for instant Queue creation
     */
    initInstantQForm(queue?) {
        this.shared_services.getSystemDate()
            .subscribe(
                res => {
                    this.shared_Functionsobj.setitemonLocalStorage('sysdate', res);
                    let server_date;
                    server_date = res;
                    this.createForm(server_date);
                    this.api_load_complete = 1;
                    this.showInstantQFlag = true;
                    this.selectAllService();
                    if (queue) {
                        this.updateForm(queue);
                    }
                });
    }
    /**
     * Method to set platform for creating instant queue
     */
    prepareInstantQForm(queue?) {
        if (this.services_list.length === 0) {
            this.getServices().then(
                () => {
                    this.getLocations().then(
                        () => {
                            this.initInstantQForm(queue);
                        }
                    );
                }
            );
        } else {
            this.initInstantQForm(queue);
        }
    }

    viewDashboard(queueObj, index, que) {
        this.getTodayCheckinCount(queueObj, index, que);
        // if (!queueObj.instantQueue) {
        this.getfutureCheckinCount(queueObj, index, que);
        this.getTomorrowCheckinCount(queueObj, index, que);
        this.futureQcountCaption[index] = 'Checkins Count';
        this.todayQcountCaption[index] = 'Checkins Count';
        if (que === 'scheduleQ') {
            if (!this.sqShowFutureCount[index]) {
                this.sqShowFutureCount[index] = true;
            } else {
                this.sqShowFutureCount[index] = false;
            }
        } else {
            if (!this.sqShowActiveQFutureCount[index]) {
                this.sqShowActiveQFutureCount[index] = true;
            } else {
                this.sqShowActiveQFutureCount[index] = false;
            }
        }
        // }
        if (que === 'scheduleQ') {
            if (!this.sqShowTodayCount[index]) {
                this.sqShowTodayCount[index] = true;
            } else {
                this.sqShowTodayCount[index] = false;
            }
        } else {
            if (!this.sqShowActiveQTodayCount[index]) {
                this.sqShowActiveQTodayCount[index] = true;
            } else {
                this.sqShowActiveQTodayCount[index] = false;
            }
        }
    }

    getfutureCheckinCount(queue, index, origin) {
        if (origin === 'scheduleQ') {
            this.scheduleLoading[index] = true;
        } else {
            this.todayQLoading[index] = true;
        }
        let no_filter = false;
        let Mfilter = null;
        const queueid = queue.id;
        if (!Mfilter) {
            Mfilter = {
                'location-eq': queue.location.id,
                'queue-eq': queueid
            };
            no_filter = true;
        }
        return new Promise((resolve) => {
            this.provider_services.getWaitlistFutureCount(Mfilter)
                .subscribe(
                    data => {
                        resolve(data);
                        if (no_filter) {
                            if (origin === 'scheduleQ') {
                                this.sqFutureCheckinsCount[index] = data;
                                this.scheduleLoading[index] = false;
                            } else {
                                this.FutureCheckinsCount[index] = data;
                                this.todayQLoading[index] = false;
                            }
                        }
                    },
                    () => {
                    });
        });
    }

    getTodayCheckinCount(queue, index, origin) {
        if (origin === 'scheduleQ') {
            this.scheduleLoading[index] = true;
        } else {
            this.todayQLoading[index] = true;
        }
        let Mfilter = null;
        const queueid = queue.id;
        let no_filter = false;
        if (!Mfilter) {
            Mfilter = {
                'location-eq': queue.location.id,
                'waitlistStatus-neq': 'prepaymentPending',
                'queue-eq': queueid
            };
            no_filter = true;
        }
        return new Promise((resolve) => {
            this.provider_services.getwaitlistTodayCount(Mfilter)
                .subscribe(
                    data => {
                        if (no_filter) {
                            if (origin === 'scheduleQ') {
                                this.sqTodayCheckinsCount[index] = data;
                                this.scheduleLoading[index] = false;
                            } else {
                                this.TodayCheckinsCount[index] = data;
                                this.todayQLoading[index] = false;
                            }
                        }
                        resolve(data);
                    },
                    () => {
                    });
        });
    }

    getTomorrowCheckinCount(queue, index, origin) {
        if (origin === 'scheduleQ') {
            this.scheduleLoading[index] = true;
        } else {
            this.todayQLoading[index] = true;
        }
        const server_date = this.shared_Functionsobj.getitemfromLocalStorage('sysdate');
        const todaydt = new Date(server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        const dd = today.getDate() + 1;
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const tommorrow = yyyy + '-' + cmon + '-' + dd;
        let Mfilter = null;
        const queueid = queue.id;
        let no_filter = false;
        if (!Mfilter) {
            Mfilter = {
                'location-eq': queue.location.id,
                'waitlistStatus-neq': 'prepaymentPending',
                'queue-eq': queueid,
                'date-eq': tommorrow
            };
            no_filter = true;
        }
        return new Promise((resolve) => {
            this.provider_services.getWaitlistFutureCount(Mfilter)
                .subscribe(
                    data => {
                        if (no_filter) {
                            if (origin === 'scheduleQ') {
                                this.sqTomorrowCheckinsCount[index] = data;
                                this.scheduleLoading[index] = false;
                            } else {
                                this.TomorrowCheckinsCount[index] = data;
                                this.todayQLoading[index] = false;
                            }
                        }
                        resolve(data);
                    },
                    () => {
                    });
        });
    }
}
