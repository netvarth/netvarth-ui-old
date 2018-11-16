import { Component, Inject, OnInit } from '@angular/core';
import { MatInput } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';

import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  // styleUrls: ['./home.component.scss']
})
export class EditProfileComponent implements OnInit {

  editProfileForm: FormGroup;
  api_error = null;
  api_success = null;
  curtype;
  maxalloweddate = '';
  tday = new Date();
  emailHolder = '';
  phonenoHolder = '';
  fnameerror = null;
  lnameerror = null;
  breadcrumbs_init = [
    {
      title: 'Dashboard',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    },
    {
      title: 'User Profile',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/profile'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router
  ) {}

  ngOnInit() {

    this.editProfileForm = this.fb.group({
      first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
      /*gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])]*/
      gender: [''],
      dob: ['']
    });
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    const ob = this;
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
    // console.log('max', this.maxalloweddate);
  }

  getProfile(typ) {
    this.shared_functions.getProfile()
    .then(
      data =>  {
        if ( typ === 'consumer') {
          this.editProfileForm.setValue({
            first_name : data['userProfile']['firstName'] || null,
            last_name : data['userProfile']['lastName'] || null,
            gender : data['userProfile']['gender'] || null,
            dob : data['userProfile']['dob'] || null
          });
          this.emailHolder = data['userProfile']['email'] || '';
          this.phonenoHolder = data['userProfile']['primaryMobileNo'] || '';
        } else if ( typ === 'provider') {
          this.editProfileForm.setValue({
            first_name : data['basicInfo']['firstName'] || null,
            last_name : data['basicInfo']['lastName'] || null,
            gender : data['basicInfo']['gender'] || null,
            dob : data['basicInfo']['dob'] || null
          });
          this.emailHolder = data['basicInfo']['email'] || '';
          this.phonenoHolder = data['basicInfo']['mobile'] || '';
        }
      },
      error => { this.api_error = this.shared_functions.getProjectErrorMesssages(error); }
    );
  }

  onSubmit(sub_data) {
   // console.log(sub_data);

    let date_format = null;
    if (sub_data.dob != null) {

      const date =  new Date(sub_data.dob);
      date_format = moment(date).format(projectConstants.POST_DATE_FORMAT);

    }
    let post_data;
    let passtyp;
    const curuserdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    // console.log('localstorage', curuserdet.id);
    if (sub_data.first_name.trim() === '') {
      this.fnameerror = 'First name is required';
    }
    if (sub_data.last_name.trim() === '') {
      this.lnameerror = 'Last name is required';
    }
    if (this.fnameerror !== null || this.lnameerror !== null) {
      return;
    }
    if (this.curtype === 'consumer') {
      post_data = {
                    'id': curuserdet['id'] || null,
                    'firstName': sub_data.first_name.trim() || null,
                    'lastName': sub_data.last_name.trim() || null,
                    'dob': date_format || null,
                    'gender': sub_data.gender || null
      };
      passtyp = 'consumer';
    } else if (this.curtype === 'provider') {

      post_data = {
              'basicInfo': {
                  'id': curuserdet['id'] || null,
                  'firstName': sub_data.first_name.trim() || null,
                  'lastName': sub_data.last_name.trim() || null,
                  'dob': date_format || null,
                  'gender': sub_data.gender || null
              }
      };
      passtyp = 'provider/profile';
    }
    this.shared_services.updateProfile(post_data, passtyp)
    .subscribe(
      data => {
        // this.api_success = Messages.PROFILE_UPDATE;
        this.shared_functions.openSnackBar(Messages.PROFILE_UPDATE);
        this.getProfile(this.curtype);
        const curuserdetexisting = this.shared_functions.getitemfromLocalStorage('ynw-user');
        curuserdetexisting['userName'] = sub_data.first_name + ' ' + sub_data.last_name;
        curuserdetexisting['firstName'] = sub_data.first_name;
        curuserdetexisting['lastName'] = sub_data.last_name;
        this.shared_functions.setitemonLocalStorage('ynw-user', curuserdetexisting);
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
      },
      error => {
        // this.api_error = error.error;
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }


  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
    this.fnameerror = null;
    this.lnameerror = null;
  }
  resetdob() {
    this.editProfileForm.get('dob').setValue(null);
  }

}
