import { Component, OnInit, Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT, Location } from '@angular/common';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from '../../../../shared/services/windowRef.service';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { PaytmService } from '../../../../shared/services/paytm.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image } from '@ks89/angular-modal-gallery';
import { AuthService } from '../../../../shared/services/auth-service';


@Component({
    selector: 'app-consumer-donation',
    templateUrl: './consumer-donation.component.html',
    styleUrls: ['./consumer-donation.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class ConsumerDonationComponent implements OnInit, OnDestroy {
    customPlainGalleryRowConfig: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.CUSTOM,
        layout: new AdvancedLayout(-1, true)
    };

    select_service_cap = Messages.SELECT_SER_CAP;
    select_deptment_cap = Messages.SELECT_DEPT_CAP;
    no_services_avail_cap = Messages.NO_SER_AVAIL_CAP;
    add_change_member = Messages.ADD_CHANGE_MEMBER;
    date_cap = Messages.DATE_CAP;
    serv_time_window_cap = Messages.SERV_TIME_WINDOW_CAP;
    enter_party_size_cap = Messages.ENTER_PARTY_SIZE;
    have_note_click_here = '';
    not_accepted_for_this_date = Messages.NOT_ACCEPTED_THIS_DATE_CAP;
    service_needs_prepayment = Messages.NEEDS_PREPAYMENT_FOR_CAP;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    no_pay_modes_avail_cap = Messages.NO_PAY_MODES_AVAIL_CAP;
    apply_cap = Messages.APPLY_CAP;
    select_the_cap = Messages.SELECT_THE_CAP;
    member_cap = Messages.MEMBER_CAPTION;
    members_cap = Messages.MEMBERS_CAP;
    for_whom_the_cap = Messages.FOR_WHOM_CAP;
    is_beingmade_cap = Messages.IS_BEING_MADE_CAP;
    add_member_cap = Messages.ADD_MEMBER_CAP;
    for_cap = Messages.FOR_CAP;
    today_cap = Messages.TODAY_CAP;
    persons_ahead_cap = Messages.PERS_AHEAD;
    back_to_cap = Messages.BACK_TO_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    save_member_cap = Messages.SAVE_MEMBER_BTN;
    applied_inbilltime = Messages.APPLIED_INBILLTIME;
    token = Messages.TOKEN;
    get_token_cap;
    domain;
    note_placeholder;
    s3url;
    showCheckin = false;
    api_success = null;
    api_error = null;
    api_cp_error = null;
    partyapi_error = null;
    services: any = [];
    servicesjson: any = [];
    serviceslist: any = [];
    galleryjson: any = [];
    settingsjson: any = [];
    locationjson: any = [];
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    familymembers: any = [];
    partysizejson: any = [];
    sel_loc;
    sel_ser;
    sel_ser_det: any = [];
    prepaymentAmount = 0;
    sel_que;
    search_obj;
    checkinenable = false;
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
    showfuturediv;
    multipleMembers_allowed = false;
    partySize = false;
    partySizeRequired = null;
    maxPartySize = 1;
    revealphonenumber;
    today;
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
    userN = { 'id': 0, 'firstName': 'None', 'lastName': '' };
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    fromKiosk = false;
    customer_data: any = [];
    page_source = null;
    main_heading;
    dispCustomernote = false;
    dispCustomerEmail = false;
    queueQryExecuted = false;
    todaydate;
    estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
    nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
    checkinCaption = Messages.CHECKIN_TIME_CAPTION;
    checkinsCaption = Messages.CHECKINS_TIME_CAPTION;
    checkinLabel;
    CheckedinLabel;
    ddate;
    server_date;
    api_loading1 = true;
    api_loading = false;
    departmentlist: any = [];
    departments: any = [];
    selected_dept;
    selected_user;
    deptLength;
    filterDepart = false;
    confrmshow = false;
    rupee_symbol = '₹';
    userData: any = [];
    userEmail;
    userPhone;
    users = [];
    emailExist = false;
    payEmail = '';
    payEmail1 = '';
    emailerror = null;
    email1error = null;
    phoneerror = '';
    edit = true;
    selected_phone;
    consumerPhoneNo;
    trackUuid;
    source: any = [];
    create_new = false;
    form_data = null;
    donationAmount;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    activeWt;
    searchForm: FormGroup;
    apptTime = '';
    board_count = 0;
    allSlots: any = [];
    availableSlots: any = [];
    data;
    provider_id: any;
    isfirstCheckinOffer: any;
    s3CouponsList: any = [];
    showCouponWB: boolean;
    change_date: any;
    liveTrack = false;
    showAction = false;
    carouselOne;
    notes = false;
    attachments = false;
    action = '';
    showEditView = false;
    slots;
    freeSlots: any = [];
    donorName: any;
    razorModel: Razorpaymodel;
    checkIn_type: any;
    origin: string;
    pGateway: any;
    donorerror = null;
    donorlasterror = null;
    donor = '';
    donorfirst;
    donorlast;
    phoneNumber;
    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    selectedCountry = CountryISO.India;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
    phoneError: string;
    dialCode;
    uid;
    private subs = new SubSink();
    donorFirstName = '';
    donorLastName = '';
    customId: any;
    questionnaireList: any = [];
    questionAnswers;
    bookStep;
    loading = true;
    @ViewChild('closebutton') closebutton;
    accountId;
    readMore = false;
    @ViewChild('consumer_donation') paytmview;
    loadingPaytm = false;
    isClickedOnce = false;
    payment_options: any = [];
    paytmEnabled = false;
    razorpayEnabled = false;
    interNatioanalPaid = false;
    paymentmodes: any;
    from: string;
    indian_payment_modes: any = [];
    non_indian_modes: any = [];
    shownonIndianModes: boolean;
    selected_payment_mode: any;
    isInternatonal: boolean;
    isPayment: boolean;
    theme: any;
    api_loading_video = false;
    disablebutton = false;
    catalogimage_list_popup: Image[];
    image_list_popup: Image[];
    image_list_bool: boolean = false
    pSource;
    deptUsers: any = [];
    showDepartments = false;
    galleryenabledArr = [];
    gallerydisabledArr = [];
    tempgalleryjson: any = [];
    imgLength;
    extra_img_count: number;
    bLogo = '';
    galleryExists = false;
    bgCover: any;
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
    type;
    appointment: any = [];

    noErrorEmail: any
    noErrorName: any
    noErrorPhone: any
    small_device: boolean;
    businessInfo: any = {};
    loggedIn = true;
    from_iOS = false;
    paymentWindow: Window;
    showAdvancedSettings = false;
    tempDonorName: any;
    tempDonorEmail: any;
    tempDonorPh: any;
    tempDonorDetails: any;
    tempErrorDonationAmmount: any
    oneTimeInfo: any;
    onetimeQuestionnaireList;
    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder, public dialog: MatDialog,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        public route: ActivatedRoute,
        public provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        public datastorage: CommonDataStorageService,
        @Inject(DOCUMENT) public document,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        public prefillmodel: RazorpayprefillModel,
        public winRef: WindowRefService,
        private location: Location,
        private s3Processor: S3UrlProcessor,
        private paytmService: PaytmService,
        private cdRef: ChangeDetectorRef,
        private dateTimeProcessor: DateTimeProcessor,
        private ngZone: NgZone,
        private authService: AuthService,
        private activaterouterobj: ActivatedRoute,
        public sharedFunctons: SharedFunctions) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                this.type = params.type;
                if (params.locname) {
                    this.businessInfo['locationName'] = params.locname;
                    this.businessInfo['googleMapUrl'] = params.googleMapUrl;
                }
                // tslint:disable-next-line:radix
                this.sel_loc = parseInt(params.loc_id);
                this.account_id = params.account_id;
                this.accountId = params.accountId;
                this.provider_id = params.unique_id;
                this.sel_ser = JSON.parse(params.service_id);
                if (params.isFrom && params.isFrom == 'providerdetail') {
                    this.from = 'providerdetail';
                }
                this.setSystemDate();
                // this.getConsumerQuestionnaire();
                if (params.customId) {
                    this.customId = params.customId;
                }
                if (params.theme) {
                    this.theme = params.theme;
                }
                // this.action = params.action;
            });
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    goThroughLogin() {
        if (this.lStorageService.getitemfromLocalStorage('reqFrom')) {
            const _this = this;
            console.log("Entered to goThroughLogin Method");
            return new Promise((resolve) => {
                if (_this.lStorageService.getitemfromLocalStorage('pre-header') && _this.lStorageService.getitemfromLocalStorage('authToken')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } else {
            return new Promise((resolve) => {
                const qrpw = this.lStorageService.getitemfromLocalStorage('qrp');
                let qrusr = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
                qrusr = JSON.parse(qrusr);
                if (qrusr && qrpw) {
                    const data = {
                        'countryCode': qrusr.countryCode,
                        'loginId': qrusr.loginId,
                        'password': qrpw,
                        'mUniqueId': null
                    };
                    this.shared_services.ConsumerLogin(data).subscribe(
                        (loginInfo: any) => {
                            this.authService.setLoginData(loginInfo, data, 'consumer');
                            this.lStorageService.setitemonLocalStorage('qrp', data.password);
                            resolve(true);
                        },
                        (error) => {
                            if (error.status === 401 && error.error === 'Session already exists.') {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }
                    );
                } else {
                    resolve(false);
                }
            });
        }
    }
    setSystemDate() {
        this.shared_services.getSystemDate()
            .subscribe(
                res => {
                    this.server_date = res;
                    this.lStorageService.setitemonLocalStorage('sysdate', res);
                });
    }
    initDonation() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.todaydate = _this.dateTimeProcessor.getToday(_this.server_date);
            _this.activaterouterobj.queryParams.subscribe(qparams => {
                console.log('qparams', qparams)
                if (qparams.src) {
                    _this.pSource = qparams.src;
                }
                if (qparams && qparams.theme) {
                    _this.theme = qparams.theme;
                }
                _this.businessjson = [];
                _this.servicesjson = [];
                _this.image_list_popup = [];
                _this.catalogimage_list_popup = [];
                _this.galleryjson = [];
                _this.deptUsers = [];
                if (qparams.psource) {
                    _this.pSource = qparams.psource;
                    if (qparams.psource === 'business') {
                        _this.loading = true;
                        _this.showDepartments = false;
                        setTimeout(() => {
                            _this.loading = false;
                        }, 2500);
                    }
                }
            });
            const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
            if (activeUser) {
                _this.setDonorInfo(activeUser);
            }
            _this.main_heading = _this.checkinLabel; // 'Check-in';
            _this.maxsize = 1;
            _this.step = 1;
            _this.getPaymentModes();
            _this.sharedFunctionobj.getProfile().then(data => {
                _this.setProfileInfo(data);
                _this.getConsumerQuestionnaire().then(
                    (data) => {
                        if (data) {
                            _this.questionnaireList = data;
                        }
                        _this.loading = false;
                        resolve(true);
                    }
                );
            });
        })

    }
    setDonorInfo(customerInfo) {
        this.donorName = this.donor = customerInfo.firstName + ' ' + customerInfo.lastName;
        this.donorFirstName = customerInfo.firstName;
        this.donorLastName = customerInfo.lastName;
        this.donorfirst = customerInfo.firstName;
        this.donorlast = customerInfo.lastName;
    }
    setProfileInfo(data: any) {
        this.userData = data;
        if (this.userData.userProfile !== undefined) {
            this.userEmail = this.userData.userProfile.email || '';
            this.userPhone = this.userData.userProfile.primaryMobileNo || '';
            this.dialCode = this.userData.userProfile.countryCode || '';
            this.consumerPhoneNo = this.userPhone;
        }
        if (this.userEmail) {
            this.emailExist = true;
        } else {
            this.emailExist = false;
        }
    }
    ngOnInit() {
        const _this = this;
        this.server_date = _this.lStorageService.getitemfromLocalStorage('sysdate');
        if (_this.lStorageService.getitemfromLocalStorage('ios')) {
            _this.from_iOS = true;
        }
        _this.gets3curl();
        // _this.gets3curl();
        _this.goThroughLogin().then(
            (status) => {
                console.log("Status:", status);
                if (status) {
                    _this.customer_data = _this.groupService.getitemFromGroupStorage('ynw-user');
                    _this.initDonation().then(
                        (status) => {
                            console.log("init Donation Status1:", status);
                            _this.getOneTimeInfo(_this.account_id).then(
                                (questions) => {
                                    console.log("Questions:", questions);
                                    // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                                    if (questions) {
                                        _this.onetimeQuestionnaireList = questions;
                                        if (_this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0) {
                                            _this.bookStep = 'profile';
                                        } else if (_this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                            _this.bookStep = 'qnr';
                                        } else {
                                            _this.bookStep = 'donation';
                                        }
                                        _this.loggedIn = true;
                                    } else {
                                        if (_this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                            _this.bookStep = 'qnr';
                                        } else {
                                            _this.bookStep = 'donation';
                                        }
                                        _this.loggedIn = true;
                                    }
                                    _this.loading = false;
                                }
                            )
                        }
                    );

                } else {
                    this.loggedIn = false;
                }
            });
    }
    autoGrowTextZone(e) {
        console.log('textarea', e)
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }
    getPaymentModes() {
        this.paytmEnabled = false;
        this.razorpayEnabled = false;
        this.interNatioanalPaid = false;
        this.shared_services.getPaymentModesofProvider(this.account_id, this.sel_ser, 'donation')
            .subscribe(
                data => {
                    this.paymentmodes = data[0];
                    console.log('payment details..', this.paymentmodes)
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
        this.selected_payment_mode = null;
    }
    createForm() {
        this.searchForm = this.fb.group({
            mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
            Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
            first_last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        });
    }
    getFamilyMembers() {
        this.api_loading1 = true;
        let self_obj;
        self_obj = {
            'userProfile': {
                'id': this.customer_data.id,
                'firstName': this.customer_data.firstName,
                'lastName': this.customer_data.lastName
            }
        };
        this.subs.sink = this.shared_services.getConsumerFamilyMembers().subscribe((data: any) => {
            this.familymembers = [];
            this.familymembers.push(self_obj);
            for (const mem of data) {
                if (mem.userProfile.id !== self_obj.userProfile.id) {
                    this.familymembers.push(mem);
                }
            }
            this.api_loading1 = false;
        },
            () => {
                this.api_loading1 = false;
            });
    }
    addDonor() {
        const dnrFirst = this.donorfirst.trim();
        const dnrLast = this.donorlast.trim();
        if (dnrFirst === '') {
            this.donorerror = 'Please enter the first name';
            return;
        } if (dnrLast === '') {
            this.donorlasterror = 'Please enter the last name';
            return;
        }
        // else {
        this.donorFirstName = dnrFirst;
        this.donorLastName = dnrLast;
        setTimeout(() => {
            this.action = '';
        }, 500);
        this.closebutton.nativeElement.click();
        this.donorName = dnrFirst + ' ' + dnrLast;
        // this.donorName = this.donor.trim();
        // }
    }
    addPhone() {
        this.phoneError = '';
        this.resetApiErrors();
        this.resetApi();
        const curphone = this.selected_phone;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const result = pattern.test(curphone);
        const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const result1 = pattern1.test(curphone);
        if (this.selected_phone === '') {
            this.phoneerror = Messages.BPROFILE_PHONENO;
            return;
        } if (!result) {
            this.phoneerror = 'Please enter valid phone number'// Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
            // console.log('Message',Messages.BPROFILE_PRIVACY_PHONE_INVALID)
            return;
        }
        if (!result1) {
            this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
            return;
        }

        {
            this.consumerPhoneNo = this.selected_phone;
            this.userPhone = this.selected_phone;
            this.edit = true;
            setTimeout(() => {
                this.action = '';
            }, 500);
            this.closebutton.nativeElement.click();
        }
    }
    editPhone() {
        this.edit = false;
        this.action = 'phone';
        this.selected_phone = this.userPhone;
    }
    editDonor(email: any, name: any, phone: any) {
        console.log('email', email)
        console.log('donorName', name)
        console.log('userPhone', phone)
        // console.log('Donor first',this.donorfirst)
        this.tempDonorName = 'name' + name;
        this.tempDonorPh = 'phone' + phone;
        this.tempDonorEmail = 'email' + email;

        this.action = 'donor';
        this.edit = false;
        this.action = 'phone';
        this.selected_phone = this.userPhone;

        this.action = 'email';
        this.confrmshow = false;
        this.payEmail = email;
        this.payEmail1 = '';
        // if (this.dispCustomerEmail) {
        //     this.dispCustomerEmail = false;
        // } else {
        //     this.dispCustomerEmail = true;
        // }

    }
    addDonorDetails() {
        if (this.tempDonorDetails.startsWith('f') || this.tempDonorDetails.startsWith('l')) {
            this.addDonor()
        }
        if (this.tempDonorDetails.startsWith('p')) {
            this.addPhone()
        }
        if (this.tempDonorDetails.startsWith('e')) {
            this.addEmail()
        }
        //        else{
        //         setTimeout(() => {
        //             this.action = '';
        //         }, 500);
        //         this.closebutton.nativeElement.click();
        //    }


        // this.addDonor()
        // this.addPhone()
        // this.addEmail()  
    }
    donorDetails(donorDetails: any) {
        console.log('donorDetails...........', donorDetails)
        this.tempDonorDetails = donorDetails
        // if(this.tempDonorDetails!=undefined){
        //     this.tempDonorDetails=donorDetails
        // }
        // else{
        //     this.tempDonorDetails=undefined
        // }

    }
    onButtonBeforeHook() {
    }
    onButtonAfterHook() { }

    setAccountGallery(res) {
        console.log('response.........', res);
        this.galleryenabledArr = []; // For showing gallery
        this.image_list_popup = [];
        this.tempgalleryjson = res;
        if (this.tempgalleryjson.length > 5) {
            this.extra_img_count = this.tempgalleryjson.length - 5;
        }
        let indx = 0;
        if (this.bLogo !== '../../../assets/images/img-null.svg') {
            this.galleryjson[0] = { keyName: 'logo', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
            indx = 1;
        }
        for (let i = 0; i < this.tempgalleryjson.length; i++) {
            this.galleryjson[(i + indx)] = this.tempgalleryjson[i];
        }
        if (this.galleryjson.length > 0) {
            console.log('this.galleryjson', this.galleryjson)
            this.galleryExists = true;
            for (let i = 0; i < this.galleryjson.length; i++) {
                const imgobj = new Image(
                    i,
                    { // modal
                        img: this.galleryjson[i].url,
                        description: this.galleryjson[i].caption || ''
                    });
                // this.image_list_popup.push(imgobj);
                this.image_list_popup.push(imgobj);
            }
            console.log('image_list_popup..', this.image_list_popup)
        }
        this.imgLength = this.image_list_popup.length;
        const imgLength = this.image_list_popup.length > 5 ? 5 : this.image_list_popup.length;
        console.log(imgLength)
        for (let i = 0; i < imgLength; i++) {
            this.galleryenabledArr.push(i);
            console.log("......", this.galleryenabledArr)
        }
    }
    setGalleryNotFound() {
        this.galleryjson = [];
        if (this.bLogo !== '../../../assets/images/img-null.svg') {
            this.galleryExists = true;
            this.image_list_popup = [];
            this.galleryjson[0] = { keyName: 'logo', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
            const imgobj = new Image(0,
                { // modal
                    img: this.galleryjson[0].url,
                    description: this.galleryjson[0].caption || ''
                });
            this.image_list_popup.push(imgobj);
            console.log(this.image_list_popup)
        } else {
            this.bLogo = '../../../assets/images/img-null.svg';
        }
    }
    private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
        return image ? images.indexOf(image) : -1;
    }
    openImageModalRow(image: Image) {
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
        console.log(index)
    }

    openGallery() {
        this.image_list_bool = true
    }
    validateEmail(mail) {
        const emailField = mail;
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(emailField) === false) {
            return false;
        }
        return true;
    }
    resetApiErrors() {
        this.emailerror = null;
        this.email1error = null;
        this.phoneerror = '';
    }
    setServiceDetails(curservid) {
        // let serv;
        // for (let i = 0; i < this.servicesjson.length; i++) {
        //     if (this.servicesjson[i].id === curservid) {
        //         serv = this.servicesjson[i];
        //         break;
        //     }
        // }
        // this.sel_ser_det = [];
        this.sel_ser_det = this.servicesjson.filter(service => service.id === curservid)[0];
        // this.sel_ser_det = serv;
        console.log('donation details.......', this.sel_ser_det);
        if (this.sel_ser_det && this.sel_ser_det['servicegallery']) {
            this.setAccountGallery(this.sel_ser_det.servicegallery)
        }
    }
    showConfrmEmail() {
        this.confrmshow = true;
    }
    handleConsumerNote(vale) {
        this.consumerNote = vale.trim();
    }
    goToGateway() {
        this.isClickedOnce = true;
        this.resetApi();
        if (this.sel_ser) {

        } else {
            this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
            return;
        }
        let paymenttype = this.selected_payment_mode;
        this.donate(paymenttype);
    }
    donate(paymentWay) {
        this.showEditView = false;
        const post_Data = {
            'consumer': {
                'id': this.customer_data.id
            },
            'providerConsumer': {
                'id': this.customer_data.id
            },
            'service': {
                'id': this.sel_ser
            },
            'location': {
                'id': this.sel_loc
            },
            'date': this.todaydate,
            'donationAmount': this.donationAmount,
            'donor': {
                'firstName': this.donorFirstName,
                'lastName': this.donorLastName
            },
            'countryCode': this.dialCode,
            'donorPhoneNumber': this.userPhone,
            'note': this.consumerNote,
            'donorEmail': this.userEmail
        };
        console.log("Donation Data :", post_Data);
        if (this.api_error === null && this.donationAmount) {
            this.addDonationConsumer(post_Data, paymentWay);
        } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar('Please enter valid donation amount', { 'panelClass': 'snackbarerror' });
        }
    }
    addDonationConsumer(post_Data, paymentWay) {
        const _this = this;
        _this.api_loading = true;
        if (_this.from_iOS) {
            _this.shared_services.generateDonationLink(_this.accountId, post_Data).subscribe(
                (paymentLinkResponse: any) => {
                    console.log("Payment Link:", paymentLinkResponse);
                    _this.uid = paymentLinkResponse['uuid'];
                    if (_this.customId) {
                        console.log("businessid" + _this.account_id);
                        _this.shared_services.addProvidertoFavourite(_this.account_id)
                            .subscribe(() => {
                            });
                    }
                    _this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                _this.submitQuestionnaire(_this.uid, post_Data).then(
                                    (status1) => {
                                        if (status1) {
                                            _this.openPaymentLink(_this.customId, post_Data['service'].id, paymentLinkResponse.paylink);
                                        }
                                    });
                            }
                        }
                    )
                },
                error => {
                    _this.isClickedOnce = false;
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        } else {
            const paymentWay = _this.selected_payment_mode;
            console.log("Going to call donation link:", paymentWay);
            _this.subs.sink = _this.shared_services.addCustomerDonation(post_Data, _this.account_id)
                .subscribe(data => {
                    _this.uid = data['uid'];
                    if (_this.customId) {
                        console.log("businessid" + _this.account_id);
                        _this.shared_services.addProvidertoFavourite(_this.account_id)
                            .subscribe(() => {
                            });

                    }
                    _this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                _this.submitQuestionnaire(_this.uid, post_Data).then(
                                    (status1) => {
                                        if (status1) {
                                            _this.consumerPayment(_this.uid, post_Data, paymentWay);
                                        }
                                    });
                            }
                        }
                    )
                    // if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    //     this.submitQuestionnaire(this.uid, post_Data).then(
                    //         (status) => {
                    //             if (status) {

                    //             }
                    //         }
                    //     );
                    // } else {
                    //     this.consumerPayment(this.uid, post_Data, paymentWay);
                    // }
                },
                    error => {
                        _this.isClickedOnce = false;
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
    }
    isDonationSuccess(paylink) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.shared_services.getDonationLinkUuid(paylink).subscribe(
                (donationInfo: any) => {
                    if (donationInfo.donationStatus !== 'PROCESSING') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            )
        })

    }
    openPaymentLink(businessId, serviceId, paylink, userId?) {
        const _this = this;
        const url = projectConstantsLocal.PATH + businessId + "/service/" + serviceId + "/pay/" + paylink;
        this.paymentWindow = window.open(url, "_blank");

        let easingLoop = setInterval(function () {
            _this.isDonationSuccess(paylink).then(
                (status) => {
                    if (status) {
                        clearInterval(easingLoop);
                        _this.paymentWindow.close();
                        _this.isClickedOnce = false;
                    }
                });
        }, 5000);
        // setTimeout(() => {
        //    
        //     
        // }, 5000);
    }

    consumerPayment(uid, post_Data, paymentWay) {
        const payInfo: any = {
            'amount': post_Data.donationAmount,
            'custId': this.customer_data.id,
            'paymentMode': paymentWay,
            'uuid': uid,
            'accountId': this.account_id,
            'source': 'Desktop',
            'purpose': 'donation',
            'serviceId': this.sel_ser
        };
        payInfo.isInternational = this.isInternatonal;
        this.lStorageService.setitemonLocalStorage('uuid', uid);
        this.lStorageService.setitemonLocalStorage('acid', this.account_id);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_d');
        this.subs.sink = this.shared_services.consumerPayment(payInfo)
            .subscribe((pData: any) => {
                this.checkIn_type = 'donations';
                this.origin = 'consumer';
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
                });
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
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.uid, null, this.account_id, null, null, this.customId);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.loadingPaytm = true;
        pData.paymentMode = this.selected_payment_mode;
        this.paytmService.initializePayment(pData, projectConstantsLocal.PAYTM_URL, accountId, this);
    }
    transactionCompleted(response, payload, accountId) {
        if (response.STATUS == 'TXN_SUCCESS') {
            this.paytmService.updatePaytmPay(payload, accountId)
                .then((data) => {
                    if (data) {
                        this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.uid,
                            "details": response
                        };
                        if (this.customId) {
                            queryParams['customId'] = this.customId;
                            if (this.lStorageService.getitemfromLocalStorage('theme')) {
                                queryParams['theme'] = this.lStorageService.getitemfromLocalStorage('theme');
                            }
                        }
                        if (this.from) {
                            queryParams['isFrom'] = this.from;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        this.ngZone.run(() => this.router.navigate(['consumer', 'donations', 'confirm'], navigationExtras));
                    }
                },
                    error => {
                        this.snackbarService.openSnackBar("Transaction Failed", { 'panelClass': 'snackbarerror' });
                    })
        } else if (response.STATUS == 'TXN_FAILURE') {
            this.isClickedOnce = false;
            this.loadingPaytm = false;
            this.cdRef.detectChanges();
            this.ngZone.run(() => {
                const snackBar = this.snackbarService.openSnackBar("Transaction Failed", { 'panelClass': 'snackbarerror' });
                snackBar.onAction().subscribe(() => {
                    snackBar.dismiss();
                })
            });


        }
    }
    getImageSrc(mode) {

        return 'assets/images/payment-modes/' + mode + '.png';
    }
    closeloading() {
        this.isClickedOnce = false;
        this.loadingPaytm = false;
        this.cdRef.detectChanges();
        this.ngZone.run(() => {
            const snackBar = this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
            snackBar.onAction().subscribe(() => {
                snackBar.dismiss();
            })
        });

    }
    onReloadPage() {
        window.location.reload();
    }
    addEmail() {
        this.resetApiErrors();
        this.resetApi();
        const stat = this.validateEmail(this.payEmail);
        const stat1 = this.validateEmail(this.payEmail1);
        if (this.payEmail === '' || !stat) {
            this.emailerror = 'Please enter a valid email.';
        }
        if (this.payEmail1 === '' || !stat1) {
            this.email1error = 'Please enter a valid email.';
        }
        if (stat && stat1) {
            if (this.payEmail === this.payEmail1) {
                this.userEmail = this.payEmail;
                setTimeout(() => {
                    this.action = '';
                }, 500);
                this.closebutton.nativeElement.click();
            } else {
                this.email1error = 'Email and Re-entered Email do not match';
            }
        }
    }
    goBack(type?) {
        console.log(this.bookStep);
        console.log(this.action);
        if (this.action == '') {
            if (this.bookStep === 'donation') {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep = 'qnr';
                } else if (this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0) {
                    this.bookStep = 'profile';
                } else {
                    this.location.back();
                }
            } else if (this.bookStep === 'qnr') {
                if (this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0) {
                    this.bookStep = 'profile';
                } else {
                    this.location.back();
                }
            } else {
                this.location.back();
            }
        } else {
            setTimeout(() => {
                this.action = '';
            }, 500);
            if (this.closebutton) {
                this.closebutton.nativeElement.click();
            }
        }

    }
    handleGoBack(cstep) {
        this.resetApi();
        switch (cstep) {
            case 1:
                this.hideFilterSidebar();
                break;
            case 2:
                if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
                    this.main_heading = this.get_token_cap;
                } else {
                    this.main_heading = this.checkinLabel;
                }
                break;
            case 3:
                this.main_heading = 'Family Members';
                this.showCreateMember = false;
                this.addmemberobj.fname = '';
                this.addmemberobj.lname = '';
                this.addmemberobj.mobile = '';
                this.addmemberobj.gender = '';
                this.addmemberobj.dob = '';
                break;
        }
        this.step = cstep;
        if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
            this.waitlist_for.push({ id: 0, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName, apptTime: this.apptTime });
        }
    }
    showCheckinButtonCaption() {
        let caption = '';
        caption = 'Confirm';
        return caption;
    }
    editClicked() {
        this.showEditView = true;
    }
    resetApi() {
        this.api_error = null;
        this.api_success = null;
    }
    handleReturnDetails(obj) {
        this.resetApi();
        this.addmemberobj.fname = obj.fname || '';
        this.addmemberobj.lname = obj.lname || '';
        this.addmemberobj.mobile = obj.mobile || '';
        this.addmemberobj.gender = obj.gender || '';
        this.addmemberobj.dob = obj.dob || '';
    }
    handleSaveMember() {
        this.resetApi();
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
                    'firstName': this.addmemberobj.fname,
                    'lastName': this.addmemberobj.lname
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
            post_data['parent'] = this.customer_data.id;
            fn = this.shared_services.addMembers(post_data);
            this.subs.sink = fn.subscribe(() => {
                this.api_success = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
                this.getFamilyMembers();
                setTimeout(() => {
                    this.handleGoBack(3);
                }, projectConstants.TIMEOUT_DELAY);
            },
                error => {
                    // this.api_error = error.error;
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADDNOTE_ERROR'));
                });
        } else {
            // this.api_error = derror;
            this.snackbarService.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
        }
    }
    handleNote() {
        if (this.dispCustomernote) {
            this.dispCustomernote = false;
            this.selectedMessage = {
                files: [],
                base64: [],
                caption: []
            };
        } else {
            this.dispCustomernote = true;
        }
    }
    handleEmail(email) {
        this.action = 'email';
        this.confrmshow = false;
        this.payEmail = email;
        this.payEmail1 = '';
    }
    consumerNoteAndFileSave(uuid) {
        const dataToSend: FormData = new FormData();
        dataToSend.append('message', this.consumerNote);
        // const captions = {};
        this.subs.sink = this.shared_services.addConsumerWaitlistNote(this.account_id, uuid,
            dataToSend)
            .subscribe(
                () => {
                },
                error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    gets3curl() {
        this.api_loading1 = true;
        let accountS3List = 'settings,terminologies,businessProfile,gallery,donationServices';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
                (accountS3s: any) => {
                    console.log('accountS3s', accountS3s)
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
                    }
                    if (accountS3s['businessProfile']) {
                        this.processS3s('businessProfile', accountS3s['businessProfile']);
                    }
                    if (accountS3s['gallery']) {
                        this.processS3s('gallery', accountS3s['gallery']);
                    }
                    if (accountS3s['gallery']) {
                        this.processS3s('gallery', accountS3s['gallery']);
                    }
                    if (accountS3s['donationServices']) {
                        this.processS3s('donationServices', accountS3s['donationServices']);
                    }
                    this.api_loading1 = false;
                }
            );
    }
    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        console.log('result....', result)
        switch (type) {
            case 'settings': {
                this.settingsjson = result;
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
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
                break;
            }
            case 'gallery': {
                if (result) {
                    this.setAccountGallery(result);
                }
                break;
            }
            case 'donationServices': {
                this.servicesjson = result;
                if (this.servicesjson.length > 0) {
                    if (!this.sel_ser) {
                        this.sel_ser = this.servicesjson[0].id;
                    }
                    this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                }
                break;
            }
        }
    }
    toggleNotes() {
        this.notes = !this.notes;
    }
    handleSideScreen(action) {
        this.showAction = true;
        this.action = action;
    }
    hideFilterSidebar() {
        this.showAction = false;
        this.payEmail = '';
        this.payEmail1 = '';
    }
    isNumeric(evt) {
        console.log(evt)
        //     var key;
        // key = evt.charCode; 
        // if((key > 47 && key < 58)){
        //     return ((key > 47 && key < 58) );
        // } else{
        //     this.tempErrorDonationAmmount='Please enter valid ammount '

        // }
        // if(evt.charCode<58 && evt.charCode>47 ){
        //     this.tempErrorDonationAmmount=''
        //     return this.sharedFunctionobj.isNumeric(evt);
        // }else{

        // }
        return this.sharedFunctionobj.isNumeric(evt);
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
        const servicedialogRef = this.dialog.open(ServiceDetailComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
            disableClose: true,
            data: servData
        });
        servicedialogRef.afterClosed().subscribe(() => {
        });
    }
    changeService() {
        this.action = 'service';
    }
    getConsumerQuestionnaire() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.getDonationQuestionnaire(_this.sel_ser, _this.account_id).subscribe(data => {
                resolve(data);
            }, () => {
                resolve(false);
            });
        })
    }
    getQuestionAnswers(event) {
        this.questionAnswers = event;
    }
    submitQuestionnaire(uuid, post_Data) {
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
                _this.shared_services.submitDonationQuestionnaire(uuid, dataToSend, _this.account_id).subscribe((data: any) => {
                    let postData = {
                        urls: []
                    };
                    if (data.urls && data.urls.length > 0) {
                        for (const url of data.urls) {
                            const file = _this.questionAnswers.filestoUpload[url.labelName][url.document];
                            _this.provider_services.videoaudioS3Upload(file, url.url)
                                .subscribe(() => {
                                    postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                                    if (data.urls.length === postData['urls'].length) {
                                        _this.shared_services.consumerDonationQnrUploadStatusUpdate(uuid, _this.account_id, postData)
                                            .subscribe((data) => {
                                                _this.api_loading_video = true;
                                                // this.paymentOperation(paymenttype);
                                                // this.consumerPayment(this.uid, post_Data, paymentWay);
                                                resolve(true);
                                                _this.api_loading_video = false;
                                            },
                                                error => {
                                                    _this.isClickedOnce = false;
                                                    _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                                    _this.disablebutton = false;
                                                    _this.api_loading_video = false;
                                                    resolve(false);
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
                        // this.consumerPayment(this.uid, post_Data, paymentWay);
                        resolve(true);
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        this.disablebutton = false;
                        this.api_loading_video = false;
                        resolve(false);
                    });
            } else {
                resolve(true);
            }
        })
    }
    goToStep(type) {
        if (this.bookStep === 'profile') {
            this.validateOneTimeInfo();
        }
        if (this.bookStep === 'qnr') {
            this.validateQuestionnaire();
        } else {
            this.bookStep = type;
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
                    this.bookStep = 'donation';
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
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

            // const questions = this.oneTimeInfo.answers.answerLine.map(function (a) { return a.labelName; })

            
            // const dataToSend: FormData = new FormData();
            // const answer = new Blob([JSON.stringify(this.oneTimeInfo.answers)], { type: 'application/json' });
            // // const question = new Blob([JSON.stringify(questions)], { type: 'application/json' });
            // dataToSend.append('answer', answer);
            // dataToSend.append('question', questions);
            // this.shared_services.validateConsumerOneTimeQuestionnaire(dataToSend, this.account_id).subscribe((data: any) => {
                this.shared_services.validateConsumerQuestionnaire(this.oneTimeInfo.answers, this.account_id).subscribe((data: any) => {
            // if (data.length === 0) {
                    this.getBookStep('profile');
                // }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    getBookStep(curStep) {
        if (curStep === 'profile') {
            if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                this.bookStep = 'qnr';
            } else {
                this.bookStep = 'donation';
            }
        }
    }
    resetErrors() {
        this.donorerror = null;
        this.donorlasterror = null;
    }
    showText() {
        this.readMore = !this.readMore;
    }
    actionPerformed(status) {
        const _this = this;
        if (status === 'success') {
            this.loggedIn = true;
            _this.customer_data = _this.groupService.getitemFromGroupStorage('ynw-user');
            this.initDonation().then(
                (status) => {
                    console.log("init Donation Status:", status);
                    _this.getOneTimeInfo(_this.account_id).then(
                        (questions) => {
                            _this.onetimeQuestionnaireList = questions;
                            console.log("Questions:", questions);
                            // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                            // if (_this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels > 0) {

                            if (_this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0) {
                                _this.bookStep = 'profile';
                            } else if (_this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                _this.bookStep = 'qnr';
                            } else {
                                _this.bookStep = 'donation';
                            }
                            _this.loggedIn = true;
                            // } else {
                            //     if (_this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                            //         _this.bookStep = 'qnr';
                            //     } else {
                            //         _this.bookStep = 'donation';
                            //     }
                            //     _this.loggedIn = true;
                            // }
                            _this.loading = false;
                        }
                    )
                }
            );
        }
    }

    getOneTimeInfo(accountId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.shared_services.getCustomerOnetimeInfo(accountId).subscribe(
                (questions) => {
                    resolve(questions);
                    // resolve({"questionnaireId":"WalkinConsumer","id":7,"proConId":0,"labels":[{"transactionType":"CONSUMERCREATION","transactionId":0,"channel":"ANY","questionnaireId":"WalkinConsumer","questions":[{"id":16,"labelName":"General Health1","sequnceId":"1","fieldDataType":"number","fieldScope":"consumer","label":"How healthy do you consider yourself on a scale of 1 to 10?","labelValues":"5.0","numberPropertie":{"start":1,"end":10,"minAnswers":1,"maxAnswers":1},"billable":false,"mandatory":true,"scopTarget":{"target":[{"targetUser":"PROVIDER"},{"targetUser":"CONSUMER"}]},"sectionName":"sectionname1","sectionOrder":0},{"id":17,"labelName":"General Health2","sequnceId":"2","fieldDataType":"plainText","fieldScope":"consumer","label":"How often do you get a health checkup?","labelValues":"Once a year","hint":"Once in 6 months, Once a year","plainTextPropertie":{"minNoOfLetter":20,"maxNoOfLetter":100},"billable":false,"mandatory":true,"scopTarget":{"target":[{"targetUser":"PROVIDER"},{"targetUser":"CONSUMER"}]},"sectionName":"sectionname1","sectionOrder":1},{"id":18,"labelName":"General Health3","sequnceId":"3","fieldDataType":"bool","fieldScope":"consumer","label":"Do you have any chronic diseases?","labelValues":["Yes","No"],"billable":false,"mandatory":false,"scopTarget":{"target":[{"targetUser":"PROVIDER"},{"targetUser":"CONSUMER"}]},"sectionName":"sectionname1","sectionOrder":1},{"id":19,"labelName":"General Health4","sequnceId":"4","fieldDataType":"plainText","fieldScope":"consumer","label":"Do you have any hereditary conditions/diseases?","labelValues":"no","hint":"Diabetes, Hemophilia","plainTextPropertie":{"minNoOfLetter":20,"maxNoOfLetter":100},"billable":false,"mandatory":true,"scopTarget":{"target":[{"targetUser":"PROVIDER"},{"targetUser":"CONSUMER"}]},"sectionName":"sectionname2","sectionOrder":2},{"id":20,"labelName":"General Health5","sequnceId":"5","fieldDataType":"plainText","fieldScope":"consumer","label":"Are you habitual to nicotine, drugs or alcohol?","labelValues":"no","hint":"Smoking, Alcohol drinking","plainTextPropertie":{"minNoOfLetter":20,"maxNoOfLetter":100},"billable":false,"mandatory":true,"scopTarget":{"target":[{"targetUser":"PROVIDER"},{"targetUser":"CONSUMER"}]},"sectionName":"sectionname2","sectionOrder":2}]}]})
                }, () => {
                    resolve(false);
                }
            )
        })
    }
    getOneTimeQuestionAnswers(event) {
        this.oneTimeInfo = event;
        console.log("OneTimeInfo:", this.oneTimeInfo);
    }
    submitOneTimeInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0) {
                const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
                const dataToSend: FormData = new FormData();
                if (_this.oneTimeInfo.files) {
                    for (const pic of _this.oneTimeInfo.files) {
                        dataToSend.append('files', pic, pic['name']);
                    }
                }
                const blobpost_Data = new Blob([JSON.stringify(_this.oneTimeInfo.answers)], { type: 'application/json' });
                dataToSend.append('question', blobpost_Data);
                _this.subs.sink = _this.shared_services.submitCustomerOnetimeInfo(dataToSend, activeUser.id,_this.account_id).subscribe((data: any) => {
                    // let postData = {
                    //     urls: []
                    // };
                    // if (data.urls && data.urls.length > 0) {
                    //     for (const url of data.urls) {
                    //         this.api_loading_video = true;
                    //         const file = _this.oneTimeInfo.filestoUpload[url.labelName][url.document];
                    //         _this.provider_services.videoaudioS3Upload(file, url.url)
                    //             .subscribe(() => {
                    //                 postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                    //                 if (data.urls.length === postData['urls'].length) {
                    //                     this.shared_services.consumerApptQnrUploadStatusUpdate(uuid, this.account_id, postData)
                    //                         .subscribe((data) => {
                    //                             this.paymentOperation(paymenttype);
                    //                         },
                    //                             error => {
                    //                                 this.isClickedOnce = false;
                    //                                 this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    //                                 this.disablebutton = false;
                    //                                 this.api_loading_video = false;
                    //                             });
                    //                 }
                    //             },
                    //                 error => {
                    //                     this.isClickedOnce = false;
                    //                     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    //                     this.disablebutton = false;
                    //                     this.api_loading_video = false;
                    //                 });
                    //     }
                    // }
                    resolve(true);
                },
                    error => {
                        _this.isClickedOnce = false;
                        _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        _this.disablebutton = false;
                        resolve(false);
                        // this.api_loading_video = false;
                    });
            } else {
                resolve(true);
            }
        });
    }
}
