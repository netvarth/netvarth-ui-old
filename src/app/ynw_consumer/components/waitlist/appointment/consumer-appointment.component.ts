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
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DOCUMENT, Location } from '@angular/common';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
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



@Component({
    selector: 'app-consumer-appointment',
    templateUrl: './consumer-appointment.component.html',
    styleUrls: ['./consumer-appointment.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class ConsumerAppointmentComponent implements OnInit, OnDestroy {
    time_range = ['09:00 AM - 12:00 PM','12:00 PM - 03:00 PM','03:00 PM - 06:00 PM','06:00 PM - 09:00 PM'];
    time_range_selection:any = this.time_range[0];
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
    familymembers: any = [];
    partysizejson: any = [];
    sel_loc;
    sel_ser;
    sel_ser_det: any = [];
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
    customer_data: any = [];
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
    userPhone;
    countryCode;
    currentPhone;
    users: any = [];
    emailExist = false;
    payEmail = '';
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
    editBookingFields = false;
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
    selectedService: any;
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
    SearchCountryField = SearchCountryField;
    selectedCountry = CountryISO.India;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
    phoneError: string;
    dialCode;
    newselected_phone;
    bookingForm: FormGroup;
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
    newPhone;
    newEmail;
    newWhatsapp;
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
    details: any;
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
    // customer_data: any;
    familymember: any[];
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
    date_pagination_date: any;




    constructor(public fed_service: FormMessageDisplayService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private sharedServices: SharedServices,
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
        @Inject(DOCUMENT) public document,
        private ngZone: NgZone,
        public dialog: MatDialog) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                console.log('params>>.',params)
                if(params.ctime) {
                    console.log('****************************')
                    this.selectedTime=params.ctime
                 
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
                if (this.tele_srv_stat === 'true') {
                    this.bookStep = 0;
                } else {
                    this.bookStep = 1;
                }
                if (params.dept) {
                    this.selectedDeptParam = parseInt(params.dept);
                    this.filterDepart = true;
                }
                if (params.user) {
                    this.selectedUserParam = params.user;
                }
                if (params.service_id) {
                    this.selectedService = parseInt(params.service_id);
                }
                if (params.type === 'reschedule') {
                    this.type = params.type;
                    this.rescheduleUserId = params.uuid;
                    this.getRescheduleApptDet();
                }
                // if (params.service_type) {
                //     this.serviceType = params.service_type;
                //     if (this.serviceType === 'virtualService') {
                //         this.bookStep = 0;
                //     } else {
                //         this.bookStep = 1;
                //     }
                // }
                if (params.theme) {
                    this.theme = params.theme;

                }
                if (params.customId) {
                    this.customId = params.customId;
                    this.businessId = this.account_id;
                }

                if (params.virtual_info) {
                    this.virtualInfo = JSON.parse(params.virtual_info);

                }
            });


        this.age = this.lStorageService.getitemfromLocalStorage('age');
        this.userId = this.lStorageService.getitemfromLocalStorage('userId');
        this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.getActiveUserInfo().then(data => {
            this.customer_data = data;
            this.countryCode = this.customer_data.userProfile.countryCode;

            this.mandatoryEmail = this.customer_data.userProfile.email;
            this.createForm();
            this.getFamilyMember();
        });
    }

    getBookStep() {
        let step: any = '';
        // if (this.serviceType === 'virtualService') {
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
        // if (this.chosen_person = 'new_member' && this.is_parent == false) {
        //     this.editable = true;
        //     this.hideEditButton=true;
        // }




    }


    //below code is about virtual form for appointment on VirtualService Based....



    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }

    isNumericSign(evt) {
        return this.sharedFunctionobj.isNumericSign(evt);
    }

    getActiveUserInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedServices.getProfile(_this.activeUser.id, 'consumer')
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

    getFamilyMember() {
        this.api_loading1 = true;
        let fn;
        let self_obj;
        fn = this.sharedServices.getConsumerFamilyMembers();
        self_obj = {
            'userProfile': {
                'id': this.customer_data.id,
                'firstName': this.customer_data.userProfile.firstName,
                'lastName': this.customer_data.userProfile.lastName
            }
        };
        this.subs.sink = fn.subscribe(data => {
            this.familymember = [];
            this.familymember.push(self_obj);
            for (const mem of data) {
                if (mem.userProfile.id !== self_obj.userProfile.id) {
                    this.familymember.push(mem);
                }
            }
            if (this.dialogData.id) {
                this.virtualForm.patchValue({ 'serviceFor': this.dialogData.id });
                this.onServiceForChange(this.dialogData.id);
            }
            this.api_loading1 = false;
        },
            () => {
                this.api_loading1 = false;
            });
    }
    onServiceForChange(event) {
        this.serviceFormReset();

        this.is_parent = true;
        if (event !== 'new_member') {
            const chosen_Object = this.familymember.filter(memberObj => memberObj.user === event);
            if (chosen_Object.length !== 0) {
                this.hideEditButton = false;
                this.editable = false;
                this.is_parent = false;
                this.chosen_person = chosen_Object[0]
                this.setMemberDetails(chosen_Object[0]);
            } else {
                this.hideEditButton = false;
                this.editable = false;
                this.chosen_person = this.customer_data
                this.setparentDetails(this.customer_data);
            }
        } else {
            this.hideEditButton = true;
            this.editable = true;
            this.is_parent = false;
            this.chosen_person = 'new_member'

        }

    }

    setMemberDetails(memberObj) {
        this.serviceFormReset();
        // if (memberObj.userProfile && memberObj.userProfile.dob!==undefined) {
        //   const dob = memberObj.userProfile.dob.split('-');
        //   this.virtualForm.patchValue({ date: dob[2] });
        //   this.virtualForm.patchValue({ month: dob[1] });
        //   this.virtualForm.patchValue({ year: dob[0] });
        //   this.virtualForm.patchValue({ dob: memberObj.userProfile.dob });
        // }else{
        //   this.virtualForm.patchValue({ date: 'dd' });
        //   this.virtualForm.patchValue({ month:'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // }
        if (memberObj.userProfile.age) {
            this.virtualForm.patchValue({ age: memberObj.userProfile.age });
        } if (memberObj.userProfile.id === this.userId && this.age) {
            this.virtualForm.patchValue({ age: this.age });
        }
        if (memberObj.userProfile && memberObj.userProfile.gender) {
            this.virtualForm.patchValue({ gender: memberObj.userProfile.gender });
        }
        if (memberObj.userProfile && memberObj.userProfile.email) {
            this.virtualForm.patchValue({ email: memberObj.userProfile.email });
        } else {
            this.virtualForm.patchValue({ email: this.customer_data.userProfile.email });
        }
        if (memberObj.preferredLanguages && memberObj.preferredLanguages !== null) {
            const preferredLanguage = this.s3Processor.getJson(memberObj.preferredLanguages);
            if (preferredLanguage !== null && preferredLanguage.length > 0) {
                let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
                if (defaultEnglish === 'no') {
                    if (memberObj.preferredLanguages.length > 0) {
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
        if (memberObj.bookingLocation && memberObj.bookingLocation.pincode) {
            this.virtualForm.patchValue({ pincode: memberObj.bookingLocation.pincode });
        }
        if (memberObj.bookingLocation && memberObj.bookingLocation.district) {
            this.virtualForm.patchValue({ localarea: memberObj.bookingLocation.district });
        }
        if (memberObj.bookingLocation && memberObj.bookingLocation.state) {
            this.virtualForm.patchValue({ state: memberObj.bookingLocation.state });
        }
        if (memberObj.userProfile && memberObj.userProfile.whatsAppNum && memberObj.userProfile.whatsAppNum.number) {
            this.virtualForm.patchValue({ whatsappnumber: memberObj.userProfile.whatsAppNum.number });
            this.virtualForm.patchValue({ countryCode_whtsap: memberObj.userProfile.whatsAppNum.countryCode });
        } else {
            this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_whtsap: this.customer_data.userProfile.countryCode });
        }
        if (memberObj.userProfile && memberObj.userProfile.telegramNum && memberObj.userProfile.telegramNum.number) {
            this.virtualForm.patchValue({ telegramnumber: memberObj.userProfile.telegramNum.number });
            this.virtualForm.patchValue({ countryCode_telegram: memberObj.userProfile.telegramNum.countryCode });
        } else {
            this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_telegram: this.customer_data.userProfile.countryCode })
        }
    }
    serviceFormReset() {

        // this.virtualForm.patchValue({ date: 'dd' });
        //   this.virtualForm.patchValue({ month:'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // this.virtualForm.controls['dob'].setValue('');
        this.virtualForm.controls['countryCode_whtsap'].setValue(this.countryCode);
        this.virtualForm.controls['countryCode_telegram'].setValue(this.countryCode);
        this.virtualForm.controls['age'].setValue('');
        this.virtualForm.controls['gender'].setValue('');
        this.virtualForm.controls['islanguage'].setValue('yes');
        this.virtualForm.controls['preferredLanguage'].setValue([]);
        this.virtualForm.controls['pincode'].setValue('');
        this.virtualForm.controls['localarea'].setValue('');
        this.virtualForm.controls['state'].setValue('');
        this.lngknown = 'yes';
        if (this.customer_data.userProfile.email) {
            this.virtualForm.patchValue({ email: this.customer_data.userProfile.email });
        } else {
            this.virtualForm.patchValue({ email: '' });
        }

        this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
        this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
    }
    setparentDetails(customer) {


        // if (customer.userProfile && customer.userProfile.dob!==undefined) {

        //   const dob = customer.userProfile.dob.split('-');
        //   this.virtualForm.patchValue({ date: dob[2] });
        //   this.virtualForm.patchValue({ month: dob[1] });
        //   this.virtualForm.patchValue({ year: dob[0] });
        //   this.virtualForm.patchValue({ dob: customer.userProfile.dob });
        // }else{
        //   this.virtualForm.patchValue({ date:'dd' });
        //   this.virtualForm.patchValue({ month: 'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // }
        if (customer.userProfile.age) {
            this.virtualForm.patchValue({ age: customer.userProfile.age });
        }
        if (customer.userProfile.id === this.userId && this.age) {
            this.virtualForm.patchValue({ age: this.age });
        }


        if (customer.userProfile && customer.userProfile.gender) {
            this.virtualForm.patchValue({ gender: customer.userProfile.gender });
        }
        if (customer.userProfile && customer.userProfile.email) {
            this.virtualForm.patchValue({ email: customer.userProfile.email });
        }
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
        if (customer.userProfile && customer.userProfile.whatsAppNum && customer.userProfile.whatsAppNum.number) {
            this.virtualForm.patchValue({ whatsappnumber: customer.userProfile.whatsAppNum.number });
            this.virtualForm.patchValue({ countryCode_whtsap: customer.userProfile.whatsAppNum.countryCode });

        } else {
            this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_whtsap: this.customer_data.userProfile.countryCode });
        }
        if (customer.userProfile && customer.userProfile.telegramNum && customer.userProfile.telegramNum.number) {
            this.virtualForm.patchValue({ telegramnumber: customer.userProfile.telegramNum.number });
            this.virtualForm.patchValue({ countryCode_telegram: customer.userProfile.telegramNum.countryCode });
        }
        else {
            this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_telegram: this.customer_data.userProfile.countryCode });
        }
    }

    createForm() {
        this.virtualForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            serviceFor: ['', Validators.compose([Validators.required])],
            countryCode_whtsap: [this.countryCode],
            countryCode_telegram: [this.countryCode],
            // dob: ['', Validators.compose([Validators.required])],
            // date: [''],
            // month: [''],
            // year: [''],
            age: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
            pincode: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
            // whatsappnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
            whatsappnumber: [''],
            telegramnumber: [''],
            // telegramnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
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
        // this.virtualForm.patchValue({ date: 'dd' });
        // this.virtualForm.patchValue({ month:'mm' });
        // this.virtualForm.patchValue({ year: 'yyyy' });
        if (this.dialogData.type !== 'member') {
            this.virtualForm.patchValue({ serviceFor: this.customer_data.id });
        } else {
            this.virtualForm.patchValue({ serviceFor: this.dialogData.consumer });

        }

        if (this.dialogData) {

            this.updateForm();
        }
        this.api_loading = false;
    }
    //   closeDialog() {
    //     this.dialogRef.close();
    //   }
    editLanguage() {
        this.iseditLanguage = true;
        this.languageSelected = this.virtualForm.get('preferredLanguage').value.slice();
        this.hideLanguages = false;
        this.hideTokenFor = false;
    }
    updateForm() {

        if (this.dialogData.type && this.dialogData.type === 'member') {
            this.details = this.dialogData.consumer
        } else {
            this.details = this.customer_data;
        }
        if (this.details.parent) {
            this.setMemberDetails(this.details);
        } else {
            this.setparentDetails(this.details);

        }

    }
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
            // let elmnt = document.getElementById("plng");
            // elmnt.scrollIntoView()
        }
    }
    cancelLanguageSelection() {
        if (this.virtualForm.get('preferredLanguage').value.length == 0) {
            this.virtualForm.get('preferredLanguage').setValue(['English']);
            this.lngknown = 'yes';
            this.virtualForm.patchValue({ islanguage: 'yes' });
        } else {
            this.languageSelected = [];

        }
        this.hideLanguages = true;
        // let elmnt = document.getElementById("plng");
        // elmnt.scrollIntoView();
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
    validateFields() {
        let isinvalid = false;
        if (this.countryCode === '+91') {
            if (this.virtualForm.get('pincode').value === '' || this.virtualForm.get('pincode').value.length !== 6) {
                isinvalid = true;
            }
        }
        if (this.countryCode !== '+91') {
            if (this.virtualForm.get('localarea').value === '' || this.virtualForm.get('state').value === '') {
                isinvalid = true;

            }
        }
        if (this.virtualForm.get('gender').value === '') {
            isinvalid = true;
        }
        if (this.virtualForm.get('age').value === '') {
            isinvalid = true;
        }

        if (this.virtualForm.get('islanguage').value === 'no') {
            if (this.virtualForm.get('preferredLanguage').value.length === 0) {
                isinvalid = true;
            }
        }

        if (this.virtualForm.get('serviceFor').value === 'new_member') {

            if (this.virtualForm.get('firstName').value == '') {
                isinvalid = true;
            }
            if (this.virtualForm.get('lastName').value == '') {
                isinvalid = true;

            }
        }

        return isinvalid;
    }

    fetchLocationByPincode(pincode) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedServices.getLocationsByPincode(pincode).subscribe(
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

    onSubmit(formdata) {
        this.submitbtndisabled = true;
        formdata['phoneno'] = this.customer_data.userProfile.primaryMobileNo;
        if (this.virtualForm.controls.email.invalid) {
            return false;
        }
        if (this.validateFields() === true) {
            this.snackbarService.openSnackBar('Please fill  all required fields', { 'panelClass': 'snackbarerror' });
        } else if (formdata.countryCode_whtsap.trim().length === 0 && formdata.whatsappnumber.trim().length > 0) {
            this.snackbarService.openSnackBar('Please fill whatsapp countrycode', { 'panelClass': 'snackbarerror' });
        } else if (formdata.countryCode_telegram.trim().length === 0 && formdata.telegramnumber.trim().length > 0) {
            this.snackbarService.openSnackBar('Please fill telegram countrycode', { 'panelClass': 'snackbarerror' });
        } else {

            if (this.is_parent) {
                this.updateParentInfo(formdata).then(
                    (result) => {
                        if (result !== false) {
                            this.lStorageService.setitemonLocalStorage('age', formdata.age);
                            this.submitbtndisabled = false;
                            this.setVirtualTeleserviceCustomer();
                            this.bookStep++;
                        }
                    },
                    (error) => {
                        this.submitbtndisabled = false;
                        return false;
                    }
                );
            } else {
                if (formdata.serviceFor === 'new_member') {
                    this.saveMember(formdata).then(data => {
                        if (data !== false) {
                            this.lStorageService.setitemonLocalStorage('age', formdata.age);
                            formdata['newMemberId'] = data;
                            this.submitbtndisabled = false;
                            this.setVirtualTeleserviceCustomer();
                            this.bookStep++;
                        }
                    },
                        () => {
                            this.submitbtndisabled = false;
                            return false;
                        })
                } else {
                    this.updateMemberInfo(formdata).then(
                        (data) => {
                            if (data !== false) {
                                this.submitbtndisabled = false;
                                this.lStorageService.setitemonLocalStorage('age', formdata.age);
                                this.setVirtualTeleserviceCustomer();
                                this.bookStep++;
                            }
                        },
                        () => {
                            this.submitbtndisabled = false;
                            return false;
                        }
                    );
                }

            }
        }



    }
    updateParentInfo(formdata) {

        const _this = this;
        const firstName = _this.customer_data.userProfile.firstName
        const lastName = _this.customer_data.userProfile.lastName;
        return new Promise(function (resolve, reject) {
            const userObj = {};
            userObj['id'] = _this.customer_data.id;
            if (formdata.whatsappnumber !== undefined && formdata.whatsappnumber.trim().length > 0 && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length > 0) {
                const whatsup = {}
                if (formdata.countryCode_whtsap.startsWith('+')) {
                    whatsup["countryCode"] = formdata.countryCode_whtsap
                } else {
                    whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
                }
                whatsup["number"] = formdata.whatsappnumber
                userObj['whatsAppNum'] = whatsup;
            }

            if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length > 0 && formdata.countryCode_telegram !== undefined && formdata.countryCode_telegram.trim().length > 0) {
                const telegram = {}
                if (formdata.countryCode_telegram.startsWith('+')) {
                    telegram["countryCode"] = formdata.countryCode_telegram
                } else {
                    telegram["countryCode"] = '+' + formdata.countryCode_telegram
                }
                telegram["number"] = formdata.telegramnumber
                userObj['telegramNum'] = telegram;
            }


            if (formdata.email !== '' && formdata.updateEmail) {
                userObj['email'] = formdata.email
            }
            userObj['gender'] = formdata.gender;
            userObj['firstName'] = firstName;
            userObj['lastName'] = lastName;
            // userObj['dob'] = formdata.dob;
            userObj['pinCode'] = formdata.pincode;
            if (formdata.islanguage === 'yes') {
                userObj['preferredLanguages'] = ['English'];
            } else {
                userObj['preferredLanguages'] = formdata.preferredLanguage;
            }
            userObj['bookingLocation'] = {}
            if (_this.countryCode !== '+91' && formdata.localarea !== '') {
                userObj['bookingLocation']['district'] = formdata.localarea;
                userObj['city'] = formdata.localarea;
            }
            if (_this.countryCode !== '+91' && formdata.state) {
                userObj['bookingLocation']['state'] = formdata.state;
                userObj['state'] = formdata.state;
            }
            _this.lStorageService.setitemonLocalStorage('userId', _this.customer_data.id);
            _this.sharedServices.updateProfile(userObj, 'consumer').subscribe(
                () => {

                    resolve(true);
                }, (error) => {
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    resolve(false);
                }
            )
        });
    }

    updateMemberInfo(formdata) {

        const _this = this;;
        const firstName = _this.chosen_person.userProfile.firstName;
        const lastName = _this.chosen_person.userProfile.lastName;
        let memberInfo: any = {};
        memberInfo.userProfile = {}
        if (formdata.whatsappnumber !== undefined && formdata.whatsappnumber.trim().length > 0 && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length > 0) {
            const whatsup = {}
            if (formdata.countryCode_whtsap.startsWith('+')) {
                whatsup["countryCode"] = formdata.countryCode_whtsap
            } else {
                whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
            }
            whatsup["number"] = formdata.whatsappnumber
            memberInfo.userProfile['whatsAppNum'] = whatsup;
        }
        if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length > 0 && formdata.countryCode_telegram !== undefined && formdata.countryCode_telegram.trim().length > 0) {
            const telegram = {}
            if (formdata.countryCode_telegram.startsWith('+')) {
                telegram["countryCode"] = formdata.countryCode_telegram
            } else {
                telegram["countryCode"] = '+' + formdata.countryCode_telegram
            }
            telegram["number"] = formdata.telegramnumber
            memberInfo.userProfile['telegramNum'] = telegram;

        }
        if (formdata.email !== '' && formdata.updateEmail) {
            memberInfo['userProfile']['email'] = formdata.email
        }


        memberInfo.bookingLocation = {}
        memberInfo.userProfile['id'] = formdata.serviceFor;
        memberInfo.userProfile['gender'] = formdata.gender;
        memberInfo.userProfile['firstName'] = firstName;
        memberInfo.userProfile['lastName'] = lastName;
        // memberInfo.userProfile['dob'] = formdata.dob;
        memberInfo.bookingLocation['pincode'] = formdata.pincode;
        if (formdata.islanguage === 'yes') {
            memberInfo['preferredLanguages'] = ['English'];
        } else {
            memberInfo['preferredLanguages'] = formdata.preferredLanguage;
        }
        if (this.countryCode !== '+91' && formdata.localarea && formdata.localarea !== '') {
            memberInfo['bookingLocation']['district'] = formdata.localarea;
        }
        if (this.countryCode !== '+91' && formdata.state) {
            memberInfo['bookingLocation']['state'] = formdata.state;
        }
        this.lStorageService.setitemonLocalStorage('userId', formdata.serviceFor);
        return new Promise(function (resolve, reject) {
            _this.sharedServices.editMember(memberInfo).subscribe(
                () => {
                    resolve(true);
                }, (error) => {
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    resolve(false);
                }
            )
        });



    }
    saveMember(formdata) {
        const _this = this;
        const memberInfo = {};
        memberInfo['userProfile'] = {}
        if (formdata.whatsappnumber !== undefined && formdata.whatsappnumber.trim().length > 0 && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length > 0) {

            const whatsup = {}
            if (formdata.countryCode_whtsap.startsWith('+')) {
                whatsup["countryCode"] = formdata.countryCode_whtsap
            } else {
                whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
            }
            whatsup["number"] = formdata.whatsappumber
            memberInfo['userProfile']['whatsAppNum'] = whatsup;
        }
        if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length > 0 && formdata.countryCode_telegram !== undefined && formdata.countryCode_telegram.trim().length > 0) {
            const telegram = {}
            if (formdata.countryCode_telegram.startsWith('+')) {
                telegram["countryCode"] = formdata.countryCode_telegram
            } else {
                telegram["countryCode"] = '+' + formdata.countryCode_telegram
            }
            telegram["countryCode"] = formdata.countryCode_telegram
            telegram["number"] = formdata.telegramnumber
            memberInfo['userProfile']['telegramNum'] = telegram;
        }
        if (formdata.email !== '' && formdata.updateEmail) {
            memberInfo['userProfile']['email'] = formdata.email
        }


        memberInfo['bookingLocation'] = {}
        memberInfo['userProfile']['gender'] = formdata.gender;
        memberInfo['userProfile']['firstName'] = formdata.firstName;
        memberInfo['userProfile']['lastName'] = formdata.lastName;
        // memberInfo['userProfile']['dob'] = formdata.dob;
        memberInfo['bookingLocation']['pincode'] = formdata.pincode;
        if (formdata.islanguage === 'yes') {
            memberInfo['preferredLanguages'] = ['English'];
        } else {
            memberInfo['preferredLanguages'] = formdata.preferredLanguage;
        }

        if (this.countryCode !== '+91' && formdata.localarea && formdata.localarea !== '') {
            memberInfo['bookingLocation']['district'] = formdata.localarea;
        }
        if (this.countryCode !== '+91' && formdata.state) {
            memberInfo['bookingLocation']['state'] = formdata.state;
        }
        return new Promise(function (resolve, reject) {
            _this.sharedServices.addMembers(memberInfo).subscribe(
                (data) => {
                    _this.lStorageService.setitemonLocalStorage('userId', data);
                    resolve(data);
                }, (error) => {
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    resolve(false);
                }
            )
        });


    }
    onChange(event) {
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




    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    ngOnInit() {
        this.bookingForm = this.fb.group({
            newEmail: ['', Validators.pattern(new RegExp(projectConstantsLocal.VALIDATOR_MOBILE_AND_EMAIL))],
            newWhatsapp: new FormControl(undefined),
            newPhone: new FormControl(undefined)
        });
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
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
        this.getPaymentModes();
        const credentials = JSON.parse(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
        this.customer_countrycode = credentials.countryCode;
        // if(this.customer_countrycode == '+91'){
        //     this.getPaymentModes();
        // } else {
        //     this.razorpayEnabled = true;
        // }
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        if (activeUser) {
            this.isfirstCheckinOffer = activeUser.firstCheckIn;
            this.customer_data = activeUser;
        }
        this.maxsize = 1;
        this.step = 1;
        this.gets3curl();
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
        if (this.type !== 'reschedule') {
            this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        }
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
                this.sel_checkindate = this.selectedDate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
            }
        }
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;
        this.getProfile().then(
            () => {
                // this.getFamilyMembers();
                this.getFamilyMember();
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                const dt1 = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const date1 = new Date(dt1);
                const dt2 = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const date2 = new Date(dt2);
                if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
                    this.isFuturedate = true;
                }
                this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
            }
        );
    }
    getImageSrc(mode) {

        return 'assets/images/payment-modes/' + mode + '.png';
    }
    // getPaymentModes() {
    //     this.paytmEnabled = false;
    //     this.razorpayEnabled = false;
    //     this.interNatioanalPaid = false;
    //     this.shared_services.getPaymentModesofProvider(this.account_id,this.selectedService, 'prePayment')
    //         .subscribe(
    //             data => {
    //                 this.paymentmodes = data;
    //                 if (this.paymentmodes[0].isJaldeeBank) {

    //                     if (this.customer_countrycode == '+91') {

    //                         this.paytmEnabled = true;
    //                         this.interNatioanalPaid = true;
    //                     }
    //                     else {

    //                         this.razorpayEnabled = true;
    //                     }
    //                 }
    //                 else {
    //                     if (this.customer_countrycode == '+91') {
    //                         for (let modes of this.paymentmodes) {
    //                             for (let gateway of modes.payGateways) {
    //                                 if (gateway == 'PAYTM') {
    //                                     this.paytmEnabled = true;
    //                                 }
    //                                 if (gateway == 'RAZORPAY') {
    //                                     this.razorpayEnabled = true;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     else {
    //                         this.razorpayEnabled = true;
    //                     }
    //                 }
    //             },

    //         );
    // }
    getRescheduleApptDet() {
        this.subs.sink = this.shared_services.getAppointmentByConsumerUUID(this.rescheduleUserId, this.account_id).subscribe(
            (appt: any) => {
                this.appointment = appt;
                if (this.type === 'reschedule') {
                    this.waitlist_for.push({ id: this.appointment.appmtFor[0].id, firstName: this.appointment.appmtFor[0].firstName, lastName: this.appointment.appmtFor[0].lastName, phoneNo: this.appointment.phoneNumber });
                    this.userPhone = this.appointment.phoneNumber;
                    this.countryCode = this.appointment.countryCode;
                    this.consumerNote = this.appointment.consumerNote;

                }
                this.sel_loc = this.appointment.location.id;
                this.selectedService = this.appointment.service.id;
                this.sel_checkindate = this.selectedDate = this.hold_sel_checkindate = this.appointment.appmtDate;
                if (this.sel_checkindate !== this.todaydate) {
                    this.isFuturedate = true;
                }
                this.currentScheduleId = this.appointment.schedule.id;
                this.sel_ser = this.appointment.service.id;
                this.holdselectedTime = this.appointment.appmtTime;
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
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
    // getFamilyMembers() {
    //     this.api_loading1 = true;
    //     let fn;
    //     let self_obj;
    //     fn = this.shared_services.getConsumerFamilyMembers();
    //     self_obj = {
    //         'userProfile': {
    //             'id': this.customer_data.id,
    //             'firstName': this.customer_data.firstName,
    //             'lastName': this.customer_data.lastName
    //         }
    //     };
    //     this.subs.sink = fn.subscribe(data => {
    //         this.familymembers = [];
    //         this.familymembers.push(self_obj);
    //         for (const mem of data) {
    //             if (mem.userProfile.id !== self_obj.userProfile.id) {
    //                 this.familymembers.push(mem);
    //             }
    //         }
    //         this.api_loading1 = false;
    //     },
    //         () => {
    //             this.api_loading1 = false;
    //         });
    // }
    changeSlot() {


        this.action = 'slotChange';
    }
    resetApiErrors() {
        this.emailerror = null;
    }

    setVirtualTeleserviceCustomer() {
        this.virtualInfo = this.virtualForm.value;
        console.log(this.virtualInfo);
        if (this.virtualInfo && this.virtualInfo.email && this.virtualInfo.email !== '') {
            // this.payEmail = this.virtualInfo.email;
            this.newEmail = this.payEmail = this.virtualInfo.email;
        }


        if (this.virtualInfo && this.virtualInfo.newMemberId) {
            this.waitlist_for = [];
            //this.newMember = this.virtualInfo.newMemberId;
            this.virtualInfo.serviceFor = this.virtualInfo.newMemberId;
            // const current_member = this.familymembers.filter(member => member.id === this.virtualInfo.serviceFor);
            this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: this.virtualInfo.firstName, lastName: this.virtualInfo.lastName });

            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                console.log(this.whatsappCountryCode);
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;

                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + '' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.whatsappnumber;
                this.changePhno = true;
            }

        } else if (this.virtualInfo && this.virtualInfo.serviceFor) {
            this.consumerType = 'member';
            this.waitlist_for = [];

            const current_member = this.familymembers.filter(member => member.userProfile.id === this.virtualInfo.serviceFor);
            console.log("FamilyMember : ", current_member);
            if (current_member[0]['user']) {
                this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });
            }

            if (!current_member[0]['user']) {

                this.getActiveUserInfo().then(data => {
                    this.customer_data = data;
                    console.log("Consumer Data :", this.customer_data)
                    if (this.customer_data.SignedUp == true) {

                        this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.userProfile.firstName, lastName: this.customer_data.userProfile.lastName });
                    }
                });



            }
            // else {
            //     this.virtualInfo.serviceFor = this.virtualInfo.newMemberId;
            //     this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: this.virtualInfo.firstName, lastName: this.virtualInfo.lastName });
            // }



            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                console.log(this.whatsappCountryCode);
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;
                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + ' ' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.whatsappnumber;
                this.changePhno = true;
            }

        }

    }
    // setVirtualTeleserviceCustomer(formdata) {
    //     this.virtualInfo = formdata;
    //     console.log(JSON.stringify(this.virtualInfo));
    //     if (this.virtualInfo && this.virtualInfo.email && this.virtualInfo.email !== '') {
    //         this.newEmail = this.payEmail = this.virtualInfo.email;
    //     }
    //     this.waitlist_for = [];
    //     if (this.virtualInfo && this.virtualInfo.newMemberId) {
    //         this.waitlist_for.push({ id: this.virtualInfo.newMemberId, firstName: this.virtualInfo.firstName, lastName: this.virtualInfo.lastName });
    //     } else {
    //         const current_member = this.familymembers.filter(member => member.userProfile.id === this.virtualInfo.serviceFor);
    //         // console.log(current_member);
    //         this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });

    //     }
    //     if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
    //         this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
    //         console.log(this.whatsappCountryCode);
    //         this.newWhatsapp = this.virtualInfo.whatsappnumber
    //         if (this.virtualInfo.countryCode_whtsap.includes('+')) {
    //             this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;

    //         } else {
    //             this.callingModes = this.virtualInfo.countryCode_whtsap + '' + this.virtualInfo.whatsappnumber;

    //         }
    //         this.currentPhone = this.virtualInfo.phoneno;
    //         this.userPhone = this.virtualInfo.phoneno;
    //         this.changePhno = true;
    //     }




    // }
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
                                this.currentPhone = this.appointment.phoneNumber;
                            }
                        } else {
                            const unChangedPhnoCountryCode = this.countryCode.split('+')[1];
                            this.callingModes = unChangedPhnoCountryCode + '' + this.customer_data.primaryPhoneNumber;
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
        if (serv.provider) {
            this.sel_ser_det.provider = serv.provider;
        }
        if (serv.provider) {
            this.sel_ser_det['providerId'] = serv.provider.id;
        }
        this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount || 0;
        this.serviceCost = this.sel_ser_det.price;
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
                        if(this.selectedTime) {
                            const appttime = this.freeSlots.filter(slot => slot.displayTime === this.selectedTime);
                            if(appttime) {
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
    handleServiceSel(obj) {
        this.callingModes = [];
        this.showInputSection = false;
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        this.action = '';
    }
    handleConsumerNote(vale) {
        this.consumerNote = vale;
    }
    changed_date_value(data)
    {
        this.date_pagination_date = data;
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
        console.log(this.sel_checkindate)
        this.sel_checkindate = this.date_pagination_date;
        console.log(this.sel_checkindate)
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
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
        if (type === 'appt' && this.sel_ser_det.isPrePayment && this.payEmail === '') {
            const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
                width: '40%',
                panelClass: ['loginmainclass', 'popup-class'],


            });
            emaildialogRef.afterClosed().subscribe(result => {
                if (result !== '' && result !== undefined) {
                    this.payEmail = result;
                    this.confirmcheckin(type, paymenttype);
                } else {
                    this.isClickedOnce = false;

                }

            });

        } else {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    if (list.id === this.customer_data.id) {
                        list['id'] = 0;
                    }
                }
            }
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
                            this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
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
                    'id': this.selectedApptTime['scheduleId']
                },
                'appmtDate': this.selectedDate,
                'service': {
                    'id': this.sel_ser,
                    'serviceType': this.sel_ser_det.serviceType
                },
                'consumerNote': this.consumerNote,
                'countryCode': this.countryCode,
                'phoneNumber': phNumber,
                //'appmtFor': JSON.parse(JSON.stringify(this.waitlist_for)),
                'coupons': this.selected_coupons
            };
            if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
                post_Data['provider'] = { 'id': this.selectedUser.id };
            }
            if (!this.waitlist_for[0]['apptTime']) {
                this.waitlist_for[0]['apptTime'] = this.selectedApptTime['time']
            }
            if (this.sel_ser_det.serviceType === 'virtualService') {
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
                if (this.virtualInfo) {
                    if (!this.waitlist_for[0]['apptTime']) {
                        this.waitlist_for[0]['apptTime'] = this.selectedApptTime['time']
                    }
                    // const momentDate = new Date(this.virtualInfo.dob); // Replace event.value with your date value
                    // const formattedDate = moment(momentDate).format("YYYY-MM-DD");
                    // this.waitlist_for[0]['dob'] = formattedDate;
                    this.waitlist_for[0]['whatsAppNum'] = {
                        'countryCode': this.virtualInfo.countryCode_whtsap,
                        'number': this.virtualInfo.whatsappnumber
                    }
                    this.waitlist_for[0]['telegramNum'] = {
                        'countryCode': this.virtualInfo.countryCode_telegram,
                        'number': this.virtualInfo.telegramnumber
                    }
                    this.waitlist_for[0]['age'] = this.virtualInfo.age;
                    if (this.virtualInfo.islanguage === 'yes') {
                        let langs = [];
                        langs.push('English');
                        this.waitlist_for[0]['preferredLanguage'] = langs;
                    } else {
                        let langs = [];
                        langs = this.virtualInfo.preferredLanguage;
                        this.waitlist_for[0]['preferredLanguage'] = langs;
                    }
                    const bookingLocation = {};
                    bookingLocation['pincode'] = this.virtualInfo.pincode;
                    if (this.virtualInfo.pincode === '') {
                        bookingLocation['district'] = this.virtualInfo.location;
                        bookingLocation['state'] = this.virtualInfo.state;
                    }

                    this.waitlist_for[0]['bookingLocation'] = bookingLocation;
                    if (this.virtualInfo.gender !== '') {
                        this.waitlist_for[0]['gender'] = this.virtualInfo.gender;

                    }

                }

            }
            if (this.payEmail !== '') {
                this.waitlist_for[0]['email'] = this.payEmail;
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
                        //this.isClickedOnce=false;
                        //this.disablebutton = true;
                        this.addCheckInConsumer(post_Data, paymenttype);
                    }
                } else if (this.sel_ser_det.isPrePayment) {
                    this.addApptAdvancePayment(post_Data);
                }
            }
        }
    }

    saveCheckin(type?, paymenttype?) {
        // if (type === 'appt') {
        //     this.isClickedOnce = true;
        // }
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
        if (this.sel_ser_det.serviceType === 'virtualService' && type === 'next') {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    const memberObject = this.familymembers.filter(member => member.userProfile.id === list['id']);
                    console.log(memberObject);
                    if (list['id'] !== this.customer_data.id) {
                        // this.confirmVirtualServiceinfo(memberObject, type);
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
    handleOneMemberSelect(id, firstName, lastName, email) {

        this.waitlist_for = [];
        this.newEmail = this.payEmail = '';
        this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.selectedApptTime['time'] });
        if (email && email.trim() !== '') {
            this.payEmail = this.waitlist_for[0]['email'] = this.newEmail = email;

        } else if (this.userData.userProfile.email.trim() !== '') {
            this.waitlist_for[0]['email'] = this.newEmail = this.payEmail = this.userData.userProfile.email;

        } else {
            this.waitlist_for[0]['email'] = this.newEmail = this.payEmail = '';
        }


        // this.getConsumerQuestionnaire();
    }
    handleMemberSelect(id, firstName, lastName, obj) {
        if (this.waitlist_for.length === 0) {
            this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName, apptTime: this.selectedApptTime['time'] });
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
                    this.waitlist_for.push({ id: id, lastName: lastName, firstName: firstName, apptTime: this.selectedApptTime['time'] });
                } else {
                    obj.source.checked = false; // preventing the current checkbox from being checked
                    if (this.maxsize > 1) {
                        this.snackbarService.openSnackBar('Only ' + this.maxsize + ' member(s) can be selected', { 'panelClass': 'snackbarerror' });
                    } else if (this.maxsize === 1) {
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
                if (this.waitlist_for[i].id == 0) {
                    this.waitlist_for[i].id = this.customer_data.id;
                }
                if (this.waitlist_for[i].id === id) {
                    retval = true;
                }
            }
        }
        return retval;
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
            post_data['parent'] = this.customer_data.id;
            fn = this.shared_services.addMembers(post_data);
            this.subs.sink = fn.subscribe(() => {
                this.apiSuccess = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
                // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MEMBER_CREATED'), { 'panelclass': 'snackbarerror' });
                // this.getFamilyMembers();
                this.getFamilyMember();
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
            this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
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
                    this.getAvailableSlotByLocationandService(locid, this.sel_ser, pdate, this.account_id, 'init');
                    if (this.type != 'reschedule') {
                        this.getConsumerQuestionnaire();
                    } else {
                        this.questionnaireLoaded = true;
                        // if (this.sel_ser_det.serviceType === 'virtualService') {
                        //     this.setVirtualTeleserviceCustomer();
                        // }
                    }
                }
                this.api_loading1 = false;
            },
                () => {
                    this.api_loading1 = false;
                    this.sel_ser = '';
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
    getProfile() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedFunctionobj.getProfile()
                .then(
                    data => {
                        _this.userData = data;
                        if (_this.type !== 'reschedule') {
                            _this.countryCode = _this.whatsappCountryCode = _this.userData.userProfile.countryCode;
                        }
                        if (_this.userData.userProfile !== undefined) {
                            _this.userEmail = _this.userData.userProfile.email || '';
                            if (_this.type !== 'reschedule') {
                                _this.userPhone = _this.userData.userProfile.primaryMobileNo || '';
                            }
                        }

                        if (_this.userData.userProfile.email) {
                            _this.payEmail = _this.newEmail = _this.userData.userProfile.email;

                        }
                        if (_this.userEmail) {
                            _this.emailExist = true;
                        } else {
                            _this.emailExist = false;
                        }
                        resolve(true);
                    });
        });
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
        this.selected_phone = this.userPhone;
        this.newEmail = this.payEmail;
        this.newPhone = this.selected_phone;
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
    saveMemberDetails() {
        this.resetApiErrors();
        this.emailerror = '';
        this.phoneError = '';
        this.whatsapperror = '';
        this.currentPhone = this.selected_phone;
        this.userPhone = this.selected_phone;
        this.changePhno = true;
        let phoneNum;
        let emailId;
        // if (this.editBookingFields) {
        // if (this.newPhone && !this.newPhone.e164Number.startsWith(this.newPhone.dialCode + '55')) {
        //     this.phoneError = 'Phone number is invalid';
        //     return false;
        // } else {
        if (this.countryCode.trim() === '') {
            this.snackbarService.openSnackBar('Please enter country code', { 'panelClass': 'snackbarerror' });
            return false;
        }
        if (this.newPhone && this.newPhone.trim() !== '') {
            phoneNum = this.newPhone;
            this.userPhone = phoneNum;
            this.currentPhone = phoneNum;
            this.selected_phone = phoneNum;
        }
        // }
        // if (this.newWhatsapp && !this.newWhatsapp.e164Number.startsWith(this.newWhatsapp.dialCode + '55')) {
        //     this.whatsapperror = 'WhatsApp number is invalid';
        //     return false;
        // } else {
        if (this.sel_ser_det && this.sel_ser_det.virtualCallingModes && this.sel_ser_det.virtualCallingModes[0].callingMode === 'WhatsApp') {
            if (this.whatsappCountryCode && this.whatsappCountryCode.trim() === '') {
                this.snackbarService.openSnackBar('Please enter country code', { 'panelClass': 'snackbarerror' });
                return false;
            }
            if (this.newWhatsapp && this.newWhatsapp.trim() !== '') {
                const countryCode = this.whatsappCountryCode.replace('+', '');
                this.callingModes = countryCode + this.newWhatsapp;
            }
        }
        // }
        if (this.newEmail && this.newEmail.trim() !== '') {
            const pattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
            const result = pattern.test(this.newEmail);
            if (!result) {
                this.emailerror = "Email is invalid";
                return false;
            } else {

                // emailId = this.bookingForm.get('newEmail').value;
                emailId = this.newEmail;
                // if (emailId && emailId != "") {
                //     this.payEmail = emailId;
                //     const post_data = {
                //         'id': this.userData.userProfile.id || null,
                //         'firstName': this.userData.userProfile.firstName || null,
                //         'lastName': this.userData.userProfile.lastName || null,
                //         'dob': this.userData.userProfile.dob || null,
                //         'gender': this.userData.userProfile.gender || null,
                //         'email': this.payEmail.trim() || ''
                //     };
                //     this.updateEmail(post_data).then(
                //         () => {
                //             setTimeout(() => {
                //                 this.action = '';
                //             }, 500);
                //             this.closebutton.nativeElement.click();
                //         },
                //         error => {
                //             this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                //             this.payEmail = this.userData.userProfile.email;
                //             return false;
                //         }
                //     )
                // } else {
                //     setTimeout(() => {
                //         this.action = '';
                //     }, 500);
                //     this.closebutton.nativeElement.click();
                // }
                if (emailId && emailId != "") {
                    this.payEmail = emailId;
                    this.waitlist_for[0]['email'] = this.payEmail;
                }
                this.closebutton.nativeElement.click();
                setTimeout(() => {
                    this.action = '';
                }, 500);
            }

        } else {
            setTimeout(() => {
                this.action = '';
            }, 500);
            this.closebutton.nativeElement.click();
        }
        // if (this.bookingForm.get('newEmail').errors) {
        //     this.emailerror = "Email is invalid";
        //     return false;
        // } else {
        //     emailId = this.newEmail;
        // if (emailId && emailId != "") {
        //     this.payEmail = emailId;
        //     const post_data = {
        //         'id': this.userData.userProfile.id || null,
        //         'firstName': this.userData.userProfile.firstName || null,
        //         'lastName': this.userData.userProfile.lastName || null,
        //         'dob': this.userData.userProfile.dob || null,
        //         'gender': this.userData.userProfile.gender || null,
        //         'email': this.payEmail.trim() || ''
        //     };
        //     this.updateEmail(post_data).then(
        //         () => {
        //             this.closebutton.nativeElement.click();
        //             setTimeout(() => {
        //                 this.action = '';
        //             }, 500);
        //         },
        //         error => {
        //             this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //             this.payEmail = this.userData.userProfile.email;
        //             return false;
        //         }
        //     )
        // } else {
        //     this.closebutton.nativeElement.click();
        //     setTimeout(() => {
        //         this.action = '';
        //     }, 500);
        // }
        // }
        // } else {
        //     this.closebutton.nativeElement.click();
        //     setTimeout(() => {
        //         this.action = '';
        //     }, 500);
        // }
        this.closebutton.nativeElement.click();
        setTimeout(() => {
            this.action = '';
        }, 500);
        this.editBookingFields = false;
    }
    updateEmail(post_data) {
        const _this = this;
        const passtyp = 'consumer';
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.updateProfile(post_data, passtyp)
                .subscribe(
                    () => {
                        _this.getProfile();
                        resolve(true);
                    },
                    error => {
                        reject(error);
                    });
        });
    }
    changeBookingFields() {
        this.editBookingFields = true;
    }
    showSpec() {
        if (this.showmoreSpec) {
            this.showmoreSpec = false;
        } else {
            this.showmoreSpec = true;
        }
    }
    goToStep(type) {
        this.virtualInfo = this.virtualForm.value;
        if (type === 'next') {
            if (this.tele_srv_stat === 'true' && this.bookStep == 0) {
                if (this.validateFields() === true) {
                    this.snackbarService.openSnackBar('Please fill  all required fields', { 'panelClass': 'snackbarerror' });
                } else if (this.virtualInfo.countryCode_whtsap.trim().length === 0 && this.virtualInfo.whatsappnumber.trim().length > 0) {
                    this.snackbarService.openSnackBar('Please fill whatsapp countrycode', { 'panelClass': 'snackbarerror' });
                } else if (this.virtualInfo.countryCode_telegram.trim().length === 0 && this.virtualInfo.telegramnumber.trim().length > 0) {
                    this.snackbarService.openSnackBar('Please fill telegram countrycode', { 'panelClass': 'snackbarerror' });
                } else {
                    this.onSubmit(this.virtualInfo);
                }
            } else if (!this.apptdisable && this.freeSlots.length > 0 && !this.api_loading1) {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    if (this.bookStep === 2) {
                        this.validateQuestionnaire();
                    } else {
                        this.bookStep++;
                    }
                } else {
                    if (this.sel_ser_det.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.sel_ser_det.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
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
        // let paymentWay;
        // if (paymenttype == 'paytm') {
        //     paymentWay = 'PPI';
        // } else {
        //     paymentWay = 'DC';
        // }

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
        this.waitlistDetails.serviceId = this.sel_ser;
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
            // if (paymentMode == 'PPI') {
            //     postData.isPayTmPayment = true;
            //     postData.isRazorPayPayment = false;
            //     postData.paymentMode = "PPI";
            // } else {
            //     postData.isPayTmPayment = false;
            //     postData.isRazorPayPayment = true;
            //     postData.paymentMode = "DC";
            // }
            postData.paymentMode = paymentMode;
            postData.isInternational = this.isInternatonal;
            postData.serviceId = this.sel_ser;
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
                            // this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                            // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                            // setTimeout(() => {
                            //     if (paymentMode === 'DC') {
                            //         this.document.getElementById('payuform').submit();
                            //     } else {
                            //         this.document.getElementById('paytmform').submit();
                            //     }
                            // }, 2000);
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
        this.razorpayService.payWithRazor(this.razorModel, 'consumer', 'appt_prepayment', this.trackUuid, this.sel_ser_det.livetrack, this.account_id, this.paymentDetails.amountRequiredNow, this.uuidList, this.customId, this.from);
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
        if (this.action !== 'members' && this.action !== 'addmember' && this.action !== 'note' && this.action !== 'slotChange' && this.action !== 'attachment' && this.action !== 'coupons') {
            this.selectedDate = this.date_pagination_date;
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
        const consumerid = (this.waitlist_for[0].id === this.customer_data.id) ? 0 : this.waitlist_for[0].id;
        this.shared_services.getConsumerQuestionnaire(this.sel_ser, consumerid, this.account_id).subscribe(data => {
            this.questionnaireList = data;
            this.questionnaireLoaded = true;
            // if (this.sel_ser_det.serviceType === 'virtualService') {
            //     this.setVirtualTeleserviceCustomer();
            // }
        });
    }
    checkCouponvalidity() {
        if (this.waitlist_for.length !== 0) {
            for (const list of this.waitlist_for) {
                if (list.id === this.customer_data.id) {
                    list['id'] = 0;
                }
            }
        }
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
                        this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
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
                'id': this.selectedApptTime['scheduleId']
            },
            'appmtDate': this.selectedDate,
            'service': {
                'id': this.sel_ser,
                'serviceType': this.sel_ser_det.serviceType
            },
            'consumerNote': this.consumerNote,
            'countryCode': this.countryCode,
            'phoneNumber': phNumber,
            'appmtFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'coupons': this.selected_coupons
        };
        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }
        if (this.sel_ser_det.serviceType === 'virtualService') {
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
                    if (this.sel_ser_det.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.sel_ser_det.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
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
        this.shared_services.getPaymentModesofProvider(this.account_id, this.selectedService, 'prePayment')
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

    handle_time_range_change(x)
    {
        this.time_range_selection = x;
    }

    is_in_time_range(time)
    {
        const hour_time_range = this.time_range_selection.split(' - ');
        const hour_start_range = hour_time_range[0].slice(0,8);
        const hour_end_range = hour_time_range[1].slice(0,8);
        var converted_selected_time = moment(time, 'hh:mm A').format('HH');
        var converted_hour_start_range = moment(hour_start_range, 'hh:mm A').format('HH');
        var converted_hour_end_range = moment(hour_end_range, 'hh:mm A').format('HH');
        if (parseInt(converted_selected_time) >= parseInt(converted_hour_start_range) && 
            parseInt(converted_selected_time) <= parseInt(converted_hour_end_range))
            {
                return true;
            }

    }
    
}