import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { PublishDialogComponent } from './publish-dialog/publish-dialog.component';
import { SubSink } from 'subsink';
import { ServiceListDialogComponent } from '../../../../../shared/service-list-dialog/service-list-dialog.component';
import { ItemListDialogComponent } from '../../../../../shared/item-list-dialog/item-list-dialog.component';
import { DepartmentListDialogComponent } from '../../../../../shared/department-list-dialog/department-list-dialog.component';
import { ConsumerGroupDialogComponent } from '../../../../../shared/consumer-group-dialog/consumer-group-dialog.component';
import { ConsumerLabelDialogComponent } from '../../../../../shared/consumer-label-dialog/consumer-label-dialog.component';
import { UsersListDialogComponent } from '../../../../../shared/users-list-dialog/users-list-dialog.component';



@Component({
  selector: 'app-publish-coupon',
  templateUrl: './publish-coupon.component.html',
  styleUrls: ['./publish-coupon.component.css']
})
export class PublishCouponComponent implements OnInit, OnDestroy {

  couponId: any;
  coupon: any;
  rules_cap = Messages.COUPON_RULES_CAP;
  disc_value = Messages.COUP_DISC_VALUE;
  pro_use_limit = Messages.MAX_PRO_USE_LIMIT;
  checkin_label = '';
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  api_loading = true;
  title = '';
  private subs = new SubSink();
  userdialogRef: any;
  consumerLabeldialogRef: any;
  consumerGroupdialogRef: any;
  departmentdialogRef: any;
  itemdialogRef: any;
  servicedialogRef: any;
  weekdays = projectConstantsLocal.myweekdaysSchedule;
  selday_arr: any=[];
  selallweekdays: boolean;
  bookingMode = projectConstantsLocal.BOOKING_MODE;
  constructor(
    private wordProcessor: WordProcessor,
    private router: Router,
    private dialog: MatDialog,
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute) {


    this.subs.sink = this.activated_route.params.subscribe(params => {
      this.couponId = params.id;
      this.getcouponDetails(this.couponId).then((data) => {
        this.coupon = data;
        if (this.coupon.couponRules.published) {
          this.title = "Coupon " + this.coupon.couponCode + " Published";
        } else {
          this.title = "Publish Coupon " + this.coupon.couponCode
        }
        if (this.coupon.couponRules.validTimeRange && this.coupon.couponRules.validTimeRange.length > 0) {

          for (let j = 0; j < this.coupon.couponRules.validTimeRange[0].repeatIntervals.length; j++) {
            // pushing the day details to the respective array to show it in the page
            this.selday_arr.push(Number(this.coupon.couponRules.validTimeRange[0].repeatIntervals[j]));
          }
          if (this.selday_arr.length === 7) {
            this.selallweekdays = true;
          } else {
            this.selallweekdays = false;
          }
        }
        this.api_loading = false;
      });
    });
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');


  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  check_existsinweek_array(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }

  
  getcouponDetails(couponId) {
    const _this = this;
    return new Promise((resolve) => {
      _this.provider_services.getProviderCoupons(couponId).subscribe(
        (result: any) => {
          this.coupon = result;
          resolve(result);
        });
    });
  }


  redirecToCoupon() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        coupon_list: 'own_coupon'

      }
    };
    this.router.navigate(['provider', 'settings', 'pos', 'coupon'], navigationExtras);
  }

  publish() {
    const dialogrefd = this.dialog.open(PublishDialogComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'coupon': this.coupon,

      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      this.getcouponDetails(this.coupon.id);
    });


  }
  openServiceDialog() {
    this.servicedialogRef = this.dialog.open(ServiceListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'services': this.coupon.couponRules.policies.services,
        'mode': 'view'
      }

    });
    this.servicedialogRef.afterClosed().subscribe(result => {

    });
  }
  openItemDialog() {
    this.itemdialogRef = this.dialog.open(ItemListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'items': this.coupon.couponRules.policies.items,
        'mode': 'view'
      }

    });
    this.itemdialogRef.afterClosed().subscribe(result => {

    });

  }
  openDepartmentDialog() {
    this.departmentdialogRef = this.dialog.open(DepartmentListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'departments': this.coupon.couponRules.policies.departments,
        'mode': 'view'
      }

    });
    this.departmentdialogRef.afterClosed().subscribe(result => {

    });
  }
  openCustomerGroupDialog() {
    this.consumerGroupdialogRef = this.dialog.open(ConsumerGroupDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'groups': this.coupon.couponRules.policies.consumerGroups,
        'mode': 'view'
      }

    });
    this.consumerGroupdialogRef.afterClosed().subscribe(result => {

    });

  }
  openCustomerLabelDialog() {
    this.consumerLabeldialogRef = this.dialog.open(ConsumerLabelDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'labels': this.coupon.couponRules.policies.consumerLabels,
        'mode': 'view'
      }

    });
    this.consumerLabeldialogRef.afterClosed().subscribe(result => {

    });

  }
  openUserDialog() {
    this.userdialogRef = this.dialog.open(UsersListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'users': this.coupon.couponRules.policies.users,
        'mode': 'view'
      }

    });
    this.userdialogRef.afterClosed().subscribe(result => {

    });
  }
  getbookingmodes(mes) {
   const booking_mode = this.bookingMode.filter(bookmode => bookmode.value === mes);
   return booking_mode[0].displayName;
  }

}
