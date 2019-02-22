import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddProviderCustomerComponent } from '../add-provider-customer/add-provider-customer.component';
import { SearchProviderCustomerComponent } from '../search-provider-customer/search-provider-customer.component';
import { ProviderServices } from '../../services/provider-services.service';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
  selector: 'app-provider-subheader',
  templateUrl: './provider-subheader.component.html',
  // styleUrls: ['./home.component.scss']
})

export class ProviderSubeaderComponent implements OnInit, OnDestroy {
  create_cap = Messages.SUB_HEADER_CREATE_CAP;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  help_cap = Messages.SUB_HEADER_HELP;
  kiosk_cap = Messages.SUB_HEADER_KIOSK;
  settings_cap = Messages.SUB_HEADER_SETTINGS;

  @Input() activeTab: string;
  @Input() isCheckin;
  @Output() reloadActionSubheader = new EventEmitter<any>();
  userdet: any = [];
  waitlist_set: any = [];
  locations: any = [];
  bprofile: any = [];
  customer_label = '';
  checkin_label = '';
  moreOptions: any = [];
  srchcustdialogRef;
  crtCustdialogRef;
  ChkindialogRef;
  services: any = [];
  buttonDisabled = false;
  active_license;
  server_date;
  constructor(public dialog: MatDialog,
    private provider_datastorage: ProviderDataStorageService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    public routerobj: Router) { }
  normal_profile_active = 1;
  normal_locationinfo_show = 1;
  normal_basicinfo_show = 1;
  kiosk_active = false;
  ngOnInit() {
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    // this.getWaitlistMgr(); // hide becuause it called on every page change
    this.setLicense();
  }
  ngOnDestroy() {
    // console.log('on destroy');
    if (this.srchcustdialogRef) {
      this.srchcustdialogRef.close();
    }
    if (this.crtCustdialogRef) {
      this.crtCustdialogRef.close();
    }
    if (this.ChkindialogRef) {
      this.ChkindialogRef.close();
    }
  }
  setLicense() {
    const cuser = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (cuser && usertype === 'provider') {
      if (cuser.new_lic) {
        console.log(cuser);
        this.active_license = cuser.new_lic;
        console.log(this.active_license);
        if (this.active_license === 'Diamond (3999 Rs/month)' || this.active_license === 'Gold (2499 Rs/month)' || this.active_license === 'Gold - FREE Trial 60 days') {
          this.kiosk_active = true;
        }
      } else {
        this.active_license = cuser.accountLicenseDetails;
        console.log(this.active_license);
        if (this.active_license.accountLicense.name === 'Diamond' || this.active_license.accountLicense.name === 'Gold' || this.active_license.accountLicense.name === 'Gold_60Day_Trial') {
          this.kiosk_active = true;
        } else {
          for (let i = 0; i < this.active_license.addons.length; i++) {
            if (this.active_license.addons[i].name === 'Kiosk') {
              this.kiosk_active = true;
            } else {
              this.kiosk_active = false;
            }
          }
        }
      }
    }
    console.log(this.kiosk_active);
  }

