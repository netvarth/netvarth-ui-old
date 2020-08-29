import { Component, OnInit, Inject } from '@angular/core';
import { SharedServices } from '../../../shared/services/shared-services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html'
})
export class MeetingDetailsComponent implements OnInit {

  constructor(private shared_services: SharedServices,
    public dialogRef: MatDialogRef<MeetingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  meetingDetails: any = [];
  ngOnInit() {
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
    });
  }
}
