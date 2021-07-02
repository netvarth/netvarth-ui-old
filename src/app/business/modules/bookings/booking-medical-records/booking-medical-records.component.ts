import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-medical-records',
  templateUrl: './booking-medical-records.component.html',
  styleUrls: ['./booking-medical-records.component.css']
})
export class BookingMedicalRecordsComponent implements OnInit {
  @Input() customerId;
  @Input() providerId;
  @Input() waitlist_data;
  @Input() source;
  mrList: any = [];
  loading = false;
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    if (this.providerId || this.source || this.customerId || (this.waitlist_data && this.waitlist_data.waitlistStatus && this.waitlist_data.waitlistStatus !== 'blocked') || (this.waitlist_data && this.waitlist_data.apptStatus && this.waitlist_data.apptStatus !== 'blocked')) {
      this.getMedicalRecords();
    }
  }
  getMedicalRecords() {
    this.loading = true;
    const filter = {};
    if (this.customerId) {
      filter['patientId-eq'] = this.customerId;
    }
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.GetMedicalRecordList(filter)
      .subscribe((data: any) => {
        this.mrList = data;
        this.loading = false;
      });
  }
  gotoMrDetails(mr) {
    if (mr !== 'add') {
      let bookingId = (mr.uuid) ? mr.uuid : 0;
      this.router.navigate(['provider', 'customers', mr.providerConsumer.id, mr.bookingType, bookingId, 'medicalrecord', mr.id]);
    }
    // let mrId = 0;
    // const customerDetails = this.appt.appmtFor[0];
    // const customerId = customerDetails.id;
    // const bookingId = this.appt.uid;
    // const bookingType = 'APPT';
    // this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes']);
  }
  gotoMrList() {
    const qparams = { 'calledfrom': 'list' };
    if (this.providerId) {
      qparams['providerId'] = this.providerId
    }
    const navigationExtras: NavigationExtras = {
      queryParams: qparams
    };
    const id = (this.customerId) ? this.customerId : 'all';
    this.router.navigate(['provider', 'customers', id, 'FOLLOWUP', 0, 'medicalrecord', 0, 'list'], navigationExtras);
  }
}
