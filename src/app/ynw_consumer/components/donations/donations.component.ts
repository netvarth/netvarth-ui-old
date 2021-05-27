import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { MatDialog } from '@angular/material/dialog';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../../business/modules/check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

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
    customId: any;
    accountId: any;
    constructor(public shared_functions: SharedFunctions,
        private dateTimeProcessor: DateTimeProcessor,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private shared_services: SharedServices) {
            this.subs.sink = this.activatedRoute.queryParams.subscribe(
                params => {
                    if (params.account_id) {
                        this.accountId = params.account_id
                    }
                    if (params.customId) {
                        this.customId = params.customId;
                    }
                }
            );
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
        let filter = {
            'donationStatus-eq' : 'SUCCESS'
        };
        if (this.accountId){
            filter['account-eq'] = this.accountId;
        }
       this.subs.sink= this.shared_services.getConsumerDonations(filter).subscribe(
            (donations) => {
                this.donations = donations;
            }
        );
    }
    showConsumerNote(donation) {
        const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            checkin: donation,
            type: 'donation'
          }
        });
        notedialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
          }
        });
      }
      gotoDashboard() {
        let queryParam = {};
        if (this.customId) {
            queryParam['customId'] = this.customId;
            queryParam['accountId'] = this.accountId;
        }
        let navigationExtras: NavigationExtras = {
            queryParams:queryParam
        }
        this.router.navigate(['consumer'],navigationExtras);
      }
}
