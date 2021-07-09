import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../app.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import * as moment from 'moment';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { SharedServices } from '../../../../shared/services/shared-services';

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
  loading = false;
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
    check_in_date: null,
    location_id: 'all'
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
    check_in_date: false,
    location_id: false
  };
  labelFilterData = '';
  customer_label = '';
  customerIdTooltip = '';
  filtericonTooltip = '';
  apptModes: any = [];
  paymentStatuses: any = [];
  apptStatuses: any = [];
  allModeSelected = false;
  allPayStatusSelected = false;
  allApptStatusSelected = false;
  service_list: any = [];
  allServiceSelected = false;
  services: any = [];
  selectedLabels: any = [];
  allLabelSelected: any = [];
  filteredSchedule: any = [];
  allScheduleSelected = false;
  endminday;
  maxday = new Date();
  endmaxday = new Date();
  allLocationSelected = false;
  filterLocation: any = [];
  allLabels: any = [];
  providerLabels: any = [];
  locations: any = [];
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'PartiallyRefunded', value: 'Partially Refunded' },
    { pk: 'FullyRefunded', value: 'Fully Refunded' },
    { pk: 'Refund', value: 'Refund' }
  ];
  appointmentModes = [
    { mode: 'WALK_IN_APPOINTMENT', value: 'Walk in Appointment' },
    { mode: 'PHONE_IN_APPOINTMENT', value: 'Phone in Appointment' },
    { mode: 'ONLINE_APPOINTMENT', value: 'Online Appointment' },
  ];
  check_in_statuses_filter = projectConstantsLocal.APPT_STATUSES_FILTER;
  schedules: any = [];
  server_date;
  tomorrowDate;
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private router: Router, private location: Location,
    private shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private shared_services: SharedServices) {
    this.activated_route.queryParams.subscribe(params => {
      if (params.providerId) {
        this.providerId = JSON.parse(params.providerId);
      }
    });
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'todayAppt':
          this.todayAppts = this.todayAppts.concat(message.data);
          if (message.data.length > 0) {
            this.refresh();
          }
          break;
        case 'futureAppt':
          this.futureAppts = this.futureAppts.concat(message.data);
          if (message.data.length > 0) {
            this.refresh();
          }
          break;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.setSystemDate();
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' Id';
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
    this.getTodayAppts().then(data => {
      this.getFutureAppts().then(data => {
        this.getHistoryAppts().then(data => {
          this.setDatas();
        });
      });
    });
    this.getProviderLocations();
    this.getProviderSchedules();
    this.getServices();
    this.getLabel();
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.getTomorrowDate();
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
  }
  setFilters() {
    let api_filter = {};
    if (this.providerId) {
      api_filter['provider-eq'] = this.providerId;
    }
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNo-eq'] = this.filter.phone_number;
    }
    if (this.filter.appointmentEncId !== '') {
      api_filter['appointmentEncId-eq'] = this.filter.appointmentEncId;
    }
    if (this.filter.patientId !== '') {
      api_filter['appmtFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
    }
    if (this.services.length > 0 && this.filter.service !== 'all') {
      api_filter['service-eq'] = this.services.toString();
    }
    if (this.apptStatuses.length > 0 && this.filter.apptStatus !== 'all') {
      api_filter['apptStatus-eq'] = this.apptStatuses.toString();
    }
    if (this.apptModes.length > 0 && this.filter.appointmentMode !== 'all') {
      api_filter['appointmentMode-eq'] = this.apptModes.toString();
    }
    if (this.timeType === 3) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
      }
    }
    if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
      api_filter['paymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.timeType === 3) {
      if (this.filteredSchedule.length > 0 && this.filter.schedule !== 'all') {
        api_filter['schedule-eq'] = this.filteredSchedule.toString();
      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
      }
    }
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
    }
    if (this.filter.apptStatus === 'all') {
      api_filter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    if (this.timeType === 2) {
      if (this.filter.check_in_date != null) {
        api_filter['date-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_date);
      }
    }
    return api_filter;
  }
  getPatientIdFilter(patientid) {
    const idFilter = 'memberJaldeeId::' + patientid;
    return idFilter;
  }
  doSearch(type?) {
    if (!type) {
      this.loading = true;
    }
    switch (this.timeType) {
      case 1: this.getTodayAppts();
        break;
      case 2: this.getFutureAppts();
        break;
      case 3: this.getHistoryAppts();
        break;
    }
  }
  keyPressed() {
    this.shared_functions.setFilter();
    this.lStorageService.removeitemfromLocalStorage('filter');
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = new Date();
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.appointmentEncId || this.filter.patientId || this.filter.service !== 'all' ||
      this.filter.schedule !== 'all' || this.filter.payment_status !== 'all' || this.filter.appointmentMode !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.check_in_date !== null || this.labelFilterData !== '' || this.filter.apptStatus !== 'all') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  labelSelection() {
    this.labelFilterData = '';
    let count = 0;
    Object.keys(this.selectedLabels).forEach(key => {
      if (this.selectedLabels[key].length > 0) {
        count++;
        if (!this.labelFilterData.includes(key)) {
          if (count === 1) {
            this.labelFilterData = this.labelFilterData + key + '::' + this.selectedLabels[key].join(',');
          } else {
            this.labelFilterData = this.labelFilterData + '$' + key + '::' + this.selectedLabels[key].join(',');
          }
        }
      } else {
        delete this.selectedLabels[key];
      }
    });
  }
  clearFilter() {
    this.resetFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.doSearch();
  }
  resetFilterValues() {
    this.services = [];
    this.apptStatuses = [];
    this.filteredSchedule = [];
    this.paymentStatuses = [];
    this.apptModes = [];
    this.filterLocation = [];
    this.allServiceSelected = false;
    this.allScheduleSelected = false;
    this.allApptStatusSelected = false;
    this.allPayStatusSelected = false;
    this.allModeSelected = false;
    this.allLocationSelected = false;
    this.selectedLabels = [];
    this.allLabelSelected = [];
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      appointmentEncId: false,
      patientId: false,
      appointmentMode: false,
      schedule: false,
      service: false,
      apptStatus: false,
      payment_status: false,
      check_in_start_date: false,
      check_in_date: false,
      check_in_end_date: false,
      location_id: false,
      location: false
    };
    this.filter = {
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
      check_in_date: null,
      check_in_end_date: null,
      location_id: 'all'
    };
    this.labelFilterData = '';
  }
  setLabelFilter(label, event) {
    const value = event.checked;
    if (label === 'all') {
      this.allLabelSelected = false;
      if (event.checked) {
        for (const lbl of this.providerLabels) {
          if (!this.selectedLabels[lbl.label]) {
            this.selectedLabels[lbl.label] = [];
            this.selectedLabels[lbl.label].push(true);
          }
        }
        this.allLabelSelected = true;
      } else {
        this.selectedLabels = [];
        this.allLabelSelected = false;
      }
    } else {
      this.allLabelSelected = false;
      if (this.selectedLabels[label.label]) {
        delete this.selectedLabels[label.label];
      } else {
        this.selectedLabels[label.label] = [];
        this.selectedLabels[label.label].push(value);
      }
      if (Object.keys(this.selectedLabels).length === this.providerLabels.length) {
        this.allLabelSelected = true;
      }
    }
    this.keyPressed();
  }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    if (type === 'appointmentMode') {
      if (value === 'all') {
        this.apptModes = [];
        this.allModeSelected = false;
        if (event.checked) {
          for (const apptMode of this.appointmentModes) {
            if (this.apptModes.indexOf(apptMode.mode) === -1) {
              this.apptModes.push(apptMode.mode);
            }
          }
          this.allModeSelected = true;
        }
      } else {
        this.allModeSelected = false;
        const indx = this.apptModes.indexOf(value);
        if (indx === -1) {
          this.apptModes.push(value);
        } else {
          this.apptModes.splice(indx, 1);
        }
      }
      if (this.apptModes.length === this.appointmentModes.length) {
        this.filter['appointmentMode'] = 'all';
        this.allModeSelected = true;
      }
    }
    if (type === 'payment_status') {
      if (value === 'all') {
        this.paymentStatuses = [];
        this.allPayStatusSelected = false;
        if (event.checked) {
          for (const pay_status of this.payStatusList) {
            if (this.paymentStatuses.indexOf(pay_status.pk) === -1) {
              this.paymentStatuses.push(pay_status.pk);
            }
          }
          this.allPayStatusSelected = true;
        }
      } else {
        this.allPayStatusSelected = false;
        const indx = this.paymentStatuses.indexOf(value);
        if (indx === -1) {
          this.paymentStatuses.push(value);
        } else {
          this.paymentStatuses.splice(indx, 1);
        }
      }
      if (this.paymentStatuses.length === this.payStatusList.length) {
        this.filter['payment_status'] = 'all';
        this.allPayStatusSelected = true;
      }
    }
    if (type === 'apptStatus') {
      if (value === 'all') {
        this.apptStatuses = [];
        this.allApptStatusSelected = false;
        if (event.checked) {
          for (const apptStatus of this.check_in_statuses_filter) {
            if (this.apptStatuses.indexOf(apptStatus.value) === -1) {
              this.apptStatuses.push(apptStatus.value);
            }
          }
          this.allApptStatusSelected = true;
        }
      } else {
        this.allApptStatusSelected = false;
        const indx = this.apptStatuses.indexOf(value);
        if (indx === -1) {
          this.apptStatuses.push(value);
        } else {
          this.apptStatuses.splice(indx, 1);
        }
      }
      if (this.apptStatuses.length === this.check_in_statuses_filter.length) {
        this.filter['apptStatus'] = 'all';
        this.allApptStatusSelected = true;
      }
    }
    if (type === 'service') {
      if (value === 'all') {
        this.services = [];
        this.allServiceSelected = false;
        if (event.checked) {
          for (const service of this.service_list) {
            if (this.services.indexOf(service.id) === -1) {
              this.services.push(service.id);
            }
          }
          this.allServiceSelected = true;
        }
      } else {
        this.allServiceSelected = false;
        const indx = this.services.indexOf(value);
        if (indx === -1) {
          this.services.push(value);
        } else {
          this.services.splice(indx, 1);
        }
      }
      if (this.services.length === this.service_list.length) {
        this.filter['service'] = 'all';
        this.allServiceSelected = true;
      }
    }
    if (type === 'schedule') {
      if (value === 'all') {
        this.filteredSchedule = [];
        this.allScheduleSelected = false;
        if (event.checked) {
          for (const service of this.schedules) {
            if (this.filteredSchedule.indexOf(service.id) === -1) {
              this.filteredSchedule.push(service.id);
            }
          }
          this.allScheduleSelected = true;
        }
      } else {
        this.allScheduleSelected = false;
        const indx = this.filteredSchedule.indexOf(value);
        if (indx === -1) {
          this.filteredSchedule.push(value);
        } else {
          this.filteredSchedule.splice(indx, 1);
        }
      }
      if (this.filteredSchedule.length === this.schedules.length) {
        this.filter['schedule'] = 'all';
        this.allScheduleSelected = true;
      }
    }
    if (type === 'location') {
      if (value === 'all') {
        this.filterLocation = [];
        this.allLocationSelected = false;
        if (event.checked) {
          for (const q of this.locations) {
            if (this.filterLocation.indexOf(q.id) === -1) {
              this.filterLocation.push(q.id);
            }
          }
          this.allLocationSelected = true;
        }
      } else {
        this.allLocationSelected = false;
        const indx = this.filterLocation.indexOf(value);
        if (indx === -1) {
          this.filterLocation.push(value);
        } else {
          this.filterLocation.splice(indx, 1);
        }
      }
      if (this.filterLocation.length === this.locations.length) {
        this.filter['location'] = 'all';
        this.allLocationSelected = true;
      }
    }
    this.keyPressed();
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
    this.shared_functions.setFilter();
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  getTodayAppts() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getTodayAppointments(filter)
        .subscribe(
          (data: any) => {
            this.todayAppts = data;
            this.todayAppts.map((obj) => {
              obj.type = 1;
              return obj;
            });
            this.loading = false;
            this.setWaitlistForDisplay();
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
            this.futureAppts.map((obj) => {
              obj.type = 2;
              return obj;
            });
            this.loading = false;
            this.setWaitlistForDisplay();
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
            this.historyAppts.map((obj) => {
              obj.type = 3;
              return obj;
            });
            this.loading = false;
            this.setWaitlistForDisplay();
            resolve(data);
          });
    });
  }
  setDatas() {
    this.totalAppts = [];
    this.totalAppts = this.todayAppts.concat(this.futureAppts, this.historyAppts);
    this.handleApptSelectionType(this.timeType);
  }
  setWaitlistForDisplay() {
    if (this.timeType === 1) {
      this.apptToList = this.todayAppts;
    } else if (this.timeType === 2) {
      this.apptToList = this.futureAppts;
    } else {
      this.apptToList = this.historyAppts;
    }
  }
  refresh() {
    this.setWaitlistForDisplay();
    if (this.filterapplied && this.timeType !== 3) {
      this.doSearch('refresh');
    }
  }
  selectViewType(view) {
    this.selectedType = view;
  }
  handleApptSelectionType(type) {
    this.timeType = type;
    this.clearFilter();
    this.hideFilterSidebar();
  }
  apptClicked() {
    this.router.navigate(['provider', 'appointments', 'appointment'],
      { queryParams: { checkinType: 'WALK_IN_APPOINTMENT' } });
  }
  goBack() {
    this.location.back();
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(
        (data: any) => {
          const locations = data;
          this.locations = locations.filter(location => location.status === 'ACTIVE');
        });
  }
  getProviderSchedules() {
    let filter = { 'state-eq': 'ENABLED' };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getProviderSchedules(filter).subscribe(
      (schedules: any) => {
        this.schedules = schedules;
      });
  }
  getServices() {
    let filter = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getServicesList(filter)
      .subscribe(
        data => {
          this.service_list = data;
        },
        () => { }
      );
  }
}
