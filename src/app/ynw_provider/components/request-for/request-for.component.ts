import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-request-for',
  templateUrl: './request-for.component.html',
  styleUrls: ['./request-for.component.css']
})
export class RequestForComponent {

  constructor(   public dialogRef: MatDialogRef<RequestForComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }


}
