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
import { DateTimeProcessor } from '../../../../../../../shared/services/datetime-processor.service';




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

  startDaterequired: boolean;
  endDaterequired: boolean;
  endDateInvalidError: boolean;
  minDay=new Date();
  customer_label = '';
  constructor(
    public dialogRef: MatDialogRef<PublishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    private dialog: MatDialog,
    private provider_services: ProviderServices) {
      this.couponId=data.coupon.id;
     }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.createForm();
  }
  onChangePublishFromDate() {
    this.startDaterequired=false;
  }
  onChangePublishToDate() {
    this.endDaterequired=false;
    this.endDateInvalidError=false;
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

checkDayisBeforeEndDate(sDate, eDate) {
  if (moment(new Date(sDate),'day').isSameOrBefore(new Date(eDate),'day')) {
    return true;
  } else {
    return false;
  }
}

  onSubmit(){
    this.startDaterequired=false;
    this.endDateInvalidError=false;
    this.endDaterequired=false;
    const startDateVal = this.publishForm.get('couponRules').get('publishedFrom').value;
    const endDateVal = this.publishForm.get('couponRules').get('publishedTo').value;
    if (startDateVal == null || startDateVal == undefined || startDateVal == '') {
      this.startDaterequired = true;
    }
    if (endDateVal == null || endDateVal == undefined || endDateVal == '') {
      this.endDaterequired = true;
    }
    if(startDateVal!==''&&endDateVal!==''){
    if(!this.checkDayisBeforeEndDate(startDateVal,endDateVal)){
       this.endDateInvalidError=true;
    }
    }
    if(!this.startDaterequired &&!this.endDaterequired&& !this.endDateInvalidError){
  //  const  msg = 'This Coupon wil be visible to consumers after publishing.Are you sure you want publish this coupon?';
   const  msg = 'This Coupon will be visible to'  + '  ' + this.customer_label + 's'+ ' '+ 'after publishing.Are you sure you want publish this coupon?'; 
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
        let publishedFrom ='';
        let publishedTo='';
        const form_data = this.publishForm.value;
        if (form_data.couponRules.publishedFrom) {
          publishedFrom = this.dateTimeProcessor.transformToYMDFormat(form_data.couponRules.publishedFrom);
          form_data.couponRules.publishedFrom=publishedFrom;
        }
        if (form_data.couponRules.publishedTo) {
          publishedTo = this.dateTimeProcessor.transformToYMDFormat(form_data.couponRules.publishedTo);
         form_data.couponRules.publishedTo=publishedTo;
        }
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

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
}

}
