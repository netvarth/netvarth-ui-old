import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css']
})
export class OtpVerifyComponent implements OnInit {
  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  constructor(
    public dialogRef: MatDialogRef<OtpVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
  }

  onOtpChange(event) {

  }

  verifyOTP() {
    this.dialogRef.close("verified");
  }

  close() {
    this.dialogRef.close();
  }

}
