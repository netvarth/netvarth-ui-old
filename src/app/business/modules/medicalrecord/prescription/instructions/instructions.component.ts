import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html'
})
export class InstructionsComponent implements OnInit {
  locationMessage: any;
  constructor(
    public dialogRef: MatDialogRef<InstructionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  ngOnInit() {
    this.locationMessage = this.data.instructions;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
