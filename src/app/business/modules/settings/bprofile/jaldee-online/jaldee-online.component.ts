import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Router } from '@angular/router';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import { QRCodeGeneratorComponent } from '../qrcodegenerator/qrcodegenerator.component';
import { MatDialog } from '@angular/material';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
@Component({
  selector: 'app-jaldeeonline',
  templateUrl: './jaldee-online.component.html'
})
export class JaldeeOnlineComponent implements OnInit {

  show_licence_warn: boolean;
  listmyprofile_status_str: string;
  jaldee_online_disabled_msg: string;
  jaldee_online_enabled_msg: string;
  custm_id: string;
  bProfile = null;
  normal_customid_show: number;

  businessConfig: ArrayBuffer;
  onlinepresence_status_str: string;
  onlinepresence_status = false;
  listmyprofile_status = false;
  normal_search_active = false;
  jaldee_online_status = false;
  jaldee_online_status_str: string;
  editMode = 3;
  public_search: boolean;
  customForm: FormGroup;
  showCustomId = false;
  licenseMetadata: any = [];
  licenseMetrics: any = [];
  is_customized = false;
  licence_warn = false;
  wndw_path = projectConstants.PATH;
  verified_level_change = Messages.VERIFIED_LEVEL_CHANGE;
  verified_level_basic = Messages.VERIFIED_LEVEL_BASIC;
  verified_level_basicplus = Messages.VERIFIED_LEVEL_BASICPLUS;
  verified_level_premium = Messages.VERIFIED_LEVEL_PREMIUM;
  customer_label = '';
  qrdialogRef: any;
  showIncompleteButton = false;
  constructor(private provider_services: ProviderServices,
    private sharedfunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public fed_service: FormMessageDisplayService,
    private fb: FormBuilder,
    private routerobj: Router,
    private dialog: MatDialog) {
      this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');

  }
  ngOnInit() {

    this.custm_id = Messages.CUSTM_ID.replace('[customer]', this.customer_label);
    this.jaldee_online_enabled_msg = Messages.JALDEE_ONLINE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_disabled_msg = Messages.JALDEE_ONLINE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.getLicensemetrics();
    this.shared_functions.getMessage().subscribe(data => {
      switch (data.ttype) {
        case 'upgradelicence':
          this.getLicensemetrics();
          break;
      }
    });
  this.getBusinessConfiguration();
  this.getJaldeeIntegrationSettings();
  this.customForm = this.fb.group({
    // customid: ['', Validators.compose([Validators.required])]
    customid: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_ALPHANUMERIC_HYPHEN)])]
  });
  }

  // learnmore_clicked(mod, e) {
  //   e.stopPropagation();
  //   this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
  // }

  copyInputMessage(valuetocopy) {
    const path = projectConstants.PATH + valuetocopy;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = path;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.shared_functions.openSnackBar('Link copied to clipboard');
  }
  copyProfileId(valuetocopy) {
    const path = valuetocopy;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = path;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.shared_functions.openSnackBar('Profile ID copied to clipboard');
  }
  qrCodegeneraterOnlineID(accEncUid) {
    this.qrdialogRef = this.dialog.open(QRCodeGeneratorComponent, {
      width: '40%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        accencUid: accEncUid,
        path: this.wndw_path
      }
    });

    this.qrdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getBusinessProfile();
      }
    });
  }
  getPublicSearch() {
    this.provider_services.getPublicSearch()
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
          this.listmyprofile_status_str = (this.public_search === true) ? 'On' : 'Off';
          this.listmyprofile_status = this.public_search;

        },
        () => {
        }
      );
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBusinessProfile();
      },
        () => {

        });
  }
  getBusinessProfile() {
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
        });
      }


    getBussinessProfileApi() {
      const _this = this;
      return new Promise(function (resolve, reject) {
        _this.provider_services.getBussinessProfile()
          .subscribe(
            data => {
              resolve(data);
            },
            () => {
              reject();
            }
          );
      });
    }
  confirm_listmyprofileStatus(e) {
    if (this.listmyprofile_status) {
      e.source.checked = true;
      this.sharedfunctionobj.confirmSearchChangeStatus(this, this.listmyprofile_status);
    } else if (!this.listmyprofile_status) {
      e.source.checked = false;
      this.handle_searchstatus();
    }
  }
  confirm_opsearchStatus(e) {
    if (this.onlinepresence_status) {
      e.source.checked = true;
      this.sharedfunctionobj.confirmOPSearchChangeStatus(this, this.onlinepresence_status);
    } else if (!this.onlinepresence_status) {
      e.source.checked = false;
      this.handle_jaldeeOnlinePresence(e);
    }
  }

  handle_searchstatus() {
    const changeTostatus = (this.listmyprofile_status === true) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe(() => {
        const status = (this.listmyprofile_status === true) ? 'disable' : 'enable';

        this.listmyprofile_status = !this.listmyprofile_status;
        this.shared_functions.openSnackBar('List my profile on Jaldee.com ' + status + 'd successfully');
        this.getPublicSearch();
      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });

      });
  }

  getJaldeeIntegrationSettings() {
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        this.onlinepresence_status = data.onlinePresence;
        this.onlinepresence_status_str = this.onlinepresence_status ? 'On' : 'Off';
        this.getPublicSearch();

      }
    );
  }
  handle_jaldeeOnlinePresence(e) {
    const is_check = this.onlinepresence_status ? 'Disable' : 'Enable';
    const data = {
      'onlinePresence': !this.onlinepresence_status
    };
    this.provider_services.setJaldeeIntegration(data)
      .subscribe(
        () => {
          this.onlinepresence_status = !this.onlinepresence_status;
          this.shared_functions.openSnackBar('Jaldee Online ' + is_check + 'd successfully');
          this.getJaldeeIntegrationSettings();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  editCustomId(customId?) {
    this.normal_customid_show = 1;
    if (customId) {
      this.editMode = 1;
      this.customForm.setValue({ 'customid': customId });
    } else {
      this.editMode = 0;
    }
  }
  customizeId() {
    if (this.licence_warn) {
      this.shared_functions.openSnackBar('  You are not allowed to do this operation. Please upgrade license package', { 'panelClass': 'snackbarerror' });
    } else {
      this.editCustomId();
    }
  }
  deleteCustomId(customId) {
    this.provider_services.removeCustomId(customId).subscribe(
      data => {
        delete this.bProfile['customId'];
        this.normal_customid_show = 2;
      });
    this.customForm.setValue({ 'customid': '' });
    this.is_customized = false;
  }
  cancelCusUpdt() {
    this.customForm.setValue({ 'customid': '' });
    if (this.editMode === 0) {
      this.normal_customid_show = 2;
    } else {
      this.normal_customid_show = 3;
    }
    this.editMode = 3;
    this.is_customized = false;
  }
  add_updateCustomId(submit_data) {
    const customId = submit_data.customid.trim();
    if (this.editMode === 0) {
      this.provider_services.addCustomId(customId).subscribe(
        data => {
          this.bProfile.customId = customId;
          this.normal_customid_show = 3;
          this.shared_functions.openSnackBar('Personalize Id added successfully');
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.normal_customid_show = 2;
          this.is_customized = false;
        });
    } else {
      this.provider_services.editCustomId(customId).subscribe(
        data => {
          this.bProfile.customId = customId;
          this.normal_customid_show = 3;
          this.shared_functions.openSnackBar('Personalize Id updated successfully');
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.normal_customid_show = 3;
        });
    }
    this.editMode = 3;
  }
  getLicensemetrics() {
    let pkgId;
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    if (user && user.accountLicenseDetails && user.accountLicenseDetails.accountLicense && user.accountLicenseDetails.accountLicense.licPkgOrAddonId) {
      pkgId = user.accountLicenseDetails.accountLicense.licPkgOrAddonId;
    }
    this.licenseMetadata = this.shared_functions.getitemfromLocalStorage('license-metadata');
    // this.provider_services.getLicenseMetadata().subscribe(data => {
    //   this.licenseMetadata = data;
    for (let i = 0; i < this.licenseMetadata.length; i++) {

      if (this.licenseMetadata[i].pkgId === pkgId) {
        for (let k = 0; k < this.licenseMetadata[i].metrics.length; k++) {
          if (this.licenseMetadata[i].metrics[k].id === 13) {
            if (this.licenseMetadata[i].metrics[k].anyTimeValue === 'true') {
              this.showCustomId = true;
              this.licence_warn = false;
              return;
            } else {
              this.showCustomId = false;
              this.licence_warn = true;
              return;
            }
          }
        }
      }
    }
    // });
  }
  redirecToBprofile() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile']);
   //  this._location.back();
     }

}
