import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { VoiceConfirmComponent } from '../../../customers/video-confirm/voice-confirm.component';

@Component({
  selector: 'app-communication-popup',
  templateUrl: './communication-popup.component.html',
  styleUrls: ['./communication-popup.component.css']
})
export class CommunicationPopupComponent implements OnInit {
  is_web = false;
  notSupported;
  videocredits;
  meet_data: any = [];
  providerMeetingUrl;
  id;
  whatsappNumber;
  whatsappCountryCode;
  constructor(public dialogRef: MatDialogRef<CommunicationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private snackbarService: SnackbarService) {
    console.log(this.data);
    this.whatsappCountryCode = (this.data.type === 'appointment') ? this.data.waitlist.providerConsumer.whatsAppNum.countryCode : this.data.waitlistingFor[0].whatsAppNum.countryCode;
    this.whatsappNumber = (this.data.type === 'appointment') ? this.data.waitlist.providerConsumer.whatsAppNum.number : this.data.waitlist.waitlistingFor[0].whatsAppNum.number;
  }
  ngOnInit(): void {
    this.notSupported = this.wordProcessor.getProjectMesssages('WATSAPP_NOT_SUPPORTED');
    console.log(this.notSupported);
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };
    if (!isMobile.Android() && !isMobile.iOS()) {
      this.is_web = true;
    }
    console.log(this.is_web);
    this.getJaldeeVideoCredits();
  }
  dialogClose() {
    this.dialogRef.close();
  }
  getJaldeeVideoCredits() {
    this.provider_services.getJaldeeVideoRecording()
      .subscribe(
        (data) => {
          this.videocredits = data;
        }
      );
  }
  amReady() {
    const path = 'https://wa.me/' + this.whatsappNumber;
    window.open(path, '_blank');
  }
  gotoMeet() {
    const customerId = (this.data.type === 'appointment') ? this.data.waitlist.providerConsumer.id : this.data.waitlist.consumer.id;
    this.provider_services.meetReady(customerId).subscribe(data => {
      this.meet_data = data;
      this.providerMeetingUrl = this.meet_data.providerMeetingUrl;
      const retcheckarr = this.providerMeetingUrl.split('/');
      this.id = retcheckarr[4]
      const navigationExtras: NavigationExtras = {
        queryParams: {
          custId: customerId,
        }
      };
      this.router.navigate(['meet', this.id], navigationExtras);
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  voiceCallConfirm() {
    let customerId;
    let num;
    if (this.data.type === 'appointment') {
      customerId = this.data.waitlist.appmtFor[0].id;
      num = this.data.waitlist.providerConsumer.countryCode + ' ' + this.data.waitlist.providerConsumer.phoneNo;
    } else {
      customerId = this.data.waitlist.waitlistingFor[0].id;
      num = this.data.waitlist.consumer.countryCode + ' ' + this.data.waitlist.consumer.phoneNo;
    }
    this.dialog.open(VoiceConfirmComponent, {
      width: '60%',
      height: '30%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        customerId: customerId,
        customer: num,
      }
    });
  }
}
