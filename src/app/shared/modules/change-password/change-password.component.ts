import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';

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
  spForm: FormGroup;
  api_error = null;
  api_success = null;
  curtype;
  isBusinessowner = false;
  breadcrumbs_init: { title: string; url: string; }[];
  breadcrumbs: any;


  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService
  ) {
    this.isBusinessowner = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.breadcrumbs_init = [
      {
        title: 'Change Password',
        url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-password'
      }
    ];
    this.breadcrumbs = this.breadcrumbs_init;
   }
  goBack() {
    this.location.back();
  }
  ngOnInit() {

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
            const ynw = this.lStorageService.getitemfromLocalStorage('ynw-credentials'); // get the credentials from local storage variable
            const encrypted = this.shared_services.set(sub_data.new_password, projectConstants.KEY);
            this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
            // ynw.password = sub_data.new_password; // change the password to the new one in the local storage variable
            this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw); // saving the updation to the local storage variable
            this.snackbarService.openSnackBar(Messages.PASSWORD_CHANGED);
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
      this.snackbarService.openSnackBar(Messages.PASSWORD_MISMATCH, { 'panelClass': 'snackbarerror' });
      // this.api_error = Messages.PASSWORD_MISMATCH;
    }

  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
  resetApiErrors() {
    this.api_error = null;
  }
}
