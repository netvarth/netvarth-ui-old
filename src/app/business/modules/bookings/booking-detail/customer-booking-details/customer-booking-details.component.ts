import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-customer-booking-details',
  templateUrl: './customer-booking-details.component.html',
  styleUrls: ['./customer-booking-details.component.css','../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class CustomerBookingDetailsComponent implements OnInit {
  @Input() waitlist_data;

  customerid;
  bookingType;
  customerdetails : any=[];
  constructor(
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute

  ) { 
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
      console.log(this.bookingType)
    });
  }

  ngOnInit(): void {
    if (this.bookingType === 'checkin') {
      this.customerid = this.waitlist_data.waitlistingFor[0].id;
      console.log(this.customerid)
      this.getCustomerdetails(this.customerid);
    } else if(this.bookingType === 'appointment'){
      this.customerid = this.waitlist_data.appmtFor[0].id;
      console.log(this.customerid)
      this.getCustomerdetails(this.customerid);
    }
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
