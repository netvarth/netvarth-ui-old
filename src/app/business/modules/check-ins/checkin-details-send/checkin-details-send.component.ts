import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { IfStmt } from '@angular/compiler';

@Component({
    selector: 'app-checkin-details-send',
    templateUrl: './checkin-details-send.component.html'
})
export class CheckinDetailsSendComponent implements OnInit {
    uuid: any;
    check: any;
    checkin;
    deptName;
    bname;
    location;
    fname;
    lname;
    servicename;
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
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private provider_services: ProviderServices,
        private shared_functions: SharedFunctions,
        public dialogRef: MatDialogRef<CheckinDetailsSendComponent>) {
            this.customer_label = this.shared_functions.getTerminologyTerm('customer');
            this.uuid = this.data.uuid;
            this.check = this.data.check;
        }
   ngOnInit() {
    if ((this.check === 'sms') || (this.check === 'email')) {
      this.getCheckinDetails();
     } else {
    this.getApptDetails();
     }
   }
    getApptDetails() {
        this.provider_services.getAppointmentById(this.uuid)
        .subscribe(
          data => {
          this.checkin = data;
          this.bname = this.checkin.providerAccount.businessName;
          this.location = this.checkin.location.place;
          this.fname = this.checkin.appmtFor[0].firstName;
          this.lname = this.checkin.appmtFor[0].lastName;
          this.appttime = this.checkin.appmtFor[0].apptTime;
          this.appmtDate = this.checkin.appmtDate;
          this.servicename =  this.checkin.service.name;
          //   this.deptName = this.checkin.service.deptName;
          this.schedulename =  this.checkin.schedule.name;
          this.Schedulestime = this.checkin.schedule.apptSchedule.timeSlots[0].sTime ;
          this.Scheduleetime = this.checkin.schedule.apptSchedule.timeSlots[0].eTime;
          this.spfname = this.checkin.provider.firstName;
          this.splname = this.checkin.provider.lastName;
          },
        );
    }
    getCheckinDetails() {
        this.provider_services.getProviderWaitlistDetailById(this.uuid)
      .subscribe(
        data => {
          this.checkin = data;
          this.bname = this.checkin.providerAccount.businessName;
          this.location = this.checkin.queue.location.place;
          this.fname = this.checkin.waitlistingFor[0].firstName;
          this.lname = this.checkin.waitlistingFor[0].lastName;
          this.servicename =  this.checkin.service.name;
          this.deptName = this.checkin.service.deptName;
          this.qname =  this.checkin.queue.name;
          this.qstarttime = this.checkin.queue.queueStartTime;
          this.qendtime = this.checkin.queue.queueEndTime;
          this.spfname = this.checkin.provider.firstName;
          this.splname = this.checkin.provider.lastName;
        },
      );
    }
    back() {
        this.dialogRef.close();
    }
    sendMessage() {
        if (this.check === 'sms') {
        this.provider_services.smsCheckin(this.uuid).subscribe(
        () => {
            this.dialogRef.close();
            this.shared_functions.openSnackBar('Check-in details sent successfully');
        },
        error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
        );
        } else if (this.check === 'email') {
        this.provider_services.emailCheckin(this.uuid).subscribe(
            () => {
                this.dialogRef.close();
                this.shared_functions.openSnackBar('Check-in details mailed successfully');
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
            );
        } else if (this.check === 'apptsms') {
        this.provider_services.smsAppt(this.uuid).subscribe(
          () => {
            this.dialogRef.close();
            this.shared_functions.openSnackBar('Appointment details sent successfully');
          },
          error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
        } else if (this.check === 'apptemail') {
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
