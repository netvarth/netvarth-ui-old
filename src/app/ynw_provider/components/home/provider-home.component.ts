import { interval as observableInterval, Subscription, SubscriptionLike as ISubscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { Router, ActivatedRoute, RoutesRecognized  } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

import { AdjustQueueDelayComponent } from '../adjust-queue-delay/adjust-queue-delay.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { AddProviderWaitlistCheckInBillComponent } from '../add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { ViewProviderWaitlistCheckInBillComponent } from '../view-provider-waitlist-checkin-bill/view-provider-waitlist-checkin-bill.component';
import { ProviderWaitlistCheckInPaymentComponent } from '../provider-waitlist-checkin-payment/provider-waitlist-checkin-payment.component';

import { SharedServices } from '../../../shared/services/shared-services';

import * as moment from 'moment';
import { startWith, map, filter, pairwise } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
  selector: 'app-provider-home',
  templateUrl: './provider-home.component.html',
  styleUrls: ['./provider-home.component.scss']
})

export class ProviderHomeComponent implements OnInit, OnDestroy {

  today_cap = Messages.TODAY_HOME_CAP;
  future_cap = Messages.FUTURE_HOME_CAP;
  history_cap = Messages.HISTORY_HOME_CAP;
  service_window_cap = Messages.SERVICE_TIME_CAP;
  services_cap = Messages.SERVICES_CAP;
  check_in_status = Messages.CHECK_IN_STATUS_CAP;
  payment_status = Messages.PAYMENT_STATUS_CAP;
  start_date = Messages.START_DATE_CAP;
  end_date = Messages.END_DATE_CAP;
  token_no = Messages.TOKEN_NO_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  note_cap = Messages.NOTE_CAP;
  change_status = Messages.CHANGE_STATUS_CAP;
  add_note_cap = Messages.ADD_NOTE_CAP;
  available_cap = Messages.PRO_AVAILABLE_CAP;
  no_service_cap = Messages.NO_SERVICE_CAP;
  adjust_delay = Messages.ADJUST_DELAY_CAP;
  first_name = Messages.FIRST_NAME_CAP;
  last_name = Messages.LAST_NAME_CAP;
  phone_no_cap = Messages.PHONE_NO_CAP;
  all_cap = Messages.ALL_CAP;
  date_cap = Messages.DATE_COL_CAP;
  actions_cap = Messages.ACTIONS_CAP;
  done_cap = Messages.DONE_BTN;
  bill_cap = Messages.BILL_CAPTION;
  accept_cap = Messages.ACCEPT_PAY_CAP;
  not_paid_cap = Messages.NOT_PAID_CAP;
  partially_paid_cap = Messages.PARTIALLY_PAID_CAP;
  paid_cap = Messages.PAID_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  add_private_note = Messages.ADD_PROVIDER_NOTE_CAP;
  cancel_cap = Messages.CANCEL_BTN;
  view_cap = Messages.VIEW_CAP;
  no_cap = Messages.NO_CAP;

  locations: any = [];
  queues: any = [];
  all_queues: any = [];
  services: any = [];
  selected_location = null;
  selected_location_index = null;
  selected_queue = null;
  future_waitlist_count: any = 0;
  today_waitlist_count: any = 0;
  histroy_waitlist_count: any = 0;
  time_type = 1;
  check_in_list: any = [];
  check_in_filtered_list: any = [];
  holdbdata: any = [];
  status_type = 'all';
  queue_date = moment(new Date()).format(projectConstants.POST_DATE_FORMAT);
  edit_location = 0;

  load_locations = 0;
  load_queue = 0;
  load_waitlist = 0;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  open_filter = false;
  waitlist_status = [];
  sel_queue_indx = 0;

  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    queue: 'all',
    service: 'all',
    waitlist_status: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn

  // filter_date_max = moment(new Date()).add(-1, 'days');
  // filter_date_min = moment(new Date()).add(+1, 'days');

  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = null;

