import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-provider-system-auditlogs',
  templateUrl: './provider-system-auditlogs.component.html'
  /*
  styleUrls: ['./provider-auditlogs.component.css']*/
})
export class ProviderSystemAuditLogComponent implements OnInit {

  select_cap = Messages.SELECT_CAP;
  search_cap = Messages.SEARCH_CAP;
  date_time_cap = Messages.DATE_TIME_CAP;
  text_cap = Messages.TEXT_CAP;
  subject_cap = Messages.SUBJECT_CAP;
  user_name_cap = Messages.USER_NAME_CAP;
  category_cap = Messages.AUDIT_CATEGORY_CAP;
  sub_category_cap = Messages.AUDIT_SUB_CTAEGORY_CAP;
  action_cap = Messages.AUDIT_ACTION_CAP;
  select_date_cap = Messages.AUDIT_SELECT_DATE_CAP;
  no_logs_cap = Messages.AUDIT_NO_LOGS_CAP;
  auditlog_details: any = [];
  load_complete = 0;
  api_loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  logCategories = projectConstants.AUDITLOG_FILTER_CATEGORIES;
  logSubcategories: any = [];
  logActions = projectConstants.AUDITLOG_FILTER_ACTION;
  logSelcat = '';
  logSelsubcat = '';
  logSeldate = '';
  logSelaction = '';
  filtericonTooltip = this.sharedfunctionObj.getProjectMesssages('FILTERICON_TOOPTIP');
  holdlogSelcat = '';
  holdlogSelsubcat = '';
  holdlogSeldate = '';
  holdlogSelaction = '';
  filterapplied;
  open_filter = false;
  filter = {
    date: null,
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  auditStatus = 1;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  tday = new Date();
  breadcrumb_moreoptions: any = [];
  minday = new Date(2015, 0, 1);
  breadcrumbs = [
    {
      title: 'Activity Log'
    }
  ];
  isCheckin;
  dateFilter = false;
  constructor(private sharedfunctionObj: SharedFunctions,
    private locationobj: Location,
    private shared_services: SharedServices,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    public date_format: DateFormatPipe
  ) { }

  ngOnInit() {
    // this.getAuditList();\
    const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.domain = user.sector;
    this.logSelcat = '';
    this.logSelsubcat = '';
    this.logSeldate = '';
    this.logSelaction = '';
    this.setSubcategories('');
    this.auditStatus = 4;

    this.holdlogSelcat = this.logSelcat;
    this.holdlogSelsubcat = this.logSelsubcat;
    this.holdlogSeldate = this.logSeldate;
    this.holdlogSelaction = this.logSelaction;
    this.getAuditListTotalCnt('', '', '', '');
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Learn More', 'type': 'learnmore' }]};
  }
  getAuditListTotalCnt(cat, subcat, action, sdate) {
    this.shared_services.getAuditLogsTotalCnt(cat, subcat, action, sdate)
      .subscribe(data => {
        this.totalCnt = data;
        if (this.totalCnt === 0) {
          this.auditStatus = 2;
        } else {
          this.auditStatus = 1;
          this.getAuditList(cat, subcat, action, sdate);
        }
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }
  getAuditList(cat, subcat, action, sdate) {
    let pageval;
    if (this.startpageval) {
      pageval = (this.startpageval - 1) * this.perPage;
    } else {
      pageval = 0;
    }
    this.auditlog_details = [];
    this.shared_services.getAuditLogs(cat, subcat, action, sdate, Number(pageval), this.perPage)
      .subscribe(data => {
        this.auditlog_details = data;
        this.auditStatus = 3;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 2;
          this.auditStatus = 0;
        });
  }

  goback() {
    this.locationobj.back();
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/downpanel']);
    }
}
  selectCategory() {
    this.logSelsubcat = '';
    this.setSubcategories(this.logSelcat);
  }
  setSubcategories(catid) {
    this.logSubcategories = [];
    if (catid === '') {
      for (let i = 0; i < this.logCategories.length; i++) {
        for (let j = 0; j < this.logCategories[i].subcat.length; j++) {
          this.logSubcategories.push({ name: this.logCategories[i].subcat[j].name, dispName: this.logCategories[i].subcat[j].dispName });
        }
      }
    } else {
      for (let j = 0; j < this.logCategories[catid].subcat.length; j++) {
        this.logSubcategories.push({ name: this.logCategories[catid].subcat[j].name, dispName: this.logCategories[catid].subcat[j].dispName });
      }
    }
  }
  do_search(pagecall) {
    if (pagecall === false) {
      this.holdlogSelcat = this.logSelcat;
      this.holdlogSelsubcat = this.logSelsubcat;
      this.holdlogSeldate = this.logSeldate;
      this.holdlogSelaction = this.logSelaction;
      this.startpageval = 1;
    }
    let seldate = '';
    if (this.holdlogSeldate) {
      seldate = this.date_format.transformTofilterDate(this.holdlogSeldate);
    }
    /*if (pagecall === false && this.holdlogSelcat === '' && this.holdlogSelsubcat === '' && this.holdlogSelaction === '' && seldate === '') {
      this.sharedfunctionObj.openSnackBar('Please select atleast one filter option', {'panelClass': 'snackbarerror'});
    } else { */
    let ccat = '';
    if (this.holdlogSelcat !== '') {
      ccat = this.logCategories[this.holdlogSelcat].name;
    }
    if (pagecall === false) {
      this.getAuditListTotalCnt(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
    } else {
      this.getAuditList(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
    }
    if (seldate !== '') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  handle_pageclick(pg) {
    this.startpageval = pg;
    this.do_search(true);
  }
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
    this.resetFilter();
    this.filterapplied = false;
    this.do_search(false);
  }
  resetFilter() {
    this.logSeldate = '';
  }
  filterClicked() {
    this.dateFilter = !this.dateFilter;
    if (!this.dateFilter) {
      this.logSeldate = '';
      this.do_search(false);
    }
  }
}
