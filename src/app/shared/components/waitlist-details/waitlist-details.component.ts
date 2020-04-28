import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';

@Component({
  'selector': 'app-waitlistdetails-component',
  'templateUrl': './waitlist-details.component.html'
})
export class WaitlistDetailsComponent implements OnInit {
  api_loading: boolean;
  checkinDetails: any = [];
  waitlistId;

  constructor(private shared_services: SharedServices) { }
  ngOnInit() {
    this.api_loading = true;
  }
  getVirtualCallingModesList() {
    this.shared_services.getWaitlistDetailsbyId(this.waitlistId)
      .subscribe(
        (data: any) => {
          this.checkinDetails = data;
          this.api_loading = false;
        });
  }
}
