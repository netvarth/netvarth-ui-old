import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';


@Component({
  selector: 'app-confirm-paymentlink',
  templateUrl: './confirm-paymentlink.component.html'
})

export class ConfirmPatmentLinkComponent implements OnInit {

  mob_cap = Messages.MOBILE_NUMBER_CAP;
  first_name_cap = Messages.FIRST_NAME_CAP;
  last_name_cap = Messages.LAST_NAME_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  oops_cap = Messages.OOPS_CAP;
  not_reg_customer_cap = Messages.CUSTOMER_NOT_REGISTER_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  tday = new Date();
  source = null;
  customer_label = '';
  checkin_label = '';
  create_new = false;
  form_data = null;
  blankPattern;
  count = 0;
  calculationMode;
  queues;
  waitlist_set: any = [];
  showToken = false;
  showError = false;
  showNameError = false;
  frm_create_customer_cap_one = '';
  frm_create_customer_cap_two = '';
  frm_create_customer_cap_three = '';
  alternatemobile = false;
  alternateemail = false;
  mobilenumber: any;
  uuid: any;
  pay_link = {
    'uuid': null,
    'phNo': null,
    'email': null,
    'emailNotification': null,
    'smsNotification' : null
  };
  emailId: any;
    constructor(
      public dialogRef: MatDialogRef<ConfirmPatmentLinkComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      public fed_service: FormMessageDisplayService,
      public provider_services: ProviderServices,
      public shared_functions: SharedFunctions ) {
      this.uuid = this.data.uuid;
      this.mobilenumber =   this.data.mobilenumber;
      this.emailId = this.data.emailId;
      console.log(this.emailId);
      this.source = this.data.source;
      this.calculationMode = this.data.calc_mode;
      this.showToken = this.data.showToken;
      this.customer_label = this.shared_functions.getTerminologyTerm('customer');
      this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    }
  ngOnInit() {
    this.blankPattern = projectConstantsLocal.VALIDATOR_BLANK;
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      mobile_number: [this.mobilenumber, Validators.compose([Validators.required, Validators.maxLength(10),
                       Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      email_id: [this.emailId, Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
      });
  }
  resetApiErrors(e) {
    if (e.keyCode !== 13) {
      this.create_new = false;
      this.api_error = null;
      this.api_success = null;
    }
  }
  isNumeric(evt) {
    if (evt === 'name') {
      this.showNameError = false;
    } else {
      this.showError = false;
      return this.shared_functions.isNumeric(evt);
    }
  }
  // addmobile() {
  //   this.alternatemobile = true;
  // }
  // addemail() {
  //   this.alternateemail = true;
  // }
   onClick(data) {
    this.dialogRef.close(data);
  }
  onSend(form_data) {
    this.pay_link.uuid = this.uuid;
    this.pay_link.phNo = form_data.mobile_number;
    this.pay_link.email = form_data.email_id;
    this.pay_link.emailNotification = 'true';
    this.pay_link.smsNotification = 'true';
    this.provider_services.Paymentlink(this.pay_link)
    .subscribe((pData: any) => {
      console.log(pData);
      this.dialogRef.close();
      this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT_link);
      });
  }

}

