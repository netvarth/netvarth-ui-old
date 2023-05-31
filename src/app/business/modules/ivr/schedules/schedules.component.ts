import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { projectConstants } from '../../../../app.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { IvrService } from '../ivr.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  createSchedule: UntypedFormGroup;
  repeatIntervals: any = [0, 0, 0, 0, 0, 0, 0];
  timeSlots: any = {};
  date: any = {};
  convertedTimeSlots: any;
  weeklyIntervals: any = [
    { name: "Sun", value: 1 },
    { name: "Mon", value: 2 },
    { name: "Tue", value: 3 },
    { name: "Wed", value: 4 },
    { name: "Thu", value: 5 },
    { name: "Fri", value: 6 },
    { name: "Sat", value: 7 }
  ]
  scheduleFormValues: any = {};
  allIntervalsSelected: any = false;
  user: any;
  scheduleName: any;
  isUpdateSchedule: any = false;
  scheduleId: any;
  scheduleData: any;
  constructor(
    public schedulesDialogRef: MatDialogRef<SchedulesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createScheduleFormBuilder: UntypedFormBuilder,
    private groupService: GroupStorageService,
    private ivrService: IvrService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.createSchedule = this.createScheduleFormBuilder.group({
      repeatIntervals: new UntypedFormArray([]),
    });

    if (this.data.action && this.data.action == 'update') {
      this.isUpdateSchedule = true;
    }
    if (this.data.id) {
      this.scheduleId = this.data.id;
      this.getScheduleById(this.scheduleId).then((schedule) => {
        this.scheduleName = this.scheduleData && this.scheduleData.name;
        if (this.scheduleData && this.scheduleData.scheduleTime && this.scheduleData.scheduleTime.timeSlots && this.scheduleData.scheduleTime.timeSlots[0]) {
          this.timeSlots['sTime'] = { hour: parseInt(moment(this.scheduleData.scheduleTime.timeSlots[0]['sTime'], ['h:mm A']).format('HH'), 10), minute: parseInt(moment(this.scheduleData.scheduleTime.timeSlots[0]['sTime'], ['h:mm A']).format('mm'), 10) };
          this.timeSlots['eTime'] = { hour: parseInt(moment(this.scheduleData.scheduleTime.timeSlots[0]['eTime'], ['h:mm A']).format('HH'), 10), minute: parseInt(moment(this.scheduleData.scheduleTime.timeSlots[0]['eTime'], ['h:mm A']).format('mm'), 10) };
        }
        if (this.scheduleData && this.scheduleData.scheduleTime && this.scheduleData.scheduleTime.startDate) {
          this.date["start"] = new Date(this.scheduleData.scheduleTime.startDate);
        }
        if (this.scheduleData && this.scheduleData.scheduleTime && this.scheduleData.scheduleTime.terminator && this.scheduleData.scheduleTime.terminator.endDate) {
          this.date["end"] = new Date(this.scheduleData.scheduleTime.terminator.endDate);
        }
        if (this.scheduleData && this.scheduleData.scheduleTime && this.scheduleData.scheduleTime.repeatIntervals) {
          let repeatIntervalsFromData = this.scheduleData.scheduleTime.repeatIntervals;
          for (let i = 0; i < repeatIntervalsFromData.length; i++) {
            this.repeatIntervals[repeatIntervalsFromData[i] - 1] = repeatIntervalsFromData[i];
          }
        }
      });
    }

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.timeSlots['sTime'] = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.timeSlots['eTime'] = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
    this.changetime();
  }

  getCheckedorNot(index) {
    if (this.repeatIntervals[index]) {
      return true;
    }
    return false;
  }

  intervalValues(event, value, i) {
    if (event.checked) {
      this.repeatIntervals[i] = value;
    }
    else {
      this.repeatIntervals[i] = 0;
    }
    console.log(this.repeatIntervals);
    // this.scheduleFormValues['scheduleTime']['repeatIntervals'] = this.repeatIntervals;
  }

  changetime() {
    const curdate = new Date();
    curdate.setHours(this.timeSlots['sTime'].hour);
    curdate.setMinutes(this.timeSlots['sTime'].minute);
    const enddate = new Date();
    enddate.setHours(this.timeSlots['eTime'].hour);
    enddate.setMinutes(this.timeSlots['eTime'].minute);
    const startTime = moment(curdate).format('hh:mm A') || null;
    const endTime = moment(enddate).format('hh:mm A') || null;
    this.convertedTimeSlots = [startTime, endTime];
    console.log(this.timeSlots, startTime, endTime)
  }

  compareDate(value) {
    console.log(value);
  }

  selectAllIntervals(event) {
    if (event.checked) {
      this.repeatIntervals = [1, 2, 3, 4, 5, 6, 7];
      this.allIntervalsSelected = true;
    }
    else {
      this.repeatIntervals = [0, 0, 0, 0, 0, 0, 0];
      this.allIntervalsSelected = false;
    }
  }

  goBack() {
    this.schedulesDialogRef.close();
  }

  scheduleCreate() {
    let repeatIntervals = this.repeatIntervals.filter((interval) => {
      return interval != 0;
    })
    let data = {
      "name": this.scheduleName,
      "scheduleTime": {
        "recurringType": "Weekly",
        "repeatIntervals": repeatIntervals,
        "startDate": moment(this.date['start']).format('YYYY-MM-DD'),
        "terminator": {
          "endDate": moment(this.date['end']).format('YYYY-MM-DD'),
          "noOfOccurance": ""
        },
        "timeSlots": [
          {
            "sTime": this.convertedTimeSlots && this.convertedTimeSlots[0],
            "eTime": this.convertedTimeSlots && this.convertedTimeSlots[1]
          }
        ]
      },
      "scheduleState": "ENABLED",
      "providerId": this.user && this.user.id
    }

    if (!this.isUpdateSchedule) {
      this.ivrService.createSchedule(data).subscribe(data => {
        if (data) {
          this.snackbarService.openSnackBar("Schedule Created Successfully");
          this.schedulesDialogRef.close();
        }
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }
    else {
      data['id'] = this.scheduleId;
      this.ivrService.updateSchedule(data).subscribe(data => {
        if (data) {
          this.snackbarService.openSnackBar("Schedule Updated Successfully");
          this.schedulesDialogRef.close();
        }
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }


  }

  getScheduleById(id) {
    return new Promise((resolve, reject) => {
      this.ivrService.getScheduleById(id).subscribe(data => {
        if (data) {
          this.scheduleData = data;
        }
        resolve(true);
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    })

  }

  viewAllSchedules() {
    this.schedulesDialogRef.close();
    this.router.navigate(['provider', 'settings', 'ivrmanager', 'schedules']);
  }

}
