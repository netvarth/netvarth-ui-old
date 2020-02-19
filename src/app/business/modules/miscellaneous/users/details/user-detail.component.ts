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
    userForm: FormGroup;
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
    showPrvdrFields = false;
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
            title: 'Users',
            url: '/provider/settings/miscellaneous/users'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam;
    subDomainList: any = [];
    business_domains;
    showAdvancedSection = false;
    filterBydept = false;
    removeitemdialogRef;
    departments: any = [];
    userId;
    user_data: any = [];
    userTypesFormfill: any = ['CONSUMER', 'ASSISTANT', 'ADMIN', 'PROVIDER'];
    dept: any;
    subDom;
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
        this.activated_route.queryParams.subscribe(data => {
            // console.log(data);
            this.actionparam = data;

        }
        );

    }
    ngOnInit() {
        this.createForm();
        if (this.actionparam.val) {
            this.userId = this.actionparam.val;
            this.getUserData();
        }

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
    }
    createForm() {
        this.userForm = this.fb.group({
            first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
            gender: [''],
            phonenumber: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_PHONENUMBERCOUNT10)])],
            dob: [''],
            email: ['', Validators.compose([Validators.pattern(projectConstants.VALIDATOR_EMAIL)])],
            //  password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
            selectedSubDomain: [0, Validators.compose([Validators.required])],
            selectedDepartment: [],
            selectedUserType: ['', Validators.compose([Validators.maxLength(500)])],
            address: [],
            state: [],
            city: []
        });

        // if (this.actionparam.type === 'edit') {
        //     this.updateForm();
        // }
        this.getWaitlistMgr();
    }
    getUserData() {
        if (this.userId) {
            this.provider_services.getUser(this.userId)
                .subscribe(
                    res => {
                        this.user_data = res;
                        console.log(this.user_data);
                        if (this.actionparam.type === 'edit') {
                            // this.createForm();
                            this.updateForm();
                        }
                        const breadcrumbs = [];
                        this.breadcrumbs_init.map((e) => {
                            breadcrumbs.push(e);
                        });
                        breadcrumbs.push({
                            title: this.user_data.firstName
                        });
                        this.breadcrumbs = breadcrumbs;
                    }
                );
            // if (this.actionparam.type === 'edit') {
            //     this.createForm();
            //     }
        }
    }
    updateForm() {
        console.log(this.user_data.firstName);
        if (this.user_data.userType === 'PROVIDER') {
            this.showPrvdrFields = true;
            // for (let subDomain of this.subDomains) {
            //     console.log(subDomain.id);
            //     console.log(this.user_data.subdomain);
            //     if (subDomain.id === this.user_data.subdomain){
            //         console.log('domain');
            //         this.subDom = subDomain.id;
            //         console.log(this.subDom);
            //     }
            // }
            console.log(this.user_data.deptId);
            // for (let dept of this.departments) {
            //     console.log(dept.id);
            //     console.log(this.user_data.deptId);
            //     if (dept.id === this.user_data.deptId){
            //         console.log('dept');
            //         this.dept = dept.displayName;
            //         console.log(this.dept);
            //     }
            // }

        }
        // console.log("up form");
        this.userForm.setValue({
            'first_name': this.user_data.firstName || null,
            'last_name': this.user_data.lastName || null,
            'gender': this.user_data.gender || null,
            'phonenumber': this.user_data.mobileNo || null,
            'dob': this.user_data.dob || null,
            'email': this.user_data.email || null,
            // 'password': this.user_data.commonPassword || this.userForm.get('password').value,
            'selectedSubDomain': this.user_data.subdomain || null,
            'selectedDepartment': this.user_data.deptId || null,
            'selectedUserType': this.user_data.userType || null,
            'address': this.user_data.address || null,
            'state': this.user_data.state || null,
            'city': this.user_data.city || null
        });

    }
    onItemSelect(subdomain) {
        // console.log(subdomain);
    }
    onUserSelect(event) {
        if (event.value === 'PROVIDER') {
            this.showPrvdrFields = true;
        } else {
            this.showPrvdrFields = false;
        }
        console.log(event.value);
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

        // console.log(this.actionparam);
        // if (this.actionparam === 'add') {


        // const data = {
        //     'firstName': 'string',
        //     'lastName': 'string',
        //     'address': 'string',
        //     'mobileNo': 0,
        //     'dob': '2020-01-21T09:12:18.734Z',
        //     'gender': 'string',
        //     'userType': 'CONSUMER',
        //     'email': 'string',
        //     'city': 'string',
        //     'state': 'string'
        // };

        // const post_data = {
        //     'userProfile': {
        //         'firstName': input.first_name.trim() || null,
        //         'lastName': input.last_name.trim() || null,
        //         'address': 'ff',
        //         'mobileNo': input.phonenumber,
        //         'dob': date_format || null,
        //         'gender': input.gender || null,
        //         'userType': 'CONSUMER',
        //         'email': input.email || '',
        //         'city': 'string',
        //         'state': 'string'
        //     },
        //     'subSector': input.selectedSubDomain.subDomain,
        //     'commonPassword': input.password,
        //     'isAdmin': true,
        //     'departmentCode': input.selectedDepartment
        // };

        // const post_data = {
        //     'userProfile': {
        //         'firstName': input.first_name.trim() || null,
        //         'lastName': input.last_name.trim() || null,
        //         'dob': date_format || null,
        //         'gender': input.gender || null,
        //         'email': input.email || '',
        //         'countryCode': '+91',
        //         'primaryMobileNo': input.phonenumber
        //     },
        //     'subSector': input.selectedSubDomain.subDomain,
        //     'commonPassword': input.password,
        //     'isAdmin': true,
        //     'departmentCode': input.selectedDepartment
        // };
        const post_data1 = {
            'firstName': input.first_name.trim() || null,
            'lastName': input.last_name.trim() || null,
            'dob': date_format || null,
            'gender': input.gender || null,
            'email': input.email || '',
            'mobileNo': input.phonenumber,
            'address': input.address,
            'city': input.city,
            'state': input.state,
            // 'deptId': input.selectedDepartment,
            'userType': input.selectedUserType
        };
        // console.log(input.selectedDepartment);
        if (input.selectedUserType === 'PROVIDER') {
            post_data1['deptId'] = input.selectedDepartment;
            post_data1['subdomain'] = input.selectedSubDomain;
        }

        if (this.actionparam.type === 'edit') {
            this.provider_services.updateUser(post_data1, this.userId).subscribe(() => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('BRANCHUSER_ADDED'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        } else {
            this.provider_services.createUser(post_data1).subscribe(() => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('BRANCHUSER_ADDED'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    //  }
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
                    console.log('department');
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
                    if (this.actionparam.type !== 'edit') {
                        this.userForm.get('selectedDepartment').setValue(this.departments[0].departmentId);
                    }
                    this.api_loading = false;
                },
                error => {
                }
            );
    }
}
