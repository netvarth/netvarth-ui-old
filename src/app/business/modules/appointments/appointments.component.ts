import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import * as moment from 'moment';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { ApplyLabelComponent } from '../check-ins/apply-label/apply-label.component';
import { MatDialog } from '@angular/material';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { CallingModesComponent } from '../check-ins/calling-modes/calling-modes.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { LocateCustomerComponent } from '../check-ins/locate-customer/locate-customer.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewInit {
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
  check_in_statuses_filter = projectConstants.APPT_STATUSES_FILTER;
  future_check_in_statuses_filter = projectConstants.FUTURE_APPT_STATUSES_FILTER;
  apis_loaded = false;
  carouselOne;
  breadcrumb_moreoptions: any = [];
  breadcrumbs_init = [{ title: 'Appointments' }];
  breadcrumbs = this.breadcrumbs_init;
  screenWidth;
  small_device_display = false;
  selected_location = null;
  server_date;
  selectedView: any;
  isBatch = false;
  statusAction = 'new';
  todayAppointments = [];
  futureAppointments = [];
  time_type = 1;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    appointmentMode: 'all',
    queue: 'all',
    service: 'all',
    appt_status: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    future_appt_date: null,
    age: '',
    gender: ''
  }; // same in resetFilter Fn
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    appointmentMode: false,
    queue: false,
    service: false,
    appt_status: false,
    payment_status: false,
    check_in_start_date: false,
    check_in_end_date: false,
    location_id: false,
    age: false,
    gender: false
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  availableSlotDetails: any = [];
  selQId;
  timeSlotAppts: any = [];
  statusMultiCtrl: any = [];
  appt_list: any = [];
  filterapplied = false;
  noFilter = true;
  today_waitlist_count: any = 0;
  future_waitlist_count: any = 0;
  history_waitlist_count: any = 0;
  today_checkins_count = 0;
  today_arrived_count = 0;
  today_started_count = 0;
  today_completed_count = 0;
  today_cancelled_count = 0;
  today_rejected_count = 0;
  today_cancelled_checkins_count = 0;
  today_checkedin_count = 0;
  scheduled_count = 0;
  started_count = 0;
  cancelled_count = 0;
  completed_count = 0;
  labelFilterData = '';
  token;
  servicesCount;
  selQCapacity = 0;
  locations: any = [];
  labelMultiCtrl: any = [];
  views: any = [];
  viewsList: any = [];
  schedules: any = [];
  activeSchedules: any = [];
  selQidsforHistory: any = [];
  board_count = 0;
  tomorrowDate;
  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = new Date();
  filter_dob_start_min = null;
  filter_dob_start_max = null;
  filter_dob_end_min = null;
  filter_dob_end_max = null;
  open_filter = false;
  status_type = 'all';
  checkinId;
  providerLabels: any = [];
  labelsCount: any = [];
  selectedAppt: any = [];
  labelFilter: any = [];
  showLabels = true;
  labelMap;
  labeldialogRef;
  slotsChecked: any = {};
  slotSelected: any = {};
  apptsChecked: any = {};
  appsAllChecked: any = {};
  slotsAllChecked: any = {};
  rowLevelSelectAll: any = [];
  chkSlotInput: any = [];
  appointmentsChecked: any = [];
  chkAppointments: any = [];
  chkSelectAppointments = false;
  activeAppointment: any;
  apptSingleSelection = false;
  apptMultiSelection = false;
  apptMainCheck;
  selAllSlots = false;
  check_in_filtered_list: any = [];
  active_user;
  domain;
  account_type;
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
  no_history = '';
  no_started_checkin_msg = '';
  no_completed_checkin_msg = '';
  no_cancelled_checkin_msg = '';
  cust_note_tooltip;
  appt_status = [];
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'Refund', value: 'Refund' }
  ];
  appointmentModes = [
    { mode: 'WALK_IN_APPOINTMENT', value: 'Walk in Appointment' },
    { mode: 'PHONE_IN_APPOINTMENT', value: 'Phone Appointment' },
    { mode: 'ONLINE_APPOINTMENT', value: 'Online Appointment' },
  ];
  notedialogRef;
  addnotedialogRef;
  locateCustomerdialogRef;
  trackDetail: any = [];
  customerMsg = '';
  delayTooltip = this.shared_functions.getProjectMesssages('ADJUSTDELAY_TOOPTIP');
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  cloudTooltip = this.shared_functions.getProjectMesssages('CLOUDICON_TOOPTIP');
  tooltipcls = projectConstants.TOOLTIP_CLS;
  qr_value;
  path = projectConstants.PATH;
  showQR = false;
  bname = '';
  gnr_link = 2;
  loading = true;
  showArrived = false;
  pos = false;
  showRejected = false;
  historyCheckins: any = [];
  apiloading = false;
  showSlotsN = false;
  slotsForQ: any = [];
  constructor(private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private provider_services: ProviderServices,
    private router: Router,
    private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions) {
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
    this.no_started_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_STRTED_CHECKIN_MSG);
    this.no_completed_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_COMPLETED_CHECKIN_MSG);
    this.no_cancelled_checkin_msg = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_CANCELLED_CHECKIN_MSG);
    this.no_history = this.shared_functions.removeTerminologyTerm('waitlist', Messages.NO_HISTORY_MSG);
    this.appt_status = [
      { name: this.checkedin_upper, value: 'checkedIn' },
      { name: this.cancelled_upper, value: 'cancelled' },
      { name: this.started_upper, value: 'started' },
      { name: this.arrived_upper, value: 'Arrived' },
      { name: this.done_upper, value: 'complete' }];
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  ngOnInit() {
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'appointments',
      'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
    };
    const savedtype = this.shared_functions.getitemFromGroupStorage('apptType');
    if (savedtype !== undefined && savedtype !== null) {
      this.time_type = savedtype;
    }
    this.setSystemDate();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
      this.getTomorrowDate();
    }
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.account_type = this.active_user.accountType;
    this.domain = this.active_user.sector;
    this.cust_note_tooltip = Messages.CUST_NOT_TOOLTIP.replace('[customer]', this.customer_label);
    this.getPos();
    this.getLabel();
    this.getDisplayboardCount();
    this.getLocationList();
  }
  initViews(schedules, source?) {
    const _this = this;
    this.views = [];
    return new Promise(function (resolve, reject) {
      const tempView = {};
      tempView['name'] = 'Default';
      tempView['id'] = 0;
      tempView['customViewConditions'] = {};
      tempView['customViewConditions'].schedules = schedules;
      _this.selectedView = tempView;
      _this.getViews().then(
        (data: any) => {
          const appointmentViewList = data;
          for (let i = 0; i < appointmentViewList.length; i++) {
            if (appointmentViewList[i].type === 'Appointment') {
              _this.views.push(appointmentViewList[i]);
            }
          }
          _this.views.push(tempView);
          let selected_view;
          if (source  === 'changeLocation') {
          } else {
            selected_view = _this.shared_functions.getitemFromGroupStorage('appt-selectedView');
          }
          if (selected_view) {
            const viewFilter = _this.views.filter(view => view.id === selected_view.id);
            if (viewFilter.length !== 0) {
              _this.selectedView = _this.shared_functions.getitemFromGroupStorage('appt-selectedView');
            } else {
              _this.selectedView = tempView;
              _this.shared_functions.setitemToGroupStorage('appt-selectedView', _this.selectedView);
            }
          } else {
            _this.selectedView = tempView;
            _this.shared_functions.setitemToGroupStorage('appt-selectedView', _this.selectedView);
          }
          resolve(_this.selectedView);
        },
        error => {
          _this.views.push(tempView);
          resolve(_this.selectedView);
        }
      );
    });
  }
  refresh() {
    if (this.time_type === 1) {
      this.getTodayAppointments();
    }
    if (this.time_type === 2) {
      this.getFutureAppointments();
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
      this.shared_functions.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
    } else {
      if (this.selQId === q.id) {
        return false;
      } else {
        this.selQId = q.id;
        this.servicesCount = q.services.length;
        this.selQCapacity = q.parallelServing;
        if (this.selQCapacity > 1) {
          this.isBatch = true;
        } else {
          this.isBatch = false;
        }
        if (this.time_type === 2) {
          this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
        } else {
          this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
        }
      }
    }
    this.loadApiSwitch('reloadAPIs');
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.shared_functions.setitemonLocalStorage('sysdate', res);
        });
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit() {
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
        mouseDrag: false,
        touchDrag: true,
        pullDrag: false,
        loop: false,
        autoWidth: true
      };
    });
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    let displayboards: any = [];
    this.provider_services.getDisplayboardsAppointment()
      .subscribe(
        data => {
          displayboards = data;
          layout_list = displayboards.filter(displayboard => !displayboard.isContainer);
          this.board_count = layout_list.length;
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
  learnmore_clicked(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/appointments']);
    }
  }
  showAdjustDelay() {
    // if (this.queues.length === 0 || !this.selQId) {
    //   this.shared_functions.openSnackBar('Delay can be applied only for active schedules', { 'panelClass': 'snackbarerror' });
    //   return false;
    // } else {
    this.router.navigate(['provider', 'appointments', 'adjustdelay']);
    // }
  }
  performActions(action) {
    if (action === 'adjustdelay') {
      this.showAdjustDelay();
    } else if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/appointments']);
    }
  }
  getSchedules(date?) {
    const _this = this;
    if (date === 'all') {
      const filterEnum = {
        'location-eq': this.selected_location.id
      };
      return new Promise((resolve) => {
        _this.provider_services.getProviderSchedules(filterEnum).subscribe(
          (schedules: any) => {
            resolve(schedules);
          });
      });
    }
  }
  getSchedulesFromView(view, schedules) {
    const qs = [];
    if (view && view.name !== 'Default') {
      for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < view.customViewConditions.schedules.length; j++) {
          if (schedules[i].id === view.customViewConditions.schedules[j].id) {
            qs.push(schedules[i]);
          }
        }
      }
    } else {
      return schedules;
    }
    return qs;
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
    this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
      (schedules: any) => {
        this.initViews(schedules, '').then(
          (view) => {
            this.initView(view, 'changeLocation');
          }
        );
      }
    );
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
                self.locationSelected(self.locations[0]).then(
                  (schedules: any) => {
                    this.initViews(schedules, 'changeLocation').then(
                      (view) => {
                        this.initView(view, 'changeLocation');
                      }
                    );
                  }
                );
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
  getQIdsFromView (view) {
    const qIds = [];
    if (view.customViewConditions.schedules && view.customViewConditions.schedules.length > 0) {
      for (let i = 0; i < view.customViewConditions.schedules.length; i++) {
        qIds.push(view.customViewConditions.schedules[i]['id']);
      }
    }
    return qIds;
  }
  initView(view, source?) {
    this.activeSchedules = [];
    const groupbyQs = this.shared_functions.groupBy(this.getSchedulesFromView(view, this.schedules), 'apptState');
    if (groupbyQs['ENABLED'] && groupbyQs['ENABLED'].length > 0) {
      this.activeSchedules = groupbyQs['ENABLED'];
    }
    if (groupbyQs['DISABLED'] && groupbyQs['DISABLED'].length > 0) {
      this.activeSchedules = this.activeSchedules.concat(groupbyQs['DISABLED']);
    }
    if (this.time_type === 2 && this.shared_functions.getitemFromGroupStorage('appt_future_selQ')) {
      this.selQId = this.shared_functions.getitemFromGroupStorage('appt_future_selQ');
      const selQdetails = this.activeSchedules.filter(q => q.id === this.selQId);
      if (selQdetails.length > 0) {
        this.servicesCount = selQdetails[0].services.length;
        this.selQCapacity = this.activeSchedules[0].parallelServing;
        if (this.selQCapacity > 1) {
          this.isBatch = true;
        } else {
          this.isBatch = false;
        }
      } else if (this.activeSchedules.length > 0) {
        const selQ = this.activeSchedules[0];
        this.selQId = selQ.id;
        this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
        this.servicesCount = selQ.services.length;
        this.selQCapacity = selQ.parallelServing;
        if (this.selQCapacity > 1) {
          this.isBatch = true;
        } else {
          this.isBatch = false;
        }
      }
    } else if (this.time_type === 1 && this.shared_functions.getitemFromGroupStorage('appt_selQ')) {
      this.selQId = this.shared_functions.getitemFromGroupStorage('appt_selQ');
      const selQdetails = this.activeSchedules.filter(q => q.id === this.selQId);
      if (selQdetails && selQdetails.length !== 0) {
        this.servicesCount = selQdetails[0].services.length;
        this.selQCapacity = this.activeSchedules[0].parallelServing;
        if (this.selQCapacity > 1) {
          this.isBatch = true;
        } else {
          this.isBatch = false;
        }
      } else if (this.activeSchedules.length > 0) {
        const selQ = this.activeSchedules[0];
        this.selQId = selQ.id;
        this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
        this.servicesCount = selQ.services.length;
        this.selQCapacity = selQ.parallelServing;
        if (this.selQCapacity > 1) {
          this.isBatch = true;
        } else {
          this.isBatch = false;
        }
      } else {
        this.isBatch = false;
      }
    } else if (this.activeSchedules.length > 0) {
    // if (this.shared_functions.getitemFromGroupStorage('appt_history_selQ') && this.shared_functions.getitemFromGroupStorage('appt_history_selQ').length !== 0) {
    //   this.selQidsforHistory = this.shared_functions.getitemFromGroupStorage('appt_history_selQ');
    // } else {
    // }
      if (this.time_type === 3) {
        const qIds = this.getQIdsFromView(view);
        this.selQidsforHistory = qIds;
       this.shared_functions.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
      }
      this.selQId = this.findCurrentActiveQueue(this.activeSchedules);
      // this.selQId = this.activeSchedules[0].id;
      this.servicesCount = this.activeSchedules[0].services.length;
      this.selQCapacity = this.activeSchedules[0].parallelServing;
      if (this.selQCapacity > 1) {
        this.isBatch = true;
      } else {
        this.isBatch = false;
      }
      if (this.time_type === 1) {
        this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      }
      if (this.time_type === 2) {
        this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
      }
    }
    this.loadApiSwitch(source);
  }
  resetAll() {
    // this.apptSelected = [];
    // this.apptSelection = 0;
    this.selectedAppt = [];
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      appointmentMode: false,
      queue: false,
      service: false,
      appt_status: false,
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
      appointmentMode: 'all',
      queue: 'all',
      service: 'all',
      appt_status: 'all',
      payment_status: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      location_id: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 0,
      future_appt_date: null,
      age: '',
      gender: ''
    };
    this.statusMultiCtrl = [];
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
    // this.resetAll();
    this.resetCheckList();
    let chkSrc = true;
    this.loading = true;
    if (source === 'changeLocation' && this.time_type === 3) {
      const hisPage = this.shared_functions.getitemFromGroupStorage('appthP');
      const hFilter = this.shared_functions.getitemFromGroupStorage('appthPFil');
      if (hisPage) {
        this.filter = hFilter;
        this.pagination.startpageval = hisPage;
        this.shared_functions.removeitemFromGroupStorage('appthP');
        this.shared_functions.removeitemFromGroupStorage('appthPFil');
        chkSrc = false;
      }
    } else {
      this.shared_functions.removeitemFromGroupStorage('appthP');
      this.shared_functions.removeitemFromGroupStorage('appthPFil');
    }
    if (chkSrc) {
      if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
        this.resetFilter();
        this.resetLabelFilter();
      }
    }
    switch (this.time_type) {
      case 1: this.getTodayAppointments();
        break;
      case 2: this.getFutureAppointments();
        break;
      case 3: this.getHistoryAppointments();
        break;
    }
    this.getCounts();
  }
  setTimeType(time_type) {
    this.statusMultiCtrl = [];
    this.resetCheckList();
    if (time_type === 2) {
      this.getTomorrowDate();
      if (this.statusAction === 'completed' || this.statusAction === 'started') {
        this.statusAction = 'new';
      }
    }
    if (this.open_filter === true) {
      this.toggleFilter();
    }
    this.appt_list = this.check_in_filtered_list = [];
    this.time_type = time_type;
    this.shared_functions.setitemToGroupStorage('apptType', this.time_type);
    if (time_type !== 3) {
      this.resetPaginationData();
    } else {
      const selectedView = this.shared_functions.getitemFromGroupStorage('appt-selectedView');
      console.log(this.getQIdsFromView(selectedView));
      this.selQidsforHistory = this.getQIdsFromView(selectedView);
      this.shared_functions.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
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
  toggleFilter() {
    this.open_filter = !this.open_filter;
    if (this.open_filter) {
      this.setFilterdobMaxMin();
    }
  }
  setFilterdobMaxMin() {
    this.filter_dob_start_max = new Date();
    this.filter_dob_end_max = new Date();
  }
  setFilterDateMaxMin() {
    this.filter_date_start_min = null;
    this.filter_date_start_max = null;
    this.filter_date_end_min = null;
    this.filter_date_end_max = null;
    if (this.time_type === 0) {
      this.filter_date_start_max = moment(new Date()).add(-1, 'days');
      // this.filter_date_end_max = moment(new Date()).add(-1, 'days');
    } else if (this.time_type === 2) {
      this.filter_date_start_min = moment(new Date()).add(+1, 'days');
      this.filter_date_end_min = moment(new Date()).add(+1, 'days');
    }
  }
  getCounts() {
    this.today_waitlist_count = 0;
    this.history_waitlist_count = 0;
    if (this.time_type !== 2) {
      this.future_waitlist_count = 0;
      this.getFutureAppointmentsCount()
        .then(
          (result) => {
            this.future_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 3) {
      this.getHistoryAppointmentsCount()
        .then(
          (result) => {
            this.history_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 1) {
      this.getTodayAppointmentsCount()
        .then(
          (result) => {
            this.today_waitlist_count = result;
          }
        );
    }
  }
  getActiveAppointments(appointments, status) {
    if (status === 'new') {
      return this.getScheduledAppointment(appointments);
    } else if (status === 'started') {
      return this.getStartedAppointment(appointments);
    } else if (status === 'completed') {
      return this.getCompletedAppointment(appointments);
    } else {
      return this.getCancelledAppointment(appointments);
    }
  }
  getScheduledAppointment(appointments) {
    let scheduledList = [];
    if (appointments['Confirmed']) {
      scheduledList = appointments['Confirmed'].slice();
    }
    if (appointments['Arrived']) {
      Array.prototype.push.apply(scheduledList, appointments['Arrived'].slice());
    }
    this.sortCheckins(scheduledList);
    return scheduledList;
  }
  getCancelledAppointment(appointments) {
    let cancelledList = [];
    if (appointments['Cancelled']) {
      cancelledList = appointments['Cancelled'].slice();
    }
    if (appointments['Rejected']) {
      Array.prototype.push.apply(cancelledList, appointments['Rejected'].slice());
    }
    return cancelledList;
  }
  getStartedAppointment(appointments) {
    let startedList = [];
    if (appointments['Started']) {
      startedList = appointments['Started'].slice();
    }
    return startedList;
  }
  getCompletedAppointment(appointments) {
    let completedList = [];
    if (appointments['Completed']) {
      completedList = appointments['Completed'].slice();
    }
    if (appointments['Settled']) {
      Array.prototype.push.apply(completedList, appointments['Settled'].slice());
    }
    return completedList;
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
  sortQsByStatus(queues) {
    queues.sort(function (queue1, queue2) {
      return queue1.apptState - queue2.apptState;
    });
  }
  getAppointmentsPerSlot(appointments) {
    let date;
    if (this.time_type === 1) {
      date = this.shared_functions.transformToYMDFormat(this.server_date);
    }
    if (this.time_type === 2) {
      date = this.shared_functions.transformToYMDFormat(this.filter.future_appt_date);
    }
    if (this.selQId && date) {
      this.provider_services.getAppointmentSlotsByDate(this.selQId, date).subscribe(data => {
        this.availableSlotDetails = data;
        this.timeSlotAppts = this.shared_functions.groupBy(appointments, 'appmtTime');
        // this.loading = false;
      });
    }
  }
  /**
   * @param action Scheduled/Started/Cancelled/Completed
   * @param type Today/Future/History
   */
  viewStatusFilterBtnClicked(action, type) {
    this.statusAction = action;
    // this.loading = true;
    this.resetCheckList();
    if (action === 'new') {
      if (type === 1) {
        if (!this.isBatch) {
          this.check_in_filtered_list = this.getScheduledAppointment(this.todayAppointments);
        } else {
          this.getAppointmentsPerSlot(this.getScheduledAppointment(this.todayAppointments));
        }
      } else {
        if (!this.isBatch) {
          this.check_in_filtered_list = this.getScheduledAppointment(this.futureAppointments);
          // this.loading = false;
        } else {
          this.getAppointmentsPerSlot(this.getScheduledAppointment(this.futureAppointments));
        }
      }
    } else if (action === 'started') {
      if (!this.isBatch) {
        this.check_in_filtered_list = this.getStartedAppointment(this.todayAppointments);
        // this.loading = false;
      } else {
        this.getAppointmentsPerSlot(this.getStartedAppointment(this.todayAppointments));
      }
    } else if (action === 'completed') {
      if (!this.isBatch) {
        this.check_in_filtered_list = this.getCompletedAppointment(this.todayAppointments);
        // this.loading = false;
      } else {
        this.getAppointmentsPerSlot(this.getCompletedAppointment(this.todayAppointments));
      }
    } else {
      if (type === 1) {
        if (!this.isBatch) {
          this.check_in_filtered_list = this.getCancelledAppointment(this.todayAppointments);
          // this.loading = false;
        } else {
          this.getAppointmentsPerSlot(this.getCancelledAppointment(this.todayAppointments));
        }
      } else {
        if (!this.isBatch) {
          this.check_in_filtered_list = this.getCancelledAppointment(this.futureAppointments);
          // this.loading = false;
        } else {
          this.getAppointmentsPerSlot(this.getCancelledAppointment(this.futureAppointments));
        }
      }
    }
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
    this.scheduled_count = this.today_checkins_count;
    this.started_count = this.today_started_count;
    this.completed_count = this.today_completed_count;
    this.cancelled_count = this.today_cancelled_checkins_count;
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_checkins_count;
  }
  getTodayAppointmentsCount(Mfilter = null) {
    const queueid = this.shared_functions.getitemFromGroupStorage('appt_selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid) {
        Mfilter['schedule-eq'] = queueid;
      }
      Mfilter['apptStatus-neq'] = 'prepaymentPending';
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
  getFutureAppointmentsCount(Mfilter = null) {
    let no_filter = false;
    const queueid = this.shared_functions.getitemFromGroupStorage('appt_future_selQ');
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid) {
        Mfilter['schedule-eq'] = queueid;
      }
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
    const queueid = this.shared_functions.getitemFromGroupStorage('appt_history_selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid && queueid.length > 0) {
        Mfilter['schedule-eq'] = queueid.toString();
      }
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
  resetCheckList() {
    this.availableSlotDetails = {};
    this.timeSlotAppts = {};
    this.slotsChecked = {};
    this.apptsChecked = {};
    this.chkSlotInput = {};
    this.selectedAppt = [];
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
  }
  getTodayAppointments() {
    const Mfilter = this.setFilterForApi();
    let selQs;
    if (this.shared_functions.getitemFromGroupStorage('appt_selQ')) {
      this.selQId = this.shared_functions.getitemFromGroupStorage('appt_selQ');
      selQs = this.activeSchedules.filter(q => q.id === this.selQId);
    }
    if (selQs && selQs.length > 0) {
      this.selQId = selQs[0].id;
      this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      this.servicesCount = selQs[0].services.length;
      this.selQCapacity = selQs[0].parallelServing;
      if (this.selQCapacity > 1) {
        this.isBatch = true;
      } else {
        this.isBatch = false;
      }
    } else if (this.activeSchedules.length > 0) {
      this.selQId = this.activeSchedules[0].id;
      this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      this.servicesCount = this.activeSchedules[0].services.length;
      this.selQCapacity = this.activeSchedules[0].parallelServing;
      if (this.selQCapacity > 1) {
        this.isBatch = true;
      } else {
        this.isBatch = false;
      }
    }
    if (this.selQId) {
      Mfilter['schedule-eq'] = this.selQId;
      const qs = [];
      qs.push(this.selQId);
      this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      this.shared_functions.setitemToGroupStorage('appt_history_selQ', qs);
      this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
    }
    this.resetPaginationData();
    this.pagination.startpageval = 1;
    this.pagination.totalCnt = 0; // no need of pagination in today
    console.log(Mfilter);
    const promise = this.getTodayAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getTodayAppointments(Mfilter)
          .subscribe(
            (data: any) => {
              this.appt_list = data;
              this.todayAppointments = this.shared_functions.groupBy(this.appt_list, 'apptStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              this.setCounts(this.appt_list);
              if (this.isBatch) {
                this.resetCheckList();
                this.getAppointmentsPerSlot(this.getActiveAppointments(this.todayAppointments, this.statusAction));
              } else {
                this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
              }
              // this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
            },
            () => {
              this.loading = false;
            });
      });
  }
  setFutureCounts(appointments) {
    this.scheduled_count = this.getActiveAppointments(appointments, 'new').length;
    this.cancelled_count = this.getActiveAppointments(appointments, 'cancelled').length;
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
    if (this.shared_functions.getitemFromGroupStorage('futureDate') && this.shared_functions.transformToYMDFormat(this.shared_functions.getitemFromGroupStorage('futureDate')) > this.shared_functions.transformToYMDFormat(servdate)) {
      this.filter.future_appt_date = new Date(this.shared_functions.getitemFromGroupStorage('futureDate'));
    } else {
      this.filter.future_appt_date = moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD');
    }
  }
  getFutureAppointments() {
    this.resetCheckList();
    // this.loading = true;
    if (this.filter.future_appt_date === null) {
      this.getTomorrowDate();
    }
    this.shared_functions.setitemToGroupStorage('futureDate', this.shared_functions.transformToYMDFormat(this.filter.future_appt_date));
    const date = this.shared_functions.transformToYMDFormat(this.filter.future_appt_date);
    let selQs = [];
    if (this.shared_functions.getitemFromGroupStorage('appt_future_selQ')) {
      this.selQId = this.shared_functions.getitemFromGroupStorage('appt_future_selQ');
       selQs = this.activeSchedules.filter(q => q.id === this.selQId);
    }
    if (selQs.length > 0) {
      this.selQId = selQs[0].id;
      this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
      this.servicesCount = selQs[0].services.length;
      this.selQCapacity = selQs[0].parallelServing;
      if (this.selQCapacity > 1) {
        this.isBatch = true;
      } else {
        this.isBatch = false;
      }
    } else if (this.activeSchedules.length > 0) {
      this.selQId = this.activeSchedules[0].id;
      this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
      this.servicesCount = this.activeSchedules[0].services.length;
      this.selQCapacity = this.activeSchedules[0].parallelServing;
      if (this.selQCapacity > 1) {
        this.isBatch = true;
      } else {
        this.isBatch = false;
      }
    }
    // this.load_waitlist = 0;
    let Mfilter = this.setFilterForApi();
    if (this.selQId) {
      Mfilter['schedule-eq'] = this.selQId;
      const qs = [];
      qs.push(this.selQId);
      this.shared_functions.setitemToGroupStorage('appt_selQ', this.selQId);
      this.shared_functions.setitemToGroupStorage('appt_history_selQ', qs);
      this.shared_functions.setitemToGroupStorage('appt_future_selQ', this.selQId);
    }
    const promise = this.getFutureAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);
        this.provider_services.getFutureAppointments(Mfilter)
          .subscribe(
            data => {
              this.futureAppointments = this.shared_functions.groupBy(data, 'apptStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              if (this.selQId) {
                if (!this.isBatch) {
                  this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, this.statusAction);
                } else {
                  this.getAppointmentsPerSlot(this.getActiveAppointments(this.futureAppointments, this.statusAction));
                }
                this.setFutureCounts(this.futureAppointments);
              }
              // this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
            },
            () => {
              this.loading = false;
            });
      });
  }
  getHistoryAppointments() {
    let Mfilter = this.setFilterForApi();
    if (this.selQidsforHistory.length !== 0) {
      Mfilter['schedule-eq'] = this.selQidsforHistory.toString();
    }
    const promise = this.getHistoryAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);
        this.appointmentsChecked = {};
        this.chkAppointments = {};
        this.chkSelectAppointments = false;
        this.setApptSelections();
        this.provider_services.getHistoryAppointments(Mfilter)
          .subscribe(
            data => {
              // this.new_checkins_list = [];
              this.appt_list = this.check_in_filtered_list = data;
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              // this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
            },
            () => {
              this.loading = false;
            });
      }
    );
  }
  setApptSelections() {
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.activeAppointment = null;
    const totalAppointmentsSelected = Object.keys(this.appointmentsChecked).length;
    if (totalAppointmentsSelected === this.check_in_filtered_list.length && totalAppointmentsSelected !== 0) {
      this.chkSelectAppointments = true;
    }
    if (totalAppointmentsSelected === 1) {
      this.apptSingleSelection = true;
      Object.keys(this.appointmentsChecked).forEach(key => {
        this.activeAppointment = this.appointmentsChecked[key];
      });
    } else if (totalAppointmentsSelected > 1) {
      this.apptMultiSelection = true;
    }
  }
  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
    this.shared_functions.removeitemFromGroupStorage('appthP');
    this.shared_functions.removeitemFromGroupStorage('appthPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.shared_functions.setitemToGroupStorage('appthP', pg);
    this.shared_functions.setitemToGroupStorage('appthPFil', this.filter);
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
    }
    // else if (this.filter.queue !== 'all') {
    //   api_filter['schedule-eq'] = this.filter.queue;
    // }
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
    if (this.filter.appointmentMode !== 'all') {
      api_filter['appointmentMode-eq'] = this.filter.appointmentMode;
    }
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.shared_functions.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.shared_functions.transformToYMDFormat(this.filter.check_in_end_date);
      }
      if (this.filter.future_appt_date != null && this.time_type === 2) {
        api_filter['date-eq'] = this.shared_functions.transformToYMDFormat(this.filter.future_appt_date);
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
    if (this.selected_location && this.selected_location.id) {
      api_filter['location-eq'] = this.selected_location.id;
    }
    return api_filter;
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  doSearch() {
    this.labelSelection();
    // this.shared_functions.setitemToGroupStorage('futureDate', this.shared_functions.transformToYMDFormat(this.filter.future_appt_date));
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.service !== 'all' ||
      this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.appointmentMode !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.age || this.filter.gender || this.labelMultiCtrl || this.statusMultiCtrl.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.loadApiSwitch('doSearch');
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.shared_functions.convert24HourtoAmPm(slots[0]);
  }
  isAvailableSlot(slot) {
    if (slot.noOfAvailbleSlots === '0' || !slot.active) {
      return true;
    }
    return false;
  }
  apptClicked(type, time?) {
    if (this.schedules.length === 0) {
      this.shared_functions.openSnackBar('No active schedules', { 'panelClass': 'snackbarerror' });
    } else {
      let slot = '';
      if (time) {
        slot = time;
      }
      this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], { queryParams: { timeslot: slot, scheduleId: this.selQId, checkinType: type } });
    }
  }
  searchCustomer(source, appttime) {
    this.router.navigate(['provider', 'customers', 'add'], { queryParams: { appt: true } });
  }
  /**
   * Labels Section
   */
  resetLabelFilter() {
    this.labelMultiCtrl = [];
    this.labelFilter = [];
    this.labelFilterData = '';
  }
  labelClick() {
    this.showLabels = true;
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
  addLabel(checkinId) {
    this.provider_services.addLabeltoAppointment(checkinId, this.labelMap).subscribe(data => {
      this.loadApiSwitch('');
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  deleteLabel(label, checkinId) {
    this.provider_services.deleteLabelfromAppointment(checkinId, label).subscribe(data => {
      this.loadApiSwitch('');
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  changeLabelvalue(labelname, value) {
    this.showLabels = false;
    const _this = this;
    const appts = [];
    if (!this.isBatch || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        appts.push(_this.appointmentsChecked[apptIndex]);
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          appts.push(_this.apptsChecked[slotIndex][apptIndex]);
        });
      });
    }
    if (appts.length === 1) {
      this.labelMap = new Object();
      this.labelMap[labelname] = value;
      for (let i = 0; i < this.providerLabels.length; i++) {
        for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
          if (this.providerLabels[i].valueSet[j].value === value) {
            if (!this.providerLabels[i].valueSet[j].selected) {
              this.providerLabels[i].valueSet[j].selected = true;
              this.addLabel(appts[0].uid);
            } else {
              this.providerLabels[i].valueSet[j].selected = false;
              this.deleteLabel(labelname, appts[0].uid);
            }
          } else {
            if (this.providerLabels[i].label === labelname) {
              this.providerLabels[i].valueSet[j].selected = false;
            }
          }
        }
      }
    }
  }
  getSelectedAppointments(isBatch, appointments, time_type) {
    const keylen = Object.keys(appointments).length;
    let count = 0;
    const appts = [];
    return new Promise(function (resolve, reject) {
      if (!isBatch || time_type === 3) {
        Object.keys(appointments).forEach(apptIndex => {
          appts.push(appointments[apptIndex]);
          count++;
        });
      } else {
        Object.keys(appointments).forEach(slotIndex => {
          Object.keys(appointments[slotIndex]).forEach(apptIndex => {
            appts.push(appointments[slotIndex][apptIndex]);
            count++;
          });
        });
      }
      if (count === keylen) {
        resolve(appts);
      }
    });
  }
  addLabelvalue(source, label?) {
    const _this = this;
    const appts = [];
    if (!this.isBatch) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        appts.push(_this.appointmentsChecked[apptIndex]);
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          appts.push(_this.apptsChecked[slotIndex][apptIndex]);
        });
      });
    }
    this.labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: appts[0],
        source: source,
        label: label
      }
    });
    this.labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
        setTimeout(() => {
          this.labels(appts[0]);
          this.labelMap = new Object();
          this.labelMap[data.label] = data.value;
          this.addLabel(appts[0].uid);
          this.getDisplayname(data.label);
          this.loadApiSwitch('');
        }, 500);
      }
      this.getLabel();
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
  applyLabel(checkin) {
    this.router.navigate(['provider', 'check-ins', checkin.uid, 'add-label'], { queryParams: checkin.label });
  }
  /**
   * Filter Actions
   */
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'check_in_start_date' || type === 'check_in_end_date') {
        this.filter[type] = null;
      } else if (type === 'payment_status' || type === 'service' || type === 'queue' || type === 'appointmentMode') {
        this.filter[type] = 'all';
      } else if (type === 'appt_status') {
        this.statusMultiCtrl = [];
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
  }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }
  // filterbyStatus(status) {
  //   this.filterStatus = false;
  //   if (this.showStausFilters[status]) {
  //     this.showStausFilters[status] = false;
  //   } else {
  //     this.showStausFilters[status] = true;
  //   }
  //   if (!this.showStausFilters['checkedIn'] && !this.showStausFilters['started'] && !this.showStausFilters['complete'] && !this.showStausFilters['cancelled']) {
  //     this.filterStatus = true;
  //   }
  //   this.filter.appt_status = status;
  //   if (status === 'checkedIn') {
  //     this.newPanel = true;
  //   }
  //   if (status === 'started') {
  //     this.startedPanel = true;
  //   }
  //   if (status === 'complete') {
  //     this.completedPanel = true;
  //   }
  //   if (status === 'cancelled') {
  //     this.cancelledPanel = true;
  //   }
  // }
  selectAllSlots() {
    if (!this.selAllSlots) {
      for (let sIndex = 0; sIndex < this.availableSlotDetails.availableSlots.length; sIndex++) {
        const availableTime = this.availableSlotDetails.availableSlots[sIndex].time;
        if (this.timeSlotAppts[availableTime] && this.timeSlotAppts[availableTime].length > 0) {
          this.slotsChecked[sIndex] = true;
          this.chkSlotInput[sIndex] = true;
          this.slotCheckSelected(sIndex, this.availableSlotDetails.availableSlots[sIndex]);
        }
      }
    } else {
      this.slotsChecked = {};
      this.apptsChecked = {};
    }
  }
  slotRowSelected(slotIndex) {
    if (!this.slotSelected[slotIndex]) {
      this.slotSelected[slotIndex] = true;
    } else {
      this.slotSelected[slotIndex] = false;
    }
  }
  slotCheckSelected(slotIndex, slot) {
    if (this.chkSlotInput[slotIndex]) {
      this.slotsChecked[slotIndex] = true;
      if (!this.apptsChecked[slotIndex]) {
        this.apptsChecked[slotIndex] = {};
      }
      const slotApptLength = this.timeSlotAppts[slot.time].length;
      for (let aptIndex = 0; aptIndex < slotApptLength; aptIndex++) {
        if (!this.apptsChecked[slotIndex][aptIndex]) {
          this.apptsChecked[slotIndex][aptIndex] = this.timeSlotAppts[slot.time][aptIndex];
        }
      }
      this.checkAllSlotsSelected();
    } else {
      this.slotsChecked[slotIndex] = false;
      delete this.apptsChecked[slotIndex];
      this.selAllSlots = false;
    }
    this.setSelections();
  }
  checkAllSlotsSelected() {
    let notfound = false;
    for (let sIndex = 0; sIndex < this.availableSlotDetails.availableSlots.length; sIndex++) {
      const availableTime = this.availableSlotDetails.availableSlots[sIndex].time;
      if (this.timeSlotAppts[availableTime] && this.timeSlotAppts[availableTime].length > 0) {
        for (let slIndex = 0; slIndex < this.timeSlotAppts[availableTime].length; slIndex++) {
          if (!this.slotsChecked[sIndex]) {
            notfound = true;
            break;
          }
        }
      }
      if (notfound) {
        break;
      }
    }
    if (notfound) {
      this.selAllSlots = false;
    } else {
      this.selAllSlots = true;
    }
  }
  setSelections() {
    const selLength = Object.keys(this.apptsChecked).length;
    if (selLength === 0) {
      this.apptSingleSelection = false;
      this.apptMultiSelection = false;
    } else if (selLength === 1) {
      Object.keys(this.apptsChecked).forEach(key => {
        if (Object.keys(this.apptsChecked[key]).length === 1) {
          this.apptMultiSelection = false;
          this.apptSingleSelection = true;
          return;
        } else {
          this.apptMultiSelection = true;
          this.apptSingleSelection = false;
        }
      });
    } else {
      this.apptMultiSelection = true;
      this.apptSingleSelection = false;
    }
  }
  apptRowSelected(slotIndex, apptIndex, appt, slotName) {
    if (!this.apptsChecked[slotIndex]) {
      this.apptsChecked[slotIndex] = {};
    }
    if (!this.apptsChecked[slotIndex][apptIndex]) {
      this.apptsChecked[slotIndex][apptIndex] = appt;
      if (appt.apptStatus === 'Confirmed' && !appt.virtualService) {
        this.showArrived = true;
      }
      if (appt.billStatus && appt.billStatus === 'Settled') {
        this.showRejected = false;
      }
      if (Object.keys(this.apptsChecked[slotIndex]).length === this.timeSlotAppts[slotName].length) {
        this.slotsChecked[slotIndex] = true;
      }
      this.checkAllSlotsSelected();
    } else {
      delete this.apptsChecked[slotIndex][apptIndex];
      if (Object.keys(this.apptsChecked[slotIndex]).length === 0) {
        delete this.apptsChecked[slotIndex];
      }
      this.slotsChecked[slotIndex] = false;
      this.selAllSlots = false;
      this.showArrived = false;
      this.showRejected = true;
    }
    this.setSelections();
  }
  selectAllAppoinments() {
    this.appointmentsChecked = {};
    this.chkAppointments = {};
    if (this.chkSelectAppointments) {
      for (let aIndex = 0; aIndex < this.check_in_filtered_list.length; aIndex++) {
        this.chkAptHistoryClicked(aIndex, this.check_in_filtered_list[aIndex]);
      }
    } else {
      this.apptSingleSelection = false;
      this.apptMultiSelection = false;
      this.activeAppointment = null;
    }
  }
  chkAptHistoryClicked(index, appt) {
    if (!this.chkAppointments[index]) {
      this.chkAppointments[index] = true;
      this.appointmentsChecked[index] = appt;
    } else {
      this.chkAppointments[index] = false;
      delete this.appointmentsChecked[index];
      this.chkSelectAppointments = false;
    }
    this.setApptSelections();
  }
  getAppxTime(appt) {
    return this.shared_functions.providerConvertMinutesToHourMinute(appt.appxWaitingTime);
  }
  clearFilter() {
    this.resetFilter();
    this.resetLabelFilter();
    this.filterapplied = false;
    this.loadApiSwitch('doSearch');
    this.setFilterDateMaxMin();
  }
  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
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
  addConsumerInboxMessage() {
    const _this = this;
    const appts = [];
    if (!this.isBatch  || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        appts.push(_this.appointmentsChecked[apptIndex]);
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          appts.push(_this.apptsChecked[slotIndex][apptIndex]);
        });
      });
    }
    _this.provider_shared_functions.addConsumerInboxMessage(appts, this, 'appt')
      .then(
        () => { },
        () => { }
      );
  }
  changeApptStatusByBatch(action, batchId) {
    const post_data = {
      date: new Date()
    };
    this.provider_services.changeAppointmentStatusByBatch(batchId, action, post_data).subscribe(
      () => {
        this.refresh();
      }, (error) => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  changeWaitlistStatus(action, appt?) {
    const _this = this;
    let appmt;
    if (appt) {
      appmt = appt;
    } else {
      if (!this.isBatch  || this.time_type === 3) {
        Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
          appmt = _this.appointmentsChecked[apptIndex];
        });
      } else {
        Object.keys(_this.apptsChecked).forEach(slotIndex => {
          Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
            appmt = _this.apptsChecked[slotIndex][apptIndex];
          });
        });
      }
    }
    _this.provider_shared_functions.changeWaitlistStatus(_this, appmt, action, 'appt');
  }
  showCallingModes(action) {
    const _this = this;
    let checkin;
    _this.changeWaitlistStatus(action);
    Object.keys(_this.apptsChecked).forEach(slotIndex => {
      Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
        checkin = _this.apptsChecked[slotIndex][apptIndex];
      });
    });
    _this.provider_shared_functions.changeWaitlistStatus(_this, checkin, action, 'appt');
    _this.notedialogRef = _this.dialog.open(CallingModesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        modes: checkin.virtualService,
        uuid: checkin.uid,
        consumerid: checkin.consumer.id,
        qdata: checkin,
        type: 'appt'
      }
    });
    _this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  goCheckinDetail(checkin) {
    if (this.time_type === 3) {
      this.shared_functions.setitemToGroupStorage('appthP', this.filter.page || 1);
      this.shared_functions.setitemToGroupStorage('appthPFil', this.filter);
    }
    this.router.navigate(['provider', 'appointments', checkin.uid]);
  }
  goToCheckinDetails() {
    const _this = this;
    if (!this.isBatch || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        const checkin = _this.appointmentsChecked[apptIndex];
        _this.router.navigate(['provider', 'appointments', checkin.uid]);
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          const checkin = _this.apptsChecked[slotIndex][apptIndex];
          _this.router.navigate(['provider', 'appointments', checkin.uid]);
        });
      });
    }
  }
  addProviderNote(source, waitlist?) {
    const _this = this;
    let checkin;
    if (!this.isBatch  || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        checkin = _this.appointmentsChecked[apptIndex];
        _this.addnotedialogRef = _this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            checkin_id: checkin.uid,
            source: 'appt'
          }
        });
        _this.addnotedialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') { }
        });
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          checkin = _this.apptsChecked[slotIndex][apptIndex];
          _this.addnotedialogRef = _this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
              checkin_id: checkin.uid,
              source: 'appt'
            }
          });
          _this.addnotedialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') { }
          });
        });
      });
    }
  }
  getVirtualServiceCount(virtualService) {
    return Object.keys(virtualService).length;
  }
  generateLink(modes) {
    this.notedialogRef = this.dialog.open(CallingModesComponent, {
      width: '20%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        modes: modes.virtualService,
        uuid: modes.uid,
        linkValue: this.gnr_link,
        qdata: modes,
        type: 'appt'
      }
    });
    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  smsAppt() {
    const _this = this;
    if (!this.isBatch  || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        _this.provider_services.smsAppt(_this.appointmentsChecked[apptIndex].uid).subscribe(
          () => {
            _this.shared_functions.openSnackBar('Appointment details sent successfully');
          },
          error => {
            _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          _this.provider_services.smsAppt(_this.apptsChecked[slotIndex][apptIndex].uid).subscribe(
            () => {
              _this.shared_functions.openSnackBar('Appointment details sent successfully');
            },
            error => {
              _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
        });
      });
    }
  }
  emailAppt() {
    const _this = this;
    if (!this.isBatch  || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        _this.provider_services.emailAppt(_this.appointmentsChecked[apptIndex].uid).subscribe(
          () => {
            _this.shared_functions.openSnackBar('Appointment details sent successfully');
          },
          error => {
            _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          this.provider_services.emailAppt(_this.apptsChecked[slotIndex][apptIndex].uid).subscribe(
            () => {
              _this.shared_functions.openSnackBar('Appointment details mailed successfully');
            },
            error => {
              _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
        });
      });
    }
  }
  printAppt() {
    const _this = this;
    let appt;
    if (!this.isBatch  || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        appt = _this.appointmentsChecked[apptIndex];
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          appt = _this.apptsChecked[slotIndex][apptIndex];
        });
      });
    }
    this.printBill(appt);
  }
  printBill(apptlist) {
    const _this = this;
    _this.qrCodegeneration(apptlist);
    setTimeout(() => {
      const printContent = document.getElementById('print-section');
      const params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes'
      ].join(',');
      const printWindow = window.open('', '', params);
      let checkin_html = '';
      checkin_html += '<div style="width:100%;height:280px;border:1px solid #ddd;display:flex ">';
      checkin_html += '<div style="width:65%;">';
      checkin_html += '<div style="float: left; width:150px; height:280px;font-size:1.5rem;background-color: #eee;text-align: center;">';
      checkin_html += '<div style="margin-top:90px">' + _this.shared_functions.transformToYMDFormat(apptlist.appmtDate) + '</div>';
      checkin_html += '<div style="margin-top:10px">' + apptlist.appmtTime + '</div>';
      checkin_html += '</div>';
      checkin_html += '<div style="float:left;height:100px;font-weight:500;margin-left:5px">';
      checkin_html += '<h2 style="clear:both;padding-left:5px;text-align:center;">';
      checkin_html += _this.bname.charAt(0).toUpperCase() + _this.bname.substring(1);
      checkin_html += '<div style="clear:both;font-weight:500;font-size:0.95rem;padding:0px;margin:0px">';
      checkin_html += apptlist.location.place;
      checkin_html += '</div>';
      checkin_html += '</h2>';
      checkin_html += '<div style="padding-top:5px;padding-left:5px">';
      checkin_html += apptlist.appmtFor[0].firstName + ' ' + apptlist.appmtFor[0].lastName;
      checkin_html += '</div>';
      if (apptlist.service && apptlist.service.deptName) {
        checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
        checkin_html += '<span style="color: #999999">Department: </span>';
        checkin_html += '<span>' + apptlist.service.deptName + '</span>';
        checkin_html += '</div>';
      }
      checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
      checkin_html += '<span style="color: #999999">Service: </span>';
      checkin_html += '<span>' + apptlist.service.name + '</span>';
      checkin_html += '</div>';
      if (apptlist.provider && apptlist.provider.firstName && apptlist.provider.lastName) {
        checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
        checkin_html += '<span style="color: #999999">' + _this.provider_label + ': </span>';
        checkin_html += '<span>' + apptlist.provider.firstName.charAt(0).toUpperCase() + apptlist.provider.firstName.substring(1) + ' ' + apptlist.provider.lastName;
        checkin_html += '</span></div>';
      }
      checkin_html += '<div style="clear:both;padding-top:15px;padding-left:5px">';
      checkin_html += '<span style="color: #999999">Schedule: </span>';
      checkin_html += '<span>' + apptlist.schedule.name + ' [' + apptlist.schedule.apptSchedule.timeSlots[0].sTime + ' - ' + apptlist.schedule.apptSchedule.timeSlots[0].eTime + ']';
      checkin_html += '</span></div>';
      checkin_html += '</div>';
      checkin_html += '</div>';
      checkin_html += '<div style="margin-top:65px;width:35%">';
      checkin_html += '<div style="text-align:right;width:150px;height:150px">';
      checkin_html += printContent.innerHTML;
      checkin_html += '</div>';
      checkin_html += '<div>Scan to know your status or log on to ' + _this.qr_value + '</div>';
      checkin_html += '</div>';
      checkin_html += '</div>';
      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(checkin_html);
      printWindow.document.write('</body></html>');
      _this.showQR = false;
      printWindow.moveTo(0, 0);
      printWindow.print();
    });
  }
  viewBillPage() {
    const _this = this;
    let checkin_details;
    if (!this.isBatch || this.time_type === 3) {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        checkin_details = _this.appointmentsChecked[apptIndex];
        _this.provider_services.getWaitlistBill(checkin_details.uid).subscribe(
          () => {
            _this.router.navigate(['provider', 'bill', checkin_details.uid], { queryParams: { source: 'appt' } });
          },
          error => {
            _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
      });
    } else {
      Object.keys(_this.apptsChecked).forEach(slotIndex => {
        Object.keys(_this.apptsChecked[slotIndex]).forEach(apptIndex => {
          checkin_details = _this.apptsChecked[slotIndex][apptIndex];
          _this.provider_services.getWaitlistBill(_this.apptsChecked[slotIndex][apptIndex].uid).subscribe(
            () => {
              _this.router.navigate(['provider', 'bill', checkin_details.uid], { queryParams: { source: 'appt' } });
            },
            error => {
              _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
        });
      });
    }
  }
  qrCodegeneration(valuetogenerate) {
    this.qr_value = this.path + 'status/' + valuetogenerate.appointmentEncId;
    this.showQR = true;
  }
  showSlots() {
    this.showSlotsN = !this.showSlotsN;
    let date;
    this.slotsForQ = [];
    if (this.time_type === 1) {
      date = this.shared_functions.transformToYMDFormat(this.server_date);
    }
    if (this.time_type === 2) {
      date = this.shared_functions.transformToYMDFormat(this.filter.future_appt_date);
    }
    if (this.selQId && date) {
      this.provider_services.getAppointmentSlotsByDate(this.selQId, date).subscribe(
        (data: any) => {
        this.slotsForQ = data.availableSlots;
        console.log(this.slotsForQ);
      });
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
      for (let j = 0; j < ques[i].apptSchedule.repeatIntervals.length; j++) {
        const pday = Number(ques[i].apptSchedule.repeatIntervals[j]);
        if (currentday === pday) {
          stime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].apptSchedule.timeSlots[0].sTime));
          etime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].apptSchedule.timeSlots[0].eTime));
          if ((curtimeforchk.getTime() >= stime.getTime()) && (curtimeforchk.getTime() <= etime.getTime())) {
            selindx = i;
          }
        }
      }
    }
    return selindx;
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
  callingAppt(checkin) {
    const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setApptCallStatus(checkin.uid, status).subscribe(
      () => {
        this.loadApiSwitch('reloadAPIs');
      });
  }
  locateCustomer(source) {
    const waitlistData = this.selectedAppt[source];
    this.provider_services.getCustomerTrackStatusforAppointment(waitlistData.uid).subscribe(data => {
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
  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.loadApiSwitch(result);
        }
      );
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
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

  onChangeLocationSelect(event) {
    const value = event;
    this.clearApptIdsFromStorage();
    this.locationSelected(this.locations[value] || []).then(
      (schedules: any) => {
        this.initViews(schedules, 'changeLocation').then(
          (view) => {
            this.initView(view, 'changeLocation');
          }
        );
      }
    );
  }
  locationSelected(location) {
    this.selected_location = location;
    const _this = this;
    if (this.selected_location) {
      this.shared_functions.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    this.shared_functions.setitemToGroupStorage('loc_id', this.selected_location);
    return new Promise(function (resolve, reject) {
      _this.getSchedules('all').then(
        (queues: any) => {
          _this.schedules = queues;
          resolve(queues);
        },
        () => {
          resolve([]);
        }
      );
    });
  }
  handleViewSel(view) {
    this.shared_functions.setitemToGroupStorage('appt-selectedView', view);
    this.selectedView = view;
    this.initView(this.selectedView, 'reloadAPIs');

  }
  clearApptIdsFromStorage () {
    this.shared_functions.removeitemFromGroupStorage('appt_history_selQ');
    this.shared_functions.removeitemFromGroupStorage('appt_future_selQ');
    this.shared_functions.removeitemFromGroupStorage('appt_selQ');
     this.shared_functions.removeitemFromGroupStorage('appt-selectedView');
     this.resetPaginationData();
  }
}
