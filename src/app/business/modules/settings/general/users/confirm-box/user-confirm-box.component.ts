import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-confirm-box',
  templateUrl: './user-confirm-box.component.html',
  styleUrls: ['./user-confirm-box.component.css']
})


export class UserConfirmBoxComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';

  constructor(public dialogRef: MatDialogRef<UserConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
}
  onClick() {
    this.dialogRef.close();
  }
}
