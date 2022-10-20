import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ServicesService } from './services.service';
import { Subscription } from 'rxjs';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { FormMessageDisplayService } from '../form-message-display/form-message-display.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { SharedServices } from '../../services/shared-services';
import { ProviderServices } from '../../../business/services/provider-services.service';
import { Router } from '@angular/router';
import { ProviderDataStorageService } from '../../../business/services/provider-datastorage.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { SnackbarService } from '../../services/snackbar.service';
import { WordProcessor } from '../../services/word-processor.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
import { GroupStorageService } from '../../services/group-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { UserlistpopupComponent } from './userlist/userlistpopup.component';
import { ServiceQRCodeGeneratordetailComponent } from './serviceqrcodegenerator/serviceqrcodegeneratordetail.component';




@Component({
    selector: 'app-jaldee-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.css']
})

export class ServiceComponent implements OnInit, OnDestroy {
    @Input() serviceFrom;
    @Input() source;
    number_decimal_pattern = '^[0-9]+\.?[0-9]*$';
    number_pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
    end_service_notify_cap = '';
    end_cause_notify_cap = '';
    service_cap = Messages.PRO_SERVICE_CAP;
    description_cap = Messages.DESCRIPTION_CAP;
    price_cap = Messages.PRICES_CAP;
    service_name_cap = Messages.SERVICE_NAME_CAP;
    est_duration_cap = Messages.SERVICE_DURATION_CAP;
    enable_prepayment_cap = Messages.ENABLE_PREPAYMENT_CAP;
    frm_enable_prepayment_cap = '';
    prepayment_cap = Messages.PREPAYMENT_CAP;
    tax_applicable_cap = Messages.TAX_APPLICABLE_CAP;
    service_notify_cap = '';
    push_message_cap = Messages.PUSH_MESSAGE_CAP;
    service_email_cap = Messages.SERVICE_EMAIL_CAP;
    gallery_cap = Messages.GALLERY_CAP;
    select_image_cap = Messages.SELECT_IMAGE_CAP;
    go_to_service_cap = Messages.GO_TO_SERVICE_CAP;
    delete_btn = Messages.DELETE_BTN;
    cancel_btn = Messages.CANCEL_BTN;
    service_price_cap = Messages.SERVPRICE_CAP;
    end_of_service_notify = projectConstantsLocal.PROFILE_ERROR_STACK;
    pre_pay_amt = Messages.PREPAYMENT_CAP;
    enable_cap = Messages.ENABLE_CAP;
    disbale_cap = Messages.DISABLE_CAP;
    serv_gallery = Messages.SERVICE_GALLERY_CAP;
    havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    serv_status = Messages.SERVICE_STATUS_CAP;
    photo_cap = Messages.SERVICE_PHOTO_CAP;
    tooltip = Messages.NEW_SERVICE_TOOLTIP;
    tooltipDonation = Messages.NEW_DONATION_TOOLTIP;
    frm_service_price = Messages.SER_PRICE;
    rupee_symbol = '₹';
    base_licence = false;
    is_virtual_serv = false;
    is_service_request = false;
    is_checked_request = false;
    is_checked_booking = true;
    button_title = 'Save';
    customer_label = '';
    char_count = 0;
    max_char_count = 500;
    isfocused = false;
    servstatus = false;
    maxlimit = projectConstants.PRICE_MAX_VALUE;
    serviceForm: FormGroup;
    serviceSubscription: Subscription;
    preSubscription: Subscription;
    action = 'show';
    service;
    service_data;
    paymentsettings;
    taxsettings;
    subdomainsettings;
    showResources;
    showService = false;
    advanced = false;
    duration = { hour: 0, minute: 0 };
    showAdvancedSettings = false;
    showBillingInfo = true;
    departments: any = [];
    filterDepart = false;
    departmentName;
    bprofile: any = [];
    locationExists = false;
    serv_mode: any;
    appointmentRequestMode : any;
    serv_type: any;
    is_physical = 0;
    is_donation = false;
    userId: any;
    departmentId: any;
    userspecific = false;
    teleCallingModes = {
        'callingMode': '',
        'status': 'ACTIVE',
        'value': '',
        'instructions': '',
        'countryCode': ''
    };
    vcallmodes;
    modeselected = false;
    selctd_tool: any;
    is_tool = false;
    tool_id;
    is_virtual_enable = false;
    telemodes: any = [];
    tool_name: any;
    tools_ids: any;
    tool_instruct: any;
    default_instruct: any;
    is_lvtrack_enable = false;
    users_list;
    providerId: any;
    provider: { id: any; };
    departId: any;
    include_audio = false;
    selectedUser;
    defaultOption = {
        'id': '0',
        'firstName': 'Global',
        'lastName': 'Service'
    };
    include_video = false;
    preInfoEnabled = false;
    postInfoEnabled = false;
    preInfoText = '';
    postInfoText = '';
    preInfoTitle = '';
    postInfoTitle = '';
    public Editor = DecoupledEditor;
    consumerNote = 'Add Notes';
    showConsumerNote = false;
    showInfo = false;
    showInfoType;
    tempPreInfoEnabled = false;
    tempPostInfoEnabled = false;
    tempPreInfoText = '';
    tempPostInfoText = '';
    tempPreInfoTitle = '';
    tempPostInfoTitle = '';
    showEditSection = false;
    savedisabled = false;
    active_user: any;
    showNoteError = '';
    questionnaire: any = [];
    no_of_grids: number;
    screenWidth: number;
    usersdialogRef: any;
    team: any = [];
    userNamelist: string;
    maxuserLength = 50;
    qrdialogRef: any;
    wndw_path = projectConstantsLocal.PATH;
    tool_code;
    priceDescription = false;
    showServiceduration = true;
    showOnlyAvailableSlots = true;
    showPrice;
    paymentSubscription: any;
    paymentProfiles: any = [];
    selected = false;
    selectedPaymentProfile: any;
    // show_internationalmode = false;

