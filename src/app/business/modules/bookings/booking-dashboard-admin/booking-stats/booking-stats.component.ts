import { Component, OnInit } from '@angular/core';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-stats',
  templateUrl: './booking-stats.component.html',
  styleUrls: ['./booking-stats.component.css']
})
export class BookingStatsComponent implements OnInit {
  customer_count;
  today_appt_count;
  today_waitlist_count;
  customer_label = '';
  showToken;
  constructor(private provider_services: ProviderServices,
    private wordProcessor: WordProcessor) { }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getWaitlistMgr();
    this.getCustomersListCount();
    this.getTodayAppointmentsCount();
  }
  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
      .subscribe((data: any) => {
        this.showToken = data.showTokenId;
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
        },
        () => {
        });
  }
}
