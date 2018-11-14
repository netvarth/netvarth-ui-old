import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {projectConstants} from '../../../shared/constants/project-constants';
import {SharedFunctions} from '../../../shared/functions/shared-functions';
import { Messages} from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-bprofile-spoken-languages',
  templateUrl: './add-provider-bprofile-spoken-languages.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderBprofileSpokenLanguagesComponent implements OnInit {

  lang_known_cap = Messages.LANG_KNOWN_CAP;
  no_lang_found_cap = Messages.NO_LANG_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;

  api_error = null;
  api_success = null;
  language_arr: any = [];
  query_done = false;
  sellanguage_arr: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddProviderBprofileSpokenLanguagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {
       // console.log(data);
     }

  ngOnInit() {
    this.language_arr = this.data.languagesSpoken;
    if (this.data.sellanguages) {
      this.sellanguage_arr = this.data.sellanguages;
    }
  }

  langSel(sel) {
    if (this.sellanguage_arr.length > 0) {
      const existindx = this.sellanguage_arr.indexOf(sel);
      if (existindx === -1 ) {
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
      if (existindx !== -1 ) {
        return true;
      }
    } else {
       return false;
    }
  }

  saveLanguages() {
    this.resetApiErrors();
    const postdata = {
       'languagesSpoken': this.sellanguage_arr
    };
   // console.log('save', postdata);
    this.provider_services.updatePrimaryFields(postdata)
      .subscribe(data => {
        this.api_success = this.shared_functions.getProjectMesssages('BPROFILE_LANGUAGE_SAVED');
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
