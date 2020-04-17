import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstants } from '../../../../../../../../shared/constants/project-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import * as moment from 'moment';

@Component({
  selector: 'app-usernonWorkingDaydetails',
  templateUrl: './usernonWorkingDaydetails.component.html'
})

export class usernonWorkingDaydetailscomponent implements OnInit {

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
  maxcharDesc = projectConstants.VALIDATOR_MAX100;

  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/miscellaneous',
      title: 'Miscellaneous'
    },
    {
      url: '/provider/settings/miscellaneous/users',
      title: 'Users'

    },
    // {
    //   title: 'Non Working Day/Hour',
    //   url: '/provider/settings/miscellaneous/holidays'
    // }
  ];

  breadcrumbs = this.breadcrumbs_init;
  customer_label;
  holiday_id;
  action;
  holiday: any;
  userId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions,
  ) {
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
    }
    );
    {
      this.activated_route.params.subscribe(
        (params) => {
          this.holiday_id = params.sid;
          console.log(this.holiday_id);
          this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
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
                      console.log(this.holiday);
                      //  this.halyday_name = this.holiday.name;
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
      )
    }

  }

  ngOnInit() {
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.userId,
      url: '/provider/settings/miscellaneous/users/add?type=edit&val=' + this.userId
    });
    breadcrumbs.push({
      title: 'Settings',
      url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings'
    });

    breadcrumbs.push({
      title: 'Non Working Day/Hour',
      url: '/provider/settings/miscellaneous/users/' + this.userId + '/settings/holidays'
    });

    // breadcrumbs.push({
    //     title: 'Add'
    // });
    this.breadcrumbs = breadcrumbs;
  }

  createForm() {

    this.amForm = this.fb.group({

      selectdate: [{ value: '', disabled: (this.action === 'edit') ? true : false }, Validators.compose([Validators.required])],
      reason: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxcharDesc)])],
      starttime: [{ hour: 9, minute: 0 }, Validators.compose([Validators.required])],
      endtime: [{ hour: 18, minute: 0 }, Validators.compose([Validators.required])]
    });
    // }

    if (this.action === 'edit') {
      this.updateForm();
      this.datepicker_disabled = 'disabled';
    }
    this.api_loading1 = false;
  }


  updateForm() {
    this.amForm.setValue({
      'selectdate': this.holiday.startDay || null,
      'reason': this.holiday.description || null,
      // tslint:disable-next-line:radix
      'starttime': { hour: parseInt(moment(this.holiday.nonWorkingHours.sTime, ['h:mm A']).format('HH')), minute: parseInt(moment(this.holiday.nonWorkingHours.sTime, ['h:mm A']).format('mm')) },
      // tslint:disable-next-line:radix
      'endtime': { hour: parseInt(moment(this.holiday.nonWorkingHours.eTime, ['h:mm A']).format('HH')), minute: parseInt(moment(this.holiday.nonWorkingHours.eTime, ['h:mm A']).format('mm')) }
    });
  }

  getholiday(holidayid) {
    console.log(holidayid);
    const _this = this;
    return new Promise(function (resolve, reject) {
      // _this.provider_services.getProviderNonworkingdays(holidayid)
      _this.provider_services.getUserdetailNonworkingday(holidayid)
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
    this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'holidays']);
    this.api_loading = false;
  }


  onSubmit(form_data) {
    this.resetApiErrors();
    const curday = new Date();
    const today_date = moment(curday).format('YYYY-MM-DD');
    const today_curtime = curday.getHours() + ':' + curday.getMinutes();
    let startdate;
    if (this.action === 'edit') {
      startdate = this.holiday.startDay;
    } else {
      startdate = form_data.selectdate;
    }
    // convert date to required format
    const date = new Date(startdate);
    const date_format = moment(date).format('YYYY-MM-DD');
    if (moment(today_date).isSame(date_format)) { // if the selected date is today
      const curtime = this.shared_functions.getTimeAsNumberOfMinutes(today_curtime);
      const selstarttime = this.shared_functions.getTimeAsNumberOfMinutes(form_data.starttime.hour + ':' + form_data.starttime.minute);
      if (selstarttime < curtime) {
        this.shared_functions.apiErrorAutoHide(this, Messages.HOLIDAY_STIME);
        return;
      }
    }
    const Start_time = this.shared_functions.getTimeAsNumberOfMinutes(form_data.starttime.hour + ':' + form_data.starttime.minute);
    const End_time = this.shared_functions.getTimeAsNumberOfMinutes(form_data.endtime.hour + ':' + form_data.endtime.minute);
    if (End_time <= Start_time) {
      this.shared_functions.apiErrorAutoHide(this, Messages.HOLIDAY_ETIME);
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
      'nonWorkingHours': {
        'sTime': starttime_format,
        'eTime': endtime_format
      },

      'startDay': date_format,
      'description': reason,
      'providerId': this.userId

    };

    if (this.action === 'edit') {
      this.editHoliday(post_data);
    } else if (this.action === 'add') {
      this.addHoliday(post_data);
      // this.adduserHoliday(post_data);
    }
  }
  addHoliday(post_data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.addUserHoliday(post_data)
      // this.provider_services.addHoliday(post_data)
      .subscribe(
        () => {
          // this.api_success = this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED');
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('HOLIDAY_CREATED'));
          this.api_loading = false;
          // this.router.navigate(['provider', 'settings', 'miscellaneous', 'holidays']);
          this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'holidays']);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }


  editHoliday(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.holiday.id;
    // this.provider_services.editHoliday(post_data)
    this.provider_services.editUserHoliday(post_data)
      .subscribe(
        () => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('HOLIDAY_UPDATED'));
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'settings', 'holidays']);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
