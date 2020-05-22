import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Messages } from '../../../../../../../shared/constants/project-messages';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { projectConstants } from '../../../../../../../shared/constants/project-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../shared/functions/shared-functions';
import { MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../../../../shared/services/shared-services';
import { UserBprofileSearchPrimaryComponent } from './user-bprofile-search-primary/user-bprofile-search-primary.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-buserprofile',
  templateUrl: './buserprofile.component.html'
})

export class BuserProfileComponent implements OnInit, OnDestroy {
  you_have_cap = Messages.YOU_HAVE_CAP;
  more_cap = Messages.MORE_CAP;
  add_cap = Messages.ADD_BTN;
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  click_here_cap = Messages.CLICK_HERE_CAP;
  sorry_cap = Messages.SORRY_CAP;
  your_proflie_cap = Messages.BPROFILE_PROFILE_CAP;
  disabled_Cap = Messages.BPROFILE_DISABLED_CAP;
  not_visible_cap = Messages.BPROFILE_ONLINE_VISIBLE_CAP;
  set_up_cap = Messages.BPROFILE_SET_UP_CAP;
  profile_summary_cap = Messages.BPROFILE_SUMMARY_CAP;
  public_search_cap = Messages.BPROFILE_PUBLIC_SEARCH_CAP;
  current_status_cap = Messages.BPROFILE_CURRENT_STATUS;
  on_cap = Messages.BPROFILE_ON_CAP;
  off_cap = Messages.BPROFILE_OFF_CAP;
  profile_visible_cap = Messages.BPROFILE_VISIBILITY_CAP;
  online_jaldee_cap = Messages.BPROFILE_ONLINE_JALDEE_CAP;
  offline_cap = Messages.BPROFILE_OFFLINE_CAP;
  turn_off_cap = Messages.BPROFILE_TURN_OFF;
  turn_on_cap = Messages.BPROFILE_TURN_ON;
  have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  basic_info_cap = Messages.BPROFILE_BASIC_INFORMATION_CAP;
  such_as_cap = Messages.BPROFILE_SUCH_AS_CAP;
  name_summary_cap = Messages.BPROFILE_BUSINESS_NAME_CAP;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  change_cap = Messages.BPROFILE_CHANGE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  delete_pic = Messages.BPROFILE_DELETE_PICTURE_CAP;
  info_cap = Messages.BPROFILE_INFORMATION_CAP;
  please_use_cap = Messages.BPROFILE_PLEASE_CAP;
  btn_to_compl_cap = Messages.BPROFILE_BUTTON_COMPLETE_CAP;
  pin_cap = Messages.BPROFILE_PIN_CAP;
  more_loc_cap = Messages.BPROFILE_MORE_LOCATIONS_CAP;
  locations_cap = Messages.BPROFILE_LOCATIONS_CAP;
  page_cap = Messages.BPROFILE_PAGE_CAP;
  can_change_hours = Messages.BPROFILE_CHANGE_WORKING_HOURS_CAP;
  visible_cap = Messages.BPROFILE_VISIBLE_CAP;
  add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  description_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  to_turn_search = Messages.BPROFILE_TURN_ON_PUBLIC_SEARCH;
  frm_public_search_cap = '';
  frm_public_searchh_cap = '';
  frm_public_search_off_cap = '';
  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;
  error_msg = '';
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };
  blogo: any = [];
  item_pic = {
    files: [],
    base64: null
  };
  selitem_pic = '';
  profimg_exists = false;
  badgeIcons: any = [];
  badgeArray: any = [];
  show_passcode = false;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  breadcrumb_moreoptions: any = [];
  normal_profile_active = 1;  // [1 - loading]  [2 - no info] [3 - info available]
  normal_basicinfo_show = 1;
  loadingParams: any = { 'diameter': 40, 'strokewidth': 15 };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-trash-o',
        type: ButtonType.DELETE,
        ariaLabel: 'custom plus aria label',
        title: 'Delete',
        fontSize: '20px'
      },
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  breadcrumbs_init = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: Messages.GENERALSETTINGS,
      url: '/provider/settings/general'
  },
    {
      url: '/provider/settings/general/users',
      title: 'Users'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  businessConfig: any = [];
  customer_label = '';
  maintooltip = this.sharedfunctionobj.getProjectMesssages('BPROFILE_TOOPTIP');
  primarydialogRef;
  cacheavoider = '';
  frm_additional_cap = '';
  frm_gallery_cap = '';
  frm_social_cap = '';
  frm_profile_name_cap = Messages.FRM_LEVEL_PROFILE_NAME_CAP;
  isCheckin;
  success_error = null;
  error_list = [];
  editMode = 3;
  active_user;
  frm_lang_cap = '';
  domain;
  userId: any;
  showProfile = false;
  select_subdomain_cap;
  profile_name_summary_cap = Messages.SEARCH_PRI_PROF_NAME_SUMMARY_CAP;
  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  show_schedule_selection = false;
  // bProfile: any = [];
  formfields;
  disabled_field = false;
  prov_curstatus = '';
  disableButton = false;
  subDomains: any = [];
  user_arr;
  normal_search_active = false;

  constructor(private provider_services: ProviderServices,
    private sharedfunctionobj: SharedFunctions,
    private fb: FormBuilder,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    private activated_route: ActivatedRoute,
    public fed_service: FormMessageDisplayService,
    @Inject(DOCUMENT) public document,
    public dialogRef: MatDialogRef<UserBprofileSearchPrimaryComponent>,
    private shared_services: SharedServices) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
    }
    );
  }

  ngOnInit() {
    this.frm_public_search_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_searchh_cap = Messages.FRM_LEVEL_PUBLIC_SEARCHH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_off_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    this.getBusinessConfiguration();
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: 'Settings',
      url: '/provider/settings/general/users/' + this.userId + '/settings'
    });
    this.breadcrumbs = breadcrumbs;
    this.getUser();
    this.getUserPublicSearch();
    // calling method to create the form
    // setTimeout(() => {
    //   this.createForm();
    // }, 500);
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
  }
  ngOnDestroy() {
    if (this.primarydialogRef) {
      this.primarydialogRef.close();
    }
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBusinessProfile();
      },
        () => {

        });
  }
  getUserPublicSearch() {
    this.provider_services.getUserPublicSearch(this.userId)
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
          this.normal_search_active = this.public_search;
        },
        () => {
        }
      );
  }
  confirm_searchStatus() {
    if (this.normal_search_active) {
      this.sharedfunctionobj.confirmSearchChangeStatus(this, this.normal_search_active);
    } else {
      this.handle_searchstatus();
    }
  }
  handle_searchstatus() {
    const changeTostatus = (this.normal_search_active === true) ? 'Disable' : 'Enable';
    this.provider_services.updateUserPublicSearch(this.userId, changeTostatus)
      .subscribe(() => {
        this.getUserPublicSearch();
      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getBusinessProfile() {
    this.bProfile = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          if (this.bProfile.logo) {
            this.blogo = this.bProfile.logo;
            const cnow = new Date();
            const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
            this.cacheavoider = dd;
          }
          if (this.bProfile.status === 'ACTIVE') {
            this.normal_profile_active = 3;
          } else {
            this.normal_profile_active = 2;
          }
          // check whether normal business profile section can be displayed
          if ((this.bProfile.businessName !== '' && this.bProfile.businessName !== undefined)
            || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined)) {
            // this.getProviderLogo();
            this.normal_basicinfo_show = 3;
          } else {
            this.normal_basicinfo_show = 2;
          }
        },
        () => {
          this.normal_basicinfo_show = 2;
        }
      );
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getUserBussinessProfile(_this.userId)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }

  createForm() {
    this.formfields = {
      bname: [{ value: '' }, Validators.compose([Validators.required])],
      bdesc: [{ value: '' }]
    };
    this.amForm = this.fb.group(this.formfields);
    if (this.bProfile) {
      this.updateForm();
    }
  }
  onItemSelect(a) {
  }
  updateForm() {
    this.amForm.setValue({
      'bname': this.bProfile.businessName || '',
      'bdesc': this.bProfile.businessDesc || ''
    });
  }
  // resets the error messages holders
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  getUser() {
    this.provider_services.getUser(this.userId)
      .subscribe(data => {
        this.user_arr = data;
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
          breadcrumbs.push(e);
        });
        breadcrumbs.push({
          title: this.user_arr.firstName,
          url: '/provider/settings/general/users/add?type=edit&val=' + this.userId,
        });
        breadcrumbs.push({
            title: 'Settings',
            url: '/provider/settings/general/users/' + this.userId + '/settings'
          });
        breadcrumbs.push({
          title: 'Online Profile'
        });

        this.breadcrumbs = breadcrumbs;
      });
  }

  // Method to handle the add / edit for bprofile
  onSubmit(form_data) {
    const blankpatterm = projectConstants.VALIDATOR_BLANK;
    form_data.bname = form_data.bname.trim();
    if (blankpatterm.test(form_data.bname)) {
      this.api_error = 'Please enter the business name';
      this.document.getElementById('bname').focus();
      return;
    }
    if (form_data.bdesc) {
      form_data.bdesc = form_data.bdesc.trim();
    }
    if (form_data.bname.length > projectConstants.BUSINESS_NAME_MAX_LENGTH) {
      this.api_error = this.sharedfunctionobj.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
    } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
      this.api_error = this.sharedfunctionobj.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
    } else {
      const post_itemdata = {
        'businessName': form_data.bname,
        'businessDesc': form_data.bdesc
      };
      if (this.user_arr.userType === 'PROVIDER') {
        post_itemdata['userSubdomain'] = this.user_arr.subdomain;
      }
      // calling the method to update the primarty fields in bProfile edit page
      if (this.bProfile.length === 0) {
        this.createPrimaryFields(post_itemdata);
      } else {
        this.updatePrimaryFields(post_itemdata);
      }
    }
  }
  // updating the primary field from the bprofile edit page
  createPrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.patchUserbProfile(pdata, this.userId)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionobj.getProjectMesssages('BPROFILE_CREATED');
          this.sharedfunctionobj.openSnackBar(this.api_success, { 'panelclass': 'snackbarerror' });
          this.showProfile = false;
          // this.profileview = true;
          this.getBusinessProfile();
        },
        error => {
          this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
          this.sharedfunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }

  updatePrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_services.createUserbProfile(pdata, this.userId)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionobj.getProjectMesssages('BPROFILE_UPDATED');
          this.sharedfunctionobj.openSnackBar(this.api_success, { 'panelclass': 'snackbarerror' });
          this.showProfile = false;
          // this.profileview = true;
          this.getBusinessProfile();
        },
        error => {
          this.api_error = this.sharedfunctionobj.getProjectErrorMesssages(error);
          this.sharedfunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        }
      );
  }
  showBPrimary() {
    this.showProfile = true;
    this.disableButton = false;
    // this.profileview = false;
    this.createForm();
  }
  cancel() {
    this.showProfile = false;
    // this.profileview = true;
  }
  // handles the image display on load and on change
  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
    this.error_msg = '';
    if (input.files && input.files[0]) {
      for (const file of input.files) {
        this.success_error = this.sharedfunctionobj.imageValidation(file);
        if (this.success_error === true) {
          const reader = new FileReader();
          this.item_pic.files = input.files[0];
          this.selitem_pic = input.files[0];
          const fileobj = input.files[0];
          reader.onload = (e) => {
            this.item_pic.base64 = e.target['result'];
          };
          reader.readAsDataURL(fileobj);
          if (this.user_arr.status === 'ACTIVE' || this.user_arr.status === 'INACTIVE') { // case now in bprofile edit page
            // generating the data to be submitted to change the logo
            const submit_data: FormData = new FormData();
            submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
            const propertiesDet = {
              'caption': 'Logo'
            };
            const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
            submit_data.append('properties', blobPropdata);
            this.uploadLogo(submit_data);
          }
        } else {
          this.error_list.push(this.success_error);
          if (this.error_list[0].type) {
            this.error_msg = 'Selected image type not supported';
          } else if (this.error_list[0].size) {
            this.error_msg = 'Please upload images with size less than 15mb';
          }
          // this.error_msg = 'Please upload images with size < 5mb';
          this.sharedfunctionobj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
        }
      }
    }
  }
  // Upload logo
  uploadLogo(passdata) {
    // this.provider_services.uploadLogo(passdata)
    this.provider_services.uploaduserLogo(passdata, this.userId)
      .subscribe(
        data => {
          // this.getProviderLogo();
          this.blogo = [];
          this.blogo[0] = data;
          // calling function which saves the business related details to show in the header
          const today = new Date();
          const tday = today.toString().replace(/\s/g, '');
          const blogo = this.blogo[0].url + '?' + tday;
          const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
            || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', blogo || '');
          const pdata = { 'ttype': 'updateuserdetails' };
          this.sharedfunctionobj.sendMessage(pdata);
          /// this.api_success = Messages.BPROFILE_LOGOUPLOADED;
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.api_error = error.error;
        }
      );
  }

  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.item_pic.base64) {
      this.profimg_exists = true;
      return this.item_pic.base64;
    } else {
      if (this.blogo[0]) {
        this.profimg_exists = true;
        const today = new Date();
        // logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
        logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }
  }
  confirmLogoremove(keyname) {
    this.sharedfunctionobj.confirmLogoImageDelete(this, keyname);
  }
  removeLogo(keyname) {
    this.provider_services.deleteLogo(keyname)
      .subscribe(() => {
        // calling function which saves the business related details to show in the header
        this.blogo = [];
        this.profimg_exists = false;
        const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
        this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
          || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '', true);
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedfunctionobj.sendMessage(pdata);
      },
        () => {

        });
  }
  showPasscode() {
    this.show_passcode = !this.show_passcode;
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
  }
  specializations() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile', 'specializations']);
  }
  additionalInfo() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile', 'additionalinfo']);
  }
  languagesKnown() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile', 'languages']);
  }
  galerySocialmedia() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile', 'media']);
  }
}
