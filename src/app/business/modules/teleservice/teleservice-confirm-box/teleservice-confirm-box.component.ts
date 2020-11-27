
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-teleservice-confirm-box',
  templateUrl: './teleservice-confirm-box.component.html',
  styleUrls: ['./teleservice-confirm-box.component.css']
})

export class TeleServiceConfirmBoxComponent implements OnInit {
  callingModes;
  iconClass: string;
  starting_url: any;
  serviceMode ;
  constructor(public dialogRef: MatDialogRef<TeleServiceConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.serviceMode = data.serviceDetail.virtualServiceType;
      console.log(this.serviceMode)
     }

  ngOnInit() {
    this.callingModes = this.data.app;
    if(this.data.meetingLink) {
      this.starting_url = this.data.meetingLink;
    }
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
