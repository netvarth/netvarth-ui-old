import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';


@Component({
  selector: 'app-provider-coupon-view',
  templateUrl: './provider-coupon-view.component.html',
  styleUrls: ['./provider-coupon-view.component.css']
})
export class ProviderCouponViewComponent implements OnInit {
  jaldeecouponview_list : any [] ;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/coupons'
    },{
      title: '',
      url: '/provider/settings/coupons/coupon'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;


  constructor(private provider_servicesobj: ProviderServices) { }

  ngOnInit() {
    this.getCouponview();
  }

  getCouponview() {
    this.jaldeecouponview_list=this.provider_servicesobj.getJaldeeCoupon(jc_code);

      // .subscribe(data => {
      //   console.log(data);
        // this.jaldeecoupon_list = data;
        // this.query_executed = true;
      };

}
