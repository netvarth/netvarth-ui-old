import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pos-coupon',
  templateUrl: './pos-coupons.component.html',
  styleUrls: ['./pos-coupons.component.css']
})
export class PosCouponsComponent implements OnInit, OnDestroy {

  desc_cap = Messages.DESCRIPTION_CAP;
  name_cap = Messages.CUPN_NAME_CAP;
  jCouponCode_Cap = Messages.JCOUPON_CODE;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  reports_cap = Messages.REIMBUSE_REPORT_CAP;
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
  upgrade_license = Messages.COUPON_UPGRADE_LICENSE;
  coupon_list: any = [];
  jaldeeCoupons: any = [];
  query_executed = false;
  emptyMsg = '';
  couponStatus: boolean;
  tabid = 0;
  isCheckin;
  breadcrumb_moreoptions: any = [];
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Billing/POS',
      url: '/provider/settings/pos'
  },
    {
      title: 'Coupons'
    }
  ];
  coupon_info: any = [];
  jaldee_reimburse;
  always_enable;
  addcoupdialogRef;
  editcoupdialogRef;
  confirmremdialogRef;
  errorExist = false;
  active_user;
  domain;
  frm_jaldee_coupons_cap = Messages.FRM_LEVEL_JALDEE_COUPONS_MSG;
  frm_mycoupons_cap = Messages.FRM_LEVEL_MY_COUPONS_MSG;
  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('COUPON_LISTEMPTY');
  }
  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.getCoupons(); // Call function to get the list of discount lists
    this.getJaldeeCoupons();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
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
      },
        error => {
          this.errorExist = true;
          // this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/billing->coupon']);
    }
}
  getJaldeeCoupons() {
    this.jaldeeCoupons = this.provider_servicesobj.getJaldeeCoupons()
      .subscribe(data => {
        this.jaldeeCoupons = data;
        for (let index = 0; index < this.jaldeeCoupons.length; index++) {
          this.coupon_info[index] = ' ';
          if (this.jaldeeCoupons[index].couponRules.maxReimbursePercentage) {
            this.coupon_info[index] = this.coupon_info[index] + 'Reimbursable,';
          }
          if (this.jaldeeCoupons[index].couponRules.firstCheckinOnly) {
            this.coupon_info[index] = this.coupon_info[index] + ' First checkin only,';
          }
          if (this.jaldeeCoupons[index].couponRules.onlineCheckinRequired) {
            this.coupon_info[index] = this.coupon_info[index] + ' Online checkin required';
          }
        }
        this.query_executed = true;
      });
  }
  addCoupons() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupon', 'add']);
  }
  editCoupons(coupon) {
    console.log(coupon)
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
  };
   this.router.navigate(['provider', 'settings', 'pos', 'coupon', coupon.id], navigationExtras);
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
        () => {
          this.sharedfunctionObj.openSnackBar(Messages.COUPON_DELETED);
          this.getCoupons();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  reports() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupons', 'report']);
  }
  couponView(jcCode) {
    this.router.navigate(['provider', 'settings', 'pos', 'coupons', jcCode]);
  }
  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

  changecouponStatus(jcCoupon) {
    const jc_coupon_status = (jcCoupon.couponState === 'ENABLED') ? 'disable' : 'enable';
    this.provider_servicesobj.applyStatusJaldeeCoupon(jcCoupon.jaldeeCouponCode, jc_coupon_status).subscribe(
      () => {
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
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'billing', 'subKey': mod };
  //   return moreOptions;
  // }
}

