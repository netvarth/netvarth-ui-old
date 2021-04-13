import { Component, OnInit, Input } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-customer-booking-details',
  templateUrl: './customer-booking-details.component.html',
  styleUrls: ['./customer-booking-details.component.css']
})
export class CustomerBookingDetailsComponent implements OnInit {
  @Input() waitlist_data;

  customerid;
  customerdetails : any=[];
  constructor(
    private provider_services: ProviderServices,
  ) { }

  ngOnInit(): void {
    this.customerid = this.waitlist_data.waitlistingFor[0].id;
    this.getCustomerdetails(this.customerid);
  }
  getCustomerdetails(customerId) {
    const filter = { 'id-eq': customerId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        data => {
          this.customerdetails = data;
          console.log(this.customerdetails)
        },
        () => {
        }
      );
  }
}
