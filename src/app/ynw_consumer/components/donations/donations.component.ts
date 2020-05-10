import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    selector: 'app-consumer-donations',
    templateUrl: './donations.component.html'
})
export class ConsumerDonationsComponent implements OnInit {
    payments: any;
    breadcrumbs;
    date_cap = Messages.DATE_CAP;
    time_cap = Messages.TIME_CAP;
    refundable_cap = Messages.REFUNDABLE_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    status_cap = Messages.PAY_STATUS;
    mode_cap = Messages.MODE_CAP;
    refunds_cap = Messages.REFUNDS_CAP;
    donations: any = [];
    constructor(public shared_functions: SharedFunctions,
        private shared_services: SharedServices) {

    }
    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'My Jaldee',
                url: 'consumer'
            },
            {
                title: 'Donations'
            }
        ];
        this.getDonations();
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
            // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
        } else {
            return;
        }
    }
    getDonations() {
        this.shared_services.getConsumerDonations().subscribe(
            (donations) => {
                this.donations = donations;
            }
        );
    }
}
