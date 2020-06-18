import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormMessageDisplayService } from '../../../../../../../../../shared/modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../../../../../app.component';
import { Messages } from '../../../../../../../../../shared/constants/project-messages';


@Component({
  selector: 'app-userspecialization',
  templateUrl: './userspecialization.component.html'
})
export class UserSpecializationComponent implements OnInit {

  specializations_cap = Messages.SPECIALIZATIONS_CAP;
  no_speci_found_cap = Messages.NO_SPECI_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  api_loading = true;
  api_error = null;
  api_success = null;
  specialization_arr: any = [];
  query_done = false;
  selspecialization_arr: any = [];
  disableButton = false;
  loadData: any = [];
  user_arr: any = [];

  constructor(
    public dialogRef: MatDialogRef<UserSpecializationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
  ) {
    this.loadData = data;
    console.log(this.loadData);
  }
  ngOnInit() {
    this.api_loading = true;
    this.getUser();
    this.specialization_arr = this.data.specializations;
    if (this.data.selspecializations) {
      this.selspecialization_arr = this.data.selspecializations;
    }
    this.api_loading = false;
  }

  specializationSel(sel) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(sel);
      if (existindx === -1) {
        this.selspecialization_arr.push(sel);
      } else {
        this.selspecialization_arr.splice(existindx, 1);
      }
    } else {
      this.selspecialization_arr.push(sel);
    }
  }
  getUser() {
    this.provider_services.getUser(this.data.userId)
      .subscribe(data => {
        this.user_arr = data;
        console.log(this.user_arr.subdomain);
      });
  }

  checkspecializationExists(lang) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(lang);
      if (existindx !== -1) {
        return true;
      }
    } else {
      return false;
    }
  }

  saveSpecializations() {
    this.disableButton = true;
    this.resetApiErrors();
    const postdata = {
      'specialization': this.selspecialization_arr
    };
    if (this.user_arr.userType === 'PROVIDER') {
      postdata['userSubdomain'] = this.user_arr.subdomain;
    }
    this.provider_services.updateuserSpecializationPrimaryFields(postdata, this.loadData.userId)
      .subscribe(data => {
        this.loadData = data;
        this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SPECIALIZATION_SAVED');
        setTimeout(() => {
          this.dialogRef.close({ 'mod': 'reloadlist', 'data': data });
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
