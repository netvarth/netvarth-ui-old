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
import { ProviderAuditLogComponent } from '../provider-auditlogs/provider-auditlogs.component';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderLicenceInvoiceDetailComponent } from '../provider-licence-invoice-detail/provider-licence-invoice-detail.component';

@Component({
  selector: 'app-provider-license',
  templateUrl: './provider-license.component.html',
  styleUrls: ['./provider-license.component.css']
})
export class ProviderLicenseComponent implements OnInit {

    currentlicense_details: any = [] ;
    metrics: any = [];
    invoices: any = [];
    license_sub = null;
    all_license_metadata: any = [];
    license_upgarde_sub = {};
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
    unpaid_invoice_show = 0;
    dateFormat =  projectConstants.PIPE_DISPLAY_DATE_FORMAT;

    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
      this.getLicenseDetails();
      this.getLicenseUsage();
      this.getInvoiceList();
      this.getSubscriptionDetail();

    }


    getLicenseDetails(call_type = 'init') {
      this.provider_servicesobj.getLicenseDetails()
        .subscribe(data => {
          this.currentlicense_details = data;

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

        if (call_type === 'update') {
          this.getLicenseUsage();
          this.getInvoiceList();
          this.getSubscriptionDetail();

        }
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
            this.getLicenseDetails('update');
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
          this.getLicenseDetails('update');
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
    // this.router.navigate(['provider', 'settings', 'license', 'auditlog']);
    const dialogRef = this.dialog.open(ProviderAuditLogComponent, {
      width: '50%',
      data: {
      },
      panelClass: ['commonpopupmainclass'],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getLicenseUsage() {
    this.provider_servicesobj.getLicenseUsage()
    .subscribe(
      data => {
        this.metrics = data;
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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

  getInvoiceList() {
    this.provider_servicesobj.getInvoicesWithStatus()
    .subscribe(
      data => {
        this.invoices = data;
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  getSubscriptionDetail() {
    this.provider_servicesobj.getLicenseSubscription()
    .subscribe(
      data => {
        this.license_sub = data;
        this.getLicenseMetaData();
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  getLicenseMetaData() {
    this.provider_servicesobj.getLicenseMetadata()
    .subscribe(
      data => {
        this.all_license_metadata = data;
        const license_meta = {};
        this.license_upgarde_sub = {};
        for (const meta of this.all_license_metadata) {

          if (meta['pkgId'] === this.currentlicense_details['accountLicense'] ['licPkgOrAddonId']) {
              license_meta ['price'] = meta ['price'] || 0;
              license_meta ['discPercFor12Months'] = meta ['discPercFor12Months'] || 0;
              license_meta ['discPercFor6Months'] = meta ['discPercFor6Months'] || 0;
              license_meta ['current_sub'] = (this.license_sub === 'Monthly') ? 'month' : 'year';
              license_meta ['next_sub'] = null;

              if (license_meta ['current_sub'] === 'month' &&
              (license_meta ['price'] !== 0 || (license_meta ['price'] === 0 && license_meta ['discPercFor12Months'] === 100) )) {

                const year_amount =  (license_meta ['price'] * 12);
                license_meta ['next_sub'] = [
                  {
                    'amount' :  year_amount - (year_amount * license_meta ['discPercFor12Months'] / 100),
                    'discount_per': license_meta ['discPercFor12Months'],
                    'type': 'year',
                    'value' : 'Annual'
                  }
                ];

              }
              // console.log(license_meta);
              this.license_upgarde_sub = license_meta;
          }
        }

      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  updateSubscription(value) {
    this.provider_servicesobj.changeLicenseSubscription(value)
    .subscribe(
      data => {
        this.getLicenseDetails('update');
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  goPaymentHistory() {
    this.router.navigate(['provider' , 'settings', 'license' , 'paymenthistory']);
  }

  showUnpaidInvoice() {
    if (this.invoices.length === 1) {
      this.getInvoice(this.invoices[0]);
    } else {
      this.unpaid_invoice_show = (this.unpaid_invoice_show) ? 0 : 1;
    }

  }

  getInvoice (invoice) {
    // console.log(invoice.ynwUuid);
    const dialogRef = this.dialog.open(ProviderLicenceInvoiceDetailComponent, {
      width: '50%',
      data: {
        invoice : invoice,
        source: 'license-home'
      },
      panelClass: ['commonpopupmainclass'],
    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
