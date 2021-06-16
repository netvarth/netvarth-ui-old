import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Messages } from 'src/app/shared/constants/project-messages';

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
    if (this.data.type) {
      // this.ok_btn_cap = Messages.YES_BTN;
      // this.cancel_btn_cap = Messages.NO_BTN;
    }
  }
  ngOnInit() {
    // this.jCouponMsg = this.data.jCoupon.value.systemNote;
    // this.couponName = this.data.jCoupon.key;
}
  onClick() {
    this.dialogRef.close();
  }

}

