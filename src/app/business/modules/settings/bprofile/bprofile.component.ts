import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { projectConstants } from '../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { MatDialog } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { AddProviderWaitlistLocationsComponent } from '../../../../ynw_provider/components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { Subscription } from 'rxjs';
import { QuestionService } from '../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { ProviderBprofileSearchDynamicComponent } from '../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { QRCodeGeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';

@Component({
  selector: 'app-bprofile',
  templateUrl: './bprofile.component.html',
  styleUrls: ['../bprofile/additionalinfo/additionalinfo.component.scss']
})


export class BProfileComponent implements OnInit,  AfterViewChecked {

  listmyprofile_status: boolean;
  onlinepresence_status_str: string;
  subdomainVirtualFieldFilledStatus: any;
  domainVirtualFieldFilledStatus: any;
  showIncompleteButton = true;

  domain_fields_nonmandatory: any;
  subdomain_fields_nonmandatory: any[];
  logoExist = false;
  jaldee_online_disabled_msg: string;
  jaldee_online_enabled_msg: string;
  progress_bar_four: number;
  progress_bar_three: number;
  progress_bar_two: number;
  progress_bar_one: number;
  weightageClass = 'danger';
  weightageObjectOfDomainAndSubDomain: any;
  vkeyNameMap = {};
  profile_status;

  jaldee_online_status;
  // social media and gallery

  frm_social_cap = '';
  frm_gallery_cap = '';
  error_msg = '';
  socialdialogRef;
  gallerydialogRef;
  delgaldialogRef;
  social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
  add_social_media = Messages.BPROFILE_ADD_SOCIAL_MEDIA_CAP;
  no_social_media = Messages.NO_SOCIAL_MEDIA;
  gallery_cap = Messages.GALLERY_CAP;
  photos_to_cap = Messages.BPROFILE_PHOTOS_CAP;
  photo_cap = Messages.BPROFILE_PHOT0_CAP;
  have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  orgsocial_list: any = [];
  social_arr: any = [];
  social_list: any = [];
  showaddsocialmedia = false;
  normal_gallery_show = 1;
  normal_socialmedia_show = 1;
  customer_label = '';
  error_list = [];
  // image_list: any = [];
  // image_list_popup: Image[];
  image_showlist: any = [];

  item_pic = {
    files: [],
    base64: null
  };
  profimg_exists = false;
  success_error = null;
  selitem_pic = '';
  image_remaining_cnt = 0;

  // languages
  languages_arr: any = [];
  langdialogRef;
  frm_lang_cap = '';
  normal_language_show = 1;
  // virtual fields


  dynamicdialogRef: any;

  subdomain: any;
  weightageValue = 0;
  businessweightageArray: any[];
  you_have_cap = Messages.YOU_HAVE_CAP;
  more_cap = Messages.MORE_CAP;
  add_cap = Messages.ADD_BTN;
  location_cap = Messages.LOCATION_CAP;
  working_hours_cap = Messages.WORKING_HRS_CAP;
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  click_here_cap = Messages.CLICK_HERE_CAP;
  sorry_cap = Messages.SORRY_CAP;
  public_search_cap = Messages.BPROFILE_PUBLIC_SEARCH_CAP;
  your_proflie_cap = Messages.BPROFILE_PROFILE_CAP;
  disabled_Cap = Messages.BPROFILE_DISABLED_CAP;
  not_visible_cap = Messages.BPROFILE_ONLINE_VISIBLE_CAP;
  set_up_cap = Messages.BPROFILE_SET_UP_CAP;
  profile_summary_cap = Messages.BPROFILE_SUMMARY_CAP;
  on_search_cap = Messages.BPROFILE_ON_pUBLIC_SEARCH;
  current_status_cap = Messages.BPROFILE_CURRENT_STATUS;
  on_cap = Messages.BPROFILE_ON_CAP;
  off_cap = Messages.BPROFILE_OFF_CAP;
  profile_visible_cap = Messages.BPROFILE_VISIBILITY_CAP;
  online_jaldee_cap = Messages.BPROFILE_ONLINE_JALDEE_CAP;
  offline_cap = Messages.BPROFILE_OFFLINE_CAP;
  turn_off_cap = Messages.BPROFILE_TURN_OFF;
  turn_on_cap = Messages.BPROFILE_TURN_ON;
  adowrds_cap = Messages.BPROFILE_ADWORDS_CAP;
  buy_adowrds_cap = Messages.BPROFILE_BUY_ADWORDS_CAP;
  buy_adowrds_btn = Messages.BPROFILE_BUY_ADWORD_BTN;
  create_adword_cap = Messages.BPROFILE_CREATE_ADWORD_CAP;
  more_adword_cap = Messages.BPROFILE_MOR_ADOWRDS_CAP;
  license_cap = Messages.BPROFILE_LICENSE_INVOICE_CAP;
  // have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  basic_info_cap = Messages.BPROFILE_BASIC_INFORMATION_CAP;
  such_as_cap = Messages.BPROFILE_SUCH_AS_CAP;
  name_summary_cap = Messages.BPROFILE_BUSINESS_NAME_CAP;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  // add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  to_turn_search = Messages.BPROFILE_TURN_ON_PUBLIC_SEARCH;
  change_cap = Messages.BPROFILE_CHANGE_CAP;
  pic_cap = Messages.BPROFILE_PICTURE_CAP;
  delete_pic = Messages.BPROFILE_DELETE_PICTURE_CAP;
  info_cap = Messages.BPROFILE_INFORMATION_CAP;
  need_loc_cap = Messages.BPROFILE_NEED_LOCATION_CAP;
  work_to_turn_search = Messages.BPROFILE_WORK_HOURS_SEARCH_CAP;
  base_loc_det_cap = Messages.BPROFILE_BASE_LOCATION;
  please_use_cap = Messages.BPROFILE_PLEASE_CAP;
  btn_to_compl_cap = Messages.BPROFILE_BUTTON_COMPLETE_CAP;
  pin_cap = Messages.BPROFILE_PIN_CAP;
  more_loc_cap = Messages.BPROFILE_MORE_LOCATIONS_CAP;
  locations_cap = Messages.BPROFILE_LOCATIONS_CAP;
  page_cap = Messages.BPROFILE_PAGE_CAP;
  long_cap = Messages.BPROFILE_LONGITUDE_CAP;
  lat_cap = Messages.BPROFILE_LATIITUDE_CAP;
  loc_amenities_cap = Messages.BPROFILE_LOCATION_AMENITIES;
  can_change_hours = Messages.BPROFILE_CHANGE_WORKING_HOURS_CAP;
  view_time_wind_cap = Messages.BPROFILE_VIEW_SERVICE_WINDOW_CAP;
  visible_cap = Messages.BPROFILE_VISIBLE_CAP;
  add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  description_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  adword_maxcount = Messages.ADWORD_MAXCOUNT;
  verified_level_change = Messages.VERIFIED_LEVEL_CHANGE;
  verified_level_basic = Messages.VERIFIED_LEVEL_BASIC;
  verified_level_basicplus = Messages.VERIFIED_LEVEL_BASICPLUS;
  verified_level_premium = Messages.VERIFIED_LEVEL_PREMIUM;
  custm_id = Messages.CUSTM_ID;
  jaldee_acc_url = Messages.JALDEE_URL;
  progress_loading_url = false;
  profile_incomplete_cap = Messages.PROFILE_INCOMPLETE_CAP;
  loading = true;
  // jaldee_turn_on_cap=Messages.JALDEEE_TURN_ON_CAP;
  // jaldee_turn_ff_cap=Messages.JALDEE_TURN_OFF_CAP;
  // path = window.location.host + ;
  wndw_path = projectConstants.PATH;
  // @ViewChildren('qrCodeParent') qrCodeParent: ElementRef;
  // private qrCodeParent: ElementRef;
  notedialogRef: any;
  // @ViewChild('qrCodeOnlineId', { static: false, read: ElementRef }) set content1(content1: ElementRef) {
  //   if (content1) { // initially setter gets called with undefined
  //     this.qrCodeParent = content1;
  //   }
  // }
  // private qrCodeCustId: ElementRef;
  // @ViewChild('qrCodeCustId', { static: false }) set content2(content2: ElementRef) {
  //   if (content2) { // initially setter gets called with undefined
  //     this.qrCodeParent = content2;
  //   }
  // }
  mandatoryfieldArray: any = [];

  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;
  // error_msg = '';

  loc_badges: any = [];
  badge_map_arr: any = [];
  loc_list: any = [];
  mapurl;
  qr_code_cId = false;
  qr_code_oId = false;
  qr_value;
  base_loc: any = [];

  schedule_arr: any = [];
  display_schedule: any = [];
  reqFields: any = {
    name: false,
    location: false,
    schedule: false,
    domainvirtual: false,
    subdomainvirtual: false,
    specialization: false
  };


  currentlicense_details: any = [];

  blogo: any = [];
  // item_pic = {
  //   files: [],
  //   base64: null
  // };
  // selitem_pic = '';
  // profimg_exists = false;
  badgeIcons: any = [];
  badgeArray: any = [];

  adword_list: any = [];
  license_metadata: any = [];
  adwordsmaxcount = 0;
  license_details: any = [];
  adwords_maxremaining = 0;
  adwords_remaining = 0;
  adwordshow_list: any = [];
  tooltipcls = projectConstants.TOOLTIP_CLS;
  breadcrumb_moreoptions: any = [];
  normal_adworkds_active = false;
  normal_search_display = false;
  normal_search_active = false;
  normal_profile_active = 1;  // [1 - loading]  [2 - no info] [3 - info available]
  normal_basicinfo_show = 1;
  normal_locationinfo_show = 1;
  normal_locationamenities_show = 1;
  normal_customid_show = 1;
  qrCodePath: string;
  elementType: 'url' | 'canvas' | 'img' = 'url';
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
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'My Account'
    }
  ];
  businessConfig: any = [];
  multipeLocationAllowed = false;
  // customer_label = '';
  maintooltip = this.sharedfunctionobj.getProjectMesssages('BPROFILE_TOOPTIP');
  primarydialogRef;
  loceditdialogRef;
  addlocdialogRef;
  scheduledialogRef;
  adworddialogRef;
  cacheavoider = '';
  frm_public_search_cap = '';
  frm_public_searchh_cap = '';
  frm_public_search_off_cap = '';
  frm_bpublic_search_cap = '';
  frm_bpublic_search_off_cap = '';
  frm_adword_cap = '';
  frm_loc_amen_cap = '';
  frm_additional_cap = '';
  // frm_gallery_cap = '';
  // frm_social_cap = '';
  frm_profile_name_cap = Messages.FRM_LEVEL_PROFILE_NAME_CAP;
  frm_privacy_cap = Messages.FRM_LEVEL_PRIVACY_MSG;
  frm_specialization_cap = Messages.FRM_LEVEL_SPEC_MSG;
  frm_loc_cap = Messages.FRM_LEVEL_LOC_MSG;
  frm_working_hr_cap = Messages.FRM_LEVEL_WORKING_MSG;
  frm_verified_cap = Messages.FRM_LEVEL_VERI_MSG;
  verified_level = Messages.VERIFIED_LEVEL;
  loca_hours = Messages.LOCATION_HOURS_CAP;
  isCheckin;
  qrdialogRef: any;
  editMode = 3;
  customForm: FormGroup;
  custId;
  active_user;
  // frm_lang_cap = '';
  current_license;
  domain;
  showCustomId = false;
  licenseMetadata: any = [];
  licenseMetrics: any = [];
  parkingType: any;
  park_type: any;
  @ViewChild('logofile', { static: false }) myInputVariable: ElementRef;
  show_passcode = false;
  onlinepresence_status = false;
  onlinepresence_statusstr = '';
  is_customized = false;
  licence_warn = false;
  adword_loading = true;
  subscription: Subscription;
  bprofile_btn_text = 'Complete Your Profile';
  profile_status_str = '';
  jaldee_online_status_str = '';
  // mandatory fields
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  field;
  grid_row_index;
  profile_enabled_msg: string;
  profile_disabled_msg: string;
  showAddSection = false;
  showAddSection1 = false;
  businessProfile_show = 1;

  // specilization


  specialization_arr: any = [];
  special_cap = Messages.BPROFILE_SPECIAL_CAP;
  specialization_title = '';
  specialdialogRef;
  normal_specilization_show = 1;
  image_list: any = [];
  user_accountType;
  aboutmefilled = false;
  locationFilled = false;
  specializeFilled = false;
  languageFilled = false;
  galryFilled = false;
  mediaFilled = false;
  contactInfoPhFilled = false;
  contactInfoMailFilled = false;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private sharedfunctionobj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public fed_service: FormMessageDisplayService,
    private shared_services: SharedServices,
    private qservice: QuestionService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.provider_datastorage.setWeightageArray([]);
    // this.shared_functions.getMessage().subscribe(data => {
    //   this.getLicensemetrics();
    //   switch (data.ttype) {
    //     case 'upgradelicence':
    //       this.getLicensemetrics();
    //       break;
    //   }
    // });
  }



  ngOnInit() {

    this.custm_id = Messages.CUSTM_ID.replace('[customer]', this.customer_label);
    this.jaldee_acc_url = Messages.JALDEE_URL.replace('[customer]', this.customer_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_enabled_msg = Messages.JALDEE_ONLINE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_disabled_msg = Messages.JALDEE_ONLINE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    this.profile_enabled_msg = Messages.PROFILE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.profile_disabled_msg = Messages.PROFILE_DISABLED_MSG.replace('[customer]', this.customer_label);

    this.getBusinessConfiguration();
    this.getPublicSearch();
    this.getJaldeeIntegrationSettings();

    this.getGalleryImages();


    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.user_accountType = user.accountType;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.customForm = this.fb.group({
      // customid: ['', Validators.compose([Validators.required])]
      customid: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_ALPHANUMERIC_HYPHEN)])]
    });

    this.frm_public_search_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_searchh_cap = Messages.FRM_LEVEL_PUBLIC_SEARCHH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_off_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_bpublic_search_cap = Messages.FRM_LEVEL_BPUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_bpublic_search_off_cap = Messages.FRM_LEVEL_BPUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
    this.frm_adword_cap = Messages.FRM_LEVEL_ADWORDS_MSG.replace('[customer]', this.customer_label);
    this.frm_loc_amen_cap = Messages.FRM_LEVEL_LOC_AMENITIES_MSG.replace('[customer]', this.customer_label);
    this.subscription = this.provider_datastorage.getWeightageArray().subscribe(result => {
      this.businessProfile_show = 1;
      this.businessweightageArray = result;
      console.log(JSON.stringify(this.businessweightageArray));

      if (this.businessweightageArray.length !== 0) {
        this.weightageValue = this.calculateWeightage(result);


        // if(this.checkAllRequiredFiedsOfJaldeeOnlineFilled()){
        //   if(this.mandatoryfieldArray.length!==0){
        //     this.changeJaldeeOnlineStatus(this.checkMandatoryFieldsAlsoFilled());
        //   }
        //   else{
        //     this.changeJaldeeOnlineStatus(true);
        //   }
        // }else{
        //   this.changeJaldeeOnlineStatus(false);
        // }
      } else {
        this.weightageValue = 0;
        this.businessProfile_show = -1;
      }


    });





  }
  checkMandatoryFieldsAlsoFilled() {
    return this.businessweightageArray.includes(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
  }
  checkAllRequiredFiedsOfJaldeeOnlineFilled() {
    const weightageArray = this.businessweightageArray.map(obj => obj.name);
    return projectConstantsLocal.REQUIRED_FIELDS_JALDEE_ONLINE.every(function (val) {
      return weightageArray.includes(val);
    });

  }


  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
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

  getBusinessProfileWeightageText() {
    let businessProfileWeightageText = '';
    const weightage = this.weightageValue;
    if (weightage <= 25) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one = weightage;
      this.progress_bar_two = 0;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      this.showIncompleteButton = true;
      return businessProfileWeightageText;

    }
    if (weightage > 25 && weightage < 50) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one = 25;
      this.progress_bar_two = weightage - 25;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      this.showIncompleteButton = true;
      return businessProfileWeightageText;
    } else if
    (weightage >= 50 && weightage < 75) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = weightage - 50;
      this.progress_bar_four = 0;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;

    } else if (weightage >= 75 && weightage < 100) {
      businessProfileWeightageText = Messages.GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'primary';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = weightage - 75;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;
    } else if (weightage === 100) {
      businessProfileWeightageText = Messages.VERY_GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_MANAGE_YOUR_PROFILE;
      this.weightageClass = 'success';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = 25;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;

    }

  }



  getAdwordDisplayName(name) {
    return name.split(projectConstants.ADWORDSPLIT).join(' ');
  }
  getPublicSearch() {
    this.provider_services.getPublicSearch()
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
          this.jaldee_online_status_str = (this.public_search === true) ? 'On' : 'Off';
          this.jaldee_online_status = this.public_search;
          // this.jaldee_online_status_str = (this.public_search) ? 'On' : 'Off';
          this.normal_search_active = this.public_search;
        },
        () => {
        }
      );
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


    getJaldeeIntegrationSettings() {
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        this.onlinepresence_status = data.onlinePresence;
        this.onlinepresence_status_str = this.onlinepresence_status ? 'On' : 'Off';
        this.getPublicSearch();

      }
    );
  }




  getBusinessProfile() {
    this.aboutmefilled = false;
    this.locationFilled = false;
    this.specializeFilled = false;
    this.mediaFilled = false;
    this.languageFilled = false;
    this.bProfile = [];
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.mandatoryfieldArray = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          if (this.bProfile.businessName && this.bProfile.businessDesc) {
            this.domainVirtualFieldFilledStatus = this.provider_datastorage.getWeightageObjectOfDomain();
            this.subdomainVirtualFieldFilledStatus = this.provider_datastorage.getWeightageObjectOfSubDomain();

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
          }
          if (this.bProfile.baseLocation) {
            this.locationFilled = true;
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
          if (this.bProfile.phoneNumbers && this.bProfile.phoneNumbers.length !== 0) {
            this.contactInfoPhFilled = true;
          }
          if (this.bProfile.emails && this.bProfile.emails.length !== 0) {
            this.contactInfoMailFilled = true;
          }
          this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['subDomain']).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields, this.bProfile['serviceSubSector']['subDomain']);
                  this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
                  this.additionalInfoDomainFields = this.provider_shared_functions.getAdditionalNonDomainMandatoryFields();
                  this.additionalInfoSubDomainFields = this.provider_shared_functions.getAdditionalNonSubDomainMandatoryFields();
                  this.subdomain = this.bProfile['serviceSubSector']['subDomain'];

                  this.getDomainVirtualFields();
                  if (this.bProfile['serviceSubSector']['subDomain']) {
                    this.getSubDomainVirtualFields();
                  }

                });



            });
          this.provider_datastorage.set('bProfile', this.bProfile);


          const loginuserdata = this.sharedfunctionobj.getitemFromGroupStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionobj.setitemToGroupStorage('ynw-user', loginuserdata);
          this.serviceSector = data['serviceSector']['displayName'] || null;
          if (this.bProfile.status === 'ACTIVE') {
            this.normal_profile_active = 3;
          } else {
            this.normal_profile_active = 2;
          }

          if (this.bProfile['serviceSector'] && this.bProfile['serviceSector']['domain']) {
            const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            // calling function which saves the business related details to show in the header
            this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
              || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            const pdata = { 'ttype': 'updateuserdetails' };
            this.sharedfunctionobj.sendMessage(pdata);

          }
          // check whether normal search section can be displayed
          this.normal_search_display = this.bProfile.enableSearch;
          // check whether normal business profile section can be displayed
          if ((this.bProfile.businessName !== '' && this.bProfile.businessName !== undefined)
            || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined)) {
            this.normal_basicinfo_show = 3;
          } else {
            this.normal_basicinfo_show = 2;
          }








          // check whether domain fields exists
          const statusCode = this.provider_shared_functions.getProfileStatusCode(this.bProfile);
          this.provider_datastorage.setBusinessProfileWeightage(this.bProfile);
          this.sharedfunctionobj.setitemToGroupStorage('isCheckin', statusCode);
          this.businessProfile_show = -1;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  getGalleryImages() {
    this.galryFilled = false;
    this.provider_services.getGalleryImages()
      .subscribe(
        data => {
          this.image_list = data;
          if (this.image_list && this.image_list.length !== 0) {
            this.galryFilled = true;
          }
          this.provider_datastorage.updateGalleryWeightageToBusinessProfile(this.image_list);

        },
        () => {

        }
      );
  }



  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getBussinessProfile()
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
  changePublicSearch(event) {
    const is_check = (event.checked) ? 'ENABLE' : 'DISABLE';
    this.provider_services.updatePublicSearch(is_check)
      .subscribe(
        () => { },
        () => { }
      );
  }
  reDirectToJaldeeOnline() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'jaldeeonline']);
  }


  editLocation(badge?) {
    if (badge) {
      this.loceditdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
        disableClose: true,
        autoFocus: false,
        data: {
          location: this.base_loc,
          badges: this.loc_badges,
          type: 'edit',
          source: 'waitlist',
          forbadge: true,
          src: 'h'
        }
      });
      this.loceditdialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result === 'reloadlist') {
            this.getBusinessProfile();
          }
        }
      });
    } else if (this.bProfile.baseLocation) {
      const locid = this.bProfile.baseLocation.id;
      if (locid) {
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'editbase', src: 'h' }
        };
        this.routerobj.navigate(['provider', 'settings', 'general',
          'locations', locid], navigationExtras);
      }
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { action: 'add', src: 'h' }
      };
      this.routerobj.navigate(['provider', 'settings', 'general',
        'locations', 'add'], navigationExtras);
    }
  }



  performActions(action) {
    if (action === 'learnmore') {

      this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline']);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline->' + mod]);
  }

   gotoJaldeeIntegration() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'jaldee-integration']);
  }
  gotoMedia() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'media']);
  }
  gotoSpecializations() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'specializations']);
  }
  gotoLanguages() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'languages']);
  }
  gotoPrivacy() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'privacy']);
  }
  gotoAdditionalInfo() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'additionalinfo']);
  }
  gotoAboutMe() {
    this.routerobj.navigate(['provider', 'settings', 'bprofile', 'aboutme']);
  }



  // mandatory fields

  getDomainVirtualFields() {
    const weightageObjectOfDomain: any = {};
    const checkArray = [];
    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          let mandatorydomain = false;
          let mandatorydomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_fields_nonmandatory = this.domain_fields.filter(dom => dom.mandatory === false);
          this.domain_questions = data['questions'] || [];
          this.domain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.mandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            mandatorydomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                mandatorydomainFilled = true;
              } else {
                mandatorydomainFilled = false;
                return;
              }
            });


          } else {
            mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoDomainFields, this.domain_fields)) {
            additionalInfoFilledStatus = true;
          }
          weightageObjectOfDomain.mandatoryDomain = mandatorydomain;
          weightageObjectOfDomain.mandatoryDomainFilledStatus = mandatorydomainFilled;
          weightageObjectOfDomain.additionalDomainFullyFilled = additionalInfoFilledStatus;
          this.provider_datastorage.setWeightageObjectOfDomain(weightageObjectOfDomain);



        }
      );
  }


  checkMandatoryFieldsInResultSet(domainFields, fieldname) {
    let fullyfilledStatus = true;
    domainFields.forEach(function (dom) {
      if (dom.name === fieldname) {
        if (!dom['value'] || (dom.value === undefined || dom.value == null)) {
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

  addDynamicField(field, type) {
    if (field.dataType === 'DataGrid') {
      this.editGridDynamicField(field.name, type, null);
    } else {
      this.editDynamicField(field.name, type);
    }
  }
  editGridDynamicField(field_name, type, index = 0) {
    const field = JSON.parse(JSON.stringify(this.getFieldQuestion(field_name, type)));
    // We need to pass only selected row to edit page
    // Create the data for passing to dynamicform
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
  deleteGridDynamicField(field_name, type = 'domain_questions', index = 0) {
    const pre_value = (type === 'domain_questions') ? JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
      JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    // JSON.parse(JSON.stringify used to remove reference
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
  editDynamicField(field_name, type) {
    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);
  }
  showDynamicFieldPopup(field, type, grid_row_index = null) {
    this.dynamicdialogRef = this.dialog.open(ProviderBprofileSearchDynamicComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: type,
        questions: field,
        bProfile: this.bProfile,
        grid_row_index: grid_row_index
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

  getSubDomainVirtualFields() {
    const checkArray = [];
    const weightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          let mandatorysubdomain = false;
          let mandatorySubDomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];
          this.subdomain_fields_nonmandatory = this.subdomain_fields.filter(dom => dom.mandatory === false);
          this.subdomain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.subdomain_questions = data['questions'] || [];
          if (this.mandatoryfieldArray.length !== 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            mandatorysubdomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                mandatorySubDomainFilled = true;
              } else {
                mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            additionalInfoFilledStatus = true;
          }

          weightageObjectOfSubDomain.mandatorySubDomain = mandatorysubdomain;
          weightageObjectOfSubDomain.mandatorySubDomainFilledStatus = mandatorySubDomainFilled;
          weightageObjectOfSubDomain.additionalSubDomainFullyFilled = additionalInfoFilledStatus;
          this.provider_datastorage.setWeightageObjectOfSubDomain(weightageObjectOfSubDomain);
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

          this.provider_datastorage.updateMandatoryAndAdditionalFieldWeightage();
        }
      );
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
          // str += this.sharedfunctionobj.firstToUpper(fld.value[i]);
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
  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.qservice.getQuestions(set_data['fields']);
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
    this.provider_services.updateDomainSubDomainFields(post_data,
      this.bProfile['serviceSector']['domain'])
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
    this.provider_services.updateDomainSubDomainFields(post_data, null,
      this.bProfile['serviceSubSector']['subDomain'])
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
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/jaldeeonline']);
  }
  qrCodegeneraterOnlineID(accEncUid) {
    this.qrdialogRef = this.dialog.open(QRCodeGeneratorComponent, {
      width: '40%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        accencUid: accEncUid,
        path: this.wndw_path,
        businessName: this.bProfile.businessName
      }
    });

    this.qrdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getBusinessProfile();
      }
    });
  }
}
