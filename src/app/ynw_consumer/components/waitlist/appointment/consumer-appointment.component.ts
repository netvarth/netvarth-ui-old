import { Component, OnInit } from '@angular/core';
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
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { MatDialog, MatCalendarCellCssClasses } from '@angular/material';
@Component({
    selector: 'app-consumer-appointment',
    templateUrl: './consumer-appointment.component.html',
    styleUrls: ['./consumer-appointment.component.css']
})
export class ConsumerAppointmentComponent implements OnInit {
    checkinSubscribtion: Subscription;
    select_service_cap = Messages.SELECT_SER_CAP;
    select_deptment_cap = Messages.SELECT_DEPT_CAP;
    no_services_avail_cap = Messages.NO_SER_AVAIL_CAP;
    add_change_member = Messages.ADD_CHANGE_MEMBER;
    date_cap = Messages.DATE_CAP;
    serv_time_window_cap = Messages.SERV_TIME_WINDOW_CAP;
    enter_party_size_cap = Messages.ENTER_PARTY_SIZE;
    have_note_click_here = '';
    not_accepted_for_this_date = Messages.NOT_ACCEPTED_THIS_DATE_CAP1;
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
    userN = { 'id': 0, 'firstName': Messages.NOUSERCAP, 'lastName': '' };
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

