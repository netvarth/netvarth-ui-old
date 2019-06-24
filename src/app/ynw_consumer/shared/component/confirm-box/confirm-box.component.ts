import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  // styleUrls: ['./home.component.scss']
})


export class ConfirmBoxComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }

}

