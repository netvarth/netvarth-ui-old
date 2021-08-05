
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Messages } from '../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-teleservice-share',
  templateUrl: './teleservice-share.component.html',
  styleUrls: ['./teleservice-share.component.css']
})

export class TeleServiceShareComponent implements OnInit {
  providerMsg_secondLine: string;
  providerMsg_firstLine: string;
  userMsg_secondline: string;
  userMsg_firstLine: string;
  consumerName: any;
  customer_label: any;
  meetingLink: any;
  serviceName: any;
  providerName: any;
  provider_label: any;
  sendMeetingDetails: any;
  sms = true;
  email = false;
  pushnotify = true;
  telegram = true;
  reminder_cap: any;
  msg_to_user;
  msg_to_me;
  selectedTime = '1 Minute';
  minute = [
    { value: '1 Minute', viewValue: '1 Minute' },
    { value: '5 Minutes', viewValue: '5 Minutes' },
    { value: '10 Minutes', viewValue: '10 Minutes' },
    { value: '30 Minutes', viewValue: '30 Minutes' },
    { value: '1 Hour', viewValue: '1 Hour' }
  ];
  api_success = null;
  api_error = null;
  providerView = true;
  cancel_btn_cap = Messages.CANCEL_BTN;
  send_btn_cap = Messages.SEND_BTN;
  internt_cap: any;
  videocall_msg: string;
  signinGoogle: string;
  instalZoom: string;
  waitFor: string;
  aloJoin: string;
  providr_msg: string;
  provider_msgJV: string;
  disableButton = false;
  gooleWaitFor: string;
  smsCredits;
  is_smsLow = false;
  smsWarnMsg: string;
  corpSettings: any;
  addondialogRef: any;
  is_noSMS = false;
  zoomWaitFor: string;
  haveEmail;
  providerEmail = false;
  ynw_credentials;
  loginId;
  countryCode;
  countryCodeTele;
  chatId: any;
  IsTelegramDisable:any;
  cusmtor_countrycode;
  cusmtor_phone;
  cust_countryCode;
  IsTelegramCustomrDisable = true;
  constructor(public dialogRef: MatDialogRef<TeleServiceShareComponent>,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    private provider_services: ProviderServices,
    private dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupStorageService) { }

