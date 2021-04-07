import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { MatDialog } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

@Component({
    selector: 'app-checkin-details-send',
    templateUrl: './checkin-details-send.component.html'
})
export class CheckinDetailsSendComponent implements OnInit {
    uuid: any;
    checkin;
    deptName;
    bname;
    location;
    customer_label: any;
    qname: any;
    tokenno: any;
    qstarttime: any;
    qendtime: any;
    schedulename: any;
    appttime: any;
    appmtDate: any;
    spfname: any;
    splname: any;
    Schedulestime: any;
    Scheduleetime: any;
    sms = true;
    email = true;
    chekintype: any;
    consumer_fname: any;
    consumer_lname: any;
    serv_name: any;
    date: string;
    time: any;
    consumer_email: any;
    api_loading = false;
    phone: any;
    SEND_MESSAGE = '';
    settings: any = [];
    showToken = false;
    iconClass: string;
    smsCredits;
    smsWarnMsg: string;
    is_smsLow = false;
    corpSettings: any;
    addondialogRef: any;
    is_noSMS = false;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    api_error = null;
    api_success = null;
  patientid: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private provider_services: ProviderServices,
        private provider_servicesobj: ProviderServices,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private dateTimeProcessor: DateTimeProcessor,
        public dialogRef: MatDialogRef<CheckinDetailsSendComponent>) {
            this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
            this.uuid = this.data.uuid;
            this.chekintype = this.data.chekintype;
        }
   ngOnInit() {
     console.log('checkindetail send');
    this.getSMSCredits();
    this.getProviderSettings();
    this.SEND_MESSAGE = Messages.SEND_MESSAGE.replace('[customer]', this.customer_label);
    this.bname = this.data.qdata.providerAccount.businessName;
    console.log(this.data.qdata);
    if (this.data.qdata.service.serviceType === 'virtualService') {
      switch (this.data.qdata.service.virtualCallingModes[0].callingMode) {
        case 'Zoom': {
          this.iconClass = 'fa zoom-icon';
          break;
        }
        case 'GoogleMeet': {
          this.iconClass = 'fa meet-icon';
          break;
        }
        case 'WhatsApp': {
          if (this.data.qdata.service.virtualServiceType === 'audioService') {
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
    if (this.chekintype === 'Waitlist') {
        this.consumer_fname = this.data.qdata.waitlistingFor[0].firstName;
        this.consumer_lname = this.data.qdata.waitlistingFor[0].lastName;
        this.consumer_email = this.data.qdata.waitlistingFor[0].email;
        this.serv_name = this.data.qdata.service.name;
        this.date = this.data.qdata.date;
        console.log(this.date)
        // this.date = this.shared_functions.formatDateDisplay(this.data.qdata.date);
        console.log(this.date)
        this.time = this.data.qdata.checkInTime;
        this.deptName = this.data.qdata.service.deptName;
        this.qname =  this.data.qdata.queue.name;
        this.tokenno = this.data.qdata.token;
        this.qstarttime = this.data.qdata.queue.queueStartTime;
        this.qendtime = this.data.qdata.queue.queueEndTime;

        this.location = this.data.qdata.queue.location.place;
        if (this.data.qdata.waitlistingFor[0].phoneNo) {
          this.phone = this.data.qdata.waitlistingFor[0].phoneNo;
        }
        // this.spfname = this.data.qdata.provider.firstName;
        // this.splname = this.data.qdata.provider.lastName;
    } else {
        this.consumer_fname = this.data.qdata.appmtFor[0].firstName + ' ' + this.data.qdata.appmtFor[0].lastName;
        if (this.data.qdata.consumer && this.data.qdata.consumer.userProfile && this.data.qdata.consumer.userProfile.emailVerified) {
          this.consumer_email = this.data.qdata.consumer.userProfile.emailVerified;
        }
        this.serv_name = this.data.qdata.service.name;
        this.date = this.data.qdata.appmtDate;
        console.log(this.date)
        // this.date = this.shared_functions.formatDateDisplay(this.data.qdata.appmtDate);
        this.time = this.data.qdata.appmtTime;
        this.location = this.data.qdata.location.place;
        this.appttime = this.data.qdata.appmtFor[0].apptTime;
        this.appmtDate = this.data.qdata.appmtDate;
        this.schedulename =  this.data.qdata.schedule.name;
        this.Schedulestime = this.data.qdata.schedule.apptSchedule.timeSlots[0].sTime ;
        this.Scheduleetime = this.data.qdata.schedule.apptSchedule.timeSlots[0].eTime;
        if (this.data.qdata.providerConsumer.phoneNo) {
         this.phone = this.data.qdata.providerConsumer.phoneNo;
        }
        if (this.data.qdata.providerConsumer.email) {
          this.consumer_email = this.data.qdata.providerConsumer.email;
        }
        if(this.data.qdata.appmtFor[0].memberJaldeeId){
          this.patientid = this.data.qdata.appmtFor[0].memberJaldeeId;
        }
        // this.spfname = this.data.qdata.provider.firstName;
        // this.splname = this.data.qdata.provider.lastName;
    }
   }
   getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        }, () => {
      });
  }
    back() {
        this.dialogRef.close();
    }
    getSingleTime(slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    sendMessage() {
      if(this.sms === false && (this.email === true && !this.consumer_email)){
        this.api_error = 'share message via options are not selected';
        return;
      }
      if (this.chekintype === 'Waitlist') {
          if (this.sms === true) {
              this.provider_services.smsCheckin(this.uuid).subscribe(
              () => {
                  this.dialogRef.close();
                  if (this.showToken) {
                    this.snackbarService.openSnackBar('Token details sent successfully');
                  } else {
                  this.snackbarService.openSnackBar('Check-in details sent successfully');
                  }
              },
              error => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
              );
          }
          if (this.email === true && this.consumer_email) {
              this.provider_services.emailCheckin(this.uuid).subscribe(
                  () => {
                      this.dialogRef.close();
                      if (this.showToken) {
                        this.snackbarService.openSnackBar('Token details mailed successfully');
                      } else {
                      this.snackbarService.openSnackBar('Check-in details mailed successfully');
                      }
                  },
                  error => {
                      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  }
                  );
          }
        } else {
          if (this.sms === true && this.phone) {
              this.provider_services.smsAppt(this.uuid).subscribe(
                () => {
                  this.dialogRef.close();
                  this.snackbarService.openSnackBar('Appointment details sent successfully');
                },
                error => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
              );
            }
          if (this.email === true && this.consumer_email) {
              this.provider_services.emailAppt(this.uuid).subscribe(
                () => {
                  this.dialogRef.close();
                  this.snackbarService.openSnackBar('Appointment details mailed successfully');
                },
                error => {
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
              );
          }
      }
    }

    getSMSCredits() {
      this.provider_services.getSMSCredits().subscribe(data => {
          this.smsCredits = data;
          if (this.smsCredits < 5 && this.smsCredits > 0) {
            this.is_smsLow = true;
            this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
            this.getLicenseCorpSettings();
          } else if (this.smsCredits === 0) {
            this.is_smsLow = true;
            this.is_noSMS = true;
            this.smsWarnMsg = Messages.NO_SMS_CREDIT;
            this.getLicenseCorpSettings();
          } else {
            this.is_smsLow = false;
            this.is_noSMS = false;
          }
      });
    }
    getLicenseCorpSettings() {
      this.provider_servicesobj.getLicenseCorpSettings().subscribe(
          (data: any) => {
              this.corpSettings = data;
          }
      );
  }
    gotoSmsAddon() {
      this.dialogRef.close();
      if (this.corpSettings && this.corpSettings.isCentralised) {
        this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
        this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
            width: '50%',
            data: {
                type: 'addons'
            },
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true
        });
        this.addondialogRef.afterClosed().subscribe(result => {
          if (result) {
           this.getSMSCredits();
          }
        });
    }
    }
  }

