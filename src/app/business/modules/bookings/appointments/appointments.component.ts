import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private router: Router, private location: Location) {
    this.activated_route.queryParams.subscribe(params => {
      console.log(params);
      this.providerId = params.providerId;
    });
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
          console.log('this.totalAppts', this.totalAppts);
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
