import { Component, OnInit, Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
// import { AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig,Image} from '@ks89/angular-modal-gallery';
// import { ButtonsConfig, ButtonsStrategy, ButtonType } from '@ks89/angular-modal-gallery';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image} from '@ks89/angular-modal-gallery';
// import { ConsoleReporter } from 'jasmine';
// import { ServicesService } from '../../../../shared/modules/service/service.module';


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
    bookStep = 'donation';
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
    customer_countrycode: any;
    from: string;
    indian_payment_modes: any=[];
    non_indian_modes: any =[];
    shownonIndianModes: boolean;
    selected_payment_mode: any;
    isInternatonal: boolean;
    isPayment: boolean;
    theme: any;
    api_loading_video = false;
    disablebutton = false;
    catalogimage_list_popup: Image[];
    image_list_popup: Image[];
    image_list_bool:boolean=false
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
      googleMapUrl;
      appointment: any = [];
      locationName;
      providerName:any;
      placeName:any
      googleUrl:any

      noErrorEmail:any
      noErrorName:any
      noErrorPhone:any
      showAdvancedSettings = false;
      tempDonorName:any;
      tempDonorEmail:any;
      tempDonorPh:any;
      tempDonorDetails:any
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
        private ngZone: NgZone, private activaterouterobj: ActivatedRoute,
        // private servicesService: ServicesService,
        public sharedFunctons: SharedFunctions,
        ) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                this.type = params.type;
                this.googleMapUrl = params.googleMapUrl;
                this.locationName = params.locname;
                // tslint:disable-next-line:radix
                this.sel_loc = parseInt(params.loc_id);
                this.account_id = params.account_id;
                this.accountId = params.accountId;
                this.provider_id = params.unique_id;
                this.sel_ser = JSON.parse(params.service_id);
                if (params.isFrom && params.isFrom == 'providerdetail') {
                    this.from = 'providerdetail';
                }
                this.getConsumerQuestionnaire();
                if (params.customId) {
                    this.customId = params.customId;
                }
                if(params.theme) {
                    this.theme =params.theme;
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
        this.donorfirst = this.customer_data.firstName;
        this.donorlast = this.customer_data.lastName;
        this.main_heading = this.checkinLabel; // 'Check-in';
        this.maxsize = 1;
        this.step = 1;
        this.getPaymentModes();
        const credentials = JSON.parse(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
        this.customer_countrycode = credentials.countryCode;
        console.log("credentioooo" + credentials.countryCode);
        // if(this.customer_countrycode == '+91'){
        //     this.getPaymentModes();
        // } else {
        //     this.razorpayEnabled = true;
        // }
        this.getProfile();
        this.gets3curl();
        this.getFamilyMembers();
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
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
        // const day = new Date(this.sel_checkindate).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
        // const ddd = new Date(day);
        // this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
        // this.hold_sel_checkindate = this.sel_checkindate;
        // this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
        this.revealphonenumber = true;
        this.activaterouterobj.queryParams.subscribe(qparams => {
            console.log('qparams',qparams)
            if (qparams.src) {
              this.pSource = qparams.src;
            }
            if (qparams && qparams.theme) {
              this.theme = qparams.theme;
            }
            this.businessjson = [];
            this.servicesjson = [];
            
            this.image_list_popup = [];
            this.catalogimage_list_popup = [];
            this.galleryjson = [];
            this.deptUsers = [];
            if (qparams.psource) {
              this.pSource = qparams.psource;
              if (qparams.psource === 'business') {
                this.loading = true;
                this.showDepartments = false;
                setTimeout(() => {
                  this.loading = false;
                }, 2500);
              }
            }
          });
    }
    autoGrowTextZone(e) {
        console.log('textarea',e)
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 15)+"px";
      }
    // getPaymentModes() {
    //     this.paytmEnabled = false;
    //     this.razorpayEnabled = false;
    //     this.interNatioanalPaid = false;
    //     this.shared_services.getPaymentModesofProvider(this.account_id,this.sel_ser, 'donation')
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
    //                 } else {
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
    //                 console.log("paymode" + this.paymentmodes.payGateways);


    //             },

    //         );
    // }
    getPaymentModes() {
        this.paytmEnabled = false;
        this.razorpayEnabled = false;
        this.interNatioanalPaid = false;
        this.shared_services.getPaymentModesofProvider(this.account_id, this.sel_ser, 'donation')
            .subscribe(
                data => {
                    this.paymentmodes = data[0];
                    console.log('payment details..',this.paymentmodes)
                    this.isPayment = true;
                    if (this.paymentmodes.indiaPay) {
                        this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
                    }
                     if (this.paymentmodes.internationalPay) {
                        this.non_indian_modes = this.paymentmodes.internationalBankInfo;
 
                    }
                    if(!this.paymentmodes.indiaPay && this.paymentmodes.internationalPay){
                        this.shownonIndianModes=true;
                    }else{
                        this.shownonIndianModes=false;  
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
    togglepaymentMode(){
        this.shownonIndianModes=!this.shownonIndianModes;
        this.selected_payment_mode = null;
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
        console.log('donor...........')
        console.log('Donor first',this.donorfirst)
        const dnrFirst = this.donorfirst.trim();
        const dnrLast = this.donorlast.trim();
        if (dnrFirst === '') {
            this.donorerror = 'Please enter the first name';
            return;
        }  if (dnrLast === '') {
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
        }  if (!result) {
            this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
            console.log('Message',Messages.BPROFILE_PRIVACY_PHONE_INVALID)
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
    editDonor(email:any,name:any,phone:any) {
        console.log('email',email)
        console.log('donorName',name)
        console.log('userPhone',phone)
        // console.log('Donor first',this.donorfirst)
        this.tempDonorName='name'+name;
        this.tempDonorPh='phone'+phone;
        this.tempDonorEmail='email'+email;
      
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
    addDonorDetails(){
        if(this.tempDonorDetails.startsWith('f') ||this.tempDonorDetails.startsWith('l')){
            this.addDonor()
        }
         if(this.tempDonorDetails.startsWith('p')){
             this.addPhone()
        }
         if(this.tempDonorDetails.startsWith('e')){
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
    donorDetails(donorDetails:any){
        console.log('donorDetails...........',donorDetails)
        this.tempDonorDetails=donorDetails
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
        console.log('response.........',res);
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
            // console.log('this.galleryjson',this.galleryjson)
            // console.log('this.galleryjson',this.galleryjson.length)
          this.galleryExists = true;
          for (let i = 1; i < this.galleryjson.length; i++) {
            const imgobj = new Image(
              i,
              { // modal
                img: this.galleryjson[i].url,
                description: this.galleryjson[i].caption || ''
              });
            // this.image_list_popup.push(imgobj);
            this.image_list_popup.push(imgobj);
          }
          console.log('image_list_popup..',this.image_list_popup)
        }
        this.imgLength = this.image_list_popup.length;
        const imgLength = this.image_list_popup.length > 5 ? 5 : this.image_list_popup.length;
        console.log(imgLength)
        for (let i = 0; i < imgLength; i++) {
          this.galleryenabledArr.push(i);
          console.log("......",this.galleryenabledArr)
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
          console.log('image==========',image)
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
        console.log('index.........',index)  
    }

      openGallery(){
        this.image_list_bool=true
      }
      

    // handleEmail(email) {
    //     this.action = 'email';
    //     this.confrmshow = false;
    //     this.payEmail = email;
    //     this.payEmail1 = '';
    //     // if (this.dispCustomerEmail) {
    //     //     this.dispCustomerEmail = false;
    //     // } else {
    //     //     this.dispCustomerEmail = true;
    //     // }
    // }

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
        console.log('donation details.......',this.sel_ser_det)
        this.setAccountGallery( this.sel_ser_det.servicegallery)
    }
    handleServiceSel(obj) {
        // this.sel_ser = obj.id;
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        this.resetApi();
    }
    showConfrmEmail() {
        this.confrmshow = true;
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
    goToGateway(){
        this.isClickedOnce = true;
        this.resetApi();
        if (this.sel_ser) {

        } else {
            this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
            return;
        }
        let paymenttype=this.selected_payment_mode;
        this.donate(paymenttype);  
    }
    // payuPayment() {
    //     this.isClickedOnce = true;
    //     this.resetApi();
    //     if (this.sel_ser) {

    //     } else {
    //         this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
    //         return;
    //     }
    //     let paymentWay;
    //     paymentWay = 'DC';
    //     this.donate(paymentWay);
    // }
    // paytmPayment() {
    //     this.isClickedOnce = true;
    //     this.resetApi();
    //     if (this.sel_ser) {

    //     } else {
    //         this.isClickedOnce = false;
    //         this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
    //         return;
    //     }
    //     let paymentWay;
    //     paymentWay = 'PPI';
    //     this.donate(paymentWay);
    // }
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
        console.log("Donation Data :",post_Data)
        // if (this.userData.userProfile.email === this.payEmail) {
        //     post_Data['donorEmail'] = this.userData.userProfile.email;
        // }else {
        //     post_Data['donorEmail'] = this.payEmail;
        // }
        if (this.api_error === null && this.donationAmount) {
            this.addDonationConsumer(post_Data, paymentWay);
        } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar('Please enter valid donation amount', { 'panelClass': 'snackbarerror' });
        }
    }
    addDonationConsumer(post_Data, paymentWay) {
        this.api_loading = true;
        this.subs.sink = this.shared_services.addCustomerDonation(post_Data, this.account_id)
            .subscribe(data => {
                this.uid = data['uid'];
                console.log("Donation Response :",data);
                if (this.customId) {
                    console.log("businessid" + this.account_id);
                    this.shared_services.addProvidertoFavourite(this.account_id)
                        .subscribe(() => {
                        });

                }
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.submitQuestionnaire(this.uid, post_Data, paymentWay);
                } else {
                    this.consumerPayment(this.uid, post_Data, paymentWay);
                }
            },
                error => {
                    this.isClickedOnce = false;
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    consumerPayment(uid, post_Data, paymentWay) {
        const payInfo:any = {
            'amount': post_Data.donationAmount,
            'custId': this.customer_data.id,
            'paymentMode': paymentWay,
            'uuid': uid,
            'accountId': this.account_id,
            'source': 'Desktop',
            'purpose': 'donation',
            'serviceId':this.sel_ser
        };
       payInfo.isInternational=this.isInternatonal;
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
                        // this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                        // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                        // setTimeout(() => {
                        //     if (paymentWay === 'DC') {
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
        this.razorModel.mode=this.selected_payment_mode;
        this.isClickedOnce = false;
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.uid, null, this.account_id, null, null, this.customId);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.loadingPaytm = true;
        pData.paymentMode=this.selected_payment_mode;
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
                                queryParams['theme']=this.lStorageService.getitemfromLocalStorage('theme');
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
    getImageSrc(mode){
    
        return 'assets/images/payment-modes/'+mode+'.png';
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
        if (this.bookStep === 'qnr') {
            this.location.back();
        } else {
            if (this.action == '') {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep = 'qnr';
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
            // else {
            //     console.log("else");
            //     this.location.back();
            // }
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
        this.payEmail = email;
        this.payEmail1 = '';
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
                console.log('donation details.......',this.sel_ser_det)
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
        let accountS3List = 'settings,terminologies,businessProfile,gallery';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
                (accountS3s:any) => {
                    console.log('accountS3s',accountS3s)
                    this.providerName = accountS3s.businessProfile.businessName;
                    this.placeName =accountS3s.businessProfile.baseLocation.place;
                    console.log(' this.placeName ', this.placeName )
                    this.googleUrl =accountS3s.businessProfile.baseLocation.googleMapUrl;
                    console.log('this.googleUrl',this.googleUrl)
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
                    }
                    
                    if (accountS3s['gallery']) {
                        this.processS3s('gallery', accountS3s['gallery']);
                    }
                    this.api_loading1 = false;
                }
            );
    }
    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        console.log('result....',result)
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
            case 'gallery': {
                this.setAccountGallery(result);
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
        this.shared_services.submitDonationQuestionnaire(uuid, dataToSend, this.account_id).subscribe((data: any) => {
            
            let postData = {
                urls: []
            };
            if (data.urls && data.urls.length > 0) {
                for (const url of data.urls) {
                   
                    const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
                    this.provider_services.videoaudioS3Upload(file, url.url)
                        .subscribe(() => {
                            postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                            if (data.urls.length === postData['urls'].length) {
                                this.shared_services.consumerDonationQnrUploadStatusUpdate(uuid, this.account_id, postData)
                                    .subscribe((data) => {
                                        this.api_loading_video = true;
                                        // this.paymentOperation(paymenttype);
                                        this.consumerPayment(this.uid, post_Data, paymentWay);
                                        this.api_loading_video = false;
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
                this.consumerPayment(this.uid, post_Data, paymentWay);
            }
          
        },
            error => {
                
                this.isClickedOnce = false;
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.disablebutton = false;
                this.api_loading_video = false;
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
    resetErrors() {
        this.donorerror = null;
        this.donorlasterror = null;
    }
    showText() {
        this.readMore = !this.readMore;
    }
}
