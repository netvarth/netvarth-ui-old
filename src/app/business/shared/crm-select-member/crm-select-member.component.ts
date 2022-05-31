import { Component, Inject, OnInit } from "@angular/core";
// import { FormBuilder } from '@angular/forms';
import { CrmService } from "../../modules/crm/crm.service";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { projectConstants } from "../../../../../src/app/app.component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
// import { FormBuilder } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { Router } from '@angular/router';
import { CrmMarkasDoneComponent } from "../../shared/crm-markas-done/crm-markas-done.component";
import { WordProcessor } from "../../../shared/services/word-processor.service";
import { GroupStorageService } from "../../../shared/services/group-storage.service";
import { Router } from "@angular/router";
import { ProviderServices } from "../../../business/services/provider-services.service";
//import { FormBuilder, FormControl, Validators } from "@angular/forms";
//import {MatChipInputEvent} from '@angular/material/chips';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FileService } from "../../../shared/services/file-service";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { projectConstantsLocal } from "../../../../../src/app/shared/constants/project-constants";

@Component({
  selector: "app-crm-select-member",
  templateUrl: "./crm-select-member.component.html",
  styleUrls: ["./crm-select-member.component.css"]
})
export class CrmSelectMemberComponent implements OnInit {
  public memberList: any = [];
  public assignMemberDetails: any;
  public handleAssignMemberSelectText: string = "";
  public assignMemberErrorMsg: string = "";
  public errorMsg: boolean = false;
  public assignMemberForm: any;
  //for notes variable
  public notesTextarea: any;
  public noteDescription: any;
  public noteDescriptionTime: any;
  public taskDes: any;
  //for status change variable
  public taskDescription: any;
  public taskTitle: any;
  public taskProgress: any;
  public status: any;
  public height: any = "100";
  public assigneeName: any;
  public managerName: any;
  public priorityName: any;
  public lastUpdate: any;
  public currentStatus: any;
  public taskStatusList: any = [];
  public leadStatusList: any = [];
  public selectedStatusId: any;
  public selectedStatusUID: any;
  public selectText: any;
  public showHideTickMark: boolean = false;
  public statusId: any;
  public statusChange: any;
  public showHideTickMarkUpdate: boolean = false;
  public selectedStatus: any;
  //notes variable
  public allNotes: any = [];
  //upload file variabe
  public allFilesDes: any = [];
  public customer_label: any = "";
  public provider_label: any = "";
  //task master list variable
  public taskMasterListData: any;
  public leadMasterListData: any;
  public assignTaskMaster: any;
  public assignLeadMaster: any;
  public newTask: any;
  leadDescription: any;
  leadTitle: any;
  leadProgress: any;
  handleAssigncustomerSelectText: string;
  customerErrorMsg: string;
  assignCustomerDetails: string;
  viewStatusList: any = [];
  searchtext: any;
  public firstNameValue: any;
  public lastNameValue: any;
  public phoneNoValue: any;
  public emailValue: any;
  public selectTemplateLength: any;
  public taskType: any;
  public fileArray: any = [];
  public createCustomerForm: any;
  customerDetails: any;
  customerName: any;
  customerList: any = [];
  notify: boolean = false;
  message: any;
  searchby = "";
  form_data: any;
  emptyFielderror = false;
  create_new = false;
  qParams: {};
  prefillnewCustomerwithfield = "";
  customer_data: any;
  show_customer = false;
  create_customer = false;
  disabledNextbtn = true;
  jaldeeId: any;
  formMode: string;
  countryCode;
  customer_email: any;
  search_input: any;
  hideSearch = false;
  customerArray: any = [];
  public customerData: any = [];
  searchedData: any = [];
  addOnBlur = true;
  selectable = true;
  removable = true;
  showDone = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private onDestroy$: Subject<void> = new Subject<void>();
  public activityList: any = [];

