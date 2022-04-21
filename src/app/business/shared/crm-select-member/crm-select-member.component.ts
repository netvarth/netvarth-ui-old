import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
import { CrmService } from '../../modules/crm/crm.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { projectConstants } from '../../../../../src/app/app.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
// import { FormBuilder } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { Router } from '@angular/router';
import { CrmMarkasDoneComponent } from '../../shared/crm-markas-done/crm-markas-done.component';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  selector: 'app-crm-select-member',
  templateUrl: './crm-select-member.component.html',
  styleUrls: ['./crm-select-member.component.css']
})
export class CrmSelectMemberComponent implements OnInit {
  public memberList:any=[]
  public assignMemberDetails:any;
  public handleAssignMemberSelectText:string='';
  public assignMemberErrorMsg:string='';
  public errorMsg:boolean=false
  public assignMemberForm:any;
  //for notes variable
  public notesTextarea:any;
  public noteDescription:any;
  public noteDescriptionTime:any;
  public taskDes:any;
  //for status change variable
  public taskDescription:any;
  public taskTitle:any;
  public taskProgress:any;
  public status:any;
  public height:any='100'
  public assigneeName:any;
  public managerName:any;
  public priorityName:any;
  public lastUpdate:any;
  public currentStatus:any;
  public taskStatusList:any=[];
  public selectedStatusId:any;
  public selectedStatusUID:any;
  public selectText:any;
  public showHideTickMark:boolean=false;
  public statusId:any;
  public statusChange:any;
  public showHideTickMarkUpdate:boolean=false
  public selectedStatus:any;
  //notes variable
  public allNotes:any=[];
  //upload file variabe
  public allFilesDes:any=[]
  public  customer_label:any = '';
  public provider_label:any=''
  //task master list variable 
  public taskMasterListData:any;
  public assignTaskMaster:any;





