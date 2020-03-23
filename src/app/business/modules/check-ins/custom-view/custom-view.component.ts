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
  selectedServices: any = [];
  users_list: any = [];
  qstoDisplay: any = [];
  selectedQueues: any = [];
  deptObj;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  breadcrumbs = [
    {
        title: 'Dashboard',
        url: '/provider'
    },
    {
        title: 'Custom View'
    }
];

  constructor(private _formBuilder: FormBuilder,
    public shared_functions: SharedFunctions,
    private provider_services: ProviderServices) {
  }
  ngOnInit() {
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
              console.log(this.service_list);
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
depSelected(depIds, i) {
    if (this.selectedDepts.indexOf(depIds) === -1) {
        this.selectedDepts.push(depIds);
        this.departments[i].selected = true;
    } else {
    this.selectedDepts.splice(this.selectedDepts.indexOf(depIds), 1);
    this.departments[i].selected = false;
    }
}
doctorSelected(userIds, i) {
    this.users_list[i].selected = !this.users_list[i].selected;
    if (this.selectedDocts.indexOf(userIds) === -1) {
        this.selectedDocts.push(userIds);
        // this.users_list[index].selected = true;
    } else {
        this.selectedDocts.splice(this.selectedDocts.indexOf(userIds), 1);
        // this.users_list[index].selected = false;
    }
}
servSelected(servIds) {
    if (this.selectedServices.indexOf(servIds) === -1) {
        this.selectedServices.push(servIds);
    } else {
        this.selectedServices.splice(this.selectedServices.indexOf(servIds), 1);
    }
}
selectedQs(QIds) {
    if (this.selectedQueues.indexOf(QIds) === -1) {
        this.selectedQueues.push(QIds);
    } else {
        this.selectedQueues.splice(this.selectedQueues.indexOf(QIds), 1);
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
createCustomView() {
    let customviewFilter = {};
    customviewFilter['userId-eq'] = this.selectedDocts.toString();
    customviewFilter['departmentId-eq'] = this.selectedDepts.toString();
    customviewFilter['serviceId-eq'] = this.selectedServices.toString();
    customviewFilter['queueId-eq'] = this.selectedQueues.toString();
    console.log(this.selectedDocts);
    console.log(this.selectedServices);
    console.log(this.selectedDepts);
    console.log(this.selectedQueues);
    const customViewInput = {
        'department' : this.selectedDepts,
        'users' : this.selectedDocts,
        'services' : this.selectedServices,
        'queues' : this.selectedQueues,
        'queryString' : customviewFilter
    };
    console.log(customViewInput);
}
depAddClicked() {
    this.getDepartments();
}
doctorsAddClicked() {
    this.getUsers();
}
servicesAddClicked() {
    this.getServices();
}
qAddClicked() {
    this.getQs();
}
}
