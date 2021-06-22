import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-dashboard-admin',
  templateUrl: './booking-dashboard-admin.component.html',
  styleUrls: ['./booking-dashboard-admin.component.css']
})
export class BookingDashboardAdminComponent implements OnInit {
  waitlistMgrSettings;
  constructor(private provider_services: ProviderServices) { }

  ngOnInit(): void {
    this.getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
}
