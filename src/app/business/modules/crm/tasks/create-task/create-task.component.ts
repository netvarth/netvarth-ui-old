import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location,DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder,Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
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
  public areaName:any;
  public locationId:any;
  public taskDueDate:any;
  public taskDueTime:any;
  public taskDueDays:any;
  public taskDueHrs:any;
  public taskDueMin:any;
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
  estDurationWithTime: any;
  taskMasterData: any;
  public errorMsgAny:string='';
  public bErrormsg:boolean=false;
  public bErrormsgCategory:boolean=false;
  public errorMsgAnyCategory:string=''
  public bErrormsgType:boolean=false;
  public errorMsgAnyType:string=''
  public activityTitle:any;
  public activityDescription:any;
  type: any;
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
      //this.router.navigate(['provider', 'task','create-task'])
     }

  ngOnInit(): void {
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.type) {
          this.type = qparams.type;
      }
    });
    // console.log('this.type',this.type)
    console.log("this.crmService.taskActivityName1",this.crmService.taskActivityName);
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
        this.selectMember= user.firstName + user.lastName;
        this.selectTaskManger=user.firstName + user.lastName;
        // console.log(' this.selectMember', this.selectMember)
        // console.log(' this.selectMember', this.selectTaskManger)
        this.assigneeId=user.id;
        this.selectTaskMangerId=user.id;
        this.locationId= user.bussLocs[0]
        if(user.userType === 1){
          this.userType='PROVIDER'
        }
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
    //     this.crmService.taskActivityName = "subTaskEdit";
    //   }
    // });
    
    this.api_loading=false;
    if(this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate' && this.crmService.taskActivityName!='CreatE' && this.crmService.taskActivityName!='CreteTaskMaster'){
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
      this.selectHeader='Update Activity'
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
    else if(this.type ==='Update'){
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
      this.selectHeader='Update Activity'
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
    else if(this.crmService.taskActivityName === "subTaskCreate")
      {this.createTaskForm=this.createTaskFB.group({
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
      else if(this.crmService.taskActivityName==='CreatE'){
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
    else if(this.crmService.taskActivityName =='Create'){
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
        // this.taskDueDays= taskMaster.estDuration.value.days;
        // this.taskDueHrs= taskMaster.estDuration.value.hours;
        // this.taskDueMin= taskMaster.estDuration.value.minutes;
        this.createTaskForm.controls.taskDays.value=  taskMaster.estDuration.value.days,
      this.createTaskForm.controls.taskHrs.value=  taskMaster.estDuration.value.hours,
      this.createTaskForm.controls.taskMin.value=  taskMaster.estDuration.value.minutes,
        this.estTime={ "days" :taskMaster.estDuration.value.days, "hours" :taskMaster.estDuration.value.hours, "minutes" : taskMaster.estDuration.value.minutes };

    }
    else if(this.crmService.taskActivityName==='CreteTaskMaster'){
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
    
    // else{
    //   if(this.crmService.taskActivityName == "subTaskCreate")
    //   {
		// 		      this.createBTimeField=true;
    //   this.updateBTimefield=false;
    //   // this.selectMember='Select Member';
    //   // this.selectTaskManger='Select Task Manger'
    //     this.selectHeader='Add Subtask';
    //     this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
    //     // this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd');
    //     console.log(' this.taskDueDate', this.taskDueDate);
    //     this.selectedDate = this.taskDueDate;
    //     this.taskDueTime= this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm') ;
    //     console.log(' this.taskDueTime', this.taskDueTime)
    //     this.estDurationWithDay=this.taskDueTime;
    //     const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
    //     const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
    //     const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
    //     this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
    //     console.log('this.estTime',this.estTime);
    //     console.log('new Date()',new Date())
    //     const taskMaster= this.crmService.taskMasterToCreateServiceData;
    //     console.log('taskMaster',taskMaster);
    //     this.createTaskForm.controls.taskTitle.value = taskMaster.title;
    //     this.createTaskForm.controls.taskDescription.value= taskMaster.description;
    //     this.createTaskForm.controls.userTaskCategory.value= taskMaster.category.id;
    //     this.createTaskForm.controls.userTaskType.value= taskMaster.type.id;
    //     this.createTaskForm.controls.userTaskPriority.value= taskMaster.priority.id;
    //   }
    //   else
    //   {
		//         this.createBTimeField=true;
    //   this.updateBTimefield=false;
    //   // this.selectMember='Select Member';
    //   // this.selectTaskManger='Select Task Manger'
    //     this.selectHeader='Add Task';
    //     this.taskDueDate=this.datePipe.transform(new Date(),'yyyy-MM-dd') 
    //     // this.datePipe.transform(this.taskDueDate,'yyyy-MM-dd');
    //     console.log(' this.taskDueDate', this.taskDueDate);
    //     this.selectedDate = this.taskDueDate;
    //     this.taskDueTime= this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm') ;
    //     console.log(' this.taskDueTime', this.taskDueTime)
    //     this.estDurationWithDay=this.taskDueTime;
    //     const estDurationDay=this.datePipe.transform(this.estDurationWithDay,'d')
    //     const estDurationHour=this.datePipe.transform(this.estDurationWithDay,'h')
    //     const estDurationMinurte= this.datePipe.transform(this.estDurationWithDay,'mm')
    //     this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinurte };
    //     console.log('this.estTime',this.estTime)
    //     console.log('new Date()',new Date())
    //     const taskMaster= this.crmService.taskMasterToCreateServiceData;
    //     console.log('taskMaster',taskMaster);
    //     this.createTaskForm.controls.taskTitle.value = taskMaster.title;
    //     this.createTaskForm.controls.taskDescription.value= taskMaster.description;
    //     this.createTaskForm.controls.userTaskCategory.value= taskMaster.category.id;
    //     this.createTaskForm.controls.userTaskType.value= taskMaster.type.id;
    //     this.createTaskForm.controls.userTaskPriority.value= taskMaster.priority.id;

    //   }
    // }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    this.getLocation()
    // this.getTaskmaster()
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
      if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster'){
        this.createTaskForm.controls.taskStatus.setValue(this.taskStatusList[0][0].id);
        // this.taskStatusModal=this.taskStatusList[0][0].id;
      }
      else{
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
      }else{
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
  // taskTitle(event){
  //   // console.log(event)
  // }
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
    //spcl char logic
    // var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    // if(format.test(taskTitleValue)){
    //   console.log('format.test(taskTitleValue)',format.test(taskTitleValue))
    //   console.log(taskTitleValue)
    //   this.bErrormsg=true;
    //   this.errorMsgAny='Please remove special character'
    //   return true;
    // } else {
    //   this.bErrormsg=false;
    //   this.errorMsgAny=''
    //   return false;
    // }
    //emoji logic
    // var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    // console.log('taskTitleValue',taskTitleValue)
    // console.log('regex',regex)
    // console.log(' taskTitleValue.replace(regex, "");', taskTitleValue.replace(regex, ""))
    // return taskTitleValue.replace(regex, "");
    
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
    this.selectMember = (res.firstName + res.lastName);
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
    
    // console.log(this.createTaskForm.controls.userTaskCategory.value)
    // this.boolenTaskError=false
    // if(taskCategory != undefined || null){
    //   this.bErrormsgCategory=false
    // }else{
    //   this.bErrormsgCategory=true
    // }

  }
  handleTaskTypeSelection(taskType:any){
    console.log('taskType',taskType)
    if( taskType != undefined){
      this.bErrormsgType=false
      this.errorMsgAnyType='';
    }

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
    // this.bEstDuration=true;
    // this.updateBTimefield=false;
    // this.createBTimeField=true;
    
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
  handleTargetResult(targetResult){
    // console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential){
  // console.log('targetPotential',targetPotential)
  }
  showCreateTaskButtonCaption() {
    if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster' ){
      let caption = '';
      caption = 'Save';
      return caption;
    }
    else{
      let caption = '';
      caption = 'Save';
      return caption;
    }
    
}
  saveCreateTask(){
    // this.api_loading = true;
    if(this.crmService.taskActivityName!='Create' && this.crmService.taskActivityName!='subTaskCreate' && this.crmService.taskActivityName!='CreatE' && this.crmService.taskActivityName !='CreteTaskMaster'){
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
      if(this.updateUserType===('PROVIDER' || 'CONSUMER') && (this.createTaskForm.controls.taskTitle.value!=null)){
        // this.api_loading = true;
        console.log("2")
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
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
     
      console.log(' this.updateUserType', this.updateUserType)

    }
    else{
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
    // console.log('createTaskData',createTaskData)
    // console.log('this.userType',this.userType)
    if(this.taskMasterData){
      if(this.userType===('PROVIDER' || 'CONSUMER') ){
        // console.log('...................kl')
        this.boolenTaskError=false;
        this.api_loading = true;
        // console.log("1")
        this.crmService.addTask(createTaskData).subscribe((response)=>{
          console.log('afterCreateList',response);
          setTimeout(() => {
            this.createTaskForm.reset();
          this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
    }
    else{
      if(this.userType===('PROVIDER' || 'CONSUMER') && (this.createTaskForm.controls.taskTitle.value != null) && (this.createTaskForm.controls.userTaskCategory.value != null)
      && (this.createTaskForm.controls.userTaskType.value != null) ){
        console.log('...................kl')
        this.boolenTaskError=false;
        this.api_loading = true;
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
            this.createTaskForm.reset();
          this.router.navigate(['provider', 'task']);
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
        console.log('title',this.createTaskForm.controls.taskTitle.value )
        // this.bErrormsg=true;
        // this.errorMsgAny='Please enter some activity title';
        // this.bErrormsgCategory=true;
        //   this.errorMsgAnyCategory='Please select category';
        //   this.bErrormsgType=true;
        //   this.errorMsgAnyType='Please select type';
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
   onSubmitCraeteTaskForm(){
  }

}
