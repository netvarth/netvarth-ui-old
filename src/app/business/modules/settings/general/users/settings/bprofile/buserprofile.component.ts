import { Component, OnDestroy, OnInit, Inject, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Messages } from '../../../../../../../shared/constants/project-messages';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { projectConstants } from '../../../../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../../shared/functions/shared-functions';
import { MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../../../../shared/services/shared-services';
import { UserBprofileSearchPrimaryComponent } from './user-bprofile-search-primary/user-bprofile-search-primary.component';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout } from 'angular-modal-gallery';
import { ProviderSharedFuctions } from '../../../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { QuestionService } from '../../../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { ProviderUserBprofileSearchDynamicComponent } from './additionalinfo/provider-userbprofile-search-dynamic.component/provider-userbprofile-search-dynamic.component';
import { UserDataStorageService } from '../user-datastorage.service';
import { ProPicPopupComponent } from '../../../../bprofile/pro-pic-popup/pro-pic-popup.component';

@Component({
  selector: 'app-buserprofile',
  templateUrl: './buserprofile.component.html',
  styleUrls: ['../bprofile/additionalinfo/additionalinfo.component.scss']


})

export class BuserProfileComponent implements OnInit, OnDestroy, AfterViewChecked {

  jaldeeonline_on_cap: string;
  jaldeeonline_off_cap: string;
  onlinepresence_status_str: string;
  onlinepresence_status: any;
  notedialogRef: MatDialogRef<ProPicPopupComponent, any>;
  userAdditionalInfoSubDomainFields: any[];
  userAdditionalInfoDomainFields: any[];
  progress_bar_four: number;
  progress_bar_three: number;
  progress_bar_two: number;
  progress_bar_one: number;
  weightageClass = 'danger';
  weightageObjectOfDomainAndSubDomain: any;

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
  profile_strength_cap = Messages.PROFILE_STRENGTH_CAP;
  weightageValue = 0;
  profile_incomplete_cap = Messages.PROFILE_INCOMPLETE_CAP;
  minimally_complete_cap = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
  bprofile_btn_text = 'Complete Your Profile';
  three_quaters_complete_cap = Messages.THREE_QUATERES_COMPLETE_CAP;
  fully_complete_cap = Messages.PROFILE_COMPLETE_CAP;
  social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
  add_social_media = Messages.BPROFILE_ADD_SOCIAL_MEDIA_CAP;
  no_social_media = Messages.NO_SOCIAL_MEDIA;
  subscription: Subscription;
  businessProfile_weightageArray: any[];
  jaldee_online_status_str = '';
  jaldee_online_status;
  domainList: any = [];
  subDomain;
  specialization_arr: any = [];
  special_cap = Messages.BPROFILE_SPECIAL_CAP;
  specialization_title = '';
  specialdialogRef;
  normal_specilization_show = 1;
  normal_language_show = 1;
  languages_arr: any = [];
  langdialogRef;
  social_arr: any = [];
  social_list: any = [];
  showaddsocialmedia = false;
  normal_socialmedia_show = 1;
  orgsocial_list: any = [];
  socialdialogRef;
  userMandatoryfieldArray: any = [];
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  field;
  grid_row_index;
  subDomainId;
  vkeyNameMap = {};
  domain_fields_nonmandatory = [];
  subdomain_fields_nonmandatory = [];
  aboutmefilled = false;
  specializeFilled = false;
  languageFilled = false;
  mediaFilled = false;
  subdomainVirtualFieldFilledStatus: any;
  domainVirtualFieldFilledStatus: any;
  dynamicdialogRef;
  showAddSection = false;
  showAddSection1 = false;
  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  image_remaining_cnt = 0;
  showIncompleteButton = true;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  image_list: any = [];
  image_list_popup: Image[];
  image_showlist: any = [];
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
  normal_profile_active = 1; // [1 - loading] [2 - no info] [3 - info available]
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
  jaldee_acc_url = Messages.JALDEE_URL;
  wndw_path = projectConstants.PATH;
  subdomain: any;




