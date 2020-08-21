import { Component, OnInit, HostListener } from '@angular/core';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    'selector': 'app-donations',
    'templateUrl': './donations.component.html'
})
export class DonationsComponent implements OnInit {
    filter_sidebar = false;
    filterapplied = false;
    open_filter = false;
    check_status;
    filter = {
        first_name: '',
        date: null,
        service: '',
        page_count: projectConstants.PERPAGING_LIMIT,
        page: 1
    }; // same in resetFilter Fn
    domain;
    breadcrumb_moreoptions: any = [];
    breadcrumbs_init = [
        {
            title: 'Donations'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    pagination: any = {
        startpageval: 1,
        totalCnt: 0,
        perPage: this.filter.page_count
    };
    isCheckin;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    loadComplete = false;
    minday = new Date(2015, 0, 1);
    filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
    filtericonclearTooltip = this.shared_functions.getProjectMesssages('FILTERICON_CLEARTOOLTIP');
    tooltipcls = projectConstants.TOOLTIP_CLS;
    date_cap = Messages.DATE_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    apiloading = false;
    filters: any = {
        'first_name': false,
        'date': false,
        'mobile': false,
        'email': false
    };
    selected = 0;
    donationSelection = 0;
    donationsSelected: any = [];
    donations: any = [];
    selectedIndex: any = [];
    donationServices: any = [];
    customer_label = '';
    donations_count;
    selectedcustomersformsg: any;
    show_loc = false;
    locations: any;
    selected_loc_id: any;
    services: any = [];
    selected_location = null;
    screenWidth;
    small_device_display = false;
    constructor(private provider_services: ProviderServices,
        public dateformat: DateFormatPipe,
        private routerobj: Router,
        private shared_functions: SharedFunctions) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.onResize();
        // this.breadcrumbs_init = [
        //     {
        //         title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
        //     }
        // ];
        // this.breadcrumbs = this.breadcrumbs_init;
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 767) {
      } else {
        this.small_device_display = false;
      }
      if (this.screenWidth <= 1040) {
        this.small_device_display = true;
      } else {
        this.small_device_display = false;
      }
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getServiceList();
        this.getDonationsList(true);
        this.getLocationList();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    }
    filterClicked(type) {
        this.filters[type] = !this.filters[type];
        if (!this.filters[type]) {
            if (type === 'date') {
                this.filter[type] = null;
            } else {
                this.filter[type] = '';
            }
            this.doSearch();
        }
    }
    routeLoadIndicator(e) {
        this.apiloading = e;
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/donations']);
        }
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
    //   setFilterData(type, status) {
    //     let passingStatus;
    //     if (status && this.selected === 0) {
    //       this.selected = 1;
    //       this.donationServices.push(status);
    //       passingStatus = this.donationServices.toString();
    //       this.filter[type] = passingStatus;
    //       this.doSearch();
    //     } else if (status && this.selected === 1) {
    //       if (this.donationServices.indexOf(status) !== -1) {
    //         const indexofStatus = this.donationServices.indexOf(status);
    //         if (indexofStatus >= 0) {
    //         }
    //         passingStatus = this.donationServices.toString();
    //         this.filter[type] = passingStatus;
    //         if(this.filter[type] === ''){
    //         this.resetFilter();
    //         }
    //         this.doSearch();

    //       }
    //        else {
    //         this.donationServices.push(status);
    //         passingStatus = this.donationServices.toString();
    //         this.filter[type] = passingStatus;
    //         this.doSearch();
    //       }

