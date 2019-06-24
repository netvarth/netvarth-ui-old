import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-addprovider-addon',
  templateUrl: './add-provider-addons.component.html'
})
export class AddproviderAddonComponent implements OnInit {
  add_addon_cap = Messages.ADD_ADDON_CAP;
  addons_cap = Messages.ADDONS_CAP;
  select_one_cap = Messages.SELECT_ONE_CAP;
  no_upgrade_addons_found = Messages.NO_UPGRADE_ADDONS_FOUND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  disableButton = false;
  api_loading = true;
  api_loading1 = true;
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
    public sharedfunctionObj: SharedFunctions
  ) {
  }
  ngOnInit() {
    this.api_loading = false;
    this.createForm();
    this.getUpgradableaddonPackages();
  }
  getUpgradableaddonPackages() {
    this.provider_services.getUpgradableAddonPackages()
      .subscribe((data: any) => {

        this.upgradableaddons = [];

        for (const metric of data) {
          for (const addon of metric.addons) {
            this.upgradableaddons.push(addon);
          }
        }
        this.obtainedaddons = true;
      });
    this.api_loading1 = false;
  }
  createForm() {
    this.amForm = this.fb.group({
      addons_selpackage: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.resetApiErrors();
    this.api_loading = true;
    if (this.selected_addon) {
      this.provider_services.addAddonPackage(this.selected_addon)
        .subscribe(() => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ADDON_ADDED');
          this.disableButton = true;
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
          error => {
            // this.api_error = this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.api_loading = false;
          }
        );
    }
  }
  licenseaddon_Select(id) {
    this.api_loading1 = true;
    this.selected_addon = id;
    this.selected_addondesc = null;
    for (const addon of this.upgradableaddons) {
      if (addon.addonId === id) {
        this.selected_addondesc = addon.addonDesc;
      }
    }
    this.api_loading1 = false;
    // this.selected_addondesc = obj.addonDesc;
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
