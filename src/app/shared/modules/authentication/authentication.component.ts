import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedServices } from '../../services/shared-services';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  SearchCountryField = SearchCountryField;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
  separateDialCode = true;

  step: any = 1; //
  api_loading;

  phoneExists;
  phoneError: string;
  phoneNumber;
  dialCode: any;
  isPhoneValid: boolean;

  firstName;
  lastName;
  password;
  rePassword;

  @Input() accountId;

  @Output() actionPerformed = new EventEmitter<any>();
  otpError: string;
  otpSuccess: string;

  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  otpEntered: any;


  constructor(private sharedServices: SharedServices,
    private authService: AuthService,
    private lStorageService: LocalStorageService
    ) { }

  private subs = new SubSink();





  ngOnInit(): void {

  }

  /**
   * Phone Number Collection for Account Existence
   */


  sendOTP() {
    // this.mobile_num = this.document.getElementById('phone').value;
    this.phoneError = null;

    if (this.phoneNumber) {
      this.dialCode = this.phoneNumber.dialCode;
      const pN = this.phoneNumber.e164Number.trim();
      let loginId = pN;
      if (pN.startsWith(this.dialCode)) {
        loginId = pN.split(this.dialCode)[1];

        if (loginId.startsWith('55') && this.dialCode === '+91') {
          this.config.length=5;
        }
      }
      const credentials = {
        countryCode: this.dialCode,
        loginId: loginId,
        // accountId: this.accountId
      }
      this.subs.sink = this.sharedServices.sendConsumerOTP(credentials).subscribe(
        (response: any) => {
          console.log(response);
          if (response) {
            this.step =3;
          }
        }
      )
      // this.subs.sink = this.sharedServices.consumerMobilenumCheck(this.phoneNumber, this.dialCode).subscribe((accountExists) => {
      //   if (accountExists) {
      //     this.phoneExists = true;
      //     this.isPhoneValid = true;
      //     this.step = 3;
      //   } else {
      //     this.phoneExists = false;
      //     this.isPhoneValid = true;
      //     this.step = 2;
      //   }
      // }
      // );
    } else {
      this.phoneError = 'Mobile number required';
    }
  }
  clearPhoneExists() {
    this.phoneExists = false;
  }

  onOtpSubmit(otp) {
    
    // submit_data
    // this.actionstarted = true;
    // this.resetApiErrors();
    

  }

  signUpConsumer() {
    const pN = this.phoneNumber.e164Number.trim();
    const dialCode = this.phoneNumber.dialCode;
    let phoneNum;
    if (pN.startsWith(this.dialCode)) {
      phoneNum = pN.split(this.dialCode)[1];
    }
    let credentials = {
      accountId: this.accountId,
      userProfile: {
        firstName: this.firstName,
        lastName: this.lastName,
        primaryMobileNo: phoneNum,
        countryCode: dialCode
      }
    }

    this.authService.consumerAppSignup(credentials).then((response)=>{
      console.log("Signup Success:", response);
      this.actionPerformed.emit('success');
    })

  }

  /**
   * OTP Section
   */

  onOtpChange(otp) {
    this.otpEntered = otp;
  }

  verifyOTP() {
    this.otpSuccess = '';
    this.otpError = '';
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
    } else {
      this.subs.sink = this.sharedServices.verifyConsumerOTP(this.otpEntered)
      .subscribe(
        (response: any) => {
          let loginId;
          const pN = this.phoneNumber.e164Number.trim();
          if (pN.startsWith(this.dialCode)) {
            loginId = pN.split(this.dialCode)[1];
          }
          
          if (!response.linkedToPrivateDatabase) {
            this.lStorageService.setitemonLocalStorage('authorizationToken', response.token);
            this.step = 2;
          } else {
            const credentials = {
              countryCode: this.dialCode,
              loginId: loginId,
              accountId: this.accountId
            }
            this.authService.consumerAppLogin(credentials).then((response)=>{
              console.log("Login Response:", response);
              this.actionPerformed.emit('success');
            })
          }  
        },
          // this.actionstarted = false;
          // this.otp = otp;
          // this.createForm(4);
  
          // this.step = 6;
    
        error => {
          // this.actionstarted = false;
          // this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
      // this.disableConfirmbtn = true;
      // this.versionService.verifyOtp(this.otp)
      //   .subscribe(res => {
      //     this.disableConfirmbtn = false;
      //     this.api_success = 'version updated successfully';
      //   },
      //     (error) => {
      //       this.disableConfirmbtn = false;
      //       this.api_error = error.error;
      //     });
    }
  }
}
