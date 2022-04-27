// import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VoicecallConfirmBoxComponent } from '../confirm-box/voicecall-confirm-box.component';
import { ProviderServices } from "../../../../business/services/provider-services.service";
import { SnackbarService } from '../../../../shared/services/snackbar.service';
// import { Messages } from 'src/app/shared/constants/project-messages';

@Component({
  selector: 'app-voice-confirm',
  templateUrl: './voice-confirm.component.html',
  styleUrls: ['./voice-confirm.component.css']
})


export class VoiceConfirmComponent {
  ok_btn_cap = 'OK';
  cancel_btn_cap = 'NO';
  customerId: any;
  customer: any = [];
  phone: any;
  countrycode: any;
  constructor(public dialogRef: MatDialogRef<VoiceConfirmComponent>,
    public dialog: MatDialog,
    // private location: Location,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.type) {

    }
    this.customerId = data.customerId;
    this.customer = data.customer;
    console.log('data.customer;',data)
    // this.phone = this.customer[0].phoneNumber;
    // this.countrycode = this.customer[0].countryCode;
  }
  ngOnInit() {
}
  onClick() {
    this.dialogRef.close();
  }
  voiceCall(){
     this.provider_services.voiceCallReady(this.customerId).subscribe(data => {
            this.voiceCallConfirm()
            this.dialogRef.close();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.dialogRef.close();
            });
  }
  voiceCallConfirm() {
    const dialogref = this.dialog.open(VoicecallConfirmBoxComponent, {
      width: '60%',
      height: '30%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        // profile: this.profile
      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        this.dialogRef.close();
      }
    );
  }
}

