import { Component, Inject, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { CrmService } from '../../modules/crm/crm.service';
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
    // private crmService: CrmService,
    // private fb: FormBuilder,
    ) {
      console.log('consdata',this.data)
      // this.assignMemberDetails= this.data.assignMembername
      console.log('this.assignMemberDetails',this.assignMemberDetails);
     }
    

  ngOnInit(): void {
    // this.assignMemberForm= this.fb.group({
    //   member:[]
    // })
    this.data.memberList[0].forEach((singleMember:any)=>{
      // console.log('singleMember',singleMember)
      this.memberList.push(singleMember)
      // if(this.data.assignMembername ==(singleMember.firstName + singleMember.lastName) ){
      //   this.assignMemberDetails=this.data.assignMembername 
      // }
    })
    console.log('this.assignMemberDetails',this.assignMemberDetails);
    console.log('this.memberList',this.memberList)
    console.log('this.data.assignMembername',this.data.assignMembername)
    // this.assignMemberDetails= this.data.assignMembername
  }
  handleMemberSelect(member,selected:string){
    this.handleAssignMemberSelectText=''
    console.log(selected)
    console.log(member)
    this.handleAssignMemberSelectText=selected;
    this.errorMsg=false

  }
  isChecked(memberSelect){
    // console.log('memberselect',memberSelect)
  }
  saveAssignMember(res){
    if(this.handleAssignMemberSelectText==='Selected'){
      console.log('response',res)
      this.dialogRef.close(res)
    }
    else{
      this.errorMsg=true;
      this.assignMemberErrorMsg='Please select assign member'
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
    this.dialogRef.close(res)
}
closetab(){
    this.dialogRef.close('')
}

}
