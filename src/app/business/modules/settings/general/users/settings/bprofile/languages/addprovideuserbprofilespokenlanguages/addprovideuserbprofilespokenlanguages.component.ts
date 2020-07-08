import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../../../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../../../../../app.component';

@Component({
  selector: 'app-addprovideuserbprofilespokenlanguages',
  templateUrl: './addprovideuserbprofilespokenlanguages.component.html'
})
export class AddProviderUserBprofileSpokenLanguagesComponent implements OnInit {
  lang_known_cap = Messages.LANG_KNOWN_CAP;
  no_lang_found_cap = Messages.NO_LANG_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  api_loading = true;
  api_error = null;
  api_success = null;
  language_arr: any = [];
  query_done = false;
  sellanguage_arr: any = [];
  disableButton = false;
  loadData: ArrayBuffer;
  user_arr: any = [];
  constructor(
    public dialogRef: MatDialogRef<AddProviderUserBprofileSpokenLanguagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
  ) {
    this.loadData = data;
  }
  ngOnInit() {
    this.api_loading = true;
    this.getUser();
    this.language_arr = this.data.languagesSpoken;
    if (this.data.sellanguages) {
      this.sellanguage_arr = this.data.sellanguages;
    }
    this.api_loading = false;
  }
  getUser() {
    this.provider_services.getUser(this.data.userId)
      .subscribe(data => {
        this.user_arr = data;
      });
  }
  langSel(sel) {
    if (this.sellanguage_arr.length > 0) {
      const existindx = this.sellanguage_arr.indexOf(sel);
      if (existindx === -1) {
        this.sellanguage_arr.push(sel);
      } else {
        this.sellanguage_arr.splice(existindx, 1);
      }
    } else {
      this.sellanguage_arr.push(sel);
    }
  }
  checklangExists(lang) {
    if (this.sellanguage_arr.length > 0) {
      const existindx = this.sellanguage_arr.indexOf(lang);
      if (existindx !== -1) {
        return true;
      }
    } else {
      return false;
    }
  }
  saveLanguages() {
    this.disableButton = true;
    this.resetApiErrors();
    const postdata = {
      'languagesSpoken': this.sellanguage_arr
    };
    if (this.user_arr.userType === 'PROVIDER') {
      postdata['userSubdomain'] = this.user_arr.subdomain;
    }
    this.provider_services.updateUserbProfile(postdata, this.data.userId)
      .subscribe(data => {
        this.loadData = data;
        this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_LANGUAGE_SAVED');
        setTimeout(() => {
          this.dialogRef.close({ 'mod': 'reloadlist', 'data': this.loadData });
        }, projectConstants.TIMEOUT_DELAY);
      },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.disableButton = false;
        }
      );
  }
  loadDetails() {
    this.dialogRef.close({ 'mod': 'reloadlist', 'data': this.loadData });
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
