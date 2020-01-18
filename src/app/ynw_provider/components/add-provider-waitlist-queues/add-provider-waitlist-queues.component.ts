import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import * as moment from 'moment';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';

@Component({
  selector: 'app-provider-add-queue',
  templateUrl: './add-provider-waitlist-queues.component.html',
  styleUrls: ['./add-provider-waitlist-queues.component.css']
})
export class AddProviderWaitlistQueuesComponent implements OnInit {

  service_time_cap = Messages.SERV_TIME_WINDOW_CAP;
  select_days_cap = Messages.SELECT_DAYS_BTN;
  select_servs_cap = Messages.SELECT_SEVC_BTN;
  select_All = Messages.SELECT_ALL;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  service_time_window_name = Messages.SERVICE_TIME_WINDOW_CAP;
  location_cap = Messages.QUEUE_LOCATION_CAP;
  service_cap = Messages.QUEUE_SERVICE_OFFERD_CAP;
  schedule_cap = Messages.SCHEDULE_CAP;
  existing_schedule_cap = Messages.EXISTING_SCHEDULE_CAP;
  existing_schedules = Messages.EXISTING_SCHEDULES_CAP;
  max_capacity_cap = Messages.MAX_CAPACITY_CAP;
  No_cap = Messages.NO_OF_CAP;
  servc_cap = Messages.SERVE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  schedule_arr: any = [];
  schedule_json: any = [];
  bProfile: any = [];
  holdloc_list: any = [];
  loc_list: any = [];
  dstart_time;
  dend_time;
  selday_arr: any = [];
  api_loading = true;
  api_loading1 = true;
  weekdays = projectConstants.myweekdaysSchedule;
  deptObj;
  departments: any = [];
  loading = true;
  Selall = false;
  SelSer = false;
  SelServcall = false;
  services_selected: any = [];
  services_list: any = [];
  serviceIds;
  activeQueues: any = [];
  activeSchedules: any = [];
  customer_label = '';
  businessConfig: any = [];
  multipeLocationAllowed = false;
  multipeLocAllowed = false;
  loc_name;
  capacitylimit = projectConstants.QTY_MAX_VALUE;
  parallellimit = projectConstants.VALIDATOR_MAX150;
  show_dialog = false;
  disableButton = false;
  department: any;
  number;
  SelService: any = [];
  serviceSelection: any = [];
  filterbyDept = false;
  showAdvancedSettings = false;
  ifedit = false;
  iftokn = false;
  queue_list: any = [];
  waitlist_manager;
  timeSlotStatus = false;
  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistQueuesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private provider_datastorageobj: ProviderDataStorageService,
    private sharedfunctionObj: SharedFunctions,
    private shared_services: SharedServices
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.activeSchedules = this.data.schedules;
    this.api_loading = false;
    this.bProfile = this.provider_datastorageobj.get('bProfile');
    this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
    // moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH:mm');
    // this.dend_time =  moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH:mm');
    // Get the provider locations
    this.createForm();
    this.getWaitlistMgr();
    this.getProviderServices();
    this.getProviderQueues();
    this.getBusinessConfiguration();
    // Get the provider services
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
  }
  // creates the form
  createForm() {
    if (this.data.type === 'add') {
      this.amForm = this.fb.group({
        qname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        qlocation: ['', Validators.compose([Validators.required])],
        qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
        qendtime: [this.dend_time, Validators.compose([Validators.required])],
        qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
        qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])],
        tokennum: [''],
        appointment: [false],
        timeSlot: [0, Validators.compose([Validators.required])]
        // futureWaitlist: [false],
        // onlineCheckIn: [false]
      });
      this.provider_services.getQStartToken()
        .subscribe(
          (data) => {
            this.amForm.controls['tokennum'].setValue(data);
          }
        );
    }
    if (this.data.type === 'edit') {
      this.amForm = this.fb.group({
        qname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        qlocation: ['', Validators.compose([Validators.required])],
        qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
        qendtime: [this.dend_time, Validators.compose([Validators.required])],
        qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
        qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])],
        appointment: [false],
        timeSlot: [0, Validators.compose([Validators.required])]
        // futureWaitlist: [false],
        // onlineCheckIn: [false]
      });
    }
  }
  isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  advancedClick() {
    (this.showAdvancedSettings) ? this.showAdvancedSettings = false : this.showAdvancedSettings = true;
  }
  existingScheduletoggle() {
    this.show_dialog = !this.show_dialog;
    this.activeQueues = [];
    if (this.show_dialog) {
      for (let ii = 0; ii < this.queue_list.length; ii++) {
        let schedule_arr = [];
        // extracting the schedule intervals
        if (this.queue_list[ii].queueSchedule) {
          schedule_arr = this.sharedfunctionObj.queueSheduleLoop(this.queue_list[ii].queueSchedule);
        }
        let display_schedule = [];
        display_schedule = this.sharedfunctionObj.arrageScheduleforDisplay(schedule_arr);
        if (this.queue_list[ii].queueState === 'ENABLED') {
          this.activeQueues.push(display_schedule[0]);
        }
      }
    }
  }
  // sets up the form with the values filled in
  updateForm() {
    const sttime = {
      hour: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('mm'), 10)
    };
    const edtime = {
      hour: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('mm'), 10)
    };
    this.amForm.setValue({
      qname: this.data.queue.name || null,
      qlocation: this.data.queue.location.id || null,
      qstarttime: sttime || null,
      qendtime: edtime || null,
      qcapacity: this.data.queue.capacity || null,
      qserveonce: this.data.queue.parallelServing || null,
      appointment: (this.data.queue.appointment === 'Enable') ? true : false,
      timeSlot: this.data.queue.timeInterval || 0
      // futureWaitlist: this.data.queue.futureWaitlist || false,
      // onlineCheckIn: this.data.queue.onlineCheckIn || false
    });
    this.timeSlotStatus = (this.data.queue.appointment === 'Enable') ? true : false;
    this.amForm.get('qlocation').disable();
    this.selday_arr = [];
    // extracting the selected days
    for (let j = 0; j < this.data.queue.queueSchedule.repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arr.push(Number(this.data.queue.queueSchedule.repeatIntervals[j]));
    }
    if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
    if (this.filterbyDept) {
      for (let j = 0; j < this.departments.length; j++) {
        this.serviceSelection[this.departments[j].departmentName] = [];
        for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
          for (let i = 0; i < this.data.queue.services.length; i++) {
            if (this.data.queue.services[i].name === this.departments[j].serviceIds[k]) {
              this.departments[j].checked = true;
              this.SelService[j] = true;
              this.serviceSelection[this.departments[j].departmentName][k] = this.departments[j].serviceIds[k];
            }
          }
        }
      }
      let count = 0;
      for (let j = 0; j < this.departments.length; j++) {
        for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
          for (let i = 0; i < this.serviceSelection[this.departments[j].departmentName].length; i++) {
            if (this.departments[j].serviceIds[j] !== this.serviceSelection[this.departments[j].departmentName][i]) {
              count++;
            }
          }
        }
      }
      if (count === 0) {
        this.SelServcall = true;
      }
    } else {
      for (let j = 0; j < this.data.queue.services.length; j++) {
        for (let k = 0; k < this.services_list.length; k++) {
          if (this.data.queue.services[j].id === this.services_list[k].id) {
            this.services_list[k].checked = true;
            this.services_selected.push(this.data.queue.services[j].id);
          }
        }
      }
      if (this.services_selected.length === this.services_list.length) {
        this.SelServcall = true;
      }
    }
    this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
    this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
  }
  getBusinessConfiguration() {
    this.api_loading1 = true;
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBussinessProfile();
        this.api_loading1 = false;
      },
        () => {
          this.api_loading1 = false;
        });
  }
  getBussinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
          }
        }
        // calling the method to get the list of locations
        this.getProviderLocations();
      },
        () => {
        });
  }
  // gets the list of locations
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
        if (this.data.queue) {
          this.loc_name = this.data.queue.location.place;
        }
        if (this.data.source === 'location_detail' &&
          this.data.type === 'add' &&
          this.data.queue.location.id) {
          this.amForm.get('qlocation').setValue(this.data.queue.location.id);
        } else if (this.data.type === 'add' && this.loc_list.length === 1) {
          this.amForm.get('qlocation').setValue(this.loc_list[0].id);
        }
      });
  }
  // get the list of services
  getProviderServices() {
    this.api_loading1 = true;
    const params = { 'status': 'ACTIVE' };
    this.provider_services.getServicesList(params)
      .subscribe(data => {
        this.services_list = data;
        this.getDepartments();
      });
    this.api_loading1 = false;
  }
  getProviderQueues() {
    this.provider_services.getProviderQueues()
      .subscribe(data => {
        this.queue_list = data;
      });
  }

  getWaitlistMgr() {
    this.api_loading1 = true;
    this.waitlist_manager = null;
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_manager = data;
          // this.amForm.get('timeSlot').setValue(this.waitlist_manager.trnArndTime);
          if (this.waitlist_manager.calculationMode === 'NoCalc' && this.waitlist_manager.showTokenId) {
            this.iftokn = true;
          } else {
            this.iftokn = false;
          }
          this.api_loading1 = false;
        });
  }

  getDepartments() {
    this.departments = [];
    this.api_loading1 = true;
    this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.filterbyDept = this.deptObj.filterByDept;
          this.departments = this.deptObj.departments;
          for (let i = 0; i < this.services_list.length; i++) {
            for (let j = 0; j < this.departments.length; j++) {
              for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
                if (this.departments[j].serviceIds[k] === this.services_list[i].id) {
                  this.departments[j].serviceIds[k] = this.services_list[i].name;
                }
              }
            }
          }
          for (let j = 0; j < this.departments.length; j++) {
            for (let k = 0; k < this.departments[j].serviceIds.length; k++) {
              // tslint:disable-next-line: radix
              if (parseInt(this.departments[j].serviceIds[k])) {
                delete this.departments[j].serviceIds[k];
              }
            }
          }
          this.api_loading1 = false;
        },
        error => {
          this.api_loading1 = false;
          // this.sharedfunctionObj.apiErrorAutoHide(this, error);
        }
      );
    setTimeout(() => {
      if (this.data.type === 'edit') {
        this.ifedit = true;
        this.updateForm();
      }
    }, 1000);
  }
  // handles the day checkbox click
  handleDaychecbox(dayindx) {
    this.resetApiErrors();
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
  // gets the name of the day from the given index
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }
  // handled the time box changes
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
  // handles the submit button click for add and edit
  onSubmit(form_data) {
    this.resetApiErrors();
    if (!form_data.qname.replace(/\s/g, '').length) {
      const error = 'Please enter queue name';
      this.sharedfunctionObj.apiErrorAutoHide(this, error);
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
      this.sharedfunctionObj.apiErrorAutoHide(this, error);
      return;
    }
    // Check whether atleast one day is selected
    if (this.selday_arr.length === 0) {
      const error = 'Please select the days';
      this.sharedfunctionObj.apiErrorAutoHide(this, error);
      return;
    } else {
      // Numeric validation
      if (isNaN(form_data.qcapacity)) {
        const error = 'Please enter a numeric value for capacity';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      }
      if (!this.sharedfunctionObj.checkIsInteger(form_data.qcapacity)) {
        // const error = 'Please enter an integer value for capacity';
        const error = 'Please enter an integer value for Maximum ' + this.customer_label + 's served';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      } else {
        if (form_data.qcapacity === 0) {
          // const error = 'Maximum Capacity should be greater than 0';
          const error = 'Maximum ' + this.customer_label + 's served should be greater than 0';
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          return;
        }
      }
      // Numeric validation
      if (isNaN(form_data.qserveonce)) {
        // const error = 'Please enter a numeric value for Number of ' + this.customer_label + 's served at a time';
        const error = 'Please enter a numeric value for ' + this.customer_label + 's served at a time';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      }
      if (!this.sharedfunctionObj.checkIsInteger(form_data.qserveonce)) {
        // const error = 'Please enter an integer value for Number of ' + this.customer_label + 's served at a time';
        const error = 'Please enter an integer value for ' + this.customer_label + 's served at a time';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      } else {
        if (form_data.qserveonce === 0) {
          const error = this.customer_label + 's served at a time should be greater than 0';
          // const error = 'Number of ' + this.customer_label + 's served at a time should be greater than 0';
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          return;
        }
      }
      // start and end date validations
      const cdate = new Date();
      // const dateWithzone = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);

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
        // this.api_error = Messages.WAITLIST_QUEUE_SELECTTIME;
        this.sharedfunctionObj.apiErrorAutoHide(this, Messages.WAITLIST_QUEUE_SELECTTIME);
        return;
      }
      // today
      const curday = new Date();
      // const today_curtime = moment(moment(curday).format('LT'), ['hh:mm A']).format('HH:mm');
      // this.sharedfunctionObj.getminutesOfDay(this.dend_time));
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        // this.api_error = Messages.WAITLIST_QUEUE_STIMEERROR;
        this.sharedfunctionObj.apiErrorAutoHide(this, Messages.WAITLIST_QUEUE_STIMEERROR);
        return;
      }
      const curdate = new Date();
      curdate.setHours(this.dstart_time.hour);
      curdate.setMinutes(this.dstart_time.minute);
      const enddate = new Date();
      enddate.setHours(this.dend_time.hour);
      enddate.setMinutes(this.dend_time.minute);
      // convert start time to 12 hour format
      // const starttime = new Date(today_date + ' ' + this.dstart_time + ':00');
      // //const starttime = new Date(today_date + ' ' + this.dstart_time.hour + ':' + this.dstart_time.minute + ':00');
      // const starttime_format = moment(starttime).format('hh:mm A') || null;
      const starttime_format = moment(curdate).format('hh:mm A') || null;
      // convert end time to 12 hour format
      // const endtime = new Date(today_date + ' ' + this.dend_time + ':00');
      // const endtime = new Date(today_date + ' ' + this.dend_time.hour + ':' + this.dend_time.minute + ':00');
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
        // 'futureWaitlist': form_data.futureWaitlist,
        // 'onlineCheckIn': form_data.onlineCheckIn,
        'location': {
          'id': form_data.qlocation
        },
        'services': selser,
        'tokenStarts': form_data.tokennum,
        'appointment': (form_data.appointment) ? 'Enable' : 'Disable',
        'timeInterval': form_data.timeSlot
      };
      if (this.data.type === 'edit') {
        this.ifedit = true;
        this.editProviderQueue(post_data);
      } else if (this.data.type === 'add') {
        this.addProviderQueue(post_data);
      }
    }
  }
  // Created new provider queue
  addProviderQueue(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    this.provider_services.addProviderQueue(post_data)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('WAITLIST_QUEUE_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  // update a queue
  editProviderQueue(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.data.queue.id;
    this.provider_services.editProviderQueue(post_data)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('WAITLIST_QUEUE_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  // resets api for success and failure
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  reload() {
    this.dialogRef.close('reloadlist');
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
    if (ev.checked) {
      this.timeSlotStatus = true;
      this.amForm.get('timeSlot').setValue(this.waitlist_manager.trnArndTime);
    } else {
      this.timeSlotStatus = false;
      this.amForm.get('timeSlot').setValue(0);
    }
  }
}
