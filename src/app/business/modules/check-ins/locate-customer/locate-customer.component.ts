import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-locate-customer',
  templateUrl: './locate-customer.component.html'
})
export class LocateCustomerComponent implements OnInit {
  locationMessage: any;
  constructor(
    public dialogRef: MatDialogRef<LocateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  ngOnInit() {
    this.locationMessage = this.data.message;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
