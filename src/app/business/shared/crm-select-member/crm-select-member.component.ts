import { Component, Inject, OnInit } from '@angular/core';
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

  constructor( public dialogRef: MatDialogRef<CrmSelectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private crmService: CrmService,
    ) {
      console.log('consdata',this.data)
     }
    

  ngOnInit(): void {
    // this.crmService.getMemberList().subscribe((data:any)=>{
    //   console.log(data)
    // })
    this.data.memberList[0].forEach((item:any)=>{
      console.log('item',item)
      this.memberList.push(item)
    })
    console.log('this.memberList',this.memberList)
    console.log('this.data.assignMembername',this.data.assignMembername)
    this.assignMemberDetails= this.data.assignMembername
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

  buttonclicked(res) {
    this.dialogRef.close(res)
}
closetab(){
    this.dialogRef.close('')
}

}
