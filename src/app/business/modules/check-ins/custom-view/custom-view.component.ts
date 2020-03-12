import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';



@Component({
    selector: 'app-custom-view',
    templateUrl: './custom-view.component.html'
})
  export class CustomViewComponent implements OnInit {
  departments: any = [];
  service_list: any = [];
  selectedDepts: any = [];
  selectedDocts: any = [];
  users_list: any = [];
  qstoDisplay: any = [];
  deptObj;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    public shared_functions: SharedFunctions,
    private provider_services: ProviderServices) {
  }
  ngOnInit() {
    this.getDepartments();
    this.getServices();
  }
  getDepartments() {
    this.provider_services.getDepartments()
        .subscribe(
            data => {
                this.deptObj = data;
                this.departments = this.deptObj.departments;
            },
            error => {
                this.shared_functions.apiErrorAutoHide(this, error);
            }
        );
}
getServices() {
  this.provider_services.getUserServicesList(this.selectedDocts.toString())
      .subscribe(
          data => {
              this.service_list = data;
          },
          error => {
              this.shared_functions.apiErrorAutoHide(this, error);
          }
      );
}

getQs() {
        this.provider_services.getUserProviderQueues(this.selectedDocts.toString())
            .subscribe(
                (data) => {
                    let allQs: any = [];
                    allQs = data;
                    for (let ii = 0; ii < allQs.length; ii++) {
                            let schedule_arr = [];
                        if (allQs[ii].queueSchedule) {
                            schedule_arr = this.shared_functions.queueSheduleLoop(allQs[ii].queueSchedule);
                        }
                        let display_schedule = [];
                            display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
                            allQs[ii]['displayschedule'] = display_schedule;
                        }
                    for (let ii = 0; ii < allQs.length; ii++) {
                        if (allQs[ii].queueState === 'ENABLED') {
                            this.qstoDisplay.push(allQs[ii]);
                        }
                    }
                },
                (error) => {
                    console.log(error);
                });
}
depSelected(depIds) {
    if (this.selectedDepts.indexOf(depIds) === -1) {
        this.selectedDepts.push(depIds);
    } else {
    this.selectedDepts.splice(this.selectedDepts.indexOf(depIds), 1);
    }
}
doctorSelected(userIds) {
    if (this.selectedDocts.indexOf(userIds) === -1) {
        this.selectedDocts.push(userIds);
    } else {
        this.selectedDocts.splice(this.selectedDocts.indexOf(userIds), 1);
    }
}
userFilters() {
    let apiFilter = {};
    apiFilter['userType-eq'] = 'PROVIDER';
    apiFilter['departmentId-eq'] = this.selectedDepts.toString();
    return apiFilter;
}
getUsers() {
    let passingFilters = this.userFilters();
    this.provider_services.getUsers(passingFilters).subscribe(
        (data: any) => {
            this.users_list = data;
        }
    );
}
depNextClicked() {
    this.getUsers();
}
docNextClicked() {
    this.getServices();
}
serNextClicked() {
    this.getQs();
}
}
