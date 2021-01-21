import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-displaylabel',
  templateUrl: './displaylabel.component.html'
})
export class DisplaylabelpopupComponent implements OnInit {
  order: any = [];
  displayLabels: any= [];
  constructor(
    public dialogRef: MatDialogRef<DisplaylabelpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.order = this.data;
    console.log(this.order);
    Object.keys(this.order.label).forEach(key => {
      this.displayLabels.push(key);
    });
  }
  ngOnInit() {
    //this.locationMessage = this.medicine.instructions;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
