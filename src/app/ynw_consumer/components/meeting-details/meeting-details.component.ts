import { Component, OnInit, Inject } from '@angular/core';
import { SharedServices } from '../../../shared/services/shared-services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { projectConstants } from '../../../app.component';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html'
})
export class MeetingDetailsComponent implements OnInit {
  iconClass: string;
  showJaldeeVideo = false;
  meetingLink: any;

  constructor(private shared_services: SharedServices,
    public dialogRef: MatDialogRef<MeetingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  meetingDetails: any = [];
  ngOnInit() {
  console.log(this.data);
    if (this.data.details.service.serviceType === 'virtualService') {
      switch (this.data.details.service.virtualCallingModes[0].callingMode) {
        case 'Zoom': {
          this.iconClass = 'fa zoom-icon';
          break;
        }
        case 'GoogleMeet': {
          this.iconClass = 'fa meet-icon';
          break;
        }
        case 'WhatsApp': {
          if (this.data.details.service.virtualServiceType === 'audioService') {
            this.iconClass = 'fa wtsapaud-icon';
          } else {
            this.iconClass = 'fa wtsapvid-icon';
          }
          break;
        }
        case 'Phone': {
          this.iconClass = 'fa phon-icon';
          break;
        }
      }
    }
    if (this.data.type === 'appt') {
      this.getApptMeetingDetails();
    } else {
      this.getWaitlistMeetingDetails();
    }
  }
  getWaitlistMeetingDetails() {
    this.shared_services.getConsumerWaitlistMeetingDetails(this.data.details.ynwUuid, this.data.details.service.virtualCallingModes[0].callingMode, this.data.details.providerAccount.id).subscribe(data => {
      this.meetingDetails = data;
    });
  }
  getApptMeetingDetails() {
    this.shared_services.getConsumerApptMeetingDetails(this.data.details.uid, this.data.details.service.virtualCallingModes[0].callingMode, this.data.details.providerAccount.id).subscribe(data => {
      this.meetingDetails = data;
      console.log(this.meetingDetails);
      if (Object.keys(this.meetingDetails).length === 0) {
        this.shared_services.getVideoIdForService(this.data.details.uid, 'consumer').subscribe(
          (videoId) => {
            this.meetingLink = projectConstants.PATH + 'video/' + videoId;
            console.log(this.meetingLink);
            this.showJaldeeVideo = true;
          }
        );
      }
    });
  }
}
