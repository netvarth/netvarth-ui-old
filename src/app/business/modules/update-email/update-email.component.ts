import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html'
})
export class UpdateEmailComponent implements OnInit {
  email;
  api_error = '';
  constructor(public dialogRef: MatDialogRef<UpdateEmailComponent>,
    private provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  closeDialog() {
    if (this.email) {
      const stat = this.validateEmail(this.email);
      if (!stat) {
        this.api_error = 'Please enter a valid email';
      } else {
        const post_data = {
          'basicInfo': {
            'id': this.data.profile.basicInfo.id,
            'firstName': this.data.profile.basicInfo.firstName,
            'lastName': this.data.profile.basicInfo.lastName,
            'email': this.email
          }
        };
        this.provider_services.updateAccountEmail(post_data)
          .subscribe(
            () => {
              this.dialogRef.close(this.email);
            },
            error => {
              this.api_error = error.error;
            });
      }
    } else {
      this.api_error = 'Please enter your email.';
    }
  }
  validateEmail(mail) {
    const emailField = mail;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) === false) {
      return false;
    }
    return true;
  }
  resetError() {
    this.api_error = '';
  }
  skip() {
    this.dialogRef.close();
  }
}
