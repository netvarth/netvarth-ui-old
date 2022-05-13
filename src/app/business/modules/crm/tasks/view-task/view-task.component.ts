import { Component, OnInit } from "@angular/core";
import { projectConstantsLocal } from "../../../../../../../src/app/shared/constants/project-constants";
import { projectConstants } from "../../../../../../../src/app/app.component";
import { Messages } from "../../../../../../../src/app/shared/constants/project-messages";
import { Location } from "@angular/common";
import { ActivatedRoute, Router , NavigationExtras } from "@angular/router";
import { CrmService } from "../../crm.service";
import { MatDialog } from "@angular/material/dialog";
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { CrmSelectMemberComponent } from "../../../../shared/crm-select-member/crm-select-member.component";
import { SharedServices } from "../../../../../shared/services/shared-services";
import { CrmProgressbarComponent } from "../../../../../../../src/app/business/shared/crm-progressbar/crm-progressbar.component";
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
  maxDate = new Date();
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
  constructor(
    private locationobj: Location,
    private crmService: CrmService,
    public _location: Location,
    public dialog: MatDialog,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    public shared_services: SharedServices,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
   this.api_loading = false;
    this._Activatedroute.paramMap.subscribe(params => {
      this.taskUid = params.get("id");
      console.log("task id : ", this.taskUid);
      this.crmService.getTaskDetails(this.taskUid).subscribe(data => {
        this.taskDetails = data;
        this.taskkid = this.taskDetails.id;
        this.api_loading = false;
        console.log("Task Details : ", this.taskDetails);
        if (this.taskDetails.originUid) {
          this.taskType = "SubTask";
          console.log('taskType',this.taskType)
        }
        console.log('taskType',this.taskType)
        console.log("taskDetails.status", this.taskDetails.status.name);
        // console.log('this.taskDetails.notes',this.taskDetails.notes)
        this.taskDetails.notes.forEach((notesdata: any) => {
          this.notesList.push(notesdata);
        });
        console.log("this.notesList", this.notesList);
      });
    });
    this.crmService.taskToCraeteViaServiceData = this.updateTaskData;
  }

  uploadFiles() {
    const dialogRef = this.dialog.open(SelectAttachmentComponent, {
      panelClass: ["popup-class", "confirmationmainclass"],
      disableClose: true,
      data: {
        source: "Task",
        taskuid: this.taskUid
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
  openEditTask(taskdata: any, editText: any) {
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
        taskName: this.taskDetails
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
      setTimeout(() => {
        // this.ngOnInit();
        this.getTaskDetails();
      }, projectConstants.TIMEOUT_DELAY);
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
      this.getTaskDetails();
      // if(res === 'Cancelled'){
      //   console.log('kkk')
      // }
    });
  }
}
