import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-provider-start-tour',
  templateUrl: './provider-start-tour.component.html'
})
export class ProviderStartTourComponent {

  constructor(
    public dialogRef: MatDialogRef<ProviderStartTourComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(value): void {
    this.dialogRef.close(value);
  }

}
