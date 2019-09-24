import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import * as moment from 'moment';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-schedule',
  templateUrl: './add-provider-schedule.component.html',
  styleUrls: ['./add-provider-schedule.component.css']
})
export class AddProviderSchedulesComponent implements OnInit {
  @Input() existingSchedules;
  @Input() active_Schedules;
  @Input() providerStatus;
  @Input() showsavebutton;
  @Input() hidecancelbutton;
  @Input() Isource;
  @Output() saveScheduleClick = new EventEmitter<any>();
  @Output() cancelScheduleClick = new EventEmitter<any>();
  @Output() addeditScheduleClick = new EventEmitter<any>();

  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_schedule = Messages.ADD_SCHEDULE_CAP;
  edit_schedule = Messages.EDIT_SCHEDULE_BTN;
  select_days_cap = Messages.SELECT_DAYS_BTN;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  save_schedule_cap = Messages.SAVE_SCHEDULE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  update_btn = Messages.UPDATE_BTN;
  api_error = null;
  api_success = null;
  weekdays_arr = projectConstants.myweekdaysSchedule;
  dstart_time;
  dend_time;
  selday_arr: any = [];
  sch_msg_cls = 'red_cls';
  sch_msg = '';
  show_schedule_selection = false;
  edit_mode = false;
  edit_heading = '';
  edit_index = '';
  schedule_arr: any = [];
  schedule_ar: any = [];
  display_schedule: any = [];
  show_savebutton = false;
  show_cancelbutton = false;
  Selall = false;
  api_loading1 = true;
  constructor(
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
  ) {
  }

  ngOnInit() {
    this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
    this.show_savebutton = (this.showsavebutton === '1') ? true : false;
    this.show_cancelbutton = (this.hidecancelbutton === '1') ? false : true;
    // this.schedule_arr = this.existingSchedules;
    if (this.schedule_arr.length === 0) {
      this.show_schedule_selection = true;
    }
    this.sharedfunctionObj.orderChangeWorkingHours(this.schedule_arr);
    // this.display_schedule = this.sharedfunctionObj.arrageScheduleforDisplay(this.schedule_arr);

    for (let i = 0; i < this.active_Schedules.length; i++) {
      this.schedule_ar.push(this.sharedfunctionObj.arrageScheduleforDisplay(this.active_Schedules[i]));
      this.schedule_arr[i] = this.active_Schedules[i][0];
    }
    this.display_schedule = []
    for (let i = 0; i < this.schedule_ar.length; i++) {
      this.display_schedule[i] = this.schedule_ar[i][0];
    }
    this.api_loading1 = false;
  }

