import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../constants/project-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignUpComponent implements OnInit {

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
  subdomainSettings = projectConstants.SUBDOMAIN_ICONS;
  dropdownSettings = {
    singleSelection: false,
    text: 'Select Sub Sector',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class'
  };
  selectedDomain = null;
  signupForm: FormGroup;
  api_error = null;
  api_success = null;
  is_provider = 'true';
  step = 1;
  moreLess = 0;
  CorporateBranch;
  action = false;
  bank_action = false;
  otp = null;
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
  showTermcondition = false;
  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    private router: Router,
    public shared_functions: SharedFunctions
  ) {
    this.is_provider = data.is_provider || 'true';
  }

  ngOnInit() {
    this.ynwUser = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.ynw_credentials = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    if (this.ynw_credentials) {
      this.loginId = this.ynw_credentials.loginId;
    }
    if (this.ynwUser) {
      this.fname = this.ynwUser.firstName;
      this.lname = this.ynwUser.lastName;
    }
    this.shared_functions.removeitemfromLocalStorage('ynw-createprov');
    this.moreParams = this.data.moreParams;
    if (this.data.is_provider === 'true') {
      this.heading = 'Service Provider Sign Up';
    } else if (this.data.is_provider === 'false') {
      this.heading = 'Jaldee Customer Sign Up';
    }
    if (this.data.moreOptions === undefined) {
      this.data.moreOptions = { isCreateProv: false };
    }
    if (this.data.claimData === undefined) {
      if (this.data.moreOptions && this.data.moreOptions.isCreateProv) {
        this.heading = 'Create Provider Account';
        this.createFormSpecial(1);
      } else {
        this.createForm(1);
      }
    } else { // case of claimmable
      this.claimmable = true;
      this.domainIsthere = 1; // this.data.claimData.sector;
      this.createClaimForm(1);
    }
    this.shared_services.bussinessDomains()
      .subscribe(
        data => {
          this.business_domains = data;
          this.getPackages();
          // this.setDomain(0);
        },
        () => {
        }
      );
  }
  getPackages() {
    this.shared_services.getPackages()
      .subscribe(
        data => {
          this.packages = data;
          if (this.packages[0] && this.signupForm.get('package_id')) {
            this.signupForm.get('package_id').setValue(this.packages[0].pkgId);
            this.license_description = this.license_packages[this.packages[0].pkgId];
          }

          if (this.data.claimData !== undefined) { // case of claimmable
            const domainid = this.getDomainIndex(this.data.claimData.sector);
            this.domainIsthere = domainid;
            for (let i = 0; i < this.business_domains.length; i++) {
              if (this.data.claimData.sector === this.business_domains[i].domain) {
                this.signupForm.get('selectedDomainIndex').setValue(this.business_domains[i].displayName);
                this.activeDomainIndex = i;

              }
            }
            this.setDomain(domainid);
            for (let j = 0; j < this.subDomainList.length; j++) {
              if (this.data.claimData.subSector === this.subDomainList[j].value) {
                this.signupForm.get('selectedSubDomains').setValue(this.subDomainList[j].itemName);
                this.activeSubDomainIndex = j;
              }
            }
          }
        },
        () => {
        }
      );
  }
  getDomainIndex(domainname) {
    for (let i = 0; i < this.business_domains.length; i++) {
      if (domainname === this.business_domains[i].domain) {
        return i;
      }
    }
    return 0;
  }
  getSubDomainIndex(domainid, subdomname) {
    for (let j = 0; j < this.business_domains[domainid].subDomains.length; j++) {
      if (subdomname === this.business_domains[domainid].subDomains[j].subDomain) {
        return j;
      }
    }
    return 0;
  }

  createForm(step) {
    this.step = step;
    switch (step) {
      case 1: this.signupForm = this.fb.group({
        is_provider: ['true'],
        phonenumber: ['', Validators.compose(
          [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
        selectedDomainIndex: ['', Validators.compose([Validators.required])],
        selectedSubDomains: [0, Validators.compose([Validators.required])],
        package_id: ['', Validators.compose([Validators.required])],
        terms_condition: ['true'],
      });
        this.signupForm.get('is_provider').setValue(this.is_provider);
        this.changeType();
        break;
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
        this.signupForm.get('is_provider').setValue(this.is_provider);
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
          [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
        first_name: [this.fname, Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
        last_name: [this.lname, Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
        selectedDomainIndex: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
        selectedSubDomains: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
        package_id: ['', Validators.compose([Validators.required])],
        terms_condition: ['false'],

      });
        this.signupForm.get('is_provider').setValue(this.is_provider);
        this.changeType();
        break;
    }
  }

  changeType() {
    this.resetApiErrors();
    this.is_provider = this.signupForm.get('is_provider').value;
    if (this.is_provider === 'true') {
      this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
    } else {
      this.resetValidation(['selectedSubDomains', 'selectedDomainIndex', 'package_id']);
    }
  }
  resetValidation(control_names) {
    // only for  this form
    if (this.is_provider === 'true') {
      control_names.map(control_name => {
        this.signupForm.get(control_name).setValidators(Validators.required);
        this.signupForm.get(control_name).updateValueAndValidity();
      });
    } else {
      control_names.map(control_name => {
        this.signupForm.get(control_name).setValidators(null);
        this.signupForm.get(control_name).updateValueAndValidity();
      });
    }
  }
  setDomain(i) {
    this.domainIsthere = this.business_domains[i] || null;
    this.selectedDomain = this.business_domains[i] || null;
    this.setSubDomains(i);
  }

  setSubDomains(i) {
    this.subDomainList = [];
    const sub_domains = (this.business_domains[i]) ? this.business_domains[i]['subDomains'] : [];
    console.log(sub_domains);
    const sub_domains_sortbyorder = this.shared_functions.sortByKey(sub_domains, 'order');
    sub_domains_sortbyorder.forEach((element, index) => {
      if (this.subdomainSettings[element.subDomain]) {
        console.log(this.subdomainSettings[element.subDomain]);
      }
      const ob = { 'id': index, 'itemName': element.displayName, 'value': element.subDomain };
      this.subDomainList.push(ob);
    });
    this.signupForm.get('selectedSubDomains').setValue(0);
  }

  onItemSelect() {
    // this.license_description = this.license_packages[item.value];
  }

  onSubmit(acc_id?) {
    this.actionstarted = true;
    this.resetApiErrors();
    this.user_details = {};
    let userProfile = {
      countryCode: '+91',
      primaryMobileNo: null, // this.signupForm.get('phonenumber').value || null,
      firstName: null,
      lastName: null
    };
    if (this.data.moreOptions.isCreateProv) {
      userProfile = {
        countryCode: '+91',
        primaryMobileNo: this.data.moreOptions.dataCreateProv.ph || null, // this.signupForm.get('phonenumber').value || null,
        firstName: this.toCamelCase(this.data.moreOptions.dataCreateProv.fname) || null,
        lastName: this.toCamelCase(this.data.moreOptions.dataCreateProv.lname) || null
      };
    } else {
      userProfile = {
        countryCode: '+91',
        primaryMobileNo: this.signupForm.get('phonenumber').value || null,
        firstName: this.toCamelCase(this.signupForm.get('first_name').value) || null,
        lastName: this.toCamelCase(this.signupForm.get('last_name').value) || null,
        // licensePackage: this.signupForm.get('package_id').value || null,
      };
    }

    const fname = userProfile.firstName.trim();
    const lname = userProfile.lastName.trim();
    if (fname === '') {
      this.api_error = 'First name is required';
      if (document.getElementById('first_name')) {
        document.getElementById('first_name').focus();
      }
      return;
    }
    if (lname === '') {
      this.api_error = 'Last name is required';
      if (document.getElementById('last_name')) {
        document.getElementById('last_name').focus();
      }
      return;
    }
    const isAdmin = (this.signupForm.get('is_provider').value === 'true') ? true : false;
    if (isAdmin) {
      const sector = this.selectedDomain.domain || '';
      // const ob = this.signupForm.get('selectedSubDomains').value;
      // const sub_Sector = ob.map(el =>  el.value );
      if (this.data.claimData !== undefined) { // claimmable
        this.user_details = {
          userProfile: userProfile,
          sector: this.business_domains[this.activeDomainIndex].domain,
          subSector: this.subDomainList[this.activeSubDomainIndex].value,
          isAdmin: isAdmin, // checked this to find provider or customer
          // licPkgId: this.signupForm.get('package_id').value || null,
          licPkgId: 9 || null,
          accountId: this.data.claimData.accountId
        };
      } else if (acc_id) {
        this.user_details = {
          userProfile: userProfile,
          sector: this.selectedDomain.domain,
          subSector: this.subDomainList[this.signupForm.get('selectedSubDomains').value].value,
          isAdmin: isAdmin, // checked this to find provider or customer
          // licPkgId: this.signupForm.get('package_id').value || null,
          licPkgId: 9 || null,
          accountId: acc_id
        };
      } else {
        const sub_Sector = this.subDomainList[this.signupForm.get('selectedSubDomains').value].value;
        this.user_details = {
          userProfile: userProfile,
          sector: sector,
          subSector: sub_Sector,
          isAdmin: isAdmin, // checked this to find provider or customer
          // licPkgId: this.signupForm.get('package_id').value || null
          licPkgId: 9 || null
        };
      }
      this.signUpApiProvider(this.user_details);
    } else {
      this.user_details = {
        userProfile: userProfile
      };
      this.signUpApiConsumer(this.user_details);
    }
  }

  signUpApiConsumer(user_details) {
    this.resendemailotpsuccess = false;
    this.shared_services.signUpConsumer(user_details)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.createForm(2);
          this.resendemailotpsuccess = true;
          if (user_details.userProfile &&
            user_details.userProfile.email) {
            this.setMessage('email', user_details.userProfile.email);
          } else {
            this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
          }
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }

  signUpApiProvider(user_details) {
    this.resetApiErrors();
    this.resendemailotpsuccess = false;
    this.shared_services.signUpProvider(user_details)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.shared_functions.setitemonLocalStorage('unClaimAccount', false);
          this.createForm(2);
          this.resendemailotpsuccess = true;
          if (user_details.userProfile &&
            user_details.userProfile.email) {
            this.setMessage('email', user_details.userProfile.email);
          } else {
            this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
          }
        },
        error => {
          this.actionstarted = false;
          if (this.shared_functions.getitemfromLocalStorage('unClaimAccount')) {
            this.onSubmit(error.error);
          } else {
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        }
      );
  }
  onOtpSubmit(submit_data) {
    this.actionstarted = true;
    this.resetApiErrors();
    if (this.is_provider === 'true') {
      this.shared_services.OtpSignUpProviderValidate(submit_data.phone_otp)
        .subscribe(
          () => {
            this.actionstarted = false;
            this.otp = submit_data.phone_otp;
            this.createForm(3);
          },
          error => {
            this.actionstarted = false;
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        );
    } else {
      this.shared_services.OtpSignUpConsumerValidate(submit_data.phone_otp)
        .subscribe(
          () => {
            this.actionstarted = false;
            this.otp = submit_data.phone_otp;
            this.createForm(4);
          },
          error => {
            this.actionstarted = false;
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        );
    }
  }
  skipHearus() {
    this.resetApiErrors();
    this.createForm(4);
  }
  onReferalSubmit(sccode) {
    this.scfound = false;
    this.scCode = null;
    if (sccode) {
      this.scCode = sccode;
      this.scfound = true;
    }
  }
  submitHearus(hearus) {
    this.actionstarted = true;
    this.resetApiErrors();
    const post_data = {
      'hearBy': hearus,
    };
    if (hearus === 'SalesReps') {
      post_data['scCode'] = this.scCode;
    }
    this.shared_services.saveReferralInfo(this.otp, post_data)
    .subscribe(
      () => {
        this.actionstarted = false;
        this.createForm(4);
      },
      error => {
        this.actionstarted = false;
        this.api_error = this.shared_functions.getProjectErrorMesssages(error);
      }
    );
  }
  onPasswordSubmit(submit_data) {
    this.actionstarted = true;
    this.resetApiErrors();
    const ob = this;
    const post_data = { password: submit_data.new_password };
    if (this.is_provider === 'true') {
      this.shared_services.ProviderSetPassword(this.otp, post_data)
        .subscribe(
          () => {
            this.actionstarted = false;
            const login_data = {
              'countryCode': '+91',
              'loginId': this.user_details.userProfile.primaryMobileNo,
              'password': post_data.password
            };
            this.dialogRef.close();
            if (this.ynw_credentials != null) {
              this.shared_functions.doLogout().then(() => {
                this.shared_functions.setitemonLocalStorage('new_provider', 'true');
                this.shared_functions.providerLogin(login_data);
                const encrypted = this.shared_services.set(post_data.password, projectConstants.KEY);
                this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
              });
            } else {
              this.shared_functions.setitemonLocalStorage('new_provider', 'true');
              this.shared_functions.providerLogin(login_data);
              const encrypted = this.shared_services.set(post_data.password, projectConstants.KEY);
              this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
            }
          },
          error => {
            this.actionstarted = false;
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        );
    } else {
      this.shared_services.ConsumerSetPassword(this.otp, post_data)
        .subscribe(
          () => {
            this.actionstarted = false;
            const login_data = {
              'countryCode': '+91',
              'loginId': this.user_details.userProfile.primaryMobileNo,
              'password': post_data.password
            };
            // this.dialogRef.close();
            this.shared_functions.consumerLogin(login_data, this.moreParams)
              .then(
                () => {
                  const encrypted = this.shared_services.set(post_data.password, projectConstants.KEY);
                  this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
                  this.dialogRef.close('success');
                },
                error => {
                  ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
                  // this.api_loading = false;
                }
              );
          },
          error => {
            this.actionstarted = false;
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        );
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  resendOtp(user_details) {
    if (user_details.isAdmin) {
      this.signUpApiProvider(user_details);
    } else {
      this.signUpApiConsumer(user_details);
    }

  }
  clickedPackage(item) {
    // this.selectedpackage = e;
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
      return this.shared_functions.toCamelCase(word);
    } else {
      return word;
    }
  }
  closePwdScreen() {
    this.dialogRef.close();
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
      this.close_message = this.shared_functions.getProjectMesssages('PASSWORD_ERR_MSG');
    }
  }
  goBusinessClicked() {
    this.dialogRef.close();
    this.router.navigate(['/provider-home']);
  }
  // corporate_branch(){
  //   this.CorporateBranch = 'co_branch';
  // }
  // corporate(){
  //   this.action = true;
  // }
  // bank(){
  //   this.bank_action = true;
  // }
  termsClicked() {
    (this.showTermcondition) ? this.showTermcondition = false : this.showTermcondition = true;
  }
}
