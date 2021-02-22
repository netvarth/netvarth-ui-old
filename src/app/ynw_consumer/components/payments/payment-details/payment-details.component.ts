import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';

@Component({
    selector: 'app-consumer-payment-details',
    templateUrl: './payment-details.component.html'
})
export class ConsumerPaymentDetailsComponent implements OnInit {
    payments: any = [];
    breadcrumbs;
    showRefund = false;
    api_loading = false;
    constructor(public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        public locationobj: Location,
        private router: Router,
        public dateformat: DateFormatPipe,
        private activated_route: ActivatedRoute) {

        this.activated_route.params.subscribe(
            (qParams) => {
                this.api_loading = true;
                if (qParams.id) {
                    this.getPayments(qParams.id);
                }
            });
    }
    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'My Jaldee',
                url: 'consumer'
            },
            {
                title: 'Payment Logs',
                url: 'consumer/payments'
            },
            {
                title: 'Payment details'
            }
        ];
    }
    gotoPrev() {
        this.locationobj.back();
    }
    getPayments(id) {
        this.shared_services.getConsumerPaymentById(id).subscribe(
            (payments) => {
                this.payments = payments;
                this.api_loading = false;
            }
        );
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
                // retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
                const slots = retval.split('-');
                retval = this.shared_functions.convert24HourtoAmPm(slots[0]);
            }
            return retval;
        } else {
            return;
        }
    }
    showRefunds() {
        this.showRefund = !this.showRefund;
    }
    providerDetail(id, event) {
        event.stopPropagation();
        this.router.navigate(['searchdetail', id]);
      }
}

