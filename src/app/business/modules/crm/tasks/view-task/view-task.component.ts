import { Component, OnInit } from "@angular/core";
import { projectConstantsLocal } from "../../../../../../../src/app/shared/constants/project-constants";
import { projectConstants } from "../../../../../../../src/app/app.component";
import { Messages } from "../../../../../../../src/app/shared/constants/project-messages";
import {  Location } from "@angular/common";
import { ActivatedRoute, Router,NavigationExtras  } from "@angular/router";
// NavigationExtras
import { CrmService } from "../../crm.service";
import { MatDialog } from "@angular/material/dialog";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { CrmSelectMemberComponent } from "../../../../shared/crm-select-member/crm-select-member.component";
import { SharedServices } from "../../../../../shared/services/shared-services";
import { CrmProgressbarComponent } from "../../../../../../../src/app/business/shared/crm-progressbar/crm-progressbar.component";
import { FormBuilder } from '@angular/forms';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-view-task",
  templateUrl: "./view-task.component.html",
  styleUrls: ["./view-task.component.css"]
})
export class ViewTaskComponent implements OnInit {
  tooltipcls = "";
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
  filter = {
    date: null,
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filters: any = {
    date: false
  };
  ackStatus = false;
  notAckStatus = false;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  tday = new Date();
  minday = new Date(2015, 0, 1);
  endminday = new Date(1900, 0, 1);
  dateFilter = false;
  auditSelAck = [];
  auditStartdate = null;
  auditEnddate = null;
  holdauditSelAck = null;
  holdauditStartdate = null;
  holdauditEnddate = null;
  taskList: any = [];
  detailedTaskData: any;
  waitlist_history: any;
  connected_with: any;
  selectedIndex;
  taskUid: any;
  taskDetails: any;

  action: any;
  //notes variable start
  public notesText: any;
  public notesList: any = [];
  uploaded_attachments: any;
  updateTaskData: any;
  taskkid: any;
  taskType: any;
  changeAction = false;
  public taskDetailsData:any;
  //new ui variabe start
  public headerName:string='';
  public taskDetailsDescription:string='View Task Details';
  public taskError:null;
  public taskDetailsForm:any;
  public selectMember:any;
  public allMemberList:any=[];
  public updateAssignMemberDetailsToDialog:any;
  public userType:any;
  public updateMemberId:any;
  public locationId:any;
  public assigneeId:any;
  public updteLocationId:any;
  public availableDates: any = [];
  public minDate:any=new Date();
  public maxDate:any;
  public ddate:any;
  public bTaskTitle:boolean=true
  public bTaskDescription:boolean=true;
  public bTaskAreaName:boolean=true;
  public bTaskDate:boolean=true;
  public bAssigneeName:boolean=true;
  public categoryListData:any=[];
  public taskTypeList:any=[];
  public taskStatusList:any=[];
  public taskPriorityList:any=[];
  public updateSelectTaskMangerDetailsToDialog:any;
  public selectTaskManger:any;
  public selectTaskMangerId:any;
  public updateManagerId:any;
  public estDurationWithDay:any;
  public estTime:any;
  public taskDueDays:any;
  public rupee_symbol = '₹';
  public bTaskCategory:boolean=true;
  public bTaskType:boolean=true;
  public bTaskLocation:boolean=true;
  public bTaskManager:boolean=true;
  public bTaskEstDuration:boolean=true;
  public bTaskPriority:boolean=true;
  public bTaskStatus:boolean=true;
  public bTaskTargetPotential:boolean=true;
  public bTaskBusinessPotential:boolean=true;
  public updateUserType:any;
  public taskMasterList:any=[];
  public notesTextarea:any;
  public errorMsg:boolean=false;
  public assignMemberErrorMsg:string='';
  public bTaskFollowUpResult:boolean=true;
  public editable:boolean=true;
  public followUpStatusComplToProceed:any;
  public followUpStatusInProgressToPending:any;
  public fiollowUpStatusCancelledToRejected:any;
  public activityType:any;
  public followUPStatus:any
  public bActualResult:boolean=true;
  public actualResult:any;


 
  constructor(
    private locationobj: Location,
    private crmService: CrmService,
    public _location: Location,
    public dialog: MatDialog,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    public shared_services: SharedServices,
    private snackbarService: SnackbarService,
    private createTaskFormBuilder: FormBuilder,
    private groupService:GroupStorageService,
    private datePipe:DatePipe,

  ) {}

  ngOnInit(): void {
   this.api_loading = false;
   this.taskDetailsForm= this.createTaskFormBuilder.group({
    taskTitle:[],
    taskDescription:[],
    areaName:[],
    taskDate:[],
    userTaskCategory:[],
    userTaskType:[],
    taskLocation:[],
    selectTaskManger:[],
    taskDays:[],
    taskHrs:[],
    taskMin:[],
    userTaskPriority:[],
    taskStatus:[],
    targetResult:[],
    targetPotential:[],



   })
   const user = this.groupService.getitemFromGroupStorage('ynw-user');
   console.log("User is :", user);
   this.selectMember= user.firstName + user.lastName;
   this.selectTaskManger=user.firstName + user.lastName;
   // console.log(' this.selectMember', this.selectMember)
   // console.log(' this.selectMember', this.selectTaskManger)
   this.assigneeId=user.id;
   this.updateMemberId=this.assigneeId;
  //  this.selectTaskMangerId=user.id;
   this.locationId= user.bussLocs[0]
   if(user.userType === 1){
     this.userType='PROVIDER'
   }
  //  console.log('this.crmService.followUpTableToOverView',this.crmService.followUpTableToOverView)
  this._Activatedroute.queryParams.subscribe((qparams:any)=>{
    // console.log('qparams',qparams)
    if(qparams.dataType){
      this.activityType=qparams.dataType;
    }
  })
  
  console.log('this.activityType',this.activityType)
    this._Activatedroute.paramMap.subscribe(params => {
      // console.log('params',params)
      this.taskUid = params.get("id");
      console.log("task id : ", this.taskUid);
      console.log('this.action',this.action)
      this.crmService.getTaskDetails(this.taskUid).subscribe(data => {
        console.log(' this.taskType ', this.taskType )
        this.taskDetails = data;
        this.getTaskmaster()
        this.taskkid = this.taskDetails.id;
        this.api_loading = false;
        console.log("Task Details : ", this.taskDetails);
        this.updateUserType=this.taskDetails.userTypeEnum;
        if(this.activityType !=='UpdateFollowUP'){
          if(this.taskDetails.title != undefined){
            this.bTaskTitle=true;
            this.taskDetailsForm.controls.taskTitle.value= this.taskDetails.title;
          }
          else{
            this.bTaskTitle=false
          }
          if(this.taskDetails.description != undefined){
            this.bTaskDescription=true;
            this.taskDetailsForm.controls.taskDescription.value= this.taskDetails.description;
          }
          else{
            this.bTaskDescription=false
          }
          if(this.taskDetails.assignee.name != undefined){
            this.bAssigneeName=true;
            this.selectMember = this.taskDetails.assignee.name;
            this.updateMemberId=this.taskDetails.assignee.id;
          }
          else{
            this.bAssigneeName=false
          }
          if(this.taskDetails.locationArea != undefined){
            this.bTaskAreaName=true;
            this.taskDetailsForm.controls.areaName.value= this.taskDetails.locationArea;
          }
          else{
            this.bTaskAreaName=false
          }
          if(this.taskDetails.dueDate != undefined){
            this.bTaskDate=true
            this.taskDetailsForm.controls.taskDate.value= this.taskDetails.dueDate
          }
          else{
            this.bTaskDate=false
          }
          if(this.taskDetails.category.name != undefined){
            this.bTaskCategory=true;
            this.taskDetailsForm.controls.userTaskCategory.value=this.taskDetails.category.id;
          }
          else{
            this.bTaskCategory=false;
          }
          if(this.taskDetails.type.name != undefined){
            this.bTaskType=true
            this.taskDetailsForm.controls.userTaskType.value=this.taskDetails.type.id;
          }
          else{
            this.bTaskType=false;
          }
          if(this.taskDetails.location.name != undefined){
            this.bTaskLocation=true;
            // this.taskDetailsForm.controls.taskLocation.value = this.taskDetails.location.id
            this.taskDetailsForm.controls.taskLocation.setValue(this.taskDetails.location.name);
              this.updteLocationId=this.taskDetails.location.id;
          }
          else{
            this.bTaskLocation=false;
          }
          if(this.taskDetails.manager.name != undefined){
            this.bTaskManager=true;
            this.selectTaskManger= this.taskDetails.manager.name;
            this.updateManagerId= this.taskDetails.manager.id
          }
          else{
            this.bTaskManager=false
          }
          if(this.taskDetails.estDuration.days != undefined ||this.taskDetails.estDuration.hours != undefined || this.taskDetails.estDuration.minutes != undefined ){
           this.bTaskEstDuration=true;
           this.estTime={ "days" :this.taskDetails.estDuration.days, "hours" :this.taskDetails.estDuration.hours, "minutes" : this.taskDetails.estDuration.minutes };
           this.taskDetailsForm.controls.taskDays.value= this.taskDetails.estDuration.days;
          this.taskDetailsForm.controls.taskHrs.value= this.taskDetails.estDuration.hours;
          this.taskDetailsForm.controls.taskMin.value= this.taskDetails.estDuration.minutes;
          }
          else{
            this.bTaskEstDuration=false
          }
          if(this.taskDetails.priority.name != undefined){
            this.bTaskPriority=true;
            this.taskDetailsForm.controls.userTaskPriority.value=this.taskDetails.priority.id
          }
          else{
            this.bTaskPriority=false
          }
          if(this.taskDetails.status.name != undefined){
            this.bTaskStatus=true;
            this.taskDetailsForm.controls.taskStatus.value=this.taskDetails.status.id;
            this.editable=false;
          }
          else{
            // this.editable=false;
            this.bTaskStatus=false
          }
          if(this.taskDetails.targetPotential){
            this.bTaskTargetPotential= true;
            this.taskDetailsForm.patchValue({
              targetPotential:this.taskDetails.targetPotential
            })
          }
          else{
            this.bTaskTargetPotential=false
          }
          if(this.taskDetails.targetResult){
            this.bTaskBusinessPotential= true;
            this.taskDetailsForm.patchValue({
              targetResult:this.taskDetails.targetResult
            })
          }
          else{
            this.bTaskBusinessPotential=false
          }
          if(this.taskDetails.actualResult){
            this.bActualResult= true;
            this.actualResult= this.taskDetails.actualResult
          }
          else{
            this.bActualResult= true;
          }
        this.headerName=this.taskDetails.title
        if (this.taskDetails.originUid) {
          this.taskType = "SubTask";
          console.log('taskType',this.taskType)
          this.headerName='SubActivity Overview';
          this.taskDetailsData = this.taskDetails
          this.crmService.taskToCraeteViaServiceData = this.taskDetailsData 
          console.log('this.crmService.taskToCraeteViaServiceData;',this.crmService.taskToCraeteViaServiceData)
        }
        console.log('taskType',this.taskType)
        console.log("taskDetails.status", this.taskDetails.status.name);
        console.log('this.taskDetails.notes',this.taskDetails.notes)
        this.taskDetails.notes.forEach((notesdata: any) => {
          this.notesList.push(notesdata);
        });
        console.log("this.notesList", this.notesList);
        this.crmService.taskToCraeteViaServiceData = this.taskDetails
    console.log('this.crmService.taskToCraeteViaServiceData;',this.crmService.taskToCraeteViaServiceData)
      }
      if(this.activityType==='UpdateFollowUP'){
        this.getUpdateFollowUPValue()
      }
        
        
      });
    });
    this.getAssignMemberList();
    this.getLocation()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskPriorityListData()
    this.getTaskStatusListData()
    // this.getTaskmaster()
    // this.getNotesDetails()
    
    
  }

  //mew ui method start
  getUpdateFollowUPValue(){
    console.log('UpdateValueFollowup')
    this.taskDetailsForm.controls.taskTitle.value=this.taskDetails.title
    this.headerName=this.taskDetails.title;
    this.estTime={ "days" :this.taskDetails.estDuration.days, "hours" :this.taskDetails.estDuration.hours, "minutes" : this.taskDetails.estDuration.minutes };
    this.updateMemberId=this.taskDetails.assignee.id;
    this.updateUserType=this.taskDetails.userTypeEnum;
    this.taskDetailsForm.controls.taskDescription.value= this.taskDetails.description;
    this.taskDetailsForm.controls.areaName.value=(this.taskDetails.locationArea);
    this.taskDetailsForm.controls.taskDate.value= this.taskDetails.dueDate;
    this.bTaskFollowUpResult=true;
    this.getTaskmaster()

  }
  actualResultTask(actualRes:any){
    console.log('actualRes',actualRes)
  }

  getTaskmaster(){
    this.crmService.getTaskMasterList().subscribe((response:any)=>{
      console.log('TaskMasterListresponse :',response);
      this.taskMasterList.push(response) 
      this.taskMasterList[0].forEach((item:any)=>{
        // console.log('item',item)
        // console.log(item.title.value)
        if((this.taskDetails.title === item.title.value) && (this.taskDetails.title !=='Follow Up 1') && (this.taskDetails.title !=='Follow Up 2') ){
          console.log('Matched',item.title.isvisible);
          this.bTaskFollowUpResult=false;
          console.log('this.taskDetails.title',this.taskDetails.title)
          //est duration start
          if( item.estDuration.isvisible===false){
            this.bTaskEstDuration=false
          }
          else{
            if(this.taskDetails.estDuration.days != undefined ||this.taskDetails.estDuration.hours != undefined || this.taskDetails.estDuration.minutes != undefined ){
                this.bTaskEstDuration=true;
                this.estTime={ "days" :this.taskDetails.estDuration.days, "hours" :this.taskDetails.estDuration.hours, "minutes" : this.taskDetails.estDuration.minutes };
                this.taskDetailsForm.controls.taskDays.value= this.taskDetails.estDuration.days;
               this.taskDetailsForm.controls.taskHrs.value= this.taskDetails.estDuration.hours;
               this.taskDetailsForm.controls.taskMin.value= this.taskDetails.estDuration.minutes;
               }
          }
          //est duration end
          if(item.title.isvisible===true){
            if(this.taskDetails.title != undefined){
              this.bTaskTitle=true;
              this.taskDetailsForm.controls.taskTitle.value= this.taskDetails.title;
            }
            else{
              this.bTaskTitle=false
            }
          }
          else{
            this.bTaskTitle=false
          }
          if(item.description.isvisible === true){
            if(this.taskDetails.description != undefined){
              this.bTaskDescription=true;
              this.taskDetailsForm.controls.taskDescription.value= this.taskDetails.description;
            }
            else{
              this.bTaskDescription=false
            }
          }
          else{
            this.bTaskDescription=false
          }
          if(item.assignee.isvisible === true){
            if(this.taskDetails.assignee.name != undefined){
              this.bAssigneeName=true;
              this.selectMember = this.taskDetails.assignee.name;
              this.updateMemberId=this.taskDetails.assignee.id;
            }
            else{
              this.bAssigneeName=false
            }
          }
          else{
            this.bAssigneeName=false
          }
          if(item.dueDate.isvisible === true){
            if(this.taskDetails.dueDate != undefined){
              this.bTaskDate=true;
              this.taskDetailsForm.controls.taskDate.value= this.taskDetails.dueDate;
            }
            else{
              this.bTaskDate=false;
            }
          }
          else{
            this.bTaskDate=false;
          }
          if(item.category.isvisible === true){
            if(this.taskDetails.category.name != undefined){
              this.bTaskCategory=true;
              this.taskDetailsForm.controls.userTaskCategory.value=this.taskDetails.category.id;
            }
            else{
              this.bTaskCategory=false;
            }
          }
          else{
            this.bTaskCategory=false;
          }
          if(item.type.isvisible === true){
            if(this.taskDetails.type.name != undefined){
              this.bTaskType=true
              this.taskDetailsForm.controls.userTaskType.value=this.taskDetails.type.id;
            }
            else{
              this.bTaskType=false;
            }
          }
          else{
            this.bTaskType=false;
          }
          if(item.location.isvisible === true){
            if(this.taskDetails.location.name != undefined){
              this.bTaskLocation=true;
              // this.taskDetailsForm.controls.taskLocation.value = this.taskDetails.location.id;
              this.taskDetailsForm.controls.taskLocation.setValue(this.taskDetails.location.name);
              this.updteLocationId=this.taskDetails.location.id;
            }
            else{
              this.bTaskLocation=false;
            }
          }
          else{
            this.bTaskLocation=false;
          }
          if(item.locationArea.isvisible === true){
            if(this.taskDetails.locationArea != undefined){
              this.bTaskAreaName=true;
              this.taskDetailsForm.controls.areaName.value=(this.taskDetails.locationArea);
            }
            else{
              this.bTaskAreaName=false;
            }
          }
          else{
            this.bTaskAreaName=false;
          }
          if(item.manager.isvisible === true){
            if(this.taskDetails.manager.name != undefined){
              this.bTaskManager=true;
              this.selectTaskManger= this.taskDetails.manager.name;
              this.updateManagerId= this.taskDetails.manager.id
            }
            else{
              this.bTaskManager=false
            }
          }else{
            this.bTaskManager=false
          }
          if(item.priority.isvisible === true){
            if(this.taskDetails.priority.name != undefined){
              this.bTaskPriority=true;
              this.taskDetailsForm.controls.userTaskPriority.value=this.taskDetails.priority.id
            }
            else{
              this.bTaskPriority=false
            }
          }else{
            this.bTaskPriority=false
          }
          if(item.status.isvisible === true){
            if(this.taskDetails.status.name != undefined){
              this.bTaskStatus=true;
              this.taskDetailsForm.controls.taskStatus.value=this.taskDetails.status.id;
              this.editable=false;
            }
            else{
              // this.editable=false;
              this.bTaskStatus=false
            }
          }
          else{
            this.bTaskStatus=false
          }
          if(item.targetResult.isvisible === true){
            if(this.taskDetails.targetResult){
              this.bTaskBusinessPotential= true;
              this.taskDetailsForm.patchValue({
                targetResult:this.taskDetails.targetResult
              })
            }
            else{
              this.bTaskBusinessPotential=false
            }
          }
          else{
            this.bTaskBusinessPotential=false
          }
          if(item.targetPotential.isvisible === true){
            if(this.taskDetails.targetPotential){
              this.bTaskTargetPotential= true;
              this.taskDetailsForm.patchValue({
                targetPotential:this.taskDetails.targetPotential
              })
            }
            else{
              this.bTaskTargetPotential=false;
            }
          }
          else{
            this.bTaskTargetPotential=false;
          }
         


        }
        else if( (this.taskDetails.title ==='Follow Up 1') || (this.taskDetails.title ==='Follow Up 2') ){
          console.log('this.taskDetails.title',this.taskDetails.title)
          this.bTaskStatus=false;
          this.bTaskCategory=false;
          this.bTaskType=false;
          this.bTaskLocation=false;
          this.bTaskManager=false;
          this.bTaskEstDuration=false;
          this.bTaskPriority=false;
          this.bTaskStatus=false;
          this.bTaskTargetPotential=false;
          this.bTaskBusinessPotential=false;
          this.bTaskTitle=true;
          this.bTaskDescription=true;
          this.bAssigneeName=true;
          this.bTaskDate=true;
          this.bTaskAreaName=true;
          this.bTaskFollowUpResult=true;
          
        }
      })
    })
    // console.log('this.taskMasterList',this.taskMasterList[0])
  }
  getNotesDetails(){
    this.taskDetails.notes.forEach((notesdata: any) => {
      this.notesList.push(notesdata);
    });
  }
  resetErrors(){
    this.taskError = null;
  }
  oneField(value){
    console.log('value',(this.taskDetailsForm.controls.taskTitle.value ));
    if((this.taskDetailsForm.controls.taskTitle.value !== this.taskDetails.title) || (this.taskDetailsForm.controls.taskDescription.value !== this.taskDetails.description)
    || (this.taskDetailsForm.controls.areaName.value !== this.taskDetails.locationArea) || (this.selectMember !== this.taskDetails.assignee.id) 
      || (this.taskDetailsForm.controls.taskDate.value !== this.taskDetails.dueDate) || (this.taskDetailsForm.controls.userTaskCategory.value !== this.taskDetails.category.id) ||
      (this.taskDetailsForm.controls.userTaskType.value != this.taskDetails.type.id)){
        this.taskDetailsDescription ='Enter Task Details'

    }
    else{
      this.taskDetailsDescription ='View Task Details'
    }
  }
  handleTaskTitle(taskTitleValue,event){
    console.log('taskTitleValue',taskTitleValue)
    console.log('event',event);
    // if(taskTitleValue===this.taskDetails.title){
    //   this.taskDetailsDescription= 'View Task Details'
    // }
    // else{
    //   this.taskDetailsDescription= 'Enter Task Details'
    // }
    
  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  handTaskDescription(taskDescription){
    console.log('taskDescription',taskDescription)
  }
  handeAreaName(taskAreaName){
    console.log('taskAreaName',taskAreaName)
  }
  getLocation(){
    this.crmService.getProviderLocations().subscribe((res)=>{
      console.log('location.........',res)
      this.taskDetailsForm.controls.taskLocation.setValue(res[0].place);
      this.updteLocationId= res[0].id;
    })
  }
  getAssignMemberList(){
    this.crmService.getMemberList().subscribe((memberList:any)=>{
      // console.log('memberList',memberList)
      this.allMemberList.push(memberList)
    },(error:any)=>{
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
      // this.selectMember =  this.updateValue.assignee.name;
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
      // this.taskDetailsForm.controls.taskLocation.setValue(res.place);
    }
    this.assigneeId= res.id;
    console.log('this.assigneeid',res.id)
    this.updateMemberId=this.assigneeId;
    this.updteLocationId= this.locationId;
    }
  })
  }
  handleDateChange(e){
    console.log(e)
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
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
  handleTaskCategorySelection(taskCategory){
    console.log('taskCategory',taskCategory)
  }
  handleTaskTypeSelection(taskType:any){
    console.log('taskType',taskType)

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
  handleTaskLocation(taskLocation){
    console.log(taskLocation)
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
      this.selectTaskManger = this.taskDetails.manager.name;//'Select task manager'

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
  handleTaskEstDuration(estDuration:any){
    console.log("entered")
    this.estDurationWithDay=this.taskDueDays;
    const estDurationDay=this.taskDetailsForm.controls.taskDays.value
    const estDurationHour=this.taskDetailsForm.controls.taskHrs.value
    const estDurationMinute= this.taskDetailsForm.controls.taskMin.value
    this.estTime={ "days" :estDurationDay, "hours" :estDurationHour, "minutes" : estDurationMinute };
    console.log('estDurationDay',this.estTime)

  }
  handleTaskPrioritySelection(taskPriority,taskPriorityText:any){
  }
  getTaskPriorityListData(){
    this.crmService.getTaskPriority().subscribe((taskPriority:any)=>{
      console.log('taskPriority',taskPriority);
      this.taskPriorityList.push(taskPriority);
      // if(this.crmService.taskActivityName==='Create' || this.crmService.taskActivityName==='subTaskCreate' || this.crmService.taskActivityName==='CreatE' || this.crmService.taskActivityName==='CreteTaskMaster'){
      //   this.taskDetailsForm.controls.userTaskPriority.setValue(this.taskPriorityList[0][0].id);
      // }
      // else if(this.type ==='SubUpdate'){
      //   this.taskDetailsForm.controls.userTaskPriority.setValue(parseInt(this.taskDetails.priorityId))
      // }
      // else 
      {
        // this.taskDetailsForm.controls.userTaskPriority.setValue(this.taskDetails.priority.id);
        // this.taskPriority=this.updateValue.priority.id;
      }
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  handleTaskStatus(taskStatus){
    // console.log(taskStatus)
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
  getTaskStatusListData(){
    this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
      console.log('taskStatus',taskStatus);
      this.taskStatusList.push(taskStatus)
      
      // if((this.taskDetails.title ==='Follow Up 1') || (this.taskDetails.title ==='Follow Up 2')){
      //   this.taskStatusList.push(
      //     {id: 5, name: 'Proceed',image:'./assets/images/crmImages/total.png'},{id: 3, name: 'Pending',image:'./assets/images/crmImages/total.png'},{id: 4, name: 'Rejected',image:'./assets/images/crmImages/total.png'}
      //   );
      // }
      // else{
      //   this.taskStatusList.push(
      //     {id: 1, name: 'New'},{id: 2, name: 'Assigned'},{id: 3, name: 'In Progress'},
      //     {id: 4, name: 'Cancelled'},{id: 5, name: 'Completed'},{id: 12, name: 'Suspended'}
      //   );
      // }
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  handleTargetResult(targetResult){
    // console.log('targetResult',targetResult)
  }
  handleTargetPotential(targetPotential){
  // console.log('targetPotential',targetPotential)
  }
  saveCreateTask(){
    console.log('this.updteLocationId',this.updteLocationId)
    if(this.activityType !=='UpdateFollowUP'){
      const updateTaskData:any = {
        "title":this.taskDetailsForm.controls.taskTitle.value,
        "description":this.taskDetailsForm.controls.taskDescription.value,
        "userType":this.updateUserType,
        "category":{"id":this.taskDetailsForm.controls.userTaskCategory.value},
        "type":{"id":this.taskDetailsForm.controls.userTaskType.value},
        "status":{"id":this.taskDetailsForm.controls.taskStatus.value},
        "priority":{"id":this.taskDetailsForm.controls.userTaskPriority.value},
        "dueDate" : this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value,'yyyy-MM-dd'),
        "location" : { "id" : this.updteLocationId},
        "locationArea" : this.taskDetailsForm.controls.areaName.value,
        "assignee":{"id":this.updateMemberId },
        "manager":{"id":this.updateManagerId},
        "targetResult" : this.taskDetailsForm.controls.targetResult.value,
        "targetPotential" : this.taskDetailsForm.controls.targetPotential.value,
        "estDuration" : this.estTime,
        "actualResult" :this.actualResult
      }
      console.log('updateTaskData',updateTaskData)
      if(this.updateUserType===('PROVIDER' || 'CONSUMER')){
        console.log('updateTaskData',updateTaskData)
        this.crmService.updateTask(this.taskDetails.taskUid, updateTaskData).subscribe((response)=>{
          console.log('afterUpdateList',response);
          setTimeout(() => {
            this.snackbarService.openSnackBar('Successfull updated activity');
            this.taskDetailsForm.reset();
          this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          setTimeout(() => {
            this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
          }, projectConstants.TIMEOUT_DELAY);
        })
      }
    }
   
   
    console.log(' this.updateUserType', this.updateUserType)
    if(this.activityType==='UpdateFollowUP'){
      const updateFollowUpData={
        "title":this.taskDetailsForm.controls.taskTitle.value,
        "description":this.taskDetailsForm.controls.taskDescription.value,
        "userType":this.updateUserType,
      "category":{"id":this.taskDetails.category.id},
      "type":{"id":this.taskDetails.type.id},
      "status":{"id":this.followUPStatus},
      "priority":{"id":this.taskDetails.priority.id},
      "dueDate" : this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value,'yyyy-MM-dd'),
      "location" : { "id" : this.taskDetails.location.id},
      "locationArea" : this.taskDetailsForm.controls.areaName.value,
      "assignee":{"id":this.updateMemberId },
      // "manager":{"id":this.updateManagerId},
      // "targetResult" : this.taskDetailsForm.controls.targetResult.value,
      // "targetPotential" : this.taskDetailsForm.controls.targetPotential.value,
      "estDuration" : this.estTime,
      "actualResult" :this.actualResult

      }
      console.log('updateFollowUpData',updateFollowUpData)
      if(this.updateUserType===('PROVIDER' || 'CONSUMER')){
        // this.api_loading = true;
        // console.log("2")
        console.log('updateFollowUpData',updateFollowUpData)
        this.crmService.updateTask(this.taskDetails.taskUid, updateFollowUpData).subscribe((response)=>{
          console.log('afterupdateFollowUpData',response);
          setTimeout(() => {
            this.snackbarService.openSnackBar('Successfull updated activity');
            this.taskDetailsForm.reset();
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
  }
  handleNotesDescription(textValue:any){
    console.log('taskDescription',textValue)
    if(textValue != ''){
      this.errorMsg=false;
      this.assignMemberErrorMsg='';
    }
    else{
      this.errorMsg=true;
          this.assignMemberErrorMsg='Please enter some remarks'
    }
    
  }
  saveCreateNote(notesValue:any){
    if(this.notesTextarea !==undefined){
      console.log('this.notesTextarea',this.notesTextarea);
      this.errorMsg=false;
      this.assignMemberErrorMsg='';
      const createNoteData:any = {
        "note" :this.notesTextarea
      }
        console.log('createNoteData',createNoteData)
      // if(this.data.source == "Lead")
      // {
      //   this.crmService.addLeadNotes(this.taskDetails.taskUid,createNoteData).subscribe((response:any)=>{
      //     console.log('response',response)
      //     setTimeout(() => {
      //       // this.dialogRef.close(notesValue)
      //     }, projectConstants.TIMEOUT_DELAY);
      //   },
      //   (error)=>{
      //     this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      //   })
      // }
      // else{
        this.crmService.addNotes(this.taskDetails.taskUid,createNoteData).subscribe((response:any)=>{
          console.log('response',response)
          this.api_loading = true;
          setTimeout(() => {
            // this.dialogRef.close(notesValue)
            this.ngOnInit()
            // this.getNotesDetails()
            this.api_loading = false;
          }, projectConstants.TIMEOUT_DELAY);
          this.snackbarService.openSnackBar('Remarks added successfully');
        },
        (error)=>{
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
        })
      // }
      
    }
    else{
      this.errorMsg=true;
          this.assignMemberErrorMsg='Please enter some description'
    }
  }
  selectStatus(status:any){
    console.log('status',status)
    if(status.name==='Pending'){
      this.followUpStatusInProgressToPending= status.id;
      this.followUPStatus=status.id
      console.log('this.followUPStatus',this.followUPStatus)
      document.getElementById('A').style.boxShadow = "none";
      document.getElementById('B').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      document.getElementById('C').style.boxShadow = "none";
      const updateFollowUpData={
        "title":this.taskDetailsForm.controls.taskTitle.value,
        "description":this.taskDetailsForm.controls.taskDescription.value,
        "userType":this.updateUserType,
      "category":{"id":this.taskDetails.category.id},
      "type":{"id":this.taskDetails.type.id},
      "status":{"id":this.followUPStatus},
      "priority":{"id":this.taskDetails.priority.id},
      "dueDate" : this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value,'yyyy-MM-dd'),
      "location" : { "id" : this.taskDetails.location.id},
      "locationArea" : this.taskDetailsForm.controls.areaName.value,
      "assignee":{"id":this.updateMemberId },
      // "manager":{"id":this.updateManagerId},
      // "targetResult" : this.taskDetailsForm.controls.targetResult.value,
      // "targetPotential" : this.taskDetailsForm.controls.targetPotential.value,
      "estDuration" : this.estTime

      }
      this.crmService.statusToPending(this.taskDetails.taskUid, updateFollowUpData).subscribe((response)=>{
        console.log('afterupdateFollowUpData',response);
        setTimeout(() => {
          this.taskDetailsForm.reset();
        this.router.navigate(['provider', 'crm']);
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        setTimeout(() => {
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
        }, projectConstants.TIMEOUT_DELAY);
      })
    }
    else if(status.name==='Rejected'){
      this.fiollowUpStatusCancelledToRejected= status.id
      this.followUPStatus=status.id
      console.log('this.followUPStatus',this.followUPStatus)
      document.getElementById('A').style.boxShadow = "none";
      document.getElementById('B').style.boxShadow = "none";
      document.getElementById('C').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      const updateFollowUpData={
        "title":this.taskDetailsForm.controls.taskTitle.value,
        "description":this.taskDetailsForm.controls.taskDescription.value,
        "userType":this.updateUserType,
      "category":{"id":this.taskDetails.category.id},
      "type":{"id":this.taskDetails.type.id},
      "status":{"id":this.followUPStatus},
      "priority":{"id":this.taskDetails.priority.id},
      "dueDate" : this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value,'yyyy-MM-dd'),
      "location" : { "id" : this.taskDetails.location.id},
      "locationArea" : this.taskDetailsForm.controls.areaName.value,
      "assignee":{"id":this.updateMemberId },
      // "manager":{"id":this.updateManagerId},
      // "targetResult" : this.taskDetailsForm.controls.targetResult.value,
      // "targetPotential" : this.taskDetailsForm.controls.targetPotential.value,
      "estDuration" : this.estTime

      }
      this.crmService.statusToRejected(this.taskDetails.taskUid, updateFollowUpData).subscribe((response)=>{
        console.log('afterupdateFollowUpData',response);
        setTimeout(() => {
          this.taskDetailsForm.reset();
        this.router.navigate(['provider', 'crm']);
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        setTimeout(() => {
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'});
        }, projectConstants.TIMEOUT_DELAY);
      })
    }
    else if(status.name==='Proceed'){
      this.followUpStatusComplToProceed= status.id
      this.followUPStatus=status.id
      console.log('this.followUPStatus',this.followUPStatus)
      document.getElementById('A').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      document.getElementById('B').style.boxShadow = "none";
      document.getElementById('C').style.boxShadow = "none";
      const updateFollowUpData={
        "title":this.taskDetailsForm.controls.taskTitle.value,
        "description":this.taskDetailsForm.controls.taskDescription.value,
        "userType":this.updateUserType,
      "category":{"id":this.taskDetails.category.id},
      "type":{"id":this.taskDetails.type.id},
      "status":{"id":this.followUPStatus},
      "priority":{"id":this.taskDetails.priority.id},
      "dueDate" : this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value,'yyyy-MM-dd'),
      "location" : { "id" : this.taskDetails.location.id},
      "locationArea" : this.taskDetailsForm.controls.areaName.value,
      "assignee":{"id":this.updateMemberId },
      // "manager":{"id":this.updateManagerId},
      // "targetResult" : this.taskDetailsForm.controls.targetResult.value,
      // "targetPotential" : this.taskDetailsForm.controls.targetPotential.value,
      "estDuration" : this.estTime

      }
      console.log('updateFollowUpData',updateFollowUpData)
      console.log('this.taskDetails.taskUid',this.taskDetails.taskUid)
      this.crmService.statusToProceed(this.taskDetails.taskUid).subscribe((response)=>{
        console.log('afterupdateFollowUpData',response);
        setTimeout(() => {
          // this.taskDetailsForm.reset();
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
  //new ui method end

  uploadFiles() {
    const dialogRef = this.dialog.open(SelectAttachmentComponent, {
      panelClass: ["popup-class", "confirmationmainclass"],
      disableClose: true,
      data: {
        source: "Task",
        taskuid: this.taskUid,
        type:this.taskType
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      // this.api_loading = true;
      // setTimeout(() => {
      //   this.ngOnInit();
      //   this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
      // }, 5000);
      if(res === 'close'){
        this.api_loading = false;
      }
      else{
        this.api_loading = true;
        setTimeout(() => {
          this.ngOnInit();
          this.api_loading = false;
          this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
        }, 5000);
      }
    });

    this.getTaskDetails();
  }
  getTaskDetails() {
    this.crmService.getTaskDetails(this.taskUid).subscribe(data => {
      this.taskDetails = data;
      // console.log('attdata',data)
      this.taskkid = this.taskDetails.id;
      this.taskDetails.notes.forEach((notesdata: any) => {
        this.notesList.push(notesdata);
      });
    });
  }
  openEditTask(taskdata: any, editText: any,subUpdateData:any) {
    if(taskdata.originUid === undefined){
      console.log('taskdata',taskdata)
      console.log('editText',editText)
      console.log('taskDetailsData',this.taskDetailsData)
      console.log('taskdata.originUid',taskdata.originUid)
      this.crmService.taskToCraeteViaServiceData = taskdata
  
      const newTaskData = this.crmService.taskToCraeteViaServiceData;
      this.crmService.taskActivityName = editText;
      newTaskData;
      console.log('newTaskData',newTaskData)
      console.log('this.taskType',this.taskType)
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'Update'
        }
      };
      console.log('navigationExtras',navigationExtras)
      this.router.navigate(['provider', 'task', 'create-task'], navigationExtras);
    }
    else {
      console.log('taskDetailsData',this.taskDetailsData)
      console.log('subUpdateData',subUpdateData)
      console.log('this.taskType',this.taskType)
      this.crmService.taskToCraeteViaServiceData = subUpdateData
      const newTaskData = this.crmService.taskToCraeteViaServiceData;
      this.crmService.taskActivityName = editText;
      newTaskData;
      console.log('newTaskData',newTaskData)
      console.log('this.taskType',this.taskType)
      // console.log('typeOf',typeof(newTaskData.targetResult))
      
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'SubUpdate',
          accountId:newTaskData.accountId,
          days:newTaskData.actualDuration.days,
          hours:newTaskData.actualDuration.hours,
          minutes:newTaskData.actualDuration.minutes,
          appointments:newTaskData.appointments,
          assigneeId:newTaskData.assignee.id,
          assigneeName:newTaskData.assignee.name,
          attachments:newTaskData.attachments,
          category:newTaskData.category.id,
          categoryName:newTaskData.category.name,
          createdBy:newTaskData.createdBy,
          customerNotes:newTaskData.customerNotes,
          dueDate:newTaskData.dueDate,
          description:newTaskData.description,
          // estDuration:{
          //   days:newTaskData.estDuration.days,hours:newTaskData.estDuration.hours,minutes:newTaskData.estDuration.minutes
          // },
          estdays:(newTaskData.estDuration.days),
          esthours:newTaskData.estDuration.hours,
          estminutes:newTaskData.estDuration.minutes,
          id:newTaskData.id,
          isSubTask: newTaskData.isSubTask,
          lastStatusUpdatedBy:newTaskData.lastStatusUpdatedBy,
          locationId:newTaskData.location.id,
          locationName:newTaskData.location.name,
          managerId:newTaskData.manager.id,
          managerName:newTaskData.manager.name,
          notes:newTaskData.notes,
          originFrom:newTaskData.originFrom,
          originId:newTaskData.originId,
          originUid:newTaskData.originUid,
          priorityId:newTaskData.priority.id,
          priorityName:newTaskData.priority.name,
          progress: newTaskData.progress,
          progressNotes:newTaskData.progressNotes,
          statusId:newTaskData.status.id,
          statusName:newTaskData.status.name,
          taskUid:newTaskData.taskUid,
          teamMembers:newTaskData.teamMembers,
          teams:newTaskData.teams,
          title:newTaskData.title,
          typeId:newTaskData.type.id,
          typeName:newTaskData.type.name,
          userTypeEnum:newTaskData.userTypeEnum,
          targetResult:newTaskData.targetResult,
          targetPotential:newTaskData.targetPotential,
          locationArea:newTaskData.locationArea,
        }
      };
      console.log('navigationExtras',navigationExtras)
      this.router.navigate(['provider', 'task', 'create-task'], navigationExtras);
    }
    




    // setTimeout(() => {
    //   this.crmService.taskActivityName = editText;
    //   newTaskData;
    //   this.router.navigate(['provider', 'task', 'create-task']);
    // }, projectConstants.TIMEOUT_DELAY);

  }
  markAsDone(taskid) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "taskComplete",
        taskName: this.taskDetails,
        type:this.taskType
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      this.getTaskDetails();
      this.changeAction = true;
    });
  }
  chnageStatus() {
    console.log("openDialogStatusChange", this.taskDetails);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "statusChange",
        taskDetails: this.taskDetails
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log("resssssssss", res);
    });
  }

  createSubTask(taskid) {
    this.router.navigate(["provider", "task", "create-subtask", taskid]);
  }

  goback() {
    this.locationobj.back();
  }

  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, "T");
    return timeDate;
  }

  do_search(pagecall, status?) {
    this.endminday = this.auditStartdate;
    this.auditStatus = 1;
    if (status === "ackStatus") {
      if (this.ackStatus === true) {
        if (this.auditSelAck.indexOf("true") === -1) {
          this.auditSelAck.push("true");
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf("true"), 1);
      }
    }
    if (status === "notAckStatus") {
      if (this.notAckStatus === true) {
        if (this.auditSelAck.indexOf("false") === -1) {
          this.auditSelAck.push("false");
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf("false"), 1);
      }
    }
    if (pagecall === false) {
      this.startpageval = 1;
      this.holdauditSelAck = this.auditSelAck.join(",");
      this.holdauditStartdate = this.auditStartdate;
      this.holdauditEnddate = this.auditEnddate;
    }
    let startseldate = "";
    let endseldate = "";

    if (
      endseldate !== "" ||
      startseldate !== "" ||
      this.notAckStatus ||
      this.ackStatus
    ) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }

  handle_pageclick(pg) {
    this.startpageval = pg;
    this.do_search(true);
  }
  getperPage() {
    return this.perPage;
  }
  gettotalCnt() {
    return this.totalCnt;
  }
  getcurpageVal() {
    return this.startpageval;
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.do_search(false);
  }
  resetFilter() {
    // this.logSeldate = '';
    this.filters = {
      date: false
    };
    this.auditEnddate = null;
    this.auditStartdate = null;
    this.auditSelAck = [];
    this.holdauditStartdate = null;
    this.holdauditEnddate = null;
    this.ackStatus = false;
    this.notAckStatus = false;
  }
  filterClicked() {
    this.dateFilter = !this.dateFilter;
    if (!this.dateFilter) {
      // this.logSeldate = '';
      this.filters = {
        date: false
      };
      this.auditEnddate = null;
      this.auditStartdate = null;
      this.auditSelAck = [];
      this.holdauditStartdate = null;
      this.holdauditEnddate = null;
      this.ackStatus = false;
      this.notAckStatus = false;
      this.do_search(false);
    }
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  goBack() {
    this._location.back();
  }

  //notes start
  openAddNoteDialog(addNoteText: any) {
    console.log("addNoteText", addNoteText);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "createUpdateNotes",
        header: "Notes",
        taskUid: this.taskUid
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      this.notesText = response;
      console.log('response',this.notesText)
      if(response==='Cancel'){
      setTimeout(() => {
        this.api_loading = false;
        this.ngOnInit();
        // this.getTaskDetails();
      }, projectConstants.TIMEOUT_DELAY);
      }
      else{
        this.api_loading = true;
        setTimeout(() => {
          this.api_loading = false;
          this.ngOnInit();
          // this.getTaskDetails();
        }, projectConstants.TIMEOUT_DELAY);
      }
      
    });
  }
  attatchmentDialog(filesDes: any) {
    console.log("flels", filesDes);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "uploadFilesDesciption",
        filesDes: filesDes
        // header:'Notes',
        // taskUid:this.taskUid,
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      console.log("response", response);
    });
  }
  noteView(noteDetails: any) {
    console.log("notedetails", noteDetails);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "noteDetails",
        header: "Remarks Details",
        noteDetails: noteDetails
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getTaskDetails();
      console.log("response", response);
    });
  }
  progressbarDialog() {
    const dialogRef = this.dialog.open(CrmProgressbarComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        details: this.taskDetails,
        taskUid: this.taskUid
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      console.log("responseDataAboutNote", response);
      this.getTaskDetails();
      this.notesText = response;
      this.notesList.push();
    });
  }

  openDialogStatusChange(taskData: any) {
    console.log("openDialogStatusChange", taskData);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "statusChange",
        taskDetails: taskData
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log("resssssssss", res);
      // this.getTaskDetails();
      if(res==='Cancel'){
        setTimeout(() => {
          this.api_loading = false;
          this.ngOnInit();
          // this.getTaskDetails();
        }, projectConstants.TIMEOUT_DELAY);
        }
        else{
          this.api_loading = true;
          setTimeout(() => {
            this.api_loading = false;
            this.ngOnInit();
            // this.getTaskDetails();
          }, projectConstants.TIMEOUT_DELAY);
        }
    });
  }
  openDialogStatusChangeLeadToTask(taskData: any){
    console.log("openDialogStatusChange", taskData);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "statusChangeLeadToTask",
        taskDetails: taskData
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log("resssssssss", res);
      // this.ngOnInit()
      // this.getTaskDetails();
      if(res==='Cancel'){
        setTimeout(() => {
          this.api_loading = false;
          this.ngOnInit();
          // this.getTaskDetails();
        }, projectConstants.TIMEOUT_DELAY);
        }
        else{
          this.api_loading = true;
          setTimeout(() => {
            this.api_loading = false;
            this.ngOnInit();
            // this.getTaskDetails();
          }, projectConstants.TIMEOUT_DELAY);
        }
    });
  }
}
