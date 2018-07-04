import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { KioskServices } from '../../services/kiosk-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-kiosk-home',
  templateUrl: './kiosk-home.component.html'
})
export class KioskHomeComponent implements OnInit {

  provider_loggedin = false;
  srch_mobile = '';
  srch_fname = '';
  reg_fname = '';
  reg_lname = '';
  userdet;
  ctype;
  customer_found = false;
  customerDet: any = [];
  customerDispDet = {
                  id: '',
                  name: ''
                };
  blankPattern;
  namePattern;
  phonePattern;
  cMod;
  loadingNow;
  terminologies: any = [];
  showsearch_now = false;
  show_customernotfoundmsg = false;
  show_customerRegister = false;

  constructor(private kiosk_services: KioskServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.blankPattern = projectConstants.VALIDATOR_BLANK;
    this.phonePattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
    this.namePattern = projectConstants.VALIDATOR_CHARONLY;
    this.customer_found = false;
    this.customerDet = [];
    this.customerDispDet.id = '';
    this.customerDispDet.name = '';
    this.getUserdetails();
    this.loadingNow = false;
    this.cMod = 'main';
  }
  /*getTerminologies() {
    this.kiosk_services.getTerminoligies(this.customerDet,this.customerDet)
    . subscribe (data => {

    },
    error => {

    });
  }*/
  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.userdet)  {
       console.log(this.userdet);
      if (this.shared_functions.checkLogin()) {
        this.ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (this.userdet.isProvider === true) {
          this.provider_loggedin = true;
        } else {
          this.provider_loggedin = false;
        }
      }
    }
  }

  searchCustomer() {
    if (!this.phonePattern.test(this.srch_mobile)) {
      this.shared_functions.openSnackBar('Phone number should have 10 digits', {'panelClass': 'snackbarerror'});
      return false;
    }
    if (this.blankPattern.test(this.srch_fname) || this.srch_fname.length < 3) {
      this.shared_functions.openSnackBar('Please enter atleast the first 3 letters of your first name', {'panelClass': 'snackbarerror'});
      return false;
    }
    if ( !this.namePattern.test(this.srch_fname)) {
      this.shared_functions.openSnackBar('Name should contain only characters', {'panelClass': 'snackbarerror'});
      return false;
    }

    const data = {
      'firstName-eq': this.srch_fname,
      'primaryMobileNo-eq': this.srch_mobile

    };
    this.customer_found = false;
    this.show_customernotfoundmsg = false;
    this.loadingNow = true;
    this.kiosk_services.getCustomer(data)
      .subscribe (rdata => {
          // console.log('returned', rdata);
          this.customerDet = rdata;
          if (this.customerDet.length > 0) { // case if searched customer exists
            this.customer_found = true;
            this.customerDispDet.id = this.customerDet[0].id;
            this.customerDispDet.name = this.customerDet[0].userProfile.firstName + ' ' + this.customerDet[0].userProfile.lastName;
            if (this.cMod === '') {
              this.cMod = 'main';
            }
            this.srch_fname = '';
            this.srch_mobile = '';
            this.loadingNow = false;
          } else { // case if searched customer does not exists, so show the "Not found" page
              this.show_customernotfoundmsg = true;
              this.showsearch_now = false;
              this.loadingNow = false;
          }
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
        this.loadingNow = false;
      });
  }

  showMode(val) {
    this.cMod = val;
    this.srch_fname = '';
    this.srch_mobile = '';
    this.reg_fname = '';
    this.reg_lname = '';
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = false;
    this.showsearch_now = false;
    console.log('cmod', this.cMod);
    if (this.cMod !== 'main') {
      if (!this.customer_found) {
        this.showsearch_now = true;
      }
    } else {
      this.showsearch_now = false;
    }
  }
  getpassedinDetails() {
    const passedData = {
      userdet: this.customerDet,
      mod: this.cMod
    };
    return passedData;
  }
  logOff() {
    this.customer_found = false;
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = false;
    this.loadingNow = false;
    this.customerDet = [];
    this.showMode('main');
  }
  showRegister() {
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = true;
    this.reg_fname = this.srch_fname;
    this.reg_lname = '';
  }
  registerCustomer() {
    if (this.blankPattern.test(this.reg_fname) || !this.namePattern.test(this.reg_fname)) {
      this.shared_functions.openSnackBar('Please enter a valid first name', {'panelClass': 'snackbarerror'});
      return false;
    }
    if (this.blankPattern.test(this.reg_lname)  || !this.namePattern.test(this.reg_lname)) {
      this.shared_functions.openSnackBar('Please enter a valid last name', {'panelClass': 'snackbarerror'});
      return false;
    }
    const postData = {
      'userProfile': {
        'firstName': this.reg_fname,
        'lastName': this.reg_lname,
        'primaryMobileNo': this.srch_mobile
      }
    };
    this.loadingNow = true;
    this.kiosk_services.createProviderCustomer(postData)
      .subscribe ((data: any) => {
        // console.log('returned', data);
        const retdata = data;
        // console.log('retdata', retdata);
        this.customer_found = true;
        this.show_customerRegister = false;
        this.customerDispDet.id = retdata;
        this.customerDispDet.name = this.reg_fname + ' ' + this.reg_lname;
        this.reg_fname = '';
        this.reg_lname = '';
        this.srch_fname = '';
        this.srch_mobile = '';
        this.loadingNow = false;
      },
    error => {
      this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      this.loadingNow = false;
    });
  }
  showSearchNow() {
    this.show_customerRegister = false;
    this.show_customernotfoundmsg = false;
    this.showsearch_now = true;
  }
}
