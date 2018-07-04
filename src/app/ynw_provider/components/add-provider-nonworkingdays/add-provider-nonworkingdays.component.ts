import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import * as moment from 'moment';

@Component({
  selector: 'app-provider-add-nonworkingdays',
  templateUrl: './add-provider-nonworkingdays.component.html',
  styleUrls: ['./add-provider-nonworkingdays.component.css']
})
export class AddProviderNonworkingdaysComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id ;
  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
  datepicker_disabled = '';
  meridian = true;
  constructor(
    public dialogRef: MatDialogRef<AddProviderNonworkingdaysComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {

     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
    selectdate: [{value: '', disabled: (this.data.type === 'edit') ? true : false}, Validators.compose([Validators.required])],
    reason: ['', Validators.compose([Validators.required])],
    starttime: [{hour: 9, minute: 0}, Validators.compose([Validators.required])],
    endtime: [{hour: 18, minute: 0}, Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
     this.updateForm();
     this.datepicker_disabled = 'disabled';
    }
  }
  updateForm() {
    this.amForm.setValue({
      'selectdate': this.data.holiday.startDay || null,
      'reason': this.data.holiday.description || null,
      'starttime': {hour: moment(this.data.holiday.nonWorkingHours.sTime, ['h:mm A']).format('HH'), minute: moment(this.data.holiday.nonWorkingHours.sTime, ['h:mm A']).format('mm')},
      'endtime': {hour: moment(this.data.holiday.nonWorkingHours.eTime, ['h:mm A']).format('HH'), minute: moment(this.data.holiday.nonWorkingHours.eTime, ['h:mm A']).format('mm')}
    });
  }
  onSubmit (form_data) {
    this.resetApiErrors();
    // today
    const curday = new Date();
    const today_date = moment(curday).format('YYYY-MM-DD');
    const today_curtime = moment(moment(curday).format('LT'), ['h:mm A']).format('HH:mm');
    let startdate;
    if (this.data.type === 'edit') {
      startdate = this.data.holiday.startDay;
    } else {
      startdate = form_data.selectdate;
    }
    // convert date to required format
    const date =  new Date(startdate);
    const date_format = moment(date).format('YYYY-MM-DD');

    if (today_date === date_format) {
      const curtime = today_curtime;
      const selstarttime = form_data.starttime;
      if (selstarttime < curtime) {
        this.shared_functions.apiErrorAutoHide(this, Messages.HOLIDAY_STIME);
        return;
      }
    }

    if (form_data.endtime < form_data.starttime) {
      this.shared_functions.apiErrorAutoHide(this, Messages.HOLIDAY_ETIME);
      return;
    }

    // convert start time to 12 hour format
/*    const starttime = new Date(date_format + ' ' + form_data.starttime + ':00');
    const starttime_format =  moment(starttime).format('hh:mm A') || null; // moment(starttime).format('LT'); */

    const starttime = new Date(date_format + ' ' + form_data.starttime.hour + ':' + form_data.starttime.minute + ':00');
    const starttime_format =  moment(starttime).format('hh:mm A') || null; // moment(starttime).format('LT');

        // convert end time to 12 hour format
    /*const endtime = new Date(date_format + ' ' + form_data.endtime + ':00');
    const endtime_format =  moment(endtime).format('hh:mm A') || null; // moment(endtime).format('LT');*/

    const endtime = new Date(date_format + ' ' +  form_data.endtime.hour + ':' + form_data.endtime.minute + ':00');
    const endtime_format =  moment(endtime).format('hh:mm A') || null; // moment(endtime).format('LT');

        const post_data = {
            'nonWorkingHours': {
              'sTime': starttime_format,
              'eTime': endtime_format
            },
            'startDay': date_format,
            'description': form_data.reason
        };

        if (this.data.type === 'edit') {
            this.editHoliday(post_data);
        } else if (this.data.type === 'add') {
            this.addHoliday(post_data);
        }
  }
  addHoliday(post_data) {
    this.provider_services.addHoliday(post_data)
        .subscribe(
          data => {
           this.api_success = this.shared_functions.getProjectMesssages('HOLIDAY_CREATED');
           setTimeout(() => {
            this.dialogRef.close('reloadlist');
           }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.shared_functions.apiErrorAutoHide(this, error);
          }
        );
  }
  editHoliday(post_data) {
    post_data.id =  this.data.holiday.id;
    this.provider_services.editHoliday(post_data)
        .subscribe(
          data => {
            this.api_success = this.shared_functions.getProjectMesssages('HOLIDAY_UPDATED');
            setTimeout(() => {
            this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.shared_functions.apiErrorAutoHide(this, error);
          }
    );
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