    userData: any = [];
    userEmail;
    userPhone;
    currentPhone;
    users: any = [];
    emailExist = false;
    payEmail;
    payEmail1;
    emailerror = null;
    email1error = null;
    phoneerror = null;
    edit = true;
    changePhno = false;
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
    subscription: Subscription;
    showCouponWB: boolean;
    change_date: any;
    liveTrack = false;
    showAction = false;
    carouselOne;
    notes = false;
    attachments = false;
    action: any = '';
    showEditView = false;
    slots;
    freeSlots: any = [];
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    showInputSection = false;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    showApptTime = false;
    wtsapmode: any;
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
    selectedService: any;
    note_cap = '';
    servicedialogRef: any;
    apptdisable = false;
    availableDates: any = [];
    holdselectedTime;
    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        public route: ActivatedRoute,
        public provider_services: ProviderServices,
        public datastorage: CommonDataStorageService,
        public location: Location,
        public dialog: MatDialog) {
        this.route.queryParams.subscribe(
            params => {

                this.sel_loc = params.loc_id;
                if (params.qid) {
                    this.sel_queue_id = params.qid;
                }
                this.change_date = params.cur;
                this.futureAppt = params.futureAppt;
                this.account_id = params.account_id;
                this.provider_id = params.unique_id;
                this.sel_checkindate = params.sel_date;
                // this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
                this.hold_sel_checkindate = this.sel_checkindate;
                this.tele_srv_stat = params.tel_serv_stat;
                if (params.dept) {
                    // tslint:disable-next-line:radix
                    this.selectedDeptParam = parseInt(params.dept);
                    this.filterDepart = true;
                }
                if (params.user) {
                    this.selectedUserParam = params.user;
                }
                if (params.service_id) {
                    // tslint:disable-next-line:radix
                    this.selectedService = parseInt(params.service_id);
                }
                if (params.type === 'reschedule') {
                    this.type = params.type;
                    this.rescheduleUserId = params.uuid;
                    this.getRescheduleApptDet();
                }
            });
    }
    ngOnInit() {
        this.server_date = this.sharedFunctionobj.getitemfromLocalStorage('sysdate');
        this.carouselOne = {
            dots: false,
            nav: true,
            navContainer: '.checkin-nav',
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            autoplay: false,
            mouseDrag: false,
            touchDrag: true,
            pullDrag: false,
            loop: false,
            responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 2 }, 1200: { items: 3 } }
        };
        const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
        if (activeUser) {
            this.isfirstCheckinOffer = activeUser.firstCheckIn;
            this.customer_data = activeUser;
        }
        this.main_heading = this.checkinLabel; // 'Check-in';
        this.get_token_cap = Messages.GET_TOKEN;
        this.maxsize = 1;
        this.step = 1;
        this.getProfile();
        this.gets3curl();
        this.getFamilyMembers();
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
        this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        this.minDate = this.todaydate;
        if (this.change_date === 'true') {
            const seldateChecker = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const seldate_checker = new Date(seldateChecker);
            const todaydateChecker = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const todaydate_checker = new Date(todaydateChecker);
            if (seldate_checker.getTime() === todaydate_checker.getTime()) { // if the next available date is today itself, then add 1 day to the date and use it
                const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const serverdate = moment(server).format();
                const servdate = new Date(serverdate);
                const nextdate = new Date(seldate_checker.setDate(servdate.getDate() + 1));
                this.sel_checkindate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
            }
        }
        // }
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;
        this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
        const dt1 = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date1 = new Date(dt1);
        const dt2 = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date2 = new Date(dt2);
        if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        }
        this.showfuturediv = false;
        this.revealphonenumber = true;
        this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);

    }
    getRescheduleApptDet() {
        this.shared_services.getAppointmentByConsumerUUID(this.rescheduleUserId, this.account_id).subscribe(
            (appt: any) => {
                this.appointment = appt;
                this.sel_loc = this.appointment.location.id;
                this.selectedService = this.appointment.service.id;
                this.sel_checkindate = this.hold_sel_checkindate = this.appointment.appmtDate;
                this.sel_ser = this.appointment.service.id;
                this.holdselectedTime = this.appointment.appmtTime;
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                // this.getAvailableSlotByLocationandService(this.sel_loc, this.selectedService, this.sel_checkindate, this.account_id);
            });

    }
    createForm() {
        this.searchForm = this.fb.group({
            mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
            Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
            first_last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        });
    }
    isDepartmentHaveServices(serviceIds: any, servicesjson: any) {
        let found = false;
        for (let j = 0; j < servicesjson.length; j++) {
            if (serviceIds.indexOf(servicesjson[j].id) !== -1) {
                found = true;
                break;
            }
        }
        return found;
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
        this.api_loading1 = true;
        let fn;
        let self_obj;
        fn = this.shared_services.getConsumerFamilyMembers();
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
            this.userPhone = this.selected_phone;
            this.currentPhone = this.selected_phone;
            this.action = '';
            this.changePhno = true;
        }
    }
    changeSlot() {
        this.action = 'slotChange';

    }
    editPhone() {
        this.action = 'phone';
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
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        this.callingModes = this.customer_data.primaryPhoneNumber;
                        this.wtsapmode = this.customer_data.primaryPhoneNumber;
                    }
                }
                break;
            }
        }
        this.sel_ser_det = [];
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
        this.sel_ser = serv.id;
        this.sel_ser_det = {
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
        this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount;
    }
    getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        _this.shared_services.getAvailableDatessByLocationService(locid, servid, accountid)
            .subscribe((data: any) => {
                const availables = data.filter(obj => obj.availableSlots);
                const availDates = availables.map(function (a) { return a.date; });
                _this.availableDates = availDates.filter(function (elem, index, self) {
                    return index === self.indexOf(elem);
                });
            });
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    getAvailableSlotByLocationandService(locid, servid, pdate, accountid) {
        this.shared_services.getSlotsByLocationServiceandDate(locid, servid, pdate, accountid)
            .subscribe(data => {
                this.slots = data;
                this.freeSlots = [];
                for (const scheduleSlots of this.slots) {
                    this.availableSlots = scheduleSlots.availableSlots;
                    for (const freslot of this.availableSlots) {
                        if ((freslot.noOfAvailbleSlots !== '0' && freslot.active) || freslot.time === this.appointment.appmtTime) {
                        // if (freslot.noOfAvailbleSlots !== '0' && freslot.active) {
                            freslot['scheduleId'] = scheduleSlots['scheduleId'];
                            freslot['displayTime'] = this.getSingleTime(freslot.time);
                            this.freeSlots.push(freslot);
                        }
                    }
                }
                console.log(this.freeSlots);
                console.log(this.appointment.appmtTime);
                if (this.freeSlots.length > 0) {
                    this.showApptTime = true;
                    if (this.appointment.length > 0) {
                        const appttime = this.freeSlots.filter(slot => slot.time == this.appointment.appmtTime);
                        this.apptTime = appttime[0];
                    } else {
                        this.apptTime = this.freeSlots[0];
                    }
                    this.waitlist_for[0].apptTime = this.apptTime['time'];
                } else {
                    this.showApptTime = false;
                }
                console.log(this.apptTime);
                this.api_loading1 = false;
            });
    }
    // handleUserSelection(user) {
    //     this.selectedUser = user;
    //     this.servicesjson = this.serviceslist;
    //     const newserviceArray = [];
    //     if (user.id && user.id !== 0) {
    //         for (let i = 0; i < this.servicesjson.length; i++) {
    //             if (this.servicesjson[i].provider && user.id === this.servicesjson[i].provider.id) {
    //                 newserviceArray.push(this.serviceslist[i]);
    //             }
    //         }
    //     } else {
    //         for (let i = 0; i < this.servicesjson.length; i++) {
    //             if (!this.servicesjson[i].provider && this.servicesjson[i].department === this.selected_dept) {
    //                 newserviceArray.push(this.serviceslist[i]);
    //             }
    //         }
    //     }
    //     this.servicesjson = newserviceArray;
    //     if (this.servicesjson[0] && this.servicesjson[0].id) {
    //         this.handleServiceSel(this.servicesjson[0].id);
    //     }
    // }
    handleServiceSel(obj) {
        this.callingModes = [];
        this.showInputSection = false;
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        // this.queuejson = [];
        // this.sel_queue_id = 0;
        // this.sel_queue_waitingmins = 0;
        // this.sel_queue_servicetime = '';
        // this.sel_queue_personaahead = 0;
        // this.sel_queue_name = '';
        this.resetApi();
        this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        this.action = '';
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
    handleFuturetoggle() {
        this.showfuturediv = !this.showfuturediv;
    }
    isCheckinenable() {
        if (this.sel_loc && this.sel_ser && this.sel_checkindate) {
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
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        // this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    handleServiceForWhom() {
        this.resetApi();
        this.holdwaitlist_for = this.waitlist_for;
        this.step = 3;
        this.main_heading = 'Family Members';
    }
    handleApptClicked() {
        this.apptdisable = true;
        this.resetApi();
        let error = '';
        if (this.step === 1) {
            if (this.partySizeRequired) {
                this.clearerrorParty();
                error = this.validatorPartysize(this.enterd_partySize);
            }
            if (error === '') {
                this.saveCheckin();
            } else {
                this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.apptdisable = false;
            }
        }
    }
    saveCheckin() {
        if (this.waitlist_for.length !== 0) {
            for (const list of this.waitlist_for) {
                if (list.id === this.customer_data.id) {
                    list['id'] = 0;
                }
            }
        }
        this.showEditView = false;
        this.virtualServiceArray = {};
        if (this.callingModes !== '') {
            this.is_wtsap_empty = false;
            if (this.sel_ser_det.serviceType === 'virtualService') {
                if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Zoom') {
                    this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.sel_ser_det.virtualCallingModes[0].value;
                } else {
                    this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.callingModes;
                }
            }
        } else if (this.callingModes === '' || this.callingModes.length < 10) {
            if (this.sel_ser_det.serviceType === 'virtualService') {
                for (const i in this.sel_ser_det.virtualCallingModes) {
                    if (this.sel_ser_det.virtualCallingModes[i].callingMode === 'WhatsApp' || this.sel_ser_det.virtualCallingModes[i].callingMode === 'Phone') {
                        this.sharedFunctionobj.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                        this.is_wtsap_empty = true;
                        break;
                    }
                }
            }
        }
        let phNumber;
        if (this.currentPhone && this.changePhno) {
            phNumber = this.currentPhone;
        } else {
            phNumber = this.userPhone;
        }
        const post_Data = {
            'schedule': {
                'id': this.apptTime['scheduleId']
            },
            'appmtDate': this.sel_checkindate,
            'service': {
                'id': this.sel_ser,
                'serviceType': this.sel_ser_det.serviceType
            },
            'consumerNote': this.consumerNote,
            'phoneNumber': phNumber,
            'appmtFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'coupons': this.selected_coupons
        };

        // if (this.apptTime) {
        // post_Data['appointmentTime'] = this.apptTime['time'];
        // }
        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }
        if (this.sel_ser_det.serviceType === 'virtualService') {
            //  post_Data['virtualService'] = this.virtualServiceArray;
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
                // else {
                //     post_Data['virtualService'] = {};
                // }
            }
        }
        // if (this.selectedMessage.files.length > 0 && this.consumerNote === '') {
        //     // this.api_error = this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR');
        //     this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR'), { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // if (this.partySizeRequired) {
        //     this.holdenterd_partySize = this.enterd_partySize;
        //     post_Data['partySize'] = Number(this.holdenterd_partySize);
        // }
        // post_Data['waitlistPhoneNumber'] = this.consumerPhoneNo;
        if (this.api_error === null) {
            // post_Data['consumer'] = { id: this.customer_data.id };
            // post_Data['ignorePrePayment'] = true;
            if (!this.is_wtsap_empty) {
                this.addCheckInConsumer(post_Data);
            }
            //  this.addCheckInConsumer(post_Data);
        }
    }
    rescheduleAppointment() {
        this.apptdisable = true;
        const post_Data = {
            'uid': this.rescheduleUserId,
            'time': this.apptTime['time'],
            'date': this.sel_checkindate,
            'schedule': this.apptTime['scheduleId']
        };
        this.shared_services.rescheduleConsumerApptmnt(this.account_id, post_Data)
            .subscribe(
                () => {
                    this.apptdisable = false;
                    if (this.selectedMessage.files.length > 0 || this.consumerNote !== '') {
                        this.consumerNoteAndFileSave(this.rescheduleUserId);
                    }
                    this.router.navigate(['consumer', 'appointment', 'confirm'], { queryParams: { account_id: this.account_id, uuid: this.appointment.uid, type: 'reschedule' } });
                },
                error => {
                    this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.apptdisable = false;
                });
    }
    addCheckInConsumer(post_Data) {
        this.api_loading = true;
        this.shared_services.addCustomerAppointment(this.account_id, post_Data)
            .subscribe(data => {
                const retData = data;
                if (this.waitlist_for.length !== 0) {
                    for (const list of this.waitlist_for) {
                        if (list.id === 0) {
                            list['id'] = this.customer_data.id;
                        }
                    }
                }
                let retUUID;
                Object.keys(retData).forEach(key => {
                    retUUID = retData[key];
                    this.trackUuid = retData[key];
                });
                if (this.selectedMessage.files.length > 0 || this.consumerNote !== '') {
                    this.consumerNoteAndFileSave(retUUID);
                }
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        account_id: this.account_id,
                        type_check: 'appt_prepayment'
                    }
                };
                if (this.sel_ser_det.isPrePayment) {
                    this.router.navigate(['consumer', 'appointment', 'payment', this.trackUuid], navigationExtras);
                } else {
                    this.router.navigate(['consumer', 'appointment', 'confirm'], { queryParams: { account_id: this.account_id, uuid: this.trackUuid } });
                }
            },
                error => {
                    this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
                    this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.apptdisable = false;
                });
    }
    addEmail() {
        this.resetApiErrors();
        this.resetApi();
        let post_data;
        let passtyp;
        if (this.payEmail) {
            const stat = this.validateEmail(this.payEmail.trim());
            if (!stat) {
                this.emailerror = 'Please enter a valid email.';
                this.sharedFunctionobj.openSnackBar(this.email1error, { 'panelClass': 'snackbarerror' });
            }
        }
        if (this.payEmail1) {
            const stat1 = this.validateEmail(this.payEmail1.trim());
            if (!stat1) {
                this.email1error = 'Please enter a valid email.';
                this.sharedFunctionobj.openSnackBar(this.email1error, { 'panelClass': 'snackbarerror' });
            }
        }
        // return new Promise((resolve) => {
        if (this.payEmail.trim() === this.payEmail1.trim()) {
            post_data = {
                'id': this.userData.userProfile.id || null,
                'firstName': this.userData.userProfile.firstName || null,
                'lastName': this.userData.userProfile.lastName || null,
                'dob': this.userData.userProfile.dob || null,
                'gender': this.userData.userProfile.gender || null,
                'email': this.payEmail.trim() || ''
            };
            passtyp = 'consumer';
            if (this.payEmail) {
                this.shared_services.updateProfile(post_data, passtyp)
                    .subscribe(
                        () => {
                            this.getProfile();
                            // this.hideFilterSidebar();
                            this.action = '';
                        },
                        error => {
                            this.api_error = error.error;
                            this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            }
        } else {
            this.email1error = 'Email and Re-entered Email do not match';
            this.sharedFunctionobj.openSnackBar(this.email1error, { 'panelClass': 'snackbarerror' });
        }
    }
    // handleGoBack(cstep) {
    //     this.resetApi();
    //     switch (cstep) {
    //         case 1:
    //             this.hideFilterSidebar();
    //             break;
    //         case 2:
    //             if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
    //                 this.main_heading = this.get_token_cap;
    //             } else {
    //                 this.main_heading = this.checkinLabel;
    //             }
    //             break;
    //         case 3:
    //             this.main_heading = 'Family Members';
    //             this.showCreateMember = false;
    //             this.disable = false;
    //             this.addmemberobj.fname = '';
    //             this.addmemberobj.lname = '';
    //             this.addmemberobj.mobile = '';
    //             this.addmemberobj.gender = '';
    //             this.addmemberobj.dob = '';
    //             break;
    //     }
    //     this.step = cstep;
    //     if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
    //         this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName, apptTime: this.apptTime['time'] });
    //     }
    // }
    showCheckinButtonCaption() {
        let caption = '';
        caption = 'Confirm';
        return caption;
    }
    handleOneMemberSelect(id, firstName, lastName) {
        this.resetApi();
        this.waitlist_for = [];
        this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.apptTime['time'] });
    }
    handleMemberSelect(id, firstName, lastName, obj) {
        this.resetApi();
        if (this.waitlist_for.length === 0) {
            this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.apptTime['time'] });
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
                    this.waitlist_for.push({ id: id, lastName: lastName, firstName: firstName, apptTime: this.apptTime['time'] });
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
        this.action = 'addmember';
        this.disable = false;
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
            fn.subscribe(() => {
                this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('MEMBER_CREATED'), { 'panelclass': 'snackbarerror' });
                this.getFamilyMembers();
                // this.goBack();
                setTimeout(() => {
                    this.goBack();
                }, projectConstants.TIMEOUT_DELAY);
            },
                error => {
                    this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.disable = false;
                });
        } else {
            this.sharedFunctionobj.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
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
        this.action = 'email';
        // if (this.dispCustomerEmail) {
        //     this.dispCustomerEmail = false;
        // } else {
        //     this.dispCustomerEmail = true;
        // }
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
        // const strtDt1 = this.hold_sel_checkindate + ' 00:00:00';
        const strtDt1 = this.todaydate + ' 00:00:00';
        const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
        const nDt = new Date(ndate);
        if (nDt.getTime() >= strtDt.getTime()) {
            this.sel_checkindate = ndate;
            this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
            // this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
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
    setUserDetails(selectedUserId) {
        const userDetail = this.users.filter(user => user.id === selectedUserId);
        this.selectedUser = userDetail[0];
    }
    clearerrorParty() {
        this.partyapi_error = '';
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
        this.shared_services.getProviderDept(id).
            subscribe(data => {
                this.departmentlist = data;
                this.filterDepart = this.departmentlist.filterByDept;
                for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                    if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        this.departments.push(this.departmentlist['departments'][i]);
                        if (this.selectedDeptParam && this.selectedDeptParam === this.departmentlist['departments'][i].departmentId) {
                            this.selected_dept = this.departmentlist['departments'][i];
                        }
                        // if (this.departmentlist['departments'][i].serviceIds.length !== 0) {
                        //    if (this.isDepartmentHaveServices(this.departmentlist['departments'][i].serviceIds, this.servicesjson)) {
                        //        this.departments.push(this.departmentlist['departments'][i]);
                        //    }
                        // }
                    }
                }
                // this.deptLength = this.departments.length;
                // if (this.selectedDeptParam) {
                // this.selected_dept = JSON.parse(this.selectedDeptParam);
                // this.handleDeptSelction(this.selected_dept);
                // } else {
                if (!this.selectedDeptParam) {
                    this.selected_dept = this.departments[0];
                    // this.handleDeptSelction(this.selected_dept);
                }
                // }
                // if (this.filterDepart) {
                // }
            });
    }
    // handleDeptSelction(obj) {
    //     this.api_error = '';
    //     this.selected_dept = obj;
    //     this.servicesjson = this.serviceslist;
    //     if (this.filterDepart) {
    //         this.shared_services.getUsersByDept(this.account_id, obj).subscribe(
    //             (users: any) => {
    //                 this.users = [];
    //                 let found = false;
    //                 for (let serviceIndex = 0; serviceIndex < this.servicesjson.length; serviceIndex++) {
    //                     for (let userIndex = 0; userIndex < users.length; userIndex++) {
    //                         if (this.servicesjson[serviceIndex].provider && this.servicesjson[serviceIndex].provider.id === users[userIndex].id) {
    //                             if (this.users.indexOf(users[userIndex]) === -1) {
    //                                 this.users.push(users[userIndex]);
    //                             }
    //                             break;
    //                         }
    //                         if (this.servicesjson[serviceIndex].department === this.selected_dept && !this.servicesjson[serviceIndex].provider) {
    //                             found = true;
    //                         }
    //                     }
    //                 }
    //                 if (found) {
    //                     // addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
    //                     this.users.push(this.userN);
    //                 }
    //                 if (this.selectedUserParam) {
    //                     const userDetail = this.users.filter(user => user.id === JSON.parse(this.selectedUserParam));
    //                     this.selected_user = userDetail[0];
    //                     this.handleUserSelection(this.selected_user);
    //                 } else {
    //                     if (this.users.length !== 0) {
    //                         this.selected_user = this.users[0];
    //                         this.handleUserSelection(this.selected_user);
    //                     } else {
    //                         for (let i = 0; i < this.departmentlist['departments'].length; i++) {
    //                             if (obj === this.departmentlist['departments'][i].departmentId) {
    //                                 this.services = this.departmentlist['departments'][i].serviceIds;
    //                             }
    //                         }
    //                         const newserviceArray = [];
    //                         if (this.services) {
    //                             for (let i = 0; i < this.serviceslist.length; i++) {
    //                                 for (let j = 0; j < this.services.length; j++) {
    //                                     if (this.services[j] === this.serviceslist[i].id) {
    //                                         newserviceArray.push(this.serviceslist[i]);
    //                                     }
    //                                 }
    //                             }
    //                             this.servicesjson = newserviceArray;
    //                         }
    //                         if (this.servicesjson.length > 0) {
    //                             this.sel_ser = this.servicesjson[0].id;
    //                             this.setServiceDetails(this.sel_ser);
    //                             this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    //                         } else {
    //                             this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT'), { 'panelClass': 'snackbarerror' });
    //                         }
    //                     }
    //                 }
    //             });
    //     }
    // }
    getServicebyLocationId(locid, pdate) {
        this.api_loading1 = true;
        this.resetApi();
        this.shared_services.getServicesforAppontmntByLocationId(locid)
            .subscribe(data => {
                // if (this.tele_srv_stat === '1' || this.tele_srv_stat === 'true') {
                //     this.servicesjson = data;
                // } else {
                //     this.servicesjson = [];
                //     for (const i in data) {
                //         if (data[i].serviceType !== 'virtualService') {
                //             this.servicesjson.push(data[i]);
                //         }
                //     }
                // }
                this.servicesjson = data;
                this.serviceslist = this.servicesjson;
                this.sel_ser_det = [];
                if (this.selectedService) {
                    this.sel_ser = this.selectedService;
                } else {
                    if (this.servicesjson.length > 0) {
                        this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
                    }
                }
                if (this.sel_ser) {
                    this.setServiceDetails(this.sel_ser);
                    this.getAvailableSlotByLocationandService(locid, this.sel_ser, pdate, this.account_id);
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.sel_ser = '';
                });
    }
    getServiceById(serviceId) {
        let selectedService;
        for (const service of this.servicesjson) {
            if (service.id === serviceId) {
                selectedService = service;
                break;
            }
        }
        return selectedService;
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
        this.shared_services.addConsumerAppointmentNote(this.account_id, uuid,
            dataToSend)
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
        this.freeSlots = [];
        this.shared_services.getTodaysAvailableTimeSlots(this.sel_checkindate, this.sel_queue_id, this.account_id)
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
                        this.showApptTime = true;
                        this.apptTime = this.freeSlots[0];
                    } else {
                        this.showApptTime = false;
                    }
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
    }
    timeSelected(slot) {
        this.apptTime = slot;
        this.waitlist_for[0].apptTime = this.apptTime['time'];
        this.action = '';
    }
    getProfile() {
        this.sharedFunctionobj.getProfile()
            .then(
                data => {
                    this.userData = data;
                    if (this.userData.userProfile !== undefined) {
                        this.userEmail = this.userData.userProfile.email || '';
                        this.userPhone = this.userData.userProfile.primaryMobileNo || '';
                        // this.consumerPhoneNo = this.userPhone;
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
        this.retval = this.sharedFunctionobj.getS3Url()
            .then(
                res => {
                    this.s3url = res;
                    this.getbusinessprofiledetails_json('businessProfile', true);
                    this.getbusinessprofiledetails_json('settings', true);
                    this.getbusinessprofiledetails_json('departmentProviders', true);
                    this.getbusinessprofiledetails_json('coupon', true);
                    if (!this.terminologiesjson) {
                        this.getbusinessprofiledetails_json('terminologies', true);
                    } else {
                        if (this.terminologiesjson.length === 0) {
                            this.getbusinessprofiledetails_json('terminologies', true);
                        } else {
                            this.datastorage.set('terminologies', this.terminologiesjson);
                            this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
                        }
                    }
                    this.api_loading1 = false;
                },
                () => {
                    this.api_loading1 = false;
                }
            );
    }
    // gets the various json files based on the value of "section" parameter
    getbusinessprofiledetails_json(section, modDateReq: boolean) {
        let UTCstring = null;
        if (modDateReq) {
            UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
        }
        this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
            .subscribe(res => {
                switch (section) {
                    case 'settings':
                        this.settingsjson = res;
                        this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                        /*this.maxsize = this.settingsjson.maxPartySize;
                        if (this.maxsize === undefined) {
                        this.maxsize = 1;
                        }*/
                        break;
                    case 'terminologies':
                        this.terminologiesjson = res;
                        this.datastorage.set('terminologies', this.terminologiesjson);
                        this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
                        this.setTerminologyLabels();
                        break;
                    case 'businessProfile':
                        this.businessjson = res;
                        this.accountType = this.businessjson.accountType;
                        if (this.accountType === 'BRANCH') {
                            this.getProviderDepart(this.businessjson.id);
                        }
                        this.domain = this.businessjson.serviceSector.domain;
                        if (this.domain === 'foodJoints') {
                            this.have_note_click_here = Messages.PLACE_ORDER_CLICK_HERE;
                            this.note_placeholder = 'Item No Item Name Item Quantity';
                            this.note_cap = 'Add Note / Delivery address';
                        } else {
                            this.have_note_click_here = Messages.HAVE_NOTE_CLICK_HERE_CAP;
                            this.note_placeholder = '';
                            this.note_cap = 'Add Note';
                        }
                        this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
                        break;
                    case 'coupon':
                        this.s3CouponsList = res;
                        if (this.s3CouponsList.length > 0) {
                            this.showCouponWB = true;
                        }
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
                        // this.users.push(this.userN);
                        // if (this.users.length !== 0) {
                        //     if (this.selectedUserParam) {
                        //         const userDetail = this.users.filter(user => user.id === JSON.parse(this.selectedUserParam));
                        //         this.selected_user = userDetail[0];
                        //         // this.handleUserSelection(this.selected_user);
                        //     } else {
                        //         this.selected_user = this.userN;
                        //         // this.handleUserSelection(this.selected_user);
                        //     }
                        // }
                        break;
                    }
                }
            },
                () => {
                }
            );
    }
    toggleAttachment() {
        this.attachments = !this.attachments;
    }
    toggleNotes() {
        this.notes = !this.notes;
    }
    handleSideScreen(action) {
        this.showAction = true;
        this.action = action;
    }
    // hideFilterSidebar() {
    //     this.showAction = false;
    //     this.payEmail = '';
    //     this.payEmail1 = '';
    // }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }
    addCallingmode() {
        if (this.callingModes === '' || this.callingModes.toString().length < 10 || this.callingModes.charAt(0) === '0'
        ) {
            this.sharedFunctionobj.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
        } else if (this.callingModes && this.callingModes.toString().length === 10 || this.callingModes.charAt(0) === '0'
        ) {
            this.showInputSection = true;
        }
    }
    // handleModeSel(index, ev) {
    //     if (ev.checked) {
    //         this.showInputSection[index] = true;
    //     } else {
    //         this.showInputSection[index] = false;
    //         this.callingModes[index] = '';
    //     }
    // }
    editCallingmodes() {
        this.showInputSection = false;
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
    applyCoupons(jCoupon) {
        this.api_cp_error = null;
        this.couponvalid = true;
        const couponInfo = {
            'couponCode': '',
            'instructions': ''
        };
        if (jCoupon) {
            const jaldeeCoupn = jCoupon.trim();
            if (this.checkCouponExists(jaldeeCoupn)) {
                this.api_cp_error = 'Coupon already applied';
                this.couponvalid = false;
                return false;
            }
            this.couponvalid = false;
            let found = false;
            for (let couponIndex = 0; couponIndex < this.s3CouponsList.length; couponIndex++) {
                if (this.s3CouponsList[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
                    this.selected_coupons.push(this.s3CouponsList[couponIndex].jaldeeCouponCode);
                    couponInfo.couponCode = this.s3CouponsList[couponIndex].jaldeeCouponCode;
                    couponInfo.instructions = this.s3CouponsList[couponIndex].consumerTermsAndconditions;
                    this.couponsList.push(couponInfo);
                    found = true;
                    this.selected_coupon = '';
                    break;
                }
            }
            if (found) {
                this.couponvalid = true;
            } else {
                this.api_cp_error = 'Coupon invalid';
            }
        } else {
            this.api_cp_error = 'Enter a Coupon';
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
    }
    removeCoupons() {
        this.selected_coupons = [];
        this.couponsList = [];
        this.coupon_status = null;
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.sharedFunctionobj.convert24HourtoAmPm(slots[0]);
    }
    getPic(user) {
        if (user.profilePicture) {
            // alert(JSON.parse(user.profilePicture)['url']);
            return JSON.parse(user.profilePicture)['url'];
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
        //     this.action = 'departments';
        //     for (let i = 0; i < this.servicesjson.length; i++) {
        //         if (this.servicesjson[i].provider) {
        //             this.servicesjson[i].provider['businessName'] = this.getUserName(this.servicesjson[i].provider.id);
        //         }
        //     }
        // } else {
        this.action = 'service';
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].provider) {
                this.servicesjson[i].provider['businessName'] = this.getUserName(this.servicesjson[i].provider.id);
            }
        }
        // }
    }
    goBack() {
        if (this.action === '') {
            this.location.back();
        } else if (this.action === 'note' || this.action === 'members' || (this.action === 'service' && !this.filterDepart)
            || this.action === 'attachment' || this.action === 'coupons' || this.action === 'departments' ||
            this.action === 'phone' || this.action === 'email') {
            this.action = '';
        } else if (this.action === 'addmember') {
            this.action = 'members';
        } else if (this.action === 'service' && this.filterDepart) {
            this.action = '';
        } else if (this.action === 'preInfo') {
            this.action = '';
        }
        else if (this.action === 'slotChange') {
            this.action = '';
        }
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
        // if (this.servicesjson[0] && this.servicesjson[0].id) {
        //     this.handleServiceSel(this.servicesjson[0].id);
        // }
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
    // viewSelectedUser(userId) {
    //     this.router.navigate(['', this.provider_id + '_' + userId]);
    // }
    showPreInfo() {
        this.action = 'preInfo';
    }
    disableButn() {
        if (moment(this.sel_checkindate).format('YYYY-MM-DD') === this.hold_sel_checkindate && this.apptTime['time'] === this.holdselectedTime) {
            return true;
        } else {
            return false;
        }
    }
}