  ngOnInit() {
    this.ynw_credentials = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
    // if (this.ynw_credentials) {
    //   let login = JSON.parse(this.ynw_credentials);
    //   if(login.countryCode.startsWith('+')){
    //     this.countryCode = login.countryCode.substring(1);
    //   }
    //   this.provider_services.telegramChat(this.countryCode,login.loginId)
    //    .subscribe(
    //        data => { 
    //          this.chatId = data; 
    //          if(this.chatId === null){
    //           this.IsTelegramDisable = true;
    //          }
    //          else{
    //           this.IsTelegramDisable = false;
    //          }
            
    //        },
    //        (error) => {
              
    //        }
    //    );
    // }
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (user.email) {
      this.providerEmail = true;
    }
    else{
      this.providerEmail = false;
    }
    if(this.data.consumerDetails && this.data.consumerDetails.countryCode){
      this.cusmtor_countrycode = this.data.consumerDetails.countryCode;
      this.cusmtor_phone = this.data.consumerDetails.phoneNo;
      if(this.cusmtor_countrycode.startsWith('+')){
        this.cust_countryCode = this.cusmtor_countrycode.substring(1);
      }
      if(this.cusmtor_phone){
        this.provider_services.telegramChat(this.cust_countryCode, this.cusmtor_phone)
        .subscribe(
            data => { 
              this.chatId = data; 
              if(this.chatId === null){
               this.IsTelegramCustomrDisable = true;
              }
              else{
               this.IsTelegramCustomrDisable = false;
              }
             
            },
            (error) => {
               
            }
        );
      }
    }
    
    if (this.data.waitingType === 'checkin') {
      if (this.data.consumerDetails.email_verified) {
        this.haveEmail = true;
        this.email = true;
      }
    } else {
      if (this.data.consumerDetails.email) {
        this.haveEmail = true;
        this.email = true;
      }
    }
    this.sendMeetingDetails = this.wordProcessor.getProjectMesssages('SENDING_MEET_DETAILS');
    this.reminder_cap = this.wordProcessor.getProjectMesssages('SEND_REMINDER');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.providerName = this.data.busnsName;
    this.serviceName = this.data.serviceDetail.name;
    this.meetingLink = this.data.meetingLink;
    this.consumerName = this.data.consumerName;
    this.internt_cap = this.wordProcessor.getProjectMesssages('NET_CNNCT');
    this.getSMSCredits();
    if (this.data.reminder) {
      this.getReminderData();
      // this.providerView = true;
    } else if (this.data.meetingDetail) {
      this.getMeetingDetailsData();
    }
  }
  handleTimeSelction(obj) {
    this.selectedTime = obj;
    this.getReminderData();
  }
  dataChanged(evt) {
    this.msg_to_user = evt;
  }
  tabClick(evt) {
    if (evt.index === 0) {
      this.providerView = true;
    } else {
      this.providerView = false;
    }
  }
  // Reminder textarea msg content
  getReminderData() {
    const mode = (this.data.app === 'GoogleMeet') ? 'Google Meet' : this.data.app;
    if (this.data.status) {
      this.msg_to_user = '';
    } else {
      this.instalZoom = '\n(If you do not have Zoom installed you will be prompted to install Zoom)';
      this.signinGoogle = '\n(If you are not already signed into Google you must sign in)';
      if (this.data.app === 'VideoCall') {
        // this.videocall_msg = ' , your ' + mode + ' will begin. You will be alerted once more when the call starts.\n\nFollow these instructions to join the video call:\n1. You will receive an alert that the ' + mode + ' call has started.\n2. When it is your turn, click on the following link- ' + this.meetingLink;
        this.videocall_msg = ', your ' + mode + ' will begin. You will be alerted once more when the call starts.You can then join the call, by clicking on the following link-' + this.meetingLink + '.Wait for the video call to start';
      } else {
        this.videocall_msg = ' , your ' + mode + ' video call will begin. You will be alerted once more when the call starts.\n\nFollow these instructions to join the video call:\n1. You will receive an alert that the ' + mode + ' call has started.\n2. When it is your turn, click on the following link- ' + this.meetingLink;
      }
      this.waitFor = '\n3. Wait for the video call to start';
      this.gooleWaitFor = '\n3. Wait for the video call to start';
      this.zoomWaitFor = '\n2. Wait for the video call to start';
      switch (this.data.app) {
        case 'WhatsApp':
          if (this.data.serviceDetail.virtualServiceType === 'videoService') {
            this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a WhatsApp video call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          } else {
            this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a WhatsApp audio call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          }
          break;
        case 'Phone':
          this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a phone call on +' + this.meetingLink + '.';
          break;
        case 'Zoom':
          this.msg_to_user = 'In ' + this.selectedTime + this.videocall_msg + this.instalZoom + this.zoomWaitFor;
          break;
        case 'GoogleMeet':
          this.msg_to_user = 'In ' + this.selectedTime + this.videocall_msg + this.signinGoogle + this.gooleWaitFor;
          break;
        case 'VideoCall':
          this.msg_to_user = 'In ' + this.selectedTime + this.videocall_msg;
          break;
      }
    }
  }
  // Meeting detail textarea msg content
  getMeetingDetailsData() {
    const mode = (this.data.app === 'GoogleMeet') ? 'Google Meet' : this.data.app;
    this.instalZoom = '\n(If you do not have Zoom installed you will be prompted to install Zoom)';
    this.signinGoogle = '\n(If you are not already signed into Google you must sign in)';
    this.videocall_msg = 'Follow these instructions to join the video call:\n1. You will receive an alert that the ' + mode + ' call has started.\nOpen the following link- ' + this.meetingLink;
    this.waitFor = '\n2. Wait for the video call to begin';
    this.providr_msg = 'How to start the video call -\n1. Open the following link - ' + this.meetingLink;
    this.aloJoin = '\n2. Allow ' + this.customer_label + ' to join the call when you are prompted';
    this.provider_msgJV = 'How to start the video call -\n Click on "Launch Meeting" button';
    switch (this.data.app) {
      case 'WhatsApp':
        if (this.data.serviceDetail.virtualServiceType === 'videoService') {
          this.msg_to_user = 'When it is time for your video call, you will receive a WhatsApp video call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          this.msg_to_me = 'Follow these instructions to start the video call: \n1. Open the following link on your phone/tablet browser- ' + this.meetingLink + '\n(Your phone/tablet should have WhatsApp installed)\n2. Start the video call';
        } else {
          this.msg_to_user = 'When it is time for your audio call, you will receive a WhatsApp audio call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          this.msg_to_me = 'Follow these instructions to start the audio call: \n1. Open the following link on your phone/tablet browser- ' + this.meetingLink + '\n(Your phone/tablet should have WhatsApp installed)\n2. Start the audio call';
        }
        break;
      case 'Phone':
        this.msg_to_user = 'When it is time for your phone call, you will receive a call on +' + this.meetingLink;
        this.msg_to_me = 'Follow these instructions to start the phone call:\n1. Call ' + this.customer_label + ' on the phone no +' + this.meetingLink;
        break;
      case 'Zoom':
        this.msg_to_user = this.videocall_msg + this.instalZoom + this.waitFor;
        this.msg_to_me = this.providr_msg + this.instalZoom + this.aloJoin;
        break;
      case 'GoogleMeet':
        this.msg_to_user = this.videocall_msg + this.signinGoogle + this.waitFor;
        this.msg_to_me = this.providr_msg + this.signinGoogle + this.aloJoin;
        break;
      case 'VideoCall':
        this.msg_to_user = this.videocall_msg + this.waitFor;
        this.msg_to_me = this.provider_msgJV;
        break;
    }
  }

