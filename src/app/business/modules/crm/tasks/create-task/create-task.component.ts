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
  api_loading = false;

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
  public boolenTaskError:boolean=false
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
    this.taskDueDate= new Date()
    console.log('this.taskDueDate',this.taskDueDate)
    // this.taskDueTime=this.datePipe.transform(this.taskDueDate.getTime(),'h:mm a')
    // console.log('this.taskDueTime',this.taskDueTime)
    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null,[Validators.required]],
      taskDescription:[null,[Validators.required]],
      taskManager:[null],
      userTaskCategory:[null],
      userTaskType:[null],
      taskLocation:[null],
      taskStatus:[null],
      taskDate:[null],
      taskTime:[null],
      userTaskPriority:[null]
    }) 
    // console.log('jjjjj',this.crmService.getMemberList())
    // const memberList = this.crmService.getMemberList()
    // this.categoryListData.push(memberList)
    // console.log('memberList',memberList)
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
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

  }
  handleTaskDescription(textareaValue) {
    console.log(textareaValue)
    this.taskError=null
  }
  
  selectMemberDialog(handleselectMember:any){
    console.log('handleselectMember',handleselectMember)
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtask',
        header:'Assign Member',
        memberList: this.allMemberList,
        assignMembername:handleselectMember
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('afterSelectPopupValue',res)
    this.selectMember = (res.firstName + res.lastName);
    this.userType = res.userType;
    this.locationName = res.locationName;
    this.locationId = res.bussLocations[0]

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
  showCreateTaskButtonCaption() {
    let caption = '';
    caption = 'Confirm';
    return caption;
}
  saveCreateTask(){
    console.log('this.locationId',this.locationId)
    const loc=this.locationId
    console.log('loc..',loc)
    // console.log('this.createTaskForm.controls.userTaskPriority.value',this.createTaskForm.controls.userTaskPriority.value.id)
    // console.log('dateformat',this.createTaskForm.controls.taskDate.value)
    const createTaskData:any = {
      // "parentTaskId":1,
      "title":this.createTaskForm.controls.taskTitle.value,
      "description":this.createTaskForm.controls.taskDescription.value,
      // "manager":this.createTaskForm.controls.taskManager.value,
      "userType":this.userType,
      "category":{"id":this.createTaskForm.controls.userTaskCategory.value.id,},
      "type":{"id":this.createTaskForm.controls.userTaskType.value.id,},
      "status":{"id":this.createTaskForm.controls.taskStatus.value.id,},
      
      // "category" : { "id" : 1},
      // "type" : { "id" : 1},
      "location" : { "id" : this.locationId},
      "dueDate" : this.selectedDate,
      // this.selectedDate,
      // "priority":this.createTaskForm.controls.userTaskPriority.value.id,
    }
    console.log(createTaskData)
    console.log('this.userType',this.userType)
    if(this.userType===('PROVIDER' || 'CONSUMER')){
      this.boolenTaskError=false;
      this.crmService.addTask(createTaskData).subscribe((response)=>{
        console.log(response);
        this.router.navigate(['provider', 'task'])
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
    }
    else{
      this.boolenTaskError=true;
      this.taskErrorText='Please Select Assign Member'

    }
    

  }
   onSubmitCraeteTaskForm(){
    console.log('taskTitle',this.createTaskForm.controls.taskTitle.value)
    console.log('taskDescription',this.createTaskForm.controls.taskDescription.value);
    console.log('taskManager',this.createTaskForm.controls.taskManager.value)
  }

}
