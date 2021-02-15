import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';;
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { LoginComponent } from '../../../../shared/components/login/login.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { FormMessageDisplayService } from '../../form-message-display/form-message-display.service';
import { projectConstants } from '../../../../app.component';
import { SignUpComponent } from '../../../../shared/components/signup/signup.component';
import { ForgotPasswordComponent } from '../../../../shared/components/forgot-password/forgot-password.component';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SessionStorageService } from '../../../../shared/services/session-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Title } from '@angular/platform-browser';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-plogin',
  templateUrl: './provider-login.component.html',
  styleUrls: ['../../../../../assets/css/pages/login/login-3.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/style.bundle.css']
})
export class ProviderLoginComponent implements OnInit {
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

  // images = {
  //   special_offers: 'assets/images/special offer-01-01.png',
  //   jaldee_online: 'assets/images/home/jaldee_online.svg',
  //   jaldee_token: 'assets/images/home/jaldee_token.svg',
  //   jaldee_checkin: 'assets/images/home/jaldee_checkin.svg',
  //   jaldee_appt: 'assets/images/home/jaldee_appointment.svg',
  //   jaldee_comm: 'assets/images/home/jaldee_comm.svg',
  //   jaldee_pos: 'assets/images/home/jaldee_pos.svg',
  //   jaldee_pay: 'assets/images/home/jaldee_pay.svg',
  //   jaldee_coupon: 'assets/images/home/jaldee_coupons.svg',
  //   jaldee_pet: 'assets/images/home/pet-01.svg',
  //   jaldee_bank: 'assets/images/home/bank-01.svg',
  //   jaldee_religious: 'assets/images/home/religoues presets-01.svg',
  //   jaldee_vastu: 'assets/images/home/vasthu-01.svg',
  //   jaldee_food: 'assets/images/home/foodand beverages-01.svg',
  //   jaldee_prof: 'assets/images/home/Proffesional.jpg',
  //   jaldee_personal: 'assets/images/home/personal-care.jpg',
  //   jaldee_health: 'assets/images/home/HealthCare.jpg',
  //   jaldee_kiosk: 'assets/images/home/jaldee_kiosk.svg',

  //   jaldee_qMgr: 'assets/images/home/qmanager.png',
  //   jaldee_onlineN: 'assets/images/home/Jaldee_online.png',
  //   jaldee_payN: 'assets/images/home/jaldee_pay3.png',
  //   jaldee_takeout: 'assets/images/home/Appoinment.png',
  //   jaldee_appDesktop: 'assets/images/home/available-app.png',
  //   jaldee_playstore: 'assets/images/home/app_btn1.png',
  //   jaldee_appstore: 'assets/images/home/app_btn2.png'
  // };
  phOrem_error = '';
  qParams;

  @ViewChild('mobPrefix') mobPrefix: ElementRef;
  carouselTwo;
  evnt;
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
    private titleService: Title,
    private groupService: GroupStorageService
  ) {
    this.titleService.setTitle('Jaldee Business - Login');
    this.activateRoute.queryParams.subscribe(data => {
      this.qParams = data;
    });
    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (router.url === '/business/login') {
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
  ngOnInit() {
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
    const pN = data.emailId.trim();
    const pW = data.password.trim();
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
    const loginId = pN;
    const post_data = {
      'countryCode': this.selectedCountryCode,
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    this.sessionStorageService.removeitemfromSessionStorage('tabId');
    post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
    this.shared_functions.clearSessionStorage();
    this.shared_functions.businessLogin(post_data)
      .then(
        () => {
          const encrypted = this.shared_services.set(this.password, projectConstants.KEY);
          this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
          this.lStorageService.setitemonLocalStorage('bpwd', data.password);
          if (this.qParams && this.qParams['src']) {
            if (this.qParams['src'] && this.lStorageService.getitemfromLocalStorage(this.qParams['src'])) {
              this.router.navigateByUrl(this.lStorageService.getitemfromLocalStorage(this.qParams['src']));
            } else {
              this.router.navigate(['/provider']);
            }
          } else {
            this.router.navigate(['/provider']);
          }
        },
        error => {
          if (error.status === 401 && error.error === 'Session already exists.') {
            this.shared_functions.doLogout().then(() => {
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
      emailId: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }
  showError() {
    this.show_error = true;
    const pN = this.document.getElementById('emailId').value.trim();
    const pW = this.document.getElementById('password').value.trim();
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
  handlekeyup(ev) {
    console.log(ev.target.value);
    if (/^\d+$/.test(ev.target.value)) {
      console.log('Contain numbers only');
      this.mobPrefix.nativeElement.style.display = 'flex';
      this.mobPrefix.nativeElement.class = 'input-group-prepend mob-prefix';
    } else {
      this.mobPrefix.nativeElement.style.display = 'none';
    }
    if (ev.keyCode !== 13) {
      this.resetApiErrors();
    }
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
