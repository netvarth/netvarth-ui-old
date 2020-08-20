import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
// import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
// import { projectConstants } from '../../../../app.component';
// import { Messages } from '../../../../shared/constants/project-messages';
// import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ServicesService } from './services.service';
import { Subscription } from 'rxjs';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { FormMessageDisplayService } from '../form-message-display/form-message-display.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { SharedServices } from '../../services/shared-services';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { ProviderDataStorageService } from '../../../ynw_provider/services/provider-datastorage.service';
import { projectConstantsLocal } from '../../constants/project-constants';

@Component({
    selector: 'app-jaldee-service',
    templateUrl: './service.component.html'
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
    end_of_service_notify = projectConstants.PROFILE_ERROR_STACK;
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
    button_title = 'Save';
    customer_label = '';
    char_count = 0;
    max_char_count = 500;
    isfocused = false;
    servstatus = false;
    maxlimit = projectConstants.PRICE_MAX_VALUE;
    serviceForm: FormGroup;
    serviceSubscription: Subscription;
    action = 'show';
    service;
    service_data;
    paymentsettings;
    taxsettings;
    subdomainsettings;
    showService = false;
    advanced = false;
    duration = { hour: 0, minute: 0 };
    showAdvancedSettings = false;
    showBillingInfo = false;
    departments: any = [];
    filterDepart = false;
    departmentName;
    bprofile: any = [];
    locationExists = false;
    serv_mode: any;
    serv_type: any;
    is_physical = 0;
    is_donation = false;
    userId: any;
    departmentId: any;
    userspecific = false;
    teleCallingModes = {
        'callingMode': '',
        'status': 'ACTIVE',
        'value': null,
        'instructions': null
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
    selectedUser = '0';
    defaultOption = {
        'id': '0',
        'firstName': 'Global',
        'lastName': 'Service'
    };
    include_video = false;
    constructor(private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public sharedFunctons: SharedFunctions,
        public servicesService: ServicesService,
        public shared_service: SharedServices,
        public provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        public router: Router) {
        this.customer_label = this.sharedFunctons.getTerminologyTerm('customer');
        this.frm_enable_prepayment_cap = Messages.FRM_LEVEL_PREPAYMENT_SETTINGS_MSG;
        this.serviceSubscription = this.servicesService.initService.subscribe(
            (serviceParams: any) => {
                if (serviceParams) {
                    this.showService = true;
                    this.action = serviceParams.action;
                    this.service = serviceParams.service;
                    this.paymentsettings = serviceParams.paymentsettings;
                    this.taxsettings = serviceParams.taxsettings;
                    this.subdomainsettings = serviceParams.subdomainsettings;
                    this.userId = serviceParams.userId;
                    this.departmentId = serviceParams.deptId;
                    if (this.action === 'add') {
                        this.service = null;
                        this.createForm();
                    } else {
                        this.service_data = this.service;
                        if (this.action === 'show') {
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
                                if (!this.subdomainsettings.serviceBillable) {
                                    if (this.service_data.serviceType === 'donationService') {
                                        this.serviceForm.setValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'minDonationAmount': this.service_data['minDonationAmount'] || this.serviceForm.get('minDonationAmount').value || '0',
                                            'maxDonationAmount': this.service_data['maxDonationAmount'] || this.serviceForm.get('maxDonationAmount').value || '0',
                                            'multiples': this.service_data['multiples'] || this.serviceForm.get('multiples').value || '0',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value
                                        });
                                    } else {
                                        this.serviceForm.setValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value
                                        });
                                    }
                                    if (this.service_data.serviceType === 'virtualService') {
                                        this.tool_name = this.service_data.virtualCallingModes[0].callingMode;
                                        this.tool_id = this.service_data.virtualCallingModes[0].value;
                                        this.tool_instruct = this.service_data.virtualCallingModes[0].instructions;
                                    }

                                } else {
                                    if (this.service_data.serviceType === 'donationService') {
                                        this.serviceForm.setValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'minDonationAmount': this.service_data['minDonationAmount'] || this.serviceForm.get('minDonationAmount').value || '0',
                                            'maxDonationAmount': this.service_data['maxDonationAmount'] || this.serviceForm.get('maxDonationAmount').value || '0',
                                            'multiples': this.service_data['multiples'] || this.serviceForm.get('multiples').value || '0',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value
                                        });
                                    } else {
                                        this.serviceForm.setValue({
                                            'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                            'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                            'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                            'serviceType': this.service_data['serviceType'] || this.serviceForm.get('serviceType').value,
                                            'virtualServiceType': this.service_data['virtualServiceType'] || this.serviceForm.get('virtualServiceType').value,
                                            'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                            'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                            'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                                this.service_data['minPrePaymentAmount'] !== 0
                                            ) ? true : false,
                                            'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                            'notification': this.service_data['notification'] || this.serviceForm.get('notification').value,
                                            'livetrack': this.service_data['livetrack'] || this.serviceForm.get('livetrack').value
                                        });
                                        if (this.service_data.serviceType === 'virtualService') {
                                            this.tool_name = this.service_data.virtualCallingModes[0].callingMode;
                                            this.tool_id = this.service_data.virtualCallingModes[0].value;
                                            this.tool_instruct = this.service_data.virtualCallingModes[0].instructions;
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
    selectServiceHandler(event) {
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
        this.serv_mode = event;
        this.modeselected = true;
        this.is_tool = false;
        this.getVirtualCallingModesList();
    }
    selectToolTypeHandler(event) {
        this.getVirtualCallingModesList();
        this.selctd_tool = event;
        this.is_tool = true;
        this.provider_services.getvirtualServiceInstructions().subscribe(
            (data: any) => {
                this.default_instruct = data;
                for (let i in this.default_instruct) {
                    if (this.selctd_tool === i) {
                        this.tool_instruct = this.default_instruct[i];
                    }
                }
            }
        );
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
        if (this.donationservice) {
            this.is_donation = true;
        }
    }
    ngOnDestroy() {
        if (this.serviceSubscription) {
            this.serviceSubscription.unsubscribe();
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
                    }
                },
                error => {
                    this.sharedFunctons.apiErrorAutoHide(this, error);
                }
            );
    }
    onSubmit(form_data) {
        if (form_data.serviceType === 'virtualService') {
            this.teleCallingModes = {
                'callingMode': this.tool_name,
                'value': this.tool_id,
                'status': 'ACTIVE',
                'instructions': this.tool_instruct
            };
        }
        if (this.is_donation) {
            if (!this.subdomainsettings.serviceBillable) {
                form_data.bType = 'Waitlist';
                form_data['totalAmount'] = 0;
                //   form_data['minDonationAmount'] = 0;
                //    form_data['maxDonationAmount'] = 0;
                //   form_data['multiples'] = 0;
                form_data['isPrePayment'] = false;
                form_data['taxable'] = false;
            } else {
                form_data['isPrePayment'] = false;
                form_data['minPrePaymentAmount'] = 0;
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
                form_data['taxable'] = false;
            } else {
                form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
                    0 : form_data.minPrePaymentAmount;
                form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
                const duration = this.shared_service.getTimeinMin(this.duration);
                form_data.serviceDuration = duration;
            }
            if (this.departmentId) {
                form_data['department'] = this.departmentId;
            }
            //    form_data['serviceType'] = form_data.serviceType;
            //  form_data['virtualServiceType'] = this.serv_mode;
            if (form_data.serviceType === 'virtualService') {
                form_data['virtualCallingModes'] = [this.teleCallingModes];
            }
            if (this.providerId && this.providerId !== '0' && this.userspecific) {
                this.provider = {
                    'id': this.providerId
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
                if (!form_data.virtualServiceType) {
                    this.sharedFunctons.openSnackBar(Messages.SELECT_TELE_MODE, { 'panelClass': 'snackbarerror' });
                } else {
                    if (!form_data.virtualCallingModes[0].callingMode) {
                        this.sharedFunctons.openSnackBar(Messages.SELECT_TELE_TOOL, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.servicesService.actionPerformed(serviceActionModel);
                    }
                }
            } else {
                this.servicesService.actionPerformed(serviceActionModel);
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
            this.sharedFunctons.openSnackBar(this.sharedFunctons.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
            this.serviceForm.get('taxable').setValue(false);
        }
    }
    changePrepayment() {
        if (this.serviceForm.get('isPrePayment').value === false) {
            this.serviceForm.removeControl('minPrePaymentAmount');
        } else {
            if (this.serviceForm.get('isPrePayment').value === true) {
                if (!this.paymentsettings.onlinePayment) {
                    this.sharedFunctons.openSnackBar(Messages.SERVICE_PRE_PAY_ERROR, { 'panelClass': 'snackbarerror' });
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
        this.getDepartments();
        if (this.subdomainsettings.serviceBillable) {
            if (this.is_donation === true) {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    serviceDuration: [''],
                    totalAmount: [0],
                    minDonationAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    maxDonationAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    multiples: [0, Validators.compose([Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    taxable: [false],
                    notification: [false],
                    livetrack: [false]
                });
            } else {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    serviceDuration: ['', Validators.compose([Validators.required])],
                    totalAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    taxable: [false],
                    notification: [false],
                    livetrack: [false]
                });

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
                    totalAmount: [0],
                    minDonationAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    maxDonationAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    multiples: [0, Validators.compose([Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                    isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                    taxable: [false],
                    notification: [false],
                    livetrack: [false]
                });
            } else {
                this.serviceForm = this.fb.group({
                    name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                    description: ['', Validators.compose([Validators.maxLength(500)])],
                    department: ['', Validators.compose([Validators.maxLength(500)])],
                    serviceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    virtualServiceType: [Validators.required, Validators.compose([Validators.maxLength(500)])],
                    notification: [false],
                    livetrack: [false]
                });
            }
        }
        if (this.action === 'add') {
            if (this.subdomainsettings.serviceBillable) { this.changePrepayment(); }
            this.changeNotification();
        }
    }
    resetApiErrors() {
    }
    convertTime(time) {
        this.duration.hour = Math.floor(time / 60);
        this.duration.minute = time % 60;
        this.serviceForm.get('serviceDuration').setValue(this.duration);
    }
    getAppxTime(waitlist) {
        return this.sharedFunctons.providerConvertMinutesToHourMinute(waitlist);
    }
    advancedClick() {
        (this.showAdvancedSettings) ? this.showAdvancedSettings = false : this.showAdvancedSettings = true;
    }
    billingInfoClicked() {
        (this.showBillingInfo) ? this.showBillingInfo = false : this.showBillingInfo = true;
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
            this.sharedFunctons.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
    }
    getVirtualCallingModesList() {
        this.provider_services.getVirtualCallingModes().subscribe(
            (data: any) => {
                this.telemodes = [];
                this.vcallmodes = data.virtualCallingModes;
                if (this.serv_mode && this.serv_mode === 'audioService') {
                    // for (let i = 0; i < this.vcallmodes.length; i++) {
                    //     if (this.vcallmodes[i].status === 'ACTIVE' && (this.vcallmodes[i].callingMode === 'Phone' || this.vcallmodes[i].callingMode === 'WhatsApp')) {
                    //         this.telemodes.push(this.vcallmodes[i]);
                    //     }
                    // }
                    this.telemodes = ['WhatsApp', 'Phone'];

                } else if (this.serv_mode && this.serv_mode === 'videoService') {
                    // for (let i = 0; i < this.vcallmodes.length; i++) {
                    //     if (this.vcallmodes[i].status === 'ACTIVE' && this.vcallmodes[i].callingMode !== 'Phone') {
                    //         this.telemodes.push(this.vcallmodes[i]);
                    //     }
                    // }
                    this.telemodes = ['WhatsApp', 'Zoom', 'GoogleMeet'];
                } else {
                    this.telemodes = ['WhatsApp', 'Zoom', 'GoogleMeet', 'Phone'];
                }
                // else {
                //     this.include_audio = false;
                //     this.include_video = false;
                //     for (let i = 0; i < this.vcallmodes.length; i++) {
                //         if (this.vcallmodes[i].status === 'ACTIVE') {
                //             this.telemodes.push(this.vcallmodes[i]);
                //             if (this.vcallmodes[i].callingMode === 'Phone' || this.vcallmodes[i].callingMode === 'WhatsApp') {
                //                 this.include_audio = true;
                //             }
                //             if (this.vcallmodes[i].callingMode !== 'Phone') {
                //                 this.include_video = true;
                //             }
                //         }
                //     }
                // }

                // if (this.telemodes.length === 0) {
                //     this.is_virtual_enable = false;
                // }
                for (let i = 0; i < this.vcallmodes.length; i++) {
                    if (this.selctd_tool === this.vcallmodes[i].callingMode) {
                        this.tool_id = this.vcallmodes[i].value;
                        break;
                    } else {
                        this.tool_id = '';
                    }
                }
            });
    }
    getGlobalSettings() {
        this.provider_services.getGlobalSettings().subscribe(
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
        const filter = { 'userType-eq': 'PROVIDER' };
        if (this.departId) {
            filter['departmentId-eq'] = this.departId.toString();
        }
        this.provider_services.getUsers(filter).subscribe(data => {
            this.users_list = data;
            // this.users_list.push(this.defaultOption);
        });
    }
    selectUserHandler(value) {
        this.providerId = value;
    }
    selectDeptHandler(value) {
        this.departId = value;
        this.getUsers();
    }
}
