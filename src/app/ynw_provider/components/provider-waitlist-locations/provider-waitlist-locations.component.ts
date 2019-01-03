import { Component, OnInit, OnDestroy } from '@angular/core';
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

export class ProviderWaitlistLocationsComponent implements OnInit, OnDestroy {
  base_loc_cap = Messages.WAITLIST_BASE_LOC_CAP;
  set_base_loc_cap = Messages.WAITLIST_SET_BASE_CAP;
  new_loc_cap = Messages.ADD_NEW_LOC_CAP;
  loc_list: any = [];
  bProfile: any = [];
  loc_badges: any = [];
  badge_map_arr: any = [];
  query_executed = false;
  emptyMsg = '';
  api_error = null;
  api_success = null;
  subdomain_fields: any = [];
  loc_icon = projectConstants.LOCATION_BADGE_ICON;
  show_addlocationButton = false;
  multipeLocationAllowed = false;
  businessConfig: any = [];
  dialogRef;
  breadcrumb_moreoptions: any = [];
  breadcrumbs_init = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Waitlist Manager',
      url: '/provider/settings/waitlist-manager'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  constructor(
    private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    private shared_services: SharedServices,
    private provider_shared_functions: ProviderSharedFuctions
  ) {
    this.emptyMsg = this.shared_Functionsobj.getProjectMesssages('ADWORD_LISTEMPTY');
  }

  ngOnInit() {
    this.getBusinessConfiguration();
    // calling the method to get the list of badges related to location
    this.getLocationBadges();
    // this.bProfile = this.provider_datastorage.get('bProfile');
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager', 'subKey': 'locations', 'classname': 'b-service' };
  }
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        // console.log('config', this.businessConfig);
        this.getBussinessProfile();
      },
        error => {

        });
  }
  getBussinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        console.log('sector Id', this.bProfile);
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
            if (this.multipeLocationAllowed == true) {
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                title: 'Locations'
              });
              this.breadcrumbs = breadcrumbs;
            }
            if (this.multipeLocationAllowed == false) {
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                title: 'Location'
              });
              this.breadcrumbs = breadcrumbs;
            }
          }
        }
        // calling the method to get the list of locations
        this.getProviderLocations();
      },
        error => {

        });
  }
  // get the list of locations added for the current provider
  getProviderLocations() {
    this.show_addlocationButton = false;
    this.provider_services.getProviderLocations()
      .subscribe(data => {
        this.loc_list = data;
        if (this.multipeLocationAllowed) {
          this.show_addlocationButton = true;
        } else {
          if (this.loc_list.length === 0) {
            this.show_addlocationButton = true;
          }
        }

        this.query_executed = true;
      });
  }

  getLocationBadges() {
    this.provider_services.getLocationBadges()
      .subscribe(data => {
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
            this.shared_Functionsobj.openSnackBar(msg_data['msg']);
            this.getProviderLocations();
          },
            error => {
              this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        const snackBarRef = this.shared_Functionsobj.openSnackBar(Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place));
        /*this.api_success = Messages.WAITLIST_LOCATION_CHG_BASELOCATION.replace('[locname]', obj.place);
        setTimeout(() => {
          this.resetApiErrors();
        }, projectConstants.TIMEOUT_DELAY_LARGE);*/
        this.getProviderLocations();
      },
        error => {
          const snackBarRef = this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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

  getLocationBadgeIcon(key) {
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
    this.router.navigate(['provider', 'settings', 'waitlist-manager',
      'location-detail', location_detail.id]);
  }

  addLocation() {
    this.dialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: 'add',
        source: 'waitlist'
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getProviderLocations();
        }
      }
    });
  }
}
