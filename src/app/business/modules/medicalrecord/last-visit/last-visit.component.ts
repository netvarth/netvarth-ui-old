import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-last-visit',
  templateUrl: './last-visit.component.html',
  styleUrls: ['./last-visit.component.css']
})
export class LastVisitComponent implements OnInit {
  PatientId: any;
  public lastVisit_dataSource = new MatTableDataSource<any>();
  lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'userName', 'mr_createdDate'];
  providerid: any;
  accountType: any;
  visitdetails: string;
  constructor(public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private router: Router,
    public dialogRef: MatDialogRef<LastVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.PatientId = this.data.patientId;
    console.log(this.PatientId);
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType !== 'BRANCH') {
      this.lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'mr_createdDate'];
    }
  }

  ngOnInit() {
    this.getPatientVisitList();
    // this.getproviderVisitList();
  }
  getPatientVisitList() {
    this.provider_services.getPatientVisitList(this.PatientId)
      .subscribe((data: any) => {
        this.lastVisit_dataSource = data;
        console.log(this.lastVisit_dataSource);
        this.providerid = data.providerId;
        console.log(this.providerid);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getUserName(userId) {

  }
  viewMedicalRecord(visitDetails) {
    this.visitdetails = JSON.stringify(visitDetails);
      console.log(visitDetails);
    if (visitDetails.waitlist) {
       const navigationExtras: NavigationExtras = {
      queryParams: {
        'customerDetail': JSON.stringify(visitDetails.waitlist.consumer),
        'serviceId': visitDetails.waitlist.service.id,
        'serviceName': visitDetails.waitlist.service.name,
        'booking_type': 'TOKEN',
        'booking_date':  visitDetails.waitlist.date,
        'booking_time': visitDetails.waitlist.checkInTime,
        'department': visitDetails.service.deptName,
        'consultationMode': 'OP',
        'booking_id': visitDetails.waitlist.ynwUuid,
        'mrId': visitDetails.mrId
      }
    };
    this.router.navigate(['provider', 'medicalrecord'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.appointmnet.providerConsumer),
          'serviceId': visitDetails.appointmnet.service.id,
          'serviceName': visitDetails.appointmnet.service.name,
          'department': visitDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': visitDetails.appointmnet.appmtDate,
          'booking_time': visitDetails.appointmnet.appmtTime,
          // 'mr_mode': medicalrecord_mode,
          'mrId': visitDetails.mrId,
          'booking_id': visitDetails.appointmnet.uid
        }
      };
      this.router.navigate(['provider', 'medicalrecord'], navigationExtras);

    }
  }
}
