import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
// import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
// import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  public tooltipcls:any= '';
  public select_cap:any= Messages.SELECT_CAP;
  public newDateFormat:any= projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  public perPage:any= projectConstants.PERPAGING_LIMIT;
  public apiloading:any= true;
  public availableDates: any = [];
  public minDate:any=new Date();
  public maxDate:any;
  public ddate:any;
  public api_loading:any= true;

  //form variable start
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
  public locationId:any;
  public taskDueDate:any;
  public taskDueTime:any;
  public selectedDate:any;
  public taskErrorText:any;
  public boolenTaskError:boolean=false;
  public assigneeId:any;
  public selectedTime:any;
  public selectTaskManger:any;
  public selectTaskMangerId:any;
  public createBTimeField:boolean=false;
  public updateBTimefield:boolean=false;
  public dayGapBtwDate:any;
  public hour:any;
  public minute:any;
  //update variable;
  public updateValue:any;
  public updateTitleTask:any;
  public task:any;
  public selectHeader:any;
  public updateUserType:any;
  public updateMemberId:any;
  public updateManagerId:any;
  public updateTaskId:any;
  public updteLocationId:any;
  taskUid : any;
  taskDetails: any;
  public minTime=new Date().getTime();
  public bEstDuration:boolean=false;
  public updateAssignMemberDetailsToDialog:any;
  public updateSelectTaskMangerDetailsToDialog:any;
  public sel_loc:any;
  taskStatusModal: any;
  taskPriority: any;
  public estDurationWithDay:any;
  public estTime:any;
  constructor(private locationobj: Location,
    // private lStorageService: LocalStorageService,
    private router: Router,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createTaskFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe,
     private _Activatedroute:ActivatedRoute,

     ) { 
      //this.router.navigate(['provider', 'task','create-task'])
     }

  ngOnInit(): void {
    // const loc = this.groupService.getitemFromGroupStorage('loc_id');
    //     this.sel_loc = loc.id;
    //     console.log('this.sel_loc',this.sel_loc)


    this._Activatedroute.paramMap.subscribe(params => { 
      this.taskUid = params.get('taskid');
      if(this.taskUid)
      {
        this.crmService.taskActivityName = "subTaskCreate";
      }
    });
    // this._Activatedroute.paramMap.subscribe(params => { 
    //   this.taskUid = params.get('taskid');
    //   if(this.taskUid)
    //   {
    //     this.crmService.taskActivityName = "Update";
    //   }
    // });

    this.api_loading=false;
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null,[Validators.required]],
      taskDescription:[null,[Validators.required]],
      userTaskCategory:[null,[Validators.required]],
      userTaskType:[null,[Validators.required]],
      taskLocation:[null,[Validators.required]],
      taskStatus:[null],
      taskDate:[null,[Validators.required]],
      taskTime:[null],
      userTaskPriority:[null],
      targetResult:[null],
      targetPotential:[null],
    }) 
    if(this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate'){
      this.selectHeader='Update Task'
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
      this.updteLocationId= this.updateValue.location.id
      this.taskDueDate=this.updateValue.dueDate;
      this.selectMember= this.updateValue.assignee.name;
      this.updateMemberId=this.updateValue.assignee.id;
      this.selectTaskManger= this.updateValue.manager.name;
      this.updateManagerId= this.updateValue.manager.id
      this.updateUserType=this.updateValue.userTypeEnum;
      // this.taskDueTime=this.updateValue.estDuration
      }
      else{
        this.router.navigate(['provider', 'task']);
      }
    }
    else{
      if(this.crmService.taskActivityName == "subTaskCreate")
      {
				      this.createBTimeField=true;
      this.updateBTimefield=false;
      this.selectMember='Select Member';
      this.selectTaskManger='Select Task Manger'
        this.selectHeader='Add Subtask';
      }
      else
      {
		        this.createBTimeField=true;
      this.updateBTimefield=false;
      this.selectMember='Select Member';
      this.selectTaskManger='Select Task Manger'
        this.selectHeader='Add Task';
      }
    }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    this.getLocation()
    
  }
  getLocation(){
    this.crmService.getProviderLocations().subscribe((res)=>{
      console.log('location.........',res)
      this.locationName= res[0].place
    })
  }
  getAssignMemberList(){
    this.crmService.getMemberList().subscribe((memberList:any)=>{
      console.log('memberList',memberList)
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
      if(this.crmService.taskActivityName==='Create'){
        this.taskStatusModal=this.taskStatusList[0][0].id;
      }
      else{
        this.taskStatusModal=this.updateValue.status.id
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
      if(this.crmService.taskActivityName==='Create'){
        this.taskPriority=this.taskPriorityList[0][0].id;
      }else{
        this.taskPriority=this.updateValue.priority.id;
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
  // taskTitle(event){
  //   // console.log(event)
  // }
  hamdleTaskTitle(taskTitleValue){
    // console.log('taskTitleValue',taskTitleValue)
    this.taskError=null
    this.boolenTaskError=false

  }
  handleTaskDescription(textareaValue) {
    // console.log(textareaValue)
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
      this.selectTaskManger ='Select task manager'

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
      this.selectMember ='Select Manager'
    }else{
      this.updateAssignMemberDetailsToDialog=res;
    console.log('this.updateAssignMemberDetailsToDialog',this.updateAssignMemberDetailsToDialog)
    this.selectMember = (res.firstName + res.lastName);
    this.userType = res.userType;
    // this.locationName = res.locationName;
    this.locationId = res.bussLocations[0];
    this.assigneeId= res.id;
    this.updateMemberId=this.assigneeId;
    this.updteLocationId= this.locationId;
    }
  })
  }
  hamdleTaskManager(taskManger){
    // console.log(taskManger)
  }
  handleTaskCategorySelection(taskCategory){
    // console.log(taskCategory)
    // this.boolenTaskError=false

  }
  handleTaskTypeSelection(taskType:any){
    // console.log('taskType',taskType)

  }
  handleTaskPrioritySelection(taskPriority,taskPriorityText:any){
    // console.log('taskPriority',taskPriority);
    // console.log('taskPriorityText',taskPriorityText)
    // console.log('this.createTaskForm.controls.userTaskPriority.value',this.createTaskForm.controls.userTaskPriority.value)
  }
  handleTaskLocation(taskLocation){
    // console.log(taskLocation)

  }
  handleTaskStatus(taskStatus){
    // console.log(taskStatus)

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e){
    this.bEstDuration=true;
    this.updateBTimefield=false;
    this.createBTimeField=true;
    
    // console.log(e)
    const date1= this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd');
    this.selectedDate= date1;
    // console.log('date.',date1)
    const date2= this.datePipe.transform(new Date(),'yyyy-MM-dd');
    // console.log('date2',date2);
    if(date1> date2){
      const diffBtwDate = Date.parse(date1) - Date.parse(date2);
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    // console.log('diffInDays',diffIndays)
      // console.log('selected date graeter',date1)
    }
    else{
      const diffBtwDate = Date.parse(date2) - Date.parse(date1);
      // console.log('diffBtwDate',diffBtwDate)
    const diffIndays = diffBtwDate / (1000 * 3600 * 24);
    this.dayGapBtwDate= diffIndays
    // console.log('diffInDays',diffIndays);
      // console.log('both equal');
    }
    
  }
  handleTaskEstDuration(estDuration:any){
    const time= this.datePipe.transform(new Date().getTime(),'HH');
    const timeMInute= this.datePipe.transform(new Date().getTime(),'mm');
    // console.log('time',time)
    this.hour= time;
    this.minute=timeMInute
    // this.taskDueTime=this.datePipe.transform(estDuration,'d:h:mm')
    
    console.log('estDurationb',estDuration)
    if(estDuration<='24:00'){
      // console.log('...............gggg')
      this.transform(estDuration)
    }
    this.estDurationWithDay=this.taskDueTime;
    console.log('this.estDurationWithDay',this.estDurationWithDay);
    const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
    const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
    const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
    this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
    console.log('estDurationDay',estDurationDay)

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
    // console.log('`${hour}:${min} ${part}`',`${hour}:${min} ${part}`);
    // if(hour<24){
      // const day:number=0;
      // if(this.dayGapBtwDate==0){
      //   // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
      //   this.selectedTime={ "days" : this.dayGapBtwDate, "hours" : 24-hour, "minutes" : 60-min };
      // }
      // else{
      //   // console.log('this.hour',this.hour)
      //   // console.log('hour',hour);
      //   if(this.hour >hour){
      //     this.selectedTime={ "days" : this.dayGapBtwDate, "hours" :this.hour-hour, "minutes" : this.minute-min };
      //     // console.log('this.selectedTime1',this.selectedTime)
      //   }
      //   else{
      //     this.selectedTime={ "days" : this.dayGapBtwDate, "hours" : hour-this.hour, "minutes" : min-this.minute };
      //     // console.log('this.selectedTime2',this.selectedTime)
      //   }
      // }
      return `${hour}:${min} ${part}`
    // }
    
  }
  handleTargetResult(targetResult){
    // console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential){
  // console.log('targetPotential',targetPotential)
  }
  showCreateTaskButtonCaption() {
    if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' ){
      let caption = '';
      caption = 'Add';
      return caption;
    }
    else{
      let caption = '';
      caption = 'Update';
      return caption;
    }
    
}
  saveCreateTask(){
    this.api_loading = true;
    if(this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate'){
      // console.log('this.updateValue.taskUid',this.updateValue.taskUid)
      // console.log('jjjjjjjjjjjjjjjjjjjjjjupdateeeeeeeeeeee');
      // console.log('....',this.createTaskForm.controls.taskTitle.value)
      const updateTaskData:any = {
        //"ParentTaskUid" : 'ta_b7b309d3-9881-4b8c-9f77-896b1293e9c1-pt',
        "title":this.createTaskForm.controls.taskTitle.value,
        "description":this.createTaskForm.controls.taskDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
        "type":{"id":this.createTaskForm.controls.userTaskType.value},
  
        "status":{"id":this.createTaskForm.controls.taskStatus.value},
        "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
        "dueDate" : this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd'),
        "location" : { "id" : this.updteLocationId},
  
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.createTaskForm.controls.targetResult.value,
        "targetPotential" : this.createTaskForm.controls.targetPotential.value,
        "estDuration" : this.estTime    
      }
      if(this.updateUserType===('PROVIDER' || 'CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null) && (this.createTaskForm.controls.taskDescription.value !=null)){
        this.boolenTaskError=false;
        console.log('updateTaskData',updateTaskData)
        this.crmService.updateTask(this.updateValue.taskUid, updateTaskData).subscribe((response)=>{
          console.log('afterUpdateList',response);
          setTimeout(() => {
            this.createTaskForm.reset();
          this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
        })
      }
     
      console.log(' this.updateUserType', this.updateUserType)

    }
    else{
    //   console.log('this.locationId',this.locationId)
    // console.log('his.assigneeId',this.assigneeId);
    // console.log('this.selectedTime',this.selectedTime)
    // console.log('this.createTaskForm.controls.taskTitle.value',this.createTaskForm.controls.taskTitle.value)
    const createTaskData:any = {
      "parentTaskUid" : this.taskUid,
      "title":this.createTaskForm.controls.taskTitle.value,
      "description":this.createTaskForm.controls.taskDescription.value,
      "userType":this.userType,
      "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
      "type":{"id":this.createTaskForm.controls.userTaskType.value},

      "status":{"id":this.createTaskForm.controls.taskStatus.value},
      "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
      "dueDate" : this.selectedDate,
      "location" : { "id" : this.locationId},

      "assignee":{"id":this.assigneeId},
      "manager":{"id":this.selectTaskMangerId},
      "targetResult" : this.createTaskForm.controls.targetResult.value,
      "targetPotential" : this.createTaskForm.controls.targetPotential.value,
      "estDuration" : this.estTime   
    }
    console.log('createTaskData',createTaskData)
    // console.log('this.userType',this.userType)
    if(this.userType===('PROVIDER' || 'CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null) && (this.createTaskForm.controls.taskDescription.value !=null)){
      this.boolenTaskError=false;
    
      this.crmService.addTask(createTaskData).subscribe((response)=>{
        console.log('afterCreateList',response);
        setTimeout(() => {
          // this.crmService.addAssigneeMember(response.uid,this.assigneeId).subscribe((res:any)=>{
          //   console.log(res)
          // })
          this.createTaskForm.reset();
        this.router.navigate(['provider', 'task']);
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
    }
    }
  }
   onSubmitCraeteTaskForm(){
    // console.log('taskTitle',this.createTaskForm.controls.taskTitle.value)
    // console.log('taskDescription',this.createTaskForm.controls.taskDescription.value);
    // console.log('taskManager',this.createTaskForm.controls.taskManager.value)
  }

}
