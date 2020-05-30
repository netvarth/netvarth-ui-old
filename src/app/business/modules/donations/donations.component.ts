import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
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
    filter = {
        first_name: '',
        date: null,
        mobile: '',
        email: '',
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
    donationSelection = 0;
    donationsSelected: any = [];
    donations: any = [];
    selectedIndex: any = [];
    customer_label = '';
    donations_count;
    selectedcustomersformsg: any;
    constructor(private provider_services: ProviderServices,
        private router: Router,
        private provider_shared_functions: ProviderSharedFuctions,
        public dateformat: DateFormatPipe,
        private routerobj: Router,
        private shared_functions: SharedFunctions) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        // this.breadcrumbs_init = [
        //     {
        //         title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
        //     }
        // ];
        // this.breadcrumbs = this.breadcrumbs_init;
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.getDonationsList(true);
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
    getDonationsList(from_oninit = false) {
        let filter = this.setFilterForApi();
        filter ['donationStatus-eq'] = 'SUCCESS';
        // filter ['sort_date'] = 'desc';
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
        if (this.filter.first_name || this.filter.date || this.filter.mobile || this.filter.email) {
            this.filterapplied = true;
        } else {
            this.filterapplied = false;
        }
    }
    resetFilter() {
        this.filters = {
            'first_name': false,
            'date': false,
            'mobile': false,
            'email': false
        };
        this.filter = {
            first_name: '',
            date: null,
            mobile: '',
            email: '',
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
        // if (this.filter.first_name !== '') {
        //     api_filter['firstName-eq'] = this.filter.first_name;
        // }
        // if (this.filter.date != null) {
        //     api_filter['date-eq'] = this.dateformat.transformTofilterDate(this.filter.date);
        // }
        // if (this.filter.email !== '') {
        //     api_filter['email-eq'] = this.filter.email;
        // }
        // if (this.filter.mobile !== '') {
        //     const pattern = projectConstants.VALIDATOR_NUMBERONLY;
        //     const mval = pattern.test(this.filter.mobile);
        //     if (mval) {
        //         api_filter['primaryMobileNo-eq'] = this.filter.mobile;
        //     } else {
        //         this.filter.mobile = '';
        //     }
        // }
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
}
