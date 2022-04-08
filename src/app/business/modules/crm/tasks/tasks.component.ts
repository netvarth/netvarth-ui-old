import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
// import { CrmService } from '../crm.service';
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
// export class TasksComponent implements OnInit {

//   constructor(private crmService: CrmService) { }

//   ngOnInit(): void {
//     this.crmService.getTasks().subscribe(
//       (tasks: any) => {

//       }
//     )
//   }

// }
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
  totalTaskList: any = [];
  totalInprogressList: any = [];
  totalCompletedList: any = [];
  totalDelayedList: any = [];
  selectedTab;
  filtericonTooltip = '';
  totalCount;
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
  msg = 'Do you really want to mark as done this task? ';
  inprogressCount: any;
  completedCount: any;
  delayedCount: any;
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

  ngOnInit(): void {
    this.api_loading = false;
    // this.crmService.getTasks().subscribe(
    //   (tasks: any) => {
    //     this.taskList = tasks;
    //     console.log(this.taskList)
    //   }
    // )
    this.getTotalTask();
    this.getInprogressTask();
    this.getCompletedTask();
    this.getDelayedTask();
    if (this.groupService.getitemFromGroupStorage('tabIndex')) {
      this.selectedTab = this.groupService.getitemFromGroupStorage('tabIndex');
    } else {
      this.selectedTab = 1;
    }
    this.doSearch();


  }
  getTotalTask() {
    this.crmService.getTotalTask().subscribe(
      (data: any) => {
        this.totalTaskList = data;
        this.totalCount = this.totalTaskList.length;
      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
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
       
        if(this.totalDelayedList.length === 0){
          this.delayedCount = 0;
        }
        else{
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
  tabChange(event) {
    console.log(event)
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
  createTask(createText:any) {
    this.crmService.taskActivityName=createText;
    console.log('create')
    this.router.navigate(['provider', 'task', 'create-task'])
  }
  stopprop(event) {
    event.stopPropagation();
  }
  openEditTask(taskdata:any,editText:any){
    this.crmService.taskToCraeteViaServiceData=taskdata
   const newTaskData= this.crmService.taskToCraeteViaServiceData
    setTimeout(() => {
      this.crmService.taskActivityName=editText;
      newTaskData;
    this.router.navigate(['provider', 'task','create-task']);
    }, projectConstants.TIMEOUT_DELAY);
    console.log('taskdata....',taskdata);

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