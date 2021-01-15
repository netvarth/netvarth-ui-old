import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-update-notification',
    templateUrl: './update-notification.component.html',
    styleUrls: ['./update-notification.component.css']
})
export class UpdateNotificationComponent implements OnInit {
    virtualCallModesList;
    callingMode = '';
    mode;
    callingmodes = projectConstantsLocal.videoModes;
    btn_name = 'Add';
    constructor(public dialogRef: MatDialogRef<UpdateNotificationComponent>,
        private provider_services: ProviderServices,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public shared_functions: SharedFunctions,
        private snackbarService: SnackbarService) {
        this.virtualCallModesList = this.data.callingmodeList;
        this.mode = this.data.mode;
        const filtererList = this.virtualCallModesList.filter(mode => mode.callingMode === this.mode);
        if (filtererList && filtererList[0]) {
            this.callingMode = filtererList[0].value;
            this.btn_name = 'Update';
        }
    }

    ngOnInit() {
    }
    updateVideoSettings() {
        const virtualCallingModes = [];
        let found = false;
        let result = true;
        if (this.mode !== 'WhatsApp' && this.mode !== 'Phone') {
            const pattern = new RegExp(projectConstantsLocal.VALIDATOR_URL);
            result = pattern.test(this.callingMode);
        }
        if (!result) {
            this.snackbarService.openSnackBar(Messages.BPROFILE_SOCIAL_URL_VALID, { 'panelClass': 'snackbarerror' });
            return;
        } else {
            this.virtualCallModesList.forEach(modes => {
                if (modes.callingMode === this.mode) {
                    const mode = {
                        'callingMode': this.mode,
                        'value': this.callingMode,
                        'status': 'ACTIVE'
                    };
                    virtualCallingModes.push(mode);
                    found = true;
                } else {
                    virtualCallingModes.push(modes);
                }
            });

            if (!found) {
                const mode = {
                    'callingMode': this.mode,
                    'value': this.callingMode,
                    'status': 'ACTIVE'
                };
                virtualCallingModes.push(mode);
            }
            const postdata = {
                'virtualCallingModes': virtualCallingModes
            };
            this.provider_services.addVirtualCallingModes(postdata).subscribe(
                (data) => {
                    if (this.mode === 'WhatsApp') {
                        this.snackbarService.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                        this.dialogRef.close();
                    } else if (this.mode === 'Zoom') {
                        this.snackbarService.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                        this.dialogRef.close();
                    } else if (this.mode === 'GoogleMeet') {
                        this.snackbarService.openSnackBar('Google Meet added successfully', { 'panelclass': 'snackbarerror' });
                        this.dialogRef.close();
                    } else if (this.mode === 'Phone') {
                        this.snackbarService.openSnackBar('Phone added successfully', { 'panelclass': 'snackbarerror' });
                        this.dialogRef.close();
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        }
    }
    buttonDisable() {
        if (this.callingMode == '' || ((this.mode === 'WhatsApp' || this.mode === 'Phone') && this.callingMode.length !== 10)) {
            return true;
        } else {
            return false;
        }
    }
}
