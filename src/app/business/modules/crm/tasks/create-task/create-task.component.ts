import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
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
// import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  tooltipcls = '';
  select_cap = Messages.SELECT_CAP;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  perPage = projectConstants.PERPAGING_LIMIT;
  apiloading = true;
  availableDates: any = [];
  minDate;
  maxDate;
  ddate;
  api_loading = true;

  //form variable start
  createTaskForm:any;
  taskError:null;
  selectMember:any=''
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
  //update variable;
  public updateValue:any;
  public updateTitleTask:any;
  task
  public selectHeader:any;
  public updateUserType:any;
  public updateMemberId:any;
  public updateManagerId:any;
  public updateTaskId:any
  constructor(private locationobj: Location,
    // private lStorageService: LocalStorageService,
    private router: Router,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createTaskFB: FormBuilder,
     private dialog: MatDialog, private snackbarService: SnackbarService,
     private datePipe:DatePipe
     ) { 
      this.router.navigate(['provider', 'task','create-task'])
     }

  ngOnInit(): void {
    // console.log('craete',this.crmService.taskActivityName)
    // console.log('edit',this.crmService.taskActivityName)
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
    if(this.crmService.taskActivityName!='Create'){
      this.selectHeader='Update Task'
      this.updateValue=this.crmService.taskToCraeteViaServiceData;
      // this.selectTaskManger=this.updateValue.name;
      const time: any={
        hours:this.updateValue.estDuration.hours,minutes:this.updateValue.estDuration.minutes
      }
      console.log('time',time)
      console.log(' this.updateValue', this.updateValue)
      this.GetTime(time)
      
      this.createTaskForm.patchValue({
        taskTitle:this.updateValue.title,
        taskDescription:this.updateValue.description,
        targetPotential:this.updateValue.targetPotential,
        targetResult:this.updateValue.targetResult,
        userTaskCategory:this.updateValue.category.id,
        userTaskType:this.updateValue.type.id,
        taskStatus:this.updateValue.status.id,
        userTaskPriority:this.updateValue.priority.id,
        taskTime:this.updateValue.estDuration.hours
      })
      this.locationName =this.updateValue.location.name;
      this.taskDueDate=this.updateValue.dueDate;
      this.selectMember= this.updateValue.assignee.name;
      this.updateMemberId=this.updateValue.assignee.id;
      this.selectTaskManger= this.updateValue.manager.name;
      this.updateManagerId= this.updateValue.manager.id
      this.updateUserType=this.updateValue.userTypeEnum;
    }
    else{
      this.selectHeader='Add Task'
    }
   
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    // this.getTotalTask()
  }
  // getTotalTask(){
  //   this.crmService.getTotalTask().subscribe((resp)=>{
  //     console.log('ressssssssss',resp)
  //     if(resp[0].id == this.updateValue.id){
  //       this.updateTaskId=
  //     }
  //   })
  // }
  GetTime(date) {
    var currentTime = (new Date(date.hours))
    console.log('currentTime',currentTime)
    var hours = currentTime.getHours()
    //Note: before converting into 12 hour format
    var suffix = '';
    if (hours > 11) {
        suffix += "PM";
    } else {
        suffix += "AM";
    }
    var minutes = currentTime.getMinutes()
    if (minutes < 10) {
        minutes = 0 + minutes
    }
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    var time = hours + ":" + minutes + " " + suffix;
    return time;
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
      console.log('category',categoryList);
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getTaskTypeListData(){
    this.crmService.getTaskType().subscribe((taskTypeList:any)=>{
      console.log('taskTypeList',taskTypeList);
      this.taskTypeList.push(taskTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(taskStatus)
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getTaskPriorityListData(){
    this.crmService.getTaskPriority().subscribe((taskPriority:any)=>{
      console.log('taskPriority',taskPriority);
      this.taskPriorityList.push(taskPriority)
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
    console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  // taskTitle(event){
  //   // console.log(event)
  // }
  hamdleTaskTitle(taskTitleValue){
    console.log('taskTitleValue',taskTitleValue)
    this.taskError=null
    this.boolenTaskError=false

  }
  handleTaskDescription(textareaValue) {
    console.log(textareaValue)
    this.taskError=null
    this.boolenTaskError=false
  }
  selectManagerDialog(handleSelectManager:any){
    console.log('handleselectMember',handleSelectManager);
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtaskSelectManager',
        header:'Assign Manager',
        memberList: this.allMemberList,
        assignMembername:handleSelectManager
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res)
    // this.selectMember = (res.firstName + res.lastName);
    this.selectTaskManger=((res.firstName + res.lastName))
    // this.userType = res.userType;
    // this.locationName = res.locationName;
    // this.locationId = res.bussLocations[0];
    // this.assigneeId= res.id
    this.selectTaskMangerId= res.id;
    this.updateManagerId=this.selectTaskMangerId

  })

  }
  
  selectMemberDialog(handleselectMember:any){
    console.log('handleselectMember',handleselectMember)
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtaskSelectMember',
        header:'Assign Member',
        memberList: this.allMemberList,
        assignMembername:handleselectMember
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res)
    this.selectMember = (res.firstName + res.lastName);
    // this.selectTaskManger=((res.firstName + res.lastName))
    this.userType = res.userType;
    this.locationName = res.locationName;
    this.locationId = res.bussLocations[0];
    this.assigneeId= res.id;
    this.updateMemberId=this.assigneeId
    // this.selectTaskMangerId= res.id

  })
  }
  hamdleTaskManager(taskManger){
    console.log(taskManger)
  }
  handleTaskCategorySelection(taskCategory){
    console.log(taskCategory)
    // this.boolenTaskError=false

  }
  handleTaskTypeSelection(taskType:any){
    console.log('taskType',taskType)

  }
  handleTaskPrioritySelection(taskPriority){
    console.log('taskPriority',taskPriority);
    console.log('this.createTaskForm.controls.userTaskPriority.value',this.createTaskForm.controls.userTaskPriority.value)
  }
  handleTaskLocation(taskLocation){
    console.log(taskLocation)

  }
  handleTaskStatus(taskStatus){
    console.log(taskStatus)

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e){
    console.log(e)
    const date=  this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd')
    this.selectedDate= date;
    console.log('date.',date)
  }
  handleTaskEstDuration(estDuration:any){
    console.log('estDurationb',estDuration)
    if(estDuration<='24:00'){
      console.log('...............gggg')
      this.transform(estDuration)
    }

  }
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 24 ? 'pm' : 'am';
    if(parseInt(hour) == 0)
     hour = 24;
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 24 ? hour - 24 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    console.log('`${hour}:${min} ${part}`',`${hour}:${min} ${part}`);
    if(hour<24){
      const day:number=0;
      this.selectedTime={ "days" : day, "hours" : hour, "minutes" : min };
      return `${hour}:${min} ${part}`
    }
    
  }
  handleTargetResult(targetResult){
    console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential){
  console.log('targetPotential',targetPotential)
  }
  showCreateTaskButtonCaption() {
    let caption = '';
    caption = 'Confirm';
    return caption;
}
  saveCreateTask(){
    if(this.crmService.taskActivityName!='Create'){
      console.log('this.updateValue.taskUid',this.updateValue.taskUid)
      console.log('jjjjjjjjjjjjjjjjjjjjjjupdateeeeeeeeeeee');
      console.log('....',this.createTaskForm.controls.taskTitle.value)
      const updateTaskData:any = {
        "title":this.createTaskForm.controls.taskTitle.value,
        "description":this.createTaskForm.controls.taskDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.createTaskForm.controls.userTaskCategory.value},
        "type":{"id":this.createTaskForm.controls.userTaskType.value},
  
        "status":{"id":this.createTaskForm.controls.taskStatus.value},
        "priority":{"id":this.createTaskForm.controls.userTaskPriority.value},
        "dueDate" : this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd'),
        "location" : { "id" : this.updateValue.location.id},
  
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.createTaskForm.controls.targetResult.value,
        "targetPotential" : this.createTaskForm.controls.targetPotential.value,
        "estDuration" : this.selectedTime   
      }
      if(this.updateUserType===('PROVIDER' || 'CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null) && (this.createTaskForm.controls.taskDescription.value !=null)){
        this.boolenTaskError=false;
        console.log('updateTaskData',updateTaskData)
        this.crmService.updateTask(this.updateValue.taskUid, updateTaskData).subscribe((response)=>{
          console.log('afterUpdateList',response);
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
     
      console.log(' this.updateUserType', this.updateUserType)

    }
    else{
      console.log('this.locationId',this.locationId)
    console.log('his.assigneeId',this.assigneeId);
    console.log('this.selectedTime',this.selectedTime)
    console.log('this.createTaskForm.controls.taskTitle.value',this.createTaskForm.controls.taskTitle.value)
    const createTaskData:any = {
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
      "estDuration" : this.selectedTime   
    }
    console.log('createTaskData',createTaskData)
    console.log('this.userType',this.userType)
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
