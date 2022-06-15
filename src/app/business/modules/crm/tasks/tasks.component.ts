import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { Router,NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CrmSelectMemberComponent } from '../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tooltipcls = '';
  no_tasks_cap = Messages.AUDIT_NO_TASKS_CAP;
  load_complete = 0;
  api_loading = true;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  filterapplied;
  filter_sidebar = false;
  open_filter = false;
  perPage = projectConstants.PERPAGING_LIMIT;
  taskList: any = [];
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
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
    'title': false
  };
  msg = 'Do you really want to mark as done this activity? ';
  public taskStatusList:any=[];
  public categoryListData:any=[];
  public taskTypeList:any=[];
  types: any = [];
  statuses: any = [];
  categories: any = [];
  filtericonclearTooltip: any;
  public taskMasterList:any=[];
  public arr:any;
  public statusFilter:any=0;
  public totalActivity:any='Total activity';
  public headerName:any='Activity';
  totalTaskActivityList: any=[];
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.crmService.PERPAGING_LIMIT
  };
  checkBoxValueSelect:any;
    constructor(
    private locationobj: Location,
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
    this.getCategoryListData();
    this.getTaskTypeListData();
    this.getTaskmaster();
    this.handleStatus()
    
  }
  handleStatus(){
    const _this=this;
    const filter = this.handleTaskStatus(this.statusFilter);
    this.getTaskStatusListData().then(
      (statuses: any) => {
        _this.statuses = statuses;
        
        _this.getTotalTaskActivityCount(filter).then(
          (count) => {
            if (count > 0) {
              _this.getTotalTaskActivity(filter);
            } else {
              _this.api_loading = false;
            }
          }
        )
      }
    ) 
  }
  getTaskStatusListData(){
    const _this = this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
        console.log('taskStatus',taskStatus);
        resolve(taskStatus);
        _this.taskStatusList.push(
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
        _this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
    })
    
  }
  handleTaskStatus(statusValue:any){
    console.log('statusValue',statusValue);
    let filter = {}
    filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    filter['count'] = this.pagination.perPage;
    console.log('statusValue',statusValue);
    if(statusValue===0){
      this.getTotalTaskActivity(filter)
    }
    else if(statusValue===1){
      this. getNewTask(filter)
    }
    else if(statusValue===2){
      this.getAssignedTask(filter)
    }
    else if(statusValue===4){
      this.getCancelledTask(filter)
    }
    else if(statusValue===12){
      this.getSuspendedTask(filter)
    }
    else if(statusValue===3){
      this.getInprogressTask(filter)
    }
    else if(statusValue===5){
      this.getCompletedTask(filter)
    }
    else if(statusValue===13){
      this.getPendingTask(filter)
    }
    else if(statusValue===14){
      this.getRejectedTask(filter)
    }
    else if(statusValue===15){
      this.getProceedTask(filter)
    }
    else if(statusValue===16){
      this.api_loading=true;
      this.getVerifiedTask(filter)
    }
    return filter;
  }
  getTotalTaskActivity(filter){
    this.crmService.getTotalTask(filter).subscribe((res:any)=>{
      this.totalTaskActivityList=res;
      this.api_loading = false;
    })
  }
  getTotalTaskActivityCount(filter){
    const _this=this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getTotalTaskCount(filter).subscribe((data)=>{
        _this.pagination.totalCnt=data;
        resolve(data);
      },
      error=>{
        reject(error)
      }
      )
    })
  }
  handle_pageclick(pg,statusValue){
    console.log('statusValue',statusValue)
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    console.log('this.statusFilter',this.statusFilter)
    // const filter = this.handleTaskStatus(statusValue);
    if(statusValue===0){
      this.api_loading=true
      this.getTotalTaskActivity(statusValue)
    }
    else if(statusValue===1){
      this.api_loading=true
      this.getNewTask(statusValue)
    }
    else if(statusValue===2){
      this.api_loading=true
      this.getAssignedTask(statusValue)
    }
    else if(statusValue===4){
      this.api_loading=true
      this.getCancelledTask(statusValue)
    }
    else if(statusValue===12){
      this.api_loading=true;
      this.getSuspendedTask(statusValue)
    }
    else if(statusValue===3){
      this.api_loading=true;
      this.getInprogressTask(statusValue)
    }
    else if(statusValue===5){
      this.api_loading=true;
      this.getCompletedTask(statusValue)
    }
    else if(statusValue===13){
      this.api_loading=true;
      this.getPendingTask(statusValue)
    }
    else if(statusValue===14){
      this.api_loading=true;
      this.getRejectedTask(statusValue)
    }
    else if(statusValue===15){
      this.api_loading=true;
      this.getProceedTask(statusValue)
    }
    else if(statusValue===16){
      this.api_loading=true;
      this.getVerifiedTask(statusValue)
    }
    
  }
  getNewTask(filter){
    this.crmService.getNewTask(filter)
    .subscribe(
      data => {
        this.totalTaskActivityList = data;
        this.api_loading = false;
        console.log('totalTaskActivityList',this.totalTaskActivityList)
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getAssignedTask(filter){
    this.crmService.getAssignedTask(filter)
            .subscribe(
              data => {
                this.totalTaskActivityList = data;
                console.log('assignedTaskList',this.totalTaskActivityList);
                this.api_loading=false;
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCancelledTask(filter){
    this.crmService.getCancelledTask(filter)
            .subscribe(
              data => {
                this.totalTaskActivityList = data;
                this.api_loading=false;
                console.log('totalTaskActivityList',this.totalTaskActivityList)
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getSuspendedTask(filter){
    this.crmService.getSuspendedTask(filter)
    .subscribe(
      data => {
        this.totalTaskActivityList = data;
        this.api_loading=false;
        console.log('totalTaskActivityList',this.totalTaskActivityList)
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getInprogressTask(filter) {
    this.crmService.getInprogressTask(filter)
    .subscribe(
      data => {
        console.log('data',data)
        this.totalTaskActivityList = data;
        this.api_loading=false;
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCompletedTask(filter) {
    this.crmService.getCompletedTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
        this.totalTaskActivityList = data;
        this.api_loading=false;
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getPendingTask(filter) {
    this.crmService.getPendingTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
                this.totalTaskActivityList = data;
                this.api_loading=false;
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getRejectedTask(filter){
    this.crmService.getRejectedTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
                this.totalTaskActivityList = data;
                this.api_loading=false;
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getProceedTask(filter){
    this.crmService.getProceedTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
                this.totalTaskActivityList = data;
                this.api_loading=false;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
  }
  getProceedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getRejectedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getVerifiedTask(filter){
    this.crmService.getVerifiedTask(filter)
            .subscribe(
              data => {
                console.log('data',data)
                this.totalTaskActivityList = data;
                this.api_loading=false;
              },
              error => {this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })});
  }
  getVerifiedTaskCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getVerifiedTaskCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  applyFilter(status){
    console.log(status);
    this.handleTaskStatus(this.checkBoxValueSelect)
    this.filter_sidebar=false;
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
  }
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
  viewTask(taskUid,taskData:any) {
    this.crmService.taskToCraeteViaServiceData = taskData;
    this.router.navigate(['/provider/viewtask/' + taskUid]);

  }
  getTaskmaster(){
    this.crmService.getTaskMasterList().subscribe((response:any)=>{
      console.log('TaskMasterList :',response);
      this.taskMasterList.push(response)
    })
    
  }

  createTask(createText: any) {
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
    if (type === 'status') {
      this.checkBoxValueSelect=value;
      // const indx = this.statuses.indexOf(value);
      // console.log('indx',indx)
      
      // this.statuses = [];
      // if (indx === -1) {
      //   this.statuses.push(value);
      // }
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
    this.getTotalTaskActivity(this.statusFilter);
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
      this.ngOnInit()
    })
  }
}