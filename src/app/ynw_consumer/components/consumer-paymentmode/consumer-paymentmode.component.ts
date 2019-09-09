import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-consumer-paymentmode',
  templateUrl: './consumer-paymentmode.component.html',
  // styleUrls: ['./home.component.scss']
})
export class ConsumerPaymentmodeComponent {

    constructor(public dialogRef: MatDialogRef<ConsumerPaymentmodeComponent>,
      @Inject (MAT_DIALOG_DATA) public data: any) { }
    onClick(data) {
      this.dialogRef.close(data);
    }


  ngOnInit() {
  }
}
