import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  nextWaitlist: any = [];
  nextAppt: any = [];
  loading = true;
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

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
          setTimeout(() => {
            this.loading = false;
          }, 100);
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
          setTimeout(() => {
            this.loading = false;
          }, 100);
        });
  }
  gotoDetails(type) {
    const uid = (type === 'checkin') ? this.nextWaitlist.ynwUuid : this.nextAppt.uid;
    console.log(uid);
    // this.router.navigate(['provider', 'bookings', uid], { queryParams: { timetype: 1, type: type } });
  }
}
