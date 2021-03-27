import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SharedServices } from '../../../shared/services/shared-services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html'
})
export class MeetingDetailsComponent implements OnInit,OnDestroy {

  iconClass: string;
  showJaldeeVideo = false;

  constructor(private shared_services: SharedServices,
    public dialogRef: MatDialogRef<MeetingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  meetingDetails: any = [];
  private subs=new SubSink();
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
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }
  getWaitlistMeetingDetails() {
   this.subs.sink= this.shared_services.getConsumerWaitlistMeetingDetails(this.data.details.ynwUuid, this.data.details.service.virtualCallingModes[0].callingMode, this.data.details.providerAccount.id).subscribe(data => {
      this.meetingDetails = data;
    });
  }
  getApptMeetingDetails() {
    this.subs.sink=this.shared_services.getConsumerApptMeetingDetails(this.data.details.uid, this.data.details.service.virtualCallingModes[0].callingMode, this.data.details.providerAccount.id).subscribe(data => {
      this.meetingDetails = data;
    });
  }
}
