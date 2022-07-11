// import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
// import { Meta } from '@angular/platform-browser';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedServices } from '../../services/shared-services';
import jwt_decode from "jwt-decode";
import { SnackbarService } from '../../services/snackbar.service';
declare var google;
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  SearchCountryField = SearchCountryField;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
  separateDialCode = true;
  loading = false;

  public finalResponse;

  @ViewChild('googleBtn') googleButton: ElementRef;

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
  private subs = new SubSink();
  email: any;
  googleLogin: boolean;

  constructor(private sharedServices: SharedServices,
    private authService: AuthService,
    private lStorageService: LocalStorageService,
    // private metaService: Meta,
    private renderer: Renderer2,
    private snackbarService: SnackbarService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
  }
  ngOnDestroy(): void {
    this.lStorageService.removeitemfromLocalStorage('login');
  }

  ngOnInit(): void {
    const referrer = this;
    this.lStorageService.setitemonLocalStorage('login', true);
    referrer.loadGoogleJS().onload = () => {
      google.accounts.id.initialize({
        client_id: "906354236471-jdan9m82qtls09iahte8egdffvvhl5pv.apps.googleusercontent.com",
        callback: (token) => {
          referrer.handleCredentialResponse(token);
        }
      });
      google.accounts.id.renderButton(
        // document.getElementById("buttonDiv"),
        referrer.googleButton.nativeElement,
        { theme: "outline", size: "large", width: "100%" }  // customization attributes
      );
      // google.accounts.id.prompt(); // also display the One Tap dialog
    };
    // this.metaService.addTags([
    //   {name: 'google-signin-client_id', content:'906354236471-jdan9m82qtls09iahte8egdffvvhl5pv.apps.googleusercontent.com'}
    // ])
    // let script = this.renderer.createElement('script');
    // script.src = 'https://accounts.google.com/gsi/client';
    // script.defer = true;
    // script.async=true;
    // this.renderer.appendChild(document.body, script);
  }

  loadGoogleJS() {
    const self = this;
    const url = "https://accounts.google.com/gsi/client";
    console.log('preparing to load...');
    let script = this.renderer.createElement('script');
    // script.id = pData.orderId;
    script.src = url;
    script.defer = true;
    script.async = true;
    // script['crossorigin'] = "anonymous"
    // console.log(isfrom.paytmview);
    self.renderer.appendChild(document.body, script);
    return script;
  }

  /**
   * Phone Number Collection for Account Existencen
   */
  sendOTP() {
    this.phoneError = null;
    this.lStorageService.removeitemfromLocalStorage('authToken');
    this.lStorageService.removeitemfromLocalStorage('authorization');
    this.lStorageService.removeitemfromLocalStorage('authorizationToken');
    this.lStorageService.removeitemfromLocalStorage('googleToken');
        if (this.phoneNumber) {
      this.dialCode = this.phoneNumber.dialCode;
      const pN = this.phoneNumber.e164Number.trim();
      let loginId = pN;
      if (pN.startsWith(this.dialCode)) {
        loginId = pN.split(this.dialCode)[1];

        if (loginId.startsWith('55') && this.dialCode === '+91') {
          this.config.length = 5;
        }
      }
      const credentials = {
        countryCode: this.dialCode,
        loginId: loginId,
        accountId: this.accountId
      }
      this.subs.sink = this.sharedServices.sendConsumerOTP(credentials).subscribe(
        (response: any) => {
          this.step = 3;
        }
      )
    } else {
      this.phoneError = 'Mobile number required';
    }
  }
  checkCountrycode() {
    this.phoneError = '';
    if (this.phoneNumber && this.phoneNumber.dialCode !== '+91'){
      this.phoneError = 'Use Google Login to continue for users country code other than +91';
    }
  }
  clearPhoneExists() {
    this.phoneExists = false;
  }

  onOtpSubmit(otp) {
  }

  signUpConsumer() {
    const _this = this;
    _this.phoneError = '';
    if (_this.phoneNumber) {
      _this.dialCode = _this.phoneNumber.dialCode;
      const pN = _this.phoneNumber.e164Number.trim();
      let phoneNum;
      if (pN.startsWith(_this.dialCode)) {
        phoneNum = pN.split(_this.dialCode)[1];
      }
      let credentials = {
        accountId: _this.accountId,
        userProfile: {
          firstName: _this.firstName,
          lastName: _this.lastName,
          primaryMobileNo: phoneNum,
          countryCode: _this.dialCode
        }
      }
      if (_this.lStorageService.getitemfromLocalStorage('googleToken')) {
        credentials['userProfile']['email'] = _this.email;
        _this.authService.consumerSignupViaGoogle(credentials).then((response) => {
          let credentials = {
            accountId: _this.accountId
          }
          _this.authService.consumerLoginViaGmail(credentials).then(
            () => {
              _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
              _this.lStorageService.removeitemfromLocalStorage('googleToken');
              _this.ngZone.run(() => {
                _this.actionPerformed.emit('success');
                _this.cd.detectChanges();
              });
            }, (error) => {
              _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
          console.log("Signup Success:", response);
        }, (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        })
      } else {
        _this.authService.consumerAppSignup(credentials).then((response) => {
          let credentials = {
            accountId: _this.accountId,
            countryCode: _this.dialCode,
            loginId: phoneNum
          }
          _this.authService.consumerAppLogin(credentials).then((response) => {
            _this.authService.setLoginData(response, credentials, 'consumer');
            console.log("Login Response:", response);
            _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
            _this.ngZone.run(() => {
              _this.actionPerformed.emit('success');
              _this.cd.detectChanges();
            });
          }, (error) => {
            _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          })
        }, (error) => {
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
      }
    } else {
      _this.phoneError = 'Mobile number required';
    }
  }

  /**
   * OTP Section
   */

  onOtpChange(otp) {
    this.otpEntered = otp;
    if (this.phoneNumber) {
      const pN = this.phoneNumber.e164Number.trim();
      let phoneNumber;
      if (pN.startsWith(this.dialCode)) {
        phoneNumber = pN.split(this.dialCode)[1];
      }
      if (phoneNumber.startsWith('55') && this.otpEntered.length < 5) {
        // this.api_error = 'Enter valid OTP';
        return false;
      } else if (this.otpEntered.length < 4) {
        // this.api_error = 'Enter valid OTP';
        return false;
      } else {
        this.verifyOTP();
      }
    }

  }

  verifyOTP() {
    this.otpSuccess = '';
    this.otpError = '';
    this.loading = true;
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
    } else {
      this.subs.sink = this.sharedServices.verifyConsumerOTP(this.otpEntered)
        .subscribe(
          (response: any) => {
            this.loading = false;
            let loginId;
            const pN = this.phoneNumber.e164Number.trim();
            if (pN.startsWith(this.dialCode)) {
              loginId = pN.split(this.dialCode)[1];
            }
            if (!response.linkedToPrivateDatabase) {
              this.lStorageService.setitemonLocalStorage('authorizationToken', response.token);
              this.step = 2;
            } else {
              this.lStorageService.setitemonLocalStorage('authorizationToken', response.token);
              const credentials = {
                countryCode: this.dialCode,
                loginId: loginId,
                accountId: this.accountId
              }
              this.authService.consumerAppLogin(credentials).then((response) => {
                console.log("Login Response:", response);
                this.lStorageService.removeitemfromLocalStorage('authorizationToken');
                this.actionPerformed.emit('success');
              })
            }
          },
          // this.actionstarted = false;
          // this.otp = otp;
          // this.createForm(4);

          // this.step = 6;

          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.loading= false;
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
  handleCredentialResponse(response) {
    const _this = this;
    // this.lStorageService.removeitemfromLocalStorage('authToken');
    this.lStorageService.removeitemfromLocalStorage('authorization');
    this.lStorageService.removeitemfromLocalStorage('authorizationToken');
    this.lStorageService.removeitemfromLocalStorage('googleToken');
    console.log(response);
    this.googleLogin = true;
    const payLoad = jwt_decode(response.credential);
    console.log(payLoad);
    _this.lStorageService.setitemonLocalStorage('googleToken', 'googleToken-' + response.credential);
    const credentials = {
      accountId: _this.accountId
    }
    _this.authService.consumerLoginViaGmail(credentials).then((response) => {
      console.log("Login Response:", response);
      _this.ngZone.run(
        () => {
          _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
          _this.lStorageService.removeitemfromLocalStorage('googleToken');
          _this.actionPerformed.emit('success');
        }
      )

    }, (error: any) => {
      if (error.status === 419 && error.error === 'Session Already Exist') {
        const activeUser = _this.lStorageService.getitemfromLocalStorage('ynw-user');
        if (!activeUser) {

          _this.authService.doLogout().then(
            () => {
              _this.authService.consumerLoginViaGmail(credentials).then(
                () => {
                  _this.ngZone.run(
                    () => {
                      _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
                      _this.lStorageService.removeitemfromLocalStorage('googleToken');
                      _this.actionPerformed.emit('success');
                    }
                  )
                });
            }
          )
        } else {
          _this.actionPerformed.emit('success');
        }
      } else if (error.status === 401) {
        let names = payLoad['name'].split(' ');
        _this.firstName = names[0];
        _this.lastName = names[1];
        _this.email = payLoad['email'];
        _this.ngZone.run(
          () => {
            _this.step = 2;
          }
        )

      }
    });
  }
}