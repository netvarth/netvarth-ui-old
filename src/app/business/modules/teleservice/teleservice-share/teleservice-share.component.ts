
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
  providerView = false;
  cancel_btn_cap = Messages.CANCEL_BTN;
  send_btn_cap = Messages.SEND_BTN;

  constructor(public dialogRef: MatDialogRef<TeleServiceShareComponent>,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.sendMeetingDetails = this.shared_functions.getProjectMesssages('SENDING_MEET_DETAILS');
    this.reminder_cap = this.shared_functions.getProjectMesssages('SEND_REMINDER');
    if (this.data.reminder) {
      this.getReminderData();
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
    if (evt.index === 1) {
    this.providerView = true;
    } else {
      this.providerView = false;
    }
  }
  // Reminder textarea msg content
  getReminderData() {
    if (this.data.status) {
      // if (this.data.app !== 'Phone') {
      //   this.msg_to_user = 'Your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' is on progress';
      // } else {
      //   this.msg_to_user = 'Your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' is on progress';
      // }
      this.msg_to_user = '';
    } else {
      switch (this.data.app) {
        case 'WhatsApp':
          this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.data.serviceDetail.name + ' via WhatsApp with ' + this.data.busnsName + ' will begin. Please be ready.\n\nSteps to follow to start the WhatsApp consultation: \n\n1. Wait for your turn.\n\n2. When it is time you will recieve a WhatsApp call from ' + this.data.busnsName;
          break;
        case 'Phone':
          this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' will begin.\n\nYou will receive a ' + this.data.app + ' call from ' + this.data.busnsName + '. Please be ready.';
          break;
        case 'Zoom':
          this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' will begin. Please be ready.\n\nHere are the details for how to start the service -\n1. Click on the following link - ' + this.data.meetingLink + ' \n2. Wait for your ' + this.data.providerLabel + ' to join';
          break;
        case 'GoogleMeet':
          this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' will begin. Please be ready.\n\nHere are the details for how to start the service -\n1. Click on the following link - ' + this.data.meetingLink + '\n2. Wait for your ' + this.data.providerLabel + ' to join';
          break;
      }
    }
  }
  // Meeting detail textarea msg content
  getMeetingDetailsData() {
    switch (this.data.app) {
      case 'WhatsApp':
        this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.data.meetingLink + '\n 2. Click on the video icon on the top right of the screen ';
        this.msg_to_me = 'How to start the service:\n\n 1. Click on the following link - ' + this.data.meetingLink + '\n 2. Click on the video icon on the top right corner of the screen to start the video consultation ';
        break;
      case 'Phone':
        this.msg_to_user = 'Call to this number ' + this.data.meetingLink;
        this.msg_to_me = 'Call to this number ' + this.data.meetingLink;
        break;
      case 'Zoom':
        this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.data.meetingLink + '\n2. Join meeting ';
        this.msg_to_me = 'How to start the service:\n\n 1. Click on the following link - ' + this.data.meetingLink + '\n 2. Join meeting ';
        break;
      case 'GoogleMeet':
        this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.data.meetingLink + '\n2. Click on join button ';
        this.msg_to_me = 'How to start the service:\n\n 1. Click on the following link - ' + this.data.meetingLink + '\n 2. Click on join button ';
        break;
    }
  }

  // Copy textarea content
  copyMessageInfo(elementId, Message) {
    console.log(elementId);
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
