import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
    'selector': 'app-donation-details',
    'templateUrl': './donation-details.component.html',
    styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent {
    uid;
    donationDetails: any = [];
    display_dateFormat = projectConstantsLocal.PIPE_DISPLAY_DATE_FORMAT;
    constructor(public activaterouter: ActivatedRoute,
        public sharedFunctions: SharedFunctions,
        public providerservices: ProviderServices,
        public location: Location) {
        this.activaterouter.params.subscribe(param => {
            this.uid = param.id;
            this.getDonationDetails(this.uid);
        });
    }
    getDonationDetails(uid) {
        this.providerservices.getDonationByUid(uid).subscribe(data => {
            this.donationDetails = data;
        });
    }
    goBack() {
        this.location.back();
    }
}