  customer_label = '';
  provider_label = '';
  arrived_label = '';
  arrived_upper = '';
  checkedin_label = '';
  checkedin_upper = '';
  done_label = '';
  done_upper = '';
  started_label = '';
  started_upper = '';
  cancelled_label = '';
  cancelled_upper = '';
  checkin_label = '';
  start_label = '';
  no_future_checkins = '';
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };

  cronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  settings;
  delayTooltip = this.shared_functions.getProjectMesssages('ADJUSTDELAY_TOOPTIP');
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  cloudTooltip = this.shared_functions.getProjectMesssages('CLOUDICON_TOOPTIP');
  adjustdialogRef;
  notedialogRef;
  addnotedialogRef;
  billdialogRef;
  viewbilldialogRef;
  makPaydialogRef;
  sendmsgdialogRef;
  screenWidth;
  small_device_display = false;
  show_small_device_queue_display = false;
  returnedFromCheckDetails = false;
  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private common_datastorage: CommonDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    private router: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices) {

    this.onResize();

    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');

    this.arrived_label = this.shared_functions.getTerminologyTerm('arrived');
    this.arrived_upper = this.shared_functions.firstToUpper(this.arrived_label);

    this.checkedin_label = this.shared_functions.getTerminologyTerm('waitlisted');
    this.checkedin_upper = this.shared_functions.firstToUpper(this.checkedin_label);

    this.done_label = this.shared_functions.getTerminologyTerm('done');
    this.done_upper = this.shared_functions.firstToUpper(this.done_label);

    this.started_label = this.shared_functions.getTerminologyTerm('started');
    this.started_upper = this.shared_functions.firstToUpper(this.started_label);

    this.start_label = this.shared_functions.getTerminologyTerm('start');

    this.cancelled_label = this.shared_functions.getTerminologyTerm('cancelled');
    this.cancelled_upper = this.shared_functions.firstToUpper(this.cancelled_label);

    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.no_future_checkins = this.shared_functions.removeTerminologyTerm('waitlist', Messages.FUTURE_NO_CHECKINS);
    this.waitlist_status = [
      { name: this.checkedin_upper, value: 'checkedIn' },
      { name: this.cancelled_upper, value: 'cancelled' },
      { name: this.started_upper, value: 'started' },
      { name: this.arrived_upper, value: 'arrived' },
      { name: this.done_upper, value: 'done' }];

  }
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' }
  ];

  ngOnInit() {
    this.router.events
            .pipe(filter((e: any) => e instanceof RoutesRecognized),
                pairwise()
            ).subscribe((e: any) => {
                this.returnedFromCheckDetails = (e[0].urlAfterRedirects.includes('/provider/checkin-detail/'));
                console.log(e[0].urlAfterRedirects, this.returnedFromCheckDetails); // previous url
            });
    const savedtype = this.shared_functions.getitemfromLocalStorage('pdtyp');
    if (savedtype !== undefined && savedtype !== null) {
      // console.log('exists', savedtype);
      this.time_type = savedtype;
    } else {
      // console.log('NOT');
    }
    const stattype = this.shared_functions.getitemfromLocalStorage('pdStyp');
    if (stattype !== undefined && stattype !== null && stattype !== '') {
      // console.log('exists', savedtype);
      this.status_type = stattype;
    }
    if (stattype === null || stattype === '') {
      this.status_type = 'all';
    }
    this.shared_functions.setBusinessDetailsforHeaderDisp('', '', '', '');

    const bprof = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    // console.log('bdata', bprof);
    if (bprof === null || bprof === undefined) {
      this.shared_services.bussinessDomains()
        .subscribe(
          res => {
            this.holdbdata = res;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.holdbdata
            };
            this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
            this.getBusinessProfile();
            this.getLocationList();
            this.getServiceList();
            this.getProviderSettings();
          }
        );
    } else {
      this.getBusinessProfile();
      this.getLocationList();
      this.getServiceList();
      this.getProviderSettings();
    }

    this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(x => {
      this.reloadAPIs();
    });
  }

  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.adjustdialogRef) {
      this.adjustdialogRef.close();
    }
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
    if (this.addnotedialogRef) {
      this.addnotedialogRef.close();
    }
    if (this.billdialogRef) {
      this.billdialogRef.close();
    }
    if (this.viewbilldialogRef) {
      this.viewbilldialogRef.close();
    }
    if (this.makPaydialogRef) {
      this.makPaydialogRef.close();
    }
    if (this.sendmsgdialogRef) {
      this.sendmsgdialogRef.close();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.show_small_device_queue_display = true;
    } else {
      this.small_device_display = false;
      this.show_small_device_queue_display = false;
    }
    if (this.screenWidth <= projectConstants.SMALL_DEVICE_BOUNDARY) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
    // console.log('resized', this.screenWidth,  this.small_device_display);
  }

  getBusinessProfile() {
    let bProfile: any = [];

    this.getBussinessProfileApi()
      .then(
        data => {
          bProfile = data;
          if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
            // calling function which saves the business related details to show in the header
            // this.shared_functions.retSubSectorNameifRequired();

            const subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
            // console.log('subsector home', subsectorname);
            this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
              || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '');

            const pdata = { 'ttype': 'updateuserdetails' };
            this.shared_functions.sendMessage(pdata);
          }
        },
        error => {

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
          error => {
            reject();
          }
        );

    });
  }
  // get the logo url for the provider
  getProviderLogo(bname = '', bsector = '', bsubsector = '') {
    let blogo;
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          blogo = data;
          // console.log('here logo', this.blogo);
          let logo = '';
          if (blogo[0]) {
            logo = blogo[0].url;
          } else {
            logo = '';
          }
          // calling function which saves the business related details to show in the header
          this.shared_functions.setBusinessDetailsforHeaderDisp(bname || '', bsector || '', bsubsector || '', logo);
          const pdata = { 'ttype': 'updateuserdetails' };
          this.shared_functions.sendMessage(pdata);
        },
        error => {

        }
      );
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        // console.log('prov settings', this.settings);
      }, error => {

      });
  }

  getLocationList() {

    this.load_locations = 0;
    this.selected_location = null;
    this.provider_services.getProviderLocations()
      .subscribe(
        (data: any) => {
          const locations = data;
          this.locations = [];

          for (const loc of locations) {
            if (loc.status === 'ACTIVE') {
              this.locations.push(loc);
            }
          }

          const cookie_location_id = this.shared_functions.getItemOnCookie('provider_selected_location'); // same in provider checkin button page
          if (cookie_location_id === '') {
            if (this.locations[0]) {
              this.changeLocation(this.locations[0]);
            }
          } else {
            this.selectLocationFromCookie(parseInt(cookie_location_id, 10));
            this.getQueueList();
          }

        },
        error => {
          this.load_locations = 1;
        },
        () => {
          this.load_locations = 1;
        }
      );
  }

  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }

    (selected_location !== null) ? this.changeLocation(selected_location) :
      this.changeLocation(this.locations[0]);

  }

  getServiceList() {
    this.provider_services.getServicesList()
      .subscribe(
        data => {
          this.services = data;
        },
        error => {

        }
      );
  }

  getQueueList() {
    // console.log('reached quelist');
    this.provider_services.getProviderLocationQueues(this.selected_location.id)
      .subscribe(
        (data: any) => {
          // this.all_queues = data;

          const Cqueues = data;
          // console.log('cqueue', Cqueues);
          this.all_queues = [];
          let indx = 0;

          for (const que of Cqueues) {
            if (que.queueState === 'ENABLED') {
              que.qindx = indx;
              this.all_queues.push(que);
              indx += 1;
            }
          }
          if (this.all_queues.length === 0) { // this is done to handle the case if no queues exists which are in enabled state
            return;
          }
          const getsavedqueueid = this.shared_functions.getitemfromLocalStorage('pdq');
          let selqid = 0;
          for (let ii = 0; ii < this.all_queues.length; ii++) {
            let schedule_arr = [];
            // extracting the schedule intervals
            if (this.all_queues[ii].queueSchedule) {
              schedule_arr = this.shared_functions.queueSheduleLoop(this.all_queues[ii].queueSchedule);
            }
            let display_schedule = [];
            display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
            this.all_queues[ii]['displayschedule'] = display_schedule[0];
            if (this.all_queues[ii].id === getsavedqueueid) {
              selqid = ii;
            }
          }
          // console.log('all queues', this.all_queues);
          if (this.queues.length === 0) {
            this.queues = this.all_queues;
          }
          this.selected_queue = this.all_queues[selqid];
          if (this.time_type === 1) {
            this.getTodayCheckIn();
          }
          this.getTodayCheckinCount()
            .then(
              (result) => {
                this.today_waitlist_count = result;
              }
            );
        },
        error => {
        },
        () => {
        }
      );
  }

  getQueueListByDate() {
    // console.log('qby date');
    this.load_queue = 0;
    if (!this.selected_queue) {

      if (this.selected_location.id) {
        this.provider_services.getProviderLocationQueuesByDate(
          this.selected_location.id, this.queue_date)
          .subscribe(
            (data: any) => {
              // this.queues = data;
              const Cqueues = data;
              this.queues = [];
              const savedQ = this.shared_functions.getitemfromLocalStorage('pdq') || '';
              const savedQok = [];
              let indx = 0;
              for (const que of Cqueues) {
                if (que.queueState === 'ENABLED') {
                  // console.log('que', que);
                  if (que.id === savedQ) {
                    savedQok.push(que);
                  }
                  que.qindx = indx;
                  this.queues.push(que);
                  indx += 1;
                }
              }
              // console.log('queues', this.queues);
              if (savedQok.length > 0) {
                this.selectedQueue(savedQok[0]);
              } else {
                if (this.queues[0] && this.selected_queue == null) {
                  const selectedQindx = this.findCurrentActiveQueue(this.queues);
                  // console.log('first Q', this.queues[selectedQindx], 'selected Q index', selectedQindx);

                  this.selectedQueue(this.queues[selectedQindx]);
                }
              }
            },
            error => {
              this.queues = [];
              this.load_queue = 1;
            },
            () => {
              this.load_queue = 1;
            }
          );
      }
    } else {
      this.selectedQueue(this.selected_queue);
    }
  }
  findCurrentActiveQueue(ques) {
    let selindx = 0;
    const cday = new Date();
    const currentday = (cday.getDay() + 1);
    const curtime = cday.getHours() + ':' + cday.getMinutes() + ':00';
    // const curtime = '21:00:00';
    let stime;
    let etime;
    const tday = cday.getFullYear() + '-' + (cday.getMonth() + 1) + '-' + cday.getDate();
    const curtimeforchk = new Date(tday + ' ' + curtime);
    // console.log('curtimestr', curtime, curtimeforchk);
    for (let i = 0; i < ques.length; i++) {
      for (let j = 0; j < ques[i].queueSchedule.repeatIntervals.length; j++) {
        const pday = Number(ques[i].queueSchedule.repeatIntervals[j]);
        if (currentday === pday) {
          stime = new Date(tday + ' ' + this.AMHourto24(ques[i].queueSchedule.timeSlots[0].sTime));
          etime = new Date(tday + ' ' + this.AMHourto24(ques[i].queueSchedule.timeSlots[0].eTime));
          if ((curtimeforchk.getTime() >= stime.getTime()) && (curtimeforchk.getTime() <= etime.getTime())) {
            // console.log('time24', ques[i].name, stime, etime);
            // console.log('days', ques[i].queueSchedule.repeatIntervals[j]);
            selindx = i;
          }
        }
      }
    }
    return selindx;
  }
  AMHourto24(time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (minutes < 10) {
      sMinutes = '0' + sMinutes;
    }
    // alert(sHours + ':::' + sMinutes);
    const time24 = sHours + ':' + sMinutes + ':00';
    /*const mom_date = moment(date);
    mom_date.set('hour', sHours);
    mom_date.set('minute', sMinutes);*/
    return time24;
  }

  changeLocation(location) {

    this.selected_location = location;
    this.selected_queue = null;
    this.loadApiSwitch('changeLocation');
    this.shared_functions.setItemOnCookie('provider_selected_location', this.selected_location.id);
    this.today_waitlist_count = 0;
    this.future_waitlist_count = 0;
    this.check_in_list = this.check_in_filtered_list = [];
    this.getQueueList();
    /*this.getTodayCheckinCount()
    .then(
      (result) => {
        this.today_waitlist_count = result;
      }
    );*/
    this.getFutureCheckinCount()
      .then(
        (result) => {
          this.future_waitlist_count = result;
        }
      );

    // this.getTodayCheckinCount()
    // .then(
    //   result => {
    //     this.today_waitlist_count = result;
    //   }
    // );
    // this.getHistoryCheckinCount();
  }

  selectedQueue(selected_queue, qclick?) {
    // console.log('selected q', selected_queue.id);
    if (selected_queue.id) {
      this.sel_queue_indx = selected_queue.qindx;
      this.shared_functions.setitemonLocalStorage('pdq', selected_queue.id);
    }
    this.selected_queue = selected_queue;
    this.getTodayCheckIn();
    this.today_waitlist_count = 0;
    this.getTodayCheckinCount()
      .then(
        result => {
          this.today_waitlist_count = result;
        }
      );
  }
  handleQueueSel(mod) {
    // console.log('mod', mod, this.sel_queue_indx);
    let selqindx;
    if (mod === 'next') {
      if ((this.queues.length - 1) > this.sel_queue_indx) {
        selqindx = this.sel_queue_indx + 1;
        this.selectedQueue(this.queues[selqindx]);
      }
    } else if (mod === 'prev') {
      if ((this.queues.length > 0) && (this.sel_queue_indx > 0)) {
        selqindx = this.sel_queue_indx - 1;
        this.selectedQueue(this.queues[selqindx]);
      }
    }
  }

    getFutureCheckinCount(Mfilter = null) {

    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {
        'location-eq' : this.selected_location.id,
      };
      no_filter = true;
    }

    return new Promise((resolve, reject) => {
      this.provider_services.getWaitlistFutureCount(Mfilter)
      .subscribe(
        data => {
          resolve(data);
          if (no_filter) { this.future_waitlist_count = data; }
        },
        error => {

        });
    });


  }

   getHistoryCheckinCount(Mfilter = null) {

    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {
        'location-eq' : this.selected_location.id
      };
      no_filter = true;
    }
    // console.log(filter);
    return new Promise((resolve, reject) => {

    this.provider_services.getwaitlistHistoryCount(Mfilter)
    .subscribe(
      data => {
        resolve(data);
        if (no_filter) { this.histroy_waitlist_count = data; }
      },
      error => {

      });

    });
  }

   getTodayCheckinCount(Mfilter = null) {

    let no_filter = false;

    if (!Mfilter) {
      Mfilter = {
        'location-eq' : this.selected_location.id,
        'queue-eq' : this.selected_queue.id
      };

      no_filter = true;
    }

    return new Promise((resolve, reject) => {

      this.provider_services.getwaitlistTodayCount(Mfilter)
      .subscribe(
        data => {
          if (no_filter) { this.today_waitlist_count = data; }
          resolve(data);
        },
        error => {

        });

    });
  }

  getTodayCheckIn() {
    this.load_waitlist = 0;
    const Mfilter = this.setFilterForApi();
    this.resetPaginationData();

    this.pagination.startpageval = 1;
    this.pagination.totalCnt = 0; // no need of pagination in today

    this.provider_services.getTodayWaitlist(Mfilter)
      .subscribe(
        data => {
          this.check_in_list = data;
          if (this.status_type) {
            this.changeStatusType(this.status_type);
          } else {
            this.changeStatusType('all');
          }
        },
        error => {
          this.load_waitlist = 1;
        },
        () => {
          this.load_waitlist = 1;
        });
  }

  getFutureCheckIn() {
    this.load_waitlist = 0;
    let Mfilter = this.setFilterForApi();


    const promise = this.getFutureCheckinCount(Mfilter);

    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);

        this.provider_services.getFutureWaitlist(Mfilter)
          .subscribe(
            data => {
              this.check_in_list = this.check_in_filtered_list = data;
              // this.future_waitlist_count = this.check_in_list.length || 0;
            },
            error => {
              this.load_waitlist = 1;
            },
            () => {
              this.load_waitlist = 1;
            });

      });

  }

  getHistoryCheckIn() {
    this.load_waitlist = 0;
    let Mfilter = this.setFilterForApi();

    const promise = this.getHistoryCheckinCount(Mfilter);

    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);

        this.provider_services.getHistroryWaitlist(Mfilter)
          .subscribe(
            data => {
              this.check_in_list = this.check_in_filtered_list = data;
            },
            error => {
              this.load_waitlist = 1;
            },
            () => {
              this.load_waitlist = 1;
            });

      }
    );



  }

  setTimeType(time_type) {
    this.check_in_list = this.check_in_filtered_list = [];
    this.time_type = time_type;
    this.shared_functions.setitemonLocalStorage('pdtyp', this.time_type);
        if (time_type !== 0) {
      this.shared_functions.removeitemfromLocalStorage('hP');
      this.shared_functions.removeitemfromLocalStorage('hPFil');
    }
    const stype = this.shared_functions.getitemfromLocalStorage('pdStyp');
    if (stype) {
      this.status_type = stype;
    } else {
      this.status_type = 'cancelled';
    }
    this.setFilterDateMaxMin();
    // this.queues = [];
    // console.log('ttype', this.time_type, this.queues.length);
    if (this.time_type === 1 && this.queues.length === 0) {
      this.getQueueListByDate();
    }
    this.loadApiSwitch('setTimeType');
  }

  setFilterDateMaxMin() {

    this.filter_date_start_min = null;
    this.filter_date_start_max = null;
    this.filter_date_end_min = null;
    this.filter_date_end_max = null;

    if (this.time_type === 0) {
      this.filter_date_start_max = moment(new Date()).add(-1, 'days');
      this.filter_date_end_max = moment(new Date()).add(-1, 'days');
    } else if (this.time_type === 2) {
      this.filter_date_start_min = moment(new Date()).add(+1, 'days');
      this.filter_date_end_min = moment(new Date()).add(+1, 'days');
    }

  }

  checkFilterDateMaxMin(type) {
    if (type === 'check_in_start_date') {
      this.filter_date_end_min = this.filter.check_in_start_date;
      if (this.filter.check_in_end_date < this.filter.check_in_start_date) {
        this.filter.check_in_end_date = this.filter.check_in_start_date;
      }
    } else if (type === 'check_in_end_date') {
      this.filter_date_start_max = this.filter.check_in_end_date;

      if (this.filter.check_in_end_date < this.filter.check_in_start_date) {
        this.filter.check_in_start_date = this.filter.check_in_end_date;
      }

    }
    this.doSearch();

  }

    loadApiSwitch(source) {
    console.log('apiswitch', source, this.returnedFromCheckDetails, this.time_type);
    let chkSrc = true;
    // if (source === 'changeLocation' && this.returnedFromCheckDetails && this.time_type === 0) {
    if (source === 'changeLocation' && this.time_type === 0) {
     const hisPage =  this.shared_functions.getitemfromLocalStorage('hP');
     const hFilter =  this.shared_functions.getitemfromLocalStorage('hPFil');
     console.log('reached inside switch', hisPage, hFilter);
     if (hisPage !== null) {
      this.filter = hFilter;
      this.pagination.startpageval = hisPage;
      this.shared_functions.removeitemfromLocalStorage('hP');
      this.shared_functions.removeitemfromLocalStorage('hPFil');
      chkSrc = false;
     }
    }

    if (chkSrc) {
      if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
        this.resetFilter();
      }
    }

    switch (this.time_type) {

      case 0: this.getHistoryCheckIn(); break;
      case 1: this.getQueueListByDate(); break;
      case 2: this.getFutureCheckIn(); break;
    }
  }

  showAdjustDelay() {

    if (this.queues.length === 0 || !this.selected_queue.id) {
      return false;
    }

    this.adjustdialogRef = this.dialog.open(AdjustQueueDelayComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        queues: this.queues,
        queue_id: this.selected_queue.id
      }
    });

    this.adjustdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }


  editLocation() {
    this.locations.forEach((loc, index) => {
      if (this.selected_location.id === loc.id) {
        this.selected_location_index = index;
      }
    });
    this.edit_location = 1;

  }

  cancellocationChange() {
    this.edit_location = 0;
  }

  onChangeLocationSelect(event) {
    const value = event.value;
    this.changeLocation(this.locations[value] || []);
  }

  reloadAPIs() {
    this.countApiCall();
    this.loadApiSwitch('reloadAPIs');
  }

  countApiCall() {

    this.getHistoryCheckinCount();
    this.getFutureCheckinCount();
    this.getTodayCheckinCount();
  }
  changeStatusType(type) {


    this.status_type = type;
    this.shared_functions.setitemonLocalStorage('pdStyp', this.status_type);
    let status: any = this.status_type;

    switch (type) {
      case 'all': status = ['checkedIn', 'arrived', 'prepaymentPending'];
    }

    this.check_in_filtered_list = this.check_in_list.filter(
      check_in => {
        if (typeof (status) === 'string' &&
          check_in.waitlistStatus === status) {
          return check_in;
        } else if (typeof (status) === 'object') {

          const index = status.indexOf(check_in.waitlistStatus);
          if (index !== -1) {
            return check_in;
          }

        }

      });
  }

  changeWaitlistStatus(waitlist, action) {
    this.provider_shared_functions.changeWaitlistStatus(this, waitlist, action);
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.loadApiSwitch(result);
        }
      );
  }

  showConsumerNote(checkin) {
    this.notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin
      }
    });

    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  toggleFilter() {
    this.open_filter = !this.open_filter;
  }

  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }

  setFilterForApi() {
    const api_filter = {};

    if (this.time_type === 1) {
      api_filter['queue-eq'] = this.selected_queue.id;
    } else if (this.filter.queue !== 'all') {
      api_filter['queue-eq'] = this.filter.queue;
    }

    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }

    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }

    if (this.filter.phone_number !== '') {
      api_filter['primaryMobileNo-eq'] = this.filter.phone_number;
    }

    if (this.filter.service !== 'all') {
      api_filter['service-eq'] = this.filter.service;
    }

    if (this.time_type !== 1) {
      if (this.filter.waitlist_status !== 'all') {
        api_filter['waitlistStatus-eq'] = this.filter.waitlist_status;
      }

      // if (this.filter.check_in_date != null) {
      //   api_filter['date-eq'] = this.filter.check_in_date.format('YYYY-MM-DD');
      // }

      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.filter.check_in_start_date.format('YYYY-MM-DD');
      }

      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.filter.check_in_end_date.format('YYYY-MM-DD');
      }

    }
    if (this.time_type === 0) {
      if (this.filter.payment_status !== 'all') {
        api_filter['billPaymentStatus-eq'] = this.filter.payment_status;
      }
    }

    api_filter['location-eq'] = this.selected_location.id;

    return api_filter;
  }

  setPaginationFilter(api_filter) {

    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;

    return api_filter;
  }

  doSearch() {
    this.loadApiSwitch('doSearch');
  }

  resetFilter() {
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      queue: 'all',
      service: 'all',
      waitlist_status: 'all',
      payment_status: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      location_id: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 0
    };
  }

  goCheckinDetail(checkin) {
   if (this.time_type === 0) {
      this.shared_functions.setitemonLocalStorage('hP', this.filter.page || 1);
      this.shared_functions.setitemonLocalStorage('hPFil', this.filter);
    }
    this.router.navigate(['provider', 'checkin-detail', checkin.ynwUuid]);
  }

  addProviderNote(checkin) {
    this.addnotedialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: checkin.ynwUuid
      }
    });

    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  viewBillPage(checkin) {
    this.router.navigate(['provider', 'bill', checkin.ynwUuid]);
  }

  // getWaitlistBillgetWaitlistBill(checkin, type = 'bill') {
  //   this.provider_services.getWaitlistBill(checkin.ynwUuid)
  //     .subscribe(
  //       data => {
  //         if (type === 'bill') {
  //           this.viewBill(checkin, data);
  //         } else {
  //           this.makePayment(checkin, data);
  //         }
  //       },
  //       error => {
  //         // console.log(error);
  //         if (error.status === 422 && (this.time_type === 1 || this.time_type === 0)) {
  //           // this.addEditBill(checkin , null);
  //         } else {
  //           this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //         }
  //       },
  //       () => {
  //       }
  //     );
  // }

  // addEditBill(checkin) {
  //   // console.log('add bill', bill_data);
  //   // this.billdialogRef = this.dialog.open(AddProviderWaitlistCheckInBillComponent, {
  //   //   width: '50%',
  //   //   panelClass: ['commonpopupmainclass', 'billpopup'],
  //   //   disableClose: true,
  //   //   data: {
  //   //     checkin: checkin,
  //   //     bill_data: bill_data
  //   //   }
  //   // });

  //   // this.billdialogRef.afterClosed().subscribe(result => {
  //   //   if (result === 'reloadlist') {
  //   //     this.reloadAPIs();
  //   //   }
  //   // });
  // }

  // viewBill(checkin, bill_data) {
  //   // console.log('billdata', bill_data);
  //   // this.viewbilldialogRef = this.dialog.open(ViewProviderWaitlistCheckInBillComponent, {
  //   //   width: '50%',
  //   //   panelClass: ['commonpopupmainclass', 'billpopup'],
  //   //   disableClose: true,
  //   //   data: {
  //   //     checkin: checkin,
  //   //     bill_data: bill_data
  //   //   }
  //   // });
  //   if (!this.viewbilldialogRef) {
  //     this.viewbilldialogRef = this.dialog.open(AddProviderWaitlistCheckInBillComponent, {
  //       width: '50%',
  //       panelClass: ['commonpopupmainclass', 'billpopup'],
  //       disableClose: true,
  //       data: {
  //         checkin: checkin,
  //         bill_data: bill_data
  //       }
  //     });
  //   } else {
  //     console.log('more clicks');
  //   }
  //   this.viewbilldialogRef.afterClosed().subscribe(result => {
  //     // console.log(result);
  //     if (this.viewbilldialogRef) {
  //       this.viewbilldialogRef = null;
  //     }
  //     //   if (result === 'updateBill') {
  //     // this.addEditBill(checkin, bill_data);
  //     // } else
  //     if (result === 'reloadlist') {
  //       this.reloadAPIs();
  //     } else if (result === 'makePayment') {
  //       this.makePayment(checkin, bill_data);
  //     }
  //   });
  // }

  // makePayment(checkin, bill_data) {
  //   if (!this.makPaydialogRef) {
  //     this.makPaydialogRef = this.dialog.open(ProviderWaitlistCheckInPaymentComponent, {
  //       width: '50%',
  //       panelClass: ['commonpopupmainclass'],
  //       disableClose: true,
  //       data: {
  //         checkin: checkin,
  //         bill_data: bill_data
  //       }
  //     });
  //   } else {
  //     console.log('more clicks');
  //   }
  //   this.makPaydialogRef.afterClosed().subscribe(result => {
  //     if (this.makPaydialogRef) {
  //       this.makPaydialogRef = null;
  //     }
  //     this.reloadAPIs();
  //   });
  // }

  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
     this.shared_functions.removeitemfromLocalStorage('hP');
    this.shared_functions.removeitemfromLocalStorage('hPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
       this.shared_functions.setitemonLocalStorage('hP', pg);
    this.shared_functions.setitemonLocalStorage('hPFil', this.filter);
    // console.log('page', pg);
    this.doSearch();
  }
  addConsumerInboxMessage(waitlist) {
    const uuid = waitlist.ynwUuid || null;
    this.provider_shared_functions.addConsumerInboxMessage(waitlist, this)
      .then(
        result => {
        },
        error => {
        }
      );
  }
  reloadActionSubheader(data) {
    this.reloadAPIs();
  }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }

  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
    }
  }
  focusInputSp(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      this.doSearch();
    }
  }

  learnmore_clicked(mod) {
    const moreOptions = { 'show_learnmore': true, 'scrollKey': 'adjustdelay' };
    const pdata = { 'ttype': 'learn_more', 'target': moreOptions };
    this.shared_functions.sendMessage(pdata);
  }
}
