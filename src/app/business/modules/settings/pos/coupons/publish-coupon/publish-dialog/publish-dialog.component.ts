import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProviderServices } from '../../../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../../shared/services/word-processor.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ConfirmBoxComponent } from '../../../../../../../shared/components/confirm-box/confirm-box.component';
import { SubSink } from 'subsink';




@Component({
  selector: 'app-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.css']
})
export class PublishDialogComponent implements OnInit {
  public publishForm: FormGroup;
  couponId: any;
  coupon: any;
  api_error='';
  api_success='';
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  private subscriptions = new SubSink();
  publishFromrequired=false;
  startdateError=false;
  enddateError=false;

  constructor(
    public dialogRef: MatDialogRef<PublishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dialog: MatDialog,
    private provider_services: ProviderServices) {
      this.couponId=data.coupon.id;
     }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.publishForm = this.formbuilder.group({
      couponRules: this.formbuilder.group({
      publishedFrom: ['', [Validators.required]],
      publishedTo: ['', [Validators.required]]
      })
    });
      

  }
  close() {
    this.dialogRef.close();
}
checkSameDay(date) {
  if (moment(new Date(date)).isSame(moment(), 'day')) {
    return true;
  } else {
    return false;
  }
}
checkDayBeforeToday(date) {
  if (moment(new Date(date)).isBefore(new Date(), 'day')) {
    return true;
  }
  else { return false; }
}
checkDayisBeforeEndDate(sDate, eDate) {
  if (moment(new Date(sDate),'day').isBefore(new Date(eDate),'day')) {
    return true;
  } else {
    return false;
  }
}
compareDate( startOrend) {
  this.startdateError = false;
  this.enddateError = false;
  const sDate = this.publishForm.get('couponRules').get('publishedFrom').value;
  const eDate = this.publishForm.get('couponRules').get('publishedTo').value;
  if (startOrend === 0) {
    this.checkStartDateValid(sDate);
    if(eDate!==null && eDate!==undefined && eDate!=='' ){
      this.checkEndDateValid(eDate);
      if(!this.checkDayisBeforeEndDate(sDate,eDate)){
        return this.enddateError=true;
      }
    }

  } else if (startOrend === 1) {
    if(sDate!==null &&sDate!==undefined &&sDate!==''){
      this.checkStartDateValid(sDate);
      if(!this.checkDayisBeforeEndDate(sDate,eDate)){
        return this.enddateError=true;
      }
     
    }
     this.checkEndDateValid(eDate);
  
    

  }
}
checkStartDateValid(sDate){
  if (this.checkSameDay(sDate)) {
    return this.startdateError = false;
  }
  if (this.checkDayBeforeToday(sDate)) {
    return this.startdateError = true;
  }
}
checkEndDateValid(eDate){
  if (this.checkSameDay(eDate)) {
    return this.enddateError = false;
  }
  if (this.checkDayBeforeToday(eDate)) {
    return this.enddateError = true;
  }
}
  onSubmit(){
   const  msg = 'This Coupon wil be visible to consumers after publishing.Are you sure you want publish this coupon?';
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'type': 'yes/no'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        const form_data=this.publishForm.value;
        form_data.id=this.couponId;
        this.subscriptions.sink=this.provider_services.publishCoupon(form_data,this.couponId)
        .subscribe(result=>{
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('COUPON_PUBLISHED'));
          this.dialogRef.close();
        
    
        },error=>{
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
      }
    });
   

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
}

}
