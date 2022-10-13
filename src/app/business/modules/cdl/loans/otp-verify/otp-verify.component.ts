import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AuthService } from '../../../../../shared/services/auth-service';
// import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';
import { CdlService } from '../../cdl.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css']
})
export class OtpVerifyComponent implements OnInit {
  type: any;
  phoneNumber: any;
  otpEntered: any;
  otpSuccess: any;
  otpError: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  phoneError: any;
  dialCode: any;
  businessDetails: any;
  private subs = new SubSink();

  constructor(
    public dialogRef: MatDialogRef<OtpVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private sharedServices: SharedServices,
    private cdlservice: CdlService
    // private lStorageService: LocalStorageService,
    // private authService: AuthService,
    // private ngZone: NgZone
  ) {

  }

  ngOnInit(): void {
    this.type = this.data.type
    if (this.data && this.data.phoneNumber) {
      this.phoneNumber = this.data.phoneNumber;
      this.cdlservice.getBusinessProfile().subscribe((data) => {
        this.businessDetails = data;
        if (this.businessDetails && this.businessDetails.id)
          this.sendOTP();
      })
    }

  }



  sendOTP(mode?) {
    this.phoneError = null;
    if (this.phoneNumber) {
      this.dialCode = "+91";
      if (this.phoneNumber.startsWith('55')) {
        this.config.length = 5;
      }

      this.performSendOTP(this.phoneNumber, null, mode);
    }
  }
  performSendOTP(loginId, emailId?, mode?) {
    let credentials = {
      countryCode: "+91",
      loginId: loginId,
      accountId: this.businessDetails.id
    }
    if (emailId) {
      credentials['alternateLoginId'] = emailId;
    }
    this.subs.sink = this.sharedServices.sendConsumerOTP(credentials).subscribe(
      (response: any) => {
        if (mode == 'resent') {
          this.snackbarService.openSnackBar("Otp Resend Successfully");
        }
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    )
  }


  verifyOTP() {
    this.dialogRef.close("verified");
  }

  close() {
    this.dialogRef.close();
  }


  onOtpChange(otp) {
    this.otpEntered = otp;
    console.log(this.phoneNumber);
    if (this.phoneNumber) {
      if (this.phoneNumber.startsWith('55') && this.otpEntered.length < 5) {
        return false;
      } else if (this.otpEntered.length < 4) {
        return false;
      } else {
        this.otpVerification();
      }
    }
  }





  otpVerification() {
    this.otpSuccess = '';
    this.otpError = '';
    console.log(this.otpEntered);
    if (this.phoneNumber) {
      if (this.phoneNumber.startsWith('55') && this.otpEntered.length < 5) {
        this.snackbarService.openSnackBar('Invalid OTP', { 'panelClass': 'snackbarerror' });
        return false;
      } else if (this.otpEntered.length < 4) {
        this.snackbarService.openSnackBar('Invalid OTP', { 'panelClass': 'snackbarerror' });
        return false;
      }
    }
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
    } else {
      this.subs.sink = this.sharedServices.verifyConsumerOTP(this.otpEntered)
        .subscribe(
          (response: any) => {
            if (response) {
              this.snackbarService.openSnackBar("Mobile Number Verification Successful");
              const data = {
                type: this.type,
                msg: "success"
              }
              this.dialogRef.close(data);
            }
            console.log("Response", response)
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }

}
