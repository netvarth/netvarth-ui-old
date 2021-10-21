import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { ProviderDataStorageService } from '../../../../business/services/provider-datastorage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AuthService } from '../../../../shared/services/auth-service';
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
  api_loading = true;
  loginId = null;
  accountId: string;
  password = null;
  type;
  constructor(
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public activaterouterobj: ActivatedRoute,
    private provider_dataStorage: ProviderDataStorageService,
    public router: Router, private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.activaterouterobj.paramMap
      .subscribe(params => {
        this.loginId = params.get('userId');
        this.accountId = params.get('accountId');
        if (this.shared_functions.checkLogin()) {
          this.authService.logoutNoRedirect();
        }
      });
    this.activated_route.queryParams.subscribe(
      params => {
        this.type = params.type;
      });
  }
  ngOnInit() {
    this.api_loading = false;
  }
  login(data) {
    const pW = this.password;
    // const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': this.loginId,
      'password': pW,
      accountId: this.accountId
    };
    this.api_loading = true;
    this.authService.adminLogin(post_data, this.type)
      .then(
        () => {
          this.lStorageService.removeitemfromLocalStorage('customId');
          const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
          this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
          this.provider_dataStorage.setWeightageArray([]);
          this.lStorageService.setitemonLocalStorage('popupShown', 'false');
          this.api_loading = false;
          this.router.navigate(['home']);
          // this.dialogRef.close();
          setTimeout(() => {
          }, projectConstants.TIMEOUT_DELAY_SMALL);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }
}
