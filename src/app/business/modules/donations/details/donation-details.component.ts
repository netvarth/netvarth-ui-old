import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { MatDialog } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { CommunicationService } from '../../../../business/services/communication-service';

@Component({
    'selector': 'app-donation-details',
    'templateUrl': './donation-details.component.html',
    styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent {
    uid;
    donationDetails: any = [];
    display_dateFormat = projectConstantsLocal.PIPE_DISPLAY_DATE_FORMAT;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

    loading = false;
    customer_label = '';
    constructor(public activaterouter: ActivatedRoute,
        public sharedFunctions: SharedFunctions,
        public providerservices: ProviderServices,
        public location: Location, private dialog: MatDialog,
        private communicationService: CommunicationService,
        public router: Router,
        private wordProcessor: WordProcessor) {
        this.activaterouter.params.subscribe(param => {
            this.uid = param.id;
            this.getDonationDetails();
        });
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    getDonationDetails() {
        this.loading = true;
        this.providerservices.getDonationByUid(this.uid).subscribe(data => {
            this.donationDetails = data;
            this.loading = false;
        });
    }
    goBack() {
        this.location.back();
    }
    showConsumerNote() {
        const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                checkin: this.donationDetails,
                type: 'donation'
            }
        });
        notedialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    }
    addInboxMessage() {
        let customerlist = [];
        customerlist.push(this.donationDetails);
        this.communicationService.ConsumerInboxMessage(customerlist, 'donation-list')
            .then(
                () => { },
                () => { }
            );
    }
    getQuestionAnswers(event) {
        if (event === 'reload') {
            this.getDonationDetails();
        }
    }
    printCheckin() {
        this.router.navigate(['provider', 'donations', this.uid, 'print'],{queryParams:{bookingType:'donation'}});
    }
}
