import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantsLocal } from '../../constants/project-constants';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  // styleUrls: ['./home.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  old_password_cap = Messages.OLD_PASSWORD_CAP;
  new_password_cap = Messages.NEW_PASSWORD_CAP;
  re_enter_password_cap = Messages.RE_ENTER_PASSWORD_CAP;
  done_btn_cap = Messages.DONE_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_mobile_cap = Messages.CHANGE_MOB_CAP;
  add_change_email_cap = Messages.ADD_CHANGE_EMAIL;
  family_members_cap = Messages.FAMILY_MEMBERS;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  spForm: UntypedFormGroup;
  api_error = null;
  api_success = null;
  curtype;
  isBusinessowner = false;
  customId: any;
  accountId: any;
  private subs = new SubSink();
  theme: any;
  constructor(private fb: UntypedFormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    public translate: TranslateService,
  ) {
    this.isBusinessowner = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.subs.sink = this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.accountId) {
        this.accountId = qparams.accountId;
      }
      if (qparams && qparams.customId) {
        this.customId = qparams.customId;
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

    this.translate.stream('FAMILY_MEMBERS').subscribe(v=>{this.family_members_cap = v});
    this.translate.stream('RELATED_LINKS').subscribe(v => {this.related_links_cap = v});
    this.translate.stream('CHANGE_MOB_CAP').subscribe(v=>{this.change_mobile_cap = v});
    this.translate.stream('USER_PROF_CAP').subscribe(v=>this.user_profile_cap=v);
    if (this.curtype!=='consumer') {
      this.spForm = this.fb.group({
        old_password: ['', Validators.compose(
          [Validators.required])],
        new_password: ['', Validators.compose(
          [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
        confirm_password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
      });
    } else if(this.curtype==='consumer') {
      this.spForm = this.fb.group({
        old_password: ['', Validators.compose(
          [Validators.required])],
        new_password: ['', Validators.compose(
          [Validators.required])],
        confirm_password: ['', Validators.compose([Validators.required])],
      });
    }
  }

  onSubmit(sub_data) {

    if (sub_data.new_password === sub_data.confirm_password) {

      const post_data = {
        'oldpassword': sub_data.old_password,
        'password': sub_data.new_password
      };
      this.api_error = this.api_success = '';
      this.shared_services.changePasswordProfile(post_data, this.shared_functions.isBusinessOwner('returntyp'))
        .subscribe(
          () => {
            // this.api_success = Messages.PASSWORD_CHANGED;
            const ynw = this.shared_functions.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials')); // get the credentials from local storage variable
            const encrypted = this.shared_services.set(sub_data.new_password, projectConstantsLocal.KEY);
            this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
            // ynw.password = sub_data.new_password; // change the password to the new one in the local storage variable
            this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw); // saving the updation to the local storage variable
            this.snackbarService.openSnackBar(this.translate.instant('PASSWORD_CHANGED'));
            this.spForm.reset();
          },
          error => {
            // this.api_error = error.error;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            if (error.status === 419) { // case of session expired
              this.router.navigate(['/logout']);
            }
          }
        );

    } else {
      this.snackbarService.openSnackBar(this.translate.instant('PASSWORD_MISMATCH'), { 'panelClass': 'snackbarerror' });
      // this.api_error = Messages.PASSWORD_MISMATCH;
    }

  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
  resetApiErrors() {
    this.api_error = null;
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
      case 'change-mobile':
        this.router.navigate([usertype, 'change-mobile'], navigationExtras);
        break;
      case 'members':
        this.router.navigate([usertype, 'members'], navigationExtras);
        break;
    }
  }
}

