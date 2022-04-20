import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../shared/constants/project-messages';
// import { Messages } from 'src/app/shared/constants/project-messages';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})


export class ConfirmBoxComponent {
  
  yes_btn_cap = 'YES';
  cancel_btn_cap = 'NO';

  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.type) {
      this.yes_btn_cap = Messages.YES_BTN;
      this.cancel_btn_cap = Messages.NO_BTN;
    }
    if (this.data.buttonCaption) {
      this.yes_btn_cap = this.data.buttonCaption;
    }
  }

  onClick(data) {
    this.dialogRef.close(data);
  }

}

