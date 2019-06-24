import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-add-manage-privacy',
  templateUrl: './add-manage-privacy.component.html'
})

export class AddManagePrivacyComponent implements OnInit {

  api_error = null;
  api_success = null;
  manage_privacy_caption = Messages.MANAGE_PRIVACY;
  revealph_caption = Messages.REVEAL_PHNO;
  save_btn_caption = Messages.SAVE_BTN;
  cancel_btn_caption = Messages.CANCEL_BTN;

  provider = null;

  manage_privacy_values = {
    revealPhoneNumber: false
  };

  constructor(
    public dialogRef: MatDialogRef<AddManagePrivacyComponent>,
    private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.provider = data.provider;
    this.manage_privacy_values.revealPhoneNumber = this.provider.revealPhoneNumber || null;
  }

  ngOnInit() {

  }

  providerManagePrivacy() {

    const status = this.manage_privacy_values.revealPhoneNumber || false;
    this.consumer_services.managePrivacy(this.provider.id, status)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar(Messages.Manage_Privacy);
          this.dialogRef.close({ message: 'reloadlist', data: this.manage_privacy_values });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });

  }

  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
}