  searchCustomer(source) {
    this.buttonDisabled = true;
    this.srchcustdialogRef = this.dialog.open(SearchProviderCustomerComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'checkin-provider'],
      disableClose: true,
      data: {
        source: source,
      }
    });
    this.srchcustdialogRef.afterClosed().subscribe(result => {
      if (result && result.message && result.message === 'noCustomer' && source === 'createCustomer') {
        this.createCustomer(result.data);
      } else if (result && result.message && result.message === 'haveCustomer' && source === 'providerCheckin') {
        this.beforeCheckIn(result.data);
      } else if (result && result.message && result.message === 'noCustomer' && source === 'providerCheckin') {
        this.createCustomer(result.data, source);
      }
      this.buttonDisabled = false;
    });
  }
  createCustomer(search_data, next_page = null) {
    this.crtCustdialogRef = this.dialog.open(AddProviderCustomerComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'checkin-provider'],
      disableClose: true,
      data: {
        search_data: search_data
      }
    });
    this.crtCustdialogRef.afterClosed().subscribe(result => {
      if (next_page && result.message === 'reloadlist') {
        this.beforeCheckIn(result.data);
      }
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
    // console.log(user_data);
    const post_data = {};
    let selected_location = null;
    const cookie_location_id = this.shared_functions.getItemOnCookie('provider_selected_location'); // same in provider home page
    if (cookie_location_id === '') {
      if (this.locations[0]) {
        selected_location = this.locations[0];
      }
    } else {
      selected_location = this.selectLocationFromCookie(parseInt(cookie_location_id, 10));
    }
    if (selected_location != null) {
      post_data['location'] = {
        'id': selected_location['id'],
        'name': selected_location['place']
      };
    }
    const user = JSON.parse(localStorage.getItem('ynw-user'));
    post_data['provider'] = {
      unique_id: this.bprofile.uniqueId,
      account_id: this.bprofile.id,
      name: this.bprofile.businessName
    };
    const cdate = new Date(this.server_date);
    const mn = cdate.getMonth() + 1;
    const dy = cdate.getDate();
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
    this.ChkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'checkin-consumer'],
      disableClose: true,
      data: {
        type: 'provider',
        is_provider: 'true',
        customer_data: user_data,
        moreparams: {
          source: 'provider_checkin',
          bypassDefaultredirection: 1,
          provider: post_data['provider'],
          location: post_data['location'],
          sel_date: curdate
        },
        datechangereq: true
      }
    });
    this.ChkindialogRef.afterClosed().subscribe(result => {
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
    return new Promise((resolve, reject) => {
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
  dashboardClicked() {
    if (this.isCheckinActive()) {
      this.routerobj.navigate(['/']);
    }
  }
  checkinClicked() {
    if (this.isCheckinActive()) {
      this.provider_services.getServicesList()
        .subscribe(
          data => {
            if (this.shared_functions.filterJson(data, 'status', 'ACTIVE').length === 0) {
              this.isCheckin = 4;
              this.shared_functions.setitemonLocalStorage('isCheckin', this.isCheckin);
              this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
              return false;
            } else {
              this.provider_services.getProviderQueues()
                .subscribe(
                  data1 => {
                    if (this.shared_functions.filterJson(data1, 'queueState', 'ENABLED').length === 0) {
                      this.isCheckin = 5;
                      this.shared_functions.setitemonLocalStorage('isCheckin', this.isCheckin);
                      this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
                      return false;
                    } else {
                      this.searchCustomer('providerCheckin');
                      return true;
                    }
                  },
                  error => {
                  });
            }
          },
          error => {
          }
        );
    }
  }
  isCheckinActive() {
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
    if (this.isCheckin || this.isCheckin === 0 || this.isCheckin > 3) {
      if (this.isCheckin === 0 || this.isCheckin > 3) {
        return true;
      } else {
        this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
        return false;
      }
    } else {
      this.provider_services.getBussinessProfile()
        .subscribe(
          data => {
            this.isCheckin = this.provider_shared_functions.getProfileStatusCode(data);
            this.shared_functions.setitemonLocalStorage('isCheckin', this.isCheckin);
            if (this.isCheckin === 0) {
              return true;
            } else {
              this.shared_functions.openSnackBar(projectConstants.PROFILE_ERROR_STACK[this.isCheckin], { 'panelClass': 'snackbarerror' });
              return false;
            }
          },
          error => {
          }
        );
    }
  }
  getBprofile() {
    return new Promise((resolve, reject) => {
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
  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }
    return (selected_location !== null) ? selected_location : this.locations[0];
  }
  learnmore_clicked(mod) {
    const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    this.shared_functions.sendMessage(pdata);
  }
  getMode(mod) {
    switch (mod) {
      case 'checkin':
        this.moreOptions = { 'show_learnmore': true, 'scrollKey': 'checkin' };
        break;
      case 'customer':
        this.moreOptions = { 'show_learnmore': true, 'scrollKey': 'customer' };
        break;
      case 'kiosk':
        this.moreOptions = { 'show_learnmore': true, 'scrollKey': 'kiosk' };
        break;
      case 'help':
        this.moreOptions = { 'show_learnmore': true, 'scrollKey': 'help' };
        break;
    }
    return this.moreOptions;
  }
}
