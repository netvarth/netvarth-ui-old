import { Component, OnInit } from "@angular/core";
import { projectConstantsLocal } from "../../../../../../../src/app/shared/constants/project-constants";
import { projectConstants } from "../../../../../../../src/app/app.component";
import { Messages } from "../../../../../../../src/app/shared/constants/project-messages";
import { Location } from "@angular/common";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
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
import { WordProcessor } from '../../../../../../../src/app/shared/services/word-processor.service';
import { TeleBookingService } from '../../../../../shared/services/tele-bookings-service';
import { ViewAttachmentComponent } from "./select-attachment/view-attachment/view-attachment.component";

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
  api_loading1 = true;
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
  public taskDetailsData: any;
  //new ui variabe start
  public headerName: string = '';
  public taskDetailsDescription: string = 'View Task Details';
  public taskError: null;
  public taskDetailsForm: any;
  public selectMember: any;
  public allMemberList: any = [];
  public updateAssignMemberDetailsToDialog: any;
  public userType: any;
  public updateMemberId: any;
  public locationId: any;
  public assigneeId: any;
  public updteLocationId: any;
  public availableDates: any = [];
  public minDate: any = new Date();
  public maxDate: any;
  public ddate: any;
  public bTaskTitle: boolean = true
  public bTaskDescription: boolean = true;
  public bTaskAreaName: boolean = true;
  public bTaskDate: boolean = true;
  public bAssigneeName: boolean = true;
  public categoryListData: any = [];
  public taskTypeList: any = [];
  public taskStatusList: any = [];
  public taskPriorityList: any = [];
  public updateSelectTaskMangerDetailsToDialog: any;
  public selectTaskManger: any;
  public selectTaskMangerId: any;
  public updateManagerId: any;
  public estDurationWithDay: any;
  public estTime: any;
  public taskDueDays: any;
  public rupee_symbol = '₹';
  public bTaskCategory: boolean = true;
  public bTaskType: boolean = true;
  public bTaskLocation: boolean = true;
  public bTaskManager: boolean = true;
  public bTaskEstDuration: boolean = true;
  public bTaskPriority: boolean = true;
  public bTaskStatus: boolean = true;
  public bTaskTargetPotential: boolean = true;
  public bTaskBusinessPotential: boolean = true;
  public updateUserType: any;
  public taskMasterList: any = [];
  public notesTextarea: any;
  public errorMsg: boolean = false;
  public assignMemberErrorMsg: string = '';
  public bTaskFollowUpResult: boolean = true;
  public editable: boolean = true;
  public followUpStatusComplToProceed: any;
  public followUpStatusInProgressToPending: any;
  public fiollowUpStatusCancelledToRejected: any;
  public activityType: any;
  public followUPStatus: any
  public bActualResult: boolean = true;
  public actualResult: any;
  public customer_label: any;
  public customerName: any;
  public customerPhNo: any;
  public firstCustomerName: any;
  public updateResponse: any;
  public enquiryId: any;
  public enquiryDetails: any;
  bFollowupButtonAfterEnquiry: boolean = false;
  enquiryUid: any;
  totalTimeDisplay: any;
  public monthName: any = [
    {
      'count': '01',
      'monthName': 'January'
    },
    {
      'count': '02',
      'monthName': 'February'
    },
    {
      'count': '03',
      'monthName': 'March'
    },
    {
      'count': '04',
      'monthName': 'April'
    },
    {
      'count': '05',
      'monthName': 'May'
    },
    {
      'count': '06',
      'monthName': 'June'
    },
    {
      'count': '07',
      'monthName': 'July'
    },
    {
      'count': '08',
      'monthName': 'August'
    },
    {
      'count': '09',
      'monthName': 'September'
    },
    {
      'count': '10',
      'monthName': 'October'
    },
    {
      'count': '11',
      'monthName': 'November'
    },
    {
      'count': '12',
      'monthName': 'December'
    }
  ]
  api_loadingSaveTask: boolean;
  api_loadingCompletedStatus:boolean;
  api_loadingCancelledStatus:boolean;





  constructor(
    private crmService: CrmService,
    public _location: Location,
    public dialog: MatDialog,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    public shared_services: SharedServices,
    private snackbarService: SnackbarService,
    private createTaskFormBuilder: FormBuilder,
    private groupService: GroupStorageService,
    private datePipe: DatePipe,
    private wordProcessor: WordProcessor,
    private teleService: TeleBookingService
  ) { }

  ngOnInit(): void {
    this.api_loading = false;
    this.api_loading1 = false
    this.taskDetailsForm = this.createTaskFormBuilder.group({
      taskTitle: [],
      taskDescription: [],
      areaName: [],
      taskDate: [],
      userTaskCategory: [],
      userTaskType: [],
      taskLocation: [],
      selectTaskManger: [],
      taskDays: [],
      taskHrs: [],
      taskMin: [],
      userTaskPriority: [],
      taskStatus: [],
      targetResult: [],
      targetPotential: [],
      selectMember:[],
    })
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    //  console.log("User is :", user);
    this.selectMember = user.firstName + user.lastName;
    this.selectTaskManger = user.firstName + user.lastName;
    this.assigneeId = user.id;
    this.updateMemberId = this.assigneeId;
    this.locationId = user.bussLocs[0]
    if (user.userType === 1) {
      this.userType = 'PROVIDER'
    }
    this._Activatedroute.queryParams.subscribe((qparams: any) => {
      // console.log('qparams',qparams)
      if (qparams.dataType) {
        this.activityType = qparams.dataType;
      }
    })
    // console.log('this.activityType',this.activityType)
    this._Activatedroute.paramMap.subscribe(params => {
      this.enquiryId = params.get("id");
      this.taskUid = params.get("id");
      // console.log('this.enquiryId',this.enquiryId)
      if (this.activityType === 'UpdateFollowUP') {
        this.getEnquiryDetailsRefresh()
      }
      else {
        this.getTaskDetailsRefresh()
      }

    });

    if (this.activityType === 'UpdateFollowUP') {
      this.bTaskFollowUpResult = false;
    }

    this.getAssignMemberList();
    this.getLocation()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskPriorityListData()
    this.getTaskStatusListData()

  }
  getEnquiryDetailsRefresh() {
    this.crmService.getEnquiryDetails(this.enquiryId).subscribe((enquiryList: any) => {
      this.taskDetails = enquiryList;
      this.enquiryUid = enquiryList.uid;
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.name) {
        this.firstCustomerName = this.taskDetails.customer.name.charAt(0);
        this.customerName = this.taskDetails.customer.name;
        // this.customerPhNo =  this.teleService.getTeleNumber(this.taskDetails.customer.phoneNo);
      }
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.phoneNo) {
        this.customerPhNo = this.teleService.getTeleNumber(this.taskDetails.customer.phoneNo);
      }
      this.getUpdateFollowUPValue();
      this.headerName = 'Follow Up';
    })
  }

  getTaskDetailsRefresh() {
    if (this.activityType === undefined) {
      this.crmService.getTaskDetails(this.taskUid).subscribe(data => {
        this.taskDetails = data;
        this.getTaskmaster()
        this.taskkid = this.taskDetails.id;
        this.api_loading = false;
        console.log("Task Details : ", this.taskDetails);
        this.getDate()
        this.updateUserType = this.taskDetails.userTypeEnum;
        if (this.taskDetails.status.name === 'Completed') {
          this.bTaskFollowUpResult = false;
        }
        else {
          this.bTaskFollowUpResult = true;
        }


        if (this.activityType !== 'UpdateFollowUP') {
          if (this.taskDetails.title != undefined) {
            this.bTaskTitle = true;
            this.taskDetailsForm.controls.taskTitle.value = this.taskDetails.title;
          }
          else {
            this.bTaskTitle = false
          }
          if (this.taskDetails.description != undefined) {
            this.bTaskDescription = true;
            this.taskDetailsForm.controls.taskDescription.value = this.taskDetails.description;
          }
          else {
            this.bTaskDescription = false
          }
          if (this.taskDetails.assignee.name != undefined) {
            this.bAssigneeName = true;
            this.selectMember = this.taskDetails.assignee.name;
            this.updateMemberId = this.taskDetails.assignee.id;
          }
          else {
            this.bAssigneeName = false
          }
          if (this.taskDetails.locationArea != undefined) {
            this.bTaskAreaName = true;
            this.taskDetailsForm.controls.areaName.value = this.taskDetails.locationArea;
          }
          else {
            this.bTaskAreaName = false
          }
          if (this.taskDetails.dueDate != undefined) {
            this.bTaskDate = true
            this.taskDetailsForm.controls.taskDate.value = this.taskDetails.dueDate
          }
          else {
            this.bTaskDate = false
          }
          if (this.taskDetails.category.name != undefined) {
            this.bTaskCategory = true;
            this.taskDetailsForm.controls.userTaskCategory.value = this.taskDetails.category.id;
          }
          else {
            this.bTaskCategory = false;
          }
          if (this.taskDetails.type.name != undefined) {
            this.bTaskType = true
            this.taskDetailsForm.controls.userTaskType.value = this.taskDetails.type.id;
          }
          else {
            this.bTaskType = false;
          }
          if (this.taskDetails.location.name != undefined) {
            this.bTaskLocation = true;
            // this.taskDetailsForm.controls.taskLocation.value = this.taskDetails.location.id
            this.taskDetailsForm.controls.taskLocation.setValue(this.taskDetails.location.name);
            this.updteLocationId = this.taskDetails.location.id;
          }
          else {
            this.bTaskLocation = false;
          }
          if (this.taskDetails.manager.name != undefined) {
            this.bTaskManager = true;
            this.selectTaskManger = this.taskDetails.manager.name;
            this.updateManagerId = this.taskDetails.manager.id
          }
          else {
            this.bTaskManager = false
          }
          if (this.taskDetails.estDuration.days != undefined || this.taskDetails.estDuration.hours != undefined || this.taskDetails.estDuration.minutes != undefined) {
            this.bTaskEstDuration = true;
            this.estTime = { "days": this.taskDetails.estDuration.days, "hours": this.taskDetails.estDuration.hours, "minutes": this.taskDetails.estDuration.minutes };
            this.taskDetailsForm.controls.taskDays.value = this.taskDetails.estDuration.days;
            this.taskDetailsForm.controls.taskHrs.value = this.taskDetails.estDuration.hours;
            this.taskDetailsForm.controls.taskMin.value = this.taskDetails.estDuration.minutes;
          }
          else {
            this.bTaskEstDuration = false
          }
          if (this.taskDetails.priority.name != undefined) {
            this.bTaskPriority = true;
            this.taskDetailsForm.controls.userTaskPriority.value = this.taskDetails.priority.id
          }
          else {
            this.bTaskPriority = false
          }
          if (this.taskDetails.status.name != undefined) {
            this.bTaskStatus = true;
            this.taskDetailsForm.controls.taskStatus.value = this.taskDetails.status.id;
            this.editable = false;
            this.taskDetailsForm.controls['taskStatus'].disable()
          }
          else {
            // this.editable=false;
            this.bTaskStatus = false;
            this.taskDetailsForm.controls['taskStatus'].disable()
          }
          if (this.taskDetails.targetPotential) {
            this.bTaskTargetPotential = true;
            this.taskDetailsForm.patchValue({
              targetPotential: this.taskDetails.targetPotential
            })
          }
          else {
            this.bTaskTargetPotential = false
          }
          if (this.taskDetails.targetResult) {
            this.bTaskBusinessPotential = true;
            this.taskDetailsForm.patchValue({
              targetResult: this.taskDetails.targetResult
            })
          }
          else {
            this.bTaskBusinessPotential = false
          }
          if (this.taskDetails.actualResult) {
            this.bActualResult = true;
            this.actualResult = this.taskDetails.actualResult
          }
          else {
            this.bActualResult = true;
          }
          this.headerName = this.taskDetails.title
          if (this.taskDetails.originUid) {
            this.taskType = "SubTask";
            // console.log('taskType',this.taskType)
            this.headerName = 'SubActivity Overview';
            this.taskDetailsData = this.taskDetails
            this.crmService.taskToCraeteViaServiceData = this.taskDetailsData
            console.log('this.crmService.taskToCraeteViaServiceData;', this.crmService.taskToCraeteViaServiceData)
          }
          // console.log("this.notesList", this.notesList);
          this.crmService.taskToCraeteViaServiceData = this.taskDetails
          // console.log('this.crmService.taskToCraeteViaServiceData;',this.crmService.taskToCraeteViaServiceData)
        }

      });
      // if(this.taskDetails && this.taskDetails.customer){
      //   this.firstCustomerName=this.taskDetails.customer.name.charAt(0);
      //   this.customerName= this.taskDetails.customer.name;
      //   this.customerPhNo =  this.teleService.getTeleNumber(this.taskDetails.customer.phoneNo);
      // } 

      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.name) {
        this.firstCustomerName = this.taskDetails.customer.name.charAt(0);
        this.customerName = this.taskDetails.customer.name;
        // this.customerPhNo =  this.teleService.getTeleNumber(this.taskDetails.customer.phoneNo);
      }
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.phoneNo) {
        this.customerPhNo = this.teleService.getTeleNumber(this.taskDetails.customer.phoneNo);
      }

    }

  }

  //mew ui method start
  getUpdateFollowUPValue() {
    // console.log('UpdateValueFollowup')
    this.headerName = this.taskDetails.title;
    if (this.taskDetails.title) {
      this.taskDetailsForm.controls.taskTitle.value = this.taskDetails.title
    }
    if (this.taskDetails.estDuration) {
      this.estTime = { "days": this.taskDetails.estDuration.days, "hours": this.taskDetails.estDuration.hours, "minutes": this.taskDetails.estDuration.minutes };

    }
    if (this.taskDetails.assignee) {
      this.updateMemberId = this.taskDetails.assignee.id;
    }
    if (this.taskDetails.description) {
      this.taskDetailsForm.controls.taskDescription.value = this.taskDetails.description;
    }
    if (this.taskDetails.locationArea) {
      this.taskDetailsForm.controls.areaName.value = (this.taskDetails.locationArea);
    }
    if (this.taskDetails.dueDate) {
      this.taskDetailsForm.controls.taskDate.value = this.taskDetails.dueDate;
    }
    this.updateUserType = this.taskDetails.userTypeEnum;
    // this.getEnquiryMaster()
    this.getTaskmaster()

  }
  actualResultTask(actualRes: any) {
  }

  getTaskmaster() {
    this.crmService.getTaskMasterList().subscribe((response: any) => {
      // console.log('TaskMasterListresponse :',response);
      this.taskMasterList.push(response)
      // this.taskMasterList[0].forEach((item:any)=>{
      // console.log('this.taskDetails.title',this.taskDetails.title)
      if (this.activityType === undefined) {
        if (this.taskDetails.title === 'Direct Notice Distribution') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;

        }
        else if (this.taskDetails.title === 'Notice Distribution Through Newspaper') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }
        else if (this.taskDetails.title === 'Kiosk/Umbrella Activity and Data Collection') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }
        else if (this.taskDetails.title === 'Poster Activity') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }
        else if (this.taskDetails.title === 'Telecalling') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }
        else if (this.taskDetails.title === 'Digital Marketing') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }
        else if (this.taskDetails.title === 'Home Visit') {
          this.bTaskStatus = false;
          this.bTaskCategory = false;
          this.bTaskType = false;
          this.bTaskLocation = false;
          this.bTaskManager = false;
          this.bTaskEstDuration = false;
          this.bTaskPriority = false;
          this.bTaskStatus = false;
          this.bTaskTargetPotential = false;
          this.bTaskBusinessPotential = false;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bAssigneeName = true;
          this.bTaskDate = true;
          this.bTaskAreaName = true;
        }

        else if ((this.taskDetails.title === 'BA Follow Up') || (this.taskDetails.title === 'BA Recruitment')) {
          if (this.activityType === undefined) {
            // console.log('2nd')
            this.bTaskStatus = false;
            this.bTaskCategory = false;
            this.bTaskType = false;
            this.bTaskLocation = true;
            this.bTaskManager = false;
            this.bTaskEstDuration = false;
            this.bTaskPriority = false;
            this.bTaskStatus = false;
            this.bTaskTargetPotential = false;
            this.bTaskBusinessPotential = false;
            this.bTaskTitle = true;
            this.bTaskDescription = true;
            this.bAssigneeName = true;
            this.bTaskDate = true;
            this.bTaskAreaName = true;
          }


        }
        else {
          // console.log('4thhhhh')
          this.bTaskStatus = true;
          this.bTaskCategory = true;
          this.bTaskType = true;
          this.bTaskLocation = true;
          this.bTaskManager = true;
          this.bTaskEstDuration = true;
          this.bTaskPriority = true;
          this.bTaskStatus = true;
          this.bTaskTargetPotential = true;
          this.bTaskBusinessPotential = true;
          this.bTaskTitle = true;
          this.bTaskDescription = true;
          this.bTaskDate = true;
          this.bAssigneeName = true;
          this.bTaskAreaName = true;
        }
      }
      else if (this.activityType === 'UpdateFollowUP') {
        // console.log('3rddddddd')
        this.bTaskStatus = false;
        this.bTaskCategory = false;
        this.bTaskType = false;
        this.bTaskLocation = true;
        this.bTaskManager = false;
        this.bTaskEstDuration = false;
        this.bTaskPriority = false;
        this.bTaskStatus = false;
        this.bTaskTargetPotential = false;
        this.bTaskBusinessPotential = false;
        this.bTaskTitle = false;
        this.bTaskDescription = false;
        this.bTaskDate = false;
        this.bAssigneeName = true;
        this.bTaskAreaName = false;
        this.bFollowupButtonAfterEnquiry = true;

      }
    })
    // console.log('this.taskMasterList',this.taskMasterList[0])
  }

  getEnquiryMaster() {

  }

  getNotesDetails() {
    this.taskDetails.notes.forEach((notesdata: any) => {
      this.notesList.push(notesdata);
    });
  }
  resetErrors() {
    this.taskError = null;
  }
  autoGrowTextZone(e) {
    console.log('eeeeee',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15) + "px";
  }
  getLocation() {
    this.crmService.getProviderLocations().subscribe((res) => {
      this.taskDetailsForm.controls.taskLocation.setValue(res[0].place);
      this.updteLocationId = res[0].id;
    })
  }
  getAssignMemberList() {
    this.crmService.getMemberList().subscribe((memberList: any) => {
      this.allMemberList.push(memberList)
    }, (error: any) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    })
  }
  selectMemberDialog(handleselectMember: any) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data: {
        requestType: 'createtaskSelectMember',
        header: 'Assign Member',
        memberList: this.allMemberList,
        assignMembername: handleselectMember,
        updateSelectedMember: this.updateAssignMemberDetailsToDialog,
        updateAssignMemberId: this.updateMemberId
      }
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === '') {
      } else {
        this.updateAssignMemberDetailsToDialog = res;
        this.selectMember = (res.firstName + ' ' + res.lastName);
        this.userType = res.userType;
        this.locationId = res.bussLocations[0];
        if (res.place) { }
        this.assigneeId = res.id;
        this.updateMemberId = this.assigneeId;
        this.updteLocationId = this.locationId;
      }
    })
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  getCategoryListData() {
    this.crmService.getCategoryList().subscribe((categoryList: any) => {
      this.categoryListData.push(categoryList)
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    )
  }
  getTaskTypeListData() {
    this.crmService.getTaskType().subscribe((taskTypeList: any) => {
      // console.log('taskTypeList',taskTypeList);
      this.taskTypeList.push(taskTypeList)
    },
      (error: any) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }
  selectManagerDialog(handleSelectManager: any) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      panelClass: ['popup-class', 'confirmationmainclass'],
      data: {
        requestType: 'createtaskSelectManager',
        header: 'Assign Manager',
        memberList: this.allMemberList,
        assignMembername: handleSelectManager,
        updateSelectTaskManager: this.updateSelectTaskMangerDetailsToDialog,
        updateManagerId: this.updateManagerId,
      }
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log('afterSelectPopupValue', res)
      if (res === '') {
        this.selectTaskManger = this.taskDetails.manager.name;//'Select task manager'

      }
      else {
        this.updateSelectTaskMangerDetailsToDialog = res;
        this.selectTaskManger = ((res.firstName + res.lastName))
        this.selectTaskMangerId = res.id;
        this.updateManagerId = this.selectTaskMangerId
      }
    })
  }
  handleTaskEstDuration(estDuration: any) {
    console.log("entered")
    this.estDurationWithDay = this.taskDueDays;
    const estDurationDay = this.taskDetailsForm.controls.taskDays.value
    const estDurationHour = this.taskDetailsForm.controls.taskHrs.value
    const estDurationMinute = this.taskDetailsForm.controls.taskMin.value
    this.estTime = { "days": estDurationDay, "hours": estDurationHour, "minutes": estDurationMinute };
    console.log('estDurationDay', this.estTime)

  }
  getTaskPriorityListData() {
    this.crmService.getTaskPriority().subscribe((taskPriority: any) => {
      this.taskPriorityList.push(taskPriority);
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }
    )
  }
  getColor(status) {
    if (status) {
      if (status === 'New') {
        return '#0D2348'
      }
      else if (status === 'Assigned') {
        return 'pink';
      }
      else if (status === 'In Progress') {
        return '#fcce2b';
      }
      else if (status === 'Cancelled') {
        return 'red';
      }
      else if (status === 'Suspended') {
        return 'orange';
      }
      else if (status === 'Completed') {
        return 'green';
      }
      else {
        return 'black'
      }
    }
  }
  getTaskStatusListData() {
    this.crmService.getTaskStatus().subscribe((taskStatus: any) => {
      this.taskStatusList.push(taskStatus)
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }
  saveCreateTask() {
    if (this.activityType !== 'UpdateFollowUP') {
      this.api_loadingSaveTask = true;
      const updateTaskData: any = {
        "title": this.taskDetailsForm.controls.taskTitle.value,
        "description": this.taskDetailsForm.controls.taskDescription.value,
        "userType": this.updateUserType,
        "category": { "id": this.taskDetailsForm.controls.userTaskCategory.value },
        "type": { "id": this.taskDetailsForm.controls.userTaskType.value },
        "status": { "id": this.taskDetailsForm.controls.taskStatus.value },
        "priority": { "id": this.taskDetailsForm.controls.userTaskPriority.value },
        "dueDate": this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value, 'yyyy-MM-dd'),
        "location": { "id": this.updteLocationId },
        "locationArea": this.taskDetailsForm.controls.areaName.value,
        "assignee": { "id": this.updateMemberId },
        "manager": { "id": this.updateManagerId },
        "targetResult": this.taskDetailsForm.controls.targetResult.value,
        "targetPotential": this.taskDetailsForm.controls.targetPotential.value,
        "estDuration": this.estTime,
        "actualResult": this.actualResult
      }
      const createNoteData: any = {
        "note": this.notesTextarea
      }
      if (this.updateUserType === ('PROVIDER' || 'CONSUMER')) {
        this.crmService.updateTask(this.taskDetails.taskUid, updateTaskData).subscribe((response) => {
          this.api_loadingSaveTask = true;
          this.updateResponse = response;
          if (this.updateResponse = true) {
            this.crmService.activityCloseWithNotes(this.taskDetails.taskUid, createNoteData).subscribe((response) => {
              setTimeout(() => {
                this.api_loadingSaveTask = true;
                this.snackbarService.openSnackBar('Successfully updated activity');
                this.router.navigate(['provider', 'task']);
              }, projectConstants.TIMEOUT_DELAY);
            },
              (error) => {
                setTimeout(() => {
                  this.api_loadingSaveTask = false;
                  this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }, projectConstants.TIMEOUT_DELAY);
              })
          }
        },
          (error) => {
            setTimeout(() => {
              this.api_loadingSaveTask = false;
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })

      }
    }
    if (this.activityType === 'UpdateFollowUP') {
      const updateFollowUpData = {
        "title": this.taskDetailsForm.controls.taskTitle.value,
        "description": this.taskDetailsForm.controls.taskDescription.value,
        "userType": this.updateUserType,
        "category": { "id": this.taskDetails.category.id },
        "type": { "id": this.taskDetails.type.id },
        "status": { "id": this.followUPStatus },
        "priority": { "id": this.taskDetails.priority.id },
        "dueDate": this.datePipe.transform(this.taskDetailsForm.controls.taskDate.value, 'yyyy-MM-dd'),
        "location": { "id": this.taskDetails.location.id },
        "locationArea": this.taskDetailsForm.controls.areaName.value,
        "assignee": { "id": this.updateMemberId },
        "estDuration": this.estTime,
        "actualResult": this.actualResult

      }

      if (this.updateUserType === ('PROVIDER' || 'CONSUMER')) {

        this.crmService.updateTask(this.taskDetails.taskUid, updateFollowUpData).subscribe((response) => {
          console.log('afterupdateFollowUpData', response);
          setTimeout(() => {
            this.snackbarService.openSnackBar('Successfully updated activity');
            this.taskDetailsForm.reset();
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
          (error) => {
            setTimeout(() => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })
      }

    }
  }
  handleNotesDescription(textValue: any) {
    if (textValue != '') {
      this.errorMsg = false;
      this.assignMemberErrorMsg = '';
    }
    else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = 'Please enter some remarks'
    }

  }
  saveCreateNote(notesValue: any) {
    if (this.notesTextarea !== undefined) {
      this.errorMsg = false;
      this.assignMemberErrorMsg = '';
      const createNoteData: any = {
        "note": this.notesTextarea
      }
      if (this.activityType === 'UpdateFollowUP') {
        this.crmService.enquiryNotes(this.enquiryUid, createNoteData).subscribe((response: any) => {
          this.api_loading = true;
          this.notesTextarea = '';
          setTimeout(() => {
            this.getEnquiryDetailsRefresh()
            this.api_loading = false;
          }, projectConstants.TIMEOUT_DELAY);
          this.snackbarService.openSnackBar('Remarks added successfully');
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
      else {
        this.crmService.addNotes(this.taskDetails.taskUid, createNoteData).subscribe((response: any) => {
          this.api_loading = true;
          this.notesTextarea = '';
          setTimeout(() => {
            this.getTaskDetailsRefresh()
            this.api_loading = false;
          }, projectConstants.TIMEOUT_DELAY);
          this.snackbarService.openSnackBar('Remarks added successfully');
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }

    }
    else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = 'Please enter some description'
    }
  }
  selectStatus(status: any) {
    console.log('status', status)
    if (status.name === 'Pending') {
      this.followUpStatusInProgressToPending = status.id;
      document.getElementById('A').style.boxShadow = "none";
      // document.getElementById('B').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      document.getElementById('C').style.boxShadow = "none";
      this.crmService.statusToPendingFollowUp(this.enquiryId).subscribe((response) => {
        console.log('afterupdateFollowUpData', response);
        setTimeout(() => {
          this.taskDetailsForm.reset();
          this.snackbarService.openSnackBar('Successfully updated to ' + status.name.toLowerCase() + ' mode');
          this.router.navigate(['provider', 'crm']);
        }, projectConstants.TIMEOUT_DELAY);
      },
        (error) => {
          setTimeout(() => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })
    }
    else if (status.name === 'Rejected') {
      this.api_loadingCancelledStatus=true;
      this.fiollowUpStatusCancelledToRejected = status.id;
      document.getElementById('A').style.boxShadow = "none";
      document.getElementById('C').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      this.crmService.statusToRejectedFollowUP(this.enquiryId).subscribe((response) => {
        console.log('afterupdateFollowUpData', response);
        setTimeout(() => {
          this.taskDetailsForm.reset();
          this.snackbarService.openSnackBar('Successfully updated to ' + status.name.toLowerCase() + ' mode');
          this.api_loadingCancelledStatus=false;
          this.router.navigate(['provider', 'crm']);
        }, projectConstants.TIMEOUT_DELAY);
      },
        (error) => {
          setTimeout(() => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })
    }
    else if (status.name === 'Proceed') {
      this.api_loadingCompletedStatus=true;
      this.followUpStatusComplToProceed = status.id
      document.getElementById('A').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
      document.getElementById('C').style.boxShadow = "none";
      console.log(' this.enquiryId', this.enquiryId)
      if (this.taskDetails.status.name != 'Proceed') {
        this.crmService.statusToProceed(this.enquiryId).subscribe((response) => {
          setTimeout(() => {
            this.taskDetailsForm.reset();
            this.snackbarService.openSnackBar('Successfully updated');
            this.api_loadingCompletedStatus=false;
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
          (error) => {
            setTimeout(() => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })
      }
      else {
        this.crmService.statusToProceedFollowUp2(this.enquiryId).subscribe((response) => {
          setTimeout(() => {
            this.taskDetailsForm.reset();
            this.snackbarService.openSnackBar('Successfully updated');
            this.api_loadingCompletedStatus=false;
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        },
          (error) => {
            setTimeout(() => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })
      }


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
        type: this.taskType
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'close') {
        this.api_loading1 = false;
      }
      else {
        this.api_loading1 = true;
        setTimeout(() => {
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
          this.api_loading1 = false;
          this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
        }, 5000);
      }
    });
  }



  viewAttachment(attachment) {
    const ViewFileRef = this.dialog.open(ViewAttachmentComponent, {
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        attachmentDetails: attachment
      }
    });
    ViewFileRef.afterClosed().subscribe(res => {
      if (res === 'close') {
      }
    });
  }







  getTaskDetails() {
    this.crmService.getTaskDetails(this.taskUid).subscribe(data => {
      this.taskDetails = data;
      this.taskkid = this.taskDetails.id;
      this.taskDetails.notes.forEach((notesdata: any) => {
        this.notesList.push(notesdata);
      });
    });
  }
  openEditTask(taskdata: any, editText: any, subUpdateData: any) {
    if (taskdata.originUid === undefined) {
      this.crmService.taskToCraeteViaServiceData = taskdata
      const newTaskData = this.crmService.taskToCraeteViaServiceData;
      this.crmService.taskActivityName = editText;
      newTaskData;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'Update'
        }
      };
      this.router.navigate(['provider', 'task', 'create-task'], navigationExtras);
    }
    else {
      this.crmService.taskToCraeteViaServiceData = subUpdateData
      const newTaskData = this.crmService.taskToCraeteViaServiceData;
      this.crmService.taskActivityName = editText;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'SubUpdate',
          accountId: newTaskData.accountId,
          days: newTaskData.actualDuration.days,
          hours: newTaskData.actualDuration.hours,
          minutes: newTaskData.actualDuration.minutes,
          appointments: newTaskData.appointments,
          assigneeId: newTaskData.assignee.id,
          assigneeName: newTaskData.assignee.name,
          attachments: newTaskData.attachments,
          category: newTaskData.category.id,
          categoryName: newTaskData.category.name,
          createdBy: newTaskData.createdBy,
          customerNotes: newTaskData.customerNotes,
          dueDate: newTaskData.dueDate,
          description: newTaskData.description,
          estdays: (newTaskData.estDuration.days),
          esthours: newTaskData.estDuration.hours,
          estminutes: newTaskData.estDuration.minutes,
          id: newTaskData.id,
          isSubTask: newTaskData.isSubTask,
          lastStatusUpdatedBy: newTaskData.lastStatusUpdatedBy,
          locationId: newTaskData.location.id,
          locationName: newTaskData.location.name,
          managerId: newTaskData.manager.id,
          managerName: newTaskData.manager.name,
          notes: newTaskData.notes,
          originFrom: newTaskData.originFrom,
          originId: newTaskData.originId,
          originUid: newTaskData.originUid,
          priorityId: newTaskData.priority.id,
          priorityName: newTaskData.priority.name,
          progress: newTaskData.progress,
          progressNotes: newTaskData.progressNotes,
          statusId: newTaskData.status.id,
          statusName: newTaskData.status.name,
          taskUid: newTaskData.taskUid,
          teamMembers: newTaskData.teamMembers,
          teams: newTaskData.teams,
          title: newTaskData.title,
          typeId: newTaskData.type.id,
          typeName: newTaskData.type.name,
          userTypeEnum: newTaskData.userTypeEnum,
          targetResult: newTaskData.targetResult,
          targetPotential: newTaskData.targetPotential,
          locationArea: newTaskData.locationArea,
        }
      };
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
        type: this.taskType
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getTaskDetails();
      this.changeAction = true;
    });
  }
  chnageStatus() {
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
    });
  }

  createSubTask(taskid) {
    this.router.navigate(["provider", "task", "create-subtask", taskid]);
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
    this.router.navigate(['provider', 'crm']);
  }
  openAddNoteDialog(addNoteText: any) {
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
      if (response === 'Cancel') {
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
        }, projectConstants.TIMEOUT_DELAY);
      }
      else {
        this.api_loading = true;
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
          // this.ngOnInit();
          // this.getTaskDetails();
        }, projectConstants.TIMEOUT_DELAY);
      }

    });
  }
  attatchmentDialog(filesDes: any) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "uploadFilesDesciption",
        filesDes: filesDes
      }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
    });
  }
  noteView(noteDetails: any) {
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
      this.getTaskDetails();
      this.notesText = response;
      this.notesList.push();
    });
  }

  openDialogStatusChange(taskData: any) {
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
      if (res === 'Cancel') {
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
        }, projectConstants.TIMEOUT_DELAY);
      }
      else {
        this.api_loading = true;
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
        }, projectConstants.TIMEOUT_DELAY);
      }
    });
  }
  openDialogStatusChangeLeadToTask(taskData: any) {
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
      if (res === 'Cancel') {
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
        }, projectConstants.TIMEOUT_DELAY);
      }
      else {
        this.api_loading = true;
        setTimeout(() => {
          this.api_loading = false;
          if (this.activityType === 'UpdateFollowUP') {
            this.getEnquiryDetailsRefresh()
          }
          else {
            this.getTaskDetailsRefresh()
          }
        }, projectConstants.TIMEOUT_DELAY);
      }
    });
  }
  getDate() {
    // console.log(this.taskDetails.notes[0].createdDate)
    this.taskDetails.notes.forEach(
      (date: any) => {
        console.log('dateTime', date);
        console.log('date.createdDate', date.createdDate)
        let dateHour = date.createdDate.slice(11, 13)
        console.log('dateHour', Number(dateHour))
        let dateHr1: any;
        let dateHr12: any;
        let dateHr2: any;
        let dateMonth: any;
        let meridianAm: string = 'am';
        let meridianPm: string = 'pm';
        dateMonth = date.createdDate.slice(3, 5);
        console.log('dateMonth', dateMonth);
        if (dateHour < 12) {
          dateHr1 = dateHour;
          console.log('dateHr1', dateHr1);
          this.totalTimeDisplay = dateHr1 + ':' + dateMonth + ' ' + meridianAm;
          console.log('totalTimeDisplayHr1', this.totalTimeDisplay)
        }
        else if (dateHour === 12) {
          dateHr12 = dateHour;
          console.log('dateHr12', dateHr12);
          this.totalTimeDisplay = dateHr12 + ':' + dateMonth + ' ' + meridianPm;
          console.log('totalTimeDisplayHr12', this.totalTimeDisplay)

        }
        else {
          dateHr2 = dateHour - 12;
          console.log('dateHr2', dateHr1);
          this.totalTimeDisplay = dateHr2 + ':' + dateMonth + ' ' + meridianPm;
          console.log('totalTimeDisplayHr2', this.totalTimeDisplay)
        }
      }
    )

  }
}
