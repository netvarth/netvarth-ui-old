import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  report_id_cap = Messages.REPORT_ID_CAP;
  coupon_use_cap = Messages.COUP_USE_CAP;
  j_acc_cap = Messages.J_ACC_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  date_cap = Messages.DATE_COL_CAP;
  bill_cap = Messages.BILL_CAPTION;
  id_cap = Messages.ID_CAP;
  amt_cap = Messages.AMOUNT_CAP;
  check_in_cap = Messages.CHECKIN_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  period_date_cap = Messages.REPORT_PERIOD_DATE_CAP;
  coupon_amt_cap = Messages.REPORT_COUPON_AMT_CAP;
  reimburse_amt_cap = Messages.REPORT_REIMBURSE_AMT_CAP;
  j_acct_cap = Messages.REPORT_JALDEE_ACCT_CAP;
  consumer_cap = Messages.REPORT_CONSUMER_CAP;
  viewreport;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Coupons'
    },
    {
      title: 'Report'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  invoice_id;
  constructor(private provider_servicesobj: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private router: ActivatedRoute, private route: Router) { }
  ngOnInit() {
    console.log('In View Report Component');
    this.router.params
      .subscribe(params => {
        this.invoice_id = params.id;
        this.getjaldeeReport();
      });

  }

  getjaldeeReport() {
    this.provider_servicesobj.getJaldeeCouponReportsbyId(this.invoice_id).subscribe(
      data => {
        this.viewreport = data;
      }
    );
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.invoice_id
    });
    this.breadcrumbs = breadcrumbs;
  }
}
