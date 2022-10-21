import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartnerService } from '../../../../partner/partner.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css']
})
export class OtpVerifyComponent implements OnInit {
  type: any;
  phoneNumber: any;
  partnerData: any;
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
  customerDetails: any;
  customerData: any;
  phoneError: any;
  loanId: any;
  dialCode: any;
  firstName: any;
  lastName: any;
  user: any;
  businessDetails: any;
  private subs = new SubSink();
  customerId: any = 0;
  from: any;
  uid: any;
  name: any;
  email: any;
  constructor(
    public dialogRef: MatDialogRef<OtpVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private partnerservice: PartnerService,
    private groupService: GroupStorageService
    // private lStorageService: LocalStorageService,
    // private authService: AuthService,
    // private ngZone: NgZone
  ) {

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.data && this.data.phoneNo) {
      this.phoneNumber = this.data.phoneNo;
    }
    if (this.data && this.data.email) {
      this.email = this.data.email;
    }
    if (this.data && this.data.uid) {
      this.uid = this.data.uid;
    }
    if (this.data && this.phoneNumber && this.email) {
      this.performSendOTP();
    }
  }


  performSendOTP() {
    let credentials = {
      "phoneNo": this.phoneNumber,
      "email": this.email,
      "countryCode": "+91"
    }
    this.subs.sink = this.partnerservice.sendAgreementOTP(credentials).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar("Otp Sent Successfully");
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    )
  }


  close() {
    this.dialogRef.close();
  }


  onOtpChange(otp) {
    this.otpEntered = otp;
    console.log(this.phoneNumber);
    if (this.phoneNumber) {
      if (this.phoneNumber.startsWith('555')) {
        if (this.otpEntered.length < 5) {
          return false;
        } else {
          this.otpVerification();
        }
      }
      else {
        if (this.otpEntered.length < 4) {
          return false;
        } else {
          this.otpVerification();
        }
      }
    }
    else if (this.data && this.data.email) {
      if (this.otpEntered.length < 4) {
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
      if (this.otpEntered.length < 4) {
        this.snackbarService.openSnackBar('Invalid OTP', { 'panelClass': 'snackbarerror' });
        return false;
      }
    }
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
    } else {
      this.partnerOtpVerify()
    }
  }



  partnerOtpVerify() {
    this.subs.sink = this.partnerservice.verifyagreementOTP(this.otpEntered, this.uid)
      .subscribe(
        (response: any) => {
          if (response) {
            this.snackbarService.openSnackBar("Mobile Number Verification Successful");
            const data = {
              type: this.type,
              msg: "success",
              uid: response.uid
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
