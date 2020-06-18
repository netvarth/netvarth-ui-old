import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
                retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
            } else if (mod === 'time') {
                retval = dtsarr[1] + ' ' + dtsarr[2];
            }
            return retval;
        } else {
            return;
        }
    }
    showRefunds() {
        this.showRefund = !this.showRefund;
    }
}

