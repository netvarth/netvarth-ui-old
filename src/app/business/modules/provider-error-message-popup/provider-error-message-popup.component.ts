import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-provider-error-message-popup',
  templateUrl: './provider-error-message-popup.component.html'
})
export class ProviderErrorMesagePopupComponent {
  message;
  constructor(
    public dialogRef: MatDialogRef<ProviderErrorMesagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.profile === 'inactive') {
      if (this.data.source === 'checkin') {
        this.message = 'Your profile is incomplete. Go to Jaldee Profile > Business profile to setup your profile. You also need to create service, queue to access your dashboard.';
      } else {
        this.message = 'Your profile is incomplete. Go to Jaldee Profile > Business profile to setup your profile. You also need to create service, schedule to access your dashboard.';
      }
    } else {
      if (this.data.source === 'checkin') {
        this.message = 'QManager is disabled in your settings';
      } else {
        this.message = 'Appointment manager is disabled in your settings';
      }
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
