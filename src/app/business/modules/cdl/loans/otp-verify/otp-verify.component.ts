import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

  onOtpChange(event) {

  }

  verifyOTP() {

  }

}
