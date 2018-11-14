import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import {projectConstants} from '../../../shared/constants/project-constants';
import { Messages} from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-bprofile-specializations',
  templateUrl: './add-provider-bprofile-specializations.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderBprofileSpecializationsComponent implements OnInit {

  specializations_cap = Messages.SPECIALIZATIONS_CAP;
  no_speci_found_cap = Messages.NO_SPECI_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap =Messages.SAVE_BTN;
  
  api_error = null;
  api_success = null;
  specialization_arr: any = [];
  query_done = false;
  selspecialization_arr: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddProviderBprofileSpecializationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {
       // console.log(data);
     }

  ngOnInit() {
    this.specialization_arr = this.data.specializations;
    if (this.data.selspecializations) {
      this.selspecialization_arr = this.data.selspecializations;
    }
  }

  specializationSel(sel) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(sel);
      if (existindx === -1 ) {
        this.selspecialization_arr.push(sel);
      } else {
        this.selspecialization_arr.splice(existindx, 1);
      }
    } else {
      this.selspecialization_arr.push(sel);
    }
    // console.log(this.selspecialization_arr);
  }

  checkspecializationExists(lang) {
    if (this.selspecialization_arr.length > 0) {
      const existindx = this.selspecialization_arr.indexOf(lang);
      if (existindx !== -1 ) {
        return true;
      }
    } else {
       return false;
    }
  }

  saveSpecializations() {
    this.resetApiErrors();
    const postdata = {
       'specialization': this.selspecialization_arr
    };
   // console.log('save', postdata);
    this.provider_services.updatePrimaryFields(postdata)
      .subscribe(data => {
        this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_SPECIALIZATION_SAVED');
        setTimeout(() => {
          this.dialogRef.close({'mod': 'reloadlist', 'data': data});
          }, projectConstants.TIMEOUT_DELAY);
       },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
