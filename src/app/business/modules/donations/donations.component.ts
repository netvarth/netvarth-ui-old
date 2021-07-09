import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  'selector': 'app-donations',
  'templateUrl': './donations.component.html'
})
export class DonationsComponent implements OnInit {
  filter_sidebar = false;
  filterapplied = false;
  check_status;
  filter = {
    first_name: '',
    last_name: '',
    date: null,
    service: '',
    location: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn
  domain;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  loadComplete = false;
  minday = new Date(2015, 0, 1);
  maxday = new Date();
  tooltipcls = projectConstants.TOOLTIP_CLS;
  date_cap = Messages.DATE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  filters: any = {
    'first_name': false,
    'last_name': false,
    'date': false,
    'service': false,
    'location': false
  };
  donationsSelected: any = [];
  donations: any = [];
  donationServices: any = [];
  donations_count;
  selectedDonations: any;
  locations: any;
  services: any = [];
  selectedLocations: any = [];
  selectAll = false;
  filtericonTooltip: any;
  apiloading = true;
  constructor(private provider_services: ProviderServices,
    public dateformat: DateFormatPipe, private provider_shared_functions: ProviderSharedFuctions,
    private routerobj: Router, private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
  }
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getServiceList();
    this.getLocationList();
    this.getDonationsList();
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/donations']);
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/donations']);
  }
  getServiceList() {
    const filter1 = { 'serviceType-eq': 'donationService' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.donationServices = data;
        },
        () => { }
      );
  }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    if (type === 'service') {
      const indx = this.services.indexOf(value);
      if (indx === -1) {
        this.services.push(value);
      } else {
        this.services.splice(indx, 1);
      }
    }
    if (type === 'location') {
      const indx = this.selectedLocations.indexOf(value);
      if (indx === -1) {
        this.selectedLocations.push(value);
      } else {
        this.selectedLocations.splice(indx, 1);
      }
    }
    this.doSearch();
  }
  getDonationsList(from_oninit = true) {
    this.selectedDonations = [];
    this.donationsSelected = [];
    this.selectAll = false;
    let filter = this.setFilterForApi();
    this.getDonationsCount(filter)
      .then(
        result => {
          if (from_oninit) { this.donations_count = result; }
          filter = this.setPaginationFilter(filter);
          this.provider_services.getDonations(filter)
            .subscribe(
              data => {
                this.donations = data;
                this.loadComplete = true;
                this.apiloading = false;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete = true;
                this.apiloading = false;
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.getDonationsList(true);
  }
  getDonationsCount(filter) {
    return new Promise((resolve, reject) => {
      this.provider_services.getDonationsCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.donations_count = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getDonationsList();
  }
  doSearch() {
    if (this.filter.first_name || this.filter.last_name || this.filter.date || this.filter.service || this.filter.location) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  resetFilter() {
    this.filters = {
      'first_name': false,
      'last_name': false,
      'date': false,
      'service': false,
      'location': false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      date: null,
      service: '',
      location: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
    this.services = [];
    this.selectedLocations = [];
  }
  setPaginationFilter(api_filter) {
    if (this.donations_count <= 10) {
      this.pagination.startpageval = 1;
    }
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.first_name !== '') {
      api_filter['donor-like'] = 'firstName::' + this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['donor-like'] = 'lastName::' + this.filter.last_name;
    }
    if (this.filter.date != null) {
      api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.date);
    }
    if (this.services.length > 0) {
      api_filter['service-eq'] = this.services.toString();
    }
    if (this.selectedLocations.length > 0) {
      api_filter['location-eq'] = this.selectedLocations.toString();
    }
    return api_filter;
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  selectDonations(index) {
    this.selectedDonations = [];
    if (this.donationsSelected[index]) {
      delete this.donationsSelected[index];
    } else {
      this.donationsSelected[index] = true;
    }
    for (let i = 0; i < this.donationsSelected.length; i++) {
      if (this.donationsSelected[i]) {
        if (this.selectedDonations.indexOf(this.donations[i]) === -1) {
          this.selectedDonations.push(this.donations[i]);
        }
      }
    }
    if (this.donations.length === this.selectedDonations.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  selectAllDonations() {
    if (!this.selectAll) {
      this.selectAll = true;
      for (let i = 0; i < this.donations.length; i++) {
        this.donationsSelected[i] = true;
        if (this.selectedDonations.indexOf(this.donations[i]) === -1) {
          this.selectedDonations.push(this.donations[i]);
        }
      }
    } else {
      this.selectAll = false;
      this.donationsSelected = [];
      this.selectedDonations = [];
    }
  }
  addInboxMessage() {
    let customerlist = [];
    customerlist = this.selectedDonations;
    this.provider_shared_functions.ConsumerInboxMessage(customerlist, 'donation-list')
      .then(
        () => { },
        () => { }
      );
  }
  getLocationList() {
    const self = this;
    return new Promise<void>(function (resolve, reject) {
      self.provider_services.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                self.locations.push(loc);
              }
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
  showConsumerNote(donation) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: donation,
        type: 'donation'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  gotoDonation(donation) {
    this.routerobj.navigate(['provider', 'donations', donation.uid]);
  }
}
