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
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
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

@Component({
    selector: 'app-consumer-checkin',
    templateUrl: './consumer-checkin.component.html',
    styleUrls: ['./consumer-checkin.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css'],
})
export class ConsumerCheckinComponent implements OnInit, OnDestroy {
    paymentBtnDisabled = false;
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
    bookStep = 1;
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


    constructor(public fed_service: FormMessageDisplayService,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
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
        const _this = this;
        _this.onResize();
        _this.serverDate = _this.lStorageService.getitemfromLocalStorage('sysdate');
        if (_this.checkin_date) {
            _this.isFutureDate = _this.dateTimeProcessor.isFutureDate(_this.serverDate, _this.checkin_date);
        }
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
    }
    non_indian_modes_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = true;
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
        const post_Data = {
            'ynwUuid': this.rescheduleUserId,
            'date': this.checkinDate,
            'queue': this.sel_queue_id,
            'consumerNote': this.consumerNote
        };
        console.log(post_Data)
        this.subs.sink = this.shared_services.rescheduleConsumerWaitlist(this.account_id, post_Data)
            .subscribe(
                () => {
                    if (this.selectedMessage.files.length > 0) {
                        const uid = [];
                        uid.push(this.rescheduleUserId);
                        this.consumerNoteAndFileSave(uid);
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
                showOnlyAvailableSlots: activeService.showOnlyAvailableSlots
            };
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
            this.paymentBtnDisabled = true;
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
                    this.paymentBtnDisabled = false;
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
                if (this.selectedService.isPrePayment && !this.selected_payment_mode) {
                    this.snackbarService.openSnackBar('Please select one payment mode', { 'panelClass': 'snackbarerror' });
                    this.isClickedOnce = false;
                    return false;
                }
                if (this.jcashamount > 0 && this.checkJcash) {
                    this.shared_services.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.paymentDetails.amountRequiredNow)
                        .subscribe(data => {
                            console.log('dfsdfdfs' + data)
                            this.remainingadvanceamount = data;
                            // this.addCheckInConsumer(post_Data, paymenttype);
                            this.performCheckin().then(
                                () => {
                                    _this.paymentOperation();
                                }
                            );
                        });
                }
                else {
                    // this.addCheckInConsumer(post_Data, paymenttype);
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
        return post_Data;
    }

    // saveCheckin(type?) {
    //     if (type === 'checkin') {
    //         if (this.interNatioanalPaid) {
    //             this.isClickedOnce = true
    //             this.paymentBtnDisabled = false;
    //         }
    //         if (this.razorpayEnabled && !this.paytmEnabled) {
    //             this.isClickedOnce = true
    //             this.paymentBtnDisabled = false;
    //         }
    //     }
    //     this.confirmcheckin(type);
    // }
    performCheckin() {
        const _this = this;
        return new Promise(function (resolve, reject) {

            console.log("Payment Req Id:", _this.paymentRequestId);

            if (_this.paymentRequestId) {
                resolve(true);
            }
            else {
                let post_Data = _this.generateInputforCheckin();
                _this.subs.sink = _this.shared_services.addCheckin(_this.account_id, post_Data)
                    .subscribe(data => {
                        // if (this.customId) {
                        //     const accountid = this.businessId;
                        //     this.shared_services.addProvidertoFavourite(accountid)
                        //         .subscribe(() => {
                        //         });
                        // }
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
                                    // this.paymentOperation();
                                    resolve(true);
                                }
                            );
                            // this.consumerNoteAndFileSave(this.uuidList, parentUid, paymenttype);
                        }
                        else {
                            _this.submitQuestionnaire(parentUid).then(
                                () => {
                                    resolve(true);
                                    // this.paymentOperation();
                                }
                            );
                            // this.submitQuestionnaire(parentUid);
                        }

                        // else {
                        //     if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0) {
                        //         this.payuPayment(paymenttype);
                        //     } else {
                        //         this.paymentOperation(paymenttype);
                        //     }
                        // }
                    },
                        error => {
                            _this.isClickedOnce = false;
                            _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            _this.disablebutton = false;
                            _this.paytmGateway = false;
                            _this.razorpayGatway = false;
                            _this.paymentBtnDisabled = false;
                        });
            }
        });
    }
    // addCheckInConsumer(postData, paymentmodetype?) {
    //     let paymenttype = this.selected_payment_mode;
    //     if (this.selectedService.isPrePayment && !this.selected_payment_mode) {
    //         this.snackbarService.openSnackBar('Please select one payment mode', { 'panelClass': 'snackbarerror' });
    //         this.isClickedOnce = false;
    //         return false;
    //     }

    // }
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
                                                // this.paymentOperation(paymenttype);
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
                                },
                                    error => {
                                        _this.isClickedOnce = false;
                                        _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                        _this.disablebutton = false;
                                        _this.api_loading_video = true;
                                    });
                        }
                    } else {
                        resolve(true);
                        // this.paymentOperation(paymenttype);
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        this.disablebutton = false;
                        this.api_loading_video = true;
                        resolve(false);
                    });
            } else {
                resolve(true);
            }
        });
    }
    paymentOperation() {
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
                            this.finishCheckin(true);
                        }
                    },
                        error => {
                            // this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                        })
            } else if (response.STATUS == 'TXN_FAILURE') {
                this.finishCheckin(false);
            }
        } else {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.paytmService.updatePaytmPay(payload, accountId)
                    .then((data) => {
                        if (data) {
                            this.finishCheckin(true);
                        }
                    },
                        error => {
                            // this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
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
    // getProviderDepart(id) {
    //     this.subs.sink = this.shared_services.getProviderDept(id).
    //         subscribe(data => {
    //             this.departmentlist = data;
    //             this.departmentEnabled = this.departmentlist.filterByDept;
    //             for (let i = 0; i < this.departmentlist['departments'].length; i++) {
    //                 if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
    //                     this.departments.push(this.departmentlist['departments'][i]);
    //                     if (this.selectedDeptId && this.selectedDeptId === this.departmentlist['departments'][i].departmentId) {
    //                         this.selectedDept = this.departmentlist['departments'][i];
    //                     }
    //                 }
    //             }
    //             if (!this.selectedDeptId) {
    //                 this.selectedDept = this.departments[0];
    //             }
    //         });
    // }
    filesSelected(event, type?) {
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                // if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                //     this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
                //     return;
                // } else

                if (file.size > projectConstants.FILE_MAX_SIZE) {
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
                () => {
                    _this.submitQuestionnaire(parentUid).then(
                        () => {
                            resolve(true);
                        }
                    );
                }
            )




            // let count = 0;
            // for (const uuid of uuids) {
            // _this.subs.sink = _this.shared_services.addConsumerWaitlistAttachment(_this.account_id, uuid, dataToSend)
            //     .subscribe(
            //         () => {
            //             if (_this.type !== 'waitlistreschedule') {
            //                 count++;
            //                 if (count === uuids.length) {
            //                     // if (_this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
            //                     //     _this.submitQuestionnaire(parentUid, paymenttype);
            //                     // } else {
            //                     //     _this.paymentOperation(paymenttype);
            //                     // }
            //                 }
            //             } else {
            //                 let queryParams = {
            //                     account_id: _this.account_id,
            //                     uuid: _this.rescheduleUserId,
            //                     type: 'waitlistreschedule',
            //                     theme: _this.theme
            //                 }
            //                 if (_this.businessId) {
            //                     queryParams['customId'] = _this.customId;
            //                 }
            //                 let navigationExtras: NavigationExtras = {
            //                     queryParams: queryParams
            //                 };
            //                 _this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
            //             }
            //         },
            //         error => {
            //             _this.isClickedOnce = false;
            //             _this.wordProcessor.apiErrorAutoHide(_this, error);
            //             _this.disablebutton = false;
            //         }
            //     );
            // }
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
                // this.accountType = this.businessjson.accountType;
                // if (this.accountType === 'BRANCH') {
                //     // this.getbusinessprofiledetails_json('departmentProviders', true);
                //     this.getProviderDepart(this.businessjson.id);
                // }
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
                if (result != undefined) {
                    this.s3CouponsList.JC = result;
                } else {
                    this.s3CouponsList.JC = [];
                }

                if (this.s3CouponsList.JC.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
            case 'providerCoupon': {
                if (result != undefined) {
                    this.s3CouponsList.OWN = result;
                } else {
                    this.s3CouponsList.OWN = [];
                }

                if (this.s3CouponsList.OWN.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
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
    checkCouponvalidity() {
        const post_Data = this.generateInputforCheckin();
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
            .subscribe(data => { this.paymentDetails = data; },
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

        if (this.queuesLoaded && this.checkinDate === this.scheduledWaitlist.date && this.scheduledWaitlist.queue && this.queuejson[this.sel_queue_indx] && this.scheduledWaitlist.queue.id === this.queuejson[this.sel_queue_indx].id) {
            console.log("Calling Disable:", this.checkinDate === this.scheduledWaitlist.date && this.scheduledWaitlist.queue && this.queuejson[this.sel_queue_indx] && this.scheduledWaitlist.queue.id === this.queuejson[this.sel_queue_indx].id);
            console.log(this.checkinDate);
            console.log(this.scheduledWaitlist.date);
            console.log(this.scheduledWaitlist.queue.id);
            console.log(this.queuejson[this.sel_queue_indx].id);
            return true;
        } else {
            return false;
        }
    }

    addWaitlistAdvancePayment() {
        let post_Data = this.generateInputforCheckin();
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
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
                        let multiple;
                        if (this.uuidList.length > 1) {
                            multiple = true;
                        } else {
                            multiple = false;
                        }
                        setTimeout(() => {
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
    // getImage(url, file) {
    //     console.log("File Type :", file.type)
    //     if (file.type == 'application/pdf') {
    //         return './assets/images/pdf.png';
    //     }
    //     else if (file.type == 'audio/mp3' || file.type == 'audio/mpeg' || file.type == 'audio/ogg') {
    //         return './assets/images/audio.png';

    //     }
    //     else if (file.type == 'video/mp4' || file.type == 'video/mpeg') {
    //         return './assets/images/video.png';
    //     }s
    //     else {
    //         return url;
    //     }
    // }
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

    /**
     * Update Customer/Member Details 
     * @param formdata customer/member data
     * @param isParent true/false
     * @returns data/false
     */
    // updateCustomer(formdata, isParent, type) {
    //     const _this = this;
    //     return new Promise(function (resolve, reject) {
    //         let customerInfo = {};
    //         let whatsup = {};
    //         let telegram = {}
    //         if (formdata.whatsappnumber !== undefined && formdata.whatsappnumber.trim().length > 0 && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length > 0) {
    //             if (formdata.countryCode_whtsap.startsWith('+')) {
    //                 whatsup["countryCode"] = formdata.countryCode_whtsap
    //             } else {
    //                 whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
    //             }
    //             whatsup["number"] = formdata.whatsappnumber
    //         }
    //         if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length > 0 && formdata.countryCode_telegram !== undefined && formdata.countryCode_telegram.trim().length > 0) {
    //             if (formdata.countryCode_telegram.startsWith('+')) {
    //                 telegram["countryCode"] = formdata.countryCode_telegram
    //             } else {
    //                 telegram["countryCode"] = '+' + formdata.countryCode_telegram
    //             }
    //             telegram["number"] = formdata.telegramnumber
    //         }
    //         if (isParent) {
    //             customerInfo['id'] = _this.parentCustomer.id;
    //             customerInfo['gender'] = formdata.gender;
    //             customerInfo['age'] = formdata.age;
    //             customerInfo['firstName'] = _this.parentCustomer.userProfile.firstName;
    //             customerInfo['lastName'] = _this.parentCustomer.userProfile.lastName;
    //             customerInfo['whatsAppNum'] = whatsup;
    //             customerInfo['telegramNum'] = telegram;
    //             // customerInfo['pinCode'] = formdata.pincode;
    //             if (formdata.email !== '' && formdata.updateEmail) {
    //                 customerInfo['email'] = formdata.email
    //             }
    //             if (formdata.islanguage === 'yes') {
    //                 customerInfo['preferredLanguages'] = ['English'];
    //             } else {
    //                 customerInfo['preferredLanguages'] = formdata.preferredLanguage;
    //             }
    //             customerInfo['bookingLocation'] = {};
    //             if (_this.parentCustomer.userProfile.countryCode !== '+91' && formdata.localarea !== '') {
    //                 customerInfo['bookingLocation']['district'] = formdata.localarea;
    //                 customerInfo['city'] = formdata.localarea;
    //             }
    //             if (_this.parentCustomer.userProfile.countryCode !== '+91' && formdata.state) {
    //                 customerInfo['bookingLocation']['state'] = formdata.state;
    //                 customerInfo['state'] = formdata.state;
    //             }
    //             _this.customerService.updateProfile(customerInfo, 'consumer').subscribe(
    //                 (data) => {
    //                     _this.setWaitlistFor(customerInfo, isParent);
    //                     _this.commObj['communicationEmail'] = formdata.email;
    //                     _this.commObj['comWhatsappNo'] = whatsup["number"];
    //                     _this.commObj['comWhatsappCountryCode'] = whatsup["countryCode"];
    //                     resolve(data);
    //                 }, (error) => {
    //                     _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                     resolve(false);
    //                 }
    //             )
    //         } else {
    //             customerInfo['userProfile'] = {}
    //             console.log("Chosen Person:", _this.chosen_person);
    //             console.log("Form Data:", formdata);
    //             if (formdata.islanguage === 'yes') {
    //                 customerInfo['preferredLanguages'] = ['English'];
    //             } else {
    //                 customerInfo['preferredLanguages'] = formdata.preferredLanguage;
    //             }
    //             customerInfo['userProfile']['gender'] = formdata.gender;
    //             customerInfo['userProfile']['age'] = formdata.age;
    //             customerInfo['userProfile']['firstName'] = formdata.firstName;
    //             customerInfo['userProfile']['lastName'] = formdata.lastName;
    //             customerInfo['userProfile']['whatsAppNum'] = whatsup;
    //             customerInfo['userProfile']['telegramNum'] = telegram;
    //             if (formdata.email !== '' && formdata.updateEmail) {
    //                 customerInfo['userProfile']['email'] = formdata.email;
    //             }
    //             customerInfo['bookingLocation'] = {};
    //             // customerInfo['bookingLocation']['pincode'] = formdata.pincode;
    //             if (_this.parentCustomer.countryCode !== '+91' && formdata.localarea && formdata.localarea !== '') {
    //                 customerInfo['bookingLocation']['district'] = formdata.localarea;
    //             }
    //             if (_this.parentCustomer.countryCode !== '+91' && formdata.state) {
    //                 customerInfo['bookingLocation']['state'] = formdata.state;
    //             }
    //             if (type === 'new') {
    //                 _this.customerService.addMember(customerInfo).subscribe(
    //                     (data) => {
    //                         _this.setWaitlistFor(customerInfo, isParent, data);
    //                         _this.initCommunications(customerInfo);
    //                         resolve(data);
    //                     }, (error) => {
    //                         _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                         resolve(false);
    //                     }
    //                 )
    //             } else {
    //                 customerInfo['userProfile']['id'] = formdata.serviceFor;
    //                 _this.customerService.editMember(customerInfo).subscribe(
    //                     (data) => {
    //                         _this.setWaitlistFor(customerInfo, isParent, data);
    //                         _this.initCommunications(customerInfo);
    //                         resolve(data);
    //                     }, (error) => {
    //                         _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //                         resolve(false);
    //                     }
    //                 )
    //             }

    //         }
    //     })
    // }

    /**
     * To store virtual for details for checkin
     * @param customerInfo 
     * @param isParent 
     * @param id 
     */
    // setWaitlistFor(customerInfo, isParent, id?) {
    //     this.waitlist_for = [];
    //     let member = {};
    //     if (isParent) {
    //         member['id'] = customerInfo.id;
    //         member['gender'] = customerInfo.gender;
    //         member['age'] = customerInfo.age;
    //         member['firstName'] = customerInfo.firstName;
    //         member['lastName'] = customerInfo.lastName;
    //         member['whatsAppNum'] = customerInfo['whatsAppNum'];
    //         member['telegramNum'] = customerInfo['telegramNum'];
    //         member['preferredLanguages'] = customerInfo['preferredLanguages'];
    //         const bookingLocation = {};
    //         // bookingLocation['pincode'] = customerInfo['pinCode'];
    //         bookingLocation['district'] = customerInfo['bookingLocation']['district'];
    //         bookingLocation['state'] = customerInfo['bookingLocation']['state'];
    //         member['bookingLocation'] = bookingLocation;
    //     } else {
    //         member['id'] = id;
    //         member['gender'] = customerInfo['userProfile']['gender'];
    //         member['age'] = customerInfo['userProfile']['age'];
    //         member['firstName'] = customerInfo['userProfile']['firstName'];
    //         member['lastName'] = customerInfo['userProfile']['lastName'];
    //         member['whatsAppNum'] = customerInfo['userProfile']['whatsAppNum'];
    //         member['telegramNum'] = customerInfo['userProfile']['telegramNum'];
    //         member['preferredLanguages'] = customerInfo['preferredLanguages'];
    //         member['bookingLocation'] = customerInfo['bookingLocation'];
    //     }
    //     this.waitlist_for.push(member);
    // }

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
                    this.bookStep = 2;
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
                                    _this.bookStep = 2;
                                } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                    _this.bookStep = 3;
                                } else {
                                    _this.bookStep = 4;
                                    // this.saveCheckin('next');
                                    this.confirmcheckin('next');
                                }
                                _this.loggedIn = true;
                            } else {
                                if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                    _this.bookStep = 3;
                                } else {
                                    _this.bookStep = 4;
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

    // BookStep = 1 --- Date/Time--ServiceName
    // BookStep = 2 --- Virtual Form
    // BookStep = 3 --- Questionaire
    // BookStep = 4 --- Review/Confirm / File / Note
    goToStep(type) {
        const _this = this;
        console.log("BookStep:" + this.bookStep);
        if (type === 'next') {
            switch (this.bookStep) {
                case 1: // Date/Time--ServiceName
                    this.goThroughLogin().then((status) => {
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
                                                    _this.bookStep = 2;
                                                } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                                    _this.bookStep = 3;
                                                } else {
                                                    _this.bookStep = 4;
                                                    this.confirmcheckin('next');
                                                }
                                                _this.loggedIn = true;
                                            } else {
                                                if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                                    _this.bookStep = 3;
                                                } else {
                                                    _this.bookStep = 4;
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
                case 2: //Virtual Fields
                    _this.validateOneTimeInfo();
                    break;
                case 3:
                    this.validateQuestionnaire();
                    break;
                case 4:
                    if (this.selectedService.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.selectedService.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                        return false;
                    }
                    break;
            }
        } else if (type === 'prev') {
            if (this.bookStep === 4) {
                if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep = 3;
                } else if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                    _this.bookStep = 2;
                } else {
                    this.bookStep = 1;
                }
            } else if (this.bookStep === 3) {
                if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                    _this.bookStep = 2;
                } else {
                    this.bookStep = 1;
                }
            } else {
                this.bookStep--;
            }
        } else {
            this.bookStep = type;
        }
        if (this.bookStep === 4) {
            this.confirmcheckin('next');
        }
    }

    getBookStep() {
        console.log("In Get Bookstep");
        if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.bookStep = 3;
        } else {
            this.bookStep = 4;
            this.confirmcheckin();
        }
    }
    goBack(type?) {
        if (type) {
            if (this.bookStep === 1) {
                let source = this.lStorageService.getitemfromLocalStorage('source');
                if (source) {
                    window.location.href = source;
                    this.lStorageService.removeitemfromLocalStorage('source');
                } else {
                    this.location.back();
                }      
            } else {
                this.goToStep('prev');
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
            this.shared_services.validateConsumerOneTimeQuestionnaire(dataToSend, this.account_id, '').subscribe((data: any) => {
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
                    console.log("Family Members:",  _this.familyMembers);    
                    console.log("Member Id", member.id);    
                    console.log("Parent:", providerConsumer_parent); 
                    if (providerConsumer_parent && providerConsumer_parent.length > 0) {
                        parentId =  providerConsumer_parent[0].id;
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
            if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
                const dataToSend: FormData = new FormData();
                if (_this.oneTimeInfo.files) {
                    for (const pic of _this.oneTimeInfo.files) {
                        dataToSend.append('files', pic, pic['name']);
                    }
                }
                const blobpost_Data = new Blob([JSON.stringify(_this.oneTimeInfo.answers)], { type: 'application/json' });
                dataToSend.append('question', blobpost_Data);
                _this.subs.sink = _this.shared_services.submitCustomerOnetimeInfo(dataToSend, activeUser.id, _this.account_id).subscribe((data: any) => {
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