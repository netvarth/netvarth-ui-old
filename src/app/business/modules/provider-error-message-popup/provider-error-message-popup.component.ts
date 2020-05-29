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
      this.message = 'Your profile is incomplete. Go to Jaldee Online > Business profile to setup your profile.';
    } else {
      if (this.data.source === 'checkin') {
        this.message = 'Check-in is disabled in your settings';
      } else {
        this.message = 'Appointment is disabled in your settings';
      }
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