  constructor( public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crmService: CrmService,
    // private fb: FormBuilder,
    private snackbarService: SnackbarService,
    // private _Activatedroute:ActivatedRoute,
      // private router: Router,
      // private createTaskFB: FormBuilder,
      private dialog: MatDialog,
      // private datePipe:DatePipe,
      private wordProcessor: WordProcessor,
      private groupService:GroupStorageService
    ) {
      console.log('consdata',this.data)
      // this.assignMemberDetails= this.data.assignMembername
      // console.log('this.assignMemberDetails',this.assignMemberDetails);
     }
    

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log("User is :", user);
        // this.assignMemberDetails= (user.id);
    if(this.data.requestType==='createtaskSelectMember' || this.data.requestType==='createtaskSelectManager' ){
      this.data.memberList[0].forEach((singleMember:any)=>{
        // console.log('singleMember',singleMember)
        if(singleMember.userType==='PROVIDER'){
        // console.log('this.data.assignMembername',this.data.updateAssignMemberId)
        this.memberList.push(singleMember)
        if(this.data.requestType==='createtaskSelectMember'){
          if(singleMember.id==this.data.updateAssignMemberId){
            if(this.crmService.taskActivityName==='Update'){
              this.assignMemberDetails=singleMember;
              // this.assignMemberDetails = this.data.updateSelectedMember;
            }
            else{
              this.assignMemberDetails = this.data.updateSelectedMember;
            }
          }
        }
        else if(this.data.requestType==='createtaskSelectManager'){
          if(singleMember.id==this.data.updateManagerId){
            if(this.crmService.taskActivityName==='Update'){
              this.assignMemberDetails=singleMember;
            }
            else{
              this.assignMemberDetails = this.data.updateSelectTaskManager;
            }
          }
        }
        }
        
      })
    }
    if(this.data.requestType==='createUpdateNotes'){
      console.log('createUpdateNotes');
    }
    if(this.data.requestType==='noteDetails'){
      console.log('Notews')
      this.allNotes.push(this.data.noteDetails.notes)
      console.log(' this.allNotes', this.allNotes)
      this.noteDescription = this.data.noteDetails.note;
      this.noteDescriptionTime = this.data.noteDetails.createdDate;
    }
    if(this.data.requestType==='taskComplete'){
      console.log('this.data',this.data)
      this.taskDes= this.data.taskName.title
    }
    if(this.data.requestType==='statusChange'){
      console.log('statusChangeeeeeeeee')
      this.taskDescription= this.data.taskDetails.description;
      this.taskTitle = this.data.taskDetails.title;
      this.taskProgress= this.data.taskDetails.progress;
      this.status= this.data.taskDetails.status.name;
      this.assigneeName = this.data.taskDetails.assignee.name;
      this.managerName= this.data.taskDetails.manager.name;
      this.priorityName= this.data.taskDetails.priority.name;
      this.lastUpdate = this.data.taskDetails.dueDate;
      this.currentStatus=this.data.taskDetails.status.name;
      this.getTaskStatusListData()
      this.selectedStatusUID= this.data.taskDetails.taskUid;
      this.statusId= this.data.taskDetails.status.id
      console.log('this.statusssssssssss',this.status);
      console.log('this.statusChange',this.statusChange)
      this.showHideTickMarkUpdate=true;
      this.selectedStatusId=  this.statusId;
    }
    if(this.data.requestType==='uploadFilesDesciption'){
      console.log('uploadFilesDesciption')
      this.allFilesDes.push(this.data.filesDes)
    }
    if(this.data.requestType==='taskMasterList'){
    //  this.getTaskmaster()
    this.taskMasterListData= this.data.taskMasterFullList[0];
      console.log('TaskMasterList.............',this.taskMasterListData)
    }
    // console.log('this.assignMemberDetails',this.assignMemberDetails);
    // console.log('this.memberList',this.memberList)
    // console.log('this.data.assignMembername',this.data.assignMembername);
    // console.log('updateSelectedMember',this.data.updateSelectedMember)
  }
  handleMemberSelect(member,selected:string){
    this.handleAssignMemberSelectText=''
    // console.log(selected)
    // console.log(member)
    this.handleAssignMemberSelectText=selected;
    this.errorMsg=false

  }
  isChecked(memberSelect){
    // console.log('memberselect',memberSelect)
  }
  saveAssignMember(res){
    if(this.assignMemberDetails !==''){
      // console.log('response',res)
      this.errorMsg=false;
      // console.log('assignMemberDetails',this.assignMemberDetails)
      this.dialogRef.close(res)
    }
    else{
      if(this.assignMemberDetails ===''){
        this.errorMsg=true;
        this.assignMemberErrorMsg='Please select assign member'
      }
      
    }
    

  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    } else {
      return '../../../assets/images/avatar5.png';
    }
  }

  buttonclicked(res) {
    // console.log('res',res)
    this.dialogRef.close(res)
}
closetab(){
    this.dialogRef.close('')
}
autoGrowTextZone(e) {
  // console.log('textarea',e)
  e.target.style.height = "0px";
  e.target.style.height = (e.target.scrollHeight + 15)+"px";
}
handleNotesDescription(textValue:any){
  console.log('taskDescription',textValue)
  if(textValue != undefined){
    this.errorMsg=false;
    this.assignMemberErrorMsg=''
  }else{
    this.errorMsg=true;
    this.assignMemberErrorMsg='Please enter some description'
  }
}
saveCreateNote(notesValue:any){
  console.log('notesValue',notesValue)
  if(this.notesTextarea !==undefined){
    console.log('this.notesTextarea',this.notesTextarea);
    this.errorMsg=false;
    this.assignMemberErrorMsg='';
    const createNoteData:any = {
      "note" :this.notesTextarea
    }
      console.log('createNoteData',createNoteData)
    this.crmService.addNotes(this.data.taskUid,createNoteData).subscribe((response:any)=>{
      console.log('response',response)
      setTimeout(() => {
        this.dialogRef.close(notesValue)
      }, projectConstants.TIMEOUT_DELAY);
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
    
  }
  else{
    this.errorMsg=true;
        this.assignMemberErrorMsg='Please enter some description'
  }
}
completeTask(){
  console.log('this.data..',this.data)
  console.log('this.data.taskName.taskUid',this.data.taskName.taskUid)
  console.log('jjj')
  if(this.data.requestType==='taskComplete'){
    // this.router.navigate(['provider', 'task',]);
    const taskUID=this.data.taskName.taskUid
    console.log('kkkkkk')
    this.crmService.taskStatusCloseDone(taskUID).subscribe((res:any)=>{
      console.log('res................',res)
      // setTimeout(() => {
      //   this.dialogRef.close()
      // }, projectConstants.TIMEOUT_DELAY);
      const dialogRef= this.dialog.open(CrmMarkasDoneComponent,{
        width: '85%',
        panelClass: ['popup-class', 'confirmationmainclass'],
        data:{
          requestType:'taskComplete',
          taskDetails:  this.data,
          // taskUid:this.data.taskName.taskUid
        }
      })
      dialogRef.afterClosed().subscribe((res)=>{
        this.dialogRef.close('Completed')
        console.log('res',res);
      })
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      this.dialogRef.close()
      
    }
    )
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
getTaskStatusListData(){
  this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
    console.log('taskStatus',taskStatus);
    this.taskStatusList.push(taskStatus);
    console.log('this.taskStatusList',this.taskStatusList)
  },
  (error)=>{
    this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
  })
}
selectStatus(statusDetails){
  this.showHideTickMark=true;
  console.log('statusDetails',statusDetails)
  this.selectedStatusId= statusDetails.id
  this.status= statusDetails.name;
  this.selectText=''
  this.showHideTickMarkUpdate=false;
  if(this.statusId === statusDetails.id){
    this.selectText='Alredy updated'
  }
  else{
    this.selectText=''
  }
}
completeTaskStatus(){
  // this.selectText=''
  console.log('this.selectedStatusId',this.selectedStatusId)
  if(this.statusId === this.selectedStatusId){
    this.selectText='Alredy updated'
  }
  else{
    if(this.selectedStatusId != undefined){
      this.crmService.addStatus( this.selectedStatusUID,this.selectedStatusId).subscribe((response)=>{
        console.log('response',response)
        setTimeout(() => {
          this.dialogRef.close( this.status);
          this.showHideTickMark=false
        }, projectConstants.TIMEOUT_DELAY);
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
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
    getTaskmaster(){
      this.crmService.getTaskMasterList().subscribe((response)=>{
        console.log('TaskMasterList :',response);
      })
    }
    handleTaskMasterSelect(taskMaster,selected:string){
      console.log('taskMaster',taskMaster);
      console.log('this.assignTaskMaster',this.assignTaskMaster)
      this.errorMsg=false;
      this.assignMemberErrorMsg=''
    }
    saveTaskMaster(taskMasterValue){
      console.log('taskMasterValue',taskMasterValue)
      if(taskMasterValue !==undefined){
        // console.log('response',res)
        this.errorMsg=false;
        // console.log('assignMemberDetails',this.assignMemberDetails)
        this.dialogRef.close(taskMasterValue)
      }
      else{
          this.errorMsg=true;
          this.assignMemberErrorMsg='Please select task master'
        
      }
    }
    createTask(createText: any){
      this.crmService.taskActivityName = createText;
      // if(createText !==undefined){
        this.dialogRef.close(createText)
        // this.router.navigate(['provider', 'task', 'create-task'])
      // }
      // this.dialogRef.close(createText)
      
    }
    closeDialog(coseText){
      this.dialogRef.close(coseText)
    }
    
}
