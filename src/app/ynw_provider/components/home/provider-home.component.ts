import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators/filter';
import { pairwise } from 'rxjs/operators/pairwise';
import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { Router, RoutesRecognized } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { AdjustQueueDelayComponent } from '../adjust-queue-delay/adjust-queue-delay.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { SharedServices } from '../../../shared/services/shared-services';
import * as moment from 'moment';
import { projectConstants } from '../../../shared/constants/project-constants';
@Component({
  selector: 'app-provider-home',
  templateUrl: './provider-home.component.html',
  styleUrls: ['./provider-home.component.scss']
})
export class ProviderHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // pdtyp  --- 0-History, 1-Future, 2-Today
  // pdStyp --- 'all' -- Checkins, 'started' - Started, 'done' - Complete, 'cancelled' - Cancelled
  // pdq --- selected queue id
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
  name_cap = Messages.AUDIT_NAME_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  note_cap = Messages.NOTE_CAP;
  change_status = Messages.CHANGE_STATUS_CAP;
  add_note_cap = Messages.ADD_NOTE_CAP;
  available_cap = Messages.PRO_AVAILABLE_CAP;
  no_service_cap = Messages.NO_QUEUE_MSG;
  adjust_delay = Messages.ADJUST_DELAY_CAP;
  first_name = Messages.FIRST_NAME_CAP;
  last_name = Messages.LAST_NAME_CAP;
  phone_no_cap = Messages.PHONE_NO_CAP;
  all_cap = Messages.ALL_CAP;
  date_cap = Messages.DATE_COL_CAP;
  actions_cap = Messages.ACTIONS_CAP;
  complete_cap = Messages.STATUS_DONE;
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
  check_in_statuses = projectConstants.CHECK_IN_STATUSES;
  wait_time_caption = Messages.WAIT_TIME;
  no_result_found = Messages.NO_RESULT_FOUND;
  no_history = '';
  no_today_checkin_msg = '';
  no_started_checkin_msg = '';
  no_completed_checkin_msg = '';
  no_cancelled_checkin_msg = '';
  check_in_statuses_filter = projectConstants.CHECK_IN_STATUSES_FILTER;
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
  queue_date = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
  edit_location = 0;
  load_locations = 0;
  load_queue = 0;
  load_waitlist = 0;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  filterapplied = false;
  open_filter = false;
  waitlist_status = [];
  sel_queue_indx = 0;
  today_checkins_count = 0;
  today_arrived_count = 0;
  today_started_count = 0;
  today_completed_count = 0;
  today_cancelled_count = 0;
  today_checkedin_count = 0;
  pos = false;
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
  showTime = false;
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
  isCheckin;
  small_device_display = false;
  show_small_device_queue_display = false;
  returnedFromCheckDetails = false;
  breadcrumb_moreoptions: any = [];
  apis_loaded = false;
  breadcrumbs_init = [
    {
      title: Messages.DASHBOARD_TITLE,
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    }
  ];
  noFilter = true;
  arr: any = [];
  breadcrumbs = this.breadcrumbs_init;
  server_date;
  isServiceBillable = true;
  subscription: Subscription;
  noOfColumns = 8;
  noshowCount = 0;
  hideServiceBillCount = 0;
  showEditView = false;
  calculationmode;
  active_user;
  showToken = false;
  apiloading = false;
  constructor(private provider_services: ProviderServices,
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
    this.no_today_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_TODAY_CHECKIN_MSG);
    this.no_started_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_STRTED_CHECKIN_MSG);
    this.no_completed_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_COMPLETED_CHECKIN_MSG);
    this.no_cancelled_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_CANCELLED_CHECKIN_MSG);
    this.no_history = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_HISTORY_MSG);
    this.waitlist_status = [
      { name: this.checkedin_upper, value: 'checkedIn' },
      { name: this.cancelled_upper, value: 'cancelled' },
      { name: this.started_upper, value: 'started' },
      { name: this.arrived_upper, value: 'arrived' },
      { name: this.done_upper, value: 'complete' }];
  }
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' }
  ];
  ngAfterViewInit(): void {
    setTimeout(() => { this.apis_loaded = true; });
  }
  ngOnInit() {
    this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.getDomainSubdomainSettings();
    this.getServiceList();
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'dashboard', 'subKey': 'dashboard', 'classname': 'b-delay',
      'actions': [{ 'title': 'Adjust Delay', 'icon': 'B', 'type': 'adjustdelay', 'icontype': 'adjustdelay_learnmore' }]
    };
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    if (!this.server_date) { this.setSystemDate(); }
    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        this.returnedFromCheckDetails = (e[0].urlAfterRedirects.includes('/provider/checkin-detail/'));
      });
    const savedtype = this.shared_functions.getitemfromLocalStorage('pdtyp');
    if (savedtype !== undefined && savedtype !== null) {
      this.time_type = savedtype;
    }
    const stattype = this.shared_functions.getitemfromLocalStorage('pdStyp'); // To get the active tab
    if (stattype !== undefined && stattype !== null && stattype !== '') {
      this.status_type = stattype;
    }
    if (stattype === null || stattype === '') { this.status_type = 'all'; }
    this.shared_functions.setBusinessDetailsforHeaderDisp('', '', '', '');
    const bprof = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
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
          }
        );
    } else {
      this.getBusinessProfile();
    }
    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
      this.reloadAPIs();
    });
    this.subscription = this.shared_functions.getSwitchMessage().subscribe(message => {
      switch (message.ttype) {
        case 'fromprovider': {
          this.closeCounters();
        }
      }
    });
    this.subscription = this.shared_functions.getSwitchMessage().subscribe(message => {
      const ynw = this.shared_functions.getitemfromLocalStorage('loc_id');
      switch (message.ttype) {
        case 'location_change': {
          this.changeLocation(ynw);
        }
      }
    });
  }
  routeLoadIndicator(e) {
    this.apiloading = e;
  }
  closeCounters() {
    if (this.cronHandle) { this.cronHandle.unsubscribe(); }
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.shared_functions.setitemonLocalStorage('sysdate', res);
        });
  }
  performActions(action) {
    if (action === 'adjustdelay') {
      this.showAdjustDelay();
    } else if (action === 'adjustdelay_learnmore') {
      this.learnmore_clicked(action);
    }
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
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
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.show_small_device_queue_display = true;
      this.noshowCount = 2;
    } else {
      this.small_device_display = false;
      this.show_small_device_queue_display = false;
    }
    if (this.screenWidth <= projectConstants.SMALL_DEVICE_BOUNDARY) {
      this.small_device_display = true;
      this.noshowCount = 2;
    } else {
      this.small_device_display = false;
    }
  }
  getBusinessProfile() {
    let bProfile: any = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          bProfile = data;
          if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
            // calling function which saves the business related details to show in the header
            const subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
            this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
              || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '');
            const pdata = { 'ttype': 'updateuserdetails' };
            this.shared_functions.sendMessage(pdata);
            const statusCode = this.provider_shared_functions.getProfileStatusCode(bProfile);
            if (statusCode === 0) {
            }
            this.shared_functions.setitemonLocalStorage('isCheckin', statusCode);
          }
        },
        () => { }
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
  // get the logo url for the provider
  getProviderLogo(bname = '', bsector = '', bsubsector = '') {
    let blogo;
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          blogo = data;
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
        () => {
        }
      );
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.calculationmode = this.settings.calculationMode;
        this.showToken = this.settings.showTokenId;
      }, () => {
      });
  }
  getServiceList() {
    this.provider_services.getServicesList()
      .subscribe(
        data => {
          this.services = data;
          this.getProviderSettings();
        },
        () => { }
      );
  }
  getQueueList() {
    this.provider_services.getProviderLocationQueues(this.selected_location.id)
      .subscribe(
        (data: any) => {
          const Cqueues = data;
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
          if (!getsavedqueueid) {
            const selid = this.findCurrentActiveQueue(this.all_queues);
            this.selectedQueue(this.all_queues[selid]);
          }
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
          this.selected_queue = this.all_queues[selqid];
          this.getTodayCheckinCount();
          if (this.time_type === 1) {
            this.getTodayCheckIn();
          }
        },
        () => { },
        () => { }
      );
  }
  getQueueListByDate() {
    this.load_queue = 0;
    if (this.selected_location.id) {
      this.provider_services.getProviderLocationQueuesByDate(
        this.selected_location.id, this.queue_date)
        .subscribe(
          (data: any) => {
            const Cqueues = data;
            this.queues = [];
            const savedQ = this.shared_functions.getitemfromLocalStorage('pdq') || '';
            const savedQok = [];
            let indx = 0;
            for (const que of Cqueues) {
              if (que.queueState === 'ENABLED') {
                if (que.id === savedQ) {
                  savedQok.push(que);
                }
                que.qindx = indx;
                this.queues.push(que);
                indx += 1;
              }
            }
            if (savedQok.length > 0) {
              this.selectedQueue(savedQok[0]);
            } else {
              if (this.queues[0] && this.selected_queue == null) {
                const selectedQindx = this.findCurrentActiveQueue(this.queues);
                this.selectedQueue(this.queues[selectedQindx]);
              }
            }
          },
          () => {
            this.queues = [];
            this.load_queue = 1;
          },
          () => {
            this.load_queue = 1;
          }
        );
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
    for (let i = 0; i < ques.length; i++) {
      for (let j = 0; j < ques[i].queueSchedule.repeatIntervals.length; j++) {
        const pday = Number(ques[i].queueSchedule.repeatIntervals[j]);
        if (currentday === pday) {
          stime = new Date(tday + ' ' + this.AMHourto24(ques[i].queueSchedule.timeSlots[0].sTime));
          etime = new Date(tday + ' ' + this.AMHourto24(ques[i].queueSchedule.timeSlots[0].eTime));
          if ((curtimeforchk.getTime() >= stime.getTime()) && (curtimeforchk.getTime() <= etime.getTime())) {
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
    const time24 = sHours + ':' + sMinutes + ':00';
    return time24;
  }
  changeLocation(location) {
    this.selected_location = location;
    this.selected_queue = null;
    this.loadApiSwitch('changeLocation');
    this.today_waitlist_count = 0;
    this.future_waitlist_count = 0;
    this.check_in_list = this.check_in_filtered_list = [];
    this.getQueueList();
    this.getFutureCheckinCount()
      .then(
        (result) => {
          this.future_waitlist_count = result;
        }
      );
  }
  selectedQueue(selected_queue) {
    if (selected_queue.id) {
      this.sel_queue_indx = selected_queue.qindx;
      this.shared_functions.setitemonLocalStorage('pdq', selected_queue.id);
    }
    this.selected_queue = selected_queue;
    this.getTodayCheckIn();
    this.today_waitlist_count = 0;
  }
  handleQueueSel(mod) {
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
        'location-eq': this.selected_location.id,
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getWaitlistFutureCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            if (no_filter) { this.future_waitlist_count = data; }
          },
          () => {
          });
    });
  }
  getHistoryCheckinCount(Mfilter = null) {
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {
        'location-eq': this.selected_location.id
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getwaitlistHistoryCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            if (no_filter) { this.histroy_waitlist_count = data; }
          },
          () => {
          });
    });
  }
  getTodayCheckinCount(Mfilter = null) {
    const queueid = this.shared_functions.getitemfromLocalStorage('pdq');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {
        'location-eq': this.selected_location.id,
        'waitlistStatus-neq': 'prepaymentPending',
        'queue-eq': queueid
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getwaitlistTodayCount(Mfilter)
        .subscribe(
          data => {
            if (no_filter) { this.today_waitlist_count = data; }
            resolve(data);
          },
          () => {
          });
    });
  }
  getCount(list, status) {
    return list.filter(function (elem) {
      return elem.waitlistStatus === status;
    }).length;
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'arrived');
    this.today_checkedin_count = this.getCount(list, 'checkedIn');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count;
    this.today_started_count = this.getCount(list, 'started');
    this.today_completed_count = this.getCount(list, 'done');
    this.today_cancelled_count = this.getCount(list, 'cancelled');
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_count;
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
          if (this.filterapplied === true) {
            this.noFilter = false;
          } else {
            this.noFilter = true;
          }
          this.setCounts(this.check_in_list);
          if (this.status_type) {
            this.changeStatusType(this.status_type);
          } else {
            this.changeStatusType('all');
          }
        },
        () => {
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
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
            },
            () => {
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
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
            },
            () => {
              this.load_waitlist = 1;
            },
            () => {
              this.load_waitlist = 1;
            });
      }
    );
  }
  setTimeType(time_type) {
    if (time_type === 1 && this.status_type === 'all') {
      this.showTime = true;
    } else {
      this.showTime = false;
    }
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
    this.filterapplied = false;
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
    } else if (type === 'check_in_end_date') {
      this.filter_date_start_max = this.filter.check_in_end_date;
    }
    this.doSearch();
  }
  loadApiSwitch(source) {
    let chkSrc = true;
    if (source === 'changeLocation' && this.time_type === 0) {
      const hisPage = this.shared_functions.getitemfromLocalStorage('hP');
      const hFilter = this.shared_functions.getitemfromLocalStorage('hPFil');
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
      case 0: this.getHistoryCheckIn();
        this.noOfColumns = 9;
        break;
      case 1: this.getQueueListByDate();
        this.noOfColumns = 8;
        break;
      case 2: this.getFutureCheckIn();
        this.noOfColumns = 8;
        break;
    }
  }
  showAdjustDelay() {
    if (this.queues.length === 0 || !this.selected_queue || (this.selected_queue && !this.selected_queue.id)) {
      this.shared_functions.openSnackBar('Delay can be applied only for active queues', { 'panelClass': 'snackbarerror' });
      return false;
    }
    this.adjustdialogRef = this.dialog.open(AdjustQueueDelayComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'adjust-delay'],
      disableClose: true,
      data: {
        queues: this.queues,
        queue_id: this.selected_queue.id,
        queue_name: this.selected_queue.name,
        queue_schedule: this.selected_queue.queueSchedule.timeSlots[0].sTime + '-' + this.selected_queue.queueSchedule.timeSlots[0].eTime,
        checkedin_count: this.today_checkedin_count,
        arrived_count: this.today_arrived_count
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
  reloadAPIs() {
    this.countApiCall();
    this.loadApiSwitch('reloadAPIs');
  }
  countApiCall() {
    this.getHistoryCheckinCount();
    this.getFutureCheckinCount();
  }
  changeStatusType(type) {
    this.status_type = type;
    if (this.time_type === 1 && this.status_type === 'all') {
      this.showTime = true;
    } else {
      this.showTime = false;
    }
    this.shared_functions.setitemonLocalStorage('pdStyp', this.status_type);
    let status: any = this.status_type;
    switch (type) {
      case 'all': status = ['checkedIn', 'arrived'];
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
    if (action === 'DONE') {
      waitlist.disableDonebtn = true;
    }
    if (action === 'STARTED') {
      waitlist.disableStartbtn = true;
    }
    if (action === 'REPORT') {
      waitlist.disableArrivedbtn = true;
    }
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
      panelClass: ['popup-class', 'commonpopupmainclass'],
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
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.loadApiSwitch('doSearch');
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
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.service !== 'all' ||
      this.filter.queue !== 'all' || this.filter.waitlist_status !== 'all' || this.filter.payment_status !== 'all' || this.filter.check_in_start_date
      || this.filter.check_in_end_date) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
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
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: checkin.ynwUuid
      }
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') { }
    });
  }
  viewBillPage(checkin) {
    this.router.navigate(['provider', 'bill', checkin.ynwUuid]);
  }
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
    this.doSearch();
  }
  addConsumerInboxMessage(waitlist) {
    this.provider_shared_functions.addConsumerInboxMessage(waitlist, this)
      .then(
        () => { },
        () => { }
      );
  }
  reloadActionSubheader() { this.reloadAPIs(); }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) { input.focus(); }
  }
  focusInputSp(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) { this.doSearch(); }
  }
  learnmore_clicked(action) {
    if (action === 'adjustdelay') {
      this.router.navigate(['/provider/learnmore/dashboard']);
    } else if (action === 'adjustdelay_learnmore') {
      this.router.navigate(['/provider/learnmore/adjustdelay']);
    }
  }
  getDomainSubdomainSettings() {
    const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    return new Promise((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
        .subscribe(
          (data: any) => {
            this.pos = data.pos;
            if (data.serviceBillable === false) {
              this.isServiceBillable = false;
              this.hideServiceBillCount = 1;
            } else {
              this.isServiceBillable = true;
              this.hideServiceBillCount = 0;
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getAppxTime(waitlist) {
    return this.shared_functions.providerConvertMinutesToHourMinute(waitlist.appxWaitingTime);
  }
  editClicked() {
    this.showEditView = true;
  }
  saveClicked(esttime) {
    for (let i = 0; i < this.check_in_list.length; i++) {
      if (esttime) {
        this.provider_services.editWaitTime(this.check_in_list[i].ynwUuid, esttime).subscribe(
          () => {
            this.showEditView = false;
            this.setTimeType(1);
          }, (error) => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
      }
    }
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  isvalid(evt) {
    return this.shared_functions.isValid(evt);
  }
}
