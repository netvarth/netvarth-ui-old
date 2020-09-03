
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-teleservice-confirm-box',
  templateUrl: './teleservice-confirm-box.component.html',
  styleUrls: ['./teleservice-confirm-box.component.css']
})

export class TeleServiceConfirmBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TeleServiceConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }
  amReady() {
    this.dialogRef.close('started');
  }
  endMeeting() {
    this.dialogRef.close('completed');
  }
}
