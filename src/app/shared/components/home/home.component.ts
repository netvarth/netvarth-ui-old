import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
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

  constructor(
    // public dialogRef: MatDialogRef<LoginComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public dialog: MatDialog,
    @Inject(DOCUMENT) public document
  ) {
    if (this.shared_functions.checkLogin()) {
      this.shared_functions.logout();
    }
    // this.test_provider = data.test_account;
    // this.is_provider = data.is_provider || 'true';
  }
  ngOnInit() {
     // this.moreParams = this.data.moreparams;
     const body = document.getElementsByTagName('body')[0];
     body.classList.add('parent-cont');
     this.createForm();
     this.api_loading = false;
     // if (this.data.is_provider === 'true') {
     //   this.signup_here = 'Want to become a Service Provider? ';
     // } else if (this.data.is_provider === 'false') {
     //   this.signup_here = 'Want to become a Jaldee Customer? ';
     // }
     // if (this.data.type === 'provider') {
     //   this.heading = 'Service Provider Login';
     // } else if (this.data.type === 'consumer') {
     //   this.heading = 'Jaldee Customer Login';
     // }
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('parent-cont');
  }

  // handleScroll(target) {
  //   this.triggerScrollTo(target);
  // }
  createForm() {
    this.loginForm = this.fb.group({
      // phonenumber: ['', Validators.compose(
      //   [Validators.required,
      //   Validators.maxLength(10),
      //   Validators.minLength(10),
      //   Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
        emailId: [''],
      password: ['', Validators.compose([Validators.required])]
    });
  }
  showError() {
    this.show_error = true;
    // const pN = this.document.getElementById('phonenumber').value.trim();
    const pN = this.document.getElementById('emailId').value.trim();
    const pW = this.document.getElementById('password').value.trim();
    // if (pN === '') {
    //   if (this.document.getElementById('phonenumber')) {
    //     this.document.getElementById('phonenumber').focus();
    //     return;
    //   }
    // }
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
  onSubmit(data) {
    this.resetApiErrors();
    // const pN = data.phonenumber.trim();
    const pN = data.emailId.trim();
    const pW = data.password.trim();
    // if (pN === '') {
    //   if (this.document.getElementById('phonenumber')) {
    //     this.document.getElementById('phonenumber').focus();
    //     return;
    //   }
    // }
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
    const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    post_data.mUniqueId = localStorage.getItem('mUniqueId');
    this.api_loading = true;
    // if (this.data.type === 'provider') {
    this.shared_functions.consumerLogin(post_data, this.moreParams)
      .then(
        () => {
          // this.dialogRef.close();
          const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
          this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
          setTimeout(() => {
            // this.dialogRef.close();
          }, projectConstants.TIMEOUT_DELAY_SMALL);
        },
        error => {
          ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.api_loading = false;
        }
      );
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  handleSignup() {
    //   if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin' || this.moreParams['source'] === 'business_page')) {
    //     this.dialogRef.close('showsignup');
    //   } else {
    //     this.dialogRef.close('showsignupfromlogin'); // closing the signin window
    //   }
  }
  // doSignup() {
  //   const dialogReflog = this.dialog.open(SignUpComponent, {
  //     width: '50%',
  //     panelClass: ['signupmainclass', 'popup-class'],
  //     disableClose: true,
  //     data: { is_provider: 'true' }
  //   });
  //   dialogReflog.afterClosed().subscribe(() => {
  //   });
  // }
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
  // setRequiredCaptions() {
  //   // building array to hold the details related to the specialization
  //   this.special_info['healthCare'] = [
  //     { 'caption': 'Paediatrics', 'kw': 'Paediatrics', 'kwautoname': 'Paediatrics', 'kwtyp': 'special' },
  //     { 'caption': 'Ayurvedic Medicine', 'kw': 'AyurvedicMedicine', 'kwautoname': 'Ayurvedic Medicine', 'kwtyp': 'special' },
  //     { 'caption': 'Dentists', 'kw': 'dentists', 'kwautoname': 'Dentists', 'kwtyp': 'subdom' }
  //   ];

  //   this.special_info['personalCare'] = [
  //     { 'caption': 'Beauty Care for Men', 'kw': 'BeautyCareForMen', 'kwautoname': 'Beauty Care for Men', 'kwtyp': 'special' },
  //     { 'caption': 'Beauty Care for Women', 'kw': 'BeautyCareForWomen', 'kwautoname': 'Beauty Care for Women', 'kwtyp': 'special' },
  //     { 'caption': 'Personal Fitness', 'kw': 'HairSalonForKids', 'kwautoname': 'Personal Fitness', 'kwtyp': 'special' }
  //   ];
  //   this.special_info['professionalConsulting'] = [
  //     { 'caption': 'Lawyer', 'kw': 'lawyers', 'kwautoname': 'Lawyer', 'kwtyp': 'subdom' },
  //     { 'caption': 'Tax Consultants', 'kw': 'taxConsultants', 'kwautoname': 'Tax Consultants', 'kwtyp': 'subdom' },
  //     { 'caption': 'Civil Architects', 'kw': 'civilArchitects', 'kwautoname': 'Civil Architects', 'kwtyp': 'subdom' },
  //     { 'caption': 'Chartered Accountants', 'kw': 'charteredAccountants', 'kwautoname': 'Chartered Accountants', 'kwtyp': 'subdom' }
  //   ];
  //   this.special_info['finance'] = [
  //     { 'caption': 'Bank', 'kw': 'bank', 'kwautoname': 'Bank', 'kwtyp': 'subdom' },
  //     { 'caption': 'NBFC', 'kw': 'nbfc', 'kwautoname': 'NBFC', 'kwtyp': 'subdom' },
  //     { 'caption': 'Insurance', 'kw': 'insurance', 'kwautoname': 'Insurance', 'kwtyp': 'subdom' }
  //   ];
  //   // building array to hold the details related to the domains
  //   this.sector_info['healthCare'] = {
  //     'simg': 'assets/images/home/HealthCare.jpg',
  //     'caption1': '1000s of Doctors', 'caption2': '', 'special': this.special_info['healthCare']
  //   };
  //   this.sector_info['personalCare'] = {
  //     'simg': 'assets/images/home/personal-care.jpg',
  //     'caption1': '', 'caption2': '', 'special': this.special_info['personalCare']
  //   };
  //   this.sector_info['professionalConsulting'] = {
  //     'simg': 'assets/images/home/Proffesional.jpg',
  //     'caption1': '', 'caption2': '', 'special': this.special_info['professionalConsulting']
  //   };
  //   this.sector_info['finance'] = {
  //     'simg': 'assets/images/home/Graphs-055.jpg',
  //     'caption1': '', 'caption2': '', 'special': this.special_info['finance']
  //   };
  // }
  // playvideoClicked() {
  //   document.getElementById('vidwrap').innerHTML = '<iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/qF4gLhQW2CE?controls=1&rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  // }

  // setSystemDate() {
  //   this.shared_service.getSystemDate()
  //     .subscribe(
  //       res => {
  //         this.shared_functions.setitemonLocalStorage('sysdate', res);
  //       });
  // }
  // getDomainList() {
  //   const bconfig = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
  //   let run_api = true;
  //   if (bconfig && bconfig.cdate && bconfig.bdata) { // case if data is there in local storage
  //     const bdate = bconfig.cdate;
  //     const bdata = bconfig.bdata;
  //     const saveddate = new Date(bdate);
  //     if (bconfig.bdata) {
  //       const diff = this.shared_functions.getdaysdifffromDates('now', saveddate);
  //       if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
  //         run_api = false;
  //         this.domainlist_data = bdata;
  //         // this.domainlist_data = ddata.bdata;
  //         this.domain_obtained = true;
  //       }
  //     }
  //   }
  //   if (run_api) { // case if data is not there in data
  //     this.shared_service.bussinessDomains()
  //       .subscribe(
  //         res => {
  //           this.domainlist_data = res;
  //           this.domain_obtained = true;
  //           const today = new Date();
  //           const postdata = {
  //             cdate: today,
  //             bdata: this.domainlist_data
  //           };
  //           this.shared_functions.setitemonLocalStorage('ynw-bconf', postdata);
  //         }
  //       );
  //   }
  // }
  // handle_home_domain_click(obj) {
  //   this.keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
  //   this.selected_domain = obj.domain;
  //   this.handle_search();
  // }
  // handle_homelinks_click(kw, kwautoname, kwdomain, kwsubdomain, kwtyp) {
  //   this.selected_domain = kwdomain;
  //   this.keywordholder.autoname = kwautoname;
  //   this.keywordholder.name = kw;
  //   this.keywordholder.domain = kwdomain || '';
  //   this.keywordholder.subdomain = kwsubdomain || '';
  //   this.keywordholder.typ = kwtyp;

  //   this.selected_domain = kwdomain;

  //   this.handle_search();
  // }
  // handle_search() {
  //   const localloc = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
  //   if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
  //     this.locationholder = localloc;
  //   }
  //   const passparam = {
  //     do: this.selected_domain || '',
  //     la: this.locationholder.lat || '',
  //     lo: this.locationholder.lon || '',
  //     lon: this.locationholder.name || '',
  //     lonauto: this.locationholder.autoname || '',
  //     kw: this.keywordholder.name || '',
  //     kwauto: this.keywordholder.autoname || '',
  //     kwdomain: this.keywordholder.domain || '',
  //     kwsubdomain: this.keywordholder.subdomain || '',
  //     kwtyp: this.keywordholder.typ || '',
  //     // srt: 'title' + ' ' + 'asc',
  //     srt: ' ',
  //     lq: '',
  //     cfilter: ''
  //   };
  //   this.routerobj.navigate(['/searchdetail', passparam]);
  // }
  // // doSignup(origin?) {
  // //   if (origin === 'provider') {
  // //     // cClass = 'commonpopupmainclass';
  // //   }
  // //   const dialogRef = this.dialog.open(SignUpComponent, {
  // //     width: '50%',
  // //     panelClass: ['signupmainclass', 'popup-class'],
  // //     disableClose: true,
  // //     data: {
  // //       is_provider: this.checkProvider(origin)
  // //     }
  // //   });

  // //   dialogRef.afterClosed().subscribe(() => {
  // //   });
  // // }
  // doLogin(origin?) {
  //   if (origin === 'provider') {
  //     // cClass = 'commonpopupmainclass';
  //   }
  //   const dialogRef = this.dialog.open(LoginComponent, {
  //     width: '50%',
  //     panelClass: ['loginmainclass', 'popup-class'],
  //     disableClose: true,
  //     data: {
  //       type: origin,
  //       is_provider: this.checkProvider(origin)
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     // this.animal = result;
  //   });
  // }
  // doWatchVideo() {
  //   // alert('Clicked watch video');
  // }
  // doLearnMore() {
  //   // alert('Clicked learn more');
  // }
  // providerLinkClicked() {
  //   this.routerobj.navigate(['/provider-home']);
  // }
  // checkProvider(type) {
  //   return (type === 'consumer') ? 'false' : 'true';
  // }
}

