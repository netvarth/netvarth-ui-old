import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AuthService } from '../../../../../shared/services/auth-service';
// import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';
import { CdlService } from '../../cdl.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

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
  name: any;
  dealerId: any;
  gender: any;
  dob: any;
  constructor(
    public dialogRef: MatDialogRef<OtpVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private cdlservice: CdlService,
    private groupService: GroupStorageService
    // private lStorageService: LocalStorageService,
    // private authService: AuthService,
    // private ngZone: NgZone
  ) {

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.type = this.data.type
    this.from = this.data.from
    if (this.data && this.data.data && this.data.data.firstName) {
      this.firstName = this.data.data.firstName;
    }
    if (this.data && this.data.data && this.data.data.dob) {
      this.dob = this.data.data.dob;
    }
    if (this.data && this.data.data && this.data.data.gender) {
      this.gender = this.data.data.gender;
    }
    if (this.data && this.data.data && this.data.data.lastName) {
      this.lastName = this.data.data.lastName;
    }
    if (this.data && this.data.id) {
      this.loanId = this.data.id;
    }
    if (this.data && this.data.name) {
      this.name = this.data.name;
    }
    if (this.data && this.data.dealerId) {
      this.dealerId = this.data.dealerId;
    }
    if (this.data && this.data.phoneNumber) {
      this.phoneNumber = this.data.phoneNumber;
      if (this.phoneNumber.startsWith('555')) {
        this.config.length = 5;
      }
      this.cdlservice.getBusinessProfile().subscribe((data) => {
        this.businessDetails = data;
      });
      this.sendOTP();
    }
    else if (this.data && this.data.email) {
      this.sendOTP();
    }

  }



  sendOTP(mode?) {
    this.phoneError = null;
    if (this.phoneNumber) {
      this.dialCode = "+91";
      console.log("this.phoneNumber")
      this.performSendOTP(this.phoneNumber, mode);
    }
    else if (this.data && this.data.email) {
      this.performEmailOTP(this.data.email);
    }
  }
  performSendOTP(loginId, mode?) {
    let credentials = {
      countryCode: "+91",
      number: loginId,
    }
    console.log("coming here", credentials)
    // if (!loginId.startsWith('555')) {
    this.subs.sink = this.cdlservice.sendPhoneOTP(credentials, this.from).subscribe(
      (response: any) => {
        if (mode == 'resent') {
          this.snackbarService.openSnackBar("Otp Resend Successfully");
        }
        else {
          this.snackbarService.openSnackBar("Otp Sent Successfully");
        }
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    )
    // }
    // else {
    //   this.snackbarService.openSnackBar("Otp Sent Successfully");
    // }

  }


  performEmailOTP(loginId) {
    let credentials = {
      email: loginId,
    }

    this.subs.sink = this.cdlservice.sendEmailOTP(credentials, this.from).subscribe(
      (response: any) => {
        this.snackbarService.openSnackBar("Otp Sent Successfully");
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


      if (this.data && this.data.phoneNumber) {
        console.log("Data", this.data)
        if (!this.data.from || (this.data.from && this.data.from != 'partner')) {
          const filter = { 'phoneNo-eq': this.phoneNumber };
          this.getCustomerDetails(filter);
        }
        else if (this.from && this.from == 'partner') {
          this.partnerOtpVerify()
        }

      }
      else {
        this.verifyEmail();
      }
    }
  }



  verifyEmail() {
    console.log("Email")
    var data;
    data = {
      "uid": this.loanId
    }
    if (this.from == 'partner') {
      data = {
        "id": this.dealerId
      }
    }

    this.subs.sink = this.cdlservice.verifyEmailOTP(this.otpEntered, this.from, data)
      .subscribe(
        (response: any) => {
          if (response) {
            this.snackbarService.openSnackBar("Email Verification Successful");
            const data = {
              type: "email",
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


  getCustomerDetails(filter) {
    this.cdlservice.getCustomerDetails(filter).subscribe((data) => {
      this.customerDetails = data;
      if (this.customerDetails && this.customerDetails.length != 0) {
        this.customerId = this.customerDetails[0].id;
        this.customerData = {
          "customer": {
            "id": this.customerId,
            "firstName": this.customerDetails[0].firstName,
            "lastName": this.customerDetails[0].lastName,
            "phoneNo": this.phoneNumber,
            "dob": this.customerDetails[0].dob,
            "gender": this.customerDetails[0].gender,
            "countryCode": "+91"
          },
          "location": {
            "id": this.user.bussLocs[0]
          },
          "loanApplicationKycList": [
            {
              "isCoApplicant": false
            }
          ]
        }
      }
      else {
        this.customerData = {
          "customer": {
            "id": this.customerId,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "phoneNo": this.phoneNumber,
            "countryCode": "+91",
            "dob": this.dob,
            "gender": this.gender
          },
          "location": {
            "id": this.user.bussLocs[0]
          },
          "loanApplicationKycList": [
            {
              "isCoApplicant": false
            }
          ]
        }
      }
      if (this.customerData) {
        this.subs.sink = this.cdlservice.verifyPhoneOTP(this.otpEntered, this.customerData,this.from)
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
    });
  }

  partnerOtpVerify() {
    this.partnerData = {
      "partnerName": this.name,
      "partnerAliasName": this.name,
      "partnerMobile": this.phoneNumber
    }
    if (this.partnerData) {
      this.subs.sink = this.cdlservice.partnerOtpVerify(this.otpEntered, this.partnerData)
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


}
