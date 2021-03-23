import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { projectConstants } from '../../../app.component';
import { NavigationEnd, Router } from '@angular/router';
import { GroupStorageService } from '../../services/group-storage.service';
import { version } from '../../../shared/constants/version';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-home-app',
  templateUrl: './home-app.component.html',
  styleUrls: ['./home-app.component.css']
})
export class HomeAppComponent implements OnInit, OnDestroy {
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  password_cap = Messages.PASSWORD_CAP;
  login_cap = Messages.LOGIN_CAP;
  forgot_password_cap = Messages.FORGOT_PASS_CAP;
  new_user_cap = Messages.NEW_USER_CAP;
  sign_up_here_cap = Messages.SIGNUP_HERE_CAP;
  loginForm: FormGroup;
  api_error = null;
  is_provider = 'true';
  step = 1;
  moreParams = [];
  api_loading = true;
  show_error = false;
  test_provider = null;
  heading = '';
  signup_here = '';
  evnt;
  constructor(
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    public dialog: MatDialog, public router: Router,
    private lStorageService: LocalStorageService,
    private groupService: GroupStorageService,
    @Inject(DOCUMENT) public document
  ) {
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (router.url === '\/') {
          if (this.shared_functions.isBusinessOwner()) {
            this.shared_functions.getGlobalSettings()
              .then(
                (settings: any) => {
                  setTimeout(() => {
                    if (this.groupService.getitemFromGroupStorage('isCheckin') === 0) {
                      if (settings.waitlist) {
                        router.navigate(['provider', 'check-ins']);
                      } else if (settings.appointment) {
                        router.navigate(['provider', 'appointments']);
                      } else if (settings.order) {
                        router.navigate(['provider', 'orders']);
                      } else {
                        router.navigate(['provider', 'settings']);
                      }
                    } else {
                      router.navigate(['provider', 'settings']);
                    }
                  }, 500);
                });
          }
        }
      }
    });
  }
  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('parent-cont');
    this.createForm();
    this.api_loading = false;
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('parent-cont');
  }
  createForm() {
    this.loginForm = this.fb.group({
      phonenumber: ['', Validators.compose(
        [Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }
  showError() {
    this.show_error = true;
    const pN = this.document.getElementById('phonenumber').value.trim();
    const pW = this.document.getElementById('password').value.trim();
    if (pN === '') {
      if (this.document.getElementById('phonenumber')) {
        this.document.getElementById('phonenumber').focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
  }
  onSubmit(data) {
    this.resetApiErrors();
    const pN = data.phonenumber.trim();
    const pW = data.password.trim();
    if (pN === '') {
      if (this.document.getElementById('phonenumber')) {
        this.document.getElementById('phonenumber').focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    const post_data = {
      'countryCode': '+91',
      'loginId': data.phonenumber,
      'password': data.password,
      'mUniqueId': null
    };
    const cVersion = version.desktop;
    this.api_loading = true;
    post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
    this.shared_functions.doLogout().then(
      () => {
        this.shared_functions.businessLogin(post_data)
          .then(
            () => {
              this.lStorageService.setitemonLocalStorage('version', cVersion);
              this.router.navigate(['/provider']);
              setTimeout(() => {
              }, projectConstants.TIMEOUT_DELAY_SMALL);
            },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              this.api_loading = false;
            }
          );
      }
    )
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  doSignup() {
    this.router.navigate(['business/signup']);
  }
  handlekeyup(ev) {
    if (ev.keyCode !== 13) {
      this.resetApiErrors();
    }
  }
  resetApiErrors() {
    this.api_error = null;
  }
  onChangePassword() {
    this.step = 1;
  }
}
