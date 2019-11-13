import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { OnInit, Component } from '@angular/core';
@Component({
  selector: 'app-provider-jcoupon-details',
  templateUrl: './provider-jcoupon-details.component.html',
  styleUrls: ['./provider-jcoupon-details.component.css']
})
export class ProviderJcouponDetailsComponent implements OnInit {

  coupon_details_cap = Messages.COUPON_DETAILS_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  descr_cap = Messages.DESCRIPTION_CAP;
  start_date_cap = Messages.START_DATE_CAP;
  jCouponCode_Cap = Messages.JCOUPON_CODE;
  percentage_amount = Messages.COUPON_PERCENT_CAP;
  expiry_date = Messages.COUPON_EXPIRY_CAP;
  rules_cap = Messages.COUPON_RULES_CAP;
  disc_value = Messages.COUP_DISC_VALUE;
  max_disc_value = Messages.MAX_DISC_VALUE;
  reimburse_perc = Messages.MAX_REIMBURSE_PERC;
  pro_use_limit = Messages.MAX_PRO_USE_LIMIT;
  consu_use_limit = Messages.MAX_CONSU_USE_LIMIT;
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
  enable_cap = Messages.ENABLE_CAP;
  disbale_cap = Messages.DISABLE_CAP;
  jCoupon;
  jCouponStat;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Billing/POS',
      url: '/provider/settings/pos'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/pos/coupons'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  jc_code;
  isCheckin;
  checkin_label = '';
  constructor(private provider_servicesobj: ProviderServices,
    public shared_functions: SharedFunctions,
    private router: ActivatedRoute, private route: Router) { this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist'); }
  ngOnInit() {
    this.router.params
      .subscribe(params => {
        this.jc_code = params.id;
        this.getCouponview();
        this.getJaldeeCouponStatistic();
      });
    // this.isCheckin = this.sharedfunctionObj.getitemfromSessionStorage('isCheckin');
  }
  getCouponview() {
    this.provider_servicesobj.getJaldeeCoupon(this.jc_code).subscribe(
      data => {
        this.jCoupon = data;
      }
    );
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.jc_code
    });
    this.breadcrumbs = breadcrumbs;
  }

  formatPrice(price) {
    return this.shared_functions.print_PricewithCurrency(price);
  }

  getJaldeeCouponStatistic() {
    this.provider_servicesobj.getJaldeeCouponStat(this.jc_code).subscribe(
      data => {
        this.jCouponStat = data;
      }
    );
  }
  formatDateDisplay(dateStr) {
    return this.shared_functions.formatDateDisplay(dateStr);
  }
  changecouponStatus(jcCoupon) {
    const jc_coupon_status = (jcCoupon.couponState === 'ENABLED') ? 'disable' : 'enable';
    this.provider_servicesobj.applyStatusJaldeeCoupon(jcCoupon.jaldeeCouponCode, jc_coupon_status).subscribe(
      data => {
        this.getCouponview();
      }, error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }

}
