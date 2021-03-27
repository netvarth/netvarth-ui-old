import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
  contantInfo: FormGroup;
  customer_phone: '';
  customer_email: '';
  constructor(private formBuilder: FormBuilder,
    public fed_service: FormMessageDisplayService,
    private sharedfunctionObj:SharedFunctions,
    private dialogRef: MatDialogRef<ContactInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, ) {
    if (this.data.phone &&!this.data.phone.includes('*')) {
      this.customer_phone = this.data.phone;
    }
    if (this.data.email) {
      this.customer_email = this.data.email;
    }
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() { 
    this.contantInfo = this.formBuilder.group({

      phone: [this.customer_phone, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      email: [this.customer_email, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])]
    });
  }
  onSubmit(form_data) {
    this.dialogRef.close(form_data);
  }
  close() {
    this.dialogRef.close();
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumber(evt);
  }

}
