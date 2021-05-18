import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../../shared/constants/project-messages';
// import { Messages } from 'src/app/shared/constants/project-messages';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  // styleUrls: ['./home.component.scss']
})


export class ConfirmBoxComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  showOk = true;
  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.type || (this.data.type && this.data.type === 'instantQ' && this.data.qId)) {
      this.ok_btn_cap = Messages.YES_BTN;
      this.cancel_btn_cap = Messages.NO_BTN;
    }
    if (this.data.type && this.data.type === 'instantQ' && !this.data.qId) {
      this.showOk = false;
    }
  }

  onClick(data) {
    this.dialogRef.close(data);
  }

}

