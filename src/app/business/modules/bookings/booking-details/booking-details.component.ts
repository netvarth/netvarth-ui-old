import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../services/provider-services.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  @Input() bookingData;
  @Input() bookingType;
  @Output() refreshParent = new EventEmitter();
  bookingDate: any;
  bookingTime: any;
  bookingStatus: any;
  iconClass: any;
  bookingUid: any;
  user: any;
  users: any;
  accountType: any;
  activeUser: any;
  isUserdisable: any;
  userArr: any;
  isAppointment: any = false;
  isCheckin: any = false;
  constructor(
    private groupService: GroupStorageService,
    private providerServices: ProviderServices
  ) { }

  ngOnInit(): void {


    this.user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.accountType = this.user.accountType;
    this.activeUser = this.user.userType;
    this.getUser(this.user.id);
    console.log("bookingData", this.bookingData);

    this.checkBookingType().then((data) => {
      if (data) {
        this.bookingDate = this.isAppointment ? this.bookingData && this.bookingData.appmtDate : this.bookingData && this.bookingData.date;
        this.bookingTime = this.isAppointment ? this.bookingData && this.bookingData.appmtTime : this.bookingData && this.bookingData.checkInTime;
        this.bookingStatus = this.isAppointment ? this.bookingData && this.bookingData.apptStatus : this.bookingData && this.bookingData.waitlistStatus;
        this.bookingUid = this.isAppointment ? this.bookingData && this.bookingData.uid : this.bookingData && this.bookingData.ynwUuid;
      }
    })

    this.getIconClass();
  }


  checkBookingType() {
    return new Promise((resolve, reject) => {
      if (this.bookingType && this.bookingType == 'appointment') {
        this.isAppointment = true;
      }
      else {
        this.isCheckin = true;
      }
      resolve(true)
    })
  }


  getUser(id) {
    if (id) {
      this.providerServices.getUsers().subscribe(
        (data: any) => {
          this.users = data;
          this.userArr = this.users.filter(user => user && (user.id === id));
          if (this.userArr[0].status === "ACTIVE") {
            this.isUserdisable = true;
          } else {
            this.isUserdisable = false;
          }
        },
        error => { }
      );
    }
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


  refreshComponent(event) {
    this.refreshParent.emit();
  }

}
