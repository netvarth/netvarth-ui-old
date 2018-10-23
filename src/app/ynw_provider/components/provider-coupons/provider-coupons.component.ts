import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ProviderCouponsComponent implements OnInit, OnDestroy {

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
  addcoupdialogRef;
  editcoupdialogRef;
  confirmremdialogRef;
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {
          this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('COUPON_LISTEMPTY');
        }

    ngOnInit() {
        this.getCoupons(); // Call function to get the list of discount lists
    }

    ngOnDestroy() {
      if (this.addcoupdialogRef) {
        this.addcoupdialogRef.close();
      }
      if (this.editcoupdialogRef) {
        this.editcoupdialogRef.close();
      }
      if (this.confirmremdialogRef) {
        this.confirmremdialogRef.close();
      }
    }

    getCoupons() {
        this.provider_servicesobj.getProviderCoupons()
        .subscribe(data => {
            this.coupon_list = data;
            this.query_executed = true;
        });
    }
    addCoupons() {
        this.addcoupdialogRef = this.dialog.open(AddProviderCouponsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          disableClose: true,
          data: {
            type : 'add'
          }
        });

        this.addcoupdialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getCoupons();
          }
        });
    }
    editCoupons(obj) {
        this.editcoupdialogRef = this.dialog.open(AddProviderCouponsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          disableClose: true,
          data: {
            coupon : obj,
            type : 'edit'
          }
        });

        this.editcoupdialogRef.afterClosed().subscribe(result => {
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
      this.confirmremdialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message' : this.sharedfunctionObj.getProjectMesssages('COUPON_DELETE').replace('[name]', coupon.name),
          'heading' : 'Delete Confirmation'
        }
      });
      this.confirmremdialogRef.afterClosed().subscribe(result => {
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
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );

    }
    formatPrice(price) {
      return this.sharedfunctionObj.print_PricewithCurrency(price);
    }
}
