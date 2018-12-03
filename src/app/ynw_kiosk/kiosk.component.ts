import {Component, HostListener} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { SharedFunctions } from '../shared/functions/shared-functions';


@Component({
    selector: 'app-kiosk',
    templateUrl: './kiosk.component.html'
})

export class KioskComponent {
    subscription: Subscription;
    additionalCheckinClass = false;
    additionalCheckstatClass = false;
    constructor( public shared_functions: SharedFunctions) {
        this.subscription = this.shared_functions.getMessage().subscribe(message => {
            // console.log('message', message);
            if (message.ttype === 'checkin') {
                this.additionalCheckinClass = true;
                this.additionalCheckstatClass = false;
            } else if (message.ttype === 'checkstat') {
                this.additionalCheckstatClass = true;
                this.additionalCheckinClass = false;
            } else {
                this.additionalCheckinClass = false;
                this.additionalCheckstatClass = false;
            }
        });
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
        // event.returnValue = false;
    }
}
