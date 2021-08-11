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
  customerId;
  constructor(public dialogRef: MatDialogRef<CommunicationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wordProcessor: WordProcessor,
    private provider_services: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private snackbarService: SnackbarService) {
    console.log(this.data);
    if (this.data.type === 'appointment') {
      this.whatsappCountryCode = this.data.waitlist.providerConsumer.whatsAppNum.countryCode;
      this.whatsappNumber = this.data.waitlist.providerConsumer.whatsAppNum.number;
      this.customerId = this.data.waitlist.providerConsumer.id;
    } else if (this.data.type === 'checkin') {
      this.whatsappCountryCode = this.data.waitlist.waitlistingFor[0].whatsAppNum.countryCode;
      this.whatsappNumber = this.data.waitlist.waitlistingFor[0].whatsAppNum.number;
      this.customerId = this.data.waitlist.consumer.id;
    } else if (this.data.type === 'donation') {
      this.whatsappCountryCode = this.data.waitlist.consumer.userProfile.whatsAppNum.countryCode;
      this.whatsappNumber = this.data.waitlist.consumer.userProfile.whatsAppNum.number;
      this.getCustomers(this.data.waitlist.consumer.id);
    } else {
      this.whatsappCountryCode = this.data.waitlist.whatsAppNum.countryCode;
      this.whatsappNumber = this.data.waitlist.whatsAppNum.number;
    }
   
  }
  ngOnInit(): void {
    this.notSupported = this.wordProcessor.getProjectMesssages('WATSAPP_NOT_SUPPORTED');
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
    this.getJaldeeVideoCredits();
  }
  getCustomers(customerId) {
    const filter = { 'jaldeeConsumer-eq': customerId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        (data: any) => {
          this.customerId = data[0].id;
        });
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
    this.provider_services.meetReady(this.customerId).subscribe(data => {
      this.meet_data = data;
      this.providerMeetingUrl = this.meet_data.providerMeetingUrl;
      const retcheckarr = this.providerMeetingUrl.split('/');
      this.id = retcheckarr[4]
      const navigationExtras: NavigationExtras = {
        queryParams: {
          custId: this.customerId,
        }
      };
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['meet/' + this.id], navigationExtras)
      );
      window.open(url, '_blank');
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
