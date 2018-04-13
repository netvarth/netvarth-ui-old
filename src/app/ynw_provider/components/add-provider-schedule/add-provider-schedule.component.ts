import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import * as moment from 'moment';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-schedule',
  templateUrl: './add-provider-schedule.component.html',
  styleUrls: ['./add-provider-schedule.component.css']
})
export class AddProviderSchedulesComponent implements OnInit {
  @Input() existingSchedules;
  @Input() providerStatus;
  @Input() showsavebutton;
  @Input() hidecancelbutton;
  @Output() saveScheduleClick = new EventEmitter<any>();
  @Output() cancelScheduleClick = new EventEmitter<any>();

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
  edit_index = -1;
  schedule_arr: any = [];
  show_savebutton = false;
  show_cancelbutton = false;
  constructor(
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions
    ) {
        // // console.log(data);
     }

  ngOnInit() {
    this.dstart_time =  {hour: moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), minute: moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm')};
    this.dend_time =  {hour: moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), minute: moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm')};

    this.show_savebutton = (this.showsavebutton === '1') ? true : false;
    this.show_cancelbutton = (this.hidecancelbutton === '1') ? false : true;
    this.schedule_arr = this.existingSchedules;
    if (this.schedule_arr.length === 0) {
      this.show_schedule_selection = true;
    }
    // console.log('schedule inside', this.schedule_arr);
    this.sharedfunctionObj.orderChangeWorkingHours(this.schedule_arr);
  }

