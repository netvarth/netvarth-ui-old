import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-medicalrecord-list',
  templateUrl: './medicalrecord-list.component.html',
  styleUrls: ['./medicalrecord-list.component.css']
})
export class MedicalrecordListComponent implements OnInit {

  mrList = 0;
  selectedRowIndex: any;
  loading = true;
  patientId: any;
  public mr_dataSource = new MatTableDataSource<any[]>([]);
  displayedColumns = ['createdDate', 'mrNo', 'serviceName', 'bookingType', 'medicalrecord', 'rx'];
  patientDetails: ArrayBuffer;
  customer_label = '';
  constructor(private provider_services: ProviderServices,
    private activatedRoute: ActivatedRoute,
    public dateformat: DateFormatPipe,
    private router: Router,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private location: Location) {
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }


  ngOnInit() {
    this.getPatientDetails();
    this.getPatientMedicalRecords();
  }

  getPatientDetails() {
    const filter = { 'id-eq': this.patientId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        res => {
          this.patientDetails = res;
          console.log(this.patientDetails);
        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getPatientMedicalRecords() {
    this.provider_services.getPatientMedicalRecords(this.patientId)
      .subscribe((data: any) => {
        this.mr_dataSource = data;
        this.mrList = data.length;
        this.loading = false;
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
    let bookingId = 0;
    const bookingType = mrDetails.bookingType;
    const mrId = mrDetails.id;
    const customerDetails = mrDetails.providerConsumer;
    const customerId = customerDetails.id;
    if (mrDetails.uuid) {
      bookingId = mrDetails.uuid;
    }
    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);

  }
}
