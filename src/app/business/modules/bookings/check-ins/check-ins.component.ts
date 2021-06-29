import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-check-ins',
  templateUrl: './check-ins.component.html',
  styleUrls: ['./check-ins.component.css']
})
export class CheckinsComponent implements OnInit {
  todayWaitlists: any = [];
  futureWaitlists: any = [];
  newWaitlists: any = [];
  providerId;
  waitlistMgrSettings;
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices) {
    this.activated_route.queryParams.subscribe(params => {
      console.log(params);
      this.providerId = params.providerId;
    });
  }

  ngOnInit(): void {
    this.getProviderSettings();
    this.getTodayWatilists();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.todayWaitlists = data;
          console.log(this.todayWaitlists);
          this.getFutureWatilists(filter);
        });
  }
  getFutureWatilists(filter) {
    this.provider_services.getFutureWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.futureWaitlists = data;
          console.log(this.futureWaitlists);
          this.newWaitlists = this.todayWaitlists.concat(this.futureWaitlists);
        });
  }
  getHistoryWaitlists() {
    const api_filter = { 'waitlistStatus-neq': 'prepaymentPending,failed' };
    this.provider_services.getHistoryWaitlist(api_filter)
      .subscribe(
        data => {
        });
  }
}
