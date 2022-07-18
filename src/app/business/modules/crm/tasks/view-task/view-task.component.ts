import { Component, OnInit } from "@angular/core";
import { projectConstants } from "../../../../../../../src/app/app.component";
import { Messages } from "../../../../../../../src/app/shared/constants/project-messages";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CrmService } from "../../crm.service";
import { MatDialog } from "@angular/material/dialog";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { CrmSelectMemberComponent } from "../../../../shared/crm-select-member/crm-select-member.component";
import { SharedServices } from "../../../../../shared/services/shared-services";
import { FormBuilder } from '@angular/forms';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ViewAttachmentComponent } from "./select-attachment/view-attachment/view-attachment.component";
@Component({
  selector: "app-view-task",
  templateUrl: "./view-task.component.html",
  styleUrls: ["./view-task.component.css"]
})
export class ViewTaskComponent implements OnInit {
  api_loading = true;
  api_loading1 = true;
  taskUid: any;
  taskDetails: any;
  public notesList: any = [];
  taskkid: any;
  taskType: any;
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
  public bTaskActualPotential: boolean = true;
  public bTaskBusinessPotential: boolean = true;
  public updateUserType: any;
  public taskMasterList: any = [];
  public notesTextarea: any;
  public errorMsg: boolean = false;
  public assignMemberErrorMsg: string = '';
  public bTaskFollowUpResult: boolean = true;
  public activityType: any;
  public followUPStatus: any
  public bActualResult: boolean = true;
  public actualResult: any;
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
  api_loadingCompletedStatus: boolean;
  api_loadingCancelledStatus: boolean;
  hideBackBtn: boolean = true;
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
      selectMember: [],
      actualPotential: [],
    })
    this.userInfo();
    this._Activatedroute.queryParams.subscribe((qparams: any) => {
      if (qparams.dataType) {
        this.activityType = qparams.dataType;
      }
    })
    this._Activatedroute.paramMap.subscribe(params => {
      this.enquiryId = params.get("id");
      this.taskUid = params.get("id");
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
  userInfo() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (user) {
      if (user.firstName || user.lastName) {
        this.selectMember = user.firstName + user.lastName;
        this.selectTaskManger = user.firstName + user.lastName;
      }
      if (user.id) {
        this.assigneeId = user.id;
        this.updateMemberId = this.assigneeId;
      }
      if (user.bussLocs && user.bussLocs[0]) {
        this.locationId = user.bussLocs[0]
      }
      if (user.userType === 1) {
        this.userType = 'PROVIDER'
      }
    }

  }
  getEnquiryDetailsRefresh() {
    this.crmService.getEnquiryDetails(this.enquiryId).subscribe((enquiryList: any) => {
      this.taskDetails = enquiryList;
      this.enquiryUid = enquiryList.uid;
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.name) {
        this.firstCustomerName = this.taskDetails.customer.name.charAt(0);
        this.customerName = this.taskDetails.customer.name;
      }
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.phoneNo) {
        this.customerPhNo = (this.taskDetails.customer.phoneNo);
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
        if (this.taskDetails && this.taskDetails.id) {
          this.taskkid = this.taskDetails.id;
        }
        this.api_loading = false;
        // console.log("Task Details : ", this.taskDetails);
        this.getDate()
        if (this.taskDetails && this.taskDetails.userTypeEnum) {
          this.updateUserType = this.taskDetails.userTypeEnum;
        }
        if (this.taskDetails) {
          if (this.taskDetails.status && (this.taskDetails.status.name === 'Completed')) {
            this.bTaskFollowUpResult = false;
          }
          else {
            this.bTaskFollowUpResult = true;
          }
        }

        if (this.activityType !== 'UpdateFollowUP') {
          if (this.taskDetails) {
            if (this.taskDetails.title != undefined) {
              this.bTaskTitle = true;
              this.taskDetailsForm.controls.taskTitle.value = this.taskDetails.title;
              this.headerName = this.taskDetails.title;
            }
            else {
              this.bTaskTitle = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.description != undefined) {
              this.bTaskDescription = true;
              this.taskDetailsForm.controls.taskDescription.value = this.taskDetails.description;
            }
            else {
              this.bTaskDescription = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.assignee.name != undefined) {
              this.bAssigneeName = true;
              this.selectMember = this.taskDetails.assignee.name;
              this.updateMemberId = this.taskDetails.assignee.id;
            }
            else {
              this.bAssigneeName = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.locationArea != undefined) {
              this.bTaskAreaName = true;
              this.taskDetailsForm.controls.areaName.value = this.taskDetails.locationArea;
            }
            else {
              this.bTaskAreaName = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.dueDate != undefined) {
              this.bTaskDate = true
              this.taskDetailsForm.controls.taskDate.value = this.taskDetails.dueDate;
            }
            else {
              this.bTaskDate = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.category.name != undefined) {
              this.bTaskCategory = true;
              this.taskDetailsForm.controls.userTaskCategory.value = this.taskDetails.category.id;
            }
            else {
              this.bTaskCategory = false;
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.type.name != undefined) {
              this.bTaskType = true
              this.taskDetailsForm.controls.userTaskType.value = this.taskDetails.type.id;
            }
            else {
              this.bTaskType = false;
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.location && this.taskDetails.location.name != undefined) {
              this.bTaskLocation = true;
              this.taskDetailsForm.controls.taskLocation.setValue(this.taskDetails.location.name);
              if (this.taskDetails.location.id) {
                this.updteLocationId = this.taskDetails.location.id;
              }
            }
            else {
              this.bTaskLocation = false;
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.manager && this.taskDetails.manager.name != undefined) {
              this.bTaskManager = true;
              this.selectTaskManger = this.taskDetails.manager.name;
              if (this.taskDetails.manager.id) {
                this.updateManagerId = this.taskDetails.manager.id;
              }
            }
            else {
              this.bTaskManager = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.estDuration && (this.taskDetails.estDuration.days != undefined || this.taskDetails.estDuration.hours != undefined || this.taskDetails.estDuration.minutes != undefined)) {
              this.bTaskEstDuration = true;
              this.estTime = { "days": this.taskDetails.estDuration.days, "hours": this.taskDetails.estDuration.hours, "minutes": this.taskDetails.estDuration.minutes };
              this.taskDetailsForm.controls.taskDays.value = this.taskDetails.estDuration.days;
              this.taskDetailsForm.controls.taskHrs.value = this.taskDetails.estDuration.hours;
              this.taskDetailsForm.controls.taskMin.value = this.taskDetails.estDuration.minutes;
            }
            else {
              this.bTaskEstDuration = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.priority && this.taskDetails.priority.name != undefined) {
              this.bTaskPriority = true;
              if (this.taskDetails.priority.id) {
                this.taskDetailsForm.controls.userTaskPriority.value = this.taskDetails.priority.id;
              }
            }
            else {
              this.bTaskPriority = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.status && this.taskDetails.status.name != undefined) {
              this.bTaskStatus = true;
              if (this.taskDetails.status.id) {
                this.taskDetailsForm.controls.taskStatus.value = this.taskDetails.status.id;
              }
            }
            else {
              this.bTaskStatus = false;
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.targetPotential) {
              this.bTaskTargetPotential = true;
              this.taskDetailsForm.patchValue({
                targetPotential: this.taskDetails.targetPotential
              })
            }
            else {
              this.bTaskTargetPotential = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.targetResult) {
              this.bTaskBusinessPotential = true;
              this.taskDetailsForm.patchValue({
                targetResult: this.taskDetails.targetResult
              })
            }
            else {
              this.bTaskBusinessPotential = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.actualPotential) {
              this.bTaskActualPotential = true;
              this.taskDetailsForm.patchValue({
                actualPotential: this.taskDetails.actualPotential
              })
            }
            else {
              this.bTaskActualPotential = false
            }
          }
          if (this.taskDetails) {
            if (this.taskDetails.actualResult) {
              this.bActualResult = true;
              this.actualResult = this.taskDetails.actualResult
            }
            else {
              this.bActualResult = true;
            }
          }
          this.crmService.taskToCraeteViaServiceData = this.taskDetails
        }
      });
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.name) {
        this.firstCustomerName = this.taskDetails.customer.name.charAt(0);
        this.customerName = this.taskDetails.customer.name;
      }
      if (this.taskDetails && this.taskDetails.customer && this.taskDetails.customer.phoneNo) {
        this.customerPhNo = (this.taskDetails.customer.phoneNo);
      }
    }

  }

  //mew ui method start
  getUpdateFollowUPValue() {
    if (this.taskDetails && this.taskDetails.title) {
      this.taskDetailsForm.controls.taskTitle.value = this.taskDetails.title;
      this.headerName = this.taskDetails.title;
    }
    if (this.taskDetails && this.taskDetails.estDuration) {
      this.estTime = {
        "days": this.taskDetails.estDuration.days, "hours": this.taskDetails.estDuration.hours,
        "minutes": this.taskDetails.estDuration.minutes
      };
    }
    if (this.taskDetails && this.taskDetails.assignee) {
      this.updateMemberId = this.taskDetails.assignee.id;
    }
    if (this.taskDetails && this.taskDetails.description) {
      this.taskDetailsForm.controls.taskDescription.value = this.taskDetails.description;
    }
    if (this.taskDetails && this.taskDetails.locationArea) {
      this.taskDetailsForm.controls.areaName.value = (this.taskDetails.locationArea);
    }
    if (this.taskDetails && this.taskDetails.dueDate) {
      this.taskDetailsForm.controls.taskDate.value = this.taskDetails.dueDate;
    }
    if (this.taskDetails && this.taskDetails.userTypeEnum) {
      this.updateUserType = this.taskDetails.userTypeEnum;
    }
    this.getTaskmaster()

  }
  getTaskmaster() {
    return new Promise((resolve, reject) => {
      this.crmService.getTaskMasterList().subscribe((response: any) => {
        resolve(response)
        this.taskMasterList.push(response);
        if (this.activityType === undefined) {
          if (this.taskDetails.title === 'Direct Notice Distribution') {
            if (response && response[2]) {
              if (response[2].title) {
                if (response[2].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[2].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable();
                  }
                }
              }
              if (response[2].description) {
                if (response[2].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[2].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable();
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }

                }
              }
              if (response[2].assignee) {
                if (response[2].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[2].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[2].status) {
                if (response[2].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[2].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[2].category) {
                if (response[2].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[2].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[2].type) {
                if (response[2].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[2].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }
                }
              }
              if (response[2].location) {
                if (response[2].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[2].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }
                }
              }
              if (response[2].manager) {
                if (response[2].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[2].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[2].estDuration) {
                if (response[2].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[2].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable();
                    this.taskDetailsForm.controls['taskHrs'].disable();
                    this.taskDetailsForm.controls['taskMin'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[2].priority) {
                if (response[2].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[2].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }
                }
              }
              if (response[2].targetResult) {
                if (response[2].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[2].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[2].targetPotential) {
                if (response[2].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[2].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }
                }
              }
              if (response[2].dueDate) {
                if (response[2].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[2].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }
                }
              }
              if (response[2].locationArea) {
                if (response[2].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[2].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[2].actualPotential) {
                if (response[2].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[2].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }
                }
              }
            }
          }
          else if (this.taskDetails.title === 'Notice Distribution Through Newspaper') {
            if (response && response[3]) {
              if (response[3].title) {
                if (response[3].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[3].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[3].description) {
                if (response[3].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[3].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }
                }
              }
              if (response[3].assignee) {
                if (response[3].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[3].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[3].status) {
                if (response[3].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[3].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[3].category) {
                if (response[3].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[3].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[3].type) {
                if (response[3].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[3].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }
                }
              }
              if (response[3].location) {
                if (response[3].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[3].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }
                }
              }
              if (response[3].manager) {
                if (response[3].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[3].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[3].estDuration) {
                if (response[3].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[3].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable();
                    this.taskDetailsForm.controls['taskHrs'].disable();
                    this.taskDetailsForm.controls['taskMin'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }
                  this.taskDetailsForm.controls['taskDays'].enable()
                  this.taskDetailsForm.controls['taskHrs'].enable()
                  this.taskDetailsForm.controls['taskMin'].enable()
                }
              }
              if (response[3].priority) {
                if (response[3].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[3].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }
                }
              }
              if (response[3].targetResult) {
                if (response[3].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[3].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[3].targetPotential) {
                if (response[3].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[3].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }
                }
              }
              if (response[3].dueDate) {
                if (response[3].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[3].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }
                }
              }
              if (response[3].locationArea) {
                if (response[3].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[3].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[3].actualPotential) {
                if (response[3].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[3].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }
                }
              }
            }
          }
          else if (this.taskDetails.title === 'Kiosk/Umbrella Activity and Data Collection') {
            if (response && response[4]) {
              if (response[4].title) {
                if (response[4].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[4].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[4].description) {
                if (response[4].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[4].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }
                }
              }
              if (response[4].assignee) {
                if (response[4].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[4].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[4].status) {
                if (response[4].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[4].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[4].category) {
                if (response[4].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[4].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[4].type) {
                if (response[4].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[4].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }
                }
              }
              if (response[4].location) {
                if (response[4].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[4].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }
                }
              }
              if (response[4].manager) {
                if (response[4].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[4].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[4].estDuration) {
                if (response[4].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[4].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable()
                    this.taskDetailsForm.controls['taskHrs'].disable()
                    this.taskDetailsForm.controls['taskMin'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[4].priority) {
                if (response[4].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[4].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }
                }
              }
              if (response[4].targetResult) {
                if (response[4].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[4].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[4].targetPotential) {
                if (response[4].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[4].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }
                }
              }
              if (response[4].dueDate) {
                if (response[4].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[4].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }
                }
              }
              if (response[4].locationArea) {
                if (response[4].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[4].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[4].actualPotential) {
                if (response[4].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[4].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }
                }
              }
            }
          }
          else if (this.taskDetails.title === 'Poster Activity') {
            if (response && response[5]) {
              if (response[5].title) {
                if (response[5].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[5].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[5].description) {
                if (response[5].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[5].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }
                }
              }
              if (response[5].assignee) {
                if (response[5].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[5].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[5].status) {
                if (response[5].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[5].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[5].category) {
                if (response[5].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[5].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[5].type) {
                if (response[5].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[5].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }
                }
              }
              if (response[5].location) {
                if (response[5].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[5].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }
                }
              }
              if (response[5].manager) {
                if (response[5].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[5].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[5].estDuration) {
                if (response[5].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[5].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable()
                    this.taskDetailsForm.controls['taskHrs'].disable()
                    this.taskDetailsForm.controls['taskMin'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[5].priority) {
                if (response[5].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[5].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }
                }
              }
              if (response[5].targetResult) {
                if (response[5].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[5].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[5].targetPotential) {
                if (response[5].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[5].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }
                }
              }
              if (response[5].dueDate) {
                if (response[5].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[5].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }
                }
              }
              if (response[5].locationArea) {
                if (response[5].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[5].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[5].actualPotential) {
                if (response[5].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[5].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }
                }
              }
            }
          }
          else if (this.taskDetails.title === 'Telecalling') {
            if (response && response[6]) {
              if (response[6].title) {
                if (response[6].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[6].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[6].description) {
                if (response[6].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[6].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }
                }
              }
              if (response[6].assignee) {
                if (response[6].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[6].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[6].status) {
                if (response[6].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[6].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[6].category) {
                if (response[6].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[6].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[6].type) {
                if (response[6].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[6].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }
                }
              }
              if (response[6].location) {
                if (response[6].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[6].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }
                }
              }
              if (response[6].manager) {
                if (response[6].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[6].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[6].estDuration) {
                if (response[6].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[6].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable()
                    this.taskDetailsForm.controls['taskHrs'].disable()
                    this.taskDetailsForm.controls['taskMin'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[6].priority) {
                if (response[6].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[6].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }
                }
              }
              if (response[6].targetResult) {
                if (response[6].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[6].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[6].targetPotential) {
                if (response[6].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[6].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }
                }
              }
              if (response[6].dueDate) {
                if (response[6].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[6].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }
                }
              }
              if (response[6].locationArea) {
                if (response[6].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[6].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[6].actualPotential) {
                if (response[6].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[6].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }
                }
              }
            }
          }
          else if (this.taskDetails.title === 'Digital Marketing') {
            if (response && response[7]) {
              if (response[7].title) {
                if (response[7].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[7].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[7].description) {
                if (response[7].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[7].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }
                }
              }
              if (response[7].assignee) {
                if (response[7].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[7].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[7].status) {
                if (response[7].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[7].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }
                }
              }
              if (response[7].category) {
                if (response[7].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[7].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }
                }
              }
              if (response[7].type) {
                if (response[7].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[7].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }

                }
              }
              if (response[7].location) {
                if (response[7].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[7].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }

                }
              }
              if (response[7].manager) {
                if (response[7].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[7].manager.iseditable)) {
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[7].estDuration) {
                if (response[7].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[7].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable()
                    this.taskDetailsForm.controls['taskHrs'].disable()
                    this.taskDetailsForm.controls['taskMin'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[7].priority) {
                if (response[7].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[7].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }

                }
              }
              if (response[7].targetResult) {
                if (response[7].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[7].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }
                }
              }
              if (response[7].targetPotential) {
                if (response[7].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[7].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }

                }
              }
              if (response[7].dueDate) {
                if (response[7].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[7].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }

                }
              }
              if (response[7].locationArea) {
                if (response[7].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[7].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }
                }
              }
              if (response[7].actualPotential) {
                if (response[7].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[7].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails && this.taskDetails.status && this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable();
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }

                }
              }
            }
          }
          else if (this.taskDetails.title === 'Home Visit') {
            if (response && response[8]) {
              if (response[8].title) {
                if (response[8].title.isvisible) {
                  this.bTaskTitle = true;
                } else {
                  this.bTaskTitle = false;
                }
                if (!(response[8].title.iseditable)) {
                  this.taskDetailsForm.controls['taskTitle'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskTitle'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskTitle'].enable()
                  }
                }
              }
              if (response[8].description) {
                if (response[8].description.isvisible) {
                  this.bTaskDescription = true;
                } else {
                  this.bTaskDescription = false;
                }
                if (!(response[8].description.iseditable)) {
                  this.taskDetailsForm.controls['taskDescription'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDescription'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDescription'].enable()
                  }

                }
              }
              if (response[8].assignee) {
                if (response[8].assignee.isvisible) {
                  this.bAssigneeName = true;
                } else {
                  this.bAssigneeName = false;
                }
                if (!(response[8].assignee.iseditable)) {
                  this.bAssigneeName = false;
                }
                else {
                  this.bAssigneeName = true;
                }
              }
              if (response[8].status) {
                if (response[8].status.isvisible) {
                  this.bTaskStatus = true;
                } else {
                  this.bTaskStatus = false;
                }
                if (!(response[8].status.iseditable)) {
                  this.taskDetailsForm.controls['taskStatus'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskStatus'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskStatus'].enable()
                  }

                }
              }
              if (response[8].category) {
                if (response[8].category.isvisible) {
                  this.bTaskCategory = true;
                } else {
                  this.bTaskCategory = false;
                }
                if (!(response[8].category.iseditable)) {
                  this.taskDetailsForm.controls['userTaskCategory'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskCategory'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskCategory'].enable()
                  }

                }
              }
              if (response[8].type) {
                if (response[8].type.isvisible) {
                  this.bTaskType = true;
                } else {
                  this.bTaskType = false;
                }
                if (!(response[8].type.iseditable)) {
                  this.taskDetailsForm.controls['userTaskType'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskType'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskType'].enable()
                  }


                }
              }
              if (response[8].location) {
                if (response[8].location.isvisible) {
                  this.bTaskLocation = true;
                } else {
                  this.bTaskLocation = false;
                }
                if (!(response[8].location.iseditable)) {
                  this.taskDetailsForm.controls['taskLocation'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskLocation'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskLocation'].enable()
                  }

                }
              }
              if (response[8].manager) {
                if (response[8].manager.isvisible) {
                  this.bTaskManager = true;
                } else {
                  this.bTaskManager = false;
                }
                if (!(response[8].manager.iseditable)) {
                  this.bTaskManager = false;
                  this.bTaskManager = false;
                  this.bTaskManager = false;
                }
                else {
                  this.bTaskManager = true;
                }
              }
              if (response[8].estDuration) {
                if (response[8].estDuration.isvisible) {
                  this.bTaskEstDuration = false;
                } else {
                  this.bTaskEstDuration = false;
                }
                if (!(response[8].estDuration.iseditable)) {
                  this.taskDetailsForm.controls['taskDays'].disable()
                  this.taskDetailsForm.controls['taskHrs'].disable()
                  this.taskDetailsForm.controls['taskMin'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDays'].disable()
                    this.taskDetailsForm.controls['taskHrs'].disable()
                    this.taskDetailsForm.controls['taskMin'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDays'].enable()
                    this.taskDetailsForm.controls['taskHrs'].enable()
                    this.taskDetailsForm.controls['taskMin'].enable()
                  }

                }
              }
              if (response[8].priority) {
                if (response[8].priority.isvisible) {
                  this.bTaskPriority = true;
                } else {
                  this.bTaskPriority = false;
                }
                if (!(response[8].priority.iseditable)) {
                  this.taskDetailsForm.controls['userTaskPriority'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['userTaskPriority'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['userTaskPriority'].enable()
                  }

                }
              }
              if (response[8].targetResult) {
                if (response[8].targetResult.isvisible) {
                  this.bTaskTargetPotential = true;
                } else {
                  this.bTaskTargetPotential = false;
                }
                if (!(response[8].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetResult'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetResult'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['targetResult'].enable()
                  }

                }
              }
              if (response[8].targetPotential) {
                if (response[8].targetPotential.isvisible) {
                  this.bTaskBusinessPotential = true;
                } else {
                  this.bTaskBusinessPotential = false;
                }
                if (!(response[8].targetResult.iseditable)) {
                  this.taskDetailsForm.controls['targetPotential'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['targetPotential'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['targetPotential'].enable()
                  }

                }
              }
              if (response[8].dueDate) {
                if (response[8].dueDate.isvisible) {
                  this.bTaskDate = true;
                } else {
                  this.bTaskDate = false;
                }
                if (!(response[8].dueDate.iseditable)) {
                  this.taskDetailsForm.controls['taskDate'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['taskDate'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['taskDate'].enable()
                  }

                }
              }
              if (response[8].locationArea) {
                if (response[8].locationArea.isvisible) {
                  this.bTaskAreaName = true;
                } else {
                  this.bTaskAreaName = true;
                }
                if (!(response[8].locationArea.iseditable)) {
                  this.taskDetailsForm.controls['areaName'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['areaName'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['areaName'].enable()
                  }

                }
              }
              if (response[8].actualPotential) {
                if (response[8].actualPotential.isvisible) {
                  this.bTaskActualPotential = true;
                } else {
                  this.bTaskActualPotential = false;
                }
                if (!(response[8].actualPotential.iseditable)) {
                  this.taskDetailsForm.controls['actualPotential'].disable()
                }
                else {
                  if (this.taskDetails.status.name === 'Completed') {
                    this.taskDetailsForm.controls['actualPotential'].disable()
                  }
                  else {
                    this.taskDetailsForm.controls['actualPotential'].enable()
                  }

                }
              }
            }
          }
          else if ((this.taskDetails.title === 'BA Follow Up') || (this.taskDetails.title === 'BA Recruitment')) {
            if (this.activityType === undefined) {
              if (this.taskDetails.title === 'BA Follow Up') {
                if (response && response[0]) {
                  if (response[0].title) {
                    if (response[0].title.isvisible) {
                      this.bTaskTitle = true;
                    } else {
                      this.bTaskTitle = false;
                    }
                    if (!(response[0].title.iseditable)) {
                      this.taskDetailsForm.controls['taskTitle'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskTitle'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskTitle'].enable()
                      }


                    }
                  }
                  if (response[0].description) {
                    if (response[0].description.isvisible) {
                      this.bTaskDescription = true;
                    } else {
                      this.bTaskDescription = false;
                    }
                    if (!(response[0].description.iseditable)) {
                      this.taskDetailsForm.controls['taskDescription'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDescription'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDescription'].enable()
                      }

                    }
                  }
                  if (response[0].assignee) {
                    if (response[0].assignee.isvisible) {
                      this.bAssigneeName = true;
                    } else {
                      this.bAssigneeName = false;
                    }
                    if (!(response[0].assignee.iseditable)) {
                      this.bAssigneeName = false;
                    }
                    else {
                      this.bAssigneeName = true;
                    }
                  }
                  if (response[0].status) {
                    if (response[0].status.isvisible) {
                      this.bTaskStatus = true;
                    } else {
                      this.bTaskStatus = false;
                    }
                    if (!(response[0].status.iseditable)) {
                      this.taskDetailsForm.controls['taskStatus'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskStatus'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskStatus'].enable()
                      }

                    }
                  }
                  if (response[0].category) {
                    if (response[0].category.isvisible) {
                      this.bTaskCategory = true;
                    } else {
                      this.bTaskCategory = false;
                    }
                    if (!(response[0].category.iseditable)) {
                      this.taskDetailsForm.controls['userTaskCategory'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['userTaskCategory'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['userTaskCategory'].enable()
                      }

                    }
                  }
                  if (response[0].type) {
                    if (response[0].type.isvisible) {
                      this.bTaskType = true;
                    } else {
                      this.bTaskType = false;
                    }
                    if (!(response[0].type.iseditable)) {
                      this.taskDetailsForm.controls['userTaskType'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['userTaskType'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['userTaskType'].enable()
                      }

                    }
                  }
                  if (response[0].location) {
                    if (response[0].location.isvisible) {
                      this.bTaskLocation = true;
                    } else {
                      this.bTaskLocation = false;
                    }
                    if (!(response[0].location.iseditable)) {
                      this.taskDetailsForm.controls['taskLocation'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskLocation'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskLocation'].enable()
                      }

                    }
                  }
                  if (response[0].manager) {
                    if (response[0].manager.isvisible) {
                      this.bTaskManager = true;
                    } else {
                      this.bTaskManager = false;
                    }
                    if (!(response[0].manager.iseditable)) {
                      this.bTaskManager = false;
                      this.bTaskManager = false;
                      this.bTaskManager = false;
                    }
                    else {
                      this.bTaskManager = true;
                    }
                  }
                  if (response[0].estDuration) {
                    if (response[0].estDuration.isvisible) {
                      this.bTaskEstDuration = false;
                    } else {
                      this.bTaskEstDuration = false;
                    }
                    if (!(response[0].estDuration.iseditable)) {
                      this.taskDetailsForm.controls['taskDays'].disable()
                      this.taskDetailsForm.controls['taskHrs'].disable()
                      this.taskDetailsForm.controls['taskMin'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDays'].disable()
                        this.taskDetailsForm.controls['taskHrs'].disable()
                        this.taskDetailsForm.controls['taskMin'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDays'].enable()
                        this.taskDetailsForm.controls['taskHrs'].enable()
                        this.taskDetailsForm.controls['taskMin'].enable()
                      }

                    }
                  }
                  if (response[0].priority) {
                    if (response[0].priority.isvisible) {
                      this.bTaskPriority = true;
                    } else {
                      this.bTaskPriority = false;
                    }
                    if (!(response[0].priority.iseditable)) {
                      this.taskDetailsForm.controls['userTaskPriority'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['userTaskPriority'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['userTaskPriority'].enable()
                      }

                    }
                  }
                  if (response[0].targetResult) {
                    if (response[0].targetResult.isvisible) {
                      this.bTaskTargetPotential = true;
                    } else {
                      this.bTaskTargetPotential = false;
                    }
                    if (!(response[0].targetResult.iseditable)) {
                      this.taskDetailsForm.controls['targetResult'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['targetResult'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['targetResult'].enable()
                      }

                    }
                  }
                  if (response[0].targetPotential) {
                    if (response[0].targetPotential.isvisible) {
                      this.bTaskBusinessPotential = true;
                    } else {
                      this.bTaskBusinessPotential = false;
                    }
                    if (!(response[0].targetResult.iseditable)) {
                      this.taskDetailsForm.controls['targetPotential'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['targetPotential'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['targetPotential'].enable()
                      }

                    }
                  }
                  if (response[0].dueDate) {
                    if (response[0].dueDate.isvisible) {
                      this.bTaskDate = true;
                    } else {
                      this.bTaskDate = false;
                    }
                    if (!(response[0].dueDate.iseditable)) {
                      this.taskDetailsForm.controls['taskDate'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDate'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDate'].enable()
                      }

                    }
                  }
                  if (response[0].locationArea) {
                    if (response[0].locationArea.isvisible) {
                      this.bTaskAreaName = true;
                    } else {
                      this.bTaskAreaName = true;
                    }
                    if (!(response[0].locationArea.iseditable)) {
                      this.taskDetailsForm.controls['areaName'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['areaName'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['areaName'].enable()
                      }

                    }
                  }
                  if (response[0].actualPotential) {
                    if (response[0].actualPotential.isvisible) {
                      this.bTaskActualPotential = true;
                    } else {
                      this.bTaskActualPotential = false;
                    }
                    if (!(response[0].actualPotential.iseditable)) {
                      this.taskDetailsForm.controls['actualPotential'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['actualPotential'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['actualPotential'].enable()
                      }

                    }
                  }
                }
              }
              else if (this.taskDetails.title === 'BA Recruitment') {
                if (response && response[1]) {
                  if (response[1].title) {
                    if (response[1].title.isvisible) {
                      this.bTaskTitle = true;
                    } else {
                      this.bTaskTitle = false;
                    }
                    if (!(response[1].title.iseditable)) {
                      this.taskDetailsForm.controls['taskTitle'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskTitle'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskTitle'].enable()
                      }

                    }
                  }
                  if (response[1].description) {
                    if (response[1].description.isvisible) {
                      this.bTaskDescription = true;
                    } else {
                      this.bTaskDescription = false;
                    }
                    if (!(response[1].description.iseditable)) {
                      this.taskDetailsForm.controls['taskDescription'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDescription'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDescription'].enable()
                      }

                    }
                  }
                  if (response[1].assignee) {
                    if (response[1].assignee.isvisible) {
                      this.bAssigneeName = true;
                    } else {
                      this.bAssigneeName = false;
                    }
                    if (!(response[1].assignee.iseditable)) {
                      this.bAssigneeName = false;
                    }
                    else {
                      this.bAssigneeName = true;
                    }
                  }
                  if (response[1].status) {
                    if (response[1].status.isvisible) {
                      this.bTaskStatus = true;
                    } else {
                      this.bTaskStatus = false;
                    }
                    if (!(response[1].status.iseditable)) {
                      this.taskDetailsForm.controls['taskStatus'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskStatus'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskStatus'].enable()
                      }

                    }
                  }
                  if (response[1].category) {
                    if (response[1].category.isvisible) {
                      this.bTaskCategory = true;
                    } else {
                      this.bTaskCategory = false;
                    }
                    if (!(response[1].category.iseditable)) {
                      this.taskDetailsForm.controls['userTaskCategory'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['userTaskCategory'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['userTaskCategory'].enable()
                      }

                    }
                  }
                  if (response[1].type) {
                    if (response[1].type.isvisible) {
                      this.bTaskType = true;
                    } else {
                      this.bTaskType = false;
                    }
                    if (!(response[1].type.iseditable)) {
                      this.taskDetailsForm.controls['userTaskType'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['userTaskType'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['userTaskType'].enable()
                      }

                    }
                  }
                  if (response[1].location) {
                    if (response[1].location.isvisible) {
                      this.bTaskLocation = true;
                    } else {
                      this.bTaskLocation = false;
                    }
                    if (!(response[1].location.iseditable)) {
                      this.taskDetailsForm.controls['taskLocation'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskLocation'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskLocation'].enable()
                      }
                    }
                  }
                  if (response[1].manager) {
                    if (response[1].manager.isvisible) {
                      this.bTaskManager = true;
                    } else {
                      this.bTaskManager = false;
                    }
                    if (!(response[1].manager.iseditable)) {
                      this.bTaskManager = false;
                    }
                    else {
                      this.bTaskManager = true;
                    }
                  }
                  if (response[1].estDuration) {
                    if (response[1].estDuration.isvisible) {
                      this.bTaskEstDuration = false;
                    } else {
                      this.bTaskEstDuration = false;
                    }
                    if (!(response[1].estDuration.iseditable)) {
                      this.taskDetailsForm.controls['taskDays'].disable()
                      this.taskDetailsForm.controls['taskHrs'].disable()
                      this.taskDetailsForm.controls['taskMin'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDays'].disable()
                        this.taskDetailsForm.controls['taskHrs'].disable()
                        this.taskDetailsForm.controls['taskMin'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDays'].enable()
                        this.taskDetailsForm.controls['taskHrs'].enable()
                        this.taskDetailsForm.controls['taskMin'].enable()
                      }

                    }
                  }
                  if (response[1].priority) {
                    if (response[1].priority.isvisible) {
                      this.bTaskPriority = true;
                    } else {
                      this.bTaskPriority = false;
                    }
                    if (!(response[1].priority.iseditable)) {
                      this.taskDetailsForm.controls['userTaskPriority'].disable()
                    }
                    else {
                      this.taskDetailsForm.controls['userTaskPriority'].enable()
                    }
                  }
                  if (response[1].targetResult) {
                    if (response[1].targetResult.isvisible) {
                      this.bTaskTargetPotential = true;
                    } else {
                      this.bTaskTargetPotential = false;
                    }
                    if (!(response[1].targetResult.iseditable)) {
                      this.taskDetailsForm.controls['targetResult'].disable()
                    }
                    else {
                      this.taskDetailsForm.controls['targetResult'].enable()
                    }
                  }
                  if (response[1].targetPotential) {
                    if (response[1].targetPotential.isvisible) {
                      this.bTaskBusinessPotential = true;
                    } else {
                      this.bTaskBusinessPotential = false;
                    }
                    if (!(response[1].targetResult.iseditable)) {
                      this.taskDetailsForm.controls['targetPotential'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['targetPotential'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['targetPotential'].enable()
                      }

                    }
                  }
                  if (response[1].dueDate) {
                    if (response[1].dueDate.isvisible) {
                      this.bTaskDate = true;
                    } else {
                      this.bTaskDate = false;
                    }
                    if (!(response[1].dueDate.iseditable)) {
                      this.taskDetailsForm.controls['taskDate'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['taskDate'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['taskDate'].enable()
                      }

                    }
                  }
                  if (response[1].locationArea) {
                    if (response[1].locationArea.isvisible) {
                      this.bTaskAreaName = true;
                    } else {
                      this.bTaskAreaName = true;
                    }
                    if (!(response[1].locationArea.iseditable)) {
                      this.taskDetailsForm.controls['areaName'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['areaName'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['areaName'].enable()
                      }

                    }
                  }
                  if (response[1].actualPotential) {
                    if (response[1].actualPotential.isvisible) {
                      this.bTaskActualPotential = true;
                    } else {
                      this.bTaskActualPotential = false;
                    }
                    if (!(response[1].actualPotential.iseditable)) {
                      this.taskDetailsForm.controls['actualPotential'].disable()
                    }
                    else {
                      if (this.taskDetails.status.name === 'Completed') {
                        this.taskDetailsForm.controls['actualPotential'].disable()
                      }
                      else {
                        this.taskDetailsForm.controls['actualPotential'].enable()
                      }

                    }
                  }
                }
              }

            }
          }
          else {
            if (this.taskDetails.status.name === 'Completed') {
              this.disableFormControl();

            }
            else {
              this.enableFormControl();
            }
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
            this.bTaskActualPotential = true;
            this.bTaskTitle = true;
            this.bTaskDescription = true;
            this.bTaskDate = true;
            this.bAssigneeName = true;
            this.bTaskAreaName = true;
          }
        }
        else if (this.activityType === 'UpdateFollowUP') {

          // if(this.taskDetails.status.name==='Completed'){
          //   this.taskDetailsForm.controls['areaName'].disable()
          // this.taskDetailsForm.controls['selectMember'].disable()
          // }
          // else{
          //   this.taskDetailsForm.controls['areaName'].enable()
          // this.taskDetailsForm.controls['selectMember'].enable()
          // }

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
          this.bTaskActualPotential = false;
        }
      })
    })
  }
  disableFormControl() {
    this.taskDetailsForm.controls['taskTitle'].disable()
    this.taskDetailsForm.controls['taskDescription'].disable()
    this.taskDetailsForm.controls['areaName'].disable()
    this.taskDetailsForm.controls['taskDate'].disable()
    this.taskDetailsForm.controls['userTaskCategory'].disable()
    this.taskDetailsForm.controls['userTaskType'].disable()
    this.taskDetailsForm.controls['taskLocation'].disable()
    this.taskDetailsForm.controls['selectTaskManger'].disable()
    this.taskDetailsForm.controls['taskDays'].disable()
    this.taskDetailsForm.controls['taskHrs'].disable()
    this.taskDetailsForm.controls['taskMin'].disable()
    this.taskDetailsForm.controls['userTaskPriority'].disable()
    this.taskDetailsForm.controls['taskStatus'].disable()
    this.taskDetailsForm.controls['targetResult'].disable()
    this.taskDetailsForm.controls['targetPotential'].disable()
    this.taskDetailsForm.controls['selectMember'].disable()
    this.taskDetailsForm.controls['actualPotential'].disable()
    //  this.taskDetailsForm.controls['taskTitle'].disable()
  }
  enableFormControl() {
    this.taskDetailsForm.controls['taskTitle'].enable()
    this.taskDetailsForm.controls['taskDescription'].enable()
    this.taskDetailsForm.controls['areaName'].enable()
    this.taskDetailsForm.controls['taskDate'].enable()
    this.taskDetailsForm.controls['userTaskCategory'].enable()
    this.taskDetailsForm.controls['userTaskType'].enable()
    this.taskDetailsForm.controls['taskLocation'].enable()
    this.taskDetailsForm.controls['selectTaskManger'].enable()
    this.taskDetailsForm.controls['taskDays'].enable()
    this.taskDetailsForm.controls['taskHrs'].enable()
    this.taskDetailsForm.controls['taskMin'].enable()
    this.taskDetailsForm.controls['userTaskPriority'].enable()
    this.taskDetailsForm.controls['taskStatus'].enable()
    this.taskDetailsForm.controls['targetResult'].enable()
    this.taskDetailsForm.controls['targetPotential'].enable()
    this.taskDetailsForm.controls['selectMember'].enable()
    this.taskDetailsForm.controls['actualPotential'].enable()
  }
  resetErrors() {
    this.taskError = null;
  }
  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15) + "px";
  }
  getLocation() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getProviderLocations().subscribe((res) => {
        resolve(res)
        if (res && res[0] && res[0].place) {
          _this.taskDetailsForm.controls.taskLocation.setValue(res[0].place);
        }
        if (res && res[0] && res[0].id) {
          _this.updteLocationId = res[0].id;
        }
      },
        (error) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    })

  }
  getAssignMemberList() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getMemberList().subscribe((memberList: any) => {
        resolve(memberList);
        _this.allMemberList.push(memberList)
      },
        (error: any) => {
          reject(error)
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
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
        if (res) {
          this.updateAssignMemberDetailsToDialog = res;
          if (res.firstName || res.lastName) {
            this.selectMember = (res.firstName + ' ' + res.lastName);
          }
          if (res.userType) {
            this.userType = res.userType;
          }
          if (res.bussLocations && res.bussLocations[0]) {
            this.locationId = res.bussLocations[0];
            this.updteLocationId = this.locationId;
          }
          if (res.id) {
            this.assigneeId = res.id;
            this.updateMemberId = this.assigneeId;
          }
        }
      }
    })
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  getCategoryListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getCategoryList().subscribe((categoryList: any) => {
        resolve(categoryList);
        _this.categoryListData.push(categoryList)
      },
        (error: any) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        }
      )
    })
  }
  getTaskTypeListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskType().subscribe((taskTypeList: any) => {
        resolve(this.taskTypeList);
        _this.taskTypeList.push(taskTypeList)
      },
        (error: any) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
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
      if (res === '') {
        if (this.taskDetails && this.taskDetails.manager && this.taskDetails.manager.name) {
          this.selectTaskManger = this.taskDetails.manager.name;
        }
      }
      else {
        if (res) {
          this.updateSelectTaskMangerDetailsToDialog = res;
          if (res.firstName || res.lastName) {
            this.selectTaskManger = (res.firstName + res.lastName);
          }
          if (res.id) {
            this.selectTaskMangerId = res.id;
            this.updateManagerId = this.selectTaskMangerId;
          }
        }

      }
    })
  }
  handleTaskEstDuration(estDuration: any) {
    let estDurationDay: any;
    let estDurationHour: any;
    let estDurationMinute: any;
    if (this.taskDetailsForm && this.taskDetailsForm.controls && this.taskDetailsForm.controls.taskDays &&
      this.taskDetailsForm.controls.taskDays.value) {
      estDurationDay = this.taskDetailsForm.controls.taskDays.value;
    }
    if (this.taskDetailsForm && this.taskDetailsForm.controls && this.taskDetailsForm.controls.taskHrs &&
      this.taskDetailsForm.controls.taskHrs.value) {
      estDurationHour = this.taskDetailsForm.controls.taskHrs.value;
    }
    if (this.taskDetailsForm && this.taskDetailsForm.controls && this.taskDetailsForm.controls.taskMin &&
      this.taskDetailsForm.controls.taskMin.value) {
      estDurationMinute = this.taskDetailsForm.controls.taskMin.value;
    }
    if (estDurationDay && estDurationHour && estDurationMinute) {
      this.estTime = { "days": estDurationDay, "hours": estDurationHour, "minutes": estDurationMinute };
    }
  }
  getTaskPriorityListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskPriority().subscribe((taskPriority: any) => {
        resolve(taskPriority);
        _this.taskPriorityList.push(taskPriority);
      },
        (error) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        }
      )
    })

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
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskStatus().subscribe((taskStatus: any) => {
        resolve(taskStatus);
        _this.taskStatusList.push(taskStatus)
      },
        (error) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
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
        "actualResult": this.actualResult,
        "actualPotential": this.taskDetailsForm.controls.actualPotential.value,
      }
      const createNoteData: any = {
        "note": this.notesTextarea
      }
      if (this.updateUserType === ('PROVIDER' || 'CONSUMER') && this.taskDetails && updateTaskData) {
        this.crmService.updateTask(this.taskDetails.taskUid, updateTaskData).subscribe((response) => {
          if (response) {
            this.api_loadingSaveTask = true;
            this.hideBackBtn = false;
            if (response) {
              this.updateResponse = response;
              if (this.updateResponse = true) {
                this.crmService.activityCloseWithNotes(this.taskDetails.taskUid, createNoteData).subscribe((res) => {
                  if (res) {
                    setTimeout(() => {
                      this.api_loadingSaveTask = true;
                      this.hideBackBtn = false;
                      this.snackbarService.openSnackBar('Successfully updated activity');
                      this.router.navigate(['provider', 'task']);
                    }, projectConstants.TIMEOUT_DELAY);
                  }
                },
                  (error) => {
                    setTimeout(() => {
                      this.api_loadingSaveTask = false;
                      this.hideBackBtn = true;
                      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }, projectConstants.TIMEOUT_DELAY);
                  })
              }
            }
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
        if (this.enquiryUid && createNoteData) {
          this.crmService.enquiryNotes(this.enquiryUid, createNoteData).subscribe((response: any) => {
            if (response) {
              this.api_loading = true;
              this.notesTextarea = '';
              setTimeout(() => {
                this.getEnquiryDetailsRefresh()
                this.api_loading = false;
              }, projectConstants.TIMEOUT_DELAY);
              this.snackbarService.openSnackBar('Remarks added successfully');
            }
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            })
        }

      }
      else {
        if (this.taskDetails && this.taskDetails.taskUid && createNoteData) {
          this.crmService.addNotes(this.taskDetails.taskUid, createNoteData).subscribe((response: any) => {
            if (response) {
              this.api_loading = true;
              this.notesTextarea = '';
              setTimeout(() => {
                this.getTaskDetailsRefresh()
                this.api_loading = false;
              }, projectConstants.TIMEOUT_DELAY);
              this.snackbarService.openSnackBar('Remarks added successfully');
            }
          },
            (error) => {
              if (error) {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
              }
            })
        }
      }

    }
    else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = 'Please enter some description'
    }
  }
  selectStatus(status: any) {
    if (status && (status.name === 'Pending')) {
      document.getElementById('A').style.boxShadow = "none";
      document.getElementById('C').style.boxShadow = "none";
      this.crmService.statusToPendingFollowUp(this.enquiryId).subscribe((response) => {
        if (response) {
          setTimeout(() => {
            this.taskDetailsForm.reset();
            if (status && status.name) {
              this.snackbarService.openSnackBar('Successfully updated to ' + status.name.toLowerCase() + ' mode');
            }
            this.router.navigate(['provider', 'crm']);
          }, projectConstants.TIMEOUT_DELAY);
        }
      },
        (error) => {
          setTimeout(() => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }, projectConstants.TIMEOUT_DELAY);
        })
    }
    else if (status && (status.name === 'Rejected')) {
      if (this.enquiryId) {
        this.api_loadingCancelledStatus = true;
        this.hideBackBtn = false;
        document.getElementById('A').style.boxShadow = "none";
        document.getElementById('C').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
        this.crmService.statusToRejectedFollowUP(this.enquiryId).subscribe((response) => {
          if (response) {
            setTimeout(() => {
              this.taskDetailsForm.reset();
              if (status && status.name) {
                this.snackbarService.openSnackBar('The enquiry is rejected');
              }
              this.api_loadingCancelledStatus = false;
              this.hideBackBtn = true
              this.router.navigate(['provider', 'crm']);
            }, projectConstants.TIMEOUT_DELAY);
          }

        },
          (error) => {
            setTimeout(() => {
              this.hideBackBtn = true
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }, projectConstants.TIMEOUT_DELAY);
          })
      }

    }
    else if (status && (status.name === 'Proceed')) {
      if (this.enquiryId) {
        this.api_loadingCompletedStatus = true;
        this.hideBackBtn = false;
        document.getElementById('A').style.boxShadow = "0px 4px 11px rgb(0 0 0 / 15%)";
        document.getElementById('C').style.boxShadow = "none";
        if (this.taskDetails.status.name !== 'Proceed') {
          this.crmService.statusToProceed(this.enquiryId).subscribe((response) => {
            if (response) {
              setTimeout(() => {
                this.taskDetailsForm.reset();
                this.snackbarService.openSnackBar('Successfully updated');
                this.api_loadingCompletedStatus = false;
                this.hideBackBtn = true;
                this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            }
          },
            (error) => {
              setTimeout(() => {
                this.hideBackBtn = true;
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }, projectConstants.TIMEOUT_DELAY);
            })
        }
        else {
          this.crmService.statusToProceedFollowUp2(this.enquiryId).subscribe((response) => {
            if (response) {
              setTimeout(() => {
                this.taskDetailsForm.reset();
                this.snackbarService.openSnackBar('Successfully updated');
                this.api_loadingCompletedStatus = false;
                this.router.navigate(['provider', 'crm']);
              }, projectConstants.TIMEOUT_DELAY);
            }
          },
            (error) => {
              setTimeout(() => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }, projectConstants.TIMEOUT_DELAY);
            })
        }
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
          if (this.activityType && (this.activityType === 'UpdateFollowUP')) {
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
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskDetails(_this.taskUid).subscribe(data => {
        resolve(data);
        if (data) {
          _this.taskDetails = data;
          if (_this.taskDetails && _this.taskDetails.id) {
            _this.taskkid = _this.taskDetails.id;
            _this.taskDetails.notes.forEach((notesdata: any) => {
              _this.notesList.push(notesdata);
            });
          }
        }

      },
        ((error) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarnormal' });
        }));
    })
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
      if (response) {
        if (response === 'Cancel') {
          setTimeout(() => {
            this.api_loading = false;
            if (this.activityType && (this.activityType === 'UpdateFollowUP')) {
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
            if (this.activityType && (this.activityType === 'UpdateFollowUP')) {
              this.getEnquiryDetailsRefresh()
            }
            else {
              this.getTaskDetailsRefresh()
            }
          }, projectConstants.TIMEOUT_DELAY);
        }
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
      if (response) {
        this.getTaskDetails();
      }
    });
  }
  getDate() {
    this.taskDetails.notes.forEach(
      (date: any) => {
        if (date) {
          let dateHour: any;
          let dateHr1: any;
          let dateHr12: any;
          let dateHr2: any;
          let dateMonth: any;
          let meridianAm: string = 'am';
          let meridianPm: string = 'pm';
          if (date.createdDate) {
            dateHour = date.createdDate.slice(11, 13);
          }
          if (date.createdDate) {
            dateMonth = date.createdDate.slice(3, 5);
          }
          if (dateHour || dateMonth) {
            if (dateHour && (dateHour < 12)) {
              dateHr1 = dateHour;
              if (dateHr1 && dateMonth && meridianAm) {
                this.totalTimeDisplay = dateHr1 + ':' + dateMonth + ' ' + meridianAm;
              }
            }
            else if (dateHour && (dateHour === 12)) {
              dateHr12 = dateHour;
              if (dateHr12 && dateMonth && meridianPm) {
                this.totalTimeDisplay = dateHr12 + ':' + dateMonth + ' ' + meridianPm;
              }
            }
            else {
              if (dateHour) {
                dateHr2 = dateHour - 12;
                if (dateHr2 && dateMonth && meridianPm) {
                  this.totalTimeDisplay = dateHr2 + ':' + dateMonth + ' ' + meridianPm;
                }
              }

            }
          }

        }

      }
    )

  }
}
