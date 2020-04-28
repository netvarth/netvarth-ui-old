import { interval as observableInterval, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import * as moment from 'moment';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { SharedServices } from '../../../shared/services/shared-services';
import { filter, pairwise, isEmpty } from 'rxjs/operators';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { LocateCustomerComponent } from '../check-ins/locate-customer/locate-customer.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ApplyLabelComponent } from '../check-ins/apply-label/apply-label.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewInit {
  // apptType  --- 0-History, 1-Future, 2-Today
  // pdStyp --- 'all' -- Checkins, 'started' - Started, 'done' - Complete, 'cancelled' - Cancelled
  // pdq --- selected queue id
  today_cap = Messages.TODAY_HOME_CAP;
  future_cap = Messages.FUTURE_HOME_CAP;
  history_cap = Messages.HISTORY_HOME_CAP;
  service_window_cap = Messages.WORKING_HRS_CAP;
  services_cap = Messages.SRVIC_CAP;
  check_in_status = Messages.PAY_STATUS;
  payment_status = Messages.PAYMENT_CAP;
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
  manage_labels = Messages.MANAGE_LABELS;
  add_label = Messages.ADD_LABEL;
  no_history = '';
  no_today_checkin_msg = '';
  no_started_checkin_msg = '';
  no_completed_checkin_msg = '';
  no_cancelled_checkin_msg = '';
  check_in_statuses_filter = projectConstants.CHECK_IN_STATUSES_FILTER;
  future_check_in_statuses_filter = projectConstants.FUTURE_CHECK_IN_STATUSES_FILTER;
  locations: any = [];
  queues: any = [];
  all_queues: any = [];
  services: any = [];
  selected_location = null;
  selected_location_index = null;
  selected_queue = null;
  future_waitlist_count: any = 0;
  today_waitlist_count: any = 0;
  history_waitlist_count: any = 0;
  time_type = 1;
  check_in_list: any = [];
  check_in_filtered_list: any = [];
  holdbdata: any = [];
  status_type = 'all';
  status_subtype = 'started';
  queue_date = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
  edit_location = 0;
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
  today_rejected_count = 0;
  today_cancelled_checkins_count = 0;
  today_checkedin_count = 0;
  section_new: any = [];
  section_future: any = [];
  section_history: any = [];
  pos = false;
  bname = '';
  cust_note_tooltip;
  filter_sidebar = false;
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
    page: 1,
    futurecheckin_date: null,
    age: '',
    gender: ''
  }; // same in resetFilter Fn
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    queue: false,
    service: false,
    waitlist_status: false,
    payment_status: false,
    check_in_start_date: false,
    check_in_end_date: false,
    location_id: false,
    age: false,
    gender: false
  };
  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = null;

  filter_dob_start_min = null;
  filter_dob_start_max = null;
  filter_dob_end_min = null;
  filter_dob_end_max = null;

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
  @ViewChildren('appSlots') slotIds: QueryList<ElementRef>;
  showTime = false;
  cronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  settings;
  delayTooltip = this.shared_functions.getProjectMesssages('ADJUSTDELAY_TOOPTIP');
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  cloudTooltip = this.shared_functions.getProjectMesssages('CLOUDICON_TOOPTIP');
  notedialogRef;
  addnotedialogRef;
  makPaydialogRef;
  sendmsgdialogRef;
  locateCustomerdialogRef;
  screenWidth;
  isCheckin;
  small_device_display = false;
  show_small_device_queue_display = false;
  returnedFromCheckDetails = false;
  breadcrumb_moreoptions: any = [];
  apis_loaded = false;
  breadcrumbs_init = [{ title: 'Appointments' }];
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
  srchcustdialogRef;
  crtCustdialogRef;
  ChkindialogRef;
  bprofile: any = [];
  domain;
  providerLabels: any = [];
  checkinId;
  labelMap;
  label;
  showValueCreation: any = [];
  labeldialogRef;
  grouped_list: any;
  new_checkins_list: any = [];
  started_checkins_list: any = [];
  completed_checkins_list: any = [];
  cancelled_checkins_list: any = [];
  section_start: any = [];
  section_complete: any = [];
  section_cancel: any = [];
  showStausFilters: any = [];
  filterStatus = true;
  showTokenFilter = false;
  token;
  newPanel = true;
  startedPanel = false;
  completedPanel = false;
  cancelledPanel = false;
  distance: any = [];
  trackDetail: any = [];
  unit: any = [];
  travelTime: any = [];
  timeUnit: any = [];
  hours;
  minutes;
  waitlistSelected: any = [];
  waitlistSelection = 0;
  selectedCheckin: any = [];
  showLabels: any = [];
  showstatus: any = [];
  startedwaitlistSelected: any = [];
  cancelledwaitlistSelected: any = [];
  completedwaitlistSelected: any = [];
  cancelledwaitlistSelection = 0;
  completedwaitlistSelection = 0;
  startedwaitlistSelection = 0;
  startedWaitlistforMsg: any = [];
  cancelledWaitlistforMsg: any = [];
  completedWaitlistforMsg: any = [];
  newWaitlistforMsg: any = [];
  consumerTrackstatus = false;
  customerMsg = '';
  board_count = 0;
  sortBy = 'sort_token';
  showAvailableSlots = false;
  availableSlots: any = [];
  timeSlotCheckins: any = [];
  loading = false;
  unAvailableSlots: any = [];
  departments: any = [];
  futureUnAvailableSlots: any = [];
  tomorrowDate;
  historyCheckins: any = [];
  labelMultiCtrl: any = [];
  labelFilter: any = [];
  labelFilterData = '';
  labelsCount: any = [];
  statusMultiCtrl: any = [];
  carouselOne;
  views: any = [];
  selectedView: any;
  selQId;
  allActiveQs: any[];
  availableSlotDetails: any = [];
  selQidsforHistory: any = [];
  servicesCount;

  constructor(private provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    private router: Router,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices,
    public dateformat: DateFormatPipe,
    public route: ActivatedRoute) {
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
      { name: this.arrived_upper, value: 'Arrived' },
      { name: this.done_upper, value: 'complete' }];
  }
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'Refund', value: 'Refund' }
  ];
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apis_loaded = true;
      this.carouselOne = {
        dots: false,
        nav: true,
        navContainer: '.checkins-nav',
        navText: [
          '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        autoplay: false,
        // autoplayTimeout: 6000,
        // autoplaySpeed: 1000,
        // autoplayHoverPause: true,
        mouseDrag: false,
        touchDrag: true,
        pullDrag: false,
        loop: false,
        autoWidth: false,
        // margin: 10,
        responsiveClass: true,
        responsiveBaseElement: '.checkins-owl',
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 3
          },
          768: {
            items: 4
          },
          979: {
            items: 4
          },
          1200: {
            items: 5
          }
        }
      };
    });

    // setTimeout(() => {
    //   this.apis_loaded = true;
    //   if (this.unAvailableSlots.length > 0) {
    //     this.scrollToSection();
    //   }
    //   if (this.futureUnAvailableSlots.length > 0) {
    //     this.scrollToSection();
    //   }
    // });
  }

  // scrollToSection() {
  //   if (this.time_type === 2) {
  //     this.slotIds.toArray().forEach(element => {
  //       if (element.nativeElement.innerText === this.futureUnAvailableSlots[0]) {
  //         element.nativeElement.scrollIntoViewIfNeeded();
  //         return false;
  //       }
  //     });
  //   }
  //   if (this.time_type === 1) {
  //     this.slotIds.toArray().forEach(element => {
  //       if (element.nativeElement.innerText === this.unAvailableSlots[0]) {
  //         element.nativeElement.scrollIntoViewIfNeeded();
  //         return false;
  //       }
  //     });
  //   }
  // }

  ngOnInit() {
    this.setSystemDate();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
      this.getTomorrowDate();
    }
    this.showstatus['new'] = true;
    this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(() => {
      if (this.time_type === 1) {
        this.getTodayAppointments();
      }
      if (this.time_type === 2) {
        this.getFutureAppointments();
      }
    });
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = this.active_user.sector;
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'appointments',
      'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
    };
    this.cust_note_tooltip = Messages.CUST_NOT_TOOLTIP.replace('[customer]', this.customer_label);
    this.getDomainSubdomainSettings();
    this.getQs().then(
      (queues: any) => {
        const allActiveQs = [];
        for (let i = 0; i < queues.length; i++) {
          if (queues[i].apptState === 'ENABLED') {
            const queueActive = {};
            queueActive['id'] = queues[i].id;
            allActiveQs.push(queueActive);
          }
        }
        const tempView = {};
        tempView['name'] = 'Default';
        tempView['id'] = 0;
        tempView['customViewConditions'] = {};
        tempView['customViewConditions'].queues = allActiveQs;
        this.selectedView = tempView;
        this.getViews().then(
          (data: any) => {
            this.views = data;
            this.views.push(tempView);
            this.initView(this.selectedView);
          },
          error => {
            this.views.push(tempView);
            this.initView(this.selectedView);
          }
        );
      }
    );
    this.getPos();
    this.getServiceList();
    this.getLabel();
    this.getDepartments();
    this.getLocationList().then(
      () => {
        this.breadcrumb_moreoptions = {
          'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
        this.router.events
          .pipe(filter((e: any) => e instanceof RoutesRecognized),
            pairwise()
          ).subscribe((e: any) => {
            this.returnedFromCheckDetails = (e[0].urlAfterRedirects.includes('/provider/check-ins/'));
          });

        const savedtype = this.shared_functions.getitemFromGroupStorage('apptType');
        if (savedtype !== undefined && savedtype !== null) {
          this.time_type = savedtype;
        }
        const stattype = this.shared_functions.getitemFromGroupStorage('pdStyp'); // To get the active tab
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
        this.subscription = this.shared_functions.getSwitchMessage().subscribe(message => {
          switch (message.ttype) {
            case 'fromprovider': {
              this.closeCounters();
            }
          }
        });
        this.subscription = this.shared_functions.getSwitchMessage().subscribe(message => {
          const ynw = this.shared_functions.getitemFromGroupStorage('loc_id');
          switch (message.ttype) {
            case 'location_change': {
              this.changeLocation(ynw);
            }
          }
        });
      }
    );
  }
  getQs(apifilter?) {
    const _this = this;
    return new Promise((resolve) => {
      _this.provider_services.getProviderSchedules(apifilter).subscribe(
        (queues: any) => {
          const qs = [];
          for (let i = 0; i < queues.length; i++) {
            if (queues[i].apptState === 'ENABLED') {
              qs.push(queues[i]);
            }
          }
          resolve(qs);
        });
    });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
    if (this.addnotedialogRef) {
      this.addnotedialogRef.close();
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
    if (this.screenWidth <= 1040) {
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
          this.bprofile = bProfile;
          this.bname = bProfile['businessName'];
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
            this.shared_functions.setitemToGroupStorage('isCheckin', statusCode);
            this.reloadAPIs();
          }
        },
        () => { }
      );
  }
  changeLocation(location) {
    this.selected_location = location;
    this.shared_functions.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    this.shared_functions.setitemToGroupStorage('loc_id', this.selected_location);
    this.selected_queue = null;
    this.loadApiSwitch('changeLocation');
    this.today_waitlist_count = 0;
    this.future_waitlist_count = 0;
    this.history_waitlist_count = 0;
    this.check_in_list = this.check_in_filtered_list = [];
    this.getFutureAppointmentsCount()
      .then(
        (result) => {
          this.future_waitlist_count = result;
        }
      );
    this.getHistoryAppointmentsCount()
      .then(
        (result) => {
          this.history_waitlist_count = result;
        }
      );
  }
  handleViewSel(view) {
    this.shared_functions.setitemonLocalStorage('t_slv', view);
    this.selectedView = view;
    this.initView(this.selectedView);
    this.reloadAPIs();
  }
  getFutureAppointmentsCount(Mfilter = null) {
    let no_filter = false;
    if (!Mfilter && this.selected_location && this.selected_location.id) {
      Mfilter = {
        'location-eq': this.selected_location.id,
        'schedule-eq': this.selQId
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getFutureAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.future_waitlist_count = data;
          },
          () => {
          });
    });
  }
  getHistoryAppointmentsCount(Mfilter = null) {
    let no_filter = false;
    if (!Mfilter && this.selected_location && this.selected_location.id) {
      Mfilter = {
        'location-eq': this.selected_location.id
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getHistoryAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.history_waitlist_count = data;
          },
          () => {
          });
    });
  }
  getTodayAppointmentsCount(Mfilter = null) {
    const queueid = this.shared_functions.getitemFromGroupStorage('pdq');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {
        'location-eq': this.selected_location.id,
        'apptStatus-neq': 'prepaymentPending',
        'schedule-eq': queueid
      };
      no_filter = true;
    }
    return new Promise((resolve) => {
      this.provider_services.getTodayAppointmentsCount(Mfilter)
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
      return elem.apptStatus === status;
    }).length;
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'Arrived');
    this.today_checkedin_count = this.getCount(list, 'Confirmed');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count;
    this.today_started_count = this.getCount(list, 'Started');
    this.today_completed_count = this.getCount(list, 'Completed');
    this.today_cancelled_count = this.getCount(list, 'Cancelled');
    this.today_rejected_count = this.getCount(list, 'Rejected');
    this.today_cancelled_checkins_count = this.today_cancelled_count + this.today_rejected_count;
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_checkins_count;
  }

  initView(view) {
    return new Promise((resolve, reject) => {
      const qIds = [];
      if (view.customViewConditions.queues.length > 0) {
        for (let i = 0; i < view.customViewConditions.queues.length; i++) {
          qIds.push(view.customViewConditions.queues[i]['id']);
        }
      }
      if (this.shared_functions.getitemFromGroupStorage('appt_history_selQ')) {
        this.selQidsforHistory = this.shared_functions.getitemFromGroupStorage('appt_history_selQ');
      } else {
        this.selQidsforHistory = qIds;
        this.shared_functions.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
      }
      this.getQs().then(data => {
        this.queues = [];
        this.queues = data;
        resolve();
        this.load_queue = 1;
        if (this.shared_functions.getitemFromGroupStorage('appt_selQ')) {
          this.selQId = this.shared_functions.getitemFromGroupStorage('appt_selQ');
          const selQdetails = this.queues.filter(q => q.id === this.selQId);
          this.servicesCount = selQdetails[0].services.length;
        } else {
          if (view.customViewConditions.queues && view.customViewConditions.queues[0]) {
            this.selQId = view.customViewConditions.queues[0]['id'];
          }
          if (view.customViewConditions.queues[0] && view.customViewConditions.queues[0].services) {
            this.servicesCount = view.customViewConditions.queues[0].services.length;
          }
          this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
        }
      });
    });
  }

  getTodayAppointments() {
    this.loading = true;
    this.getQs().then(queue => {
      this.queues = [];
      this.queues = queue;
      this.load_waitlist = 0;
      const Mfilter = this.setFilterForApi();
      if (this.selQId) {
        Mfilter['schedule-eq'] = this.selQId;
      }
      this.resetPaginationData();
      this.pagination.startpageval = 1;
      this.pagination.totalCnt = 0; // no need of pagination in today
      const promise = this.getTodayAppointmentsCount(Mfilter);
      promise.then(
        result => {
          this.provider_services.getTodayAppointments(Mfilter)
            .subscribe(
              data => {
                this.new_checkins_list = [];
                this.started_checkins_list = [];
                this.completed_checkins_list = [];
                this.cancelled_checkins_list = [];
                this.check_in_list = data;
                this.grouped_list = this.shared_functions.groupBy(this.check_in_list, 'apptStatus');
                if (this.grouped_list && this.grouped_list['Started']) {
                  this.started_checkins_list = this.grouped_list['Started'].slice();
                }
                if (this.grouped_list && this.grouped_list['Completed']) {
                  this.completed_checkins_list = this.grouped_list['Completed'].slice();
                }
                if (this.grouped_list && this.grouped_list['Cancelled']) {
                  this.cancelled_checkins_list = this.grouped_list['Cancelled'].slice();
                }
                if (this.grouped_list && this.grouped_list['Rejected']) {
                  Array.prototype.push.apply(this.cancelled_checkins_list, this.grouped_list['Rejected'].slice());
                }
                if (this.grouped_list && this.grouped_list['Confirmed']) {
                  this.new_checkins_list = this.grouped_list['Confirmed'].slice();
                }
                if (this.grouped_list && this.grouped_list['Arrived']) {
                  Array.prototype.push.apply(this.new_checkins_list, this.grouped_list['Arrived'].slice());
                }
                this.sortCheckins(this.new_checkins_list);
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
                // if (this.selected_queue && this.selected_queue.appointment === 'Enable' && this.calculationmode === 'Fixed') {
                //   this.getAvaiableSlots('today');
                //   if (this.unAvailableSlots.length > 0) {
                //     setTimeout(() => {
                //       this.scrollToSection();
                //     }, 500);
                //   }
                // } else if (this.shared_functions.getitemFromGroupStorage('interval')) {
                //   this.shared_functions.removeitemFromGroupStorage('interval');
                // }
                if (this.selQId) {
                  this.getAvaiableSlots();
                }
                this.loading = false;
              },
              () => {
                this.load_waitlist = 1;
              },
              () => {
                this.load_waitlist = 1;
              });
        });
    });
  }
  getFutureAppointments() {
    if (this.filter.futurecheckin_date === null) {
      this.getTomorrowDate();
    }
    this.shared_functions.setitemToGroupStorage('futureDate', this.dateformat.transformTofilterDate(this.filter.futurecheckin_date));
    const date = this.dateformat.transformTofilterDate(this.filter.futurecheckin_date);
    this.provider_services.getProviderSchedulesbyDate(date).subscribe(queues => {
      this.queues = queues;
      const selQ = this.queues.filter(q => q.id === this.selQId);
      if (selQ.length === 0 && this.queues.length > 0) {
        this.selQId = this.queues[0].id;
        this.servicesCount = this.queues[0].services.length;
        this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      }
      this.load_waitlist = 0;
      let Mfilter = this.setFilterForApi();
      if (this.selQId) {
        Mfilter['schedule-eq'] = this.selQId;
      }
      const promise = this.getFutureAppointmentsCount(Mfilter);
      promise.then(
        result => {
          this.pagination.totalCnt = result;
          Mfilter = this.setPaginationFilter(Mfilter);
          this.provider_services.getFutureAppointments(Mfilter)
            .subscribe(
              data => {
                this.new_checkins_list = [];
                this.check_in_list = this.check_in_filtered_list = data;
                if (this.filterapplied === true) {
                  this.noFilter = false;
                } else {
                  this.noFilter = true;
                }
                // if (this.selected_queue && this.selected_queue.appointment === 'Enable' && this.calculationmode === 'Fixed') {
                //   this.getAvaiableSlots();
                //   if (this.futureUnAvailableSlots.length > 0) {
                //     setTimeout(() => {
                //       this.scrollToSection();
                //     }, 500);
                //   }
                // } else if (this.shared_functions.getitemFromGroupStorage('interval')) {
                //   this.shared_functions.removeitemFromGroupStorage('interval');
                // }
                if (this.selQId) {
                  this.getAvaiableSlots();
                }
                this.loading = false;
              },
              () => {
                this.load_waitlist = 1;
              },
              () => {
                this.load_waitlist = 1;
              });
        });
    });
  }
  getHistoryAppointments() {
    this.getQs().then(queue => {
      this.queues = [];
      this.queues = queue;
      this.loading = true;
      this.load_waitlist = 0;
      let Mfilter = this.setFilterForApi();
      if (this.selQidsforHistory.length !== 0) {
        Mfilter['schedule-eq'] = this.selQidsforHistory.toString();
      }
      // const promise = this.getHistoryAppointmentsCount(Mfilter);
      // promise.then(
      //   result => {
      //     this.pagination.totalCnt = result;
      Mfilter = this.setPaginationFilter(Mfilter);
      this.provider_services.getHistoryAppointments(Mfilter)
        .subscribe(
          data => {
            this.new_checkins_list = [];
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
      this.loading = false;
    }
    );
    // }
    // );
  }
  isAvailableSlot(slot) {
    if (slot.noOfAvailbleSlots === '0') {
      return true;
    }
    return false;
  }
  getAvaiableSlots() {
    this.unAvailableSlots = [];
    let date;
    if (this.time_type === 1) {
      date = this.dateformat.transformTofilterDate(this.server_date);
    }
    if (this.time_type === 2) {
      date = this.dateformat.transformTofilterDate(this.filter.futurecheckin_date);
    }
    this.provider_services.getAppointmentSlotsByDate(this.selQId, date).subscribe(data => {
      this.availableSlotDetails = data;
      const checkins = [];
      for (let i = 0; i < this.check_in_list.length; i++) {
        if (this.check_in_list[i].apptStatus === 'Arrived' || this.check_in_list[i].apptStatus === 'Confirmed') {
          checkins.push(this.check_in_list[i]);
        }
      }
      this.timeSlotCheckins = this.shared_functions.groupBy(checkins, 'appmtTime');
      if (Object.keys(this.timeSlotCheckins).length > 0) {
        const slots = [];
        Object.keys(this.timeSlotCheckins).forEach(key => {
          for (let i = 0; i < this.availableSlotDetails.availableSlots.length; i++) {
            if (this.availableSlotDetails.availableSlots[i].noOfAvailbleSlots === '0') {
              if (this.unAvailableSlots.indexOf(this.availableSlotDetails.availableSlots[i]) === -1) {
                this.unAvailableSlots.push(this.availableSlotDetails.availableSlots[i]);
              }
              if (this.availableSlotDetails.availableSlots[i].time === key) {
                slots.push(this.availableSlotDetails.availableSlots[i]);
              }
            }
          }
          this.waitlistSelected[key] = [];
          if (this.newWaitlistforMsg.length > 0) {
            for (let i = 0; i < this.newWaitlistforMsg.length; i++) {
              for (let j = 0; j < this.timeSlotCheckins[key].length; j++) {
                if (this.newWaitlistforMsg[i].uid === this.timeSlotCheckins[key][j].uid) {
                  this.waitlistSelected[key][j] = true;
                }
              }
            }
          }
        });
        this.unAvailableSlots = this.unAvailableSlots.filter(x => !slots.includes(x));
      } else {
        for (let i = 0; i < this.availableSlotDetails.availableSlots.length; i++) {
          if (this.availableSlotDetails.availableSlots[i].noOfAvailbleSlots === '0') {
            this.unAvailableSlots.push(this.availableSlotDetails.availableSlots[i]);
          }
        }
      }
      this.availableSlotDetails.availableSlots = this.availableSlotDetails.availableSlots.filter(x => !this.unAvailableSlots.includes(x));
    });
  }

  setTimeType(time_type) {
    this.statusMultiCtrl = [];
    if (time_type === 2) {
      this.getTomorrowDate();
    }
    if (this.open_filter === true) {
      this.toggleFilter();
    }
    if (time_type === 1 && this.status_type === 'all') {
      this.showTime = true;
    } else {
      this.showTime = false;
    }
    this.check_in_list = this.check_in_filtered_list = [];
    this.time_type = time_type;
    this.shared_functions.setitemToGroupStorage('apptType', this.time_type);
    this.section_cancel = [];
    this.section_complete = [];
    this.section_start = [];
    this.section_future = [];
    this.section_history = [];
    this.section_new = [];
    if (time_type !== 3) {
      this.shared_functions.removeitemfromLocalStorage('appthP');
      this.shared_functions.removeitemfromLocalStorage('appthPFil');
    }
    const stype = this.shared_functions.getitemFromGroupStorage('pdStyp');
    if (stype) {
      this.status_type = stype;
    } else {
      this.status_type = 'cancelled';
    }
    this.setFilterDateMaxMin();
    this.filterapplied = false;
    this.loadApiSwitch('setTimeType');
  }
  setFilterdobMaxMin() {
    this.filter_dob_start_max = new Date();
    this.filter_dob_end_max = new Date();
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
    this.resetAll();
    let chkSrc = true;
    if (source === 'changeLocation' && this.time_type === 3) {
      const hisPage = this.shared_functions.getitemFromGroupStorage('appthP');
      const hFilter = this.shared_functions.getitemFromGroupStorage('appthPFil');
      if (hisPage !== null) {
        this.filter = hFilter;
        this.pagination.startpageval = hisPage;
        this.shared_functions.removeitemfromLocalStorage('appthP');
        this.shared_functions.removeitemfromLocalStorage('appthPFil');
        chkSrc = false;
      }
    }
    if (chkSrc) {
      if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
        this.resetFilter();
        this.resetLabelFilter();
      }
    }
    switch (this.time_type) {
      case 1:
        this.getTodayAppointments();
        break;
      case 2: this.getFutureAppointments();
        this.shared_functions.getitemfromLocalStorage('f_slv');
        break;
      case 3:
        this.shared_functions.getitemfromLocalStorage('h_slv');
        this.getHistoryAppointments();
        break;
    }
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
    // this.countApiCall();
    this.loadApiSwitch('reloadAPIs');
  }
  changeStatusType(type) {
    this.status_type = type;
    if (type !== 'all') {
      this.status_subtype = type;
    }
    if (this.time_type === 1 && this.status_type === 'all') {
      this.showTime = true;
    } else {
      this.showTime = false;
    }
    this.shared_functions.setitemToGroupStorage('pdStyp', this.status_type);
    let status: any = this.status_type;
    switch (type) {
      case 'all': status = ['checkedIn', 'Arrived'];
    }
    this.check_in_filtered_list = this.check_in_list.filter(
      check_in => {
        if (typeof (status) === 'string' &&
          check_in.apptStatus === status) {
          return check_in;
        } else if (typeof (status) === 'object') {
          const index = status.indexOf(check_in.apptStatus);
          if (index !== -1) {
            return check_in;
          }
        }
      });
  }
  changeWaitlistStatus(waitlist, action) {
    if (!waitlist.uid) {
      waitlist = this.selectedCheckin[waitlist];
    }
    if (action === 'Completed') {
      waitlist.disableDonebtn = true;
    }
    if (action === 'Started') {
      waitlist.disableStartbtn = true;
    }
    if (action === 'Arrived') {
      waitlist.disableArrivedbtn = true;
    }
    this.provider_shared_functions.changeWaitlistStatus(this, waitlist, action, 'appt');
  }
  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.section_cancel = [];
          this.section_complete = [];
          this.section_start = [];
          this.section_future = [];
          this.section_history = [];
          this.section_new = [];
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
    this.resetLabelFilter();
    this.filterapplied = false;
    this.loadApiSwitch('doSearch');
    this.setFilterDateMaxMin();
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
    if (this.open_filter) {
      this.setFilterdobMaxMin();
    }
  }
  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.time_type === 1) {
      if (this.selQId) {
        api_filter['schedule-eq'] = this.selQId;
      }
      if (this.token && this.time_type === 1) {
        api_filter['token-eq'] = this.token;
      }
    } else if (this.filter.queue !== 'all') {
      api_filter['schedule-eq'] = this.filter.queue;
    }
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNo-eq'] = this.filter.phone_number;
    }
    if (this.filter.service !== 'all') {
      api_filter['service-eq'] = this.filter.service;
    }
    if (this.statusMultiCtrl.length > 0) {
      api_filter['apptStatus-eq'] = this.statusMultiCtrl.join(',');
    }
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.dateformat.transformTofilterDate(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.dateformat.transformTofilterDate(this.filter.check_in_end_date);
      }
      if (this.filter.futurecheckin_date != null && this.time_type === 2) {
        api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.futurecheckin_date);
      }
    }
    if (this.time_type !== 2) {
      if (this.labelFilterData !== '') {
        api_filter['label-eq'] = this.labelFilterData;
      }
    }
    if (this.time_type === 3) {
      if (this.filter.payment_status !== 'all') {
        api_filter['paymentStatus-eq'] = this.filter.payment_status;
      }
      if (this.filter.age !== '') {
        const kids = moment(new Date()).add(-12, 'year').format('YYYY-MM-DD');
        const adults = moment(new Date()).add(-60, 'year').format('YYYY-MM-DD');
        if (this.filter.age === 'kids') {
          api_filter['dob-ge'] = kids;
        } else if (this.filter.age === 'adults') {
          api_filter['dob-le'] = kids;
          api_filter['dob-ge'] = adults;
        } else if (this.filter.age === 'senior') {
          api_filter['dob-le'] = adults;
        }
      }
      if (this.filter.gender !== '') {
        api_filter['gender-eq'] = this.filter.gender;
      }
    }
    // if (this.selected_location && this.selected_location.id) {
    //   api_filter['location-eq'] = this.selected_location.id;
    // }
    return api_filter;
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  doSearch() {
    this.labelSelection();
    this.shared_functions.setitemToGroupStorage('futureDate', this.dateformat.transformTofilterDate(this.filter.futurecheckin_date));
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.service !== 'all' ||
      this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.age || this.filter.gender || this.labelMultiCtrl || this.statusMultiCtrl.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.loadApiSwitch('doSearch');
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      queue: false,
      service: false,
      waitlist_status: false,
      payment_status: false,
      check_in_start_date: false,
      check_in_end_date: false,
      location_id: false,
      age: false,
      gender: false
    };
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
      page: 0,
      futurecheckin_date: null,
      age: '',
      gender: ''
    };
    this.statusMultiCtrl = [];
  }
  addProviderNote(source, waitlist?) {
    let checkin;
    if (source === 'history' || source === 'future') {
      checkin = waitlist;
    } else {
      checkin = this.selectedCheckin[source];
    }
    this.addnotedialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: checkin.uid,
        source: 'appt'
      }
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') { }
    });
  }

  addConsumerInboxMessage(source, waitlst?) {
    let waitlist = [];
    if (source === 'new') {
      waitlist = this.newWaitlistforMsg;
    } else if (source === 'started') {
      waitlist = this.startedWaitlistforMsg;
    } else if (source === 'completed') {
      waitlist = this.completedWaitlistforMsg;
    } else if (source === 'cancelled') {
      waitlist = this.cancelledWaitlistforMsg;
    } else if (source === 'single') {
      waitlist.push(waitlst);
    }
    this.provider_shared_functions.addConsumerInboxMessage(waitlist, this, 'appt')
      .then(
        () => { },
        () => { }
      );
  }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }
  getDomainSubdomainSettings() {
    const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    return new Promise((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
        .subscribe(
          (data: any) => {
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
        this.provider_services.editWaitTime(this.check_in_list[i].uid, esttime).subscribe(
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
  isCheckinActive() {
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
    if (this.isCheckin || this.isCheckin === 0 || this.isCheckin > 3) {
      if (this.isCheckin === 0 || this.isCheckin > 3) {
        return true;
      } else {
        this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
        return false;
      }
    } else {
      this.provider_services.getBussinessProfile()
        .subscribe(
          data => {
            this.isCheckin = this.provider_shared_functions.getProfileStatusCode(data);
            this.shared_functions.setitemToGroupStorage('isCheckin', this.isCheckin);
            if (this.isCheckin === 0) {
              return true;
            } else {
              this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
              return false;
            }
          },
          () => {
          }
        );
    }
  }

  openActionsWindow(type, index, status?) {
    switch (type) {
      case 'new':
        switch (status) {
          case 'new':
            this.section_new[index] = !this.section_new[index];
            break;
          case 'start':
            this.section_start[index] = !this.section_start[index];
            break;
          case 'complete':
            this.section_complete[index] = !this.section_complete[index];
            break;
          case 'cancel':
            this.section_cancel[index] = !this.section_cancel[index];
            break;
        }
        break;
      case 'future':
        this.section_future[index] = !this.section_future[index];
        break;
      case 'history':
        this.section_history[index] = !this.section_history[index];
        break;
    }
  }
  printCheckin(source) {
    const checkinlist = this.selectedCheckin[source];
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    let checkin_html = '';
    checkin_html += '<div style="width:400px; height:100px; border:1px solid #ddd; ">';
    checkin_html += '<div style="float: left; width:100px; height:100px;font-size:1.5rem;background: #eee;">';
    checkin_html += '<div style="padding-top:30px;text-align:center">#' + checkinlist.token + '</div>';
    checkin_html += '</div>';
    checkin_html += '<div style="float:left;height:100px;font-weight:500">';
    checkin_html += '<div style="padding-top:5px;padding-left:5px">';
    checkin_html += checkinlist.appmtFor[0].firstName + ' ' + checkinlist.appmtFor[0].lastName;
    checkin_html += '</div>';
    checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
    checkin_html += this.bname + ' / ' + checkinlist.service.name;
    checkin_html += '</div>';
    checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
    checkin_html += checkinlist.date + ' ' + checkinlist.appmtTime;
    checkin_html += '</div>';
    checkin_html += '</div>';
    checkin_html += '</div>';
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(checkin_html);
    printWindow.document.write('</body></html>');
    printWindow.moveTo(0, 0);
    printWindow.print();
  }

  printHistoryCheckin() {
    const Mfilter = this.setFilterForApi();
    const promise = this.getHistoryAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getHistoryAppointments(Mfilter)
          .subscribe(
            data => {
              this.historyCheckins = data;
              const params = [
                'height=' + screen.height,
                'width=' + screen.width,
                'fullscreen=yes'
              ].join(',');
              const printWindow = window.open('', '', params);
              let checkin_html = '';
              checkin_html += '<table width="100%" style="border: 1px solid #dbdbdb;">';
              checkin_html += '<td style="padding:10px;">Sl.No.</td>';
              checkin_html += '<td style="padding:10px;">Date & Time</td>';
              checkin_html += '<td style="padding:10px;">Name</td>';
              checkin_html += '<td style="padding:10px;">Service</td>';
              checkin_html += '<td style="padding:10px;">Label</td>';
              checkin_html += '</thead>';
              for (let i = 0; i < this.historyCheckins.length; i++) {
                checkin_html += '<tr style="line-height:20px;padding:10px">';
                checkin_html += '<td style="padding:10px">' + (this.historyCheckins.indexOf(this.historyCheckins[i]) + 1) + '</td>';
                checkin_html += '<td style="padding:10px">' + moment(this.historyCheckins[i].date).format(projectConstants.DISPLAY_DATE_FORMAT) + ' ' + this.historyCheckins[i].appmtTime + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].appmtFor[0].firstName + ' ' + this.historyCheckins[i].appmtFor[0].lastName + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].service.name + '</td>';
                const labels = [];
                checkin_html += '<td style="padding:10px">' + labels.toString() + '</td></tr>';
              }
              checkin_html += '</table>';
              checkin_html += '<div style="margin:10px">';
              // checkin_html += '<div style="padding-bottom:10px;">' + 'Total - ' + result + ' Records</div>';
              if (!this.labelFilterData.match('$') && this.labelsCount.length > 1) {
                for (const count of this.labelsCount) {
                  checkin_html += '<div style="padding-bottom:10px;">' + count + ' Records</div>';
                }
              }
              checkin_html += '</div>';
              printWindow.document.write('<html><head><title></title>');
              printWindow.document.write('</head><body >');
              printWindow.document.write(checkin_html);
              printWindow.document.write('</body></html>');
              printWindow.moveTo(0, 0);
              printWindow.print();
              printWindow.document.close();
              setTimeout(() => {
                printWindow.close();
              }, 500);
            });
      });
  }

  filterbyStatus(status) {
    this.filterStatus = false;
    if (this.showStausFilters[status]) {
      this.showStausFilters[status] = false;
    } else {
      this.showStausFilters[status] = true;
    }
    if (!this.showStausFilters['checkedIn'] && !this.showStausFilters['started'] && !this.showStausFilters['complete'] && !this.showStausFilters['cancelled']) {
      this.filterStatus = true;
    }
    this.filter.waitlist_status = status;
    if (status === 'checkedIn') {
      this.newPanel = true;
    }
    if (status === 'started') {
      this.startedPanel = true;
    }
    if (status === 'complete') {
      this.completedPanel = true;
    }
    if (status === 'cancelled') {
      this.cancelledPanel = true;
    }
  }
  locateCustomer(source) {
    const waitlistData = this.selectedCheckin[source];
    this.provider_services.getCustomerTrackStatus(waitlistData.uid).subscribe(data => {
      this.trackDetail = data;
      this.customerMsg = this.locateCustomerMsg(this.trackDetail);
      this.locateCustomerdialogRef = this.dialog.open(LocateCustomerComponent, {
        width: '40%',
        panelClass: ['popup-class', 'locatecustomer-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          message: this.customerMsg
        }
      });
      this.locateCustomerdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
        }
      });
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  waitlistStatusClick(status) {
    if (!this.showstatus[status]) {
      this.showstatus[status] = true;
    } else {
      this.showstatus[status] = false;
      this.resetAll();
    }
  }
  resetAll() {
    this.waitlistSelected = [];
    this.startedwaitlistSelected = [];
    this.cancelledwaitlistSelected = [];
    this.completedwaitlistSelected = [];
    this.waitlistSelection = 0;
    this.startedwaitlistSelection = 0;
    this.cancelledwaitlistSelection = 0;
    this.completedwaitlistSelection = 0;
    this.selectedCheckin = [];
    this.newWaitlistforMsg = [];
    this.startedWaitlistforMsg = [];
    this.completedWaitlistforMsg = [];
    this.cancelledWaitlistforMsg = [];
  }
  setSortByParam(sortBy) {
    this.sortBy = sortBy;
    this.shared_functions.setitemToGroupStorage('sortBy', this.sortBy);
    this.getTodayAppointments();
  }
  callingWaitlist(checkin) {
    const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setCallStatus(checkin.uid, status).subscribe(
      () => {
        this.loadApiSwitch('reloadAPIs');
      });
  }

  /**
   * Router Navigations
   */
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  gotoCustomViews() {
    this.router.navigate(['provider', 'settings', 'general', 'customview']);
  }
  apptClicked(time?) {
    let slot = '';
    if (time) {
      slot = time;
    }
    this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], { queryParams: { timeslot: slot } });
  }
  searchCustomer(source, appttime) {
    this.router.navigate(['provider', 'customers', 'find'], { queryParams: { appt: true } });
  }
  showAdjustDelay() {
    if (this.queues.length === 0 || !this.selQId) {
      this.shared_functions.openSnackBar('Delay can be applied only for active queues', { 'panelClass': 'snackbarerror' });
      return false;
    } else {
      this.router.navigate(['provider', 'check-ins', 'adjustdelay']);
    }
  }
  applyLabel(checkin) {
    this.router.navigate(['provider', 'check-ins', checkin.uid, 'add-label'], { queryParams: checkin.label });
  }
  goCheckinDetail(checkin) {
    if (this.time_type === 3) {
      this.shared_functions.setitemToGroupStorage('appthP', this.filter.page || 1);
      this.shared_functions.setitemToGroupStorage('appthPFil', this.filter);
    }
    this.router.navigate(['provider', 'appointments', checkin.uid]);
  }
  viewBillPage(source, checkin?) {
    let checkin_details;
    if (source === 'history' || source === 'future') {
      checkin_details = checkin;
    } else {
      checkin_details = this.selectedCheckin[source];
    }
    this.provider_services.getWaitlistBill(checkin_details.uid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', checkin_details.uid], { queryParams: { source: 'appt' } });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  learnmore_clicked(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/appointments']);
    }
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
    } else if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/appointments']);
    }
  }
  isQueueSelected(qId) {
    if (this.time_type === 3) {
      if (this.selQidsforHistory.indexOf(qId) !== -1) {
        return true;
      }
      return false;
    } else {
      if (this.selQId === qId) {
        return true;
      }
      return false;
    }
  }
  viewQClicked(q) {
    if (this.time_type === 3) {
      const qindx = this.selQidsforHistory.indexOf(q.id);
      if (qindx !== -1) {
        if (this.selQidsforHistory.length === 1) {
          return false;
        }
        this.selQidsforHistory.splice(qindx, 1);
      } else {
        this.selQidsforHistory.push(q.id);
      }
    } else {
      if (this.selQId === q.id) {
        return false;
      } else {
        this.selQId = q.id;
        this.servicesCount = q.services.length;
        this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      }
    }
    this.reloadAPIs();
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  isvalid(evt) {
    if (evt.keyCode === 13) {
      this.doSearch();
    }
    return this.shared_functions.isValid(evt);
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) { input.focus(); }
  }
  focusInputSp(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) { this.doSearch(); }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }
  getViews() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getCustomViewList().subscribe(data => {
        resolve(data);
      }, error => {
        reject();
      });
    });
  }
  onChangeLocationSelect(event) {
    const value = event;
    this.changeLocation(this.locations[value] || []);
  }
  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }
    return (selected_location !== null) ? selected_location : this.locations[0];
  }
  selectLocationFromCookies(cookie_location_id) {
    this.changeSelectedLocation(this.selectLocationFromCookie(cookie_location_id));
  }
  changeSelectedLocation(location) {
    this.selected_location = location;
    if (this.selected_location) {
      this.shared_functions.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    this.shared_functions.setitemToGroupStorage('loc_id', this.selected_location);
  }
  routeLoadIndicator(e) {
    this.apiloading = e;
  }
  closeCounters() {
    if (this.cronHandle) { this.cronHandle.unsubscribe(); }
  }
  getLocationList() {
    const self = this;
    return new Promise(function (resolve, reject) {
      self.selected_location = null;
      self.provider_services.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                self.locations.push(loc);
              }
            }
            const cookie_location_id = self.shared_functions.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
            if (cookie_location_id === '') {
              if (self.locations[0]) {
                self.changeLocation(self.locations[0]);
              }
            } else {
              self.selectLocationFromCookies(parseInt(cookie_location_id, 10));
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
  getDepartments() {
    this.provider_services.getDepartments().subscribe(
      data => {
        this.departments = data['departments'];
      },
      error => { }
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
  sortCheckins(checkins) {
    checkins.sort(function (message1, message2) {
      if (message1.token > message2.token) {
        return 11;
      } else if (message1.token < message2.token) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  locateCustomerMsg(details) {
    if (details && details.jaldeeDistance) {
      const distance = details.jaldeeDistance.distance;
      const unit = projectConstants.LIVETRACK_CONST[details.jaldeeDistance.unit];
      const travelTime = details.jaldeelTravelTime.travelTime;
      const hours = Math.floor(travelTime / 60);
      const mode = details.jaldeelTravelTime.travelMode;
      const minutes = travelTime % 60;
      return this.provider_shared_functions.getLiveTrackMessage(distance, unit, hours, minutes, mode);
    }
  }
  /**
   * Labels Section
   */
  resetLabelFilter() {
    this.labelMultiCtrl = [];
    this.labelFilter = [];
    this.labelFilterData = '';
  }
  labelClick(status) {
    this.showLabels[status] = true;
  }
  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe(data => {
      this.providerLabels = data;
    });
  }
  getDisplayname(label) {
    for (let i = 0; i < this.providerLabels.length; i++) {
      if (this.providerLabels[i].label === label) {
        return this.providerLabels[i].displayName;
      }
    }
  }
  labelfilterClicked(index, label) {
    delete this.labelMultiCtrl[label];
    this.labelFilter[index] = !this.labelFilter[index];
    if (!this.labelFilter[index]) {
      this.doSearch();
    }
  }
  labelSelection() {
    this.labelFilterData = '';
    this.labelsCount = [];
    let count = 0;
    Object.keys(this.labelMultiCtrl).forEach(key => {
      if (this.labelMultiCtrl[key].length > 0) {
        count++;
        if (!this.labelFilterData.includes(key)) {
          const labelvalues = this.labelMultiCtrl[key].join(',');
          const labelvaluesArray = labelvalues.split(',');
          for (const value of labelvaluesArray) {
            const lblFilter = key + '::' + value;
            const Mfilter = this.setFilterForApi();
            Mfilter['label-eq'] = lblFilter;
            const promise = this.getHistoryAppointmentsCount(Mfilter);
            promise.then(
              result => {
                if (this.labelsCount.indexOf(value + ' - ' + result) === -1) {
                  this.labelsCount.push(value + ' - ' + result);
                }
              });
          }
          if (count === 1) {
            this.labelFilterData = this.labelFilterData + key + '::' + this.labelMultiCtrl[key].join(',');
          } else {
            this.labelFilterData = this.labelFilterData + '$' + key + '::' + this.labelMultiCtrl[key].join(',');
          }
        }
      } else {
        delete this.labelMultiCtrl[key];
      }
    });
  }
  labels(checkin) {
    for (let i = 0; i < this.providerLabels.length; i++) {
      for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
        this.providerLabels[i].valueSet[j].selected = false;
      }
    }
    setTimeout(() => {
      const values = [];
      if (checkin.label) {
        for (const value of Object.values(checkin.label)) {
          values.push(value);
        }
        for (let i = 0; i < this.providerLabels.length; i++) {
          for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
            for (let k = 0; k < values.length; k++) {
              if (this.providerLabels[i].valueSet[j].value === values[k]) {
                this.providerLabels[i].valueSet[j].selected = true;
              }
            }
          }
        }
      }
    }, 100);
  }
  addLabel() {
    this.provider_services.addLabeltoAppointment(this.checkinId, this.labelMap).subscribe(data => {
      this.getTodayAppointments();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  deleteLabel(label) {
    this.provider_services.deleteLabelfromAppointment(this.checkinId, label).subscribe(data => {
      this.getTodayAppointments();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  changeLabelvalue(status, labelname, value) {
    this.showLabels[status] = false;
    const checkin = this.selectedCheckin[status];
    this.checkinId = checkin.uid;
    this.labelMap = new Object();
    this.labelMap[labelname] = value;
    for (let i = 0; i < this.providerLabels.length; i++) {
      for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
        if (this.providerLabels[i].valueSet[j].value === value) {
          if (!this.providerLabels[i].valueSet[j].selected) {
            this.providerLabels[i].valueSet[j].selected = true;
            this.addLabel();
          } else {
            this.providerLabels[i].valueSet[j].selected = false;
            this.deleteLabel(labelname);
          }
        } else {
          if (this.providerLabels[i].label === labelname) {
            this.providerLabels[i].valueSet[j].selected = false;
          }
        }
      }
    }
  }
  addLabelvalue(status, source, label?) {
    const checkin = this.selectedCheckin[status];
    this.checkinId = this.selectedCheckin[status].uid;
    this.labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: checkin,
        source: source,
        label: label
      }
    });
    this.labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
        setTimeout(() => {
          this.labels(this.selectedCheckin[status]);
          this.labelMap = new Object();
          this.labelMap[data.label] = data.value;
          this.addLabel();
          this.getDisplayname(data.label);
          this.getTodayAppointments();
        }, 500);
      }
      this.getLabel();
    });
  }

  /**
   * Filter Actions
   */
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'check_in_start_date' || type === 'check_in_end_date') {
        this.filter[type] = null;
      } else if (type === 'payment_status' || type === 'service' || type === 'queue') {
        this.filter[type] = 'all';
      } else if (type === 'waitlist_status') {
        this.statusMultiCtrl = [];
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
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
  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
    this.shared_functions.removeitemfromLocalStorage('appthP');
    this.shared_functions.removeitemfromLocalStorage('appthPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.shared_functions.setitemToGroupStorage('appthP', pg);
    this.shared_functions.setitemToGroupStorage('appthPFil', this.filter);
    this.doSearch();
  }

  /**
   * Selection of waitlist types
   */
  selectnewWaitlist(slot, index, waitlist) {
    this.newWaitlistforMsg = [];
    if (this.waitlistSelected[slot][index]) {
      delete this.waitlistSelected[slot][index];
      this.waitlistSelection--;
    } else {
      this.waitlistSelected[slot][index] = true;
      this.waitlistSelection++;
    }
    if (this.waitlistSelection === 1) {
      this.selectedCheckin['new'] = waitlist;
      if (this.selectedCheckin['new'].jaldeeWaitlistDistanceTime && this.selectedCheckin['new'].jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.selectedCheckin['new'].jaldeeStartTimeType === 'ONEHOUR' || this.selectedCheckin['new'].jaldeeStartTimeType === 'AFTERSTART')) {
        this.consumerTrackstatus = true;
      } else {
        this.consumerTrackstatus = false;
      }
      this.labels(this.selectedCheckin['new']);
    }
    for (let i = 0; i < this.waitlistSelected[slot].length; i++) {
      if (this.waitlistSelected[slot][i]) {
        if (this.newWaitlistforMsg.indexOf(this.timeSlotCheckins[slot][i]) === -1) {
          this.newWaitlistforMsg.push(this.timeSlotCheckins[slot][i]);
        }
      }
    }
  }

  selectcompletedWaitlist(index) {
    this.completedWaitlistforMsg = [];
    if (this.completedwaitlistSelected[index]) {
      delete this.completedwaitlistSelected[index];
      this.completedwaitlistSelection--;
    } else {
      this.completedwaitlistSelected[index] = true;
      this.completedwaitlistSelection++;
    }
    if (this.completedwaitlistSelection === 1) {
      this.selectedCheckin['completed'] = this.completed_checkins_list[this.completedwaitlistSelected.indexOf(true)];
      this.labels(this.selectedCheckin['completed']);
    }
    for (let i = 0; i < this.completedwaitlistSelected.length; i++) {
      if (this.completedwaitlistSelected[i]) {
        if (this.completedWaitlistforMsg.indexOf(this.completed_checkins_list[i]) === -1) {
          this.completedWaitlistforMsg.push(this.completed_checkins_list[i]);
        }
      }
    }
  }

  selectcancelledWaitlist(index) {
    this.cancelledWaitlistforMsg = [];
    if (this.cancelledwaitlistSelected[index]) {
      delete this.cancelledwaitlistSelected[index];
      this.cancelledwaitlistSelection--;
    } else {
      this.cancelledwaitlistSelected[index] = true;
      this.cancelledwaitlistSelection++;
    }
    if (this.cancelledwaitlistSelection === 1) {
      this.selectedCheckin['cancelled'] = this.cancelled_checkins_list[this.cancelledwaitlistSelected.indexOf(true)];
      this.labels(this.selectedCheckin['cancelled']);
    }
    for (let i = 0; i < this.cancelledwaitlistSelected.length; i++) {
      if (this.cancelledwaitlistSelected[i]) {
        if (this.cancelledWaitlistforMsg.indexOf(this.cancelled_checkins_list[i]) === -1) {
          this.cancelledWaitlistforMsg.push(this.cancelled_checkins_list[i]);
        }
      }
    }
  }

  selectstartedWaitlist(index) {
    this.startedWaitlistforMsg = [];
    if (this.startedwaitlistSelected[index]) {
      delete this.startedwaitlistSelected[index];
      this.startedwaitlistSelection--;
    } else {
      this.startedwaitlistSelected[index] = true;
      this.startedwaitlistSelection++;
    }
    if (this.startedwaitlistSelection === 1) {
      this.selectedCheckin['started'] = this.started_checkins_list[this.startedwaitlistSelected.indexOf(true)];
      this.labels(this.selectedCheckin['started']);
    }
    for (let i = 0; i < this.startedwaitlistSelected.length; i++) {
      if (this.startedwaitlistSelected[i]) {
        if (this.startedWaitlistforMsg.indexOf(this.started_checkins_list[i]) === -1) {
          this.startedWaitlistforMsg.push(this.started_checkins_list[i]);
        }
      }
    }
  }
  findCurrentActiveQueue(ques) {
    let selindx = 0;
    const cday = new Date();
    const currentday = (cday.getDay() + 1);
    const curtime = cday.getHours() + ':' + cday.getMinutes() + ':00';
    let stime;
    let etime;
    const tday = cday.getFullYear() + '-' + (cday.getMonth() + 1) + '-' + cday.getDate();
    const curtimeforchk = new Date(tday + ' ' + curtime);
    for (let i = 0; i < ques.length; i++) {
      for (let j = 0; j < ques[i].queueSchedule.repeatIntervals.length; j++) {
        const pday = Number(ques[i].queueSchedule.repeatIntervals[j]);
        if (currentday === pday) {
          stime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].queueSchedule.timeSlots[0].sTime));
          etime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].queueSchedule.timeSlots[0].eTime));
          if ((curtimeforchk.getTime() >= stime.getTime()) && (curtimeforchk.getTime() <= etime.getTime())) {
            selindx = i;
          }
        }
      }
    }
    return selindx;
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
    if (this.shared_functions.getitemFromGroupStorage('futureDate') && this.dateformat.transformTofilterDate(this.shared_functions.getitemFromGroupStorage('futureDate')) > this.dateformat.transformTofilterDate(servdate)) {
      this.filter.futurecheckin_date = new Date(this.shared_functions.getitemFromGroupStorage('futureDate'));
    } else {
      this.filter.futurecheckin_date = moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD');
    }
  }
  /**
   * Actions
   */
  countApiCall() {
    // if (this.shared_functions.getitemfromLocalStorage('pdq') !== 'null') {
    //   this.getTodayAppointmentsCount();
    // }
    // this.getHistoryAppointmentsCount();
    // this.getFutureAppointmentsCount();
  }
}
