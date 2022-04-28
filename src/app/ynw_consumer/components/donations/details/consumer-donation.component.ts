import { Component, OnInit, Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT, Location } from '@angular/common';
import { Messages } from '../../../../shared/constants/project-messages';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { WindowRefService } from '../../../../shared/services/windowRef.service';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { MatDialog } from '@angular/material/dialog';
// import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { PaytmService } from '../../../../shared/services/paytm.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, Image, ButtonsConfig, ButtonsStrategy, ButtonType } from '@ks89/angular-modal-gallery';
import { AuthService } from '../../../../shared/services/auth-service';
import { CustomerService } from '../../../../shared/services/customer.service';


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
    private subs = new SubSink();
    businessInfo: any = {}; // To hold Business Name, Location, Map Url etc.
    smallDevice;      // To know whether device is mobile or desktop
    selectedServiceId;// Id of the donation service
    selectedService: any; // To store selected donation service details
    locationId;       // Location id
    paymentMode: any; // Mode of donation payment
    loggedIn = true;  // To check whether user logged in or not
    loading = true;
    loadingPaytm: boolean;
    accountId;        // To hold the Account Id
    uniqueId;         // To hold the S3 Unique Id
    theme;            // Selected Theme
    customId;         // To know whether req came from customapp/qr link
    serverDate;       // To store the server date
    from: string;
    from_iOS = false; // To know whether req came from ios custom app
    paymentWindow: Window; // to store window reference of the payment link page
    donationDate;
    parentCustomer: any;// logged in customer
    oneTimeInfo: any; // One time information
    onetimeQuestionnaireList: any; // one time information questionaire list
    questionAnswers; // questionaire answers
    questionnaireList: any = []; // normal questionaire list
    // questionnaireLoaded = false; // to check questionaire loaded or not
    bookStep;       // To show the steps onetime info/take donation/questionaire etc
    donationId;        // Donation uuid
    api_loading_video;
    isInternational: boolean;
    shownonIndianModes: boolean;
    donorName = '';
    donorFirstName = '';
    donorLastName = '';
    firstNameRequired;
    lastNameRequired;
    consumerNote = '';// consumer note input
    isClickedOnce = false;
    paymentmodes: any;
    action = '';
    isPayment: boolean;
    indian_payment_modes: any;
    non_indian_modes: any;
    userEmail: any;
    userPhone: any;
    dialCode: any;
    // @ViewChild('modal') modal; // referring modal object
    @ViewChild('closebutton') closebutton;
    services: any;    // To store services json
    providerConsumerId; // id of the selected provider consumer 
    providerConsumerList: any;
    selected_phone: any;
    phoneError = '';
    donationAmount;
    payEmail: any;
    image_list_popup: Image[];
    payEmail1: string;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    }; // storing message to be uploaded
    emailerror: any;
    email1error: any;
    pGateway: any;
    confrmshow: boolean;
    api_loading: boolean;
    donorSelectedField: any;
    familyMembers: any = []; // hold the members
    amountPlaceHolder: any;
    @ViewChild('consumer_donation') paytmview;
    constructor(public fed_service: FormMessageDisplayService,
        // private fb: FormBuilder, 
        public dialog: MatDialog,
        private sharedServices: SharedServices,
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
        public winRef: WindowRefService,
        private location: Location,
        private s3Processor: S3UrlProcessor,
        private paytmService: PaytmService,
        private cdRef: ChangeDetectorRef,
        private dateTimeProcessor: DateTimeProcessor,
        private ngZone: NgZone,
        private authService: AuthService,
        private activaterouterobj: ActivatedRoute,
        private customerService: CustomerService,
        public sharedFunctons: SharedFunctions) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                if (params.locname) {
                    this.businessInfo['locationName'] = params.locname;
                    this.businessInfo['googleMapUrl'] = params.googleMapUrl;
                }
                // tslint:disable-next-line:radix
                this.locationId = parseInt(params.loc_id);
                // this.account_id = params.account_id;
                this.accountId = params.account_id;
                this.uniqueId = params.unique_id;
                this.selectedServiceId = JSON.parse(params.service_id);
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
    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.innerWidth <= 767) {
            this.smallDevice = true;
        } else {
            this.smallDevice = false;
        }
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
                    this.sharedServices.ConsumerLogin(data).subscribe(
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
        this.sharedServices.getSystemDate()
            .subscribe(
                res => {
                    this.serverDate = res;
                    this.lStorageService.setitemonLocalStorage('sysdate', res);
                });
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
    initDonation() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.donationDate = _this.dateTimeProcessor.getToday(_this.serverDate);
            _this.activaterouterobj.queryParams.subscribe(qparams => {
                console.log('qparams', qparams)
                // if (qparams.src) {
                //     _this.pSource = qparams.src;
                // }
                if (qparams && qparams.theme) {
                    _this.theme = qparams.theme;
                }
                // _this.businessjson = [];
                _this.services = [];
                _this.image_list_popup = [];
                // _this.catalogimage_list_popup = [];
                // _this.galleryjson = [];
                // _this.deptUsers = [];
                // if (qparams.psource) {
                //     _this.pSource = qparams.psource;
                //     if (qparams.psource === 'business') {
                //         _this.loading = true;
                //         _this.showDepartments = false;
                //         setTimeout(() => {
                //             _this.loading = false;
                //         }, 2500);
                //     }
                // }
            });
            const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
            if (activeUser) {
                _this.setDonorInfo(activeUser);
            }
            // _this.main_heading = _this.checkinLabel; // 'Check-in';
            _this.getPaymentModes();
            _this.sharedFunctionobj.getProfile().then(data => {
                _this.setProfileInfo(data);
                _this.parentCustomer = data;
                console.log(_this.parentCustomer);
                _this.setConsumerFamilyMembers(_this.parentCustomer.id).then(
                    () => {
                        _this.setProviderConsumerList(_this.parentCustomer.id, _this.accountId).then(
                            (status) => {
                                _this.getConsumerQuestionnaire().then(
                                    (data) => {
                                        if (data) {
                                            _this.questionnaireList = data;
                                        }
                                        console.log("Heree");
                                        resolve(true);
                                    }
                                );
                            }
                        );
                    }
                ); // Load Family Members




                // _this.getConsumerQuestionnaire().then(
                //     (data) => {
                //         if (data) {
                //             _this.questionnaireList = data;
                //         }
                //         _this.loading = false;
                //         resolve(true);
                //     }
                // );
            });
        })

    }
    setDonorInfo(customerInfo) {
        this.donorName = customerInfo.firstName + ' ' + customerInfo.lastName;
        this.donorFirstName = customerInfo.firstName;
        this.donorLastName = customerInfo.lastName;
        // this.donorfirst = customerInfo.firstName;
        // this.donorlast = customerInfo.lastName;
    }
    setProfileInfo(data: any) {
        if (data.userProfile !== undefined) {
            this.userEmail = data.userProfile.email || '';
            this.userPhone = data.userProfile.primaryMobileNo || '';
            this.dialCode = data.userProfile.countryCode || '';
        }
        // if (this.userEmail) {
        //     this.emailExist = true;
        // } else {
        //     this.emailExist = false;
        // }
    }
    ngOnInit() {
        const _this = this;
        this.serverDate = _this.lStorageService.getitemfromLocalStorage('sysdate');
        if (_this.lStorageService.getitemfromLocalStorage('ios')) {
            _this.from_iOS = true;
        }
        _this.gets3curl();
        _this.goThroughLogin().then(
            (status) => {
                console.log("Status:", status);
                if (status) {
                    _this.parentCustomer = _this.groupService.getitemFromGroupStorage('ynw-user');
                    _this.initDonation().then(
                        (status) => {
                            console.log("init Donation Status1:", status);
                            _this.getOneTimeInfo(_this.parentCustomer, _this.accountId).then(
                                (questions) => {
                                    console.log("Questions:", questions);
                                    // _this.onetimeQuestionnaireList = { "questionnaireId": "WalkinConsumer", "id": 7, "labels": [{ "transactionType": "CONSUMERCREATION", "transactionId": 0, "channel": "ANY", "questionnaireId": "WalkinConsumer", "questions": [{ "id": 18, "labelName": "General Health3", "sequnceId": "", "fieldDataType": "bool", "fieldScope": "consumer", "label": "Do you have any chronic diseases?", "labelValues": ["Yes", "No"], "billable": false, "mandatory": false, "scopTarget": { "target": [{ "targetUser": "PROVIDER" }, { "targetUser": "CONSUMER" }] } }] }] };
                                    if (questions) {
                                        _this.onetimeQuestionnaireList = questions;
                                        if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                                            _this.bookStep = 'profile';
                                        } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                            _this.bookStep = 'qnr';
                                        } else {
                                            _this.bookStep = 'donation';
                                        }
                                        _this.loggedIn = true;
                                    } else {
                                        if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
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
        this.sharedServices.getPaymentModesofProvider(this.accountId, this.selectedServiceId, 'donation')
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
        this.paymentMode = event.value;
        this.isInternational = false;
    }
    non_indian_modes_onchange(event) {
        this.paymentMode = event.value;
        this.isInternational = true;
    }
    togglepaymentMode() {
        this.shownonIndianModes = !this.shownonIndianModes;
        this.paymentMode = null;
    }
    addDonor() {
        if (this.donorFirstName.trim() === '') {
            this.firstNameRequired = 'Please enter the first name';
            return;
        } if (this.donorLastName.trim() === '') {
            this.lastNameRequired = 'Please enter the last name';
            return;
        }
        setTimeout(() => {
            this.action = '';
        }, 500);
        this.closebutton.nativeElement.click();
        this.donorName = this.donorFirstName.trim() + ' ' + this.donorLastName.trim();
    }

    addPhone() {
        this.phoneError = '';
        this.resetApiErrors();
        // this.resetApi();
        const curphone = this.selected_phone;
        const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const result = pattern.test(curphone);
        const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const result1 = pattern1.test(curphone);
        if (this.selected_phone === '') {
            this.phoneError = Messages.BPROFILE_PHONENO;
            return;
        } if (!result) {
            this.phoneError = 'Please enter valid phone number'// Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
            // console.log('Message',Messages.BPROFILE_PRIVACY_PHONE_INVALID)
            return;
        }
        if (!result1) {
            this.phoneError = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
            return;
        }

        {
            this.userPhone = this.selected_phone;
            // this.edit = true;
            setTimeout(() => {
                this.action = '';
            }, 500);
            this.closebutton.nativeElement.click();
        }
    }
    editPhone() {
        // this.edit = false;
        this.action = 'phone';
        this.selected_phone = this.userPhone;
    }
    editDonor(email: any, name: any, phone: any) {
        console.log('email', email)
        console.log('donorName', name)
        console.log('userPhone', phone)
        // console.log('Donor first',this.donorfirst)
        // this.tempDonorName = 'name' + name;
        // this.tempDonorPh = 'phone' + phone;
        // this.tempDonorEmail = 'email' + email;

        this.action = 'donor';
        // this.edit = false;
        this.action = 'phone';
        this.selected_phone = this.userPhone;
        this.action = 'email';
        this.confrmshow = false;
        this.payEmail = email;
        this.payEmail1 = '';
    }

    donorDetails(donorDetails?: any) {
        if (donorDetails) {
            this.donorSelectedField = donorDetails;
        } else {
            if (this.donorSelectedField) {
                if (this.donorSelectedField.startsWith('f') || this.donorSelectedField.startsWith('l')) {
                    this.addDonor()
                }
                if (this.donorSelectedField.startsWith('p')) {
                    this.addPhone()
                }
                if (this.donorSelectedField.startsWith('e')) {
                    this.addEmail()
                }
            }
        }
    }
    onButtonBeforeHook() {
    }
    onButtonAfterHook() { }

    // setAccountGallery(res) {
    //     console.log('response.........', res);
    //     this.galleryenabledArr = []; // For showing gallery
    //     this.image_list_popup = [];
    //     this.tempgalleryjson = res;
    //     if (this.tempgalleryjson.length > 5) {
    //         this.extra_img_count = this.tempgalleryjson.length - 5;
    //     }
    //     let indx = 0;
    //     // if (this.bLogo !== '../../../assets/images/img-null.svg') {
    //     //     this.galleryjson[0] = { keyName: 'logo', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
    //     //     indx = 1;
    //     // }
    //     for (let i = 0; i < this.tempgalleryjson.length; i++) {
    //         this.galleryjson[(i + indx)] = this.tempgalleryjson[i];
    //     }
    //     if (this.galleryjson.length > 0) {
    //         console.log('this.galleryjson', this.galleryjson)
    //         this.galleryExists = true;
    //         for (let i = 0; i < this.galleryjson.length; i++) {
    //             const imgobj = new Image(
    //                 i,
    //                 { // modal
    //                     img: this.galleryjson[i].url,
    //                     description: this.galleryjson[i].caption || ''
    //                 });
    //             // this.image_list_popup.push(imgobj);
    //             this.image_list_popup.push(imgobj);
    //         }
    //         console.log('image_list_popup..', this.image_list_popup)
    //     }
    //     this.imgLength = this.image_list_popup.length;
    //     const imgLength = this.image_list_popup.length > 5 ? 5 : this.image_list_popup.length;
    //     console.log(imgLength)
    //     for (let i = 0; i < imgLength; i++) {
    //         this.galleryenabledArr.push(i);
    //         console.log("......", this.galleryenabledArr)
    //     }
    // }
    private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
        return image ? images.indexOf(image) : -1;
    }
    openImageModalRow(image: Image) {
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
        console.log(index)
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
        this.phoneError = '';
    }
    setServiceDetails(curservid) {
        this.selectedService = this.services.filter(service => service.id === curservid)[0];
        console.log('donation details.......', this.selectedService);
        // if (this.selectedService && this.selectedService['servicegallery']) {
        //     this.setAccountGallery(this.selectedService.servicegallery)
        // }
    }
    showConfrmEmail() {
        this.confrmshow = true;
    }
    handleConsumerNote(vale) {
        this.consumerNote = vale.trim();
    }
    goToGateway() {
        this.isClickedOnce = true;
        // this.resetApi();
        if (this.selectedServiceId) {

        } else {
            this.snackbarService.openSnackBar('Donation service is not found', { 'panelClass': 'snackbarerror' });
            return;
        }
        let paymenttype = this.paymentMode;
        this.donate(paymenttype);
    }
    donate(paymentWay) {
        // this.showEditView = false;
        const post_Data = {
            'consumer': {
                'id': this.parentCustomer.id
            },
            'providerConsumer': {
                'id': this.providerConsumerId
            },
            'service': {
                'id': this.selectedServiceId
            },
            'location': {
                'id': this.locationId
            },
            'date': this.donationDate,
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
        if (this.donationAmount) {
            this.addDonationConsumer(post_Data, paymentWay);
        } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar('Please enter valid donation amount', { 'panelClass': 'snackbarerror' });
        }
    }
    validate(event) {
        this.donationAmount = event.target.value;
        console.log("EVent:", event);
    }
    addDonationConsumer(post_Data, paymentWay) {
        const _this = this;
        _this.api_loading = true;
        if (_this.from_iOS) {
            delete post_Data['providerConsumer'];
            _this.sharedServices.generateDonationLink(_this.accountId, post_Data).subscribe(
                (paymentLinkResponse: any) => {
                    console.log("Payment Link:", paymentLinkResponse);
                    _this.donationId = paymentLinkResponse['uuid'];
                    if (_this.customId) {
                        console.log("businessid" + _this.accountId);
                        _this.sharedServices.addProvidertoFavourite(_this.accountId)
                            .subscribe(() => {
                            });
                    }
                    _this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                _this.submitQuestionnaire(_this.donationId, post_Data).then(
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
            const paymentWay = _this.paymentMode;
            console.log("Going to call donation link:", paymentWay);
            _this.subs.sink = _this.sharedServices.addCustomerDonation(post_Data, _this.accountId)
                .subscribe(data => {
                    _this.donationId = data['uid'];
                    if (_this.customId) {
                        console.log("businessid" + _this.accountId);
                        _this.sharedServices.addProvidertoFavourite(_this.accountId)
                            .subscribe(() => {
                            });

                    }
                    _this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                _this.submitQuestionnaire(_this.donationId, post_Data).then(
                                    (status1) => {
                                        if (status1) {
                                            _this.consumerPayment(_this.donationId, post_Data, paymentWay);
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
        }
    }
    isDonationSuccess(paylink) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedServices.getDonationLinkUuid(paylink).subscribe(
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
        _this.paymentWindow = window.open(url, "_blank", "location=no,fullscreen=yes,toolbar=no,resizable=no;menubar=no,titlebar=no");

        let easingLoop = setInterval(function () {
            _this.paymentWindow.onbeforeunload = function () {
                _this.isClickedOnce = false;
                clearInterval(easingLoop);
                _this.cdRef.detectChanges();

            }
            console.log("Payment Window:");
            console.log(_this.paymentWindow);
            // if (!_this.paymentWindow.closed) {
            //     clearInterval(easingLoop);
            //     _this.isClickedOnce = false;
            // }
            _this.isDonationSuccess(paylink).then(
                (status) => {
                    if (status) {
                        clearInterval(easingLoop);
                        _this.paymentWindow.close();
                        _this.isClickedOnce = false;
                        _this.cdRef.detectChanges();
                        // if (_this.from) {
                        //     _this.ngZone.run(() => _this.router.navigate(['consumer']));
                        // } else {
                        let queryParams = {
                            accountId: _this.accountId,
                            theme: _this.theme
                        }
                        if (_this.customId) {
                            queryParams['customId'] = _this.customId;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        _this.ngZone.run(() => _this.router.navigate(['consumer'], navigationExtras));
                        // }
                    }
                });
        }, 3000);
    }

    consumerPayment(uid, post_Data, paymentWay) {
        const payInfo: any = {
            'amount': post_Data.donationAmount,
            'custId': this.parentCustomer.id,
            'paymentMode': paymentWay,
            'uuid': uid,
            'accountId': this.accountId,
            'source': 'Desktop',
            'purpose': 'donation',
            'serviceId': this.selectedServiceId
        };
        payInfo.isInternational = this.isInternational;
        this.lStorageService.setitemonLocalStorage('uuid', uid);
        this.lStorageService.setitemonLocalStorage('acid', this.accountId);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_d');
        this.subs.sink = this.sharedServices.consumerPayment(payInfo)
            .subscribe((pData: any) => {
                console.log("Payment Info:", pData);
                // this.checkIn_type = 'donations';
                // this.origin = 'consumer';
                this.pGateway = pData.paymentGateway;
                if (this.pGateway === 'RAZORPAY') {
                    this.paywithRazorpay(pData);
                } else {
                    if (pData['response']) {
                        this.payWithPayTM(pData, this.accountId);
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
        pData.paymentMode = this.paymentMode;
        this.razorpayService.initializePayment(pData, this.accountId, this);
    }
    payWithPayTM(pData: any, accountId: any) {
        this.loadingPaytm = true;
        pData.paymentMode = this.paymentMode;
        this.paytmService.initializePayment(pData, projectConstantsLocal.PAYTM_URL, accountId, this);
    }
    finishDonation(status, response?) {
        if (status) {
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
            let queryParams = {
                account_id: this.accountId,
                uuid: this.donationId,
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
        } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            if (this.from) {
                this.ngZone.run(() => this.router.navigate(['consumer']));
            } else {
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
    }
    transactionCompleted(response, payload, accountId) {
        if (response.SRC) {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
                    .then((data) => {
                        if (data) {
                            this.finishDonation(true, response);
                        }
                    },
                        error => {
                            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                        })
            } else if (response.STATUS == 'TXN_FAILURE') {
                this.finishDonation(false);
            }
        } else {
            if (response.STATUS == 'TXN_SUCCESS') {
                this.paytmService.updatePaytmPay(payload, accountId)
                    .then((data) => {
                        if (data) {
                            this.finishDonation(true, response);
                        }
                    },
                        error => {
                            this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
                        })
            } else if (response.STATUS == 'TXN_FAILURE') {
                this.finishDonation(false);
            }
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
        // this.resetApi();
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
                if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.bookStep = 'qnr';
                } else if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                    this.bookStep = 'profile';
                } else {
                    this.location.back();
                }
            } else if (this.bookStep === 'qnr') {
                if (this.onetimeQuestionnaireList && this.onetimeQuestionnaireList.labels && this.onetimeQuestionnaireList.labels.length > 0 && this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
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
    showCheckinButtonCaption() {
        let caption = '';
        caption = 'Confirm';
        return caption;
    }
    // editClicked() {
    //     this.showEditView = true;
    // }
    // resetApi() {
    //     this.api_error = null;
    //     this.api_success = null;
    // }
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
        this.subs.sink = this.sharedServices.addConsumerWaitlistNote(this.accountId, uuid,
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
        // this.api_loading1 = true;
        let accountS3List = 'settings,terminologies,businessProfile,gallery,donationServices';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.uniqueId,
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
                    // this.api_loading1 = false;
                }
            );
    }
    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        console.log('result....', result)
        switch (type) {
            // case 'settings': {
            //     this.settingsjson = result;
            //     break;
            // }
            case 'terminologies': {
                // this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(result);
                break;
            }
            case 'businessProfile': {
                // this.businessjson = result;
                this.businessInfo['businessName'] = result.businessName;

                if (!this.businessInfo['locationName']) {
                    this.businessInfo['locationName'] = result.baseLocation?.place;
                }
                if (!this.businessInfo['googleMapUrl']) {
                    this.businessInfo['googleMapUrl'] = result.baseLocation?.googleMapUrl;
                }
                if (result['logo']) {
                    this.businessInfo['logo'] = result['logo'];
                }
                break;
            }
            // case 'gallery': {
            //     if (result) {
            //         this.setAccountGallery(result);
            //     }
            //     break;
            // }
            case 'donationServices': {
                this.services = result;
                if (this.services.length > 0) {
                    if (!this.selectedServiceId) {
                        this.selectedServiceId = this.services[0].id;
                    }
                    this.setServiceDetails(this.selectedServiceId); // setting the details of the first service to the holding variable
                }
                break;
            }
        }
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumericwithoutdot(evt);
    }
    isValid(evt) {
        console.log(evt);
        return this.sharedFunctionobj.isValid(evt);
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
            _this.subs.sink = _this.sharedServices.getDonationQuestionnaire(_this.selectedServiceId, _this.accountId).subscribe(data => {
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
                _this.sharedServices.submitDonationQuestionnaire(uuid, dataToSend, _this.accountId).subscribe((data: any) => {
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
                                        _this.sharedServices.consumerDonationQnrUploadStatusUpdate(uuid, _this.accountId, postData)
                                            .subscribe((data) => {
                                                _this.api_loading_video = true;
                                                resolve(true);
                                                _this.api_loading_video = false;
                                            },
                                                error => {
                                                    _this.isClickedOnce = false;
                                                    _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                                    _this.api_loading_video = false;
                                                    resolve(false);
                                                });

                                    }

                                },
                                    error => {
                                        this.isClickedOnce = false;
                                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                        this.api_loading_video = false;
                                    });
                        }
                    } else {
                        resolve(true);
                    }
                },
                    error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
            this.sharedServices.validateConsumerQuestionnaire(this.questionAnswers.answers, this.accountId).subscribe((data: any) => {
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
        console.log("Before Validation", this.oneTimeInfo);
        if (this.oneTimeInfo.answers) {
            const questions = this.oneTimeInfo.answers.answerLine.map(function (a) { return a.labelName; })
            const dataToSend: FormData = new FormData();
            const answer = new Blob([JSON.stringify(this.oneTimeInfo.answers)], { type: 'application/json' });
            const question = new Blob([JSON.stringify(questions)], { type: 'application/json' });
            dataToSend.append('answer', answer);
            dataToSend.append('question', question);
            this.sharedServices.validateConsumerOneTimeQuestionnaire(dataToSend, this.accountId, '').subscribe((data: any) => {
                if (data.length === 0) {
                    this.submitOneTimeInfo().then(
                        (status) => {
                            if (status) {
                                this.getBookStep('profile');
                            }
                        })
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    getBookStep(curStep) {
        if (curStep === 'profile') {
            if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                this.bookStep = 'qnr';
            } else {
                this.bookStep = 'donation';
            }
        }
    }
    resetErrors() {
        this.firstNameRequired = null;
        this.lastNameRequired = null;
    }
    actionPerformed(status) {
        const _this = this;
        if (status === 'success') {
            this.loggedIn = true;
            _this.parentCustomer = _this.groupService.getitemFromGroupStorage('ynw-user');
            this.initDonation().then(
                (status) => {
                    console.log("init Donation Status:", status);
                    _this.getOneTimeInfo(_this.parentCustomer, _this.accountId).then(
                        (questions) => {
                            _this.onetimeQuestionnaireList = questions;
                            console.log("Questions:", questions);
                            if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                                _this.bookStep = 'profile';
                            } else if (_this.questionnaireList && _this.questionnaireList.labels && _this.questionnaireList.labels.length > 0) {
                                _this.bookStep = 'qnr';
                            } else {
                                _this.bookStep = 'donation';
                            }
                            _this.loggedIn = true;
                            _this.loading = false;
                        }
                    )
                }
            );
        }
    }
    setProviderConsumerList(jaldeeConsumerId, accountId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedServices.getProviderCustomerList(jaldeeConsumerId, accountId).subscribe(
                (providerConsumerList) => {
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
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        const _this = this;
        return new Promise(function (resolve, reject) {
            const providerConsumer = _this.providerConsumerList.filter(user => user.firstName === member.firstName && user.LastName === member.LastName);

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
                    const providerConsumer_parent = _this.providerConsumerList.filter(user => user.firstName === activeUser.firstName && user.LastName === activeUser.LastName);
                    console.log("Family Members:", _this.familyMembers);
                    console.log("Member Id", member.id);
                    console.log("Parent:", providerConsumer_parent);
                    if (providerConsumer_parent && providerConsumer_parent.length > 0) {
                        parentId = providerConsumer_parent[0].id;
                    }
                    const selectedMember = _this.familyMembers.filter(memb => memb.user === member.id);
                    console.log("Selected Member:", selectedMember);
                    if (selectedMember && selectedMember.length > 0) {
                        if (selectedMember[0].parent) {
                            memberId = member.id;
                        } else {
                            memberId = 0;
                            parentId = activeUser.id;
                        }
                    } else {
                        memberId = 0;
                        parentId = activeUser.id;
                    }
                }
                console.log("Call Started");
                _this.sharedServices.createProviderCustomer(memberId, parentId, accountId).subscribe(
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
                    _this.sharedServices.getProviderCustomerOnetimeInfo(providerConsumerId, accountId).subscribe(
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
    getOneTimeQuestionAnswers(event) {
        this.oneTimeInfo = event;
        console.log("OneTimeInfo:", this.oneTimeInfo);
    }
    submitOneTimeInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.onetimeQuestionnaireList && _this.onetimeQuestionnaireList.labels && _this.onetimeQuestionnaireList.labels.length > 0 && _this.onetimeQuestionnaireList.labels[0].questions.length > 0) {
                const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
                const dataToSend: FormData = new FormData();
                if (_this.oneTimeInfo.files) {
                    for (const pic of _this.oneTimeInfo.files) {
                        dataToSend.append('files', pic, pic['name']);
                    }
                }
                const blobpost_Data = new Blob([JSON.stringify(_this.oneTimeInfo.answers)], { type: 'application/json' });
                dataToSend.append('question', blobpost_Data);
                _this.subs.sink = _this.sharedServices.submitCustomerOnetimeInfo(dataToSend, activeUser.id, _this.accountId).subscribe((data: any) => {
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
                    //                     this.shared_services.consumerApptQnrUploadStatusUpdate(uuid, this.accountId, postData)
                    //                         .subscribe((data) => {
                    //                             this.paymentOperation(paymenttype);
                    //                         },
                    //                             error => {
                    //                                 this.isClickedOnce = false;
                    //                                 this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    //                                 this.api_loading_video = false;
                    //                             });
                    //                 }
                    //             },
                    //                 error => {
                    //                     this.isClickedOnce = false;
                    //                     this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    //                     this.api_loading_video = false;
                    //                 });
                    //     }
                    // }
                    resolve(true);
                },
                    error => {
                        _this.isClickedOnce = false;
                        _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        resolve(false);
                        // this.api_loading_video = false;
                    });
            } else {
                resolve(true);
            }
        });
    }
}
