import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-check-ins',
  templateUrl: './check-ins.component.html',
  styleUrls: ['./check-ins.component.css']
})
export class CheckinsComponent implements OnInit {
  todayWaitlists: any = [];
  futureWaitlists: any = [];
  historyWaitlists: any = [];
  providerId;
  waitlistMgrSettings;
  timeType = 1;
  waitlistToList: any = [];
  loading = true;
  subscription: Subscription;
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private router: Router, private location: Location,
    private shared_functions: SharedFunctions) {
    this.activated_route.queryParams.subscribe(params => {
      if (params.providerId) {
        this.providerId = JSON.parse(params.providerId);
      }
    });
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      if (message.ttype === 'todayWl') {
        this.todayWaitlists = message.data;
        if (this.providerId) {
          this.todayWaitlists = this.todayWaitlists.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      if (message.ttype === 'futureWl') {
        this.futureWaitlists = message.data;
        if (this.providerId) {
          this.futureWaitlists = this.futureWaitlists.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      this.handleWaitlistType(this.timeType);
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
          this.getFutureWatilists(filter);
        });
  }
  getFutureWatilists(filter) {
    this.provider_services.getFutureWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.futureWaitlists = data;
          this.getHistoryWaitlists();
        });
  }
  getHistoryWaitlists() {
    const api_filter = { 'waitlistStatus-neq': 'prepaymentPending,failed' };
    if (this.providerId) {
      api_filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getHistoryWaitlist(api_filter)
      .subscribe(
        data => {
          this.historyWaitlists = data;
          this.loading = false;
        });
  }
  handleWaitlistType(type) {
    this.timeType = type;
    if (this.timeType === 1) {
      this.waitlistToList = this.todayWaitlists;
    } else if (this.timeType === 2) {
      this.waitlistToList = this.futureWaitlists;
    } else {
      this.waitlistToList = this.historyWaitlists;
    }
  }
  checkinClicked() {
    this.router.navigate(['provider', 'check-ins', 'add'],
      { queryParams: { checkinType: 'WALK_IN_CHECKIN' } });
  }
  goBack() {
    this.location.back();
  }
}
