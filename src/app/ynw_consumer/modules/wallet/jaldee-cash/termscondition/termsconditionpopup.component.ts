
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-termscondition',
  templateUrl: './termsconditionpopup.component.html'
})

export class TermsconditionComponent implements OnInit {

  showError = false;
  okCancelBtn = false;
  constructor(public dialogRef: MatDialogRef<TermsconditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.type) {
    }
    if (this.data.buttons === 'okCancel') {
    }
  }

  
}
