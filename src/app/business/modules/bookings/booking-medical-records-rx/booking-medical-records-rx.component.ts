import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-medical-records-rx',
  templateUrl: './booking-medical-records-rx.component.html',
  styleUrls: ['./booking-medical-records-rx.component.css']
})
export class BookingMedicalRecordsRXComponent implements OnInit {
  @Input() customerId;
  @Input() providerId;
  @Input() waitlist_data;
  @Input() source;
  @Input() type;
  mrList: any = [];
  rxList: any = [];
  loading = false;
  waitlistmr: any = [];
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    console.log('medical', this.source);
    console.log(this.type);
    if (this.source !== 'details' || (this.source === 'details' && (this.waitlist_data.waitlistStatus && this.waitlist_data.waitlistStatus !== 'blocked') || (this.waitlist_data.apptStatus && this.waitlist_data.apptStatus !== 'blocked'))) {
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
        console.log('mr', this.mrList);
        this.rxList = this.mrList.filter(mr => mr.prescriptionCreated);
        console.log('rx', this.rxList);
        if (this.source === 'details') {
          const uuid = (this.waitlist_data.waitlistStatus) ? this.waitlist_data.ynwUuid : this.waitlist_data.uid;
          this.waitlistmr = this.mrList.filter(mr => mr.uuid === uuid);
          console.log('this.waitlistmr', this.waitlistmr)
        }
        this.loading = false;
      });
  }
  gotoMrDetails(mr) {
    if (mr !== 'add') {
      let bookingId = (mr.uuid) ? mr.uuid : 0;
      this.router.navigate(['provider', 'customers', mr.providerConsumer.id, mr.bookingType, bookingId, 'medicalrecord', mr.id]);
    }
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
