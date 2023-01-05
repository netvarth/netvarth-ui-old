import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Location } from '@angular/common';
import { WordProcessor } from '../../services/word-processor.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { isValidNumber } from 'libphonenumber-js';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-change-mobile',
  templateUrl: './change-mobile.component.html',
  styleUrls: ['./change-mobile.component.css']

})
export class ChangeMobileComponent implements OnInit {

  mobile_cap = Messages.CHANGEMOBILE_CAP;
  your_curmob_msg = Messages.CURRENTMOBMSG;
  verified_cap = Messages.PHONE_VERIFIED;
  save_btn_cap = Messages.SAVE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_pass_cap = Messages.CHANGE_PASSWORD_CAP;
  add_change_email_cap = Messages.ADD_CHANGE_EMAIL;
  family_members_cap = Messages.FAMILY_MEMBERS;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  changemob_cap = Messages.CHANGE_MOB_CAP;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  spForm: UntypedFormGroup;
  private subs = new SubSink();
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  prev_phonenumber;
  countryCode = 91;
  currentcountryCode;
  step = 1;
  curtype;
  usertype;
  countrycodesymbol='+'
  submit_data: any = {};
  accountId: any;
  customId: any;
  theme: any;
  fromApp: boolean;
  constructor(private fb: UntypedFormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private activated_route: ActivatedRoute,
    public translate: TranslateService,
  ) { 
    this.subs.sink = this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.accountId) {
        this.accountId = qparams.accountId;
      }
      if (qparams && qparams.customId) {
        this.customId = qparams.customId;
        this.fromApp = true;
      }
      if(qparams && qparams.theme) {
        this.theme = qparams.theme;
      }
    });
  }
  goBack() {
    this.location.back();
  }
  ngOnInit() {
    this.translate.use(JSON.parse(localStorage.getItem('translatevariable'))) 
    this.translate.stream('CHANGE_MOB_CAP').subscribe(v=>{this.mobile_cap = v});
    this.translate.stream('RELATED_LINKS').subscribe(v => {this.related_links_cap = v});
    this.translate.stream('USER_PROF_CAP').subscribe(v=>this.user_profile_cap=v);
    this.translate.stream('DASHBOARD_TITLE').subscribe(v => {this.dashboard_cap=v});
    this.translate.stream('CHANGE_PASSWORD_CAP').subscribe(v=> {this.change_pass_cap = v});
    this.translate.stream('FAMILY_MEMBERS').subscribe(v=>{this.family_members_cap = v});
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.spForm = this.fb.group({
      countryCode: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(2),
      ])],
      phonenumber: ['', Validators.compose(
        [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])]
    });
    this.getProfile();
  }
  getProfile() {
    const ob = this;
    this.shared_functions.getProfile()
      .then(
        success => {
          this.user_details = success;
          this.step = 1;
          if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
            this.prev_phonenumber = success['basicInfo']['mobile'];
            this.currentcountryCode = success['basicInfo']['countryCode'];
            this.spForm.patchValue({
              'countryCode': this.currentcountryCode || null
            });
            this.is_verified = success['basicInfo']['phoneVerified'];
          } else {
            this.prev_phonenumber = success['userProfile']['primaryMobileNo'];
            this.currentcountryCode = success['userProfile']['countryCode'];
            this.spForm.patchValue({
              'countryCode': this.currentcountryCode || null
            });
            this.is_verified = success['userProfile']['phoneVerified'];
          }
        },
        error => { ob.api_error = this.wordProcessor.getProjectErrorMesssages(error); }
      );
  }
  public bothnumberandcountrycode;
  onSubmit(submit_data) {
    console.log(submit_data.countryCode + submit_data.phonenumber);

    if (!submit_data.phonenumber) { return false; }
    if (!submit_data.countryCode) { return false; }
    if(submit_data.countryCode[0]!='+') {
      this.bothnumberandcountrycode='+'+submit_data.countryCode + submit_data.phonenumber;
    }
    else {
      this.bothnumberandcountrycode=submit_data.countryCode + submit_data.phonenumber
    }
    this.resetApiErrors();
    if (isValidNumber(this.bothnumberandcountrycode)) {
      this.shared_services.verifyNewPhone(submit_data.phonenumber, this.shared_functions.isBusinessOwner('returntyp'), submit_data.countryCode)
        .subscribe(
          () => {
            this.step = 2;
            this.submit_data = submit_data;
            setTimeout(() => {
              this.api_success = '';
              this.spForm.reset();
            }, projectConstants.TIMEOUT_DELAY_LARGE6);
          },
          error => {
            this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
          }
        );
    } else {
      this.snackbarService.openSnackBar('Please recheck the country code and number', { 'panelClass': 'snackbarerror' });
    }
  }
  isVerified(data) {
    if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
      if (this.user_details.basicInfo.mobile === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    } else {
      if (this.user_details.userProfile.primaryMobileNo === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    }
  }
  resetApiErrors() {
    this.api_error = null;
  }
  resendOtp(phonenumber) {
    this.onSubmit(phonenumber);
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
  }
  onOtpSubmit(submit_data) {
    this.resetApiErrors();
    const post_data = {
      'countryCode': this.submit_data.countryCode,
      'loginId': this.submit_data.phonenumber
    };
    this.shared_services.verifyNewPhoneOTP(submit_data, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        () => {
          console.log(this.submit_data.phonenumber);
          this.api_success = null;
          this.snackbarService.openSnackBar(Messages.PHONE_VERIFIED);
          const ynw = this.shared_functions.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
          console.log(ynw)// get the credentials from local storage variable
          ynw['loginId'] = this.submit_data.phonenumber; // change the phone number to the new one in the local storage variable
          ynw['countryCode'] = this.submit_data.countryCode;
          console.log(ynw);
          this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw); // saving the updation to the local storage variable
          setTimeout(() => {
            this.location.back();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
  redirectto(mod, usertype) {
    let queryParams = {};
    if (this.customId) {
      queryParams['customId'] = this.customId;
    }
    if(this.accountId) {
      queryParams['accountId'] = this.accountId;
    }
    if(this.theme) {
      queryParams['theme'] = this.theme;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    switch (mod) {
      case 'profile':
        this.router.navigate([usertype, 'profile'], navigationExtras);
        break;
      case 'change-password':
        this.router.navigate([usertype, 'change-password'], navigationExtras);
        break;
      case 'members':
        this.router.navigate([usertype, 'members'], navigationExtras);
        break;
    }
  }
}
