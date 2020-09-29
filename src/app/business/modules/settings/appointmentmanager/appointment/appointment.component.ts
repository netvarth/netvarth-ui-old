import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import * as moment from 'moment';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
    selector: 'app-appointment-checkin',
    templateUrl: './appointment.component.html'
})
export class AppointmentComponent implements OnInit {
    appointmentSubscribtion: Subscription;
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
    // sel_queue_waitingmins;
    // sel_queue_servicetime = '';
    // sel_queue_name;
    // sel_queue_timecaption;
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
    api_loading = true;
    departmentlist: any = [];
    departments: any = [];
    selected_dept;
    selected_user;
    selectedUser;
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
    source: any = [];
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
    apptTime = '';
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
    showEditView = false;
    slots;
    freeSlots: any = [];
    comingSchduleId = '';
    slotTime = '';
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    showInputSection = false;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    apptType;
    showApptTime = false;
    wtsapmode: any;
    appt_title: string;
    is_wtsap_empty = false;
    subQueue: any = [];
    showSubq = 0;
    selectDept;
    selectUser;
    accountType;
    disable = false;
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
    heading = 'Create an Appointment';
    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        private activated_route: ActivatedRoute,
        public provider_services: ProviderServices) {
        this.customer_label = this.sharedFunctionobj.getTerminologyTerm('customer');
        this.server_date = this.sharedFunctionobj.getitemfromLocalStorage('sysdate');
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.checkinType) {
                this.apptType = qparams.checkinType;
                if (this.apptType === 'PHONE_IN_APPOINTMENT') {
                    this.appt_title = 'Phone-in Appointment';
                } else {
                    this.appt_title = 'Appointment';
                }
            }
            if (qparams.thirdParty) {
                this.thirdParty = qparams.thirdParty;
            }
            if (qparams.ph || qparams.haveMobile) {
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
                this.provider_services.getProviderCustomers(filter).subscribe(
                    (data) => {
                        this.customer_data = data[0];
                        this.getFamilyMembers();
                        this.initAppointment();
                    }
                );
            }
            if (qparams.timeslot) {
                this.slotTime = qparams.timeslot;
                console.log(this.slotTime);
                this.comingSchduleId = JSON.parse(qparams.scheduleId);
            }
            if (qparams.deptId) {
                this.selectDept = JSON.parse(qparams.deptId);
            }
            if (qparams.userId) {
                this.selectUser = JSON.parse(qparams.userId);
            }
            if (qparams.date) {
                this.sel_checkindate = moment(qparams.date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
            } else {
                this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
            }
        });
    }
    ngOnInit() {
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
        const user = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.api_loading = false;
        this.get_token_cap = Messages.GET_TOKEN;
        this.breadcrumbs = [
            {
                title: 'Appointments',
                url: 'provider/appointments'
            },
            {
                title: this.appt_title
            }
        ];
        this.maxsize = 1;
        this.step = 1;
        // this.getCurrentLocation();
        this.showfuturediv = false;
        this.revealphonenumber = true;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/appointments->appointment-phonein']);
        }
    }
    createForm() {
        this.searchForm = this.fb.group({
            search_input: ['', Validators.compose([Validators.required])]
        });
    }
    createNew(type?) {
        if (type === 'new') {
            this.qParams['noMobile'] = false;
        }
        this.qParams['checkinType'] = this.apptType;
        this.qParams['source'] = 'appointment';
        this.qParams['timeslot'] = this.slotTime;
        this.qParams['scheduleId'] = this.comingSchduleId;
        this.qParams['date'] = this.sel_checkindate;
        this.qParams['thirdParty'] = this.thirdParty;
        const navigationExtras: NavigationExtras = {
            queryParams: this.qParams

        };
        this.router.navigate(['/provider/customers/add'], navigationExtras);
    }
    selectMode(type) {
        this.selectedMode = type;
    }
    findCustomer(form_data, event) {
        if (event.key === 'Enter') {
            this.searchCustomer(form_data);
        }
    }
    searchCustomer(form_data) {
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
        this.qParams['source'] = 'appointment';
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
                        this.form_data = data;
                        this.create_new = true;
                    } else {
                        this.customer_data = data[0];
                        this.consumerPhoneNo = this.customer_data.phoneNo;
                        this.getFamilyMembers();
                        this.initAppointment();
                    }
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
    }
    getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.customidFormat = data.jaldeeIdFormat;
            });
    }
    initAppointment(thirdParty?) {
        if (thirdParty) {
            //     this.thirdParty = thirdParty;
            this.getGlobalSettings();
        }
        this.thirdParty = thirdParty ? thirdParty : '';
        this.api_loading1 = false;
        this.showCheckin = true;
        this.heading = 'New Appointment';
        this.waitlist_for = [];
        if (this.thirdParty === '') {
            this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName, apptTime: this.apptTime });
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

        const loc = this.sharedFunctionobj.getitemFromGroupStorage('loc_id');
        this.sel_loc = loc.id;
        // if (this.sel_checkindate === undefined) {
        //     this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
        // }
        this.minDate = this.sel_checkindate; // done to set the min date in the calendar view
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
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
                this.setTerminologyLabels();
                this.getBussinessProfileApi()
                    .then(
                        (data: any) => {
                            this.account_id = data.id;
                            this.accountType = data.accountType;
                            this.domain = data.serviceSector.domain;
                            this.getPartysizeDetails(this.domain, data.serviceSubSector.subDomain);
                            if (this.domain === 'foodJoints') {
                                this.have_note_click_here = Messages.PLACE_ORDER_CLICK_HERE;
                                this.note_placeholder = 'Item No Item Name Item Quantity';
                                this.note_cap = 'Add Note / Delivery address';
                            } else {
                                this.have_note_click_here = Messages.HAVE_NOTE_CLICK_HERE_CAP;
                                this.note_placeholder = 'Add Note';
                                this.note_cap = 'Add Note';
                            }
                            this.shared_services.getServicesforAppontmntByLocationId(this.sel_loc).subscribe(
                                (services: any) => {
                                    this.servicesjson = services;
                                    this.serviceslist = services;
                                    // this.sel_ser_det = [];
                                    if (this.servicesjson.length > 0) {
                                        //     this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                                        //     this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
                                        //     this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
                                        this.initDepartments(this.account_id).then(
                                            () => {
                                                this.handleDeptSelction(this.selected_dept);
                                            },
                                            () => {
                                                // this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                                                this.getAllUsers();
                                            }
                                        );
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
        return new Promise(function (resolve, reject) {
            _this.shared_services.getProviderDept(accountId).subscribe(data => {
                _this.departmentlist = data;
                _this.filterDepart = _this.departmentlist.filterByDept;
                for (let i = 0; i < _this.departmentlist['departments'].length; i++) {
                    if (_this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        if (_this.departmentlist['departments'][i].serviceIds.length !== 0) {
                            _this.departments.push(_this.departmentlist['departments'][i]);
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
        this.checkinLabel = this.sharedFunctionobj.firstToUpper(this.sharedFunctionobj.getTerminologyTerm('waitlist'));
        this.CheckedinLabel = this.sharedFunctionobj.firstToUpper(this.sharedFunctionobj.getTerminologyTerm('waitlisted'));
        if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
            this.main_heading = this.get_token_cap;
        } else {
            this.main_heading = this.checkinLabel;
        }
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise(function (resolve, reject) {
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
            let self_obj;
            fn = this.shared_services.getProviderCustomerFamilyMembers(this.customer_data.id);
            self_obj = {
                'userProfile': {
                    'id': this.customer_data.id,
                    'firstName': this.customer_data.firstName,
                    'lastName': this.customer_data.lastName
                }
            };
            fn.subscribe(data => {
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
    editClicked() {
        this.showEditView = true;
    }
    resetApiErrors() {
        this.emailerror = null;
        this.email1error = null;
        this.phoneerror = null;
    }
    setServiceDetails(curservid) {
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        this.callingModes = this.customer_data.phoneNo;
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
        console.log(this.sel_ser_det);
    }
    getQueuesbyLocationandServiceId(locid, servid, pdate, accountid) {
        this.queuejson = [];
        this.queueQryExecuted = false;
        if (!pdate) {
            this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
            pdate = this.sel_checkindate;
        }
        if (locid && servid) {
            this.shared_services.getProviderSchedulesbyLocationandServiceId(locid, servid, pdate, accountid)
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
                        this.setTerminologyLabels();
                        if (this.queuejson[this.sel_queue_indx].timeDuration && this.queuejson[this.sel_queue_indx].timeDuration !== 0) {
                            this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].apptSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].apptSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeDuration);
                        }
                    } else {
                        this.sel_queue_indx = -1;
                        this.sel_queue_id = 0;

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
        this.resetApi();
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
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
    // handleQueueSel(mod) {
    //     this.resetApi();
    //     if (mod === 'next') {
    //         if ((this.queuejson.length - 1) > this.sel_queue_indx) {
    //             this.sel_queue_indx = this.sel_queue_indx + 1;
    //         }
    //     } else if (mod === 'prev') {
    //         if ((this.queuejson.length > 0) && (this.sel_queue_indx > 0)) {
    //             this.sel_queue_indx = this.sel_queue_indx - 1;
    //         }
    //     }
    //     if (this.sel_queue_indx !== -1) {
    //         this.sel_queue_id = this.queuejson[this.sel_queue_indx].id;
    //         if (this.queuejson[this.sel_queue_indx].timeDuration && this.queuejson[this.sel_queue_indx].timeDuration !== 0) {
    //             this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].apptSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].apptSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeDuration);
    //         }
    //     }
    // }

    handleQueueSelection(queue, index) {
        this.sel_queue_indx = index;
        this.sel_queue_id = queue.id;
        if (queue.timeDuration && queue.timeDuration !== 0) {
            this.getAvailableTimeSlots(queue.apptSchedule.timeSlots[0]['sTime'], queue.apptSchedule.timeSlots[0]['eTime'], queue.timeDuration);
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
                    if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
                        this.getCustomerCount();
                    } else {
                        this.createCustomer();
                    }
                } else {
                    this.saveCheckin();
                }
            } else {
                this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.api_error = error;
            }
        }
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
                    this.customer_data = data[0];
                    this.waitlist_for.push({ id: data[0].id, firstName: data[0].firstName, lastName: data[0].lastName, apptTime: this.apptTime });
                    this.saveCheckin();
                });
    }
    saveCheckin() {
        this.is_wtsap_empty = false;
        if (this.waitlist_for.length !== 0) {
            for (const list of this.waitlist_for) {
                if (list.id === this.customer_data.id) {
                    list['id'] = 0;
                }
            }
        }
        // const waitlistarr = [];
        // for (let i = 0; i < this.waitlist_for.length; i++) {
        //     waitlistarr.push({ id: this.waitlist_for[i].id });
        // }
        this.virtualServiceArray = {};
        // for (let i = 0; i < this.callingModes.length; i++) {
        if (this.callingModes !== '' && this.sel_ser_det.virtualCallingModes && this.sel_ser_det.virtualCallingModes.length > 0) {
            if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Zoom') {
                this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.sel_ser_det.virtualCallingModes[0].value;
            } else {
                this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.callingModes;
            }
        }
        // }
        this.showEditView = false;
        const post_Data = {
            'schedule': {
                'id': this.sel_queue_id
            },
            'appmtDate': this.sel_checkindate,
            'service': {
                'id': this.sel_ser,
                'serviceType': this.sel_ser_det.serviceType
            },
            'consumerNote': this.consumerNote,
            'phoneNumber': this.consumerPhoneNo,
            // 'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr))
            'appmtFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'appointmentMode': this.apptType
        };
        // if (this.apptTime) {
        //     post_Data['appointmentTime'] = this.apptTime;
        // }

        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }

        if (this.sel_ser_det.serviceType === 'virtualService') {
            // post_Data['virtualService'] = this.virtualServiceArray;
            if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'WhatsApp' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Phone') {
                if (!this.callingModes || this.callingModes.length < 10) {
                    this.sharedFunctionobj.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                    this.is_wtsap_empty = true;
                }
            }
            for (const i in this.virtualServiceArray) {
                if (i === 'WhatsApp') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'GoogleMeet') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Zoom') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Phone') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                }
                //  else {
                //     post_Data['virtualService'] = {};
                // }
            }
        }
        // if (this.selectedMessage.files.length > 0 && this.consumerNote === '') {
        //     // this.api_error = this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR');
        //     this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR'), { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // if (this.partySizeRequired) {
        //     this.holdenterd_partySize = this.enterd_partySize;
        //     post_Data['partySize'] = Number(this.holdenterd_partySize);
        // }

        if (this.api_error === null) {
            post_Data['consumer'] = { id: this.customer_data.id };
            //   post_Data['ignorePrePayment'] = true;
            if (!this.is_wtsap_empty) {
                this.addAppointmentInProvider(post_Data);
            }
        }
    }
    addAppointmentInProvider(post_Data) {
        this.api_loading = true;
        //  this.shared_services.addProviderCheckin(post_Data)
        this.shared_services.addProviderAppointment(post_Data)
            .subscribe((data) => {
                this.api_loading = false;
                if (this.waitlist_for.length !== 0) {
                    for (const list of this.waitlist_for) {
                        if (list.id === 0) {
                            list['id'] = this.customer_data.id;
                        }
                    }
                }
                const retData = data;
                let retUuid;
                Object.keys(retData).forEach(key => {
                    retUuid = retData[key];
                    this.trackUuid = retData[key];
                });
                if (this.selectedMessage.files.length > 0 || this.consumerNote !== '') {
                    this.consumerNoteAndFileSave(retUuid);
                }
                // if (this.settingsjson.calculationMode !== 'NoCalc' || (this.settingsjson.calculationMode === 'NoCalc' && !this.settingsjson.showTokenId)) {
                this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('APPOINTMNT_SUCC'));
                // } else if (this.settingsjson.calculationMode === 'NoCalc' && this.settingsjson.showTokenId) {
                //    this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('TOKEN_GENERATION'));
                // }
                this.showCheckin = false;
                this.searchForm.reset();
                this.router.navigate(['provider', 'appointments']);
            },
                error => {
                    // this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
                    this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
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
                break;
        }
        this.step = cstep;
        if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
            // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
            // this.waitlist_for.push ({id: this.customer_data.id, name: 'Self'});
            this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName, apptTime: this.apptTime });
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
            this.waitlist_for.push({ id: id, firstName: name, lastName: lastName, apptTime: this.apptTime });
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
                        this.sharedFunctionobj.openSnackBar('Only ' + this.maxsize + ' member(s) can be selected', { 'panelClass': 'snackbarerror' });

                    } else if (this.maxsize === 1) {
                        // this.api_error = 'Only ' + this.maxsize + ' member can be selected';
                        this.sharedFunctionobj.openSnackBar('Only ' + this.maxsize + ' member can be selected', { 'panelClass': 'snackbarerror' });
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
            const post_data = {
                'userProfile': {
                    'firstName': this.addmemberobj.fname,
                    'lastName': this.addmemberobj.lname
                }
            };
            if (this.addmemberobj.mobile !== '') {
                post_data.userProfile['phoneNo'] = this.addmemberobj.mobile;
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
            fn = this.shared_services.addProviderCustomerFamilyMember(post_data);
            fn.subscribe(() => {
                this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('MEMBER_CREATED'), { 'panelclass': 'snackbarerror' });
                //this.api_success = this.sharedFunctionobj.getProjectMesssages('MEMBER_CREATED');
                this.getFamilyMembers();
                setTimeout(() => {
                    this.handleGoBack(3);
                }, projectConstants.TIMEOUT_DELAY);
            },
                error => {
                    // this.api_error = error.error;
                    this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.disable = false;
                    // this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR'));
                });
        } else {
            // this.api_error = derror;
            this.sharedFunctionobj.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
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
        this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
    }
    disableMinus() {
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.sharedFunctionobj.addZero(seldate.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(seldate.getDate()));
        const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.sharedFunctionobj.addZero(strtDt.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(strtDt.getDate()));
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
    handleDeptSelction(obj) {
        this.users = [];
        this.queuejson = [];
        this.api_error = '';
        this.selected_dept = obj;
        this.servicesjson = this.serviceslist;
        if (this.filterDepart) {
            const filter = {
                'departmentId-eq': obj
            };
            this.provider_services.getUsers(filter).subscribe(
                (users: any) => {
                    const filteredUser = users.filter(user => user.schedules && user.status === 'ACTIVE');
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
                            this.selected_user = this.userN;
                        }
                        console.log(this.selected_user);
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
                            if (!this.customer_data.phoneNo) {
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
                        } else {
                            this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
                        }
                    }
                });
        } else {
            this.getAllUsers();
        }
    }
    getAllUsers() {
        const filter = {
            'status-eq': 'ACTIVE',
            'userType-neq': 'ASSISTANT,ADMIN'
        };
        this.provider_services.getUsers(filter).subscribe(
            (users: any) => {
                const filteredUser = users.filter(user => user.schedules && user.status === 'ACTIVE');
                this.users = [];
                this.users = filteredUser;
                this.users.push(this.userN);
                if (this.selectUser) {
                    const userDetails = this.users.filter(user => user.id === this.selectUser);
                    this.selected_user = userDetails[0];
                    this.handleUserSelection(this.selected_user);
                    console.log(this.selected_user);
                } else if (this.users.length !== 0) {
                    this.selected_user = this.users[0];
                    console.log(this.selected_user);
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
        const newserviceArray = [];
        if (user && user.id && user.id !== 0) {
            for (let i = 0; i < this.servicesjson.length; i++) {
                if (this.servicesjson[i].provider && user.id === this.servicesjson[i].provider.id) {
                    newserviceArray.push(this.serviceslist[i]);
                }
            }
        } else {
            for (let i = 0; i < this.servicesjson.length; i++) {
                if (!this.servicesjson[i].provider && this.servicesjson[i].department === this.selected_dept) {
                    newserviceArray.push(this.serviceslist[i]);
                }
            }
        }
        if (!this.customer_data.phoneNo) {
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
        } else {
            if (this.filterDepart) {
                this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
            } else {
                this.sharedFunctionobj.openSnackBar('The selected provider doesn\'t contain any active services for this location', { 'panelClass': 'snackbarerror' });
            }
        }
    }
    getServicebyLocationId(locid, pdate) {
        this.api_loading1 = true;
        this.resetApi();
        this.shared_services.getServicesforAppontmntByLocationId(locid)
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
                    this.sharedFunctionobj.apiErrorAutoHide(this, 'Selected image type not supported');
                } else if (file.size > projectConstants.FILE_MAX_SIZE) {
                    this.sharedFunctionobj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
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
        if (this.consumerNote === '') {
            this.consumerNote = 'Please find the attachment from Consumer with this message';
        }
        dataToSend.append('message', this.consumerNote);
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
        // this.shared_services.addConsumerAppointmentNote(this.account_id, uuid,
        this.shared_services.addProviderAppointmentNote(uuid, dataToSend)
            .subscribe(
                () => {
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
    }
    getDisplayboardCount() {
        let layout_list: any = [];
        this.provider_services.getDisplayboardsAppointment()
            .subscribe(
                data => {
                    layout_list = data;
                    this.board_count = layout_list.length;
                });
    }
    getAvailableTimeSlots(QStartTime, QEndTime, interval) {
        this.api_loading = true;
        this.freeSlots = [];
        this.provider_services.getAppointmentSlotsByDate(this.sel_queue_id, this.sel_checkindate)
            .subscribe(
                (data) => {
                    this.slots = data;
                    this.availableSlots = this.slots.availableSlots;
                    for (const freslot of this.availableSlots) {
                        if (freslot.noOfAvailbleSlots !== '0' && freslot.active) {
                            this.freeSlots.push(freslot);
                        }
                    }
                    if (this.freeSlots.length > 0) {
                        // this.showSubq = 0;
                        this.showApptTime = true;
                        this.api_loading = false;
                        console.log(this.comingSchduleId);
                        console.log(this.slotTime);
                        if (this.comingSchduleId === '') {
                            this.apptTime = this.freeSlots[0].time;
                            for (const list of this.waitlist_for) {
                                list['apptTime'] = this.apptTime;
                            }
                        } else {
                            if (this.queuejson[this.sel_queue_indx].id === this.comingSchduleId) {
                                this.apptTime = this.slotTime;
                                for (const list of this.waitlist_for) {
                                    list['apptTime'] = this.apptTime;
                                }
                            } else {
                                this.apptTime = this.freeSlots[0].time;
                                for (const list of this.waitlist_for) {
                                    list['apptTime'] = this.apptTime;
                                }
                            }
                            this.comingSchduleId = '';
                        }
                        console.log(this.apptTime);
                    } else if (this.freeSlots.length === 0 && this.queuejson.length > 0) {
                        this.showApptTime = true;
                        this.api_loading = false;
                        for (let i = 0; i < this.queuejson.length; i++) {
                            if (this.queuejson[this.sel_queue_indx].id === this.queuejson[i].id) {
                                this.queuejson.splice(i, 1);
                            }
                        }
                        this.handleQueueSelection(this.queuejson[0], 0);
                    } else {
                        this.showApptTime = false;
                        this.api_loading = false;
                    }
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
    }
    toggleAttachment() {
        this.attachments = !this.attachments;
    }
    toggleNotes() {
        this.notes = !this.notes;
    }
    timeSelected(slot) {
        this.apptTime = slot;
        for (const list of this.waitlist_for) {
            list['apptTime'] = this.apptTime;
        }
        this.showEditView = false;
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
        if (this.callingModes && this.callingModes.length === 10) {
            this.showInputSection = true;
        } else if (!this.callingModes || this.callingModes.length < 10) {
            this.sharedFunctionobj.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
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
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.sharedFunctionobj.convert24HourtoAmPm(slots[0]);
    }
    showOtherSection(value) {
        if (value) {
            if (this.otherThirdParty === '') {
                this.thirdparty_error = 'Third party listing site required';
            } else {
                this.thirdParty = this.otherThirdParty;
                this.showOther = false;
                this.initAppointment(this.thirdParty);
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
        if (this.showCheckin) {
            this.showCheckin = false;
            this.heading = 'Create an Appointment';
        } else {
            this.router.navigate(['provider', 'appointments']);
        }
    }
}
