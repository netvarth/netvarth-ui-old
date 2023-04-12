import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SubSink } from "subsink";
import { S3UrlProcessor } from "../../../../shared/services/s3-url-processor.service";
import { WordProcessor } from "../../../../shared/services/word-processor.service";
import { DateTimeProcessor } from "../../../../shared/services/datetime-processor.service";
import { SharedServices } from "../../../../shared/services/shared-services";
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";
import { SnackbarService } from "../../../../shared/services/snackbar.service";
import { SharedFunctions } from "../../../../shared/functions/shared-functions";
import { AuthService } from "../../../../shared/services/auth-service";
import { GroupStorageService } from "../../../../shared/services/group-storage.service";
import { CustomerService } from "../../../../shared/services/customer.service";
import { JcCouponNoteComponent } from "../../../../shared/modules/jc-coupon-note/jc-coupon-note.component";
import { MatDialog } from "@angular/material/dialog";
import { projectConstants } from "../../../../app.component";
import { Messages } from "../../../../shared/constants/project-messages";
import { ConsumerEmailComponent } from "../../../../ynw_consumer/shared/component/consumer-email/consumer-email.component";
import { PaytmService } from "../../../../shared/services/paytm.service";
import { RazorpayService } from "../../../../shared/services/razorpay.service";
import { Location } from "@angular/common";
import { ProviderServices } from "../../../../business/services/provider-services.service";
import { FileService } from "../../../../shared/services/file-service";
import { QnrDialogComponent } from "../../../../../../src/app/shared/components/qnr-dialog/qnr-dialog.component";
import { DomainConfigGenerator } from "../../../../shared/services/domain-config-generator.service";
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
@Component({
  selector: 'app-consumer-appointment',
  templateUrl: './consumer-appointment.component.html',
  styleUrls: ['./consumer-appointment.component.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class ConsumerAppointmentComponent implements OnInit, OnDestroy {
  coupon_notes = projectConstantsLocal.COUPON_NOTES;  
  private subs = new SubSink();

  scheduledAppmtId  // scheduled appointment id for reschedule
  selectedTime;     // To hold the appointment time
  locationId;       // Location id where appointment to take
  dateChanged;      // To check whether appt is for current day or not
  isFutureDate;     // To know taken appt day is for future or today
  accountId;        // To hold the Account Id
  uniqueId;         // To hold the S3 Unique Id
  appmtDate;        // Appointment Date;
  isTeleService;    // To know service is Virtual Service or not
  businessInfo: any = {}; // To hold Business Name, Location, Map Url etc.
  selectedUser;     // Appointment for which user/doctor
  selectedUserId;   // Appointment for which user/doctor id
  selectedServiceId;// Id of the appointment service
  selectedDept;     // Department of the selected service
  selectedDeptId;     // Department Id of the selected service
  departmentEnabled;// Department Enabled or not
  theme;            // Selected Theme
  customId;         // To know whether req came from customapp/qr link
  smallDevice;      // To know whether device is mobile or desktop
  serverDate;       // To store the server date

  terminologies;    // To hold the terminology json
  appointmentSettings: any = []; // To store appointment settings
  businessProfile;  // To store the business profile json
  accountType;      // To know the account type Branch/Individual SP/SP User etc
  appointmentType;  // Reschedule or not
  multipleSelection;// To allow multiple slot selection or not
  scheduledAppointment;// To store the scheduled appointment for rescheduled
  users;            // To store the users/providers/doctors
  selectedSlots: any = [] // To hold the appointment slots selected

  s3CouponsList: any = { JC: [], OWN: [] };    // To store the coupons list available in s3
  showCouponWB;     // To show hide the Coupon Work Bench area

  note_placeholder; // To hold the Place holder text for note text area according to domain
  note_cap = '';    // To hold the caption for note text area
  consumerNote = '';// consumer note input

  loggedIn = true;  // To check whether user logged in or not
  loading = true;
  consumer_label: any;

  loadingService = true;   // To check whether service details is fetched or not
  loadingS3 = true;        // To check whether s3 url call completed or not

  services: any;    // To store services json
  selectedService: any; // To store selected appointment service details
  callingModes: any = []; // To store the teleservice calling mode whatsapp/jaldee video/zoom etc
  changePhone;     // Change phone number or not
  departments: any = [];     // departments

  allSlots;       // All slots for a particular schedule
  freeSlots: any = [];      // All available slots in custom manner

  availableDates: any = []; // to show available appointment dates in calendar
  bookStep;       // To show the steps onetime info/slot selection/ take appt/questionaire etc
  callingModesDisplayName = projectConstantsLocal.CALLING_MODES; // calling modes list-whatsapp/phone/zoom/googlemeet/jaldeevideo etc.
  isSlotAvailable = false; // To set slot availability
  selectedApptsTime;
  oneTimeInfo: any; // One time information
  onetimeQuestionnaireList: any; // one time information questionaire list
  questionAnswers; // questionaire answers
  questionnaireList: any = []; // normal questionaire list
  questionnaireLoaded = false; // to check questionaire loaded or not
  appmtFor: any = []; // to hold the whom for appointment
  parentCustomer: any;// logged in customer
  commObj: any = {}; // communication object
  familyMembers: any = []; // hold the members
  providerConsumerId; // id of the selected provider consumer
  providerConsumerList: any;
  addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };

  balanceAmount: any;
  paymentDetails: any = [];
  selectedDate: Date = new Date();
  selectedCoupons: any = [];
  selectedCoupon: any;
  couponValid = true;
  couponError = null;
  couponsList: any = [];

  trackUuid: any;
  prepayAmount: any;
  checkJcash = false;
  checkJcredit = false;
  jaldeecash: any;
  jcashamount: any;
  jcreditamount: any;
  paymentLength = 0;
  payAmount: number;
  remainingadvanceamount;
  isInternational: boolean;
  paymentMode: any;
  paytmEnabled: boolean;
  razorpayEnabled: boolean;
  interNationalPaid: boolean;
  paymentmodes: any;
  isPayment: boolean;
  indian_payment_modes: any;
  non_indian_modes: any;
  shownonIndianModes: boolean;
  priceList: any;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  @ViewChild('consumer_appointment') paytmview;
  paymentRequestId;
  // paymentBtnDisabled = false;

  imgCaptions: any = [];
  @ViewChild('imagefile') fileInput: ElementRef;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  }; // storing message to be uploaded
  @ViewChild('modal') modal; // referring modal object
  @ViewChild('closebutton') closebutton;
  action = ''; // To navigate between different actions like note/upload/add familymember/members etc

  checkPolicy = true;
  heartfulnessAccount = false; // This one should be removed
  isClickedOnce = false;
  apiError = '';
  apiSuccess = '';
  emailError = null;
  phoneError: string;
  whatsappError = '';
  disable: boolean;
  appointmentIdsList: any[];
  wallet: any;
  pGateway: any;
  loadingPaytm: boolean;
  from: string;
  api_loading_video;
  serviceCost: any;
  prepaymentAmount: number;
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  add_member_cap = Messages.ADD_MEMBER_CAP;
  tooltipcls = '';
  slotLoaded = false;
  btnClicked = false // To avoid double click
  apptDetails_firstName;
  apptDetails_lastName;
  convenientPaymentModes: any = [];
  convenientFeeObj: any;
  convenientFee: any;
  paymentReqInfo: any = {}
  gatewayFee: any;
  profileId: any;
  serviceOPtionInfo: any;
  serviceOptionQuestionnaireList: any;
  groupedQnr: any;
  finalDataToSend: any;
  serviceOptionApptt = false;
  showSlot = true;
  showNext = false;
  serviceTotalPrice: number;
  total_servicefee: number;
  readMore = false;
  advPostData: any;
  accountConfig: any;
  selectedDay: string;
  jCouponMsg: any;
  login_details: any;
  login_countryCode: any;
  serviceOptDetails: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private s3Processor: S3UrlProcessor,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private sharedServices: SharedServices,
    private snackbarService: SnackbarService,
    private sharedFunctions: SharedFunctions,
    private authService: AuthService,
    private groupService: GroupStorageService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private router: Router,
    private paytmService: PaytmService,
    private razorpayService: RazorpayService,
    private ngZone: NgZone,
    private location: Location,
    private providerServices: ProviderServices,
    private cdRef: ChangeDetectorRef,
    private fileService: FileService,
    private configService: DomainConfigGenerator,
    public shared_functions: SharedFunctions,
  ) {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(
      params => {
        if (params.ctime) {
          this.selectedTime = params.ctime
          console.log('Selected Time: ', params.ctime);
        }
        this.locationId = params.loc_id;
        if (params.locname) {
          this.businessInfo['locationName'] = params.locname;
          this.businessInfo['googleMapUrl'] = params.googleMapUrl;
        }
        this.dateChanged = params.cur;
        this.accountId = params.account_id;
        this.uniqueId = params.unique_id;
        this.appmtDate = params.sel_date;
        this.selectedDay = params.sel_date;
        if (params.service_id) { this.selectedServiceId = parseInt(params.service_id); }
        if (params.user) {
          this.selectedUserId = params.user;
        }
        if (params.dept) {
          this.selectedDeptId = parseInt(params.dept);
          this.departmentEnabled = true;
        }
        this.isTeleService = params.tel_serv_stat;
        if (params.theme) {
          this.theme = params.theme;
        }
        if (params.customId) {
          this.customId = params.customId;
        }
        if (params.type === 'reschedule') {
          this.appointmentType = params.type;
          this.scheduledAppmtId = params.uuid;
          // if (this.scheduledAppmtId) {
          //     this.setRescheduleInfo(this.scheduledAppmtId);
          // }
        }
        if (params.isFrom && params.isFrom == 'providerdetail') {
          this.from = 'providerdetail';
        }

      })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 767) {
      this.smallDevice = true;
    } else {
      this.smallDevice = false;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getRescheduledInfo() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (!_this.scheduledAppmtId) {
        resolve(true);
      } else {
        _this.setRescheduleInfo(_this.scheduledAppmtId).then(
          () => {
            resolve(true);
          }
        )
      }
    })

  }
  ngOnInit(): void {
    this.login_details =this.shared_functions.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials')); 
    if(this.login_details && this.login_details.countryCode){
      this.login_countryCode = this.login_details.countryCode;
    }
    
    const _this = this;
    this.onResize();
    this.serverDate = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.selectedDay = this.dateTimeProcessor.getStringFromDate_YYYYMMDD(this.serverDate);
    console.log("Selected Date :", this.selectedDay);

    if (this.appmtDate) {
      this.isFutureDate = this.dateTimeProcessor.isFutureDate(this.serverDate, this.appmtDate);
    }
    _this.configService.getUIAccountConfig(this.uniqueId).subscribe(
      (uiconfig: any) => {
        _this.accountConfig = uiconfig;
      });
    // Collecting informations from s3 businessProfile, settings etc.
    this.gets3urls().then(
      () => {
        _this.slotLoaded = false;
        _this.getRescheduledInfo().then(() => {
          if (_this.selectedServiceId) { _this.getPaymentModes(); }
          _this.getServicebyLocationId(_this.locationId, _this.appmtDate);
          _this.getSchedulesbyLocationandServiceIdavailability(_this.locationId, _this.selectedServiceId, _this.accountId);
        });
      }
    );
    this.serviceOPtionInfo = this.lStorageService.getitemfromLocalStorage('serviceOPtionInfo');
    this.getServiceOptions()
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  getServiceOptions() {
    this.subs.sink = this.sharedServices.getServiceoptionsAppt(this.selectedServiceId, this.accountId)
      .subscribe(
        (data) => {
          if (data) {
            this.serviceOptionQuestionnaireList = data;
            if (this.serviceOptionQuestionnaireList.questionnaireId && this.appointmentType !== 'reschedule') {
              this.serviceOptionApptt = true;
              this.bookStep = 1;
            }
            else {
              this.bookStep = 2;
            }

          }
        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.btnClicked = false;
        });
  }
  gets3urls() {
    const _this = this;
    _this.loadingS3 = true;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'settings,terminologies,coupon,providerCoupon,businessProfile,departmentProviders,appointmentsettings';
      _this.subs.sink = _this.s3Processor.getJsonsbyTypes(_this.uniqueId,
        null, accountS3List).subscribe(
          (accountS3s) => {
            // if (accountS3s['settings']) {
            //     this.processS3s('settings', accountS3s['settings']);
            // }
            if (accountS3s['appointmentsettings']) {
              _this.processS3s('appointmentsettings', accountS3s['appointmentsettings']);
            }
            if (accountS3s['terminologies']) {
              _this.processS3s('terminologies', accountS3s['terminologies']);
            }
            if (accountS3s['coupon']) {
              _this.processS3s('coupon', accountS3s['coupon']);
            }
            if (accountS3s['providerCoupon']) {
              _this.processS3s('providerCoupon', accountS3s['providerCoupon']);
            }
            if (accountS3s['departmentProviders']) {
              _this.processS3s('departmentProviders', accountS3s['departmentProviders']);
            }
            if (accountS3s['businessProfile']) {
              _this.processS3s('businessProfile', accountS3s['businessProfile']);
            }
            _this.loadingS3 = false;
            resolve(true);
          }
        );
    })

  }
  processS3s(type, res) {
    // const _this = this;
    let result = this.s3Processor.getJson(res);
    switch (type) {
      // case 'settings': {
      //     this.settingsjson = result;
      //     this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
      //     break;
      // }
      case 'appointmentsettings': {
        this.appointmentSettings = result;
        break;
      }
      case 'terminologies': {
        this.terminologies = result;
        this.wordProcessor.setTerminologies(this.terminologies);
        this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
        break;
      }
      case 'businessProfile': {
        this.businessProfile = result;
        this.businessInfo['businessName'] = this.businessProfile.businessName;

        if (!this.businessInfo['locationName']) {
          this.businessInfo['locationName'] = this.businessProfile.baseLocation?.place;
        }
        if (!this.businessInfo['googleMapUrl']) {
          this.businessInfo['googleMapUrl'] = this.businessProfile.baseLocation?.googleMapUrl;
        }
        if (this.businessProfile['logo']) {
          this.businessInfo['logo'] = this.businessProfile['logo'];
        }
        if (this.businessProfile.uniqueId === 128007) {
          this.heartfulnessAccount = true;
        }
        const domain = this.businessProfile.serviceSector.domain;
        if (domain === 'foodJoints') {
          this.note_placeholder = 'Item No Item Name Item Quantity';
          this.note_cap = 'Add Note / Delivery address';
        } else {
          this.note_placeholder = '';
          this.note_cap = 'Add Note';
        }
        // this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
        break;
      }
      case 'coupon': {
        this.s3CouponsList.JC = result;
        if (this.s3CouponsList.JC.length > 0) {
          this.showCouponWB = true;
        }
        break;
      }
      case 'providerCoupon': {
        this.s3CouponsList.OWN = result;
        if (this.s3CouponsList.OWN.length > 0) {
          this.showCouponWB = true;
        }
        break;
      }
      case 'departmentProviders': {
        let deptProviders: any = [];
        this.users = [];
        deptProviders = result;
        if (!this.departmentEnabled) {
          this.users = deptProviders;
        } else {
          this.departments = deptProviders;
          deptProviders.forEach(depts => {
            if (depts.users.length > 0) {
              this.users = this.users.concat(depts.users);
            }
          });
        }
        break;
      }
    }
  }
  setDepartmentDetails(departmentId) {
    console.log("Departments:", this.departments);
    const deptDetail = this.departments.filter(dept => dept.departmentId === departmentId);
    this.selectedDept = deptDetail[0];
  }

  /**
   * To Fetch and Set the Current Provider User Details
   * @param selectedUserId
   */
  setUserDetails(selectedUserId) {
    const userDetail = this.users.filter(user => user.id === selectedUserId);
    this.selectedUser = userDetail[0];
  }

  goBack(type?) {
    if (type) {
      console.log(this.bookStep);
      if (this.bookStep === 5 && this.selectedService.noDateTime) {
        this.goToStep('prev');
      }
      if (this.bookStep === 1) {
        let source = this.lStorageService.getitemfromLocalStorage('source');
        if (source) {
          window.location.href = source;
          this.lStorageService.removeitemfromLocalStorage('reqFrom');
          this.lStorageService.removeitemfromLocalStorage('source');
        } else {
          this.location.back();
        }
      } else {
        if (this.bookStep === 2 && !this.serviceOptionApptt) {
          let source = this.lStorageService.getitemfromLocalStorage('source');
          if (source) {
            window.location.href = source;
            this.lStorageService.removeitemfromLocalStorage('reqFrom');
            this.lStorageService.removeitemfromLocalStorage('source');
          } else {
            this.location.back();
          }
        } else {
          this.goToStep('prev');
        }

      }
    }
    if (this.action !== 'addmember') {
      this.closebutton.nativeElement.click();
    }
    setTimeout(() => {
      if (this.action === 'note' || this.action === 'members' || (this.action === 'service' && !this.departmentEnabled)
        || this.action === 'attachment' || this.action === 'coupons' || this.action === 'departments' ||
        this.action === 'phone' || this.action === 'email') {
        this.action = '';
      } else if (this.action === 'addmember') {
        this.action = 'members';
      } else if (this.action === 'service' && this.departmentEnabled) {
        this.action = '';
      } else if (this.action === 'preInfo') {
        this.action = '';
      }
    }, 500);
  }



  actionPerformed(status) {
    if (!this.serviceOptionApptt) {
      const _this = this;
      if (status === 'success') {
        _this.initAppointment().then(
          (status) => {
            const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
            _this.getOneTimeInfo(activeUser, _this.accountId).then(
              (questions) => {
                console.log("Questions:", questions);
                if (questions) {
                  _this.onetimeQuestionnaireList = questions;
                  console.log("OneTime:", _this.onetimeQuestionnaireList);


                  if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                    _this.bookStep = 3;
                  } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                    _this.bookStep = 4;
                  } else {
                    _this.bookStep = 5;
                    this.confirmAppointment('next');
                  }
                  console.log("Bookstep3:", _this.bookStep);
                } else {
                  if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                    _this.bookStep = 4;
                  } else {
                    _this.bookStep = 5;
                    this.confirmAppointment('next');
                  }
                }
                _this.loggedIn = true;
                // _this.loading = false;
              }
            )
          }
        );
      }
    }
    else {
      const _this = this;
      if (status === 'success') {
        _this.initAppointment().then(
          (status) => {
            const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
            _this.getOneTimeInfo(activeUser, _this.accountId).then(
              (questions) => {
                console.log("Questions:", questions);
                if (questions) {
                  _this.onetimeQuestionnaireList = questions;
                  console.log("OneTime:", _this.onetimeQuestionnaireList);
                  if (this.showSlot) {
                    _this.bookStep = 2;
                  }

                  else if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                    _this.bookStep = 3;
                  } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                    _this.bookStep = 4;
                  } else {
                    _this.bookStep = 5;
                    this.confirmAppointment('next');
                  }
                  console.log("Bookstep3:", _this.bookStep);
                } else {
                  if (this.showSlot) {
                    _this.bookStep = 2;
                  }
                  else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                    _this.bookStep = 4;
                  } else {
                    _this.bookStep = 5;
                    this.confirmAppointment('next');
                  }
                }
                _this.loggedIn = true;
                // _this.loading = false;
              }
            )
          }
        );
      }
    }

  }

  getServicebyLocationId(locationId, appmtDate) {
    const _this = this;
    _this.loadingService = true;
    _this.subs.sink = _this.sharedServices.getServicesforAppontmntByLocationId(locationId)
      .subscribe(data => {
        _this.services = data;
        console.log("Service By Loc :", data);
        _this.selectedService = [];
        if (_this.selectedServiceId) {
          _this.selectedServiceId = _this.selectedServiceId;
        } else {
          if (_this.services.length > 0) {
            _this.selectedServiceId = _this.services[0].id; // set the first service id to the holding variable
          }
        }
        if (_this.selectedServiceId) {
          _this.setServiceDetails(this.selectedServiceId);
          _this.getAvailableSlotByLocationandService(locationId, _this.selectedServiceId, appmtDate, _this.accountId, 'init');
        }
        _this.loadingService = false;
      },
        () => {
          _this.loadingService = false;
          _this.selectedServiceId = '';
        });
  }

  setVirtualInfoServiceInfo(activeService, appointmentType) {
    if (activeService.virtualCallingModes[0].callingMode === 'WhatsApp' || activeService.virtualCallingModes[0].callingMode === 'Phone') {
      if (appointmentType === 'reschedule') {
        if (activeService.virtualCallingModes[0].callingMode === 'WhatsApp') {
          this.callingModes = this.scheduledAppointment.virtualService['WhatsApp'];
        } else {
          this.callingModes = this.scheduledAppointment.virtualService['Phone'];
        }
        const phNumber = this.scheduledAppointment.countryCode + this.scheduledAppointment.phoneNumber;
        const callMode = '+' + activeService.virtualCallingModes[0].value;
        if (callMode === phNumber) {
          this.changePhone = false;
        } else {
          this.changePhone = true;
        }
      }
    }
  }

  setServiceDetails(serviceId) {
    let activeService = this.services.filter(service => service.id === serviceId)[0];
    if (activeService) {
      console.log("Set Service :", activeService);
      this.selectedService = {
        name: activeService.name,
        duration: activeService.serviceDuration,
        description: activeService.description,
        livetrack: activeService.livetrack,
        price: activeService.totalAmount,
        isPrePayment: activeService.isPrePayment,
        minPrePaymentAmount: activeService.minPrePaymentAmount,
        status: activeService.status,
        taxable: activeService.taxable,
        serviceType: activeService.serviceType,
        virtualServiceType: activeService.virtualServiceType,
        virtualCallingModes: activeService.virtualCallingModes,
        postInfoEnabled: activeService.postInfoEnabled,
        postInfoText: activeService.postInfoText,
        postInfoTitle: activeService.postInfoTitle,
        preInfoEnabled: activeService.preInfoEnabled,
        preInfoTitle: activeService.preInfoTitle,
        preInfoText: activeService.preInfoText,
        consumerNoteMandatory: activeService.consumerNoteMandatory,
        consumerNoteTitle: activeService.consumerNoteTitle,
        maxBookingsAllowed: activeService.maxBookingsAllowed,
        showOnlyAvailableSlots: activeService.showOnlyAvailableSlots,
        showPrice: activeService.showPrice,
        serviceBookingType: activeService.serviceBookingType,
        date: activeService.date,
        dateTime: activeService.dateTime,
        noDateTime: activeService.noDateTime,
        internationalAmount :  activeService.internationalAmount,
        supportInternationalConsumer :  activeService.supportInternationalConsumer,
      };
      console.log("Active Service :", this.selectedService)
      if (this.selectedService.noDateTime) {
        if ((this.apptDetails_firstName === undefined && this.apptDetails_lastName === undefined) || this.commObj['communicationPhNo'] === undefined) {
          console.log("If block :")
          this.authService.goThroughLogin().then((status) => {
            console.log("Status:", status);
            if (status) {
              const _this = this;
              const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
              _this.initAppointment().then(
                (status) => {
                  _this.getOneTimeInfo(activeUser, _this.accountId).then(
                    (questions) => {
                      console.log("Questions:", questions);

                      _this.bookStep = 5;
                      _this.confirmAppointment('next');

                      _this.loggedIn = true;
                      // _this.loading = false;
                    }
                  )
                }
              );
            } else {
              this.loggedIn = false;
              // this.bookStep = 5;
              // this.confirmAppointment('next');
              // this.initAppointment();
            }
          });
        }
        else {
          console.log("Else block :")
          this.bookStep = 5;
          this.confirmAppointment('next');
          this.initAppointment();
        }

      }
      if (activeService.provider) {
        this.selectedUserId = activeService.provider.id;
        this.setUserDetails(this.selectedUserId);
      }
      if (this.departmentEnabled) {
        this.selectedDeptId = activeService.department;
        this.setDepartmentDetails(this.selectedDeptId);
      }

      if (activeService.maxBookingsAllowed > 1 && this.appointmentType != 'reschedule') {
        this.multipleSelection = activeService.maxBookingsAllowed;
      } else {
        this.multipleSelection = 1;
      }
      if (activeService.virtualCallingModes) {
        this.setVirtualInfoServiceInfo(activeService, this.appointmentType);
      }
    }
  }

  getAvailableSlotByLocationandService(locid, servid, appmtDate, accountid, type?) {
    const _this = this;
    _this.selectedSlots = [];
    this.slotLoaded = false;
    console.log("selectedService", _this.selectedService);
    const showOnlyAvailable = _this.selectedService.showOnlyAvailableSlots;
    _this.isSlotAvailable = showOnlyAvailable;
    console.log("showOnlyAvailable:", showOnlyAvailable);
    this.subs.sink = _this.sharedServices.getSlotsByLocationServiceandDate(locid, servid, appmtDate, accountid)
      .subscribe((data: any) => {
        _this.allSlots = [];
        console.log("Date slots :", data);

        _this.slotLoaded = true;
        // console.log(_this.freeSlots);
        // console.log("Slots ful:", data);
        if (data.length === 0) {
          // Please choose other date.
          this.snackbarService.openSnackBar('No slots available on selected date.', { 'panelClass': 'snackbarerror' });
        }
        console.log("selected day and change day :", this.selectedDay, appmtDate);


        for (const scheduleSlots of data) {
          const availableSlots = scheduleSlots.availableSlots;
          if (appmtDate >= this.selectedDay) {
            for (const slot of availableSlots) {
              // console.log("Slottt:", slot);
              if (showOnlyAvailable && !slot.active) {
              } else {
                slot['date'] = scheduleSlots['date'];
                slot['scheduleId'] = scheduleSlots['scheduleId'];
                slot['displayTime'] = _this.getSingleTime(slot.time);
                _this.allSlots.push(slot);
              }
            }
          }
          else {
            _this.allSlots = [];
            _this.snackbarService.openSnackBar('No slots available on selected date.', { 'panelClass': 'snackbarerror' });
          }
        }
        // console.log(_this.allSlots);
        const availableSlots = _this.allSlots.filter(slot => slot.active);
        if (availableSlots && availableSlots.length > 0) {
          _this.isSlotAvailable = true;
        }
        // if (_this.scheduledAppointment) {
        // const appttime = _this.allSlots.filter(slot => (slot.time === _this.scheduledAppointment.appmtTime && slot.date === appmtDate));
        // if (appttime) {
        //     let apptTimes = [];
        //     apptTimes.push(appttime[0]);
        //     // _this.slotSelected(apptTimes);
        // }
        // } else {
        const timetosel = _this.allSlots.filter(slot => slot.active);
        if (timetosel && timetosel.length > 0) {
          let apptTimes = [];
          apptTimes.push(timetosel[0]);
          _this.slotSelected(apptTimes);
        }


        // }

      });
  }

  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }

  /**
   *  returns Available dates for calendar
   * @param locid location id
   * @param servid service id
   * @param accountid account id
   */
  getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
    const _this = this;
    if (locid && servid && accountid) {
      _this.subs.sink = _this.sharedServices.getAvailableDatessByLocationService(locid, servid, accountid)
        .subscribe((data: any) => {
          const availables = data.filter(obj => obj.availableSlots);
          const availDates = availables.map(function (a) { return a.date; });
          _this.availableDates = availDates.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });
          this.loading = false;
        });
    }
  }

  appointmentDateChanged(appmtDate) {
    this.selectedSlots = [];
    console.log("In Appointment Date Changed Method:", appmtDate);
    this.appmtDate = appmtDate;
    this.isFutureDate = this.dateTimeProcessor.isFutureDate(this.serverDate, this.appmtDate);
    this.slotLoaded = false;
    this.getAvailableSlotByLocationandService(this.locationId, this.selectedServiceId, this.appmtDate, this.accountId);
  }

  apptDateChanged(date) {
    const tdate = date;
    this.ngOnInit();
    console.log("In Appointment Date Changed Method:", tdate);
    const newdate = tdate;
    // .split("/")
    // .reverse()
    // .join("-");
    //moment(newdate).format("YYYY-MM-DD")
    console.log("New Date :", newdate);
    // console.log("New Date :",newdate.split(" ").reverse().join("-"));
    const futrDte = new Date(newdate);
    console.log("Future Date :", futrDte);
    const obtmonth = futrDte.getMonth() + 1;
    let cmonth = "" + obtmonth;
    if (obtmonth < 10) {
      cmonth = "0" + obtmonth;
    }
    const seldate =
      futrDte.getFullYear() + "-" + cmonth + "-" + futrDte.getDate();
    this.appmtDate = seldate;
    console.log("selected date :", this.appmtDate);
    this.isFutureDate = this.dateTimeProcessor.isFutureDate(this.serverDate, this.appmtDate);
    this.slotLoaded = false;
    this.getAvailableSlotByLocationandService(this.locationId, this.selectedServiceId, this.appmtDate, this.accountId);
  }

  slotSelected(slots) {
    const _this = this;
    console.log("Slots:", slots);
    _this.selectedSlots = slots;
    // _this.selectedSlots = [];
    // _this.selectedSlots.push(slots);
    console.log("Slot Selected:", _this.selectedSlots);
    const apptTimings = _this.selectedSlots.filter(obj => obj.time);
    console.log("Appt:", apptTimings);
    const apptTimings1 = apptTimings.map(function (a) { return _this.getSingleTime(a.time) });
    console.log("Appt Timings:", apptTimings1);
    _this.selectedApptsTime = apptTimings1.join(', ');
    console.log("SelectedDate:", this.appmtDate);
    console.log("Selected Timings:", _this.selectedApptsTime);
  }

  // BookStep = 0 --- Date/Time--ServiceName
  // BookStep = 1 --- Virtual Form
  // BookStep = 2 --- Questionaire
  // BookStep = 3 --- Review/Confirm / File / Note
  goToStep(type) {
    const _this = this;
    console.log("BookStep1:" + this.bookStep);
    if (this.allSlots && this.allSlots.length <= 0 && this.slotLoaded) {
      this.bookStep = 1;
    }
    if (type === 'next') {
      switch (this.bookStep) {
        case 1: // Date/Time--ServiceName
          this.authService.goThroughLogin().then((status) => {
            console.log("Status:", status);
            if (status) {
              const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
              _this.initAppointment().then(
                (status) => {
                  _this.getOneTimeInfo(activeUser, _this.accountId).then(
                    (questions) => {
                      console.log("Questions:", questions);
                      if (questions) {
                        _this.onetimeQuestionnaireList = questions;
                        if (this.showSlot) {
                          _this.bookStep = 2;
                        }
                        else if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                          _this.bookStep = 3;
                        } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                          _this.bookStep = 4;
                        } else {
                          _this.bookStep = 5;
                          this.confirmAppointment('next');
                        }
                        console.log("Bookstep2:", _this.bookStep);
                      } else {
                        if (this.showSlot) {
                          _this.bookStep = 2;
                        }
                        else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                          _this.bookStep = 4;
                        } else {
                          _this.bookStep = 5;
                          this.confirmAppointment('next');
                        }
                      }
                      _this.loggedIn = true;
                      // _this.loading = false;
                    }
                  )
                }
              );
            } else {
              this.loggedIn = false;
            }
          });
          break;
        case 2:
          this.authService.goThroughLogin().then((status) => {
            console.log("Status:", status);
            if (status) {
              const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
              _this.initAppointment().then(
                (status) => {
                  _this.getOneTimeInfo(activeUser, _this.accountId).then(
                    (questions) => {
                      console.log("Questions:", questions);
                      if (questions) {
                        _this.onetimeQuestionnaireList = questions;
                        if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                          _this.bookStep = 3;
                        } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                          _this.bookStep = 4;
                        } else {
                          _this.bookStep = 5;
                          this.confirmAppointment('next');
                        }
                        console.log("Bookstep2:", _this.bookStep);
                      } else {
                        if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                          _this.bookStep = 4;
                        } else {
                          _this.bookStep = 5;
                          this.confirmAppointment('next');
                        }
                      }
                      _this.loggedIn = true;
                      // _this.loading = false;
                      this.setAnalytics('dateTime_login');
                    }
                  )
                }
              );
            } else {
              this.loggedIn = false;
              this.setAnalytics('dateTime_withoutlogin');
            }
          });
          break;
        case 3:
          _this.validateOneTimeInfo();
          break;
        case 4:
          this.validateQuestionnaire();
          break;
        case 5:
          console.log("4 Clicked");
          if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
            this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
            return false;
          }
          this.confirmAppointment('next');
          break;
      }
    } else if (type === 'prev') {
      if (!this.serviceOptionApptt) {
        if (this.bookStep === 5) {
          if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.bookStep = 4;
          } else if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
            _this.bookStep = 3;
          }
          else if (this.showSlot) {
            _this.bookStep = 2;
          } else {

            this.bookStep = 2;
          }
        }
        else if (this.bookStep === 4) {
          if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
            _this.bookStep = 3;
          }
          else if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 2;
          }
        }
        else if (this.bookStep === 3) {
          if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 2;
          }
        }
        else if (this.bookStep === 3) {
          if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 2;
          }
        } else {
          this.location.back();

        }
      }
      else {
        if (this.bookStep === 5) {
          if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.bookStep = 4;
          } else if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
            _this.bookStep = 3;
          }
          else if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 1;
          }
        }
        else if (this.bookStep === 4) {
          if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
            _this.bookStep = 3;
          }
          else if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 1;
          }
        }
        else if (this.bookStep === 3) {
          if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 1;
          }
        }
        else if (this.bookStep === 3) {
          if (this.showSlot) {
            _this.bookStep = 2;
          } else {
            this.bookStep = 1;
          }
        } else {
          this.bookStep--;

        }
      }
    } else {
      this.bookStep = type;
    }
    if (this.bookStep === 5) {
      this.confirmAppointment('next');
    }
  }

  actionCompleted() {
    console.log("action complete :")
    if (this.action !== 'members' && this.action !== 'addmember' && this.action !== 'note' && this.action !== 'attachment' && this.action !== 'coupons') {
      if (this.appointmentType == 'reschedule' && this.scheduledAppointment.service && this.scheduledAppointment.service.priceDynamic) {
        this.subs.sink = this.sharedServices.getAppointmentReschedulePricelist(this.scheduledAppointment.service.id).subscribe(
          (list: any) => {
            this.priceList = list;
            let oldprice;
            let newprice;
            for (let list of this.priceList) {
              if (list.schedule.id == this.scheduledAppointment.schedule.id) { // appointment scheduleid
                oldprice = list.price;
              }
              if (list.schedule.id == this.selectedSlots[0]['scheduleId']) { // rescheduledappointment scheduleid
                newprice = list.price;
              }
            }
            this.balanceAmount = this.scheduledAppointment.amountDue + (newprice - oldprice);
          });
      }
    }
    if (this.action === 'members') {
      this.saveMemberDetails();
    } else if (this.action === 'addmember') {
      this.handleSaveMember();
    } else if (this.action === 'note' || this.action === 'attachment') {
      this.goBack();
    } else if (this.action === 'coupons') {
      console.log("Action couponss :")
      this.applyCoupons();
    }
  }
  handleSaveMember() {
    this.disable = true;
    let derror = '';
    const namepattern = new RegExp(projectConstantsLocal.VALIDATOR_CHARONLY);
    const blankpattern = new RegExp(projectConstantsLocal.VALIDATOR_BLANK);
    if (!namepattern.test(this.addmemberobj.fname) || blankpattern.test(this.addmemberobj.fname)) {
      derror = 'Please enter a valid first name';
    }
    if (derror === '' && (!namepattern.test(this.addmemberobj.lname) || blankpattern.test(this.addmemberobj.lname))) {
      derror = 'Please enter a valid last name';
    }
    if (derror === '') {
      const post_data = {
        'userProfile': {
          'firstName': this.addmemberobj.fname.trim(),
          'lastName': this.addmemberobj.lname.trim()
        }
      };
      if (this.addmemberobj.mobile !== '') {
        post_data.userProfile['primaryMobileNo'] = this.addmemberobj.mobile;
        post_data.userProfile['countryCode'] = '+91';
      }
      if (this.addmemberobj.gender !== '') {
        post_data.userProfile['gender'] = this.addmemberobj.gender;
      }
      if (this.addmemberobj.dob !== '') {
        post_data.userProfile['dob'] = this.addmemberobj.dob;
      }
      let fn;
      post_data['parent'] = this.parentCustomer.id;
      fn = this.customerService.addMember(post_data);
      this.subs.sink = fn.subscribe(() => {
        this.apiSuccess = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
        this.setConsumerFamilyMembers(this.parentCustomer).then();
        setTimeout(() => {
          this.goBack();
        }, projectConstants.TIMEOUT_DELAY);
      },
        error => {
          this.apiError = this.wordProcessor.getProjectErrorMesssages(error);
          // this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.disable = false;
        });
    } else {
      this.apiError = derror;
      // this.snackbarService.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
      this.disable = false;
    }
    setTimeout(() => {
      this.apiError = '';
      this.apiSuccess = '';
    }, 2000);
  }
  resetApiErrors() {
    this.emailError = null;
  }
  saveMemberDetails() {
    this.resetApiErrors();
    this.emailError = '';
    this.phoneError = '';
    this.whatsappError = '';
    this.changePhone = true;
    if (this.commObj['communicationPhNo'] && this.commObj['communicationPhNo'].trim() !== '') {
    } else {
      this.snackbarService.openSnackBar('Please enter phone number', { 'panelClass': 'snackbarerror' });
      return false;
    }
    if (this.selectedService && this.selectedService.virtualCallingModes && this.selectedService.virtualCallingModes[0].callingMode === 'WhatsApp') {
      if (!this.commObj['comWhatsappCountryCode'] || (this.commObj['comWhatsappCountryCode'] && this.commObj['comWhatsappCountryCode'].trim() === '')) {
        this.snackbarService.openSnackBar('Please enter country code', { 'panelClass': 'snackbarerror' });
        return false;
      }
      if (this.commObj['comWhatsappNo'] && this.commObj['comWhatsappNo'].trim() !== '') {
        this.callingModes = this.commObj['comWhatsappCountryCode'].replace('+', '') + this.commObj['comWhatsappNo'];
      } else {
        this.snackbarService.openSnackBar('Please enter whatsapp number', { 'panelClass': 'snackbarerror' });
        return false;
      }
    }
    if (this.commObj['communicationEmail'] && this.commObj['communicationEmail'].trim() !== '') {
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result = pattern.test(this.commObj['communicationEmail']);
      if (!result) {
        this.emailError = "Email is invalid";
        return false;
      } else {
        this.appmtFor[0]['email'] = this.commObj['communicationEmail'];
      }
    }
    this.getOneTimeInfo(this.appmtFor[0], this.accountId).then((questions) => {
      console.log("Questions1:", questions);
      if (questions) {
        this.onetimeQuestionnaireList = questions;
        if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
          this.bookStep = 3;
        }
      }
    })
    this.closebutton.nativeElement.click();
    setTimeout(() => {
      this.action = '';
    }, 500);
  }
  setProviderConsumerList(jaldeeConsumerId, accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.sharedServices.getProviderCustomerList(jaldeeConsumerId, accountId).subscribe(
        (providerConsumerList) => {
          _this.providerConsumerList = providerConsumerList;
          resolve(true);
        }, () => {
          resolve(false);
        }
      )
    })
  }

  getProviderCustomerId(member, accountId) {
    console.log("Member:", member);
    if (member) {
      this.apptDetails_firstName = member.firstName;
      this.apptDetails_lastName = member.lastName;
    }
    console.log("ProviderList:", this.providerConsumerList);
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    const _this = this;
    return new Promise(function (resolve, reject) {
      const providerConsumer = _this.providerConsumerList.filter(user => user.firstName === member.firstName && user.LastName === member.LastName);

      if (providerConsumer && providerConsumer.length > 0) {
        _this.providerConsumerId = providerConsumer[0].id;
        resolve(_this.providerConsumerId);
      } else {
        let memberId;
        let parentId;

        if (member.parent) {
          memberId = member.id;
          parentId = member.parent;
        } else {
          console.log("Hererer");
          const providerConsumer_parent = _this.providerConsumerList.filter(user => user.firstName === activeUser.firstName && user.LastName === activeUser.LastName);
          console.log("Family Members:", _this.familyMembers);
          console.log("Member Id", member.id);
          console.log("Parent:", providerConsumer_parent);
          if (providerConsumer_parent && providerConsumer_parent.length > 0) {
            parentId = providerConsumer_parent[0].id;
          }
          const selectedMember = _this.familyMembers.filter(memb => memb.user === member.id);
          console.log("Selected Member:", selectedMember);
          if (selectedMember && selectedMember.length > 0) {
            if (selectedMember[0].parent) {
              memberId = member.id;
            } else {
              memberId = 0;
              parentId = activeUser.id;
            }
          } else {
            memberId = 0;
            parentId = activeUser.id;
          }
        }
        console.log("Call Started");
        _this.sharedServices.createProviderCustomer(memberId, parentId, accountId).subscribe(
          (providerConsumer: any) => {
            _this.providerConsumerList.push(providerConsumer);
            resolve(providerConsumer.id);
          }
        )
      }
    });
  }

  getOneTimeInfo(user, accountId) {
    const _this = this;
    console.log("Get one time info:", user);
    return new Promise(function (resolve, reject) {
      if (_this.scheduledAppointment) {
        resolve(true);
      } else {
        _this.getProviderCustomerId(user, accountId).then(
          (providerConsumerId) => {
            _this.providerConsumerId = providerConsumerId;
            _this.sharedServices.getProviderCustomerOnetimeInfo(providerConsumerId, accountId).subscribe(
              (questions) => {
                resolve(questions);
              }, () => {
                resolve(false);
              }
            )
          }
        )
      }
    })
  }
  getOneTimeQuestionAnswers(event) {
    this.oneTimeInfo = event;
  }
  validateOneTimeInfo() {
    console.log("OneTime:", this.oneTimeInfo);
    if (!this.oneTimeInfo) {
      this.oneTimeInfo = {
        answers: {
          answerLine: [],
          questionnaireId: this.onetimeQuestionnaireList.id
        }
      }
    }
    // this.getBookStep('profile');
    console.log("Before Validation", this.oneTimeInfo);
    if (this.oneTimeInfo.answers) {
      const questions = this.oneTimeInfo.answers.answerLine.map(function (a) { return a.labelName; })
      const dataToSend: FormData = new FormData();
      const answer = new Blob([JSON.stringify(this.oneTimeInfo.answers)], { type: 'application/json' });
      const question = new Blob([JSON.stringify(questions)], { type: 'application/json' });
      dataToSend.append('answer', answer);
      dataToSend.append('question', question);
      this.sharedServices.validateConsumerOneTimeQuestionnaire(dataToSend, this.accountId, this.providerConsumerId).subscribe((data: any) => {
        // this.shared_services.validateConsumerQuestionnaire(this.oneTimeInfo.answers, this.account_id).subscribe((data: any) => {
        if (data.length === 0) {
          this.submitOneTimeInfo().then(
            (status) => {
              if (status) {
                this.getBookStep();
              }
            })
        }
        this.sharedFunctions.sendMessage({ type: 'qnrValidateError', value: data });
      }, error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
  }

  getBookStep() {
    if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
      this.bookStep = 4;
    } else {
      this.bookStep = 5;
      this.confirmAppointment();
    }
  }

  initAppointment() {
    const _this = this;
    _this.appmtFor = [];
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("InitAppointment:");
    return new Promise(function (resolve, reject) {
      _this.customerService.getCustomerInfo(activeUser.id).then(data => {
        _this.parentCustomer = data;
        if (_this.parentCustomer && _this.parentCustomer.userProfile && _this.parentCustomer.userProfile.firstName) {
          _this.apptDetails_firstName = _this.parentCustomer.userProfile.firstName;
        }
        if (_this.parentCustomer && _this.parentCustomer.userProfile && _this.parentCustomer.userProfile.lastName) {
          _this.apptDetails_lastName = _this.parentCustomer.userProfile.lastName;
        }
        if (_this.appointmentType != 'reschedule') {
          _this.appmtFor.push({ id: _this.parentCustomer.id, firstName: _this.parentCustomer.userProfile.firstName, lastName: _this.parentCustomer.userProfile.lastName });
          _this.prepaymentAmount = _this.appmtFor.length * _this.selectedService.minPrePaymentAmount || 0;
          _this.serviceCost = _this.selectedService.price;
          _this.setConsumerFamilyMembers(_this.parentCustomer.id).then(); // Load Family Members
          _this.setProviderConsumerList(_this.parentCustomer.id, _this.accountId).then(
            (status) => {
              if (!_this.questionnaireLoaded) {
                _this.getConsumerQuestionnaire().then(
                  () => {
                    console.log("Heree");
                    resolve(true);
                  }
                );
              } else {
                resolve(true);
              }
            }
          );
        } else {
          resolve(true);
        }
        _this.initCommunications(_this.parentCustomer);
      });
    });
  }
  getConsumerQuestionnaire() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      const consumerid = (_this.appmtFor[0].id === _this.parentCustomer.id) ? 0 : _this.appmtFor[0].id;
      _this.sharedServices.getConsumerQuestionnaire(_this.selectedServiceId, consumerid, _this.accountId).subscribe(data => {
        _this.questionnaireList = data;
        _this.questionnaireLoaded = true;
        resolve(true);
      }, () => {
        resolve(false);
      });
    })
  }
  getQuestionAnswers(event) {
    this.questionAnswers = event;
  }
  validateQuestionnaire() {
    if (!this.questionAnswers) {
      this.questionAnswers = {
        answers: {
          answerLine: [],
          questionnaireId: this.questionnaireList.id
        }
      }
    }
    if (this.questionAnswers.answers) {
      this.sharedServices.validateConsumerQuestionnaire(this.questionAnswers.answers, this.accountId).subscribe((data: any) => {
        if (data.length === 0) {
          if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
            this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
          } else {
            this.bookStep++;
            this.confirmAppointment();
          }
        }
        this.sharedFunctions.sendMessage({ type: 'qnrValidateError', value: data });
      }, error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
  }
  /**
   * Returns the family Members
   * @param parentId parent consumer id
   */
  setConsumerFamilyMembers(parentId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.familyMembers = [];
      _this.customerService.getConsumerFamilyMembers().subscribe(
        (members: any) => {
          for (const member of members) {
            if (member.userProfile.id !== parentId) {
              _this.familyMembers.push(member);
            }
          }
          resolve(_this.familyMembers);
        }
      )
    })
  }

  /**
   * Set communication parameters
   * @param parentCustomer logged in customer
   */
  initCommunications(parentCustomer) {
    console.log("initCommunications", parentCustomer);
    const _this = this;
    if (parentCustomer.userProfile.email) {
      _this.commObj['communicationEmail'] = parentCustomer.userProfile.email;
    } else {
      _this.commObj['communicationEmail'] = _this.parentCustomer.userProfile.email;
    }
    if (parentCustomer.userProfile.whatsAppNum && parentCustomer.userProfile.whatsAppNum.number && parentCustomer.userProfile.whatsAppNum.number.trim() != '') {
      _this.commObj['comWhatsappNo'] = parentCustomer.userProfile.whatsAppNum.number;
      _this.commObj['comWhatsappCountryCode'] = parentCustomer.userProfile.whatsAppNum.countryCode;
    } else {
      _this.commObj['comWhatsappNo'] = parentCustomer.userProfile.primaryMobileNo;
      _this.commObj['comWhatsappCountryCode'] = parentCustomer.userProfile.countryCode;
    }
    _this.commObj['communicationPhNo'] = _this.parentCustomer.userProfile.primaryMobileNo;
    _this.commObj['communicationPhCountryCode'] = _this.parentCustomer.userProfile.countryCode;
  }

  setRescheduleInfo(uuid) {
    const _this = this;
    _this.appmtFor = [];
    return new Promise(function (resolve, reject) {
      _this.subs.sink = _this.sharedServices.getAppointmentByConsumerUUID(uuid, _this.accountId).subscribe(
        (appt: any) => {
          _this.scheduledAppointment = appt;
          console.log('Appointment:', _this.scheduledAppointment);

          if (_this.appointmentType === 'reschedule') {
            _this.appmtFor.push({ id: _this.scheduledAppointment.appmtFor[0].id, firstName: _this.scheduledAppointment.appmtFor[0].firstName, lastName: _this.scheduledAppointment.appmtFor[0].lastName, phoneNo: _this.scheduledAppointment.phoneNumber, apptTime: _this.scheduledAppointment.appmtFor[0].apptTime });
            _this.commObj['communicationPhNo'] = _this.scheduledAppointment.phoneNumber;
            _this.commObj['communicationPhCountryCode'] = _this.scheduledAppointment.countryCode;
            _this.commObj['communicationEmail'] = _this.scheduledAppointment.appmtFor[0]['email'];
            if (_this.scheduledAppointment.appmtFor[0].whatsAppNum) {
              _this.commObj['comWhatsappNo'] = _this.scheduledAppointment.appmtFor[0].whatsAppNum.number;
              _this.commObj['comWhatsappCountryCode'] = _this.scheduledAppointment.appmtFor[0].whatsAppNum.countryCode;
            } else {
              _this.commObj['comWhatsappNo'] = _this.parentCustomer.userProfile.primaryMobileNo;
              _this.commObj['comWhatsappCountryCode'] = _this.parentCustomer.userProfile.countryCode;
            }
            _this.consumerNote = _this.scheduledAppointment.consumerNote;
            if (_this.scheduledAppointment && _this.scheduledAppointment.appmtFor[0] && _this.scheduledAppointment.appmtFor[0].firstName) {
              _this.apptDetails_firstName = _this.scheduledAppointment.appmtFor[0].firstName;
            }
            if (_this.scheduledAppointment && _this.scheduledAppointment.appmtFor[0] && _this.scheduledAppointment.appmtFor[0].lastName) {
              _this.apptDetails_lastName = _this.scheduledAppointment.appmtFor[0].lastName;
            }

          }
          if (_this.scheduledAppointment && _this.scheduledAppointment.appmtFor[0] && _this.scheduledAppointment.appmtFor[0].firstName) {
            _this.apptDetails_firstName = _this.scheduledAppointment.appmtFor[0].firstName;
          }
          if (_this.scheduledAppointment && _this.scheduledAppointment.appmtFor[0] && _this.scheduledAppointment.appmtFor[0].lastName) {
            _this.apptDetails_lastName = _this.scheduledAppointment.appmtFor[0].lastName;
          }
          _this.locationId = _this.scheduledAppointment.location.id;
          _this.selectedServiceId = _this.scheduledAppointment.service.id;
          _this.appmtDate = _this.scheduledAppointment.appmtDate;
          console.log('ApptDate:', _this.appmtDate);
          console.log("Server Date:", _this.serverDate);
          _this.isFutureDate = _this.dateTimeProcessor.isFutureDate(_this.serverDate, _this.appmtDate);
          // _this.currentScheduleId = _this.scheduledAppointment.schedule.id;
          _this.selectedServiceId = _this.scheduledAppointment.service.id;
          _this.getServicebyLocationId(_this.locationId, _this.appmtDate);
          _this.getSchedulesbyLocationandServiceIdavailability(_this.locationId, _this.selectedServiceId, _this.accountId);
          resolve(true);

        }, () => {
          resolve(false);
        });
    })

  }

  /**
   *
   * @param commObj
  */
  setCommunications(commObj) {
    this.commObj = commObj;
  }

  getPaymentModes() {
    this.paytmEnabled = false;
    this.razorpayEnabled = false;
    this.interNationalPaid = false;
    this.sharedServices.getPaymentModesofProvider(this.accountId, this.selectedServiceId, 'prePayment')
      .subscribe(
        data => {
          this.paymentmodes = data[0];
          this.isPayment = true;
          this.profileId = this.paymentmodes.profileId;
          console.log("Profile ID :", this.profileId)
          if (this.paymentmodes && this.paymentmodes.indiaPay) {
            this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
          }
          if (this.paymentmodes && this.paymentmodes.internationalPay) {
            this.non_indian_modes = this.paymentmodes.internationalBankInfo;
          }
          if (this.paymentmodes && !this.paymentmodes.indiaPay && this.paymentmodes.internationalPay) {
            this.shownonIndianModes = true;
          } else {
            this.shownonIndianModes = false;
          }
          // }
        },
        error => {
          this.isPayment = false;
        }
      );
  }

  getAttachLength() {
    let length = this.selectedMessage.files.length;
    if (this.scheduledAppointment && this.scheduledAppointment.attchment && this.scheduledAppointment.attchment[0] && this.scheduledAppointment.attchment[0].thumbPath) {
      length = length + this.scheduledAppointment.attchment.length;
    }
    return length;
  }

  filesSelected(event, type?) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
          return;
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
          this.action = 'attachment';
          if (this.selectedMessage.caption) {
            return this.imgCaptions;
          }
          else {
            return this.imgCaptions = '';
          }
        }
      }
      if (type && this.selectedMessage.files && this.selectedMessage.files.length > 0 && input.length > 0) {
        this.modal.nativeElement.click();
      }
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    this.selectedMessage.base64.splice(index, 1);
    this.selectedMessage.caption.splice(index, 1);
    this.imgCaptions[index] = '';
    this.fileInput.nativeElement.value = '';
  }
  handleSideScreen(action) {
    this.action = action;
  }
  /**
  * Method to check privacy policy
  * @param status true/false
  */
  policyApproved(status) {
    this.checkPolicy = status;
  }
  applyPromocode() {
    this.action = 'coupons';
  }
  showJCCouponNote(coupon) {
    if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
    } else {
      if (coupon.value.value === '0.0') {
        this.dialog.open(JcCouponNoteComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'jcouponmessagepopupclass'],
          disableClose: true,
          data: {
            jCoupon: coupon
          }
        });
      }
    }
  }
  checkCouponExists(couponCode) {
    let found = false;
    for (let index = 0; index < this.selectedCoupons.length; index++) {
      if (couponCode === this.selectedCoupons[index]) {
        found = true;
        break;
      }
    }
    return found;
  }
  applyCoupons() {
    this.couponError = null;
    this.couponValid = true;
    const couponInfo = {
      'couponCode': '',
      'instructions': ''
    };
    if (this.selectedCoupon) {
      const jaldeeCoupn = this.selectedCoupon.trim();
      if (this.checkCouponExists(jaldeeCoupn)) {
        this.couponError = 'Coupon already applied';
        this.couponValid = false;
        return false;
      }
      this.couponValid = false;
      let found = false;
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.JC.length; couponIndex++) {
        if (this.s3CouponsList.JC[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
          this.selectedCoupons.push(this.s3CouponsList.JC[couponIndex].jaldeeCouponCode);
          couponInfo.couponCode = this.s3CouponsList.JC[couponIndex].jaldeeCouponCode;
          couponInfo.instructions = this.s3CouponsList.JC[couponIndex].consumerTermsAndconditions;
          this.couponsList.push(couponInfo);
          found = true;
          this.selectedCoupon = '';
          break;
        }
      }
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.OWN.length; couponIndex++) {
        if (this.s3CouponsList.OWN[couponIndex].couponCode.trim() === jaldeeCoupn) {
          this.selectedCoupons.push(this.s3CouponsList.OWN[couponIndex].couponCode);
          couponInfo.couponCode = this.s3CouponsList.OWN[couponIndex].couponCode;
          if (this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions) {
            couponInfo.instructions = this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions;
          }
          this.couponsList.push(couponInfo);
          found = true;
          this.selectedCoupon = '';
          break;
        }
      }

      if (found) {
        this.couponValid = true;
        // this.snackbarService.openSnackBar('Promocode accepted', { 'panelclass': 'snackbarerror' });
        setTimeout(() => {
          this.action = '';
        }, 500);
        this.closebutton.nativeElement.click();
        this.checkCouponvalidity();
      }
      else {
        this.couponError = 'Coupon invalid';
      }
    } else {
      this.closebutton.nativeElement.click();
    }
  }
  checkCouponvalidity() {
    const post_Data = this.generateInputForAppointment();
    post_Data['appmtFor'][0]['apptTime'] = this.selectedSlots[0]['time'];
    post_Data['schedule'] = { 'id': this.selectedSlots[0]['scheduleId'] };
    if (this.serviceOptionApptt) {
      post_Data['srvAnswers'] = this.serviceOptDetails;
    }
    console.log("this.advPostData", this.advPostData);
    console.log("this.post_Data", post_Data);

    const param = { 'account': this.accountId };
    console.log(JSON.stringify(post_Data))
    this.subs.sink = this.sharedServices.addApptAdvancePayment(param, post_Data).subscribe(data => {
      this.paymentDetails = data;
      console.log("PaymentDetails:", this.paymentDetails);
      if (this.paymentDetails && this.paymentDetails.netTotal && this.serviceOptionApptt) {
        this.serviceTotalPrice = this.lStorageService.getitemfromLocalStorage('serviceTotalPrice');

        this.total_servicefee = this.paymentDetails.netTotal;
      }
     
      this.paymentLength = Object.keys(this.paymentDetails).length;
      this.checkJcash = true
      this.jcashamount = this.paymentDetails.eligibleJcashAmt.jCashAmt;
      this.jcreditamount = this.paymentDetails.eligibleJcashAmt.creditAmt;
      if (this.checkJcash && this.paymentDetails.amountRequiredNow > this.jcashamount) {
        this.payAmount = this.paymentDetails.amountRequiredNow - this.jcashamount;

      } else if (this.checkJcash && this.paymentDetails.amountRequiredNow <= this.jcashamount) {
        this.payAmount = 0;
      }
      let convienientPaymentObj = {}
      convienientPaymentObj = {
        "profileId": this.profileId,
        "amount": this.paymentDetails.amountRequiredNow
      }
      this.sharedServices.getConvenientFeeOfProvider(this.accountId, convienientPaymentObj).subscribe((data: any) => {
        // let array = []
        console.log("Convenient response :", data)
        this.convenientPaymentModes = data;
        if (this.convenientPaymentModes) {
          this.convenientPaymentModes.map((res: any) => {
            this.convenientFeeObj = {}
            if (res) {
              this.convenientFeeObj = res;
              this.convenientFee = this.convenientFeeObj.convenienceFee;

            }
          })
        }


      })
    }, error => {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
    });
  }
  togglepaymentMode() {
    this.shownonIndianModes = !this.shownonIndianModes;
    this.paymentMode = null;
  }
  indian_payment_mode_onchange(event) {
    this.paymentMode = event.value;
    this.isInternational = false;
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = {}
      if (res.isInternational === false) {
        this.convenientFeeObj = res;
        if (this.paymentMode === res.mode) {
          //  this.convenientFee = this.convenientFeeObj.convenienceFee;
          // if(this.convenientFeeObj.consumerGatewayFee)
          this.gatewayFee = this.convenientFeeObj.totalGatewayFee;
          // this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
          console.log("gatewayFee for indian:", this.gatewayFee, res.mode)
        }
      }
    })
  }
  non_indian_modes_onchange(event) {
    this.paymentMode = event.value;
    this.isInternational = true;
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = {}
      if (res.isInternational === true) {
        this.convenientFeeObj = res;
        if (this.paymentMode === res.mode) {
          // this.convenientFee = this.convenientFeeObj.convenienceFee;
          //  this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
          this.gatewayFee = this.convenientFeeObj.totalGatewayFee;

          console.log("gatewayFee for  non-indian:", this.gatewayFee, res.mode)
        }
      }
    })
  }
  confirmAppointment(type?) {
    if (this.selectedService.isPrePayment && (!this.commObj['communicationEmail'] || this.commObj['communicationEmail'] === '')) {
      const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
        width: '40%',
        panelClass: ['loginmainclass', 'popup-class'],
      });
      emaildialogRef.afterClosed().subscribe(result => {
        if (result !== '' && result !== undefined) {
          this.commObj['communicationEmail'] = result;
          this.confirmAppointment(type);
        } else {
          this.isClickedOnce = false;
          this.goBack('backy');
        }
      });
    } else {

      if (this.selectedService.serviceType === 'virtualService' && !this.validateVirtualCallInfo(this.callingModes)) {
        return false;
      }
      if (type === 'appt') {
        if (this.jcashamount > 0 && this.checkJcash) {
          this.sharedServices.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.paymentDetails.amountRequiredNow)
            .subscribe(data => {
              this.remainingadvanceamount = data;
              this.performAppointment();
            });
        } else {
          console.log("Normal Appointment");
          this.performAppointment();
        }
      } else if (this.selectedService.isPrePayment) {
        console.log("this.selectedSlots[0]")
        this.addApptAdvancePayment(this.selectedSlots[0]);
      }
    }
  }
  addApptAdvancePayment(appmtSlot) {
    let serviceOPtionInfo = this.lStorageService.getitemfromLocalStorage('serviceOPtionInfo');
    let itemArray = this.lStorageService.getitemfromLocalStorage('itemArray');

    let post_Data = this.generateInputForAppointment();
    post_Data['appmtFor'][0]['apptTime'] = appmtSlot['time'];
    post_Data['schedule'] = { 'id': appmtSlot['scheduleId'] };
    const param = { 'account': this.accountId };
    if (this.serviceOptionApptt) {
      let srvAnswerstoSend = {}
      srvAnswerstoSend['answerLine'] = [];
      srvAnswerstoSend['answerLine'] = [];
      srvAnswerstoSend['answerLine'][0] = {};
      srvAnswerstoSend['answerLine'][0]['answer'] = {};
      // srvAnswerstoSend['answerLine'][0]['answer']['dataGridList'] = [];
      let newDataGrid = []

     
      console.log("this.itemArray", itemArray)
      for (let i = 0; i < itemArray.length; i++) {
        // newDataGrid.push(itemArray[i].columnItem[0].answer.dataGridList[0])
        newDataGrid.push(itemArray[i].columnItem[0])
      }
      srvAnswerstoSend['answerLine'] = newDataGrid;
      console.log("this.srvAnswerstoSend", srvAnswerstoSend)
      if(serviceOPtionInfo && serviceOPtionInfo.answers && serviceOPtionInfo.answers.questionnaireId){
        srvAnswerstoSend['questionnaireId'] = serviceOPtionInfo.answers.questionnaireId;
      }
     

      post_Data['appmtFor'][0]['srvAnswers'] = srvAnswerstoSend;
      post_Data['srvAnswers'] = srvAnswerstoSend;
      this.serviceOptDetails = srvAnswerstoSend;
      // post_Data['srvAnswers'] = serviceOPtionInfo.answers;
    }
    this.subs.sink = this.sharedServices.addApptAdvancePayment(param, post_Data)
      .subscribe(data => {
        this.paymentDetails = data;
        // this.jCouponMsg = this.paymentDetails.jCouponList.value.systemNote;
        if (this.paymentDetails && this.paymentDetails.netTotal && this.serviceOptionApptt) {
          this.serviceTotalPrice = this.lStorageService.getitemfromLocalStorage('serviceTotalPrice');

          this.total_servicefee = this.paymentDetails.netTotal;
        }
        this.paymentLength = Object.keys(this.paymentDetails).length;
        this.checkJcash = true
        this.jcashamount = this.paymentDetails.eligibleJcashAmt.jCashAmt;
        this.jcreditamount = this.paymentDetails.eligibleJcashAmt.creditAmt;
        if (this.checkJcash && this.paymentDetails.amountRequiredNow > this.jcashamount) {
          this.payAmount = this.paymentDetails.amountRequiredNow - this.jcashamount;

        } else if (this.checkJcash && this.paymentDetails.amountRequiredNow <= this.jcashamount) {
          this.payAmount = 0;
        }
        let convienientPaymentObj = {}
        convienientPaymentObj = {
          "profileId": this.profileId,
          "amount": this.paymentDetails.amountRequiredNow
        }
        this.sharedServices.getConvenientFeeOfProvider(this.accountId, convienientPaymentObj).subscribe((data: any) => {
          // let array = []
          console.log("Convenient response :", data)
          this.convenientPaymentModes = data;
          if (this.convenientPaymentModes) {
            this.convenientPaymentModes.map((res: any) => {
              this.convenientFeeObj = {}
              if (res) {
                this.convenientFeeObj = res;
                this.convenientFee = this.convenientFeeObj.convenienceFee;
              }
            })
          }
        })
      }, error => {
        this.isClickedOnce = false;
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
  }
  getVirtualServiceInput() {
    let virtualServiceArray = {};
    if (this.callingModes !== '') {
      if (this.selectedService.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.selectedService.virtualCallingModes[0].callingMode === 'Zoom') {
        virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.selectedService.virtualCallingModes[0].value;
      } else {
        virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.commObj['comWhatsappCountryCode'] + this.commObj['comWhatsappNo'];;
      }
    }
    for (const i in virtualServiceArray) {
      if (i === 'WhatsApp') {
        return virtualServiceArray;
      } else if (i === 'GoogleMeet') {
        return virtualServiceArray;
      } else if (i === 'Zoom') {
        return virtualServiceArray;
      } else if (i === 'Phone') {
        return virtualServiceArray;
      } else if (i === 'VideoCall') {
        return { 'VideoCall': '' };
      }
    }
  }

  validateVirtualCallInfo(callingModes) {
    let valid = true;
    if (callingModes === '' || callingModes.length < 10) {
      for (const i in this.selectedService.virtualCallingModes) {
        if (this.selectedService.virtualCallingModes[i].callingMode === 'WhatsApp' || this.selectedService.virtualCallingModes[i].callingMode === 'Phone') {
          if (!this.commObj['comWhatsappNo'] && this.selectedService.serviceBookingType !== 'request') {
            this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
            valid = false;
            break;
          }
        }
      }
    }
    return valid;
  }

  generateInputForAppointment() {
    console.log(this.appmtFor);
    if (this.selectedService.serviceBookingType === 'request' && (this.selectedService.date || this.selectedService.dateTime || this.selectedService.noDateTime)) {
      let post_Data = {
        'service': {
          'id': this.selectedServiceId,
          'serviceType': this.selectedService.serviceType
        },
        'consumerNote': this.consumerNote,
        'countryCode': this.parentCustomer.userProfile.countryCode,
        'coupons': this.selectedCoupons,
      };
      if (!this.selectedService.noDateTime) {
        post_Data['appmtDate'] = this.appmtDate
      }


      if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
        post_Data['provider'] = { 'id': this.selectedUser.id };
      } else
        if (this.selectedService.provider) {
          post_Data['provider'] = { 'id': this.selectedService.provider.id };
        }
      // if (this.scheduledAppointment) {
      //     post_Data['appmtFor'] = this.scheduledAppointment['appmtFor'];
      // } else {
      if (this.appmtFor.length !== 0) {
        for (const list of this.appmtFor) {
          if (list.id === this.parentCustomer.id) {
            list['id'] = 0;
          }
        }
      }
      if (this.commObj['communicationEmail'] !== '') {
        this.appmtFor[0]['email'] = this.commObj['communicationEmail'];
      }
      if (this.commObj['communicationPhNo'] !== '') {
        post_Data['phoneNumber'] = this.commObj['communicationPhNo'];
      }
      post_Data['appmtFor'] = JSON.parse(JSON.stringify(this.appmtFor));
      // }
      //  post_Data['virtualService'] = this.getVirtualServiceInput();

      if (this.selectedService.serviceType === 'virtualService') {
        if (this.validateVirtualCallInfo(this.callingModes)) {
          post_Data['virtualService'] = this.getVirtualServiceInput();
        } else {
          return false;
        }
      }
      console.log("Posting Data request:", post_Data);
      return post_Data;
    }
    else {
      let post_Data = {
        // 'schedule': {
        //     'id': this.selectedApptTime['scheduleId']
        // },
        'appmtDate': this.appmtDate,
        'service': {
          'id': this.selectedServiceId,
          'serviceType': this.selectedService.serviceType
        },
        'consumerNote': this.consumerNote,
        'countryCode': this.parentCustomer.userProfile.countryCode,
        'phoneNumber': this.commObj['communicationPhNo'],
        'coupons': this.selectedCoupons,
      };

      if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
        post_Data['provider'] = { 'id': this.selectedUser.id };
      } else if (this.selectedService.provider) {
        post_Data['provider'] = { 'id': this.selectedService.provider.id };
      }
      if (this.jcashamount > 0 && this.checkJcash) {
        post_Data['useCredit'] = this.checkJcredit
        post_Data['useJcash'] = this.checkJcash
      }
      if (this.scheduledAppointment) {
        post_Data['appmtFor'] = this.scheduledAppointment['appmtFor'];
      } else {
        if (this.appmtFor.length !== 0) {
          for (const list of this.appmtFor) {
            if (list.id === this.parentCustomer.id) {
              list['id'] = 0;
            }
          }
        }
        if (this.commObj['communicationEmail'] !== '') {
          this.appmtFor[0]['email'] = this.commObj['communicationEmail'];
        }
        post_Data['appmtFor'] = JSON.parse(JSON.stringify(this.appmtFor));
      }
      if (this.selectedService.serviceType === 'virtualService') {
        if (this.validateVirtualCallInfo(this.callingModes)) {
          post_Data['virtualService'] = this.getVirtualServiceInput();
        } else {
          return false;
        }
      }
      console.log("Posting Data Normal:", post_Data);
      return post_Data;
    }
  }
  async performAppointment() {
    const _this = this;
    if (this.selectedService.isPrePayment && !this.paymentMode && this.paymentDetails.amountRequiredNow > 0 && this.selectedService && (this.selectedService.serviceBookingType !== 'request')) {
      this.snackbarService.openSnackBar('Please select one payment mode', { 'panelClass': 'snackbarerror' });
      this.isClickedOnce = false;
      return false;
    }
    let count = 0;
    for (let i = 0; i < this.selectedSlots.length; i++) {
      console.log(i);
      await _this.takeAppointment(this.selectedSlots[i]).then(
        () => {
          count++;
          if (count === this.selectedSlots.length) {
            this.setAnalytics('payment_initiated');
            this.paymentOperation(this.paymentMode);
            if (_this.customId) {
              _this.sharedServices.addProvidertoFavourite(_this.accountId)
                .subscribe(() => { });
            }
          }
          console.log("Hi I am hree");
        }
      );
    }
  }

  takeAppointment(appmtSlot) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      console.log("Payment Req Id:", _this.paymentRequestId);
      if (_this.paymentRequestId) {
        resolve(true);
      } else {
        let post_Data = _this.generateInputForAppointment();
        // post_Data['appmtSlot'] = appmtSlot;
        if (!_this.selectedService.date && !_this.selectedService.noDateTime) {
          post_Data['appmtFor'][0]['apptTime'] = appmtSlot['time'];
        }
        post_Data['schedule'] = { 'id': appmtSlot['scheduleId'] };
        console.log("Post data:", post_Data);
        if (_this.selectedService.serviceBookingType === 'request' && (_this.selectedService.date || _this.selectedService.dateTime || _this.selectedService.noDateTime)) {
          _this.subs.sink = _this.sharedServices.postAppointmentRequest(_this.accountId, post_Data)
            .subscribe(data => {
              const retData = data;
              console.log("Request Data :", data);
              _this.appointmentIdsList = [];
              let parentUid;
              Object.keys(retData).forEach(key => {
                if (key === '_prepaymentAmount') {
                  _this.prepayAmount = retData['_prepaymentAmount'];
                } else {
                  _this.trackUuid = retData[key];
                  if (key !== 'parent_uuid') {
                    _this.appointmentIdsList.push(retData[key]);
                  }
                }
                parentUid = retData['parent_uuid'];
              });
              if (_this.selectedMessage.files.length > 0) {
                _this.consumerNoteAndFileSave(_this.appointmentIdsList).then(
                  () => {
                    resolve(true);
                  }
                );
              } else {
                _this.submitQuestionnaire(parentUid).then(
                  () => {
                    resolve(true);
                  }
                );
                _this.submitserviceOptionQuestionnaire(parentUid).then(
                  () => {
                    resolve(true);
                  }
                );
              }
              // _this.router.navigate(['consumer', 'appointment', 'confirm']);

            }, error => {
              _this.isClickedOnce = false;
              // if(error !== "Given schedule is provider's schedule"){
              // if(_this.selectedUserId === ''){
              _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              // }

            });
        }
        else {
          _this.subs.sink = _this.sharedServices.addCustomerAppointment(_this.accountId, post_Data)
            .subscribe(data => {
              const retData = data;
              _this.appointmentIdsList = [];
              let parentUid;
              Object.keys(retData).forEach(key => {
                if (key === '_prepaymentAmount') {
                  _this.prepayAmount = retData['_prepaymentAmount'];
                } else {
                  _this.trackUuid = retData[key];
                  if (key !== 'parent_uuid') {
                    _this.appointmentIdsList.push(retData[key]);
                  }
                }
                parentUid = retData['parent_uuid'];
              });
              if (_this.selectedMessage.files.length > 0) {
                _this.consumerNoteAndFileSave(_this.appointmentIdsList).then(
                  () => {
                    resolve(true);
                  }
                );
              } else {
                _this.submitQuestionnaire(parentUid).then(
                  () => {
                    resolve(true);
                  }
                );
                _this.submitserviceOptionQuestionnaire(parentUid).then(
                  () => {
                    resolve(true);
                  }
                );
              }
            }, error => {
              _this.isClickedOnce = false;
              _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
      }
    })
  }
  consumerNoteAndFileSave(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      const dataToSend: FormData = new FormData();
      const captions = {};
      let i = 0;
      if (_this.selectedMessage) {
        for (const pic of _this.selectedMessage.files) {
          dataToSend.append('attachments', pic, pic['name']);
          captions[i] = (_this.imgCaptions[i]) ? _this.imgCaptions[i] : '';
          i++;
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      // if(_this.selectedService.serviceBookingType === 'request'){
      //     _this.subs.sink = _this.sharedServices.addConsumerAppointmentAttachment(_this.accountId, uuid, dataToSend)
      //     .subscribe(
      //         () => {
      //             if (_this.appointmentType !== 'reschedule') {
      //                 _this.submitQuestionnaire(uuid).then(
      //                     () => {
      //                         resolve(true);
      //                     }
      //                 );
      //             } else {
      //                 let queryParams = {
      //                     account_id: _this.accountId,
      //                     uuid: _this.scheduledAppointment.uid,
      //                     type: 'reschedule',
      //                     theme: _this.theme
      //                 }
      //                 if (_this.customId) {
      //                     queryParams['customId'] = _this.customId;
      //                 }
      //                 if (_this.selectedSlots.length > 1) {
      //                     queryParams['selectedApptsTime'] = _this.selectedApptsTime;
      //                     queryParams['selectedSlots'] = JSON.stringify(_this.selectedSlots);
      //                 }
      //                 let navigationExtras: NavigationExtras = {
      //                     queryParams: queryParams
      //                 };
      //                 _this.setAnalytics();
      //                 _this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
      //             }
      //         }, error => {
      //             _this.isClickedOnce = false;
      //             _this.wordProcessor.apiErrorAutoHide(_this, error);
      //         }
      //     );
      // }
      // else{
      _this.subs.sink = _this.sharedServices.addConsumerAppointmentAttachment(_this.accountId, uuid, dataToSend)
        .subscribe(
          () => {
            if (_this.appointmentType !== 'reschedule') {
              _this.submitQuestionnaire(uuid).then(
                () => {
                  resolve(true);
                }
              );
            } else {
              let queryParams = {
                account_id: _this.accountId,
                uuid: _this.scheduledAppointment.uid,
                type: 'reschedule',
                theme: _this.theme
              }
              if (_this.customId) {
                queryParams['customId'] = _this.customId;
              }
              if (_this.selectedSlots.length > 1) {
                queryParams['selectedApptsTime'] = _this.selectedApptsTime;
                queryParams['selectedSlots'] = JSON.stringify(_this.selectedSlots);
              }
              let navigationExtras: NavigationExtras = {
                queryParams: queryParams
              };
              _this.setAnalytics();
              _this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
            }
          }, error => {
            _this.isClickedOnce = false;
            _this.wordProcessor.apiErrorAutoHide(_this, error);
          }
        );
      // }

    })
  }
  setAnalytics(source?) {
    const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');

    let analytics = {
      accId: this.businessProfile.id,
      domId: this.businessProfile.serviceSector.id,
      subDomId: this.businessProfile.serviceSubSector.id
    }
    console.log("CustomId:", this.customId);
    if (this.customId) {
      if (reqFrom && reqFrom == 'cuA') {
        if (source === 'dateTime_login') {
          analytics['metricId'] = 511;
        } else if (source === 'dateTime_withoutlogin') {
          analytics['metricId'] = 512;
        } else if (source === 'payment_initiated') {
          analytics['metricId'] = 516;
        } else if (source === 'payment_completed') {
          analytics['metricId'] = 519;
        } else {
          analytics['metricId'] = 501;
        }

      } else if (reqFrom && reqFrom == 'CUSTOM_WEBSITE') {
        if (source === 'dateTime_login') {
          analytics['metricId'] = 513;
        } else if (source === 'dateTime_withoutlogin') {
          analytics['metricId'] = 514;
        } else if (source === 'payment_initiated') {
          analytics['metricId'] = 517;
        } else if (source === 'payment_completed') {
          analytics['metricId'] = 520;
        } else {
          analytics['metricId'] = 502;
        }
      } else if (this.customId) {
        if (source === 'dateTime_login') {
          analytics['metricId'] = 509;
        } else if (source === 'dateTime_withoutlogin') {
          analytics['metricId'] = 510;
        } else if (source === 'payment_initiated') {
          analytics['metricId'] = 515;
        } else if (source === 'payment_completed') {
          analytics['metricId'] = 518;
        } else {
          analytics['metricId'] = 500;
        }
      }
      this.sharedServices.updateAnalytics(analytics).subscribe();
    }
  }
  submitOneTimeInfo() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
        const dataToSend: FormData = new FormData();
        if (_this.oneTimeInfo.files) {
          for (const pic of _this.oneTimeInfo.files) {
            dataToSend.append('files', pic, pic['name']);
          }
        }
        const blobpost_Data = new Blob([JSON.stringify(_this.oneTimeInfo.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        _this.subs.sink = _this.sharedServices.submitCustomerOnetimeInfo(dataToSend, _this.providerConsumerId, _this.accountId).subscribe((data: any) => {
          resolve(true);
        }, error => {
          _this.isClickedOnce = false;
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });
  }
  submitQuestionnaire(uuid, paymenttype?) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
        const dataToSend: FormData = new FormData();
        if (_this.questionAnswers.files) {
          for (const pic of _this.questionAnswers.files) {
            dataToSend.append('files', pic, pic['name']);
          }
        }
        const blobpost_Data = new Blob([JSON.stringify(_this.questionAnswers.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        _this.subs.sink = _this.sharedServices.submitConsumerApptQuestionnaire(dataToSend, uuid, _this.accountId).subscribe((data: any) => {
          let postData = {
            urls: []
          };
          if (data.urls && data.urls.length > 0) {
            for (const url of data.urls) {
              _this.api_loading_video = true;
              const file = _this.questionAnswers.filestoUpload[url.labelName][url.document];
              _this.providerServices.videoaudioS3Upload(file, url.url)
                .subscribe(() => {
                  postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                  if (data.urls.length === postData['urls'].length) {
                    _this.sharedServices.consumerApptQnrUploadStatusUpdate(uuid, _this.accountId, postData)
                      .subscribe((data) => {
                        resolve(true);
                      }, error => {
                        _this.isClickedOnce = false;
                        _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        _this.api_loading_video = false;
                        resolve(false);
                      });
                  }
                }, error => {
                  _this.isClickedOnce = false;
                  _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  _this.api_loading_video = false;
                });
            }
          } else {
            resolve(true);

          }
        }, error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.disablebutton = false;
          this.api_loading_video = false;
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });
  }
  paymentOperation(paymenttype?) {
    if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0 && this.selectedService && (this.selectedService.serviceBookingType !== 'request')) {
      this.payuPayment(paymenttype);
    } else {
      let queryParams = {
        account_id: this.accountId,
        uuid: this.trackUuid,
        theme: this.theme
      }
      if (this.selectedSlots.length > 1) {
        queryParams['selectedApptsTime'] = this.selectedApptsTime;
        queryParams['selectedSlots'] = JSON.stringify(this.selectedSlots);
      }
      if (this.customId) {
        queryParams['customId'] = this.customId;
      }
      let navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.setAnalytics();
      this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
    }
  }
  payuPayment(paymenttype?) {
    this.makeFailedPayment(paymenttype);
  }
  makeFailedPayment(paymentMode) {
    this.paymentReqInfo = {
      'amount': this.paymentDetails.amountRequiredNow,
      'paymentMode': null,
      'uuid': this.trackUuid,
      'accountId': this.accountId,
      'purpose': 'prePayment'
    };
    this.paymentReqInfo.paymentMode = paymentMode;
    this.paymentReqInfo['serviceId'] = this.selectedServiceId;
    this.paymentReqInfo['isInternational'] = this.isInternational;

    if (this.paymentRequestId) {
      this.paymentReqInfo['paymentRequestId'] = this.paymentRequestId;
    }
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = res
      if (this.convenientFeeObj && this.convenientFeeObj.isInternational && this.isInternational) {
        if (this.paymentMode === this.convenientFeeObj.mode) {
          this.paymentReqInfo['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
          this.paymentReqInfo['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
          this.paymentReqInfo['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
          this.paymentReqInfo['profileId'] = this.paymentmodes.profileId;
          this.paymentReqInfo['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
          this.paymentReqInfo['paymentGateway'] = this.convenientFeeObj.gateway
          console.log("Non-Indian Payment Info", this.paymentReqInfo)
        }
      }
      if (this.convenientFeeObj && !this.convenientFeeObj.isInternational && !this.isInternational) {
        if (this.paymentMode === this.convenientFeeObj.mode) {
          this.paymentReqInfo['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
          this.paymentReqInfo['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
          this.paymentReqInfo['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
          this.paymentReqInfo['profileId'] = this.paymentmodes.profileId;
          this.paymentReqInfo['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
          this.paymentReqInfo['paymentGateway'] = this.convenientFeeObj.gateway
          console.log("Indian Payment Info", this.paymentReqInfo)
        }
      }
    })

    this.lStorageService.setitemonLocalStorage('uuid', this.trackUuid);
    this.lStorageService.setitemonLocalStorage('acid', this.accountId);
    this.lStorageService.setitemonLocalStorage('p_src', 'c_c');
    console.log("paymentReqInfo:", this.paymentReqInfo);
    if (this.remainingadvanceamount == 0 && this.checkJcash) {
      const postData = {
        'amountToPay': this.paymentDetails.amountRequiredNow,
        'accountId': this.accountId,
        'uuid': this.trackUuid,
        'paymentPurpose': 'prePayment',
        'isJcashUsed': true,
        'isreditUsed': false,
        'isRazorPayPayment': false,
        'isPayTmPayment': false,
        'paymentMode': "JCASH"
      };
      this.sharedServices.PayByJaldeewallet(postData)
        .subscribe(data => {
          this.wallet = data;
          if (!this.wallet.isGateWayPaymentNeeded && this.wallet.isJCashPaymentSucess) {
            setTimeout(() => {
              this.setAnalytics();
              this.router.navigate(['consumer', 'appointment', 'confirm'], { queryParams: { account_id: this.accountId, uuid: this.trackUuid } });
            }, 500);
          }
        }, error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else if (this.remainingadvanceamount > 0 && this.checkJcash) {
      const postData: any = {
        'amountToPay': this.paymentDetails.amountRequiredNow,
        'accountId': this.accountId,
        'uuid': this.trackUuid,
        'paymentPurpose': 'prePayment',
        'isJcashUsed': true,
        'isreditUsed': false,
        'isRazorPayPayment': false,
        'isPayTmPayment': false,
        'paymentMode': null
      };
      postData.paymentMode = paymentMode;
      postData.isInternational = this.isInternational;
      postData.serviceId = this.selectedServiceId;
      this.sharedServices.PayByJaldeewallet(postData)
        .subscribe((pData: any) => {
          if (pData.isGateWayPaymentNeeded == true && pData.isJCashPaymentSucess == true) {
            if (pData.paymentGateway == 'PAYTM') {
              this.payWithPayTM(pData.response, this.accountId);
            } else {
              this.paywithRazorpay(pData.response);
            }
          }
        }, error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.subs.sink = this.sharedServices.consumerPayment(this.paymentReqInfo)
        .subscribe((pData: any) => {
          console.log(JSON.stringify(pData));
          this.paymentRequestId = pData['paymentRequestId'];
          this.pGateway = pData.paymentGateway;
          if (this.pGateway === 'RAZORPAY') {
            this.paywithRazorpay(pData);
          } else {
            if (pData['response']) {
              this.payWithPayTM(pData, this.accountId);
            } else {
              this.isClickedOnce = false;
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
            }
          }
        }, error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }
  }
  paywithRazorpay(pData: any) {
    pData.paymentMode = this.paymentMode;
    this.razorpayService.initializePayment(pData, this.accountId, this);
  }
  payWithPayTM(pData: any, accountId: any) {
    this.loadingPaytm = true;
    pData.paymentMode = this.paymentMode;
    this.paytmService.initializePayment(pData, accountId, this);
  }
  finishAppointment(status) {
    if (status) {
      this.isClickedOnce = false;
      this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
      let queryParams = {
        account_id: this.accountId,
        uuid: this.trackUuid,
        theme: this.theme
      }
      if (this.customId) {
        queryParams['customId'] = this.customId;
      }
      if (this.from) {
        queryParams['isFrom'] = this.from;
      }
      if (this.selectedSlots.length > 1) {
        queryParams['selectedApptsTime'] = this.selectedApptsTime;
        queryParams['selectedSlots'] = JSON.stringify(this.selectedSlots);
      }
      let navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.setAnalytics();
      this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras));
    } else {
      this.closeloading();
    }
  }

  transactionCompleted(response, payload, accountId) {
    console.log("Response:", response);
    if (response.SRC) {
      if (response.STATUS == 'TXN_SUCCESS') {
        this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
          .then((data) => {
            if (data) {
              this.setAnalytics('payment_completed');
              this.finishAppointment(true);
            }
          })
      } else if (response.STATUS == 'TXN_FAILURE') {
        if (response.error && response.error.description) {
          this.snackbarService.openSnackBar(response.error.description, { 'panelClass': 'snackbarerror' });
        }
        this.finishAppointment(false);
      }
    } else {
      if (response.STATUS == 'TXN_SUCCESS') {
        this.paytmService.updatePaytmPay(payload, accountId)
          .then((data) => {
            if (data) {
              this.setAnalytics('payment_completed');
              this.finishAppointment(true);
            }
          })
      } else if (response.STATUS == 'TXN_FAILURE') {
        this.snackbarService.openSnackBar(response.RESPMSG, { 'panelClass': 'snackbarerror' });
        this.finishAppointment(false);
      }
    }
  }
  viewAttachments() {
    this.action = 'attachment';
    this.modal.nativeElement.click();
  }
  changeJcashUse(event) {
    if (event.checked) {
      this.checkJcash = true;
    } else {
      this.checkJcash = false;
    }
  }

  getThumbUrl(attachment) {
    if (attachment && attachment.s3path) {
      if (attachment.s3path.indexOf('.pdf') !== -1) {
        return attachment.thumbPath;
      } else {
        return attachment.s3path;
      }
    }
  }
  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  addMember() {
    this.action = 'addmember';
    this.disable = false;
  }
  /**
  *
  * @param selectedMembers
  */
  memberSelected(selectedMembers) {
    const _this = this;
    console.log("selected Member :", selectedMembers);
    // this.waitlistForPrev = this.waitlist_for;
    _this.appmtFor = selectedMembers;
    console.log(_this.appmtFor);
    if (_this.selectedService && _this.selectedService.minPrePaymentAmount) {
      _this.prepaymentAmount = _this.appmtFor.length * _this.selectedService.minPrePaymentAmount || 0;
    }
    _this.serviceCost = _this.appmtFor.length * _this.selectedService.price;
  }
  handleReturnDetails(obj) {
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    this.addmemberobj.gender = obj.gender || '';
    this.addmemberobj.dob = obj.dob || '';
  }
  handleConsumerNote(vale) {
    this.consumerNote = vale;
  }
  removeJCoupon(i) {
    this.selectedCoupons.splice(i, 1);
    this.couponsList.splice(i, 1);
    this.checkCouponvalidity();
  }
  toggleterms(i) {
    if (this.couponsList[i].showme) {
      this.couponsList[i].showme = false;
    } else {
      this.couponsList[i].showme = true;
    }
  }
  clearCouponErrors() {
    this.couponValid = true;
    this.couponError = null;
  }
  popupClosed() {
  }
  rescheduleAppointment() {
    this.btnClicked = true;
    const post_Data = {
      'uid': this.scheduledAppmtId,
      //'time': this.selectedSlots[0].time,
      'date': this.appmtDate,
      // 'schedule': this.selectedSlots[0]['scheduleId'],
      'consumerNote': this.consumerNote
    };
    if (this.selectedSlots[0].time) {
      post_Data['time'] = this.selectedSlots[0].time;
    }
    if (this.selectedSlots[0]['scheduleId']) {
      post_Data['schedule'] = this.selectedSlots[0]['scheduleId'];
    }
    console.log("Reschedule :", post_Data);

    this.subs.sink = this.sharedServices.rescheduleConsumerApptmnt(this.accountId, post_Data)
      .subscribe(
        (res) => {
          console.log("reschedule res :", res);
          this.btnClicked = false;
          if (this.selectedMessage.files.length > 0) {
            this.consumerNoteAndFileSave(this.scheduledAppmtId);
          } else {
            let queryParams = {
              account_id: this.accountId,
              uuid: this.scheduledAppointment.uid,
              type: 'reschedule',
              theme: this.theme
            }
            if (this.customId) {
              queryParams['customId'] = this.customId;
            }
            let navigationExtras: NavigationExtras = {
              queryParams: queryParams
            };
            this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
          }
        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.btnClicked = false;
        });
  }
  closeloading() {
    this.btnClicked = false;
    this.loadingPaytm = false;
    this.cdRef.detectChanges();
    // this.snackbarService.openSnackBar('Payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    return false;
  }
  submitserviceOptionQuestionnaire(uuid) {

    const _this = this;
    this.groupedQnr = this.serviceOPtionInfo.answers.answerLine.reduce(function (rv, x) {
      (rv[x.sequenceId] = rv[x.sequenceId] || []).push(x);
      return rv;
    }, {});

    let finalList = [];
    let finalSubList = [];
    for (var key in this.groupedQnr) {
      if (this.groupedQnr.hasOwnProperty(key)) {
        var val = this.groupedQnr[key];
        val.forEach(element => {
          if (finalSubList.length === 0) {
            finalSubList.push(element.dgList[0])
          }
          else {
            finalSubList[0].answer.dataGridList.push(element.dgList[0].answer.dataGridList[0])
          }

        });
        finalList.push(finalSubList[0]);
        this.advPostData = finalList;
        console.log('this.advPostDataa:',this.advPostData)
        finalSubList = [];
      }
    }

    this.finalDataToSend = {
      'questionnaireId': this.serviceOPtionInfo.answers.questionnaireId,
      'answerLine': finalList
    }
    const data = this.finalDataToSend
    return new Promise(function (resolve, reject) {
      const dataToSend: FormData = new FormData();
      if (data.files) {
        for (const pic of data.files) {
          dataToSend.append('files', pic, pic['name']);
        }
      }
      const blobpost_Data = new Blob([JSON.stringify(data)], { type: 'application/json' });
      dataToSend.append('question', blobpost_Data);
      _this.subs.sink = _this.sharedServices.submitConsumerApptServiceOption(dataToSend, uuid, _this.accountId).subscribe((data: any) => {
        resolve(true);
      },
        error => {
          _this.isClickedOnce = false;
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          // _this.disablebutton = false;
          resolve(false);
          // this.api_loading_video = false;
        });

    });

  }
  getserviceOptionQuestionAnswers(event) {
    this.serviceOPtionInfo = event;
    console.log(JSON.stringify(this.serviceOPtionInfo))
    if (this.serviceOPtionInfo.answers.answerLine === '') {
      console.log(this.showNext)
      this.showNext = false;
    }
    else {
      console.log('ggggggggg')
      console.log(this.showNext)
      this.showNext = true;
    }
    this.lStorageService.setitemonLocalStorage('serviceOPtionInfo', this.serviceOPtionInfo);
  }

  qnrPopup() {
    const dialogref = this.dialog.open(QnrDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {

      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    );
  }
  showText() {
    this.readMore = !this.readMore;
  }
}
