import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import * as moment from 'moment';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material';
@Component({
    'selector': 'app-branchuser-detail',
    'templateUrl': './user-detail.component.html'
})
export class BranchUserDetailComponent implements OnInit {
    first_name_cap = Messages.F_NAME_CAP;
    last_name_cap = Messages.L_NAME_CAP;
    gender_cap = Messages.GENDER_CAP;
    male_cap = Messages.MALE_CAP;
    female_cap = Messages.FEMALE_CAP;
    date_of_birth_cap = Messages.DOB_CAP;
    phone_no_cap = Messages.PHONE_NO_CAP;
    email_id_cap = Messages.EMAIL_ID_CAP;
    email_cap = Messages.EMAIL_CAP;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
    select_subdomain_cap = Messages.SELECT_SB_DMN_CAP;
    subdomain_displayname = projectConstants.SUBDOMAIN_DISPLAYNAME;
    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    layout_id;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    action = 'show';
    api_loading = false;
    api_error = null;
    api_success = null;
    fnameerror = null;
    lnameerror = null;
    emailerror = null;
    email1error = null;
    subDomains: any = [];
    id;
    tday = new Date();
    minday = new Date(1900, 0, 1);
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Miscellaneous',
            url: '/provider/settings/miscellaneous'
        },
        {
            title: 'Doctors',
            url: '/provider/settings/miscellaneous/users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    subDomainList: any = [];
    business_domains;
    showAdvancedSection = false;
    filterBydept = false;
    removeitemdialogRef;
    departments: any = [];
    // selected_dept;
    constructor(
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private shared_services: SharedServices,
        private router: Router,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                const breadcrumbs = [];
                this.breadcrumbs_init.map((e) => {
                    breadcrumbs.push(e);
                });
                breadcrumbs.push({
                    title: 'Add'
                });
                this.breadcrumbs = breadcrumbs;
            });
    }
    ngOnInit() {
        this.getWaitlistMgr();
        const bConfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        if (bConfig && bConfig.bdata) {
            for (let i = 0; i < bConfig.bdata.length; i++) {
                if (user.sector === bConfig.bdata[i].domain) {
                    for (let j = 0; j < bConfig.bdata[i].subDomains.length; j++) {
                        if (!bConfig.bdata[i].subDomains[j].isMultilevel) {
                            this.subDomains.push(bConfig.bdata[i].subDomains[j]);
                        }
                    }
                    break;
                }
            }
        } else {
            this.shared_services.bussinessDomains()
                .subscribe(
                    res => {
                        const today = new Date();
                        const postdata = {
                            cdate: today,
                            bdata: res
                        };
                        this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
                    }
                );
        }
        this.amForm = this.fb.group({
            first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            gender: [''],
            phonenumber: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_PHONENUMBERCOUNT10)])],
            dob: [''],
            email: ['', Validators.compose([Validators.pattern(projectConstants.VALIDATOR_EMAIL)])],
            password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
            selectedSubDomain: [0, Validators.compose([Validators.required])],
            selectedDepartment: []
        });
    }
    onItemSelect(subdomain) {
        // console.log(subdomain);
    }
    onSubmit(input) {
        let date_format = null;
        if (input.dob !== null && input.dob !== '') {
            const date = new Date(input.dob);
            date_format = moment(date).format(projectConstants.POST_DATE_FORMAT);
        }
        if (input.email) {
            const stat = this.validateEmail(input.email);
            if (!stat) {
                this.emailerror = 'Please enter a valid email.';
            }
        }
        if (input.first_name.trim() === '') {
            this.fnameerror = 'First name is required';
        }
        if (input.last_name.trim() === '') {
            this.lnameerror = 'Last name is required';
        }
        if (this.fnameerror !== null || this.lnameerror !== null) {
            return;
        }
        if (this.actionparam === 'add') {
            const post_data = {
                'userProfile': {
                    'firstName': input.first_name.trim() || null,
                    'lastName': input.last_name.trim() || null,
                    'dob': date_format || null,
                    'gender': input.gender || null,
                    'email': input.email || '',
                    'countryCode': '+91',
                    'primaryMobileNo': input.phonenumber
                },
                'subSector': input.selectedSubDomain.subDomain,
                'commonPassword': input.password,
                'isAdmin': true,
                'departmentCode': input.selectedDepartment
            };
            this.provider_services.createBranchSP(post_data).subscribe(data => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('BRANCHUSER_ADDED'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
    }
    resetApiErrors() {
    }
    isNumeric(evt) {
        return this.shared_functions.isNumeric(evt);
    }
    validateEmail(mail) {
        const emailField = mail;
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(emailField) === false) {
            return false;
        }
        return true;
    }
    advancedClick() {
        (this.showAdvancedSection) ? this.showAdvancedSection = false : this.showAdvancedSection = true;
    }

    getWaitlistMgr() {
        this.provider_services.getWaitlistMgr()
            .subscribe(
                data => {
                    this.filterBydept = data['filterByDept'];
                    if (this.filterBydept) {
                        setTimeout(() => {
                            this.getDepartments();
                        }, 1000);
                    }
                },
                () => {
                }
            );
    }
    enabledepartment() {
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': 'Proceed with enabling department?'
            }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.provider_services.setDeptWaitlistMgr('Enable')
                    .subscribe(
                        () => {
                            this.api_loading = true;
                            this.getWaitlistMgr();
                        },
                        error => {
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            } else {
            }
        });
    }
    getDepartments() {
        this.provider_services.getDepartments()
            .subscribe(
                data => {
                    this.departments = data['departments'];
                    this.amForm.get('selectedDepartment').setValue(this.departments[0].departmentCode);
                    this.api_loading = false;
                },
                error => {
                }
            );
    }
}