  constructor(
    public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private crmService: CrmService,
    // private fb: FormBuilder,
    private snackbarService: SnackbarService,
    // private _Activatedroute:ActivatedRoute,
    // private router: Router,
    // private createTaskFB: FormBuilder,
    private dialog: MatDialog,
    // private datePipe:DatePipe,
    private providerServiceObj: ProviderServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private fileService: FileService
  ) {
    console.log("consdataSelectMember", this.data);
    // this.assignMemberDetails= this.data.assignMembername
    // console.log('this.assignMemberDetails',this.assignMemberDetails);
  }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm("customer");
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    console.log("User is :", user);
    // this.assignMemberDetails= (user.id);
    if (
      this.data.requestType === "createtaskSelectMember" ||
      this.data.requestType === "createtaskSelectManager" ||
      this.data.requestType === "createleadSelectMember" ||
      this.data.requestType === "createleadSelectManager"
    ) {
      this.data.memberList[0].forEach((singleMember: any) => {
        // console.log('singleMember',singleMember)
        if (singleMember.userType === "PROVIDER") {
          // console.log('this.data.assignMembername',this.data.updateAssignMemberId)
          this.memberList.push(singleMember);
          if (this.data.requestType === "createtaskSelectMember") {
            if (singleMember.id == this.data.updateAssignMemberId) {
              if (this.crmService.taskActivityName === "Update") {
                this.assignMemberDetails = singleMember;
                // this.assignMemberDetails = this.data.updateSelectedMember;
              } else {
                this.assignMemberDetails = this.data.updateSelectedMember;
              }
            }
          } else if (this.data.requestType === "createtaskSelectManager") {
            if (singleMember.id == this.data.updateManagerId) {
              if (this.crmService.taskActivityName === "Update") {
                this.assignMemberDetails = singleMember;
              } else {
                this.assignMemberDetails = this.data.updateSelectTaskManager;
              }
            }
          }
        }
      });
    } else if (this.data.requestType === "createleadSelectCustomer") {
      // this.data.memberList[0].forEach((singleMember:any)=>{

      //   this.memberList.push(singleMember)
      //   if(this.data.requestType==='createleadSelectCustomer'){
      //     if(singleMember.id==this.data.updateAssignMemberId){
      //       if(this.crmService.taskActivityName==='Update'){
      //         this.assignCustomerDetails=singleMember;
      //       }
      //       else{
      //         this.assignCustomerDetails = this.data.updateSelectedMember;
      //       }
      //     }
      //   }

      // })
      this.memberList = this.data.memberList;
      console.log("customermemberlist", this.memberList);
    } else if (this.data.requestType === "createUpdateNotes") {
      console.log("createUpdateNotes");
    } else if (this.data.requestType === "noteDetails") {
      console.log("Notews");
      this.allNotes.push(this.data.noteDetails.notes);
      console.log(" this.allNotes", this.allNotes);
      this.noteDescription = this.data.noteDetails.note;
      this.noteDescriptionTime = this.data.noteDetails.createdDate;
    } else if (this.data.requestType === "taskComplete") {
      console.log("this.data", this.data);
      this.taskDes = this.data.taskName.title;
      if (this.data.type != "SubTask") {
        this.taskType = "activity";
      } else {
        this.taskType = "subactivity";
      }
    } else if (this.data.requestType === "statusChange") {
      console.log("this.data", this.data);
      console.log("statusChangeeeeeeeee");
      this.taskDescription = this.data.taskDetails.description;
      this.taskTitle = this.data.taskDetails.title;
      this.taskProgress = this.data.taskDetails.progress;
      this.status = this.data.taskDetails.status.name;
      this.assigneeName = this.data.taskDetails.assignee.name;
      this.managerName = this.data.taskDetails.manager.name;
      this.priorityName = this.data.taskDetails.priority.name;
      this.lastUpdate = this.data.taskDetails.dueDate;
      this.currentStatus = this.data.taskDetails.status.name;
      this.getTaskStatusListData();
      this.selectedStatusUID = this.data.taskDetails.taskUid;
      this.statusId = this.data.taskDetails.status.id;
      console.log("this.statusssssssssss", this.status);
      console.log("this.statusChange", this.statusChange);
      this.showHideTickMarkUpdate = true;
      this.selectedStatusId = this.statusId;
    } else if (this.data.requestType === "statusChangeLeadToTask") {
      console.log(
        "this.data.taskDetails.assignee",
        this.data.taskDetails.assignee
      );
      console.log("this.data", this.data);
      this.taskDescription = this.data.taskDetails.description;
      this.taskTitle = this.data.taskDetails.title;
      this.taskProgress = this.data.taskDetails.progress;
      if (this.data.taskDetails.assignee != undefined) {
        this.assigneeName = this.data.taskDetails.assignee.name;
      }
      if (this.data.taskDetails.manager != undefined) {
        this.managerName = this.data.taskDetails.manager.name;
      }
      if (this.data.taskDetails.priority != undefined) {
        this.priorityName = this.data.taskDetails.priority.name;
      }
      if (this.data.taskDetails.dueDate != undefined) {
        this.lastUpdate = this.data.taskDetails.dueDate;
      }
      if (this.data.taskDetails.currentStatus != undefined) {
        this.currentStatus = this.data.taskDetails.status.name;
      }
      if (this.data.taskDetails.selectedStatusUID != undefined) {
        this.selectedStatusUID = this.data.taskDetails.taskUid;
      }
      if (this.data.taskDetails.selectedStatusUID != undefined) {
        this.statusId = this.data.taskDetails.status.id;
        // this.selectedStatusId=  this.statusId;
        this.currentStatus = this.data.taskDetails.status.name;
        // this.showHideTickMarkUpdate=true;
      }
      this.getTaskStatusListData();
      console.log("this.statusssssssssss", this.status);
      console.log("this.statusChange", this.statusChange);
      this.statusId = this.data.taskDetails.status.id;
      this.showHideTickMarkUpdate = true;
      this.selectedStatusId = this.statusId;
      this.selectedStatusUID = this.data.taskDetails.taskUid;
    } else if (this.data.requestType === "LeadstatusChange") {
      console.log("LeadstatusChangeeeeeeeee");
      this.leadDescription = this.data.leadDetails.description;
      this.leadTitle = this.data.leadDetails.title;
      this.leadProgress = this.data.leadDetails.progress;
      this.status = this.data.leadDetails.status.name;
      this.assigneeName = this.data.leadDetails.assignee.name;
      this.managerName = this.data.leadDetails.manager.name;
      this.priorityName = this.data.leadDetails.priority.name;
      this.lastUpdate = this.data.leadDetails.dueDate;
      this.currentStatus = this.data.leadDetails.status.name;
      this.getLeadStatusListData();
      this.selectedStatusUID = this.data.leadDetails.uid;
      this.statusId = this.data.leadDetails.status.id;
      console.log("this.statusssssssssss", this.status);
      console.log("this.statusChange", this.statusChange);
      this.showHideTickMarkUpdate = true;
      this.selectedStatusId = this.statusId;
    } else if (this.data.requestType === "uploadFilesDesciption") {
      console.log("uploadFilesDesciption");
      this.allFilesDes.push(this.data.filesDes);
    } else if (this.data.requestType === "taskMasterList") {
      this.taskMasterListData = this.data.data;
      console.log("TaskMasterList.............", this.taskMasterListData);
      // this.selectTemplateLength= this.taskMasterListData.templateName.length;
      // console.log('selectTemplateLength',this.selectTemplateLength)
    } else if (this.data.requestType === "leadMasterList") {
      this.leadMasterListData = this.data.leadMasterFullList[0];
      console.log("leadMasterList.............", this.leadMasterListData);
    } else if (this.data.requestType === "createTaskActivityList") {
      // this.getTotalTaskActivity();
      // this.activityList= this.data[0];
      this.data.data[0].forEach((item: any) => {
        this.activityList.push(item);
      });
    }

