import { Component, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SharedFunctions } from '../shared/functions/shared-functions';

@Component({
    selector: 'app-kiosk',
    templateUrl: './kiosk.component.html'
})

export class KioskComponent implements OnDestroy {
    subscription: Subscription;
    additionalCheckinClass = false;
    additionalCheckstatClass = false;
    constructor(public shared_functions: SharedFunctions) {
        this.subscription = this.shared_functions.getMessage().subscribe(message => {
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
    beforeunloadHandler() {
        // event.returnValue = false;
    }

    ngOnDestroy() {
        // if (this.subscription) {
        //     this.subscription.unsubscribe();
        // }
    }
}
