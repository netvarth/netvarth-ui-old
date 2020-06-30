import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import * as moment from 'moment';
@Component({
  'selector': 'app-check-status-component',
  'templateUrl': './check-status.component.html'
})
export class CheckYourStatusComponent implements OnInit {
  api_loading: boolean;
  // checkinDetails: any = [];
  type;
  encId;
  waitlist: any;
  statusInfo: any;
  foundDetails = false;
  estimatesmallCaption = Messages.ESTIMATED_TIME_SMALL_CAPTION;
  status_started_cap = Messages.STATUS_STARTED;
  status_done_cap = Messages.STATUS_DONE;
  first_person = Messages.FIRST_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  token_no = Messages.TOKEN_NO;
  server_date;
  placeText;
  breadcrumbs = [
    {
      title: 'Know Your Status'
    }
  ];
  constructor(private shared_services: SharedServices,
    private router: Router,
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions) {
    this.activated_route.params.subscribe(
      qparams => {
        // this.type = qparams.type;
        if (qparams.id !== 'new') {
          this.encId = qparams.id;
          if (this.encId.split('-')[0] === 'c') {
            this.type = 'wl';
          }
          if (this.type === 'wl') {
            this.placeText = 'Check-in Id';
          } else {
            this.placeText = 'Appointment Id';
          }
        } else {
          this.placeText = 'Enter Id';
        }
        // console.log(this.type);
        console.log(this.encId);
      });
  }
  setSystemDate() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getSystemDate()
        .subscribe(
          res => {
            _this.server_date = res;
            _this.shared_functions.setitemonLocalStorage('sysdate', res);
            resolve();
          },
          () => {
            reject();
          }
        );
    });
  }
  ngOnInit() {
    this.setSystemDate();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.api_loading = true;
    if (this.encId) {
      if (this.type === 'wl') {
        this.getWLDetails(this.encId);
      } else {
        this.getApptDetails(this.encId);
      }
    }
  }
  getAppxTime(waitlist) {
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'timenow': '', 'timeslot': '', 'autoreq': false, 'time_inmins': waitlist.appxWaitingTime, 'cancelled_time': '', 'cancelled_date': '', 'cancelled_caption': '' };
    if (waitlist.waitlistStatus !== 'cancelled') {
      if (waitlist.hasOwnProperty('serviceTime') || waitlist.calculationMode === 'NoCalc') {
        appx_ret.caption = 'Checked in for'; // 'Check-In Time';
        if (waitlist.calculationMode === 'NoCalc') {
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.time = waitlist.serviceTime;
        }
        const waitlist_date = new Date(waitlist.date);
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
          appx_ret.date = waitlist.date;
          appx_ret.date_type = 'date';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.date = 'Today';
          appx_ret.date_type = 'string';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        }
      } else {
        if (waitlist.appxWaitingTime === 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
          appx_ret.timenow = 'Now';
        } else if (waitlist.appxWaitingTime !== 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.date = '';
          appx_ret.time = this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);
          appx_ret.autoreq = true;
        }
      }
    } else {
      let time = [];
      let time1 = [];
      let t2;
      appx_ret.caption = 'Checked in for';
      appx_ret.date = waitlist.date;
      appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
      appx_ret.cancelled_date = moment(waitlist.statusUpdatedTime, 'YYYY-MM-DD').format();
      time = waitlist.statusUpdatedTime.split('-');
      time1 = time[2].trim();
      t2 = time1.slice(2);
      appx_ret.cancelled_time = t2;
      appx_ret.cancelled_caption = 'Cancelled on ';
    }
    return appx_ret;
  }
  getApptAppxTime(waitlist) {
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'timenow': '', 'timeslot': '', 'autoreq': false, 'time_inmins': waitlist.appxWaitingTime, 'cancelled_time': '', 'cancelled_date': '', 'cancelled_caption': '' };
    if (waitlist.apptStatus !== 'Cancelled' && waitlist.apptStatus !== 'Rejected') {
      appx_ret.caption = 'Appointment for'; // 'Check-In Time';
      const waitlist_date = new Date(waitlist.appmtDate);
      const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
      const today = new Date(todaydt);
      today.setHours(0, 0, 0, 0);
      waitlist_date.setHours(0, 0, 0, 0);
      if (today.valueOf() < waitlist_date.valueOf()) {
        appx_ret.date = waitlist.appmtDate;
        appx_ret.date_type = 'date';
        const timeSchedules = waitlist.appmtTime.split('-');
        const queueStartTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[0]);
        const queueEndTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[1]);
        appx_ret.timeslot = queueStartTime + ' - ' + queueEndTime;
      } else {
        appx_ret.date = 'Today';
        appx_ret.date_type = 'string';
        const timeSchedules = waitlist.appmtTime.split('-');
        const queueStartTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[0]);
        const queueEndTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[1]);
        appx_ret.timeslot = queueStartTime + ' - ' + queueEndTime;
      }
    } else {
      let time = [];
      let time1 = [];
      let t2;
      appx_ret.caption = 'Appointment for ';
      appx_ret.date = waitlist.date;
      const timeSchedules = waitlist.appmtTime.split('-');
      const queueStartTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[0]);
      const queueEndTime = this.shared_functions.convert24HourtoAmPm(timeSchedules[1]);
      appx_ret.time = queueStartTime + ' - ' + queueEndTime;
      appx_ret.cancelled_date = moment(waitlist.statusUpdatedTime, 'YYYY-MM-DD').format();
      time = waitlist.statusUpdatedTime.split('-');
      time1 = time[2].trim();
      t2 = time1.slice(2);
      appx_ret.cancelled_time = t2;
      if (waitlist.apptStatus === 'Rejected') {
        appx_ret.cancelled_caption = 'Rejected on ';
      } else {
      appx_ret.cancelled_caption = 'Cancelled on ';
      }
    }
    return appx_ret;
  }
  getDetails (encId) {
    if (encId.split('-')[0] === 'c') {
      this.getWLDetails(encId);
    } else {
      this.getApptDetails(encId);
    }
  }
  getWLDetails(encId) {
    this.foundDetails = false;
    this.shared_services.getCheckinbyEncId(encId)
      .subscribe(
        (data: any) => {
          const wlInfo = data;
          this.statusInfo = data;
          this.foundDetails = true;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const waitlist_date = new Date(wlInfo.date);
          today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);
          wlInfo.future = false;
          const retval = this.getAppxTime(wlInfo);
          if (today.valueOf() < waitlist_date.valueOf()) {
            wlInfo.future = true;
            wlInfo.estimated_time = retval.time;
            wlInfo.estimated_timenow = retval.timenow;
            wlInfo.estimated_timeslot = retval.timeslot;
            wlInfo.estimated_caption = retval.caption;
            wlInfo.estimated_date = retval.date;
            wlInfo.estimated_date_type = retval.date_type;
            wlInfo.estimated_autocounter = retval.autoreq;
          } else {
            wlInfo.estimated_time = retval.time;
            wlInfo.estimated_timenow = retval.timenow;
            wlInfo.estimated_timeslot = retval.timeslot;
            wlInfo.estimated_caption = retval.caption;
            wlInfo.estimated_date = retval.date;
            wlInfo.estimated_date_type = retval.date_type;
            wlInfo.estimated_autocounter = retval.autoreq;
            wlInfo.estimated_timeinmins = retval.time_inmins;
          }
          wlInfo.cancelled_caption = retval.cancelled_caption;
          wlInfo.cancelled_date = retval.cancelled_date;
          wlInfo.cancelled_time = retval.cancelled_time;
          this.api_loading = false;
          this.statusInfo = wlInfo;
          console.log(this.statusInfo);
        },
        (error) => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.foundDetails = false;
        });
  }
  getApptDetails(encId) {
    this.foundDetails = false;
    this.shared_services.getApptbyEncId(encId)
      .subscribe(
        (data: any) => {
          this.foundDetails = true;
          const wlInfo = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const waitlist_date = new Date(wlInfo.date);
          today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);
          wlInfo.future = false;
          const retval = this.getApptAppxTime(wlInfo);
          if (today.valueOf() < waitlist_date.valueOf()) {
            wlInfo.future = true;
            wlInfo.estimated_time = retval.time;
            wlInfo.estimated_timenow = retval.timenow;
            wlInfo.estimated_timeslot = retval.timeslot;
            wlInfo.estimated_caption = retval.caption;
            wlInfo.estimated_date = retval.date;
            wlInfo.estimated_date_type = retval.date_type;
            wlInfo.estimated_autocounter = retval.autoreq;
          } else {
            wlInfo.estimated_time = retval.time;
            wlInfo.estimated_timenow = retval.timenow;
            wlInfo.estimated_timeslot = retval.timeslot;
            wlInfo.estimated_caption = retval.caption;
            wlInfo.estimated_date = retval.date;
            wlInfo.estimated_date_type = retval.date_type;
            wlInfo.estimated_autocounter = retval.autoreq;
            wlInfo.estimated_timeinmins = retval.time_inmins;
          }
          wlInfo.cancelled_caption = retval.cancelled_caption;
          wlInfo.cancelled_date = retval.cancelled_date;
          wlInfo.cancelled_time = retval.cancelled_time;
          this.api_loading = false;
          this.statusInfo = wlInfo;
          console.log(this.statusInfo);
          this.api_loading = false;
        },
        (error) => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.foundDetails = false;
        });
  }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }
}

