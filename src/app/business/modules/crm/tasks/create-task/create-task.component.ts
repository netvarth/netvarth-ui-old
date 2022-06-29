import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  public availableDates: any = [];
  public ddate:any;
  public api_loading:any= true;
  public createTaskForm:any;
  public taskError:null;
  public selectMember:any;
  public categoryListData:any=[];
  public allMemberList:any=[];
  public taskTypeList:any=[];
  public taskStatusList:any=[];
  public taskPriorityList:any=[];
  public userType:any;
  public locationName:any;
  public areaName:any;
  public locationId:any;
  public taskDueDate:any;
  public taskDueTime:any;
  public taskDueDays:any;
  public selectedDate:any;
  public boolenTaskError:boolean=false;
  public assigneeId:any;
  public selectTaskManger:any;
  public selectTaskMangerId:any;
  public createBTimeField:boolean=false;
  public updateBTimefield:boolean=false;
  public dayGapBtwDate:any;
  public hour:any;
  public minute:any;
  //update variable;
  public updateValue:any;
  public task:any;
  public selectHeader:any;
  public updateUserType:any;
  public updateMemberId:any;
  public updateManagerId:any;
  public updteLocationId:any;
  taskUid : any;
  taskDetails: any;
  public updateAssignMemberDetailsToDialog:any;
  public updateSelectTaskMangerDetailsToDialog:any;
  taskStatusModal: any;
  taskPriority: any;
  public estDurationWithDay:any;
  public estTime:any;
  taskMasterData: any;
  public errorMsgAny:string='';
  public bErrormsg:boolean=false;
  public bErrormsgCategory:boolean=false;
  public errorMsgAnyCategory:string=''
  public bErrormsgType:boolean=false;
  public errorMsgAnyType:string=''
  public activityTitle:any;
  public activityDescription:any;
  public type: any;
  public subActivityTaskUid:any;
  public rupee_symbol = '₹';
  public editable:boolean=true;
  api_loading_CreateActivity:boolean;
  constructor(private locationobj: Location,
    // private lStorageService: LocalStorageService,
    private router: Router,
    private activated_route: ActivatedRoute,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createTaskFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe,
     private _Activatedroute:ActivatedRoute,
     private groupService:GroupStorageService

     ) { 
     }

  ngOnInit(): void {
    this.activated_route.queryParams.subscribe(qparams => {
      console.log('qparams',qparams)
      this.updateValue=qparams;
      console.log(' this.updateValue', this.updateValue);
      if (qparams.type) {
          this.type = qparams.type;
      }
    });
    console.log('this.type',this.type)
    this.userInfo()
      this._Activatedroute.paramMap.subscribe(params => { 
      this.taskUid = params.get('taskid');
      if(this.taskUid)
      {
        this.crmService.taskActivityName = "subTaskCreate";
      }
    });
    this.api_loading=false;
    console.log('this.taskMasterData',this.taskMasterData)
    if(this.type ==='SubUpdate'){
     this.subUpdateActivity()
    }
    else if((this.type ==='Update' )&& (this.type !=='SubUpdate') || (this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate' && this.crmService.taskActivityName!='CreatE' && this.crmService.taskActivityName !='CreteTaskMaster')){
     this.updateActivity()
    }
    else if(this.crmService.taskActivityName === "subTaskCreate"){
      this.subTaskCreateActivity()
    }
    else if(this.crmService.taskActivityName==='CreatE'){
    this.creatEOthersActivity()
    }
    else if(this.crmService.taskActivityName =='Create'){
      this.createActivity()
    }
    else if(this.crmService.taskActivityName==='CreteTaskMaster'){
      this.creteTaskMasterActivity()
    }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    this.getLocation()
  }
  subUpdateActivity(){
    this.createTaskForm=this.createTaskFB.group({
    taskTitle:[null],
    taskDescription:[null],
    userTaskCategory:[null],
    userTaskType:[null],
    taskLocation:[null],
    areaName:[null],
    taskStatus:[null],
    taskDate:[null],
    taskDays:[null],
    taskHrs:[null],
    taskMin:[null],
    selectMember:[null],
    selectTaskManger:[null],
    userTaskPriority:[null],
    targetResult:[null],
    targetPotential:[null],
  }) 
    this.selectHeader='SubActivity Update';
    this.editable=false;
    this.createBTimeField=false;
    this.updateBTimefield=true;
    console.log('this.updateValue',this.updateValue)
    if(this.updateValue != undefined){
      this.createTaskForm.patchValue({
      taskTitle:this.updateValue.title,
      taskDescription:this.updateValue.description,
      targetResult:(this.updateValue.targetResult),
      userTaskCategory:parseInt(this.updateValue.category),
      userTaskType:parseInt(this.updateValue.typeId),
      taskStatus:parseInt(this.updateValue.statusId),
      userTaskPriority:parseInt(this.updateValue.priorityId),
      taskLocation : this.updateValue.locationName,
      taskDays:( this.updateValue.estdays),
      taskHrs:parseInt( this.updateValue.esthours),
      taskMin:parseInt( this.updateValue.estminutes),
      taskDate:this.updateValue.dueDate,
      targetPotential:parseInt(this.updateValue.targetPotential),
      areaName: this.updateValue.locationArea

    })
    this.locationName =this.updateValue.locationName;
    this.updteLocationId= parseInt(this.updateValue.locationId)
    this.selectMember = (this.updateValue.assigneeName);
    this.updateMemberId=parseInt(this.updateValue.assigneeId);
    console.log(' this.updateMemberId', this.updateMemberId)
    this.selectTaskManger= (this.updateValue.managerName);
    this.updateManagerId=parseInt( this.updateValue.managerId)
    this.updateUserType=this.updateValue.userTypeEnum;
    this.estTime={ "days" :parseInt(this.updateValue.estdays), "hours" :parseInt(this.updateValue.esthours), "minutes" : parseInt(this.updateValue.estminutes)};
    console.log('this.estTime',this.estTime)
    this.subActivityTaskUid= this.updateValue.taskUid
    }
    else{
      this.router.navigate(['provider', 'task']);
    }
  }
  updateActivity(){
    console.log('this.crmService.taskActivityName',this.crmService.taskActivityName)
    this.createTaskForm=this.createTaskFB.group({
    taskTitle:[null],
    taskDescription:[null],
    userTaskCategory:[null],
    userTaskType:[null],
    taskLocation:[null],
    areaName:[null],
    taskStatus:[null],
    taskDate:[null],
    taskDays:[null],
    taskHrs:[null],
    taskMin:[null],
    selectMember:[null],
    selectTaskManger:[null],
    userTaskPriority:[null],
    targetResult:[null],
    targetPotential:[null],
  }) 
    this.selectHeader='Update Activity';
    this.editable=false;
    this.createBTimeField=false;
    this.updateBTimefield=true;
    this.updateValue=this.crmService.taskToCraeteViaServiceData;
    console.log('this.updateValue',this.updateValue)
    if(this.updateValue != undefined){
      console.log(' this.updateValue', this.updateValue);
      this.createTaskForm.patchValue({
      taskTitle:this.updateValue.title,
      taskDescription:this.updateValue.description,
      targetPotential:this.updateValue.targetPotential,
      targetResult:this.updateValue.targetResult,
      userTaskCategory:this.updateValue.category.id,
      userTaskType:this.updateValue.type.id,
      taskStatus:this.updateValue.status.id,
      userTaskPriority:this.updateValue.priority.id,
    })
    this.locationName =this.updateValue.location.name;
    this.createTaskForm.controls.areaName.value =this.updateValue.locationArea;
    this.updteLocationId= this.updateValue.location.id,
    this.createTaskForm.controls.taskDays.value= this.updateValue.estDuration.days,
    this.createTaskForm.controls.taskHrs.value= this.updateValue.estDuration.hours,
    this.createTaskForm.controls.taskMin.value= this.updateValue.estDuration.minutes,
    this.selectMember = this.updateValue.assignee.name;
    this.updateMemberId=this.updateValue.assignee.id;
    this.selectTaskManger= this.updateValue.manager.name;
    this.updateManagerId= this.updateValue.manager.id
    this.updateUserType=this.updateValue.userTypeEnum;
    this.createTaskForm.controls.taskDate.value = this.updateValue.dueDate
    this.estTime={ "days" :this.updateValue.estDuration.days, "hours" :this.updateValue.estDuration.hours, "minutes" : this.updateValue.estDuration.minutes };
    console.log('this.estTime',this.estTime)
    }
    else{
      this.router.navigate(['provider', 'task']);
    }
  }
  subTaskCreateActivity(){
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null,[Validators.required]],
      taskDescription:[null],
      userTaskCategory:[null,[Validators.required]],
      userTaskType:[null,[Validators.required]],
      taskLocation:[null],
      areaName:[null],
      taskStatus:[null],
      taskDate:[null],
      taskDays:[null],
      taskHrs:[null],
      taskMin:[null],
      selectMember:[null],
      selectTaskManger:[null],
      userTaskPriority:[null],
      targetResult:[null],
      targetPotential:[null],
    }) 
        this.createBTimeField=true;
        this.updateBTimefield=false;
        this.selectHeader='Create Subactivity';
        this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
        console.log(' this.taskDueDate', this.taskDueDate);
        this.selectedDate = this.taskDueDate;
        this.activityTitle='Enter subactivity title'
        this.activityDescription='Enter subactivity description'
        this.createTaskForm.controls.taskDays.value= 0,
      this.createTaskForm.controls.taskHrs.value= 0
      this.createTaskForm.controls.taskMin.value= 0
      this.estTime={ "days" :this.createTaskForm.controls.taskDays.value, "hours" :this.createTaskForm.controls.taskHrs.value, "minutes" : this.createTaskForm.controls.taskMin.value };
      console.log('this.estTime',this.estTime);
      this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
  }
  creatEOthersActivity(){
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null,[Validators.required]],
      taskDescription:[null],
      userTaskCategory:[null,[Validators.required]],
      userTaskType:[null,[Validators.required]],
      taskLocation:[null],
      areaName:[null],
      taskStatus:[null],
      taskDate:[null],
      taskDays:[null],
      taskHrs:[null],
      taskMin:[null],
      selectMember:[null],
      selectTaskManger:[null],
      userTaskPriority:[null],
      targetResult:[null],
      targetPotential:[null],
    }) 
    this.createBTimeField=true;
    this.updateBTimefield=false;
    this.selectHeader='Create Activity';
    this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
    console.log(' this.taskDueDate', this.taskDueDate);
    this.selectedDate = this.taskDueDate;
    this.activityTitle='Enter activity title';
    this.activityDescription='Enter activity description'
    this.createTaskForm.controls.taskDays.value= 0,
    this.createTaskForm.controls.taskHrs.value= 0
    this.createTaskForm.controls.taskMin.value= 0
    this.estTime={ "days" :this.createTaskForm.controls.taskDays.value, "hours" :this.createTaskForm.controls.taskHrs.value, "minutes" : this.createTaskForm.controls.taskMin.value };
    console.log('this.estTime',this.estTime)
    this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
  }
  createActivity(){
    console.log('this.crmService.taskActivityName',this.crmService.taskActivityName)
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null],
      taskDescription:[null],
      userTaskCategory:[null],
      userTaskType:[null],
      taskLocation:[null],
      areaName:[null],
      taskStatus:[null],
      taskDate:[null],
      taskDays:[null],
      taskHrs:[null],
      taskMin:[null],
      selectMember:[null],
      selectTaskManger:[null],
      userTaskPriority:[null],
      targetResult:[null],
      targetPotential:[null],
    }) 
    this.createBTimeField=true;
    this.updateBTimefield=false;
    this.activityTitle='Enter activity title';
    this.activityDescription='Enter activity description'
      this.selectHeader='Create Activity';
      this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
      console.log(' this.taskDueDate', this.taskDueDate);
      console.log("Data : ",this.createTaskForm.controls.taskDate)
      this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
      console.log(this.createTaskForm.controls.taskDate)
      const taskMaster= this.crmService.taskMasterToCreateServiceData;
      this.taskMasterData = this.crmService.taskMasterToCreateServiceData;
      console.log('taskMasterCreate',taskMaster);
      this.createTaskForm.controls.taskTitle.value = taskMaster.title.value;
      if(taskMaster.description && taskMaster.description && taskMaster.description.value){
        this.createTaskForm.controls.taskDescription.value= taskMaster.description.value;
      }
      this.createTaskForm.controls.userTaskCategory.value= taskMaster.category.value.id;
      this.createTaskForm.controls.userTaskType.value= taskMaster.type.value.id;
      this.createTaskForm.controls.userTaskPriority.value= taskMaster.priority.id;
      this.createTaskForm.controls.taskDays.value=  taskMaster.estDuration.value.days,
    this.createTaskForm.controls.taskHrs.value=  taskMaster.estDuration.value.hours,
    this.createTaskForm.controls.taskMin.value=  taskMaster.estDuration.value.minutes,
      this.estTime={ "days" :taskMaster.estDuration.value.days, "hours" :taskMaster.estDuration.value.hours, "minutes" : taskMaster.estDuration.value.minutes };

  }
  creteTaskMasterActivity(){
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null],
      taskDescription:[null],
      userTaskCategory:[null],
      userTaskType:[null],
      taskLocation:[null],
      areaName:[null],
      taskStatus:[null],
      taskDate:[null],
      taskDays:[null],
      taskHrs:[null],
      taskMin:[null],
      selectMember:[null],
      selectTaskManger:[null],
      userTaskPriority:[null],
      targetResult:[null],
      targetPotential:[null],
    }) 
        this.createBTimeField=true;
        this.updateBTimefield=false;
        this.selectHeader='Create Activity';
        this.activityTitle='Enter activity title';
        this.activityDescription='Enter activity description'
        this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
        console.log(' this.taskDueDate', this.taskDueDate);
        this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
        this.taskDueTime= "0000" ;
        console.log(' this.taskDueTime', this.taskDueTime)
        this.estDurationWithDay=this.taskDueTime;
        const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
        const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
        const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
        this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
        console.log('this.estTime',this.estTime)
        console.log('new Date()',new Date())
  }
  userInfo(){
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
        this.selectMember= user.firstName + user.lastName;
        this.selectTaskManger=user.firstName + user.lastName;
        this.assigneeId=user.id;
        this.selectTaskMangerId=user.id;
        this.locationId= user.bussLocs[0]
        if(user.userType === 1){
          this.userType='PROVIDER'
        }
  }
  getTaskmaster(){
    this.crmService.getTaskMasterList().subscribe((response)=>{
      console.log('TaskMasterList :',response);
    })
  }
  getLocation(){
    this.crmService.getProviderLocations().subscribe((res)=>{
      console.log('location.........',res)
      this.createTaskForm.controls.taskLocation.setValue(res[0].place);
      this.updteLocationId= res[0].id;
    })
  }
  getColor(status){
    if(status){
    if(status === 'New'){
      return '#0D2348'
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
  getAssignMemberList(){
    this.crmService.getMemberList().subscribe((memberList:any)=>{
      // console.log('memberList',memberList)
      this.allMemberList.push(memberList)
        // this.allMemberList.sort((a:any, b:any) => (a.firstName).localeCompare(b.firstName))
    },(error:any)=>{
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    })
  }
  getCategoryListData(){
    this.crmService.getCategoryList().subscribe((categoryList:any)=>{
      // console.log('category',categoryList);
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getTaskTypeListData(){
    this.crmService.getTaskType().subscribe((taskTypeList:any)=>{
      // console.log('taskTypeList',taskTypeList);
      this.taskTypeList.push(taskTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(taskStatus);
      if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster'){
        this.createTaskForm.controls.taskStatus.setValue(this.taskStatusList[0][0].id);
        // this.taskStatusModal=this.taskStatusList[0][0].id;
      }
      else if(this.type ==='SubUpdate'){
        this.createTaskForm.controls.taskStatus.setValue(parseInt(this.updateValue.statusId));
      }
      else {
        this.createTaskForm.controls.taskStatus.setValue(this.updateValue.status.id);
        // this.taskStatusModal=this.updateValue.status.id
      }
      
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getTaskPriorityListData(){
    this.crmService.getTaskPriority().subscribe((taskPriority:any)=>{
      console.log('taskPriority',taskPriority);
      this.taskPriorityList.push(taskPriority);
      if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster'){
        this.createTaskForm.controls.userTaskPriority.setValue(this.taskPriorityList[0][0].id);
        // this.taskPriority=this.taskPriorityList[0][0].id;
      }
      else if(this.type ==='SubUpdate'){
        this.createTaskForm.controls.userTaskPriority.setValue(parseInt(this.updateValue.priorityId))
      }
      else {
        this.createTaskForm.controls.userTaskPriority.setValue(this.updateValue.priority.id);
        // this.taskPriority=this.updateValue.priority.id;
      }
      
      console.log( this.taskPriority)
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }


  goback() {
    this.locationobj.back();
  }
  resetErrors(){
    this.taskError = null;

  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  hamdleTaskTitle(taskTitleValue){
    console.log('taskTitleValue',taskTitleValue)
    this.taskError=null
    this.boolenTaskError=false
    // if( !this.taskMasterData){
      if(taskTitleValue != ''){
        this.bErrormsg=false;
        this.errorMsgAny=''
      }else{
        this.bErrormsg=true;
        this.errorMsgAny='Please enter title'
      }
    // }
    

  }
  removeEmoji(taskTitleValue,event) { 
  }
  handleTaskDescription(textareaValue) {
    this.taskError=null
    this.boolenTaskError=false
  }
  selectManagerDialog(handleSelectManager:any){
    // console.log('handleselectMember',handleSelectManager);
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtaskSelectManager',
        header:'Assign Manager',
        memberList: this.allMemberList,
        assignMembername:handleSelectManager,
        updateSelectTaskManager:this.updateSelectTaskMangerDetailsToDialog,
        updateManagerId:this.updateManagerId,
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res)
    if(res===''){
      // console.log('Select task manager')
      this.selectTaskManger = this.updateValue.manager.name;//'Select task manager'

    }
    else{
      this.updateSelectTaskMangerDetailsToDialog=res;
    // console.log('updateSelectTaskMangerDetailsToDialog',this.updateSelectTaskMangerDetailsToDialog)
    this.selectTaskManger=((res.firstName + res.lastName))
    this.selectTaskMangerId= res.id;
    this.updateManagerId=this.selectTaskMangerId
    }
  })
  }
  
  selectMemberDialog(handleselectMember:any){
    // console.log('handleselectMember',handleselectMember)
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtaskSelectMember',
        header:'Assign Member',
        memberList: this.allMemberList,
        assignMembername:handleselectMember,
        updateSelectedMember:this.updateAssignMemberDetailsToDialog,
        updateAssignMemberId:this.updateMemberId
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res);
    if(res===''){
      // console.log('Select Manager')
      this.selectMember =  this.updateValue.assignee.name;//'Select Manager'
    }else{
      this.updateAssignMemberDetailsToDialog=res;
    console.log('this.updateAssignMemberDetailsToDialog',this.updateAssignMemberDetailsToDialog)
    // this.selectMember = (res.firstName + res.lastName);
    this.selectMember = (res.firstName + ' ' + res.lastName);
    this.userType = res.userType;
    // this.locationName = res.locationName;
    this.locationId = res.bussLocations[0];
    console.log('this.updateAssignMemberDetailsToDialog',res)
    if(res.place)
    {
      this.createTaskForm.controls.taskLocation.setValue(res.place);
    }
    this.assigneeId= res.id;
    console.log('this.assigneeid',res.id)
    this.updateMemberId=this.assigneeId;
    this.updteLocationId= this.locationId;
    }
  })
  }
  hamdleTaskManager(taskManger){
    // console.log(taskManger)
  }
  handleTaskCategorySelection(taskCategory){
    console.log('taskCategory',taskCategory)
    console.log('this.taskMasterData',this.taskMasterData)
    if(taskCategory !=undefined){
      this.bErrormsgCategory=false
      this.errorMsgAnyCategory=''
    }
    console.log(taskCategory)
  }
  handleTaskTypeSelection(taskType:any){
    console.log('taskType',taskType)
    if( taskType != undefined){
      this.bErrormsgType=false
      this.errorMsgAnyType='';
    }

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e){
    const date1= this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd');
    this.selectedDate= date1;
    // console.log('date.',date1)
    const date2= this.datePipe.transform(new Date(),'yyyy-MM-dd');
    // console.log('date2',date2);
    if(date1> date2){
      const diffBtwDate = Date.parse(date1) - Date.parse(date2);
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    }
    else{
      const diffBtwDate = Date.parse(date2) - Date.parse(date1);
      // console.log('diffBtwDate',diffBtwDate)
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    }
    
  }
  handleTaskEstDuration(estDuration:any){
    console.log("entered")
    this.estDurationWithDay=this.taskDueDays;
    const estDurationDay=this.createTaskForm.controls.taskDays.value
    const estDurationHour=this.createTaskForm.controls.taskHrs.value
    const estDurationMinute= this.createTaskForm.controls.taskMin.value
    this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinute };
    console.log('estDurationDay',this.estTime)

  }
  openTimeField(){
    this.createBTimeField=true;
      this.updateBTimefield=false;
  }
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 24 ? 'am' : 'pm';
    if(parseInt(hour) == 0)
     hour = 24;
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 24 ? hour - 24 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
      return `${hour}:${min} ${part}`
    // }
    
  }
  saveCreateTask(){
    console.log('this.type',this.userType)
    this.api_loading_CreateActivity=true;
    if(this.type ==='SubUpdate'){
      console.log('this.subActivityTaskUid',this.subActivityTaskUid)
      const SubUpdateTaskData:any = {
        "title":this.createTaskForm.controls.taskTitle.value,
        "description":this.createTaskForm.controls.taskDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
        "type":{"id":this.createTaskForm.controls.userTaskType.value},
  
        "status":{"id":this.createTaskForm.controls.taskStatus.value},
        "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
        "dueDate" : this.datePipe.transform(this.createTaskForm.controls.taskDate.value,'yyyy-MM-dd'),
        "location" : { "id" : this.updteLocationId},
        "locationArea" : this.createTaskForm.controls.areaName.value,
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.createTaskForm.controls.targetResult.value,
        "targetPotential" : this.createTaskForm.controls.targetPotential.value,
        "estDuration" : this.estTime    
      }
      console.log('SubUpdateTaskData',SubUpdateTaskData)
      if((this.updateUserType==='PROVIDER' || this.updateUserType==='CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null)){
        // this.api_loading = true;
        console.log("2")
        this.boolenTaskError=false;
        console.log('SubUpdateTaskData',SubUpdateTaskData)
        this.crmService.updateTask(this.subActivityTaskUid, SubUpdateTaskData).subscribe((response)=>{
          console.log('afterUpdateList',response);
          setTimeout(() => {
            this.api_loading_CreateActivity=false;
            this.createTaskForm.reset();
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
    } else if(this.type ==='Update' && this.type !=='SubUpdate' || (this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate' && this.crmService.taskActivityName!='CreatE' && this.crmService.taskActivityName !='CreteTaskMaster')){
      console.log("est time update data : ",this.estTime  )
      const updateTaskData:any = {
        "title":this.createTaskForm.controls.taskTitle.value,
        "description":this.createTaskForm.controls.taskDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
        "type":{"id":this.createTaskForm.controls.userTaskType.value},
  
        "status":{"id":this.createTaskForm.controls.taskStatus.value},
        "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
        "dueDate" : this.datePipe.transform(this.createTaskForm.controls.taskDate.value,'yyyy-MM-dd'),
        "location" : { "id" : this.updteLocationId},
        "locationArea" : this.createTaskForm.controls.areaName.value,

  
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.createTaskForm.controls.targetResult.value,
        "targetPotential" : this.createTaskForm.controls.targetPotential.value,
        "estDuration" : this.estTime    
      }
      console.log('updateTaskData',updateTaskData)
      if((this.updateUserType==='PROVIDER' || this.updateUserType==='CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null)){
        // this.api_loading = true;
        console.log("2")
        this.boolenTaskError=false;
        console.log('updateTaskData',updateTaskData)
        this.crmService.updateTask(this.updateValue.taskUid, updateTaskData).subscribe((response)=>{
          console.log('afterUpdateList',response);
          setTimeout(() => {
            this.api_loading_CreateActivity=false;
            this.createTaskForm.reset();
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
     
      console.log(' this.updateUserType', this.updateUserType)

    } else if((this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate' && this.crmService.taskActivityName!='CreatE' && this.crmService.taskActivityName !='CreteTaskMaster') || this.type===undefined){
    console.log("Here");
    if (!this.userType || this.userType===undefined) {
      this.userType = 'PROVIDER';
    }
      const createTaskData:any = {
      "originUid" : this.taskUid,
      "title":this.createTaskForm.controls.taskTitle.value,
      "description":this.createTaskForm.controls.taskDescription.value,
      "userType":this.userType,
      "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
      "type":{"id":this.createTaskForm.controls.userTaskType.value},

      "status":{"id":this.createTaskForm.controls.taskStatus.value},
      "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
      "dueDate" : this.datePipe.transform(this.createTaskForm.controls.taskDate.value,'yyyy-MM-dd'),
      "location" : { "id" : this.locationId},
      "locationArea":this.createTaskForm.controls.areaName.value,
      "assignee":{"id":this.assigneeId},
      "manager":{"id":this.selectTaskMangerId},
      "targetResult" : this.createTaskForm.controls.targetResult.value,
      "targetPotential" : this.createTaskForm.controls.targetPotential.value,
      "estDuration" : this.estTime   
    }
    console.log('createTaskData',createTaskData)
    console.log('this.userType',this.userType)
    if(this.taskMasterData){
      if(this.userType==='PROVIDER' || this.userType==='CONSUMER' || this.userType==='ADMIN'){
        // console.log('...................kl')
        this.boolenTaskError=false;
        // this.api_loading = true;
        // console.log("1")
        this.crmService.addTask(createTaskData).subscribe((response)=>{
          console.log('afterCreateList',response);
          setTimeout(() => {
            this.api_loading_CreateActivity=false;
            this.snackbarService.openSnackBar('Successfully created activity');
            this.createTaskForm.reset();
          this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
    }
    else{
      if((this.userType==='PROVIDER' || this.userType==='CONSUMER' || this.userType==='ADMIN') && (this.createTaskForm.controls.taskTitle.value != null) && (this.createTaskForm.controls.userTaskCategory.value != null)
      && (this.createTaskForm.controls.userTaskType.value != null) ){
        console.log('...................kl')
        this.boolenTaskError=false;
        // this.api_loading = true;
        this.bErrormsg=false;
        this.errorMsgAny='';
        this.bErrormsgType=false;
        this.errorMsgAnyType='';
        this.bErrormsgCategory=false;
        this.errorMsgAnyCategory=''
        console.log("1")
        this.crmService.addTask(createTaskData).subscribe((response)=>{
          console.log('afterCreateList',response);
          setTimeout(() => {
            this.api_loading_CreateActivity=false;
            this.snackbarService.openSnackBar('Successfully created activity');
            this.createTaskForm.reset();
          this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
      else{
        if(this.createTaskForm.controls.taskTitle.value === null){
          this.bErrormsg=true;
        this.errorMsgAny='Please enter title';
        }else if(this.createTaskForm.controls.userTaskCategory.value === null){
          this.bErrormsgCategory=true;
          this.errorMsgAnyCategory='Please select category'
        }
        else if(this.createTaskForm.controls.userTaskType.value === null){
          this.bErrormsgType=true;
          this.errorMsgAnyType='Please select type';
        }
        // console.log('this.errorMsgAny',this.errorMsgAny)

      }
    }
    }
  }
  
}