  handlechecbox(dayindx) {
    this.api_error = this.api_success = '';
    const selindx = this.selday_arr.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arr.push(dayindx);
    } else {
      this.selday_arr.splice(selindx, 1);
    }
    // // console.log('curarr', this.selday_arr);
  }
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }
  onsaveScheduleClick() {
    this.api_error = this.api_success = '';
    // validate the fields
    // check whether any day is selected
    if (this.selday_arr.length === 0) {
      this.api_error = Messages.BPROFILE_ATLEASTONEDAY;
      return;
    }
    // check whether the start and end times are selected
    if (!this.dstart_time || !this.dend_time) {
      this.api_error = Messages.BPROFILE_SELECTTIME;
      return;
    }
    // today
    const curday = new Date();
    const today_date = moment(curday).format('YYYY-MM-DD');
    const today_curtime = moment(moment(curday).format('LT'), ['h:mm A']).format('HH:mm');

    if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
      this.api_error = Messages.BPROFILE_STIMEERROR;
      return;
    }
    // convert start time to 12 hour format
    // const starttime = new Date(today_date + ' ' + this.dstart_time + ':00');
    const starttime = new Date(today_date + ' ' + this.dstart_time.hour + ':' + this.dstart_time.minute + ':00');
    const starttime_format = moment(starttime).format('hh:mm A');

    // convert end time to 12 hour format
    // const endtime = new Date(today_date + ' ' + this.dend_time + ':00');
    const endtime = new Date(today_date + ' ' + this.dend_time.hour + ':' + this.dend_time.minute + ':00');
    const endtime_format = moment(endtime).format('hh:mm A');
    // // console.log('reached here1');

    for (const selday of this.selday_arr) {
     // // console.log('reached here2');
      let curindx = 0;
      for (const sch of this.schedule_arr) {
       // // console.log('reached here3', sch.day, selday);
        if (parseInt(sch.day, 10) === parseInt(selday, 10)) { // Check whether the selected day is already in the existing schedule
          let bypasscurrentlop = false;
          if (this.edit_mode && this.edit_index === curindx) {
            bypasscurrentlop = true;
          }
          if (!bypasscurrentlop) {
            // // console.log('reached here4');
            const stime = {
                            hour: parseInt(moment(sch.sTime, ['hh:mm A']).format('HH'), 10),
                            minute: parseInt(moment(sch.sTime, ['hh:mm A']).format('mm'), 10)
                          };
            const etime = {
                            hour: parseInt(moment(sch.eTime, ['hh:mm A']).format('HH'), 10),
                            minute: parseInt(moment(sch.eTime, ['hh:mm A']).format('mm'), 10)
                          };
          // const etime =  moment(sch.eTime, ['h:mm A']).format('HH:mm');
          // // console.log('obtained', this.dstart_time, stime, etime, this.dend_time);
            if ((this.sharedfunctionObj.getminutesOfDay(this.dstart_time) >= this.sharedfunctionObj.getminutesOfDay(stime))
                && (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) <= this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current start time within the existing range
                this.api_error = Messages.BPROFILE_SCHOVERLAP.replace('[day]', this.getDay(selday)) ;
                return;
            }
            if ((this.sharedfunctionObj.getminutesOfDay(this.dend_time) >= this.sharedfunctionObj.getminutesOfDay(stime))
                && (this.sharedfunctionObj.getminutesOfDay(this.dend_time) <= this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current end time within the existing range
              this.api_error = Messages.BPROFILE_SCHOVERLAP.replace('[day]', this.getDay(selday)) ;
              return;
            }
            if ((this.sharedfunctionObj.getminutesOfDay(this.dstart_time) < this.sharedfunctionObj.getminutesOfDay(stime))
                && (this.sharedfunctionObj.getminutesOfDay(this.dend_time) > this.sharedfunctionObj.getminutesOfDay(etime))) { // check whether the current start & end outside existing range
              this.api_error = Messages.BPROFILE_SCHOVERLAP.replace('[day]', this.getDay(selday)) ;
              return;
            }
          }
        }
        curindx++;
      }
      const add_schedule = {
        'day': selday,
        'sTime' : starttime_format,
        'eTime': endtime_format
      };
      if (this.edit_mode && this.edit_index >= 0 ) { // case of editing the schedule
        // console.log('editindex', this.edit_index);
        this.schedule_arr[this.edit_index] = add_schedule;
        this.api_success = Messages.BPROFILE_SCHADDEDFOR + this.getDay(selday);
      } else { // case if adding the schedule
        this.schedule_arr.push(add_schedule);
        this.api_success = Messages.BPROFILE_SCHADDEDFOR + this.getDay(selday);
      }
    }
    this.sharedfunctionObj.orderChangeWorkingHours(this.schedule_arr);
    // this.sharedfunctionObj.orderChangeWorkingHours(this.schedule_arr);
    this.saveScheduleClick.emit(this.schedule_arr);
    this.showScheduleselection();
  }
  changetime (src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_time = passtime;
      break;
      case 'end':
        this.dend_time = passtime;
      break;
    }
    // // console.log(this.dstart_time, this.dend_time);
  }

  deleteSchedule(indx) {
    this.api_error = this.api_success = '';
    this.schedule_arr.splice(indx, 1);
    this.saveScheduleClick.emit(this.schedule_arr);
  }

  showScheduleselection(indx?) {
    this.edit_heading = '';
    this.edit_index = -1;
    if (indx !== undefined) { // case of edit mode
      // // console.log('sch', this.schedule_arr);
      this.edit_index = indx;
      this.edit_mode = true;
      this.edit_heading = this.weekdays_arr[this.schedule_arr[indx]['day']] + ' ' + this.schedule_arr[indx]['sTime'] + ' - ' + this.schedule_arr[indx]['eTime'];
      this.selday_arr = [];
      this.selday_arr.push(this.schedule_arr[indx]['day']);
      this.dstart_time =  {hour: moment(this.schedule_arr[indx]['sTime'], ['h:mm A']).format('HH'), minute: moment(this.schedule_arr[indx]['sTime'], ['h:mm A']).format('mm')};
      this.dend_time =  {hour: moment(this.schedule_arr[indx]['eTime'], ['h:mm A']).format('HH'), minute: moment(this.schedule_arr[indx]['eTime'], ['h:mm A']).format('mm')};

      this.show_schedule_selection = true;
      if (this.showsavebutton === '1') {
        this.show_savebutton = false;
      }
      // // console.log('selday', this.selday_arr);
    } else {

      this.dstart_time =  {hour: moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), minute: moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm')};
      this.dend_time =  {hour: moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), minute: moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm')};

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
    if (this.edit_mode === true) {
      if (this.selday_arr.length > 0) {
        if (this.selday_arr.indexOf(indx) !== -1) {
          return true;
        } else {
            return false;
        }
      }
    } else {
      return false;
    }
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
