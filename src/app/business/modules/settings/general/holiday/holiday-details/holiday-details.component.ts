import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import * as moment from 'moment';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../../../../shared/services/datetime-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';

@Component({
  selector: 'app-holiday-details',
  templateUrl: './holiday-details.component.html'
})

export class HolidayDetailsComponent implements OnInit {

  non_working_day_cap = Messages.NON_WORK_DAY_HI_CAP;
  non_working_day_or_hr_cap = Messages.NON_WORK_DAY_OR_HR_CAP;
  reason_cap = Messages.REASON_CAP;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;

  disableButton = false;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
  datepicker_disabled = '';
  meridian = true;
  api_loading = true;
  api_loading1 = true;
  maxcharDesc = projectConstantsLocal.VALIDATOR_MAX100;

  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/general',
      title: Messages.GENERALSETTINGS
    },
    {
      title: 'Non Working Day/Hour',
      url: '/provider/settings/general/holidays'
    }
  ];

  breadcrumbs = this.breadcrumbs_init;
  customer_label;
  holiday_id;
  action;
  holiday: any;
  selectedDate;
  confirm_data: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private dialog: MatDialog,
  ) {
    {
      this.activated_route.params.subscribe(
        (params) => {
          this.holiday_id = params.id;
          this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
          if (this.holiday_id) {
            if (this.holiday_id === 'add') {
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                title: 'Add'
              });
              this.breadcrumbs = breadcrumbs;
              this.action = 'add';
              this.createForm();
            } else {
              this.activated_route.queryParams.subscribe(
                (qParams) => {
                  this.action = qParams.action;
                  this.getholiday(this.holiday_id).then(
                    (item) => {
                      this.holiday = item;
                      this.selectedDate = this.holiday.holidaySchedule.startDay;
                      if (this.action === 'edit') {
                        this.createForm();
                      }
                    }
                  );
                }
              );
            }
            this.api_loading = false;
          }
        }
      );
    }
  }

  ngOnInit() { }

  createForm() {
    this.amForm = this.fb.group({
      selectdate: [{ value: '', disabled: (this.action === 'edit') ? true : false }, Validators.compose([Validators.required])],
      enddate:[{ value: '', disabled: (this.action === 'edit') ? true : false }, Validators.compose([Validators.required])],
      reason: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxcharDesc)])],
      starttime: [{ hour: 9, minute: 0 }, Validators.compose([Validators.required])],
      endtime: [{ hour: 18, minute: 0 }, Validators.compose([Validators.required])]
    });
    if (this.action === 'edit') {
      this.updateForm();
      this.datepicker_disabled = 'disabled';
    }
    this.api_loading1 = false;
  }

  updateForm() {
    this.amForm.setValue({
      'selectdate': this.holiday.holidaySchedule.startDate || null,
      'reason': this.holiday.description || null,
      'enddate':this.holiday.holidaySchedule.terminator.endDate || null,
      // tslint:disable-next-line:radix
      'starttime': { hour: parseInt(moment(this.holiday.holidaySchedule.timeSlots[0].sTime, ['h:mm A']).format('HH')), minute: parseInt(moment(this.holiday.holidaySchedule.timeSlots[0].sTime, ['h:mm A']).format('mm')) },
      // tslint:disable-next-line:radix
      'endtime': { hour: parseInt(moment(this.holiday.holidaySchedule.timeSlots[0].eTime, ['h:mm A']).format('HH')), minute: parseInt(moment(this.holiday.holidaySchedule.timeSlots[0].eTime, ['h:mm A']).format('mm')) }
    });
  }

  getholiday(holidayid) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getProviderNonworkingdays(holidayid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  onCancel() {
    this.router.navigate(['provider', 'settings', 'general', 'holidays']);
    this.api_loading = false;
  }

  onSubmit(form_data) {
    console.log(form_data);
    this.resetApiErrors();
    const curday = new Date();
    const today_date = moment(curday).format('YYYY-MM-DD');
    const today_curtime = curday.getHours() + ':' + curday.getMinutes();
    let startdate;
    let end_date;
    if (this.action === 'edit') {
      // startdate = form_data.selectdate;
      // end_date = form_data.enddate;
      startdate =  this.holiday.holidaySchedule.startDate;
      end_date = this.holiday.holidaySchedule.terminator.endDate;
    } else {
      startdate = form_data.selectdate;
      end_date = form_data.enddate;
    }
    // convert end-date to required format    
    const e_date = new Date(end_date);
    const enddate_format = moment(e_date).format('YYYY-MM-DD');

    // convert date to required format
    const date = new Date(startdate);
    const date_format = moment(date).format('YYYY-MM-DD');
    if (moment(today_date).isSame(date_format)) { // if the selected date is today
      const curtime = this.dateTimeProcessor.getTimeAsNumberOfMinutes(today_curtime);
      const selstarttime = this.dateTimeProcessor.getTimeAsNumberOfMinutes(form_data.starttime.hour + ':' + form_data.starttime.minute);
      if (selstarttime < curtime) {
        this.snackbarService.openSnackBar(Messages.HOLIDAY_STIME, { 'panelClass': 'snackbarerror' });
        return;
      }
    }
    const Start_time = this.dateTimeProcessor.getTimeAsNumberOfMinutes(form_data.starttime.hour + ':' + form_data.starttime.minute);
    const End_time = this.dateTimeProcessor.getTimeAsNumberOfMinutes(form_data.endtime.hour + ':' + form_data.endtime.minute);
    if (End_time <= Start_time) {
      this.snackbarService.openSnackBar(Messages.HOLIDAY_ETIME, { 'panelClass': 'snackbarerror' });
      return;
    }
    const curdate = new Date();
    curdate.setHours(form_data.starttime.hour);
    curdate.setMinutes(form_data.starttime.minute);
    const enddate = new Date();
    enddate.setHours(form_data.endtime.hour);
    enddate.setMinutes(form_data.endtime.minute);
    const starttime_format = moment(curdate).format('hh:mm A') || null; // moment(starttime).format('LT');
    const endtime_format = moment(enddate).format('hh:mm A') || null; // moment(endtime).format('LT');
    const reason = form_data.reason.trim();
    if (reason === '') {
      this.api_error = 'Please mention the reason';
      if (document.getElementById('reason')) {
        document.getElementById('reason').focus();
      }
      return;
    }
    const post_data = {
      // 'nonWorkingHours': {
      //   'sTime': starttime_format,
      //   'eTime': endtime_format
      // },
      // 'startDay': date_format,
      // 'description': reason
      'holidaySchedule': {
        "recurringType": "Weekly",
        "repeatIntervals": [1, 2, 3, 4, 5, 6, 7],
        'startDate':  date_format,
        'terminator': {
        "endDate": enddate_format,
        "noOfOccurance": 0
        },
        "timeSlots": [{
        "sTime": starttime_format,
        "eTime": endtime_format
        }]
        },
        'description': reason

    };
    if (this.action === 'edit') {
      console.log(post_data);
      this.editHoliday(post_data);
    } else if (this.action === 'add') {
      this.addHoliday(post_data);
    }
  }
  addHoliday(post_data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.addHoliday(post_data)
      .subscribe((data: any) => {
        console.log(data);
        this.confirm_data = data
        if(this.confirm_data.apptCount >0 || this.confirm_data.waitlistCount >0 ){
        const canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
       width: '50%',
       panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
       disableClose: true,
       data: {
         'message': data.msg,
         'heading': 'Confirm',
         'type': 'yes/no'
       }
     });
     canceldialogRef.afterClosed().subscribe(result => {
      let status = 0;
      status = result;
      if (status === 1) {
        console.log(result);
        this.provider_services.Holidaywaitlist(this.confirm_data.holidayId)
          .subscribe(
            () => {
                   },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
    });
    }
    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('HOLIDAY_CREATED'));
    this.api_loading = false;
    this.router.navigate(['provider', 'settings', 'general', 'holidays']);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  editHoliday(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.holiday.id;
    console.log(post_data);
    this.provider_services.editHoliday(post_data)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('HOLIDAY_UPDATED'));
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'general', 'holidays']);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  redirecToGeneral() {
    this.router.navigate(['provider', 'settings', 'general', 'holidays']);
  }
}
