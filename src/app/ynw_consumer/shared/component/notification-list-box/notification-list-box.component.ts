import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './notification-list-box.component.html',
  // styleUrls: ['./home.component.scss']
})


export class NotificationListBoxComponent {

  constructor(public dialogRef: MatDialogRef<NotificationListBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClick(data) {
    this.dialogRef.close(data);
  }

}
