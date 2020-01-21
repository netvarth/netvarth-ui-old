import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from './../../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'privacy-detail',
  templateUrl: './privacy-detail.component.html',
})
export class PrivacyDetailComponent implements OnInit {

  priv_settings_cap = Messages.PRIVACY_SETTINGS_HI_CAP;
  phone_no_cap = Messages.PRI_PHONE_NUMBER_CAP;
  phone_label_cap = Messages.PRI_PHONE_LABEL_CAP;
  phone_no_visible_cap = Messages.PRI_THIS_PHONE_VISIBLE_TO_CAP;
  email_id_cap = Messages.EMAIL_CAP;
  email_label_cap = Messages.PRI_EMAIL_LABEL_CAP;
  email_visible_cap = Messages.PRI_MAIL_ID_IS_VISIBLE_TO_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  mobile_cap = Messages.MOBILE_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  bProfile: any = [];
  phone_arr = [{ label: '', number: '', permission: 'all' }];
  extingphone_arr: any = [];
  extingemail_arr: any = [];
  email_arr = [{ label: '', emailid: '', permission: 'all' }];
  phone_json: any = [];
  email_json: any = [];
  curid: number;
  curmod;
  curtype;
  phonelabel = '';
  phonenumber = '';
  phonepermission;
  emaillabel = '';
  emailemailid = '';
  emailpermission;
  disableButton = false;
  api_loading = true;
  privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
  tooltiphone = projectConstants.TOOLTIP_PRIVACYPHONE;
  tooltemail = projectConstants.TOOLTIP_PRIVACYEMAIL;
  customernormal_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  loadData: ArrayBuffer;
  breadcrumbs_init = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Jaldee Online',
      url: '/provider/settings/bprofile'
    },
    {
      title: 'Privacy',
      url: '/provider/settings/bprofile/privacy'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  customer_label: any;
  privacy_id: any;
  action: string;
  data: any;
  edit_ph_id: any;
  edit_mail_id: any;
  constructor(
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private activated_route: ActivatedRoute,
    private router: Router,
    public shared_functions: SharedFunctions,
  ) {
    this.activated_route.queryParams.subscribe(
      (qParams) => {
        this.data = qParams;
      })
    this.provider_services.getBussinessProfile()
      .subscribe(
        profile => {
          this.bProfile = profile;
          this.privacypermissiontxt.customersOnly = this.sharedfunctionObj.removeTerminologyTerm('customer', this.privacypermissiontxt.customersOnly);
          this.curmod = (this.data.editindx >= 0) ? 'edit' : 'add';
          if (this.curmod === 'edit') {
            this.curid = this.data.editindx;
          } else {
            this.curid = -1;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
              breadcrumbs.push(e);
            });
            breadcrumbs.push({
              title: 'Add'
            });
            this.breadcrumbs = breadcrumbs;
          }
          this.curtype = this.data.curtype;
          this.loadData = this.data;
          // extracting the phone numbers and settings it to the required object
          if (this.curtype === 'phone') {
            if (this.curmod === 'add') {
              this.phonepermission = 'all';
            } else {
              this.edit_ph_id = this.bProfile.phoneNumbers[this.curid].instance;
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                title: this.edit_ph_id
              });
              this.breadcrumbs = breadcrumbs;
              this.phonelabel = this.bProfile.phoneNumbers[this.curid].label;
              this.phonenumber = this.bProfile.phoneNumbers[this.curid].instance;
              this.phonepermission = this.bProfile.phoneNumbers[this.curid].permission;
            }
            if (this.bProfile.phoneNumbers) {
              const ph_arr: any = [];
              for (let i = 0; i < this.bProfile.phoneNumbers.length; i++) {
                ph_arr[i] = {
                  label: this.bProfile.phoneNumbers[i].label,
                  number: this.bProfile.phoneNumbers[i].instance,
                  permission: this.bProfile.phoneNumbers[i].permission
                };
              }
              this.extingphone_arr = ph_arr;
            }
          }
          // extracting the email ids and settings it to the required object
          if (this.curtype === 'email') {
            if (this.curmod === 'add') {
              this.emailpermission = 'all';
            } else {
              this.edit_mail_id = this.bProfile.emails[this.curid].instance;
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                title: this.edit_mail_id
              });
              this.breadcrumbs = breadcrumbs;
              this.emaillabel = this.bProfile.emails[this.curid].label;
              this.emailemailid = this.bProfile.emails[this.curid].instance;
              this.emailpermission = this.bProfile.emails[this.curid].permission;
            }
            if (this.bProfile.emails) {
              const em_arr: any = [];
              for (let i = 0; i < this.bProfile.emails.length; i++) {
                em_arr[i] = {
                  label: this.bProfile.emails[i].label,
                  emailid: this.bProfile.emails[i].instance,
                  permission: this.bProfile.emails[i].permission
                };
              }
              this.extingemail_arr = em_arr;
            }
          }
        },
      );
  }
  ngOnInit() {
    this.api_loading = false;
  }
  addPhone() {
    this.phone_arr.push({ label: '', number: '', permission: 'all' });
    this.resetApiErrors();
  }
  removePhone(indx) {
    this.phone_arr.splice(indx, 1);
  }
  addEmail() {
    this.email_arr.push({ label: '', emailid: '', permission: 'all' });
    this.resetApiErrors();
  }
  removeEmail(indx) {
    this.email_arr.splice(indx, 1);
  }
  savePrivacySettings() {
    this.resetApiErrors();
    this.email_json = [];
    this.phone_json = [];
    if (this.curtype === 'phone') { // case of phone numbers
      if (this.phonelabel === '' && this.phonenumber === '') {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PHONEDET, { 'panelClass': 'snackbarerror' });
        return;
      }
      const curlabel = this.phonelabel;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_BLANK);
      const result2 = pattern2.test(curlabel);
      if (result2) {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PRIVACY_PHONELABEL_REQ, { 'panelClass': 'snackbarerror' });// 'Phone label should not be blank';
        return;
      }
      const curphone = this.phonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PRIVACY_PHONE_INVALID, { 'panelClass': 'snackbarerror' });// 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PRIVACY_PHONE_10DIGITS, { 'panelClass': 'snackbarerror' }); // 'Mobile number should have 10 digits';
        return;
      }
      if (this.curid >= 0) { // case of edit
        this.extingphone_arr[this.curid].label = this.phonelabel;
        this.extingphone_arr[this.curid].number = this.phonenumber;
        this.extingphone_arr[this.curid].permission = this.phonepermission;
      } else { // case of add
        this.extingphone_arr.push({
          'label': this.phonelabel,
          'number': this.phonenumber,
          'permission': this.phonepermission
        });
      }
      for (const phone of this.extingphone_arr) {
        this.phone_json.push({
          'label': phone.label,
          'resource': 'Phoneno',
          'instance': phone.number,
          'permission': phone.permission
        });
      }
      if (this.curid < 0 || this.curid !== 0) {
        this.extingphone_arr.pop();
      }
      const post_itemdata = {
        'phoneNumbers': this.phone_json
      };
      this.UpdatePrimaryFields(post_itemdata);
    } else if (this.curtype === 'email') { // case of email ids
      if (this.emaillabel === '' && this.emailemailid === '') {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_EMAILDET, { 'panelClass': 'snackbarerror' });
        return;
      }
      const curlabel = this.emaillabel;
      const pattern1 = new RegExp(projectConstants.VALIDATOR_BLANK);
      const result1 = pattern1.test(curlabel);
      if (result1) {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PRIVACY_EMAILLABEL_REQ, { 'panelClass': 'snackbarerror' }); // 'Email label should not be blank';
        return;
      }
      const curemail = this.emailemailid;
      const pattern = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result = pattern.test(curemail);
      if (!result) {
        this.api_error = this.shared_functions.openSnackBar(Messages.BPROFILE_PRIVACY_EMAIL_INVALID, { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.curid >= 0) { // case of edit
        this.extingemail_arr[this.curid].label = this.emaillabel;
        this.extingemail_arr[this.curid].emailid = this.emailemailid;
        this.extingemail_arr[this.curid].permission = this.emailpermission;
      } else { // case of add
        this.extingemail_arr.push({
          'label': this.emaillabel,
          'emailid': this.emailemailid,
          'permission': this.emailpermission
        });
      }
      for (const email of this.extingemail_arr) {
        this.email_json.push({
          'label': email.label,
          'resource': 'Email',
          'instance': email.emailid,
          'permission': email.permission
        });
      }
      if (this.curid < 0 || this.curid !== 0) {
        this.extingemail_arr.pop();
      }
      const post_itemdata = { 'emails': this.email_json };
      this.UpdatePrimaryFields(post_itemdata);
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  UpdatePrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.updatePrimaryFields(pdata)
      .subscribe(
        data => {
          this.loadData = data;
          this.api_success = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_SAVED'));
          this.router.navigate(['provider', 'settings', 'bprofile', 'privacy']);
        },
        error => {
          this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  onCancel() {
    this.router.navigate(['provider', 'settings', 'bprofile', 'privacy']);
    this.api_loading = false;
  }
  loadDetails() {
    //this.dialogRef.close({ data: this.loadData, message: 'reloadlist' });
  }
  show_privacyText(txt) {
    let rettxt = '';
    if (txt === 'customersOnly') {
      if (this.customernormal_label !== '' && this.customernormal_label !== undefined && this.customernormal_label !== null) {
        rettxt = 'My ' + this.sharedfunctionObj.firstToUpper(this.customernormal_label) + 's Only';
      } else {
        rettxt = 'My ' + this.privacypermissiontxt[txt] + 's Only';
      }
    } else {
      rettxt = this.privacypermissiontxt[txt];
    }
    return rettxt;
  }
}