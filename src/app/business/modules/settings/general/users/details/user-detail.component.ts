import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import * as moment from 'moment';
import { SharedServices } from '../../../../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
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
    subdomainerror = null;
    subDomains: any = [];
    id;
    tday = new Date();
    minday = new Date(1900, 0, 1);
    showPrvdrFields = false;
    type;
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: Messages.GENERALSETTINGS,
            url: '/provider/settings/general'
        },
        {
            title: 'Users',
            url: '/provider/settings/general/users'
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
    userTypesFormfill: any = [{value: 'ASSISTANT', name: 'ASSISTANT'}, {value: 'PROVIDER', name: 'PROVIDER'}, {value: 'ADMIN', name: 'ADMIN'}];
    dept: any;
    subDom;
    deptLength;
    subsector;
    sector;
    selectedsubDomain: any = [];
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
            this.actionparam = data;
        }
        );
    }
    ngOnInit() {
        this.createForm();
        if (this.actionparam.val) {
            this.userId = this.actionparam.val;
            this.getUserData();
        } else {
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: 'Add'
            });
            this.breadcrumbs = breadcrumbs;
        }
        const bConfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.subsector = user.subSector;
        this.sector = user.sector;
        if (this.sector === 'healthCare') {
           this.userTypesFormfill = [{value: 'ASSISTANT', name: 'ASSISTANT'}, {value: 'PROVIDER', name: 'DOCTOR'}, {value: 'ADMIN', name: 'ADMIN'}];
        }
        if (bConfig && bConfig.bdata) {
            for (let i = 0; i < bConfig.bdata.length; i++) {
                if (user.sector === bConfig.bdata[i].domain) {
                    for (let j = 0; j < bConfig.bdata[i].subDomains.length; j++) {
                        //  if (!bConfig.bdata[i].subDomains[j].isMultilevel) {
                        this.subDomains.push(bConfig.bdata[i].subDomains[j]);
                        //  }
                    }
                    break;
                }
            }
            // this.userForm.get('selectedSubDomain').setValue(this.subDomains[0].id);
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
        this.selectedsubDomain = [];
        for (const subdomain of this.subDomains) {
            if (this.sector === 'healthCare') {
                if (this.subsector === 'hospital') {
                    if (subdomain.subDomain === 'physiciansSurgeons') {
                        this.selectedsubDomain.push(subdomain);
                    }
                } else if (this.subsector === 'dentalHosp') {
                    if (subdomain.subDomain === 'dentists') {
                        this.selectedsubDomain.push(subdomain);
                    }
                } else if (this.subsector === 'alternateMedicineHosp') {
                    if (subdomain.subDomain === 'alternateMedicinePractitioners') {
                        this.selectedsubDomain.push(subdomain);
                    }
                }
            } else if (this.sector === 'personalCare') {
                if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                } else if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                } else if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                }
            } else if (this.sector === 'finance') {
                if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                } else if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                } else if (subdomain.subDomain === this.subsector) {
                    this.selectedsubDomain.push(subdomain);
                }
            } else if (this.sector === 'veterinaryPetcare') {
                if (this.subsector === 'veterinaryhospital') {
                    if (subdomain.subDomain === 'veterinarydoctor') {
                        this.selectedsubDomain.push(subdomain);
                    }
                }
            }
        }
    }
    createForm() {
        this.userForm = this.fb.group({
            first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
            last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
            gender: [''],
            phonenumber: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
            dob: [''],
            email: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
            //  password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
            // selectedSubDomain: [],
            selectedDepartment: [],
            privileges : [''],
            selectedUserType: [],
            // address: [],
            // state: [],
            // city: []
        });

        this.userForm.get('selectedUserType').setValue(this.userTypesFormfill[0].name);
        this.getWaitlistMgr();
    }
    getUserData() {
        if (this.userId) {
            this.provider_services.getUser(this.userId)
                .subscribe(
                    res => {
                        this.user_data = res;
                        if (this.actionparam.type === 'edit') {
                            this.type = this.user_data.userType;
                            if (this.sector === 'healthCare') {
                                if (this.type === 'PROVIDER') {
                                    this.type = 'DOCTOR';
                                }
                                
                            }
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
        if (this.user_data.userType === 'PROVIDER') {
            this.showPrvdrFields = true;
        }
        this.userForm.setValue({
            'first_name': this.user_data.firstName || null,
            'last_name': this.user_data.lastName || null,
            'gender': this.user_data.gender || null,
            'phonenumber': this.user_data.mobileNo || null,
            'dob': this.user_data.dob || null,
            'email': this.user_data.email || null,
            // 'password': this.user_data.commonPassword || this.userForm.get('password').value,
            // 'selectedSubDomain': this.user_data.subdomain || null,
            'selectedDepartment': this.user_data.deptId || null,
            'selectedUserType': this.user_data.userType || null,
            'privileges': this.user_data.admin || false,
            // 'address': this.user_data.address || null,
            // 'state': this.user_data.state || null,
            // 'city': this.user_data.city || null
        });

    }
    onUserSelect(event) {
        if (event.value === 'PROVIDER') {
            this.showPrvdrFields = true;
        } else {
            this.showPrvdrFields = false;
        }

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
        // if (input.selectedUserType === 'PROVIDER') {
        //     if (input.selectedSubDomain === null) {
        //         this.subdomainerror = 'Service specialization or Occupation is required';
        //         return;
        //     }
        // }
        if (this.fnameerror !== null || this.lnameerror !== null || this.emailerror !== null) {
            return;
        }
        const post_data1 = {
            'firstName': input.first_name.trim() || null,
            'lastName': input.last_name.trim() || null,
            'dob': date_format || null,
            'gender': input.gender || null,
            'email': input.email || '',
            'mobileNo': input.phonenumber,
            // 'address': input.address,
            // 'city': input.city,
            // 'state': input.state,
            // 'deptId': input.selectedDepartment,
            //'isAdmin' :
            'userType': input.selectedUserType
        };
        if (input.selectedUserType === 'PROVIDER') {
            post_data1['deptId'] = input.selectedDepartment;
            post_data1['admin'] = input.privileges;
            // post_data1['subdomain'] = input.selectedSubDomain;
            post_data1['subdomain'] = this.selectedsubDomain[0].id || 0;
        }
        console.log(post_data1);
        if (this.actionparam.type === 'edit') {
            this.provider_services.updateUser(post_data1, this.userId).subscribe(() => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('USERUPDATED_ADDED'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'general', 'users']);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        } else {
            this.provider_services.createUser(post_data1).subscribe(() => {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('USER_ADDED'), { 'panelclass': 'snackbarerror' });
                this.router.navigate(['provider', 'settings', 'general', 'users']);
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
        }
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'general', 'users']); 
    }
    // onlineProfile() {
    //     this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'bprofile']);
    // }
    resetApiErrors() {
        this.emailerror = null;
        this.fnameerror = null;
        this.lnameerror = null;
        this.subdomainerror = null;
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
                    if (this.actionparam.type !== 'edit') {
                        this.userForm.get('selectedDepartment').setValue(this.departments[0].departmentId);
                    }
                    this.deptLength = this.departments.length;
                    this.api_loading = false;
                },
                error => {
                }
            );
    }
}
