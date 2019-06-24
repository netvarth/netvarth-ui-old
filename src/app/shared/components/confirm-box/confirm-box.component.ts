import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  // styleUrls: ['./home.component.scss']
})

export class ConfirmBoxComponent implements OnInit {

  ok_btn_cap = Messages.OK_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;

  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit () {
      if (this.data.type) {
        this.ok_btn_cap = Messages.YES_BTN;
        this.cancel_btn_cap = Messages.NO_BTN;
      }
    }

  onClick(data) {
    this.dialogRef.close(data);
  }
}

