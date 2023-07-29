
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Messages } from '../../constants/project-messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  ok_btn_cap = Messages.CONFIRM_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  send_message_cap = Messages.POPUP_SEND_MSG_CAP;
  select_reason_cap = Messages.POPUP_SELECT_REASON_CAP;
  messgae_cap = Messages.OTHERMESSAGE_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  cancel_reasonobj;
  cancel_reason = '';
  cancel_reason_key = '';
  default_message_arr: any = [];
  def_msg = '';
  deptName;
  showError = false;
  okCancelBtn = false;
  cancel_reasons: any = [];
  rep_username: string;
  rep_service: string;
  rep_date: string;
  rep_time: string;
  rep_provname: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder:FormBuilder,
    public fed_service: FormMessageDisplayService,
  ) { 
    this.amForm = this.formBuilder.group({
    reason: ['', Validators.compose([Validators.required])],
    message: [''],
    send_message: [{ value: false, disabled: true }]
  });
}
  ngOnInit() {
    console.log("data-data",this.data.book)
    if (this.data.wtlist.providerAccount.businessName) {
      this.rep_username = this.data.wtlist.providerAccount.businessName;
    }
    const reasons_list = [];
    // const type = this.groupService.getitemFromGroupStorage('pdtyp');
    const reasons = projectConstantsLocal.WAITLIST_CANCEL_REASON;
    for (let i = 0; i < reasons.length; i++) {
      if (reasons[i].type) {
        reasons_list.push(reasons[i]);
      }
    }
    this.cancel_reasons = reasons_list;
    console.log("this.cancel_reasons",this.cancel_reasons);
    if (this.data.type) {
      this.ok_btn_cap = Messages.CONFIRM_BTN;
      this.cancel_btn_cap = Messages.CANCEL_BTN;
    }
    if (this.data.buttons === 'okCancel') {
      this.ok_btn_cap = Messages.CONFIRM_BTN;
      this.cancel_btn_cap = Messages.CANCEL_BTN;
    }
  }
  onClick(data) {
    if (this.data.filterByDept && data) {
      const param = {};
      if (this.deptName) {
        param['deptName'] = this.deptName;
        data = param;
        this.dialogRef.close(data);
      } else {
        this.showError = true;
      }
    } else {
      this.dialogRef.close(data);
    }
  }
  selectReason(cancel_reason) {
    this.amForm.get('reason').setValue(cancel_reason.value);
    this.cancel_reasonobj = cancel_reason;
    this.cancel_reason = cancel_reason.title;
    this.cancel_reason_key = cancel_reason.reasonkey;
    this.amForm.controls['send_message'].enable();
    if (this.data.isBatch) {
    } else {
      this.def_msg = this.replacedMessage();
    }    
  }
  replacedMessage() {
    let retmsg = '';
    if (this.cancel_reason_key) {
      retmsg = this.default_message_arr[this.cancel_reason_key];
    }
    if (retmsg && retmsg !== '') {
      retmsg = retmsg.replace(/\[consumer\]/g, this.rep_username);
      retmsg = retmsg.replace(/\[service\]/g, this.rep_service);
      retmsg = retmsg.replace(/\[date\]/g, this.rep_date);
      retmsg = retmsg.replace(/\[time\]/g, this.rep_time);
      retmsg = retmsg.replace(/\[.*?\]/g, this.rep_provname);
      if (this.cancel_reason && this.cancel_reason !== '') {
        retmsg = retmsg.replace('[reason]', this.cancel_reason);
      }
    }
    return retmsg;
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  onSubmit(form_data) {
    console.log(form_data)
    this.resetApiErrors();
    let post_data;
    // if (this.data.appt || this.data.type === 'appt') {
    //   post_data = {
    //     'rejectReason': form_data.reason
    //   };
    // } else {
    post_data = {
      'cancelReason': form_data.reason
    };
    // }
    if (form_data.send_message) {
      if (!form_data.message.replace(/\s/g, '').length) {
        this.api_error = 'Message cannot be empty';
        return;
      }
      post_data['communicationMessage'] = form_data.message;
    }

    if (this.data.isBatch && !post_data['communicationMessage']) {
      this.api_error = 'Message cannot be empty';
      return;
    }

    this.dialogRef.close(post_data);
  }
}
