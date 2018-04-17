import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderCouponsComponent } from '../add-provider-coupons/add-provider-coupons.component';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
  selector: 'app-provider-coupons',
  templateUrl: './provider-coupons.component.html',
  styleUrls: ['./provider-coupons.component.css']
})
export class ProviderCouponsComponent implements OnInit {

    coupon_list: any = [] ;
    query_executed = false;
    emptyMsg = Messages.COUPON_LISTEMPTY;
    breadcrumbs_init = [
      {
        url: '/provider/settings',
        title: 'Settings'
      },
      {
        title: 'Billing Coupons',
        url: '/provider/settings/coupons'
      }
    ];
  breadcrumbs = this.breadcrumbs_init;
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions,
        private provider_shared_functions: ProviderSharedFuctions) {}

    ngOnInit() {
        this.getCoupons(); // Call function to get the list of discount lists
    }

    getCoupons() {
        this.provider_servicesobj.getProviderCoupons()
        .subscribe(data => {
            this.coupon_list = data;
            this.query_executed = true;
        });
    }
    addCoupons() {
        const dialogRef = this.dialog.open(AddProviderCouponsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          data: {
            type : 'add'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getCoupons();
          }
        });
    }
    editCoupons(obj) {
        const dialogRef = this.dialog.open(AddProviderCouponsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          data: {
            coupon : obj,
            type : 'edit'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getCoupons();
          }
        });
    }
    doRemoveCoupons(coupon) {
      const id = coupon.id;
      if (!id) {
        return false;
      }
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
        data: {
          'message' : Messages.COUPON_DELETE.replace('[name]', coupon.name),
          'heading' : 'Delete Confirmation'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.deleteCoupons(id);
        }
      });
    }

    deleteCoupons(id) {
      this.provider_servicesobj.deleteCoupon(id)
      .subscribe(
        data => {
          this.provider_shared_functions.openSnackBar(Messages.COUPON_DELETED);
          this.getCoupons();
        },
        error => {

        }
      );

    }
    formatPrice(price) {
      return this.sharedfunctionObj.print_PricewithCurrency(price);
    }
}
