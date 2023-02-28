import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { ActivatedRoute, Router , NavigationExtras} from '@angular/router';
import { CrmService } from '../../crm.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from "../../../../../shared/services/snackbar.service";
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
import { SharedServices } from '../../../../../shared/services/shared-services';
import { CrmProgressbarComponent } from '../../../../../../../src/app/business/shared/crm-progressbar/crm-progressbar.component';
import { SelectAttachmentComponent } from '../../tasks/view-task/select-attachment/select-attachment.component';
import { ProviderServices } from '../../../../../../../src/app/business/services/provider-services.service';
import { WordProcessor } from '../../../../../../../src/app/shared/services/word-processor.service';
@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.css']
})
export class ViewLeadComponent implements OnInit {
tooltipcls = '';
select_cap = Messages.SELECT_CAP;
public customer_label:any;
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
no_leads_cap = Messages.AUDIT_NO_TASKS_CAP;
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
  'date': false
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
leadList: any = [];
detailedLeadData :any;
waitlist_history :any;
connected_with :any;
selectedIndex;
leadUid: any;
leadDetails: any;

action: any;
//notes variable start
  public notesText:any;
  public notesList:any=[]
  uploaded_attachments: any;
  updateLeadData:any;
  leadkid: any;
  leadType: any;
  cusDetails:any=[]
  leadTokens:any=[]
  parentUid: any;
  public headerName:string='Lead Overview'
  public apiloading:any= true;
  public availableDates: any = [];
  public minDate:any=new Date();
  public ddate:any;
  showCustomers = false;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  //form variable start
  public createLeadForm:any;
  filteredCustomers:any;
  public leadError:null;
  public selectMember:any;
  public categoryListData:any=[];
  public allMemberList:any=[];
  public leadTypeList:any=[];
  public leadStatusList:any=[];
  public leadPriorityList:any=[];
  public userType:any;
  public locationName:any;
  public areaName:any;
  public locationId:any;
  public leadDueDate:any;
  public leadDueTime:any;
  public leadDueDays:any;
  public leadDueHrs:any;
  public leadDueMin:any;
  public selectedDate:any;
  public leadErrorText:any;
  public boolenLeadError:boolean=false;
  public assigneeId:any;
  public selectedTime:any;
  public selectLeadManger:any;
  public selectLeadMangerId:any;
  public selectLeadCustomer:any;
  public createBTimeField:boolean=false;
  public updateBTimefield:boolean=false;
  public dayGapBtwDate:any;
  public hour:any;
  public minute:any;
  customer_count: any = 0;
  //update variable;
  public updateValue:any;
  public updateTitleLead:any;
  public lead:any;
  public selectHeader:any;
  public updateUserType:any;
  public updateMemberId:any;
  public updateManagerId:any;
  public updateLeadId:any;
  public updteLocationId:any;
  public minTime=new Date().getTime();
  public bEstDuration:boolean=false;
  public updateAssignMemberDetailsToDialog:any;
  public updateSelectLeadMangerDetailsToDialog:any;
  public sel_loc:any;
  leadStatusModal: any;
  leadPriority: any;
  public estDurationWithDay:any;
  public estTime:any;
  estDurationWithTime: any;
  customer: any;
  customers: any = [];
  loadComplete: boolean;
  selectLeadCustomerId: any;
  searchby = '';
  form_data: any;
  emptyFielderror = false;
  create_new = false;
  qParams: {};
  prefillnewCustomerwithfield = '';
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
  leadMasterData: any;
  public innerWidth:any;
  public customerInfoError:any='';
  public editable:boolean=true;
  //new ui
  public customerName:string;
  public customerId:any;
  public leadId:any;
  public customerAssigneeName:any;
  public leadTitle:any;
  public redirectionListStatus: any = [
    {
      id: 3,
      activityName: 'KYC Details'
    },
    {
      id: 4,
      activityName: 'CRIF'
    },
    {
      id: 5,
      activityName: 'Sales Verification'
    },
    {
      id: 6,
      activityName: 'Login'
    },
  ]
  public notesTextarea:any;
  failedStatusId:any;
constructor(
  private locationobj: Location,
   private crmService: CrmService,
   private provider_services: ProviderServices,
  public _location: Location,public dialog: MatDialog,
  private _Activatedroute:ActivatedRoute,
  private router: Router,
  public shared_services: SharedServices,
  private snackbarService: SnackbarService,
  private wordProcessor: WordProcessor,
) {
}

ngOnInit(): void {
  this.api_loading = false;
  this._Activatedroute.paramMap.subscribe(params => { 
    this.leadUid = params.get('id');
    console.log("lead id : ",this.leadUid);
    this.crmService.getLeadDetails(this.leadUid).subscribe(data => {
    
      this.leadDetails = data;
      console.log('this.leadDetails',this.leadDetails)
      this.leadkid = this.leadDetails.uid
      this.api_loading = false;
      this.getLeadToken();
    
      console.log('leadDetails.status',this.leadDetails.status.name)
      // console.log('this.leadDetails.notes',this.leadDetails.notes)
      this.leadDetails.notes.forEach((notesdata:any)=>{
        this.notesList.push(notesdata)
      })
      console.log('this.notesList',this.notesList)
      //new ui start
      this.customerName= this.leadDetails.customer.name;
      this.leadId= this.leadDetails.id;
      this.customerAssigneeName= this.leadDetails.assignee.name;
      this.leadTitle = this.leadDetails.title
  })
  })
   this.updateLeadData=this.crmService.leadToCraeteViaServiceData ;
 
  this._Activatedroute.queryParams.subscribe(qparams => {
    if (qparams.parentUid) {
        this.parentUid = qparams.parentUid;
    }
  });
  
this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
this.leadStatus()
}

uploadFiles() {
  const dialogRef = this.dialog.open(SelectAttachmentComponent, {
    panelClass: ['popup-class', 'confirmationmainclass'],
      disableClose: true,
      data: {
          source: "Lead",
          leaduid : this.leadUid
      }
  });
  dialogRef.componentInstance.sendInput.subscribe(
    (dataToSend: any)=> {
      this.api_loading = true;
      this.shared_services.addfiletolead(this.leadUid, dataToSend).subscribe(
              () => {                 
                console.log("Sending Attachment Success");
                dialogRef.close();
                this.api_loading = false;
              // _this.snackbarService.openSnackBar("Sending Attachment Successfully");
               
              },
              error => {
                this.api_loading=false;
                // reject(error);
                this.snackbarService.openSnackBar(
                  error,
                  { panelClass: "snackbarerror" }
                );
              }
            );
    }
  )
  dialogRef.afterClosed().subscribe((res)=>{
    // this.api_loading = true;
    // setTimeout(() => {
    // this.ngOnInit();
    // this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { 'panelClass': 'snackbarnormal' });
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
  })
  this.getLeadDetails();

}
getLeadDetails(){
  this.crmService.getLeadDetails(this.leadUid).subscribe(data => {
    this.leadDetails = data;
    // console.log('attdata',data)
    this.leadkid = this.leadDetails.id
    if(this.leadDetails.notes.length>0){
      this.leadDetails.notes.forEach((notesdata:any)=>{
        this.notesList.push(notesdata)
      })
    }
   
})
  
}
openEditLead(leaddata: any, editText: any) {
  this.crmService.leadToCraeteViaServiceData = leaddata
  const newLeadData = this.crmService.leadToCraeteViaServiceData
  setTimeout(() => {
    this.crmService.leadActivityName = editText;
    newLeadData;
    this.router.navigate(['provider', 'lead', 'create-lead']);
  }, projectConstants.TIMEOUT_DELAY);

}
markAsDone(leadid){
  const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
    width:'100%',
    panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
    disableClose: true,
    data:{
      requestType:'leadComplete',
      leadName:this.leadDetails,
    }
  });
  dialogRef.afterClosed().subscribe((res)=>{
    console.log(res)
    // this.getLeadDetails();
    if(res==='Cancel'){
      setTimeout(() => {
        this.api_loading = false;
        this.ngOnInit();
        // this.getTaskDetails();
      }, projectConstants.TIMEOUT_DELAY);
      }
    this.api_loading = true;
    setTimeout(() => {
      this.api_loading = false;
      this.ngOnInit();
      // this.getTaskDetails();
    }, projectConstants.TIMEOUT_DELAY);
  })

}
chnageStatus(){
  console.log('openDialogStatusChange',this.leadDetails)
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'statusChange',
        leadDetails:this.leadDetails,
      }
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      if(res==='Cancel'){
        setTimeout(() => {
          this.api_loading = false;
          this.ngOnInit();
          // this.getTaskDetails();
        }, projectConstants.TIMEOUT_DELAY);
        }
      else{
        console.log('resssssssss',res);
      this.api_loading = true;
      setTimeout(() => {
        this.api_loading = false;
        this.ngOnInit();
        // this.getTaskDetails();
      }, projectConstants.TIMEOUT_DELAY);
      // this.ngOnInit()
      }
    })
}
handleNotesDescription(textValue:any){
  console.log('taskDescription',textValue)
  
}
saveCreateNote(notesValue:any){
  console.log('notesValue',notesValue)
  console.log('this.notesTextarea',this.notesTextarea);
  if(this.notesTextarea !==undefined){
   
    const createNoteData:any = {
      "note" :this.notesTextarea
    }
      console.log('createNoteData',createNoteData)
      this.crmService.addNotes(this.leadDetails.taskUid,createNoteData).subscribe((response:any)=>{
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
}
autoGrowTextZone(e) {
  // console.log('textarea',e)
  e.target.style.height = "0px";
  e.target.style.height = (e.target.scrollHeight + 15)+"px";
}


createSubLead(leadid)
{
  this.router.navigate(['provider', 'lead','create-sublead',leadid]);
}


goback() {
  this.locationobj.back();
}

getformatedTime(time) {
  let timeDate;
  timeDate = time.replace(/\s/, 'T');
  return timeDate;
}

do_search(pagecall, status?) {
  this.endminday = this.auditStartdate;
  this.auditStatus = 1;
  if (status === 'ackStatus') {
    if (this.ackStatus === true) {
      if (this.auditSelAck.indexOf('true') === -1) {
        this.auditSelAck.push('true');
      }
    } else {
      this.auditSelAck.splice(this.auditSelAck.indexOf('true'), 1);
    }
  }
  if (status === 'notAckStatus') {
    if (this.notAckStatus === true) {
      if (this.auditSelAck.indexOf('false') === -1) {
        this.auditSelAck.push('false');
      }
    } else {
      this.auditSelAck.splice(this.auditSelAck.indexOf('false'), 1);
    }
  }
  if (pagecall === false) {
    this.startpageval = 1;
    this.holdauditSelAck = this.auditSelAck.join(',');
    this.holdauditStartdate = this.auditStartdate;
    this.holdauditEnddate = this.auditEnddate;
  }
  let startseldate = '';
  let endseldate = '';


  if (endseldate !== '' || startseldate !== '' || this.notAckStatus || this.ackStatus) {
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
    'date': false
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
      'date': false
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
goBack()
{
  this._location.back();
}

//notes start
openAddNoteDialog(addNoteText:any){
  console.log('addNoteText',addNoteText);
  const dialogRef = this.dialog.open(CrmSelectMemberComponent,{
    width:'100%',
    panelClass: ['popup-class', 'confirmationmainclass'],
    data:{
      requestType:'createUpdateNotes',
      source:"Lead",
      header:'Remarks',
      leadUid:this.leadUid,
    }
  })
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
  // dialogRef.afterClosed().subscribe((response)=>{
  //   this.notesText=response;
  //   console.log('response',response)
  //   this.api_loading = true;
  //   setTimeout(() => {
  //     this.api_loading = false;
  //     this.ngOnInit();
  //     }, projectConstants.TIMEOUT_DELAY);
  // })

}
attatchmentDialog(filesDes:any){
  console.log('flels',filesDes);
  const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
    width:'100%',
    panelClass: ['popup-class', 'confirmationmainclass'],
    data:{
      requestType:'uploadFilesDesciption',
      filesDes:filesDes,
      // header:'Notes',
      // leadUid:this.leadUid,
    }
  })
  dialogRef.afterClosed().subscribe((response:any)=>{
    console.log('response',response)
    this.api_loading = true;
    setTimeout(() => {
      this.api_loading = false;
      this.ngOnInit();
      // this.getTaskDetails();
    }, projectConstants.TIMEOUT_DELAY);
  })

}
noteView(noteDetails:any){
  console.log('notedetails',noteDetails);
  const dialogRef = this.dialog.open(CrmSelectMemberComponent,{
    width:'100%',
    panelClass: ['popup-class', 'confirmationmainclass'],
    data:{
      requestType:'noteDetails',
      header:'Note Details',
      noteDetails:noteDetails,
    }
  })
  dialogRef.afterClosed().subscribe((response:any)=>{
    this.api_loading = true;
    setTimeout(() => {
      this.api_loading = false;
      this.ngOnInit();
      // this.getTaskDetails();
    }, projectConstants.TIMEOUT_DELAY);
    this.getLeadDetails();
    console.log('response',response)
  })

}
progressbarDialog(){
  const dialogRef = this.dialog.open(CrmProgressbarComponent,{
    width:'100%',
    panelClass: ['popup-class', 'confirmationmainclass'],
    data:{
      source : "Lead",
      details: this.leadDetails,
      leadUid:this.leadUid,
    }
  })
  dialogRef.afterClosed().subscribe((response)=>{
    console.log('responseDataAboutNote',response);
    this.getLeadDetails();
    this.notesText=response;
    this.notesList.push()
  })

}


// openDialogStatusChange(leadData:any){
//   console.log('openDialogStatusChange',leadData)
//   const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
//     width:'100%',
//     panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
//     disableClose: true,
//     data:{
//       requestType:'statusChange',
//       leadDetails:leadData,
//     }
//   });
//   dialogRef.afterClosed().subscribe((res:any)=>{
//     console.log('resssssssss',res);
//   })
// }

openDialogStatusChange(leadData:any){
  console.log('openDialogStatusChange',leadData)
  const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
    width:'100%',
    panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
    disableClose: true,
    data:{
      requestType:'LeadstatusChange',
      leadDetails:leadData,
    }
  });
  dialogRef.afterClosed().subscribe((res:any)=>{
    if(res==='Cancel'){
      setTimeout(() => {
        this.api_loading = false;
        this.ngOnInit();
        // this.getTaskDetails();
      }, projectConstants.TIMEOUT_DELAY);
      }
    else{
      console.log('resssssssss',res);
    this.api_loading = true;
    setTimeout(() => {
      this.api_loading = false;
      this.ngOnInit();
      // this.getTaskDetails();
    }, projectConstants.TIMEOUT_DELAY);
    // this.ngOnInit()
    }
  })
}
createToken(){
  const filter = { 'id-eq': this.leadDetails.customer.id };
  this.provider_services.getCustomer(filter).subscribe(data => {
    this.cusDetails = data;
    // console.log('attdata',data)
    const navigationExtras: NavigationExtras = {
      queryParams: {
        details: this.cusDetails[0].id,
        lead_type: 'lead',
        lead_id : this.leadDetails.id,
        lead_uid : this.leadDetails.uid
      }
    };
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
     
})
}
getLeadToken(){
  this.crmService.getLeadTokens(this.leadDetails.uid).subscribe(data => {
    this.leadTokens = data;
  
})
}
goCheckinDetail(id){
  this.router.navigate(['provider', 'check-ins', id]);
}
leadStatus(){
  this.crmService.getLeadStatus().subscribe((response:any)=>{
    console.log(response);
    this.failedStatusId= response[3].id
    console.log('this.failedStatusId',this.failedStatusId)
  })
}
failedStatus(){
  this.crmService.addLeadStatus(this.leadDetails.uid,this.failedStatusId).subscribe((response)=>{
    console.log('afterupdateFollowUpData',response);
    setTimeout(() => {
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


