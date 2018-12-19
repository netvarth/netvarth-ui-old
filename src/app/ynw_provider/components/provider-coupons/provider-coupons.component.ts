import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderCouponsComponent } from '../add-provider-coupons/add-provider-coupons.component';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { error } from 'util';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-coupons',
  templateUrl: './provider-coupons.component.html',
  styleUrls: ['./provider-coupons.component.css']
})
export class ProviderCouponsComponent implements OnInit, OnDestroy {

  name_cap = Messages.PRO_NAME_CAP;
  jCouponCode_Cap = Messages.JCOUPON_CODE;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  reports_cap = Messages.REPORTS_CAP;
  valid_from_cap = Messages.VALID_FROM_CAP;
  valid_to_cap = Messages.VALID_TO_CAP;
  consumers_apply_cap = Messages.CONSUM_APPLY_CAP;
  provid_apply_cap = Messages.PROVID_APPLY_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  add_coupon_btn = Messages.ADD_COUPON_BTN;
  value_cap = Messages.VALUE_CAP;
  enable_cap = Messages.ENABLE_CAP;
  disable_cap = Messages.DISABLE_CAP;
  jcoupon_states = projectConstants.JCOUPON_STATES;
  coupon_list: any = [];
  jaldeeCoupons: any = [];
  query_executed = false;
  emptyMsg = '';
  couponStatus: boolean;
  tabid = 0;
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Coupons'
    }
  ];
  addcoupdialogRef;
  editcoupdialogRef;
  confirmremdialogRef;
  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('COUPON_LISTEMPTY');
  }
  ngOnInit() {
    this.getCoupons(); // Call function to get the list of discount lists
    this.getJaldeeCoupons();

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
  getJaldeeCoupons() {
    this.jaldeeCoupons = this.provider_servicesobj.getJaldeeCoupons()
      .subscribe(data => {
        console.log(data);
        this.jaldeeCoupons = data;
        this.query_executed = true;
      });
  }
  addCoupons() {
    this.addcoupdialogRef = this.dialog.open(AddProviderCouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
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
        coupon: obj,
        type: 'edit'
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
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('COUPON_DELETE').replace('[name]', coupon.name),
        'heading': 'Delete Confirmation'
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
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  reports() {
    this.router.navigate(['provider', 'settings', 'coupons', 'report']);
  }
  couponView(jcCode) {
    this.router.navigate(['provider', 'settings', 'coupons', jcCode]);
  }
  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

  changecouponStatus(jcCoupon) {
    const jc_coupon_status = (jcCoupon.couponState === 'ENABLED') ? 'disable' : 'enable';
    this.provider_servicesobj.applyStatusJaldeeCoupon(jcCoupon.jaldeeCouponCode, jc_coupon_status).subscribe(
      data => {
        this.getJaldeeCoupons();
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  formatDateDisplay(dateStr) {
    return this.sharedfunctionObj.formatDateDisplay(dateStr);
  }
}
