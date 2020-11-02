import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html'
})
export class InstructionsComponent implements OnInit {
  medicine: any;
  locationMessage: any;
  constructor(
    public dialogRef: MatDialogRef<InstructionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.medicine = this.data;
  }
  ngOnInit() {
    this.locationMessage = this.medicine.instructions;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
