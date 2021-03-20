import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
@Component({
    selector: 'app-consumer-donations',
    templateUrl: './donations.component.html'
})
export class ConsumerDonationsComponent implements OnInit,OnDestroy {
  
    payments: any;

    date_cap = Messages.DATE_CAP;
    time_cap = Messages.TIME_CAP;
    refundable_cap = Messages.REFUNDABLE_CAP;
    amount_cap = Messages.AMOUNT_CAP;
    status_cap = Messages.PAY_STATUS;
    mode_cap = Messages.MODE_CAP;
    refunds_cap = Messages.REFUNDS_CAP;
    donations: any = [];

    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    private subs=new SubSink();
    constructor(public shared_functions: SharedFunctions,
        private dateTimeProcessor: DateTimeProcessor,
        private shared_services: SharedServices) {

    }
    ngOnInit() {
        this.getDonations();
    }
    ngOnDestroy(): void {
       this.subs.unsubscribe();
    }
    stringtoDate(dt, mod) {
        return this.dateTimeProcessor.stringtoDate(dt, mod);
    }
    getDonations() {
        const filter = {
            'donationStatus-eq' : 'SUCCESS'
        };
       this.subs.sink= this.shared_services.getConsumerDonations(filter).subscribe(
            (donations) => {
                this.donations = donations;
            }
        );
    }
}
