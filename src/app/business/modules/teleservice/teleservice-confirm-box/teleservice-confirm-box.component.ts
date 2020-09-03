
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-teleservice-confirm-box',
  templateUrl: './teleservice-confirm-box.component.html',
  styleUrls: ['./teleservice-confirm-box.component.css']
})

export class TeleServiceConfirmBoxComponent implements OnInit {

  iconClass: string;
  constructor(public dialogRef: MatDialogRef<TeleServiceConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    switch (this.data.app) {
      case 'Zoom': {
        this.iconClass = 'fa zoom-icon';
        break;
      }
      case 'GoogleMeet': {
        this.iconClass = 'fa meet-icon';
        break;
      }
      case 'WhatsApp': {
        this.iconClass = 'a fa-whatsapp fa-lg whtsap-ic';
        break;
      }
      case 'Phone': {
        this.iconClass = 'fa fa-mobile';
        break;
      }
    }
  }
  amReady() {
    this.dialogRef.close('started');
  }
  endMeeting() {
    this.dialogRef.close('completed');
  }
}
