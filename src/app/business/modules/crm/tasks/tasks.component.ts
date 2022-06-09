import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
// import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Router,NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
// import { CrmMarkasDoneComponent } from '../../../../../../src/app/business/shared/crm-markas-done/crm-markas-done.component';
// import { MatDialog } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CrmSelectMemberComponent } from '../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component';

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
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  // filters = {
  //   status: false,
  //   category: false,
  //   type: false,
  //   dueDate: false,
  //   title: false,
  // };
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
    // 'email': false
    'title': false
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  msg = 'Do you really want to mark as done this activity? ';
  totalCount: any;
  inprogressCount: any;
  completedCount: any;
  delayedCount: any;
  inprogress = false;
  completed= false;
  public taskStatusList:any=[];
  public categoryListData:any=[];
  public taskTypeList:any=[];
  types: any = [];
  statuses: any = [];
  categories: any = [];
  
  isCheckin;
  maxday = new Date();
  date_cap = Messages.DATE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  apiloading = false;
  selected = 0;
  showCustomers = false;
  selectedGroup;
  groupCustomers;
  donationsSelected: any = [];
  donations: any = [];
  selectedIndex: any = [];
  donationServices: any = [];
  customer_label = '';
  donations_count;
  selectedDonations: any;
  show_loc = false;
  locations: any;
  selected_loc_id: any;
  services: any = [];
  selected_location = null;
  screenWidth;
  small_device_display = false;
  selectAll = false;
  filtericonclearTooltip: any;
  loadComplete = false;
  loadComplete1 = false;
  loadComplete2 = false;
  loadComplete3 = false;
  public taskMasterList:any=[];
  public arr:any;
  public taskMasterDuplicate:any=[];
  public taskMasterDescxription:any=[];
  public taskMasterOtherJSON:any=[
    {
      // account: 126859,
      attachments: [],
      category: {id: 1, name: 'N/A'},
      description: "General Task For Employees",
      estDuration: {days: 0, hours: 0, minutes: 0},
      id: 1,
      notes: [],
      // parentTaskId: 0,
      priority: {id: 1, name: 'Low'},
      status: "Enable",
      templateName: "General Template 1",
      title: "Others",
      type: {id: 1, name: 'N/A'}
    }
  ]
  public statusFilter:any;
  public statusFilterJSON:any=[
    {
      statusId:1,
      status:'TotalTask'
    },
    {
      statusId:2,
      status:'InProgress'
    },
    {
      statusId:1,
      status:'Completed'
    }

]
  public bInprogressTask:boolean=false;
  public bCompltedTask:boolean=false;
  public bTotalTask:boolean=true;
  public bNewTask:boolean=false;
  public newTaskCount:any;
  public totalNewTaskList:any=[];
  public bAssignedTask:boolean=false;
  public assignedTaskList:any=[];
  public canceledTaskList:any=[];
  public bCancelledTask:boolean=false;
  public bSuspendedTask:boolean=false;
  public suspendedTaskList:any=[];
  public inProgressListData:any=[];
  public totalActivity:any='Total activity';
  public headerName:any='Activity';
  public suspendTaskCount:any;
  public cancelledTaskCount:any;
  public assignedTaskCount:any;
  public pendingTaskData:any=[];
  public pendingTaskDataCount:any;
  public bPendingData:boolean=false;
  public rejectedTaskData:any=[];
  public rejectedTaskDataCount:any;
  public bRejectedData:boolean=false;
  public proceedTaskData:any=[];
  public proceedTaskDataCount:any;
  public bProceedTaskData:boolean=false;
  public verifiedTaskData:any=[];
  public verifiedTaskDataCount:any;
  public bVerifiedTaskData:boolean=false;


  constructor(
    private locationobj: Location,
    // private groupService: GroupStorageService,
    public router: Router,
    private dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,

  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');

  }

  ngOnInit() {
    this.api_loading = false;
    // if (this.groupService.getitemFromGroupStorage('tabIndex')) {
    //   this.selectedTab = this.groupService.getitemFromGroupStorage('tabIndex');
    // } else {
    //   this.selectedTab = 1;
    // }
    
    this.getTaskStatusListData();
    this.getCategoryListData();
    this.getTaskTypeListData();
    this.getTotalTask();
    this.getInprogressTask();
    this.getCompletedTask();
    this.getTaskmaster()
    this.getNewTask()
    this.getAssignedTask()
    this.getCancelledTask()
    this.getSuspendedTask()
    this.getPendingTask()
    this.getProceedTask()
    this.getVerifiedTask()
  }
  handleTaskStatus(statusValue:any,statusText,statusFilter){
    console.log('statusValue',statusValue);
    console.log('statusValue',statusText);
    console.log('statusFilter',statusFilter)
    console.log('this.taskStatusList',this.taskStatusList)
    if(statusValue===3){
      this.bInprogressTask=true;
      this.bCompltedTask=false;
      this.bTotalTask=false;
      this.bNewTask=false;
      this.bAssignedTask=false;
      this.bCancelledTask=false;
      this.bSuspendedTask=false;
      this.getInprogressTask()
    }
    else if(statusValue===5){
      this.bCompltedTask=true;
      this.bInprogressTask=false;
      this.bTotalTask=false
      this.bNewTask=false;
      this.bAssignedTask=false;
      this.bCancelledTask=false;
      this.bSuspendedTask=false;
      this.getCompletedTask()
    }
    else if(statusValue===1){
      this.bNewTask=true;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bAssignedTask=false;
      this.bCancelledTask=false;
      this.bSuspendedTask=false;
      this.getNewTask()
    }
    else if(statusValue===2){
      this.bAssignedTask=true;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bCancelledTask=false;
      this.bSuspendedTask=false;
      this.getAssignedTask()
    }
    else if(statusValue===4){
      this.bCancelledTask=true;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.getCancelledTask()
    }
    else if(statusValue===12){
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=true;
      this.getSuspendedTask()
    }
    else if(statusValue===0){
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=true;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.getTotalTask()
    }
    else if(statusValue===13){
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.bPendingData=true;
      this.getPendingTask()
    }
    else if(statusValue===15){
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.bPendingData=false;
      this.bRejectedData=false;
      this.bProceedTaskData=true;
      this.getProceedTask()
    }
    else if(statusValue===16){
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=false;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.bPendingData=false;
      this.bRejectedData=false;
      this.bProceedTaskData=false;
      this.bVerifiedTaskData=true;
      this.getVerifiedTask()
    }
  }
 //new task method
  getNewTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getNewTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.newTaskCount = result; }
          filter = this.setPaginationNewFilter(filter);
          this.crmService.getNewTask(filter)
            .subscribe(
              data => {
                this.totalNewTaskList = data;
                console.log('totalNewTaskList',this.totalNewTaskList)
                this.totalNewTaskList = this.totalNewTaskList.filter(obj => !obj.originId);
                // this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getNewTaskCount(filter){
    return new Promise((resolve, reject) => {
      this.crmService.getNewTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.newTaskCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationNewFilter(api_filter){
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_New(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getNewTask();
  }
  //assigneed task method
  getAssignedTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getAssigneedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.assignedTaskCount = result; }
          filter = this.setPaginationAssignedFilter(filter);
          this.crmService.getAssignedTask(filter)
            .subscribe(
              data => {
                this.assignedTaskList = data;
                console.log('assignedTaskList',this.assignedTaskList)
                this.assignedTaskList = this.assignedTaskList.filter(obj => !obj.originId);
                // this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getAssigneedTaskCount(filter){
    return new Promise((resolve, reject) => {
      this.crmService.getAssigneedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.assignedTaskCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationAssignedFilter(api_filter){
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_assigned(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getAssignedTask();
  }
  //cancelle4d task method
  getCancelledTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getCancelledTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.cancelledTaskCount = result; }
          filter = this.setPaginationCancelledFilter(filter);
          this.crmService.getCancelledTask(filter)
            .subscribe(
              data => {
                this.canceledTaskList = data;
                console.log('canceledTaskList',this.canceledTaskList)
                this.canceledTaskList = this.canceledTaskList.filter(obj => !obj.originId);
                // this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCancelledTaskCount(filter){
    return new Promise((resolve, reject) => {
      this.crmService.getCancelledTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.cancelledTaskCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationCancelledFilter(api_filter){
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_cancelled(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getCancelledTask();
  }
  //suspended task method
  getSuspendedTask(from_oninit=true){
  let filter = this.setFilterForApi();
    this.getSuspendedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.suspendTaskCount = result; }
          filter = this.setPaginationSuspendFilter(filter);
          this.crmService.getSuspendedTask(filter)
            .subscribe(
              data => {
                this.suspendedTaskList = data;
                console.log('suspendedTaskList',this.suspendedTaskList)
                this.suspendedTaskList = this.suspendedTaskList.filter(obj => !obj.originId);
                // this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }
  getSuspendedTaskCount(filter){
    return new Promise((resolve, reject) => {
      this.crmService.getSuspendedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.suspendTaskCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationSuspendFilter(api_filter){
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_suspended(pg){
    this.pagination.startpageval=pg;
    this.filter.page = pg;
    this.getSuspendedTask()

  }
  //total task methiod
  getTotalTask(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getTotalTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.totalCount = result; }
          filter = this.setPaginationFilter(filter);
          this.crmService.getTotalTask(filter)
            .subscribe(
              data => {
                this.totalTaskList = data;
                console.log("Task List :",this.totalTaskList)
                this.totalTaskList = this.totalTaskList.filter(obj => !obj.originId);
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  } 
  getTotalTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getTotalTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.totalCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getTotalTask();
  }
  getColor(status){
    if(status){
    if(status === 'New'){
      return '#05CDE9'
    }
    else if(status === 'Assigned'){
      return '#FEDC28';
    }
    else if(status === 'In Progress'){
      return '#FFA439';
    }
    else if(status === 'Cancelled'){
      return '#FF5740';
    }
    else if(status === 'Suspended'){
      return '#FF540B';
    }
    else if(status === 'Completed'){
      return '#38C984';
    }
    else if(status === 'Pending'){
      return 'green';
    }
    else if(status === 'Rejected'){
      return 'green';
    }
    else if(status === 'Proceed'){
      return 'green';
    }
    else if(status === 'Verified'){
      return 'green';
    }
    // else if(status === 'Completed'){
    //   return 'green';
    // }
    // else{
    //   return 'black'
    // }
  }
}
//inprogress task method
  getInprogressTask(from_oninit = true) {
    console.log('from_oninit',from_oninit)
    let filter = this.setFilterForApi();
    this.getInprogressTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.inprogressCount = result; }
          filter = this.setPaginationInprogressFilter(filter);
          this.crmService.getInprogressTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
                this.totalInprogressList = data;
                this.totalInprogressList = this.totalInprogressList.filter(obj => !obj.originId);
                // this.loadComplete1 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete1 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getInprogressTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getInprogressTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.inprogressCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationInprogressFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_inprogress(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getInprogressTask();
  }
  //completed task method
  getCompletedTask(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getCompletedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.completedCount = result; }
          filter = this.setPaginationCompletedFilter(filter);
          this.crmService.getCompletedTask(filter)
            .subscribe(
              data => {
                this.totalCompletedList = data;
                console.log('totalCompletedList',this.totalCompletedList)
                this.totalCompletedList = this.totalCompletedList.filter(obj => !obj.originId);
                // this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCompletedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getCompletedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.completedCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationCompletedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_completed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getCompletedTask();
  }
  //delayed task method
  getDelayedTask(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getDelayedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.delayedCount = result; }
          filter = this.setPaginationDelayedFilter(filter);
          this.crmService.getDelayedTask(filter)
            .subscribe(
              data => {
                this.totalDelayedList = data;
                this.totalDelayedList = this.totalDelayedList.filter(obj => !obj.originId);
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getDelayedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getDelayedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.delayedCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationDelayedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_delayed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getDelayedTask();
  }
  //pending task method
  getPendingTask(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getPendingTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.pendingTaskDataCount = result; }
          filter = this.setPaginationPendingFilter(filter);
          this.crmService.getPendingTask(filter)
            .subscribe(
              data => {
                this.pendingTaskData = data;
                console.log('this.pendingTaskData',this.pendingTaskData)
                this.pendingTaskData = this.pendingTaskData.filter(obj => !obj.originId);
                
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getPendingTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getPendingTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.pendingTaskDataCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationPendingFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_pending(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getPendingTask();
  }
  //rejected method start
  getRejectedTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getRejectedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.rejectedTaskDataCount = result; }
          filter = this.setPaginationRejectedFilter(filter);
          this.crmService.getRejectedTask(filter)
            .subscribe(
              data => {
                this.rejectedTaskData = data;
                console.log('this.rejectedTaskData',this.rejectedTaskData)
                this.rejectedTaskData = this.rejectedTaskData.filter(obj => !obj.originId);
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getRejectedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getRejectedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.rejectedTaskDataCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationRejectedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_rejected(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getRejectedTask();
  }
  //proceed method start
  getProceedTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getProceedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.proceedTaskDataCount = result; }
          filter = this.setPaginationProceedFilter(filter);
          this.crmService.getProceedTask(filter)
            .subscribe(
              data => {
                this.proceedTaskData = data;
                console.log('this.proceedTaskData',this.proceedTaskData)
                this.proceedTaskData = this.proceedTaskData.filter(obj => !obj.originId);
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getProceedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getRejectedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.proceedTaskDataCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationProceedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_proceed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getProceedTask();
  }
  //verified method start
  getVerifiedTask(from_oninit = true){
    let filter = this.setFilterForApi();
    this.getVerifiedTaskCount(filter)
      .then(
        result => {
          if (from_oninit) { this.verifiedTaskDataCount = result; }
          filter = this.setPaginationVerifiedFilter(filter);
          this.crmService.getVerifiedTask(filter)
            .subscribe(
              data => {
                this.verifiedTaskData = data;
                console.log('this.verifiedTaskData',this.verifiedTaskData)
                this.verifiedTaskData = this.verifiedTaskData.filter(obj => !obj.originId);
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getVerifiedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getVerifiedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.verifiedTaskDataCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationVerifiedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_verified(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getVerifiedTask();
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
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  tabChange(event) {
    console.log('event.index + 1',event.index + 1)
    // this.setTabSelection(event.index + 1);
  }
  

  viewTask(taskUid,taskData:any) {
    this.crmService.taskToCraeteViaServiceData = taskData;
    this.router.navigate(['/provider/viewtask/' + taskUid]);

  }
  getTaskmaster(){
    this.crmService.getTaskMasterList().subscribe((response:any)=>{
      console.log('TaskMasterList :',response);
      this.taskMasterList.push(response)
      // response.forEach((item:any,index)=>{
      //   console.log('item',item)
      //   this.taskMasterDescxription= [{
      //     "account":response[index].account,
      //      "attachments":response[index].attachments,
      //      "category":{
      //        "id":response[index].category.id,
      //        "name":response[index].category.name
      //      },
      //      "description":response[index].description,
      //      "estDuration":{
      //        "days": response[index].estDuration.days,
      //        "hours": response[index].estDuration.hours,
      //        "minutes":response[index].estDuration.minutes
      //      },
      //      "id":response[index].id,
      //      "notes":response[index].notes,
      //      "parentTaskId": response[index].parentTaskId,
      //      "priority":{
      //        "id":response[index].priority.id,
      //        "name":response[index].priority.name
      //      },
      //      "status":response[index].status,
      //      "templateName":response[index].templateName,
      //      "title":response[index].title,
      //      "type":{
      //        "id":response[index].type.id,
      //        "name":response[index].type.name
      //      }
      //    }]
      //   //  console.log('objArray',objArray)
         
      // })
      // const objArray2=[{
      //   "other":'Othger'
      // }]
      // this.taskMasterDuplicate.push(...this.taskMasterDescxription,...objArray2)
    })
    
  }

  createTask(createText: any) {
    // console.log('this.taskMasterDuplicate',this.taskMasterDuplicate)
    console.log('..........',this.taskMasterList[0].length)
    if(this.taskMasterList[0].length>0){
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'activityCreateTemplate',
        }
      }
      this.router.navigate(['provider', 'task', 'tasktemplate'],navigationExtras)
    }
    else{
      console.log('kkkk')
      this.crmService.taskActivityName = 'CreteTaskMaster'
      this.router.navigate(['provider', 'task', 'create-task'])
    }
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
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
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
    console.log(api_filter)
    return api_filter;
  }
  setFilterDataCheckbox(type, value?, event?) {
    console.log('type',type)
    console.log('value',value)
    if(value===0 && this.statuses.indexOf(value) === -1){
      this.crmService.getTotalTask()
      .subscribe(
        data => {
          this.totalTaskList = data;
          console.log("Task List :",this.totalTaskList)
          this.totalTaskList = this.totalTaskList.filter(obj => !obj.originId);
          this.loadComplete = true;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loadComplete = true;
       
        }
      );
    }
   
    if (type === 'status') {
      const indx = this.statuses.indexOf(value);
      console.log('indx',indx)
      
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
    this.keyPressed()
  }
 
  clearFilter() {
    this.statuses = [];
    this.types = [];
    this.categories = [];
    this.resetFilter();
    this.filterapplied = false;
    this.getTotalTask();
  }
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(
        {
          id:0,   name:'Total Activity',image:'./assets/images/crmImages/total.png',
        },
        {
          id: 1, name: 'New',image:'./assets/images/crmImages/new.png',
        },
        {
          id: 2, name: 'Assigned',image:'./assets/images/tokenDetailsIcon/assignedTo.png',
        },
        {
          id: 3, name: 'In Progress',image:'./assets/images/crmImages/inProgress2.png',
        },
        {
          id: 4, name: 'Cancelled',image:'./assets/images/crmImages/cancelled.png',
        },
        {
          id: 5, name: 'Completed',image:'./assets/images/crmImages/completed2.png',
        },
        {
          id: 12, name: 'Suspended',image:'./assets/images/crmImages/suspended.png',
        },
        {
          id: 13, name: 'Pending',image:'./assets/images/crmImages/suspended.png',
        },
        {
          id: 14, name: 'Rejected',image:'./assets/images/crmImages/suspended.png',
        },
        {
          id: 15, name: 'Proceed',image:'./assets/images/crmImages/suspended.png',
        },
        {
          id: 16, name: 'Verified',image:'./assets/images/crmImages/suspended.png',
        },
        );
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

  openTaskCompletion(taskData:any){
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'taskComplete',
        taskName:taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res)=>{
      console.log('resssssssssCom',res);
       if(res==='Completed'){
        this.ngOnInit()
        // this.completedCount=this.completedCount+1
      }
    })
  
  }
  openDialogStatusChange(taskData:any){
    console.log('openDialogStatusChange',taskData)
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'statusChange',
        taskDetails:taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      console.log('resssssssss',res);
      // this.getCompletedTask();
      if(res==='In Progress' ||res==='Completed' || res==='Assigned' || res==='New' || res === 'Cancelled' || res === 'Suspended' ){
        // this.getInprogressTask();
        this.ngOnInit()
      }
      // else if(res==='Completed'){
      //   this.ngOnInit()
      // }
      // else if(res==='Assigned'){
      //   this.ngOnInit()
      // }
      // else if(res === 'New'){
      //   this.ngOnInit()
      // }
      // else if( res === 'Cancelled'){
      //   this.ngOnInit()
      // }
      // else if( res ==='Suspended'){
      //   this.ngOnInit()
      // }
      
    })
  }
}