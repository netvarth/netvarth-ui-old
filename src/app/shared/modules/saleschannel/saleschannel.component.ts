import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
    'selector': 'app-saleschannel',
    'templateUrl': './saleschannel.component.html'
})
export class SalesChannelComponent implements OnInit {
    scfound;
    scInfo;
    scCode_Ph;
    @Input() dispObj;
    action;
    @Output() retfromSC = new EventEmitter<any>();
    constructor(private provider_services: ProviderServices,
        private sharedfunctions: SharedFunctions) {
    }
    ngOnInit() {
        if (this.dispObj && this.dispObj.action === 'view') {
            this.action = this.dispObj.action;
            this.findSC_ByScCode(this.dispObj.scCode);
        }
    }
    handlekeyup(ev) {
        this.scfound = false;
        if (ev.keyCode === 13) {
            this.scInfo = {};
            this.findSC_ByScCode(this.scCode_Ph);
        }
    }
    blurSC() {
        this.scfound = false;
        this.findSC_ByScCode(this.scCode_Ph);
    }
    findSC_ByScCode(scCode) {
        if (scCode) {
            this.provider_services.getSearchSCdetails(scCode)
                .subscribe(
                    data => {
                        this.scfound = true;
                        this.scInfo = data;
                        if (this.scInfo.primaryPhoneNo === scCode) {
                            this.retfromSC.emit(this.scInfo.scId);
                        } else {
                            this.retfromSC.emit(this.scCode_Ph);
                        }
                    },
                    (error) => {
                        this.sharedfunctions.openSnackBar(error,  {'panelClass': 'snackbarerror'});
                        this.scfound = false;
                        this.retfromSC.emit(null);
                    }
                );
        }
    }
}
