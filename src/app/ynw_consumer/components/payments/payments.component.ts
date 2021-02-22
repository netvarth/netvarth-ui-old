import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';



@Component({
    selector: 'app-consumer-payments',
    templateUrl: './payments.component.html'
})
export class ConsumerPaymentsComponent implements OnInit {
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
    constructor(public shared_functions: SharedFunctions,
        private router: Router,
        public dateformat: DateFormatPipe,
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
    stringtoDate(dt, mod) {
        let dtsarr;
        if (dt) {
            dtsarr = dt.split(' ');
            const dtarr = dtsarr[0].split('-');
            console.log(dtarr)
            let retval = '';
            if (mod === 'all') {
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
            } else if (mod === 'date') {
                retval = this.dateformat.transformToMonthlyDate(dtarr[0] + '/' + dtarr[1] + '/' + dtarr[2]); 
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
                const slots = retval.split('-');
                retval = this.shared_functions.convert24HourtoAmPm(slots[0]);
            }
            return retval;
            // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
        } else {
            return;
        }
    }
    getPayments() {
        this.shared_services.getConsumerPayments().subscribe(
            (payments) => {
                this.payments = payments;
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
