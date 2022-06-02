import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';


@Component({
  selector: 'app-provider-system-auditlogs',
  templateUrl: './provider-system-auditlogs.component.html',
  styleUrls: ['./provider-system-auditlogs.component.css']
})
export class ProviderSystemAuditLogComponent implements OnInit {
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
  no_logs_cap = Messages.AUDIT_NO_LOGS_CAP;
  auditlog_details: any = [];
  load_complete = 0;
  api_loading = true;

  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  logActions = projectConstantsLocal.AUDITLOG_FILTER_ACTION;
  logCategories = projectConstantsLocal.AUDITLOG_FILTER_CATEGORIES;
  logSubcategories: any = [];
  
  logSelcat = '';
  logSelsubcat = '';
  logSeldate = '';
  logSelaction = '';
  filtericonTooltip = '';
  holdlogSelcat = '';
  holdlogSelsubcat = '';
  holdlogSeldate = '';
  holdlogSelaction = '';
  auditStatus = 1;
  filterapplied;
  filter_sidebar = false;
  open_filter = false;
  filter = {
    date: null,
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filters: any = {
    'date': false
  };
  ackStatus=false;
  notAckStatus = false;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  tday = new Date();
  minday = new Date(2015, 0, 1);
  endminday = new Date(1900, 0, 1);
  maxDate = new Date();
  isCheckin;
  dateFilter = false;
  auditSelAck = [];
  auditStartdate = null;
  auditEnddate = null;
  holdauditSelAck = null;
  holdauditStartdate = null;
  holdauditEnddate = null;

  constructor(
    private locationobj: Location,
    private shared_services: SharedServices,
    private routerobj: Router,
    public date_format: DateFormatPipe,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private sharedfunctionObj: SharedFunctions,
    private provider_servicesobj: ProviderServices,
    private shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService,

  ) { 
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
  }

  ngOnInit() {
    this.do_search(true);
    // this.getAuditList();\
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.logSelcat = '';
    this.logSelsubcat = '';
    this.logSeldate = '';
    this.logSelaction = '';
    this.setSubcategories('');
    this.auditSelAck = []; // default becuase maximise from footer alert panel
    this.auditStartdate = null;
    this.auditEnddate = null;
    this.auditStatus = 4;
    this.holdauditSelAck = this.auditSelAck.join(',');
    this.holdauditStartdate = this.auditStartdate;
    this.holdauditEnddate = this.auditEnddate;
    this.getAuditListTotalCnt('', '');
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }
  // getAuditListTotalCnt(cat, subcat, action, sdate) {
  //   this.shared_services.getAuditLogsTotalCnt(cat, subcat, action, sdate)
  //     .subscribe(data => {
  //       this.totalCnt = data;
  //       if (this.totalCnt === 0) {
  //         this.auditStatus = 2;
  //       } else {
  //         this.auditStatus = 1;
  //         this.getAuditList(cat, subcat, action, sdate);
  //       }
  //       this.api_loading = false;
  //     },
  //       () => {
  //         this.api_loading = false;
  //       });
  // }
  // getAuditList(cat, subcat, action, sdate) {
  //   let pageval;
  //   if (this.startpageval) {
  //     pageval = (this.startpageval - 1) * this.perPage;
  //   } else {
  //     pageval = 0;
  //   }
  //   this.auditlog_details = [];
  //   this.shared_services.getAuditLogs(cat, subcat, action, sdate, Number(pageval), this.perPage)
  //     .subscribe(data => {
  //       this.auditlog_details = data;
  //       this.auditStatus = 3;
  //     },
  //       error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //         this.load_complete = 2;
  //         this.auditStatus = 0;
  //       });
  // }

  goback() {
    this.locationobj.back();
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/auditlog']);
    }
}
redirecToHelp() {
  this.routerobj.navigate(['/provider/' + this.domain + '/auditlog']);
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
  // do_search(pagecall) {
  //   if (pagecall === false) {
  //     this.holdlogSelcat = this.logSelcat;
  //     this.holdlogSelsubcat = this.logSelsubcat;
  //     this.holdlogSeldate = this.logSeldate;
  //     this.holdlogSelaction = this.logSelaction;
  //     this.startpageval = 1;
  //   }
  //   let seldate = '';
  //   if (this.holdlogSeldate) {
  //     seldate = this.dateTimeProcessor.transformToYMDFormat(this.holdlogSeldate);
  //   }
  //   /*if (pagecall === false && this.holdlogSelcat === '' && this.holdlogSelsubcat === '' && this.holdlogSelaction === '' && seldate === '') {
  //     this.snackbarService.openSnackBar('Please select atleast one filter option', {'panelClass': 'snackbarerror'});
  //   } else { */
  //   let ccat = '';
  //   if (this.holdlogSelcat !== '') {
  //     ccat = this.logCategories[this.holdlogSelcat].name;
  //   }
  //   if (pagecall === false) {
  //     this.getAuditListTotalCnt(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
  //   } else {
  //     this.getAuditList(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
  //   }
  //   if (seldate !== '') {
  //     this.filterapplied = true;
  //   } else {
  //     this.filterapplied = false;
  //   }
  // }
  do_search(pagecall, status?) {
    this.endminday = this.auditStartdate;
    this.auditStatus = 1;
    if (status === 'ackStatus') {
      if (this.ackStatus === true) {
        if (this.auditSelAck.indexOf('true') === -1) {
          this.auditSelAck.push('true');
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf('true'), 1);
      }
    }
    if (status === 'notAckStatus') {
      if (this.notAckStatus === true) {
        if (this.auditSelAck.indexOf('false') === -1) {
          this.auditSelAck.push('false');
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf('false'), 1);
      }
    }
    if (pagecall === false) {
      this.startpageval = 1;
      this.holdauditSelAck = this.auditSelAck.join(',');
      this.holdauditStartdate = this.auditStartdate;
      this.holdauditEnddate = this.auditEnddate;
    }
    let startseldate = '';
    let endseldate = '';
    if (this.holdauditStartdate) {
      startseldate = this.dateTimeProcessor.transformToYMDFormat(this.holdauditStartdate);
    }
    if (this.holdauditEnddate) {
      endseldate = this.dateTimeProcessor.transformToYMDFormat(this.holdauditEnddate);
    }
    this.getAuditList(this.holdauditSelAck || '', startseldate, endseldate);
    if (endseldate !== '' || startseldate !== '' || this.notAckStatus || this.ackStatus) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  getAuditListTotalCnt( sdate, edate) {
    this.shared_services.getAuditFilterlogsTotalCnt(sdate, edate)
      .subscribe(data => {
        this.totalCnt = data;
        this.sharedfunctionObj.sendMessage({ 'ttype': 'alertCount', alertCnt: this.totalCnt });
        if (this.totalCnt === 0) {
          this.auditStatus = 2;
         // this.auditlog_details = [];
        } else {
          this.auditStatus = 1;
          this.getAuditList(this.auditSelAck.join(','), sdate, edate);
        }
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }
  getAuditList(ackStatus, sdate, edate) {
    let pageval;
    if (this.startpageval) {
      pageval = (this.startpageval - 1) * this.perPage;
    } else {
      pageval = 0;
    }
    this.auditlog_details = [];
    this.shared_services.getAuditFilterlogs( sdate, edate, Number(pageval), this.perPage)
      .subscribe(data => {
        this.auditlog_details = data;
        console.log("Log Data :",this.auditlog_details);
        if (this.auditlog_details.length > 0) {
          this.auditStatus = 3;
        } else {
          this.auditStatus = 2;
        }
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 2;
          this.auditStatus = 0;
        });
  }
  auditAcknowledge(obj) {
    this.provider_servicesobj.acknowledgeAlert(obj.id)
      .subscribe(() => {
        this.snackbarService.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
        this.getAuditListTotalCnt( this.holdauditStartdate, this.holdauditEnddate);
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
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
   // this.logSeldate = '';
    this.filters = {
      'date': false
    };
    this.auditEnddate = null;
    this.auditStartdate = null;
    this.auditSelAck = [];
    this.holdauditStartdate = null;
    this.holdauditEnddate = null;
    this.ackStatus = false;
    this.notAckStatus = false;

  }
  filterClicked() {
    this.dateFilter = !this.dateFilter;
    if (!this.dateFilter) {
     // this.logSeldate = '';
      this.filters = {
        'date': false
      };
      this.auditEnddate = null;
      this.auditStartdate = null;
      this.auditSelAck = [];
      this.holdauditStartdate = null;
      this.holdauditEnddate = null;
      this.ackStatus = false;
      this.notAckStatus = false;
      this.do_search(false);
    }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }

  keyPressed(){

    this.shared_functions.setFilter();
    this.lStorageService.removeitemfromLocalStorage('filter');

    if (this.auditStartdate || this.auditEnddate) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    
  }
}

