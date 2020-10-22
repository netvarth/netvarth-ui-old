import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatTableDataSource } from '@angular/material';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-medicalrecord-list',
  templateUrl: './medicalrecord-list.component.html',
  styleUrls: ['./medicalrecord-list.component.css']
})
export class MedicalrecordListComponent implements OnInit {

  loading = true;
  patientId: any;
  public mr_dataSource = new MatTableDataSource<any>();
  displayedColumns = ['consultationDate', 'serviceName', 'bookingType', 'medicalrecord', 'rx'];
  constructor(private provider_services: ProviderServices,
    private activatedRoute: ActivatedRoute,
    public dateformat: DateFormatPipe,
    private router: Router,
    private sharedfunctionObj: SharedFunctions) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.patientId = queryParams.id;

    });
  }


  ngOnInit() {
    this.getPatientMedicalRecords();
  }
  getLastVisitDate(visit) {
    return this.dateformat.transformToDatewithtime(visit.lastVisitedDate);
  }
  getPatientMedicalRecords() {
    this.provider_services.getPatientMedicalRecords(this.patientId)
      .subscribe((data: any) => {
        this.mr_dataSource = data;
        this.loading = false;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getServiceName(mr) {
    let serviceName = 'Consultation';
    if (mr.waitlist) {
      serviceName = mr.waitlist.service.name;
    } else if (mr.appointmnet) {
      serviceName = mr.appointmnet.service.name;
    }
    return serviceName;

  }
  viewMedicalRecord(mrDetails) {
    if (mrDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.waitlist.consumer),
          'serviceId': mrDetails.waitlist.service.id,
          'serviceName': mrDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': mrDetails.waitlist.date,
          'booking_time': mrDetails.waitlist.checkInTime,
          'department': mrDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': mrDetails.waitlist.ynwUuid,
          'mrId': mrDetails.mrId,
          'visitDate': mrDetails.lastVisitedDate
        }
      };


      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], navigationExtras);
    } else if (mrDetails.appointmnet) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.appointmnet.providerConsumer),
          'serviceId': mrDetails.appointmnet.service.id,
          'serviceName': mrDetails.appointmnet.service.name,
          'department': mrDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': mrDetails.appointmnet.appmtDate,
          'booking_time': mrDetails.appointmnet.apptTakenTime,
          'mrId': mrDetails.mrId,
          'booking_id': mrDetails.appointmnet.uid,
          'visitDate': mrDetails.lastVisitedDate
        }
      };
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.providerConsumer),
          'serviceName': 'Consultation',
          'booking_type': 'FOLLOWUP',
          'mrId': mrDetails.id,
          'visitDate': mrDetails.mrConsultationDate
        }
      };
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], navigationExtras);
    }
  }

  viewMR_prescription(mrDetails) {
    if (mrDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.waitlist.consumer),
          'serviceId': mrDetails.waitlist.service.id,
          'serviceName': mrDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': mrDetails.waitlist.date,
          'booking_time': mrDetails.waitlist.checkInTime,
          'department': mrDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': mrDetails.waitlist.ynwUuid,
          'mrId': mrDetails.mrId,
          'visitDate': mrDetails.date
        }
      };


      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    } else if (mrDetails.appointmnet) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.appointmnet.providerConsumer),
          'serviceId': mrDetails.appointmnet.service.id,
          'serviceName': mrDetails.appointmnet.service.name,
          'department': mrDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': mrDetails.appointmnet.appmtDate,
          'booking_time': mrDetails.appointmnet.apptTakenTime,
          'mrId': mrDetails.mrId,
          'booking_id': mrDetails.appointmnet.uid,
          'visitDate': mrDetails.date
        }
      };

      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.providerConsumer),
          'serviceName': 'Consultation',
          'booking_type': 'FOLLOWUP',
          'mrId': mrDetails.id,
          'visitDate': mrDetails.mrConsultationDate
        }
      };
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    }

  }
}
