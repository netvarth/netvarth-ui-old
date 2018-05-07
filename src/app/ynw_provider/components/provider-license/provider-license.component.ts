import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { UpgradeLicenseComponent } from '../upgrade-license/upgrade-license.component';
import { AddproviderAddonComponent  } from '../add-provider-addons/add-provider-addons.component';
import { ProviderLicenseUsageComponent } from '../provider-license-usage/provider-license-usage.component';

@Component({
  selector: 'app-provider-license',
  templateUrl: './provider-license.component.html',
  styleUrls: ['./provider-license.component.css']
})
export class ProviderLicenseComponent implements OnInit {

    currentlicense_details: any = [] ;
    metrics: any = [];

    breadcrumbs = [
      {
        title: 'Settings',
        url: '/provider/settings'
      },
      {
      title: 'License & Invoice'
      }
    ];
    license_message = '';
    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
      this.getLicenseDetails();
      this.getLicenseUsage();
    }


    getLicenseDetails() {
      this.provider_servicesobj.getLicenseDetails()
        .subscribe(data => {
          this.currentlicense_details = data;
          console.log('data', data);
          if (data['accountLicense'] && data['accountLicense']['type'] === 'Trial') {

            const start_date = (data['accountLicense']['dateApplied']) ? moment(data['accountLicense']['dateApplied']) : null;
            const end_date =  (data['accountLicense']['expiryDate']) ? moment(data['accountLicense']['expiryDate']) : null;
            let valid_till = 0;
            if (start_date != null && end_date != null) {
              valid_till = end_date.diff(start_date, 'days');
              valid_till = (valid_till < 0) ?  0 :  valid_till;
            }
            this.license_message = valid_till + ' day trial, till ' + end_date.format('ll');
          }




        });
    }

    showupgradeLicense() {
        const dialogRef = this.dialog.open(UpgradeLicenseComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          data: {
            type : 'upgrade'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getLicenseDetails();
          }
        });
    }

    showadd_addons() {
      const dialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type : 'addons'
        },
        panelClass: ['commonpopupmainclass'],
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          this.getLicenseDetails();
        }
      });
  }

  /*dodelete(addon) {
    if (!addon) {
      return false;
    }
    const add_being_deleted = addon.name;
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      data: {
        'message' : 'Are you sure you wanted to delete the add on \'' + add_being_deleted + '\'?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.deleteaddons(addon.licPkgOrAddonId);
      }
    });
  }
  deleteaddons(itemid) {
    this.provider_servicesobj.deleteAddonPackage(itemid)
     .subscribe(
        data => {
          this.getLicenseDetails();
        },
        error => {

        }
      );
  }*/
  showLicenceHistory() {
    this.router.navigate(['provider', 'settings', 'license', 'auditlog']);
  }

  getLicenseUsage() {
    this.provider_servicesobj.getLicenseUsage()
    .subscribe(
      data => {
        this.metrics = data;
      },
      error => {

      }
    );
  }

  showLicenseUsage() {
    const dialogRef = this.dialog.open(ProviderLicenseUsageComponent, {
      width: '50%',
      data: {
        metrics : this.metrics
      },
      panelClass: ['commonpopupmainclass'],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
