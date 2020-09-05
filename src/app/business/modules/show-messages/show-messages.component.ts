import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-messages',
  templateUrl: './show-messages.component.html'
})
export class ShowMessageComponent {
  message;
  constructor(
    public dialogRef: MatDialogRef<ShowMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
