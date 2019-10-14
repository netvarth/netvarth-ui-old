import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { AddProviderCustomerComponent } from '../../../../ynw_provider/components/add-provider-customer/add-provider-customer.component';
import { SearchProviderCustomerComponent } from '../../../../ynw_provider/components/search-provider-customer/search-provider-customer.component';
import { MatDialog } from '@angular/material';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html'
})

export class CustomersListComponent implements OnInit {
    first_name_cap = Messages.FIRST_NAME_CAP;
    email_cap = Messages.SERVICE_EMAIL_CAP;
    date_cap = Messages.DATE_COL_CAP;
    name_cap = Messages.COMMN_NAME_CAP;
    mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
    last_visit_cap = Messages.LAST_VISIT_CAP;
    customers: any = [];
    customer_count: any = 0;
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
    customer_label = '';
    no_customer_cap = '';
    checkin_label = '';
    checkedin_label = '';
    domain;
    breadcrumb_moreoptions: any = [];
    breadcrumbs_init = [
        {
            title: this.customer_label
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
    apiloading = false;
    srchcustdialogRef;
    crtCustdialogRef;
    calculationmode;
    showToken = false;
    filters: any = {
        'first_name': false,
        'date': false,
        'mobile': false,
        'email': false
    };


    constructor(private provider_services: ProviderServices,
        public dialog: MatDialog,
        public dateformat: DateFormatPipe,
        private routerobj: Router,
        private shared_functions: SharedFunctions) {
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.no_customer_cap = Messages.NO_CUSTOMER_CAP.replace('[customer]', this.customer_label);
        this.breadcrumbs_init = [
            {
                title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
            }
        ];
        this.breadcrumbs = this.breadcrumbs_init;
        this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
        // this.checkedin_label = this.shared_functions.getTerminologyTerm('waitlisted');
        this.checkedin_label = Messages.CHECKED_IN_LABEL;
    }
    ngOnInit() {
        const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
        this.domain = user.sector;
        this.getCustomersList(true);
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]};
        this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
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
            this.routerobj.navigate(['/provider/' + this.domain + '/customer']);
        }
    }
    getCustomersList(from_oninit = false) {
        let filter = this.setFilterForApi();
        this.getCustomersListCount(filter)
            .then(
                result => {
                    if (from_oninit) { this.customer_count = result; }
                    filter = this.setPaginationFilter(filter);
                    this.provider_services.getProviderCustomers(filter)
                        .subscribe(
                            data => {
                                this.customers = data;
                                this.loadComplete = true;
                            },
                            error => {
                                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        this.getCustomersList(true);
    }
    getCustomersListCount(filter) {
        return new Promise((resolve, reject) => {
            this.provider_services.getProviderCustomersCount(filter)
                .subscribe(
                    data => {
                        this.pagination.totalCnt = data;
                        this.customer_count = this.pagination.totalCnt;
                        resolve(data);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
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
        this.getCustomersList();
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
        if (this.filter.email !== '') {
            api_filter['email-eq'] = this.filter.email;
        }
        if (this.filter.mobile !== '') {
            const pattern = projectConstants.VALIDATOR_NUMBERONLY;
            const mval = pattern.test(this.filter.mobile);
            if (mval) {
                api_filter['primaryMobileNo-eq'] = this.filter.mobile;
            } else {
                this.filter.mobile = '';
            }
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
    searchCustomer(source) {
        this.srchcustdialogRef = this.dialog.open(SearchProviderCustomerComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'checkin-provider'],
            disableClose: true,
            data: {
                source: source,
                calc_mode: this.calculationmode,
                showToken: this.showToken
            }
        });
        this.srchcustdialogRef.afterClosed().subscribe(result => {
            if (result && result.message) {
                this.createCustomer(result.data);
            }
        });
    }
    createCustomer(search_data) {
        this.crtCustdialogRef = this.dialog.open(AddProviderCustomerComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'checkin-provider'],
            disableClose: true,
            data: {
                search_data: search_data
            }
        });
        this.crtCustdialogRef.afterClosed().subscribe(result => {

        });
    }
}

