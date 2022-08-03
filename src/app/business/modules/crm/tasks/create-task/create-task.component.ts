import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Location, DatePipe } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { CrmSelectMemberComponent } from '../../../../shared/crm-select-member/crm-select-member.component'
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
  public ddate: any;
  public api_loading: any = true;
  public createTaskForm: any;
  public taskError: null;
  public selectMember: any;
  public categoryListData: any = [];
  public allMemberList: any = [];
  public taskTypeList: any = [];
  public taskStatusList: any = [];
  public taskPriorityList: any = [];
  public userType: any;
  public locationName: any;
  public areaName: any;
  public locationId: any;
  public taskDueDate: any;
  public taskDueTime: any;
  public taskDueDays: any;
  public selectedDate: any;
  public boolenTaskError: boolean = false;
  public assigneeId: any;
  public selectTaskManger: any;
  public selectTaskMangerId: any;
  public createBTimeField: boolean = false;
  public updateBTimefield: boolean = false;
  public dayGapBtwDate: any;
  public hour: any;
  public minute: any;
  //update variable;
  public updateValue: any;
  public task: any;
  public selectHeader: any;
  public updateUserType: any;
  public updateMemberId: any;
  public updateManagerId: any;
  public updteLocationId: any;
  taskUid: any;
  taskDetails: any;
  public updateAssignMemberDetailsToDialog: any;
  public updateSelectTaskMangerDetailsToDialog: any;
  taskStatusModal: any;
  taskPriority: any;
  public estDurationWithDay: any;
  public estTime: any;
  taskMasterData: any;
  public errorMsgAny: string = '';
  public bErrormsg: boolean = false;
  public bErrormsgCategory: boolean = false;
  public errorMsgAnyCategory: string = ''
  public bErrormsgType: boolean = false;
  public errorMsgAnyType: string = ''
  public activityTitle: any;
  public activityDescription: any;
  public type: any;
  public subActivityTaskUid: any;
  public rupee_symbol = '₹';
  api_loading_CreateActivity: boolean;
  src: any;
  taskmasterId: any;
  //input field header name 
  activityTitleField: string = 'Title';
  activityDescriptionField: string = 'Description';
  categoryLabelname: string = 'Category';
  labelType: string = 'Type';
  labelLocation: string = 'Location';
  labelArea: string = 'Area';
  labelActivityManager: string = 'Select activity employee and manager';
  labelEmployee: string = 'Employee';
  labelManager: string = 'Manager';
  labelDateAndOther: string = 'Activity date and other info';
  labelDueDate: string = 'Due Date';
  labelEstDuration: string = 'DUe Date';
  labelEstDays: string = 'Days';
  labelEstHours: string = 'Hours';
  labelMinutes: string = 'Minutes';
  labelPriority: string = 'Priority';
  labelStatus: string = 'Status';
  labelTargetPotential: string = 'Target Potential';
  labelBusinessPotential: string = 'Business Potential';
  labelResult: string = 'Result';
  cancelBtn: string = 'Cancel';
  saveBtn: string = 'Save';
  labelActivitydateOther: string = 'Activity date Other info'
  constructor(private locationobj: Location,
    private router: Router,
    private activated_route: ActivatedRoute,
    private crmService: CrmService,
    public fed_service: FormMessageDisplayService,
    private createTaskFB: FormBuilder,
    private dialog: MatDialog, private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    // private _Activatedroute: ActivatedRoute,
    private groupService: GroupStorageService
  ) { }
  ngOnInit(): void {
    this.createTaskForm = this.createTaskFB.group({
      taskTitle: [null],
      taskDescription: [null],
      userTaskCategory: [null],
      userTaskType: [null],
      taskLocation: [null],
      areaName: [null],
      taskStatus: [null],
      taskDate: [null],
      taskDays: [null],
      taskHrs: [null],
      taskMin: [null],
      selectMember: [null],
      selectTaskManger: [null],
      userTaskPriority: [null],
      targetResult: [null],
      targetPotential: [null],
      // actualPotential: [null],
    })
    this.activated_route.queryParams.subscribe(qparams => {
      this.updateValue = qparams;
      if (qparams.type) {
        this.type = qparams.type;
      }
      if (qparams.src) {
        this.src = qparams.src;
      }
    });
    this.userInfo()
    // this._Activatedroute.paramMap.subscribe(params => {
    //   this.taskUid = params.get('taskid');
    //   if (this.taskUid) {
    //     this.crmService.taskActivityName = "subTaskCreate";
    //   }
    // });
    this.api_loading = false;
    if (this.crmService && this.crmService.taskActivityName === 'CreatE') {
      this.creatEOthersActivity();
    }
    else if (this.crmService && this.crmService.taskActivityName == 'Create') {
      this.createActivity();
    }
    this.getAssignMemberList()
    this.getCategoryListData()
    this.getTaskTypeListData()
    this.getTaskStatusListData()
    this.getTaskPriorityListData()
    this.getLocation()
  }
  creatEOthersActivity() {
    this.createBTimeField = true;
    this.updateBTimefield = false;
    this.selectHeader = 'Create activity';
    if (this.datePipe) {
      this.taskDueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      if (this.taskDueDate) {
        this.selectedDate = this.taskDueDate;
        this.createTaskForm.controls.taskDays.value = 0,
          this.createTaskForm.controls.taskHrs.value = 0
        this.createTaskForm.controls.taskMin.value = 0
        this.estTime = {
          "days": this.createTaskForm.controls.taskDays.value,
          "hours": this.createTaskForm.controls.taskHrs.value,
          "minutes": this.createTaskForm.controls.taskMin.value
        };
        this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
      }
    }
    this.activityTitle = 'Enter activity title';
    this.activityDescription = 'Enter activity description'

  }
  createActivity() {
    this.createBTimeField = true;
    this.updateBTimefield = false;
    this.activityTitle = 'Enter activity title';
    this.activityDescription = 'Enter activity description'
    this.selectHeader = 'Create activity';
    if (this.datePipe) {
      this.taskDueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if (this.taskDueDate) {
        this.createTaskForm.controls.taskDate.setValue(this.taskDueDate);
      }
    }
    if (this.crmService && this.crmService.taskMasterToCreateServiceData) {
      const taskMaster = this.crmService.taskMasterToCreateServiceData;
      this.taskMasterData = this.crmService.taskMasterToCreateServiceData;
      // console.log(' this.taskMasterData ', this.taskMasterData);
      if (taskMaster || this.taskMasterData) {
        if (this.taskMasterData.id) {
          this.taskmasterId = this.taskMasterData.id;
        }
        if (taskMaster.title && taskMaster.title.value) {
          this.createTaskForm.controls.taskTitle.value = taskMaster.title.value;
        }
        if (taskMaster.description && taskMaster.description.value) {
          this.createTaskForm.controls.taskDescription.value = taskMaster.description.value;
        }
        if (taskMaster.category && taskMaster.category.value && taskMaster.category.value.id) {
          this.createTaskForm.controls.userTaskCategory.value = taskMaster.category.value.id;
        }
        if (taskMaster.type && taskMaster.type.value && taskMaster.type.value.id) {
          this.createTaskForm.controls.userTaskType.value = taskMaster.type.value.id;
        }
        if (taskMaster.priority && taskMaster.priority.value && taskMaster.priority.value.id) {
          this.createTaskForm.controls.userTaskPriority.value = taskMaster.priority.value.id;
        }
        if ((taskMaster.estDuration && taskMaster.estDuration.value && taskMaster.estDuration.value.days) ||
          (taskMaster.estDuration && taskMaster.estDuration.value && taskMaster.estDuration.value.hours) ||
          (taskMaster.estDuration && taskMaster.estDuration.value && taskMaster.estDuration.value.minutes)) {
          this.createTaskForm.controls.taskDays.value = taskMaster.estDuration.value.days;
          this.createTaskForm.controls.taskHrs.value = taskMaster.estDuration.value.hours,
            this.createTaskForm.controls.taskMin.value = taskMaster.estDuration.value.minutes,
            this.estTime = { "days": taskMaster.estDuration.value.days, "hours": taskMaster.estDuration.value.hours, "minutes": taskMaster.estDuration.value.minutes };
        }
      }
      else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            type: 'activityCreateTemplate'
          }
        }
        this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
      }

    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'activityCreateTemplate'
        }
      }
      this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
    }


  }
  userInfo() {
    if (this.groupService && this.groupService.getitemFromGroupStorage('ynw-user')) {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      if (user) {
        if (user.firstName || user.lastName) {
          this.selectMember = user.firstName + user.lastName;
          this.selectTaskManger = user.firstName + user.lastName;
        }
        if (user.id) {
          this.assigneeId = user.id;
          this.selectTaskMangerId = user.id;
        }
        if (user.bussLocs && user.bussLocs[0]) {
          this.locationId = user.bussLocs[0]
        }
        if (user.userType === 1) {
          this.userType = 'PROVIDER'
        }
      }
    }
  }
  getLocation() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getProviderLocations().subscribe((res) => {
        resolve(res);
        if (res && res[0]) {
          if (res[0].place) {
            _this.createTaskForm.controls.taskLocation.setValue(res[0].place);
          }
          if (res[0].id) {
            _this.updteLocationId = res[0].id;
          }
        }
      })
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
  getAssignMemberList() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getMemberList().subscribe((memberList: any) => {
        resolve(memberList);
        _this.allMemberList.push(memberList)
      },
        (error: any) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
    })

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
        resolve(taskTypeList);
        _this.taskTypeList.push(taskTypeList)
      },
        (error: any) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    })

  }
  getTaskStatusListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskStatus().subscribe((taskStatus: any) => {
        resolve(taskStatus);
        _this.taskStatusList.push(taskStatus);
        if (_this.crmService && (_this.crmService.taskActivityName === 'Create' || _this.crmService.taskActivityName === 'CreatE')) {
          if (_this.taskStatusList && _this.taskStatusList[0] && _this.taskStatusList[0][0].id) {

          }
          _this.createTaskForm.controls.taskStatus.setValue(_this.taskStatusList[0][0].id);
        }
        else {
          _this.createTaskForm.controls.taskStatus.setValue(_this.updateValue.status.id);
        }
      },
        (error) => {
          reject(error);
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    })

  }
  getTaskPriorityListData() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTaskPriority().subscribe((taskPriority: any) => {
        _this.taskPriorityList.push(taskPriority);
        if (_this.crmService && (_this.crmService.taskActivityName === 'Create' || _this.crmService.taskActivityName === 'CreatE')) {
          if (_this.taskPriorityList && _this.taskPriorityList[0] && _this.taskPriorityList[0][0].id) {
            _this.createTaskForm.controls.userTaskPriority.setValue(_this.taskPriorityList[0][0].id);
          }
        }
        else {
          _this.createTaskForm.controls.userTaskPriority.setValue(_this.updateValue.priority.id);
        }
      },
        (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        }
      )
    })

  }
  goback() {
    this.locationobj.back();
  }
  resetErrors() {
    this.taskError = null;
  }
  autoGrowTextZone(e) {
    if (e) {
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }

  }
  hamdleTaskTitle(taskTitleValue) {
    this.taskError = null
    this.boolenTaskError = false
    if (taskTitleValue != '') {
      this.bErrormsg = false;
      this.errorMsgAny = ''
    } else {
      this.bErrormsg = true;
      this.errorMsgAny = 'Please enter title'
    }
  }

  handleTaskDescription(textareaValue) {
    this.taskError = null
    this.boolenTaskError = false
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
        if (this.updateValue && this.updateValue.manager && this.updateValue.manager.name) {
          this.selectTaskManger = this.updateValue.manager.name;
        }
      }
      else {
        if (res) {
          this.updateSelectTaskMangerDetailsToDialog = res;
          if (res.firstName || res.lastName) {
            this.selectTaskManger = (res.firstName + ' ' + res.lastName);
          }
          if (res.id) {
            this.selectTaskMangerId = res.id;
            this.updateManagerId = this.selectTaskMangerId
          }
        }
      }
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
      console.log('res',res)
      if (res === '') {
        if (this.updateValue && this.updateValue.assignee && this.updateValue.assignee.name) {
          this.selectMember = this.updateValue.assignee.name;
        }
      } else {
        if (res) {
          this.updateAssignMemberDetailsToDialog = res;
          if (res.firstName || res.lastName) {
            this.selectMember = (res.firstName + ' ' + res.lastName);
          }
          if (res.userType) {
            this.userType = res.userType;
          }
          if (res.place) {
            this.createTaskForm.controls.taskLocation.setValue(res.place);
          }
          if (res.id) {
            this.assigneeId = res.id;
            if (this.assigneeId) {
              this.updateMemberId = this.assigneeId;
            }
          }
          if (res.bussLocations && res.bussLocations[0]) {
            this.locationId = res.bussLocations[0];
            // console.log(' this.locationId', this.locationId);
            if (this.locationId) {
              this.updteLocationId = this.locationId;
            }
          }
        }
      }
    })
  }
  handleTaskCategorySelection(taskCategory) {
    if (taskCategory != undefined) {
      this.bErrormsgCategory = false
      this.errorMsgAnyCategory = ''
    }
  }
  handleTaskTypeSelection(taskType: any) {
    if (taskType != undefined) {
      this.bErrormsgType = false
      this.errorMsgAnyType = '';
    }
  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e) {
    if (this.datePipe) {
      const date1 = this.datePipe.transform(this.taskDueDate, 'yyyy-MM-dd');
      const date2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if (date1) {
        this.selectedDate = date1;
      }
      if (date1 && date2 && (date1 > date2)) {
        const diffBtwDate = Date.parse(date1) - Date.parse(date2);
        if (diffBtwDate) {
          const diffIndays = diffBtwDate / (1000 * 3600 * 24);
          if (diffIndays) {
            this.dayGapBtwDate = diffIndays
          }
        }
      }
      else {
        if (date2 && date1) {
          const diffBtwDate = Date.parse(date2) - Date.parse(date1);
          if (diffBtwDate) {
            const diffIndays = diffBtwDate / (1000 * 3600 * 24);
            if (diffIndays) {
              this.dayGapBtwDate = diffIndays;
            }
          }
        }
      }
    }
  }
  handleTaskEstDuration(estDuration: any) {
    if (this.taskDueDays) {
      this.estDurationWithDay = this.taskDueDays;
    }
    let estDurationDay: any;
    let estDurationHour: any;
    let estDurationMinute: any;
    if (this.createTaskForm.controls.taskDays.value) {
      estDurationDay = this.createTaskForm.controls.taskDays.value
    }
    if (this.createTaskForm.controls.taskHrs.value) {
      estDurationHour = this.createTaskForm.controls.taskHrs.value
    }
    if (this.createTaskForm.controls.taskMin.value) {
      estDurationMinute = this.createTaskForm.controls.taskMin.value
    }
    if (estDurationDay && estDurationHour && estDurationMinute) {
      this.estTime = { "days": estDurationDay, "hours": estDurationHour, "minutes": estDurationMinute };
    }
  }
  openTimeField() {
    this.createBTimeField = true;
    this.updateBTimefield = false;
  }
  saveCreateTask() {
    console.log(' this.locationId', this.locationId)
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.api_loading_CreateActivity = true;
      if (_this.type === undefined) {
        if (!_this.userType || _this.userType === undefined) {
          _this.userType = 'PROVIDER';
        }
        const createTaskData: any = {
          "originUid": _this.taskUid,
          "title": _this.createTaskForm.controls.taskTitle.value,
          "description": _this.createTaskForm.controls.taskDescription.value,
          "userType": _this.userType,
          "category": { "id": _this.createTaskForm.controls.userTaskCategory.value },
          "type": { "id": _this.createTaskForm.controls.userTaskType.value },
          "status": { "id": _this.createTaskForm.controls.taskStatus.value },
          "priority": { "id": _this.createTaskForm.controls.userTaskPriority.value },
          "dueDate": _this.datePipe.transform(_this.createTaskForm.controls.taskDate.value, 'yyyy-MM-dd'),
          "location": { "id": _this.locationId },
          "locationArea": _this.createTaskForm.controls.areaName.value,
          "assignee": { "id": _this.assigneeId },
          "manager": { "id": _this.selectTaskMangerId },
          "targetResult": _this.createTaskForm.controls.targetResult.value,
          "targetPotential": _this.createTaskForm.controls.targetPotential.value,
          "estDuration": _this.estTime,
          // "actualPotential": _this.createTaskForm.controls.actualPotential.value,
          "taskMasterId": _this.taskmasterId
        }
        // console.log('createTaskData',createTaskData)
        if (_this.taskMasterData) {
          if (_this.userType === 'PROVIDER' || _this.userType === 'CONSUMER' || _this.userType === 'ADMIN') {
            _this.boolenTaskError = false;
            _this.crmService.addTask(createTaskData).subscribe((response) => {
              if (response) {
                resolve(response)
                setTimeout(() => {
                  _this.api_loading_CreateActivity = false;
                  _this.snackbarService.openSnackBar('Successfully created activity');
                  _this.createTaskForm.reset();
                  if (_this.src == "updateactivity") {
                    _this.router.navigate(['provider', 'task']);
                  }
                  else {
                    _this.router.navigate(['provider', 'crm']);
                  }
                }, projectConstants.TIMEOUT_DELAY);
              }
            },
              (error) => {
                if (error) {
                  setTimeout(() => {
                    reject(error);
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  }, projectConstants.TIMEOUT_DELAY);
                }

              })
          }
        }
        else {
          if ((_this.userType === 'PROVIDER' || _this.userType === 'CONSUMER' || _this.userType === 'ADMIN') && (_this.createTaskForm.controls.taskTitle.value != null) && (_this.createTaskForm.controls.userTaskCategory.value != null)
            && (_this.createTaskForm.controls.userTaskType.value != null)) {
            _this.boolenTaskError = false;
            _this.bErrormsg = false;
            _this.errorMsgAny = '';
            _this.bErrormsgType = false;
            _this.errorMsgAnyType = '';
            _this.bErrormsgCategory = false;
            _this.errorMsgAnyCategory = ''
            _this.crmService.addTask(createTaskData).subscribe((response) => {
              if (response) {
                resolve(response);
                setTimeout(() => {
                  _this.api_loading_CreateActivity = false;
                  _this.snackbarService.openSnackBar('Successfully created activity');
                  _this.createTaskForm.reset();
                  if (_this.src == "updateactivity") {
                    _this.router.navigate(['provider', 'task']);
                  }
                  else {
                    _this.router.navigate(['provider', 'crm']);
                  }
                }, projectConstants.TIMEOUT_DELAY);
              }

            },
              (error) => {
                if (error) {
                  setTimeout(() => {
                    reject(error);
                    _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                  }, projectConstants.TIMEOUT_DELAY);
                }
              })
          }
          else {
            if (_this.createTaskForm.controls.taskTitle.value === null) {
              _this.bErrormsg = true;
              _this.errorMsgAny = 'Please enter title';
            } else if (_this.createTaskForm.controls.userTaskCategory.value === null) {
              _this.bErrormsgCategory = true;
              _this.errorMsgAnyCategory = 'Please select category'
            }
            else if (_this.createTaskForm.controls.userTaskType.value === null) {
              _this.bErrormsgType = true;
              _this.errorMsgAnyType = 'Please select type';
            }
          }
        }
      }
    })

  }

}
