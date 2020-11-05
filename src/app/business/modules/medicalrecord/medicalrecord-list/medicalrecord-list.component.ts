import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute,Router } from '@angular/router';
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

  selectedRowIndex: any;
  loading = true;
  patientId: any;
  public mr_dataSource = new MatTableDataSource<any[]>([]);
  displayedColumns = ['createdDate', 'mrNo', 'serviceName', 'bookingType', 'medicalrecord', 'rx'];
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
    if (mr.service) {
      serviceName = mr.service.name;
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
  getMedicalRecord(mrDetails) {
   //  this.selectedRowIndex = mrDetails.mrId;
    if (mrDetails.waitlist) {
      const mrId = mrDetails.waitlist.mrId;
      const customerDetails = mrDetails.waitlist.waitlistingFor[0];
      const customerId = customerDetails.id;
      const bookingId = mrDetails.waitlist.ynwUuid;
       const bookingType = 'TOKEN';
       this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);


    } else if (mrDetails.appointmnet) {
       const mrId = mrDetails.appointmnet.mrId;
      const customerDetails = mrDetails.appointmnet.appmtFor[0];
      const customerId = customerDetails.id;
      const bookingId = mrDetails.appointmnet.uid;
       const bookingType = 'APPT';
       this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);
    } else {
      const mrId = mrDetails.mrId;
      const customerDetails = mrDetails.providerConsumer;
      const customerId = customerDetails.id;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId ]);

    }
  }


}
