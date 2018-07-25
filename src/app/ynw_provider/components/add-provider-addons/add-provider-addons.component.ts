import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
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
      .subscribe( (data: any) => {

        this.upgradableaddons = [];

          for (const metric of data) {
            for (const addon of metric.addons) {
              this.upgradableaddons.push(addon);
            }
          }
          this.obtainedaddons = true;
      });
  }
  createForm() {
      this.amForm = this.fb.group({
        addons_selpackage: ['', Validators.compose([Validators.required])]
      });
  }
  onSubmit (form_data) {
    this.resetApiErrors();
    if (this.selected_addon) {
      this.provider_services.addAddonPackage(this.selected_addon)
        .subscribe (data => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ADDON_ADDED');
          setTimeout(() => {
           this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            // this.api_error = this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
          }
        );
    }
  }

  licenseaddon_Select(id) {
   // console.log('value', id);
    this.selected_addon = id;
    this.selected_addondesc = null;
    for (const addon of this.upgradableaddons) {
     if (addon.addonId === id) {
       this.selected_addondesc = addon.addonDesc;
     }
    }
    // this.selected_addondesc = obj.addonDesc;
    // console.log(this.selected_addondesc);
  }
  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

}
