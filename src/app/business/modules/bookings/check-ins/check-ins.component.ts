import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import * as moment from 'moment';
import { projectConstants } from '../../../../app.component';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

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
  check_in_statuses_filter = projectConstantsLocal.CHECK_IN_STATUSES_FILTER;
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'PartiallyRefunded', value: 'Partially Refunded' },
    { pk: 'FullyRefunded', value: 'Fully Refunded' },
    { pk: 'Refund', value: 'Refund' }
  ];
  waitlistModes = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in Check-in' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in Check-in' },
    { mode: 'ONLINE_CHECKIN', value: 'Online Check-in' },
  ];
  waitlistModesToken = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in Token' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in Token' },
    { mode: 'ONLINE_CHECKIN', value: 'Online Token' },
  ];
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    checkinEncId: '',
    patientId: '',
    queue: 'all',
    location: 'all',
    service: 'all',
    waitlist_status: 'all',
    waitlistMode: 'all',
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
    checkinEncId: false,
    patientId: false,
    queue: false,
    location: false,
    service: false,
    waitlist_status: false,
    payment_status: false,
    waitlistMode: false,
    check_in_start_date: false,
    check_in_date: false,
    check_in_end_date: false,
    location_id: false
  };
  customer_label = '';
  provider_label = '';
  queues: any = [];
  labelFilterData = '';
  filter_sidebar = false;
  filterapplied = false;
  providerLabels: any = [];
  services: any = [];
  apptModes: any = [];
  paymentStatuses: any = [];
  apptStatuses: any = [];
  allModeSelected = false;
  allLabelSelected: any = [];
  allPayStatusSelected = false;
  allApptStatusSelected = false;
  allServiceSelected = false;
  allQSelected = false;
  allLocationSelected = false;
  filterService: any = [];
  filterQ: any = [];
  filterLocation: any = [];
  selectedLabels: any = [];
  customerIdTooltip = '';
  endminday;
  maxday = new Date();
  endmaxday = new Date();
  allLabels: any = [];
  locations: any = [];
  filtericonTooltip = '';
  tomorrowDate;
  server_date;
  timeTypeTemp = 1;
  constructor(private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private router: Router, private location: Location,
    private shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private lStorageService: LocalStorageService) {
    this.activated_route.queryParams.subscribe(params => {
      if (params.providerId) {
        this.providerId = JSON.parse(params.providerId);
      }
    });
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'todayWl':
          this.todayWaitlists = this.todayWaitlists.concat(message.data);
          if (message.data && message.data.length > 0) {
            this.refresh();
          }
          break;
        case 'futureWl':
          this.futureWaitlists = this.futureWaitlists.concat(message.data);
          if (message.data && message.data.length > 0) {
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
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' Id';
    this.getTomorrowDate();
    this.getProviderSettings();
    this.getProviderLocations();
    this.getQs();
    this.getServices();
    this.getLabel();
    this.doSearch();
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
        if (this.waitlistMgrSettings.showTokenId) {
          this.waitlistModes = this.waitlistModesToken;
        }
      });
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
    if (this.filter.checkinEncId !== '') {
      api_filter['checkinEncId-eq'] = this.filter.checkinEncId;
    }
    if (this.filter.patientId !== '') {
      api_filter['waitlistingFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
    }
    if (this.filterService.length > 0 && this.filter.service !== 'all') {
      api_filter['service-eq'] = this.filterService.toString();
    }
    if (this.apptStatuses.length > 0 && this.filter.waitlist_status !== 'all') {
      api_filter['waitlistStatus-eq'] = this.apptStatuses.toString();
    }
    if (this.apptModes.length > 0 && this.filter.waitlistMode !== 'all') {
      api_filter['waitlistMode-eq'] = this.apptModes.toString();
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
      api_filter['billPaymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.timeType === 3) {
      if (this.filterQ.length > 0 && this.filter.queue !== 'all') {
        api_filter['queue-eq'] = this.filterQ.toString();
      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
      }
    }
    if (this.filter.waitlist_status === 'all') {
      api_filter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    }
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
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
  getTodayWatilists() {
    return new Promise((resolve) => {
      const filter = this.setFilters();
      this.provider_services.getTodayWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.todayWaitlists = data;
            this.loading = false;
            this.setWaitlistForDisplay();
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
            this.loading = false;
            this.setWaitlistForDisplay();
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
            this.loading = false;
            this.setWaitlistForDisplay();
            resolve(data);
          });
    });
  }
  handleWaitlistType(type) {
    const timetype = this.timeType;
    this.clearFilter(timetype);
    this.timeType = type;
    this.setWaitlistForDisplay();
    this.hideFilterSidebar();
  }
  refresh() {
    this.setWaitlistForDisplay();
    if (this.filterapplied) {
      this.doSearch();
    }
  }
  setWaitlistForDisplay() {
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
  doSearch(type?) {
    type = (type) ? type : this.timeType;
    switch (type) {
      case 1: this.getTodayWatilists();
        break;
      case 2: this.getFutureWatilists();
        break;
      case 3: this.getHistoryWaitlists();
        break;
    }
  }
  clearFilter(type?) {
    this.resetFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.doSearch(type);
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      checkinEncId: false,
      patientId: false,
      queue: false,
      location: false,
      service: false,
      waitlist_status: false,
      payment_status: false,
      waitlistMode: false,
      check_in_start_date: false,
      check_in_end_date: false,
      check_in_date: false,
      location_id: false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      checkinEncId: '',
      patientId: '',
      queue: 'all',
      location: 'all',
      service: 'all',
      waitlist_status: 'all',
      payment_status: 'all',
      waitlistMode: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      check_in_date: null,
      location_id: 'all'
    };
    this.labelFilterData = '';
  }
  resetFilterValues() {
    this.filterService = [];
    this.apptStatuses = [];
    this.filterQ = [];
    this.filterLocation = [];
    this.selectedLabels = [];
    this.paymentStatuses = [];
    this.apptModes = [];
    this.allServiceSelected = false;
    this.allApptStatusSelected = false;
    this.allPayStatusSelected = false;
    this.allModeSelected = false;
    this.allLabelSelected = [];
    this.allQSelected = false;
    this.allLocationSelected = false;
  }
  keyPressed() {
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = new Date();
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.checkinEncId || this.filter.patientId || this.filter.service !== 'all' || this.filter.location != 'all'
      || this.filter.queue !== 'all' || this.filter.payment_status !== 'all' || this.filter.waitlistMode !== 'all' || this.filter.check_in_start_date
      || this.filter.check_in_end_date || this.filter.check_in_date || this.filter.waitlist_status !== 'all' || this.labelFilterData !== '') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.shared_functions.setFilter();
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
    if (type === 'waitlistMode') {
      if (value === 'all') {
        this.apptModes = [];
        this.allModeSelected = false;
        if (event.checked) {
          for (const mode of this.waitlistModes) {
            if (this.apptModes.indexOf(mode.mode) === -1) {
              this.apptModes.push(mode.mode);
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
      if (this.apptModes.length === this.waitlistModes.length) {
        this.filter['waitlistMode'] = 'all';
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
    if (type === 'waitlist_status') {
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
        this.filter['waitlist_status'] = 'all';
        this.allApptStatusSelected = true;
      }
    }
    if (type === 'service') {
      if (value === 'all') {
        this.filterService = [];
        this.allServiceSelected = false;
        if (event.checked) {
          for (const service of this.services) {
            if (this.filterService.indexOf(service.id) === -1) {
              this.filterService.push(service.id);
            }
          }
          this.allServiceSelected = true;
        }
      } else {
        this.allServiceSelected = false;
        const indx = this.filterService.indexOf(value);
        if (indx === -1) {
          this.filterService.push(value);
        } else {
          this.filterService.splice(indx, 1);
        }
      }
      if (this.filterService.length === this.services.length) {
        this.filter['service'] = 'all';
        this.allServiceSelected = true;
      }
    }
    if (type === 'queue') {
      if (value === 'all') {
        this.filterQ = [];
        this.allQSelected = false;
        if (event.checked) {
          for (const q of this.queues) {
            if (this.filterQ.indexOf(q.id) === -1) {
              this.filterQ.push(q.id);
            }
          }
          this.allQSelected = true;
        }
      } else {
        this.allQSelected = false;
        const indx = this.filterQ.indexOf(value);
        if (indx === -1) {
          this.filterQ.push(value);
        } else {
          this.filterQ.splice(indx, 1);
        }
      }
      if (this.filterQ.length === this.queues.length) {
        this.filter['queue'] = 'all';
        this.allQSelected = true;
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
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
    this.shared_functions.setFilter();
  }
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe((data: any) => {
        this.locations = data.filter(location => location.status === 'ACTIVE');
      });
  }
  getServices() {
    let filter = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getServicesList(filter)
      .subscribe(data => {
        this.services = data;
      });
  }
  getQs() {
    let filter = { 'queueState-eq': 'ENABLED' };
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.getProviderQueues(filter)
      .subscribe(data => {
        this.queues = data;
      });
  }
  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }
}
