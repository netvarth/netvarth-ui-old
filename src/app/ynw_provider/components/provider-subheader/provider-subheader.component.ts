import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddProviderCustomerComponent } from '../add-provider-customer/add-provider-customer.component';
import { SearchProviderCustomerComponent } from '../search-provider-customer/search-provider-customer.component';
import { ProviderServices } from '../../services/provider-services.service';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';

@Component({
    selector: 'app-provider-subheader',
    templateUrl: './provider-subheader.component.html',
    // styleUrls: ['./home.component.scss']
})



export class ProviderSubeaderComponent implements OnInit {

  @Input() activeTab: string;
  @Output() reloadActionSubheader = new EventEmitter<any>();
  userdet: any = [];
  waitlist_set: any = [];
  locations: any = [];
  bprofile: any = [];

  constructor(public dialog: MatDialog,
  public provider_services: ProviderServices,
  public shared_functions: SharedFunctions,
  public routerobj: Router) {}

  ngOnInit() {
    // this.getWaitlistMgr(); // hide becuause it called on every page change
  }

  searchCustomer(source) {

    const dialogRef = this.dialog.open(SearchProviderCustomerComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass'],
      data: {
        source: source
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.message && result.message === 'noCustomer' && source === 'createCustomer') {
        this.createCustomer(result.data);
      } else if (result.message && result.message === 'haveCustomer' && source === 'providerCheckin') {
        this.beforeCheckIn(result.data);
      }
    });
  }

  createCustomer(search_data) {

    const dialogRef = this.dialog.open(AddProviderCustomerComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass'],
      data: {
        search_data: search_data
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  beforeCheckIn(user_data) {

    this.getProviderLocations()
    .then(
      result => {
        this.getBprofile()
        .then(
          data => {
            this.createCheckin(user_data);
          },
          error => {

          }
        );
      },
      error => {

      }
    );

  }
  createCheckin(user_data) {
    console.log(user_data);
    const post_data = {};
    let selected_location = null;

    const cookie_location_id = this.shared_functions.getItemOnCookie('provider_selected_location'); // same in provider home page
    if ( cookie_location_id === '') {
      if (this.locations[0]) {
        selected_location = this.locations[0];
      }
    } else {
       selected_location = this.selectLocationFromCookie(parseInt(cookie_location_id, 10));

    }

    if (selected_location != null) {
      post_data['location'] = {
        'id' :  selected_location['id'],
        'name': selected_location['place']
      };

    }

    const user = JSON.parse(localStorage.getItem('ynw-user'));
    post_data['provider'] = {
      unique_id: this.bprofile.uniqueId,
      account_id: this.bprofile.id,
      name: this.bprofile.businessName
    };

    const  cdate = new Date();
    const  mn = cdate.getMonth() + 1;
    const  dy = cdate.getDate();
    let mon = '';
    let day = '';
    if (mn < 10) {
      mon = '0' + mn;
    } else {
      mon = '' + mn;
    }
    if (dy < 10) {
      day = '0' + dy;
    } else {
      day = '' + dy;
    }
    const curdate = cdate.getFullYear() + '-' + mon + '-' + day;


    const dialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
     data: {
       type : 'provider',
       is_provider : 'true',
       customer_data: user_data,
       moreparams: { source: 'provider_checkin',
       bypassDefaultredirection: 1,
       provider: post_data['provider'],
       location: post_data['location'],
       sel_date: curdate
      },
      datechangereq: true
     }
   });

   dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
          this.reloadActionSubheader.emit(result);
      }
   });

  }

  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {
        this.waitlist_set = data;
      }
    );
  }

  getProviderLocations() {
    return new Promise( (resolve, reject) => {

      this.provider_services.getProviderLocations()
      .subscribe(
        data => {
          this.locations = data;
          resolve();
        },
        error => {
          reject(error);
        }
      );

    });

  }

  getBprofile() {
    return new Promise( (resolve, reject) => {

      this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bprofile = data;
          resolve();
        },
        error => {
          reject(error);
        }
      );

    });

  }


  selectLocationFromCookie (cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }

    return (selected_location !== null) ? selected_location : this.locations[0];

  }

}
