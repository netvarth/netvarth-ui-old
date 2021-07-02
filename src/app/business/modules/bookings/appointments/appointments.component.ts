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
      if (message.ttype === 'todayAppt') {
        this.todayAppts = message.data;
        if (this.providerId) {
          this.todayAppts = this.todayAppts.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      if (message.ttype === 'futureAppt') {
        this.futureAppts = message.data;
        if (this.providerId) {
          this.futureAppts = this.futureAppts.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      this.totalAppts = [];
      this.totalAppts = this.todayAppts.concat(this.futureAppts);
      this.totalAppts = this.todayAppts.concat(this.historyAppts);
      this.handleApptSelectionType(this.timeType);
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getTodayAppts();
  }
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.todayAppts = data;
          this.todayAppts.map((obj) => {
            obj.type = 1;
            return obj;
          });
          this.totalAppts = this.apptToList = this.todayAppts;
          this.getFutureAppts(filter);
        });
  }
  getFutureAppts(filter) {
    this.provider_services.getFutureAppointments(filter)
      .subscribe(
        (data: any) => {
          this.futureAppts = data;
          this.futureAppts.map((obj) => {
            obj.type = 2;
            return obj;
          });
          this.totalAppts = this.totalAppts.concat(this.futureAppts);
          this.getHistoryAppts();
        });
  }
  getHistoryAppts() {
    const api_filter = { 'apptStatus-neq': 'prepaymentPending,failed' };
    if (this.providerId) {
      api_filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getHistoryAppointments(api_filter)
      .subscribe(
        data => {
          this.historyAppts = data;
          this.historyAppts.map((obj) => {
            obj.type = 3;
            return obj;
          });
          this.totalAppts = this.totalAppts.concat(this.historyAppts);
          this.loading = false;
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
