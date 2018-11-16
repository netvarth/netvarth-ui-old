import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-request-for',
  templateUrl: './request-for.component.html',
  styleUrls: ['./request-for.component.css']
})
export class RequestForComponent {
  ok_btn = Messages.OK_BTN;
  cancel_btn = Messages.CANCEL_BTN;
  confirm_req_pay_cap = Messages.REQUEST_CONFIRM_CAP;
  constructor(public dialogRef: MatDialogRef<RequestForComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }
}