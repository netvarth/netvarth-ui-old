import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-today-booking-stats',
  templateUrl: './today-booking-stats.component.html',
  styleUrls: ['./today-booking-stats.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class TodayBookingStatsComponent implements OnInit {
  today_appt_count;
  today_waitlist_count;
  customer_count;
  constructor(private provider_services: ProviderServices) { }

  ngOnInit(): void {
    this.getTodayAppointmentsCount();
    this.getCustomersListCount();
  }
  getTodayAppointmentsCount() {
    let Mfilter = {};
    Mfilter['apptStatus-neq'] = 'prepaymentPending,failed,Cancelled,Rejected';
    this.provider_services.getTodayAppointmentsCount(Mfilter)
      .subscribe(
        data => {
          this.today_appt_count = data;
          this.getTodayWaitlistCount();
        },
        () => {
        });
  }
  getTodayWaitlistCount() {
    let Mfilter = {};
    Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed,cancelled';
    this.provider_services.getwaitlistTodayCount(Mfilter)
      .subscribe(
        data => {
          this.today_waitlist_count = data;
          this.today_waitlist_count = this.today_waitlist_count + this.today_appt_count;
        },
        () => {
        });
  }
  getCustomersListCount() {
      this.provider_services.getProviderCustomersCount()
        .subscribe(
          data => {
            this.customer_count = data;
          },
          error => {
          }
        );
  }
}
