import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

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
  user: any;
  users: any;
  accountType: any;
  activeUser: any;
  isUserdisable: any;
  userArr: any;
  isAppointment: any = false;
  isCheckin: any = false;
  constructor(
    private router: Router,
    private groupService: GroupStorageService,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    if (this.bookingType == 'appointment') {
      this.isAppointment = true;
    }
    else {
      this.isCheckin = true;
    }
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.accountType = this.user.accountType;
    this.activeUser = this.user.userType;
    this.getUser(this.user.id);
    console.log("bookingData", this.bookingData)
    this.bookingDate = this.isAppointment ? this.bookingData && this.bookingData.appmtDate : this.bookingData && this.bookingData.date;
    this.bookingTime = this.isAppointment ? this.bookingData && this.bookingData.appmtTime : this.bookingData && this.bookingData.checkInTime;
    this.bookingStatus = this.isAppointment ? this.bookingData && this.bookingData.apptStatus : this.bookingData && this.bookingData.waitlistStatus;
    this.bookingUid = this.isAppointment ? this.bookingData && this.bookingData.uid : this.bookingData && this.bookingData.ynwUuid;
    this.getIconClass();
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

  assignMyself() {
    let msg = "";
    msg = "Are you sure you want to assign this appointment to yourself ?";
    const dialogref = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        message: msg,
        type: "yes/no"
      }
    });
    dialogref.afterClosed().subscribe(result => {
      if (result) {
        let data = {
          provider: {
            id: this.user.id
          }
        };
        if (this.isAppointment)
          this.updateBooking(data, this.bookingType)
      }
    });
  }


  updateBooking(data, type) {
    this.providerServices.updateBooking(data, type).subscribe((data: any) => {
      console.log(data);
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      }
    );
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
    if (this.isAppointment) {
      this.router.navigate(["provider", "appointments", "appointment"], navigationExtras);
    }
    else {
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    }
  }

}
