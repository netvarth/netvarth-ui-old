import { Component } from '@angular/core';
import { FormMessageDisplayService } from '../form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Router } from '@angular/router';
import { CommonDataStorageService } from '../../services/common-datastorage.service';
import { CheckInService } from './check-in.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-checkin',
    templateUrl: './checkin.component.html'
})
export class CheckInComponent {
    checkinSubscribtion: Subscription;
    constructor(public fed_service: FormMessageDisplayService,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public router: Router,
        public provider_datastorage: CommonDataStorageService,
        public checkinService: CheckInService) {
            this.checkinSubscribtion = this.checkinService.initCheckin.subscribe(
                () => {

                }
            );
    }
}
