import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../services/provider-services.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { BookingDetailsSendComponent } from '../booking-details-send/booking-details-send.component';
import { CommunicationService } from '../../../services/communication-service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { BookingActionsPopupComponent } from '../booking-actions-popup/booking-actions-popup.component';

@Component({
  selector: 'app-booking-actions',
  templateUrl: './booking-actions.component.html',
  styleUrls: ['./booking-actions.component.css']
})
export class BookingActionsComponent implements OnInit {

  @Input() bookingData;
  @Input() bookingType;
  @Output() refreshParent = new EventEmitter();
  bookingDate: any;
  bookingTime: any;
  bookingStatus: any;
  isAppointment: any = false;
  isCheckin: any = false;
  bookingUid: any;
  user: any;
  accountType: any;
  activeUser: any;
  users: any;
  userArr: any;
  isUserdisable: any;
  canAssignMyself: any;
  canAssignProvider: any;
  providerLabel: any;
  customerLabel: any;
  groups: any;
  timeType: any;
  showSendDetails: any = false;
  galleryDialog: any;
  constructor(
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private router: Router,
    private wordProcessor: WordProcessor,
    private communicationService: CommunicationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data && data.timetype) {
        this.timeType = data.timetype;
      }
    })
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.providerLabel = this.wordProcessor.getTerminologyTerm("provider");
    this.customerLabel = this.wordProcessor.getTerminologyTerm("customer");
    this.accountType = this.user.accountType;
    this.activeUser = this.user.userType;
    this.getUser(this.user.id);
    this.getUserTeams();

    this.checkBookingType().then((data) => {
      if (data) {
        this.bookingDate = this.isAppointment ? this.bookingData && this.bookingData.appmtDate : this.bookingData && this.bookingData.date;
        this.bookingTime = this.isAppointment ? this.bookingData && this.bookingData.appmtTime : this.bookingData && this.bookingData.checkInTime;
        this.bookingStatus = this.isAppointment ? this.bookingData && this.bookingData.apptStatus : this.bookingData && this.bookingData.waitlistStatus;
        this.bookingUid = this.isAppointment ? this.bookingData && this.bookingData.uid : this.bookingData && this.bookingData.ynwUuid;
        this.canAssignProvider = !this.bookingData.multiSelection && this.accountType == 'BRANCH' && (this.bookingStatus === 'Arrived' || this.bookingStatus === 'Confirmed');
        if (this.bookingStatus !== "Cancelled" && this.bookingStatus !== "Rejected" && this.bookingData.providerConsumer &&
          (this.bookingData.providerConsumer.email || (this.bookingData.providerConsumer.phoneNo && this.bookingData.providerConsumer.phoneNo.trim() !== ""))) {
          this.showSendDetails = true;
        }
      }
    })


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
        if (this.isAppointment) {
          data['uid'] = this.bookingUid;
        }
        else {
          data['ynwUuid'] = this.bookingUid;
        }
        this.updateBooking(data, this.bookingType)
      }
    });
  }


  updateBooking(data, type) {
    this.providerServices.updateBooking(data, type).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Appointment Assigned Successfully");
        this.refreshParent.emit();
      }
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      }
    );
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


  followUpClicked() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: "followup",
        followup_uuid: this.bookingUid,
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

  changeWaitlistservice() {
    this.router.navigate(["provider", "check-ins", this.bookingUid, "user"], {
      queryParams: { source: "appt" }
    });
  }


  removeProvider() {
    let msg = "";
    msg = `Do you want to remove this ${this.providerLabel}?`;
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        message: msg,
        type: "yes/no"
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        let data = {
          provider: {
            id: this.bookingData.provider.id
          }
        };
        if (this.isAppointment) {
          data['uid'] = this.bookingUid;
        }
        else {
          data['ynwUuid'] = this.bookingUid;
        }
        this.unassignUserForBooking(data, this.bookingType)
      }
    });
  }

  getUserTeams() {
    this.providerServices.getTeamGroup().subscribe((data: any) => {
      this.groups = data;
    });
  }

  assignteam() {
    this.router.navigate(["provider", "check-ins", this.bookingUid, "team"], {
      queryParams: { source: "appt" }
    });
  }


  unassignUserForBooking(data, type) {
    this.providerServices.unassignUserForBooking(data, type).subscribe(
      (data: any) => {
        this.snackbarService.openSnackBar("Appointment Unassigned Successfully");
        this.refreshParent.emit();
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      }
    );
  }


  removeTeam() {
    let msg = "";
    msg = "Do you want to remove the team ?";
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        message: msg,
        type: "yes/no"
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        let data = {
          teamId: this.bookingData.teamId
        };
        if (this.isAppointment) {
          data['uid'] = this.bookingUid;
        }
        else {
          data['ynwUuid'] = this.bookingUid;
        }
        this.unassignTeamForBooking(data, this.bookingType)
      }
    });
  }

  unassignTeamForBooking(data, type) {
    this.providerServices.unassignTeamForBooking(data, type).subscribe(
      (data: any) => {
        this.snackbarService.openSnackBar("Team unassigned successfully");
        this.refreshParent.emit();
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      }
    );
  }

  rescheduleActionClicked() {

  }

  shareBookingInfo() {
    console.log("booking info share")
    const smsdialogRef = this.dialog.open(BookingDetailsSendComponent, {
      width: "50%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        qdata: this.bookingData,
        uuid: this.bookingUid,
        chekintype: this.bookingType
      }
    });
    smsdialogRef.afterClosed().subscribe(result => { });
  }


  printBooking() {
    if (this.isAppointment) {
      this.router.navigate(["provider", "appointments", this.bookingData.uid, "print"], { queryParams: { bookingType: "appt" } });
    }
    else if (this.isCheckin) {
      this.router.navigate(['provider', 'check-ins', this.bookingData.ynwUuid, 'print'], { queryParams: { bookingType: 'checkin' } });
    }
  }

  gotoCustomerDetails() {
    let customerId = this.isAppointment ? this.bookingData.appmtFor[0].id : this.bookingData.waitlistingFor[0].id;
    this.router.navigate(['/provider/customers/' + customerId]);
  }

  addConsumerInboxMessage() {
    let checkin = [];
    if (this.bookingData.multiSelection) {
      checkin = this.bookingData;
    } else {
      checkin.push(this.bookingData);
    }
    let bookingType = this.isAppointment ? "appt" : "checkin";
    this.communicationService.addConsumerInboxMessage(checkin, this, bookingType)
      .then(
        () => { },
        () => { }
      );
  }


  sendAttachments() {
    this.galleryDialog = this.dialog.open(GalleryImportComponent, {
      width: "50%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        source_id: "attachment",
        uid: this.bookingUid
      }
    });
    this.galleryDialog.afterClosed().subscribe(result => {
      this.refreshParent.emit();
    });
  }


  viewBillPage() {
    let bookingSource = this.isAppointment ? "appt" : "checkin";
    this.providerServices.getWaitlistBill(this.bookingUid).subscribe(
      (data: any) => {
        this.router.navigate(["provider", "bill", this.bookingUid], {
          queryParams: { source: bookingSource, timetype: this.timeType }
        });
      },
      error => {
        this.snackbarService.openSnackBar(error, { panelClass: "snackbarerror" });
      }
    );
  }


  addPrivateNotes() {
    let bookingSource = this.isAppointment ? "appt" : "checkin";
    const addnotedialogRef = this.dialog.open(BookingActionsPopupComponent,
      {
        width: "50%",
        panelClass: ["popup-class", "commonpopupmainclass"],
        disableClose: true,
        data: {
          bookingUid: this.bookingUid,
          source: bookingSource,
          type: "privateNotes"
        }
      }
    );
    addnotedialogRef.afterClosed().subscribe(result => {
      this.refreshParent.emit();
    });
  }


  showLabels() {
    let bookingSource = this.isAppointment ? "appt" : "checkin";
    const addnotedialogRef = this.dialog.open(BookingActionsPopupComponent,
      {
        width: "50%",
        panelClass: ["popup-class", "commonpopupmainclass"],
        disableClose: true,
        data: {
          bookingUid: this.bookingUid,
          source: bookingSource,
          type: "Labels"
        }
      }
    );
    addnotedialogRef.afterClosed().subscribe(result => {
      this.refreshParent.emit();
    });
  }

}
