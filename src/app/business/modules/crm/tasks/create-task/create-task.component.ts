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
  src: any;
  constructor(private locationobj: Location,
    private router: Router,
    private activated_route: ActivatedRoute,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createTaskFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe,
     private _Activatedroute:ActivatedRoute,
     private groupService:GroupStorageService
  ) { }
  ngOnInit(): void {
    this.activated_route.queryParams.subscribe(qparams => {
      console.log('qparams',qparams)
      this.updateValue=qparams;
      console.log(' this.updateValue', this.updateValue);
      if (qparams.type) {
          this.type = qparams.type;
      }
      if(qparams.src)
      {
        this.src = qparams.src;
      }
    });
    console.log('this.type',this.type,this.src)
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
     if(this.crmService.taskActivityName==='CreatE'){
    this.creatEOthersActivity()
    }
    else if(this.crmService.taskActivityName =='Create'){
      this.createActivity()
    }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    this.getLocation()
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
    this.selectHeader='Create activity';
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
      this.selectHeader='Create activity';
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
      this.allMemberList.push(memberList)
    },(error:any)=>{
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(taskStatus);
      if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster'){
        this.createTaskForm.controls.taskStatus.setValue(this.taskStatusList[0][0].id);
      }
      else if(this.type ==='SubUpdate'){
        this.createTaskForm.controls.taskStatus.setValue(parseInt(this.updateValue.statusId));
      }
      else {
        this.createTaskForm.controls.taskStatus.setValue(this.updateValue.status.id);
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
      }
      else if(this.type ==='SubUpdate'){
        this.createTaskForm.controls.userTaskPriority.setValue(parseInt(this.updateValue.priorityId))
      }
      else {
        this.createTaskForm.controls.userTaskPriority.setValue(this.updateValue.priority.id);
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
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  hamdleTaskTitle(taskTitleValue){
    console.log('taskTitleValue',taskTitleValue)
    this.taskError=null
    this.boolenTaskError=false
      if(taskTitleValue != ''){
        this.bErrormsg=false;
        this.errorMsgAny=''
      }else{
        this.bErrormsg=true;
        this.errorMsgAny='Please enter title'
      }
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
     if( this.type===undefined){
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
    if(this.taskMasterData){
      if(this.userType==='PROVIDER' || this.userType==='CONSUMER' || this.userType==='ADMIN'){
        this.boolenTaskError=false;
        this.crmService.addTask(createTaskData).subscribe((response)=>{
          console.log('afterCreateList',response);
          setTimeout(() => {
            this.api_loading_CreateActivity=false;
            this.snackbarService.openSnackBar('Successfully created activity');
            this.createTaskForm.reset();
            if(this.src == "updateactivity")
            {
                this.router.navigate(['provider', 'task']);
            }
            else{
                this.router.navigate(['provider', 'crm']);
            }
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
            if(this.src == "updateactivity")
              {
                  this.router.navigate(['provider', 'task']);
              }
              else{
                  this.router.navigate(['provider', 'crm']);
              }
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
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
      }
    }
    }
  }
  
}
