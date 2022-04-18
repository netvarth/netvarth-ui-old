import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CrmService } from '../../modules/crm/crm.service';
import { projectConstants } from '../../../../../src/app/app.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
// import {  Router } from '@angular/router';

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
  public taskDes:any;
  public actualDurationValue:any;
  public actualResultValue:any;
  public actualPotentialValue:any;
  public taskUid:any;

  constructor( public dialogRef: MatDialogRef<CrmMarkasDoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crmService: CrmService,
    private snackbarService: SnackbarService,
    // private router: Router,
    ) {
     } 
     ngOnInit() {
       console.log(' this.taskDes= this.data.taskName.title', this.data)
      this.msg = this.data.msg;
      if(this.data.requestType==='taskComplete'){
        this.taskDes= this.data.taskDetails.taskName.title;
        this.taskUid= this.data.taskDetails.taskName.taskUid
      }
    }
    public closeDialog() {
      this.dialogRef.close();
    }
    hamdleActualDuration(value){
      console.log('value',value)
      console.log('actualDuration',this.actualDurationValue)

    }
    hamdleActualResult(resValue){
      console.log('resValue',resValue)

    }
    hamdleActualPotential(resValue){
      console.log('resValue',resValue)
    }
    completeTask(){
      console.log('this.actualDurationValue',this.actualDurationValue);
      console.log('this.actualResultValue',this.actualResultValue);
      console.log('this.actualPotentialValue',this.actualPotentialValue);
      if(this.data.requestType==='taskComplete'){
        const afterCompleteAddTaskData:any = {
          "actualResult":this.actualResultValue,
          "actualPotential":this.actualPotentialValue,
          "closingNote":this.actualDurationValue
        }
        console.log('afterCompleteAddTaskData',afterCompleteAddTaskData)
        this.crmService.addTaskClosingDetails( this.taskUid,afterCompleteAddTaskData).subscribe((response:any)=>{
          setTimeout(() => {
            console.log('aftercreateTaskcompleteion',response)
            this.dialogRef.close()
          // this.router.navigate(['provider', 'task']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        (error)=>{
          this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
        })
      }
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
