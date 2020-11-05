import { Component, OnInit, Inject } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../../shared//pipes/date-format/date-format.pipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
// import { MedicalrecordService } from '../medicalrecord.service';

@Component({
  selector: 'app-last-visit',
  templateUrl: './last-visit.component.html',
  styleUrls: ['./last-visit.component.css']
})
export class LastVisitComponent implements OnInit {
  display_PatientId: any;
  PatientId: any;
  public lastVisit_dataSource = new MatTableDataSource<any>([]);
  lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'userName', 'mr', 'rx'];
  providerid: any;
  accountType: any;
  visitdetails: string;
  customerDetails: any;
  loading = true;
  visitcount: any;
  back_type: any;
  selectedRowIndex = -1;
  constructor(public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private router: Router,

    public dateformat: DateFormatPipe,
    // private medicalrecordService: MedicalrecordService,
    public dialogRef: MatDialogRef<LastVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.PatientId = this.data.patientId;
    if (this.data.back_type) {
      this.back_type = this.data.back_type;
      console.log(this.back_type);
    }
    if (this.data.customerDetail) {
      this.customerDetails = this.data.customerDetail;
      if (this.customerDetails.memberJaldeeId) {
        this.display_PatientId = this.customerDetails.memberJaldeeId;
      } else if (this.customerDetails.jaldeeId) {
        this.display_PatientId = this.customerDetails.jaldeeId;
      }
    }
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType !== 'BRANCH') {
      this.lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'mr', 'rx'];
    }
    // tslint:disable-next-line: no-shadowed-variable
    // this.medicalrecordService.patient_data.subscribe(data => {
    //   this.customerDetails = JSON.parse(data.customerDetail);
    //   if (this.customerDetails.memberJaldeeId) {
    //     this.display_PatientId = this.customerDetails.memberJaldeeId;
    //   } else if (this.customerDetails.jaldeeId) {
    //     this.display_PatientId = this.customerDetails.jaldeeId;
    //   }
    // });
  }

  ngOnInit() {
    this.getPatientVisitList();
    this.getPatientVisitListCount();
    // this.getproviderVisitList();
  }
  getPatientVisitListCount() {
    this.provider_services.getPatientVisitListCount(this.PatientId)
      .subscribe((data: any) => {
        this.visitcount = data;
        console.log(this.visitcount);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getPatientVisitList() {
    this.provider_services.getPatientVisitList(this.PatientId)
      .subscribe((data: any) => {
        this.lastVisit_dataSource = data;
        console.log(this.lastVisit_dataSource);
        this.loading = false;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

  getLastVisitDate(visit) {
    let visitdate = '';
    if (visit.waitlist) {
      visitdate = visit.waitlist.consLastVisitedDate;
    } else if (visit.appointmnet) {
      visitdate = visit.appointmnet.consLastVisitedDate;
    } else {
      visitdate = visit.consLastVisitedDate;
    }
    return visitdate;
  }
  isMRCreated(visit) {
    let mrCreated = false;
    if (visit.waitlist) {
      mrCreated = visit.mrCreated;
    } else if (visit.appointmnet) {
      mrCreated = visit.mrCreated;
    }
    return mrCreated;

  }
  isRxCreated(visit) {
    let rxCreated = false;
    if (visit.waitlist) {
      rxCreated = visit.waitlist.prescriptionCreated;
    } else if (visit.appointmnet) {
      rxCreated = visit.appointmnet.prescriptionCreated;
    }
    return rxCreated;

  }
  getServiceName(visit) {
    let serviceName = 'Consultation';
    if (visit.waitlist) {
      serviceName = visit.waitlist.service.name;
    } else if (visit.appointmnet) {
      serviceName = visit.appointmnet.service.name;
    }
    return serviceName;

  }
  getMedicalRecord(visitDetails) {
    // this.selectedRowIndex = visitDetails.mrId;

    if (visitDetails.waitlist) {
      let mrId = 0;
      if (visitDetails.waitlist.mrId) {
        mrId = visitDetails.waitlist.mrId;
      }

      const customerDetails = visitDetails.waitlist.waitlistingFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.waitlist.ynwUuid;
       const bookingType = 'TOKEN';
       this.dialogRef.close();

       this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);

    } else if (visitDetails.appointmnet) {

      let mrId = 0;
      if (visitDetails.appointmnet.mrId) {
        mrId = visitDetails.appointmnet.mrId;
      }

      const customerDetails = visitDetails.appointmnet.appmtFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.appointmnet.uid;
       const bookingType = 'APPT';
       this.dialogRef.close();
       this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);


    } else {

      const mrId = visitDetails.mrId;
      const customerDetails = visitDetails[0];
      const customerId = customerDetails.id;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      this.dialogRef.close();
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);
    }

  }

}
