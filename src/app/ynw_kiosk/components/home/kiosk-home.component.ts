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
  userdet;
  ctype;
  customer_found = false;
  customerDet: any = [];
  customerDispDet = {
                  id: 0,
                  name: ''
                };
  blankPattern;
  phonePattern;
  cMod;
  loadingNow;

  constructor(private kiosk_services: KioskServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.blankPattern = projectConstants.VALIDATOR_BLANK;
    this.phonePattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
    this.customer_found = false;
    this.customerDet = [];
    this.customerDispDet.id = 0;
    this.customerDispDet.name = '';
    this.getUserdetails();
    this.loadingNow = false;
  }

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
    const data = {
      'firstName-eq': this.srch_fname,
      'primaryMobileNo-eq': this.srch_mobile

    };
    this.customer_found = false;
    this.loadingNow = true;
    this.kiosk_services.getCustomer(data)
      .subscribe (rdata => {
          console.log('returned', rdata);
          this.customer_found = true;
          this.customerDet = rdata;
          this.customerDispDet.id = this.customerDet[0].id;
          this.customerDispDet.name = this.customerDet[0].userProfile.firstName + ' ' + this.customerDet[0].userProfile.lastName;
          this.cMod = 'main';
          this.loadingNow = true;
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        this.loadingNow = false;
      });
  }

  showMode(val) {
    this.cMod = val;
    console.log('cmod', this.cMod);
  }
  getpassedinDetails() {
    const passedData = {
      userdet: this.customerDet,
      mod: this.cMod
    };
    return passedData;
  }
}
