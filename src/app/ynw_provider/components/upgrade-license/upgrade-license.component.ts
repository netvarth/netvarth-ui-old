import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { MessageService } from '../../services/provider-message.service';

@Component({
  selector: 'app-upgrade-license',
  templateUrl: './upgrade-license.component.html',
  // styleUrls: ['./home.component.scss']
})
export class UpgradeLicenseComponent implements OnInit {
  upgrade_lic_cap = Messages.UPGRADE_LICENSE;
  curr_lic_cap = Messages.CURRENT_PACKAGE_CAP;
  lic_pack_cap = Messages.UP_LIC_PACKAGE_CAP;
  lic_package_cap = Messages.UP_LIC_PACK_CAP;
  select_one_cap = Messages.UP_SELECT_ONE_CAP;
  no_up_pack_found_cap = Messages.UP_NO_UPGRADE_PACK_FOUND;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  current_license_pkg;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  obtainedUpgradable = false;
  upgradablepackages: any = [];
  selected_pac;
  file_error_msg = '';
  constructor(
    public dialogRef: MatDialogRef<UpgradeLicenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    public message_service: MessageService
  ) {
    // console.log(data);
  }
  ngOnInit() {
    this.createForm();
    this.getUpgradablePackages();
    this.current_license_pkg = this.data.current_license_pkg;
    // console.log(this.current_license_pkg);
  }
  getUpgradablePackages() {
    this.provider_services.getUpgradableLicensePackages()
      .subscribe(data => {
        this.upgradablepackages = data;
        this.obtainedUpgradable = true;
      });
  }
  createForm() {
    this.amForm = this.fb.group({
      license_selpackage: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit(form_data) {
    if (this.selected_pac) {
      this.provider_services.upgradeLicensePackage(this.selected_pac.pkgId)
        .subscribe(data => {
          console.log(data);
          const loginuserdata = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata['new_lic'] = this.selected_pac.displayName;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionObj.setitemonLocalStorage('ynw-user', loginuserdata);
          this.api_success = this.sharedfunctionObj.getProjectMesssages('LICENSE_UPGRADED');
          const pdata = { 'ttype': 'upgradelicence' };
          this.sharedfunctionObj.sendMessage(pdata);
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
          error => {
            this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
          }
        );
    }
  }
  licensepackage_Select(val) {
    this.selected_pac = val;
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
