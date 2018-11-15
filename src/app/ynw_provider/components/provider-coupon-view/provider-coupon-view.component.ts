import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
@Component({
  selector: 'app-provider-coupon-view',
  templateUrl: './provider-coupon-view.component.html',
  styleUrls: ['./provider-coupon-view.component.css']
})
export class ProviderCouponViewComponent implements OnInit {

  coupon_details_cap = Messages.COUPON_DETAILS_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  descr_cap = Messages.DESCRIPTION_CAP;
  start_date_cap = Messages.START_DATE_CAP;
  coupon_code = Messages.CODE_CAP;
  percentage_amount = Messages.COUPON_PERCENT_CAP;
  expiry_date = Messages.COUPON_EXPIRY_CAP;
  rules_cap = Messages.COUPON_RULES_CAP;
  disc_value = Messages.COUP_DISC_VALUE;
  max_disc_value = Messages.MAX_DISC_VALUE;
  reimburse_perc = Messages.MAX_REIMBURSE_PERC;
  pro_use_limit = Messages.MAX_PRO_USE_LIMIT;
  consu_use_limit = Messages.MAX_CONSU_USE_LIMIT;
  usage_limit = Messages.LIMIT_PER_PRO;
  consu_chek_usage = Messages.CONSUM_FIRST_HECK;
  prov_check_usage = Messages.PRO_FIRST_CHECK;
  self_payment = Messages.SELF_PAYMENT;
  online_check = Messages.ONLINE_CHECK;
  combine_j_coupon = Messages.COMBIN_COUPON_LIST;
  default_enable = Messages.DEFAULT_ENABLE;
  always_enable = Messages.ALWAYS_ENABLE;
  term_condition = Messages.TERM_CONDITION;
  provider_desc = Messages.PRO_DESCR;
  chart_cap = Messages.CHART_CAP;
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