import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../app.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

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
  filter_sidebar = false;
  filterapplied = false;
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    appointmentEncId: '',
    patientId: '',
    appointmentMode: 'all',
    schedule: 'all',
    location: 'all',
    service: 'all',
    apptStatus: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    future_appt_date: null,
    age: 'all',
    gender: 'all'
  };
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    appointmentEncId: false,
    patientId: false,
    appointmentMode: false,
    schedule: false,
    location: false,
    service: false,
    apptStatus: false,
    payment_status: false,
    check_in_start_date: false,
    check_in_end_date: false,
    location_id: false,
    age: false,
    gender: false
  };
  labelFilterData = '';
  customer_label = '';
  customerIdTooltip = '';
  filtericonTooltip = '';
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private router: Router, private location: Location,
    private shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor) {
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
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' Id';
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
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
  showFilterSidebar() {
    this.filter_sidebar = true;
    this.shared_functions.setFilter();
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  keyPressed(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('filter');
    // this.endminday = this.filter.check_in_start_date;
    // if (this.filter.check_in_end_date) {
    //   this.maxday = this.filter.check_in_end_date;
    // } else {
    //   this.maxday = new Date();
    // }
    // this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.appointmentEncId || this.filter.patientId || this.filter.service !== 'all' ||
      this.filter.schedule !== 'all' || this.filter.payment_status !== 'all' || this.filter.appointmentMode !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.labelFilterData !== '' || this.filter.apptStatus !== 'all') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    // this.loadApiSwitch('doSearch');
    this.shared_functions.setFilter();
  }
}
