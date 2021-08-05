import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import * as moment from 'moment';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { KeyValue } from '@angular/common';
import { LocateCustomerComponent } from './locate-customer/locate-customer.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';
import { CheckinDetailsSendComponent } from './checkin-details-send/checkin-details-send.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { interval as observableInterval, Subscription } from 'rxjs';
import { CheckinActionsComponent } from './checkin-actions/checkin-actions.component';
import { VoicecallDetailsComponent } from './voicecall-details/voicecall-details.component';
import Speech from 'speak-tts';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Title } from '@angular/platform-browser';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { instantQueueComponent } from './instantQ/instantQueue.component';
import { ConfirmBoxComponent } from '../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { AttachmentPopupComponent } from '../../../../app/shared/components/attachment-popup/attachment-popup.component';
@Component({
  selector: 'app-checkins',
  templateUrl: './check-ins.component.html',
  styleUrls: ['./check-ins.component.css']
})
export class CheckInsComponent implements OnInit, OnDestroy, AfterViewInit {
  // pdtyp  --- 0-History, 1-Future, 2-Today
  // pdStyp --- 'all' -- Checkins, 'started' - Started, 'done' - Complete, 'cancelled' - Cancelled
  // pdq --- selected queue id
  tooltipcls = '';
  cloudTooltip = '';
  filtericonTooltip = '';
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
  check_in_statuses_filter = projectConstantsLocal.CHECK_IN_STATUSES_FILTER;
  future_check_in_statuses_filter = projectConstants.FUTURE_CHECK_IN_STATUSES_FILTER;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newTimeDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  locations: any = [];
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    checkinEncId: '',
    patientId: '',
    queue: 'all',
    location: 'all',
    service: 'all',
    waitlist_status: 'all',
    waitlistMode: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    check_in_date: null,
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
    patientId: false,
    queue: false,
    location: false,
    service: false,
    waitlist_status: false,
    payment_status: false,
    waitlistMode: false,
    check_in_start_date: false,
    check_in_date: false,
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
  billicon = false;
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
  today_blocked_count = 0;
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
  allLabelSelected = false;
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
  selectedLabels: any = [];
  consumr_id: any;
  notedialogRef: any;
  locateCustomerdialogRef;
  trackDetail: any = [];
  consumerTrackstatus = false;
  labeldialogRef;
  admin = false;
  speech;
  @ViewChild('chekinSection') chekinSection: ElementRef<HTMLElement>;
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
  checkin_uuid: any;
  showList = false;
  startedCheckins: any = [];
  allStartedSelection = false;
  allSelection = false;
  apptStartedMultiSelection = false;
  apptStartedSingleSelection = false;
  startedAppointmentsChecked: any = [];
  startedChkAppointments: any = [];
  chkStartedSelectAppointments = false;
  customerIdTooltip = '';
  endminday;
  maxday = new Date();
  endmaxday = new Date();
  allLabels: any = [];
  voicedialogRef: any;
  addCustomerTooltip = '';
  qloading: boolean;
  firstTime = true;
  statusChangeClicked = false;
  activeUser: any;
  statusLoaded = false;
  qAvailability;
  instantdialogRef: any;
  instaQid: any;
  unassignview = false;
  accountSettings;
  teams: any;
  yesterdayDate;
  @ViewChild('closebutton') closebutton;
  showattachmentDialogRef: any;
  constructor(private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    public dateformat: DateFormatPipe,
    private dialog: MatDialog,
    public activateroute: ActivatedRoute,
    private router: Router,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private dateTimeProcessor: DateTimeProcessor,
    private titleService: Title) {
    this.onResize();
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.arrived_label = this.wordProcessor.getTerminologyTerm('arrived');
    this.arrived_upper = this.wordProcessor.firstToUpper(this.arrived_label);
    this.checkedin_label = this.wordProcessor.getTerminologyTerm('waitlisted');
    this.checkedin_upper = this.wordProcessor.firstToUpper(this.checkedin_label);
    this.done_label = this.wordProcessor.getTerminologyTerm('done');
    this.done_upper = this.wordProcessor.firstToUpper(this.done_label);
    this.started_label = this.wordProcessor.getTerminologyTerm('started');
    this.started_upper = this.wordProcessor.firstToUpper(this.started_label);
    this.start_label = this.wordProcessor.getTerminologyTerm('start');
    this.cancelled_label = this.wordProcessor.getTerminologyTerm('cancelled');
    this.cancelled_upper = this.wordProcessor.firstToUpper(this.cancelled_label);
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.no_future_checkins = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.FUTURE_NO_CHECKINS);
    this.no_today_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_TODAY_CHECKIN_MSG);
    this.no_started_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_STRTED_CHECKIN_MSG);
    this.no_completed_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_COMPLETED_CHECKIN_MSG);
    this.no_cancelled_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_CANCELLED_CHECKIN_MSG);
    this.no_history = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_HISTORY_MSG);

    this.waitlist_status = [
      { name: this.checkedin_upper, value: 'checkedIn' },
      { name: this.cancelled_upper, value: 'cancelled' },
      { name: this.started_upper, value: 'started' },
      { name: this.arrived_upper, value: 'arrived' },
      { name: this.done_upper, value: 'complete' }];
    if (this.groupService.getitemFromGroupStorage('action')) {
      this.statusAction = this.groupService.getitemFromGroupStorage('action');
    }
  }
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'PartiallyRefunded', value: 'Partially Refunded' },
    { pk: 'FullyRefunded', value: 'Fully Refunded' },
    { pk: 'Refund', value: 'Refund' }
  ];
  waitlistModes = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in Check-in' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in Check-in' },
    { mode: 'ONLINE_CHECKIN', value: 'Online Check-in' },
  ];
  waitlistModesToken = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in Token' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in Token' },
    { mode: 'ONLINE_CHECKIN', value: 'Online Token' },
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
    let qHeader = 0;
    let tabHeader = 0;
    if (document.getElementById('qHeader')) {
      qHeader = document.getElementById('qHeader').offsetHeight;
    }
    if (document.getElementById('tabHeader')) {
      tabHeader = document.getElementById('tabHeader').offsetHeight;
    }
    this.topHeight = qHeader + tabHeader;
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  ngOnInit() {
    this.getProviderSettings();
    this.accountSettings = this.groupService.getitemFromGroupStorage('settings');
    this.titleService.setTitle('Jaldee Business - Checkins/Tokens');
    this.pagination.startpageval = this.groupService.getitemFromGroupStorage('paginationStart') || 1;
    this.refreshTime = projectConstants.INBOX_REFRESH_TIME;
    const savedtype = this.groupService.getitemFromGroupStorage('pdtyp');
    if (savedtype !== undefined && savedtype !== null) {
      this.time_type = savedtype;
    }
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
      this.getTomorrowDate();
      this.getYesterdayDate();
    }
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.active_user.adminPrivilege || this.active_user.userType === 5) {
      this.admin = true;
    }
    this.account_type = this.active_user.accountType;
    this.domain = this.active_user.sector;
    this.cust_note_tooltip = Messages.CUST_NOT_TOOLTIP.replace('[customer]', this.customer_label);
    this.customerIdTooltip = this.customer_label + ' Id';
    this.addCustomerTooltip = 'Add ' + this.customer_label;
    this._initSpeech();
    this.isuserAvailableNow();
    this.getDisplayboardCount();
    this.getPos();
    this.getLabel();
    if (this.active_user.accountType === 'BRANCH') {
      this.getDepartments();
      this.getProviders().then(
        () => {
          this.getLocationList();
          this.getServiceList();
        }
      );
    } else {
      this.getLocationList();
      this.getServiceList();
    }
    if (this.active_user.accountType === 'BRANCH') {
      this.getTeams().then((data) => {
        this.teams = data;
        console.log(this.teams);
      });
    }
    this.image_list_popup_temp = [];
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
          this.waitlistModes = this.waitlistModesToken;
        }
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
        },
        () => { }
      );
  }

  setLabelFilter(label, event) {
    this.resetPaginationData();
    const value = event.checked;
    if (label === 'all') {
      this.allLabelSelected = false;
      if (event.checked) {
        for (const lbl of this.providerLabels) {
          if (!this.selectedLabels[lbl.label]) {
            this.selectedLabels[lbl.label] = [];
            this.selectedLabels[lbl.label].push(true);
          }
        }
        this.allLabelSelected = true;
      } else {
        this.selectedLabels = [];
        this.allLabelSelected = false;
      }
    } else {
      this.allLabelSelected = false;
      if (this.selectedLabels[label.label]) {
        delete this.selectedLabels[label.label];
      } else {
        this.selectedLabels[label.label] = [];
        this.selectedLabels[label.label].push(value);
      }
      if (Object.keys(this.selectedLabels).length === this.providerLabels.length) {
        this.allLabelSelected = true;
      }
    }
    this.keyPressed();
  }

  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    this.resetPaginationData();
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
      this.firstTime = false;
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
    this.keyPressed();
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
  getServiceName(serviceName) {
    let name = '';
    if (serviceName.length > 20) {
      name = serviceName.substring(0, 20) + '...';
    } else {
      name = serviceName;
    }
    return name;
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
    if (this.groupService.getitemFromGroupStorage('futureDate') && this.dateTimeProcessor.transformToYMDFormat(this.groupService.getitemFromGroupStorage('futureDate')) > this.dateTimeProcessor.transformToYMDFormat(servdate)) {
      this.filter.futurecheckin_date = new Date(this.groupService.getitemFromGroupStorage('futureDate'));
    } else {
      this.filter.futurecheckin_date = moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD');
    }
  }
  getYesterdayDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.yesterdayDate = this.maxday = this.endmaxday = new Date(moment(new Date(servdate)).add(-1, 'days').format('YYYY-MM-DD'));
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
    if (selected_location !== null) {
      return selected_location;
    } else {
      const location = this.locations.filter(loc => loc.baseLocation);
      return location[0];
    }
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
  getDefaultViewQs(allQueues) {
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (!loggedUser.adminPrivilege) {
      const userQs = [];
      for (let qIndex = 0; qIndex < allQueues.length; qIndex++) {
        if (allQueues[qIndex].provider && (allQueues[qIndex].provider.id === loggedUser.id)) {
          userQs.push(allQueues[qIndex]);
        }
      }
      return userQs;
    } else {
      return allQueues;
    }
  }
  initViews(queues, source?) {
    const _this = this;
    _this.views = [];
    let name = '';
    if (_this.showToken) {
      name = 'All Tokens';
    } else {
      name = 'All Check-ins';
    }
    const qsActive = this.getDefaultViewQs(queues);
    return new Promise(function (resolve, reject) {
      const tempView = {};
      tempView['name'] = name;
      tempView['id'] = 0;
      tempView['customViewConditions'] = {};
      tempView['customViewConditions'].queues = qsActive;
      _this.selectedView = tempView;
      _this.getViews().then(
        (data: any) => {
          const qViewList = data;
          for (let i = 0; i < qViewList.length; i++) {
            if (qViewList[i].type === 'Waitlist') {
              _this.views.push(qViewList[i]);
            }
          }
          if (_this.admin) {
            for (let i = 0; i < _this.users.length; i++) {
              _this.views.push(_this.users[i]);
            }
          }
          _this.views.push(tempView);
          let selected_view;
          if (source === 'changeLocation') {
          } else {
            selected_view = _this.groupService.getitemFromGroupStorage('selectedView');
          }
          if (selected_view) {
            const viewFilter = _this.views.filter(view => view.id === selected_view.id);
            if (viewFilter.length !== 0) {
              _this.selectedView = _this.groupService.getitemFromGroupStorage('selectedView');
            } else {
              _this.selectedView = tempView;
              _this.groupService.setitemToGroupStorage('selectedView', _this.selectedView);
            }
          } else {
            _this.selectedView = tempView;
            _this.groupService.setitemToGroupStorage('selectedView', _this.selectedView);
          }
          resolve(_this.selectedView);
        },
        error => {
          if (_this.admin) {
            for (let i = 0; i < _this.users.length; i++) {
              _this.views.push(_this.users[i]);
            }
          }
          _this.views.push(tempView);
          _this.groupService.setitemToGroupStorage('selectedView', _this.selectedView);
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
    if (view && view.name !== 'All Tokens') {
      for (let i = 0; i < queues.length; i++) {
        for (let j = 0; j < view.customViewConditions.queues.length; j++) {
          if (queues[i].id === view.customViewConditions.queues[j].id) {
            qs.push(queues[i]);
          }
        }
      }
    } else {
      const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
      if (!loggedUser.adminPrivilege) {
        for (let qIndex = 0; qIndex < queues.length; qIndex++) {
          if (queues[qIndex].provider && (queues[qIndex].provider.id === loggedUser.id)) {
            qs.push(queues[qIndex]);
          }
        }
      } else {
        return queues;
      }
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
      this.groupService.setitemToGroupStorage('selQ', this.selQIds);
    } else if (this.time_type === 2) {
      this.groupService.setitemToGroupStorage('future_selQ', this.selQIds);
    } else {
      this.groupService.setitemToGroupStorage('history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }
  initView(view, source, type?) {
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (view.name === 'All Tokens' && !loggedUser.adminPrivilege && loggedUser.userType !== 5) {
      this.activeUser = loggedUser.id;
    } else {
      this.activeQs = [];
      const groupbyQs = this.shared_functions.groupBy(this.getQsFromView(view, this.queues), 'queueState');
      if (groupbyQs['ENABLED'] && groupbyQs['ENABLED'].length > 0) {
        this.activeQs = groupbyQs['ENABLED'];
      }
      if (view.name !== 'All Tokens') {
        if (groupbyQs['DISABLED'] && groupbyQs['DISABLED'].length > 0) {
          this.activeQs = this.activeQs.concat(groupbyQs['DISABLED']);
        }
      }
      const qids = [];
      for (const q of this.activeQs) {
        qids.push(q.id);
      }
      if (!type && this.time_type === 2 && this.groupService.getitemFromGroupStorage('future_selQ')) {
        this.selQIds = this.groupService.getitemFromGroupStorage('future_selQ');
      } else if (!type && this.time_type === 1 && this.groupService.getitemFromGroupStorage('selQ')) {
        this.selQIds = this.groupService.getitemFromGroupStorage('selQ');
      } else {
        if (this.time_type !== 1) {
          this.selQIds = this.getActiveQIdsFromView(view);
          this.groupService.setitemToGroupStorage('history_selQ', this.selQIds);
          this.groupService.setitemToGroupStorage('future_selQ', this.selQIds);
        } else {
          this.selQIds = [];
          if (qids && qids.length > 0) {
            this.selQIds = qids;
            this.groupService.setitemToGroupStorage('selQ', this.selQIds);
          } else {
            this.loading = false;
          }
        }
      }
    }
    setTimeout(() => {
      this.qloading = false;
    }, 1000);
    this.loadApiSwitch(source);
  }
  findCurrentActiveQueue(ques) {
    let selindx = 0;
    const cday = new Date();
    const currentday = (cday.getDay() + 1);
    const curtime = this.provider_shared_functions.formatTime(cday.getHours(), cday.getMinutes());
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
    return new Promise<void>(function (resolve, reject) {
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
            const cookie_location_id = self.groupService.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
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
    if (date === 'all') {
      return new Promise((resolve) => {
        _this.provider_services.getProviderLocationQueues(_this.selected_location.id).subscribe(
          (queues: any) => {
            const qList = queues.filter(sch => sch.queueState !== 'EXPIRED');
            resolve(qList);
          });
      });
    }
  }
  clearQIdsFromStorage() {
    this.groupService.removeitemFromGroupStorage('history_selQ');
    this.groupService.removeitemFromGroupStorage('future_selQ');
    this.groupService.removeitemFromGroupStorage('selQ');
    this.groupService.removeitemFromGroupStorage('selectedView');
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
    this.scheduled_count = 0;
    this.started_count = 0;
    this.completed_count = 0;
    this.cancelled_count = 0;
  }
  locationSelected(location) {
    this.selected_location = location;
    const _this = this;
    if (_this.selected_location) {
      _this.groupService.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    _this.groupService.setitemToGroupStorage('loc_id', this.selected_location);
    return new Promise(function (resolve, reject) {
      _this.getQs('all').then(
        (queues: any) => {
          _this.queues = _this.tempActiveQs = queues;
          resolve(queues);
        },
        () => {
          resolve([]);
        }
      );
    });
  }
  handleViewSel(view) {
    this.unassignview = false;
    this.activeUser = null;
    const tempUser = {};
    tempUser['firstName'] = 'All';
    tempUser['id'] = 'all';
    this.selectedUser = tempUser;
    this.qloading = true;
    this.groupService.setitemToGroupStorage('selectedView', view);
    this.selectedView = view;
    if (!view.userType) {
      this.initView(this.selectedView, 'reloadAPIs', 'view');
    } else {
      this.handleUserSelection(view);
    }
  }
  resetCheckList() {
    this.selectedAppt = [];
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.chkAppointments = {};
    this.appointmentsChecked = [];
    this.check_in_filtered_list = [];

    this.startedChkAppointments = {};
    this.startedAppointmentsChecked = [];
    this.apptStartedSingleSelection = false;
    this.apptStartedMultiSelection = false;
  }
  loadApiSwitch(source) {
    this.resetCheckList();
    let chkSrc = true;
    if (source === 'changeLocation' && this.time_type === 3) {
      const hisPage = this.groupService.getitemFromGroupStorage('hP');
      const hFilter = this.groupService.getitemFromGroupStorage('hPFil');
      if (hisPage) {
        this.filter = hFilter;
        this.pagination.startpageval = hisPage;
        this.groupService.removeitemFromGroupStorage('hP');
        this.groupService.removeitemFromGroupStorage('hPFil');
        chkSrc = false;
      }
    } else {
      this.groupService.removeitemFromGroupStorage('hP');
      this.groupService.removeitemFromGroupStorage('hPFil');
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
    const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
    return label_status;
  }
  selectAllStarted() {
    this.startedAppointmentsChecked = {};
    this.startedChkAppointments = {};
    if (this.chkStartedSelectAppointments) {
      for (let aIndex = 0; aIndex < this.startedCheckins.length; aIndex++) {
        this.chkStartedAptHistoryClicked(aIndex, this.startedCheckins[aIndex]);
      }
    } else {
      this.apptStartedSingleSelection = false;
      this.apptStartedMultiSelection = false;
      this.activeAppointment = null;
    }
  }
  chkStartedAptHistoryClicked(index, appt) {
    if (!this.startedChkAppointments[index]) {
      this.startedChkAppointments[index] = true;
      this.startedAppointmentsChecked[index] = appt;
    } else {
      this.startedChkAppointments[index] = false;
      delete this.startedAppointmentsChecked[index];
      this.chkStartedSelectAppointments = false;
    }
    this.setStartedApptSelections();
  }

  setStartedApptSelections() {
    this.apptSingleSelection = false;
    this.apptStartedMultiSelection = false;
    this.activeAppointment = null;
    const totalAppointmentsSelected = Object.keys(this.startedAppointmentsChecked).length;
    if (totalAppointmentsSelected === this.startedCheckins.length && totalAppointmentsSelected !== 0) {
      this.chkStartedSelectAppointments = true;
    }
    if (totalAppointmentsSelected === 1) {
      this.apptSingleSelection = true;
      Object.keys(this.startedAppointmentsChecked).forEach(key => {
        this.activeAppointment = this.startedAppointmentsChecked[key];
      });
    } else if (totalAppointmentsSelected > 1) {
      this.apptStartedMultiSelection = true;
    }
  }
  selectAllAppoinments() {
    this.appointmentsChecked = {};
    this.chkAppointments = {};
    if (this.chkSelectAppointments) {
      for (let aIndex = 0; aIndex < this.check_in_filtered_list.length; aIndex++) {
        if (this.check_in_filtered_list[aIndex].consumer) {
          this.chkAptHistoryClicked(aIndex, this.check_in_filtered_list[aIndex]);
        }
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
    const _this = this;
    this.loading = true;
    const Mfilter = this.setFilterForApi();
    if (this.groupService.getitemFromGroupStorage('selQ')) {
      this.selQIds = this.groupService.getitemFromGroupStorage('selQ');
    } else {
      this.selQIds = this.getActiveQIdsFromView(this.selectedView);
    }
    console.log(this.active_user);
    console.log('todayselq', this.selQIds);
    console.log('user', this.activeUser);
    console.log('admin', this.admin);
    if (this.selQIds && this.selQIds.length > 0 || this.activeUser) {
      if (this.activeUser) {
        console.log(this.unassignview);
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        }
      }
      else {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          Mfilter['queue-eq'] = this.selQIds;
        }
      }
      this.groupService.setitemToGroupStorage('selQ', this.selQIds);
    }
    if (this.activeQs.length > 0 || this.activeUser || (this.active_user.accountType === 'BRANCH' && this.activeQs.length == 0)) {
      const promise = this.getTodayWLCount(Mfilter);
      promise.then(
        result => {
          _this.chkSelectAppointments = false;
          _this.provider_services.getTodayWaitlist(Mfilter)
            .subscribe(
              (data: any) => {
                _this.appt_list = [];
                _this.appt_list = data;
                _this.todayAppointments = _this.shared_functions.groupBy(_this.appt_list, 'waitlistStatus');
                if (_this.filterapplied === true) {
                  _this.noFilter = false;
                } else {
                  _this.noFilter = true;
                }
                _this.setCounts(this.appt_list);
                _this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
                _this.startedCheckins = this.getActiveAppointments(this.todayAppointments, 'started');
                _this.loading = false;
              },
              () => {
                _this.loading = false;
              },
              () => {
                _this.loading = false;
              });
        },
        () => {
          _this.loading = false;
        });
    } else {
      _this.loading = false;
    }
  }
  getFutureWL() {
    this.resetCheckList();
    this.loading = true;
    this.futureAppointments = [];
    if (this.filter.futurecheckin_date === null) {
      this.getTomorrowDate();
    }
    if (this.groupService.getitemFromGroupStorage('future_selQ')) {
      this.selQIds = this.groupService.getitemFromGroupStorage('future_selQ');
    }
    const Mfilter = this.setFilterForApi();
    // if (this.selected_location && this.selected_location.id) {
    //   Mfilter['location-eq'] = this.selected_location.id;
    // }
    if (this.selQIds && this.selQIds.length > 0 || this.activeUser) {
      if (this.activeUser) {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        }
      } else {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          Mfilter['queue-eq'] = this.selQIds;
        }
      }
      this.groupService.setitemToGroupStorage('future_selQ', this.selQIds);
    }
    if (this.filter.check_in_date != null) {
      Mfilter['date-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_date);
    }
    if (this.activeQs.length > 0 || this.activeUser || (this.active_user.accountType === 'BRANCH' && this.activeQs.length == 0)) {
    const promise = this.getFutureWLCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getFutureWaitlist(Mfilter)
          .subscribe(
            data => {
              this.futureAppointments = this.shared_functions.groupBy(data, 'waitlistStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, this.statusAction);
              this.setFutureCounts(this.futureAppointments);
              this.loading = false;
            },
            () => {
              this.loading = false;
            },
            () => {
              this.loading = false;
            });
      },
      () => {
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }
  setFutureCounts(appointments) {
    this.scheduled_count = this.getActiveAppointments(appointments, 'new').length;
    this.cancelled_count = this.getActiveAppointments(appointments, 'cancelled').length;
  }
  getHistoryWL() {
    this.loading = true;
    let Mfilter = this.setFilterForApi();
    console.log(this.active_user);
    if (this.active_user.accountType === 'BRANCH' && !this.active_user.adminPrivilege && this.active_user.userType !== 5) {
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
        Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.active_user.id;
      } else {
        Mfilter['provider-eq'] = this.active_user.id;
      }
    }
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
      for (const i in this.appointmentsChecked) {
        this.checkin_uuid = this.appointmentsChecked[i];
        if (!this.checkin_uuid.parentUuid) {
          this.billicon = true;
        } else {
          this.billicon = false;
        }
      }
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
    this.groupService.setitemToGroupStorage('pdtyp', this.time_type);
    if (time_type !== 3) {
      this.resetPaginationData();
    } else {
      if (this.activeUser) {

      } else {
        const selectedView = this.groupService.getitemFromGroupStorage('selectedView');
        this.selQIds = this.getActiveQIdsFromView(selectedView);
        this.groupService.setitemToGroupStorage('history_selQ', this.selQIds);
      }

    }
    const stype = this.groupService.getitemFromGroupStorage('pdStyp');
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
    this.today_blocked_count = this.getCount(list, 'blocked');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count + this.today_blocked_count;
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
    const queueid = this.groupService.getitemFromGroupStorage('selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid && queueid !== '') {
        if (this.activeUser) {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        } else {
          Mfilter['queue-eq'] = queueid;
        }
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
    const queueid = this.groupService.getitemFromGroupStorage('future_selQ');
    if (!Mfilter) {
      Mfilter = {};
      if (queueid) {
        if (this.activeUser) {
          if (this.activeUser && this.unassignview) {
            Mfilter['provider-eq'] = null;
          } else {
            if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
              Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
            } else {
              Mfilter['provider-eq'] = this.activeUser;
            }
          }
        } else {
          if (this.unassignview) {
            Mfilter['provider-eq'] = null;
          } else {
            Mfilter['queue-eq'] = queueid;
          }
        }
      } else {
        if (this.activeUser) {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        } else {
          Mfilter['queue-eq'] = this.selQIds;
        }
        this.groupService.setitemToGroupStorage('future_selQ', this.selQIds);
      }
    }
    if (this.selected_location && this.selected_location.id) {
      Mfilter['location-eq'] = this.selected_location.id;
    }
    if (this.filter.waitlist_status === 'all') {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    if (this.filter.check_in_date != null) {
      Mfilter['date-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_date);
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
    if (!Mfilter) {
    //   Mfilter = this.setFilterForApi();
      Mfilter = {};
    }
    if (this.filter.waitlist_status === 'all') {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    if (Mfilter['queue-eq'] && (this.filterQ.length === 0 || this.filter.queue === 'all')) {
      delete Mfilter['queue-eq'];
    }
    console.log(this.active_user);
    if (this.active_user.accountType === 'BRANCH' && !this.active_user.adminPrivilege && this.active_user.userType !== 5) {
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
        Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.active_user.id;
      } else {
        Mfilter['provider-eq'] = this.active_user.id;
      }
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
    this.future_waitlist_count = 0;
    console.log('count', this.activeQs.length);
    if (this.time_type !== 2 && this.activeQs.length > 0) {
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
    if (this.time_type !== 1 && this.activeQs.length > 0) {
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
    if (appointments['blocked']) {
      Array.prototype.push.apply(scheduledList, appointments['blocked'].slice());
    }
    if (this.time_type === 1) {
      this.sortCheckins(scheduledList);
    }
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
    this.groupService.removeitemFromGroupStorage('hP');
    this.groupService.removeitemFromGroupStorage('hPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.groupService.setitemToGroupStorage('hP', pg);
    this.groupService.setitemToGroupStorage('hPFil', this.filter);
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
    this.selectedLabels = [];
    this.paymentStatuses = [];
    this.apptModes = [];
    this.allAgeSlected = false;
    this.allGenderSlected = false;
    this.allServiceSelected = false;
    this.allApptStatusSelected = false;
    this.allPayStatusSelected = false;
    this.allModeSelected = false;
    this.allLabelSelected = false;
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
  getPatientIdFilter(patientid) {
    const idFilter = 'memberJaldeeId::' + patientid;
    return idFilter;
  }
  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }
  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage('wlfilter');
    console.log(filter);
    if (filter) {
      api_filter = filter;
    }
    if (this.time_type === 1) {
      if (this.token && this.time_type === 1) {
        api_filter['token-eq'] = this.token;
      }
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
    if (this.filter.checkinEncId !== '') {
      api_filter['checkinEncId-eq'] = this.filter.checkinEncId;
    }
    if (this.filter.patientId !== '') {
      api_filter['waitlistingFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
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
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
      }
    }
    if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
      api_filter['billPaymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.time_type === 3) {
      if (this.filterQ.length > 0 && this.filter.queue !== 'all') {

        if (this.activeUser) {
          api_filter['provider-eq'] = this.activeUser;
        } else {
          api_filter['queue-eq'] = this.filterQ.toString();
        }
      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
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
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
    }
    return api_filter;
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    this.groupService.setitemToGroupStorage('paginationStart', this.pagination.startpageval);
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('wlfilter');
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.checkinEncId || this.filter.patientId || this.filter.service !== 'all' || this.filter.location != 'all'
      || this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.waitlistMode !== 'all' || this.filter.check_in_start_date
      || this.filter.check_in_end_date || this.filter.check_in_date || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.filter.waitlist_status !== 'all' || this.labelFilterData !== ''
      || this.allAgeSlected || this.allGenderSlected || this.allServiceSelected || this.allApptStatusSelected
      || this.allPayStatusSelected || this.allModeSelected || this.allLabelSelected || this.allQSelected || this.allLocationSelected) {
      console.log('fdg');
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    console.log(this.filterapplied);
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
      patientId: false,
      queue: false,
      location: false,
      service: false,
      waitlist_status: false,
      payment_status: false,
      waitlistMode: false,
      check_in_start_date: false,
      check_in_end_date: false,
      check_in_date: false,
      location_id: false,
      age: false,
      gender: false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      checkinEncId: '',
      patientId: '',
      queue: 'all',
      location: 'all',
      service: 'all',
      waitlist_status: 'all',
      payment_status: 'all',
      waitlistMode: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      check_in_date: null,
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
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }
  getDisplayname(label) {
    for (let i = 0; i < this.allLabels.length; i++) {
      if (this.allLabels[i].label === label) {
        return this.allLabels[i].displayName;
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
    Object.keys(this.selectedLabels).forEach(key => {
      if (this.selectedLabels[key].length > 0) {
        count++;
        if (!this.labelFilterData.includes(key)) {
          if (count === 1) {
            this.labelFilterData = this.labelFilterData + key + '::' + this.selectedLabels[key].join(',');
          } else {
            this.labelFilterData = this.labelFilterData + '$' + key + '::' + this.selectedLabels[key].join(',');
          }
        }
      } else {
        delete this.selectedLabels[key];
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
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  deleteLabel(label, checkinId) {
    this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
      this.loadApiSwitch('');
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    this.closebutton.nativeElement.click();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'checkin'
      }
    };
    this.router.navigate(['provider', 'settings', 'general', 'customview'], navigationExtras);
  }
  gotoUser() {
    this.router.navigate(['provider', 'settings', 'general', 'users']);
  }
  checkinClicked(source) {
    if (this.queues.length === 0) {
      this.snackbarService.openSnackBar('No active queues', { 'panelClass': 'snackbarerror' });
    } else if (this.services.length === 0) {
      this.snackbarService.openSnackBar('No active services', { 'panelClass': 'snackbarerror' });
    } else {
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
        }
      };
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    }
  }
  searchCustomer() {
    this.router.navigate(['provider', 'customers', 'find']);
  }
  showAdjustDelay() {
    if (this.queues.length === 0) {
      this.snackbarService.openSnackBar('Delay can be applied only for active queues', { 'panelClass': 'snackbarerror' });
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
    this.lStorageService.setitemonLocalStorage('wlfilter', this.setFilterForApi());
    if (this.time_type === 3) {
      this.groupService.setitemToGroupStorage('hP', this.filter.page || 1);
      this.groupService.setitemToGroupStorage('hPFil', this.filter);
    }
    this.router.navigate(['provider', 'check-ins', checkin.ynwUuid], { queryParams: { timetype: this.time_type } });
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
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
      if (type === 'check_in_start_date' || type === 'check_in_end_date' || type === 'check_in_date') {
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
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  playSound(checkin, count) {
    const _this = this;
    let tokenNo = 1;
    if (checkin.token) {
      tokenNo = checkin.token;
    }
    this.speech.setLanguage('en-IN');
    this.speech.speak({
      text: 'Token Number ' + tokenNo + checkin.waitlistingFor[0].firstName + ' ' + checkin.waitlistingFor[0].lastName,
      queue: false,
      listeners: {
        onstart: () => {
        },
        onend: () => {
          count++;
          if (count !== 3) {
            _this.playSound(checkin, count);
          }
        },
        onresume: () => {
        },
        onboundary: event => {
        }
      }
    }).then(() => {
    }).catch(e => {
    });
  }
  callingWaitlist(checkin) {
    if (checkin.showToken) {
      if (!checkin.callingStatus) {
        const speechSupported = this.lStorageService.getitemfromLocalStorage('speech');
        if (speechSupported) {
          this.playSound(checkin, 0);
        }
      } else {
        this.speech.pause();
      }
      const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
      this.provider_services.setCallStatus(checkin.ynwUuid, status).subscribe(
        () => {
          this.loadApiSwitch('reloadAPIs');
        });
    }
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
              if (this.providerLabels.length > 0) {
                checkin_html += '<td style="padding:10px;">Label</td>';
              }
              checkin_html += '</thead>';
              for (let i = 0; i < this.historyCheckins.length; i++) {
                const fname = (this.historyCheckins[i].waitlistingFor[0].firstName) ? this.historyCheckins[i].waitlistingFor[0].firstName : '';
                const lname = (this.historyCheckins[i].waitlistingFor[0].lastName) ? this.historyCheckins[i].waitlistingFor[0].lastName : '';
                checkin_html += '<tr style="line-height:20px;padding:10px">';
                checkin_html += '<td style="padding:10px">' + (this.historyCheckins.indexOf(this.historyCheckins[i]) + 1) + '</td>';
                checkin_html += '<td style="padding:10px">' + moment(this.historyCheckins[i].date).format(projectConstants.DISPLAY_DATE_FORMAT) + ' ' + this.historyCheckins[i].checkInTime + '</td>';
                checkin_html += '<td style="padding:10px">' + fname + ' ' + lname + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].service.name + '</td>';
                if (this.historyCheckins[i].label && Object.keys(this.historyCheckins[i].label).length > 0) {
                  const labels = [];
                  Object.keys(this.historyCheckins[i].label).forEach(key => {
                    labels.push(this.getDisplayname(key));
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
    this.qrCodegeneration(checkinlist);
    const fname = (checkinlist.waitlistingFor[0].firstName) ? checkinlist.waitlistingFor[0].firstName : '';
    const lname = (checkinlist.waitlistingFor[0].lastName) ? checkinlist.waitlistingFor[0].lastName : '';
    const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
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
      if (fname !== '' || lname !== '') {
        checkin_html += '<tr><td width="48%" align="right">Customerccc</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
      }
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
  }
  goToCheckinDetails() {
    const _this = this;
    Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
      const checkin = _this.appointmentsChecked[apptIndex];
      _this.router.navigate(['provider', 'check-ins', checkin.ynwUuid]);
    });
  }
  changeWaitlistStatus(status, action, wtlst?) {
    let waitlist;
    const _this = this;
    if (wtlst) {
      waitlist = wtlst;
    } else {
      if (status === 'started') {
        Object.keys(_this.startedAppointmentsChecked).forEach(apptIndex => {
          waitlist = _this.startedAppointmentsChecked[apptIndex];
        });
      } else {
        Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
          waitlist = _this.appointmentsChecked[apptIndex];
        });
      }
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
    this.statusChangeClicked = true;
    this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.statusChangeClicked = false;
          this.loadApiSwitch(result);
        }, error => {
          this.statusChangeClicked = false;
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
  keyPressed() {
    this.lStorageService.removeitemfromLocalStorage('wlfilter');
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.checkinEncId || this.filter.patientId || this.filter.service !== 'all' || this.filter.location != 'all'
      || this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.waitlistMode !== 'all' || this.filter.check_in_start_date
      || this.filter.check_in_end_date || this.filter.check_in_date || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.filter.waitlist_status !== 'all' || this.labelFilterData !== ''
      || this.allAgeSlected || this.allGenderSlected || this.allServiceSelected || this.allApptStatusSelected
      || this.allPayStatusSelected || this.allModeSelected || this.allLabelSelected || this.allQSelected || this.allLocationSelected) {
      console.log('fdg');
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    console.log(this.filterapplied);
    this.shared_functions.setFilter();
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  getVirtualMode(virtualService) {
    return Object.keys(virtualService)[0];
  }
  showConsumerNote(checkin) {
    this.notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        type: 'checkin'
      }
    });
    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  getProviders() {
    const _this = this;
    return new Promise<void>(function (resolve) {
      const apiFilter = {};
      apiFilter['userType-eq'] = 'PROVIDER';
      _this.provider_services.getUsers(apiFilter).subscribe(data => {
        _this.users = data;
        const tempUser = {};
        tempUser['firstName'] = 'All';
        tempUser['id'] = 'all';
        if (_this.groupService.getitemFromGroupStorage('selectedUser')) {
          _this.selectedUser = _this.groupService.getitemFromGroupStorage('selectedUser');
        } else {
          _this.selectedUser = tempUser;
        }
        resolve();
      },
        () => {
          resolve();
        });
    });
  }

  getTeams() {
    const _this = this;
    return new Promise<void>(function (resolve) {
      _this.provider_services.getTeamGroup().subscribe(data => {
        _this.teams = data;
      },
        () => {
          resolve();
        });
    });
  }


  handleUserSelection(user) {
    this.activeUser = null;
    this.qloading = true;
    this.resetFields();
    this.groupService.setitemToGroupStorage('selectedUser', user);
    this.selectedUser = user;
    this.getQsByProvider(user);
  }
  getQsByProvider(user?) {
    const qs = [];
    if (!user || (user && user === 'all')) {
      this.activeQs = this.tempActiveQs;
    } else {
      this.activeUser = user.id;
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
      for (const q of this.activeQs) {
        qids.push(q.id);
      }
      this.selQIds = qids;
    }
    setTimeout(() => {
      this.qloading = false;
    }, 1000);
    if (this.time_type === 1) {
      this.groupService.setitemToGroupStorage('selQ', this.selQIds);
    } else if (this.time_type === 2) {
      this.groupService.setitemToGroupStorage('future_selQ', this.selQIds);
    } else {
      this.groupService.setitemToGroupStorage('history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }
  gotoUnassign() {
    this.unassignview = true;
    this.loadApiSwitch('reloadAPIs');
  }
  openAttachmentGallery(checkin) {
    this.provider_services.getProviderWaitlistAttachmentsByUuid(checkin.ynwUuid).subscribe(
      (communications: any) => {
        this.image_list_popup_temp = [];
        this.image_list_popup = [];
        let count = 0;
        for (let comIndex = 0; comIndex < communications.length; comIndex++) {
          const thumbPath = communications[comIndex].thumbPath;
          let imagePath = thumbPath;
          const description = communications[comIndex].s3path;
          const caption = communications[comIndex].caption;
          const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
          if (new RegExp(this.imageAllowed.join("|")).test(thumbPathExt.toUpperCase())) {
            imagePath = communications[comIndex].s3path;
          }
          let type = communications[comIndex].type.split('/');
          type = type[0];
          if (type !== 'image') {
            imagePath = communications[comIndex].thumbPath;
          }
          console.log(imagePath);
          const imgobj = new Image(
            count,
            { // modal
              img: imagePath,
              description: caption || ''
            },
          );
          this.image_list_popup_temp.push(imgobj);
          count++;
        }
        if (count > 0) {
          this.image_list_popup = this.image_list_popup_temp;
          setTimeout(() => {
            this.openImageModalRow(this.image_list_popup[0]);
          }, 500);
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
    return new Promise<void>((resolve) => {
      this.provider_services.getGlobalSettings().subscribe(
        (data: any) => {
          this.checkinStatus = data.waitlist;
          resolve();
        });
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
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
    return new Promise<void>((resolve) => {
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

  showCheckinActions(status, checkin?) {
    let waitlist = [];
    if (checkin) {
      waitlist = checkin;
    } else {
      if (status === 'started') {
        Object.keys(this.startedAppointmentsChecked).forEach(apptIndex => {
          waitlist.push(this.startedAppointmentsChecked[apptIndex]);
        });
      } else {
        Object.keys(this.appointmentsChecked).forEach(apptIndex => {
          waitlist.push(this.appointmentsChecked[apptIndex]);
        });
      }
    }
    let multiSelection;
    if (checkin) {
      multiSelection = false;
    } else {
      if (status === 'started') {
        multiSelection = this.apptStartedMultiSelection;
      } else {
        multiSelection = this.apptMultiSelection;
      }
    }
    const actiondialogRef = this.dialog.open(CheckinActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        checkinData: waitlist,
        timetype: this.time_type,
        multiSelection: multiSelection,
        status: status,
        labelFilterData: this.labelFilterData,
        labelsCount: this.labelsCount
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      if (data === 'reload') {
        this.chkSelectAppointments = false;
        this.chkStartedSelectAppointments = false;
        this.getLabel();
        this.loadApiSwitch('');
      }
    });
  }
  statusClick(status) {
    this.statusLoaded = true;
    this.allSelection = false;
    this.statusAction = status;
    this.groupService.setitemToGroupStorage('action', this.statusAction);
    this.chkSelectAppointments = false;
    this.chkStartedSelectAppointments = false;
    this.resetCheckList();
    if (this.time_type === 1) {
      this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, status);
    } else {
      this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, status);
    }
    setTimeout(() => {
      this.statusLoaded = false;
    }, 500);
  }
  tabChange(event) {
    this.lStorageService.removeitemfromLocalStorage('wlfilter');
    this.resetCheckList();
    this.chkSelectAppointments = false;
    this.chkStartedSelectAppointments = false;
    this.allStartedSelection = false;
    this.allSelection = false;
    this.loading = true;
    this.hideFilterSidebar();
    this.setTimeType(event.index + 1);
  }
  CreateVoiceCall(wtlst?) {
    let waitlist;
    waitlist = wtlst.ynwUuid;
    this.voicedialogRef = this.dialog.open(VoicecallDetailsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: waitlist
      }
    });
  }
  onButtonBeforeHook() { }
  onButtonAfterHook() { }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  gotoCustomerDetails(waitlist) {
    this.lStorageService.setitemonLocalStorage('wlfilter', this.setFilterForApi());
    console.log(this.setFilterForApi());
    if (waitlist.waitlistStatus !== 'blocked') {
      this.router.navigate(['/provider/customers/' + waitlist.waitlistingFor[0].id]);
    }
  }
  stopprop(event) {
    event.stopPropagation();
  }
  _initSpeech() {
    this.speech = new Speech();
    if (this.speech.hasBrowserSupport()) { // returns a boolean
      this.lStorageService.setitemonLocalStorage('speech', true);
      this.speech
        .init({
          volume: 0.5,
          lang: 'en-GB',
          rate: 1,
          pitch: 1,
          listeners: {
            onvoiceschanged: voices => {
            }
          }
        })
        .then(data => {
        })
        .catch(e => {
        });
    }
  }
  addCustomerDetails(checkin) {
    let virtualServicemode;
    let virtualServicenumber;
    if (checkin.virtualService) {
      Object.keys(checkin.virtualService).forEach(key => {
        virtualServicemode = key;
        virtualServicenumber = checkin.virtualService[key];
      });
    }
    this.router.navigate(['provider', 'check-ins', 'add'], { queryParams: { source: 'waitlist-block', uid: checkin.ynwUuid, showtoken: this.showToken, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: checkin.service.id, waitlistMode: checkin.waitlistMode } });
  }
  showSelectAll() {
    if (this.check_in_filtered_list.length > 1) {
      const filterArray = this.check_in_filtered_list.filter(appt => appt.consumer);
      if (filterArray.length > 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  cardClicked(event) {
    console.log(event);
    if (event.type === 'note') {
      this.showConsumerNote(event.waitlist);
    } else if (event.type === 'attachment') {
      this.showAttachments(event.waitlist);
    } else if (event.type === 'actions') {
      this.showCheckinActions(event.statusAction, event.waitlist);
    }
  }
  showAttachments(wailtist) {
    this.provider_services.getProviderWaitlistAttachmentsByUuid(wailtist.ynwUuid).subscribe(
      (communications: any) => {
        this.showattachmentDialogRef = this.dialog.open(AttachmentPopupComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            attachments: communications
          }
        });
      });
  }
  isuserAvailableNow() {
    console.log(this.active_user.id);
    this.shared_services.isuserAvailableNow(this.active_user.id)
      .subscribe(data => {
        this.qAvailability = data;
        console.log(this.qAvailability);
        if (this.qAvailability.availableNow) {
          this.instaQid = this.qAvailability.instanceQueueId;
        }
        this.apiloading = false;
      },
        () => {
        });
  }
  redirectinstantQ() {
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    const userid = loggedUser.id
    if (loggedUser.adminPrivilege) {
      this.router.navigate(['provider', 'settings', 'q-manager', 'queues']);
    } else {
      this.router.navigate(['provider', 'settings', 'general', 'users', userid, 'settings', 'queues']);
    }
  }
  createInstantQ() {
    if (this.qAvailability.availableNow) {
      const msg = 'Make myself unavailable today from ' + this.qAvailability.timeRange.sTime + ' to ' + this.qAvailability.timeRange.eTime + ' ?';
      const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': msg,
          'type': 'yes/no'
        }
      });
      dialogrefd.afterClosed().subscribe(result => {
        if (result && this.instaQid) {
          this.apiloading = true;
          this.provider_services.terminateInstantQ(this.instaQid)
            .subscribe(() => {
              this.isuserAvailableNow();
            },
              error => {
                this.apiloading = false;
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              });
        }
      });
    } else {
      const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
      console.log(loggedUser);
      this.instantdialogRef = this.dialog.open(instantQueueComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          location: this.selected_location,
          userId: loggedUser.id,
          instaQid: this.instaQid
        }
      });
      this.instantdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          this.isuserAvailableNow();
        }
      });
    }
  }
  getAge(age) {
    age = age.split(' ');
    return age[0];
  }
  getUsersList(teamid) {
    const userObject = this.teams.filter(user => parseInt(user.id) === teamid);
    if (userObject[0] && userObject[0].name) {
      return userObject[0].name;
    }
  }
}
