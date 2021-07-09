
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { interval as observableInterval, Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app/app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { FormMessageDisplayService } from '../../form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-providersignup',
  templateUrl: './providersignup.component.html',
  styleUrls: ['./providersignup.component.css']
})
export class ProvidersignupComponent implements OnInit {

  mobile_no_cap = Messages.MOBILE_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  select_domain_cap = Messages.SELECT_DMN_CAP;
  domain_cap = Messages.DMN_CAP;
  subdomain_cap = Messages.SB_DMN_CAP;
  select_subdomain_cap = Messages.SELECT_SB_DMN_CAP;
  lic_package_cap = Messages.LIC_PACKAGE_CAP;
  i_agree_cap = Messages.I_AGREE_CAP;
  terms_cond_cap = Messages.TERMS_CONDITIONS_CAP;
  sign_up_cap = Messages.SIGN_UP_CAP;
  license_packages = projectConstants.LICENSE_PACKAGES;
  cancel_btn_cap = Messages.CANCEL_BTN;
  ok_btn_cap = Messages.OK_BTN;
  signupp_cap = Messages.SIGNUPP_CAP;
  more_signup = Messages.MORE_SIGNUP;
  corporateaction: FormGroup;
  bankaction: FormGroup;
  license_description;
  business_domains;
  packages;
  activeDomainIndex;
  activeSubDomainIndex;
  subDomainList = [];
  domainList = [];
  subdomainSettings = projectConstants.SUBDOMAIN_ICONS;
  domainSettings = projectConstantsLocal.DOMAIN_ICONS;
  phonenumber;
  first_name;
  last_name;
  dropdownSettings = {
    singleSelection: false,
    text: 'Select Sub Sector',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class'
  };
  selectedDomain = null;
  selectedSubDomain = null;
  signupForm: FormGroup;
  api_error = null;
  api_success = null;
  is_provider = 'true';
  step = 1;
  moreLess = 0;
  CorporateBranch;
  action = false;
  bank_action = false;
  otp = '';
  isValidOtp = false;
  user_details;
  domainIsthere;
  selectedpackage;
  moreParams;
  heading = 'Activation Process';
  resendemailotpsuccess = true;
  claimmable = false;
  defaultLicense;
  passworddialogRef;
  close_message: any;
  ynwUser;
  ynw_credentials;
  loginId;
  fname;
  lname;
  actionstarted = false;
  scCode;
  scfound = false;
  loading_active = true;
  active_step: number;
  subdomainlist: any = [];
  hearus;
  spForm;
  domainIndex: any = {};
  domainicons: {
    physiciansSurgeons: { help: 'single doctor facility', iconClass: 'allopathy_doci' },
  };
  enter_otp_cap = Messages.ENTER_OTP_CAP;
  resend_otp_to_cap = Messages.RESEND_OTP_TO_CAP;
  email_id_cap = Messages.EMAIL_ID_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  resend_otp_email = Messages.RESEND_OTP_EMAIL_CAP;
  resend_otp_opt_active_cap = Messages.RESEND_OTP_OPT_ACTIVE_IN_CAP;
  seconds_cap = Messages.SECONDS_CAP;
  enter_email_cap = Messages.ENTER_EMAIL_CAP;
  resend_btn_cap = Messages.RESEND_BTN;
  otp_form: FormGroup;
  email_form: FormGroup;
  buttonclicked = false;
  email_otp_req = false;
  otp_email = null;
  message;
  showOTPContainer = true;
  showOTPEmailContainer = false;
  checking_email_otpsuccess = false;
  resetCounterVal;
  cronHandle: Subscription;
  refreshTime = 30;
  otp_mobile = null;
  providerPwd;
  email = '';
  isValidConfirm_pw = true;
  hideOtpSection = true;
  joinClicked = false;
  api_loading = false;
  countryCodes = projectConstantsLocal.COUNTRY_CODES;
  selectedCountryCode;
  images = {
    veterinaryPetcare: 'assets/images/home/pet-01.svg',
    finance: 'assets/images/home/bank-01.svg',
    religiousPriests: 'assets/images/home/religouespresets-01.svg',
    vastuAstrology: 'assets/images/home/vasthu-01.svg',
    foodJoints: 'assets/images/home/foodandbeverages-01.svg',
    professionalConsulting: 'assets/images/home/Proffesional.jpg',
    personalCare: 'assets/images/home/personal-care.jpg',
    healthCare: 'assets/images/home/HealthCare.jpg',
    retailStores: 'assets/images/home/supermarket-01.png',
    otherMiscellaneous: '',
    educationalInstitution: 'assets/images/home/Education-01.svg',
    sportsAndEntertainement: 'assets/images/home/Sportsdomain-01.svg',
    jaldee_qMgr: '',
    jaldee_appDesktop: 'assets/images/home/available-app.png',
    jaldee_playstore: 'assets/images/home/app_btn1.png',
    jaldee_appstore: 'assets/images/home/app_btn2.png'
  };
  scInfo;
  scCode_Ph;
  claimDetails;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices, public activatedRoute: ActivatedRoute,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private titleService: Title) {
    this.titleService.setTitle('Jaldee Business - Signup');
    this.activatedRoute.queryParams.subscribe(params => {
      this.claimDetails = params;
    });
  }
  @Inject(DOCUMENT) public document;

  ngOnInit() {
    if (this.countryCodes.length !== 0) {
      this.selectedCountryCode = this.countryCodes[0].value;
    }
    this.active_step = 0;
    this.ynwUser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.ynw_credentials = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
    if (this.ynw_credentials) {
      this.loginId = this.ynw_credentials.loginId;
    }
    if (this.ynwUser) {
      this.fname = this.ynwUser.firstName;
      this.lname = this.ynwUser.lastName;
    }
    this.lStorageService.removeitemfromLocalStorage('ynw-createprov');
    this.moreParams = this.data.moreParams;
    this.heading = 'Service Provider Sign Up';
    if (this.data.moreOptions === undefined) {
      this.data.moreOptions = { isCreateProv: false };
    }
    if (this.data.claimData === undefined) {
      if (this.data.moreOptions && this.data.moreOptions.isCreateProv) {
        this.heading = 'Create Provider Account';
        this.createFormSpecial(1);
      } else {
        this.createForm();
      }
    } else { // case of claimmable
      this.claimmable = true;
      this.domainIsthere = 1; // this.data.claimData.sector;
      this.createClaimForm(1);
    }
    this.shared_services.bussinessDomains()
      .subscribe(
        data => {
          const bDomains = data;
          this.business_domains = this.shared_functions.sortByKey(bDomains, 'order' );
          console.log(this.business_domains)
          if (this.claimDetails && this.claimDetails.sector) {
            const filteredList = this.business_domains.filter(domain => domain.domain === this.claimDetails.sector.toString());
            this.selectedDomain = filteredList[0];
          } else {
            this.selectedDomain = this.business_domains[0];
            this.selectedSubDomain = this.selectedDomain.subDomains[0];
          }
          this.domainIndex[0] = false;
        },
        () => {
        }
      );
  }
  createForm() {
    this.signupForm = this.fb.group({
      phonenumber: ['', Validators.compose(
        [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      first_name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      selectedDomainIndex: [''],
      selectedSubDomains: [0],
      package_id: [''],
      terms_condition: ['true'],
    });
    if (this.claimDetails) {
      if (this.claimDetails.phoneNo) {
        this.signupForm.get('phonenumber').setValue(this.claimDetails.phoneNo);
      }
      if (this.claimDetails.firstName) {
        this.signupForm.get('first_name').setValue(this.claimDetails.firstName);
      }
      if (this.claimDetails.lastName) {
        this.signupForm.get('last_name').setValue(this.claimDetails.lastName);
      }
    }
  }
  createFormSpecial(step) {
    this.step = step;
    switch (step) {
      case 1: this.signupForm = this.fb.group({
        is_provider: ['true'],
        selectedDomainIndex: ['', Validators.compose([Validators.required])],
        selectedSubDomains: [0, Validators.compose([Validators.required])],
        package_id: ['', Validators.compose([Validators.required])],
        terms_condition: ['true'],
      });
        this.changeType();
        break;
    }
  }
  createClaimForm(step) {
    this.step = step;
    switch (step) {
      case 1: this.signupForm = this.fb.group({
        is_provider: ['true'],
        phonenumber: [this.loginId, Validators.compose(
          [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
        first_name: [this.fname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: [this.lname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        selectedDomainIndex: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
        selectedSubDomains: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
        package_id: ['', Validators.compose([Validators.required])],
        terms_condition: ['false'],
      });
        this.changeType();
        break;
    }
  }

  changeType() {
    this.resetApiErrors();
    if (this.is_provider === 'true') {
      this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
    } else {
      this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
    }
  }
  resetValidation(control_names) {
    control_names.map(control_name => {
      this.signupForm.get(control_name).setValidators(Validators.required);
      this.signupForm.get(control_name).updateValueAndValidity();
    });
  }
  signUpApiProvider(user_details, source?) {
    this.resetApiErrors();
    this.resendemailotpsuccess = false;
    this.shared_services.signUpProvider(user_details)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.lStorageService.setitemonLocalStorage('unClaimAccount', false);
          this.createForm();
          this.resendemailotpsuccess = true;
          if (user_details.userProfile &&
            user_details.userProfile.email) {
            this.setMessage('email', user_details.userProfile.email);
          } else {
            this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
          }
          this.active_step = 3;
          this.hideOtpSection = true;
          this.showOTPContainer = true;
          this.showOTPEmailContainer = false;
          if (user_details.userProfile.email) {
            this.snackbarService.openSnackBar('OTP is sent to Your email id');
          } else if (user_details.userProfile.primaryMobileNo) {
            this.snackbarService.openSnackBar('OTP is sent to Your Mobile Number');
          }
          if (!source) {
            this.createpasswordform();
          }
          this.resetCounter(this.refreshTime);
          this.cronHandle = observableInterval(1000).subscribe(() => {
            if (this.resetCounterVal > 0) {
              this.resetCounterVal = this.resetCounterVal - 1;
            }
          });
        },
        error => {
          this.actionstarted = false;
          if (this.lStorageService.getitemfromLocalStorage('unClaimAccount')) {
          } else {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        }
      );
  }
  submitHearus() {
    if (this.hearus === 'SalesReps') {
      if (this.scCode_Ph) {
        this.findSC_ByScCode(this.scCode_Ph).then(() => {
          this.signUpApiProvider(this.user_details);
        });
      } else {
        this.snackbarService.openSnackBar('Please enter Sales Partner Id/ Phone', { 'panelClass': 'snackbarerror' });
      }
    } else {
      this.signUpApiProvider(this.user_details);
    }
  }

  handlekeyup(ev) {
    this.scfound = false;
    this.scInfo = {};
    if (ev.keyCode === 13) {
      this.scInfo = {};
      this.findSC_ByScCode(this.scCode_Ph);
    }
  }

  findSC_ByScCode(scCode) {
    this.scfound = false;
    this.scCode = null;
    if (scCode) {
      return new Promise<void>((resolve, reject) => {
        this.provider_services.getSearchSCdetails(scCode)
          .subscribe(
            data => {
              this.scfound = true;
              this.scInfo = data;
              if (this.scInfo.primaryPhoneNo === scCode) {
                this.scCode = this.scInfo.scId;
                resolve();
              } else {
                this.scCode = this.scCode_Ph;
                resolve();
              }
            },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              this.scfound = false;
              this.scCode = null;
            }
          );
      });
    }
  }

  signUpFinished(login_data) {
    if (this.ynw_credentials != null) {
      this.shared_functions.doLogout().then(() => {
        this.lStorageService.setitemonLocalStorage('new_provider', 'true');
        this.shared_functions.providerLogin(login_data);
        const encrypted = this.shared_services.set(this.providerPwd, projectConstants.KEY);
        this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
        this.lStorageService.setitemonLocalStorage('newProvider', 'true');
      });
    } else {
      this.lStorageService.setitemonLocalStorage('new_provider', 'true');
      this.shared_functions.providerLogin(login_data);
      const encrypted = this.shared_services.set(this.providerPwd, projectConstants.KEY);
      this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
      this.lStorageService.setitemonLocalStorage('newProvider', 'true');
    }
  }
  setPassword() {
    const post_data = {
      countryCode: this.selectedCountryCode,
      password: this.spForm.get('new_password').value
    };
    this.shared_services.ProviderSetPassword(this.otp, post_data)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.providerPwd = post_data.password;
          const login_data = {
            'countryCode': this.selectedCountryCode,
            'loginId': this.user_details.userProfile.primaryMobileNo,
            'password': post_data.password
          };
          this.signUpFinished(login_data);
        },
        error => {
          this.actionstarted = false;
          this.joinClicked = false;
          this.api_loading = false;
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
  }

  saveReferralInfo() {
    this.actionstarted = true;
    this.resetApiErrors();
    return new Promise<void>((resolve, reject) => {
      if (this.hearus) {
        const post_data = {
          'hearBy': this.hearus,
        };
        if (this.hearus === 'SalesReps') {
          post_data['scCode'] = this.scCode;
        }
        this.shared_services.saveReferralInfo(this.otp, post_data).subscribe(
          () => {
            this.actionstarted = false;
            resolve();
          },
          error => {
            this.actionstarted = false;
            reject(error);
          }
        );
      } else {
        resolve();
      }
    });
  }
  onOtpSubmit() {
    if (this.otp === '') {
      this.snackbarService.openSnackBar('Please enter OTP', { 'panelClass': 'snackbarerror' });
    } else {
      this.actionstarted = true;
      this.resetApiErrors();
      return new Promise<void>((resolve, reject) => {
        this.shared_services.OtpSignUpProviderValidate(this.otp)
          .subscribe(
            () => {
              this.actionstarted = false;
              this.isValidOtp = true;
              this.hideOtpSection = false;
              resolve();
            },
            error => {
              this.actionstarted = false;
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
      });
    }
  }
  onPasswordSubmit() {
    this.actionstarted = true;
    this.joinClicked = true;
    this.api_loading = true;
    this.resetApiErrors();
    this.keyPressed();
    if (this.isValidConfirm_pw) {
      this.saveReferralInfo().then(() => {
          this.setPassword();
        },
        (error) => {
          this.joinClicked = false;
          this.api_loading = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.joinClicked = false;
      this.api_loading = false;
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  resendOtp(user_details) {
    this.signUpApiProvider(user_details, 'resend');
  }
  clickedPackage(item) {
    this.license_description = this.license_packages[item.value];
  }
  isSelectedClass(id) {
    if (id === this.signupForm.get('package_id').value) {
      return true;
    } else {
      return false;
    }
  }
  setMessage(type, data) {
    this.api_error = '';
    if (type === 'email') {
      const email = (data) ? data : 'your email';
      this.api_success = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
    } else if (type === 'mobile') {
      const phonenumber = (data) ? data : 'your mobile number';
      this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
    }
    setTimeout(() => {
      this.api_success = '';
    }, projectConstants.TIMEOUT_DELAY_LARGE6);
  }
  onFieldBlur(key) {
    this.signupForm.get(key).setValue(this.toCamelCase(this.signupForm.get(key).value));
  }
  toCamelCase(word) {
    if (word) {
      return this.wordProcessor.toCamelCase(word);
    } else {
      return word;
    }
  }
  continuetoPwd() {
    this.step = 4;
  }
  more() {
    this.moreLess = 1;
  }
  less() {
    this.moreLess = 0;
  }
  onCancelPass() {
    if (this.step === 4) {
      this.step = 5;
      this.close_message = this.wordProcessor.getProjectMesssages('PASSWORD_ERR_MSG');
    }
  }
  showStep(changetostep) {
    this.loading_active = true;
    this.resetApiErrors();
    if (changetostep === 2) {
    }
    if (changetostep === 1) {
      setTimeout(() => {
        if (this.document.getElementById('bnameId')) {
          this.document.getElementById('bnameId').focus();
        }
      }, 1000);
    } else if (changetostep === 4) {
    } else if (changetostep === 2) {
      setTimeout(() => {
        if (this.document.getElementById('blatId')) {
          this.document.getElementById('blatId').focus();
        }
      }, 1000);
    }
  }
  showdomainstep() {
    this.active_step = 1;
  }
  checkAccountExists() {
    const mobile = this.signupForm.get('phonenumber').value;
    return new Promise((resolve, reject) => {
      this.shared_services.isProviderAccountExists(mobile).subscribe(
        (accountExists) => {
          resolve(accountExists);
        });
    });
  }
  registerClicked() {
    this.resetApiErrors();
    this.user_details = {};
    const fname = this.signupForm.get('first_name').value.trim();
    const lname = this.signupForm.get('last_name').value.trim();
    this.checkAccountExists().then(
      (accountExists) => {
        if (accountExists) {
          this.snackbarService.openSnackBar('Alert! The mobile number you have entered is already registered with Jaldee. Try again with different number.', { 'panelClass': 'snackbarerror' });
          return;
        } else {
          let userProfile = {
            countryCode: this.selectedCountryCode,
            primaryMobileNo: null,
            firstName: null,
            lastName: null
          };
          if (this.data.moreOptions.isCreateProv) {
            userProfile = {
              countryCode: this.selectedCountryCode,
              primaryMobileNo: this.data.moreOptions.dataCreateProv.ph || null, // this.signupForm.get('phonenumber').value || null,
              firstName: this.toCamelCase(this.data.moreOptions.dataCreateProv.fname) || null,
              lastName: this.toCamelCase(this.data.moreOptions.dataCreateProv.lname) || null
            };
          } else {
            userProfile = {
              countryCode: this.selectedCountryCode,
              primaryMobileNo: this.signupForm.get('phonenumber').value || null,
              firstName: this.toCamelCase(fname) || null,
              lastName: this.toCamelCase(lname) || null
            };
          }
          this.user_details['userProfile'] = userProfile;
          this.active_step = 1;
        }
      }
    );
  }
  subdomSelection(subdomain, domain, i) {
    this.selectedSubDomain = subdomain;
    this.selectedDomain = domain;
    this.domainIndex = {};
    this.domainIndex[i] = false;
  }
  saleschannelselection(hearus) {
    this.hearus = hearus;
  }
  showregistersection() {
    this.active_step = 0;
  }
  keyPressed() {
    if (this.spForm.get('new_password').value === this.spForm.get('confirm_password').value) {
      this.isValidConfirm_pw = true;
    } else {
      this.isValidConfirm_pw = false;
    }
  }
  createpasswordform() {
    this.spForm = this.fb.group({
      new_password: ['', Validators.compose(
        [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
      confirm_password: ['', Validators.compose(
        [Validators.required])],
    });
  }
  removSpecChar(evt) {
    return this.shared_functions.removSpecChar(evt);
  }
  resendOTPMobile() {
    this.resetCounter(this.refreshTime);
    if (this.user_details.userProfile !== undefined) {
      this.user_details.userProfile.email = null;
    }
    this.resendOtp(this.user_details);
  }
  resetCounter(val) {
    this.resetCounterVal = val;
  }
  setResendViaEmail() {
    this.hideOtpSection = false;
    this.doshowOTPEmailContainer();
    this.resetApiErrors();
    this.email_otp_req = true;
    this.showOTPEmailContainer = true;
    this.showOTPContainer = false;
  }
  doshowOTPEmailContainer() {
    this.showOTPContainer = false;
    this.showOTPEmailContainer = true;
  }
  resendViaEmail() {
    if (this.email === '') {
      this.snackbarService.openSnackBar('Please enter your email id', { 'panelClass': 'snackbarerror' });
    } else {
      this.user_details.userProfile.email = this.email;
      this.resendOtp(this.user_details);
      this.resetCounter(this.refreshTime);
      this.checking_email_otpsuccess = true;
      this.setMessage('email', this.email);
    }
  }
  doCancelEmailOTP() {
    this.resetApiErrors();
    this.showOTPEmailContainer = false;
    this.showOTPContainer = true;
    this.resetCounterVal = 0;
    this.otp_mobile = null;
    this.hideOtpSection = true;
  }
  showDomains() {
    this.active_step = 1;
  }
  handleDomainSelection() {
    if (this.claimDetails.subSector) {
      const subdomains = this.selectedDomain.subDomains.filter(subdom => subdom.subDomain === this.claimDetails.subSector.toString());
      if (subdomains[0]) {
        this.selectedSubDomain = subdomains[0];
      } else {
        this.selectedSubDomain = this.selectedDomain.subDomains[0];
      }
    } else {
      this.selectedSubDomain = this.selectedDomain.subDomains[0];
    }
    this.user_details['sector'] = this.selectedDomain.domain;
    this.user_details['subSector'] = this.selectedSubDomain.subDomain;
    this.user_details['licPkgId'] = 9;
    this.user_details['accountId'] = this.claimDetails.accountId;
    if (this.selectedDomain && this.selectedDomain.subDomains.length > 1) {
      this.active_step = 4;
    } else {
      this.active_step = 2;
    }
  }
  backToSubdomains() {
    if (this.selectedDomain && this.selectedDomain.subDomains.length > 1) {
      this.active_step = 4;
    } else {
      this.active_step = 1;
    }
  }
  handleSubDomainSelection() {
    this.user_details['subSector'] = this.selectedSubDomain.subDomain;
    this.active_step = 2;
  }
  gotoTerms() {
    window.open('business/terms', '_blank');
  }
}
