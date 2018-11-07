import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
@Component({
  selector: 'app-provider-coupon-view',
  templateUrl: './provider-coupon-view.component.html',
  styleUrls: ['./provider-coupon-view.component.css']
})
export class ProviderCouponViewComponent implements OnInit {
  jaldeecoupon_list: any = [];
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/coupons'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  public jc_code;
  constructor(private provider_servicesobj: ProviderServices) { }
  ngOnInit() {
    this.getCouponview();
  }
  getCouponview() {
    this.jaldeecoupon_list = this.provider_servicesobj.getJaldeeCoupon(this.jc_code);
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.jaldeecoupon_list.couponName
    });
    this.breadcrumbs = breadcrumbs;
  }
}