    //     }
    // }
    setFilterDataCheckbox(type, value, event) {
        this.filter[type] = value;
        const indx = this.services.indexOf(value);
        if (indx === -1) {
            this.services.push(value);
        } else {
            this.services.splice(indx, 1);
        }
        this.doSearch();
    }
    getDonationsList(from_oninit = false, loc?) {
        let filter = this.setFilterForApi();
        filter['donationStatus-eq'] = 'SUCCESS';
        if (loc && loc.id) {
            filter['location-eq'] = loc.id;
            this.show_loc = false;
        }
        this.locationSelected(loc);
        this.getDonationsCount(filter)
            .then(
                result => {
                    if (from_oninit) { this.donations_count = result; }
                    filter = this.setPaginationFilter(filter);
                    this.provider_services.getDonations(filter)
                        .subscribe(
                            data => {
                                this.donations = data;
                                if (loc && loc.id) {
                                    this.selected_loc_id = loc.id;
                                }
                                this.loadComplete = true;
                            },
                            error => {
                                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                                this.loadComplete = true;
                            }
                        );
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    clearFilter() {
        this.services = [];
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
    stringtoDate(dt, mod) {
        return this.shared_functions.stringtoDate(dt, mod);
    }
    toggleFilter() {
        this.open_filter = !this.open_filter;
    }
    handle_pageclick(pg) {
        this.pagination.startpageval = pg;
        this.filter.page = pg;
        this.doSearch();
    }
    doSearch() {
        this.getDonationsList();
        if (this.filter.first_name || this.filter.date || this.filter.service) {
            this.filterapplied = true;
        } else {
            this.filterapplied = false;
        }
    }
    resetFilter() {
        this.filters = {
            'first_name': false,
            'date': false,
            'service': false
        };
        this.filter = {
            first_name: '',
            date: null,
            service: '',
            page_count: projectConstants.PERPAGING_LIMIT,
            page: 1
        };
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
            api_filter['firstName-eq'] = this.filter.first_name;
        }
        if (this.filter.date != null) {
            api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.date);
        }
        if (this.services.length > 0) {
            api_filter['service-eq'] = this.services.toString();
        }

        return api_filter;
    }
    focusInput(ev, input) {
        const kCode = parseInt(ev.keyCode, 10);
        if (kCode === 13) {
            input.focus();
            this.doSearch();
        }
    }
    showFilterSidebar() {
        this.show_loc = false;
        this.filter_sidebar = true;
    }
    hideFilterSidebar() {
        this.filter_sidebar = false;
    }

    selectDonations(index) {
        this.selectedcustomersformsg = [];
        if (this.donationsSelected[index]) {
            delete this.donationsSelected[index];
            this.donationSelection--;
        } else {
            this.donationsSelected[index] = true;
            this.donationSelection++;
        }
        if (this.donationSelection === 1) {
            // this.customers[this.customerSelected.indexOf(true)];
        }
        for (let i = 0; i < this.donationsSelected.length; i++) {
            if (this.donationsSelected[i]) {
                if (this.selectedcustomersformsg.indexOf(this.donations[i]) === -1) {
                    this.selectedcustomersformsg.push(this.donations[i]);
                }
            }
        }
    }
    getLocationList() {
        const self = this;
        // this.provider_services.getProviderLocations()
        //     .subscribe((data: any) => {
        //         this.locations = data;
        //     }
        //     );
        return new Promise(function (resolve, reject) {
            self.selected_location = null;
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
                  const cookie_location_id = self.shared_functions.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
                  if (cookie_location_id === '') {
                    if (self.locations[0]) {
                      self.locationSelected(self.locations[0]).then(
                        (schedules: any) => {
                        }
                      );
                    }
                  } else {
                    self.selectLocationFromCookies(parseInt(cookie_location_id, 10));
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
    locationSelected(location) {
        this.selected_location = location;
        // const _this = this;
        if (this.selected_location) {
          this.shared_functions.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
        }
        this.shared_functions.setitemToGroupStorage('loc_id', this.selected_location);
        return new Promise(function (resolve, reject) {
        });
      }
      selectLocationFromCookies(cookie_location_id) {
        this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
          (schedules: any) => {
          }
        );
      }
      selectLocationFromCookie(cookie_location_id) {
        let selected_location = null;
        for (const location of this.locations) {
          if (location.id === cookie_location_id) {
            selected_location = location;
          }
        }
        return (selected_location !== null) ? selected_location : this.locations[0];
      }

    showFilterLocation() {
        this.filter_sidebar = false;
        this.show_loc = !this.show_loc;
    }
}
