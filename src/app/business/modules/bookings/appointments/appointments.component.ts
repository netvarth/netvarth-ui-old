import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  providerId;
  todayAppts: any = [];
  futureAppts: any = [];
  historyAppts: any = [];
  totalAppts: any = [];
  selectedType = 'list';
  timeType = 1;
  apptToList: any = [];
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
        case 'todayAppt':
          console.log(message.data);
          this.todayAppts = this.todayAppts.concat(message.data);
          break;
        case 'futureAppt':
          console.log(message.data);
          this.futureAppts = this.futureAppts.concat(message.data);
          break;
      }
      this.setDatas();
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getTodayAppts().then(data => {
      this.getFutureAppts().then(data => {
        this.getHistoryAppts().then(data => {
          this.setDatas();
          this.loading = false;
        });
      });
    });
  }
  setDatas() {
    this.todayAppts.map((obj) => {
      obj.type = 1;
      return obj;
    });
    this.futureAppts.map((obj) => {
      obj.type = 2;
      return obj;
    });
    this.historyAppts.map((obj) => {
      obj.type = 3;
      return obj;
    });
    this.totalAppts = [];
    this.totalAppts = this.todayAppts.concat(this.futureAppts, this.historyAppts);
    this.handleApptSelectionType(this.timeType);
  }
  setFilters() {
    const filter = {
      'apptStatus-neq': 'prepaymentPending,failed'
    };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    return filter;
  }
  getTodayAppts() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getTodayAppointments(filter)
        .subscribe(
          (data: any) => {
            this.todayAppts = data;
            resolve(data);
          });
    });
  }
  getFutureAppts() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getFutureAppointments(filter)
        .subscribe(
          (data: any) => {
            this.futureAppts = data;
            resolve(data);
          });
    });
  }
  getHistoryAppts() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getHistoryAppointments(filter)
        .subscribe(
          data => {
            this.historyAppts = data;
            resolve(data);
          });
    });
  }
  selectViewType(view) {
    this.selectedType = view;
  }
  handleApptSelectionType(type) {
    this.timeType = type;
    if (this.timeType === 1) {
      this.apptToList = this.todayAppts;
    } else if (this.timeType === 2) {
      this.apptToList = this.futureAppts;
    } else {
      this.apptToList = this.historyAppts;
    }
  }
  apptClicked() {
    this.router.navigate(['provider', 'appointments', 'appointment'],
      { queryParams: { checkinType: 'WALK_IN_APPOINTMENT' } });
  }
  goBack() {
    this.location.back();
  }
}
