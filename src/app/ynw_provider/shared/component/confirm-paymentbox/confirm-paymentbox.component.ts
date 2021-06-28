import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-paymentbox',
  templateUrl: './confirm-paymentbox.component.html',
  styleUrls: ['./confirm-paymentbox.component.css']
})


export class ConfirmPaymentBoxComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmPaymentBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }

}

