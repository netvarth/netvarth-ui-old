import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  uid;
  loading = false;
  orderDetails: any = [];
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices,
    public location: Location) {
    this.activaterouter.params.subscribe(param => {
      console.log(param);
      this.uid = param.id;
      this.getOrderDetails(this.uid);
    });
  }

  ngOnInit() {
  }
  getOrderDetails(uid) {
    this.loading = true;
    this.providerservice.getProviderOrderById(uid).subscribe(data => {
      this.orderDetails = data;
      this.loading = false;
      console.log(data);
    });
  }
  goBack() {
    this.location.back();
  }
}
