import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Subscription } from 'rxjs';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-consumer-payments',
    templateUrl: './payments.component.html'
})
export class ConsumerPaymentsComponent implements OnInit, OnDestroy {

    payments: any;
    date_cap = Messages.DATE_CAP;
    time_cap = Messages.TIME_CAP;
    refundable_cap = Messages.REFUNDABLE_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    status_cap = Messages.PAY_STATUS;
    mode_cap = Messages.MODE_CAP;
    refunds_cap = Messages.REFUNDS_CAP;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    subsription: Subscription
    accountId: any;
    private subs = new SubSink();
    loading = false;
    customId: any;
    theme: any;
    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        public dateformat: DateFormatPipe,
        private dateTimeProcessor: DateTimeProcessor,
        private activated_route: ActivatedRoute,public translate: TranslateService,
        private shared_services: SharedServices) {
        this.subs.sink = this.activated_route.queryParams.subscribe(qparams => {
            if (qparams && qparams.accountId) {
                this.accountId = qparams.accountId;
            }
            if (qparams && qparams.customId) {
                this.customId = qparams.customId;
            }
            if (qparams && qparams.theme) {
                this.theme = qparams.theme;
            }
        });
    }
    ngOnInit() {
        this.translate.use(JSON.parse(localStorage.getItem('translatevariable'))) 

        this.getPayments();
    }
    ngOnDestroy(): void {
        this.subsription.unsubscribe();
    }
    stringtoDate(dt, mod) {
        let dtsarr;
        if (dt) {
            dtsarr = dt.split(' ');
            const dtarr = dtsarr[0].split('-');
            let retval = '';
            if (mod === 'all') {
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
            } else if (mod === 'date') {
                retval = this.dateformat.transformToMonthlyDate(dtarr[0] + '/' + dtarr[1] + '/' + dtarr[2]);
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
                const slots = retval.split('-');
                retval = this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
            }
            return retval;
        } else {
            return;
        }
    }
    getPayments() {
        this.loading = true;
        let params = {};
        if (this.accountId) {
            params['account-eq'] = this.accountId;
        }
        this.subsription = this.shared_services.getConsumerPayments(params).subscribe(
            (paymentsInfo: any) => { 
                if (this.accountId) {
                    this.payments = paymentsInfo.filter(payment => payment.accountId == this.accountId);
                } else {
                    this.payments = paymentsInfo;
                }
                this.loading = false;
            }, error => {
                this.loading = false;
            }
        );
    }
    gotoPayment(id) {
        this.router.navigate(['consumer', 'payments', id]);
    }
    providerDetail(id, event) {
        event.stopPropagation();
        this.router.navigate(['searchdetail', id]);
    }
    backToDashboard() {
        let queryParam = {
            'customId': this.customId,
            'accountId': this.accountId
          }
          if(this.theme) {
            queryParam['theme']=this.theme;
          }
          const navigationExtras: NavigationExtras = {
            queryParams: queryParam
          };
          this.router.navigate(['consumer'], navigationExtras );
    }
}
