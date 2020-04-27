import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-customer-search',
    templateUrl: './customer-search.component.html'
})
export class CustomerSearchComponent implements OnInit {
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
    checkin = false;
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
    // breadcrumbs_init = [
    //     // {
    //     //     title: 'Check-ins',
    //     //     url: 'provider/check-ins'
    //     // },
    // ];
    breadcrumbs;
    // = this.breadcrumbs_init;
    breadcrumb_moreoptions: any = [];
    searchForm: FormGroup;
    selectedMode: any = 'phone';
    customer_label = '';
    qParams = {};
    action: any = '';
    showAction = false;
    customer: any = [];
    customerPhone: any;
    foundCustomer = false;
    searchClicked = false;
    appt = false;
    phoneNo: any;
    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        private activated_route: ActivatedRoute,
        public provider_services: ProviderServices) {
        this.customer_label = this.sharedFunctionobj.getTerminologyTerm('customer');
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.source) {
                this.qParams['source'] = qparams.source;
            }
            this.phoneNo = qparams.phoneNo;
            // if (qparams.appt) {

            // }
            // this.qParams = qparams;
            // if ((qparams.appt && !qparams.source) || (qparams.appt && qparams.source && qparams.source !== 'clist')) {
            //     this.appt = qparams.appt;
            // }
        });
    }
    ngOnInit() {
        this.createForm();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.api_loading = false;
        this.server_date = this.sharedFunctionobj.getitemfromLocalStorage('sysdate');
        this.get_token_cap = Messages.GET_TOKEN;
        const breadcrumbs = [
            {
                title: this.sharedFunctionobj.firstToUpper(this.customer_label) + 's',
                url: 'provider/customers'
            },
            {
                title: 'Find'
            }
        ];
        // this.breadcrumbs_init.map((e) => {
        //     breadcrumbs.push(e);
        // });
        // breadcrumbs.push(
        // );
        this.breadcrumbs = breadcrumbs;
    }
    createForm() {
        this.searchForm = this.fb.group({
            search_input: ['', Validators.compose([Validators.required])]
        });
        if (this.phoneNo) {
            this.searchForm.setValue({ search_input: this.phoneNo });
            this.searchCustomer(this.searchForm);
        }
    }
    createNew() {
        const navigationExtras: NavigationExtras = {
            queryParams: this.qParams
        };
        this.router.navigate(['/provider/customers/add'], navigationExtras);
    }

    checkinClicked() {
        const navigationExtras: NavigationExtras = {
            queryParams: { ph: this.customerPhone }
        };
        if (this.appt) {
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
        } else {
            this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
        }
    }
    selectMode(type) {
        this.selectedMode = type;
    }
    findCustomer(form_data, event) {
        this.searchClicked = null;
        if (event.key === 'Enter') {
            this.searchCustomer(form_data);
        }
    }

    searchCustomer(form_data, mod?) {
        let mode = 'id';
        if (mod) {
            mode = mod;
        }
        this.form_data = null;
        this.create_new = false;
        console.log(form_data);
        let post_data = {};
        const emailPattern = new RegExp(projectConstants.VALIDATOR_EMAIL);
        const isEmail = emailPattern.test(form_data.search_input);
        if (isEmail) {
            mode = 'email';
        } else {
            const phonepattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
            const isNumber = phonepattern.test(form_data.search_input);
            const phonecntpattern = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
            const isCount10 = phonecntpattern.test(form_data.search_input);
            if (isNumber && isCount10) {
                mode = 'phone';
            } else {
                mode = 'id';
            }
        }
        // if (this.appt) {
        //     this.qParams['source'] = 'appointment';
        // } else {
        //     this.qParams['source'] = 'checkin';
        // }
        switch (mode) {
            case 'phone':
                post_data = {
                    'phoneNo-eq': form_data.search_input
                };
                this.qParams['phone'] = form_data.search_input;
                break;
            case 'email':
                this.qParams['phone'] = form_data.search_input;
                post_data = {
                    'email-eq': form_data.search_input
                };
                break;
            case 'customer_id':
                post_data = {
                    'id-eq': form_data.search_input
                };
                break;
        }
        console.log(post_data);
        this.foundCustomer = false;
        this.provider_services.getCustomer(post_data)
            .subscribe(
                (data: any) => {
                    if (data.length === 0) {
                        this.form_data = data;
                        this.create_new = true;
                        this.searchClicked = true;
                    } else {
                        this.foundCustomer = true;
                        console.log(data[0]);
                        this.customer_data = data[0];
                        this.customerPhone = this.customer_data.phoneNo;
                        this.searchClicked = true;
                    }
                },
                error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                }
            );
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
    resetApiErrors(event) {
        this.emailerror = null;
        this.email1error = null;
        this.phoneerror = null;
    }
}
