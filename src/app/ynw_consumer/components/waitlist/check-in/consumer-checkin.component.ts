import { Component, Inject, OnInit, ViewChild, OnDestroy, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { DOCUMENT, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { JaldeeTimeService } from '../../../../shared/services/jaldee-time-service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { ConsumerEmailComponent } from '../../../shared/component/consumer-email/consumer-email.component';
import { PaytmService } from '../../../../../app/shared/services/paytm.service';
import { JcCouponNoteComponent } from '../../../../shared/modules/jc-coupon-note/jc-coupon-note.component';
import { CustomerService } from '../../../../shared/services/customer.service';
import { AuthService } from '../../../../shared/services/auth-service';
import { FileService } from '../../../../shared/services/file-service';
import { DomainConfigGenerator } from '../../../../shared/services/domain-config-generator.service';

@Component({
    selector: 'app-consumer-checkin',
    templateUrl: './consumer-checkin.component.html',
    styleUrls: ['./consumer-checkin.component.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css'],
})
export class ConsumerCheckinComponent implements OnInit, OnDestroy {
    coupon_notes = projectConstantsLocal.COUPON_NOTES;  
    // paymentBtnDisabled = false;
    isClickedOnce = false;
    shownonIndianModes = false;
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
    settingsjson: any = [];
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    partysizejson: any = [];
    sel_loc;
    prepaymentAmount = 0;
    sel_queue_id;
    queueId;
    sel_queue_waitingmins;
    waitingTime;
    sel_queue_servicetime = '';
    serviceTime;
    sel_queue_name;
    sel_queue_timecaption;
    sel_queue_indx;
    sel_queue_personaahead = 0;
    personsAhead;
    calc_mode;
    multipleMembers_allowed = false;
    partySize = false;
    partySizeRequired = null;
    today;
    minDate;
    maxDate;
    consumerNote = '';
    enterd_partySize = 1;
    holdenterd_partySize = 0;
    // sel_checkindate;
    // selectedDate;
    checkinDate;
    account_id;
    retval;
    futuredate_allowed = false;
    step = 1;
    waitlist_for: any = [];
    holdwaitlist_for: any = [];
    maxsize = 1;
    isFutureDate = false;
    addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
    userN = { 'id': 0, 'firstName': Messages.NOUSERCAP, 'lastName': '' };
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    queueQryExecuted = false;
    // todaydate;
    ddate;
    server_date;
    api_loading1 = true;
    departmentlist: any = [];
    departments: any = [];

    selectedCountryCode;
    userData: any = [];
    userEmail;
    users: any = [];
    emailExist = false;
    emailerror = null;
    trackUuid;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    selectedSlot: any;
    allSlots: any = [];
    availableSlots: any = [];
    data;
    provider_id: any;
    s3CouponsList: any = {
        JC: [], OWN: []
    };
    showCouponWB: boolean;
    bgColor: string;
    change_date: any;
    liveTrack = false;
    action: any = '';
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    callingModesDisplayName = projectConstants.CALLING_MODES;
    tele_srv_stat: any;

    couponvalid = true;
    selected_coupons: any = [];
    selected_coupon;
    couponsList: any = [];
    coupon_status = null;
    is_wtsap_empty = false;
    accountType;
    disable = false;
    hideEditButton = false;
    selectedService: any;
    note_cap = 'Add Note';
    servicedialogRef: any;
    availableDates: any = [];
    type;
    rescheduleUserId;
    waitlist: any = [];
    checkin_date;
    wtlst_for_fname;
    wtlst_for_lname;
    serviceCost;
    phoneNumber;
    separateDialCode = true;

    phoneError: string;
    dialCode;
    editBookingFields: boolean;
    whatsapperror = '';
    showmoreSpec = false;
    bookStep;
    locationName;
    waitlistDetails: any;
    uuidList: any = [];
    prepayAmount;
    paymentDetails: any = [];
    paymentLength = 0;
    @ViewChild('closebutton') closebutton;
    @ViewChild('modal') modal;
    apiError = '';
    apiSuccess = '';
    questionnaireList: any = [];
    questionAnswers;
    googleMapUrl;
    private subs = new SubSink();
    selectedQTime;
    questionnaireLoaded = false;
    imgCaptions: any = [];
    virtualInfo: any;
    newMember: any;
    consumerType: string;
    heartfulnessAccount = false;
    theme: any;
    checkPolicy = true;
    customId: any; // To know the source whether the router came from Landing page or not
    businessId: any;
    virtualFields: any;
    whatsappCountryCode;
    disablebutton = false;
    readMore = false;
    razorpayGatway = false;
    paytmGateway = false;
    checkJcash = false;
    checkJcredit = false;
    jaldeecash: any;
    jcashamount: any;
    jcreditamount: any;
    remainingadvanceamount;
    amounttopay: any;
    wallet: any;
    payAmount: number;
    loadingPaytm = false;
    @ViewChild('consumer_checkin') paytmview;
    api_loading_video;
    payment_options: any = [];
    paytmEnabled = false;
    razorpayEnabled = false;
    interNatioanalPaid = false;
    paymentmodes: any;
    from: string;
    details: any;
    gender_cap = Messages.GENDER_CAP;
    selectedLocation;
    locations;
    consumer_label: any;
    disableButton;
    loading = false;
    submitbtndisabled = false;
    hideTokenFor = true;
    api_loading = true;
    familyMembers: any = [];
    new_member;
    is_parent = true;
    chosen_person: any;
    activeUser: any;
    memberObject: any;
    selectedMonth: number;
    selectedYear: number;
    allDates: any[] = [];
    dates: any[] = [];
    years: number[] = [];
    months: { value: string; name: string; }[];
    mob_prefix_cap = '+91';
    mandatoryEmail: any;
    serviceDetails: any;
    provider: any;
    languageSelected: any = [];
    iseditLanguage = false;
    hideNextButton = false;
    wt_personaahead;
    selection_modes: any;
    indian_payment_modes: any = [];
    non_indian_modes: any = [];
    selected_payment_mode: any;
    isInternatonal: boolean;
    gateway: any;
    isPayment: boolean;
    pGateway: any;

    parentCustomer;
    countryCode;
    commObj = {}
    waitlistForPrev: any = [];
    selectedTime: any;
    // date_pagination_date: any;
    provider_label = '';

    loggedIn = true;
    smallDevice: boolean;
    businessInfo: any = {};
    queuesLoaded: boolean = false;
    oneTimeInfo: any;
    onetimeQuestionnaireList: any = [];

    loadingS3 = true;        // To check whether s3 url call completed or not
    providerConsumerId: unknown;
    providerConsumerList: any;
    scheduledWaitlist; // To store rescheduled info
    changePhone;     // Change phone number or not
    departmentEnabled;// Department Enabled or not
    selectedUser;     // Appointment for which user/doctor
    selectedUserId;   // Appointment for which user/doctor id
    selectedServiceId;// Id of the appointment service
    selectedDept;     // Department of the selected service
    selectedDeptId;     // Department Id of the selected service
    paymentRequestId; // Retrying failed attempts

    serverDate;       // To store the server date
    filestoUpload: any = [];
    uuid: any;
    apiErrors: any[];

    convenientPaymentModes: any = [];
    convenientFeeObj: any;
    convenientFee: any;
    gatewayFee: any;
    profileId: any;
    serviceOptionQuestionnaireList: any;
    serviceOptionApptt = false;
    btnClicked = false // To avoid double click
    serviceOPtionInfo: any;
    groupedQnr: any;
    finalDataToSend: any;
    showSlot = true;
    showNext = false;
    serviceTotalPrice: number;
    total_servicefee: number;
    accountConfig: any;
    login_details: any;
    login_countryCode: any;
    serviceOptDetails: any;
    results: any;
    constructor(public fed_service: FormMessageDisplayService,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        private sharedServices: SharedServices,
        public router: Router,
        public route: ActivatedRoute,
        public dateformat: DateFormatPipe,
        public provider_services: ProviderServices,
        public datastorage: CommonDataStorageService,
        public location: Location,
        public dialog: MatDialog,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private groupService: GroupStorageService,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        private dateTimeProcessor: DateTimeProcessor,
        private jaldeeTimeService: JaldeeTimeService,
        private s3Processor: S3UrlProcessor,
        private ngZone: NgZone,
        private paytmService: PaytmService,
        private cdRef: ChangeDetectorRef,
        private customerService: CustomerService,
        private authService: AuthService,
        private fileService: FileService,
        private configService: DomainConfigGenerator,
        public shared_functions: SharedFunctions,
        @Inject(DOCUMENT) public document
    ) {

        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                if (params.ctime) {
                    // console.log('****************************')
                    this.selectedTime = params.ctime

                }
                this.sel_loc = params.loc_id;
                if (params.locname) {
                    this.businessInfo['locationName'] = params.locname;
                    this.businessInfo['googleMapUrl'] = params.googleMapUrl;
                }
                if (params.qid) {
                    this.sel_queue_id = params.qid;
                }
                if (params.isFrom && params.isFrom == 'providerdetail') {
                    this.from = 'providerdetail';
                }
                this.change_date = params.cur;
                this.account_id = params.account_id;
                this.provider_id = params.unique_id;
                // this.sel_checkindate = this.selectedDate = params.sel_date;
                this.checkinDate = params.sel_date;
                // this.hold_sel_checkindate = this.sel_checkindate;
                this.tele_srv_stat = params.tel_serv_stat;
                if (params.dept) {
                    this.selectedDeptId = parseInt(params.dept);
                    this.departmentEnabled = true;
                }
                if (params.user) {
                    this.selectedUserId = params.user;
                }
                if (params.service_id) {
                    this.selectedServiceId = parseInt(params.service_id);
                }
                if (params.theme) {
                    this.theme = params.theme;
                }
                if (params.customId) {
                    this.customId = params.customId;
                    this.businessId = this.account_id;
                }
                if (params.type === 'waitlistreschedule') {
                    this.type = params.type;
                    this.rescheduleUserId = params.uuid;
                    // this.getRescheduleWaitlistDet();
                }
                this.uuid = params.uuid;
            }
        );
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.innerWidth <= 767) {
            this.smallDevice = true;
        } else {
            this.smallDevice = false;
        }
    }
    /**
    * 
    * @param locid Location Id
    * @returns services of location
    */
    getServicesbyLocation(locid) {
        console.log("getServicesbyLocation:", locid);
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (locid) {
                _this.subs.sink = _this.shared_services.getServicesByLocationId(locid).subscribe((services) => {
                    resolve(services);
                }, () => {
                    resolve([]);
                })
            } else {
                resolve([]);
            }

        })
    }

    getRescheduledInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.rescheduleUserId) {
                resolve(true);
            } else {
                _this.getRescheduleWaitlistDet().then(
                    () => {
                        resolve(true);
                    }
                )
            }
        })

    }

    /**
     * 
     * @param locid Location Id
     * @returns services of location
     */
    getQueuesbyLocationServiceAndDate(locid, servid, pdate, accountid) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe((queues: any) => {
                    resolve(queues);
                    _this.queuesLoaded = true;
                }, () => {
                    resolve([]);
                    _this.queuesLoaded = true;
                })
        })
    }

    ngOnInit() {
        this.login_details =this.shared_functions.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials')); 
        if(this.login_details && this.login_details.countryCode){
          this.login_countryCode = this.login_details.countryCode;
        }
        const _this = this;
        _this.onResize();
       
        _this.serverDate = _this.lStorageService.getitemfromLocalStorage('sysdate');
        if (_this.checkin_date) {
            _this.isFutureDate = _this.dateTimeProcessor.isFutureDate(_this.serverDate, _this.checkin_date);
        }
        _this.configService.getUIAccountConfig(this.provider_id).subscribe(
            (uiconfig: any) => {
                _this.accountConfig = uiconfig;
            });
        _this.gets3urls().then(() => {
            _this.getRescheduledInfo().then(() => {
                if (_this.selectedServiceId) { _this.getPaymentModes(); }
                _this.getServicesbyLocation(_this.sel_loc).then(
                    (services: any) => {
                        _this.services = services;
                        console.log("Services:", services);
                        _this.setServiceDetails(_this.selectedServiceId);
                        _this.getPaymentModes();
                        _this.getQueuesbyLocationServiceAndDate(_this.sel_loc, _this.selectedServiceId, _this.checkinDate, _this.account_id).then(
                            (queues: any) => {
                                _this.queuejson = queues;
                                _this.setQDetails(queues);
                            }
                        )
                        _this.api_loading = false;
                        // _this.questionnaireLoaded = true;
                    })
            })
        });
        this.serviceOPtionInfo = this.lStorageService.getitemfromLocalStorage('serviceOPtionInfo');
        this.getServiceOptions();
    }
    getServiceOptions() {
        this.subs.sink = this.sharedServices.getServiceoptionsWaitlist(this.selectedServiceId, this.account_id)
            .subscribe(
                (data) => {
                    if (data) {
                        this.serviceOptionQuestionnaireList = data;
                        if (this.serviceOptionQuestionnaireList.questionnaireId && this.type !== 'waitlistreschedule') {
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
    getserviceOptionQuestionAnswers(event) {
        this.serviceOPtionInfo = event;
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
    setQDetails(queues, qId?) {
        if (queues.length > 0) {
            let selindx = 0;
            for (let i = 0; i < queues.length; i++) {
                if (queues[i]['queueWaitingTime'] !== undefined) {
                    selindx = i;
                }
            }
            this.sel_queue_id = queues[selindx].id;
            this.sel_queue_indx = selindx;
            console.log("Selected QId:", this.sel_queue_id);
            this.sel_queue_waitingmins = this.dateTimeProcessor.providerConvertMinutesToHourMinute(queues[selindx].queueWaitingTime);
            this.sel_queue_servicetime = queues[selindx].serviceTime || '';
            this.sel_queue_name = queues[selindx].name;
            this.sel_queue_personaahead = queues[selindx].queueSize;
            this.wt_personaahead = queues[selindx].showPersonAhead;
            this.calc_mode = queues[selindx].calculationMode;
            this.slotSelected(queues[selindx]);
        } else {
            this.sel_queue_id = 0;
            this.sel_queue_waitingmins = 0;
            this.sel_queue_servicetime = '';
            this.sel_queue_name = '';
            this.sel_queue_personaahead = 0;
        }
    }
    initCheckin() {
        const _this = this;
        _this.waitlist_for = [];
        _this.activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
        _this.consumer_label = _this.wordProcessor.getTerminologyTerm('customer');
        console.log("Active User:", _this.waitlist_for);
        return new Promise(function (resolve, reject) {
            _this.customerService.getCustomerInfo(_this.activeUser.id).then(data => {
                _this.parentCustomer = data;
                if (!_this.rescheduleUserId) {
                    _this.waitlist_for.push({ id: _this.parentCustomer.id, firstName: _this.parentCustomer.userProfile.firstName, lastName: _this.parentCustomer.userProfile.lastName });

                    console.log("WaitlistFor2:", _this.waitlist_for);
                    _this.setConsumerFamilyMembers(_this.parentCustomer.id).then(); // Load Family Members                   
                    _this.setProviderConsumerList(_this.parentCustomer.id, _this.account_id).then(
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
                }
                _this.initCommunications(_this.parentCustomer);

            });
        })
    }
    getCoupons(){
       
        this.sharedServices.getCheckinCoupons(this.selectedServiceId,this.sel_loc )
            .subscribe(
                (res: any) => {
                  this.results = res;  
                  if(this.results && this.results.jaldeeCoupons){
                    this.s3CouponsList.JC = this.results.jaldeeCoupons;
                    if (this.s3CouponsList.JC.length > 0){
                      this.showCouponWB = true;
                    }
                  }
                  if(this.results && this.results.providerCoupons){
                    this.s3CouponsList.OWN = this.results.providerCoupons;
                    if (this.s3CouponsList.OWN.length > 0){
                      this.showCouponWB = true;
                    }
                  }
                
                },
                error => {
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  this.btnClicked = false;
                }
            );
    
    }
    checkinDateChanged(checkinDate) {
        const _this = this;
        this.queuejson = [];
        this.checkinDate = checkinDate;
        this.isFutureDate = this.dateTimeProcessor.isFutureDate(this.serverDate, this.checkinDate);
        console.log("changed_date_value Date:", this.checkinDate);
        this.queuesLoaded = false;
        _this.getQueuesbyLocationServiceAndDate(_this.sel_loc, _this.selectedServiceId, _this.checkinDate, _this.account_id).then(
            (queues: any) => {
                _this.queuejson = queues;
                if(queues.length === 0){
                    // Please choose other date.
                    this.snackbarService.openSnackBar('No queues available on selected date.', { 'panelClass': 'snackbarerror' });
                }
                _this.setQDetails(queues);
            }
        )
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

                    this.profileId = this.paymentmodes.profileId;
                    // let convienientPaymentObj = {}
                    // convienientPaymentObj = {
                    //     "profileId" :  this.paymentmodes.profileId,
                    //     "amount"	: this.paymentDetails.amountRequiredNow
                    // }

                    // this.shared_services.getConvenientFeeOfProvider(this.account_id,convienientPaymentObj).subscribe((data:any)=>{
                    //                                // let array = []
                    //                                console.log("Convenient response :",data)
                    //                                this.convenientPaymentModes = data;
                    //                                if(this.convenientPaymentModes){
                    //                                this.convenientPaymentModes.map((res:any)=>{
                    //                                 this.convenientFeeObj = { }
                    //                                 if(res){
                    //                                     this.convenientFeeObj = res;
                    //                                         this.convenientFee = this.convenientFeeObj.convenienceFee;
                    //                                         // this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
                    //                                         console.log("payment convenientFee for Indian:",this.convenientFee,res.mode,this.gatewayFee)

                    //                                 }
                    //                                })
                    //                             }

                    // })
                    console.log("isConvenienceFee paymentsss:", this.paymentmodes)
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
        this.convenientPaymentModes.map((res: any) => {
            this.convenientFeeObj = {}
            if (res.isInternational === false) {
                this.convenientFeeObj = res;
                if (this.selected_payment_mode === res.mode) {
                    //  this.convenientFee = this.convenientFeeObj.convenienceFee;
                    //  this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
                    this.gatewayFee = this.convenientFeeObj.totalGatewayFee;

                    console.log("convenientFee for Indian:", this.convenientFee, res.mode, this.gatewayFee)
                }
            }
        })
    }
    non_indian_modes_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = true;
        this.convenientPaymentModes.map((res: any) => {
            this.convenientFeeObj = {}
            if (res.isInternational === true) {
                this.convenientFeeObj = res;
                if (this.selected_payment_mode === res.mode) {
                    //  this.convenientFee = this.convenientFeeObj.convenienceFee;
                    //  this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
                    this.gatewayFee = this.convenientFeeObj.totalGatewayFee;

                    console.log("convenientFee for  non-indian:", this.convenientFee, res.mode, this.gatewayFee)
                }
            }
        })
    }
    togglepaymentMode() {
        this.shownonIndianModes = !this.shownonIndianModes;
        this.selected_payment_mode = null;
    }
    getImageSrc(mode) {
        return 'assets/images/payment-modes/' + mode + '.png';
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    getRescheduleWaitlistDet() {
        const _this = this;
        _this.waitlist_for = [];
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.getCheckinByConsumerUUID(_this.rescheduleUserId, _this.account_id).subscribe(
                (waitlst: any) => {
                    _this.scheduledWaitlist = waitlst;
                    if (_this.type === 'waitlistreschedule') {
                        _this.waitlist_for.push({ id: _this.scheduledWaitlist.waitlistingFor[0].id, firstName: _this.scheduledWaitlist.waitlistingFor[0].firstName, lastName: _this.scheduledWaitlist.waitlistingFor[0].lastName, phoneNo: _this.scheduledWaitlist.phoneNumber });
                        _this.wtlst_for_fname = _this.scheduledWaitlist.waitlistingFor[0].firstName;
                        _this.wtlst_for_lname = _this.scheduledWaitlist.waitlistingFor[0].lastName;

                        _this.commObj['communicationPhNo'] = _this.scheduledWaitlist.waitlistPhoneNumber;
                        _this.commObj['communicationPhCountryCode'] = _this.scheduledWaitlist.countryCode;
                        _this.commObj['communicationEmail'] = _this.scheduledWaitlist.waitlistingFor[0]['email'];

                        if (_this.scheduledWaitlist.waitlistingFor[0].whatsAppNum) {
                            _this.commObj['comWhatsappNo'] = _this.scheduledWaitlist.waitlistingFor[0].whatsAppNum.number;
                            _this.commObj['comWhatsappCountryCode'] = _this.scheduledWaitlist.waitlistingFor[0].whatsAppNum.countryCode;
                        } else {
                            _this.commObj['comWhatsappNo'] = _this.parentCustomer.userProfile.primaryMobileNo;
                            _this.commObj['comWhatsappCountryCode'] = _this.parentCustomer.userProfile.countryCode;
                        }
                        _this.consumerNote = _this.scheduledWaitlist.consumerNote;
                    }
                    _this.checkin_date = _this.scheduledWaitlist.date;
                    _this.isFutureDate = _this.dateTimeProcessor.isFutureDate(_this.serverDate, _this.checkin_date);
                    _this.sel_loc = _this.scheduledWaitlist.queue.location.id;
                    _this.selectedServiceId = _this.scheduledWaitlist.service.id;
                    _this.checkinDate = _this.scheduledWaitlist.date;
                    resolve(true);
                }, () => {
                    resolve(false);
                });
        })

    }
    rescheduleWaitlist() {
        // 'queue': this.sel_queue_id,
        const post_Data = {
            'ynwUuid': this.rescheduleUserId,
            'date': this.checkinDate,
            'queue': this.queueId,
            'consumerNote': this.consumerNote
        };
         console.log("Reschedule :",post_Data);
       // console.log(post_Data)
        this.subs.sink = this.shared_services.rescheduleConsumerWaitlist(this.account_id, post_Data)
            .subscribe(
                () => {
                    if (this.selectedMessage.files.length > 0) {
                        console.log("UID :",this.rescheduleUserId);
                        this.consumerNoteAndFileSave(this.rescheduleUserId);
                        
                    } else {
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.rescheduleUserId,
                            type: 'waitlistreschedule',
                            theme: this.theme
                        }
                        if (this.businessId) {
                            queryParams['customId'] = this.customId;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    resetApiErrors() {
        this.emailerror = null;
    }

    setServiceDetails(serviceId) {
        let activeService = this.services.filter(service => service.id === serviceId)[0];
        if (activeService) {
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
                internationalAmount :  activeService.internationalAmount,
        supportInternationalConsumer :  activeService.supportInternationalConsumer,
            };
            console.log("Active Service :", this.selectedService)

            if (activeService.provider) {
                this.selectedUserId = activeService.provider.id;
                this.setUserDetails(this.selectedUserId);
            }
            if (this.departmentEnabled) {
                this.selectedDeptId = activeService.department;
                this.setDepartmentDetails(this.selectedDeptId);
            }

            if (activeService.virtualCallingModes) {
                this.setVirtualInfoServiceInfo(activeService, this.type);
            }
            //     this.prepaymentAmount = this.scheduledWaitlist_for.length * this.selectedService.minPrePaymentAmount || 0;
            //     this.serviceCost = this.selectedService.price;
        }
    }
    setDepartmentDetails(departmentId) {
        const deptDetail = this.departments.filter(dept => dept.departmentId === departmentId);
        this.selectedDept = deptDetail[0];
    }

    getQueuesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        console.log("getQueuesbyLocationandServiceIdavailability");
        console.log("Location:" + locid + ", Service Id:" + servid + ", AccountId:" + accountid);
        if (locid && servid && accountid) {
            _this.subs.sink = _this.shared_services.getQueuesbyLocationandServiceIdAvailableDates(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.isAvailable);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }
    handleQueueSelection(queue, index) {
        this.sel_queue_indx = index;
        this.sel_queue_id = queue.id;
        this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(queue.queueWaitingTime);
        this.sel_queue_servicetime = queue.serviceTime || '';
        this.sel_queue_name = queue.name;
        this.sel_queue_timecaption = queue.queueSchedule.timeSlots[0]['sTime'] + ' - ' + queue.queueSchedule.timeSlots[0]['eTime'];
        this.sel_queue_personaahead = queue.queueSize;
        if (this.calc_mode === 'Fixed' && queue.timeInterval && queue.timeInterval !== 0) {
            this.getAvailableTimeSlots(queue.queueSchedule.timeSlots[0]['sTime'], queue.queueSchedule.timeSlots[0]['eTime'], queue.timeInterval);
        }
    }
    handleConsumerNote(value) {
        this.consumerNote = value;
    }
    // checkFutureorToday() {
    //     let today: any;
    //     today = this.dateTimeProcessor.getToday(this.server_date);
    //     const dt0 = today.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    //     const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    //     const date2 = new Date(dt2);
    //     const dte0 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    //     const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
    //     const datee2 = new Date(dte2);
    //     if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    //         this.isFutureDate = true;
    //     } else {
    //         this.isFutureDate = false;
    //     }
    // }
    // handleCheckinClicked() {
    //     let error = '';
    //     if (this.step === 1) {
    //         if (this.partySizeRequired) {
    //             error = this.validatorPartysize(this.enterd_partySize);
    //         }
    //         if (error === '') {
    //             this.saveCheckin();
    //         } else {
    //             this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //         }
    //     }
    // }

    setVirtualInfoServiceInfo(activeService, appointmentType) {
        if (activeService.virtualCallingModes[0].callingMode === 'WhatsApp' || activeService.virtualCallingModes[0].callingMode === 'Phone') {
            if (appointmentType === 'reschedule') {
                if (activeService.virtualCallingModes[0].callingMode === 'WhatsApp') {
                    this.callingModes = this.scheduledWaitlist.virtualService['WhatsApp'];
                } else {
                    this.callingModes = this.scheduledWaitlist.virtualService['Phone'];
                }
                const phNumber = this.scheduledWaitlist.countryCode + this.scheduledWaitlist.phoneNumber;
                const callMode = '+' + activeService.virtualCallingModes[0].value;
                if (callMode === phNumber) {
                    this.changePhone = false;
                } else {
                    this.changePhone = true;
                }
            }
        }
    }

    confirmcheckin(type?) {

        const _this = this;
        // type === 'checkin' && 
        if (this.selectedService.isPrePayment && (!this.commObj['communicationEmail'] || this.commObj['communicationEmail'] === '')) {
            // this.paymentBtnDisabled = true;
            // this.submitQuestionnaireAnswers(this.questionAnswers);

            const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
                width: '40%',
                panelClass: ['loginmainclass', 'popup-class']
            });
            emaildialogRef.afterClosed().subscribe(result => {
                if (result !== '' && result !== undefined) {
                    this.commObj['communicationEmail'] = result;
                    this.confirmcheckin(type);
                } else {
                    this.isClickedOnce = false;
                    // this.paymentBtnDisabled = false;
                    this.goBack('backy');
                }
            });
        } else {
            console.log('inisdeeeeee');
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    if (list.id === this.parentCustomer.id) {
                        list['id'] = 0;
                    }
                }
            }
            if (this.selectedService.serviceType === 'virtualService' && !this.validateVirtualCallInfo(this.callingModes)) {
                return false;
            }
            if (type === 'checkin') {
                if (this.selectedService.isPrePayment && !this.selected_payment_mode && this.paymentDetails.amountRequiredNow > 0) {
                    this.snackbarService.openSnackBar('Please select a payment mode', { 'panelClass': 'snackbarerror' });
                    this.isClickedOnce = false;
                    return false;
                }                
                if (this.jcashamount > 0 && this.checkJcash) {
                    this.shared_services.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.paymentDetails.amountRequiredNow)
                        .subscribe(data => {
                            console.log('dfsdfdfs' + data)
                            this.remainingadvanceamount = data;
                            this.performCheckin().then(
                                () => {
                                    _this.paymentOperation();
                                }
                            );
                        });
                } else {
                    this.performCheckin().then(
                        () => {
                            _this.paymentOperation();
                        }
                    );
                }
            } else if (this.selectedService.isPrePayment) {
                this.addWaitlistAdvancePayment();
            }
        }
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
                    if (!this.commObj['comWhatsappNo']) {
                        this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                        valid = false;
                        break;
                    }
                }
            }
        }
        return valid;
    }
    generateInputforCheckin() {
        let post_Data = {
            'queue': {
                'id': this.queueId
            },
            'date': this.checkinDate,
            'service': {
                'id': this.selectedServiceId,
                'serviceType': this.selectedService.serviceType
            },
            'consumerNote': this.consumerNote,
            'countryCode': this.parentCustomer.userProfile.countryCode,
            'coupons': this.selected_coupons
        };
        if (this.commObj['communicationEmail'] !== '') {
            this.waitlist_for[0]['email'] = this.commObj['communicationEmail'];
        }
        post_Data['waitlistingFor'] = JSON.parse(JSON.stringify(this.waitlist_for));

        if (this.selectedSlot) {
            post_Data['appointmentTime'] = this.selectedSlot;
        }
        console.log("Mani:", this.selectedService);
        if ((this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP)) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        } else if (this.selectedService.provider) {
            post_Data['provider'] = { 'id': this.selectedService.provider.id };
        }
        if (this.partySizeRequired) {
            this.holdenterd_partySize = this.enterd_partySize;
            post_Data['partySize'] = Number(this.holdenterd_partySize);
        }
        post_Data['waitlistPhoneNumber'] = this.commObj['communicationPhNo'];
        post_Data['consumer'] = { id: this.parentCustomer.id };
        if (this.jcashamount > 0 && this.checkJcash) {
            post_Data['useCredit'] = this.checkJcredit
            post_Data['useJcash'] = this.checkJcash
        }
        if (this.selectedService.serviceType === 'virtualService') {
            if (this.validateVirtualCallInfo(this.callingModes)) {
                post_Data['virtualService'] = this.getVirtualServiceInput();
            } else {
                return false;
            }
        }
        let serviceOPtionInfo = this.lStorageService.getitemfromLocalStorage('serviceOPtionInfo');
        let itemArray = this.lStorageService.getitemfromLocalStorage('itemArray');
        console.log('itemArray:', itemArray )
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
           
      
            post_Data['waitlistingFor'][0]['srvAnswers'] = srvAnswerstoSend;
            post_Data['srvAnswers'] = srvAnswerstoSend;
            this.serviceOptDetails = srvAnswerstoSend;
            console.log('this.serviceOptDetails:', this.serviceOptDetails )
            // post_Data['srvAnswers'] = serviceOPtionInfo.answers;
          }
        return post_Data;
    }
    performCheckin() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            console.log("Payment Req Id:", _this.paymentRequestId);
            if (_this.paymentRequestId) {
                resolve(true);
            } else {
                let post_Data = _this.generateInputforCheckin();
                _this.subs.sink = _this.shared_services.addCheckin(_this.account_id, post_Data)
                    .subscribe(data => {
                        const retData = data;
                        _this.uuidList = [];
                        let parentUid;
                        Object.keys(retData).forEach(key => {
                            if (key === '_prepaymentAmount') {
                                _this.prepayAmount = retData['_prepaymentAmount'];
                            } else {
                                _this.trackUuid = retData[key];
                                if (key !== 'parent_uuid') {
                                    _this.uuidList.push(retData[key]);
                                }
                            }
                            parentUid = retData['parent_uuid'];
                        });

                        if (_this.selectedMessage.files.length > 0) {
                            _this.consumerNoteAndFileSave(parentUid).then(
                                () => {
                                    resolve(true);
                                }
                            );
                        }
                        else {
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
                        _this.disablebutton = false;
                        _this.paytmGateway = false;
                        _this.razorpayGatway = false;
                    });
            }
        });
    }
    submitQuestionnaire(uuid) {
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
                _this.subs.sink = _this.shared_services.submitConsumerWaitlistQuestionnaire(dataToSend, uuid, _this.account_id).subscribe((data: any) => {
                    let postData = {
                        urls: []
                    };
                    if (data.urls && data.urls.length > 0) {
                        for (const url of data.urls) {
                            _this.api_loading_video = true;
                            const file = _this.questionAnswers.filestoUpload[url.labelName][url.document];
                            _this.provider_services.videoaudioS3Upload(file, url.url)
                                .subscribe(() => {
                                    postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                                    if (data.urls.length === postData['urls'].length) {
                                        _this.shared_services.consumerWaitlistQnrUploadStatusUpdate(uuid, _this.account_id, postData)
                                            .subscribe((data) => {
                                                resolve(true);
                                            },
                                                error => {
                                                    _this.isClickedOnce = false;
                                                    _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                                    _this.disablebutton = false;
                                                    _this.api_loading_video = true;
                                                    resolve(false);
                                                });
                                    }
                                },error => {
                                    _this.isClickedOnce = false;
                                    _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                    _this.disablebutton = false;
                                    _this.api_loading_video = true;
                                });
                        }
                    } else {
                        resolve(true);
                    }
                }, error => {
                    _this.isClickedOnce = false;
                    _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    _this.disablebutton = false;
                    _this.api_loading_video = true;
                    resolve(false);
                });
            } else {
                resolve(true);
            }
        });

    }
    submitserviceOptionQuestionnaire(uuid) {


        const _this = this;
        this.groupedQnr = this.serviceOPtionInfo.answers.answerLine.reduce(function (rv, x) {
            (rv[x.sequenceId] = rv[x.sequenceId] || []).push(x);
            return rv;
        }, {});
        console.log(JSON.stringify(this.groupedQnr));
        console.log('*********************************');
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
                finalSubList = [];
            }
        }

        this.finalDataToSend = {
            'questionnaireId': this.serviceOPtionInfo.answers.questionnaireId,
            'answerLine': finalList
        }
        const data = this.finalDataToSend
        return new Promise(function (resolve, reject) {

            // console.log(JSON.stringify(this.serviceOPtionInfo))   
            const dataToSend: FormData = new FormData();
            if (data.files) {
                for (const pic of data.files) {
                    dataToSend.append('files', pic, pic['name']);
                }
            }
            const blobpost_Data = new Blob([JSON.stringify(data)], { type: 'application/json' });
            dataToSend.append('question', blobpost_Data);
            _this.subs.sink = _this.sharedServices.submitConsumerWaitlistServiceOption(dataToSend, uuid, _this.account_id).subscribe((data: any) => {

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
    paymentOperation() {
        this.setAnalytics('payment_initiated');
        if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0) {
            this.payuPayment(this.selected_payment_mode);
        } else {
            let multiple;
            if (this.uuidList.length > 1) {
                multiple = true;
            } else {
                multiple = false;
            }
            let queryParams = {
                account_id: this.account_id,
                uuid: this.uuidList,
                multiple: multiple,
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
            this.setAnalytics();
            this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
        }
    }

    finishCheckin(status) {
        if (status) {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
            let multiple;
            if (this.uuidList.length > 1) {
                multiple = true;
            } else {
                multiple = false;
            }
            let queryParams = {
                account_id: this.account_id,
                uuid: this.uuidList,
                multiple: multiple,
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
            this.setAnalytics();
            this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras));
        } else {
            this.closeloading();
        }
    }
    transactionCompleted(response, payload, accountId) {
        if (response.SRC) {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
                    .then((data) => {
                        if (data) {
                            this.setAnalytics('payment_completed');
                            this.finishCheckin(true);
                        }
                    })
            } else if (response.STATUS == 'TXN_FAILURE') {
                if (response.error && response.error.description) {
                    this.snackbarService.openSnackBar(response.error.description, { 'panelClass': 'snackbarerror' });
                }
                this.finishCheckin(false);
            }
        } else {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.paytmService.updatePaytmPay(payload, accountId)
                    .then((data) => {
                        if (data) {
                            this.setAnalytics('payment_completed');
                            this.finishCheckin(true);
                        }
                    })
            } else if (response.STATUS == 'TXN_FAILURE') {
                this.snackbarService.openSnackBar(response.RESPMSG, { 'panelClass': 'snackbarerror' });
                this.finishCheckin(false);
            }
        }
    }
    closeloading() {
        this.loadingPaytm = false;
        this.cdRef.detectChanges();
        // this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
        return false;
        // if (this.from) {
        //     this.ngZone.run(() => this.router.navigate(['consumer']));
        // } else {
        //     let queryParams = {
        //         accountId: this.account_id,
        //         uuid: this.uuidList,
        //         theme: this.theme
        //     }
        //     if (this.businessId) {
        //         queryParams['customId'] = this.customId;
        //     }

        //     let navigationExtras: NavigationExtras = {
        //         queryParams: queryParams
        //     };
        //     this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        // }
    }
    showCheckinButtonCaption() {
        let caption = '';
        if (this.settingsjson.showTokenId) {
            caption = 'Token';
        } else {
            caption = 'Check-in';
        }
        return caption;
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
        this.disable = false;
    }
    handleSaveMember() {
        this.disable = true;
        let derror = '';
        const namepattern = new RegExp(projectConstantsLocal.VALIDATOR_CHARONLY);
        const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const blankpattern = new RegExp(projectConstantsLocal.VALIDATOR_BLANK);
        if (!namepattern.test(this.addmemberobj.fname) || blankpattern.test(this.addmemberobj.fname)) {
            derror = 'Please enter a valid first name';
        }
        if (derror === '' && (!namepattern.test(this.addmemberobj.lname) || blankpattern.test(this.addmemberobj.lname))) {
            derror = 'Please enter a valid last name';
        }
        if (derror === '') {
            if (this.addmemberobj.mobile !== '') {
                if (!phonepattern.test(this.addmemberobj.mobile)) {
                    derror = 'Phone number should have only numbers';
                } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
                    derror = 'Enter a 10 digit mobile number';
                }
            }
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
                    this.disable = false;
                });
        } else {
            this.apiError = derror;
        }
        setTimeout(() => {
            this.apiError = '';
            this.apiSuccess = '';
        }, 2000);
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
                if (this.partysizejson.partySizeForCalculation) { // check whether multiple members are allowed to be selected
                    this.multipleMembers_allowed = true;
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
                this.selectedDept = this.departments[i];
                break;
            }
        }
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
    deleteTempImage(i) {
        this.selectedMessage.files.splice(i, 1);
        this.selectedMessage.base64.splice(i, 1);
        this.selectedMessage.caption.splice(i, 1);
        this.imgCaptions[i] = '';
    }


    sendWLAttachment(accountId, uuid, dataToSend) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.addConsumerWaitlistAttachment(accountId, uuid, dataToSend).subscribe(
                () => {
                    resolve(true);
                }, (error) => {
                    reject(error);
                });
        });
    }

    consumerNoteAndFileSave(parentUid) {
        console.log("Parent Id:", parentUid);
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

            _this.sendWLAttachment(_this.account_id, parentUid, dataToSend).then(
                (res) => {
                    console.log("File res :",res);
                    if (_this.type !== 'waitlistreschedule') {
                        _this.submitQuestionnaire(parentUid).then(
                            () => {
                                resolve(true);
                            }
                        );
                        // let queryParams = {
                        //     account_id: _this.account_id,
                        //     uuid: _this.rescheduleUserId,
                        //     type: 'waitlistreschedule',
                        //     theme: _this.theme
                        // }
                        // if (_this.businessId) {
                        //     queryParams['customId'] = _this.customId;
                        // }
                        // let navigationExtras: NavigationExtras = {
                        //     queryParams: queryParams
                        // };
                        // this.setAnalytics();
                        // _this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras)
                    } else {
                        let queryParams = {
                            account_id: _this.account_id,
                            uuid: _this.rescheduleUserId,
                            type: 'waitlistreschedule',
                            theme: _this.theme
                        }
                        if (_this.businessId) {
                            queryParams['customId'] = _this.customId;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        _this.setAnalytics();
                        _this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
                    }
                }
            )
            // _this.submitserviceOptionQuestionnaire(parentUid).then(
            //     () => {
            //         resolve(true);
            //     }
            // );
        });
    }

    // consumerNoteAndFileSave(parentUid) {
    //     const _this = this;
    //     return new Promise(function (resolve, reject) {
    //         const dataToSend: FormData = new FormData();
    //         const captions = {};
    //         let i = 0;
    //         if (_this.selectedMessage) {
    //             for (const pic of _this.selectedMessage.files) {
    //                 dataToSend.append('attachments', pic, pic['name']);
    //                 captions[i] = (_this.imgCaptions[i]) ? _this.imgCaptions[i] : '';
    //                 i++;
    //             }
    //         }
    //         const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
    //         dataToSend.append('captions', blobPropdata);

    //         _this.sendWLAttachment(_this.account_id, parentUid, dataToSend).then(
    //             () => {
    //                 _this.submitQuestionnaire(parentUid).then(
    //                     () => {
    //                         resolve(true);
    //                     }
    //                 );
    //             }
    //         )
    //     });
    // }
    getAvailableTimeSlots(QStartTime, QEndTime, interval) {
        const _this = this;
        const allSlots = _this.jaldeeTimeService.getTimeSlotsFromQTimings(interval, QStartTime, QEndTime);
        this.availableSlots = allSlots;
        const filter = {};
        const activeSlots = [];
        filter['queue-eq'] = _this.sel_queue_id;
        filter['location-eq'] = _this.sel_loc;
        let future = false;
        const waitlist_date = new Date(this.checkinDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
            future = true;
        }
        this.selectedSlot = '';
        if (!future) {
            _this.subs.sink = _this.provider_services.getTodayWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.selectedSlot = this.availableSlots[0];
                }
            );
        } else {
            filter['date-eq'] = _this.checkinDate;
            _this.subs.sink = _this.provider_services.getFutureWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.selectedSlot = this.availableSlots[0];
                }
            );
        }
    }
    gets3urls() {
        const _this = this;
        _this.loadingS3 = true;
        return new Promise(function (resolve, reject) {
            let accountS3List = 'settings,terminologies,coupon,providerCoupon,businessProfile,departmentProviders';
            _this.subs.sink = _this.s3Processor.getJsonsbyTypes(_this.provider_id,
                null, accountS3List).subscribe(
                    (accountS3s) => {
                        if (accountS3s['settings']) {
                            _this.processS3s('settings', accountS3s['settings']);
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
        });
    }

    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        switch (type) {
            case 'settings': {
                this.settingsjson = result;
                this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
                this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
                break;
            }
            case 'businessProfile': {
                this.businessjson = result;
                this.businessInfo['businessName'] = this.businessjson.businessName;

                if (!this.businessInfo['locationName']) {
                    this.businessInfo['locationName'] = this.businessjson.baseLocation?.place;
                }
                if (!this.businessInfo['googleMapUrl']) {
                    this.businessInfo['googleMapUrl'] = this.businessjson.baseLocation?.googleMapUrl;
                }
                if (this.businessjson['logo']) {
                    this.businessInfo['logo'] = this.businessjson['logo'];
                }
                console.log(this.businessjson)
                if (this.businessjson.uniqueId === 128007) {
                    this.heartfulnessAccount = true;
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
            // case 'coupon': {
            //     if (result != undefined) {
            //         this.s3CouponsList.JC = result;
            //     } else {
            //         this.s3CouponsList.JC = [];
            //     }

            //     if (this.s3CouponsList.JC.length > 0) {
            //         this.showCouponWB = true;
            //     }
            //     break;
            // }
            // case 'providerCoupon': {
            //     if (result != undefined) {
            //         this.s3CouponsList.OWN = result;
            //     } else {
            //         this.s3CouponsList.OWN = [];
            //     }

            //     if (this.s3CouponsList.OWN.length > 0) {
            //         this.showCouponWB = true;
            //     }
            //     break;
            // }
            case 'departmentProviders': {
                let deptProviders: any = [];
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
                if (this.selectedUserId) {
                    this.setUserDetails(this.selectedUserId);
                }
                break;
            }
        }
    }
    handleSideScreen(action) {
        this.action = action;
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
                // this.snackbarService.openSnackBar('Promocode accepted', { 'panelclass': 'snackbarerror' });
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
    checkCouponvalidity() {
        const post_Data = this.generateInputforCheckin();
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
            .subscribe(data => { this.paymentDetails = data; 
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
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
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
        this.checkCouponvalidity()
    }
    getPic(user) {
        if (user.profilePicture) {
            return this.s3Processor.getJson(user.profilePicture)['url'];
        }
        return 'assets/images/img-null.svg';
    }

    applyPromocode() {
        this.action = 'coupons';
        this.selected_coupon = '';
        this.clearCouponErrors();
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
    disableButn() {
        console.log("Calling Disable:", this.checkinDate === this.scheduledWaitlist.date && this.scheduledWaitlist.queue && this.queueId);
        console.log(this.checkinDate);
        console.log(this.scheduledWaitlist.date);
        console.log(this.scheduledWaitlist.queue.id);
        console.log(this.queueId);
        if (this.queuesLoaded && this.checkinDate === this.scheduledWaitlist.date && this.scheduledWaitlist.queue && this.scheduledWaitlist.queue.id === this.queueId) {

            return true;
        } else {
            return false;
        }
    }

    addWaitlistAdvancePayment() {
        this.getCoupons()
        let post_Data = this.generateInputforCheckin();
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
            .subscribe(data => {
                this.paymentDetails = data;
                if (this.paymentDetails && this.paymentDetails.netTotal && this.serviceOptionApptt) {
                    this.serviceTotalPrice = this.lStorageService.getitemfromLocalStorage('serviceTotalPrice');

                    this.total_servicefee = this.paymentDetails.netTotal + this.serviceTotalPrice;
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

                this.shared_services.getConvenientFeeOfProvider(this.account_id, convienientPaymentObj).subscribe((data: any) => {
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
    payuPayment(paymenttype?) {
        this.makeFailedPayment(paymenttype);
    }
    makeFailedPayment(paymentMode) {
        this.waitlistDetails = {
            'amount': this.paymentDetails.amountRequiredNow,
            'paymentMode': null,
            'uuid': this.trackUuid,
            'accountId': this.account_id,
            'purpose': 'prePayment',
        };
        this.waitlistDetails.paymentMode = paymentMode;
        this.waitlistDetails.serviceId = this.selectedServiceId;
        this.waitlistDetails.isInternational = this.isInternatonal;

        if (this.paymentRequestId) {
            this.waitlistDetails['paymentRequestId'] = this.paymentRequestId;
        }
        this.convenientPaymentModes.map((res: any) => {
            this.convenientFeeObj = res
            if (this.convenientFeeObj && this.convenientFeeObj.isInternational && this.isInternatonal) {
                // this.convenientFeeObj = res;
                if (paymentMode === this.convenientFeeObj.mode) {
                    this.waitlistDetails['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
                    this.waitlistDetails['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
                    this.waitlistDetails['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
                    this.waitlistDetails['profileId'] = this.paymentmodes.profileId;
                    this.waitlistDetails['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
                    this.waitlistDetails['paymentGateway'] = this.convenientFeeObj.gateway
                    console.log("Non-Indian Payment Info", this.waitlistDetails)
                }
            }
            if (this.convenientFeeObj && !this.convenientFeeObj.isInternational && !this.isInternatonal) {
                // this.convenientFeeObj = res;
                if (paymentMode === this.convenientFeeObj.mode) {
                    this.waitlistDetails['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
                    this.waitlistDetails['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
                    this.waitlistDetails['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
                    this.waitlistDetails['profileId'] = this.paymentmodes.profileId;
                    this.waitlistDetails['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
                    this.waitlistDetails['paymentGateway'] = this.convenientFeeObj.gateway
                    console.log("Indian Payment Info", this.waitlistDetails)
                }
            }
        })
        this.lStorageService.setitemonLocalStorage('uuid', this.trackUuid);
        this.lStorageService.setitemonLocalStorage('acid', this.account_id);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_c');

        console.log("Payment request :", this.waitlistDetails)
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
                        let multiple;
                        if (this.uuidList.length > 1) {
                            multiple = true;
                        } else {
                            multiple = false;
                        }
                        setTimeout(() => {
                            this.setAnalytics();
                            this.router.navigate(['consumer', 'checkin', 'confirm'], { queryParams: { account_id: this.account_id, uuid: this.uuidList, multiple: multiple } });
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
                    if (pData.isGateWayPaymentNeeded && pData.isJCashPaymentSucess) {
                        if (pData.response.paymentGateway == 'PAYTM') {
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
            this.subs.sink = this.shared_services.consumerPayment(this.waitlistDetails)
                .subscribe((pData: any) => {
                    this.pGateway = pData.paymentGateway;
                    this.paymentRequestId = pData['paymentRequestId'];
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
        pData.paymentMode = this.selected_payment_mode;
        this.razorpayService.initializePayment(pData, this.account_id, this);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.loadingPaytm = true;
        pData.paymentMode = this.selected_payment_mode;
        this.paytmService.initializePayment(pData, accountId, this);
    }
    getImage(url, file) {
        return this.fileService.getImage(url, file);
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
        if (this.type == 'waitlistreschedule' && this.scheduledWaitlist && this.scheduledWaitlist.attchment && this.scheduledWaitlist.attchment[0] && this.scheduledWaitlist.attchment[0].thumbPath) {
            length = length + this.scheduledWaitlist.attchment.length;
        }
        return length;
    }
    actionCompleted() {
        if (this.action !== 'members' && this.action !== 'addmember' && this.action !== 'note' && this.action !== 'attachment' && this.action !== 'coupons') {

        }
        if (this.action === 'members') {
            this.saveMemberDetails();
        } else if (this.action === 'addmember') {
            this.handleSaveMember();
        } else if (this.action === 'note' || this.action === 'attachment') {
            this.goBack();
        } else if (this.action === 'coupons') {
            this.applyCoupons();
        }
        // this.waitlistForPrev = this.waitlist_for;
    }
    popupClosed() {
        if (this.waitlistForPrev && this.waitlistForPrev.length > 0) {
            this.waitlist_for = this.waitlistForPrev;
        }
    }
    getQuestionAnswers(event) {
        this.questionAnswers = event;
        console.log("consCheckin questionnaire :", this.questionAnswers)
    }
    getConsumerQuestionnaire() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const consumerid = (_this.waitlist_for[0].id === _this.parentCustomer.id) ? 0 : _this.waitlist_for[0].id;
            _this.subs.sink = _this.shared_services.getConsumerQuestionnaire(_this.selectedServiceId, consumerid, _this.account_id).subscribe(data => {
                _this.questionnaireList = data;
                _this.questionnaireLoaded = true;

                resolve(true);
            }, () => {
                resolve(false);
            });
        })

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

    setValidateError(errors) {
        this.apiErrors = [];
        if (errors.length > 0) {
            for (let error of errors) {
                this.apiErrors[error.questionField] = [];
                // this.apiError[error.questionField].push(error.error);
            }
            //this.buttonDisable = false;
        }
    }
    successGoback() {
        //this.buttonDisable = false;
        // if (!this.type) {
        //   this.location.back();
        // } 
        // else {
        this.filestoUpload = [];
        // this.editQnr();
        // this.returnAnswers.emit('reload');
        this.questionAnswers.emit('reload');
        // if (this.type !== 'qnr-link') {
        //   this.snackbarService.openSnackBar('Updated Successfully');
        // }
        // }
    }
    //step5
    uploadAudioVideo(data, uuid?) {
        console.log("upload Audio :", data)
        if (data.urls && data.urls.length > 0) {
            let postData = {
                urls: []
            };
            for (const url of data.urls) {
                const file = this.filestoUpload[url.labelName][url.document];
                this.provider_services.videoaudioS3Upload(file, url.url)
                    .subscribe(() => {
                        postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                        if (data.urls.length === postData['urls'].length) {
                            this.shared_services.consumerWaitlistQnrUploadStatusUpdate(this.trackUuid, this.account_id, postData)
                                .subscribe((data) => {
                                    this.successGoback();
                                },
                                    error => {
                                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                        // this.buttonDisable = false;
                                    });
                        }
                    },
                        error => {
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            // this.buttonDisable = false;
                        });
            }
        } else {
            this.successGoback();
        }
    }
    //step4
    resubmitConsumerWaitlistQuestionnaire(body) {
        this.shared_services.resubmitConsumerOrderQuestionnaire(body, this.uuid, this.account_id).subscribe(data => {
            this.uploadAudioVideo(data);
        }, error => {
            // this.buttonDisable = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    }
    submitConsumerWaitlistQuestionnaire(body, uuid?) {
        console.log("submit uuid:", uuid)
        this.shared_services.submitConsumerWaitlistQuestionnaire(body, this.trackUuid, this.account_id).subscribe(data => {
            this.uploadAudioVideo(data, uuid);
        }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    }
    //step3 
    validateConsumerQuestionnaireResubmit(answers, dataToSend, uuid?) {

        this.shared_services.validateConsumerQuestionnaireResbumit(answers, this.account_id).subscribe((data: any) => {
            this.setValidateError(data);
            if (data.length === 0) {
                //if (this.source === 'consOrder') {
                // if (this.qnrStatus === 'submitted') {
                //   this.resubmitConsumerOrderQuestionnaire(dataToSend);
                // } else {
                this.submitConsumerWaitlistQuestionnaire(dataToSend, uuid);
                //  }
                // } 

            }
        }, error => {
            // this.buttonDisable = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    }
    //step2 submitQuestionnaireAnswers()
    submitQuestionnaireAnswers(passData, uuid?) {
        console.log("Submitttttt : ", uuid)
        const dataToSend: FormData = new FormData();
        if (passData && passData.answers) {
            const blobpost_Data = new Blob([JSON.stringify(passData.answers)], { type: 'application/json' });
            dataToSend.append('question', blobpost_Data);
            // this.buttonDisable = true;
            this.validateConsumerQuestionnaireResubmit(passData.answers, dataToSend, uuid);
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
                // step1 submit questionnaire answers!
                //this.submitQuestionnaireAnswers(this.questionAnswers);
                if (data.length === 0) {
                    if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.bookStep++;
                        this.confirmcheckin();
                    }
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }
    viewAttachments() {
        this.action = 'attachment';
        this.modal.nativeElement.click();
    }
    showText() {
        this.readMore = !this.readMore;
    }

    changeJcashUse(event) {
        if (event.checked) {
            this.checkJcash = true;
        } else {
            this.checkJcash = false;
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
    saveMemberDetails() {
        this.resetApiErrors();
        this.emailerror = '';
        this.phoneError = '';
        this.whatsapperror = '';
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
                this.emailerror = "Email is invalid";
                return false;
            } else {
                this.waitlist_for[0]['email'] = this.commObj['communicationEmail'];
            }
        }
        this.getOneTimeInfo(this.waitlist_for[0], this.account_id).then((questions) => {
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
     * 
     * @param commObj 
     */
    setCommunications(commObj) {
        this.commObj = commObj;
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

    /**
     * Method to check privacy policy
     * @param status true/false
     */
    policyApproved(status) {
        this.checkPolicy = status;
    }
    actionPerformed(status) {
        if (!this.serviceOptionApptt) {
            const _this = this;
            if (status === 'success') {
                const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
                _this.initCheckin().then(
                    () => {
                        _this.getOneTimeInfo(activeUser, _this.account_id).then(
                            (questions) => {
                                console.log("Questions:", questions);
                                // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                                if (questions) {
                                    _this.onetimeQuestionnaireList = questions;
                                    if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                                        _this.bookStep = 3;
                                    } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                        _this.bookStep = 4;
                                    } else {
                                        _this.bookStep = 5;
                                        // this.saveCheckin('next');
                                        this.confirmcheckin('next');
                                    }
                                    _this.loggedIn = true;
                                } else {
                                    if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                        _this.bookStep = 4;
                                    } else {
                                        _this.bookStep = 5;
                                        // this.saveCheckin('next');
                                        this.confirmcheckin('next');
                                    }
                                    _this.loggedIn = true;
                                }
                                _this.loading = false;
                            }
                        )
                    }
                );
            }
        }
        else {
            const _this = this;
            if (status === 'success') {
                const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
                _this.initCheckin().then(
                    () => {
                        _this.getOneTimeInfo(activeUser, _this.account_id).then(
                            (questions) => {
                                console.log("Questions:", questions);
                                // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                                if (questions) {
                                    _this.onetimeQuestionnaireList = questions;
                                    if (this.showSlot) {
                                        _this.bookStep = 2;
                                    }
                                    else if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                                        _this.bookStep = 3;
                                    } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                        _this.bookStep = 4;
                                    } else {
                                        _this.bookStep = 5;
                                        // this.saveCheckin('next');
                                        this.confirmcheckin('next');
                                    }
                                    _this.loggedIn = true;
                                } else {
                                    if (this.showSlot) {
                                        _this.bookStep = 2;
                                    }
                                    else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                        _this.bookStep = 4;
                                    } else {
                                        _this.bookStep = 5;
                                        // this.saveCheckin('next');
                                        this.confirmcheckin('next');
                                    }
                                    _this.loggedIn = true;
                                }
                                _this.loading = false;
                            }
                        )
                    }
                );
            }
        }
    }

    // BookStep = 1 --- Date/Time--ServiceName
    // BookStep = 2 --- Virtual Form
    // BookStep = 3 --- Questionaire
    // BookStep = 4 --- Review/Confirm / File / Note
    goToStep(type) {
        const _this = this;
        console.log("BookStep:" + this.bookStep);
        if(this.queuejson && this.queuejson.length <= 0 && this.queuesLoaded){
            this.bookStep = 1;
        }
        if (type === 'next') {
            switch (this.bookStep) {
                case 1: // Date/Time--ServiceName
                    this.authService.goThroughLogin().then((status) => {
                        console.log("Status:", status);
                        if (status) {
                            const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
                            _this.initCheckin().then(
                                (status) => {
                                    _this.getOneTimeInfo(activeUser, _this.account_id).then(
                                        (questions) => {
                                            console.log("Questions:", questions);
                                            // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
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
                                                    this.confirmcheckin('next');
                                                }
                                                _this.loggedIn = true;
                                            } else {
                                                if (this.showSlot) {
                                                    _this.bookStep = 2;
                                                }
                                                else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                                    _this.bookStep = 4;
                                                } else {
                                                    _this.bookStep = 5;
                                                    this.confirmcheckin('next');
                                                }
                                                _this.loggedIn = true;
                                            }
                                            _this.loading = false;
                                        }
                                    )
                                }
                            );
                        } else {
                            _this.loggedIn = false;
                        }
                    });
                    break;
                case 2: // Date/Time--ServiceName
                    this.authService.goThroughLogin().then((status) => {
                        console.log("Status:", status);
                        if (status) {
                            const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
                            _this.initCheckin().then(
                                (status) => {
                                    _this.getOneTimeInfo(activeUser, _this.account_id).then(
                                        (questions) => {
                                            console.log("Questions:", questions);
                                            // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                                            if (questions) {
                                                _this.onetimeQuestionnaireList = questions;
                                                if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                                                    _this.bookStep = 3;
                                                } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                                    _this.bookStep = 4;
                                                } else {
                                                    _this.bookStep = 5;
                                                    this.confirmcheckin('next');
                                                }
                                                _this.loggedIn = true;
                                            } else {
                                                if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                                    _this.bookStep = 4;
                                                } else {
                                                    _this.bookStep = 5;
                                                    this.confirmcheckin('next');
                                                }
                                                _this.loggedIn = true;
                                            }
                                            _this.loading = false;
                                        }
                                    );
                                    this.setAnalytics('dateTime_login');
                                }
                            );
                        } else {
                            _this.loggedIn = false;
                            this.setAnalytics('dateTime_withoutlogin');
                        }
                    });
                    break;
                case 3: //Virtual Fields
                    _this.validateOneTimeInfo();
                    break;
                case 4:
                    this.validateQuestionnaire();
                    break;
                case 5:
                    if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                        return false;
                    }
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
                    } else if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                        _this.bookStep = 3;
                    }
                    else if (this.showSlot) {
                        _this.bookStep = 2;
                    }
                    else {
                        this.bookStep = 1;
                    }
                } else if (this.bookStep === 4) {
                    if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
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
                } else {
                    this.bookStep--;
                }
            }

        } else {
            this.bookStep = type;
        }
        if (this.bookStep === 5) {
            this.confirmcheckin('next');
        }
    }

    getBookStep() {
        console.log("In Get Bookstep");
        if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.bookStep = 4;
        } else {
            this.bookStep = 5;
            this.confirmcheckin();
        }
    }
    goBack(type?) {
        if (type) {
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
    slotSelected(slot) {
        console.log("slotsleected:", slot);
        this.selectedQTime = slot.queueSchedule.timeSlots[0]['sTime'] + ' - ' + slot.queueSchedule.timeSlots[0]['eTime'];
        this.personsAhead = slot.queueSize;
        this.waitingTime = this.dateTimeProcessor.convertMinutesToHourMinute(slot.queueWaitingTime);
        this.serviceTime = slot.serviceTime || '';
        this.queueId = slot.id;
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
            this.shared_services.validateConsumerOneTimeQuestionnaire(dataToSend, this.account_id, this.providerConsumerId).subscribe((data: any) => {
                if (data.length === 0) {
                    this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                this.getBookStep();
                            }
                        })
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    setProviderConsumerList(jaldeeConsumerId, accountId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.shared_services.getProviderCustomerList(jaldeeConsumerId, accountId).subscribe(
                (providerConsumerList: any) => {
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
        console.log("ProviderList:", this.providerConsumerList);
        const _this = this;
        return new Promise(function (resolve, reject) {
            const providerConsumer = _this.providerConsumerList.filter(user => user.firstName === member.firstName && user.LastName === member.LastName);
            console.log("Provider Consumer List:", providerConsumer);
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
                    const providerConsumer_parent = _this.providerConsumerList.filter(user => user.firstName === _this.activeUser.firstName && user.LastName === _this.activeUser.LastName);
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
                            parentId = _this.activeUser.id;
                        }
                    } else {
                        memberId = 0;
                        parentId = _this.activeUser.id;
                    }
                }
                console.log("Call Started");
                _this.shared_services.createProviderCustomer(memberId, parentId, accountId).subscribe(
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
            _this.getProviderCustomerId(user, accountId).then(
                (providerConsumerId) => {
                    _this.providerConsumerId = providerConsumerId;
                    _this.shared_services.getProviderCustomerOnetimeInfo(providerConsumerId, accountId).subscribe(
                        (questions) => {
                            resolve(questions);
                        }, () => {
                            resolve(false);
                        }
                    )
                }
            )
        })
    }
    submitOneTimeInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
          if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
            const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
            const dataToSend: FormData = new FormData();
            if (_this.oneTimeInfo.files) {
              for (const pic of _this.oneTimeInfo.files) {
                dataToSend.append('files', pic, pic['name']);
              }
            }
            const blobpost_Data = new Blob([JSON.stringify(_this.oneTimeInfo.answers)], { type: 'application/json' });
            dataToSend.append('question', blobpost_Data);
            _this.subs.sink = _this.sharedServices.submitCustomerOnetimeInfo(dataToSend, activeUser.id, _this.account_id).subscribe((data: any) => {
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
    setAnalytics(source?) {
        const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');

        let analytics = {
            accId: this.businessjson.id,
            domId: this.businessjson.serviceSector.id,
            subDomId: this.businessjson.serviceSubSector.id
        }
        if (this.customId) {
            
        if (reqFrom && reqFrom == 'cuA') {
                if (source ==='dateTime_login') {
                    analytics['metricId'] = 523;
                } else if (source ==='dateTime_withoutlogin') {
                    analytics['metricId'] = 524;
                } else if (source ==='payment_initiated') {
                    analytics['metricId'] = 528;
                } else if (source ==='payment_completed') {
                    analytics['metricId'] = 531;
                } else {
                    analytics['metricId'] = 504;
                }
                
            } else if (reqFrom && reqFrom == 'CUSTOM_WEBSITE') {
                if (source ==='dateTime_login') {
                    analytics['metricId'] = 525;
                } else if (source ==='dateTime_withoutlogin') {
                    analytics['metricId'] = 526;
                } else if (source ==='payment_initiated') {
                    analytics['metricId'] = 529;
                } else if (source ==='payment_completed') {
                    analytics['metricId'] = 532;
                } else {
                    analytics['metricId'] = 505;
                }                
            } else if (this.customId) { 
                if (source ==='dateTime_login') {
                    analytics['metricId'] = 521;
                } else if (source ==='dateTime_withoutlogin') {
                    analytics['metricId'] = 522;
                } else if (source ==='payment_initiated') {
                    analytics['metricId'] = 527;
                } else if (source ==='payment_completed') {
                    analytics['metricId'] = 530;
                } else {
                    analytics['metricId'] = 503;
                }
            }
            this.sharedServices.updateAnalytics(analytics).subscribe();
        }
    }
}