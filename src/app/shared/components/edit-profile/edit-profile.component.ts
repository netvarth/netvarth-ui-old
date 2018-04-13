import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';

import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';

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

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router) {}

  ngOnInit() {

    this.editProfileForm = this.fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      address: [''],
      mobile: [{value: '', disabled: true}],
      gender: ['male'],
      dob: [''],
      email: [{value: '', disabled: true}, Validators.compose([Validators.email]) ]

    });
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    const ob = this;
    this.shared_functions.getProfile()
    .then(
      data =>  {
        if ( this.curtype === 'consumer') {
          this.editProfileForm.setValue({
            first_name : data['userProfile']['firstName'] || null,
            last_name : data['userProfile']['lastName'] || null,
            address : data['userProfile']['address'] || null,
            mobile : data['userProfile']['primaryMobileNo'] || null,
            gender : data['userProfile']['gender'] || null,
            dob : data['userProfile']['dob'] || null,
            email : data['userProfile']['email'] || null
          });
        } else if ( this.curtype === 'provider') {
          this.editProfileForm.setValue({
            first_name : data['basicInfo']['firstName'] || null,
            last_name : data['basicInfo']['lastName'] || null,
            address : data['basicInfo']['address'] || null,
            mobile : data['basicInfo']['mobile'] || null,
            gender : data['basicInfo']['gender'] || null,
            dob : data['basicInfo']['dob'] || null,
            email : data['basicInfo']['email'] || null
          });
        }
      },
      error => { ob.api_error = error.error; }
    );


  }


  onSubmit(sub_data) {
    console.log(sub_data);

    let date_format = null;
    if (sub_data.dob != null) {

      const date =  new Date(sub_data.dob);
      date_format = moment(date).format('YYYY-MM-DD');

    }
    let post_data;
    let passtyp;
    const curuserdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    console.log('localstorage', curuserdet.id);
    if (this.curtype === 'consumer') {
      post_data = {
                    'id': curuserdet['id'] || null,
                    'firstName': sub_data.first_name || null,
                    'lastName': sub_data.last_name || null,
                    'dob': date_format || null,
                    'gender': sub_data.gender || null,
                    'address': sub_data.address || null
      };
      passtyp = 'consumer';
    } else if (this.curtype === 'provider') {
      
      post_data = {
              'basicInfo': {
                  'id': curuserdet['id'] || null,
                  'firstName': sub_data.first_name || null,
                  'lastName': sub_data.last_name || null,
                  'dob': date_format || null,
                  'gender': sub_data.gender || null
              }
      };
      passtyp = 'provider/profile';
    }
    this.shared_services.updateProfile(post_data, passtyp)
    .subscribe(
      data => {
        this.api_success = Messages.PROFILE_UPDATE;
      },
      error => {
        this.api_error = error.error;
      }
    );
  }


  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }



}
