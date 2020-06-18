import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { projectConstants } from '../../../../../../../../app.component';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { Subscription } from 'rxjs';
import { FormMessageDisplayService } from '../../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ServicesService } from '../../../../../../../../shared/modules/service/services.service';
import { SharedServices } from '../../../../../../../../shared/services/shared-services';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../../../../ynw_provider/services/provider-datastorage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-addservice',
    templateUrl: './addservice.component.html'

})
export class AddServiceComponent implements OnInit, OnDestroy {
    number_decimal_pattern = '^[0-9]+\.?[0-9]*$';
    number_pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
    end_service_notify_cap = '';
    service_cap = Messages.PRO_SERVICE_CAP;
    description_cap = Messages.DESCRIPTION_CAP;
    price_cap = Messages.PRICES_CAP;
    service_name_cap = Messages.SERVICE_NAME_CAP;
    est_duration_cap = Messages.SERVICE_DURATION_CAP;
    enable_prepayment_cap = Messages.ENABLE_PREPAYMENT_CAP;
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
    rupee_symbol = '₹';
    base_licence = false;
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
    departments: any = [];
    filterDepart = false;
    departmentName;
    bprofile: any = [];
    locationExists = false;
    constructor(private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public sharedFunctons: SharedFunctions,
        public servicesService: ServicesService,
        public shared_service: SharedServices,
        public provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        public router: Router) {
        this.customer_label = this.sharedFunctons.getTerminologyTerm('customer');
        this.serviceSubscription = this.servicesService.initService.subscribe(
            (serviceParams: any) => {
                if (serviceParams) {
                    this.showService = true;
                    this.action = serviceParams.action;
                    this.service = serviceParams.service;
                    this.paymentsettings = serviceParams.paymentsettings;
                    this.taxsettings = serviceParams.taxsettings;
                    this.subdomainsettings = serviceParams.subdomainsettings;
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
                                if (!this.subdomainsettings.serviceBillable) {
                                    this.serviceForm.setValue({
                                        'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                        'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                        'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                        'notification': this.service_data['notification'] || this.serviceForm.get('notification').value
                                    });
                                } else {
                                    this.serviceForm.setValue({
                                        'name': this.service_data['name'] || this.serviceForm.get('name').value,
                                        'description': this.service_data['description'] || this.serviceForm.get('description').value,
                                        'department': this.service_data['department'] || this.serviceForm.get('department').value,
                                        'serviceDuration': this.service_data['serviceDuration'] || this.serviceForm.get('serviceDuration').value,
                                        'totalAmount': this.service_data['totalAmount'] || this.serviceForm.get('totalAmount').value || '0',
                                        'isPrePayment': (!this.base_licence && this.service_data['minPrePaymentAmount'] &&
                                            this.service_data['minPrePaymentAmount'] !== 0
                                        ) ? true : false,
                                        'taxable': this.service_data['taxable'] || this.serviceForm.get('taxable').value,
                                        'notification': this.service_data['notification'] || this.serviceForm.get('notification').value
                                    });
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
    isvalid(evt) {
        return this.sharedFunctons.isValid(evt);
    }
    onAdvanced() {
        if (this.advanced === false) {
            this.advanced = true;
        } else {
            this.advanced = false;
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
        this.getBusinessProfile();
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
        if (!this.subdomainsettings.serviceBillable) {
            form_data.bType = 'Waitlist';
            form_data['totalAmount'] = 0;
            form_data['isPrePayment'] = false;
            form_data['taxable'] = false;
        } else {
            form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
                0 : form_data.minPrePaymentAmount;
            form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
            const duration = this.shared_service.getTimeinMin(form_data.serviceDuration);
            form_data.serviceDuration = duration;
        }
        const serviceActionModel = {};
        serviceActionModel['action'] = this.action;
        serviceActionModel['service'] = form_data;
        this.servicesService.actionPerformed(serviceActionModel);
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
            this.serviceForm = this.fb.group({
                name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                description: ['', Validators.compose([Validators.maxLength(500)])],
                department: ['', Validators.compose([Validators.maxLength(500)])],
                serviceDuration: ['', Validators.compose([Validators.required])],
                totalAmount: [0, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
                isPrePayment: [{ 'value': false, 'disabled': this.base_licence }],
                taxable: [false],
                notification: [false]
            });
        } else {
            this.serviceForm = this.fb.group({
                name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                description: ['', Validators.compose([Validators.maxLength(500)])],
                department: ['', Validators.compose([Validators.maxLength(500)])],
                notification: [false]
            });
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
            this.router.navigate(['provider', 'settings', 'q-manager', 'queues']);
        } else {
            this.sharedFunctons.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
    }

}
