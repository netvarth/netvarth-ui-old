import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { TeleServiceConfirmBoxComponent } from '../../teleservice/teleservice-confirm-box/teleservice-confirm-box.component';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-actions-popup',
  templateUrl: './actions-popup.component.html',
  styleUrls: ['./actions-popup.component.css']
})
export class ActionsPopupComponent implements OnInit {
  provider_label;
  active_user;
  sharedFunctions: any;
  showUndo = false;
  showArrived = false;
  showCancel = false;
  showComplete = false;
  showInProgress = false;
  showMsg = false;
  showTeleserviceStart = false;
  customer_label;
  constructor(public dialogRef: MatDialogRef<ActionsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private provider_shared_functions: ProviderSharedFuctions,
    private groupService: GroupStorageService) {
    console.log(this.data);
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(this.active_user);
  }
  ngOnInit(): void {
    if (this.data.source === 'status') {
      this.setActions();
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  assignMyself() {
    this.dialogClose();
    let msg = '';
    msg = 'Are you sure you want to assign this token to yourself ?';
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        if (this.data.bookingType == 'checkin') {
          const post_data = {
            'ynwUuid': this.data.waitlist_data.ynwUuid,
            'provider': {
              'id': this.active_user.id
            },
          };
          this.provider_services.updateUserWaitlist(post_data)
            .subscribe(
              data => {
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        } else {
          const post_data = {
            'uid': this.data.waitlist_data.uid,
            'provider': {
              'id': this.active_user.id
            },
          };
          this.provider_services.updateUserAppointment(post_data)
            .subscribe(
              data => {
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      }
    });
  }
  changeWaitlistservice() {
    this.dialogClose();
    if (this.data.bookingType == 'checkin') {
      this.router.navigate(['provider', 'check-ins', this.data.waitlist_data.ynwUuid, 'user'], { queryParams: { source: 'checkin' } });
    } else {
      this.router.navigate(['provider', 'check-ins', this.data.waitlist_data.uid, 'user'], { queryParams: { source: 'appt' } });
    }
  }
  removeProvider() {
    this.dialogClose();
    let msg = '';
    msg = 'Do you want to remove this ' + this.provider_label + '?';
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        if (this.data.bookingType == 'checkin') {
          const post_data = {
            'ynwUuid': this.data.waitlist_data.ynwUuid,
            'provider': {
              'id': this.data.waitlist_data.provider.id
            },
          };
          this.provider_services.unassignUserWaitlist(post_data)
            .subscribe(
              data => {
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        } else {
          const post_data = {
            'uid': this.data.waitlist_data.uid,
            'provider': {
              'id': this.data.waitlist_data.provider.id
            },
          };
          this.provider_services.unassignUserAppointment(post_data)
            .subscribe(
              data => {
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      }
    });
  }

  changeWaitlistStatus(action) {
    this.dialogClose();
    console.log(this.data.bookingType);
    if (this.data.bookingType == 'checkin') {
      this.provider_shared_functions.changeWaitlistStatus(this, this.data.waitlist_data, action);
    } else if (this.data.bookingType == 'appointment') {
      if (action === 'STARTED') {
        action = 'Started';
      }
      if (action === 'CANCEL') {
        action = 'Cancelled';
      }
      if (action === 'REPORT') {
        action = 'Arrived';
      }
      if (action === 'DONE') {
        action = 'Completed';
      }
      if (action === 'CHECK_IN') {
        action = 'Confirmed';
      }
      this.provider_shared_functions.changeWaitlistStatus(this, this.data.waitlist_data, action, 'appt');
    }
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    if (this.data.bookingType == 'checkin') {
      this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data, this.data.showTeleserviceStart)
        .then(
          result => {
            if (result) {
              if (this.data.showTeleserviceStart) {
                if (action === 'DONE') {
                  this.snackbarService.openSnackBar('Meeting has been ended');
                  this.sharedFunctions.sendMessage({ type: 'statuschange' });
                } else {
                  if (this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                    this.router.navigate(['meeting', 'provider', this.data.waitlist_data.ynwUuid], { replaceUrl: true });
                  } else {
                    this.sharedFunctions.sendMessage({ type: 'statuschange' });
                  }
                }
              } else {
                this.sharedFunctions.sendMessage({ type: 'statuschange' });
              }
            }
          },
          error => {
          });
    } else if (this.data.bookingType == 'appointment') {
      this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, this.data.showTeleserviceStart)
        .then(
          result => {
            if (result) {
              if (this.data.showTeleserviceStart) {
                if (action === 'Completed') {
                  this.snackbarService.openSnackBar('Meeting has been ended');
                  this.sharedFunctions.sendMessage({ type: 'statuschange' });
                } else {
                  if (this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                    this.router.navigate(['meeting', 'provider', this.data.waitlist_data.uid], { replaceUrl: true });
                  } else {
                    this.sharedFunctions.sendMessage({ type: 'statuschange' });
                  }
                }
              } else {
                this.sharedFunctions.sendMessage({ type: 'statuschange' });
              }
            }
          },
          error => {
          });
    }
  }
  setActions() {
    if (this.data.bookingType === 'checkin') {
      if (this.data.timeType !== 3 && this.data.waitlist_data.waitlistStatus !== 'done' && this.data.waitlist_data.waitlistStatus !== 'checkedIn' && this.data.waitlist_data.waitlistStatus !== 'blocked') {
        this.showUndo = true;
      }
      if (this.data.timeType === 1 && this.data.waitlist_data.waitlistStatus === 'checkedIn' && !this.data.waitlist_data.service.virtualCallingModes) {
        this.showArrived = true;
      }
      if (this.data.waitlist_data.waitlistStatus === 'arrived' || this.data.waitlist_data.waitlistStatus === 'checkedIn') {
        this.showCancel = true;
      }
      if ((this.data.waitlist_data.waitlistStatus == 'started' || this.data.waitlist_data.waitlistStatus == 'arrived' || this.data.waitlist_data.waitlistStatus == 'checkedIn') && this.data.timeType !== 2) {
        this.showComplete = true;
      }
      if ((this.data.timeType === 1 || this.data.timeType === 3) && this.data.waitlist_data.service.virtualCallingModes && (this.data.waitlist_data.waitlistStatus === 'arrived' || this.data.waitlist_data.waitlistStatus === 'checkedIn' || this.data.waitlist_data.waitlistStatus === 'started')) {
        this.showTeleserviceStart = true;
        if (this.data.is_web && this.data.waitlist_data.waitlistStatus != 'started' && this.data.waitlist_data.service.virtualCallingModes && this.data.waitlist_data.service.virtualCallingModes[0] && (this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'WhatsApp' || this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'Phone')) {
          this.showInProgress = true;
        }
      }
    } else {
      if (this.data.timeType !== 3 && this.data.waitlist_data.apptStatus !== 'Completed' && this.data.waitlist_data.apptStatus !== 'Confirmed' && this.data.waitlist_data.apptStatus !== 'blocked') {
        this.showUndo = true;
      }
      if (this.data.timeType === 1 && this.data.waitlist_data.apptStatus === 'Confirmed' && !this.data.waitlist_data.service.virtualCallingModes) {
        this.showArrived = true;
      }
      if (this.data.waitlist_data.apptStatus === 'Arrived' || this.data.waitlist_data.apptStatus === 'Confirmed') {
        this.showCancel = true;
      }
      if (this.data.waitlist_data.providerConsumer.email || this.data.waitlist_data.providerConsumer.phoneNo) {
        this.showMsg = true;
      }
      if ((this.data.waitlist_data.apptStatus == 'Started' || this.data.waitlist_data.apptStatus == 'Arrived' || this.data.waitlist_data.apptStatus == 'Confirmed') && this.data.timeType !== 2) {
        this.showComplete = true;
      }
      if ((this.data.timeType === 1 || this.data.timeType === 3) && this.data.waitlist_data.service.virtualCallingModes && (this.data.waitlist_data.apptStatus === 'Arrived' || this.data.waitlist_data.apptStatus === 'Confirmed' || this.data.waitlist_data.apptStatus === 'Started')) {
        this.showTeleserviceStart = true;
        if (this.data.is_web && this.data.waitlist_data.apptStatus != 'Started' && this.data.waitlist_data.service.virtualCallingModes && this.data.waitlist_data.service.virtualCallingModes[0] && (this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'WhatsApp' || this.data.waitlist_data.service.virtualCallingModes[0].callingMode === 'Phone')) {
          this.showInProgress = true;
        }
      }
    }
  }
  endmeeting() {
    this.dialogClose();
    let consumerName;
    if (this.data.bookingType == 'checkin') {
      consumerName = this.data.waitlist_data.waitlistingFor[0].firstName + ' ' + this.data.waitlist_data.waitlistingFor[0].lastName;
    } else {
      consumerName = this.data.waitlist_data.appmtFor[0].firstName + ' ' + this.data.waitlist_data.appmtFor[0].lastName;
    }
    const startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        message: 'Have you completed the',
        serviceDetail: this.data.waitlist_data.service,
        consumerName: consumerName,
        custmerLabel: this.customer_label,
        endmsg: 'teleserviceEnd',
        app: this.data.waitlist_data.service.virtualCallingModes[0].callingMode
      }
    });
    startTeledialogRef.afterClosed().subscribe(result => {
      if (result && result === 'completed') {
        this.changeWaitlistStatus('DONE');
      }
    });
  }
  assignteam() {
    this.dialogRef.close();
    const uid = (this.data.bookingType === 'checkin') ? this.data.waitlist_data.ynwUuid : this.data.waitlist_data.uid;
    const source = (this.data.bookingType === 'checkin') ? 'checkin' : 'appt';
    this.router.navigate(['provider', 'check-ins', uid, 'team'], { queryParams: { source: source } });
  }
}
