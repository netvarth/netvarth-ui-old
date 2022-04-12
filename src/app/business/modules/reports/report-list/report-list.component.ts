import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { Router , NavigationExtras } from '@angular/router';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  tooltipcls = '';
  select_cap = Messages.SELECT_CAP;
  search_cap = Messages.SEARCH_CAP;
  date_time_cap = Messages.DATE_TIME_CAP;
  date_time_auditcap = Messages.DATE_TIME_AUDIT_CAP;
  text_cap = Messages.TEXT_CAP;
  subject_cap = Messages.SUBJECT_CAP;
  user_name_cap = Messages.USER_NAME_CAP;
  category_cap = Messages.AUDIT_CATEGORY_CAP;
  sub_category_cap = Messages.AUDIT_SUB_CTAEGORY_CAP;
  action_cap = Messages.AUDIT_ACTION_CAP;
  select_date_cap = Messages.AUDIT_SELECT_DATE_CAP;
  no_reports_cap = Messages.NO_REPORTS_CAP;
  auditlog_details: any = [];
  load_complete = 0;
  api_loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  auditStatus = 1;
  time_type = 1;
  filterapplied;
  filter_sidebar = false;
  open_filter = false;
  ackStatus = false;
  notAckStatus = false;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  tday = new Date();
  minday = new Date(2015, 0, 1);
  endminday = new Date(1900, 0, 1);
  maxDate = new Date();
  dateFilter = false;
  auditSelAck = [];
  dueDate = null;
  auditEnddate = null;
  holdauditSelAck = null;
  holdauditStartdate = null;
  holdauditEnddate = null;
  taskList: any = [];
  totalReportList: any = [];
  filtericonTooltip = '';
  searchTerm: any;
  reportCount;
  page = 1;
  page_count = projectConstants.PERPAGING_LIMIT;
  pagination: any = {
    startpageval: 1,
    totalCnt: this.totalReportList.length,
    perPage: 3
  };
  p: number = 1;
  config: any;
  count: number = 0;
  apiloading = false;
  filter = {
    status: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filters: any = {
    'status': false,
  };
  SEEN: boolean;
  INPROGRESS: boolean;
  DONE: boolean;
  NEW: boolean;
  constructor(
    private locationobj: Location,
    public router: Router,
    private lStorageService: LocalStorageService,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.totalReportList.length

    };
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
  }
  ngOnInit(): void {
    this.api_loading = false;
    this.getTotalReports();


  }

  getTotalReports(from_oninit = false) {
    this.api_loading = true;
    let filter = this.setFilterForApi();
    if (filter) {
      console.log(filter);
      this.lStorageService.setitemonLocalStorage('reportfilter', filter);
      this.provider_services.getReportList(filter).subscribe(
        (data: any) => {
          console.log(data);
          this.totalReportList = data
          this.api_loading = false;
        }
      );
    }
  }
  getTotalFilterReports(from_oninit = false) {
    this.api_loading = true;
    let filter = this.setFilterForApi();
    if (filter) {
      console.log(filter);
      this.lStorageService.setitemonLocalStorage('reportfilter', filter);
      this.provider_services.getTotalFilterReports(filter).subscribe(
        (data: any) => {
          console.log(data);
          this.totalReportList = data;
          this.api_loading = false;
        }
      );
    }
  }
  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage('reportfilter');
    if (filter) {
      api_filter = filter;
    }
   
    if (this.filter.status === 'SEEN') {
      api_filter = this.filter.status;
    }
    if (this.filter.status === 'INPROGRESS') {
      api_filter = this.filter.status;
    }
    if (this.filter.status === 'DONE') {
      api_filter = this.filter.status;
    }
    if (this.filter.status === 'NEW') {
      api_filter = this.filter.status;
    }
    return api_filter;
  }
  clearFilter() {
    this.filter.status = '';
    this.lStorageService.removeitemfromLocalStorage('reportfilter');
    this.resetFilter();
    this.getTotalReports();
    this.SEEN  = false;
    this.INPROGRESS  = false;
    this.DONE  = false;
    this.NEW  = false;
  }
  resetFilter() {
    this.filters = {
      'status': false,
    };
    this.filter = {
      status: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1,
    };
  }
  setFilterDataCheckbox(type, value) {
    if (type === 'status') {
      if (value === false) {
        this.INPROGRESS = false;
        this.SEEN = false;
        this.NEW = false;
        this.DONE = false;
        this.filter.status = ' ';
      }
      if (value === 'INPROGRESS') {
        this.INPROGRESS = true;
        this.SEEN = false;
        this.NEW = false;
        this.DONE = false;
        this.filter.status = 'INPROGRESS';

      }
      else if (value === 'SEEN') {
        this.INPROGRESS = false;
        this.SEEN = true;
        this.NEW = false;
        this.DONE = false;
        this.filter.status = 'SEEN';

      }
      else if (value === 'NEW') {
        this.INPROGRESS = false;
        this.SEEN = false;
        this.NEW = true;
        this.DONE = false;
        this.filter.status = 'NEW';

      }
      else if (value === 'DONE') {
        this.INPROGRESS = false;
        this.SEEN = false;
        this.NEW = false;
        this.DONE = true;
        this.filter.status = 'DONE';

      }
      else {
        this.INPROGRESS = false;
        this.SEEN = false;
        this.NEW = false;
        this.DONE = false;
        this.filter.status = '';
      }
    }
    this.doSearch();
  }
  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('reportfilter');
    if (this.filter.status) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
    console.log(this.filter_sidebar);
  }
  goback() {
    this.locationobj.back();
  }

  stopprop(event) {
    event.stopPropagation();
  }
  generatedReport(report) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        token: report.reportToken
      }
    };
      // this.lStorageService.setitemonLocalStorage('report', JSON.stringify(report));
      this.router.navigate(['provider', 'reports', 'generated-report'] , navigationExtras);
 
  }
}