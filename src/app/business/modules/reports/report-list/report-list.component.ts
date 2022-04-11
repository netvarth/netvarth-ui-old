import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { Router , NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
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
  filter = {
    status: '',
    category: '',
    type: '',
    dueDate: '',
    pinCode: '',
    primaryMobileNo: '',
    employeeId: '',
    email: '',
    userType: '',
    available: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1

  };

  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
  };
  constructor(
    private locationobj: Location,
    public router: Router,
    private provider_services: ProviderServices,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
  }

  ngOnInit(): void {
    this.api_loading = false;
    this.getTotalReports();

    this.doSearch();


  }
  getTotalReports() {
    this.provider_services.getReportList().subscribe(
      (data: any) => {
        this.totalReportList = data;
        console.log(this.totalReportList)
        console.log(this.totalReportList.length)
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
 

  goback() {
    this.locationobj.back();
  }


  doSearch() {
    // this.getUsers();
    this.lStorageService.removeitemfromLocalStorage('taskfilter');
    if (this.filter.status || this.filter.category || this.filter.type || this.filter.dueDate) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }

  // handle_pageclick(pg) {
  //   this.startpageval = pg;
  //   this.do_search(true);
  // }
  getperPage() {
    return this.perPage;
  }
  gettotalCnt() {
    return this.totalCnt;
  }
  getcurpageVal() {
    return this.startpageval;
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  clearFilter() {
    this.lStorageService.removeitemfromLocalStorage('userfilter');
    this.resetFilter();
    this.filterapplied = false;
    // this.getUsers();
  }
  resetFilter() {
    this.filters = {
      'status': false,
      'category': false,
      'type': false,
      'dueDate': false,
    };
    // this.filter = {
    //     status: '',
    //     category: '',
    //     type: '',
    //     dueDate: '',

    // };
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
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