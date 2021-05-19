import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { AddInboxMessagesComponent } from '../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MeetingDetailsComponent } from '../../meeting-details/meeting-details.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { SubSink } from 'subsink';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.css']
})
export class ActionPopupComponent implements OnInit {
  bookingDetails: any;
  type: string;
  addnotedialogRef: any;
  showapptCancel = false;
  showcheckinCancel = false;
  showRescheduleAppt = false;
  showapptMeet = false;
  showcheckinMeet = false;
  apptLvTrackon = false;
  apptLvTrackoff = false;
  chekinLvTrackoff = false;
  chekinLvTrackon = false;
  showRescheduleWtlist = false;
  fromOrderDetails = false;
  galleryDialog: any;
  private subs=new SubSink();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private galleryService: GalleryService,  
    private shared_services: SharedServices,
    public dialogRef: MatDialogRef<ActionPopupComponent>) { }

  ngOnInit() {
    this.bookingDetails = this.data.booking;
    console.log(this.bookingDetails);
    if (this.bookingDetails.quantity) {
      this.fromOrderDetails = true;
    } else {
    this.checkLvTrack();
    if (this.bookingDetails.apptStatus === 'Confirmed' || this.bookingDetails.apptStatus === 'Arrived') {
      this.showRescheduleAppt = true;
    }
    if (this.bookingDetails.waitlistStatus === 'checkedIn' || this.bookingDetails.waitlistStatus === 'arrived') {
      this.showRescheduleWtlist = true;
    }
    if (this.bookingDetails.waitlistStatus) {
      if (this.bookingDetails.service.serviceType === 'virtualService' && this.bookingDetails.waitlistStatus !== 'done'
        && this.bookingDetails.waitlistStatus !== 'cancelled') {
        this.showcheckinMeet = true;
      }
    } else {
      if (this.bookingDetails.service.serviceType === 'virtualService' && this.bookingDetails.apptStatus !== 'Completed'
        && this.bookingDetails.apptStatus !== 'Cancelled') {
        this.showapptMeet = true;
      }
    }
    if (this.bookingDetails.apptStatus === 'Confirmed' || this.bookingDetails.apptStatus === 'Arrived' || this.bookingDetails.apptStatus === 'prepaymentPending') {
      this.showapptCancel = true;
      this.showcheckinCancel = false;
    } else if (this.bookingDetails.waitlistStatus === 'checkedIn' || this.bookingDetails.waitlistStatus === 'arrived' || this.bookingDetails.waitlistStatus === 'prepaymentPending') {
      this.showcheckinCancel = true;
      this.showapptCancel = false;
    }
    }

    this.subs.sink = this.galleryService.getMessage().subscribe(input => {
      console.log(input);
      if (input && input.accountId && input.uuid && input.type === 'appt') {
        console.log(input);
        this.shared_services.addConsumerAppointmentAttachment(input.accountId ,input.uuid ,input.value)
              .subscribe(
                  () => {                      
                      this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                      this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                  },
                  error => {
                      this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                      this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
                  }
              );
       }  else {
          console.log(input);
          if (input && input.accountId && input.uuid && input.type === 'checkin') {
          this.shared_services.addConsumerWaitlistAttachment(input.accountId ,input.uuid ,input.value)
                .subscribe(
                    () => {                      
                        this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                        this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                    },
                    error => {
                        this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                        this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
                    }
                );
              }
        } 
  });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  gotoAptmtReschedule() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: this.bookingDetails.uid,
        type: 'reschedule',
        account_id: this.bookingDetails.providerAccount.id,
        unique_id: this.bookingDetails.providerAccount.uniqueId
      }
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
    this.dialogRef.close();
  }

  doCancelWaitlist() {
    if (this.bookingDetails.appointmentEncId) {
      this.type = 'appointment';
    } else {
      this.type = 'checkin';
    }
    this.shared_functions.doCancelWaitlist(this.bookingDetails, this.type, this)
      .then(
        data => {
          if (data === 'reloadlist' && this.type === 'checkin') {
            this.router.navigate(['consumer']);
            this.dialogRef.close();
          } else if (data === 'reloadlist' && this.type === 'appointment') {
            this.router.navigate(['consumer']);
            this.dialogRef.close();
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  addWaitlistMessage() {
    const pass_ob = {};
    if (this.bookingDetails.appointmentEncId) {
      this.type = 'appt';
    } else {
      this.type = 'checkin';
    }
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['user_id'] = this.bookingDetails.providerAccount.id;
    pass_ob['name'] = this.bookingDetails.providerAccount.businessName;
    pass_ob['typeOfMsg'] = 'single';
    if (this.type === 'appt') {
      pass_ob['appt'] = this.type;
      pass_ob['uuid'] = this.bookingDetails.uid;
    } else {
      pass_ob['uuid'] = this.bookingDetails.ynwUuid;
    }
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {
    this.dialogRef.close();
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }

  getMeetingDetails() {
    if (this.bookingDetails.appointmentEncId) {
      this.type = 'appt';
    } else {
      this.type = 'waitlist';
    }
    const passData = {
      'type': this.type,
      'details': this.bookingDetails
    };
    this.dialogRef.close();
    this.addnotedialogRef = this.dialog.open(MeetingDetailsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: passData
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
    });
  }

  checkLvTrack() {
    if (this.bookingDetails.appointmentEncId) {
      if ((this.bookingDetails.apptStatus === 'Confirmed' || 'prepaymentPending') && (this.bookingDetails.jaldeeApptDistanceTime && this.bookingDetails.service.livetrack && this.bookingDetails.apptStatus === 'Confirmed')) {
        this.apptLvTrackon = true;
        this.apptLvTrackoff = false;
      } else if (!this.bookingDetails.jaldeeApptDistanceTime && this.bookingDetails.service.livetrack && this.bookingDetails.apptStatus === 'Confirmed') {
        this.apptLvTrackoff = true;
        this.apptLvTrackon = false;
      }
    } else {
      if ((this.bookingDetails.waitlistStatus === 'checkedIn' || 'prepaymentPending') && (this.bookingDetails.jaldeeWaitlistDistanceTime && this.bookingDetails.service.livetrack && this.bookingDetails.waitlistStatus === 'checkedIn')) {
        this.chekinLvTrackon = true;
        this.chekinLvTrackoff = false;
      } else if (!this.bookingDetails.jaldeeWaitlistDistanceTime && this.bookingDetails.service.livetrack && this.bookingDetails.waitlistStatus === 'checkedIn') {
        this.chekinLvTrackon = false;
        this.chekinLvTrackoff = true;
      }
    }
  }

  gotoLivetrack(stat) {
    let uid;
    if (this.bookingDetails.appointmentEncId) {
      uid = this.bookingDetails.uid;
    } else {
      uid = this.bookingDetails.ynwUuid;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account_id: this.bookingDetails.providerAccount.id,
        status: stat
      }
    };
    this.dialogRef.close();
    if (this.bookingDetails.appointmentEncId) {
      this.router.navigate(['consumer', 'appointment', 'track', uid], navigationExtras);
    } else {
      this.router.navigate(['consumer', 'checkin', 'track', uid], navigationExtras);
    }

  }
  gotoWaitlistReschedule() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: this.bookingDetails.ynwUuid,
        type: 'waitlistreschedule',
        account_id: this.bookingDetails.providerAccount.id,
        unique_id: this.bookingDetails.providerAccount.uniqueId
      }
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
    this.dialogRef.close();
  }

  sendAttachment() {
    const pass_ob = {};
    if (this.bookingDetails.appointmentEncId) {
      this.type = 'appt';
    } else {
      this.type = 'checkin';
    }
    pass_ob['user_id'] = this.bookingDetails.providerAccount.id;
    if (this.type === 'appt') {
      pass_ob['type'] = this.type;
      pass_ob['uuid'] = this.bookingDetails.uid;
    } else if (this.type === 'checkin') {
      pass_ob['type'] = this.type;
      pass_ob['uuid'] = this.bookingDetails.ynwUuid;
    } 
    this.addattachment(pass_ob);
  }
  addattachment(pass_ob) {
    console.log(pass_ob);
    this.galleryDialog = this.dialog.open(GalleryImportComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-border-radius-0'],
      disableClose: true,
      data: {
         source_id: 'consumerimages',
         accountId:pass_ob.user_id,
         uid:pass_ob.uuid,
         type:pass_ob.type
      }
    });
     this.galleryDialog.afterClosed().subscribe(result => {
       console.log(result);
       this.dialogRef.close('reload');
      // this.reloadAPIs();
    });
  }

}