  handlechecbox(dayindx) {
    this.api_error = this.api_success = '';
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
  handleselectall() {
    this.Selall = true;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays_arr;
    this.weekdays_arr = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handlechecbox(ii);
    }
    this.weekdays_arr = wkdaystemp;
  }
  handleselectnone() {
    this.Selall = false;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays_arr;
    this.weekdays_arr = [];
    this.weekdays_arr = wkdaystemp;
  }
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }
  onsaveScheduleClick() {
    this.api_error = this.api_success = '';
    // validate the fields
    // check whether any day is selected
    if (this.selday_arr.length === 0) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_ATLEASTONEDAY');
      return;
    }
    // check whether the start and end times are selected
    if (!this.dstart_time || !this.dend_time) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_SELECTTIME');
      return;
    }
    if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) === this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
      this.api_error = 'Start Time and End Time cannot be the same';
      return;
    }
    // today
    const curday = new Date();
    const today_date = moment(curday).format('YYYY-MM-DD');

    if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_STIMEERROR');
      return;
    }
    // convert start time to 12 hour format
    // const starttime = new Date(today_date + ' ' + this.dstart_time + ':00');

    const starttime = today_date + ' ' + this.dstart_time.hour + ':' + this.dstart_time.minute + ':00';
    const starttime_format = moment(starttime, 'YYYY-MM-DD hh:mm A').format('hh:mm A');
    // convert end time to 12 hour format
    // const endtime = new Date(today_date + ' ' + this.dend_time + ':00');
    const endtime = today_date + ' ' + this.dend_time.hour + ':' + this.dend_time.minute + ':00';
    const endtime_format = moment(endtime, 'YYYY-MM-DD hh:mm A').format('hh:mm A');

    // const starttime = new Date(today_date + ' ' + this.dstart_time.hour + ':' + this.dstart_time.minute + ':00');
    // const starttime_format = moment(starttime,).format('hh:mm A');

    // convert end time to 12 hour format
    // const endtime = new Date(today_date + ' ' + this.dend_time + ':00');
    // const endtime = new Date(today_date + ' ' + this.dend_time.hour + ':' + this.dend_time.minute + ':00');
    // const endtime_format = moment(endtime).format('hh:mm A');
    const hold_schedule_edit_indexes = [];
    const hold_schedule_update = [];
    for (const selday of this.selday_arr) {
      let curindx = '';
      let cindx = 0;
      for (const sch of this.schedule_arr) {
        if (parseInt(sch.day, 10) === parseInt(selday, 10)) { // Check whether the selected day is already in the existing schedule
          let bypasscurrentlop = false;
          curindx = this.schedule_arr[cindx]['sTime'].replace(/\s+/, '') + this.schedule_arr[cindx]['eTime'].replace(/\s+/, '');
          if (this.edit_mode && this.edit_index === curindx) {
            bypasscurrentlop = true;
            hold_schedule_edit_indexes.push({ 'indx': cindx });
          }
          if (!bypasscurrentlop) {
            const stime = {
              hour: parseInt(moment(sch.sTime, ['hh:mm A']).format('HH'), 10),
              minute: parseInt(moment(sch.sTime, ['hh:mm A']).format('mm'), 10)
            };
            const etime = {
              hour: parseInt(moment(sch.eTime, ['hh:mm A']).format('HH'), 10),
              minute: parseInt(moment(sch.eTime, ['hh:mm A']).format('mm'), 10)
            };
            // const etime =  moment(sch.eTime, ['h:mm A']).format('HH:mm');
            if ((this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(stime))
              && (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) < this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current start time within the existing range
              this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_SCHOVERLAP').replace('[day]', this.getDay(selday));
              return;
            }
            if ((this.sharedfunctionObj.getminutesOfDay(this.dend_time) > this.sharedfunctionObj.getminutesOfDay(stime))
              && (this.sharedfunctionObj.getminutesOfDay(this.dend_time) < this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current end time within the existing range
              this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_SCHOVERLAP').replace('[day]', this.getDay(selday));
              return;
            }
            if ((this.sharedfunctionObj.getminutesOfDay(this.dstart_time) <= this.sharedfunctionObj.getminutesOfDay(stime))
              && (this.sharedfunctionObj.getminutesOfDay(this.dend_time) >= this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current start & end outside existing range
              this.api_error = this.sharedfunctionObj.getProjectMesssages('BPROFILE_SCHOVERLAP').replace('[day]', this.getDay(selday));
              return;
            }
          }
        }
        cindx++;
      }
      const add_schedule = {
        'day': selday,
        'sTime': starttime_format,
        'eTime': endtime_format
      };
      if (this.edit_mode && this.edit_index !== '') { // case of editing the schedule
        hold_schedule_update.push(add_schedule);
        // this.schedule_arr[this.edit_index] = add_schedule;
        // this.api_success = Messages.BPROFILE_SCHADDEDFOR + this.getDay(selday);
      } else { // case if adding the schedule
        this.schedule_arr.push(add_schedule);
        // this.api_success = this.sharedfunctionObj.getProjectMesssages('BPROFILE_SCHADDEDFOR') + this.getDay(selday);
      }
    }
    if (this.edit_mode && this.edit_index !== '') {
      const holdschtemp = [];
      for (const sch of this.schedule_arr) { // removing the records related to the currently edited item
        const ncurindx = sch['sTime'].replace(/\s+/, '') + sch['eTime'].replace(/\s+/, '');
        if (ncurindx !== this.edit_index) {
          holdschtemp.push(sch);
        }
      }
      this.schedule_arr = holdschtemp;
      for (const addsch of hold_schedule_update) { // adding the schedule from the edited section
        this.schedule_arr.push(addsch);
      }
    }

    this.sharedfunctionObj.orderChangeWorkingHours(this.schedule_arr);
    this.display_schedule = this.sharedfunctionObj.arrageScheduleforDisplay(this.schedule_arr);
    this.saveScheduleClick.emit(this.schedule_arr);
    this.showScheduleselection();
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
  deleteSchedule(indx) {
    const holdarr = [];
    this.api_error = this.api_success = '';
    for (let i = 0; i < this.schedule_arr.length; i++) {
      const timeindx = this.schedule_arr[i]['sTime'].replace(/\s+/, '') + this.schedule_arr[i]['eTime'].replace(/\s+/, '');
      if (timeindx !== indx) {
        // this.schedule_arr.splice(indx, 1);
        holdarr.push(this.schedule_arr[i]);
      }
    }
    this.schedule_arr = holdarr;
    this.display_schedule = this.sharedfunctionObj.arrageScheduleforDisplay(this.schedule_arr);
    this.saveScheduleClick.emit(this.schedule_arr);
  }
  addScheduleSelection() {
    // this.Selall = false;
    this.handleselectnone();
    this.addeditScheduleClick.emit('addeditclicked');
    this.showScheduleselection();
  }
  cancelscheduleClicked() {
    this.handleselectnone();
    this.showScheduleselection();
    this.cancelScheduleClick.emit(this.schedule_arr);
  }
  editwScheduleselection(indx, schedule) {
    this.handleselectnone();
    this.addeditScheduleClick.emit('addeditclicked');
    this.showScheduleselection(indx, schedule);
  }

  showScheduleselection(indx?, obj?) {
    this.edit_heading = '';
    this.edit_index = '';
    if (indx !== undefined) { // case of edit mode
      this.edit_heading = obj['dstr'] + ' ' + obj['time'];
      this.edit_index = indx;
      this.edit_mode = true;
      // this.edit_heading = this.weekdays_arr[this.schedule_arr[indx]['day']] + ' ' + this.schedule_arr[indx]['sTime'] + ' - ' + this.schedule_arr[indx]['eTime'];
      this.selday_arr = [];
      let sindx;
      for (let i = 0; i < this.schedule_arr.length; i++) {
        const timeindx = this.schedule_arr[i]['sTime'].replace(/\s+/, '') + this.schedule_arr[i]['eTime'].replace(/\s+/, '');
        if (timeindx === indx) {
          this.selday_arr.push(parseInt(this.schedule_arr[i]['day'], 10));
          sindx = i;
        }
      }
      if (this.selday_arr.length === 7) {
        this.Selall = true;
      } else {
        this.Selall = false;
      }
      this.dstart_time = { hour: parseInt(moment(this.schedule_arr[sindx]['sTime'], ['h:mm A']).format('HH'), 10), minute: parseInt(moment(this.schedule_arr[sindx]['sTime'], ['h:mm A']).format('mm'), 10) };
      this.dend_time = { hour: parseInt(moment(this.schedule_arr[sindx]['eTime'], ['h:mm A']).format('HH'), 10), minute: parseInt(moment(this.schedule_arr[sindx]['eTime'], ['h:mm A']).format('mm'), 10) };

      this.show_schedule_selection = true;
      if (this.showsavebutton === '1') {
        this.show_savebutton = false;
      }
    } else {

      this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
      this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };

      this.edit_mode = false;
      this.api_error = this.api_success = '';
      if (this.show_schedule_selection) {
        this.selday_arr = []; // resetting the day selection array
        this.show_schedule_selection = false;
        if (this.showsavebutton === '1') {
          this.show_savebutton = true;
        }
      } else {
        this.show_schedule_selection = true;
        if (this.showsavebutton === '1') {
          this.show_savebutton = false;
        }
      }
    }
  }
  check_daychecked(indx) {
    // if (this.edit_mode === true) {
    if (this.selday_arr.length > 0) {
      if (this.selday_arr.indexOf(indx) !== -1) {
        return true;
      } else {
        return false;
      }
    }
    //  } else {
    //    return false;
    //  }
  }
  isbeingEdited(indx) {
    if (indx === this.edit_index) {
      return true;
    } else {
      return false;
    }
  }
  save_schedule_button_clicked() {
    this.saveScheduleClick.emit(this.schedule_arr);
  }
  cancel_schedule_button_clicked() {
    this.cancelScheduleClick.emit(this.schedule_arr);
  }
}
