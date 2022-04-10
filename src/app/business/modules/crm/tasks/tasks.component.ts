import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
// import { CrmMarkasDoneComponent } from '../../../../../../src/app/business/shared/crm-markas-done/crm-markas-done.component';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
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
  no_tasks_cap = Messages.AUDIT_NO_TASKS_CAP;
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
  totalTaskList: any = [];
  totalInprogressList: any = [];
  totalCompletedList: any = [];
  totalDelayedList: any = [];
  selectedTab;
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
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
  };
  msg = 'Do you really want to mark as done this task? ';
  totalCount: any;
  inprogressCount: any;
  completedCount: any;
  delayedCount: any;
  page = 1;
  constructor(
    private locationobj: Location,
    private groupService: GroupStorageService,
    public router: Router,
    // private dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,

  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');

  }

  ngOnInit() {
    this.api_loading = false;
    if (this.groupService.getitemFromGroupStorage('tabIndex')) {
      this.selectedTab = this.groupService.getitemFromGroupStorage('tabIndex');
    } else {
      this.selectedTab = 1;
    }
    this.getTotalTaskCount();
    this.getTotalTask();
    this.getInprogressTask();
    this.getCompletedTask();
    this.getDelayedTask();
    // this.doSearch();
  }
  getTotalTaskCount() {
    this.crmService.getTotalTaskCount()
      .subscribe(
        data => {
          this.pagination.totalCnt = data;
          const pgefilter = {
            'from': 0,
            'count': this.pagination.totalCnt,
          };
          this.setPaginationFilter(pgefilter);
          this.getTotalTask(pgefilter);
        });
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = ((this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0);
    api_filter['count'] = this.pagination.perPage;
    return api_filter;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.page = pg;
    const pgefilter = {
      'from': this.pagination.startpageval,
      'count': this.pagination.totalCnt,
    };
    this.setPaginationFilter(pgefilter);
    this.getTotalTask(pgefilter);
  }
  getTotalTask(pgefilter?) {
    this.api_loading = true;
    //  const filter = { 'scope-eq': 'account' };
    this.crmService.getTotalTask(pgefilter)
      .subscribe(
        data => {
          this.totalTaskList = data;
          this.api_loading = false;
        },
        error => {
          this.api_loading = false;
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }

  getInprogressTask() {
    this.crmService.getInprogressTask().subscribe(
      (data: any) => {
        this.totalInprogressList = data;
        this.inprogressCount = this.totalInprogressList.length;

      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getCompletedTask() {
    this.crmService.getCompletedTask().subscribe(
      (data: any) => {
        this.totalCompletedList = data;
        this.completedCount = this.totalCompletedList.length;
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }

  getDelayedTask() {
    this.crmService.getDelayedTask().subscribe(
      (data: any) => {
        this.totalDelayedList = data;

        if (this.totalDelayedList.length === 0) {
          this.delayedCount = 0;
        }
        else {
          this.delayedCount = this.totalDelayedList.length;
        }
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }

  goback() {
    this.locationobj.back();
  }


  doSearch() {

    this.lStorageService.removeitemfromLocalStorage('taskfilter');
    if (this.filter.status || this.filter.category || this.filter.type || this.filter.dueDate) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }

  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  clearFilter() {
    this.lStorageService.removeitemfromLocalStorage('taskfilter');
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
  tabChange(event) {
    this.setTabSelection(event.index + 1);
  }
  setTabSelection(type) {
    this.selectedTab = type;
    this.groupService.setitemToGroupStorage('tabIndex', this.selectedTab);
    switch (type) {
      case 1: {
        this.getTotalTask();
        break;
      }
      case 2: {
        this.getInprogressTask();

        break;
      }
      case 3: {
        this.getCompletedTask();

        break;
      }
      case 4: {
        this.getDelayedTask();

        break;
      }
    }
  }

  viewTask(taskUid) {
    this.router.navigate(['/provider/viewtask/' + taskUid]);

  }

  createTask(createText: any) {
    this.crmService.taskActivityName = createText;
    this.router.navigate(['provider', 'task', 'create-task'])
  }
  stopprop(event) {
    event.stopPropagation();
  }
  openEditTask(taskdata: any, editText: any) {
    this.crmService.taskToCraeteViaServiceData = taskdata
    const newTaskData = this.crmService.taskToCraeteViaServiceData
    setTimeout(() => {
      this.crmService.taskActivityName = editText;
      newTaskData;
      this.router.navigate(['provider', 'task', 'create-task']);
    }, projectConstants.TIMEOUT_DELAY);

  }
  // markAsDone() {
  //   const dialogrefd = this.dialog.open(CrmMarkasDoneComponent, {
  //     width: '50%',
  //     panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
  //     disableClose: true,
  //     data: {
  //       'message': this.msg
  //     }
  //   });
  //   dialogrefd.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.crmService.deleteCriteria().subscribe(data => {
  //         if (data) {
  //           this.getTotalTask();
  //           this.snackbarService.openSnackBar('Report Deleted');
  //         }
  //       });
  //     }
  //   });

  // }
}