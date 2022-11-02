import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedServices } from '../../services/shared-services';
import jwt_decode from "jwt-decode";
import { SnackbarService } from '../../services/snackbar.service';
import { Messages } from '../../constants/project-messages';
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
  emailId;
  password;
  rePassword;
  btnClicked = false;
  @Input() accountId;
  @Input() accountConfig;
  @Input() partnerParentId;
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
  googleIntegration: boolean;
  isPartner: boolean = false;
  constructor(private sharedServices: SharedServices,
    private authService: AuthService,
    private lStorageService: LocalStorageService,
    private renderer: Renderer2,
    private snackbarService: SnackbarService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.loading = true;
  }
  ngOnDestroy(): void {
    this.lStorageService.removeitemfromLocalStorage('login');
  }
  initGoogleButton() {
    const referrer = this;
    referrer.loadGoogleJS().onload = () => {
      google.accounts.id.initialize({
        client_id: "906354236471-jdan9m82qtls09iahte8egdffvvhl5pv.apps.googleusercontent.com",
        callback: (token) => {
          referrer.handleCredentialResponse(token);
        }
      });
      google.accounts.id.renderButton(
        referrer.googleButton.nativeElement,
        { theme: "outline", size: "large", width: "100%" }  // customization attributes
      );
      // google.accounts.id.prompt(); // also display the One Tap dialog
    };
  }
  ngOnInit(): void {
    console.log(this.accountConfig);
    this.lStorageService.setitemonLocalStorage('login', true);
    if ((this.accountConfig && this.accountConfig['googleIntegration'] === false) || this.partnerParentId) {
      this.googleIntegration = false;
    } else {
      this.googleIntegration = true;
      this.initGoogleButton();
    }
    this.loading = false;
  }

  loadGoogleJS() {
    const self = this;
    const url = "https://accounts.google.com/gsi/client";
    console.log('preparing to load...');
    let script = this.renderer.createElement('script');
    script.src = url;
    script.defer = true;
    script.async = true;
    self.renderer.appendChild(document.body, script);
    return script;
  }

  /**
   * Phone Number Collection for Account Existencen
   */
  sendOTP(mode?) {
    this.phoneError = null;
    this.btnClicked = true;
    this.lStorageService.removeitemfromLocalStorage('authorizationToken');
    this.lStorageService.removeitemfromLocalStorage('googleToken');
    if (this.phoneNumber && this.phoneNumber.dialCode === '+91') {
      this.dialCode = this.phoneNumber.dialCode;
      const pN = this.phoneNumber.e164Number.trim();
      let loginId = pN;
      if (pN.startsWith(this.dialCode)) {
        loginId = pN.split(this.dialCode)[1];
        if (loginId.startsWith('55')) {
          this.config.length = 5;
        }
      }
      this.performSendOTP(loginId, null, mode);
    } else if (this.phoneNumber.dialCode !== '+91') {
      this.dialCode = this.phoneNumber.dialCode;
      const pN = this.phoneNumber.e164Number.trim();
      let loginId = pN.split(this.dialCode)[1];
      this.performSendOTP(loginId, this.emailId, mode);
    } else {
      this.phoneError = 'Mobile number required';
      this.btnClicked = false;
    }
  }
  performSendOTP(loginId, emailId?, mode?) {
    let credentials = {
      countryCode: this.dialCode,
      loginId: loginId,
      accountId: this.accountId
    }
    if (this.partnerParentId) {
      this.isPartner = true;
    }
    if (emailId) {
      credentials['alternateLoginId'] = emailId;
    }
    this.subs.sink = this.sharedServices.sendConsumerOTP(credentials, this.isPartner).subscribe(
      (response: any) => {
        this.step = 3;
        this.btnClicked = false;
        if (mode == 'resent') {
          this.snackbarService.openSnackBar(Messages.OTP_RESEND_SUCCESS);
        }
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.btnClicked = false;
      }
    )
  }
  resetApiErrors() {
    this.phoneError = null;
  }
  clearPhoneExists() {
    this.phoneExists = false;
  }
  onOtpSubmit(otp) {
  }
  goBack() {
    this.initGoogleButton();
    this.step = 1;
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
          credentials['mUniqueId'] = this.lStorageService.getitemfromLocalStorage('mUniqueId');
          _this.authService.consumerLoginViaGmail(credentials).then(
            () => {
              const token = _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
              _this.lStorageService.setitemonLocalStorage('refreshToken', token);

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
        if (_this.dialCode !== '+91') {
          credentials['userProfile']['email'] = _this.emailId;
        }
        _this.authService.consumerAppSignup(credentials).then((response) => {
          let credentials = {
            accountId: _this.accountId,
            countryCode: _this.dialCode,
            loginId: phoneNum
          }
          credentials['mUniqueId'] = this.lStorageService.getitemfromLocalStorage('mUniqueId');
          _this.authService.consumerAppLogin(credentials).then((response) => {
            _this.authService.setLoginData(response, credentials, 'consumer');
            console.log("Login Response:", response);
            const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
            if (reqFrom === 'cuA') {
              const token = _this.lStorageService.getitemfromLocalStorage('authorizationToken');
              _this.lStorageService.setitemonLocalStorage('refreshToken', token);
            }
            _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
            _this.ngZone.run(() => {
              _this.actionPerformed.emit('success');
              _this.cd.detectChanges();
            });
          }, (error) => {
            if (error.status === 401 && (error.error === 'Session Already Exist' || error.error === 'Session already exists.')) {
              _this.authService.doLogout().then(() => {
                _this.lStorageService.removeitemfromLocalStorage('logout');
                _this.authService.consumerAppLogin(credentials).then(() => {
                  _this.ngZone.run(() => {
                    const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
                    if (reqFrom === 'cuA') {
                      const token = _this.lStorageService.getitemfromLocalStorage('authorizationToken');
                      _this.lStorageService.setitemonLocalStorage('refreshToken', token);
                    }
                    _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
                    _this.actionPerformed.emit('success');
                  }
                  )
                });
              })
            } else {
              _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
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
    console.log(this.phoneNumber);
    if (this.phoneNumber) {
      const pN = this.phoneNumber.e164Number.trim();
      let phoneNumber;
      if (pN.startsWith(this.dialCode)) {
        phoneNumber = pN.split(this.dialCode)[1];
      }
      if (this.phoneNumber.dialCode === '+91' && phoneNumber.startsWith('55') && this.otpEntered.length < 5) {
        return false;
      } else if (this.otpEntered.length < 4) {
        return false;
      } else {
        this.btnClicked = true;
        this.verifyOTP();
      }
    }
  }

  verifyOTP() {
    const _this = this;
    this.otpSuccess = '';
    this.otpError = '';
    this.api_loading = true;
    console.log(this.otpEntered);
    if (this.phoneNumber) {
      const pN = this.phoneNumber.e164Number.trim();
      let phoneNumber;
      if (pN.startsWith(this.dialCode)) {
        phoneNumber = pN.split(this.dialCode)[1];
      }
      if (this.phoneNumber.dialCode === '+91' && phoneNumber.startsWith('55') && this.otpEntered.length < 5) {
        // this.otpError = 'Invalid OTP';
        this.snackbarService.openSnackBar('Invalid OTP', { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
        return false;
      } else if (this.otpEntered.length < 4) {
        this.snackbarService.openSnackBar('Invalid OTP', { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
        // this.otpError = 'Invalid OTP';
        return false;
      }
    }
    this.api_loading = false;
    this.loading = true;
    if (this.otpEntered === '' || this.otpEntered === undefined) {
      this.otpError = 'Invalid OTP';
      this.loading = false;
    } else {
      this.subs.sink = this.sharedServices.verifyConsumerOTP(this.otpEntered, this.isPartner)
        .subscribe(
          (response: any) => {
            this.loading = false;
            let loginId;
            const pN = this.phoneNumber.e164Number.trim();
            if (pN.startsWith(this.dialCode)) {
              loginId = pN.split(this.dialCode)[1];
            }
            this.lStorageService.setitemonLocalStorage('authorizationToken', response.token);
            if (!response.linkedToPrivateDatabase) {
              this.step = 2;
              this.btnClicked = false;
            } else {
              let credentials = {
                countryCode: this.dialCode,
                loginId: loginId,
                accountId: this.accountId
              }
              this.authService.consumerAppLogin(credentials, this.isPartner).then((response) => {
                console.log("Login Response:", response);
                const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
                if (reqFrom === 'cuA') {
                  const token = _this.lStorageService.getitemfromLocalStorage('authorizationToken');
                  _this.lStorageService.setitemonLocalStorage('refreshToken', token);
                }
                _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
                _this.actionPerformed.emit('success');
                this.btnClicked = false;
              }, (error: any) => {
                this.btnClicked = false;
                if (error.status === 401 && (error.error === 'Session Already Exist' || error.error === 'Session already exists.')) {
                  _this.authService.doLogout().then(() => {
                    _this.lStorageService.removeitemfromLocalStorage('logout');
                    _this.authService.consumerAppLogin(credentials).then(() => {
                      _this.ngZone.run(() => {
                        const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
                        if (reqFrom === 'cuA') {
                          const token = _this.lStorageService.getitemfromLocalStorage('authorizationToken');
                          _this.lStorageService.setitemonLocalStorage('refreshToken', token);
                        }
                        _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
                        _this.actionPerformed.emit('success');
                      }
                      )
                    });
                  })
                } else if (error.status === 401) {
                  _this.ngZone.run(
                    () => {
                      _this.step = 2;
                      this.btnClicked = false;
                    }
                  )
                }
              })
            }
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.loading = false;
            this.btnClicked = false;
          }
        );
    }
  }
  handleCredentialResponse(response) {
    const _this = this;
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
    credentials['mUniqueId'] = this.lStorageService.getitemfromLocalStorage('mUniqueId');
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
      if (error.status === 401 && (error.error === 'Session Already Exist' || error.error === 'Session already exists.')) {
        _this.authService.doLogout().then(() => {
          _this.authService.consumerLoginViaGmail(credentials).then(() => {
            _this.ngZone.run(() => {
              const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
              if (reqFrom === 'cuA') {
                const token = _this.lStorageService.getitemfromLocalStorage('authorizationToken');
                _this.lStorageService.setitemonLocalStorage('refreshToken', token);
              }
              _this.lStorageService.removeitemfromLocalStorage('authorizationToken');
              _this.lStorageService.removeitemfromLocalStorage('googleToken');
              _this.actionPerformed.emit('success');
            }
            )
          });
        }
        )
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
