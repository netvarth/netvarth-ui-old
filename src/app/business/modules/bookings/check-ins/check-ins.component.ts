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
      switch (message.ttype) {
        case 'todayWl':
          console.log(message.data);
          this.todayWaitlists = this.todayWaitlists.concat(message.data);
          break;
        case 'futureWl':
          console.log(message.data);
          this.futureWaitlists = this.futureWaitlists.concat(message.data);
          break;
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
    this.getTodayWatilists().then(data => {
      this.getFutureWatilists().then(data => {
        this.getHistoryWaitlists().then(data => {
          this.handleWaitlistType(this.timeType);
          this.loading = false;
        });
      });
    });
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
  setFilters() {
    const filter = {
      'waitlistStatus-neq': 'prepaymentPending,failed'
    };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    return filter;
  }
  getTodayWatilists() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getTodayWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.todayWaitlists = data;
            resolve(data);
          });
    });
  }
  getFutureWatilists() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getFutureWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.futureWaitlists = data;
            resolve(data);
          });
    });
  }
  getHistoryWaitlists() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getHistoryWaitlist(filter)
        .subscribe(
          data => {
            this.historyWaitlists = data;
            resolve(data);
          });
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
