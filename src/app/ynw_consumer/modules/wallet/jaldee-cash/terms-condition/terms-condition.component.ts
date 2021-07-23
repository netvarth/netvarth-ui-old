
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-termscondition',
  templateUrl: './terms-condition.component.html'
})

export class TermsConditionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.type) {
    }
    if (this.data.buttons === 'okCancel') {
    }
  }
  close(){
    this.dialogRef.close();  
  }
}
