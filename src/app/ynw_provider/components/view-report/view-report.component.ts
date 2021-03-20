import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { Location } from '@angular/common';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  grant_total_cap = Messages.GRANT_TOTAL;
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
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  coupon_amt_cap = Messages.REPORT_COUPON_AMT_CAP;
  reimburse_amt_cap = Messages.REPORT_REIMBURSE_AMT_CAP;
  j_acct_cap = Messages.REPORT_JALDEE_ACCT_CAP;
  consumer_cap = Messages.REPORT_CONSUMER_CAP;
  report_status = projectConstants.REPORT_STATUSES;
  s3url;
  retval;
  viewreport;
  invoiceFromS3;
  invoice_id;
  isCheckin;
  constructor(private provider_servicesobj: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private router: ActivatedRoute,
    private shared_services: SharedServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    public location: Location) { }
  ngOnInit() {
    this.router.params
      .subscribe(params => {
        this.invoice_id = params.id;
        this.getjaldeeReport();
      });
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }
  getJSONfromString(jsonString) {
    return JSON.parse(jsonString);
  }
  getjaldeeReport() {
    this.provider_servicesobj.getJaldeeCouponReportsbyId(this.invoice_id).subscribe(
      data => {
        this.viewreport = data;
        this.sharedfunctionObj.getS3Url('provider')
          .then(
            res => {
              this.s3url = res;
              const UTCstring = this.sharedfunctionObj.getCurrentUTCdatetimestring();
              const section = 'invoice/' + this.invoice_id + '/jaldeeinvoice';
              this.shared_services.getbusinessprofiledetails_json(this.viewreport.uId, this.s3url, section, UTCstring)
                .subscribe(s3Result => {
                  this.invoiceFromS3 = s3Result;
                },
                  error => {
                    this.wordProcessor.apiErrorAutoHide(this, error);
                  });
            },
            error => {
              this.wordProcessor.apiErrorAutoHide(this, error);
            }
          );
      }
    );
  }

  formatDateDisplay(dateStr) {
    return this.dateTimeProcessor.formatDateDisplay(dateStr);
  }
  goBack() {
    this.location.back();
  }
}
