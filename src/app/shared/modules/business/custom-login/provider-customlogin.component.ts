import { Component, OnInit } from '@angular/core';;
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../constants/project-constants';
import { LoginComponent } from '../../../components/login/login.component';
import { SharedFunctions } from '../../../functions/shared-functions';
import { SharedServices } from '../../../services/shared-services';
import { FormMessageDisplayService } from '../../form-message-display/form-message-display.service';
import { SignUpComponent } from '../../../components/signup/signup.component';
import { ForgotPasswordComponent } from '../../../components/forgot-password/forgot-password.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GroupStorageService } from '../../../services/group-storage.service';
import { AuthService } from '../../../services/auth-service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';

@Component({
  selector: 'app-pCustomlogin',
  templateUrl: './provider-customlogin.component.html',
  styleUrls: ['./provider-customlogin.component.css']
})

export class ProviderCustomLoginComponent implements OnInit {
  show_jaldeegrow = true;
  mobilenumber;
  password;
  document;
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
  countryCodes = projectConstantsLocal.COUNTRY_CODES;
  selectedCountryCode;
  phOrem_error = '';
  qParams;
  carouselTwo;
  evnt;
  busLoginId: any;
  logoUrl: string;
  graphicsUrl: string;
  prefix = '';
  idCaption = 'Mobile/Email';
  idPlaceHolder = 'Enter Mobile/Email';
  deviceId: any;
  loading = true;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public shared_services: SharedServices,
    public dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private authService: AuthService,
    private providerServices: ProviderServices,
    private commonDataStorage: CommonDataStorageService
  ) {

    this.activateRoute.queryParams.subscribe(data => {
      this.qParams = data;
      console.log("Params:", data);
      if (data.type) {
        this.lStorageService.setitemonLocalStorage('logintype', data.type);
      }
      if (data.device) {
        this.lStorageService.setitemonLocalStorage('deviceName', data.device);
      }
      if (data.at) {
        this.deviceId = data.at;
        this.lStorageService.setitemonLocalStorage('reqFrom', 'SP_APP');
      }
      if (data.muid) {
        const prevMuid = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        if (data.muid !== prevMuid) {
          const request = {
            "mUniqueIdOld": prevMuid,
            "mUniqueId": data.muid
          }
          this.shared_services.updateProviderMUniqueId(request).subscribe(
            () => {
              this.lStorageService.setitemonLocalStorage('mUniqueId', data.muid);
            }
          )
        }
      }
    });
    this.activateRoute.params.subscribe(data => {
      this.qParams = data;
      this.busLoginId = this.qParams.id;
    });
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(router.url);
        if (router.url.startsWith('/business/' + this.busLoginId + '/login')) {
          if (this.shared_functions.isBusinessOwner()) {
            this.providerServices.getAccountSettings()
              .then(
                (settings: any) => {
                  setTimeout(() => {
                    if (this.groupService.getitemFromGroupStorage('isCheckin') === 0) {
                      if (this.lStorageService.getitemfromLocalStorage('cdl')) {
                        router.navigate(['provider', 'cdl']);
                      } else if (settings.appointment) {
                        router.navigate(['provider', 'appointments']);
                      } else if (settings.waitlist) {
                        router.navigate(['provider', 'check-ins']);
                      } else if (settings.order) {
                        router.navigate(['provider', 'orders']);
                      } else if (settings.enableTask) {
                        router.navigate(['provider', 'crm']);
                      } else {
                        router.navigate(['provider', 'settings']);
                      }
                    } else {
                      router.navigate(['provider', 'settings']);
                    }
                  }, 500);
                }, (error) => {
                  this.loading = false;
                });
          } else {
            this.loading = false;
          }
        }
      }
    });
  }

  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;


    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: 'true'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'showsignupfromlogin') {
        this.doSignup(origin);
      }
    });


  }
  cancelForgotPassword() {
    this.step = 1;
  }

  initPageValues() {
    console.log(this.busLoginId);
    console.log(projectConstantsLocal.CUSTOM_PROV_APP);
    if (projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId] && projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['prefix']) {
      this.prefix = projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['prefix'];
    }
    if (projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId] && projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['pathref']) {
      this.logoUrl = projectConstantsLocal.UIS3PATH + projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['pathref'] + '/plogo.png';
      console.log(this.logoUrl);
      this.graphicsUrl = projectConstantsLocal.UIS3PATH + projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['pathref'] + '/pgraphics.png';
    } else {
      this.logoUrl = 'assets/images/jaldee-businesslogo.png';
      this.graphicsUrl = 'assets/images/login_pge.png';
    }
    if (projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId] && projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['idCaption']) {
      this.idCaption = projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['idCaption'];
      this.idPlaceHolder = projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['idPlaceholder'];
    }
    if (projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId] && projectConstantsLocal.CUSTOM_PROV_APP[this.busLoginId]['cdl']) {
      this.lStorageService.setitemonLocalStorage('cdl', true);
    }
  }

  ngOnInit() {

    this.initPageValues();
    this.createForm();
    if (this.countryCodes.length !== 0) {
      this.selectedCountryCode = this.countryCodes[0].value;
    }
    this.api_loading = false;
  }
  openCity(evt, cityName) {
    this.show_jaldeegrow = false;
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.target.className += ' active';
  }

  doSignup(origin?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'true'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });

  }


  onSubmit(data) {
    // console.log("onsubmit function:",data)
    this.api_loading = true;
    const pN = data.emailId.trim();
    const pW = data.password;
    if (pN === '') {
      if (this.document.getElementById('emailId')) {
        this.document.getElementById('emailId').focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    const loginId = pN + this.prefix;
    const post_data = {
      'countryCode': this.selectedCountryCode,
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    this.sessionStorageService.removeitemfromSessionStorage('tabId');
    post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
    // this.shared_functions.clearSessionStorage();
    this.sessionStorageService.clearSessionStorage();
    this.commonDataStorage.clearSpSettings();
    this.authService.businessLogin(post_data)
      .then(
        () => {
          const encrypted = this.shared_services.set(this.password, projectConstantsLocal.KEY);
          this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
          this.lStorageService.setitemonLocalStorage('bpwd', data.password);
          this.lStorageService.setitemonLocalStorage('busLoginId', this.busLoginId);
          if (this.qParams && this.qParams['src']) {
            if (this.qParams['src'] && this.lStorageService.getitemfromLocalStorage(this.qParams['src'])) {
              this.router.navigateByUrl(this.lStorageService.getitemfromLocalStorage(this.qParams['src']));
            } else {
              console.log("1 provider")
              this.router.navigate(['/provider']);
            }
          } else {
            // console.log("2 provider")
            this.router.navigate(['/provider']);
          }
        },
        error => {
          if (error.status === 401 && error.error === 'Session already exists.') {
            this.authService.doLogout().then(() => {
              this.onSubmit(data);
            });
          } else {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
          this.api_loading = false;
        }
      );
  }

  createForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_SPACE_NOT_ALLOWED)])],
      password: ['', Validators.compose([Validators.required])]

    });
  }
  showError() {
    this.show_error = true;
    const pN = this.document.getElementById('emailId').value.trim();
    const pW = this.document.getElementById('password').value;
    if (pN === '') {
      if (this.document.getElementById('emailId')) {
        this.document.getElementById('emailId').focus();
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
  resetApiErrors() {
    this.api_error = null;
  }
  onChangePassword() {
    this.step = 1;
  }
  doSignuppage() {
    this.routerobj.navigate(['business/signup']);
  }
  gotoproducts() {
    const navigationExtras: NavigationExtras = {
      queryParams: { type: 'products' }
    };
    this.router.navigate(['business'], navigationExtras);
  }
  doLoginpage() {
    this.routerobj.navigate(['business/login']);
  }
}
