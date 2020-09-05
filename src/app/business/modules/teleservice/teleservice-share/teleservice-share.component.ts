
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
  begin_cap: any;
  ready_cap: any;
  how_join_cap: any;
  turn_cap: any;
  wait_cap: any;
  join_cap: any;
  internt_cap: any;
  calling_u_cap: any;


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
    this.begin_cap = this.shared_functions.getProjectMesssages('WIL_BEGN');
    this.ready_cap = this.shared_functions.getProjectMesssages('PLS_B_REDY');
    this.how_join_cap = this.shared_functions.getProjectMesssages('HW_TO_JOIN');
    this.turn_cap = this.shared_functions.getProjectMesssages('UR_TURN');
    this.wait_cap = this.shared_functions.getProjectMesssages('WAIT');
    this.join_cap = this.shared_functions.getProjectMesssages('JOIN');
    this.internt_cap = this.shared_functions.getProjectMesssages('NET_CNNCT');
    this.calling_u_cap = this.shared_functions.getProjectMesssages('CAL_U');
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
      // if (this.data.app !== 'Phone') {
      //   this.msg_to_user = 'Your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' is on progress';
      // } else {
      //   this.msg_to_user = 'Your ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' is on progress';
      // }
      this.msg_to_user = '';
    } else {
      switch (this.data.app) {
        case 'WhatsApp':
          if (this.data.serviceDetail.virtualServiceType === 'videoService') {
            this.msg_to_user = 'In ' + this.selectedTime + ', your video call via ' + this.data.app + ' for ' + this.data.serviceDetail.name + ' ' + this.begin_cap + '\n\n' + this.data.busnsName + this.calling_u_cap + this.ready_cap + '\n\n' + this.internt_cap;
          } else {
            this.msg_to_user = 'In ' + this.selectedTime + ', your audio call via ' + this.data.app + ' for ' + this.data.serviceDetail.name + ' ' + this.begin_cap + '\n\n' + this.data.busnsName + this.calling_u_cap + this.ready_cap + '.\n\n' + this.internt_cap;
          }
          break;
        case 'Phone':
          this.msg_to_user = 'In ' + this.selectedTime + ', your audio call via ' + this.data.app + ' for ' + this.data.serviceDetail.name + ' ' + this.begin_cap + '\n\n' + this.data.busnsName + this.calling_u_cap + this.ready_cap;
          break;
        case 'Zoom':
          this.msg_to_user = 'In ' + this.selectedTime + ', your video call via ' + this.data.app + ' for ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' ' + this.begin_cap + this.ready_cap + '\n\n' + this.how_join_cap + '\n1.  ' + this.turn_cap + '  ' + this.data.meetingLink + '\n\n2.  ' + this.wait_cap + this.data.busnsName + this.join_cap;
          break;
        case 'GoogleMeet':
          this.msg_to_user = 'In ' + this.selectedTime + ', your video Call via ' + this.data.app + ' for ' + this.data.serviceDetail.name + ' with ' + this.data.busnsName + ' ' + this.begin_cap + this.ready_cap + '\n\n' + this.how_join_cap + '\n1.  ' + this.turn_cap + '  ' + this.data.meetingLink + '\n\n2.  ' + this.wait_cap + this.data.busnsName + this.join_cap;
          break;
      }
    }
  }
  // Meeting detail textarea msg content
  getMeetingDetailsData() {

    this.userMsg_firstLine = 'Meeting Details for your Video Call via ' + this.data.app + ' for ' + this.serviceName + '\n' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + ':' + this.providerName;
    // + '\nToken Number :' + this.data.token + '\n Time : ' + this.data.checkInTime + '\n';

    this.userMsg_secondline = ' How to join the video call 1. When it is your turn, click on the following link - ' + this.meetingLink + '2. Wait for' + this.providerName + ' to join ';

    this.providerMsg_firstLine = 'Meeting Details for your Video Call via ' + this.data.app + ' for ' + this.serviceName + ' \n ' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ':' + this.consumerName;
    // + '\nToken Number :' + this.data.token + '\n Time : ' + this.data.checkInTime + '\n';

    this.providerMsg_secondLine = 'How to join the video call 1. When it is your turn, click on the following link - ' + this.meetingLink + '2. Click on join Now ';
    switch (this.data.app) {
      case 'WhatsApp':
        this.userMsg_secondline = '* You will receive a call from ' + this.data.busnsName + ' when it is your turn.';
        this.msg_to_user = this.userMsg_firstLine + this.userMsg_secondline;
        this.providerMsg_secondLine = '* To start the video call, click on the link- ' + this.data.meetingLink + ' on your phone or WhatsApp enabled device';
        this.msg_to_me = this.providerMsg_firstLine + this.providerMsg_secondLine;
        break;
      case 'Phone':
        this.msg_to_user = 'Call to this number ' + this.data.meetingLink;
        this.msg_to_me = 'Call to this number ' + this.data.meetingLink;
        break;
      case 'Zoom':
        this.msg_to_user = this.userMsg_firstLine + this.userMsg_secondline;
        this.msg_to_me = this.providerMsg_firstLine + this.providerMsg_secondLine;
        break;
      case 'GoogleMeet':
        this.msg_to_user = this.userMsg_firstLine + this.userMsg_secondline;
        this.msg_to_me = this.providerMsg_firstLine + this.providerMsg_secondLine;
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
