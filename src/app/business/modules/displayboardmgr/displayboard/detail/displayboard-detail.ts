import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';

@Component({
    selector: 'app-displayboard-detail',
    templateUrl: './displayboard-detail.html'
})
export class DisplayboardDetailComponent implements OnInit {
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    dept_data;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    api_loading1 = true;
    sboard_id;
    action = 'show';
    deptObj;
    boardInfo = {
        'name': null,
        'displayname': null,
    };
    api_loading: boolean;
    departments: any = [];
    services_list: any = [];
    loading = true;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Displayboards',
            url: '/provider/settings/displayboard/list'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_Functionsobj: SharedFunctions,
        public provider_shared_functions: ProviderSharedFuctions,
        private shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute
    ) {
        this.activated_route.params.subscribe(params => {
            this.sboard_id = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.actionparam = qparams.action;
            });
     }
    ngOnInit() {
        this.initSboardParams();
        this.getProviderServices();
        this.getDepartments();
        this.getProviderQueues();
    }
    initSboardParams() {
        if (this.sboard_id === 'add') {
            this.sboard_id = null;
            this.api_loading = false;
        }
        if (this.sboard_id) {
            this.getDisplayboardDetails();
        } else {
            this.action = 'add';
            this.createForm();
        }
    }
    getDisplayboardDetails() {

    }
    onSubmit(form_data) {
        const data = {};
        data['customfield'] = form_data;
        data['action'] = this.action;
    }
    createLabel() {
        const form_data = {};
        form_data['name'] = this.boardInfo.name;
        form_data['displayname'] = this.boardInfo.displayname;
        console.log(form_data);
        // "notification": [
        //   {
        //     "values": "string",
        //     "messages": "string"
        //   }
        // ]
        this.provider_services.createLabel(form_data)
            .subscribe(
                (id) => {
                    this.sboard_id = id;
                    this.getDisplayboardDetails();
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    onCancel () {
        this.router.navigate(['provider/settings/displayboard/list']);
    }
    createForm() {
        this.amForm = this.fb.group({
            Name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            Displayname: ['', Validators.compose([Validators.maxLength(500)])],
            Defaultvalue: ['', Validators.compose([Validators.maxLength(500)])],
        });
    }
    getProviderServices() {
        this.api_loading1 = true;
        const params = { 'status': 'ACTIVE' };
        this.provider_services.getServicesList(params)
          .subscribe(data => {
            this.services_list = data;
            console.log(this.services_list);
          });
         this.api_loading1 = false;
      }
      getDepartments() {
        this.loading = false;
        this.provider_services.getDepartments()
          .subscribe(
            data => {
              this.deptObj = data;
              console.log(this.deptObj);
              for (let i = 0; i < this.deptObj.departments.length; i++) {
                if (this.deptObj.departments[i].departmentStatus === 'ACTIVE') {
                  this.departments.push(this.deptObj.departments[i]);
                }
              }
              this.loading = false;
            },
            error => {
              this.loading = false;
              this.shared_functions.apiErrorAutoHide(this, error);
            }
          );
      }
      getProviderQueues() {
        const activeQueues: any = [];
        let queue_list: any = [];
        this.provider_services.getProviderQueues()
            .subscribe(data => {
                queue_list = data;
                console.log(queue_list);
                for (let ii = 0; ii < queue_list.length; ii++) {
                    let schedule_arr = [];
                    // extracting the schedule intervals
                    if (queue_list[ii].queueSchedule) {
                        schedule_arr = this.shared_Functionsobj.queueSheduleLoop(queue_list[ii].queueSchedule);
                    }
                    let display_schedule = [];
                    display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
                    console.log(display_schedule);
                    if (queue_list[ii].queueState === 'ENABLED') {
                        activeQueues.push(display_schedule[0]);
                    }
                }
                this.provider_shared_functions.setActiveQueues(activeQueues);
            });
    }
    // updateForm() {
    //     this.amForm.setValue({
    //         'Name': this.dept_data['Name'] || this.amForm.get('Name').value,
    //         'Description': this.dept_data['Description'] || this.amForm.get('Description').value,
    //         'Value': this.dept_data['Value'] || this.amForm.get('Value').value
    //     });
    // }
    // editDepartment() {
    //     const data = {};
    //     data['action'] = 'edit';
    //     this.actionPerformed.emit(data);
    // }
    resetApiErrors() {
    }
}
