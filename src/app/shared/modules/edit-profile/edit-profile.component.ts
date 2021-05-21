import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../services/group-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  // styleUrls: ['./home.component.scss']
})
export class EditProfileComponent implements OnInit {

  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  date_of_birth_cap = Messages.DOB_CAP;
  phone_no_cap = Messages.PHONE_NO_CAP;
  edit_phone_no_cap = Messages.EDIT_PHONE_NO_CAP;
  email_id_cap = Messages.EMAIL_ID_CAP;
  email_cap = Messages.EMAIL_CAP;
  edit_email_cap = Messages.CHANGE_EMAIL_CAP;
  update_btn = Messages.UPDATE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  change_password_cap = Messages.CHANGE_PASSWORD_CAP;
  change_mobile_cap = Messages.CHANGE_MOB_CAP;
  change_email_cap = Messages.ADD_CHANGE_EMAIL;
  family_members_cap = Messages.FAMILY_MEMBERS;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  country_code = Messages.MOB_NO_PREFIX_CAP;
  editProfileForm: FormGroup;
  api_error = null;
  api_success = null;
  curtype;
  maxalloweddate = '';
  tday = new Date();
  minday = new Date(1900, 0, 1);
  emailHolder = '';
  phonenoHolder = '';
  countryCode = '';
  fnameerror = null;
  lnameerror = null;
  emailerror = null;
  email1error = null;
  confrmshow = false;
  domain;
  breadcrumb_moreoptions: any = [];
  breadcrumbs_init = [
    {
      title: Messages.USER_PROF_CAP,
      url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/profile'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  loading = false;
  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private _location: Location,
    private snackbarService: SnackbarService
  ) { }
  goBack () {
    this.location.back();
  }
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.editProfileForm = this.fb.group({
      first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      gender: [''],
      dob: [''],
      email: [''],
      email1: ['']
    });
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.getProfile(this.curtype);
    // const tday = new Date();
    const month = (this.tday.getMonth() + 1);
    let dispmonth = '';
    if (month < 10) {
      dispmonth = '0' + month;
    } else {
      dispmonth = month.toString();
    }
    this.maxalloweddate = this.tday.getFullYear() + '-' + dispmonth + '-' + this.tday.getDate();
  }
  getProfile(typ) {
    this.loading = true;

    this.shared_functions.getProfile()
      .then(
        data => {
          this.loading = false;
          if (typ === 'consumer') {
            this.editProfileForm.setValue({
              first_name: data['userProfile']['firstName'] || null,
              last_name: data['userProfile']['lastName'] || null,
              gender: data['userProfile']['gender'] || null,
              dob: data['userProfile']['dob'] || null,
              email: data['userProfile']['email'] || '',
              email1: data['userProfile']['email'] || ''
            });
            this.phonenoHolder = data['userProfile']['primaryMobileNo'] || '';
            this.countryCode = data['userProfile']['countryCode'] || '';
          } else if (typ === 'provider') {
            this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
            this.editProfileForm.setValue({
              first_name: data['basicInfo']['firstName'] || null,
              last_name: data['basicInfo']['lastName'] || null,
              gender: data['basicInfo']['gender'] || null,
              dob: data['basicInfo']['dob'] || null,
              email: data['basicInfo']['email'] || '',
              email1: data['basicInfo']['email'] || ''
            });
            this.phonenoHolder = data['basicInfo']['mobile'] || '';
            console.log(this.phonenoHolder)
            this.countryCode = data['basicInfo']['countryCode'] || '';


          }
        },
        error => {
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
          this.loading = false;
        }
      );
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/providerprofile']);
    }
  }
  onSubmit(sub_data) {
    let date_format = null;
    if (sub_data.dob != null) {
      const date = new Date(sub_data.dob);
      date_format = moment(date).format(projectConstants.POST_DATE_FORMAT);
    }
    let post_data;
    let passtyp;
    const curuserdet = this.groupService.getitemFromGroupStorage('ynw-user');
    if (sub_data.email) {
      const stat = this.validateEmail(sub_data.email);
      if (!stat) {
        this.emailerror = 'Please enter a valid email.';
      }
    }
    if (sub_data.email1) {
      const stat1 = this.validateEmail(sub_data.email1);
      if (!stat1) {
        this.email1error = 'Please enter a valid email.';
      }
    }
    if (sub_data.first_name.trim() === '') {
      this.fnameerror = 'First name is required';
    }
    if (sub_data.last_name.trim() === '') {
      this.lnameerror = 'Last name is required';
    }
    if (this.fnameerror !== null || this.lnameerror !== null) {
      return;
    }
    if (sub_data.email === sub_data.email1) {
      if (this.curtype === 'consumer') {
        post_data = {
          'id': curuserdet['id'] || null,
          'firstName': sub_data.first_name.trim() || null,
          'lastName': sub_data.last_name.trim() || null,
          'dob': date_format || null,
          'gender': sub_data.gender || null,
          'email': sub_data.email || ''
        };
        passtyp = 'consumer';
      } else if (this.curtype === 'provider') {
        post_data = {
          'basicInfo': {
            'id': curuserdet['id'] || null,
            'firstName': sub_data.first_name.trim() || null,
            'lastName': sub_data.last_name.trim() || null,
            'dob': date_format || null,
            'gender': sub_data.gender || null,
            'email': sub_data.email || ''
          }
        };
        passtyp = 'provider/profile';
      }
      this.shared_services.updateProfile(post_data, passtyp)
        .subscribe(
          () => {
            // this.api_success = Messages.PROFILE_UPDATE;
            this.snackbarService.openSnackBar(Messages.PROFILE_UPDATE);
            this.getProfile(this.curtype);
            const curuserdetexisting = this.groupService.getitemFromGroupStorage('ynw-user');
            curuserdetexisting['userName'] = sub_data.first_name + ' ' + sub_data.last_name;
            curuserdetexisting['firstName'] = sub_data.first_name;
            curuserdetexisting['lastName'] = sub_data.last_name;
            this.groupService.setitemToGroupStorage('ynw-user', curuserdetexisting);
            const pdata = { 'ttype': 'updateuserdetails' };
            this.shared_functions.sendMessage(pdata);
          },
          error => {
            // this.api_error = error.error;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    } else {
      this.snackbarService.openSnackBar(Messages.EMAIL_MISMATCH, { 'panelClass': 'snackbarerror' });
      // this.api_error = Messages.PASSWORD_MISMATCH;
    }
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
    this.api_error = null;
    this.api_success = null;
    this.fnameerror = null;
    this.lnameerror = null;
    this.emailerror = null;
    this.email1error = null;
  }
  showConfrmEmail(event) {
    if (event.key !== 'Enter') {
      this.confrmshow = true;
    }
  }
  resetdob() {
    this.editProfileForm.get('dob').setValue(null);
  }
  redirecToSettings() {
    this._location.back();
    // this.router.navigate(['provider', 'settings', 'bprofile']);
  }
}
