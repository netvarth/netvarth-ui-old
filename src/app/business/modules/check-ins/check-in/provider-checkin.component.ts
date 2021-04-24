import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import * as moment from 'moment';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { JaldeeTimeService } from '../../../../shared/services/jaldee-time-service';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-provider-checkin',
    templateUrl: './provider-checkin.component.html',
    styleUrls: ['../../../../../assets/css/style.bundle.css']
})
export class ProviderCheckinComponent implements OnInit {
    checkinSubscribtion: Subscription;
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
    create_cap = Messages.CREATE_CAP;
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
    addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '', 'jaldeeid': '' };
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    dobFormat = projectConstants.DATE_MM_DD_YY_FORMAT;
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
    api_loading = true;
    departmentlist: any = [];
    departments: any = [];
    selected_dept;
    selected_user;
    deptLength;
    filterDepart = false;
    confrmshow = false;
    userData: any = [];
    userEmail;
    userPhone;
    emailExist = false;
    payEmail;
    payEmail1;
    emailerror = null;
    email1error = null;
    phoneerror = null;
    edit = true;
    selected_phone;
    consumerPhoneNo;
    trackUuid;
    create_new = false;
    form_data = null;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    breadcrumbs;
    breadcrumb_moreoptions: any = [];
    activeWt;
    searchForm: FormGroup;
    apptTime: any;
    board_count = 0;
    allSlots: any = [];
    availableSlots: any = [];
    selectedMode: any = 'phone';
    customer_label = '';
    qParams = {};
    action: any = '';
    showAction = false;
    carouselOne;
    notes = false;
    attachments = false;
    users = [];
    userN = { 'id': 0, 'firstName': Messages.NOUSERCAP, 'lastName': '' };
    customerid: any;
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    showInputSection = false;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    checkinType;
    selectedUser;
    wtsapmode: any;
    chekin_title: string;
    is_wtsap_empty = false;
    calculationMode: any;
    showtoken: any;
    selectDept;
    selectUser;
    accountType;
    disable = false;
    settings: any = [];
    showTokenId;
    note_cap = 'Add Note';
    thirdParty = '';
    thirdPartyList = {
        'practo': 'Practo',
        'google': 'Google',
        'justdial': 'Justdial',
        'mfine': 'MFine'
    };
    showOther = false;
    otherThirdParty = '';
    thirdparty_error = null;
    jld;
    customidFormat: any;
    heading = '';
    jaldeeId;
    availableDates: any = [];
    showBlockHint = false;
    uid;
    source;
    virtualServicemode;
    virtualServicenumber;
    emptyFielderror = false;
    countryCode;
    checkin_label;
    provider_label = '';
    showQuestionnaire = false;
    questionnaireList: any = [];
    channel;
    questionAnswers;
    bookingMode;
    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        private dialog: MatDialog,
        private activated_route: ActivatedRoute,
        public provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        private dateTimeProcessor: DateTimeProcessor,
        private jaldeeTimeService: JaldeeTimeService,
        private lStorageService: LocalStorageService,
        private providerService: ProviderServices) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.source) {
                this.source = qparams.source;
            }
            if (qparams.serviceId) {
                this.sel_ser = qparams.serviceId;
            }
            if (qparams.waitlistMode) {
                this.bookingMode = qparams.waitlistMode;
                this.channel = (this.bookingMode === 'PHONE_CHECKIN') ? 'PHONEIN' : 'WALKIN';
            }
            if (qparams.uid) {
                this.uid = qparams.uid;
            }
            if (qparams.virtualServicemode) {
                this.virtualServicemode = qparams.virtualServicemode;
            }
            if (qparams.uid) {
                this.virtualServicenumber = qparams.virtualServicenumber;
            }
            if (qparams.checkin_type) {
                this.checkinType = qparams.checkin_type;
                if (this.checkinType === 'PHONE_CHECKIN') {
                    this.chekin_title = 'Phone-in';
                } else {
                    this.chekin_title = 'Walk-ins';
                }
                this.channel = (this.checkinType === 'PHONE_CHECKIN') ? 'PHONEIN' : 'WALKIN';
            }
            if (qparams.calmode) {
                this.calculationMode = qparams.calmode;
            }
            if (qparams.showtoken) {
                this.showtoken = JSON.parse(qparams.showtoken);
            }
            if (qparams.deptId) {
                this.selectDept = JSON.parse(qparams.deptId);
            }
            if (qparams.userId) {
                this.selectUser = JSON.parse(qparams.userId);
            }
            if (qparams.thirdParty) {
                this.thirdParty = qparams.thirdParty;
            }
            if (this.showtoken) {
                this.breadcrumbs = [
                    {
                        title: 'New Token',
                        url: 'provider/check-ins'
                    },
                    {
                        title: this.chekin_title
                    }
                ];
                this.heading = 'Create a Token';
            } else {
                this.breadcrumbs = [
                    {
                        title: 'New Check-in',
                        url: 'provider/check-ins'
                    },
                    {
                        title: this.chekin_title
                    }
                ];
                this.heading = 'Create a Check-in';
            }
            if (this.source === 'waitlist-block') {
                // this.heading = 'Find a ' + this.customer_label;
                this.heading = 'Create a ' + this.customer_label;
            }
            if (qparams.ph || qparams.id) {
                const filter = {};
                if (qparams.ph) {
                    filter['phoneNo-eq'] = qparams.ph;
                }
                // if (qparams.haveMobile && qparams.haveMobile === 'false') {
                //     filter['id-eq'] = qparams.id;
                // }
                if (qparams.id) {
                    filter['id-eq'] = qparams.id;
                }
                this.api_loading1 = true;
                this.provider_services.getProviderCustomers(filter).subscribe(
                    (data: any) => {
                        if (data.length > 1) {
                            const customer = data.filter(member => !member.parent);
                            this.customer_data = customer[0];
                        } else {
                            this.customer_data = data[0];
                        }
                        if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                            this.countryCode = this.customer_data.countryCode;
                        } else {
                            this.countryCode = '+91';
                        }
                        this.jaldeeId = this.customer_data.jaldeeId;
                        this.getFamilyMembers();
                        this.initCheckIn();
                    }
                );
            }
        });
    }
    ngOnInit() {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = {
            'show_learnmore': true, 'scrollkey': 'check-ins->check-in',
            'actions': [{ 'title': 'Help', 'type': 'learnmore' }]
        };
        this.carouselOne = {
            dots: false,
            nav: true,
            navContainer: '.checkin-nav',
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
            autoWidth: true,
            loop: false,
            responsiveClass: true,
            responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 2 }, 1200: { items: 3 } }
        };
        this.createForm();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.api_loading = false;
        this.get_token_cap = Messages.GET_TOKEN;
        // this.breadcrumbs = [
        //     {
        //         title: 'Tokens/Check-ins',
        //         url: 'provider/check-ins'
        //     },
        //     {
        //         title: this.chekin_title
        //     }
        // ];
        this.maxsize = 1;
        this.step = 1;
        // this.getCurrentLocation();
        this.showfuturediv = false;
        this.revealphonenumber = true;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/check-ins->check-in']);
        }
    }
    createForm() {
        this.searchForm = this.fb.group({
            search_input: ['', Validators.compose([Validators.required])]
        });
    }
    createNew(type?) {
        if (!type) {
            this.qParams = {};
        }
        if (type === 'new') {
            this.qParams['noMobile'] = false;
        }
        this.qParams['checkinType'] = this.checkinType;
        if (this.source === 'waitlist-block') {
            this.qParams['source'] = this.source;
            this.qParams['serId'] = this.sel_ser;
            this.qParams['bookingMode'] = this.channel;
            this.qParams['uid'] = this.uid;
            this.qParams['showtoken'] = this.showtoken;
            if (this.virtualServicemode && this.virtualServicenumber) {
                this.qParams['virtualServicemode'] = this.virtualServicemode;
                this.qParams['virtualServicenumber'] = this.virtualServicenumber;
            }
        } else {
            this.qParams['source'] = (this.showtoken) ? 'token' : 'checkin';
        }
        this.qParams['thirdParty'] = this.thirdParty;
        this.qParams['type'] = type;
        this.qParams['id'] = 'add';
        const navigationExtras: NavigationExtras = {
            queryParams: this.qParams
        };
        this.router.navigate(['/provider/customers/create'], navigationExtras);
    }
    selectMode(type) {
        this.selectedMode = type;
    }
    findCustomer(form_data, event) {
        this.showBlockHint = false;
        if (event.key === 'Enter') {
            this.searchCustomer(form_data);
        }
    }
    searchCustomer(form_data) {
        this.emptyFielderror = false;
        if (form_data && form_data.search_input === '') {
            this.emptyFielderror = true;
        } else {
            this.qParams = {};
            let mode = 'id';
            this.form_data = null;
            this.create_new = false;
            let post_data = {};
            const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
            const isEmail = emailPattern.test(form_data.search_input);
            if (isEmail) {
                mode = 'email';
            } else {
                const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
                const isNumber = phonepattern.test(form_data.search_input);
                const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
                const isCount10 = phonecntpattern.test(form_data.search_input);
                if (isNumber && isCount10) {
                    mode = 'phone';
                } else {
                    mode = 'id';
                }
            }
            // this.qParams['source'] = 'checkin';
            switch (mode) {
                case 'phone':
                    post_data = {
                        'phoneNo-eq': form_data.search_input
                    };
                    this.qParams['phone'] = form_data.search_input;
                    break;
                case 'email':
                    this.qParams['email'] = form_data.search_input;
                    post_data = {
                        'email-eq': form_data.search_input
                    };
                    break;
                case 'id':
                    post_data = {
                        'jaldeeId-eq': form_data.search_input
                    };
                    break;
            }
            this.provider_services.getCustomer(post_data)
                .subscribe(
                    (data: any) => {
                        if (data.length === 0) {
                            // if (mode === 'phone') {
                            //     const filter = { 'primaryMobileNo-eq': form_data.search_input };
                            //     this.getJaldeeCustomer(filter);
                            // } else {
                            //     this.form_data = data;
                            //     this.create_new = true;
                            // }
                            this.createNew('create');
                        } else {
                            if (data.length > 1) {
                                const customer = data.filter(member => !member.parent);
                                this.customer_data = customer[0];
                            } else {
                                this.customer_data = data[0];
                            }
                            this.jaldeeId = this.customer_data.jaldeeId;
                            if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                                this.countryCode = this.customer_data.countryCode;
                            } else {
                                this.countryCode = '+91';
                            }
                            if (this.source === 'waitlist-block') {
                                this.showBlockHint = true;
                                if (this.showtoken) {
                                    this.heading = 'Confirm your Token';
                                } else {
                                    this.heading = 'Confirm your Check-in';
                                }
                            } else {
                                this.getFamilyMembers();
                                this.initCheckIn();
                            }
                        }
                    },
                    error => {
                        this.wordProcessor.apiErrorAutoHide(this, error);
                    }
                );
        }
    }
    confirmWaitlistBlockPopup() {
        const removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': 'Are you sure want to add',
                'type': 'yes/no'
            }
        });
        removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.confirmWaitlistBlock();
            }
        });
    }
    confirmWaitlistBlock() {
        const post_data = {
            'ynwUuid': this.uid,
            'consumer': {
                'id': this.customer_data.id
            },
            'waitlistingFor': [{
                'id': this.customer_data.id
            }],
        };
        if (this.virtualServicemode && this.virtualServicenumber) {
            const virtualArray = {};
            virtualArray[this.virtualServicemode] = this.virtualServicenumber;
            post_data['virtualService'] = virtualArray;
        }
        this.provider_services.confirmWaitlistBlock(post_data)
            .subscribe(
                data => {
                    if (this.questionAnswers && this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                        this.submitQuestionnaire(this.uid);
                    } else {
                        this.router.navigate(['provider', 'check-ins']);
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    initCheckIn(thirdParty?) {
        // if (thirdParty) {
        this.getGlobalSettings();
        // }
        this.thirdParty = thirdParty ? thirdParty : '';
        this.api_loading1 = false;
        if (this.showtoken) {
            this.heading = 'New Token';
        } else {
            this.heading = 'New Check-in';
        }
        const _this = this;
        this.showCheckin = true;
        this.otherThirdParty = '';
        this.waitlist_for = [];
        if (this.thirdParty === '') {
            this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        }
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        const dd = this.today.getDate();
        const mm = this.today.getMonth() + 1; // January is 0!
        const yyyy = this.today.getFullYear();
        let cday = '';
        if (dd < 10) { cday = '0' + dd; } else { cday = '' + dd; }
        let cmon;
        if (mm < 10) { cmon = '0' + mm; } else { cmon = '' + mm; }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        this.todaydate = dtoday;
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);

        const loc = this.groupService.getitemFromGroupStorage('loc_id');
        this.sel_loc = loc.id;

        this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
        this.minDate = this.sel_checkindate; // done to set the min date in the calendar view
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;
        const dt1 = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date1 = new Date(dt1);
        const dt2 = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date2 = new Date(dt2);
        if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        }
        this.getWaitlistMgr().then(
            () => {
                _this.setTerminologyLabels();
                _this.getBussinessProfileApi()
                    .then(
                        (data: any) => {
                            _this.account_id = data.id;
                            _this.accountType = data.accountType;
                            _this.domain = data.serviceSector.domain;
                            _this.getPartysizeDetails(_this.domain, data.serviceSubSector.subDomain);
                            if (_this.domain === 'foodJoints') {
                                _this.have_note_click_here = Messages.PLACE_ORDER_CLICK_HERE;
                                _this.note_placeholder = 'Item No Item Name Item Quantity';
                                _this.note_cap = 'Add Note / Delivery address';
                            } else {
                                _this.have_note_click_here = Messages.HAVE_NOTE_CLICK_HERE_CAP;
                                _this.note_placeholder = 'Add Note';
                                _this.note_cap = 'Add Note';
                            }
                            _this.shared_services.getProviderServicesByLocationId(_this.sel_loc).subscribe(
                                (services: any) => {
                                    // _this.servicesjson = services;
                                    // _this.serviceslist = services;
                                    if (_this.thirdParty === '' && !_this.customer_data.phoneNo && !_this.customer_data.email) {
                                        _this.servicesjson = [];
                                        _this.serviceslist = [];
                                        for (let i = 0; i < services.length; i++) {
                                            if (services[i].serviceType !== 'virtualService') {
                                                _this.servicesjson.push(services[i]);
                                                _this.serviceslist.push(services[i]);
                                            }
                                        }
                                    } else {
                                        _this.servicesjson = services;
                                        _this.serviceslist = services;
                                    }
                                    // this.sel_ser_det = [];
                                    if (_this.servicesjson.length > 0) {
                                        //     this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                                        //     this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                                        //     this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
                                        if (this.accountType === 'BRANCH') {
                                            _this.initDepartments(_this.account_id).then(
                                                () => {
                                                    _this.handleDeptSelction(_this.selected_dept);
                                                },
                                                () => {
                                                    this.getAllUsers();
                                                    // this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                                                }
                                            );
                                        } else {
                                            this.sel_ser = this.servicesjson[0].id;
                                            this.setServiceDetails(this.sel_ser);
                                            this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
                                            this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
                                        }
                                    }
                                    //     this.api_loading1 = false;
                                    // },
                                    //     () => {
                                    //         this.api_loading1 = false;
                                    //         this.sel_ser = '';
                                    //     });
                                });
                        }
                    );
            });
    }
    initDepartments(accountId) {
        this.departmentlist = this.departments = [];
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.shared_services.getProviderDept(accountId).subscribe(data => {
                _this.departmentlist = data;
                _this.filterDepart = _this.departmentlist.filterByDept;
                for (let i = 0; i < _this.departmentlist['departments'].length; i++) {
                    if (_this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        if (_this.departmentlist['departments'][i].serviceIds.length !== 0) {
                            if (_this.departments.indexOf(_this.departmentlist['departments'][i]) == -1) {
                                _this.departments.push(_this.departmentlist['departments'][i]);
                            }
                        }
                    }
                }
                _this.deptLength = _this.departments.length;
                // this.selected_dept = 'None';
                if (_this.selectDept) {
                    _this.selected_dept = _this.selectDept;
                    resolve();
                } else if (_this.deptLength !== 0) {
                    _this.selected_dept = _this.departments[0].departmentId;
                    resolve();
                } else {
                    reject();
                }
            },
                () => {
                    reject();
                });
        });
    }
    setTerminologyLabels() {
        this.checkinLabel = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm('waitlist'));
        this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
        this.CheckedinLabel = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm('waitlisted'));
        if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
            this.main_heading = this.get_token_cap;
        } else {
            this.main_heading = this.checkinLabel;
        }
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.provider_services.getWaitlistMgr()
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
    getFamilyMembers() {
        if (this.thirdParty === '') {
            this.api_loading1 = true;
            let fn;
            // let self_obj;
            fn = this.shared_services.getProviderCustomerFamilyMembers(this.customer_data.id);
            // self_obj = {
            //     'userProfile': {
            //         'id': this.customer_data.id,
            //         'firstName': this.customer_data.firstName,
            //         'lastName': this.customer_data.lastName
            //     }
            // };
            fn.subscribe(data => {
                this.familymembers = [];
                this.familymembers.push(this.customer_data);
                for (const mem of data) {
                    if (mem.id !== this.customer_data.id) {
                        this.familymembers.push(mem);
                    }
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                });
        } else {
            this.api_loading1 = false;
        }
    }
    addPhone() {
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
        } else if (!result) {
            this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
            return;
        } else if (!result1) {
            this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
            return;
        } else {
            this.consumerPhoneNo = this.selected_phone;
            this.userPhone = this.selected_phone;
            this.edit = true;
        }
    }
    editPhone() {
        this.edit = false;
        this.selected_phone = this.userPhone;
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
        this.phoneerror = null;
    }
    setServiceDetails(curservid) {
        if (this.waitlist_for[0] && this.waitlist_for[0].id) {
            this.getProviderQuestionnaire();
        }
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        this.callingModes = this.customer_data.phoneNo.trim();
                        this.wtsapmode = this.customer_data.phoneNo;
                    }
                }
            }
        }
        this.sel_ser_det = [];
        this.sel_ser_det = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            price: serv.totalAmount,
            isPrePayment: serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable,
            serviceType: serv.serviceType,
            virtualServiceType: serv.virtualServiceType,
            virtualCallingModes: serv.virtualCallingModes,
            consumerNoteMandatory: serv.consumerNoteMandatory,
            consumerNoteTitle: serv.consumerNoteTitle
        };
        this.note_placeholder = this.sel_ser_det.consumerNoteTitle;
    }
    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
        this.queuejson = [];
        this.queueQryExecuted = false;
        if (locid && servid) {
            this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe(data => {
                    this.queuejson = data;
                    this.queueQryExecuted = true;
                    if (this.queuejson.length > 0) {
                        let selindx = 0;
                        for (let i = 0; i < this.queuejson.length; i++) {
                            if (this.queuejson[i]['queueWaitingTime'] !== undefined) {
                                selindx = i;
                            }
                        }
                        this.sel_queue_id = this.queuejson[selindx].id;
                        this.sel_queue_indx = selindx;
                        // this.sel_queue_waitingmins = this.queuejson[0].queueWaitingTime + ' Mins';
                        this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
                        this.sel_queue_servicetime = this.queuejson[selindx].serviceTime || '';
                        this.sel_queue_name = this.queuejson[selindx].name;
                        // this.sel_queue_timecaption = '[ ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'] + ' ]';
                        // this.sel_queue_timecaption = this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'];
                        this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
                        this.calc_mode = this.queuejson[this.sel_queue_indx].calculationMode;
                        this.setTerminologyLabels();
                        // if (this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
                        //     this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
                        // }
                    } else {
                        this.sel_queue_indx = -1;
                        this.sel_queue_id = 0;
                        this.sel_queue_waitingmins = 0;
                        this.sel_queue_servicetime = '';
                        this.sel_queue_name = '';
                        this.sel_queue_timecaption = '';
                        this.sel_queue_personaahead = 0;
                    }
                });
        }
    }
    handleServiceSel(obj) {
        // this.sel_ser = obj.id;
        this.callingModes = [];
        this.showInputSection = false;
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        this.queuejson = [];
        this.sel_queue_id = 0;
        this.sel_queue_waitingmins = 0;
        this.sel_queue_servicetime = '';
        this.sel_queue_personaahead = 0;
        this.sel_queue_name = '';
        this.resetApi();
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
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
    isSelectedQueue(id) {
        let clr = false;
        if (id === this.sel_queue_id) {
            clr = true;
        } else {
            clr = false;
        }
        return clr;
    }
    handleQueueSel(mod) {
        this.resetApi();
        if (mod === 'next') {
            if ((this.queuejson.length - 1) > this.sel_queue_indx) {
                this.sel_queue_indx = this.sel_queue_indx + 1;
            }
        } else if (mod === 'prev') {
            if ((this.queuejson.length > 0) && (this.sel_queue_indx > 0)) {
                this.sel_queue_indx = this.sel_queue_indx - 1;
            }
        }
        if (this.sel_queue_indx !== -1) {
            this.sel_queue_id = this.queuejson[this.sel_queue_indx].id;
            this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(this.queuejson[this.sel_queue_indx].queueWaitingTime);
            this.sel_queue_servicetime = this.queuejson[this.sel_queue_indx].serviceTime || '';
            this.sel_queue_name = this.queuejson[this.sel_queue_indx].name;
            // this.sel_queue_timecaption = '[ ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'] + ' ]';
            this.sel_queue_timecaption = this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'];
            this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
            // this.queueReloaded = true;
            if (this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
                this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
            }
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
        // this.queueReloaded = true;
        if (this.calc_mode === 'Fixed' && queue.timeInterval && queue.timeInterval !== 0) {
            this.getAvailableTimeSlots(queue.queueSchedule.timeSlots[0]['sTime'], queue.queueSchedule.timeSlots[0]['eTime'], queue.timeInterval);
        }
    }


    handleFuturetoggle() {
        this.showfuturediv = !this.showfuturediv;
    }
    isCheckinenable() {
        if (this.sel_loc && this.sel_ser && this.sel_queue_id && this.sel_checkindate) {
            return true;
        } else {
            return false;
        }
    }
    revealChk() {
        this.revealphonenumber = !this.revealphonenumber;
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
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        const dte0 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
        const datee2 = new Date(dte2);
        if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
        }
        this.handleFuturetoggle();
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
    }
    handleServiceForWhom() {
        this.resetApi();
        this.holdwaitlist_for = this.waitlist_for;
        this.step = 3;
        this.main_heading = 'Family Members';
    }
    handleCheckinClicked() {
        this.resetApi();
        let error = '';
        if (this.step === 1) {
            if (this.partySizeRequired) {
                this.clearerrorParty();
                error = this.validatorPartysize(this.enterd_partySize);
            }
            if (error === '') {
                if (this.waitlist_for.length === 0) {
                    // if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
                    //     this.getCustomerCount();
                    // } else {
                    //     this.createCustomer();
                    // }
                    this.waitlist_for.push({ firstName: this.thirdParty, lastName: 'user', apptTime: this.apptTime });
                }
                this.saveCheckin();
            } else {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.api_error = error;
            }
        }
    }
    getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.customidFormat = data.jaldeeIdFormat;
            });
    }
    createCustomer() {
        const post_data = {
            'firstName': this.thirdParty,
            'lastName': 'user'
        };
        if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
            post_data['jaldeeId'] = this.jld;
        }
        this.provider_services.createProviderCustomer(post_data)
            .subscribe(
                data => {
                    this.getCustomerbyId(data);
                });
    }
    getCustomerbyId(id) {
        const filter = { 'id-eq': id };
        this.provider_services.getCustomer(filter)
            .subscribe(
                (data: any) => {
                    if (data.length > 1) {
                        const customer = data.filter(member => !member.parent);
                        this.customer_data = customer[0];
                    } else {
                        this.customer_data = data[0];
                    }
                    this.jaldeeId = this.customer_data.jaldeeId;
                    if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                        this.countryCode = this.customer_data.countryCode;
                    } else {
                        this.countryCode = '+91';
                    }
                    this.waitlist_for.push({ id: data[0].id, firstName: data[0].firstName, lastName: data[0].lastName, apptTime: this.apptTime });
                    this.saveCheckin();
                });
    }
    saveCheckin() {
        // const waitlistarr = [];
        // for (let i = 0; i < this.waitlist_for.length; i++) {
        //     waitlistarr.push({ id: this.waitlist_for[i].id });
        // }
        this.is_wtsap_empty = false;
        // if (this.waitlist_for.length !== 0) {
        //     for (const list of this.waitlist_for) {
        //         if (list.id === this.customer_data.id) {
        //             list['id'] = 0;
        //         }
        //     }
        // }
        this.virtualServiceArray = {};
        // for (let i = 0; i < this.callingModes.length; i++) {
        if (this.callingModes !== '' && this.sel_ser_det.virtualCallingModes && this.sel_ser_det.virtualCallingModes.length > 0) {
            if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Zoom') {
                this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.sel_ser_det.virtualCallingModes[0].value;
            } else if (!this.thirdParty) {
                if (this.countryCode) {
                    const unChangedPhnoCountryCode = this.countryCode.split('+')[1];
                    this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = unChangedPhnoCountryCode + '' + this.callingModes;
                }
            } else {
                const thirdparty_countrycode = '91';
                this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = thirdparty_countrycode + '' + this.callingModes;
            }
        }
        // }
        if (this.thirdParty !== '' && this.waitlist_for.length === 0) {
            this.waitlist_for.push({ firstName: this.thirdParty, lastName: 'user', apptTime: this.apptTime });
        }
        const post_Data = {
            'queue': {
                'id': this.sel_queue_id
            },
            'date': this.sel_checkindate,
            'service': {
                'id': this.sel_ser,
                'serviceType': this.sel_ser_det.serviceType
            },
            'consumerNote': this.consumerNote,
            'countryCode': this.countryCode,
            // 'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr))
            'waitlistingFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'waitlistMode': this.checkinType
        };
        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }
        if (this.sel_ser_det.serviceType === 'virtualService') {
            if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'WhatsApp' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Phone') {
                if (!this.callingModes || this.callingModes.length < 10) {
                    this.snackbarService.openSnackBar('Please enter a valid number to contact you', { 'panelClass': 'snackbarerror' });
                    this.is_wtsap_empty = true;
                }
            }
            //   post_Data['virtualService'] = this.virtualServiceArray;
            for (const i in this.virtualServiceArray) {
                if (i === 'WhatsApp') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'GoogleMeet') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Zoom') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Phone') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else {
                    post_Data['virtualService'] = { 'VideoCall': '' };
                }
                //  else {
                //     post_Data['virtualService'] = {};
                // }
            }
        }
        if (this.apptTime) {
            post_Data['appointmentTime'] = this.apptTime;
        }
        // if (this.selectedMessage.files.length > 0 && this.consumerNote === '') {
        //     // this.api_error = this.wordProcessor.getProjectMesssages('ADDNOTE_ERROR');
        //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADDNOTE_ERROR'), { 'panelClass': 'snackbarerror' });
        // }
        if (this.partySizeRequired) {
            this.holdenterd_partySize = this.enterd_partySize;
            post_Data['partySize'] = Number(this.holdenterd_partySize);
        }

        if (this.api_error === null) {
            post_Data['consumer'] = { id: this.customer_data.id };
            post_Data['ignorePrePayment'] = true;
            if (!this.is_wtsap_empty) {
                if (this.thirdParty === '') {
                    if (this.waitlist_for.length === 0) {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages('Please select atleast one member'), { 'panelClass': 'snackbarerror' });
                    } else {
                        if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                            this.validateQnr(post_Data);
                        } else {
                            this.addCheckInProvider(post_Data);
                        }
                    }
                } else {
                    this.addWaitlistBlock(post_Data);
                }
            }
        }
    }
    addWaitlistBlock(post_Data) {
        this.provider_services.addWaitlistBlock(post_Data)
            .subscribe((data) => {
                if (this.settingsjson.showTokenId) {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('TOKEN_GENERATION'));
                } else {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC'));
                }
                this.showCheckin = false;
                this.searchForm.reset();
                this.router.navigate(['provider', 'check-ins']);
            });
    }
    addCheckInProvider(post_Data) {
        this.api_loading = true;
        this.shared_services.addProviderCheckin(post_Data)
            .subscribe((data) => {
                this.api_loading = false;
                const retData = data;
                let retUuid;
                let parentUid;
                Object.keys(retData).forEach(key => {
                    retUuid = retData[key];
                    this.trackUuid = retData[key];
                    parentUid = retData['parent_uuid'];;
                });
                if (this.questionAnswers) {
                    this.submitQuestionnaire(parentUid);
                } else {
                    this.router.navigate(['provider', 'check-ins']);
                    if (this.settingsjson.showTokenId) {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('TOKEN_GENERATION'));
                    } else {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC'));
                    }
                }
                if (this.selectedMessage.files.length > 0) {
                    this.consumerNoteAndFileSave(retUuid);
                }
                this.showCheckin = false;
                this.searchForm.reset();
                // this.router.navigate(['provider', 'check-ins']);

            },
                error => {
                    // this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                });
    }
    submitQuestionnaire(uuid) {
        const dataToSend: FormData = new FormData();
        if (this.questionAnswers.files) {
            for (const pic of this.questionAnswers.files) {
                dataToSend.append('files', pic, pic['name']);
            }
        }
        const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        this.providerService.submitProviderWaitlistQuestionnaire(dataToSend, uuid).subscribe(data => {
            if (this.settingsjson.showTokenId) {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('TOKEN_GENERATION'));
            } else {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC'));
            }
            this.router.navigate(['provider', 'check-ins']);
        }, error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
    }
    handleGoBack(cstep) {
        this.resetApi();
        switch (cstep) {
            case 1:
                this.hideFilterSidebar();
                if (this.action === 'note') {
                    if (this.consumerNote !== '') {
                        if (this.domain === 'foodJoints') {
                            this.note_cap = 'Edit Note / Delivery address';
                        } else {
                            this.note_cap = 'Edit Note';
                        }
                    } else {
                        if (this.domain === 'foodJoints') {
                            this.note_cap = 'Add Note / Delivery address';
                        } else {
                            this.note_cap = 'Add Note';
                        }
                    }
                }
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
                this.disable = false;
                this.addmemberobj.fname = '';
                this.addmemberobj.lname = '';
                this.addmemberobj.mobile = '';
                this.addmemberobj.gender = '';
                this.addmemberobj.dob = '';
                this.addmemberobj.jaldeeid = '';
                break;
        }
        this.step = cstep;
        // if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
        //     // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
        //     // this.waitlist_for.push ({id: this.customer_data.id, name: 'Self'});
        //     this.waitlist_for.push({ id: 0, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        //     console.log(this.waitlist_for);
        // }
    }
    showCheckinButtonCaption() {
        let caption = '';
        caption = 'Confirm';
        return caption;
    }
    handleOneMemberSelect(id, firstName, lastName, jaldeeid) {
        this.resetApi();
        this.waitlist_for = [];
        this.jaldeeId = jaldeeid;
        this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName });
        // this.getProviderQuestionnaire();
    }
    handleMemberSelect(id, firstName, lastName, obj) {
        this.resetApi();
        if (this.waitlist_for.length === 0) {
            this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName });
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
                    this.waitlist_for.push({ id: id, lastName: lastName, firstName: firstName });
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
        this.disable = false;
        // this.step = 4; // show add member section
        // this.main_heading = 'Add Family Member';
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
        this.addmemberobj.jaldeeid = obj.jaldeeid || '';
    }
    handleSaveMember() {
        this.disable = true;
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
            // const post_data = {
            //     'userProfile': {
            //         'firstName': this.addmemberobj.fname,
            //         'lastName': this.addmemberobj.lname
            //     }
            // };
            // if (this.addmemberobj.mobile !== '') {
            //     post_data.userProfile['phoneNo'] = this.addmemberobj.mobile;
            //     post_data.userProfile['countryCode'] = '+91';
            // }
            // if (this.addmemberobj.gender !== '') {
            //     post_data.userProfile['gender'] = this.addmemberobj.gender;
            // }
            // if (this.addmemberobj.dob !== '') {
            //     post_data.userProfile['dob'] = this.addmemberobj.dob;
            // }
            let fn;
            // post_data['parent'] = this.customer_data.id;
            const post_data = {
                'firstName': this.addmemberobj.fname,
                'lastName': this.addmemberobj.lname,
                'dob': '',
                'gender': '',
                'phoneNo': '',
                'address': '',
                'parent': this.customer_data.id
            };
            if (this.addmemberobj.jaldeeid) {
                post_data['jaldeeId'] = this.addmemberobj.jaldeeid;
            }
            fn = this.shared_services.addProviderCustomerFamilyMember(post_data);
            fn.subscribe(() => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MEMBER_CREATED'), { 'panelclass': 'snackbarerror' });
                // this.api_success = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
                this.getFamilyMembers();
                setTimeout(() => {
                    this.handleGoBack(3);
                }, projectConstants.TIMEOUT_DELAY);
            },
                error => {
                    // this.api_error = error.error;
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.disable = false;
                    // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADDNOTE_ERROR'));
                });
        } else {
            // this.api_error = derror;
            this.snackbarService.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
            this.disable = false;
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
    handleEmail() {
        if (this.dispCustomerEmail) {
            this.dispCustomerEmail = false;
        } else {
            this.dispCustomerEmail = true;
        }
    }
    calculateDate(days) {
        this.resetApi();
        const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
        const newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        const dd = newdate.getDate();
        const mm = newdate.getMonth() + 1;
        const y = newdate.getFullYear();
        const ndate1 = y + '-' + mm + '-' + dd;
        const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
        const strtDt1 = this.hold_sel_checkindate + ' 00:00:00';
        const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
        const nDt = new Date(ndate);
        if (nDt.getTime() >= strtDt.getTime()) {
            this.sel_checkindate = ndate;
            this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
            this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
        }
        const dt = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt1 = moment(dt, 'YYYY-MM-DD HH:mm').format();
        const date1 = new Date(dt1);
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
        if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
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
        this.shared_services.getPartysizeDetails(domain, subdomain)
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
    checkPartySize(pVal) {
        this.clearerrorParty();
        const error = this.validatorPartysize(pVal);
        if (error !== '') {
            this.partyapi_error = error;
        }
    }
    validatorPartysize(pVal) {
        this.resetApi();
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
    clearerrorParty() {
        this.partyapi_error = '';
    }
    getProviderDepart(id) {
        this.shared_services.getProviderDept(id).
            subscribe(data => {
                this.departmentlist = data;
                this.filterDepart = this.departmentlist.filterByDept;
                for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                    if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        if (this.departmentlist['departments'][i].serviceIds.length !== 0) {
                            this.departments.push(this.departmentlist['departments'][i]);
                        }
                    }
                }
                this.deptLength = this.departments.length;
                // this.selected_dept = 'None';
                if (this.deptLength !== 0) {
                    this.selected_dept = this.departments[0].departmentId;
                    this.handleDeptSelction(this.selected_dept);
                }
            });
    }
    handleDeptSelction(obj) {
        this.users = [];
        this.queuejson = [];
        this.api_error = null;
        this.selected_dept = obj;
        this.servicesjson = this.serviceslist;
        if (this.filterDepart) {
            const filter = {
                'departmentId-eq': obj,
                'status-eq': 'ACTIVE'
            };
            this.provider_services.getUsers(filter).subscribe(
                (users: any) => {
                    const filteredUser = users.filter(user => user.queues && user.status === 'ACTIVE');
                    this.users = [];
                    this.users = filteredUser;
                    let found = false;
                    for (let serviceIndex = 0; serviceIndex < this.servicesjson.length; serviceIndex++) {
                        for (let userIndex = 0; userIndex < users.length; userIndex++) {
                            if (this.servicesjson[serviceIndex].provider && this.servicesjson[serviceIndex].provider.id === users[userIndex].id) {
                                if (this.users.indexOf(users[userIndex]) === -1) {
                                    this.users.push(users[userIndex]);
                                }
                                break;
                            }
                            if (this.servicesjson[serviceIndex].department === this.selected_dept && !this.servicesjson[serviceIndex].provider) {
                                found = true;
                            }
                        }
                    }
                    if (found) {
                        // addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
                        this.users.push(this.userN);
                    }
                    if (this.users.length !== 0) {
                        if (this.selectUser) {
                            const userDetails = this.users.filter(user => user.id === this.selectUser);
                            if (userDetails && userDetails[0]) {
                                this.selected_user = userDetails[0];
                            } else {
                                this.selected_user = this.users[0];
                            }
                        } else {
                            this.selected_user = this.users[0];
                        }
                        this.handleUserSelection(this.selected_user);
                    } else {
                        this.selected_user = null;
                        this.selectedUser = null;
                        for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                            if (obj === this.departmentlist['departments'][i].departmentId) {
                                this.services = this.departmentlist['departments'][i].serviceIds;
                            }
                        }
                        const newserviceArray = [];
                        if (this.services) {
                            for (let i = 0; i < this.serviceslist.length; i++) {
                                for (let j = 0; j < this.services.length; j++) {
                                    if (this.services[j] === this.serviceslist[i].id) {
                                        newserviceArray.push(this.serviceslist[i]);
                                    }
                                }
                            }
                            if (this.thirdParty === '' && !this.customer_data.phoneNo && !this.customer_data.email) {
                                this.servicesjson = [];
                                for (let i = 0; i < newserviceArray.length; i++) {
                                    if (newserviceArray[i].serviceType !== 'virtualService') {
                                        this.servicesjson.push(newserviceArray[i]);
                                    }
                                }
                            } else {
                                this.servicesjson = newserviceArray;
                            }
                        }
                        if (this.servicesjson.length > 0) {
                            this.sel_ser = this.servicesjson[0].id;
                            this.setServiceDetails(this.sel_ser);
                            this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
                            this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
                        } else {
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
                        }
                    }
                });
            // }
        } else {
            this.getAllUsers();
        }
        // if (obj === 'None') {
        //     this.servicesjson = this.serviceslist;
        // } else {
        //     for (let i = 0; i < this.departmentlist['departments'].length; i++) {
        //         if (obj === this.departmentlist['departments'][i].departmentId) {
        //             this.services = this.departmentlist['departments'][i].serviceIds;
        //         }
        //     }
        //     const newserviceArray = [];
        //     if (this.services) {
        //         for (let i = 0; i < this.serviceslist.length; i++) {
        //             for (let j = 0; j < this.services.length; j++) {
        //                 if (this.services[j] === this.serviceslist[i].id) {
        //                     newserviceArray.push(this.serviceslist[i]);
        //                 }
        //             }
        //         }
        //         this.servicesjson = newserviceArray;
        //     }
        // }
        // if (this.servicesjson.length > 0) {
        //     this.sel_ser = this.servicesjson[0].id;
        //     this.setServiceDetails(this.sel_ser);
        //     this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        // } else {
        //     this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
        // }
    }
    getAllUsers() {
        const filter = {
            'status-eq': 'ACTIVE',
            'userType-neq': 'ASSISTANT,ADMIN'
        };
        this.provider_services.getUsers(filter).subscribe(
            (users: any) => {
                const filteredUser = users.filter(user => user.queues && user.status === 'ACTIVE');
                this.users = [];
                this.users = filteredUser;
                this.users.push(this.userN);
                if (this.selectUser) {
                    const userDetails = this.users.filter(user => user.id === this.selectUser);
                    this.selected_user = userDetails[0];
                    this.handleUserSelection(this.selected_user);
                } else if (this.users.length !== 0) {
                    this.selected_user = this.users[0];
                    this.handleUserSelection(this.selected_user);
                } else {
                    this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                }
            });
    }
    handleUserSelection(user) {
        this.selectedUser = user;
        this.queuejson = [];
        this.servicesjson = this.serviceslist;
        let newserviceArray = [];
        if (user.id && user.id !== 0) {
            newserviceArray = [];
            for (let i = 0; i < this.servicesjson.length; i++) {
                if (this.servicesjson[i].provider && user.id === this.servicesjson[i].provider.id) {
                    newserviceArray.push(this.serviceslist[i]);
                }
            }
        } else {
            newserviceArray = [];
            for (let i = 0; i < this.servicesjson.length; i++) {
                if (!this.servicesjson[i].provider && this.servicesjson[i].department === this.selected_dept) {
                    newserviceArray.push(this.serviceslist[i]);
                }
            }
        }
        if (this.thirdParty === '' && !this.customer_data.phoneNo && !this.customer_data.email) {
            this.servicesjson = [];
            for (let i = 0; i < newserviceArray.length; i++) {
                if (newserviceArray[i].serviceType !== 'virtualService') {
                    this.servicesjson.push(newserviceArray[i]);
                }
            }
        } else {
            this.servicesjson = newserviceArray;
        }
        if (this.servicesjson.length > 0) {
            this.sel_ser = this.servicesjson[0].id;
            this.setServiceDetails(this.sel_ser);
            this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
            this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
        } else {
            if (this.filterDepart) {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
            } else {
                this.snackbarService.openSnackBar('The selected provider doesn\'t contain any active services for this location', { 'panelClass': 'snackbarerror' });
            }
        }
    }
    getServicebyLocationId(locid, pdate) {
        this.api_loading1 = true;
        this.resetApi();
        this.shared_services.getProviderServicesByLocationId(locid)
            .subscribe(data => {
                this.servicesjson = data;
                this.serviceslist = data;
                this.sel_ser_det = [];
                if (this.servicesjson.length > 0) {
                    this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                    this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                    this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.sel_ser = '';
                });
    }
    filesSelected(event) {
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                    this.wordProcessor.apiErrorAutoHide(this, 'Selected image type not supported');
                } else if (file.size > projectConstants.FILE_MAX_SIZE) {
                    this.wordProcessor.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
                } else {
                    this.selectedMessage.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.selectedMessage.base64.push(e.target['result']);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    deleteTempImage(index) {
        this.selectedMessage.files.splice(index, 1);
    }
    consumerNoteAndFileSave(uuid) {
        const dataToSend: FormData = new FormData();
        // if (this.consumerNote === '') {
        //     this.consumerNote = 'Please find the attachment(s) from Consumer with this message';
        // }
        // dataToSend.append('message', this.consumerNote);
        const captions = {};
        let i = 0;
        if (this.selectedMessage) {
            for (const pic of this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = 'caption';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);
        // this.shared_services.addConsumerWaitlistNote(this.account_id, uuid,
        //     dataToSend)
        this.shared_services.addProviderWaitlistAttachment(uuid, dataToSend)
            .subscribe(
                () => {
                },
                error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
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
    getAvailableTimeSlots(QStartTime, QEndTime, interval) {
        const _this = this;
        const allSlots = _this.jaldeeTimeService.getTimeSlotsFromQTimings(interval, QStartTime, QEndTime);
        this.availableSlots = allSlots;
        const filter = {};
        const activeSlots = [];
        filter['queue-eq'] = _this.sel_queue_id;
        filter['location-eq'] = _this.sel_loc;
        let future = false;
        const waitlist_date = new Date(this.sel_checkindate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
            future = true;
        }
        this.apptTime = '';
        if (!future) {
            _this.provider_services.getTodayWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.apptTime = this.availableSlots[0];
                }
            );
        } else {
            filter['date-eq'] = _this.sel_checkindate;
            _this.provider_services.getFutureWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.apptTime = this.availableSlots[0];
                }
            );
        }
    }
    toggleAttachment() {
        this.attachments = !this.attachments;
    }
    toggleNotes() {
        this.notes = !this.notes;
    }
    timeSelected(slot) {
        this.apptTime = slot;
    }
    handleSideScreen(action) {
        this.showAction = true;
        this.action = action;
    }
    hideFilterSidebar() {
        this.showAction = false;
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }
    addCallingmode(index) {
        if (this.callingModes && this.callingModes.length === 10 && this.callingModes.charAt(0) !== '0') {
            this.showInputSection = true;
        } else if (!this.callingModes || this.callingModes.length < 10 || this.callingModes.charAt(0) === '0') {
            this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
        }
    }
    // handleModeSel(index, ev) {
    //     if (ev.checked) {
    //         this.showInputSection[index] = true;
    //     } else {
    //         this.showInputSection[index] = false;
    //         this.callingModes[index] = '';
    //     }
    // }
    editCallingmodes(index) {
        this.showInputSection = false;
    }
    showOtherSection(value?) {
        if (value) {
            if (this.otherThirdParty.trim() === '') {
                this.thirdparty_error = 'Third party listing site required';
            } else {
                this.thirdParty = this.otherThirdParty.trim();
                this.showOther = false;
                this.initCheckIn(this.thirdParty);
            }
        } else {
            this.showOther = true;
        }
    }
    resetError() {
        this.thirdparty_error = null;
    }
    getCustomerCount() {
        this.provider_services.getProviderCustomersCount()
            .subscribe(
                data => {
                    this.jld = 'JLD' + this.thirdParty + data;
                    this.createCustomer();
                });
    }
    goBack() {
        if (this.showQuestionnaire) {
            this.showQuestionnaire = false;
        } else if (this.showCheckin) {
            this.showCheckin = false;
            this.otherThirdParty = '';
        } else {
            this.router.navigate(['provider', 'check-ins']);
        }
        if (this.showtoken) {
            this.heading = 'Create a Token';
        } else {
            this.heading = 'Create a Check-in';
        }
    }
    getQueuesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.shared_services.getQueuesbyLocationandServiceIdAvailableDates(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.isAvailable);
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
    getJaldeeId(member) {
        const memberArr = this.familymembers.filter(memb => memb.id === member.id);
        if (memberArr[0]) {
            return memberArr[0].jaldeeId;
        } else {
            return this.customer_data.jaldeeId;
        }
    }
    getQuestionAnswers(event) {
        this.questionAnswers = null;
        this.questionAnswers = event;
    }
    showQnr() {
        this.showQuestionnaire = true;
        this.heading = 'More Info';
    }
    getProviderQuestionnaire() {
        let consumerId;
        if (this.showBlockHint) {
            consumerId = this.customer_data.id;
        } else {
            consumerId = this.waitlist_for[0].id;
        }
        this.providerService.getProviderQuestionnaire(this.sel_ser, consumerId, this.channel).subscribe(data => {
            this.questionnaireList = data;
            if (this.showBlockHint) {
                if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.showQuestionnaire = true;
                    this.heading = 'More Info';
                } else {
                    this.confirmWaitlistBlockPopup();
                }
            }
        });
    }
    validateQnr(post_Data?) {
        if (!this.questionAnswers) {
            this.questionAnswers = {
                answers: {
                    answerLine: [],
                    questionnaireId: this.questionnaireList.id
                }
            }
        }
        if (this.questionAnswers.answers) {
            this.provider_services.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
                if (data.length === 0) {
                    if (!this.showBlockHint) {
                        this.addCheckInProvider(post_Data);
                    } else {
                        this.confirmWaitlistBlock();
                    }
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
}
