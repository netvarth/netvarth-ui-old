import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderCouponsComponent } from '../add-provider-coupons/add-provider-coupons.component';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-coupons',
  templateUrl: './provider-coupons.component.html',
  styleUrls: ['./provider-coupons.component.css']
})
export class ProviderCouponsComponent implements OnInit {

    coupon_list: any = [] ;
    query_executed = false;
    emptyMsg = '';
    breadcrumbs_init = [
      {
        url: '/provider/settings',
        title: 'Settings'
      },
      {
        title: 'Bill Coupons',
        url: '/provider/settings/coupons'
      }
    ];
  breadcrumbs = this.breadcrumbs_init;
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {
          this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('COUPON_LISTEMPTY');
        }

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
          'message' : this.sharedfunctionObj.getProjectMesssages('COUPON_DELETE').replace('[name]', coupon.name),
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
          this.sharedfunctionObj.openSnackBar(Messages.COUPON_DELETED);
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
