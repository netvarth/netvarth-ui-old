import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from './../../../../../shared/functions/shared-functions';
import { ActivatedRoute } from '@angular/router';

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

    constructor(
      public fed_service: FormMessageDisplayService,
      public provider_services: ProviderServices,
      public sharedfunctionObj: SharedFunctions,
      private activated_route: ActivatedRoute,
    ){}
    ngOnInit() {
      this.api_loading = false;
    }
  }