
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  // styleUrls: ['./home.component.scss']
})

export class ConfirmBoxComponent implements OnInit {

  
  ok_btn_cap = Messages.YES_BTN;
  cancel_btn_cap = Messages.NO_BTN;
  deptName;
  showError = false;
  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.type) {
      this.ok_btn_cap = Messages.YES_BTN;
      this.cancel_btn_cap = Messages.NO_BTN;
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
     // data={'data':data};
      this.dialogRef.close(data);
    }
  }
}
