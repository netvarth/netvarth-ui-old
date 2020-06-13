import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { Subscription } from 'rxjs';

@Component({
    'selector': 'app-saleschannel',
    'templateUrl': './saleschannel.component.html'
})
export class SalesChannelComponent implements OnInit, OnDestroy {
    scfound;
    scInfo;
    scCode_Ph;
    @Input() dispObj;
    action;
    subscription: Subscription;
    @Output() retfromSC = new EventEmitter<any>();
    constructor(private provider_services: ProviderServices,
        private sharedfunctions: SharedFunctions) {
        this.subscription = this.sharedfunctions.getMessage().subscribe(
            (message) => {
                switch (message.ttype) {
                    case 'saleschannel':
                        this.dispObj = message.data;
                        if (this.dispObj && this.dispObj.action === 'view') {
                            this.action = this.dispObj.action;
                            this.findSC_ByScCode(this.dispObj.scCode);
                        }
                        break;
                }
            }
        );
    }
    ngOnInit() {
        if (this.dispObj && this.dispObj.action === 'view') {
            this.action = this.dispObj.action;
            this.findSC_ByScCode(this.dispObj.scCode);
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    handlekeyup(ev) {
        this.scfound = false;
        this.scInfo = {};
        if (ev.keyCode === 13) {
            this.scInfo = {};
            this.findSC_ByScCode(this.scCode_Ph);
        }
    }
    blurSC() {
        // this.scfound = false;
        // this.findSC_ByScCode(this.scCode_Ph);
    }
    findSC_ByScCode(scCode) {
        if (scCode) {
            this.provider_services.getSearchSCdetails(scCode)
                .subscribe(
                    data => {
                        this.scfound = true;
                        this.scInfo = data;
                        if (this.dispObj && this.dispObj.action === 'view') {
                        } else {
                            if (this.scInfo.primaryPhoneNo === scCode) {
                                this.retfromSC.emit(this.scInfo.scId);
                            } else {
                                this.retfromSC.emit(this.scCode_Ph);
                            }
                        }
                    },
                    (error) => {
                        this.sharedfunctions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.scfound = false;
                        this.retfromSC.emit(null);
                    }
                );
        }
    }
}
