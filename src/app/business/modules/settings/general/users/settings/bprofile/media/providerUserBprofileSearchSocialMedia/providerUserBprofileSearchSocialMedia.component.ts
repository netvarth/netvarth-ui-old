import { Component, OnInit, Inject } from '@angular/core';
import { Messages } from '../../../../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../../../../app.component';
import { ProviderServices } from '../../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../../shared/functions/shared-functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { projectConstantsLocal } from '../../../../../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-provideruserbprofilesearch-socialmedia',
  templateUrl: './providerUserBprofileSearchSocialMedia.component.html'
})
export class ProviderUserBprofileSearchSocialMediaComponent implements OnInit {

  your_social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
  select_one_cap = Messages.SELECT_ONE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  social_url_cap = Messages.SOCIAL_URL_CAP;
  select_cap = Messages.SOCIAL_SELECT_CAP;
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
  placeholder = 'e.g:- https://www.jaldee.com';
  disableButton = false;
  api_loading = true;
  constructor(
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<ProviderUserBprofileSearchSocialMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.bProfile = data.bprofile;
    if (this.bProfile.socialMedia) {
      for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
        if (this.bProfile.socialMedia[i].resource !== '') {
          this.social_arr.push({ 'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
        }
      }
    }
    if (this.social_arr.length > 0) {
      this.show_addsection = false;
    }
    this.curmod = (data.editkey) ? 'edit' : 'add';
    console.log(this.curmod);
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
    this.disableButton = true;
    const post_data: any = [];
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Socurl !== '') {
        post_data.push({ 'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl });
      }
    }
    const submit_data = {
      'socialMedia': post_data
    };
    this.posted = true;
    this.provider_services.updateUserSocialMediaLinks(submit_data, this.data.userId)
      .subscribe(
        () => {
          if (this.curmod === 'add') {
            this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SOCIALMEDIA_SAVED');
          } else if (this.curmod === 'edit') {
            this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SOCIALMEDIA_UPDATE');
          }
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        () => {
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
    this.api_loading = false;
  }
  getSocialdet(key, field) {
    const retdet = this.orgsocial_list.filter(
      soc => soc.key === key);
    const returndet = retdet[0][field];
    this.api_loading = false;
    return returndet;
  }
  saveSocial() {
    this.resetApiErrors();
    const curlabel = this.socialurl;
    const pattern = new RegExp(projectConstantsLocal.VALIDATOR_URL);
    const result = pattern.test(curlabel);
    if (!result) {
      this.api_error = this.shared_functions.getProjectMesssages('BPROFILE_SOCIAL_URL_VALID'); // 'Please enter a valid URL';
      return;
    }
    if (this.curmod === 'add') {
      this.social_arr.push({ 'Sockey': this.socialkey, 'Socurl': this.socialurl });
    } else if (this.curmod === 'edit') {
      for (let i = 0; i < this.social_arr.length; i++) {
        if (this.social_arr[i].Sockey === this.socialkey) {
          this.social_arr[i].Socurl = this.socialurl;
        }
      }
    }
    this.saveSocialmedia();
  }
  resetApiErrors() {
    this.api_success = null;
    this.api_error = null;
  }
}
