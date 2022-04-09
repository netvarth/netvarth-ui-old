import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
import { CrmService } from '../../modules/crm/crm.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor( public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crmService: CrmService,
    // private fb: FormBuilder,
    ) {
      console.log('consdata',this.data)
      // this.assignMemberDetails= this.data.assignMembername
      // console.log('this.assignMemberDetails',this.assignMemberDetails);
     }
    

  ngOnInit(): void {
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

}
