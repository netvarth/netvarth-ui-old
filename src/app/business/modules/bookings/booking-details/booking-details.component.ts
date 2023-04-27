import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  @Input() bookingData;
  @Input() bookingType;
  bookingDate: any;
  bookingTime: any;
  bookingStatus: any;
  iconClass: any;
  bookingUid: any;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log("bookingData", this.bookingData)
    this.bookingDate = this.bookingType == 'appointment' ? this.bookingData && this.bookingData.appmtDate : this.bookingData && this.bookingData.date;
    this.bookingTime = this.bookingType == 'appointment' ? this.bookingData && this.bookingData.appmtTime : this.bookingData && this.bookingData.checkInTime;
    this.bookingStatus = this.bookingType == 'appointment' ? this.bookingData && this.bookingData.apptStatus : this.bookingData && this.bookingData.waitlistStatus;
    this.bookingUid = this.bookingType == 'appointment' ? this.bookingData && this.bookingData.uid : this.bookingData && this.bookingData.ynwUuid;
    this.getIconClass()
  }



  getIconClass() {
    if (this.bookingData.service.serviceType === "virtualService") {
      switch (
      this.bookingData.service.virtualCallingModes[0].callingMode
      ) {
        case "Zoom": {
          this.iconClass = "fa zoom-icon";
          break;
        }
        case "VideoCall": {
          this.iconClass = "fa jvideo-icon jvideo-icon-s jvideo-icon-mgm5";
          break;
        }
        case "GoogleMeet": {
          this.iconClass = "fa meet-icon";
          break;
        }
        case "WhatsApp": {
          if (
            this.bookingData.service.virtualServiceType === "audioService"
          ) {
            this.iconClass = "fa wtsapaud-icon";
          } else {
            this.iconClass = "fa wtsapvid-icon";
          }
          break;
        }
        case "Phone": {
          this.iconClass = "fa phon-icon";
          break;
        }
      }
    }
  }


  followUpClicked() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: "followup",
        followup_uuid: this.bookingData.uid,
        date: this.bookingDate
      }
    };
    this.router.navigate(["provider", "appointments", "appointment"], navigationExtras);
  }

}
