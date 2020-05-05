import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../shared/constants/project-constants';

@Component({
    selector: 'app-calling-modes',
    templateUrl: './calling-modes.component.html'
})
export class CallingModesComponent implements OnInit {
    callingModes;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CallingModesComponent>) {
    }
    ngOnInit() {
        this.callingModes = this.data.modes;
    }
}
