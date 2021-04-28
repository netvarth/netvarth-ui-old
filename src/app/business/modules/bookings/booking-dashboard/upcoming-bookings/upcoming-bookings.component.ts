import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  nextWaitlist: any = [];
  nextAppt: any = [];
  constructor(private provider_services: ProviderServices) { }

  ngOnInit(): void {
    this.getTodayWatilists();
    this.getTodayAppts();
  }
  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.nextWaitlist = data[0];
            console.log(this.nextWaitlist);
          }
        });
  }
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.nextAppt = data[0];
            console.log(this.nextAppt);
          }
        });
  }
}