    constructor(private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public sharedFunctons: SharedFunctions,
        public servicesService: ServicesService,
        public shared_service: SharedServices,
        public provider_services: ProviderServices,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private provider_datastorage: ProviderDataStorageService,
        private dateTimeProcessor: DateTimeProcessor,
        private groupService: GroupStorageService,
        private dialog: MatDialog,
        public router: Router) {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.frm_enable_prepayment_cap = Messages.FRM_LEVEL_PREPAYMENT_SETTINGS_MSG;
        this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.preSubscription = this.sharedFunctons.getMessage().subscribe(
            (message: any) => {
                switch (message.ttype) {
                    case 'hide-prepost': {
                        this.showInfo = false;
                    }
                }
            });
        this.paymentSubscription = this.provider_services.getPaymentProfiles()
            .subscribe((data: any) => {
                this.paymentProfiles = data;
            }
                , error => {
                    this.paymentProfiles = [];
                });
        this.serviceSubscription = this.servicesService.initService.subscribe(
            (serviceParams: any) => {
                if (serviceParams) {
                    this.showService = true;
                    this.action = serviceParams.action;
                    this.service = serviceParams.service;
                    this.paymentsettings = serviceParams.paymentsettings;
                    this.taxsettings = serviceParams.taxsettings;
                    this.subdomainsettings = serviceParams.subdomainsettings;
                    console.log("this.subdomainsettings",this.subdomainsettings);
                    this.showResources = this.subdomainsettings.serviceSharing;
                    this.userId = serviceParams.userId;
                    this.departmentId = serviceParams.deptId;
                    if (this.action === 'add') {
                        this.service = null;
                        this.createForm();
                    } else {
                        this.service_data = this.service;
                        console.log("this.service_data",this.service_data)
                        if (this.service_data.paymentProfileId) {
                            this.getPaymentProfileDetails(this.service_data.paymentProfileId)
                        }
                      
                        if (this.action === 'show' && this.active_user.accountType === 'BRANCH') {
                            this.getDepartments(this.service.department);
                        }
                        if (this.service_data) {
                           
                            if (this.service_data.status === 'ACTIVE') {
                                this.servstatus = true;
                            } else {
                                this.servstatus = false;
                            }
                            if (this.action === 'edit') {
                                this.createForm();

                                if (this.service_data.serviceType === 'virtualService') {
                                    this.is_virtual_serv = true;
                                }
                                
                                if(this.service_data.serviceBookingType === 'request'){
                                    this.is_checked_request = true;
                                    this.is_checked_booking = false;
                                    this.serviceForm.patchValue({
                                    'date':  this.serviceForm.get('date').value,
                                    'dateTime': this.serviceForm.get('dateTime').value,
                                    'noDateTime':  this.serviceForm.get('noDateTime').value,
                                })
                                }
                                if(this.service_data.serviceBookingType === 'booking'){
                                    this.is_checked_booking = true;
                                    this.is_checked_request = false;
                                }
                                if (this.paymentProfiles.length !== 0) {
                                    this.serviceForm.get('paymentProfileId').setValue('spDefaultBillProfile');
                                }
                                this.showServiceduration = this.service_data.serviceDurationEnabled;
                                this.showOnlyAvailableSlots = this.service_data.showOnlyAvailableSlots;
                                if(this.service_data && this.service_data.showPrice){
                                    this.showPrice = this.service_data.showPrice;
                                }
                               
                                this.preInfoEnabled = this.service_data.preInfoEnabled;
                                this.postInfoEnabled = this.service_data.postInfoEnabled;
                                this.preInfoTitle = this.service_data.preInfoTitle || '';
                                this.preInfoText = this.service_data.preInfoText || '';
                                this.postInfoTitle = this.service_data.postInfoTitle || '';
                                this.postInfoText = this.service_data.postInfoText || '';
                                if (this.service_data.paymentProfileId) {
                                    this.serviceForm.patchValue({
                                        'paymentProfileId': this.service_data['paymentProfileId'] || ''
                                    })
                                }
                                if (this.service_data['consumerNoteMandatory']) {
                                    this.showConsumerNote = true;
                                    this.consumerNote = this.service_data['consumerNoteTitle'];
                                }
                                if (!this.subdomainsettings.serviceBillable) {
                                    if (this.service_data.serviceType === 'donationService') {
                                        this.serviceForm.patchValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'consumerNoteMandatory': this.service_data['consumerNoteMandatory'] || this.serviceForm.get('consumerNoteMandatory').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'minDonationAmount': this.service_data['minDonationAmount'] || this.serviceForm.get('minDonationAmount').value || '1',
                                            'maxDonationAmount': this.service_data['maxDonationAmount'] || this.serviceForm.get('maxDonationAmount').value || '1',
                                            'multiples': this.service_data['multiples'] || this.serviceForm.get('multiples').value || '1',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'priceDynamic': this.service_data['priceDynamic'] ? true : false,
                                            'paymentDescription': this.service_data['paymentDescription'] || this.serviceForm.get('paymentDescription').value,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value,
                                            'serviceBookingType': this.service_data['serviceBookingType'] || this.serviceForm.get('serviceBookingType').value,
                                            'date': this.serviceForm.get('date').value,
                                            'dateTime': this.serviceForm.get('dateTime').value,
                                            'noDateTime': this.serviceForm.get('noDateTime').value,
                        
                                        });
                                    } else {
                                        this.serviceForm.patchValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'resoucesRequired': this.service_data['resoucesRequired'] || this.serviceForm.get('resoucesRequired').value,
                                            'maxBookingsAllowed': this.service_data['maxBookingsAllowed'] || this.serviceForm.get('maxBookingsAllowed').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value,
                                            'serviceBookingType': this.service_data['serviceBookingType'] || this.serviceForm.get('serviceBookingType').value,
                                            'date': this.serviceForm.get('date').value,
                                            'dateTime': this.serviceForm.get('dateTime').value,
                                            'noDateTime': this.serviceForm.get('noDateTime').value,

                                        });
                                    }
                                    if (this.service_data.serviceType === 'virtualService') {
                                        this.tool_name = this.service_data.virtualCallingModes[0].callingMode;
                                        this.tool_id = this.service_data.virtualCallingModes[0].value;
                                        this.tool_instruct = this.service_data.virtualCallingModes[0].instructions;
                                        if (this.service_data.virtualCallingModes[0].countryCode) {
                                            this.tool_code = this.service_data.virtualCallingModes[0].countryCode;
                                        }
                                        else{
                                            this.tool_code = "+91";
                                        }
                                    }
                                } else {
                                    if (this.service_data.serviceType === 'donationService') {
                                        this.serviceForm.patchValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'consumerNoteMandatory': this.service_data['consumerNoteMandatory'] || this.serviceForm.get('consumerNoteMandatory').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'minDonationAmount': this.service_data['minDonationAmount'] || this.serviceForm.get('minDonationAmount').value || '1',
                                            'maxDonationAmount': this.service_data['maxDonationAmount'] || this.serviceForm.get('maxDonationAmount').value || '1',
                                            'multiples': this.service_data['multiples'] || this.serviceForm.get('multiples').value || '1',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'priceDynamic': this.service_data['priceDynamic'] ? true : false,
                                            'paymentDescription': this.service_data['paymentDescription'] || this.serviceForm.get('paymentDescription').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value,
                                            'serviceBookingType': this.service_data['serviceBookingType'] || this.serviceForm.get('serviceBookingType').value,
                                            'date': this.serviceForm.get('date').value,
                                            'dateTime': this.serviceForm.get('dateTime').value,
                                            'noDateTime': this.serviceForm.get('noDateTime').value,

                                        });
                                    } else {
                                        this.serviceForm.patchValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'resoucesRequired': this.service_data['resoucesRequired'] || this.serviceForm.get('resoucesRequired').value,
                                            'maxBookingsAllowed': this.service_data['maxBookingsAllowed'] || this.serviceForm.get('maxBookingsAllowed').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'consumerNoteMandatory': this.service_data['consumerNoteMandatory'] || this.serviceForm.get('consumerNoteMandatory').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value,
                                            'priceDynamic': this.service_data['priceDynamic'] ? true : false,
                                            'paymentDescription': this.service_data['paymentDescription'] || this.serviceForm.get('paymentDescription').value,
                                            'serviceBookingType': this.service_data['serviceBookingType'] || this.serviceForm.get('serviceBookingType').value,
                                            'date':  this.serviceForm.get('date').value,
                                            'dateTime':  this.serviceForm.get('dateTime').value,
                                            'noDateTime': this.serviceForm.get('noDateTime').value,

                                        });
                                        if (this.service_data.serviceType === 'virtualService') {
                                            this.tool_name = this.service_data.virtualCallingModes[0].callingMode;
                                            this.tool_id = this.service_data.virtualCallingModes[0].value;
                                            this.tool_instruct = this.service_data.virtualCallingModes[0].instructions;
                                            if (this.service_data.virtualCallingModes[0].countryCode) {
                                                this.tool_code = this.service_data.virtualCallingModes[0].countryCode;
                                            }
                                            else{
                                                this.tool_code = "+91";
                                            }
                                        }
                                    }
                                    this.convertTime(this.service_data['serviceDuration']);
                                    this.changePrepayment();
                                }
                                this.changeNotification();
                            }
                        }
                    }
                }
            }
        );
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = window.innerWidth;
        let divider;
        const divident = this.screenWidth / 37.8;
        if (this.screenWidth > 1700) {
            divider = divident / 5;
        } else if (this.screenWidth > 1111 && this.screenWidth < 1700) {
            divider = divident / 4;
        } else if (this.screenWidth > 900 && this.screenWidth < 1111) {
            divider = divident / 3;
        } else if (this.screenWidth > 375 && this.screenWidth < 900) {
            divider = divident / 2;
        } else if (this.screenWidth < 375) {
            divider = divident / 1;
        }
        this.no_of_grids = Math.round(divident / divider);
    }
    @Input() donationservice;
    setDescFocus() {
        this.isfocused = true;
        this.char_count = this.max_char_count - this.serviceForm.get('description').value.length;
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        this.char_count = this.max_char_count - this.serviceForm.get('description').value.length;
    }
    isNumeric(evt) {
        return this.sharedFunctons.isNumeric(evt);
    }
    isvalid(evt, name) {
        // tslint:disable-next-line:radix
        const value = parseInt(evt.target.value);
        // tslint:disable-next-line:radix
        const max = parseInt(evt.target.max);
        if (value > max) {
            let numString = evt.target.value;
            evt.preventDefault();
            numString = numString.substr(0, numString.length - 1);
            // tslint:disable-next-line:radix
            this.serviceForm.get(name).setValue(parseInt(numString));
            return false;
        }
        return true;
    }
    onAdvanced() {
        if (this.advanced === false) {
            this.advanced = true;
        } else {
            this.advanced = false;
        }
    }
    // togglepaymentMode() {
    //     this.show_internationalmode = !this.show_internationalmode;
    // }
    getPaymentProfileDetails(profileId) {
        this.selectedPaymentProfile = this.paymentProfiles.filter(profile => profile.profileId === profileId);

    }

    radioChanage(event) {
        this.selected = true;
    }
    getUniqueModes(modes) {
        let indian_modes = [];
        let international_modes = []
        if (modes.indiaPay && modes.indianPaymodes) {
            modes.indianPaymodes.forEach(element => {
                indian_modes.push(element.mode)
            });


        }
        if (modes.internationalPay) {
            modes.internationalPaymodes.forEach(element => {
                international_modes.push(element.mode)
            });

        }
        //return indian_modes.concat(international_modes).unique();
        return new Set([...indian_modes, ...international_modes]);
        //  return indian_modes.concat(international_modes.filter(x => indian_modes.every(y => y !== x)))
    }
    selectServiceHandler(event) {
        console.log("selectServiceHandlerCalled");
        this.serv_type = event;
        if (event === 'virtualService') {
            this.serviceForm.controls['virtualServiceType'].enable();
            this.serviceForm.get('virtualServiceType').setValue('');
            this.is_virtual_serv = true;
            this.is_physical = 1;
        } else {
            this.serviceForm.controls['virtualServiceType'].disable();
            this.is_virtual_serv = false;
            this.is_tool = false;
            this.modeselected = false;
            this.is_physical = 2;
        }
    }
    selectServiceTypeHandler(event) {
        console.log("Tele mode :",event);
        this.tool_name = '';
        this.serv_mode = event;
        this.modeselected = true;
        this.is_tool = false;
        this.getVirtualCallingModesList();
    }
    selectServiceRequestModeHandler(event){
        console.log("Selected Mode :",event);
        if(event === 'dateTime'){
            // this.serviceForm.addControl('dateTime',
            // new FormControl(event));
            // this.serviceForm['dateTime'].setValue('true');
            // this.serviceForm['date'].setValue('false');
            this.serviceForm.controls['dateTime'].setValue(true);
            // this.serviceForm.controls['date'].setValue(false);
            // this.serviceForm.controls['noDateTime'].setValue(false);

        }
        else if(event === 'date'){
            // this.serviceForm.addControl('date',
            // new FormControl(event));
            // this.serviceForm.controls['dateTime'].setValue(false);
            this.serviceForm.controls['date'].setValue(true);
            // this.serviceForm.controls['noDateTime'].setValue(false);


        }
        else{
            this.serviceForm.controls['noDateTime'].setValue(true);
            // this.serviceForm.controls['date'].setValue(false);
            // this.serviceForm.controls['dateTime'].setValue(false);


             
        }
    }
    selectToolTypeHandler(event) {
        console.log("selectToolTypeHandler :",event)
        this.getVirtualCallingModesList();
        this.selctd_tool = event;
       this.tool_id = '';
        this.tool_code = '+91';
        this.is_tool = true;
        this.provider_services.getvirtualServiceInstructions().subscribe(
            (data: any) => {
                this.default_instruct = data;
                for (const i in this.default_instruct) {
                    if (this.selctd_tool === i) {
                        this.tool_instruct = this.default_instruct[i];
                    }
                }
            }
        );
    }
    selectRequest(event){
        console.log("Service Request :",event);
        if (event === 'request') {
            //this.serviceForm.addControl('serviceBookingType') = event;
            // this.serviceForm.addControl('serviceBookingType',
            // new FormControl(event));
            // this.serviceForm.controls['serviceBookingType'].enable();
            // this.serviceForm.get('serviceBookingType').setValue('');
            this.serviceForm.controls['serviceBookingType'].setValue(event);
            this.is_service_request = true;
            this.is_checked_request = true;
            this.is_checked_booking = false;
           // this.is_physical = 1;
        }
        
        if(event === 'booking') {
            this.serviceForm.controls['serviceBookingType'].setValue(event);
            this.is_service_request = false;
            this.is_checked_request = false;
            this.is_checked_booking = true;
           // this.is_tool = false;
           // this.modeselected = false;
           // this.is_physical = 2;
        }

    }
    changeNotification() {
        if (this.serviceForm.get('notification').value === false) {
            this.serviceForm.removeControl('notificationType');
        } else {
            let value = 'email';
            if (this.service) {
                value = (this.service['notificationType']) ?
                    this.service['notificationType'] : 'email';
            }
            this.serviceForm.addControl('notificationType',
                new FormControl(value));
        }
    }
    ngOnInit() {
        this.end_service_notify_cap = Messages.SERVICE_NOTIFY_CAP.replace('[customer]', this.customer_label);
        this.end_cause_notify_cap = Messages.DONATION_NOTIFY_CAP.replace('[customer]', this.customer_label);
        this.getBusinessProfile();
        this.getGlobalSettings();
        this.getUsers();
        this.getUsersTeam();
        this.getQuestionnaire();
        if (this.donationservice) {
            this.is_donation = true;
        }
    }
    getUsersTeam() {
        const _this = this;
        return new Promise(function (resolve, reject) {

            _this.provider_services.getTeamGroup().subscribe(data => {
                _this.team = data;
                resolve(data);
            },
                () => {
                    reject();
                }
            );
        });
    }
    ngOnDestroy() {
        if (this.serviceSubscription) {
            this.serviceSubscription.unsubscribe();
        }
    }
    handleChange(event) {
        this.serviceForm.patchValue({
            paymentProfileId: event.target.value

        });


    }
    isDefaultProfile(profile) {

        if (profile.profileId == 'spDefaultBillProfile') {

            return true;

        } else {
            return false;
        }

    }
    editService() {
        const serviceActionModel = {};
        serviceActionModel['action'] = 'edit';
        this.servicesService.actionPerformed(serviceActionModel);
    }
    getDepartments(deptid?) {
        this.departments = [];
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.filterDepart = data['filterByDept'];
                    if (this.filterDepart) {
                        for (let i = 0; i < data['departments'].length; i++) {
                            if (data['departments'][i].departmentStatus === 'ACTIVE') {
                                this.departments.push(data['departments'][i]);
                            }
                            if (data['departments'][i].departmentId === deptid) {
                                this.departmentName = data['departments'][i].departmentName;
                            }
                        }
                        if (this.action === 'add' && this.departments.length > 0) {
                            this.serviceForm.get('department').setValue(this.departments[0].departmentId);
                            this.departId = this.departments[0].departmentId;
                            this.getUsers();
                        }
                    }
                },
                error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    onSubmit(form_data) {
        console.log("Data form :",form_data);

 // if(form_data.priceDynamic === true){
        //     if(form_data.paymentDescription === ''){
        //         this.snackbarService.openSnackBar('Please provide paymentDescription', { 'panelClass': 'snackbarerror' });
        //     }
        // }
        // this.savedisabled = true;
        if (form_data.serviceType === 'virtualService') {
            //  this.tool_id = this.tool_id.trim();
            this.teleCallingModes = {
                'callingMode': this.tool_name || '',
                'value': this.tool_id || '',
                'status': 'ACTIVE',
                'instructions': this.tool_instruct || '',
                'countryCode': this.tool_code || '+91'
            };
        }
        form_data['preInfoEnabled'] = this.preInfoEnabled;
        form_data['postInfoEnabled'] = this.postInfoEnabled;
        form_data['preInfoTitle'] = this.preInfoEnabled ? this.preInfoTitle.trim() : '';
        form_data['preInfoText'] = this.preInfoEnabled ? this.preInfoText : '';
        form_data['postInfoTitle'] = this.postInfoEnabled ? this.postInfoTitle.trim() : '';
        form_data['postInfoText'] = this.postInfoEnabled ? this.postInfoText : '';
        form_data['consumerNoteTitle'] = form_data['consumerNoteMandatory'] ? this.consumerNote : '';
        if (form_data['paymentProfileId'] === 'spDefaultBillProfile') {
            delete form_data['paymentProfileId'];
        }
        if (this.is_donation) {
            if (!this.subdomainsettings.serviceBillable) {
                form_data.bType = 'Waitlist';
                form_data['totalAmount'] = 0;
                //   form_data['minDonationAmount'] = 0;
                //    form_data['maxDonationAmount'] = 0;
                //   form_data['multiples'] = 0;
                form_data['isPrePayment'] = false;
                form_data['priceDynamic'] = false;
                form_data['taxable'] = false;
            } else {
                form_data['isPrePayment'] = false;
                form_data['minPrePaymentAmount'] = 0;
                form_data['priceDynamic'] = false;
                form_data['paymentDescription'] = '';
            }
            form_data['serviceDuration'] = 1;
            form_data['serviceType'] = 'donationService';

            // form_data['minDonationAmount'] = 0;
            // form_data['maxDonationAmount'] = 0;
            const serviceActionModel = {};
            serviceActionModel['action'] = this.action;
            serviceActionModel['service'] = form_data;
            this.servicesService.actionPerformed(serviceActionModel);
        } else {
            if (!this.subdomainsettings.serviceBillable) {
                form_data.bType = 'Waitlist';
                form_data['totalAmount'] = 0;
                form_data['isPrePayment'] = false;
                form_data['priceDynamic'] = false;
                form_data['taxable'] = false;
            } else {
                form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
                    0 : form_data.minPrePaymentAmount;
                form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
                form_data.paymentDescription = (!form_data.priceDynamic || form_data.priceDynamic === false) ?
                    form_data.paymentDescription : form_data.paymentDescription;
              //  form_data.priceDynamic = (!form_data.priceDynamic || form_data.priceDynamic === false) ? false : true;
                const duration = this.shared_service.getTimeinMin(this.duration);
                form_data.serviceDuration = duration;
                form_data.serviceDurationEnabled = this.showServiceduration;
                form_data.showOnlyAvailableSlots = this.showOnlyAvailableSlots;
                    form_data.showPrice = this.showPrice;
                    
       
                
               
            }
            if (this.departmentId) {
                form_data['department'] = this.departmentId;
            }
            //    form_data['serviceType'] = form_data.serviceType;
            //  form_data['virtualServiceType'] = this.serv_mode;
            if (form_data.serviceType === 'virtualService') {
                form_data['virtualCallingModes'] = [this.teleCallingModes];
            }

            if (this.selectedUser && this.userspecific) {
                this.provider = {
                    'id': this.selectedUser
                };
                form_data['provider'] = this.provider;
            } else {
                if (form_data['provider']) {
                    delete form_data['provider'];
                }
            }
           
            const serviceActionModel = {};
            serviceActionModel['action'] = this.action;
            serviceActionModel['service'] = form_data;
            if (form_data.serviceType === 'virtualService') {
                if ((form_data.virtualCallingModes[0].callingMode === 'WhatsApp' || form_data.virtualCallingModes[0].callingMode === 'Phone') && (form_data.virtualCallingModes[0].value.toString().charAt(0) === '0')) {
                    this.snackbarService.openSnackBar('Please provide valid phone number', { 'panelClass': 'snackbarerror' });
                } else if (!form_data.virtualServiceType) {
                    this.snackbarService.openSnackBar(Messages.SELECT_TELE_MODE, { 'panelClass': 'snackbarerror' });
                } else {
                    if (!form_data.virtualCallingModes[0].callingMode) {
                        this.snackbarService.openSnackBar(Messages.SELECT_TELE_TOOL, { 'panelClass': 'snackbarerror' });
                    }
                    
   else if(form_data.priceDynamic === true && form_data.paymentDescription === ''){
                this.snackbarService.openSnackBar('Please provide payment description', { 'panelClass': 'snackbarerror' });
            }
                     else {
                        this.servicesService.actionPerformed(serviceActionModel);
                    }
                }
            }
            else {
                    if(form_data.priceDynamic === true && form_data.paymentDescription === ''){
                        this.snackbarService.openSnackBar('Please provide payment description', { 'panelClass': 'snackbarerror' });
                    }
                    else{
                        this.servicesService.actionPerformed(serviceActionModel);
                    }
                
            }
        }
    }

    onCancel() {
        let source;
        if (this.action === 'add') {
            source = 'add';
        } else {
            source = 'edit';
        }
        this.showConsumerNote = false;
        const serviceActionModel = {};
        serviceActionModel['action'] = 'close';
        serviceActionModel['source'] = source;
        this.servicesService.actionPerformed(serviceActionModel);
    }
    changeServiceStatus(form_data) {
        const serviceActionModel = {};
        serviceActionModel['action'] = 'changestatus';
        serviceActionModel['service'] = form_data;
        this.servicesService.actionPerformed(serviceActionModel);
    }
    taxapplicableChange() {
        if (!this.taxsettings || (this.taxsettings && this.taxsettings.taxPercentage <= 0)) {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
            this.serviceForm.get('taxable').setValue(false);
        }
    }
    changePrepayment() {
        if (this.serviceForm.get('isPrePayment').value === false) {
            this.serviceForm.removeControl('minPrePaymentAmount');
        } else {
            if (this.serviceForm.get('isPrePayment').value === true) {
                if (!this.paymentsettings.onlinePayment) {
                    this.snackbarService.openSnackBar(Messages.SERVICE_PRE_PAY_ERROR, { 'panelClass': 'snackbarerror' });
                    this.serviceForm.get('isPrePayment').setValue(false);
                    return false;
                }
                let value = '0';
                if (this.service && this.service['minPrePaymentAmount']) {
                    value = this.service['minPrePaymentAmount'];
                }
                this.serviceForm.addControl('minPrePaymentAmount',
                    new FormControl(value, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])));
            }
        }
    }
    createForm() {
        if (this.active_user.accountType === 'BRANCH' && !this.is_donation) {
            this.getDepartments();
        }
        if (this.subdomainsettings.serviceBillable) {
            if (this.is_donation === true) {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    serviceDuration: [''],
                    consumerNoteMandatory: [false],
                    totalAmount: [0],
                    minDonationAmount: [1, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    maxDonationAmount: [1, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    multiples: [1, Validators.compose([Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    priceDynamic: [false],
                    paymentDescription: [''],
                    taxable: [false],
                    notification: [true],
                    livetrack: [false],
                    paymentProfileId: [],
                    serviceBookingType:['booking'],
                    date:[false],
                    dateTime:[false],
                    noDateTime:[false]
                });
                if (this.paymentProfiles.length > 0) {
                    this.serviceForm.get('paymentProfileId').setValue('spDefaultBillProfile');
                }
            } else {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    resoucesRequired: [''],
                    maxBookingsAllowed: [''],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    serviceDuration: ['', Validators.compose([Validators.required])],
                    consumerNoteMandatory: [false],
                    totalAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    priceDynamic: [false],
                    paymentDescription: [''],
                    taxable: [false],
                    notification: [true],
                    livetrack: [false],
                    paymentProfileId: [],
                    serviceBookingType:['booking'],
                    date:[false],
                    dateTime:[false],
                    noDateTime:[false]

                });
                this.serviceForm.get('resoucesRequired').setValue('1');
                this.serviceForm.get('maxBookingsAllowed').setValue('1');
                if (this.paymentProfiles.length !== 0) {
                    this.serviceForm.get('paymentProfileId').setValue('spDefaultBillProfile');
                }
                if (this.action === 'add') {
                    this.serviceForm.get('serviceType').setValue('physicalService');
                }
            }
        } else {            
            if (this.is_donation === true) {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    serviceDuration: [''],
                    consumerNoteMandatory: [false],
                    totalAmount: [0],
                    minDonationAmount: [1, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    maxDonationAmount: [1, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    multiples: [1, Validators.compose([Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    priceDynamic: [false],
                    paymentDescription: [''],
                    taxable: [false],
                    notification: [true],
                    livetrack: [false],
                    paymentProfileId: [],
                    serviceBookingType:['booking'],
                    date:[false],
                    dateTime:[false],
                    noDateTime:[false]

                });
            } else {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    resoucesRequired: [''],
                    maxBookingsAllowed: [''],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    notification: [true],
                    livetrack: [false],
                    paymentProfileId: [],
                    serviceBookingType:['booking'],
                    date:[false],
                    dateTime:[false],
                    noDateTime:[false]

                });
                this.serviceForm.get('resoucesRequired').setValue('1');
                this.serviceForm.get('maxBookingsAllowed').setValue('1');
            }
            if (this.paymentProfiles.length !== 0) {
                this.serviceForm.controls['paymentProfileId'].setValue('spDefaultBillProfile');
            }
        }
        if (this.action === 'add') {
            if (this.subdomainsettings.serviceBillable) { this.changePrepayment(); }
            this.changeNotification();
        }
    }
    resetApiErrors() {
        this.savedisabled = false;
        this.showNoteError = '';
    }
    convertTime(time) {
        this.duration.hour = Math.floor(time / 60);
        this.duration.minute = time % 60;
        this.serviceForm.get('serviceDuration').setValue(this.duration);
    }
    getAppxTime(waitlist) {
        return this.dateTimeProcessor.providerConvertMinutesToHourMinute(waitlist);
    }
    advancedClick() {
        (this.showAdvancedSettings) ? this.showAdvancedSettings = false : this.showAdvancedSettings = true;
    }
    getBusinessProfile() {
        this.provider_services.getBussinessProfile()
            .subscribe(
                data => {
                    this.bprofile = data;
                    if (this.bprofile.baseLocation) {
                        this.locationExists = true;
                    } else {
                        this.locationExists = false;
                    }
                    this.provider_datastorage.set('bProfile', data);
                });
    }
    gotoManageQueue() {
        if (this.locationExists) {
            if (this.serviceFrom === 'userlevel') {
                this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'queues']);
            } else if (this.source === 'appt') {
                this.router.navigate(['provider', 'settings', 'appointmentmanager', 'schedules']);
            } else {
                this.router.navigate(['provider', 'settings', 'q-manager', 'queues']);
            }
        } else {
            this.snackbarService.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
    }
    getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
            (data: any) => {
                this.telemodes = [];
                this.vcallmodes = data.virtualCallingModes;
                if (this.serv_mode && this.serv_mode === 'audioService') {
                    this.telemodes = ['Phone', 'WhatsApp'];

                } else if (this.serv_mode && this.serv_mode === 'videoService') {
                    this.telemodes = ['Zoom', 'GoogleMeet', 'WhatsApp', 'VideoCall'];
                    // this.telemodes = ['Zoom', 'GoogleMeet', 'WhatsApp'];
                } else {
                    this.telemodes = ['Zoom', 'GoogleMeet', 'Phone', 'WhatsApp', 'VideoCall'];
                }
                for (let i = 0; i < this.vcallmodes.length; i++) {
                    if (this.selctd_tool === this.vcallmodes[i].callingMode) {
                        this.tool_id = this.vcallmodes[i].value;
                        console.log("tool_id :",this.tool_id)
                        if ((this.vcallmodes[i].callingMode === 'WhatsApp' || this.vcallmodes[i].callingMode === 'Phone') && this.vcallmodes[i].countryCode) {
                            if(this.vcallmodes[i].countryCode === "91" || ''){
                                this.tool_code = '+91'
                            }
                            else{
                                this.tool_code =  this.vcallmodes[i].countryCode
                            }
                        }
                        break;
                    } else {
                        this.tool_id = '';
                        this.tool_code = '+91'
                    }
                    
                }
            });
    }
    getGlobalSettings() {
        this.provider_services.getAccountSettings().then(
            (data: any) => {
                if (data.livetrack === true) {
                    this.is_lvtrack_enable = true;
                }
                if (data.virtualService === true) {
                    this.is_virtual_enable = true;
                    this.getVirtualCallingModesList();
                }
            });
    }
    getUsers() {
        const filter = {};
        this.provider_services.getUsers(filter).subscribe(data => {
            this.users_list = data;
            this.selectedUser = this.users_list[0].id;
        });
    }
    selectDeptHandler(value) {
        this.departId = value;
        this.getUsers();
    }

    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        editor.getData();

    }
    changeConsumerNoteStatus(ev) {
        this.showConsumerNote = ev.checked;
    }
    editClicked(type?) {
        this.showNoteError = '';
        if (type && type === 'save') {
            if (this.consumerNote === '' || this.consumerNote.trim() === '') {
                this.showNoteError = 'Button Name required';
            } else {
                this.showEditSection = false;
            }
        } else {
            this.showEditSection = true;
        }
    }
    showInfoSection() {
        if (!this.showInfo) {
            this.tempPreInfoEnabled = this.preInfoEnabled;
            this.tempPreInfoText = this.preInfoText;
            this.tempPreInfoTitle = this.preInfoTitle;
            this.tempPostInfoEnabled = this.postInfoEnabled;
            this.tempPostInfoText = this.postInfoText;
            this.tempPostInfoTitle = this.postInfoTitle;
            this.showInfo = true;
            this.sharedFunctons.sendMessage({ 'ttype': 'hide-back' });
        } else {
            if (this.preInfoEnabled && this.preInfoTitle.trim() === '') {
                this.snackbarService.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
            } else if (this.postInfoEnabled && this.postInfoTitle.trim() === '') {
                this.snackbarService.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
            } else {
                this.showInfo = false;
                this.sharedFunctons.sendMessage({ 'ttype': 'show-back' });
            }
        }
    }
    cancelChanges() {
        this.preInfoEnabled = this.tempPreInfoEnabled;
        this.preInfoText = this.tempPreInfoText;
        this.preInfoTitle = this.tempPreInfoTitle;
        this.postInfoEnabled = this.tempPostInfoEnabled;
        this.postInfoText = this.tempPostInfoText;
        this.postInfoTitle = this.tempPostInfoTitle;
        this.showInfo = false;
        this.sharedFunctons.sendMessage({ 'ttype': 'show-back' });
    }
    checkUrl(urlData) {
        console.log("UrlData :",urlData)
        if (this.tool_id && (this.selctd_tool === 'GoogleMeet' || this.selctd_tool === 'Zoom')) {
            const tempvar = urlData.substring(0, 4);
            if (tempvar == 'http') {
                this.tool_id = '';
                this.tool_id = 'https://' + urlData;
            }
        }
    }
    getQuestionnaire() {
        this.provider_services.getAllQuestionnaire().subscribe(data => {
            this.questionnaire = data;
        });
    }
    getQnrName(id) {
        const question = this.questionnaire.filter(quest => quest.id === id);
        return question[0].questionnaireId;
    }
    gotoQnr(id) {
        this.router.navigate(['provider', 'settings', 'general', 'questionnaire', id]);
    }
    getProviderName(users) {
        let userlst = '';
        if (users[0] === 'All') {
            return 'All Users'
        } else {
            for (let user of users) {
                let details = this.users_list.filter(usr => usr.id == parseInt(user));
                if (details && details.length > 0) {
                    userlst = userlst + details[0].firstName + ' ' + details[0].lastName + ',';
                }
            }
            // if(typ){
            return userlst.replace(/,\s*$/, '');
            // }else {
            //     return this.userlistType(userlst.replace(/,\s*$/, ''));
            // }
        }
    }
    getProviderNametruncate(users) {
       // console.log(users);
        let userlst = '';
        if (users[0] === 'All') {
            return 'All Users'
        } else {
            for (let user of users) {
                let details = this.users_list.filter(usr => usr.id == parseInt(user));
                if (details && details.length > 0) {
                    userlst = userlst + details[0].firstName + ' ' + details[0].lastName + ',';
                }
            } return this.truncateInst(userlst.replace(/,\s*$/, ''));
        }
    }
    getOwnership(ownerShipData, isTruncate) {
        this.userNamelist = '';
        if (ownerShipData && ownerShipData.users && ownerShipData.users.length > 0) {
            ownerShipData.users.forEach(element => {
                const userObject = this.users_list.filter(user => user.id === parseInt(element));
                this.userNamelist = this.userNamelist + userObject[0].firstName + ' ' + userObject[0].lastName + ','
            });
            if (isTruncate) {
                this.truncateInst(this.userNamelist.replace(/,\s*$/, ''));
            } else {
                this.userNamelist = this.userNamelist.replace(/,\s*$/, '')
            }
        }
        if (ownerShipData && ownerShipData.teams && ownerShipData.teams.length > 0) {
            ownerShipData.teams.forEach(element => {
                const userObject = this.team.filter(team => team.id === parseInt(element));
                if (userObject.length !== 0) {
                    this.userNamelist = this.userNamelist + userObject[0].name + ','
                }
            });
            if (isTruncate) {
                this.truncateInst(this.userNamelist.replace(/,\s*$/, ''));
            } else {
                this.userNamelist = this.userNamelist.replace(/,\s*$/, '')

            }
        }
        return this.userNamelist;
    }

    truncateInst(val) {
        const inst = val.substr(0, this.maxuserLength);
        return inst;
    }
    usersPopUp(serviceStats) {
        this.usersdialogRef = this.dialog.open(UserlistpopupComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                userlist: this.users_list,
                team: this.team,
                serviceStatus: serviceStats

            }
        });
        this.usersdialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
    serviceqrCodegeneraterOnlineID() {
        let pid = '';
        let usrid = '';
        if (!this.bprofile.customId) {
            pid = this.bprofile.accEncUid;
        } else {
            pid = this.bprofile.customId;
        }
        if (this.service && this.service.provider && this.service.provider.id) {
            usrid = this.service.provider.id;
        } else {
            usrid = '';
        }
        this.qrdialogRef = this.dialog.open(ServiceQRCodeGeneratordetailComponent, {
            width: '40%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'servceqrcodesmall'],
            disableClose: true,
            data: {
                accencUid: pid,
                path: this.wndw_path,
                serviceid: this.service.id,
                userid: usrid,
                // serviceStatus : this.service_data.status
            }
        });
        this.qrdialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
                this.getBusinessProfile();
            }
        });
    }
    copyInputMessage() {
        let path;
        let pid = '';
        if (!this.bprofile.customId) {
            pid = this.bprofile.accEncUid;
        } else {
            pid = this.bprofile.customId;
        }
        if (this.service && this.service.provider && this.service.provider.id) {
            path = projectConstantsLocal.PATH + pid + '/' + this.service.provider.id + '/service/' + this.service.id;
        } else {
            path = projectConstantsLocal.PATH + pid + '/service/' + this.service.id;
        }
        // this.wpath + this.accuid +'/'+ this.userId +'/service/'+ this.serviceId ;
        //const path = projectConstantsLocal.PATH + valuetocopy;
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = path;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.snackbarService.openSnackBar('Link copied to clipboard');
    }
    isNumericSign(evt) {
        return this.sharedFunctons.isNumericSign(evt);
    }
}
