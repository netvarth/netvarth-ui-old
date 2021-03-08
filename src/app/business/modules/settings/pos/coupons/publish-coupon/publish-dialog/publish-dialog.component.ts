import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProviderServices } from '../../../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../../shared/services/word-processor.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmBoxComponent } from '../../../../../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.css']
})
export class PublishDialogComponent implements OnInit {
  public publishForm: FormGroup;
  couponId: any;
  startdateError: boolean;
  enddateError: boolean;
  coupon: any;
  api_error='';
  api_success='';
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
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
  compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.publishForm.get('publishedFrom').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
        return this.startdateError = true;
      }
      return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
        return this.enddateError = true;
      }
      return this.enddateError = false;
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
        this.provider_services.publishCoupon(form_data,this.couponId)
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
