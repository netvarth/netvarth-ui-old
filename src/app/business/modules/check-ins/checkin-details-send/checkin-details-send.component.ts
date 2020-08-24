import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';

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
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        public dialogRef: MatDialogRef<CheckinDetailsSendComponent>) {
            this.customer_label = this.shared_functions.getTerminologyTerm('customer');
            this.uuid = this.data.uuid;
            this.chekintype = this.data.chekintype;
        }
   ngOnInit() {
    this.getProviderSettings();
    this.SEND_MESSAGE = Messages.SEND_MESSAGE.replace('[customer]', this.customer_label);
    this.bname = this.data.qdata.providerAccount.businessName;
    if (this.chekintype === 'Waitlist') {
        this.consumer_fname = this.data.qdata.waitlistingFor[0].firstName;
        this.consumer_lname = this.data.qdata.waitlistingFor[0].lastName;
        this.consumer_email = this.data.qdata.waitlistingFor[0].email;
        this.serv_name = this.data.qdata.service.name;
        this.date = this.shared_functions.formatDateDisplay(this.data.qdata.date);
        this.time = this.data.qdata.checkInTime;
        this.deptName = this.data.qdata.service.deptName;
        this.qname =  this.data.qdata.queue.name;
        this.qstarttime = this.data.qdata.queue.queueStartTime;
        this.qendtime = this.data.qdata.queue.queueEndTime;
        this.location = this.data.qdata.queue.location.address;
        if (this.data.qdata.waitlistingFor[0].phoneNo) {
          this.phone = this.data.qdata.waitlistingFor[0].phoneNo;
        }
        // this.spfname = this.data.qdata.provider.firstName;
        // this.splname = this.data.qdata.provider.lastName;
    } else {
        this.consumer_fname = this.data.qdata.appmtFor[0].userName;
        if (this.data.qdata.consumer && this.data.qdata.consumer.userProfile && this.data.qdata.consumer.userProfile.emailVerified) {
          this.consumer_email = this.data.qdata.consumer.userProfile.emailVerified;
        }
        this.serv_name = this.data.qdata.service.name;
        this.date = this.shared_functions.formatDateDisplay(this.data.qdata.appmtDate);
        this.time = this.data.qdata.appmtTime;
        this.location = this.data.qdata.location.address;
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
    sendMessage() {
      if (this.chekintype === 'Waitlist') {
          if (this.sms === true) {
              this.provider_services.smsCheckin(this.uuid).subscribe(
              () => {
                  this.dialogRef.close();
                  this.shared_functions.openSnackBar('Check-in details sent successfully');
              },
              error => {
                  this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
              );
          }
          if (this.email === true && this.consumer_email) {
              this.provider_services.emailCheckin(this.uuid).subscribe(
                  () => {
                      this.dialogRef.close();
                      this.shared_functions.openSnackBar('Check-in details mailed successfully');
                  },
                  error => {
                      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  }
                  );
          }
        } else {
          if (this.sms === true && this.phone) {
              this.provider_services.smsAppt(this.uuid).subscribe(
                () => {
                  this.dialogRef.close();
                  this.shared_functions.openSnackBar('Appointment details sent successfully');
                },
                error => {
                  this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
              );
            }
          if (this.email === true && this.consumer_email) {
              this.provider_services.emailAppt(this.uuid).subscribe(
                () => {
                  this.dialogRef.close();
                  this.shared_functions.openSnackBar('Appointment details mailed successfully');
                },
                error => {
                  this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
              );
          }
      }
    }
  }

