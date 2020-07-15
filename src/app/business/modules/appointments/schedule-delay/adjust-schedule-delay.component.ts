import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-adjust-schedule-delay',
  templateUrl: './adjust-schedule-delay.component.html'
})
export class AdjustscheduleDelayComponent implements OnInit {
  adjust_delay_cap = Messages.ADJUST_DELAY_CAP;
  service_window_cap = Messages.SERV_TIME_WINDOW_CAP;
  select_service_cap = Messages.SELECT_SER_CAP;
  select_deptment_cap = Messages.SELECT_DEPT_CAP;
  send_message_cap = '';
  messgae_cap = Messages.MESSAGE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  delay_cap = Messages.DELAY_CAP;
  amForm: FormGroup;
  queues: any = [];
  api_success = null;
  api_error = null;
  time = { hour: 0, minute: 0 };
  default_message = '';
  selected_queue = 0;
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  queue_name = '';
  queue_schedule = '';
  placeholder = Messages.ADJUSTDELAY_PLACEHOLDER;
  arrived_cnt = 0;
  checkedin_cnt = 0;
  tot_checkin_count = 0;
  customer_label = '';
  frm_adjust_del_cap = '';
  disableButton = false;
  instantQueue;
  breadcrumbs;
  breadcrumb_moreoptions: any = [];
  account_id;
  departmentlist: any = [];
  departments: any = [];
  filterDepart = false;
  selected_dept;
  deptLength;
  services: any = [];
  servicesjson: any = [];
  serviceslist: any = [];
  sel_loc;
  queuejson: any = [];
  sel_ser;
  sel_ser_det: any = [];
  // sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
  sel_checkindate;
  sortBy = 'sort_token';
  check_in_list: any = [];
  today_checkins_count = 0;
  today_arrived_count = 0;
  today_checkedin_count = 0;
  users = [];
  userN = { 'id': 0, 'firstName': 'None', 'lastName': '' };
  selected_user;
  domain: any;
  qdata_list;

  constructor(
    // public dialogRef: MatDialogRef<AdjustQueueDelayComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private route: Router,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private shared_functions: SharedFunctions
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }
  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.breadcrumbs = [
      {
        title: 'Appointments',
        url: 'provider/appointments'
      },
      {
        title: 'Adjust delay'
      }
    ];
    this.send_message_cap = Messages.DELAY_SEND_MSG1.replace('[customer]', this.customer_label);
    // this.arrived_cnt = this.data.arrived_count;
    // this.checkedin_cnt = this.data.checkedin_count;
    // this.tot_checkin_count = this.checkedin_cnt + this.arrived_cnt;
    // this.queues = this.data.queues;
    // this.queue_name = this.data.queue_name;
    // this.instantQueue = this.data.instant_queue;
    // this.queue_schedule = this.data.queue_schedule;
    // if (!this.data.queues || !this.data.queue_id) {
    //   this.closePopup('error');
    // }
    const loc = this.sharedfunctionObj.getitemFromGroupStorage('loc_id');
    this.sel_loc = loc.id;
    this.getBussinessProfileApi()
      .then(
        (data: any) => {
          this.account_id = data.id;

          this.shared_services.getServicesByLocationId(this.sel_loc).subscribe(
            (services: any) => {
              this.servicesjson = services;
              this.serviceslist = services;
              // this.sel_ser_det = [];
              if (this.servicesjson.length > 0) {
                //     this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                //     this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                //     this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
                this.initDepartments(this.account_id).then(
                  () => {
                    this.handleDeptSelction(this.selected_dept);
                  },
                  () => {
                    this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                  }
                );
              }


            });
        }

      );
    setTimeout(() => {
      this.getScheduleDelay(this.queuejson[0].id);
    }, 1000);