  // Copy textarea content
  copyMessageInfo(elementId, Message) {
    elementId.select();
    document.execCommand('copy');
    elementId.setSelectionRange(0, 0);
    this.snackbarService.openSnackBar(Message + ' copied to clipboard');
    // const info = document.getElementById(elementId);
    // if (window.getSelection) {
    //   const selection = window.getSelection();
    //   const range = document.createRange();
    //   range.selectNodeContents(info);
    //   selection.removeAllRanges();
    //   selection.addRange(range);
    //   document.execCommand('Copy');
    //   this.snackbarService.openSnackBar(Message + ' copied to clipboard');
    // }
  }
  // Mass communication
  sendMessage() {
    this.api_error = '';
    this.disableButton = true;
    if (!this.msg_to_user) {
      this.api_error = 'Please enter your messsage';
      this.disableButton = false;
      return;
    }
    if (this.providerView) {
      const post_data = {
        medium: {
          email: this.email,
          sms: this.sms,
          pushNotification: this.pushnotify,
          telegram: this.telegram
        },
        communicationMessage: this.msg_to_user,
        uuid: [this.data.waitingId]
      };
      if (this.data.waitingType === 'checkin') {
        this.shared_services.consumerMassCommunication(post_data).
          subscribe(() => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
            this.disableButton = false;
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          }
          );
      } else {
        this.shared_services.consumerMassCommunicationAppt(post_data).
          subscribe(() => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
            this.disableButton = false;
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          }
          );
      }
    }
    else {
      const post_data = {
        medium: {
          email: this.email,
          sms: this.sms,
          pushNotification: this.pushnotify,
          telegram: this.telegram,
        },
        meetingDetails: this.msg_to_me,
        uuid: this.data.waitingId
      };
      if (this.data.waitingType === 'checkin') {
        this.shared_services.shareMeetingdetails(post_data).
          subscribe(() => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
            this.disableButton = false;
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          }
          );
      } else {
        this.shared_services.shareMeetingDetailsAppt(post_data).
          subscribe(() => {
            this.api_success = this.wordProcessor.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
            this.disableButton = false;
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          }
          );
      }
    }
  }

  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
      this.smsCredits = data;
      if (this.smsCredits < 5 && this.smsCredits > 0) {
        this.is_smsLow = true;
        this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else if (this.smsCredits === 0) {
        this.is_smsLow = true;
        this.is_noSMS = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.is_noSMS = false;
      }
    });
  }
  getLicenseCorpSettings() {
    this.provider_services.getLicenseCorpSettings().subscribe(
      (data: any) => {
        this.corpSettings = data;
      }
    );
  }
  gotoSmsAddon() {
    this.dialogRef.close();
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
      this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type: 'addons'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });
      this.addondialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getSMSCredits();
        }
      });
    }
  }
}
