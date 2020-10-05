import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {

    create_cap = Messages.CREATE_CAP;
    mobile_cap = Messages.MOBILE_CAP;
    f_name_cap = Messages.FIRST_NAME_CAP;
    l_name_cap = Messages.LAST_NAME_CAP;
    email_cap = Messages.EMAIL_ID_CAP;
    gender_cap = Messages.GENDER_CAP;
    male_cap = Messages.MALE_CAP;
    female_cap = Messages.FEMALE_CAP;
    dob_cap = Messages.DOB_CAP;
    adrress_cap = Messages.ADDRESS_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
    amForm: FormGroup;
    api_error = null;
    api_success = null;
    step = 1;
    tday = new Date();
    minday = new Date(1900, 0, 1);
    search_data = null;
    disableButton = false;
    api_loading = true;
    customer_label = '';
    source;
    phoneNo: any;
    email: any;
    firstName: any;
    lastName: any;
    dob: any;
    action;
    form_data = null;
    create_new = false;
    qParams = {};
    foundCustomer = false;
    searchClicked = false;
    customer_data: any = [];
    customerPhone: any;
    breadcrumbs_init = [
        // {
        //     title: 'Check-ins',
        //     url: 'provider/check-ins'
        // },
        {
            title: 'Customers',
            url: 'provider/customers'
        }

    ];
    breadcrumbs = this.breadcrumbs_init;
    breadcrumb_moreoptions: any = [];
    checkin_type;
    customidFormat;
    loading = false;
    haveMobile = true;
    viewCustomer = false;
    customerId;
    customer;
    customerName;
    timeslot;
    comingSchduleId;
    date;
    thirdParty;
    customerCount;
    customerPlaceholder = '';
    jld;
    customerErrorMsg = '';
    customerErrorMsg1 = '';
    customerErrorMsg2 = '';
    serviceIdParam;
    userId;
    deptId;
    type;
    constructor(
        // public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private _location: Location,
        private router: Router) {
        this.activated_route.params.subscribe(
            (params) => {
                this.customerId = params.id;
                this.customer_label = this.shared_functions.getTerminologyTerm('customer');
                this.breadcrumbs_init = [

                    {
                        title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1) + 's',
                        url: 'provider/customers'
                    }

                ];
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
                                            this.viewCustomer = false;
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
                                            this.viewCustomer = true;

                                        }
                                    }
                                );
                            }
                        );
                    }
                    this.api_loading = false;
                }
            }
        );

        // this.search_data = this.data.search_data;
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.activated_route.queryParams.subscribe(qparams => {
            this.source = qparams.source;
            if (qparams.type) {
                this.type = qparams.type;
            }
            if (qparams.phone) {
                this.phoneNo = qparams.phone;
                if (this.source === 'token' || this.source === 'checkin' || this.source === 'appointment') {
                    this.getJaldeeIntegrationSettings();
                    this.save_btn = 'Proceed';
                }
            } else {
                if (this.type && this.type === 'create' && (this.source === 'token' || this.source === 'checkin' || this.source === 'appointment')) {
                    this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
                    this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
                    this.save_btn = 'Proceed';
                }
            }
            if (qparams.email) {
                this.email = qparams.email;
            }
            if (qparams.checkinType) {
                this.checkin_type = qparams.checkinType;
            }
            if (qparams.noMobile) {
                this.haveMobile = false;
            }
            if (qparams.serviceId) {
                this.serviceIdParam = qparams.serviceId;
            }
            if (qparams.userId) {
                this.userId = qparams.userId;
            }
            if (qparams.deptId) {
                this.deptId = qparams.deptId;
            }
            if (qparams.timeslot) {
                this.timeslot = qparams.timeslot;
            }
            if (qparams.date) {
                this.date = qparams.date;
            }
            if (qparams.scheduleId) {
                this.comingSchduleId = qparams.scheduleId;
            }
            if (qparams.thirdParty) {
                this.thirdParty = qparams.thirdParty;
            }
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

    getJaldeeCustomer() {
        const filter = { 'primaryMobileNo-eq': this.phoneNo };
        this.provider_services.getJaldeeCustomer(filter)
            .subscribe(
                (data: any) => {
                    if (data.length > 0) {
                        this.amForm.get('first_name').setValue(data[0].userProfile.firstName);
                        this.amForm.get('last_name').setValue(data[0].userProfile.lastName);
                        this.amForm.get('email_id').setValue(data[0].userProfile.email);
                        this.amForm.get('mobile_number').setValue(data[0].userProfile.primaryMobileNo);
                        this.amForm.get('address').setValue(data[0].userProfile.address);
                        this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
                        this.customerErrorMsg1 = 'The system found the record details in Jaldee.com';
                        this.customerErrorMsg2 = 'Do you want to add the ' + this.customer_label + ' to create ' + this.source + '?';
                    } else {
                        this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
                        this.customerErrorMsg = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
                    }
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    getJaldeeIntegrationSettings() {
        this.provider_services.getJaldeeIntegrationSettings().subscribe(
            (data: any) => {
                if (data.walkinConsumerBecomesJdCons) {
                    this.getJaldeeCustomer();
                } else {
                    this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
                    this.customerErrorMsg = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
                }
            }
        );
    }

    getCustomerCount() {
        this.provider_services.getProviderCustomersCount()
            .subscribe(
                data => {
                    this.customerCount = data;
                    this.jld = 'JLD' + this.thirdParty + this.customerCount;
                    this.amForm.get('customer_id').setValue(this.jld);
                });
    }
    ngOnInit() {
        this.loading = true;
        this.getGlobalSettingsStatus();
        this.breadcrumbs = this.breadcrumbs_init;
        // this.breadcrumbs = [{
        //     title: this.shared_functions.firstToUpper(this.customer_label) + 's',
        //     url: 'provider/customers'
        // },
        // {
        //     title: 'Add'
        // }
        // ];
    }

    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.customidFormat = data.jaldeeIdFormat;
                this.createForm();
            });
    }
    createForm() {
        if (!this.haveMobile) {
            this.amForm = this.fb.group({
                first_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                last_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
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
                customer_id: [''],
                first_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
                last_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
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
            if (this.thirdParty) {
                this.amForm.addControl('customer_id', new FormControl(''));
                this.customerPlaceholder = this.customer_label + ' id';
                this.getCustomerCount();
            } else {
                this.amForm.addControl('customer_id', new FormControl('', Validators.required));
                this.customerPlaceholder = this.customer_label + ' id *';
            }
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
            'email_id': this.customer[0].email || null,
            'dob': this.customer[0].dob || null,
            'gender': this.customer[0].gender || null,
            'mobile_number': this.customer[0].phoneNo || null,
            'customer_id': this.customer[0].jaldeeId || null,
            'address': this.customer[0].address || null,
        });
    }
    onSubmit(form_data) {
        this.disableButton = true;
        if (this.action === 'add') {
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
            if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
                if (form_data.customer_id) {
                    post_data['jaldeeId'] = form_data.customer_id;
                } else {
                    post_data['jaldeeId'] = this.jld;
                }
            }
            this.provider_services.createProviderCustomer(post_data)
                .subscribe(
                    data => {
                        this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                        this.shared_functions.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
                        const qParams = {};
                        qParams['pid'] = data;
                        if (this.source === 'checkin' || this.source === 'token') {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    ph: form_data.mobile_number,
                                    checkin_type: this.checkin_type,
                                    haveMobile: this.haveMobile,
                                    id: data,
                                    thirdParty: this.thirdParty
                                }
                            };
                            this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                        } else if (this.source === 'appointment') {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    ph: form_data.mobile_number,
                                    checkinType: this.checkin_type,
                                    haveMobile: this.haveMobile,
                                    id: data,
                                    timeslot: this.timeslot,
                                    scheduleId: this.comingSchduleId,
                                    date: this.date,
                                    thirdParty: this.thirdParty,
                                    serviceId: this.serviceIdParam,
                                    userId: this.userId,
                                    deptId: this.deptId,
                                    type: this.type
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
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.disableButton = false;
                    });
        } else if (this.action === 'edit') {
            const post_data = {
                //   'userProfile': {
                'id': this.customerId,
                'firstName': form_data.first_name,
                'lastName': form_data.last_name,
                'dob': form_data.dob,
                'gender': form_data.gender,
                'phoneNo': form_data.mobile_number,
                'email': form_data.email_id,
                'address': form_data.address,
                //   }
            }; if (form_data.mobile_number) {
                post_data['countryCode'] = '+91';
            }
            // if (form_data.email_id && form_data.email_id !== '') {
            //     post_data['email'] = form_data.email_id;
            // }
            if (form_data.customer_id) {
                post_data['jaldeeId'] = form_data.customer_id;
            }
            this.provider_services.updateProviderCustomer(post_data)
                .subscribe(
                    data => {
                        this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                        this.shared_functions.openSnackBar('Updated Successfully');
                        const qParams = {};
                        qParams['pid'] = data;
                        if (this.source === 'checkin' || this.source === 'token') {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    ph: form_data.mobile_number,
                                    checkin_type: this.checkin_type
                                }
                            };
                            this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                        } else if (this.source === 'appointment') {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    ph: form_data.mobile_number,
                                    checkin_type: this.checkin_type
                                }
                            };
                            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
                        } else {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    phoneNo: this.phoneNo
                                }
                            };
                            this.router.navigate(['provider', 'customers'], navigationExtras);
                        }
                    },
                    error => {
                        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.disableButton = false;
                    });

        }

    }
    onCancel() {
        if (this.source === 'checkin' || this.source === 'token') {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    checkin_type: this.checkin_type,
                    haveMobile: this.haveMobile,
                    thirdParty: this.thirdParty
                }
            };
            this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
        } else if (this.source === 'appointment') {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    checkinType: this.checkin_type,
                    haveMobile: this.haveMobile,
                    timeslot: this.timeslot,
                    scheduleId: this.comingSchduleId,
                    date: this.date,
                    thirdParty: this.thirdParty,
                    serviceId: this.serviceIdParam,
                    userId: this.userId,
                    deptId: this.deptId,
                    type: this.type
                }
            };
            this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
        } else {
            this._location.back();
        }
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    onFieldBlur(key) {
        this.amForm.get(key).setValue(this.toCamelCase(this.amForm.get(key).value));
    }
    toCamelCase(word) {
        if (word) {
            return this.shared_functions.toCamelCase(word);
        } else {
            return word;
        }
    }
    isNumeric(evt) {
        return this.shared_functions.isNumeric(evt);
    }
    searchCustomer(form_data, mod?) {
        let mode = 'id';
        if (mod) {
            mode = mod;
        }
        this.form_data = null;
        this.create_new = false;
        let post_data = {};
        const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
        const isEmail = emailPattern.test(form_data.mobile_number);
        if (isEmail) {
            mode = 'email';
        } else {
            const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
            const isNumber = phonepattern.test(form_data.mobile_number);
            const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
            const isCount10 = phonecntpattern.test(form_data.mobile_number);
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
                    'phoneNo-eq': form_data.mobile_number
                };
                this.qParams['phone'] = form_data.mobile_number;
                break;
            case 'email':
                this.qParams['phone'] = form_data.mobile_number;
                post_data = {
                    'email-eq': form_data.mobile_number
                };
                break;
            case 'id':
                post_data = {
                    'jaldeeId-eq': form_data.mobile_number
                };
                break;
        }
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
                        this.customer_data = data[0];
                        this.customerPhone = this.customer_data.phoneNo;
                        this.searchClicked = true;
                    }
                },
                error => {
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    findCustomer() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                source: 'clist'
            }
        };
        this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
    }
    editCustomer() {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['/provider/customers/' + this.customer[0].id], navigationExtras);
    }
}
