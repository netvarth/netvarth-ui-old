import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-pos-coupon',
  templateUrl: './pos-coupons.component.html',
  styleUrls: ['./pos-coupons.component.css']
})
export class PosCouponsComponent implements OnInit, OnDestroy {
  tooltipcls = '';
  desc_cap = Messages.DESCRIPTION_CAP;
  name_cap = Messages.CUPN_NAME_CAP;
  jCouponCode_Cap = Messages.JCOUPON_CODE;
  couponCode_cap=Messages.COUPON_CODE_CAP;
  edit_btn = Messages.EDIT_BTN;
  publish_btn=Messages.PUBLISH_BTN;
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
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  upgrade_license = Messages.COUPON_UPGRADE_LICENSE;
  coupon_list: any = [];
  jaldeeCoupons: any = [];
  query_executed = false;
  emptyMsg = '';
  couponStatus: boolean;
  tabid = 0;
  isCheckin;
  coupon_info: any = [];
  jaldee_reimburse;
  always_enable;
  addcoupdialogRef;
  editcoupdialogRef;
  confirmremdialogRef;
  errorExist = false;
  active_user;
  domain;
  couponError = '';
  frm_jaldee_coupons_cap = Messages.FRM_LEVEL_JALDEE_COUPONS_MSG;
  frm_mycoupons_cap = Messages.FRM_LEVEL_MY_COUPONS_MSG;
  published_cap=Messages.PUBLISHED_CAP;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions,
    private snackbarService: SnackbarService,
    private activatedRoute:ActivatedRoute,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.emptyMsg = this.wordProcessor.getProjectMesssages('COUPON_LISTEMPTY');
    this.activatedRoute.queryParams
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(params=>{
      if(params.coupon_list==='own_coupon'){
        this.tabid=1;
      }else{
        this.tabid=0;
      }
    })
  }
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getCoupons(); // Call function to get the list of discount lists
    this.getJaldeeCoupons();
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
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
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
  getCoupons() {
    this.provider_servicesobj.getProviderCoupons()
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.coupon_list = data;
        this.query_executed = true;
      },
        error => {
          this.errorExist = true;
          this.couponError = error.error;
          // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/billing->coupon']);
    }
  }
  getJaldeeCoupons() {
    this.jaldeeCoupons = this.provider_servicesobj.getJaldeeCoupons()
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.jaldeeCoupons = data;
        for (let index = 0; index < this.jaldeeCoupons.length; index++) {
          this.coupon_info[index] = ' ';
          if (this.jaldeeCoupons[index].couponRules.maxReimbursePercentage) {
            this.coupon_info[index] = this.coupon_info[index] + 'Reimbursable';
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
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
    };
    this.router.navigate(['provider', 'settings', 'pos', 'coupon', coupon.id], navigationExtras);
  }

  publish(coupon){

    this.router.navigate(['provider', 'settings', 'pos', 'coupon', coupon.id,'publish']);
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
        'message': this.wordProcessor.getProjectMesssages('COUPON_DELETE').replace('[name]', coupon.name),
        'heading': 'Delete Confirmation'
      }
    });
    this.confirmremdialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      if (result) {
        this.deleteCoupons(id);
      }
    });
  }
  deleteCoupons(id) {
    this.provider_servicesobj.deleteCoupon(id)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        () => {
          this.snackbarService.openSnackBar(Messages.COUPON_DELETED);
          this.getCoupons();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    this.provider_servicesobj.applyStatusJaldeeCoupon(jcCoupon.jaldeeCouponCode, jc_coupon_status)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(
      () => {
        this.getJaldeeCoupons();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
 
  redirecToJaldeeBilling() {
    this.routerobj.navigate(['provider', 'settings' , 'pos']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->coupon']);
  }
}
