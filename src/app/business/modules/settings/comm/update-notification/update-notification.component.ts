import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.css']
})
export class UpdateNotificationComponent implements OnInit {
  virtualCallModesList;
  callingMode;
  mode;
  callingmodes = projectConstantsLocal.videoModes;
  constructor(public dialogRef: MatDialogRef<UpdateNotificationComponent>,
    private provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions) { 
      console.log(this.data);
      this.virtualCallModesList = this.data.callingmodeList;
      this.mode = this.data.mode;
      const filtererList = this.virtualCallModesList.filter(mode => mode.callingMode === this.mode);
      console.log(filtererList);
      if (filtererList && filtererList[0]) {
        this.callingMode = filtererList[0].value;
      }
    }

  ngOnInit() {
  }
  updateVideoSettings() {
    const virtualCallingModes = [];
    let found = false;
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
                    this.shared_functions.openSnackBar('Whatsapp mode added successfully', { 'panelclass': 'snackbarerror' });
                this.dialogRef.close();
            } else if (this.mode === 'Zoom') {
                    this.shared_functions.openSnackBar('Zoom mode added successfully', { 'panelclass': 'snackbarerror' });
                this.dialogRef.close();
            } else if (this.mode === 'GoogleMeet') {
                    this.shared_functions.openSnackBar('Google Meet added successfully', { 'panelclass': 'snackbarerror' });
                this.dialogRef.close();
            } else if (this.mode === 'Phone') {
                    this.shared_functions.openSnackBar('Phone added successfully', { 'panelclass': 'snackbarerror' });
                this.dialogRef.close();
            }
        },
        error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
    );
}
}
