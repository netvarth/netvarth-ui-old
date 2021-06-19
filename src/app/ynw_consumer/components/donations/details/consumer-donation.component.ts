import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT, Location } from '@angular/common';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
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
@Component({
    selector: 'app-consumer-donation',
    templateUrl: './consumer-donation.component.html',
    styleUrls: ['./consumer-donation.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class ConsumerDonationComponent implements OnInit, OnDestroy {

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
    CweekDays = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
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
    // breadcrumbs;
    // breadcrumb_moreoptions: any = [];
    showEditView = false;
    slots;
    freeSlots: any = [];
    donorName: any;
    razorModel: Razorpaymodel;
    checkIn_type: any;
    origin: string;
    pGateway: any;
    donorerror = null;
    donor = '';
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
    bookStep = 'donation';
    loading = true;
    @ViewChild('closebutton') closebutton;
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
        private s3Processor: S3UrlProcessor) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                // tslint:disable-next-line:radix
                this.sel_loc = parseInt(params.loc_id);
                this.account_id = params.account_id;
                this.provider_id = params.unique_id;
                this.sel_ser = JSON.parse(params.service_id);
                this.getConsumerQuestionnaire();
                if (params.customId) {
                    this.customId = params.customId;
                }

                // this.action = params.action;
            });
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    ngOnInit() {
        this.getServicebyLocationId(this.sel_loc);
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        // this.api_loading = false;
        if (activeUser) {
            this.customer_data = activeUser;
        }
        this.donorName = this.donor = this.customer_data.firstName + ' ' + this.customer_data.lastName;
        this.donorFirstName = this.customer_data.firstName;
        this.donorLastName = this.customer_data.lastName;
        this.main_heading = this.checkinLabel; // 'Check-in';
        this.maxsize = 1;
        this.step = 1;
        this.getProfile();
        this.gets3curl();
        this.getFamilyMembers();
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.today = new Date(this.today);
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
        this.waitlist_for.push({ id: 0, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName, apptTime: this.apptTime });
        // this.minDate = this.todaydate;
        // const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        // const ddd = new Date(day);
        // this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
        // this.hold_sel_checkindate = this.sel_checkindate;
        // this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
        this.revealphonenumber = true;
    }
    createForm() {
        this.searchForm = this.fb.group({
            mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
            Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
            first_last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        });
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.subs.sink = _this.provider_services.getWaitlistMgr()
                .subscribe(
                    data => {
                        _this.settingsjson = data;
                        resolve();
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
            _this.subs.sink = _this.provider_services.getBussinessProfile()
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
        const dnr = this.donor.trim();
        if (dnr === '') {
            this.donorerror = 'Please enter the donor name';
            return;
        } else {
            this.donorFirstName = dnr;
            this.donorLastName = ''; 
            this.closebutton.nativeElement.click();
            this.action = '';
            this.donorName = this.donor.trim();
        }
    }
    addPhone() {
        this.phoneError = '';
        if (this.selected_phone) {
            const pN = this.selected_phone.e164Number;
            this.dialCode = this.selected_phone.dialCode;
            if (pN.startsWith(this.dialCode)) {
                this.selected_phone = pN.split(this.dialCode)[1];
            }
        }
        this.resetApiErrors();
        this.resetApi();
        const curphone = this.selected_phone;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const result = pattern.test(curphone);
        if (this.selected_phone === null) {
            this.phoneerror = 'Please enter the mobile number';
            return;
        } else if (!result) {
            this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
            return;
        } else {
            this.consumerPhoneNo = this.selected_phone;
            this.userPhone = this.selected_phone;
            this.edit = true; 
            this.closebutton.nativeElement.click();
            this.action = '';
        }
    }
    editPhone() {
        this.edit = false;
        this.action = 'phone';
        this.selected_phone = this.userPhone;
    }
    editDonor() {
        this.action = 'donor';
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
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                break;
            }
        }
        this.sel_ser_det = [];
        this.sel_ser_det = serv;
    }
    handleServiceSel(obj) {
        // this.sel_ser = obj.id;
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        this.resetApi();
    }
    showConfrmEmail(event) {
        if (event.key !== 'Enter') {
            this.confrmshow = true;
        }
    }
    isSelectedService(id) {
        let clr = false;
        if (id === this.sel_ser) {
            clr = true;
        } else {
            clr = false;
        }
        return clr;
    }
    revealChk() {
        this.revealphonenumber = !this.revealphonenumber;
    }
    handleConsumerNote(vale) {
        this.consumerNote = vale.trim();
    }
    handleServiceForWhom() {
        this.resetApi();
        this.holdwaitlist_for = this.waitlist_for;
        this.step = 3;
        this.main_heading = 'Family Members';
    }
    // donateClicked() {

    // }
    payuPayment() {
        this.resetApi();
        if (this.sel_ser) {

        } else {
            this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
            return;
        }
        let paymentWay;
        paymentWay = 'DC';
        this.donate(paymentWay);
    }
    paytmPayment() {
        this.resetApi();
        if (this.sel_ser) {

        } else {
            this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
            return;
        }
        let paymentWay;
        paymentWay = 'PPI';
        this.donate(paymentWay);
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
        // if (this.userData.userProfile.email === this.payEmail) {
        //     post_Data['donorEmail'] = this.userData.userProfile.email;
        // }else {
        //     post_Data['donorEmail'] = this.payEmail;
        // }
        if (this.api_error === null && this.donationAmount) {
            this.addDonationConsumer(post_Data, paymentWay);
        } else {
            this.snackbarService.openSnackBar('Please enter valid donation amount', { 'panelClass': 'snackbarerror' });
        }
    }
    addDonationConsumer(post_Data, paymentWay) {
        this.api_loading = true;
        this.subs.sink = this.shared_services.addCustomerDonation(post_Data, this.account_id)
            .subscribe(data => {
                this.uid = data['uid'];
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.submitQuestionnaire(this.uid, post_Data, paymentWay);
                } else {
                    this.consumerPayment(this.uid, post_Data, paymentWay);
                }
            },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    consumerPayment(uid, post_Data, paymentWay) {
        const payInfo = {
            'amount': post_Data.donationAmount,
            'custId': this.customer_data.id,
            'paymentMode': paymentWay,
            'uuid': uid,
            'accountId': this.account_id,
            'source': 'Desktop',
            'purpose': 'donation'
        };
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
                        this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                        setTimeout(() => {
                            if (paymentWay === 'DC') {
                                this.document.getElementById('payuform').submit();
                            } else {
                                this.document.getElementById('paytmform').submit();
                            }
                        }, 2000);
                    } else {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                    }
                }
            },
                error => {
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
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.uid, null, this.account_id, null, null, this.customId);
    }
    addEmail() {
        this.resetApiErrors();
        this.resetApi();
        let post_data;
        let passtyp;
        const stat = this.validateEmail(this.payEmail);
        const stat1 = this.validateEmail(this.payEmail1);
        if (this.payEmail === '' || !stat) {
            this.emailerror = 'Please enter a valid email.';
        }
        if (this.payEmail1 === '' || !stat1) {
            this.email1error = 'Please enter a valid email.';
        }
        // return new Promise((resolve) => {
        if (stat && stat1) {
            if (this.payEmail === this.payEmail1) {
                post_data = {
                    'id': this.userData.userProfile.id || null,
                    'firstName': this.userData.userProfile.firstName || null,
                    'lastName': this.userData.userProfile.lastName || null,
                    'dob': this.userData.userProfile.dob || null,
                    'gender': this.userData.userProfile.gender || null,
                    'email': this.payEmail || ''
                };
                passtyp = 'consumer';
                if (this.payEmail) {
                    this.subs.sink = this.shared_services.updateProfile(post_data, passtyp)
                        .subscribe(
                            () => {
                                this.getProfile();
                                // this.hideFilterSidebar();
                                this.closebutton.nativeElement.click();
                                this.action = '';
                            },
                            error => {
                                this.api_error = error.error;
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            });
                }
            } else {
                this.email1error = 'Email and Re-entered Email do not match';
                // this.snackbarService.openSnackBar(this.email1error, { 'panelClass': 'snackbarerror' });
            }
        }
    }
    goBack(type?) {
        if (type) {
            if (this.bookStep === 'qnr') {
                this.location.back();
            } else {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep = 'qnr';
                } else {
                    this.location.back();
                }
            }
        }
        if (this.action === '') {
            this.location.back();
        } else {
            setTimeout(() => {
                this.action = '';
            }, 500);
            this.closebutton.nativeElement.click();
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
    handleOneMemberSelect(id, firstName, lastName) {
        this.resetApi();
        this.waitlist_for = [];
        this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.apptTime });
    }
    handleMemberSelect(id, firstName, lastName, obj) {
        this.resetApi();
        if (this.waitlist_for.length === 0) {
            this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.apptTime });
        } else {
            let exists = false;
            let existindx = -1;
            for (let i = 0; i < this.waitlist_for.length; i++) {
                if (this.waitlist_for[i].id === id) {
                    exists = true;
                    existindx = i;
                }
            }
            if (exists) {
                this.waitlist_for.splice(existindx, 1);
            } else {
                if (this.ismoreMembersAllowedtopush()) {
                    this.waitlist_for.push({ id: id, lastName: lastName, firstName: firstName, apptTime: this.apptTime });
                } else {
                    obj.source.checked = false; // preventing the current checkbox from being checked
                    if (this.maxsize > 1) {
                        // this.api_error = 'Only ' + this.maxsize + ' member(s) can be selected';
                        this.snackbarService.openSnackBar('Only ' + this.maxsize + ' member(s) can be selected', { 'panelClass': 'snackbarerror' });

                    } else if (this.maxsize === 1) {
                        // this.api_error = 'Only ' + this.maxsize + ' member can be selected';
                        this.snackbarService.openSnackBar('Only ' + this.maxsize + ' member can be selected', { 'panelClass': 'snackbarerror' });
                    }
                }
            }
        }
    }
    ismoreMembersAllowedtopush() {
        if (this.maxsize > this.waitlist_for.length) {
            return true;
        } else {
            return false;
        }
    }
    isChecked(id) {
        let retval = false;
        if (this.waitlist_for.length > 0) {
            for (let i = 0; i < this.waitlist_for.length; i++) {
                if (this.waitlist_for[i].id === id) {
                    retval = true;
                }
            }
        }
        return retval;
    }
    addMember() {
        this.resetApi();
        this.showCreateMember = true;
        // this.step = 4; // show add member section
        // this.main_heading = 'Add Family Member';
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
    // handleEmail() {
    //     if (this.dispCustomerEmail) {
    //         this.dispCustomerEmail = false;
    //     } else {
    //         this.dispCustomerEmail = true;
    //     }
    // }
    handleEmail(email) {
        this.action = 'email';
        this.confrmshow = false;
        this.payEmail= email;
        // if (this.dispCustomerEmail) {
        //     this.dispCustomerEmail = false;
        // } else {
        //     this.dispCustomerEmail = true;
        // }
    }
    clearerrorParty() {
        this.partyapi_error = '';
    }
    getServicebyLocationId(locid) {
        this.api_loading1 = true;
        this.resetApi();
        this.subs.sink = this.shared_services.getConsumerDonationServices(this.account_id)
            .subscribe(data => {
                this.servicesjson = data;
                this.serviceslist = data;
                this.sel_ser_det = [];
                if (this.servicesjson.length > 0) {
                    // this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                    this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.sel_ser = '';
                });
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
    getProfile() {
        this.sharedFunctionobj.getProfile()
            .then(
                data => {
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
                });
    }
    gets3curl() {
        this.api_loading1 = true;
        let accountS3List = 'settings,terminologies,businessProfile';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
                (accountS3s) => {
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
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
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                break;
            }
            case 'businessProfile': {
                this.businessjson = result;
                break;
            }
            // case 'coupon': {
            //     this.s3CouponsList.JC = result;
            //     if (this.s3CouponsList.JC.length > 0) {
            //         this.showCouponWB = true;
            //     }
            //     break;
            // }
            // case 'providerCoupon': {
            //     this.s3CouponsList.OWN = result;
            //     if (this.s3CouponsList.OWN.length > 0) {
            //         this.showCouponWB = true;
            //     }
            //     break;
            // }
            // case 'departmentProviders': {
            //     let deptProviders: any = [];
            //     deptProviders = result;
            //     if (!this.filterDepart) {
            //         this.users = deptProviders;
            //     } else {
            //         deptProviders.forEach(depts => {
            //             if (depts.users.length > 0) {
            //                 this.users = this.users.concat(depts.users);
            //             }
            //         });
            //     }
            //     if (this.selectedUserParam) {
            //         this.setUserDetails(this.selectedUserParam);
            //     }
            //     break;
            // }
        }
    }
    // gets3curl() {
    //     this.api_loading1 = true;
    //     this.retval = this.sharedFunctionobj.getS3Url()
    //         .then(
    //             res => {
    //                 this.s3url = res;
    //                 this.getbusinessprofiledetails_json('businessProfile', true);
    //                 this.getbusinessprofiledetails_json('settings', true);
    //                 this.getbusinessprofiledetails_json('coupon', true);
    //                 if (!this.terminologiesjson) {
    //                     this.getbusinessprofiledetails_json('terminologies', true);
    //                 } else {
    //                     if (this.terminologiesjson.length === 0) {
    //                         this.getbusinessprofiledetails_json('terminologies', true);
    //                     } else {
    //                         // this.datastorage.set('terminologies', this.terminologiesjson);
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
    // getbusinessprofiledetails_json(section, modDateReq: boolean) {
    //     let UTCstring = null;
    //     if (modDateReq) {
    //         UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    //     }
    //     this.subs.sink=this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
    //         .subscribe(res => {
    //             switch (section) {
    //                 case 'settings':
    //                     this.settingsjson = res;
    //                     break;
    //                 case 'terminologies':
    //                     this.terminologiesjson = res;
    //                     // this.datastorage.set('terminologies', this.terminologiesjson);
    //                     this.wordProcessor.setTerminologies(this.terminologiesjson);
    //                     break;
    //                 case 'businessProfile':
    //                     this.businessjson = res;
    //                     break;
    //                 case 'coupon':
    //                     this.s3CouponsList = res;
    //                     if (this.s3CouponsList.length > 0) {
    //                         this.showCouponWB = true;
    //                     }
    //                     break;
    //             }
    //         },
    //             () => {
    //             }
    //         );
    // }
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
        this.subs.sink = this.shared_services.getDonationQuestionnaire(this.sel_ser, this.account_id).subscribe(data => {
            this.questionnaireList = data;
            if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                this.bookStep = 'qnr';
            }
            this.loading = false;
        });
    }
    getQuestionAnswers(event) {
        this.questionAnswers = event;
    }
    submitQuestionnaire(uuid, post_Data, paymentWay) {
        const dataToSend: FormData = new FormData();
        if (this.questionAnswers.files) {
            for (const pic of this.questionAnswers.files) {
                dataToSend.append('files', pic, pic['name']);
            }
        }
        const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        this.shared_services.submitDonationQuestionnaire(uuid, dataToSend, this.account_id).subscribe(data => {
            this.consumerPayment(this.uid, post_Data, paymentWay);
        },
            error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
    }
    goToStep(type) {
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
}
