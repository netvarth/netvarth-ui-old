import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
    selector: 'app-provider-waitlist-locations',
    templateUrl: './provider-waitlist-locations.component.html'
})

export class ProviderWaitlistLocationsComponent implements OnInit {

  loc_list: any = [];
  bProfile: any = [];
  loc_badges: any = [];
  badge_map_arr: any = [];
  query_executed = false;
  emptyMsg = Messages.ADWORD_LISTEMPTY;
  api_error = null;
  api_success = null;
  subdomain_fields: any = [];
  loc_icon = projectConstants.LOCATION_BADGE_ICON;

  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
    title: 'Waitlist Manager',
    url: '/provider/settings/waitlist-manager'
    },
    {
      title: 'Locations'
    }
  ];

  constructor(
    private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    private provider_shared_functions: ProviderSharedFuctions
  ) {}

  ngOnInit() {
    // calling the method to get the list of badges related to location
    this.getLocationBadges();
    // calling the method to get the list of locations
    this.getProviderLocations();
    this.bProfile = this.provider_datastorage.get('bProfile');
  }

  // get the list of locations added for the current provider
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(data => {
        this.loc_list = data;
        this.query_executed = true;
      });
  }

  getLocationBadges() {
    this.provider_services.getLocationBadges()
     .subscribe (data => {
      this.loc_badges = data;
      for (const badge of this.loc_badges) {
          this.badge_map_arr[badge.name] = badge.displayName;
      }
     });
  }

  changeProviderLocationStatus(obj) {


    this.provider_shared_functions.changeProviderLocationStatusMessage(obj)
    .then((msg_data) => {

      this.provider_services.changeProviderLocationStatus(obj.id, msg_data['chgstatus'])
      .subscribe(data => {
        // this.api_success = 'here' + msg_data['msg'];
        /*setTimeout(() => {
          this.resetApiErrors();
        }, projectConstants.TIMEOUT_DELAY_LARGE); */
        this.provider_shared_functions.openSnackBar (msg_data['msg']);
        this.getProviderLocations();
      },
      error => {
        this.provider_shared_functions.openSnackBar (error.error);
        /*this.api_error = error.error;
        setTimeout(() => {
          this.resetApiErrors();
        }, projectConstants.TIMEOUT_DELAY_LARGE);*/
        this.getProviderLocations();
      });

    });

  }

  changeProviderBaseLocationStatus(obj) {
    this.resetApiErrors();
    this.provider_services.changeProviderBaseLocationStatus(obj.id)
    .subscribe(data => {
     const snackBarRef =  this.provider_shared_functions.openSnackBar (Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place));
      /*this.api_success = Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place);
      setTimeout(() => {
        this.resetApiErrors();
      }, projectConstants.TIMEOUT_DELAY_LARGE);*/
      this.getProviderLocations();
    },
    error => {
     const snackBarRef =  this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
     /* this.api_error = error.error;
      setTimeout(() => {
        this.resetApiErrors();
      }, projectConstants.TIMEOUT_DELAY_LARGE);*/
      this.getProviderLocations();
    });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  getLocationBadgeIcon (key) {
    let imgname = '';
    if (!projectConstants.LOCATION_BADGE_ICON[key]) {
      key = 'none';
    }
    imgname = projectConstants.LOCATION_BADGE_ICON[key];
    const imgurl = 'assets/locationbadges/' + projectConstants.LOCATION_BADGE_ICON[key];
    return imgurl;
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  goLocationDetail(location_detail) {
    this.router.navigate(['provider', 'settings' , 'waitlist-manager',
    'location-detail', location_detail.id]);
  }

  addLocation() {
    const dialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
      autoFocus: false,
      data: {
        type : 'add',
        source: 'waitlist'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getProviderLocations();
      }
    }
    });
  }

}