    this.getDefaultMessages();
    this.amForm = this.fb.group({
      queueControl: [''],
      delay: ['', Validators.compose([Validators.required])],
      send_message: [false],
      // message: ['', Validators.compose([Validators.required])],
      message: [''],
    });
    /*this.amForm.get('queue_id').valueChanges
    .subscribe(
      data => {
        this.getScheduleDelay(data);
      }
    );*/
    // this.getScheduleDelay(this.queuejson[0].id);
    this.amForm.get('send_message').valueChanges
      .subscribe(
        data => {
          this.changeCheckbox(data);
        }
      );
    // this.amForm.get('queue_id').setValue(this.data.queue_id);
    //  this.selected_queue = this.data.queue_id;
    this.frm_adjust_del_cap = Messages.FRM_LEVEL_ADJ_DELAY_MSG.replace('[customer]', this.customer_label);

  }
  performActions(actions) {
    if (actions === 'learnmore') {
      this.route.navigate(['/provider/' + this.domain + '/appointments->schadjustdelay']);
    }
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
  getDefaultMessages() {
    this.provider_services.getProviderMessages()
      .subscribe(
        () => {
          // this.default_message = data.delay || '';
        },
        () => {
        }
      );
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getBussinessProfile()
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
  initDepartments(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getProviderDept(accountId).subscribe(data => {
        _this.departmentlist = data;
        _this.filterDepart = _this.departmentlist.filterByDept;
        for (let i = 0; i < _this.departmentlist['departments'].length; i++) {
          if (_this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
            if (_this.departmentlist['departments'][i].serviceIds.length !== 0) {
              _this.departments.push(_this.departmentlist['departments'][i]);
            }
          }
        }
        _this.deptLength = _this.departments.length;
        // this.selected_dept = 'None';
        if (_this.deptLength !== 0) {
          _this.selected_dept = _this.departments[0].departmentId;
          resolve();
        } else {
          reject();
        }
      },
        () => {
          reject();
        });
    });
  }
  handleDeptSelction(obj) {
    this.users = [];
    this.queuejson = [];
    this.api_error = '';
    this.selected_dept = obj;
    this.servicesjson = this.serviceslist;
    if (this.filterDepart) {
      const filter = {
        'departmentId-eq': obj
      };
      this.provider_services.getUsers(filter).subscribe(
        (users: any) => {
          this.users = [];
          let found = false;
          for (let userIndex = 0; userIndex < users.length; userIndex++) {
            for (let serviceIndex = 0; serviceIndex < this.servicesjson.length; serviceIndex++) {
              // for (let userIndex = 0; userIndex < users.length; userIndex++) {
              if (this.servicesjson[serviceIndex].provider && this.servicesjson[serviceIndex].provider.id === users[userIndex].id) {
                this.users.push(users[userIndex]);
                break;
              }
              if (this.servicesjson[serviceIndex].department === this.selected_dept && !this.servicesjson[serviceIndex].provider) {
                found = true;
              }
            }
          }
          if (found) {
            // addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
            this.users.push(this.userN);
          }
          if (this.users.length !== 0) {
            this.selected_user = this.users[0];
            this.handleUserSelection(this.selected_user);
          } else {
            for (let i = 0; i < this.departmentlist['departments'].length; i++) {
              if (obj === this.departmentlist['departments'][i].departmentId) {
                this.services = this.departmentlist['departments'][i].serviceIds;
              }
            }
            const newserviceArray = [];
            if (this.services) {
              for (let i = 0; i < this.serviceslist.length; i++) {
                for (let j = 0; j < this.services.length; j++) {
                  if (this.services[j] === this.serviceslist[i].id) {
                    newserviceArray.push(this.serviceslist[i]);
                  }
                }
              }
              this.servicesjson = newserviceArray;
            }
            if (this.servicesjson.length > 0) {
              this.sel_ser = this.servicesjson[0].id;
              this.setServiceDetails(this.sel_ser);
              this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
            } else {
              this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
            }
          }
        });
      // }
    }

  }
  handleUserSelection(user) {
    this.queuejson = [];
    this.servicesjson = this.serviceslist;
    const newserviceArray = [];
    if (user.id && user.id !== 0) {
      for (let i = 0; i < this.servicesjson.length; i++) {
        if (this.servicesjson[i].provider && user.id === this.servicesjson[i].provider.id) {
          newserviceArray.push(this.serviceslist[i]);
        }
      }
    } else {
      for (let i = 0; i < this.servicesjson.length; i++) {
        if (!this.servicesjson[i].provider && this.servicesjson[i].department === this.selected_dept) {
          newserviceArray.push(this.serviceslist[i]);
        }
      }
    }
    this.servicesjson = newserviceArray;
    if (this.servicesjson.length > 0) {
      this.sel_ser = this.servicesjson[0].id;
      this.setServiceDetails(this.sel_ser);
      this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    } else {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
    }
  }
  getServicebyLocationId(locid, pdate) {
    //  this.api_loading1 = true;
    this.resetApi();
    this.shared_services.getServicesforAppontmntByLocationId(locid)
      .subscribe(data => {
        this.servicesjson = data;
        this.serviceslist = data;
        this.sel_ser_det = [];
        if (this.servicesjson.length > 0) {
          this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
          this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
          this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
        }
        // this.api_loading1 = false;
      },
        () => {
          // this.api_loading1 = false;
          this.sel_ser = '';
        });
  }

  onSubmit(form_data) {
    this.resetApi();

    // if(form_data.send_message){
    //   if (!form_data.message.replace(/\s/g, '').length) {
    //     this.api_error = 'Message cannot be empty';
    //     return;
    //   }
    // }
    this.disableButton = true;
    const time = this.getTimeinMin();
    let queueId;
    // if (time !== 0) {
    const post_data = {
      'delayDuration': time,
      'sendMsg': form_data.send_message,
      'message': form_data.message || '',
    };
    // this.provider_services.addQueueDelay(form_data.queue_id, post_data)
    if (this.queuejson.length === 1) {
      for (let i = 0; i < this.queuejson.length; i++) {
        queueId = this.queuejson[i].id;
      }
    } else {
      queueId = form_data.queueControl;
    }
    this.provider_services.addScheduleDelay(queueId, post_data)
      .subscribe(
        () => {
          if ((this.arrived_cnt !== 0 || this.checkedin_cnt !== 0) && form_data.send_message) {
            // this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY');
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ADD_DELAY'), { 'panelclass': 'snackbarerror' });
            // this.closePopup('reloadlist');
          } else {
            // this.api_success = this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_NO_MSG');
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_NO_MSG'), { 'panelclass': 'snackbarerror' });
            // this.closePopup('reloadlist');
          }
          setTimeout(() => {
            this.disableButton = false;
          }, projectConstants.TIMEOUT_DELAY_LARGE);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.sharedfunctionObj.apiErrorAutoHide(this, error);
          this.disableButton = false;
        }
      );
    // } else {
    //   this.sharedfunctionObj.apiErrorAutoHide(this, this.sharedfunctionObj.getProjectMesssages('ADD_DELAY_TIME_ERROR'));
    // }
  }
  getScheduleDelay(queue_id) {
    this.provider_services.getScheduleDelay(queue_id)
      .subscribe(
        data => {
          this.convertTime(data['delayDuration'] || 0);
          this.amForm.get('send_message').setValue(data['sendMsg']);
        },
        () => {
        }
      );
  }
  setServiceDetails(curservid) {
    let serv;
    for (let i = 0; i < this.servicesjson.length; i++) {
      if (this.servicesjson[i].id === curservid) {
        serv = this.servicesjson[i];
      }
    }
    this.sel_ser_det = [];
    this.sel_ser_det = {
      name: serv.name,
      duration: serv.serviceDuration,
      description: serv.description,
      price: serv.totalAmount,
      isPrePayment: serv.isPrePayment,
      minPrePaymentAmount: serv.minPrePaymentAmount,
      status: serv.status,
      taxable: serv.taxable
    };
  }
  getTimeinMin() {
    const time_min = (this.time.hour * 60) + this.time.minute;
    return (typeof (time_min) === 'number') ? time_min : 0;
  }
  convertTime(time) {
    this.time.hour = Math.floor(time / 60);
    this.time.minute = time % 60;
    this.amForm.get('delay').setValue(this.time);
  }
  //   closePopup(message) {
  //     setTimeout(() => {
  //     //  this.dialogRef.close(message);
  //     }, projectConstants.TIMEOUT_DELAY);
  //   }
  changeCheckbox(data) {
    if (data) {
      this.amForm.addControl('message',
        new FormControl(this.default_message));
    } else {
      this.amForm.removeControl('message');
    }
  }
  handle_queue_sel(queueid) {
    this.getTodayAppointments(queueid);
    this.getScheduleDelay(queueid);
    // this.selected_queue = queueid;
    // this.getScheduleDelay(this.selected_queue);
  }
  isInRange(evt) {
    return this.sharedfunctionObj.isInRange(evt);
  }

  getTodayAppointments(queueid) {
    const Mfilter = this.setFilterForApi(queueid);
    // Mfilter[this.sortBy] = 'asc';
    this.provider_services.getTodayApptlist(Mfilter)
      .subscribe(
        data => {
          this.check_in_list = data;
          this.setCounts(this.check_in_list);
        });
  }

  setFilterForApi(queueid) {
    const api_filter = {};
    api_filter['schedule-eq'] = queueid;
    return api_filter;
  }
  getCount(list, status) {
    return list.filter(function (elem) {
      return elem.apptStatus === status;
    }).length;
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'Arrived');
    this.today_checkedin_count = this.getCount(list, 'Confirmed');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count;

  }
  getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
    this.queuejson = [];
    if (locid && servid) {
      this.shared_services.getSchdulesbyLocatinIdandServiceIdwithoutDate(locid, servid, accountid)
        .subscribe(data => {
          this.queuejson = data;
          if (this.queuejson.length === 1) {
            this.getTodayAppointments(this.queuejson[0].id);
          }
          // this.queueQryExecuted = true;
          if (this.queuejson.length > 1) {
            this.amForm.get('queueControl').setValue(this.queuejson[0].id);
            this.getTodayAppointments(this.queuejson[0].id);
          }

        });
    }
  }
  handleServiceSel(obj) {
    // this.sel_ser = obj.id;
    this.sel_ser = obj;
    this.setServiceDetails(obj);
    this.queuejson = [];
    // this.sel_queue_id = 0;
    // this.sel_queue_waitingmins = 0;
    // this.sel_queue_servicetime = '';
    // this.sel_queue_personaahead = 0;
    // this.sel_queue_name = '';
    this.resetApi();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleQueueSelection(queue, index) {
    // this.sel_queue_indx = index;
    // this.sel_queue_id = queue.id;
    // this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(queue.queueWaitingTime);
    // this.sel_queue_servicetime = queue.serviceTime || '';
    // this.sel_queue_name = queue.name;
    // this.sel_queue_timecaption = queue.queueSchedule.timeSlots[0]['sTime'] + ' - ' + queue.queueSchedule.timeSlots[0]['eTime'];
    // this.sel_queue_personaahead = queue.queueSize;
    // // this.queueReloaded = true;
    // if (this.calc_mode === 'Fixed' && queue.timeInterval && queue.timeInterval !== 0) {
    //     this.getAvailableTimeSlots(queue.queueSchedule.timeSlots[0]['sTime'], queue.queueSchedule.timeSlots[0]['eTime'], queue.timeInterval);
    // }
  }
  onCancel() {
    this.route.navigate(['provider', 'appointments']);

  }
  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
}
