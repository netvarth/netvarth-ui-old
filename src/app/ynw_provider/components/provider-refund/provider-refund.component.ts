import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {projectConstants} from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-refund',
  templateUrl: './provider-refund.component.html'
})
export class ProviderRefundComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;

  obtainedaddons = false;
  upgradableaddons: any = [];
  selected_addon = '';
  selected_addondesc = '';

  file_error_msg = '';
  constructor(
    public dialogRef: MatDialogRef<ProviderRefundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
       // console.log(data);
     }

  ngOnInit() {

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

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

}
