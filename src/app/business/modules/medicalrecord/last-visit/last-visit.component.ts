import { Component, OnInit, Inject } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { NavigationExtras } from '@angular/router';
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
    this.selectedRowIndex = visitDetails.mrId;

    if (visitDetails.waitlist) {
      let providerId ;
      if (visitDetails.waitlist.provider && visitDetails.waitlist.provider.id) {
       providerId = visitDetails.waitlist.provider.id;
      } else {
        providerId = '';
      }
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.waitlist.waitlistingFor[0]),
          'serviceId': visitDetails.waitlist.service.id,
          'serviceName': visitDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': visitDetails.waitlist.consLastVisitedDate,
          'booking_time': visitDetails.waitlist.checkInTime,
          'department': visitDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': visitDetails.waitlist.ynwUuid,
          'mrId': visitDetails.mrId,
          'visitDate': visitDetails.waitlist.consLastVisitedDate,
          'back_type': this.back_type,
          'provider_id': providerId
        }
      };
      console.log(navigationExtras);
      const result = {
        'navigationParams': navigationExtras,
        'type': 'clinicalnotes'
      };
      this.dialogRef.close(result);

    } else if (visitDetails.appointmnet) {
      let providerId ;
      if (visitDetails.appointmnet.provider && visitDetails.appointmnet.provider.id) {
       providerId = visitDetails.appointmnet.provider.id;
      } else {
        providerId = '';
      }

      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.appointmnet.appmtFor[0]),
          // 'customerDetail': JSON.stringify(visitDetails.appointmnet.providerConsumer),
          'serviceId': visitDetails.appointmnet.service.id,
          'serviceName': visitDetails.appointmnet.service.name,
          'department': visitDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': visitDetails.appointment.consLastVisitedDate,
          'booking_time': visitDetails.appointmnet.apptTakenTime,
          'mrId': visitDetails.mrId,
          'booking_id': visitDetails.appointmnet.uid,
          'visitDate': visitDetails.consLastVisitedDate.consLastVisitedDate,
          'back_type': this.back_type,
          'provider_id': providerId
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'clinicalnotes'
      };
      this.dialogRef.close(result);

    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(visitDetails.providerConsumer),
          'serviceName': 'Consultation',
          'booking_type': 'FOLLOWUP',
          'mrId': visitDetails.id,
          'booking_date': visitDetails.consLastVisitedDate,
          'visitDate': visitDetails.consLastVisitedDate,
          'back_type': 'consumer'
        }
      };
      const result = {
        'navigationParams': navigationExtras,
        'type': 'clinicalnotes'
      };
      this.dialogRef.close(result);
    }
  }


}