  constructor(private provider_services: ProviderServices,
    private user_datastorage: UserDataStorageService,
    private sharedfunctionobj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    private service: QuestionService,
    private fb: FormBuilder,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    private activated_route: ActivatedRoute,
    public fed_service: FormMessageDisplayService,
    private cdref: ChangeDetectorRef,
    @Inject(DOCUMENT) public document,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UserBprofileSearchPrimaryComponent>,
    private shared_services: SharedServices) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
    }
    );
  }

  ngOnInit() {
    this.user_datastorage.setWeightageArray([]);
    this.jaldeeonline_on_cap = Messages.JALDEEONLINE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.jaldeeonline_off_cap = Messages.JALDEE_ONLINE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_searchh_cap = Messages.FRM_LEVEL_PUBLIC_SEARCHH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_off_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.jaldee_acc_url = Messages.JALDEE_URL.replace('[customer]', this.customer_label);
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;

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
    this.getBusinessConfiguration();
    // this.initSpecializations();
    // this.getSpokenLanguages();
    // this.setLanguages();
    // calling method to create the form
    // setTimeout(() => {
    // this.createForm();
    // }, 500);
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    this.domainList = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
    this.subscription = this.user_datastorage.getWeightageArray().subscribe(result => {
      this.businessProfile_weightageArray = result;
      console.log(JSON.stringify(this.businessProfile_weightageArray));
      this.weightageValue = this.calculateWeightage(result);
    });
  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    if (this.primarydialogRef) {
      this.primarydialogRef.close();
    }
    if (this.specialdialogRef) {
      this.specialdialogRef.close();
    }
    if (this.socialdialogRef) {
      this.socialdialogRef.close();
    }
    if (this.dynamicdialogRef) {
      this.dynamicdialogRef.close();
    }
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        // this.getBusinessProfile();
      },
        () => {

        });
  }
  getUserPublicSearch() {
    this.provider_services.getUserPublicSearch(this.userId)
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
          this.onlinepresence_status_str = (this.public_search === true) ? 'On' : 'Off';
          this.onlinepresence_status = this.public_search;
        },
        () => {
        }
      );
  }
  // if (this.listmyprofile_status) {
  //   e.source.checked = true;
  //   this.sharedfunctionobj.confirmSearchChangeStatus(this, this.listmyprofile_status);
  // } else if (!this.listmyprofile_status) {
  //   e.source.checked = false;
  //   this.handle_searchstatus();
  // }
  confirm_searchStatus(e) {

    if (this.onlinepresence_status) {
      e.source.checked = true;
      this.sharedfunctionobj.confirmSearchChangeStatusOfUser(this, this.onlinepresence_status);
    } else if (!this.onlinepresence_status) {
      e.source.checked = false;
      this.handle_searchstatus();
    }
  }
  handle_searchstatus() {
    const changeTostatus = (this.onlinepresence_status === true) ? 'Disable' : 'Enable';
    this.provider_services.updateUserPublicSearch(this.userId, changeTostatus)
      .subscribe(() => {
        this.onlinepresence_status = !this.onlinepresence_status;
        this.shared_functions.openSnackBar('Jaldee Online ' + changeTostatus + 'd successfully', { ' panelclass': 'snackbarerror' });
        this.getUserPublicSearch();
      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.getUserPublicSearch();
      });
  }
  getBusinessProfile() {
    this.bProfile = [];
    this.aboutmefilled = false;
    this.specializeFilled = false;
    this.languageFilled = false;
    this.mediaFilled = false;
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.userMandatoryfieldArray = [];
    this.reqFields = {};
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          this.bProfile['subDomain'] = this.subDomain;
          if (this.bProfile.businessName) {
            this.domainVirtualFieldFilledStatus = this.user_datastorage.getWeightageObjectOfDomain();
            this.subdomainVirtualFieldFilledStatus = this.user_datastorage.getWeightageObjectOfSubDomain();
            if (this.domainVirtualFieldFilledStatus != null || this.subdomainVirtualFieldFilledStatus != null) {
              if (this.domainVirtualFieldFilledStatus.mandatoryDomain === true || this.subdomainVirtualFieldFilledStatus.mandatorySubDomain === true) {
                if ((this.domainVirtualFieldFilledStatus.mandatoryDomain && this.domainVirtualFieldFilledStatus.mandatoryDomainFilledStatus) || (this.subdomainVirtualFieldFilledStatus.mandatorySubDomain && this.subdomainVirtualFieldFilledStatus.mandatorySubDomainFilledStatus)) {
                  this.aboutmefilled = true;
                } else {
                  this.aboutmefilled = false;
                }
              } else {
                this.aboutmefilled = true;
              }
            } else {
              this.aboutmefilled = true;
            }
            if (this.aboutmefilled && (this.bProfile.specialization && this.bProfile.specialization.length !== 0)) {
              this.showIncompleteButton = false;
            }
          }
          if (this.bProfile.specialization && this.bProfile.specialization.length !== 0) {
            this.specializeFilled = true;
          }

          if (this.bProfile.languagesSpoken && this.bProfile.languagesSpoken.length !== 0) {
            this.languageFilled = true;
          }
          if (this.bProfile.socialMedia && this.bProfile.socialMedia.length !== 0) {
            this.mediaFilled = true;
          }
          this.provider_services.getVirtualFields(this.domain).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.domain, this.subDomain).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getuserProfileRequiredFields(domainfields, subdomainfields);
                  this.userMandatoryfieldArray = this.provider_shared_functions.getUserAdditonalInfoMandatoryFields();
                  this.userAdditionalInfoDomainFields = this.provider_shared_functions.getUserAdditionalNonDomainMandatoryFields();
                  this.userAdditionalInfoSubDomainFields = this.provider_shared_functions.getUserAdditionalNonSubDomainMandatoryFields();
                  this.getDomainVirtualFields();
                  if (this.subDomain) {
                    this.getSubDomainVirtualFields();
                  }
                });
            });

          if (this.bProfile.logo) {
            this.blogo = this.bProfile.logo;
            const cnow = new Date();
            const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
            this.cacheavoider = dd;
            this.user_datastorage.updateProfilePicWeightage(true);
          } else {
            this.user_datastorage.updateProfilePicWeightage(false);
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
          this.showaddsocialmedia = false;
          this.user_datastorage.set('bProfile', this.bProfile);
          this.normal_socialmedia_show = 2;
          this.social_arr = [];
          if (this.bProfile.socialMedia) {
            if (this.bProfile.socialMedia.length > 0) {
              this.normal_socialmedia_show = 3;
              for (let i = 0; i < this.bProfile.socialMedia.length; i++) {
                if (this.bProfile.socialMedia[i].resource !== '') {
                  this.social_arr.push({ 'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
                }
              }
            }
          }
          if (this.social_arr.length < this.orgsocial_list.length) {
            this.showaddsocialmedia = true;
          }
          this.user_datastorage.set('bProfile', this.bProfile);
          this.user_datastorage.setUserBusinessProfileWeightage(this.bProfile);

        },
        () => {
          // this.normal_basicinfo_show = 2;
          this.normal_socialmedia_show = 2;
        }
      );
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getUserBussinessProfile(_this.userId)
        .subscribe(
          data => {
            console.log(data);
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
      .subscribe((data: any) => {
        this.subDomainId = data.subdomain;
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
          title: 'Jaldee Profile'
        });

        this.breadcrumbs = breadcrumbs;

        for (let i = 0; i < this.domainList.bdata.length; i++) {
          if (this.domainList.bdata[i].domain === this.domain) {
            for (let j = 0; j < this.domainList.bdata[i].subDomains.length; j++) {
              if (this.domainList.bdata[i].subDomains[j].id === data.subdomain) {
                this.subDomain = this.domainList.bdata[i].subDomains[j].subDomain;
                this.getBusinessProfile();
              }
            }
          }
        }
      });
  }
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings']);
  }
  checkMandatoryFieldsInResultSet(domainFields, fieldname) {
    let fullyfilledStatus = true;
    domainFields.forEach(function (dom) {
      if (dom.name === fieldname) {
        if (!dom['value'] || (dom.value === undefined || dom.value === null)) {
          fullyfilledStatus = false;
          return;
        }
      }
    });
    return fullyfilledStatus;
  }
  checkAdditionalFieldsFullyFilled(additionalInfoFields, dom_subdom_list) {

    let fullyfilledStatus = true;
    additionalInfoFields.forEach(function (field) {
      if (fullyfilledStatus) {
        if (!dom_subdom_list.some(domobject => domobject.name === field)) {
          fullyfilledStatus = false;
          return;
        } else {
          dom_subdom_list.forEach(function (data_object) {
            if (data_object.name === field) {
              if (!data_object['value'] || (data_object.value === undefined || data_object.value == null)) {
                fullyfilledStatus = false;
                return;
              }
            }
          });
        }
      }
    });

    return fullyfilledStatus;
  }
  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.service.getQuestions(set_data['fields']);
            resolve(set_data);
          },
          () => {
            reject();
          }
        );
    });
  }

  setFieldValue(data, subdomin) {
    let fields = [];
    if (subdomin) {
      fields = (this.bProfile['subDomainVirtualFields'] &&
        this.bProfile['subDomainVirtualFields'][0]) ?
        this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
    } else {
      fields = (this.bProfile['domainVirtualFields']) ?
        this.bProfile['domainVirtualFields'] : [];
    }
    if (fields) {
      for (const i in data) {
        if (data[i]) {
          const row = data[i];
          if (fields[row.name]) {
            data[i]['value'] = fields[row.name];
          } else {
            delete data[i]['value'];
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }

  getFieldQuestion(field_key = null, type = 'domain_questions') {
    const questions = (type === 'subdomain_questions') ? this.subdomain_questions : this.domain_questions;
    if (field_key != null) {
      const field = [];
      for (const que of questions) {
        if (que.key === field_key) {
          field.push(que);
        }
      }
      return field;
    }
  }

  onDomainFormSubmit(post_data) {
    this.provider_services.updateDomainFields(this.userId, post_data)
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  onSubDomainFormSubmit(post_data) {
    this.provider_services.updatesubDomainFields(this.userId, post_data, this.subDomainId)
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        (error) => {
          this.getBusinessProfile(); // refresh data ;
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }


  getDomainVirtualFields() {
    const userWeightageObjectOfDomain: any = {};
    this.getVirtualFields(this.domain)
      .then(
        data => {
          console.log('domain..' + JSON.stringify(data));
          let user_mandatorydomain = false;
          let user_mandatorydomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          this.domain_fields_nonmandatory = this.domain_fields.filter(dom => dom.mandatory === false);
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.userMandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            user_mandatorydomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                user_mandatorydomainFilled = true;
              } else {
                user_mandatorydomainFilled = false;
                return;
              }
            });


          } else {
            user_mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.userAdditionalInfoDomainFields, this.domain_fields)) {
            user_additionalInfoFilledStatus = true;
          }
          userWeightageObjectOfDomain.mandatoryDomain = user_mandatorydomain;
          userWeightageObjectOfDomain.mandatoryDomainFilledStatus = user_mandatorydomainFilled;
          userWeightageObjectOfDomain.additionalDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfDomain(userWeightageObjectOfDomain);



        }
      );

  }

  getSubDomainVirtualFields() {
    const userWeightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.domain,
      this.subDomain).then(
        data => {
          console.log('subdaomin..' + JSON.stringify(data));
          let user_mandatorysubdomain = false;
          let user_mandatorySubDomainFilled = false;
          let user_additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];
          this.domain_fields_nonmandatory = this.domain_fields.filter(dom => dom.mandatory === false);
          this.subdomain_questions = data['questions'] || [];
          if (this.userMandatoryfieldArray.length !== 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            user_mandatorysubdomain = true;
            this.userMandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                user_mandatorySubDomainFilled = true;
              } else {
                user_mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            user_additionalInfoFilledStatus = true;
          }

          userWeightageObjectOfSubDomain.mandatorySubDomain = user_mandatorysubdomain;
          userWeightageObjectOfSubDomain.mandatorySubDomainFilledStatus = user_mandatorySubDomainFilled;
          userWeightageObjectOfSubDomain.additionalSubDomainFullyFilled = user_additionalInfoFilledStatus;
          this.user_datastorage.setWeightageObjectOfSubDomain(userWeightageObjectOfSubDomain);
          this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;

          for (let fdIndex = 0; fdIndex < this.subdomain_fields.length; fdIndex++) {
            // tslint:disable-next-line:no-unused-expression
            if (this.subdomain_fields[fdIndex]['dataType'] === 'DataGrid') {
              for (let colIndex = 0; colIndex < this.subdomain_fields[fdIndex]['Columns'].length; colIndex++) {
                if (this.subdomain_fields[fdIndex]['Columns'][colIndex]['type'] === 'Enum') {
                  for (let enumIndex = 0; enumIndex < this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'].length; enumIndex++) {
                    this.vkeyNameMap[this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['name']] = this.subdomain_fields[fdIndex]['Columns'][colIndex]['enumeratedConstants'][enumIndex]['displayName'];
                  }
                }
              }
            }
          }
          this.user_datastorage.updateMandatoryAndAdditionalFieldWeightage();

        }
      );
  }

  addDynamicField(field, type) {
    if (field.dataType === 'DataGrid') {
      this.editGridDynamicField(field.name, type, null);
    } else {
      this.editDynamicField(field.name, type);
    }
  }
  editGridDynamicField(field_name, type, index = 0) {
    const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
    if (index !== null) {
      const column = field[0]['columns'][index] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);
      const selected_row = field[0]['value'][index] || [];
      field[0]['value'] = [];
      field[0]['value'].push(selected_row);
    } else {
      const column = field[0]['columns'][0] || [];
      field[0]['columns'] = [];
      field[0]['columns'].push(column);
      column.map((e) => { delete e.value; });
    }
    this.showDynamicFieldPopup(field, type, index);
  }
  editDynamicField(field_name, type) {
    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);
  }
  showDynamicFieldPopup(field, type, grid_row_index = null) {
    this.dynamicdialogRef = this.dialog.open(ProviderUserBprofileSearchDynamicComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: type,
        questions: field,
        bProfile: this.bProfile,
        grid_row_index: grid_row_index,
        userId: this.userId,
        subDomainId: this.subDomainId,
        subdomain: this.subDomain
      }
    });
    this.dynamicdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBussinessProfileApi()
            .then(
              data => {
                this.bProfile = data;
                if (type === 'domain_questions') {
                  this.getDomainVirtualFields();
                } else {
                  this.getSubDomainVirtualFields();
                }
              },
              () => {

              }
            );
        }
      }
    });
  }
  deleteGridDynamicField(field_name, type = 'domain_questions', index = 0) {
    const pre_value = (type === 'domain_questions') ? JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
      JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subDomain]));
    const grid_list = pre_value[field_name] || [];
    if (grid_list.length === 1 && index === 0) {
      delete pre_value[field_name];
    } else {
      grid_list.splice(index, 1);
      pre_value[field_name] = grid_list;
    }
    if (type === 'domain_questions') {
      this.onDomainFormSubmit(pre_value);
    } else if (type === 'subdomain_questions') {
      this.onSubDomainFormSubmit(pre_value);
    }
  }

  getdispVal(typ, field) {
    let retfield = '';
    let passArray = [];
    if (typ === 'domain') {
      passArray = this.domain_fields;
    } else if (typ === 'subdomain') {
      passArray = this.subdomain_fields;
    }
    let str = '';
    if (field.value !== undefined) {
      if (field.dataType === 'Enum') {
        retfield = this.getFieldDetails(passArray, field.value, field.name);
      } else if (field.dataType === 'EnumList') {
        for (let i = 0; i < field.value.length; i++) {
          if (str !== '') {
            str += ', ';
          }
          str += this.getFieldDetails(passArray, field.value[i], field.name);
        }
        retfield = str;
      } else {
        retfield = field.value;
      }
    }
    return retfield;
  }
  getFieldDetails(passedArray, fieldvalue, fieldname) {
    let retfield;
    if (fieldvalue !== undefined) {
      for (let i = 0; i < passedArray.length; i++) {
        if (fieldname === passedArray[i].name) {
          for (let j = 0; j < passedArray[i].enumeratedConstants.length; j++) {
            if (fieldvalue === passedArray[i].enumeratedConstants[j].name) {
              retfield = passedArray[i].enumeratedConstants[j].displayName;
            }
          }
        }
      }
    }
    return retfield;
  }
  showValueswithComma(fld) {
    let str = '';
    if (fld.value !== undefined) {
      for (let i = 0; i < fld.value.length; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += this.sharedfunctionobj.firstToUpper(fld.value[i]);
      }
      return str;
    }
  }

  getBusinessProfileWeightageText() {
    let businessProfileWeightageText = '';
    const weightage = this.weightageValue;
    if (weightage <= 25) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'danger';
      this.progress_bar_one = weightage;
      this.progress_bar_two = 0;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;

    }
    if (weightage > 25 && weightage < 50) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one = 25;
      this.progress_bar_two = weightage - 25;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;
    } else if
    (weightage >= 50 && weightage < 75) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = weightage - 50;
      this.progress_bar_four = 0;
      return businessProfileWeightageText;

    } else if (weightage >= 75 && weightage < 100) {
      businessProfileWeightageText = Messages.GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'primary';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = weightage - 75;
      return businessProfileWeightageText;
    } else if (weightage === 100) {
      businessProfileWeightageText = Messages.VERY_GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_MANAGE_YOUR_PROFILE;
      this.weightageClass = 'success';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = 25;
      return businessProfileWeightageText;

    }

  }
  calculateWeightage(data) {
    let total = 0;
    if (data != null && data.length > 0) {
      data.forEach(x => total += x.value);
    }
    return total;

  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }




  showPasscode() {
    this.show_passcode = !this.show_passcode;
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
  }
  gotoAboutMe() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'bprofile', 'aboutme']);
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
