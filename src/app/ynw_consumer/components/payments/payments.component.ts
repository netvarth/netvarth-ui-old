import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { Subscription } from 'rxjs';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';



@Component({
    selector: 'app-consumer-payments',
    templateUrl: './payments.component.html'
})
export class ConsumerPaymentsComponent implements OnInit,OnDestroy {
 
    payments: any;
    breadcrumbs;
    date_cap = Messages.DATE_CAP;
    time_cap = Messages.TIME_CAP;
    refundable_cap = Messages.REFUNDABLE_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    status_cap = Messages.PAY_STATUS;
    mode_cap = Messages.MODE_CAP;
    refunds_cap = Messages.REFUNDS_CAP;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    subsription:Subscription
    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        public dateformat: DateFormatPipe,
        private dateTimeProcessor: DateTimeProcessor,
        private shared_services: SharedServices) {

    }
    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'My Jaldee',
                url: 'consumer'
            },
            {
                title: 'Payment Logs'
            }
        ];
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
            // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
        } else {
            return;
        }
    }
    getPayments() {
       this.subsription= this.shared_services.getConsumerPayments().subscribe(
            (payments) => {
                this.payments = payments;
                console.log(projectConstantsLocal.PROVIDER_ACCOUNT_ID);
                this.payments = this.payments.filter(payment => payment.accountId === projectConstantsLocal.PROVIDER_ACCOUNT_ID);
                console.log(this.payments);
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
}
