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
    // breadcrumbs = [
    //     {
    //         title: 'My Jaldee',
    //         url: 'consumer'
    //     },
    //     {
    //         title: 'Donations'
    //     }
    // ];
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
        this.getDonations();
    }
    stringtoDate(dt, mod) {
        return this.shared_functions.stringtoDate(dt, mod);
    }
    getDonations() {
        const filter = {
            'donationStatus-eq' : 'SUCCESS'
        };
        this.shared_services.getConsumerDonations(filter).subscribe(
            (donations) => {
                this.donations = donations;
            }
        );
    }
}
