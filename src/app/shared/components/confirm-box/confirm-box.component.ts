import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Messages } from '../../constants/project-messages';


@Component({
    selector: 'app-confirm-box',
    templateUrl: './confirm-box.component.html',
    // styleUrls: ['./home.component.scss']
})


export class ConfirmBoxComponent {


  ok_btn_cap = Messages.OK_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;

  constructor(   public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }

}

