import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-providersearchschedulepopup',
  templateUrl: './provider-bprofile-search-schedulepopup.html'
})

export class ProviderBprofileSearchSchedulepopupComponent implements OnInit {

  close_btn = Messages.CLOSE_BTN;
  manage_work_hours_cap = Messages.MANAGE_WORK_HOURS_CAP;
  schedule_arr: any = [];
  schedule_json: any = [];
  location_id = 0;
  constructor(
    public dialogRef: MatDialogRef<ProviderBprofileSearchSchedulepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions,
    public provider_services: ProviderServices) {
    this.schedule_arr = data.schedule_arr;
    this.location_id = data.bProfile.baseLocation.id;
  }

  ngOnInit() {
  }

  handlesSaveschedule(obj) {
    this.schedule_arr = obj;

    let post_itemdata3;
    // Check whether atleast one schedule is added
    if (this.schedule_arr.length === 0) {
      this.schedule_json = [];
    } else {
      this.schedule_json = [];
      let mon;
      const cdate = new Date();
      mon = (cdate.getMonth() + 1);
      if (mon < 10) {
        mon = '0' + mon;
      }
      const today = cdate.getFullYear() + '-' + mon + '-' + cdate.getDate();
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
        'id': this.location_id,
        'bSchedule': {
          'timespec': this.schedule_json
        }
      }
    };
    // this.provider_services.patchbProfile(post_itemdata3)
    this.provider_services.updatePrimaryFields(post_itemdata3)
      .subscribe(
        () => {
          this.dialogRef.close('reloadlist');
        },
        () => {

        }
      );
  }

}
