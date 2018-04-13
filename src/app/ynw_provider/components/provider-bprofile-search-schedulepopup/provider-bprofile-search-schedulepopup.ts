import {Component, OnInit, Inject} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import {HeaderComponent} from '../../../shared/modules/header/header.component';
import { AddProviderSchedulesComponent } from '../add-provider-schedule/add-provider-schedule.component';
import { GoogleMapComponent } from '../googlemap/googlemap.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
    selector: 'app-providersearchschedulepopup',
    templateUrl: './provider-bprofile-search-schedulepopup.html'
})

export class ProviderBprofileSearchSchedulepopupComponent implements OnInit {
  schedule_arr: any = [];
  schedule_json: any = [];
  location_id = 0;
  constructor(
    public dialogRef: MatDialogRef<ProviderBprofileSearchSchedulepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions,
    public provider_services: ProviderServices,
    private dialog: MatDialog,
    private routerobj: Router
  ) {
     // console.log('data', data);
      this.schedule_arr = data.schedule_arr;
      this.location_id = data.bProfile.baseLocation.id;
  }

  ngOnInit() {
  }

  handlesSaveschedule(obj) {
    this.schedule_arr = obj;
   // console.log('reached schd1', this.schedule_arr);

    let post_itemdata3;
    // Check whether atleast one schedule is added
    if (this.schedule_arr.length === 0) {
      this.schedule_json = [];
    } else {
      this.schedule_json = [];
      const cdate = new Date();
      const mon = (cdate.getMonth() + 1);
      let month = '';
      if (mon < 10) {
        month = '0' + mon;
      }
      const today = cdate.getFullYear() + '-' + month + '-' + cdate.getDate();
      const save_schedule = this.shared_functions.prepareScheduleforSaving(this.schedule_arr);
      for (const schedule of save_schedule) {
        this.schedule_json.push({
          'recurringType': 'Weekly',
          'repeatIntervals': schedule.daystr,
          'startDate': today,
          'terminator': {
            'endDate': '',
            'noOfOccurance': ''
          },
          'timeSlots': [{
            'sTime': schedule.stime,
            'eTime': schedule.etime
          }]
        });
      }
    }

    post_itemdata3 = {
      'baseLocation': {
        'id' : this.location_id,
        'bSchedule': {
        'timespec': this.schedule_json
        }
      }
    };
    // this.provider_services.patchbProfile(post_itemdata3)
    this.provider_services.updatePrimaryFields(post_itemdata3)
      .subscribe(
        data => {
          this.dialogRef.close('reloadlist');
        },
        error => {

        }
      );
  }

}
