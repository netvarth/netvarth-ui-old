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
    if (!this.data.status) {
      if (this.data.source === 'checkin') {
        this.message = 'Check-in is disabled in your settings';
      } else {
        this.message = 'Appointment is disabled in your settings';
      }
    } else {
      this.message = 'missing required fields';
    }
  }
}
