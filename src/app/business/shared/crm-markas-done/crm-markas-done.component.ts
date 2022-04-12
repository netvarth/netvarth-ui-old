import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crm-markas-done',
  templateUrl: './crm-markas-done.component.html',
  styleUrls: ['./crm-markas-done.component.css']
})
export class CrmMarkasDoneComponent implements OnInit {
  api_error: any;
  api_success: string;
  acc_status;
  statusTo: string;
  disableConfirmbtn = false;
  msg;
  public memberList:any=[]
  public assignMemberDetails:any;
  public handleAssignMemberSelectText:string='';
  public assignMemberErrorMsg:string='';
  public errorMsg:boolean=false
  public assignMemberForm:any;

  constructor( public dialogRef: MatDialogRef<CrmMarkasDoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
     } 
     ngOnInit() {
      this.msg = this.data.msg;
    }
    public closeDialog() {
      this.dialogRef.close();
    }
    // onConfirm() {
    //   this.api_error = '';
    //   this.api_success = '';
    //   this.disableConfirmbtn = true;
    //   this.accountService.changeStatusRealAccount(this.data.id,this.changeStatus)
    //   .subscribe(
    //     data => {
    //       this.api_success = 'Updated Successfully';
    //       setTimeout(() => {
    //         this.dialogRef.close('reloadlist');
    //         }, 2000);
    //       },
    //    (error) => {
    //     this.disableConfirmbtn = false;
    //     this.api_error = error.error;
    //     }
    //   );
  
    // }
}
