import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';


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

    mobile_cap = Messages.MOBILE_CAP;
    f_name_cap = Messages.F_NAME_CAP;
    l_name_cap = Messages.L_NAME_CAP;
    email_cap = Messages.EMAIL_ID_CAP;
    gender_cap = Messages.GENDER_CAP;
    male_cap = Messages.MALE_CAP;
    female_cap = Messages.FEMALE_CAP;
    dob_cap = Messages.DOB_CAP;
    adrress_cap = Messages.ADDRESS_CAP;
    tday = new Date();


    save_btn = Messages.SAVE_BTN;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
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
    breadcrumbs_init = [
        // {
        //     title: 'Check-ins',
        //     url: 'provider/check-ins'
        // },
        {
            title: 'Customers',
            url: 'provider/customers'
        },
        {
            title: 'Add'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
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
    eMail: any;
    customerId;
    customerName;
    checkin_type;
    haveMobile = true;
    loading = false;
    customidFormat;
    amForm: FormGroup;
    email: any;
    disableButton = false;
    appointmentScheduleId;
    appointmentSlot;
    appointmentDate;
    checkinType;
    isFrom;




    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        private activated_route: ActivatedRoute,
        private _location: Location,
        public provider_services: ProviderServices) {
        this.customer_label = this.sharedFunctionobj.getTerminologyTerm('customer');
        this.activated_route.queryParams.subscribe(qparams => {
            if (qparams.isFrom) {
                this.isFrom = qparams.isFrom;
            }
            if (qparams.scheduleId) {
                this.appointmentScheduleId = qparams.scheduleId;
            }
            if (qparams.timeslot) {
                this.appointmentSlot = qparams.timeslot;
            }
            if (qparams.checkinType) {
                this.checkinType = qparams.checkinType;
            }
            if (qparams.date) {
                this.appointmentDate = qparams.date;
            }
            this.customerId = qparams.id;
            if (this.customerId) {
                if (this.customerId === 'add') {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.action = 'add';
                    this.createForm();
                } else {
                    this.activated_route.queryParams.subscribe(
                        (qParams) => {
                            this.action = qParams.action;
                            this.getCustomers(this.customerId).then(
                                (customer) => {
                                    this.customer = customer;
                                    this.customerName = this.customer[0].firstName;
                                    if (this.action === 'edit') {
                                        const breadcrumbs = [];
                                        this.breadcrumbs_init.map((e) => {
                                            breadcrumbs.push(e);
                                        });
                                        breadcrumbs.push({
                                            title: this.customerName
                                        });
                                        this.breadcrumbs = breadcrumbs;
                                        this.createForm();
                                    } else if (this.action === 'view') {
                                        const breadcrumbs = [];
                                        this.breadcrumbs_init.map((e) => {
                                            breadcrumbs.push(e);
                                        });
                                        breadcrumbs.push({
                                            title: this.customerName
                                        });
                                        this.breadcrumbs = breadcrumbs;
                                    }
                                }
                            );
                        }
                    );
                }
            }
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
        this.activated_route.queryParams.subscribe(qparams => {
            this.source = qparams.source;
            if (qparams.phone) {
                this.phoneNo = qparams.phone;
            }
            if (qparams.email) {
                this.phoneNo = qparams.email;
            }
            if (qparams.checkinType) {
                this.checkin_type = qparams.checkinType;
            }
            if (qparams.noMobile) {
                this.haveMobile = false;
            }
        });
    }
    ngOnInit() {
        this.createForm();
        const user = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
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
        this.loading = true;
        this.getGlobalSettingsStatus();
        this.breadcrumbs = [{
            title: this.sharedFunctionobj.firstToUpper(this.customer_label) + 's',
            url: 'provider/customers'
        },
        {
            title: 'Add'
        }
        ];
        // this.breadcrumbs_init.map((e) => {
        //     breadcrumbs.push(e);
        // });
        // breadcrumbs.push(
        // );
        this.breadcrumbs = breadcrumbs;
    }
    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.customidFormat = data.jaldeeIdFormat;
                this.createForm();
            });
    }
    getCustomers(customerId) {
        const _this = this;
        const filter = { 'id-eq': customerId };
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderCustomers(filter)
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
    performActions(action) {
        if (action === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/customer']);
        }
    }
    createForm() {
        this.searchForm = this.fb.group({
            search_input: ['', Validators.compose([Validators.required])]
        });
        if (this.phoneNo) {
            this.searchForm.setValue({ search_input: this.phoneNo });
            this.searchCustomer(this.searchForm);
        }
        if (this.eMail) {
            this.searchForm.setValue({ search_input: this.eMail });
            this.searchCustomer(this.searchForm);
        }

        if (!this.haveMobile) {
            this.amForm = this.fb.group({
                first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
                dob: [''],
                gender: [''],
                address: ['']
            });
            this.loading = false;
        } else {
            this.amForm = this.fb.group({
                mobile_number: ['', Validators.compose([Validators.maxLength(10),
                Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
                first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                customer_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
                last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
                dob: [''],
                gender: [''],
                address: ['']
            });
            if (this.action === 'edit') {
                this.updateForm();
            }
            this.loading = false;
        }
        if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
            this.amForm.addControl('customer_id', new FormControl('', Validators.required));
        }
        if (this.phoneNo) {
            this.amForm.get('mobile_number').setValue(this.phoneNo);
        }
        if (this.email) {
            this.amForm.get('email_id').setValue(this.email);
        }
    }
    updateForm() {
        this.amForm.setValue({
            'first_name': this.customer[0].firstName || null,
            'last_name': this.customer[0].lastName || null,
            'email_id': this.customer[0].emailId || null,
            'dob': this.customer[0].dob || null,
            'gender': this.customer[0].gender || null,
            'mobile_number': this.customer[0].phoneNo || null,
            'customer_id': this.customer[0].jaldeeId || null,
            'address': this.customer[0].address || null,
        });
    }
    onSubmit(form_data) {
        this.disableButton = true;
        // if (this.action === 'add') {
        const post_data = {
            //   'userProfile': {
            'firstName': form_data.first_name,
            'lastName': form_data.last_name,
            'dob': form_data.dob,
            'gender': form_data.gender,
            'phoneNo': form_data.mobile_number,
            'address': form_data.address,
            //   }
        };
        if (form_data.mobile_number) {
            post_data['countryCode'] = '+91';
        }
        if (form_data.email_id && form_data.email_id !== '') {
            post_data['email'] = form_data.email_id;
        }
        if (form_data.customer_id) {
            post_data['jaldeeId'] = form_data.customer_id;
        }
        this.provider_services.createProviderCustomer(post_data)
            .subscribe(
                data => {
                    this.sharedFunctionobj.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                    this.sharedFunctionobj.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
                    const qParams = {};
                    qParams['pid'] = data;
                    if (this.source === 'checkin') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number,
                                checkin_type: this.checkin_type,
                                haveMobile: this.haveMobile,
                                id: data
                            }
                        };
                        this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                    } else if (this.source === 'appointment') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number,
                                checkin_type: this.checkin_type,
                                haveMobile: this.haveMobile,
                                id: data
                            }
                        };
                        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
                    } else {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                phoneNo: this.phoneNo
                            }
                        };
                        this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
                    }
                },
                error => {
                    this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.disableButton = false;
                });
        // } else if (this.action === 'edit') {
        //     const post_data = {
        //         //   'userProfile': {
        //         'id': this.customerId,
        //         'firstName': form_data.first_name,
        //         'lastName': form_data.last_name,
        //         'dob': form_data.dob,
        //         'gender': form_data.gender,
        //         'phoneNo': form_data.mobile_number,
        //         'address': form_data.address,
        //         //   }
        //     }; if (form_data.mobile_number) {
        //         post_data['countryCode'] = '+91';
        //     }
        //     if (form_data.email_id && form_data.email_id !== '') {
        //         post_data['email'] = form_data.email_id;
        //     }
        //     if (form_data.customer_id) {
        //         post_data['jaldeeId'] = form_data.customer_id;
        //     }
        //     this.provider_services.updateProviderCustomer(post_data)
        //         .subscribe(
        //             data => {
        //                 this.sharedFunctionobj.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
        //                 this.sharedFunctionobj.openSnackBar('Updated Successfully');
        //                 const qParams = {};
        //                 qParams['pid'] = data;
        //                 if (this.source === 'checkin') {
        //                     const navigationExtras: NavigationExtras = {
        //                         queryParams: {
        //                             ph: form_data.mobile_number,
        //                             checkin_type: this.checkin_type
        //                         }
        //                     };
        //                     this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
        //                 } else if (this.source === 'appointment') {
        //                     const navigationExtras: NavigationExtras = {
        //                         queryParams: {
        //                             ph: form_data.mobile_number,
        //                             checkin_type: this.checkin_type
        //                         }
        //                     };
        //                     this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
        //                 } else {
        //                     const navigationExtras: NavigationExtras = {
        //                         queryParams: {
        //                             phoneNo: this.phoneNo
        //                         }
        //                     };
        //                     this.router.navigate(['provider', 'customers'], navigationExtras);
        //                 }
        //             },
        //             error => {
        //                 this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //             });

        // }

    }
    onCancel() {
        this._location.back();
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

        this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    }
    appointmentClicked() {
        if (this.appointmentDate) {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    ph: this.customerPhone, timeslot: this.appointmentSlot, scheduleId: this.appointmentScheduleId, checkinType: this.checkinType, date: this.appointmentDate
                }
            };
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    ph: this.customerPhone, timeslot: this.appointmentSlot, scheduleId: this.appointmentScheduleId, checkinType: this.checkinType
                }
            };
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
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
        this.loading = true;

        let mode = 'id';
        if (mod) {
            mode = mod;
        }
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
            case 'id':
                post_data = {
                    'jaldeeId-eq': form_data.search_input
                };
                break;
        }
        this.foundCustomer = false;
        this.provider_services.getCustomer(post_data)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    if (data.length === 0) {
                        this.form_data = data;
                        if (mode === 'phone') {
                            this.amForm.get('mobile_number').setValue(form_data.search_input);
                        }
                        if (mode === 'email') {
                            this.amForm.get('email_id').setValue(form_data.search_input);
                        }
                        if (mode === 'id' && this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
                            this.amForm.get('customer_id').setValue(form_data.search_input);
                        }

                        this.create_new = true;
                        this.searchClicked = true;
                    } else {
                        this.foundCustomer = true;
                        this.customer_data = data[0];
                        this.customerPhone = this.customer_data.phoneNo;
                        this.searchClicked = true;
                    }
                },
                error => {
                    this.loading = false;
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
        this.api_error = null;
        this.api_success = null;
    }
    onFieldBlur(key) {
        this.amForm.get(key).setValue(this.toCamelCase(this.amForm.get(key).value));
    }
    toCamelCase(word) {
        if (word) {
            return this.sharedFunctionobj.toCamelCase(word);
        } else {
            return word;
        }
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }
}
