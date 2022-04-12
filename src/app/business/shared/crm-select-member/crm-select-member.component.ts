import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
import { CrmService } from '../../modules/crm/crm.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { projectConstants } from '../../../../../src/app/app.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';

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


  constructor( public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crmService: CrmService,
    // private fb: FormBuilder,
    private snackbarService: SnackbarService,
    ) {
      console.log('consdata',this.data)
      // this.assignMemberDetails= this.data.assignMembername
      // console.log('this.assignMemberDetails',this.assignMemberDetails);
     }
    

  ngOnInit(): void {
    if(this.data.requestType==='createtaskSelectMember' || this.data.requestType==='createtaskSelectManager' ){
      this.data.memberList[0].forEach((singleMember:any)=>{
        // console.log('singleMember',singleMember.id)
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
      })
    }
    if(this.data.requestType==='createUpdateNotes'){
      console.log('createUpdateNotes');
    }
    if(this.data.requestType==='noteDetails'){
      console.log('Notews')
      this.noteDescription = this.data.noteDetails.note;
      this.noteDescriptionTime = this.data.noteDetails.createdDate;
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
}