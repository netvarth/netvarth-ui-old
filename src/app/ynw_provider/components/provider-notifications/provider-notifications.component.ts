import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css']
})
export class ProviderNotificationsComponent implements OnInit {

  breadcrumb_moreoptions: any = [];
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Notifications',
      url: '/provider/settings/holidays'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  SelchkinNotify = true;
  SelchkincnclNotify = true;
  // pushNotification = false;
  sms = false;
  email = false;
  cheknpush = false;
  cancelsms = false;
  cancelemail = false;
  cancelpush = false;
  notifyphonenumber = '';
  notifyemail = '';
  notifycanclphonenumber = '';
  notifycanclemail = '';
  api_error = null;
  api_success = null;
  ph_arr: any = [];
  em_arr: any = [];
  ph1_arr: any = [];
  em1_arr: any = [];
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  saveNotification: any = [];
  saveCanclNotification: any = [];
  notificationList: any = [];
  saveCheckinMode;
  cancelCheckinMode;
  constructor(private sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices) { }

  ngOnInit() {
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'miscellaneous', 'subKey': 'services' };
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
    this.getNotificationList();
   }
  getNotificationList(){
   // alert("get")
    this.provider_services.getNotificationList()
     .subscribe(
       data => {
         this.notificationList = data;
         this.setNotificationList(this.notificationList);
       },
       error => {
         this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error));

       }
     );
     
  }
  setNotificationList(notificationList: any): any {

    //alert(JSON.stringify(notificationList));
    if(notificationList.length != 0){
      
    
     // this.saveCheckinMode = "UPDATE";
     // alert(this.saveCheckinMode)
    for(const notifyList of notificationList){
      if(notifyList.eventType && notifyList.eventType == "WAITLISTADD" ){
        
        if(notifyList.email && notifyList.email.length != 0){
          this.em_arr = notifyList.email;
          this.SelchkinNotify = false;
          this.email = true;
        }
        if(notifyList.sms && notifyList.sms.length != 0){
          this.ph_arr = notifyList.sms;
          this.SelchkinNotify = false;
          this.sms = true;
        }
        if(notifyList.pushMessage){
          this.cheknpush = notifyList.pushMessage;
          this.SelchkinNotify = false;
        }
       
      }else if (notifyList.eventType && notifyList.eventType == "WAITLISTCANCEL" ){
        
        if(notifyList.email && notifyList.email.length != 0){
          this.em1_arr = notifyList.email;
          this.SelchkincnclNotify = false;
          this.cancelemail = true;
        }
        if(notifyList.sms && notifyList.sms.length != 0){
          this.ph1_arr = notifyList.sms;
          this.SelchkincnclNotify = false;
          this.cancelsms = true;
 
        }
        if(notifyList.pushMessage){
          this.cancelpush = notifyList.pushMessage;
          this.SelchkincnclNotify = false;
        }
        
      }
    }
    }
  }

  selectChekinNotify() {
    this.SelchkinNotify = false;

  }
  selectChekinCanclNotify() {
    this.SelchkincnclNotify = false;

  }

  unselectChekinNotify() {
    this.SelchkinNotify = true;
  }
  unselectChekinCanclNotify() {
    this.SelchkincnclNotify = true;
  }
  addChkinPh() {
    this.resetApiErrors();
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
        return;
      }
      this.ph_arr.push(curphone);
      this.notifyphonenumber = '';
    }


  }

  addChkinemil() {
    this.resetApiErrors();
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = Messages.BPROFILE_PRIVACY_EMAIL_INVALID; // 'Please enter a valid email id';
        return;
      }
      this.em_arr.push(curemail);
      this.notifyemail = '';
    }

  }
  addCheknCanclph() {
    this.resetApiErrors();
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
        return;
      }
      this.ph1_arr.push(curphone1);
      this.notifycanclphonenumber = '';
    }


  }

  addCheknCanclemil() {
    this.resetApiErrors();
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = Messages.BPROFILE_PRIVACY_EMAIL_INVALID; // 'Please enter a valid email id';
        return;
      }
      this.em1_arr.push(curemail1);
      this.notifycanclemail = '';
    }
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }



  chekinNotifications() {
    this.savechekinNotification_json = {};
    this.saveNotification = [];
    let chekinMode = 'ADD';
   // alert(JSON.stringify(this.notificationList));
    if(this.notificationList.length == 0){
        chekinMode = 'ADD';
    }
    for(const notifyList of this.notificationList){
      if(notifyList.eventType && notifyList.eventType == "WAITLISTADD" ){
        chekinMode = 'UPDATE';
      }
    }
    if (this.SelchkinNotify) {
      this.em_arr = [];
      this.ph_arr = [];
      this.cheknpush = false;
    }
    
    if (!this.email) {
      this.em_arr = [];
    }
    if (!this.sms) {
      this.ph_arr = [];
    }
    

    this.savechekinNotification_json.resourceType='CHECKIN';
    this.savechekinNotification_json.eventType='WAITLISTADD';
    this.savechekinNotification_json.sms=this.ph_arr;
    this.savechekinNotification_json.email=this.em_arr;
    this.savechekinNotification_json.pushMessage=this.cheknpush;
     //alert(JSON.stringify(this.savechekinNotification_json))
     this.saveNotifctnJson(this.savechekinNotification_json,chekinMode)
  }

  checkinCancelNotifications(){
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if(this.notificationList.length == 0){
      chekincancelMode = 'ADD';
    }
    for(const notifyList of this.notificationList){
      if(notifyList.eventType && notifyList.eventType == "WAITLISTCANCEL" ){
        chekincancelMode = 'UPDATE';
      }
    }
    if (this.SelchkincnclNotify) {
      this.em1_arr = [];
      this.ph1_arr = [];
      this.cancelpush = false;
    }
    if (!this.cancelemail) {
      this.em1_arr = [];
    }
    if (!this.cancelsms) {
      this.ph1_arr = [];
    }
    this.savecancelNotification_json.resourceType='CHECKIN';
    this.savecancelNotification_json.eventType='WAITLISTCANCEL';
    this.savecancelNotification_json.sms=this.ph1_arr;
    this.savecancelNotification_json.email=this.em1_arr;
    this.savecancelNotification_json.pushMessage=this.cancelpush;
    //alert(JSON.stringify(this.savecancelNotification_json))
    this.saveNotifctnJson(this.savecancelNotification_json,chekincancelMode)
    

  }
  saveNotifctnJson(saveNotification_json,mode){
   
   // alert(mode)
    if(mode == "ADD"){
      
      this.provider_services.addNotificationList(saveNotification_json)
    .subscribe(
      () => {
        this.getNotificationList();
        this.api_success = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ADD NOTIFICATIONS'));
             },
      error => {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error));
        

      }
    );
    }
   else{
      this.provider_services.updateNotificationList(saveNotification_json)
    .subscribe(
      () => {
        this.getNotificationList();
        this.api_success = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('UPDATED NOTIFICATIONS'));
        
      },
      error => {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error));

      }
    );
    }
  }

 

  removePhEmail(phemail,array) {
    var index = array.indexOf(phemail);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
 

}
