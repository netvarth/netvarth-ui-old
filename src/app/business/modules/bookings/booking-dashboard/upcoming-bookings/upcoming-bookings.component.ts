import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  nextWaitlists: any = [];
  nextAppts: any = [];
  loading = true;
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    this.getTodayWatilists();
  }
  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.nextWaitlists = data;
          console.log(this.nextWaitlists);
          this.getTodayAppts();
        });
  }
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.nextAppts = data;
          console.log(this.nextAppts);
          this.loading = false;
        });
  }
  gotoDetails(type) {
    const uid = (type === 'checkin') ? this.nextWaitlists[0].ynwUuid : this.nextAppts[0].uid;
    console.log(uid);
    this.router.navigate(['provider', 'bookings', uid], { queryParams: { timetype: 1, type: type } });
  }
}
