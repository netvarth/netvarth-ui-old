import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class AdminLoginComponent implements OnInit {

  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  password_cap = Messages.PASSWORD_CAP;
  login_cap = Messages.LOGIN_CAP;
  forgot_password_cap = Messages.FORGOT_PASS_CAP;
  new_user_cap = Messages.NEW_USER_CAP;
  sign_up_here_cap = Messages.SIGNUP_HERE_CAP;
  loginForm: FormGroup;
  api_loading = true;
  loginId = null;
  accountId: string;
  password = null;
  constructor(
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public activaterouterobj: ActivatedRoute,
    private provider_dataStorage:ProviderDataStorageService,
    public router: Router
  ) {
    this.activaterouterobj.paramMap
      .subscribe(params => {
        this.loginId = params.get('userId');
        this.accountId = params.get('accountId');
        if (this.shared_functions.checkLogin()) {
          this.shared_functions.logoutNoRedirect();
        }
      });
  }
  ngOnInit() {
    this.createForm();
    this.api_loading = false;
  }
  createForm() {
    this.loginForm = this.fb.group({
      password: ['', Validators.compose([Validators.required])],
    });
  }
  login(data) {
    const pW = this.password;
    const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': this.loginId,
      'password': pW,
      accountId: this.accountId
    };
    this.api_loading = true;
    this.shared_functions.adminLogin(post_data)
      .then(
        () => {
          const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
          this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
          this.provider_dataStorage.setWeightageArray([]);
          this.api_loading = false;
          this.router.navigate(['home']);
          // this.dialogRef.close();
          setTimeout(() => {
          }, projectConstants.TIMEOUT_DELAY_SMALL);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }
}
