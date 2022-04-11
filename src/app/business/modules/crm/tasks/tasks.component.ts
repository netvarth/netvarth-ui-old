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
    title: '',
  };
  filters = {
    status: false,
    category: false,
    type: false,
    dueDate: false,
    title: false,
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  msg = 'Do you really want to mark as done this task? ';
  totalCount: any;
  inprogressCount: any;
  completedCount: any;
  delayedCount: any;
  page = 1;
  inprogress = false;
  completed= false;
  total= true;
  public taskStatusList:any=[];
  public categoryListData:any=[];
  public taskTypeList:any=[];
  types: any = [];
  statuses: any = [];
  categories: any = [];
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
    this.getTaskStatusListData();
    this.getCategoryListData();
    this.getTaskTypeListData();
    this.getTotalTaskCount();
    this.getInprogressTaskCount();
    this.getCompletedTaskCount();
    this.getDelayedTask();
   
    
    // this.doSearch();
  }
  getTotalTaskCount() {
    this.crmService.getTotalTaskCount()
      .subscribe(
        data => {
          this.pagination.totalCnt = data;
          this.totalCount = data;
          const pgefilter = {
            'from': 0,
            'count': this.pagination.totalCnt,
          };
          this.setPaginationFilter(pgefilter);
          this.getTotalTask(pgefilter);
        });
  }
  setPaginationFilter(api_filter) {
    if(this.total){
      api_filter['from'] = 0;
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    } else{
      api_filter['from'] = ((this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0);
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    }
    
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
  getInprogressTaskCount() {
    this.crmService.getInprogressTaskCount()
      .subscribe(
        data => {
          this.pagination.totalCnt = data;
          this.inprogressCount = data;
          const pgefilter_inprogress = {
            'from': 0,
            'count': this.pagination.totalCnt,
          };
          this.setPaginationFilter_inprogress(pgefilter_inprogress);
          this.getInprogressTask(pgefilter_inprogress);
        });
  }
  setPaginationFilter_inprogress(api_filter) {
    if(this.inprogress){
      api_filter['from'] = 0;
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    }
    else{
      api_filter['from'] = ((this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0);
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    }
   
  }
  handle_pageclick_inprogree(pg) {
    this.inprogress = false;
    this.pagination.startpageval = pg;
    this.page = pg;
    const pgefilter_inprogress = {
      'from': this.pagination.startpageval,
      'count': this.pagination.totalCnt,
    };
    this.setPaginationFilter_inprogress(pgefilter_inprogress);
    this.getInprogressTask(pgefilter_inprogress);
  }
  getInprogressTask(pgefilter_inprogress?) {
    this.crmService.getInprogressTask(pgefilter_inprogress).subscribe(
      (data: any) => {
        this.totalInprogressList = data;

      },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getCompletedTaskCount() {
    this.crmService.getCompletedTaskCount()
      .subscribe(
        data => {
          this.pagination.totalCnt = data;
          this.completedCount = data;
          const pgefilter_completed = {
            'from': 0,
            'count': this.pagination.totalCnt,
          };
          this.setPaginationFilter_completed(pgefilter_completed);
          this.getCompletedTask(pgefilter_completed);
        });
  }
  setPaginationFilter_completed(api_filter) {
    
    if(this.completed){
      api_filter['from'] = 0;
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    }
    else{
      api_filter['from'] = ((this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0);
      api_filter['count'] = this.pagination.perPage;
      return api_filter;
    }
    
  }
  handle_pageclick_completed(pg) {
    this.completed = false;
    this.pagination.startpageval = pg;
    this.page = pg;
    const pgefilter_completed = {
      'from': this.pagination.startpageval,
      'count': this.pagination.totalCnt,
    };
    this.setPaginationFilter_inprogress(pgefilter_completed);
    this.getCompletedTask(pgefilter_completed);
  }
  getCompletedTask(pgefilter_inprogress?) {
    this.crmService.getCompletedTask(pgefilter_inprogress).subscribe(
      (data: any) => {
        this.totalCompletedList = data;
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
        this.total = true;
        this.getTotalTaskCount();
        break;
      }
      case 2: {
        this.inprogress = true;
        this.getInprogressTaskCount();
        break;
      }
      case 3: {
        this.completed = true;
        this.getCompletedTaskCount();

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
  resetFilter() {
    this.filters = {
      status: false,
      category: false,
      type: false,
      dueDate: false,
      title: false,
    };
    this.filter = {
      status: '',
      category: '',
      type: '',
      dueDate: '',
      title: '',
    };
  }
  keyPressed() {
    if (this.filter.title
      || this.statuses.length > 0 || this.categories.length > 0 || this.types.length > 0 ) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  setFilterForApi() {
    const api_filter = {};
   
    if (this.statuses.length > 0) {
      api_filter['status-eq'] = this.statuses.toString();
    }
    if (this.types.length > 0) {
      api_filter['type-eq'] = this.types.toString();
    }
    if (this.categories.length > 0) {
      api_filter['category-eq'] = this.categories.toString();
    }
    if (this.filter.title !== '') {
      api_filter['title-eq'] = this.filter.title;
    }
    return api_filter;
  }
  setFilterDataCheckbox(type, value?, event?) {
   
    if (type === 'status') {
      const indx = this.statuses.indexOf(value);
      this.statuses = [];
      if (indx === -1) {
        this.statuses.push(value);
      }
    }
    if (type === 'type') {
      const indx = this.types.indexOf(value);
      this.types = [];
      if (indx === -1) {
        this.types.push(value);
      }
    }
    if (type === 'category') {
      const indx = this.categories.indexOf(value);
      this.categories = [];
      if (indx === -1) {
        this.categories.push(value);
      }
    }
   
  }
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(taskStatus);
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getCategoryListData(){
    this.crmService.getCategoryList().subscribe((categoryList:any)=>{
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getTaskTypeListData(){
    this.crmService.getTaskType().subscribe((taskTypeList:any)=>{
      this.taskTypeList.push(taskTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
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