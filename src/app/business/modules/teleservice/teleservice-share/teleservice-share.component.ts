
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Messages } from '../../../../shared/constants/project-messages';

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
  email = true;
  pushnotify = true;
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


  constructor(public dialogRef: MatDialogRef<TeleServiceShareComponent>,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.sendMeetingDetails = this.shared_functions.getProjectMesssages('SENDING_MEET_DETAILS');
    this.reminder_cap = this.shared_functions.getProjectMesssages('SEND_REMINDER');
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.providerName = this.data.busnsName;
    this.serviceName = this.data.serviceDetail.name;
    this.meetingLink = this.data.meetingLink;
    this.consumerName = this.data.consumerName;
    this.internt_cap = this.shared_functions.getProjectMesssages('NET_CNNCT');
    if (this.data.reminder) {
      this.getReminderData();
      this.providerView = false;
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
    if (this.data.status) {
      this.msg_to_user = '';
    } else {
      this.instalZoom = '\n(If you do not have Zoom installed you will be prompted to install Zoom)';
      this.signinGoogle = '\n(If you are not already signed into Google you must sign in)';
      this.videocall_msg = ' , your ' + this.data.app + ' video call will begin. You will be alerted once more when the call starts.\n\nFollow these instructions to join the video call:\n1. You will recieve an alert that the ' + this.data.app + ' call has started.\nWhen it is your turn, click on the following link- ' + this.meetingLink;
      this.waitFor = '\n3. Wait for the video call to start';
      switch (this.data.app) {
        case 'WhatsApp':
          if (this.data.serviceDetail.virtualServiceType === 'videoService') {
            this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a WhatsApp video call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          } else {
            this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a WhatsApp audio call on +' + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          }
          break;
        case 'Phone':
          this.msg_to_user = 'In ' + this.selectedTime + ', you will receive a phone call on +91' + this.meetingLink + '.';
          break;
        case 'Zoom':
          this.msg_to_user = 'In ' + this.selectedTime + this.videocall_msg + this.instalZoom + this.waitFor;
          break;
        case 'GoogleMeet':
          this.msg_to_user = 'In ' + this.selectedTime + this.videocall_msg + this.signinGoogle + this.waitFor;
          break;
      }
    }
  }
  // Meeting detail textarea msg content
  getMeetingDetailsData() {
    this.instalZoom = '\n(If you do not have Zoom installed you will be prompted to install Zoom)';
    this.signinGoogle = '\n(If you are not already signed into Google you must sign in)';
    this.videocall_msg = 'Follow these instructions to join the video call:\n1. You will recieve an alert that the ' + this.data.app + ' call has started.\nOpen the following link- ' + this.meetingLink;
    this.waitFor = '\n3. Wait for the video call to begin';
    this.providr_msg = 'How to start the video call -\n1. Open the following link - ' + this.meetingLink;
    this.aloJoin = '\n2. Allow ' + this.customer_label + ' to join the call when you are prompted';

    switch (this.data.app) {
      case 'WhatsApp':
        if (this.data.serviceDetail.virtualServiceType === 'videoService') {
          this.msg_to_user = 'When it is time for your video call, you will receive a WhatsApp video call on +'  + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          this.msg_to_me = 'Follow these instructions to start the video call: \n1. Open the following link on your phone/tablet browser- ' + this.meetingLink + '\n(Your phone/tablet should have WhatsApp installed)\n2. Start the video call';
        } else {
          this.msg_to_user = 'When it is time for your video call, you will receive a WhatsApp audio call on +'  + this.meetingLink.slice(14, 29) + '.\n' + this.internt_cap;
          this.msg_to_me = 'Follow these instructions to start the audio call: \n1. Open the following link on your phone/tablet browser- ' + this.meetingLink + '\n(Your phone/tablet should have WhatsApp installed)\n2. Start the audio call';
        }
        break;
      case 'Phone':
        this.msg_to_user = 'When it is time for your phone call, you will receive a call on +' + this.meetingLink;
        this.msg_to_me = 'Follow these instructions to start the phone call:\n1. Call ' + this.customer_label + ' on the phone no- ' + this.meetingLink;
        break;
      case 'Zoom':
        this.msg_to_user = this.videocall_msg + this.instalZoom + this.waitFor;
        this.msg_to_me = this.providr_msg + this.instalZoom + this.aloJoin;
        break;
      case 'GoogleMeet':
        this.msg_to_user = this.videocall_msg + this.signinGoogle + this.waitFor;
        this.msg_to_me = this.providr_msg + this.signinGoogle + this.aloJoin;
        break;
    }
  }

  // Copy textarea content
  copyMessageInfo(elementId, Message) {
    const info = document.getElementById(elementId);
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(info);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('Copy');
      this.shared_functions.openSnackBar(Message + ' copied to clipboard');
    }
  }

  // Mass communication
  sendMessage() {
    const post_data = {
      medium: {
        email: this.email,
        sms: this.sms,
        pushNotification: this.pushnotify
      },
      communicationMessage: this.msg_to_user,
      uuid: [this.data.waitingId]
    };
    if (this.data.waitingType === 'checkin') {
      this.shared_services.consumerMassCommunication(post_data).
        subscribe(() => {
          this.api_success = this.shared_functions.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
          setTimeout(() => {
            this.dialogRef.close();
          }, 2000);
        }
        );
    } else {
      this.shared_services.consumerMassCommunicationAppt(post_data).
        subscribe(() => {
          this.api_success = this.shared_functions.getProjectMesssages('PROVIDERTOCONSUMER_NOTE_ADD');
          setTimeout(() => {
            this.dialogRef.close();
          }, 2000);
        }
        );
    }
  }
}
