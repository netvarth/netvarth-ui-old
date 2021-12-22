import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-members-holder',
  templateUrl: './add-members-holder.component.html'
})

export class AddMembersHolderComponent implements OnInit, OnDestroy {
  family_member_cap = Messages.FAMILY_MEMBER;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  update_btn_cap = Messages.UPDATE_BTN;
  member_cap = Messages.MEMBER_CAPTION;
  api_error = null;
  api_success = null;
  member_list: any = [];
  disableButton = false;
  addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '', 'whatsAppNum': {}, 'telegramNum': {}, 'email': '' };
  private subs = new SubSink();
  constructor(
    public dialogRef: MatDialogRef<AddMembersHolderComponent>,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    if (data.type === 'edit') {
      this.addmemberobj.fname = data.member.userProfile.firstName || '';
      this.addmemberobj.lname = data.member.userProfile.lastName || '';
      this.addmemberobj.mobile = data.member.userProfile.primaryMobileNo || '';
      this.addmemberobj.gender = data.member.userProfile.gender || '';
      this.addmemberobj.dob = data.member.userProfile.dob || '';
      if (data.member.userProfile.whatsAppNum && data.member.userProfile.whatsAppNum.countryCode && data.member.userProfile.whatsAppNum.number) {
        const whatsup = {}
        if (data.member.userProfile.whatsAppNum.countryCode.startsWith('+')) {
          whatsup["countryCode"] = data.member.userProfile.whatsAppNum.countryCode
        } else {
          whatsup["countryCode"] = '+' + data.member.userProfile.whatsAppNum.countryCode
        }
        whatsup["number"] = data.member.userProfile.whatsAppNum.number
        this.addmemberobj['whatsAppNum'] = whatsup;
      }
      if (data.member.userProfile.telegramNum && data.member.userProfile.telegramNum.countryCode && data.member.userProfile.telegramNum.number) {
        const telegram = {}
        if (data.member.userProfile.telegramNum.countryCode.startsWith('+')) {
          telegram["countryCode"] = data.member.userProfile.telegramNum.countryCode
        } else {
          telegram["countryCode"] = '+' + data.member.userProfile.telegramNum.countryCode
        }
        telegram["number"] = data.member.userProfile.telegramNum.number
        this.addmemberobj['telegramNum'] = telegram;
      }
    }
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  handleReturnDetails(obj) {
    console.log(obj);
    this.resetApi();
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    this.addmemberobj.gender = obj.gender || '';
    this.addmemberobj.dob = obj.dob || '';
    const whatsappObj = {};
    whatsappObj['countryCode'] = obj.countryCode_whtsap;
    whatsappObj['number'] = obj.whatsappnumber;
    this.addmemberobj.whatsAppNum = whatsappObj;
    const telegramObj = {};
    telegramObj['countryCode'] = obj.countryCode_telegram;
    telegramObj['number'] = obj.telegramnumber;
    this.addmemberobj.telegramNum = telegramObj;
    this.addmemberobj.email = obj.email;
  }
  handleSaveMember() {
    console.log(this.addmemberobj);
    this.disableButton = true;
    this.resetApi();
    let derror = '';
    const namepattern = new RegExp(projectConstantsLocal.VALIDATOR_CHARONLY);
    const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
    const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
    if (!namepattern.test(this.addmemberobj.lname) || this.addmemberobj.lname.trim() === '') {
      derror = Messages.LASTNAME_INVAL_MSG;
    }
    if (this.addmemberobj.lname.trim() === '') {
      derror = 'Please enter the last name';
    }
    if (!namepattern.test(this.addmemberobj.fname)) {
      derror = Messages.FIRSTNAME_INVAL_MSG;
    }
    if (this.addmemberobj.fname.trim() === '') {
      derror = 'Please enter the first name';
    }
    if (this.addmemberobj.telegramNum['countryCode'] == '' && this.addmemberobj.telegramNum['countryCode'] == undefined && this.addmemberobj.telegramNum['number'] == '' && this.addmemberobj.telegramNum['number'] == undefined) {
      if (this.addmemberobj.telegramNum['countryCode'] == '' || this.addmemberobj.telegramNum['countryCode'] == undefined) {
        derror = 'Enter valid telegram country code';
      }
      if (this.addmemberobj.telegramNum['number'] == '' || this.addmemberobj.telegramNum['number'] == undefined) {
        derror = 'Enter valid telegram number';
      }
    }
    if (this.addmemberobj.whatsAppNum['countryCode'] == '' && this.addmemberobj.whatsAppNum['countryCode'] == undefined && this.addmemberobj.whatsAppNum['number'] == '' && this.addmemberobj.whatsAppNum['number'] == undefined) {
      if (this.addmemberobj.whatsAppNum['number'] == '' || this.addmemberobj.whatsAppNum['number'] == undefined) {
        derror = 'Enter valid whatsapp number';
      }
      if (this.addmemberobj.whatsAppNum['countryCode'] == '' || this.addmemberobj.whatsAppNum['countryCode'] == undefined) {
        derror = 'Enter valid whatsapp country code';
      }
    }
    if (derror === '') {
      if (this.addmemberobj.mobile !== '') {
        if (!phonepattern.test(this.addmemberobj.mobile)) {
          derror = Messages.PHONE_NUM_VAL_MSG;
        } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
          derror = Messages.PHONE_DIGIT_VAL_MSG;
        }
      }
    }
    if (derror === '') {
      const post_data = {
        'userProfile': {
          'firstName': this.addmemberobj.fname,
          'lastName': this.addmemberobj.lname
        }
      };
      if (this.addmemberobj.mobile !== '') {
        post_data.userProfile['primaryMobileNo'] = this.addmemberobj.mobile;
        post_data.userProfile['countryCode'] = '+91';
      }
      if (this.addmemberobj.gender !== '') {
        post_data.userProfile['gender'] = this.addmemberobj.gender;
      }
      if (this.addmemberobj.dob !== '') {
        post_data.userProfile['dob'] = this.addmemberobj.dob;
      }
      if (this.addmemberobj.whatsAppNum) {
        post_data.userProfile['whatsAppNum'] = this.addmemberobj.whatsAppNum;
      }
      if (this.addmemberobj.telegramNum) {
        post_data.userProfile['telegramNum'] = this.addmemberobj.telegramNum;
      }
      if (this.addmemberobj.email) {
        post_data.userProfile['email'] = this.addmemberobj.email;
      }
      console.log(post_data);
      if (this.data.type === 'add') {
        this.subs.sink = this.shared_services.addMembers(post_data)
          .subscribe(() => {
            this.api_success = Messages.MEMBER_CREATED;
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
            error => {
              this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
              this.disableButton = false;
            });
      } else if (this.data.type === 'edit') {
        post_data.userProfile['id'] = this.data.member.user;
        this.subs.sink = this.shared_services.editMember(post_data)
          .subscribe(
            () => {
              this.api_success = Messages.MEMBER_UPDATED;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
              this.disableButton = false;
            }
          );
      }
    } else {
      this.api_error = derror;
      this.disableButton = false;
    }
  }
  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
}
