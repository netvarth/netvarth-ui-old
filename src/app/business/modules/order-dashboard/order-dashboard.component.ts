import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css']
})
export class OrderDashboardComponent implements OnInit {
  businessName;
  constructor( public sharedFunctions: SharedFunctions) {}

  ngOnInit(): void {
    const businessdetails = this.sharedFunctions.getitemFromGroupStorage('ynwbp');
    this.businessName = businessdetails.bn;
  }
  tabChange(event) {
console.log(event);
  }
}
