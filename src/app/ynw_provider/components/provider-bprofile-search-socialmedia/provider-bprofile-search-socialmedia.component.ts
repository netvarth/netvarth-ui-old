import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
  selector: 'app-provider-bprofile-search-socialmedia',
  templateUrl: './provider-bprofile-search-socialmedia.component.html'
})

export class ProviderBprofileSearchSocialMediaComponent implements OnInit {

  @ViewChild('nameit') private elementRef: ElementRef;
  bProfile: any = [];
  api_error = null;
  api_success = null;
  show_addsection = true;
  orgsocial_list = projectConstants.SOCIAL_MEDIA;
  social_list: any = [];
  social_arr: any = [];
  curmod;
  socialkey = '';
  socialurl = '';
  posted = false;

  constructor(
    public provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    public shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<ProviderBprofileSearchSocialMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     //  console.log('received data', data);
      this.bProfile = data.bprofile;
      if (this.bProfile.socialMedia) {
        for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
          if (this.bProfile.socialMedia[i].resource !== '') {
            this.social_arr.push({'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
          }
        }
      }
      if (this.social_arr.length > 0) {
        this.show_addsection = false;
      }
      this.curmod = (data.editkey) ? 'edit' : 'add';
      if (this.curmod === 'add') {
        this.socialkey = '';
        this.socialurl = '';
      } else {
          for (const social of this.bProfile.socialMedia) {
            if (social.resource === data.editkey) {
              this.socialkey = social.resource;
              this.socialurl = social.value;
            }
          }
      }
  }

  ngOnInit() {
    this.prepare_sociallist();
  }
  saveSocialmedia() {
    const post_data: any = [];
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Socurl !== '') {
        post_data.push({'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl});
      }
    }
      const submit_data = {
                            'socialMedia': post_data
      };
      this.posted = true;
      this.provider_services.updateSocialMediaLinks(submit_data)
      .subscribe(
        data => {
            this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SOCIALMEDIA_SAVED');
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.posted = false;
        }
      );

  }

  handle_addsection(add) {
    if (add) {
      this.show_addsection = true;
    } else {
      this.show_addsection = false;
    }
  }

  handle_social_dropdownselect(v) {
    if (!this.check_alreadyexists(v)) {
      const social = {
                      Sockey: v,
                      Socurl: ''
      };
      this.social_arr.push(social);
      this.prepare_sociallist();
      console.log('social arr', this.social_arr);
      this.handle_addsection(false);
    }
  }
  check_alreadyexists(v) {
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Sockey === v) {
        return true;
      }
    }
    return false;
  }
  prepare_sociallist() {
    this.social_list = [];
    for (const soc of this.orgsocial_list) {
      if (!this.check_alreadyexists(soc.key)) {
        this.social_list.push({ key: soc.key, iconClass: soc.iconClass, iconImg: soc.iconImg, displayName: soc.displayName });
      }
    }
  }

  getSocialdet(key, field) {
    const retdet = this.orgsocial_list.filter(
      soc => soc.key === key);
    const returndet = retdet[0][field];
    return returndet;
  }


  saveSocial() {
    this.resetApiErrors();
    const curlabel = this.socialurl;
    const pattern = new RegExp(projectConstants.VALIDATOR_URL);
    const result = pattern.test(curlabel);
    if (!result) {
      this.api_error =  this.shared_functions.getProjectMesssages('BPROFILE_SOCIAL_URL_VALID'); // 'Please enter a valid URL';
      return;
    }
    if (this.curmod === 'add') {
      this.social_arr.push({'Sockey': this.socialkey, 'Socurl': this.socialurl });
    } else if (this.curmod === 'edit') {
      for (let i = 0; i < this.social_arr.length; i++) {
        if (this.social_arr[i].Sockey === this.socialkey) {
          this.social_arr[i].Socurl = this.socialurl;
        }
      }
    }
    // console.log('social_arr', this.social_arr);
    this.saveSocialmedia();
  }

  resetApiErrors() {
    this.api_success = null;
    this.api_error = null;
  }
}
