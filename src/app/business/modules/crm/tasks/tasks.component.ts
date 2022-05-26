import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
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
  public headerName:any='Activity'

  constructor(
    private locationobj: Location,
    private groupService: GroupStorageService,
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
      // this.getInprogressTaskData()
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
    else{
      this.bCancelledTask=false;
      this.bAssignedTask=false;
      this.bNewTask=false;
      this.bTotalTask=true;
      this.bCompltedTask=false;
      this.bInprogressTask=false;
      this.bSuspendedTask=false;
      this.getTotalTask()
    }
  }
  getInprogressTaskData(from_oninit=true){
    this.inProgressListData=[]
    this.totalTaskList.forEach((element:any)=>{
      if(element.status.name==='In Progress'){
        this.inProgressListData.push(element);
      }
    })

  }
  getNewTask(from_oninit=true){
    this.totalNewTaskList=[]
    this.totalTaskList.forEach((element:any)=>{
      if(element.status.name==='New'){
        this.totalNewTaskList.push(element);
      }
    })
  }
  getAssignedTask(from_oninit=true){
    this.assignedTaskList=[]
    this.totalTaskList.forEach((element:any)=>{
      //  console.log('element:.',element)
      if(element.status.name ==='Assigned'){
        this.assignedTaskList.push(element);
      }
      // console.log('this.assignedTaskList',this.assignedTaskList)
    })
  }
  getCancelledTask(from_oninit = true){
    this.canceledTaskList=[]
    this.totalTaskList.forEach((element:any)=>{
      // console.log('element:.',element)
     if(element.status.name ==='Cancelled'){
       this.canceledTaskList.push(element);
     }
    //  console.log('this.canceledTaskList',this.canceledTaskList)
   })
  }
  getSuspendedTask(from_oninit=true){
    this.suspendedTaskList=[]
    this.totalTaskList.forEach((element:any)=>{
      // console.log('element:.',element)
     if(element.status.name ==='Suspended'){
       this.suspendedTaskList.push(element);
     }
    //  console.log('this.suspendedTaskList',this.suspendedTaskList)
   })
  }
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
                this.getNewTask()
                this.getAssignedTask()
                this. getCancelledTask()
                this. getSuspendedTask()
                this.totalTaskList = this.totalTaskList.filter(obj => !obj.originId);
                this.loadComplete = true;
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
 


  getColor(status){
    if(status){
    if(status === 'New'){
      return 'blue'
    }
    else if(status === 'Assigned'){
      return 'pink';
    }
    else if(status === 'In Progress'){
      return '#fcce2b';
    }
    else if(status === 'Cancelled'){
      return 'red';
    }
    else if(status === 'Suspended'){
      return 'orange';
    }
    else if(status === 'Completed'){
      return 'green';
    }
    else{
      return 'black'
    }
  }
}
   // return this.totalTaskList.status.name === 'New' ? 'red' : 'green';}

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
                this.loadComplete1 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete1 = true;
             
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
                this.totalCompletedList = this.totalCompletedList.filter(obj => !obj.originId);
                this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete2 = true;
             
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
                this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete3 = true;
             
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
  handle_pageclick_assigned(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getAssignedTask();
  }
  handle_pageclick_New(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getNewTask();
  }
  handle_pageclick_cancelled(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getCancelledTask();
  }
  handle_pageclick_suspended(pg){
    this.pagination.startpageval=pg;
    this.filter.page = pg;
    this.getSuspendedTask()

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
    this.setTabSelection(event.index + 1);
  }
  setTabSelection(type) {
    this.selectedTab = type;
    console.log('this.selectedTab',this.selectedTab)
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