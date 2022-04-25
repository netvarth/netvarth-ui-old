import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../../src/app/shared/constants/project-constants';


@Component({
  selector: 'app-task-activity',
  templateUrl: './task-activity.component.html',
  styleUrls: ['./task-activity.component.css']
})

export class TaskActivityComponent implements OnInit {
  waitlist_history:any;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  constructor() { }

  ngOnInit(): void {
    
  this.waitlist_history = [
      {
          "waitlistStatus": "arrived",
          "time": "2022-04-01 13:04:59.155",
          "statusChangedUser": "krishnadas ps",
          "statusChangedMode": "OPD",
          "userType": "PROVIDER"
      },
      {
          "waitlistStatus": "checkedIn",
          "time": "2022-04-01 13:05:50.187",
          "statusChangedUser": "krishnadas ps",
          "statusChangedMode": "OPD",
          "userType": "PROVIDER"
      },
      {
          "waitlistStatus": "rescheduled",
          "time": "2022-04-05 14:51:43.879",
          "statusChangedUser": "krishnadas ps",
          "statusChangedMode": "Walk-In",
          "userType": "PROVIDER"
      }
  ];

  }


  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, 'T');
    return timeDate;
  }

}