    if (this.data.requestType === "fileShare") {
      //console.log("this.data", this.data.file);
    }
    if (this.data.requestType === "customerSearch") {
      this.customerData = this.data.customerList;
    }
  }

  getImageType(fileType) {
    //console.log("fileType",fileType);
    return this.fileService.getImageByType(fileType);
  }
  handleMemberSelect(member, selected: string) {
    this.handleAssignMemberSelectText = "";
    // console.log(selected)
    // console.log(member)
    this.handleAssignMemberSelectText = selected;
    this.errorMsg = false;
  }

  handleCustomerSelect(member, selected: string) {
    this.handleAssigncustomerSelectText = "";
    this.handleAssigncustomerSelectText = selected;
    this.errorMsg = false;
  }

  isChecked(memberSelect) {
    // console.log('memberselect',memberSelect)
  }
  saveAssignMember(res) {
    if (this.assignMemberDetails !== "") {
      // console.log('response',res)
      this.errorMsg = false;
      // console.log('assignMemberDetails',this.assignMemberDetails)
      this.dialogRef.close(res);
    } else {
      if (this.assignMemberDetails === "") {
        this.errorMsg = true;
        this.assignMemberErrorMsg = "Please select assign member";
      }
    }
  }
  saveAssignCustomer(res) {
    console.log("Saved customer details : ", res);
    if (this.assignCustomerDetails !== "") {
      this.errorMsg = false;
      this.dialogRef.close(res);
    } else {
      if (this.assignCustomerDetails === "") {
        this.errorMsg = true;
        this.customerErrorMsg = "Please select customer";
      }
    }
  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else {
      return "../../../assets/images/avatar5.png";
    }
  }

  buttonclicked(res) {
    // console.log('res',res)
    this.dialogRef.close(res);
  }
  closetab() {
    this.dialogRef.close("");
  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + 15 + "px";
  }
  handleNotesDescription(textValue: any) {
    console.log("taskDescription", textValue);
    if (textValue != undefined) {
      this.errorMsg = false;
      this.assignMemberErrorMsg = "";
    } else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = "Please enter some description";
    }
  }
  cancelCreateNote(textValue) {
    console.log("textValue", textValue);
    if (textValue === "Cancel") {
      setTimeout(() => {
        this.dialogRef.close(textValue);
      }, projectConstants.TIMEOUT_DELAY);
    }
  }
  saveCreateNote(notesValue: any) {
    console.log("notesValue", notesValue);
    console.log("this.data.taskUid", this.data.taskUid);
    if (this.notesTextarea !== undefined) {
      console.log("this.notesTextarea", this.notesTextarea);
      this.errorMsg = false;
      this.assignMemberErrorMsg = "";
      const createNoteData: any = {
        note: this.notesTextarea
      };
      console.log("createNoteData", createNoteData);
      if (this.data.source == "Lead") {
        this.crmService
          .addLeadNotes(this.data.leadUid, createNoteData)
          .subscribe(
            (response: any) => {
              console.log("response", response);
              setTimeout(() => {
                this.dialogRef.close(notesValue);
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror"
              });
            }
          );
      } else {
        this.crmService.addNotes(this.data.taskUid, createNoteData).subscribe(
          (response: any) => {
            console.log("response", response);
            setTimeout(() => {
              this.dialogRef.close(notesValue);
            }, projectConstants.TIMEOUT_DELAY);
            this.snackbarService.openSnackBar("Remarks added successfully");
          },
          error => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror"
            });
          }
        );
      }
    } else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = "Please enter some description";
    }
  }
  completeTask() {
    console.log("this.data..", this.data);
    console.log("this.data.taskName.taskUid", this.data.taskName.taskUid);
    console.log("jjj");
    if (this.data.requestType === "taskComplete") {
      // this.router.navigate(['provider', 'task',]);
      const taskUID = this.data.taskName.taskUid;
      console.log("kkkkkk");
      this.crmService.taskStatusCloseDone(taskUID).subscribe(
        (res: any) => {
          console.log("res................", res);
          // setTimeout(() => {
          //   this.dialogRef.close()
          // }, projectConstants.TIMEOUT_DELAY);
          const dialogRef = this.dialog.open(CrmMarkasDoneComponent, {
            width: "85%",
            panelClass: ["popup-class", "confirmationmainclass"],
            data: {
              requestType: "taskComplete",
              taskDetails: this.data
              // taskUid:this.data.taskName.taskUid
            }
          });
          dialogRef.afterClosed().subscribe(res => {
            this.dialogRef.close("Completed");
            console.log("res", res);
          });
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
          this.dialogRef.close();
        }
      );
      // const dialogRef= this.dialog.open(CrmMarkasDoneComponent,{
      //   width: '85%',
      //   panelClass: ['popup-class', 'confirmationmainclass'],
      //   data:{
      //     requestType:'taskComplete',
      //     taskDetails:  this.data,
      //     // taskUid:this.data.taskName.taskUid
      //   }
      // })
      // dialogRef.afterClosed().subscribe((res)=>{
      //   this.dialogRef.close()
      //   console.log('res',res);
      // })
    }
  }
  getTaskStatusListData() {
    this.crmService.getTaskStatus().subscribe(
      (taskStatus: any) => {
        console.log("taskStatus", taskStatus);
        this.taskStatusList.push(taskStatus);
        console.log("dfff" + JSON.stringify(this.taskStatusList));
        this.viewStatusList = taskStatus.filter(
          view => view.name !== this.status
        );
        console.log("this.taskStatusList", this.viewStatusList);
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }

  getLeadStatusListData() {
    this.crmService.getLeadStatus().subscribe(
      (leadStatus: any) => {
        console.log("leadStatus", leadStatus);
        this.leadStatusList.push(leadStatus);
        console.log("this.leadStatusList", this.leadStatusList);
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }

  selectStatus(statusDetails) {
    this.showHideTickMark = true;
    console.log("statusDetails", statusDetails);
    this.selectedStatusId = statusDetails.id;
    this.status = statusDetails.name;
    this.selectText = "";
    this.showHideTickMarkUpdate = false;
    if (this.statusId === statusDetails.id) {
      this.selectText = "Already updated";
    } else {
      this.selectText = "";
    }
  }
  completeTaskStatus() {
    // this.selectText=''
    console.log("this.selectedStatusId", this.selectedStatusId);
    if (this.statusId === this.selectedStatusId) {
      this.selectText = "Already updated";
    } else {
      if (this.selectedStatusId != undefined) {
        this.crmService
          .addStatus(this.selectedStatusUID, this.selectedStatusId)
          .subscribe(
            response => {
              console.log("response", response);
              setTimeout(() => {
                this.dialogRef.close(this.status);
                this.showHideTickMark = false;
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror"
              });
            }
          );
      }
    }
    // if(this.selectedStatusId != undefined){
    //   this.crmService.addStatus( this.selectedStatusUID,this.selectedStatusId).subscribe((response)=>{
    //     console.log('response',response)
    //     setTimeout(() => {
    //       this.dialogRef.close();
    //       this.showHideTickMark=false
    //     }, projectConstants.TIMEOUT_DELAY);
    //   },
    //   (error)=>{
    //     this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    //   })
    // }
    // else{
    //   this.selectText='Please select one status'
    // }
  }

  completeLeadStatus() {
    console.log("this.selectedStatusId", this.selectedStatusId);
    if (this.statusId === this.selectedStatusId) {
      this.selectText = "Alredy updated";
    } else {
      if (this.selectedStatusId != undefined) {
        this.crmService
          .addLeadStatus(this.selectedStatusUID, this.selectedStatusId)
          .subscribe(
            response => {
              console.log("response", response);
              setTimeout(() => {
                this.dialogRef.close(this.status);
                this.showHideTickMark = false;
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.snackbarService.openSnackBar(error, {
                panelClass: "snackbarerror"
              });
            }
          );
      }
    }
  }

  getTaskmaster() {
    this.crmService.getTaskMasterList().subscribe(response => {
      console.log("TaskMasterList :", response);
    });
  }
  handleTaskMasterSelect(taskMaster, selected: string) {
    console.log("taskMaster", taskMaster);
    // console.log('this.assignTaskMaster',this.assignTaskMaster)
    // this.errorMsg=false;
    // this.assignMemberErrorMsg=''
  }
  handleleadMasterSelect(leadMaster, selected: string) {
    console.log("leadMaster", leadMaster);
    // console.log('this.assignLeadMaster',this.assignLeadMaster)
    this.errorMsg = false;
    this.assignMemberErrorMsg = "";
  }
  saveTaskMaster(taskMasterValue) {
    console.log("taskMasterValue", taskMasterValue);
    if (taskMasterValue !== undefined) {
      // console.log('response',res)
      // this.errorMsg=false;
      // console.log('assignMemberDetails',this.assignMemberDetails)
      this.dialogRef.close(taskMasterValue);
      // this.router.navigate(['provider', 'task', 'create-task'])
    } else if (this.newTask === "CreatE") {
      // this.router.navigate(['provider', 'task', 'create-task'])
      this.dialogRef.close("CreatE");
      // this.router.navigate(['provider', 'task', 'create-task'])
    }
    // else{
    //     this.errorMsg=true;
    //     this.assignMemberErrorMsg='Please select activity template'

    // }
  }
  saveLeadMaster(leadMasterValue) {
    console.log("leadMasterValue", leadMasterValue);
    if (leadMasterValue !== undefined) {
      // console.log('response',res)
      // this.errorMsg=false;
      // console.log('assignMemberDetails',this.assignMemberDetails)
      this.dialogRef.close(leadMasterValue);
    } else if (this.newTask === "CreatE") {
      // this.router.navigate(['provider', 'task', 'create-task'])
      this.dialogRef.close("CreatE");
    } else {
      this.errorMsg = true;
      this.assignMemberErrorMsg = "Please select activity template";
    }
  }
  createTask(createText: any) {
    console.log("createText", createText);
    this.errorMsg = false;
    this.assignMemberErrorMsg = "";
    this.crmService.taskActivityName = createText;
    this.newTask = createText;
    if (createText !== undefined) {
      this.dialogRef.close(createText);
      this.router.navigate(["provider", "task", "create-task"]);
    }
    // this.dialogRef.close(createText)
  }
  closeDialog(coseText) {
    this.dialogRef.close(coseText);
  }
  createCustomer() {
    if (this.data.requestType === "createCustomer") {
      const afterCompleteAddData: any = {
        firstName: this.firstNameValue,
        lastName: this.lastNameValue,
        phoneNo: this.phoneNoValue,
        email: this.emailValue,
        countryCode: "+91"
      };
      console.log("afterCompleteAddTaskData", afterCompleteAddData);
      this.crmService.createProviderCustomer(afterCompleteAddData).subscribe(
        (response: any) => {
          setTimeout(() => {
            console.log("aftercreateTaskcompleteion", response);
            this.dialogRef.close(response);
            // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
    }
  }
  hamdlefirstName(resValue) {}
  hamdlelastName(value) {}
  hamdlephoneNo(resValue) {}
  hamdleemail(resValue) {}
  downloadFile(fileDes: any) {
    console.log("file", fileDes);
    window.open(fileDes.s3path);
    // if(fileDes.type ==='pdf'){
    //   window.open(fileDes.s3path)
    // }
  }
  getColor(status) {
    if (status) {
      if (status === "New") {
        return "blue";
      } else if (status === "Assigned") {
        return "pink";
      } else if (status === "In Progress") {
        return "#fcce2b";
      } else if (status === "Cancelled") {
        return "red";
      } else if (status === "Suspended") {
        return "orange";
      } else if (status === "Completed") {
        return "green";
      } else {
        return "black";
      }
    }
  }
  selectTaskActivity(taskData) {
    console.log("taskData", taskData);
    this.dialogRef.close(taskData);
  }
  getTotalTaskActivity() {
    // this.crmService.getTotalTask().subscribe((response)=>{
    //   console.log('response',response);
    //   this.activityList.push(response);
    // })
  }

  createCustomerData(customer: any) {
    console.log("FormData ", customer);
  }

  notifyied(notify: boolean) {
    console.log("Notify ", notify);
  }
  messageData(message: any) {
    console.log("Message :", message);
  }

  openCustomerSearchDialog(customerList) {
    console.log("openCustomerSearchDialog", customerList);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "customerSearch",
        customerList: customerList
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        console.log("searched ", res);
        this.customerName =
          (res.firstName ? res.firstName : "") +
          " " +
          (res.lastName ? res.lastName : "");
        console.log("Customer Name :", this.customerName);
        this.customerList.push(res);
        this.customerArray.push(res.id);

        if (
          this.customerList["firstName"] ||
          this.customerList["lastName"] === ""
        ) {
          this.snackbarService.openSnackBar("Shared person must have name", {
            panelClass: "snackbarerror"
          });
        }

        if (customerList["id"] === res.id) {
          this.snackbarService.openSnackBar("Already Existed", {
            panelClass: "snackbarerror"
          });
        }
      }
      // this.customerData.push(res.id)
      // console.log("Customer List :",this.customerData);
      //   this.customerData.forEach((element,index)=>{
      //     console.log("Element , Index :",element,index)
      //     if(this.customerData[index] === this.customerData[index+1]){
      //       console.log("Existedddd:")
      //       this.customerData=[]
      //       //this.customerList['id'] = []
      //       //this.customerArray = []
      //     }
      //       //alert("Alredy")
      //   })
      // if(this.customerList['id'] === res.id){
      //   this.snackbarService.openSnackBar("Already existed!",{'panelClass': 'snackbarerror'})
      // }
      if (res === "") {
        //alert("please selecte atleast one consumer or provider")
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        };
      }
      // this.getCompletedTask();

      // this.getInprogressTask();
      //this.ngOnInit();
    });
  }
  remove(customer) {
    const index = this.customerList.indexOf(customer);
    if (index >= 0) {
      this.customerList.splice(index, 1);
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add our fruit
  //   if (value) {
  //     this.customerList.push({customer: value});
  //   }

  //   // Clear the input value
  //   event.chipInput!.clear();
  // }

  searchCustomer(customers) {
    console.log("Dattt:", customers);
    this.customerData = customers;
    this.emptyFielderror = false;
    if (this.customerDetails && this.customerDetails === "") {
      this.emptyFielderror = true;
      this.snackbarService.openSnackBar(
        "Please search atleast one consumer or provider",
        { panelClass: "snackbarerror" }
      );
    } else {
      this.qParams = {};
      let mode = "id";
      this.form_data = null;
      let post_data = {};
      const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const isEmail = emailPattern.test(this.customerDetails);
      if (isEmail) {
        mode = "email";
        this.prefillnewCustomerwithfield = "email";
      } else {
        const phonepattern = new RegExp(
          projectConstantsLocal.VALIDATOR_NUMBERONLY
        );
        const isNumber = phonepattern.test(this.customerDetails);
        const phonecntpattern = new RegExp(
          projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10
        );
        const isCount10 = phonecntpattern.test(this.customerDetails);
        if (isNumber && isCount10) {
          mode = "phone";
          this.prefillnewCustomerwithfield = "phone";
        } else if (isNumber && this.customerDetails.length > 7) {
          mode = "phone";
          this.prefillnewCustomerwithfield = "phone";
        } else if (isNumber && this.customerDetails.length < 7) {
          mode = "id";
          this.prefillnewCustomerwithfield = "id";
        }
      }

      switch (mode) {
        case "phone":
          post_data = {
            "phoneNo-eq": this.customerDetails
          };
          this.qParams["phone"] = this.customerDetails;
          break;
        case "email":
          post_data = {
            "email-eq": this.customerDetails
          };
          this.qParams["email"] = this.customerDetails;
          break;
        case "id":
          post_data["or=jaldeeId-eq"] =
            this.customerDetails + ",firstName-eq=" + this.customerDetails;
          // post_data = {
          //   'jaldeeId-eq': form_data.search_input
          // };
          break;
      }
      // console.log("Post Data :", post_data);
      // if(post_data === '' || post_data === undefined){
      //   this.snackbarService.openSnackBar("Please search atleast one consumer or provider",{'panelClass': 'snackbarerror'})
      // }
      this.customerDetails = "";
      this.providerServiceObj
        .getCustomer(post_data)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (data: any) => {
            this.customer_data = [];
            console.log("Customer dataaaa :", data);
            this.searchedData = data;
            this.customerArray.push(data[0].id);
            //this.customerList.push(data[0]);
            if (this.customerList.length === 0) {
              this.customerList.push(data[0]);
            } else {
              const customer = this.customerData.find(x => x.id === data[0].id);
              if (customer) {
                this.snackbarService.openSnackBar("Searched people already existed!",{'panelClass': 'snackbarerror'})
              } else {
                this.customerList.push(data[0]);
              }
              // for(let i=0;i<this.customerData.length;i++){
              //   if(this.customerData[i].id === data[0].id){
              //     console.log("Existed:")
              //     this.customerList.push('');
              //     break;
              //   }

              // }
              //   this.customerList.push(data[0]);
            }
            // console.log("Array :",this.customerData)
            //              if(this.customerList.length===0){
            //              }
            //             else{
            //               this.customerList.forEach((element,index)=>{
            //                 console.log("forEach 1 : ", index)
            //                 data.forEach((element1,index1)=>{
            //                   console.log("forEach 2 : ", index1)
            //                   if(element.id === element1.id){
            //                     console.log("Existedddddddd:")
            //                     this.customerDetails = ''
            //                     this.customerList.push('');
            //                     this.snackbarService.openSnackBar("Already existed!",{'panelClass': 'snackbarerror'})
            //                   }
            //                   else{
            //                     this.customerList.push(data[0]);
            //                   }

            //                 })
            //               })
            //             }
            if (data.length === 0) {
              this.show_customer = false;
              this.create_customer = true;

              //this.createNew();
            } else {
              if (data.length > 1) {
                // const customer = data.filter(member => !member.parent);
                this.customer_data = data[0];
                this.hideSearch = true;
              } else {
                this.customer_data = data[0];
                if (this.customer_data) {
                  this.hideSearch = true;
                }
              }
              this.disabledNextbtn = false;
              this.jaldeeId = this.customer_data.jaldeeId;
              this.show_customer = true;
              this.create_customer = false;

              this.formMode = data.type;
              if (
                this.customer_data.countryCode &&
                this.customer_data.countryCode !== "+null"
              ) {
                this.countryCode = this.customer_data.countryCode;
              } else {
                this.countryCode = "+91";
              }
              if (
                this.customer_data.email &&
                this.customer_data.email !== "null"
              ) {
                this.customer_email = this.customer_data.email;
              }

              if (
                this.customer_data.jaldeeId &&
                this.customer_data.jaldeeId !== "null"
              ) {
                this.jaldeeId = this.customer_data.jaldeeId;
              }
              if (
                this.customer_data.firstName &&
                this.customer_data.firstName !== "null"
              ) {
                this.jaldeeId = this.customer_data.firstName;
              }
            }
          },

          // error => {
          //   this.wordProcessor.apiErrorAutoHide(this, error);
          // }
          error => {
            //this.snackbarService.openSnackBar("Please select atleast one consumer",{'panelClass': 'snackbarerror'})
          }
        );
    }
  }

  getCustomerDetail(customer) {
    console.log("Customerrrrr...", customer);
    // if(customer === '' || customer === undefined){
    //   this.snackbarService.openSnackBar("Please select atleast one consumer or provider",{'panelClass': 'snackbarerror'})
    // }
    let newData = [];
    newData = this.customerData;
    //console.log("Array : ",newData)
    // this.customerArray.forEach((element,index)=>{
    //   console.log("Element , Index :",element,index)
    //   if(this.customerArray[index] === this.customerArray[index+1]){
    //     console.log("Existedddd:")
    //   }
    //     //alert("Alredy")
    // })
    console.log("Data From:", newData);
    if (customer.id !== this.customerData) {
      setTimeout(() => {
        console.log("aftergetCustomer..", customer);
        this.dialogRef.close(customer);
        // this.router.navigate(['provider', 'task']);
      }, projectConstants.TIMEOUT_DELAY);
    } else {
      this.snackbarService.openSnackBar("Already existed!", {
        panelClass: "snackbarerror"
      });
    }
  }
  shareFileToConsumerOrProvider() {
    // if(customer === '' && file === ''){
    //   this.customerError= null
    //   this.customerErrorMsg = 'Please add cunsumer or provider info'
    // }
    console.log("Submit Share :", this.customerArray, this.data.file.id);

    this.customerArray.forEach(element => {
      console.log("Element :", element);
      const newObj = {
        owner: element,
        ownerType: "ProviderConsumer"
      };

      this.fileArray.push(newObj);
    });
    console.log("Custome :", this.fileArray);

    // const newArray = []
    // newArray.push(this.customerArray)
    // console.log("new Array",newArray)
    const attachments = [];

    attachments.push(this.data.file.id);

    console.log(
      "ProviderConsumer :",
      this.fileArray,
      "File Id :",
      attachments[0]
    );
    let dataToSend = new FormData();
    const newBlobArray = new Blob([JSON.stringify(this.fileArray, null, 2)], {
      type: "application/json"
    });
    dataToSend.append("sharedto", newBlobArray);
    const newBlob = new Blob([JSON.stringify(attachments, null, 2)], {
      type: "application/json"
    });
    dataToSend.append("attachments", newBlob);

    this.providerServiceObj.shareProviderFiles(dataToSend).subscribe(
      res => {
        //   console.log("Ressssssssssssult:", res);
        //   this.dialogRef.close(res);
        // });
        console.log("response", res);
        setTimeout(() => {
          this.dialogRef.close(res);
        }, projectConstants.TIMEOUT_DELAY);
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }
  search() {
    this.hideSearch = false;
    this.showDone = true;
  }

  createNew() {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data: {
        requestType: "createCustomer",
        header: "Create " + this.customer_label
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log("afterSelectPopupValue", res);
      if (res === "") {
        this.hideSearch = false;
      } else {
        const filter = { "id-eq": res };
        this.providerServiceObj.getCustomer(filter).subscribe(
          (response: any) => {
            this.customer_data = response[0];
            console.log("customer_data", this.customer_data);
            this.hideSearch = true;
          },
          error => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror"
            });
          }
        );
      }
    });
  }

  UpdateFileStatus() {
    this.providerServiceObj
      .changeUploadStatus(this.data.file.owner, this.data.file.uploadStatus)
      .subscribe(res => {
        console.log("Ressssssssssss:", res);
      });
  }
}
