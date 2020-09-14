import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router, NavigationExtras, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import * as moment from 'moment';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { filter, pairwise } from 'rxjs/operators';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { MatDialog } from '@angular/material';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { KeyValue } from '@angular/common';
import { LocateCustomerComponent } from './locate-customer/locate-customer.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';
import { CheckinDetailsSendComponent } from './checkin-details-send/checkin-details-send.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from 'angular-modal-gallery';
import { interval as observableInterval, Subscription } from 'rxjs';

@Component({
  selector: 'app-checkins',
  templateUrl: './check-ins.component.html'
})
export class CheckInsComponent implements OnInit, OnDestroy, AfterViewInit {
  // pdtyp  --- 0-History, 1-Future, 2-Today
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
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  locations: any = [];
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    checkinEncId: '',
    queue: 'all',
    location: 'all',
    service: 'all',
    waitlist_status: 'all',
    waitlistMode: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    futurecheckin_date: null,
    age: 'all',
    gender: 'all'
  }; // same in resetFilter Fn
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    checkinEncId: false,
    queue: false,
    location: false,
    service: false,
    waitlist_status: false,
    payment_status: false,
    waitlistMode: false,
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
  selected_location = null;
  selected_location_index = null;
  selected_queue = null;
  time_type = 1;
  statusAction = 'new';
  screenWidth;
  small_device_display = false;
  waitlist_status = [];
  server_date;
  tomorrowDate;
  apis_loaded = false;
  carouselOne;
  account_type;
  active_user;
  domain;
  cust_note_tooltip;
  customerMsg = '';
  board_count = 0;
  open_filter = false;
  status_type = 'all';
  activeQs: any = [];
  tempActiveQs: any = [];
  selQidsforHistory: any = [];
  selQIds: any = [];
  selectedView: any;
  selectedUser: any;
  users: any = [];
  views: any = [];
  queues: any;
  loading = false;
  statusMultiCtrl: any = [];
  labelMultiCtrl: any = [];
  labelFilter: any = [];
  labelFilterData = '';
  labelsCount: any = [];
  qr_value;
  path = projectConstants.PATH;
  showQR = false;
  printContent;
  filterStatus = true;
  showTokenFilter = false;
  token;
  labelMap;
  label;
  showLabels = true;
  filter_sidebar = false;
  pos = false;
  filterapplied = false;
  providerLabels: any = [];
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
  selectedAppt: any = [];
  appt_list: any = [];
  check_in_filtered_list: any = [];
  todayAppointments = [];
  futureAppointments = [];
  appointmentsChecked: any = [];
  chkAppointments: any = [];
  chkSelectAppointments = false;
  activeAppointment: any;
  apptSingleSelection = false;
  apptMultiSelection = false;
  apptMainCheck;
  historyCheckins: any = [];
  bprofile: any = [];
  bname = '';
  isCheckin;
  returnedFromCheckDetails = false;
  calculationmode;
  showToken = false;
  services: any = [];
  departments: any = [];
  settings;
  addnotedialogRef;
  showArrived = false;
  showUndo = false;
  showRejected = false;
  apiloading = true;
  breadcrumbs_init = [];
  breadcrumb_moreoptions: any = [];
  apptModes: any = [];
  paymentStatuses: any = [];
  apptStatuses: any = [];
  ageGroups: any = [];
  allModeSelected = false;
  allPayStatusSelected = false;
  allApptStatusSelected = false;
  service_list: any = [];
  allServiceSelected = false;
  allQSelected = false;
  allLocationSelected = false;
  allGenderSlected = false;
  allAgeSlected = false;
  genderList: any = [];
  filterService: any = [];
  filterQ: any = [];
  filterLocation: any = [];
  consumr_id: any;
  notedialogRef: any;
  locateCustomerdialogRef;
  trackDetail: any = [];
  consumerTrackstatus = false;
  labeldialogRef;
  @ViewChild('chekinSection', { static: false }) chekinSection: ElementRef<HTMLElement>;
  windowScrolled: boolean;
  topHeight = 0;
  smsdialogRef: any;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  image_list_popup: Image[];
  image_list_popup_temp: Image[];
  imageAllowed = ['JPEG', 'JPG', 'PNG'];
  checkinStatus = false;
  locationExist = false;
  serviceExist = false;
  qExist = false;
  profileExist = false;
  message = '';
  message1 = '';
  showDashbard = true;
  tokenOrCheckin;
  refreshTime;
  cronHandle: Subscription;
  constructor(private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    public dateformat: DateFormatPipe,
    private dialog: MatDialog,
    public activateroute: ActivatedRoute,
    private router: Router) {
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

    this.activateroute.queryParams.subscribe(params => {
      if (params.servStatus) {
        this.statusAction = 'started';
      }
    });
  }
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'Refund', value: 'Refund' }
  ];
  waitlistModes = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in Check-in' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in Check-in' },
    { mode: 'ONLINE_CHECKIN', value: 'Online Check-in' },
  ];
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
  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    const header = document.getElementById('childActionBar');
    let qHeader = 0;
    let tabHeader = 0;
    if (document.getElementById('qHeader')) {
      qHeader = document.getElementById('qHeader').offsetHeight;
    }
    if (document.getElementById('tabHeader')) {
      tabHeader = document.getElementById('tabHeader').offsetHeight;
    }
    this.topHeight = qHeader + tabHeader;
    if (header) {
      if (window.pageYOffset > (this.topHeight + 50)) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }

    }
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  ngOnInit() {
    this.refreshTime = projectConstants.INBOX_REFRESH_TIME;
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'appointments',
      'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
    };
    this.setSystemDate();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
      this.getTomorrowDate();
    }
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.account_type = this.active_user.accountType;
    this.domain = this.active_user.sector;
    this.cust_note_tooltip = Messages.CUST_NOT_TOOLTIP.replace('[customer]', this.customer_label);
    this.getDisplayboardCount();
    this.getPos();
    this.getLabel();
    this.getDepartments();
    this.getProviders();
    this.getServiceList();
    this.image_list_popup_temp = [];
    const savedtype = this.shared_functions.getitemFromGroupStorage('pdtyp');
    if (savedtype !== undefined && savedtype !== null) {
      this.time_type = savedtype;
    }
    this.getLocationList().then(
      () => {
        this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
        this.router.events
          .pipe(filter((e: any) => e instanceof RoutesRecognized),
            pairwise()
          ).subscribe((e: any) => {
            this.returnedFromCheckDetails = (e[0].urlAfterRedirects.includes('/provider/check-ins/'));
          });
      }
    );
    this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
      this.refresh();
    });
  }

  getDepartments() {
    this.provider_services.getDepartments().subscribe(
      data => {
        this.departments = data['departments'];
      },
      error => { }
    );
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.calculationmode = this.settings.calculationMode;
        this.showToken = this.settings.showTokenId;
        if (this.showToken) {
          this.breadcrumbs_init = [{ title: 'Tokens' }];
          this.tokenOrCheckin = 'Tokens';
        } else {
          this.breadcrumbs_init = [{ title: 'Check-ins' }];
          this.tokenOrCheckin = 'Check-ins';
        }
      }, () => {
      });
  }
  getServiceList() {
    const filter1 = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.services = data;
          this.getProviderSettings();
        },
        () => { }
      );
  }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    this.resetPaginationData();
    // if (type === 'gender') {
    //   if (value === 'all') {
    //     this.genderList = [];
    //     if (event.checked) {
    //       this.allGenderSlected = true;
    //     } else {
    //       this.allGenderSlected = false;
    //     }
    //   } else {
    //     const indx = this.genderList.indexOf(value);
    //     if (indx === -1) {
    //       this.genderList.push(value);
    //     } else {
    //       this.genderList.splice(indx, 1);
    //     }
    //   }
    //   if (this.genderList.length === 0) {
    //     this.filter['gender'] = 'all';
    //   }
    // }
    // if (type === 'age') {
    //   if (value === 'all') {
    //     this.ageGroups = [];
    //     if (event.checked) {
    //       this.allAgeSlected = true;
    //     } else {
    //       this.allAgeSlected = false;
    //     }
    //   } else {
    //     const indx = this.ageGroups.indexOf(value);
    //     if (indx === -1) {
    //       this.ageGroups.push(value);
    //     } else {
    //       this.ageGroups.splice(indx, 1);
    //     }
    //   }
    //   if (this.ageGroups.length === 0) {
    //     this.filter['age'] = 'all';
    //   }
    // }
    if (type === 'waitlistMode') {
      if (value === 'all') {
        this.apptModes = [];
        this.allModeSelected = false;
        if (event.checked) {
          for (const mode of this.waitlistModes) {
            if (this.apptModes.indexOf(mode.mode) === -1) {
              this.apptModes.push(mode.mode);
            }
          }
          this.allModeSelected = true;
        }
      } else {
        this.allModeSelected = false;
        const indx = this.apptModes.indexOf(value);
        if (indx === -1) {
          this.apptModes.push(value);
        } else {
          this.apptModes.splice(indx, 1);
        }
      }
      if (this.apptModes.length === this.waitlistModes.length) {
        this.filter['waitlistMode'] = 'all';
        this.allModeSelected = true;
      }
    }
    if (type === 'payment_status') {
      if (value === 'all') {
        this.paymentStatuses = [];
        this.allPayStatusSelected = false;
        if (event.checked) {
          for (const pay_status of this.payStatusList) {
            if (this.paymentStatuses.indexOf(pay_status.pk) === -1) {
              this.paymentStatuses.push(pay_status.pk);
            }
          }
          this.allPayStatusSelected = true;
        }
      } else {
        this.allPayStatusSelected = false;
        const indx = this.paymentStatuses.indexOf(value);
        if (indx === -1) {
          this.paymentStatuses.push(value);
        } else {
          this.paymentStatuses.splice(indx, 1);
        }
      }
      if (this.paymentStatuses.length === this.payStatusList.length) {
        this.filter['payment_status'] = 'all';
        this.allPayStatusSelected = true;
      }
    }
    if (type === 'waitlist_status') {
      if (value === 'all') {
        this.apptStatuses = [];
        this.allApptStatusSelected = false;
        if (event.checked) {
          for (const apptStatus of this.check_in_statuses_filter) {
            if (this.apptStatuses.indexOf(apptStatus.value) === -1) {
              this.apptStatuses.push(apptStatus.value);
            }
          }
          this.allApptStatusSelected = true;
        }
      } else {
        this.allApptStatusSelected = false;
        const indx = this.apptStatuses.indexOf(value);
        if (indx === -1) {
          this.apptStatuses.push(value);
        } else {
          this.apptStatuses.splice(indx, 1);
        }
      }
      if (this.apptStatuses.length === this.check_in_statuses_filter.length) {
        this.filter['waitlist_status'] = 'all';
        this.allApptStatusSelected = true;
      }
    }
    if (type === 'service') {
      if (value === 'all') {
        this.filterService = [];
        this.allServiceSelected = false;
        if (event.checked) {
          for (const service of this.services) {
            if (this.filterService.indexOf(service.id) === -1) {
              this.filterService.push(service.id);
            }
          }
          this.allServiceSelected = true;
        }
      } else {
        this.allServiceSelected = false;
        const indx = this.filterService.indexOf(value);
        if (indx === -1) {
          this.filterService.push(value);
        } else {
          this.filterService.splice(indx, 1);
        }
      }
      if (this.filterService.length === this.services.length) {
        this.filter['service'] = 'all';
        this.allServiceSelected = true;
      }
    }

    if (type === 'queue') {
      if (value === 'all') {
        this.filterQ = [];
        this.allQSelected = false;
        if (event.checked) {
          for (const q of this.queues) {
            if (this.filterQ.indexOf(q.id) === -1) {
              this.filterQ.push(q.id);
            }
          }
          this.allQSelected = true;
        }
      } else {
        this.allQSelected = false;
        const indx = this.filterQ.indexOf(value);
        if (indx === -1) {
          this.filterQ.push(value);
        } else {
          this.filterQ.splice(indx, 1);
        }
      }
      if (this.filterQ.length === this.queues.length) {
        this.filter['queue'] = 'all';
        this.allQSelected = true;
      }
    }

    if (type === 'location') {
      if (value === 'all') {
        this.filterLocation = [];
        this.allLocationSelected = false;
        if (event.checked) {
          for (const q of this.locations) {
            if (this.filterLocation.indexOf(q.id) === -1) {
              this.filterLocation.push(q.id);
            }
          }
          this.allLocationSelected = true;
        }
      } else {
        this.allLocationSelected = false;
        const indx = this.filterLocation.indexOf(value);
        if (indx === -1) {
          this.filterLocation.push(value);
        } else {
          this.filterLocation.splice(indx, 1);
        }
      }
      if (this.filterLocation.length === this.locations.length) {
        this.filter['location'] = 'all';
        this.allLocationSelected = true;
      }
    }

    this.doSearch();
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    this.provider_services.getDisplayboardsWaitlist()
      .subscribe(
        data => {
          layout_list = data;
          this.board_count = layout_list.length;
        });
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.shared_functions.setitemonLocalStorage('sysdate', res);
        });
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
    if (this.shared_functions.getitemFromGroupStorage('futureDate') && this.shared_functions.transformToYMDFormat(this.shared_functions.getitemFromGroupStorage('futureDate')) > this.shared_functions.transformToYMDFormat(servdate)) {
      this.filter.futurecheckin_date = new Date(this.shared_functions.getitemFromGroupStorage('futureDate'));
    } else {
      this.filter.futurecheckin_date = moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD');
    }
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

  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
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
  initViews(queues, source?) {
    const _this = this;
    _this.views = [];
    return new Promise(function (resolve, reject) {
      const tempView = {};
      tempView['name'] = Messages.DEFAULTVIEWCAP;
      tempView['id'] = 0;
      tempView['customViewConditions'] = {};
      tempView['customViewConditions'].queues = queues;
      _this.selectedView = tempView;
      _this.getViews().then(
        (data: any) => {
          const qViewList = data;
          for (let i = 0; i < qViewList.length; i++) {
            if (qViewList[i].type === 'Waitlist') {
              _this.views.push(qViewList[i]);
            }
          }
          _this.views.push(tempView);
          let selected_view;
          if (source === 'changeLocation') {
          } else {
            selected_view = _this.shared_functions.getitemFromGroupStorage('selectedView');
          }
          if (selected_view) {
            const viewFilter = _this.views.filter(view => view.id === selected_view.id);
            if (viewFilter.length !== 0) {
              _this.selectedView = _this.shared_functions.getitemFromGroupStorage('selectedView');
            } else {
              _this.selectedView = tempView;
              _this.shared_functions.setitemToGroupStorage('selectedView', _this.selectedView);
            }
          } else {
            _this.selectedView = tempView;
            _this.shared_functions.setitemToGroupStorage('selectedView', _this.selectedView);
          }
          resolve(_this.selectedView);
        },
        error => {
          _this.views.push(tempView);
          _this.shared_functions.setitemToGroupStorage('selectedView', _this.selectedView);
          resolve(_this.selectedView);
        }
      );
    });
  }
  selectLocationFromCookies(cookie_location_id) {
    const self = this;
    this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
      (queues: any) => {
        self.queues = queues;
        self.initViews(queues, '').then(
          (view) => {
            self.initView(view, 'changeLocation');
          }
        );
      }
    );
  }
  getQsFromView(view, queues) {
    const qs = [];
    if (view && view.name !== Messages.DEFAULTVIEWCAP) {
      for (let i = 0; i < queues.length; i++) {
        for (let j = 0; j < view.customViewConditions.queues.length; j++) {
          if (queues[i].id === view.customViewConditions.queues[j].id) {
            qs.push(queues[i]);
          }
        }
      }
    } else {
      return queues;
    }
    return qs;
  }
  isQueueSelected(qId) {
    if (this.selQIds.indexOf(qId) !== -1) {
      return true;
    }
    return false;
  }
  viewQClicked(q) {
    const qindx = this.selQIds.indexOf(q.id);
    if (qindx !== -1) {
      if (this.selQIds.length === 1) {
        return false;
      }
      this.selQIds.splice(qindx, 1);
    } else {
      this.selQIds.push(q.id);
    }
    if (this.time_type === 1) {
      // this.shared_functions.removeitemFromGroupStorage('selQ');
      this.shared_functions.setitemToGroupStorage('selQ', this.selQIds);
    } else if (this.time_type === 2) {
      // this.shared_functions.removeitemFromGroupStorage('future_selQ');
      this.shared_functions.setitemToGroupStorage('future_selQ', this.selQIds);
    } else {
      // this.shared_functions.removeitemFromGroupStorage('history_selQ');
      this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }
  initView(view, source?) {
    this.activeQs = this.tempActiveQs = [];
    const groupbyQs = this.shared_functions.groupBy(this.getQsFromView(view, this.queues), 'queueState');
    if (groupbyQs['ENABLED'] && groupbyQs['ENABLED'].length > 0) {
      this.activeQs = this.tempActiveQs = groupbyQs['ENABLED'];
    }
    const activeQ = this.activeQs[this.findCurrentActiveQueue(this.activeQs)];
    if (view.name !== Messages.DEFAULTVIEWCAP) {
      if (groupbyQs['DISABLED'] && groupbyQs['DISABLED'].length > 0) {
        this.activeQs = this.tempActiveQs = this.activeQs.concat(groupbyQs['DISABLED']);
      }
    }
    this.getQsByProvider();
    if (this.time_type === 2 && this.shared_functions.getitemFromGroupStorage('future_selQ')) {
      this.selQIds = this.shared_functions.getitemFromGroupStorage('future_selQ');
    } else if (this.time_type === 1 && this.shared_functions.getitemFromGroupStorage('selQ')) {
      this.selQIds = this.shared_functions.getitemFromGroupStorage('selQ');
    } else {
      if (this.time_type !== 1) {
        this.selQIds = this.getActiveQIdsFromView(view);
        this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
        this.shared_functions.setitemToGroupStorage('future_selQ', this.selQIds);
      } else {
        this.selQIds = [];
        if (activeQ && activeQ.id) {
          this.selQIds.push(activeQ.id);
          this.shared_functions.setitemToGroupStorage('selQ', this.selQIds);
        } else {
          this.loading = false;
        }
      }
    }
    this.loadApiSwitch(source);
  }
  findCurrentActiveQueue(ques) {
    let selindx = 0;
    const cday = new Date();
    const currentday = (cday.getDay() + 1);
    const curtime = this.provider_shared_functions.formatTime(cday.getHours(), cday.getMinutes());
    // const curtime = '21:00:00';
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
            return selindx;
          }
        }
      }
    }
    return selindx;
  }
  getQIdsFromView(view) {
    const qIds = [];
    if (view && view.customViewConditions.queues && view.customViewConditions.queues.length > 0) {
      for (let i = 0; i < view.customViewConditions.queues.length; i++) {
        qIds.push(view.customViewConditions.queues[i]['id']);
      }
    }
    return qIds;
  }
  getActiveQIdsFromView(view) {
    const qIds = [];
    if (view && view.customViewConditions.queues && view.customViewConditions.queues.length > 0) {
      for (let i = 0; i < view.customViewConditions.queues.length; i++) {
        if (view.customViewConditions.queues[i].queueState === 'ENABLED') {
          qIds.push(view.customViewConditions.queues[i]['id']);
        }
      }
    }
    return qIds;
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
            if (data.length > 0) {
              self.locationExist = true;
              self.getAllQs();
            } else {
              self.locationExist = false;
              self.checkDashboardVisibility();
            }
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                self.locations.push(loc);
              }
            }
            const cookie_location_id = self.shared_functions.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
            if (cookie_location_id === '') {
              if (self.locations[0]) {
                self.locationSelected(self.locations[0]).then(
                  (queues: any) => {
                    self.queues = queues;
                    self.initViews(queues, 'changeLocation').then(
                      (view) => {
                        self.initView(view, 'changeLocation');
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
  getQs(date?) {
    const _this = this;
    const filterEnum = {};
    if (date === 'all') {
      if (this.selectedUser && this.selectedUser.id !== 'all') {
        filterEnum['provider-eq'] = this.selectedUser.id;
      }
      return new Promise((resolve) => {
        _this.provider_services.getProviderLocationQueues(_this.selected_location.id).subscribe(
          (queues: any) => {
            // if (queues.length > 0) {
            //   _this.qExist = true;
            // } else {
            //   _this.qExist = false;
            // }
            resolve(queues);
          });
      });
    }
  }
  clearQIdsFromStorage() {
    this.shared_functions.removeitemFromGroupStorage('history_selQ');
    this.shared_functions.removeitemFromGroupStorage('future_selQ');
    this.shared_functions.removeitemFromGroupStorage('selQ');
    this.shared_functions.removeitemFromGroupStorage('selectedView');
    this.resetPaginationData();
  }
  onChangeLocationSelect(event) {
    this.loading = true;
    this.resetFields();
    const value = event;
    this.clearQIdsFromStorage();
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
  resetFields() {
    this.today_waitlist_count = 0;
    this.future_waitlist_count = 0;
    this.history_waitlist_count = 0;
    this.check_in_filtered_list = [];
    this.activeQs = [];
    // this.tempActiveQs = [];
    this.scheduled_count = 0;
    this.started_count = 0;
    this.completed_count = 0;
    this.cancelled_count = 0;
  }
  locationSelected(location) {
    this.selected_location = location;
    const _this = this;
    if (_this.selected_location) {
      _this.shared_functions.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    _this.shared_functions.setitemToGroupStorage('loc_id', this.selected_location);
    return new Promise(function (resolve, reject) {
      _this.getQs('all').then(
        (queues: any) => {
          _this.queues = queues;
          resolve(queues);
        },
        () => {
          resolve([]);
        }
      );
    });
  }
  handleViewSel(view) {
    this.shared_functions.setitemToGroupStorage('selectedView', view);
    this.selectedView = view;
    this.initView(this.selectedView, 'reloadAPIs');

  }
  resetCheckList() {
    this.selectedAppt = [];
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.chkAppointments = {};
    this.appointmentsChecked = [];
    this.check_in_filtered_list = [];
  }
  loadApiSwitch(source) {
    // this.resetAll();
    this.resetCheckList();
    let chkSrc = true;
    if (source === 'changeLocation' && this.time_type === 3) {
      const hisPage = this.shared_functions.getitemFromGroupStorage('hP');
      const hFilter = this.shared_functions.getitemFromGroupStorage('hPFil');
      if (hisPage) {
        this.filter = hFilter;
        this.pagination.startpageval = hisPage;
        this.shared_functions.removeitemFromGroupStorage('hP');
        this.shared_functions.removeitemFromGroupStorage('hPFil');
        chkSrc = false;
      }
    } else {
      this.shared_functions.removeitemFromGroupStorage('hP');
      this.shared_functions.removeitemFromGroupStorage('hPFil');
    }
    if (chkSrc) {
      if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
        this.resetFilter();
        this.resetFilterValues();
        this.resetLabelFilter();
      }
    }
    switch (this.time_type) {
      case 1: this.getTodayWL();
        break;
      case 2: this.getFutureWL();
        break;
      case 3: this.getHistoryWL();
        break;
    }
    this.getCounts();
  }
  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
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
  getTodayWL() {
    this.loading = true;
    const Mfilter = this.setFilterForApi();
    if (this.shared_functions.getitemFromGroupStorage('selQ')) {
      this.selQIds = this.shared_functions.getitemFromGroupStorage('selQ');
    } else {
      this.selQIds = this.getActiveQIdsFromView(this.selectedView);
    }
    if (this.selQIds) {
      Mfilter['queue-eq'] = this.selQIds;
      this.shared_functions.setitemToGroupStorage('selQ', this.selQIds);
      // this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
      // this.shared_functions.setitemToGroupStorage('future_selQ', this.selQIds);
    }
    // this.resetPaginationData();
    // this.pagination.startpageval = 1;
    // this.pagination.totalCnt = 0; // no need of pagination in today
    const promise = this.getTodayWLCount(Mfilter);
    promise.then(
      result => {
        this.chkSelectAppointments = false;
        this.provider_services.getTodayWaitlist(Mfilter)
          .subscribe(
            (data: any) => {
              this.appt_list = data;
              this.todayAppointments = this.shared_functions.groupBy(this.appt_list, 'waitlistStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              this.setCounts(this.appt_list);
              this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
              this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
      },
      () => {
        this.loading = false;
      });
  }
  getFutureWL() {
    this.resetCheckList();
    this.loading = true;
    this.futureAppointments = [];
    if (this.filter.futurecheckin_date === null) {
      this.getTomorrowDate();
    }
    // this.shared_functions.setitemToGroupStorage('futureDate', this.shared_functions.transformToYMDFormat(this.filter.futurecheckin_date));
    // const date = this.shared_functions.transformToYMDFormat(this.filter.futurecheckin_date);
    if (this.shared_functions.getitemFromGroupStorage('future_selQ')) {
      this.selQIds = this.shared_functions.getitemFromGroupStorage('future_selQ');
    } else {

    }
    // this.load_waitlist = 0;
    const Mfilter = this.setFilterForApi();
    if (this.selQIds) {
      Mfilter['queue-eq'] = this.selQIds;
      // this.shared_functions.setitemToGroupStorage('selQ', this.selQIds);
      // this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
      this.shared_functions.setitemToGroupStorage('future_selQ', this.selQIds);
    }
    const promise = this.getFutureWLCount(Mfilter);
    promise.then(
      result => {
        // this.pagination.totalCnt = result;
        // Mfilter = this.setPaginationFilter(Mfilter);
        this.provider_services.getFutureWaitlist(Mfilter)
          .subscribe(
            data => {
              this.futureAppointments = this.shared_functions.groupBy(data, 'waitlistStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              // if (this.selQIds) {
              this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, this.statusAction);
              this.setFutureCounts(this.futureAppointments);
              // }
              this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
      },
      () => {
        this.loading = false;
      });
  }
  setFutureCounts(appointments) {
    this.scheduled_count = this.getActiveAppointments(appointments, 'new').length;
    this.cancelled_count = this.getActiveAppointments(appointments, 'cancelled').length;
  }
  getHistoryWL() {
    this.loading = true;
    let Mfilter = this.setFilterForApi();
    // if (this.selQIds.length !== 0) {
    //   Mfilter['queue-eq'] = this.selQIds.toString();
    // }
    const promise = this.getHistoryWLCount(Mfilter);
    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);
        this.appointmentsChecked = {};
        this.chkAppointments = {};
        this.chkSelectAppointments = false;
        this.setApptSelections();
        this.provider_services.getHistoryWaitlist(Mfilter)
          .subscribe(
            data => {
              // this.new_checkins_list = [];
              this.appt_list = this.check_in_filtered_list = data;
              this.loading = false;
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              this.loading = false;
            },
            () => {
              // this.load_waitlist = 1;
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
      },
      () => {
        this.loading = false;
      });
  }
  setApptSelections() {
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.activeAppointment = null;
    this.showArrived = false;
    this.showUndo = false;
    this.showRejected = false;
    const totalAppointmentsSelected = Object.keys(this.appointmentsChecked).length;
    if (totalAppointmentsSelected === this.check_in_filtered_list.length && totalAppointmentsSelected !== 0) {
      this.chkSelectAppointments = true;
    }
    if (totalAppointmentsSelected === 1) {
      this.apptSingleSelection = true;
      Object.keys(this.appointmentsChecked).forEach(key => {
        this.activeAppointment = this.appointmentsChecked[key];
      });
      if (this.time_type === 1 && this.activeAppointment.waitlistStatus === 'checkedIn' && !this.activeAppointment.virtualService) {
        this.showArrived = true;
      }
      if (this.time_type !== 3 && this.activeAppointment.waitlistStatus !== 'done' && this.activeAppointment.waitlistStatus !== 'checkedIn') {
        this.showUndo = true;
      }
      if (this.activeAppointment.waitlistStatus === 'arrived' || this.activeAppointment.waitlistStatus === 'checkedIn') {
        this.showRejected = true;
      }
      if (this.activeAppointment.waitlistStatus === 'checkedIn' && this.activeAppointment.jaldeeWaitlistDistanceTime && this.activeAppointment.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.activeAppointment.jaldeeStartTimeType === 'ONEHOUR' || this.activeAppointment.jaldeeStartTimeType === 'AFTERSTART')) {
        this.consumerTrackstatus = true;
      } else {
        this.consumerTrackstatus = false;
      }
    } else if (totalAppointmentsSelected > 1) {
      this.apptMultiSelection = true;
    }
  }
  setTimeType(time_type) {
    this.statusMultiCtrl = [];
    this.hideFilterSidebar();
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
    this.shared_functions.setitemToGroupStorage('pdtyp', this.time_type);
    if (time_type !== 3) {
      this.resetPaginationData();
    } else {
      const selectedView = this.shared_functions.getitemFromGroupStorage('selectedView');
      this.selQIds = this.getActiveQIdsFromView(selectedView);
      this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
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
        this.check_in_filtered_list = this.getScheduledAppointment(this.todayAppointments);
      } else {
        this.check_in_filtered_list = this.getScheduledAppointment(this.futureAppointments);
      }
    } else if (action === 'started') {
      this.check_in_filtered_list = this.getStartedAppointment(this.todayAppointments);
    } else if (action === 'completed') {
      this.check_in_filtered_list = this.getCompletedAppointment(this.todayAppointments);
    } else {
      if (type === 1) {
        this.check_in_filtered_list = this.getCancelledAppointment(this.todayAppointments);
      } else {
        this.check_in_filtered_list = this.getCancelledAppointment(this.futureAppointments);
      }
    }
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
    this.cancelled_count = this.today_cancelled_count;
    this.scheduled_count = this.today_checkins_count;
    this.started_count = this.today_started_count;
    this.completed_count = this.today_completed_count;
  }
  getTodayWLCount(Mfilter = null) {
    const queueid = this.shared_functions.getitemFromGroupStorage('selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid && queueid !== '') {
        Mfilter['queue-eq'] = queueid;
      }
      no_filter = true;
    }
    if (this.filter.waitlist_status === 'all') {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
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
  getFutureWLCount(Mfilter = null) {
    // let no_filter = false;
    const queueid = this.shared_functions.getitemFromGroupStorage('future_selQ');
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid) {
        Mfilter['queue-eq'] = queueid;
      }
      // no_filter = true;
    }
    if (this.filter.waitlist_status === 'all') {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    return new Promise((resolve) => {
      this.provider_services.getWaitlistFutureCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.future_waitlist_count = data;
          },
          () => {
          });
    });
  }
  getHistoryWLCount(Mfilter = null) {
    // const queueid = this.shared_functions.getitemFromGroupStorage('history_selQ');
    // let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      // if (this.selected_location && this.selected_location.id) {
      //   Mfilter['location-eq'] = this.selected_location.id;
      // }

      // if (queueid && queueid.length > 0) {
      //   Mfilter['queue-eq'] = queueid.toString();
      // }
      // no_filter = true;
    }
    if (this.filter.waitlist_status === 'all') {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    return new Promise((resolve) => {
      this.provider_services.getwaitlistHistoryCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.history_waitlist_count = data;
          },
          () => {
          });
    });
  }
  getCounts() {
    this.today_waitlist_count = 0;
    this.history_waitlist_count = 0;
    if (this.time_type !== 2) {
      this.future_waitlist_count = 0;
      this.getFutureWLCount()
        .then(
          (result) => {
            this.future_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 3) {
      this.getHistoryWLCount()
        .then(
          (result) => {
            this.history_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 1) {
      this.getTodayWLCount()
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
    if (appointments['arrived']) {
      scheduledList = appointments['arrived'].slice();
    }
    if (appointments['checkedIn']) {
      Array.prototype.push.apply(scheduledList, appointments['checkedIn'].slice());
    }
    this.sortCheckins(scheduledList);
    return scheduledList;
  }
  getCancelledAppointment(appointments) {
    let cancelledList = [];
    if (appointments['cancelled']) {
      cancelledList = appointments['cancelled'].slice();
    }
    return cancelledList;
  }
  getStartedAppointment(appointments) {
    let startedList = [];
    if (appointments['started']) {
      startedList = appointments['started'].slice();
    }
    return startedList;
  }
  getCompletedAppointment(appointments) {
    let completedList = [];
    if (appointments['done']) {
      completedList = appointments['done'].slice();
    }
    if (appointments['settled']) {
      Array.prototype.push.apply(completedList, appointments['settled'].slice());
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
      return queue1.queueState - queue2.queueState;
    });
  }
  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
    this.shared_functions.removeitemFromGroupStorage('hP');
    this.shared_functions.removeitemFromGroupStorage('hPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.shared_functions.setitemToGroupStorage('hP', pg);
    this.shared_functions.setitemToGroupStorage('hPFil', this.filter);
    this.doSearch();
  }
  clearFilter() {
    this.resetFilter();
    this.resetLabelFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.loadApiSwitch('doSearch');
    this.shared_functions.setFilter();
    this.setFilterDateMaxMin();
  }
  resetFilterValues() {
    this.ageGroups = [];
    this.genderList = [];
    this.filterService = [];
    this.apptStatuses = [];
    this.filterQ = [];
    this.filterLocation = [];
    this.paymentStatuses = [];
    this.apptModes = [];
    this.allAgeSlected = false;
    this.allGenderSlected = false;
    this.allServiceSelected = false;
    this.allApptStatusSelected = false;
    this.allPayStatusSelected = false;
    this.allModeSelected = false;
    this.allQSelected = false;
    this.allLocationSelected = false;
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
  toggleFilter() {
    this.open_filter = !this.open_filter;
    this.clearFilter();
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
      // api_filter['queue-eq'] = this.selected_queue.id;
      if (this.token && this.time_type === 1) {
        api_filter['token-eq'] = this.token;
      }
    }
    // else if (this.filter.queue !== 'all') {
    //   api_filter['queue-eq'] = this.filter.queue;
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
    if (this.filter.checkinEncId !== '') {
      api_filter['checkinEncId-eq'] = this.filter.checkinEncId;
    }
    if (this.filterService.length > 0 && this.filter.service !== 'all') {
      api_filter['service-eq'] = this.filterService.toString();
    }
    if (this.apptStatuses.length > 0 && this.filter.waitlist_status !== 'all') {
      api_filter['waitlistStatus-eq'] = this.apptStatuses.toString();
    }
    if (this.apptModes.length > 0 && this.filter.waitlistMode !== 'all') {
      api_filter['waitlistMode-eq'] = this.apptModes.toString();
    }
    // if (this.filter.waitlist_status !== 'all') {
    //   api_filter['waitlistStatus-eq'] = this.filter.waitlist_status;
    // }
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        // api_filter['date-ge'] = this.dateformat.transformTofilterDate(this.filter.check_in_start_date);
        api_filter['date-ge'] = this.shared_functions.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        // api_filter['date-le'] = this.dateformat.transformTofilterDate(this.filter.check_in_end_date);
        api_filter['date-le'] = this.shared_functions.transformToYMDFormat(this.filter.check_in_end_date);
      }
      // if (this.filter.futurecheckin_date != null && this.time_type === 2) {
      //   api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.futurecheckin_date);
      // }
    }
    if (this.time_type !== 2) {
      if (this.labelFilterData !== '') {
        api_filter['label-eq'] = this.labelFilterData;
      }
    }
    if (this.time_type === 3) {
      if (this.filterQ.length > 0 && this.filter.queue !== 'all') {
        api_filter['queue-eq'] = this.filterQ.toString();
      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
      }
      if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
        api_filter['billPaymentStatus-eq'] = this.paymentStatuses.toString();
      }
      if (this.ageGroups.length > 0 && this.filter.age !== 'all') {
        const kids = moment(new Date()).add(-12, 'year').format('YYYY-MM-DD');
        const adults = moment(new Date()).add(-60, 'year').format('YYYY-MM-DD');
        if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-le'] = kids;
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = kids;
        }
      }
      if (this.genderList.length > 0 && this.filter.gender !== 'all') {
        api_filter['gender-eq'] = this.genderList.toString();
      }
    }
    if (this.time_type !== 3) {
      if (this.selected_location && this.selected_location.id) {
        api_filter['location-eq'] = this.selected_location.id;
      }
    }
    if (this.filter.waitlist_status === 'all') {
      api_filter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    return api_filter;
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  doSearch() {
    // this.filter.waitlist_status !== 'all'
    this.labelSelection();
    // this.shared_functions.setitemToGroupStorage('futureDate', this.dateformat.transformTofilterDate(this.filter.futurecheckin_date));
    // this.shared_functions.setitemToGroupStorage('futureDate', this.shared_functions.transformToYMDFormat(this.filter.futurecheckin_date));
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.checkinEncId || this.filter.service !== 'all' ||
      this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.waitlistMode !== 'all' || this.filter.check_in_start_date
      || this.filter.check_in_end_date || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.labelMultiCtrl.length > 0 || this.filter.waitlist_status !== 'all') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.loadApiSwitch('doSearch');
    this.shared_functions.setFilter();
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
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      checkinEncId: false,
      queue: false,
      location: false,
      service: false,
      waitlist_status: false,
      payment_status: false,
      waitlistMode: false,
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
      checkinEncId: '',
      queue: 'all',
      location: 'all',
      service: 'all',
      waitlist_status: 'all',
      payment_status: 'all',
      waitlistMode: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      location_id: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 0,
      futurecheckin_date: null,
      age: 'all',
      gender: 'all'
    };
    this.statusMultiCtrl = [];
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
            const promise = this.getHistoryWLCount(Mfilter);
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
  addLabelvalue(source, label?) {
    const _this = this;
    const appts = [];
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appts.push(_this.appointmentsChecked[apptIndex]);
    });
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
          this.addLabel(appts[0].ynwUuid);
          this.getDisplayname(data.label);
          this.loadApiSwitch('');
        }, 500);
      }
      this.getLabel();
    });
  }
  addLabel(checkinId) {
    this.provider_services.addLabeltoCheckin(checkinId, this.labelMap).subscribe(data => {
      this.loadApiSwitch('');
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  deleteLabel(label, checkinId) {
    this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
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
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appts.push(_this.appointmentsChecked[apptIndex]);
    });
    if (appts.length === 1) {
      this.labelMap = new Object();
      this.labelMap[labelname] = value;
      for (let i = 0; i < this.providerLabels.length; i++) {
        for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
          if (this.providerLabels[i].valueSet[j].value === value) {
            if (!this.providerLabels[i].valueSet[j].selected) {
              this.providerLabels[i].valueSet[j].selected = true;
              this.addLabel(appts[0].ynwUuid);
            } else {
              this.providerLabels[i].valueSet[j].selected = false;
              this.deleteLabel(labelname, appts[0].ynwUuid);
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
  /**
   * Router Navigations
   */
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  gotoCustomViews() {
    this.router.navigate(['provider', 'settings', 'general', 'customview']);
  }
  gotoUser() {
    this.router.navigate(['provider', 'settings', 'general', 'users']);
  }
  checkinClicked(source) {
    let deptId;
    let userId;
    if (this.selectedUser && this.selectedUser.id && this.selectedUser.id !== 'all') {
      const filteredDept = this.users.filter(user => user.id === this.selectedUser.id);
      if (filteredDept[0] && filteredDept[0].deptId) {
        deptId = filteredDept[0].deptId;
      }
      userId = this.selectedUser.id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        checkin_type: source,
        calmode: this.calculationmode,
        showtoken: this.showToken,
        userId: userId,
        deptId: deptId
        // isFrom: 'checkin'
      }
    };
    this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
  }
  searchCustomer(source) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: source
      }
    };
    this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
  }
  showAdjustDelay() {
    if (this.queues.length === 0) {
      this.shared_functions.openSnackBar('Delay can be applied only for active queues', { 'panelClass': 'snackbarerror' });
      return false;
    } else {
      this.router.navigate(['provider', 'check-ins', 'adjustdelay']);
    }
  }
  applyLabel(checkin) {
    this.router.navigate(['provider', 'check-ins', checkin.ynwUuid, 'add-label'], { queryParams: checkin.label });
  }
  refresh() {
    if (this.time_type === 1) {
      this.getTodayWL();
    }
    if (this.time_type === 2) {
      this.getFutureWL();
    }
  }
  addProviderNote() {
    const _this = this;
    let checkin;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      checkin = _this.appointmentsChecked[apptIndex];
      _this.addnotedialogRef = _this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          checkin_id: checkin.ynwUuid
        }
      });
      _this.addnotedialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') { }
      });
    });
  }
  addConsumerInboxMessage() {
    const _this = this;
    const appts = [];
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appts.push(_this.appointmentsChecked[apptIndex]);
    });
    this.provider_shared_functions.addConsumerInboxMessage(appts, this)
      .then(
        () => { },
        () => { }
      );
  }
  goCheckinDetail(checkin) {
    if (this.time_type === 3) {
      this.shared_functions.setitemToGroupStorage('hP', this.filter.page || 1);
      this.shared_functions.setitemToGroupStorage('hPFil', this.filter);
    }
    this.router.navigate(['provider', 'check-ins', checkin.ynwUuid]);
  }
  viewBillPage() {
    const _this = this;
    let checkin_details;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      checkin_details = _this.appointmentsChecked[apptIndex];
    });
    this.provider_services.getWaitlistBill(checkin_details.ynwUuid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', checkin_details.ynwUuid]);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  learnmore_clicked(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/check-ins']);
    }
  }
  performActions(action) {
    if (action === 'adjustdelay') {
      this.showAdjustDelay();
    } else if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/check-ins']);

    }
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'check_in_start_date' || type === 'check_in_end_date') {
        this.filter[type] = null;
      } else if (type === 'payment_status' || type === 'service' || type === 'queue' || type === 'location' || type === 'waitlistMode') {
        this.filter[type] = 'all';
      } else if (type === 'waitlist_status') {
        this.statusMultiCtrl = [];
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
    this.shared_functions.setFilter();
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }

  locateCustomer(source) {
    const _this = this;
    let appt;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appt = _this.appointmentsChecked[apptIndex];
    });
    this.provider_services.getCustomerTrackStatus(appt.ynwUuid).subscribe(data => {
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
  // getBussinessProfileApi() {
  //   const _this = this;
  //   return new Promise(function (resolve, reject) {
  //     _this.provider_services.getBussinessProfile()
  //       .subscribe(
  //         data => {
  //           resolve(data);
  //         },
  //         () => {
  //           reject();
  //         }
  //       );
  //   });
  // }
  // get the logo url for the provider
  // getProviderLogo(bname = '', bsector = '', bsubsector = '') {
  //   let blogo;
  //   this.provider_services.getProviderLogo()
  //     .subscribe(
  //       data => {
  //         blogo = data;
  //         let logo = '';
  //         if (blogo[0]) {
  //           logo = blogo[0].url;
  //         } else {
  //           logo = '';
  //         }
  //         // calling function which saves the business related details to show in the header
  //         this.shared_functions.setBusinessDetailsforHeaderDisp(bname || '', bsector || '', bsubsector || '', logo);
  //         const pdata = { 'ttype': 'updateuserdetails' };
  //         this.shared_functions.sendMessage(pdata);
  //       },
  //       () => {
  //       }
  //     );
  // }
  // getBusinessProfile() {
  //   let bProfile: any = [];
  //   this.getBussinessProfileApi()
  //     .then(
  //       data => {
  //         bProfile = data;
  //         this.bprofile = bProfile;
  //         this.bname = bProfile['businessName'];
  //         if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
  //           // calling function which saves the business related details to show in the header
  //           const subsectorname = this.shared_functions.retSubSectorNameifRequired(bProfile['serviceSector']['domain'], bProfile['serviceSubSector']['displayName']);
  //           this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
  //             || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
  //           this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '', subsectorname || '');
  //           const pdata = { 'ttype': 'updateuserdetails' };
  //           this.shared_functions.sendMessage(pdata);
  //           const statusCode = this.provider_shared_functions.getProfileStatusCode(bProfile);
  //           this.shared_functions.setitemToGroupStorage('isCheckin', statusCode);
  //           // this.reloadAPIs();
  //         }
  //       },
  //       () => { }
  //     );
  // }

  callingWaitlist(checkin) {
    const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setCallStatus(checkin.ynwUuid, status).subscribe(
      () => {
        this.loadApiSwitch('reloadAPIs');
      });
  }
  printHistoryCheckin() {
    const Mfilter = this.setFilterForApi();
    const promise = this.getHistoryWLCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getHistoryWaitlist(Mfilter)
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
              // if (this.providerLabels.length > 0) {
              checkin_html += '<td style="padding:10px;">Label</td>';
              // }
              checkin_html += '</thead>';
              for (let i = 0; i < this.historyCheckins.length; i++) {
                checkin_html += '<tr style="line-height:20px;padding:10px">';
                checkin_html += '<td style="padding:10px">' + (this.historyCheckins.indexOf(this.historyCheckins[i]) + 1) + '</td>';
                checkin_html += '<td style="padding:10px">' + moment(this.historyCheckins[i].date).format(projectConstants.DISPLAY_DATE_FORMAT) + ' ' + this.historyCheckins[i].checkInTime + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].waitlistingFor[0].firstName + ' ' + this.historyCheckins[i].waitlistingFor[0].lastName + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].service.name + '</td>';
                if (this.historyCheckins[i].label && Object.keys(this.historyCheckins[i].label).length > 0) {
                  const labels = [];
                  Object.keys(this.historyCheckins[i].label).forEach(key => {
                    labels.push(this.historyCheckins[i].label[key]);
                  });
                  checkin_html += '<td style="padding:10px">' + labels.toString() + '</td></tr>';
                }
              }
              checkin_html += '</table>';
              checkin_html += '<div style="margin:10px">';
              checkin_html += '<div style="padding-bottom:10px;">' + 'Total - ' + result + ' Records</div>';
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
  printCheckin() {
    const _this = this;
    let appt;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appt = _this.appointmentsChecked[apptIndex];
    });
    this.printBill(appt);
  }
  qrCodegeneration(valuetogenerate) {
    this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
    this.showQR = true;
  }
  printBill(checkinlist) {
    // const _this = this;
    this.qrCodegeneration(checkinlist);
    const bprof = this.shared_functions.getitemFromGroupStorage('ynwbp');
    this.bname = bprof.bn;
    setTimeout(() => {
      const printContent = document.getElementById('print-section');
      const params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes'
      ].join(',');
      const printWindow = window.open('', '', params);
      let checkin_html = '';
      checkin_html += '<table style="width:100%;"><thead>';
      checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(checkinlist.date) + '<br/>';
      if (checkinlist.token) {
        checkin_html += 'Token# <span style="font-weight:bold">' + checkinlist.token + '</span>';
      }
      checkin_html += '</td></tr>';
      checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.bname.charAt(0).toUpperCase() + this.bname.substring(1) + '</td></tr>';
      checkin_html += '<tr><td colspan="3" style="text-align:center">' + checkinlist.queue.location.place + '</td></tr>';
      checkin_html += '</thead><tbody>';
      checkin_html += '<tr><td width="48%" align="right">Customer</td><td>:</td><td>' + checkinlist.waitlistingFor[0].firstName + ' ' + checkinlist.waitlistingFor[0].lastName + '</td></tr>';
      if (checkinlist.service && checkinlist.service.deptName) {
        checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + checkinlist.service.deptName + '</td></tr>';
      }
      checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + checkinlist.service.name + '</td></tr>';
      if (checkinlist.provider && checkinlist.provider.firstName && checkinlist.provider.lastName) {
        checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + checkinlist.provider.firstName.charAt(0).toUpperCase() + checkinlist.provider.firstName.substring(1) + ' ' + checkinlist.provider.lastName + '</td></tr>';
      }
      checkin_html += '<tr><td width="48%" align="right">Queue</td><td>:</td><td>' + checkinlist.queue.name + ' [' + checkinlist.queue.queueStartTime + ' - ' + checkinlist.queue.queueEndTime + ']' + '</td></tr>';
      checkin_html += '<tr><td colspan="3" align="center">' + printContent.innerHTML + '</td></tr>';
      checkin_html += '<tr><td colspan="3" align="center">Scan to know your status or log on to ' + this.qr_value + '</td></tr>';
      checkin_html += '</tbody></table>';
      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(checkin_html);
      printWindow.document.write('</body></html>');
      // this.showQR = false;
      printWindow.moveTo(0, 0);
      printWindow.print();
    });
  }
  smsCheckin() {
    const _this = this;
    let appt;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      appt = _this.appointmentsChecked[apptIndex];
    });
    this.smsdialogRef = this.dialog.open(CheckinDetailsSendComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        qdata: appt,
        uuid: appt.ynwUuid,
        chekintype: 'Waitlist'
      }
    });
    // this.provider_services.smsCheckin(appt.ynwUuid).subscribe(
    //   () => {
    //     this.shared_functions.openSnackBar('Check-in details sent successfully');
    //   },
    //   error => {
    //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //   }
    // );
  }
  // emailCheckin() {
  //   const _this = this;
  //   let appt;
  //   Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
  //     appt = _this.appointmentsChecked[apptIndex];
  //   });
  //   this.notedialogRef = this.dialog.open(CheckinDetailsSendComponent, {
  //     width: '50%',
  //     panelClass: ['popup-class', 'commonpopupmainclass'],
  //     disableClose: true,
  //     data: {
  //       uuid : appt.ynwUuid,
  //       check : 'email'
  //     }
  //   });
  //   // this.provider_services.emailCheckin(appt.ynwUuid).subscribe(
  //   //   () => {
  //   //     this.shared_functions.openSnackBar('Check-in details mailed successfully');
  //   //   },
  //   //   error => {
  //   //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //   //   }
  //   // );
  // }
  goToCheckinDetails() {
    const _this = this;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      const checkin = _this.appointmentsChecked[apptIndex];
      _this.router.navigate(['provider', 'check-ins', checkin.ynwUuid]);
    });
  }
  changeWaitlistStatus(action, wtlst?) {
    let waitlist;
    const _this = this;
    if (wtlst) {
      waitlist = wtlst;
    } else {
      Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
        waitlist = _this.appointmentsChecked[apptIndex];
      });
    }
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

  showCallingModes(modes, action) {
    if (!modes.consumer) {
      this.consumr_id = modes.providerConsumer.id;
    } else {
      this.consumr_id = modes.consumer.id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        waiting_id: modes.ynwUuid,
        type: 'checkin'
      }
    };
    this.router.navigate(['provider', 'telehealth'], navigationExtras);
  }
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
  keyPressed(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  scrollToTop() {
    this.chekinSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  getVirtualMode(virtualService) {
    // Object.keys(virtualService)[0];
    return Object.keys(virtualService)[0];
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
  getProviders() {
    const apiFilter = {};
    apiFilter['userType-eq'] = 'PROVIDER';
    // let filter = 'userType-neq :"assistant"'
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      const tempUser = {};
      tempUser['firstName'] = 'All';
      tempUser['id'] = 'all';
      this.users.push(tempUser);
      if (this.shared_functions.getitemFromGroupStorage('selectedUser')) {
        this.selectedUser = this.shared_functions.getitemFromGroupStorage('selectedUser');
      } else {
        this.selectedUser = tempUser;
      }
      this.handleUserSelection(this.selectedUser);
    });
  }
  handleUserSelection(user) {
    this.resetFields();
    this.shared_functions.setitemToGroupStorage('selectedUser', user);
    this.selectedUser = user;
    this.getQsByProvider();
  }
  getQsByProvider() {
    const qs = [];
    if (this.selectedUser.id === 'all') {
      this.activeQs = this.tempActiveQs;
    } else {
      for (let i = 0; i < this.tempActiveQs.length; i++) {
        if (this.tempActiveQs[i].provider && this.tempActiveQs[i].provider.id === this.selectedUser.id) {
          qs.push(this.tempActiveQs[i]);
        }
      }
      this.activeQs = qs;
    }
    if (this.activeQs.length === 0) {
      this.selQIds = [];
    } else {
      const qids = [];
      // for (const id of this.selQIds) {
      //   for (const q of this.activeQs) {
      //     if (id === q.id) {
      //       qids.push(id);
      //     }
      //   }
      // }
      for (const q of this.activeQs) {
        qids.push(q.id);
      }
      if (qids.length > 0) {
        this.selQIds = qids;
      } else {
        this.selQIds.push(this.activeQs[0].id);
      }
    }
    if (this.time_type === 1) {
      this.shared_functions.setitemToGroupStorage('selQ', this.selQIds);
    } else if (this.time_type === 2) {
      this.shared_functions.setitemToGroupStorage('future_selQ', this.selQIds);
    } else {
      this.shared_functions.setitemToGroupStorage('history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }

  openAttachmentGallery(checkin) {
    this.image_list_popup_temp = [];
    this.image_list_popup = [];
    this.provider_services.getProviderAttachments(checkin.ynwUuid).subscribe(
      (communications: any) => {
        let count = 0;
        for (let comIndex = 0; comIndex < communications.length; comIndex++) {
          if (communications[comIndex].attachements) {
            for (let attachIndex = 0; attachIndex < communications[comIndex].attachements.length; attachIndex++) {
              const thumbPath = communications[comIndex].attachements[attachIndex].thumbPath;
              let imagePath = thumbPath;
              const description = communications[comIndex].attachements[attachIndex].s3path;
              const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
              if (this.imageAllowed.includes(thumbPathExt.toUpperCase())) {
                imagePath = communications[comIndex].attachements[attachIndex].s3path;
              }
              const imgobj = new Image(
                count,
                { // modal
                  img: imagePath,
                  description: description
                },
              );
              this.image_list_popup_temp.push(imgobj);
              count++;
            }
          }
        }
        if (count > 0) {
          this.image_list_popup = this.image_list_popup_temp;
          setTimeout(() => {
            this.openImageModalRow(this.image_list_popup[0]);
          }, 200);
        }
      },
      error => { }
    );
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  getGlobalSettings() {
    return new Promise((resolve) => {
      this.provider_services.getGlobalSettings().subscribe(
        (data: any) => {
          this.checkinStatus = data.waitlist;
          resolve();
        });
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    if (this.bname === '') {
      this.profileExist = false;
    } else {
      this.profileExist = true;
    }
    setTimeout(() => {
      this.checkDashboardVisibility();
    }, 500);
  }
  getAllServices() {
    const filter1 = { 'serviceType-neq': 'donationService' };
    return new Promise((resolve) => {
      this.provider_services.getServicesList(filter1)
        .subscribe(
          (data: any) => {
            if (data.length > 0) {
              this.serviceExist = true;
            } else {
              this.serviceExist = false;
            }
            resolve();
          },
          () => { }
        );
    });
  }
  getAllQs() {
    this.provider_services.getProviderQueues()
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.qExist = true;
            this.getGlobalSettings().then(
              () => {
                this.getAllServices().then(
                  () => {
                    this.getBusinessdetFromLocalstorage();
                  }
                );
              }
            );
          } else {
            this.qExist = false;
            this.checkDashboardVisibility();
          }
        });
  }
  checkDashboardVisibility() {
    if (!this.checkinStatus || !this.profileExist || !this.locationExist || !this.serviceExist || !this.qExist) {
      if (!this.profileExist || !this.locationExist || !this.serviceExist || !this.qExist) {
        this.provider_services.getWaitlistMgr()
          .subscribe(data => {
            this.settings = data;
            this.showToken = this.settings.showTokenId;
            if (this.showToken) {
              this.tokenOrCheckin = 'Tokens';
              this.message = 'To access ' + this.tokenOrCheckin + ' dashboard, set up the profile and turn on Jaldee Queue Manager in Settings.';
            } else {
              this.tokenOrCheckin = 'Check-ins';
              this.message = 'To access ' + this.tokenOrCheckin + ' dashboard, set up the profile and turn on Jaldee Queue Manager in Settings.';
            }
          });
      } else {
        this.message1 = 'Enable Jaldee QManager in your settings to access ' + this.tokenOrCheckin + ' dashboard.';
      }
      this.apiloading = false;
      this.showDashbard = false;
    } else {
      this.apiloading = false;
      this.showDashbard = true;
    }
  }
  gotoQmanager() {
    this.router.navigate(['/provider/settings/q-manager']);
  }
  gotoSettings() {
    this.router.navigate(['/provider/settings']);
  }
}
