import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-voicecall-details-send',
  templateUrl: './voicecall-details-send.component.html'
})
export class VoicecallDetailsSendComponent implements OnInit {
  uuid: any;
  userid: any;
  chekintype: any;
  api_loading = false;
  phone: any;
  number: any;
  phoneNumber: string;
  bProfile = null;
  phonearr: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<VoicecallDetailsSendComponent>) {
    this.uuid = this.data.uuid;
    this.userid = this.data.custId;
    console.log(this.userid);
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
      'uuid': this.uuid,
      "custId": this.userid
    };
    this.provider_services.createVoiceCall(post_itemdata).subscribe(
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

