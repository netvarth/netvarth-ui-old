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
  userdet;
  ctype;
  customer_found = false;

  constructor(private kiosk_services: KioskServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.getUserdetails();
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

  }

}
