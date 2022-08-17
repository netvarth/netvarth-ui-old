import { Component, Inject, OnInit } from "@angular/core";
import { CrmService } from "../../modules/crm/crm.service";
import {MAT_DIALOG_DATA,MatDialogRef,MatDialog} from "@angular/material/dialog";
import { projectConstants } from "../../../../../src/app/app.component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { CrmMarkasDoneComponent } from "../../shared/crm-markas-done/crm-markas-done.component";
import { WordProcessor } from "../../../shared/services/word-processor.service";
import { GroupStorageService } from "../../../shared/services/group-storage.service";
import { Router } from "@angular/router";
import { ProviderServices } from "../../../business/services/provider-services.service";
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
  public memberList: any = []
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
  public selected_customer :any = []
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
  public newCustomerList:any=[]
  public newData:any=[]
  notify: boolean = false;
  message = "";
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
  name:any
  formMode: string;
  countryCode;
  customer_email: any;
  search_input: any;
  hideSearch = false;
  customerArray: any = [];
  public customerData: any = [];
  public customerViewData:any;
  searchedData: any = [];
  firstCustomerName:any;
  addOnBlur = true;
  selectable = true;
  removable = true;
  showDone = false;
  showSelect = true;
  showInput = true;
  showId = false;
  showEmail = false;
  showName = false;
  email = false;
  sms = false;
  pushnotify = false;
  telegram = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private onDestroy$: Subject<void> = new Subject<void>();
  public activityList: any = [];
  seacrchFilterEmployee:any;
  leadUID:any;

  constructor(
    public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private crmService: CrmService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private providerServiceObj: ProviderServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private fileService: FileService
  ) {
    // console.log("consdataSelectMember", this.data);
  }

  ngOnInit(): void {
    
    this.customer_label = this.wordProcessor.getTerminologyTerm("customer");
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    console.log("User is :", user);
    if (
      this.data.requestType === "createtaskSelectMember" ||
      this.data.requestType === "createtaskSelectManager" ||
      this.data.requestType === "createleadSelectMember" ||
      this.data.requestType === "createleadSelectManager"
    ) {
      this.data.memberList[0].forEach((singleMember: any) => {
        if (singleMember.userType === "PROVIDER") {
          if(singleMember.status==='ACTIVE'){
            this.memberList.push(singleMember);
          }
          
          if (this.data.requestType === "createtaskSelectMember") {
            if (singleMember.id == this.data.updateAssignMemberId) {
              if (this.crmService.taskActivityName === "Update") {
                this.assignMemberDetails = singleMember;
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
      this.memberList = this.data.memberList;
      console.log("customermemberlist", this.memberList);
    } else if (this.data.requestType === "createUpdateNotes") {
      console.log('createUpdateNotes',this.data)
      console.log("createUpdateNotes");
      this.leadUID= this.data['info'];
    } else if (this.data.requestType === "noteDetails") {
      console.log("Notews");
      if(this.data && this.data.noteDetails && this.data.noteDetails.notes && this.data.noteDetails.notes.length>0){
        this.allNotes.push(this.data.noteDetails.notes);
        console.log(" this.allNotes", this.allNotes);
      }
      else if(this.data && this.data.noteDetails && this.data.noteDetails.redirectNotes && this.data.noteDetails.redirectNotes.length>0 
        && this.data.notedetails.isRedirected){
        this.allNotes.push(this.data.noteDetails.redirectNotes);
        console.log(" this.allNotes", this.allNotes);
      }
      
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
        this.currentStatus = this.data.taskDetails.status.name;
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
    } else if (this.data.requestType === "leadMasterList") {
      this.leadMasterListData = this.data.leadMasterFullList[0];
      console.log("leadMasterList.............", this.leadMasterListData);
    } else if (this.data.requestType === "createTaskActivityList") {
      this.data.data[0].forEach((item: any) => {
        this.activityList.push(item);
      });
    }
    else if(this.data.requestType==='rejectedLead'){
      console.log('rejectedLead')
    }

    if (this.data.requestType === "fileShare") {
    }
    if (this.data.requestType === "customerView") {
      this.customerViewData = this.data.customer;
      this.firstCustomerName=this.customerViewData.firstName.charAt(0);
      if(this.customerViewData.phoneNo !== undefined || this.customerViewData.phoneNo !== '' || this.customerViewData.phoneNo !== ' '){
        this.showDone = true;
      }
      else{
        this.showDone= false;
      }
      if(this.customerViewData.email !== undefined || this.customerViewData.email !== '' || this.customerViewData.email !== ' '){
        this.showDone = true;
      }
      else{
        this.showDone=false
      }
    }
    if (this.data.requestType === "fileView") {
      this.customerViewData = this.data.file;
    }
  }
  getFileSize(fileSize) {
    return Math.round(fileSize);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }
  handleMemberSelect(member, selected: string) {
    this.handleAssignMemberSelectText = "";
    this.handleAssignMemberSelectText = selected;
    this.errorMsg = false;
  }

  handleCustomerSelect(member, selected: string) {
    this.handleAssigncustomerSelectText = "";
    this.handleAssigncustomerSelectText = selected;
    this.errorMsg = false;
  }

  isChecked(memberSelect) {
  }
  saveAssignMember(res) {
    if (this.assignMemberDetails !== "") {
      this.errorMsg = false;
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
    }
    //  else {
    //   return "../../../assets/images/avatar5.png";
    // }
  }

  buttonclicked(res) {
    this.dialogRef.close(res);
  }
  closetab() {
    this.dialogRef.close("");
  }
  autoGrowTextZone(e) {
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
      this.notesTextarea='';
      setTimeout(() => {
        const createNoteData: any = {
          note: this.notesTextarea
        };
        this.dialogRef.close(createNoteData);
      }, projectConstants.TIMEOUT_DELAY);
    }
  }
  saveCreateNote(notesValue: any) {
    console.log("notesValue", notesValue);
    if (this.notesTextarea !== undefined) {
      console.log("this.notesTextarea", this.notesTextarea);
      this.errorMsg = false;
      this.assignMemberErrorMsg = "";
      const createNoteData: any = {
        note: this.notesTextarea
      };
      console.log("createNoteData", createNoteData);
      console.log('this.leadUID',this.leadUID);
      this.dialogRef.close(createNoteData);
      // this.crmService.addLeadNotes(this.leadUID, createNoteData).subscribe(
      //   (response: any) => {
      //     if(response){
      //       console.log("response", response);
      //       setTimeout(() => {
      //         this.dialogRef.close(createNoteData);
      //       }, projectConstants.TIMEOUT_DELAY);
      //       this.snackbarService.openSnackBar("Remarks added successfully");
      //     }
          
      //   },
      //   error => {
      //     this.snackbarService.openSnackBar(error, {
      //       panelClass: "snackbarerror"
      //     });
      //   }
      // )
      
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
      const taskUID = this.data.taskName.taskUid;
      console.log("kkkkkk");
      this.crmService.taskStatusCloseDone(taskUID).subscribe(
        (res: any) => {
          const dialogRef = this.dialog.open(CrmMarkasDoneComponent, {
            width: "85%",
            panelClass: ["popup-class", "confirmationmainclass"],
            data: {
              requestType: "taskComplete",
              taskDetails: this.data
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
                this.snackbarService.openSnackBar("Sucessfully updated your status",{'panelClass': 'snackbarerror'})
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
  }
  handleleadMasterSelect(leadMaster, selected: string) {
    console.log("leadMaster", leadMaster);
    this.errorMsg = false;
    this.assignMemberErrorMsg = "";
  }
  saveTaskMaster(taskMasterValue) {
    console.log("taskMasterValue", taskMasterValue);
    if (taskMasterValue !== undefined) {
      this.dialogRef.close(taskMasterValue);

    } else if (this.newTask === "CreatE") {

      this.dialogRef.close("CreatE");

    }
  }
  saveLeadMaster(leadMasterValue) {
    console.log("leadMasterValue", leadMasterValue);
    if (leadMasterValue !== undefined) {
      this.dialogRef.close(leadMasterValue);
    } else if (this.newTask === "CreatE") {
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
  emailBox(email:any){
    console.log("email :", email);
  }
  pushnotifyData(pushnotify){
    console.log("pushnotify :", pushnotify);

  }
showCustomerView(customer){
  console.log("customerView :",customer)
     const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "50%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "customerView",
        customer: customer
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    })
}
showFileView(file){
  console.log("File View :",file)
  const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
   width: "50%",
   panelClass: ["commonpopupmainclass", "confirmationmainclass"],
   disableClose: true,
   data: {
     requestType: "fileView",
     file: file
   }
 });
 dialogRef.afterClosed().subscribe((res: any) => {
   if (res) {
   }
 })
}
  
  
  makeNone(makeNone){
    makeNone = [];
    this.newData = makeNone
  }
  remove(index) {
    console.log("ID :",index)
      this.customerList.splice(index, 1);
      this.customerArray.splice(index, 1);
  }
  removeNewCustomer(index){
      this.newCustomerList.splice(index, 1);
      this.customerArray.splice(index, 1);
  }
  

  handleDeptSelction(obj){
    this.showSelect=true;
    this.showInput=false;
    console.log("selected Data:",obj)
    const filter = { "id-eq": obj };
    const customer = this.newData.splice(this.newData.find(x => x.id === obj),1);
    console.log("customer reomve",customer)

    

    this.providerServiceObj.getCustomer(filter).subscribe((res)=>{
     
      this.selected_customer=res;
     
       
        const customer = this.newCustomerList.find(x => x.id === res[0].id);
        if (customer) {
          this.snackbarService.openSnackBar("Searched people already existed!",{'panelClass': 'snackbarerror'})
        } else {
          this.selected_customer.forEach((newElement)=>{
            console.log("New ELSE",newElement)
            this.newCustomerList.push(newElement)
            this.customerArray.push(newElement.id);
           

          })
        }
      
      console.log("Selected Customer :",this.selected_customer)
     
      
    })

  }

  searchCustomer(customers) {
    console.log("Dattt:", customers);
    this.customerData = customers;
    this.emptyFielderror = false;
    if (this.customerDetails === "") {
      this.emptyFielderror = true;
      this.snackbarService.openSnackBar(
        "Please select atleast one people",
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
            this.customerDetails + ",firstName-eq=" + this.customerDetails
          break;
         
           
          }
          
     
      this.providerServiceObj
        .getCustomer(post_data)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (data: any) => {
            this.customer_data = [];
            console.log("Customer dataaaa :", data);
            this.searchedData = data;
            
            if(data.length === 0 || data === undefined){
              this.snackbarService.openSnackBar("No matches found",{'panelClass': 'snackbarerror'})
            }
            if(data.length > 1){
              data.forEach((newElement)=>{
                console.log("multiple Data",newElement)
              this.showSelect=false;
              this.showInput = true;
              const customer = this.newData.find(x => x.id === newElement.id);
              if (customer) {
              } else {
                 this.newData.push(newElement)
              
              }
             
              })
            }
            if(data.length === 1){
                const customer = this.customerData.find(x => x.id === data[0].id);
                if (customer) {
                  this.snackbarService.openSnackBar("Searched people already existed!",{'panelClass': 'snackbarerror'})
                } else {
                  this.searchedData.forEach((newElement)=>{
                    console.log("New ELSE",newElement)
                    if(newElement && (newElement.firstName !== '' || newElement.firstName !== undefined) || (newElement.lastName !== '' || newElement.lastName !== undefined)){
                      this.showName = true
                      this.showEmail = false;
                      this.showId = false;
                    }
                    if(newElement && (newElement.firstName === '' || newElement.firstName === undefined ) && (newElement.lastName === '' || newElement.lastName === undefined)){
                      this.showEmail = true
                      this.showId = false;
                      this.showName = false
                    }
                    if(newElement && (newElement.firstName === '' || newElement.firstName === undefined ) && (newElement.lastName === '' || newElement.lastName === undefined) && (newElement.email === '' || newElement.email === undefined)){
                      this.showId = true;
                      this.showName = false
                      this.showEmail = false;
                      
                    }
                    this.newData = []
                    this.customerList.push(newElement)
                    this.customerArray.push(newElement.id);
                  })
                }
          }
            
            if (data.length === 0) {
              this.show_customer = false;
              this.create_customer = true;
            } else {
              if (data.length > 1) {
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
                this.jaldeeId = this.customer_data.firstNameValue
              }
            }
          },

          
          error => {
           
          }
        );
    }
  }

  getCustomerDetail(customer) {
    console.log("Customerrrrr...", customer);
   
    let newData = [];
    newData = this.customerData;
    
    console.log("Data From:", newData);
    if (customer.id !== this.customerData) {
      setTimeout(() => {
        console.log("aftergetCustomer..", customer);
        this.dialogRef.close(customer);
      }, projectConstants.TIMEOUT_DELAY);
    } else {
      this.snackbarService.openSnackBar("Already existed!", {
        panelClass: "snackbarerror"
      });
    }
  }
  shareFileToConsumerOrProvider() {
    if(!this.email && !this.pushnotify){
      this.snackbarService.openSnackBar("Share via options are not selected", {
        panelClass: "snackbarerror"
      });
    }
    else{
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
    const attachments = [];

    attachments.push(this.data.file.id);

    console.log(
      "ProviderConsumer :",
      this.fileArray,
      "File Id :",
      attachments[0]
    );
    if(this.fileArray === '' || attachments[0] === ''){
      this.snackbarService.openSnackBar("please select atleast one people", {
        panelClass: "snackbarerror"
      });
    }
    const communication = {
     
      'medium': {
        'email': this.email,
        'pushNotification': this.pushnotify,
      },
      'communicationMessage': this.message
    };
    console.log("Communication Mode :",communication)
    let dataToSend = new FormData();
    const newBlobArray = new Blob([JSON.stringify(this.fileArray, null, 2)], {
      type: "application/json"
    });
    dataToSend.append("sharedto", newBlobArray);
    const newBlob = new Blob([JSON.stringify(attachments, null, 2)], {
      type: "application/json"
    });
    dataToSend.append("attachments", newBlob);
    const newBlobCommunication = new Blob([JSON.stringify(communication, null, 2)], {
      type: "application/json"
    });
    dataToSend.append("communication", newBlobCommunication);

    
    this.providerServiceObj.shareProviderFiles(dataToSend).subscribe(
      res => {
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

  transform(seacrchFilterEmployee){
    console.log('assignMemberDetails',this.seacrchFilterEmployee) 
  }
  noRejected(){
    this.dialogRef.close('cancel')
  }
  yesRejected(){
    this.dialogRef.close('reject')
  }
  noRemove(){
    this.dialogRef.close('cancel')
  }
  yesRemove(){
    this.dialogRef.close('remove')
  }
  }
