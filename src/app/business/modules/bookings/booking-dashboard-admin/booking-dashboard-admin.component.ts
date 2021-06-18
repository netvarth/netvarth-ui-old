import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-dashboard-admin',
  templateUrl: './booking-dashboard-admin.component.html',
  styleUrls: ['./booking-dashboard-admin.component.css']
})
export class BookingDashboardAdminComponent implements OnInit {
  waitlists: any = [];
  appointments: any = [];
  loading = true;
  waitlistMgrSettings;
  constructor(private provider_services: ProviderServices) { }

  ngOnInit(): void {
    this.getProviderSettings();
    this.getTodayWatilists();
  }
  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived',
      'from': 0,
      'count': 10
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.waitlists = data;
          console.log(this.waitlists);
          this.getTodayAppts();
        });
  }
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived',
      'from': 0,
      'count': 10
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.appointments = data;
          console.log(this.appointments);
          this.loading = false;
        });
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
  actionPerformed(event) {
    console.log(event);
  }
}
