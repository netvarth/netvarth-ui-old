import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-addprovider-addon',
  templateUrl: './add-provider-addons.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddproviderAddonComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;

  obtainedaddons = false;
  upgradableaddons: any = [];
  selected_addon = '';
  selected_addondesc = '';

  file_error_msg = '';
  constructor(
    public dialogRef: MatDialogRef<AddproviderAddonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
       // console.log(data);
     }

  ngOnInit() {
    this.createForm();
    this.getUpgradableaddonPackages();
  }
  getUpgradableaddonPackages() {
    this.provider_services.getUpgradableAddonPackages()
      .subscribe( data => {
          this.upgradableaddons = data;
          this.obtainedaddons = true;
      });
  }
  createForm() {
      this.amForm = this.fb.group({
        addons_selpackage: ['', Validators.compose([Validators.required])]
      });
  }
  onSubmit (form_data) {
    if (this.selected_addon) {
      this.provider_services.addAddonPackage(this.selected_addon)
        .subscribe (data => {
          this.api_success = Messages.ADDON_ADDED;
          setTimeout(() => {
           this.dialogRef.close();
          }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
        );
    }
  }

  licenseaddon_Select(id) {
    console.log('value', id);
    this.selected_addon = id;
    for (const addon of this.upgradableaddons) {
     if (addon.addons[0].addonId === id) {
       this.selected_addondesc = addon.addons[0].addonDesc;
     }
    }
    // this.selected_addondesc = obj.addonDesc;

  }
  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

}
