import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-voicecall-details',
  templateUrl: './voicecall-details.component.html'
})
export class VoicecallDetailsComponent implements OnInit {
  chekintype: any;
  api_loading = false;
  phone: any;
  number: any;
  phoneNumber: string;
  bProfile = null;
  phonearr: any = [];
  checkin_id = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<VoicecallDetailsComponent>) {
    this.checkin_id = this.data.checkin_id;
    this.chekintype = this.data.chekintype;
  }
  ngOnInit() {
    this.getBussinessProfile();
  }
  getBussinessProfile() {
    this.bProfile = [];
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        this.phonearr = [];
        for (let i = 0; i < this.bProfile.phoneNumbers.length; i++) {
          this.phonearr.push(
            {
              'label': this.bProfile.phoneNumbers[i].label,
              'number': this.bProfile.phoneNumbers[i].instance,
              'permission': this.bProfile.phoneNumbers[i].permission
            }
          );
        }
      });
  }
  back() {
    this.dialogRef.close();
  }
  onSelectionChange(event) {
    this.phoneNumber = event;
  }
  createMeeting() {
    let post_itemdata: any = [];
    post_itemdata = {
      "mode": "VoIp",
      'providerPhNo': this.phoneNumber,
      'uuid': this.checkin_id,
      "custId": 0
    };
    this.provider_services.createWaitlistVoiceCall(post_itemdata).subscribe(
      () => {
        this.dialogRef.close();
        this.shared_functions.openSnackBar('You are in a call');
      },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
}

