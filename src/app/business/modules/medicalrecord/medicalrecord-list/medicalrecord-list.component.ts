import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { Location } from '@angular/common';

@Component({
  selector: 'app-medicalrecord-list',
  templateUrl: './medicalrecord-list.component.html',
  styleUrls: ['./medicalrecord-list.component.css']
})
export class MedicalrecordListComponent implements OnInit {

  loading = true;
  patientId: any;
  public mr_dataSource = new MatTableDataSource<any[]>([]);
  displayedColumns = ['consultationDate', 'serviceName', 'bookingType', 'medicalrecord', 'rx'];
  patientDetails: ArrayBuffer;
  constructor(private provider_services: ProviderServices,
    private activatedRoute: ActivatedRoute,
    public dateformat: DateFormatPipe,
    private router: Router,
    private sharedfunctionObj: SharedFunctions,
    private location: Location) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.patientId = queryParams.id;

    });
  }


  ngOnInit() {
    this.getPatientDetails();
    this.getPatientMedicalRecords();
  }
  // getLastVisitDate(visit) {
  //   return this.dateformat.transformToDatewithtime(visit.lastVisitedDate);
  // }
  getPatientDetails() {
    const filter = { 'id-eq': this.patientId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        res => {
          this.patientDetails = res;
          console.log(this.patientDetails);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
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
  back() {
    this.location.back();
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
  getBookingName(bookingType) {
    let bkgType = '';
    switch (bookingType) {
      case 'FOLLOWUP': {
        bkgType = 'Follow up';
        break;
      }
      case 'APPT': {
        bkgType = 'Appointment';
        break;
      }
      case 'TOKEN': {
        bkgType = 'Check-ins/Tokens';
        break;
      }
    }
    return bkgType;

  }
  viewMedicalRecord(mrDetails) {
    if (mrDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.waitlist.waitlistingFor[0]),
          'serviceId': mrDetails.waitlist.service.id,
          'serviceName': mrDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': mrDetails.waitlist.date,
          'booking_time': mrDetails.waitlist.checkInTime,
          'department': mrDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': mrDetails.waitlist.ynwUuid,
          'mrId': mrDetails.mrId,
          'visitDate': mrDetails.consLastVisitedDate,
          'back_type': 'consumer'

        }
      };


      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], navigationExtras);
    } else if (mrDetails.appointmnet) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.appointmnet.appmtFor[0]),
          'serviceId': mrDetails.appointmnet.service.id,
          'serviceName': mrDetails.appointmnet.service.name,
          'department': mrDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': mrDetails.appointmnet.appmtDate,
          'booking_time': mrDetails.appointmnet.apptTakenTime,
          'mrId': mrDetails.mrId,
          'booking_id': mrDetails.appointmnet.uid,
          'visitDate': mrDetails.consLastVisitedDate,
          'back_type': 'consumer'
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
          'visitDate': mrDetails.mrConsultationDate,
          'back_type': 'consumer'
        }
      };
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], navigationExtras);
    }
  }

  viewMR_prescription(mrDetails) {
    if (mrDetails.waitlist) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.waitlist.waitlistingFor[0]),
          'serviceId': mrDetails.waitlist.service.id,
          'serviceName': mrDetails.waitlist.service.name,
          'booking_type': 'TOKEN',
          'booking_date': mrDetails.waitlist.date,
          'booking_time': mrDetails.waitlist.checkInTime,
          'department': mrDetails.waitlist.service.deptName,
          'consultationMode': 'OP',
          'booking_id': mrDetails.waitlist.ynwUuid,
          'mrId': mrDetails.mrId,
          'visitDate': mrDetails.consLastVisitedDate,
          'back_type': 'consumer'
        }
      };


      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    } else if (mrDetails.appointmnet) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'customerDetail': JSON.stringify(mrDetails.appointmnet.appmtFor[0]),
          'serviceId': mrDetails.appointmnet.service.id,
          'serviceName': mrDetails.appointmnet.service.name,
          'department': mrDetails.appointmnet.service.deptName,
          'booking_type': 'APPT',
          'booking_date': mrDetails.appointmnet.appmtDate,
          'booking_time': mrDetails.appointmnet.apptTakenTime,
          'mrId': mrDetails.mrId,
          'booking_id': mrDetails.appointmnet.uid,
          'visitDate': mrDetails.consLastVisitedDate,
          'back_type': 'consumer'
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
          'visitDate': mrDetails.consLastVisitedDate,
          'back_type': 'consumer'
        }
      };
      this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], navigationExtras);
    }

  }
}
