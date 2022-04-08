import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SubSink } from 'subsink';
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

  step: any=3; //
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



  config = {
    allowNumbersOnly: false,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '50px'
    }
  };

  @Output() actionPerformed = new EventEmitter<any>();
  otpEntered: any;
  otpError: string;
  otpSuccess: string;
  constructor(private sharedServices: SharedServices) { }

  private subs = new SubSink();




  
  ngOnInit(): void {

  }
  
  /**
   * Phone Number Collection for Account Existence
   */


  checkAccountExists() {
    // this.mobile_num = this.document.getElementById('phone').value;
    this.phoneError = null;
    if (this.phoneNumber) {
      this.dialCode = this.phoneNumber.dialCode;
      this.subs.sink = this.sharedServices.consumerMobilenumCheck(this.phoneNumber, this.dialCode).subscribe((accountExists) => {
        if (accountExists) {
          this.phoneExists = true;
          this.isPhoneValid = true;
          this.step = 3;
        } else {
          this.phoneExists = false;
          this.isPhoneValid = true;
          this.step = 2;
        }
      }
      );
    } else {
      this.phoneError = 'Mobile number required';
    }
  }
  clearPhoneExists() {
    this.phoneExists = false;
  }


  /**
   * OTP Section
   */

   onOtpChange(otp) {
    this.otpEntered = otp;
  }
  
  otpSubmit() {
    this.otpSuccess = '';
    this.otpError = '';
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
    } else {
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
