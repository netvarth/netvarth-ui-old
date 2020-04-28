import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {

    create_cap = Messages.CREATE_CAP;
    mobile_cap = Messages.MOBILE_CAP;
    f_name_cap = Messages.F_NAME_CAP;
    l_name_cap = Messages.L_NAME_CAP;
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
    // breadcrumbs_init = [
    //     // {
    //     //     title: 'Check-ins',
    //     //     url: 'provider/check-ins'
    //     // },
    //     {
    //         title: 'Customers',
    //         url: 'provider/customers'
    //     },
    //     {
    //         title: 'Add'
    //     }
    // ];
    breadcrumbs; 
    // = this.breadcrumbs_init;
    breadcrumb_moreoptions: any = [];
    constructor(
        // public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private _location: Location,
        private router: Router
    ) {

        // this.search_data = this.data.search_data;
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.activated_route.queryParams.subscribe(qparams => {
            this.source = qparams.source;
            if (qparams.phone) {
                this.phoneNo = qparams.phone;
            }
            if (qparams.email) {
                this.phoneNo = qparams.email;
            }
        });
    }

    ngOnInit() {
        this.createForm();
        this.breadcrumbs = [{
            title: this.shared_functions.firstToUpper(this.customer_label) + 's',
            url: 'provider/customers'
        },
        {
            title: 'Add'
        }
        ];
    }
    createForm() {
        this.amForm = this.fb.group({
            mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
            Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
            first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            email_id: ['', Validators.compose([Validators.pattern(projectConstants.VALIDATOR_EMAIL)])],
            dob: [''],
            gender: [''],
            address: ['']
        });
        if (this.phoneNo) {
            this.amForm.get('mobile_number').setValue(this.phoneNo);
        }
        if (this.email) {
            this.amForm.get('email_id').setValue(this.email);
        }
    }
    onSubmit(form_data) {
        this.disableButton = true;
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
        this.provider_services.createProviderCustomer(post_data)
            .subscribe(
                data => {
                    this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                    this.shared_functions.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
                    const qParams = {};
                    qParams['pid'] = data;
                    console.log(post_data);
                    if (this.source === 'checkin') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number
                            }
                        };
                        this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                    } else if (this.source === 'appointment') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number
                            }
                        };
                        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
                    } else {
                        const navigationExtras: NavigationExtras = {
                            queryParams:  {
                                phoneNo : this.phoneNo
                            }
                        };
                        this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
                    }
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    onCancel() {
        this._location.back();
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
}
