import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-booking-dashboard-admin',
  templateUrl: './booking-dashboard-admin.component.html',
  styleUrls: ['./booking-dashboard-admin.component.css']
})
export class BookingDashboardAdminComponent implements OnInit {
  waitlistMgrSettings;
  private readonly notifier: NotifierService;
  constructor(private provider_services: ProviderServices,
    notifierService: NotifierService) {
      this.notifier = notifierService;
     }

  ngOnInit(): void {
    this.getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
	showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}
}
