import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-medical-records',
  templateUrl: './booking-medical-records.component.html',
  styleUrls: ['./booking-medical-records.component.css']
})
export class BookingMedicalRecordsComponent implements OnInit {
  @Input() customerId;
  mrList: any = [];
  loading = true;
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    this.getPatientMedicalRecords();
  }
  getPatientMedicalRecords() {
    this.provider_services.getPatientMedicalRecords(this.customerId)
      .subscribe((data: any) => {
        this.mrList = data;
        console.log(this.mrList);
        this.loading = false;
      });
  }
  gotoMrDetails(mr) {
    let bookingId = (mr.uuid) ? mr.uuid : 0;
    this.router.navigate(['provider', 'customers', mr.providerConsumer.id, mr.bookingType, bookingId, 'medicalrecord', mr.id]);
  }
}
