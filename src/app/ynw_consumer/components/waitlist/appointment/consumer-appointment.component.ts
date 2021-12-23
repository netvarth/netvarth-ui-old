import { Component, ElementRef, Inject, OnInit, ViewChild, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import * as moment from 'moment';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DOCUMENT, Location } from '@angular/common';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { DomSanitizer } from '../../../../../../node_modules/@angular/platform-browser';
import { ConsumerEmailComponent } from '../../../shared/component/consumer-email/consumer-email.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaytmService } from '../../../../shared/services/paytm.service';
import { JcCouponNoteComponent } from '../../../../shared/modules/jc-coupon-note/jc-coupon-note.component';
import { CustomerService } from '../../../../shared/services/customer.service';



@Component({
    selector: 'app-consumer-appointment',
    templateUrl: './consumer-appointment.component.html',
    styleUrls: ['./consumer-appointment.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class ConsumerAppointmentComponent implements OnInit, OnDestroy {
    paymentBtnDisabled = false;
    isClickedOnce = false;
    tooltipcls = '';
    add_member_cap = Messages.ADD_MEMBER_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    applied_inbilltime = Messages.APPLIED_INBILLTIME;
    domain;
    note_placeholder;
    s3url;
    api_cp_error = null;
    services: any = [];
    servicesjson: any = [];
    serviceslist: any = [];
    galleryjson: any = [];
    settingsjson: any = [];
    locationjson: any = [];
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    checkPolicy = true;
    partysizejson: any = [];
    sel_loc;

    prepaymentAmount = 0;
    checkindisablemsg = '';
    pass_loc;
    sel_queue_id;
    sel_queue_waitingmins;
    sel_queue_servicetime = '';
    sel_queue_name;
    sel_queue_timecaption;
    sel_queue_indx;
    sel_queue_det;
    sel_queue_personaahead = 0;
    calc_mode;
    partySize = false;
    partySizeRequired = null;
    today;
    heartfulnessAccount = false;
    minDate;
    maxDate;
    consumerNote = '';
    enterd_partySize = 1;
    holdenterd_partySize = 0;
    showCreateMember = false;
    sel_checkindate;
    hold_sel_checkindate;
    sel_dayname;
    account_id;
    retval;
    futuredate_allowed = false;
    step;
    waitlist_for: any = [];
    holdwaitlist_for: any = [];
    loggedinuser;
    maxsize;
    isFuturedate = false;
    addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
    userN = { 'id': 0, 'firstName': Messages.NOUSERCAP, 'lastName': '' };
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    fromKiosk = false;
    page_source = null;
    dispCustomernote = false;
    dispCustomerEmail = false;
    CweekDays = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
    queueQryExecuted = false;
    todaydate;
    estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
    nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
    checkinCaption = Messages.CHECKIN_TIME_CAPTION;
    checkinsCaption = Messages.CHECKINS_TIME_CAPTION;
    ddate;
    hideEditButton = false;

    server_date;
    api_loading1 = true;
    departmentlist: any = [];
    departments: any = [];
    selected_dept;
    selected_user;
    filterDepart = false;
    countryCodes = projectConstantsLocal.CONSUMER_COUNTRY_CODES;
    userData: any = [];
    userEmail;
    users: any = [];
    emailExist = false;
    emailerror = null;
    changePhno = false;
    selected_phone;
    trackUuid;
    consumer_dob;
    consumer_location;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    activeWt;
    searchForm: FormGroup;
    apptTime = '';
    selectedApptTime = '';
    allSlots: any = [];
    availableSlots: any = [];
    data;
    provider_id: any;
    isfirstCheckinOffer: any;
    s3CouponsList: any = {
        JC: [], OWN: []
    };
    appointmentSettings: any = [];
    subscription: Subscription;
    showCouponWB: boolean;
    change_date: any;
    liveTrack = false;
    carouselOne;
    notes = false;
    action: any = '';
    slots;
    freeSlots: any = [];
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    showInputSection = false;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    showApptTime = false;
    tele_srv_stat: any;
    couponvalid = true;
    selected_coupons: any = [];
    selected_coupon;
    couponsList: any = [];
    coupon_status = null;
    is_wtsap_empty = false;
    selectedDeptParam;
    selectedUserParam;
    rescheduleUserId;
    type;
    appointment: any = [];
    selectedUser;
    accountType;
    futureAppt = false;
    disable = false;

    note_cap = '';
    servicedialogRef: any;
    apptdisable = false;
    availableDates: any = [];
    holdselectedTime;
    noPhoneError = false;
    noEmailError = false;
    whatsapperror = '';
    serviceCost;
    phoneNumber;
    separateDialCode = true;
    phoneError: string;
    dialCode;
    newselected_phone;
    showmoreSpec = false;
    @ViewChild('imagefile') fileInput: ElementRef;
    bookStep = 1;
    locationName;
    waitlistDetails: any;
    pGateway: any;
    razorModel: Razorpaymodel;
    uuidList: any = [];
    prepayAmount;
    paymentDetails: any = [];
    questionnaireList: any = [];
    paymentLength = 0;
    @ViewChild('closebutton') closebutton;
    @ViewChild('modal') modal;
    apiError = '';
    apiSuccess = '';
    questionAnswers;
    googleMapUrl;
    selectedDate;
    private subs = new SubSink();
    questionnaireLoaded = false;
    checkJcash = false;
    checkJcredit = false;
    jaldeecash: any;
    jcashamount: any;
    jcreditamount: any;
    remainingadvanceamount;
    amounttopay: any;
    wallet: any;
    payAmount: number;
    imgCaptions: any = [];
    virtualInfo: any;
    theme: any;
    customId: any; // To know the source whether the router came from Landing page or not
    businessId: any;
    virtualFields: any;
    whatsappCountryCode;
    disablebutton = false;
    consumerType: string;
    newMember: any;
    readMore = false;
    loadingPaytm = false;
    api_loading_video;
    payment_options: any = [];
    paytmEnabled = false;
    razorpayEnabled = false;
    interNatioanalPaid = false;
    @ViewChild('consumer_appointment') paytmview;
    paymentmodes: any;
    customer_countrycode: any;
    currentScheduleId: any;
    pricelist: any;
    changePrice: number;
    amountdifference: any;
    from: string;
    isPayment: boolean;
    indian_payment_modes: any = [];
    non_indian_modes: any = [];
    shownonIndianModes: boolean;
    selected_payment_mode: any;
    isInternatonal: boolean;
    editable: boolean = false;
    // serviceType: any;
    lngknown = 'yes';
    virtualForm: FormGroup;
    gender_cap = Messages.GENDER_CAP;
    selectedLocation;
    locations;
    consumer_label: any;
    disableButton;
    loading = false;
    submitbtndisabled = false;
    languages = [
        "Hindi",
        "Kannada",
        "Malayalam",
        "Tamil",
        "Telugu"
    ];
    hideLanguages = true;
    hideTokenFor = true;
    api_loading = true;
    // api_loading1 = true;
    new_member;
    //private subs = new SubSink();
    is_parent = true;
    chosen_person: any;
    // maxDate = moment(new Date()).format('YYYY-MM-DD')
    //consumerType = '';
    activeUser: any;
    memberObject: any;
    // theme: any;
    //selectedDate: number;
    selectedMonth: number;
    selectedYear: number;
    selectedTime: any;
    allDates: any[] = [];
    dates: any[] = [];
    years: number[] = [];
    months: { value: string; name: string; }[];
    mob_prefix_cap = '+91';
    mandatoryEmail: any;
    age: any;
    userId: any;
    //countryCode: any;
    serviceDetails: any;
    provider: any;
    languageSelected: any = [];
    iseditLanguage = false;
    bgColor: string;
    // selectedTime: any;

    familyMembers: any = [];
    selectedServiceId: any;
    selectedService: any;
    parentCustomer;
    countryCode;
    commObj = {}
    waitlistForPrev: any = [];
    multipleMembers_allowed = false; // No multiple selection

    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        public route: ActivatedRoute,
        public provider_services: ProviderServices,
        public datastorage: CommonDataStorageService,
        public location: Location,
        private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        public prefillmodel: RazorpayprefillModel,
        private dateTimeProcessor: DateTimeProcessor,
        private s3Processor: S3UrlProcessor,
        private cdRef: ChangeDetectorRef,
        private paytmService: PaytmService,
        private customerService: CustomerService,
        @Inject(DOCUMENT) public document,
        private ngZone: NgZone,
        public dialog: MatDialog) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                console.log('params>>.', params)
                if (params.ctime) {
                    console.log('****************************')
                    this.selectedTime = params.ctime

                }
                this.sel_loc = params.loc_id;
                this.locationName = params.locname;
                this.googleMapUrl = params.googleMapUrl;
                if (params.qid) {
                    this.sel_queue_id = params.qid;
                }
                if (params.isFrom && params.isFrom == 'providerdetail') {
                    this.from = 'providerdetail';
                }
                this.change_date = params.cur;
                this.futureAppt = params.futureAppt;
                this.account_id = params.account_id;
                this.provider_id = params.unique_id;
                this.sel_checkindate = this.selectedDate = params.sel_date;
                this.hold_sel_checkindate = this.sel_checkindate;
                this.tele_srv_stat = params.tel_serv_stat;
                if (this.tele_srv_stat === 'true') { this.bookStep = 0; } else { this.bookStep = 1; }
                if (params.dept) {
                    this.selectedDeptParam = parseInt(params.dept);
                    this.filterDepart = true;
                }
                if (params.user) { this.selectedUserParam = params.user; }
                if (params.service_id) { this.selectedServiceId = parseInt(params.service_id); }
                if (params.type === 'reschedule') {
                    this.type = params.type;
                    this.rescheduleUserId = params.uuid;
                    this.getRescheduleApptDet();
                }
                if (params.theme) {
                    this.theme = params.theme;
                }
                if (params.customId) {
                    this.customId = params.customId;
                    this.businessId = this.account_id;
                }
            }
        );
    }
    ngOnInit() {
        const _this = this;
        this.maxsize = 1;
        this.step = 1;
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        if (this.server_date) {
            this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        }
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        const dd = this.today.getDate();
        const mm = this.today.getMonth() + 1; // January is 0!
        const yyyy = this.today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
            cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        this.todaydate = dtoday;
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
        this.minDate = this.todaydate;
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        const dt1 = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date1 = new Date(dt1);
        const dt2 = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date2 = new Date(dt2);
        if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        }
        if (this.selectedServiceId) {
            this.getPaymentModes();
        }
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.gets3curl(); // Collecting informations from s3 businessProfile, settings etc.
        this.customerService.getCustomerInfo(this.activeUser.id).then(data => {
            _this.parentCustomer = data;
            if (_this.tele_srv_stat === 'true') {
                _this.createVirtualForm();
            }
            _this.waitlist_for.push({ id: _this.parentCustomer.id, firstName: _this.parentCustomer.userProfile.firstName, lastName: _this.parentCustomer.userProfile.lastName });
            _this.setConsumerFamilyMembers(_this.parentCustomer.id); // Load Family Members
            if (_this.tele_srv_stat === 'true') {
                _this.onServiceForChange(_this.parentCustomer.id);
            }
            _this.getServicebyLocationId(_this.sel_loc, _this.sel_checkindate);
            _this.getSchedulesbyLocationandServiceIdavailability(_this.sel_loc, _this.selectedServiceId, _this.account_id);
            _this.initCommunications(this.parentCustomer);
        });
    }
    getBookStep() {
        let step: any = '';
        if (this.tele_srv_stat === 'true') {
            step = 3;
            if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                step = 4;
            }
        } else {
            step = 2;
            if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                step = 3;
            }
        }
        return step;
    }

    goToEdit() {
        this.bgColor = '#C0C0C0';
        //+(Math.random()*0xC0C0C0<<0).toString(16);
        // '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        this.virtualInfo = this.virtualForm.value;
        console.log(this.virtualInfo);
        this.selectedLocation = this.virtualInfo.location;

        if (this.selectedLocation == '') {
            this.editable = true;
            console.log("Is Editable :", this.editable);
        }
        else {
            this.editable = false;
            console.log("Is Editable :", this.editable);
        }
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }

    isNumericSign(evt) {
        return this.sharedFunctionobj.isNumericSign(evt);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    getImageSrc(mode) {
        return 'assets/images/payment-modes/' + mode + '.png';
    }
    getRescheduleApptDet() {
        this.subs.sink = this.shared_services.getAppointmentByConsumerUUID(this.rescheduleUserId, this.account_id).subscribe(
            (appt: any) => {
                this.appointment = appt;
                if (this.type === 'reschedule') {
                    this.waitlist_for.push({ id: this.appointment.appmtFor[0].id, firstName: this.appointment.appmtFor[0].firstName, lastName: this.appointment.appmtFor[0].lastName, phoneNo: this.appointment.phoneNumber });
                    
                    this.commObj['communicationPhNo'] = this.appointment.phoneNumber;
                    this.commObj['communicationPhCountryCode'] = this.appointment.countryCode;
                    this.commObj['communicationEmail'] = this.appointment.appmtFor[0]['email'];

                    if (this.appointment.appmtFor[0].whatsAppNum) {
                        this.commObj['comWhatsappNo'] = this.appointment.waitlistingFor[0].whatsAppNum.number;
                        this.commObj['comWhatsappCountryCode'] = this.appointment.waitlistingFor[0].whatsAppNum.countryCode;
                    } else {
                        this.commObj['comWhatsappNo'] = this.parentCustomer.userProfile.primaryMobileNo;
                        this.commObj['comWhatsappCountryCode'] = this.parentCustomer.userProfile.countryCode;
                    }

                    this.consumerNote = this.appointment.consumerNote;

                }
                this.sel_loc = this.appointment.location.id;
                this.selectedServiceId = this.appointment.service.id;
                this.sel_checkindate = this.selectedDate = this.hold_sel_checkindate = this.appointment.appmtDate;
                if (this.sel_checkindate !== this.todaydate) {
                    this.isFuturedate = true;
                }
                this.currentScheduleId = this.appointment.schedule.id;
                this.selectedServiceId = this.appointment.service.id;
                this.holdselectedTime = this.appointment.appmtTime;
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedServiceId, this.account_id);
            });
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.provider_services.getWaitlistMgr()
                .subscribe(
                    data => {
                        _this.settingsjson = data;
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink == _this.provider_services.getBussinessProfile()
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
    changeSlot() {
        this.action = 'slotChange';
    }
    resetApiErrors() {
        this.emailerror = null;
    }
    setServiceDetails(curservid) {
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        if (this.type === 'reschedule') {
                            if (serv.virtualCallingModes[0].callingMode === 'WhatsApp') {
                                this.callingModes = this.appointment.virtualService['WhatsApp'];
                            } else {
                                this.callingModes = this.appointment.virtualService['Phone'];
                            }
                            const phNumber = this.appointment.countryCode + this.appointment.phoneNumber;
                            const callMode = '+' + serv.virtualCallingModes[0].value;
                            if (callMode === phNumber) {
                                this.changePhno = false;
                            } else {
                                this.changePhno = true;
                            }
                        } else {
                            // const unChangedPhnoCountryCode = this.countryCode.split('+')[1];
                            this.callingModes = this.parentCustomer.userProfile.countryCode + '' + this.parentCustomer.primaryPhoneNumber;
                            if (serv.serviceType === 'virtualService' && this.virtualInfo) {
                                if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                                    const whtsappcountryCode = this.virtualInfo.countryCode_whtsap.split('+')[1];
                                    this.callingModes = whtsappcountryCode + '' + this.virtualInfo.whatsappnumber;
                                }
                            }
                        }
                    }
                }
                break;
            }
        };
        this.selectedUser = null;
        this.selected_dept = null;
        this.selectedUserParam = null;
        this.selectedDeptParam = null;
        if (serv.provider) {
            this.selectedUserParam = serv.provider.id;
            this.setUserDetails(this.selectedUserParam);
        }
        if (this.filterDepart) {
            this.selectedDeptParam = serv.department;
            this.getDepartmentById(this.selectedDeptParam);
        }
        this.selectedServiceId = serv.id;
        this.selectedService = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            livetrack: serv.livetrack,
            price: serv.totalAmount,
            isPrePayment: serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable,
            serviceType: serv.serviceType,
            virtualServiceType: serv.virtualServiceType,
            virtualCallingModes: serv.virtualCallingModes,
            postInfoEnabled: serv.postInfoEnabled,
            postInfoText: serv.postInfoText,
            postInfoTitle: serv.postInfoTitle,
            preInfoEnabled: serv.preInfoEnabled,
            preInfoTitle: serv.preInfoTitle,
            preInfoText: serv.preInfoText,
            consumerNoteMandatory: serv.consumerNoteMandatory,
            consumerNoteTitle: serv.consumerNoteTitle
        };
        if (serv.provider) {
            this.selectedService.provider = serv.provider;
        }
        if (serv.provider) {
            this.selectedService['providerId'] = serv.provider.id;
        }
        this.prepaymentAmount = this.waitlist_for.length * this.selectedService.minPrePaymentAmount || 0;
        this.serviceCost = this.selectedService.price;
    }
    getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.subs.sink = _this.shared_services.getAvailableDatessByLocationService(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.availableSlots);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    getAvailableSlotByLocationandService(locid, servid, pdate, accountid, type?) {
        this.subs.sink = this.shared_services.getSlotsByLocationServiceandDate(locid, servid, pdate, accountid)
            .subscribe(data => {
                this.slots = data;
                this.freeSlots = [];
                for (const scheduleSlots of this.slots) {
                    this.availableSlots = scheduleSlots.availableSlots;
                    for (const freslot of this.availableSlots) {
                        if ((freslot.noOfAvailbleSlots !== '0' && freslot.active) || (freslot.time === this.appointment.appmtTime && scheduleSlots['date'] === this.sel_checkindate)) {
                            freslot['scheduleId'] = scheduleSlots['scheduleId'];
                            freslot['displayTime'] = this.getSingleTime(freslot.time);
                            this.freeSlots.push(freslot);
                        }
                    }
                }
                if (this.freeSlots.length > 0) {
                    this.showApptTime = true;
                    if (this.appointment && this.appointment.appmtTime && this.sel_checkindate === this.selectedDate) {
                        const appttime = this.freeSlots.filter(slot => slot.time === this.appointment.appmtTime);
                        this.apptTime = appttime[0];
                    } else {
                        console.log(this.selectedTime)
                        if (this.selectedTime) {
                            const appttime = this.freeSlots.filter(slot => slot.displayTime === this.selectedTime);
                            if (appttime) {
                                this.apptTime = appttime[0];
                            }

                            console.log("**********")
                        } else {
                            this.apptTime = this.freeSlots[0];
                        }


                    }
                    this.waitlist_for[0].apptTime = this.apptTime['time'];
                } else {
                    this.showApptTime = false;
                }
                if (type) {
                    this.selectedApptTime = this.apptTime;
                }
                this.api_loading1 = false;
            });
    }

    handleConsumerNote(vale) {
        this.consumerNote = vale;
    }
    handleFutureDateChange(e) {
        const tdate = e.targetElement.value;
        const newdate = tdate.split('/').reverse().join('-');
        const futrDte = new Date(newdate);
        const obtmonth = (futrDte.getMonth() + 1);
        let cmonth = '' + obtmonth;
        if (obtmonth < 10) {
            cmonth = '0' + obtmonth;
        }
        const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
        this.sel_checkindate = seldate;
        this.getAvailableSlotByLocationandService(this.sel_loc, this.selectedServiceId, this.sel_checkindate, this.account_id);
    }
    checkFutureorToday() {
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        const dte0 = this.selectedDate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
        const datee2 = new Date(dte2);
        if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
        }
    }
    handleApptClicked() {
        this.apptdisable = true;
        let error = '';
        if (this.step === 1) {
            if (this.partySizeRequired) {
                error = this.validatorPartysize(this.enterd_partySize);
            }
            if (error === '') {
                this.saveCheckin();
            } else {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.apptdisable = false;
            }
        }
    }
    confirmcheckin(type?, paymenttype?) {
        if (type === 'appt' && this.selectedService.isPrePayment && this.commObj['communicationEmail'] === '') {
            const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
                width: '40%',
                panelClass: ['loginmainclass', 'popup-class'],
            });
            emaildialogRef.afterClosed().subscribe(result => {
                if (result !== '' && result !== undefined) {
                    this.commObj['communicationEmail'] = result;
                    this.confirmcheckin(type, paymenttype);
                } else {
                    this.isClickedOnce = false;
                }
            });
        } else {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    if (list.id === this.parentCustomer.id) {
                        list['id'] = 0;
                    }
                }
            }
            this.virtualServiceArray = {};
            if (this.callingModes !== '') {
                this.is_wtsap_empty = false;
                if (this.selectedService.serviceType === 'virtualService') {
                    if (this.selectedService.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.selectedService.virtualCallingModes[0].callingMode === 'Zoom') {
                        this.virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.selectedService.virtualCallingModes[0].value;
                    } else {
                        this.virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.commObj['comWhatsappCountryCode'] + this.commObj['comWhatsappNo'];;
                    }
                }
            } else if (this.callingModes === '' || this.callingModes.length < 10) {
                if (this.selectedService.serviceType === 'virtualService') {
                    for (const i in this.selectedService.virtualCallingModes) {
                        if (this.selectedService.virtualCallingModes[i].callingMode === 'WhatsApp' || this.selectedService.virtualCallingModes[i].callingMode === 'Phone') {
                            this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                            this.is_wtsap_empty = true;
                            break;
                        }
                    }
                }
            }
            const post_Data = {
                'schedule': {
                    'id': this.selectedApptTime['scheduleId']
                },
                'appmtDate': this.selectedDate,
                'service': {
                    'id': this.selectedServiceId,
                    'serviceType': this.selectedService.serviceType
                },
                'consumerNote': this.consumerNote,
                'countryCode': this.parentCustomer.userProfile.countryCode,
                'phoneNumber': this.commObj['communicationPhNo'],
                'coupons': this.selected_coupons
            };
            if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
                post_Data['provider'] = { 'id': this.selectedUser.id };
            }
            if (!this.waitlist_for[0]['apptTime']) {
                this.waitlist_for[0]['apptTime'] = this.selectedApptTime['time'];
            }
            if (this.selectedService.serviceType === 'virtualService') {
                for (const i in this.virtualServiceArray) {
                    if (i === 'WhatsApp') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'GoogleMeet') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'Zoom') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'Phone') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'VideoCall') {
                        post_Data['virtualService'] = { 'VideoCall': '' };
                    }
                }
            }
            if (this.commObj['communicationEmail'] !== '') {
                this.waitlist_for[0]['email'] = this.commObj['communicationEmail'] !== '';
            }
            post_Data['appmtFor'] = JSON.parse(JSON.stringify(this.waitlist_for));
            if (this.jcashamount > 0 && this.checkJcash) {
                post_Data['useCredit'] = this.checkJcredit
                post_Data['useJcash'] = this.checkJcash
            }
            if (!this.is_wtsap_empty) {
                if (type === 'appt') {
                    if (this.jcashamount > 0 && this.checkJcash) {
                        this.shared_services.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.paymentDetails.amountRequiredNow)
                            .subscribe(data => {
                                this.remainingadvanceamount = data;
                                this.addCheckInConsumer(post_Data, paymenttype);
                            });
                    }
                    else {
                        this.addCheckInConsumer(post_Data, paymenttype);
                    }
                } else if (this.selectedService.isPrePayment) {
                    this.addApptAdvancePayment(post_Data);
                }
            }
        }
    }

    saveCheckin(type?, paymenttype?) {
        if (type === 'appt') {
            if (this.interNatioanalPaid) {
                this.isClickedOnce = true
                this.paymentBtnDisabled = false;

            }
            if (this.razorpayEnabled && !this.paytmEnabled) {
                this.isClickedOnce = true
                this.paymentBtnDisabled = false;
            }

        }
        if (this.selectedService.serviceType === 'virtualService' && type === 'next') {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    if (list['id'] !== this.parentCustomer.id) {
                        this.confirmcheckin(type, paymenttype);
                    } else {
                        this.confirmcheckin(type, paymenttype);
                    }
                }
            }
        } else {
            this.confirmcheckin(type, paymenttype);
        }

    }
    rescheduleAppointment() {
        this.apptdisable = true;
        const post_Data = {
            'uid': this.rescheduleUserId,
            'time': this.selectedApptTime['time'],
            'date': this.selectedDate,
            'schedule': this.selectedApptTime['scheduleId'],
            'consumerNote': this.consumerNote
        };
        this.subs.sink = this.shared_services.rescheduleConsumerApptmnt(this.account_id, post_Data)
            .subscribe(
                () => {
                    this.apptdisable = false;
                    if (this.selectedMessage.files.length > 0) {
                        this.consumerNoteAndFileSave(this.rescheduleUserId);
                    } else {
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.appointment.uid,
                            type: 'reschedule',
                            theme: this.theme
                        }
                        if (this.businessId) {
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
                    // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.apptdisable = false;
                });
    }
    addCheckInConsumer(post_Data, paymentmodetype?) {
        let paymenttype = this.selected_payment_mode;
        this.subs.sink = this.shared_services.addCustomerAppointment(this.account_id, post_Data)
            .subscribe(data => {
                const retData = data;
                if (this.customId) {
                    const accountid = this.businessId;
                    this.shared_services.addProvidertoFavourite(accountid)
                        .subscribe(() => {
                        });

                }
                this.uuidList = [];
                let parentUid;
                Object.keys(retData).forEach(key => {
                    if (key === '_prepaymentAmount') {
                        this.prepayAmount = retData['_prepaymentAmount'];
                    } else {
                        this.trackUuid = retData[key];
                        // this.uuidList.push(retData[key]); 
                        if (key !== 'parent_uuid') {
                            this.uuidList.push(retData[key]);
                        }
                    }
                    parentUid = retData['parent_uuid'];
                });
                if (this.selectedMessage.files.length > 0) {
                    this.consumerNoteAndFileSave(this.uuidList, paymenttype);
                }
                else {
                    if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                        this.submitQuestionnaire(parentUid, paymenttype);
                    } else {
                        this.paymentOperation(paymenttype);
                    }
                }

                const member = [];
                for (const memb of this.waitlist_for) {
                    member.push(memb.firstName + ' ' + memb.lastName);
                }
            },
                error => {
                    this.isClickedOnce = false;
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.apptdisable = false;
                    this.disablebutton = false;

                });
    }

    addMember() {
        this.action = 'addmember';
        this.disable = false;
    }
    handleReturnDetails(obj) {
        this.addmemberobj.fname = obj.fname || '';
        this.addmemberobj.lname = obj.lname || '';
        this.addmemberobj.mobile = obj.mobile || '';
        this.addmemberobj.gender = obj.gender || '';
        this.addmemberobj.dob = obj.dob || '';
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
                this.setConsumerFamilyMembers(this.parentCustomer);
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
    handleEmail() {
        this.action = 'email';
    }
    calculateDate(days) {
        const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
        const newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        const dd = newdate.getDate();
        const mm = newdate.getMonth() + 1;
        const y = newdate.getFullYear();
        const ndate1 = y + '-' + mm + '-' + dd;
        const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
        const strtDt1 = this.todaydate + ' 00:00:00';
        const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
        const nDt = new Date(ndate);
        if (nDt.getTime() >= strtDt.getTime()) {
            this.sel_checkindate = ndate;
            this.getAvailableSlotByLocationandService(this.sel_loc, this.selectedServiceId, this.sel_checkindate, this.account_id);
        }
        const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
    }
    disableMinus() {
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
        const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
        if (startdate >= selecttdate) {
            return true;
        } else {
            return false;
        }
    }
    getPartysizeDetails(domain, subdomain) {
        this.subs.sink = this.shared_services.getPartysizeDetails(domain, subdomain)
            .subscribe(data => {
                this.partysizejson = data;
                this.partySize = false;
                this.maxsize = 1;
                if (this.partysizejson.partySize) {
                    this.partySize = true;
                    this.maxsize = (this.partysizejson.maxPartySize) ? this.partysizejson.maxPartySize : 1;
                }
                if (this.partySize && !this.partysizejson.partySizeForCalculation) { // check whether partysize box is to be displayed to the user
                    this.partySizeRequired = true;
                }
            },
                () => {
                });
    }
    validatorPartysize(pVal) {
        let errmsg = '';
        const numbervalidator = projectConstantsLocal.VALIDATOR_NUMBERONLY;
        this.enterd_partySize = pVal;
        if (!numbervalidator.test(pVal)) {
            errmsg = 'Please enter a valid party size';
        } else {
            if (pVal > this.maxsize) {
                errmsg = 'Sorry ... the maximum party size allowed is ' + this.maxsize;
            }
        }
        return errmsg;
    }
    setUserDetails(selectedUserId) {
        const userDetail = this.users.filter(user => user.id === selectedUserId);
        this.selectedUser = userDetail[0];
    }
    getDepartmentById(deptId) {
        for (let i = 0; i < this.departments.length; i++) {
            if (deptId === this.departments[i].departmentId) {
                this.selected_dept = this.departments[i];
                break;
            }
        }
    }
    getProviderDepart(id) {
        this.subs.sink = this.shared_services.getProviderDept(id).
            subscribe(data => {
                this.departmentlist = data;
                this.filterDepart = this.departmentlist.filterByDept;
                for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                    if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        this.departments.push(this.departmentlist['departments'][i]);
                        if (this.selectedDeptParam && this.selectedDeptParam === this.departmentlist['departments'][i].departmentId) {
                            this.selected_dept = this.departmentlist['departments'][i];
                        }
                    }
                }
                if (!this.selectedDeptParam) {
                    this.selected_dept = this.departments[0];
                }
            });
    }
    getServicebyLocationId(locid, pdate) {
        this.api_loading1 = true;
        this.subs.sink = this.shared_services.getServicesforAppontmntByLocationId(locid)
            .subscribe(data => {
                this.servicesjson = data;
                this.serviceslist = this.servicesjson;
                this.selectedService = [];
                if (this.selectedServiceId) {
                    this.selectedServiceId = this.selectedServiceId;
                } else {
                    if (this.servicesjson.length > 0) {
                        this.selectedServiceId = this.servicesjson[0].id; // set the first service id to the holding variable
                    }
                }
                if (this.selectedServiceId) {
                    this.setServiceDetails(this.selectedServiceId);
                    this.getAvailableSlotByLocationandService(locid, this.selectedServiceId, pdate, this.account_id, 'init');
                    if (this.type != 'reschedule') {
                        this.getConsumerQuestionnaire();
                    } else {
                        this.questionnaireLoaded = true;
                        // if (this.selectedService.serviceType === 'virtualService') {
                        //     this.setVirtualTeleserviceCustomer();
                        // }
                    }
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.selectedServiceId = '';
                });
    }
    filesSelected(event, type?) {
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                    this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
                    return;
                } else if (file.size > projectConstants.FILE_MAX_SIZE) {
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
    consumerNoteAndFileSave(uuid, paymenttype?) {
        const dataToSend: FormData = new FormData();
        const captions = {};
        let i = 0;
        if (this.selectedMessage) {
            for (const pic of this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);
        this.subs.sink = this.shared_services.addConsumerAppointmentAttachment(this.account_id, uuid, dataToSend)
            .subscribe(
                () => {
                    if (this.type !== 'reschedule') {
                        if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                            this.submitQuestionnaire(uuid, paymenttype);
                        } else {
                            this.paymentOperation(paymenttype);
                        }
                    } else {
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.appointment.uid,
                            type: 'reschedule',
                            theme: this.theme
                        }
                        if (this.businessId) {
                            queryParams['customId'] = this.customId;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
                    }
                },
                error => {
                    this.isClickedOnce = false;
                    this.wordProcessor.apiErrorAutoHide(this, error);
                    this.disablebutton = false;
                }
            );
    }
    timeSelected(slot) {
        this.apptTime = slot;
        // this.waitlist_for[0].apptTime = this.apptTime['time'];
    }
    gets3curl() {
        this.api_loading1 = true;
        let accountS3List = 'settings,terminologies,coupon,providerCoupon,businessProfile,departmentProviders,appointmentsettings';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
                (accountS3s) => {
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['appointmentsettings']) {
                        this.processS3s('appointmentsettings', accountS3s['appointmentsettings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
                    }
                    if (accountS3s['coupon']) {
                        this.processS3s('coupon', accountS3s['coupon']);
                    }
                    if (accountS3s['providerCoupon']) {
                        this.processS3s('providerCoupon', accountS3s['providerCoupon']);
                    }
                    if (accountS3s['departmentProviders']) {
                        this.processS3s('departmentProviders', accountS3s['departmentProviders']);
                    }
                    if (accountS3s['businessProfile']) {
                        this.processS3s('businessProfile', accountS3s['businessProfile']);
                    }
                    this.api_loading1 = false;
                }
            );
    }
    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        switch (type) {
            case 'settings': {
                this.settingsjson = result;
                this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                break;
            }
            case 'appointmentsettings': {
                this.appointmentSettings = result;
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                break;
            }
            case 'businessProfile': {
                this.businessjson = result;
                if (this.businessjson.uniqueId === 128007) {
                    this.heartfulnessAccount = true;
                }
                this.accountType = this.businessjson.accountType;
                if (this.accountType === 'BRANCH') {
                    this.getProviderDepart(this.businessjson.id);
                }
                this.domain = this.businessjson.serviceSector.domain;
                if (this.domain === 'foodJoints') {
                    this.note_placeholder = 'Item No Item Name Item Quantity';
                    this.note_cap = 'Add Note / Delivery address';
                } else {
                    this.note_placeholder = '';
                    this.note_cap = 'Add Note';
                }
                this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
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
                deptProviders = result;
                if (!this.filterDepart) {
                    this.users = deptProviders;
                } else {
                    deptProviders.forEach(depts => {
                        if (depts.users.length > 0) {
                            this.users = this.users.concat(depts.users);
                        }
                    });
                }
                if (this.selectedUserParam) {
                    this.setUserDetails(this.selectedUserParam);
                }
                break;
            }
        }
    }
    // gets3curl() {

    //     this.retval = this.sharedFunctionobj.getS3Url()
    //         .then(
    //             res => {
    //                 this.s3url = res;
    //                 this.getbusinessprofiledetails_json('businessProfile', true);
    //                 this.getbusinessprofiledetails_json('settings', true);
    //                 this.getbusinessprofiledetails_json('departmentProviders', true);
    //                 this.getbusinessprofiledetails_json('coupon', true);
    //                 this.getbusinessprofiledetails_json('providerCoupon', true);
    //                 this.getbusinessprofiledetails_json('appointmentsettings', true);
    //                 if (!this.terminologiesjson) {
    //                     this.getbusinessprofiledetails_json('terminologies', true);
    //                 } else {
    //                     if (this.terminologiesjson.length === 0) {
    //                         this.getbusinessprofiledetails_json('terminologies', true);
    //                     } else {
    //                         this.wordProcessor.setTerminologies(this.terminologiesjson);
    //                     }
    //                 }
    //                 this.api_loading1 = false;
    //             },
    //             () => {
    //                 this.api_loading1 = false;
    //             }
    //         );
    // }
    // gets the various json files based on the value of "section" parameter
    getbusinessprofiledetails_json(section, modDateReq: boolean) {
        let UTCstring = null;
        if (modDateReq) {
            UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
        }
        this.subs.sink = this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
            .subscribe(res => {
                switch (section) {
                    case 'settings':
                        this.settingsjson = res;
                        this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                        break;
                    case 'terminologies':
                        this.terminologiesjson = res;
                        this.wordProcessor.setTerminologies(this.terminologiesjson);
                        break;
                    case 'businessProfile':
                        this.businessjson = res;
                        this.accountType = this.businessjson.accountType;
                        if (this.accountType === 'BRANCH') {
                            this.getProviderDepart(this.businessjson.id);
                        }
                        this.domain = this.businessjson.serviceSector.domain;
                        if (this.domain === 'foodJoints') {
                            this.note_placeholder = 'Item No Item Name Item Quantity';
                            this.note_cap = 'Add Note / Delivery address';
                        } else {
                            this.note_placeholder = '';
                            this.note_cap = 'Add Note';
                        }
                        this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
                        break;
                    case 'coupon':
                        this.s3CouponsList.JC = res;
                        if (this.s3CouponsList.JC.length > 0) {
                            this.showCouponWB = true;
                        }
                        break;
                    case 'providerCoupon':
                        this.s3CouponsList.OWN = res;
                        if (this.s3CouponsList.OWN.length > 0) {
                            this.showCouponWB = true;
                        }
                        break;
                    case 'appointmentsettings':
                        this.appointmentSettings = res;
                        break;
                    case 'departmentProviders': {
                        let deptProviders: any = [];
                        deptProviders = res;
                        if (!this.filterDepart) {
                            this.users = deptProviders;
                        } else {
                            deptProviders.forEach(depts => {
                                if (depts.users.length > 0) {
                                    this.users = this.users.concat(depts.users);
                                }
                            });
                        }
                        if (this.selectedUserParam) {
                            this.setUserDetails(this.selectedUserParam);
                        }
                        break;
                    }
                }
            },
                () => {
                }
            );
    }
    handleSideScreen(action) {
        this.action = action;
    }
    showPhoneInput() {
        this.showInputSection = true;
    }
    clearCouponErrors() {
        this.couponvalid = true;
        this.api_cp_error = null;
    }
    checkCouponExists(couponCode) {
        let found = false;
        for (let index = 0; index < this.selected_coupons.length; index++) {
            if (couponCode === this.selected_coupons[index]) {
                found = true;
                break;
            }
        }
        return found;
    }
    applyCoupons() {
        this.api_cp_error = null;
        this.couponvalid = true;
        const couponInfo = {
            'couponCode': '',
            'instructions': ''
        };
        if (this.selected_coupon) {
            const jaldeeCoupn = this.selected_coupon.trim();
            if (this.checkCouponExists(jaldeeCoupn)) {
                this.api_cp_error = 'Coupon already applied';
                this.couponvalid = false;
                return false;
            }
            this.couponvalid = false;
            let found = false;
            for (let couponIndex = 0; couponIndex < this.s3CouponsList.JC.length; couponIndex++) {
                if (this.s3CouponsList.JC[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
                    this.selected_coupons.push(this.s3CouponsList.JC[couponIndex].jaldeeCouponCode);
                    couponInfo.couponCode = this.s3CouponsList.JC[couponIndex].jaldeeCouponCode;
                    couponInfo.instructions = this.s3CouponsList.JC[couponIndex].consumerTermsAndconditions;
                    this.couponsList.push(couponInfo);
                    found = true;
                    this.selected_coupon = '';
                    break;
                }
            }
            for (let couponIndex = 0; couponIndex < this.s3CouponsList.OWN.length; couponIndex++) {
                if (this.s3CouponsList.OWN[couponIndex].couponCode.trim() === jaldeeCoupn) {
                    this.selected_coupons.push(this.s3CouponsList.OWN[couponIndex].couponCode);
                    couponInfo.couponCode = this.s3CouponsList.OWN[couponIndex].couponCode;
                    if (this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions) {
                        couponInfo.instructions = this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions;
                    }
                    this.couponsList.push(couponInfo);
                    found = true;
                    this.selected_coupon = '';
                    break;
                }
            }

            if (found) {
                this.couponvalid = true;
                this.snackbarService.openSnackBar('Promocode accepted', { 'panelclass': 'snackbarerror' });
                setTimeout(() => {
                    this.action = '';
                }, 500);
                this.closebutton.nativeElement.click();
                this.checkCouponvalidity();
            } else {
                this.api_cp_error = 'Coupon invalid';
            }
        } else {
            // this.api_cp_error = 'Enter a Coupon';
            this.closebutton.nativeElement.click();
        }
    }
    toggleterms(i) {
        if (this.couponsList[i].showme) {
            this.couponsList[i].showme = false;
        } else {
            this.couponsList[i].showme = true;
        }
    }
    removeJCoupon(i) {
        this.selected_coupons.splice(i, 1);
        this.couponsList.splice(i, 1);
        this.checkCouponvalidity();
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    getPic(user) {
        if (user.profilePicture) {
            return this.s3Processor.getJson(user.profilePicture)['url'];
        }
        return 'assets/images/img-null.svg';
    }
    gotoAttachments() {
        this.action = 'attachment';
    }
    changeService() {
        if (this.filterDepart) {
            this.handleDepartment(this.selected_dept);
        }
        this.action = 'service';
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].provider) {
                this.servicesjson[i].provider['businessName'] = this.getUserName(this.servicesjson[i].provider.id);
            }
        }
    }
    showCheckinButtonCaption() {
        let caption = '';
        if (this.settingsjson.showTokenId) {
            caption = 'Appointment';
        } else {
            caption = 'Check-in';
        }
        return caption;
    }

    goBack(type?) {
        if (type) {
            if ((this.tele_srv_stat !== 'true' && this.bookStep === 1) || (this.tele_srv_stat === 'true' && this.bookStep === 0)) {
                this.location.back();
            } else {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep--;
                }
                if (this.bookStep === 1) {
                    this.bookStep--;
                }
                else {
                    this.bookStep = 1;
                }
            }
            // else
            // {
            //     this.bookStep = 1;
            // }
        }
        if (this.action !== 'addmember') {
            this.closebutton.nativeElement.click();
        }
        setTimeout(() => {
            if (this.action === 'note' || this.action === 'members' || (this.action === 'service' && !this.filterDepart)
                || this.action === 'attachment' || this.action === 'coupons' || this.action === 'departments' ||
                this.action === 'phone' || this.action === 'email') {
                this.action = '';
            } else if (this.action === 'addmember') {
                this.action = 'members';
            } else if (this.action === 'service' && this.filterDepart) {
                this.action = '';
            } else if (this.action === 'preInfo') {
                this.action = '';
            } else if (this.action === 'timeChange') {
                this.action = '';
            } else if (this.action === 'slotChange') {
                this.action = '';
            }
        }, 500);
    }
    applyPromocode() {
        this.action = 'coupons';
    }
    handleDepartment(dept) {
        this.servicesjson = this.serviceslist;
        const deptServices = [];
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].department === dept.departmentId) {
                deptServices.push(this.serviceslist[i]);
            }
        }
        for (let i = 0; i < deptServices.length; i++) {
            if (deptServices[i].provider) {
                deptServices[i].provider['businessName'] = this.getUserName(deptServices[i].provider.id);
            }
        }
        this.servicesjson = deptServices;
        this.action = 'service';
    }
    getUserName(id) {
        let selectedUser = '';
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                selectedUser = this.users[i];
                break;
            }
        }
        if (selectedUser['businessName']) {
            return selectedUser['businessName'];
        } else {
            if (selectedUser['firstName'] && selectedUser['lastName']) {
                return (selectedUser['firstName'] + ' ' + selectedUser['lastName']);
            } else {
                return '';
            }
        }
    }
    showServiceDetail(serv, busname) {
        let servData;
        if (serv.serviceType && serv.serviceType === 'donationService') {
            servData = {
                bname: busname,
                serdet: serv,
                serv_type: 'donation'
            };
        } else {
            servData = {
                bname: busname,
                serdet: serv
            };
        }
        this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
            disableClose: true,
            data: servData
        });
        this.servicedialogRef.afterClosed().subscribe(() => {
        });
    }
    disableButn() {
        if (moment(this.sel_checkindate).format('YYYY-MM-DD') === this.hold_sel_checkindate && this.selectedApptTime['time'] === this.holdselectedTime) {
            return true;
        } else {
            return false;
        }
    }

    updateEmail(post_data) {
        const _this = this;
        const passtyp = 'consumer';
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.customerService.updateProfile(post_data, passtyp)
                .subscribe(
                    () => {
                        resolve(true);
                    },
                    error => {
                        reject(error);
                    });
        });
    }
    showSpec() {
        if (this.showmoreSpec) {
            this.showmoreSpec = false;
        } else {
            this.showmoreSpec = true;
        }
    }
    goToStep(type) {
        // this.virtualInfo = this.virtualForm.value;
        if (type === 'next') {
            if (this.tele_srv_stat === 'true' && this.bookStep == 0) {
                this.virtualInfo = this.virtualForm.value;
                this.processVirtualForm();
            } else if (!this.apptdisable && this.freeSlots.length > 0 && !this.api_loading1) {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    if (this.bookStep === 2) {
                        this.validateQuestionnaire();
                    } else {
                        this.bookStep++;
                    }
                } else {
                    if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.bookStep = 3;
                    }
                }
            }
        } else if (type === 'prev') {
            if (this.tele_srv_stat === 'true' && this.bookStep == 1) {
                this.bookStep--;
            }
        } else {
            this.bookStep = type;
        }
        if (this.bookStep === 3) {
            this.saveCheckin('next');
        }
    }
    addApptAdvancePayment(post_Data) {
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addApptAdvancePayment(param, post_Data)
            .subscribe(data => {
                this.paymentDetails = data;
                this.paymentLength = Object.keys(this.paymentDetails).length;
                this.checkJcash = true
                this.jcashamount = this.paymentDetails.eligibleJcashAmt.jCashAmt;
                this.jcreditamount = this.paymentDetails.eligibleJcashAmt.creditAmt;
                if (this.checkJcash && this.paymentDetails.amountRequiredNow > this.jcashamount) {
                    this.payAmount = this.paymentDetails.amountRequiredNow - this.jcashamount;

                } else if (this.checkJcash && this.paymentDetails.amountRequiredNow <= this.jcashamount) {
                    this.payAmount = 0;
                }
            },
                error => {
                    this.isClickedOnce = false;
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
    }
    payuPayment(paymenttype?) {
        this.makeFailedPayment(paymenttype);
    }
    makeFailedPayment(paymentMode) {
        this.waitlistDetails = {
            'amount': this.paymentDetails.amountRequiredNow,
            'paymentMode': null,
            'uuid': this.trackUuid,
            'accountId': this.account_id,
            'purpose': 'prePayment'
        };

        this.waitlistDetails.paymentMode = paymentMode;
        this.waitlistDetails.serviceId = this.selectedServiceId;
        this.waitlistDetails.isInternational = this.isInternatonal;
        this.lStorageService.setitemonLocalStorage('uuid', this.trackUuid);
        this.lStorageService.setitemonLocalStorage('acid', this.account_id);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_c');
        if (this.remainingadvanceamount == 0 && this.checkJcash) {
            const postData = {
                'amountToPay': this.paymentDetails.amountRequiredNow,
                'accountId': this.account_id,
                'uuid': this.trackUuid,
                'paymentPurpose': 'prePayment',
                'isJcashUsed': true,
                'isreditUsed': false,
                'isRazorPayPayment': false,
                'isPayTmPayment': false,
                'paymentMode': "JCASH"
            };
            this.shared_services.PayByJaldeewallet(postData)
                .subscribe(data => {
                    this.wallet = data;
                    if (!this.wallet.isGateWayPaymentNeeded && this.wallet.isJCashPaymentSucess) {
                        setTimeout(() => {
                            this.router.navigate(['consumer', 'appointment', 'confirm'], { queryParams: { account_id: this.account_id, uuid: this.trackUuid } });
                        }, 500);
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
        else if (this.remainingadvanceamount > 0 && this.checkJcash) {
            const postData: any = {
                'amountToPay': this.paymentDetails.amountRequiredNow,
                'accountId': this.account_id,
                'uuid': this.trackUuid,
                'paymentPurpose': 'prePayment',
                'isJcashUsed': true,
                'isreditUsed': false,
                'isRazorPayPayment': false,
                'isPayTmPayment': false,
                'paymentMode': null
            };
            postData.paymentMode = paymentMode;
            postData.isInternational = this.isInternatonal;
            postData.serviceId = this.selectedServiceId;
            this.shared_services.PayByJaldeewallet(postData)
                .subscribe((pData: any) => {

                    if (pData.isGateWayPaymentNeeded == true && pData.isJCashPaymentSucess == true) {
                        if (pData.paymentGateway == 'PAYTM') {
                            this.payWithPayTM(pData.response, this.account_id);
                        } else {
                            this.paywithRazorpay(pData.response);
                        }
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });

                    });
        }
        else {
            console.log('waitlistDetails' + JSON.stringify(this.waitlistDetails));
            this.subs.sink = this.shared_services.consumerPayment(this.waitlistDetails)
                .subscribe((pData: any) => {
                    console.log(pData);
                    this.pGateway = pData.paymentGateway;
                    if (this.pGateway === 'RAZORPAY') {
                        this.paywithRazorpay(pData);
                    } else {
                        if (pData['response']) {
                            this.payWithPayTM(pData, this.account_id);
                        } else {
                            this.isClickedOnce = false;
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                        }
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.disablebutton = false;
                    });
        }
    }
    paywithRazorpay(pData: any) {
        this.prefillmodel.name = pData.consumerName;
        this.prefillmodel.email = pData.ConsumerEmail;
        this.prefillmodel.contact = pData.consumerPhoneumber;
        this.razorModel = new Razorpaymodel(this.prefillmodel);
        this.razorModel.key = pData.razorpayId;
        this.razorModel.amount = pData.amount;
        this.razorModel.order_id = pData.orderId;
        this.razorModel.name = pData.providerName;
        this.razorModel.description = pData.description;
        this.razorModel.mode = this.selected_payment_mode;
        this.isClickedOnce = false;
        this.razorpayService.payWithRazor(this.razorModel, 'consumer', 'appt_prepayment', this.trackUuid, this.selectedService.livetrack, this.account_id, this.paymentDetails.amountRequiredNow, this.uuidList, this.customId, this.from);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.loadingPaytm = true;
        pData.paymentMode = this.selected_payment_mode;
        this.paytmService.initializePayment(pData, projectConstantsLocal.PAYTM_URL, accountId, this);
    }
    getImage(url, file) {
        if (file.type == 'application/pdf') {
            return '../../../../../assets/images/pdf.png';
        } else {
            return url;
        }
    }

    viewAttachments() {
        this.action = 'attachment';
        this.modal.nativeElement.click();
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
    getAttachLength() {
        let length = this.selectedMessage.files.length;
        if (this.type == 'reschedule' && this.appointment && this.appointment.attchment && this.appointment.attchment[0] && this.appointment.attchment[0].thumbPath) {
            length = length + this.appointment.attchment.length;
        }
        return length;
    }
    actionCompleted() {
        if (this.action === 'slotChange') {
            this.selectedDate = this.sel_checkindate;
            this.checkFutureorToday();
            this.selectedApptTime = this.apptTime;
            this.waitlist_for[0].apptTime = this.apptTime['time'];
            if (this.type == 'reschedule' && this.appointment.service && this.appointment.service.priceDynamic) {
                this.subs.sink = this.shared_services.getAppointmentReschedulePricelist(this.appointment.service.id).subscribe(
                    (list: any) => {
                        this.pricelist = list;
                        let oldprice;
                        let newprice;
                        for (let list of this.pricelist) {
                            if (list.schedule.id == this.currentScheduleId) { // appointment scheduleid
                                oldprice = list.price;
                            }
                            if (list.schedule.id == this.selectedApptTime['scheduleId']) { // rescheduledappointment scheduleid
                                newprice = list.price;
                            }
                        }
                        this.changePrice = newprice - oldprice;
                        this.amountdifference = this.appointment.amountDue + this.changePrice;
                    });
            }
        }
        if (this.action === 'members') {
            this.saveMemberDetails();
        } else if (this.action === 'addmember') {
            this.handleSaveMember();
        } else if (this.action === 'note' || this.action === 'slotChange' || this.action === 'attachment') {
            this.goBack();
        } else if (this.action === 'coupons') {
            this.applyCoupons();
        }
    }

    popupClosed() {
        this.sel_checkindate = this.selectedDate;
        this.checkFutureorToday();
        this.apptTime = this.selectedApptTime;
        this.waitlist_for[0].apptTime = this.apptTime['time'];
    }
    getQuestionAnswers(event) {
        this.questionAnswers = event;
    }
    submitQuestionnaire(uuid, paymenttype?) {
        const dataToSend: FormData = new FormData();
        if (this.questionAnswers.files) {
            for (const pic of this.questionAnswers.files) {
                dataToSend.append('files', pic, pic['name']);
            }
        }
        const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        this.subs.sink = this.shared_services.submitConsumerApptQuestionnaire(dataToSend, uuid, this.account_id).subscribe((data: any) => {
            let postData = {
                urls: []
            };
            if (data.urls && data.urls.length > 0) {
                for (const url of data.urls) {
                    this.api_loading_video = true;
                    const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
                    this.provider_services.videoaudioS3Upload(file, url.url)
                        .subscribe(() => {
                            postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                            if (data.urls.length === postData['urls'].length) {
                                this.shared_services.consumerApptQnrUploadStatusUpdate(uuid, this.account_id, postData)
                                    .subscribe((data) => {
                                        this.paymentOperation(paymenttype);
                                    },
                                        error => {
                                            this.isClickedOnce = false;
                                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                            this.disablebutton = false;
                                            this.api_loading_video = false;
                                        });
                            }
                        },
                            error => {
                                this.isClickedOnce = false;
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                this.disablebutton = false;
                                this.api_loading_video = false;
                            });
                }
            } else {
                this.paymentOperation(paymenttype);
            }
        },
            error => {
                this.isClickedOnce = false;
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.disablebutton = false;
                this.api_loading_video = false;
            });
    }
    paymentOperation(paymenttype?) {
        if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0) {
            this.payuPayment(paymenttype);
        } else {
            let queryParams = {
                account_id: this.account_id,
                uuid: this.trackUuid,
                theme: this.theme
            }
            if (this.from) {
                queryParams['isFrom'] = this.from;
            }
            if (this.businessId) {
                queryParams['customId'] = this.customId;
            }
            let navigationExtras: NavigationExtras = {
                queryParams: queryParams
            };
            this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras);
        }
    }
    transactionCompleted(response, payload, accountId) {
        if (response.STATUS == 'TXN_SUCCESS') {
            this.paytmService.updatePaytmPay(payload, accountId)
                .then((data) => {
                    if (data) {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.trackUuid,
                            theme: this.theme
                        }
                        if (this.businessId) {
                            queryParams['customId'] = this.customId;
                        }
                        if (this.from) {
                            queryParams['isFrom'] = this.from;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras));
                    }
                },
                    error => {
                        this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                    })
        } else if (response.STATUS == 'TXN_FAILURE') {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            if (this.from) {
                this.ngZone.run(() => this.router.navigate(['consumer']));
            } else {
                let queryParams = {
                    account_id: this.account_id,
                    uuid: this.trackUuid,
                    theme: this.theme
                }
                if (this.businessId) {
                    queryParams['customId'] = this.customId;
                }

                let navigationExtras: NavigationExtras = {
                    queryParams: queryParams
                };
                this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
            }

        }
    }
    closeloading() {
        this.loadingPaytm = false;
        this.cdRef.detectChanges();
        this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
        if (this.from) {
            this.ngZone.run(() => this.router.navigate(['consumer']));
        } else {
            let queryParams = {
                account_id: this.account_id,
                uuid: this.trackUuid,
                theme: this.theme
            }
            if (this.businessId) {
                queryParams['customId'] = this.customId;
            }

            let navigationExtras: NavigationExtras = {
                queryParams: queryParams
            };
            this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        }
    }
    getConsumerQuestionnaire() {
        const consumerid = (this.waitlist_for[0].id === this.parentCustomer.id) ? 0 : this.waitlist_for[0].id;
        this.shared_services.getConsumerQuestionnaire(this.selectedServiceId, consumerid, this.account_id).subscribe(data => {
            this.questionnaireList = data;
            this.questionnaireLoaded = true;
            // if (this.selectedService.serviceType === 'virtualService') {
            //     this.setVirtualTeleserviceCustomer();
            // }
        });
    }
    checkCouponvalidity() {
        if (this.waitlist_for.length !== 0) {
            for (const list of this.waitlist_for) {
                if (list.id === this.parentCustomer.id) {
                    list['id'] = 0;
                }
            }
        }
        this.virtualServiceArray = {};
        if (this.callingModes !== '') {
            this.is_wtsap_empty = false;
            if (this.selectedService.serviceType === 'virtualService') {
                if (this.selectedService.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.selectedService.virtualCallingModes[0].callingMode === 'Zoom') {
                    this.virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.selectedService.virtualCallingModes[0].value;
                } else {
                    this.virtualServiceArray[this.selectedService.virtualCallingModes[0].callingMode] = this.commObj['comWhatsappCountryCode'] + this.commObj['comWhatsappNo'];;
                }
            }
        } else if (this.callingModes === '' || this.callingModes.length < 10) {
            if (this.selectedService.serviceType === 'virtualService') {
                for (const i in this.selectedService.virtualCallingModes) {
                    if (this.selectedService.virtualCallingModes[i].callingMode === 'WhatsApp' || this.selectedService.virtualCallingModes[i].callingMode === 'Phone') {
                        this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                        this.is_wtsap_empty = true;
                        break;
                    }
                }
            }
        }
        const post_Data = {
            'schedule': {
                'id': this.selectedApptTime['scheduleId']
            },
            'appmtDate': this.selectedDate,
            'service': {
                'id': this.selectedServiceId,
                'serviceType': this.selectedService.serviceType
            },
            'consumerNote': this.consumerNote,
            'countryCode': this.commObj['communicationPhCountryCode'],
            'phoneNumber': this.commObj['communicationPhNo'],
            'appmtFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'coupons': this.selected_coupons
        };
        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }
        if (this.selectedService.serviceType === 'virtualService') {
            for (const i in this.virtualServiceArray) {
                if (i === 'WhatsApp') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'GoogleMeet') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Zoom') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Phone') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'VideoCall') {
                    post_Data['virtualService'] = { 'VideoCall': '' };
                }
            }
        }
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addApptAdvancePayment(param, post_Data)
            .subscribe(data => {
                this.paymentDetails = data;
            },
                error => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
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
            this.shared_services.validateConsumerQuestionnaire(this.questionAnswers.answers, this.account_id).subscribe((data: any) => {
                if (data.length === 0) {
                    if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.bookStep++;
                        this.saveCheckin();
                    }
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    changeJcashUse(event) {
        if (event.checked) {
            this.checkJcash = true;
        } else {
            this.checkJcash = false;
        }
    }
    changePolicy(event) {
        this.checkPolicy = event.target.checked;
    }
    showText() {
        this.readMore = !this.readMore;
    }
    log() {
    }
    getPaymentModes() {
        this.paytmEnabled = false;
        this.razorpayEnabled = false;
        this.interNatioanalPaid = false;
        this.shared_services.getPaymentModesofProvider(this.account_id, this.selectedServiceId, 'prePayment')
            .subscribe(
                data => {
                    this.paymentmodes = data[0];
                    this.isPayment = true;
                    if (this.paymentmodes.indiaPay) {
                        this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
                    }
                    if (this.paymentmodes.internationalPay) {
                        this.non_indian_modes = this.paymentmodes.internationalBankInfo;

                    }
                    if (!this.paymentmodes.indiaPay && this.paymentmodes.internationalPay) {
                        this.shownonIndianModes = true;
                    } else {
                        this.shownonIndianModes = false;
                    }

                },
                error => {
                    this.isPayment = false;
                    console.log(this.isPayment);
                }


            );
    }
    indian_payment_mode_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = false;



    }
    non_indian_modes_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = true;



    }
    togglepaymentMode() {
        this.shownonIndianModes = !this.shownonIndianModes;
    }

    /**
     * Create Form Fields for Consumer Virtual Fields 
     */
    createVirtualForm() {
        this.virtualForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            serviceFor: ['', Validators.compose([Validators.required])],
            countryCode_whtsap: [this.parentCustomer.userProfile.countryCode],
            countryCode_telegram: [this.parentCustomer.userProfile.countryCode],
            age: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
            pincode: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
            whatsappnumber: [''],
            telegramnumber: [''],
            preferredLanguage: [[], Validators.compose([Validators.required])],
            islanguage: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required])],
            location: ['', Validators.compose([Validators.required])],
            localarea: [''],
            state: [''],
            country: [''],
            updateEmail: [false]
        });
        this.virtualForm.patchValue({ islanguage: 'yes' });
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
     * Handling the selection of Booking Person
     * @param event Selected Member
     */
    onServiceForChange(event) {
        this.resetVirtualForm(this.parentCustomer);
        this.virtualForm.patchValue({ 'serviceFor': event });
        this.is_parent = true;
        if (event !== 'new_member') {
            const selectedMembers = this.familyMembers.filter(memberObj => memberObj.user === event);
            console.log("SelectedMembers", selectedMembers);
            if (selectedMembers.length !== 0) {
                this.hideEditButton = false;
                this.editable = false;
                this.is_parent = false;
                this.chosen_person = selectedMembers[0];
                this.setVirtualForm(selectedMembers[0], this.parentCustomer);
            } else {
                this.hideEditButton = false;
                this.editable = false;
                this.chosen_person = this.parentCustomer;
                console.log("Setting parent details: ", this.parentCustomer);
                this.setVirtualForm(this.parentCustomer);
            }
        } else {
            this.hideEditButton = true;
            this.editable = true;
            this.is_parent = false;
            this.chosen_person = 'new_member'
        }
    }

    /**
     * Reset the Consumer Virtual Fields Form
     * @param customer logged in/selected customer/member details to initialize fields like email, phone etc
     */
    resetVirtualForm(customer) {
        console.log("resetVirtualForm:", customer);
        this.virtualForm.controls['countryCode_whtsap'].setValue('');
        this.virtualForm.controls['countryCode_telegram'].setValue('');
        this.virtualForm.controls['age'].setValue('');
        this.virtualForm.controls['gender'].setValue('');
        this.virtualForm.controls['islanguage'].setValue('yes');
        this.virtualForm.controls['preferredLanguage'].setValue([]);
        this.virtualForm.controls['pincode'].setValue('');
        this.virtualForm.controls['localarea'].setValue('');
        this.virtualForm.controls['state'].setValue('');
        this.virtualForm.controls['firstName'].setValue('');
        this.virtualForm.controls['lastName'].setValue('');
        this.lngknown = 'yes';
        if (customer.userProfile.email) {
            this.virtualForm.patchValue({ email: customer.userProfile.email });
        } else {
            this.virtualForm.patchValue({ email: '' });
        }
        this.virtualForm.patchValue({ countryCode_whtsap: customer.userProfile.countryCode });
        this.virtualForm.patchValue({ countryCode_telegram: customer.userProfile.countryCode });
    }

    /**
     * Set Virtual Field Values With Member/Customer Details
     * @param customer member/customer details
     * @param parent parent customer details if customer is a mebmber
     */
    setVirtualForm(customer, parent?) {
        console.log("setVirtualForm:", customer);
        console.log(parent);
        if (customer.parent) { // I am a member
            if (customer.preferredLanguages && customer.preferredLanguages !== null) {
                const preferredLanguage = this.s3Processor.getJson(customer.preferredLanguages);
                if (preferredLanguage !== null && preferredLanguage.length > 0) {
                    let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
                    if (defaultEnglish === 'no') {
                        if (customer.preferredLanguages.length > 0) {
                            this.virtualForm.patchValue({ islanguage: defaultEnglish });
                            this.lngknown = defaultEnglish;
                        } else {
                            this.virtualForm.patchValue({ islanguage: '' });
                        }
                    } else {
                        this.virtualForm.patchValue({ islanguage: defaultEnglish });
                        this.lngknown = defaultEnglish;
                    }
                    this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
                }
            } else {
                this.virtualForm.patchValue({ islanguage: 'yes' });
            }
            if (customer.bookingLocation && customer.bookingLocation.pincode) {
                this.virtualForm.patchValue({ pincode: customer.bookingLocation.pincode });
            }
            if (customer.bookingLocation && customer.bookingLocation.district) {
                this.virtualForm.patchValue({ localarea: customer.bookingLocation.district });
            }
            if (customer.bookingLocation && customer.bookingLocation.state) {
                this.virtualForm.patchValue({ state: customer.bookingLocation.state });
            }
            if (customer.userProfile && customer.userProfile.whatsAppNum && customer.userProfile.whatsAppNum !== '' && customer.userProfile.whatsAppNum.number != '') {
                this.virtualForm.patchValue({ whatsappnumber: customer.userProfile.whatsAppNum.number });
                this.virtualForm.patchValue({ countryCode_whtsap: customer.userProfile.whatsAppNum.countryCode });
            } else {
                this.virtualForm.patchValue({ whatsappnumber: parent.userProfile.primaryMobileNo });
                this.virtualForm.patchValue({ countryCode_whtsap: parent.userProfile.countryCode });
            }
            if (customer.userProfile && customer.userProfile.telegramNum && customer.userProfile.telegramNum != '' && customer.userProfile.telegramNum.number != '') {
                this.virtualForm.patchValue({ telegramnumber: customer.userProfile.telegramNum.number });
                this.virtualForm.patchValue({ countryCode_telegram: customer.userProfile.telegramNum.countryCode });
            } else {
                this.virtualForm.patchValue({ telegramnumber: parent.userProfile.primaryMobileNo });
                this.virtualForm.patchValue({ countryCode_telegram: parent.userProfile.countryCode })
            }
        } else {
            if (customer.userProfile.preferredLanguages && customer.userProfile.preferredLanguages !== null) {
                const preferredLanguage = this.s3Processor.getJson(customer.userProfile.preferredLanguages);
                if (preferredLanguage !== null && preferredLanguage.length > 0) {
                    let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
                    this.virtualForm.patchValue({ islanguage: defaultEnglish });
                    this.lngknown = defaultEnglish;
                    this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
                } else {
                    this.virtualForm.patchValue({ islanguage: 'yes' });
                }
            }
            if (customer.userProfile && customer.userProfile.pinCode) {
                this.virtualForm.patchValue({ pincode: customer.userProfile.pinCode });
            }
            if (customer.userProfile && customer.userProfile.city) {
                this.virtualForm.patchValue({ localarea: customer.userProfile.city });
            }
            if (customer.userProfile && customer.userProfile.state) {
                this.virtualForm.patchValue({ state: customer.userProfile.state });
            }
            // If there is no whatsapp/telegram number fill the fields with primary phone number
            if (customer.userProfile && customer.userProfile.whatsAppNum && customer.userProfile.whatsAppNum.number) {
                this.virtualForm.patchValue({ whatsappnumber: customer.userProfile.whatsAppNum.number });
                this.virtualForm.patchValue({ countryCode_whtsap: customer.userProfile.whatsAppNum.countryCode });
            }
            if (customer.userProfile && customer.userProfile.telegramNum && customer.userProfile.telegramNum.number) {
                this.virtualForm.patchValue({ telegramnumber: customer.userProfile.telegramNum.number });
                this.virtualForm.patchValue({ countryCode_telegram: customer.userProfile.telegramNum.countryCode });
            }
        }
        if (customer.userProfile && customer.userProfile.age) {
            this.virtualForm.patchValue({ age: customer.userProfile.age });
        }
        if (customer.userProfile && customer.userProfile.gender) {
            this.virtualForm.patchValue({ gender: customer.userProfile.gender });
        }
        if (customer.userProfile && customer.userProfile.email) {
            this.virtualForm.patchValue({ email: customer.userProfile.email });
        }
        this.virtualForm.patchValue({ firstName: customer.userProfile.firstName });
        this.virtualForm.patchValue({ lastName: customer.userProfile.lastName })
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
        if (parentCustomer.userProfile.whatsAppNum) {
            _this.commObj['comWhatsappNo'] = parentCustomer.userProfile.whatsAppNum.number;
            _this.commObj['comWhatsappCountryCode'] = parentCustomer.userProfile.whatsAppNum.countryCode;
        } else {
            _this.commObj['comWhatsappNo'] = parentCustomer.userProfile.primaryMobileNo;
            _this.commObj['comWhatsappCountryCode'] = parentCustomer.userProfile.countryCode;
        }
        _this.commObj['communicationPhNo'] = _this.parentCustomer.userProfile.primaryMobileNo;
        _this.commObj['communicationPhCountryCode'] = _this.parentCustomer.userProfile.countryCode;
    }

    saveMemberDetails() {
        this.resetApiErrors();
        this.emailerror = '';
        this.phoneError = '';
        this.whatsapperror = '';
        this.changePhno = true;
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
                this.emailerror = "Email is invalid";
                return false;
            } else {
                this.waitlist_for[0]['email'] = this.commObj['communicationEmail'];
            }
        }
        this.closebutton.nativeElement.click();
        setTimeout(() => {
            this.action = '';
        }, 500);
    }

    /**
     * 
     * @param commObj 
     */
    setCommunications(commObj) {
        this.commObj = commObj;
    }

    /**
    * Method to check privacy policy
    * @param status true/false
    */
    policyApproved(status) {
        this.checkPolicy = status;
    }

    /**
    * 
    * @param selectedMembers 
    */
    memberSelected(selectedMembers) {
        console.log(selectedMembers);
        this.waitlistForPrev = this.waitlist_for;
        this.waitlist_for = selectedMembers;
        console.log(this.waitlist_for);
        if (this.selectedService && this.selectedService.minPrePaymentAmount) {
            this.prepaymentAmount = this.waitlist_for.length * this.selectedService.minPrePaymentAmount || 0;
        }
        this.serviceCost = this.waitlist_for.length * this.selectedService.price;
    }

    /**
     * To store virtual for details for checkin
     * @param customerInfo 
     * @param isParent 
     * @param id 
     */
     setWaitlistFor(customerInfo, isParent, id?) {
        this.waitlist_for = [];
        let member = {};
        if (isParent) {
            member['id'] = customerInfo.id;
            member['gender'] = customerInfo.gender;
            member['age'] = customerInfo.age;
            member['firstName'] = customerInfo.firstName;
            member['lastName'] = customerInfo.lastName;
            member['whatsAppNum'] = customerInfo['whatsAppNum'];
            member['telegramNum'] = customerInfo['telegramNum'];
            member['preferredLanguages'] = customerInfo['preferredLanguages'];
            const bookingLocation = {};
            bookingLocation['pincode'] = customerInfo['pinCode'];
            bookingLocation['district'] = customerInfo['bookingLocation']['district'];
            bookingLocation['state'] = customerInfo['bookingLocation']['state'];
            member['bookingLocation'] = bookingLocation;
        } else {
            member['id'] = id;
            member['gender'] = customerInfo['userProfile']['gender'];
            member['age'] = customerInfo['userProfile']['age'];
            member['firstName'] = customerInfo['userProfile']['firstName'];
            member['lastName'] = customerInfo['userProfile']['lastName'];
            member['whatsAppNum'] = customerInfo['userProfile']['whatsAppNum'];
            member['telegramNum'] = customerInfo['userProfile']['telegramNum'];
            member['preferredLanguages'] = customerInfo['preferredLanguages'];
            member['bookingLocation'] = customerInfo['bookingLocation'];
        }
        this.waitlist_for.push(member);
    }

    /**
     * Update Customer/Member Details 
     * @param formdata customer/member data
     * @param isParent true/false
     * @returns data/false
     */
     updateCustomer(formdata, isParent, type) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            let customerInfo = {};
            let whatsup = {};
            let telegram = {}
            if (formdata.whatsappnumber !== undefined && formdata.whatsappnumber.trim().length > 0 && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length > 0) {
                if (formdata.countryCode_whtsap.startsWith('+')) {
                    whatsup["countryCode"] = formdata.countryCode_whtsap
                } else {
                    whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
                }
                whatsup["number"] = formdata.whatsappnumber
            }
            if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length > 0 && formdata.countryCode_telegram !== undefined && formdata.countryCode_telegram.trim().length > 0) {
                if (formdata.countryCode_telegram.startsWith('+')) {
                    telegram["countryCode"] = formdata.countryCode_telegram
                } else {
                    telegram["countryCode"] = '+' + formdata.countryCode_telegram
                }
                telegram["number"] = formdata.telegramnumber
            }
            if (isParent) {
                customerInfo['id'] = _this.parentCustomer.id;
                customerInfo['gender'] = formdata.gender;
                customerInfo['age'] = formdata.age;
                customerInfo['firstName'] = _this.parentCustomer.userProfile.firstName;
                customerInfo['lastName'] = _this.parentCustomer.userProfile.lastName;
                customerInfo['whatsAppNum'] = whatsup;
                customerInfo['telegramNum'] = telegram;
                customerInfo['pinCode'] = formdata.pincode;
                if (formdata.email !== '' && formdata.updateEmail) {
                    customerInfo['email'] = formdata.email
                }
                if (formdata.islanguage === 'yes') {
                    customerInfo['preferredLanguages'] = ['English'];
                } else {
                    customerInfo['preferredLanguages'] = formdata.preferredLanguage;
                }
                customerInfo['bookingLocation'] = {};
                if (_this.parentCustomer.userProfile.countryCode !== '+91' && formdata.localarea !== '') {
                    customerInfo['bookingLocation']['district'] = formdata.localarea;
                    customerInfo['city'] = formdata.localarea;
                }
                if (_this.parentCustomer.userProfile.countryCode !== '+91' && formdata.state) {
                    customerInfo['bookingLocation']['state'] = formdata.state;
                    customerInfo['state'] = formdata.state;
                }
                _this.customerService.updateProfile(customerInfo, 'consumer').subscribe(
                    (data) => {
                        _this.setWaitlistFor(customerInfo, isParent);
                        resolve(data);
                    }, (error) => {
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        resolve(false);
                    }
                )
            } else {
                customerInfo['userProfile'] = {}
                console.log("Chosen Person:", _this.chosen_person);
                console.log("Form Data:", formdata);
                if (formdata.islanguage === 'yes') {
                    customerInfo['preferredLanguages'] = ['English'];
                } else {
                    customerInfo['preferredLanguages'] = formdata.preferredLanguage;
                }
                customerInfo['userProfile']['gender'] = formdata.gender;
                customerInfo['userProfile']['age'] = formdata.age;
                customerInfo['userProfile']['firstName'] = formdata.firstName;
                customerInfo['userProfile']['lastName'] = formdata.lastName;
                customerInfo['userProfile']['whatsAppNum'] = whatsup;
                customerInfo['userProfile']['telegramNum'] = telegram;
                if (formdata.email !== '' && formdata.updateEmail) {
                    customerInfo['userProfile']['email'] = formdata.email;
                }
                customerInfo['bookingLocation'] = {};
                customerInfo['bookingLocation']['pincode'] = formdata.pincode;
                if (_this.parentCustomer.countryCode !== '+91' && formdata.localarea && formdata.localarea !== '') {
                    customerInfo['bookingLocation']['district'] = formdata.localarea;
                }
                if (_this.parentCustomer.countryCode !== '+91' && formdata.state) {
                    customerInfo['bookingLocation']['state'] = formdata.state;
                }
                if (type === 'new') {
                    _this.customerService.addMember(customerInfo).subscribe(
                        (data) => {
                            _this.setWaitlistFor(customerInfo, isParent, data);
                            _this.initCommunications(customerInfo);
                            resolve(data);
                        }, (error) => {
                            _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            resolve(false);
                        }
                    )
                } else {
                    customerInfo['userProfile']['id'] = formdata.serviceFor;
                    _this.customerService.editMember(customerInfo).subscribe(
                        (data) => {
                            _this.setWaitlistFor(customerInfo, isParent, data);
                            _this.initCommunications(customerInfo);
                            resolve(data);
                        }, (error) => {
                            _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            resolve(false);
                        }
                    )
                }

            }
        })
    }

    /**
     * Update virtual details of customer
     * @param formdata 
     * @returns 
     */
    submitVirtualForm(formdata) {
        const _this = this;
        this.submitbtndisabled = true;
        formdata['phoneno'] = this.parentCustomer.userProfile.primaryMobileNo;
        if (this.virtualForm.controls.email.invalid) {
            return false;
        }
        else {
            let type = 'update';
            if (formdata.serviceFor === 'new_member') {
                type = 'new';
            }
            this.updateCustomer(formdata, this.is_parent, type).then(
                (result) => {
                    if (result !== false) {
                        _this.setConsumerFamilyMembers(this.parentCustomer.id).then(
                            (members) => {
                                _this.familyMembers = members;
                            }
                        );
                        _this.submitbtndisabled = false;
                        _this.bookStep++;
                    }
                }, (error) => {
                    _this.submitbtndisabled = false;
                    return false;
                }
            )
        }
    }

    /**
     * Processing the Virtual Form including validation and Submit
     */
     processVirtualForm() {
        if (this.validateVirtualForm() === true) {
            this.snackbarService.openSnackBar('Please fill  all required fields', { 'panelClass': 'snackbarerror' });
        } else if (this.virtualInfo.countryCode_whtsap.trim().length === 0 && this.virtualInfo.whatsappnumber.trim().length > 0) {
            this.snackbarService.openSnackBar('Please fill whatsapp countrycode', { 'panelClass': 'snackbarerror' });
        } else if (this.virtualInfo.countryCode_telegram.trim().length === 0 && this.virtualInfo.telegramnumber.trim().length > 0) {
            this.snackbarService.openSnackBar('Please fill telegram countrycode', { 'panelClass': 'snackbarerror' });
        } else {
            this.submitVirtualForm(this.virtualInfo);
        }
    }

    /**
     * Method to validate Consumer Virtual Form
     * @returns true/false
     */
     validateVirtualForm() {
        let isinvalid = false;
        if (this.parentCustomer.userProfile.countryCode === '+91') {
            if (this.virtualForm.get('pincode').value === '' || this.virtualForm.get('pincode').value.length !== 6) {
                isinvalid = true;
            }
        }
        if (this.parentCustomer.userProfile.countryCode !== '+91') {
            if (this.virtualForm.get('localarea').value === '' || this.virtualForm.get('state').value === '') {
                isinvalid = true;
            }
        }
        if (this.virtualForm.get('gender').value === '') { isinvalid = true; }
        if (this.virtualForm.get('age').value === '') { isinvalid = true; }
        if (this.virtualForm.get('islanguage').value === 'no') {
            if (this.virtualForm.get('preferredLanguage').value.length === 0) { isinvalid = true; }
        }
        if (this.virtualForm.get('serviceFor').value === 'new_member') {
            if (this.virtualForm.get('firstName').value == '') { isinvalid = true; }
            if (this.virtualForm.get('lastName').value == '') { isinvalid = true; }
        }
        return isinvalid;
    }

    /**
     * Method to update preferred languages.
     * @param event selected option
     */
     toggleLanguages(event) {
        this.lngknown = event.value
        if (this.lngknown === 'yes') {
            this.virtualForm.get('preferredLanguage').setValue(['English']);
        }
        if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length === 0) {
            this.hideLanguages = false;
        }
        if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length > 0 && this.virtualForm.get('preferredLanguage').value[0] === 'English') {
            this.virtualForm.get('preferredLanguage').setValue([]);
            this.hideLanguages = false;
        }
    }

    /**
     * Hide the language selection section
     */
     cancelLanguageSelection() {
        if (this.virtualForm.get('preferredLanguage').value.length == 0) {
            this.virtualForm.get('preferredLanguage').setValue(['English']);
            this.lngknown = 'yes';
            this.virtualForm.patchValue({ islanguage: 'yes' });
        } else {
            this.languageSelected = [];

        }
        this.hideLanguages = true;
    }

    /**
     * Method to set the preferred languages and hide the section including language validation
     * @returns selected languages
     */
     saveLanguages() {
        if (this.lngknown === 'yes') {
            this.virtualForm.get('preferredLanguage').setValue(['English']);
            this.hideLanguages = true;
            this.languageSelected = [];
            this.iseditLanguage = false;
        }
        else {
            this.virtualForm.patchValue({ 'preferredLanguage': this.languageSelected });
            if (this.virtualForm.get('preferredLanguage').value.length === 0) {
                this.snackbarService.openSnackBar('Please select one', { 'panelClass': 'snackbarerror' });
                return false;
            }
            this.hideLanguages = true;
            this.languageSelected = [];
        }
    }

    /**
     * To Show the Languages Selection Section
     */
     editLanguage() {
        this.iseditLanguage = true;
        this.languageSelected = this.virtualForm.get('preferredLanguage').value.slice();
        this.hideLanguages = false;
        this.hideTokenFor = false;
    }

    showLocations(event) {
        let pincode = this.virtualForm.get('pincode').value;
        if (pincode.length === 6) {
            this.loading = true;
            this.fetchLocationByPincode(pincode).then(
                (locations: any) => {
                    if (locations.length > 0) {
                        this.loading = false;
                        this.locations = locations[0];
                        this.virtualForm.patchValue({ location: locations[0]['PostOffice'][0] });
                    } else {
                        this.locations = [];

                    }

                }, error => {
                    console.log(this.loading);
                    this.loading = false;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            )
        } else {
            this.loading = false;
            this.locations = [];
        }
    }

    fetchLocationByPincode(pincode) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.shared_services.getLocationsByPincode(pincode).subscribe(
                (locations: any) => {
                    resolve(locations);
                },
                error => {
                    _this.loading = false;
                    reject(error);
                }
            );
        });
    }

    langSel(sel) {
        if (this.languageSelected.length > 0) {
            const existindx = this.languageSelected.indexOf(sel);
            if (existindx === -1) {
                this.languageSelected.push(sel);
            } else {
                this.languageSelected.splice(existindx, 1);
            }
        } else {
            this.languageSelected.push(sel);
        }
    }

    checklangExists(lang) {
        if (this.languageSelected.length > 0) {
            const existindx = this.languageSelected.indexOf(lang);
            if (existindx !== -1) {
                return true;
            }
        } else {
            return false;
        }
    }
}