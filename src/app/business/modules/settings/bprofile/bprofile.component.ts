import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { projectConstants } from '../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderBprofileSearchPrimaryComponent } from '../../../../ynw_provider/components/provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { AddProviderWaitlistLocationsComponent } from '../../../../ynw_provider/components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderBprofileSearchSchedulepopupComponent } from '../../../../ynw_provider/components/provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSearchAdwordsComponent } from '../../../../ynw_provider/components/add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { Subscription, of } from 'rxjs';
import { AddProviderBprofileSpecializationsComponent } from '../../../../ynw_provider/components/add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
import { QuestionService } from '../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { ProviderBprofileSearchDynamicComponent } from '../../../../ynw_provider/components/provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { ProviderBprofileSearchSocialMediaComponent } from '../../../../ynw_provider/components/provider-bprofile-search-socialmedia/provider-bprofile-search-socialmedia.component';
import { AddProviderBprofileSpokenLanguagesComponent } from '../../../../ynw_provider/components/add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';


@Component({
  selector: 'app-bprofile',
  templateUrl: './bprofile.component.html'


})

export class BProfileComponent implements OnInit, OnDestroy ,AfterViewChecked{

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
  //social media and gallery

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

  //languages
  languages_arr: any = [];
  langdialogRef;
  frm_lang_cap = '';
  normal_language_show = 1;
  //virtual fields


  dynamicdialogRef: any;

  subdomain: any;
  weightageValue=0;
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

  //jaldee_turn_on_cap=Messages.JALDEEE_TURN_ON_CAP;
  // jaldee_turn_ff_cap=Messages.JALDEE_TURN_OFF_CAP;
  // path = window.location.host + ;
  wndw_path = projectConstants.PATH;
  // @ViewChildren('qrCodeParent') qrCodeParent: ElementRef;
  private qrCodeParent: ElementRef;
  @ViewChild('qrCodeOnlineId', { static: false, read: ElementRef }) set content1(content1: ElementRef) {
    if (content1) { // initially setter gets called with undefined
      this.qrCodeParent = content1;
    }
  }
  private qrCodeCustId: ElementRef;
  @ViewChild('qrCodeCustId', { static: false }) set content2(content2: ElementRef) {
    if (content2) { // initially setter gets called with undefined
      this.qrCodeParent = content2;
    }
  }
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
      title: 'Jaldee Online'
    }
  ];
  businessConfig: any = [];
  multipeLocationAllowed = false;
  //customer_label = '';
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
  //frm_gallery_cap = '';
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

  editMode = 3;
  customForm: FormGroup;
  custId;
  active_user;
  //frm_lang_cap = '';
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
  //mandatory fields
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  field;
  grid_row_index;

  showAddSection = false;
  showAddSection1 = false;

  //specilization


  specialization_arr: any = [];
  special_cap = Messages.BPROFILE_SPECIAL_CAP;
  specialization_title = '';
  specialdialogRef;
  normal_specilization_show = 1;
  image_list: any = [];
  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private sharedfunctionobj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    private sanitizer: DomSanitizer, private fb: FormBuilder,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public fed_service: FormMessageDisplayService,
    private shared_services: SharedServices,
    private qservice: QuestionService,
    private galleryService: GalleryService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.provider_datastorage.setWeightageArray([]);
    this.shared_functions.getMessage().subscribe(data => {
      this.getLicensemetrics();
      switch (data.ttype) {
        case 'upgradelicence':
          this.getLicensemetrics();
          break;
      }
    });
  }



  ngOnInit() {
   
    this.custm_id = Messages.CUSTM_ID.replace('[customer]', this.customer_label);
    this.jaldee_acc_url = Messages.JALDEE_URL.replace('[customer]', this.customer_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_enabled_msg=Messages.JALDEE_ONLINE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_disabled_msg=Messages.JALDEE_ONLINE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    
    this.getBusinessConfiguration();
    this.getPublicSearch();
    this.getJaldeeIntegrationSettings();
    this.getBusinessConfiguration();
    this.getProviderLocations();
    this.initSpecializations();
    this.getGalleryImages();
    // this.getBusinessProfile();
    this.subscription = this.galleryService.getMessage().subscribe(input => {
      if (input.ttype === 'image-upload') {
        this.provider_services.uploadGalleryImages(input.value)
          .subscribe(
            () => {
              this.getGalleryImages();
              this.shared_functions.openSnackBar(Messages.BPROFILE_IMAGE_UPLOAD, { 'panelClass': 'snackbarnormal' });
              this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
            },
            error => {
              this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
              this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
            }
          );
      } else if (input.ttype === 'delete-image') {
        this.deleteImage(input.value);
      }
    });
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.customForm = this.fb.group({
      // customid: ['', Validators.compose([Validators.required])]
      customid: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_ALPHANUMERIC_HYPHEN)])]
    });

    this.getLicenseDetails();
    // this.getLicenseMetadata();
    this.getTotalAllowedAdwordsCnt();
    this.getLocationBadges();
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // this.display_schedule =  this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);

    // this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'jaldeeonline->public-search' };
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
      this.businessweightageArray = result;
      if(this.businessweightageArray.length!==0){
      this.weightageValue = this.calculateWeightage(result);
   
      if(this.checkAllRequiredFiedsOfJaldeeOnlineFilled()){
        if(this.mandatoryfieldArray.length!==0){
          this.changeJaldeeOnlineStatus(this.checkMandatoryFieldsAlsoFilled());
        }
        else{
          this.changeJaldeeOnlineStatus(true);
        }
      }else{
        this.changeJaldeeOnlineStatus(false);
      }
    }


    });
    //this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.getSpokenLanguages();
    this.setLanguages();




  }
  checkMandatoryFieldsAlsoFilled(){
    return this.businessweightageArray.includes(projectConstantsLocal.BUSINESS_PROFILE_WEIGHTAGE.MANDATORY_INFO);
  }
  checkAllRequiredFiedsOfJaldeeOnlineFilled() {
    let weightageArray = this.businessweightageArray.map(obj => obj.name);
    return projectConstantsLocal.REQUIRED_FIELDS_JALDEE_ONLINE.every(function (val) {
      return weightageArray.includes(val);
    });

  }
  changeJaldeeOnlineStatus(requiredFieldFilledStatus) {
    // if (requiredFieldFilledStatus==true && this.onlinepresence_status === false) {
    //   if(!localStorage.getItem('popupShown')) {
    //   this.sharedfunctionobj.confirmOPSearchChangeStatus(this, this.onlinepresence_status);
    //   localStorage.setItem('popupShown', 'true');
    //   }
    // } else if (requiredFieldFilledStatus==false && this.onlinepresence_status===true) {
    //   this.handle_jaldeeOnlinePresence();
      
    // }

  }
  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }
  ngOnDestroy() {
    if (this.primarydialogRef) {
      this.primarydialogRef.close();
    }
    if (this.loceditdialogRef) {
      this.loceditdialogRef.close();
    }
    if (this.addlocdialogRef) {
      this.addlocdialogRef.close();
    }
    if (this.scheduledialogRef) {
      this.scheduledialogRef.close();
    }
    if (this.adworddialogRef) {
      this.adworddialogRef.close();
    }

    if (this.socialdialogRef) {
      this.socialdialogRef.close();
    }
    if (this.gallerydialogRef) {
      this.gallerydialogRef.close();
    }
    if (this.delgaldialogRef) {
      this.delgaldialogRef.close();
    }

    this.subscription.unsubscribe();
  }


  calculateWeightage(data) {
    var total = 0;
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
    let weightage = this.weightageValue;
    if(weightage <=25){
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'danger';
      this.progress_bar_one=weightage;
      this.progress_bar_two=0;
      this.progress_bar_three=0;
      this.progress_bar_four=0;
      return businessProfileWeightageText;
     
    }
    if (weightage>25 && weightage < 50) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one=25;
      this.progress_bar_two=weightage-25;
      this.progress_bar_three=0;
      this.progress_bar_four=0;
      return businessProfileWeightageText;
    } else if
    (weightage >= 50 && weightage < 75) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one=25;
      this.progress_bar_two=25;
      this.progress_bar_three=weightage-50;
      this.progress_bar_four=0;
      return businessProfileWeightageText;

    } else if (weightage >= 75 && weightage < 100) {
      businessProfileWeightageText = Messages.GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'primary';
      this.progress_bar_one=25;
      this.progress_bar_two=25;
      this.progress_bar_three=25;
      this.progress_bar_four=weightage-75;
      return businessProfileWeightageText;
    }

    else if (weightage == 100) {
      businessProfileWeightageText = Messages.VERY_GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_MANAGE_YOUR_PROFILE;
      this.weightageClass = 'success';
      this.progress_bar_one=25;
      this.progress_bar_two=25;
      this.progress_bar_three=25;
      this.progress_bar_four=25;
      return businessProfileWeightageText;

    }

  }

  getLicensemetrics() {
    let pkgId;
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    if (user && user.accountLicenseDetails && user.accountLicenseDetails.accountLicense && user.accountLicenseDetails.accountLicense.licPkgOrAddonId) {
      pkgId = user.accountLicenseDetails.accountLicense.licPkgOrAddonId;
    }
    this.provider_services.getLicenseMetadata().subscribe(data => {
      this.licenseMetadata = data;
      for (let i = 0; i < this.licenseMetadata.length; i++) {
        if (this.licenseMetadata[i].pkgId === pkgId) {
          for (let k = 0; k < this.licenseMetadata[i].metrics.length; k++) {
            if (this.licenseMetadata[i].metrics[k].id === 13) {
              if (this.licenseMetadata[i].metrics[k].anyTimeValue === 'true') {
                this.showCustomId = true;
                return;
              } else {
                this.showCustomId = false;
                return;
              }
            }
          }
        }
      }
    });
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
  confirm_searchStatus() {

    if (this.normal_search_active) {
      this.sharedfunctionobj.confirmSearchChangeStatus(this, this.normal_search_active);
      // this.getPublicSearch();
    } else {
      this.handle_searchstatus();
    }
  }
  confirm_opsearchStatus() {
    if (this.onlinepresence_status) {
      this.sharedfunctionobj.confirmOPSearchChangeStatus(this, this.onlinepresence_status);
    } else {
      this.handle_jaldeeOnlinePresence();
    }
  }
  //regular button
  handle_searchstatus() {
    //const is_jaldee_online = (event.checked) ? 'Enable' : 'Disable';
    const changeTostatus = (this.normal_search_active === true) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe(() => {
        //this.jaldee_online_status=this.normal_search_active;
        const status = (this.normal_search_active === true) ? 'disable' : 'enable';
        // this.jaldee_online_status_str=(this.normal_search_active === true) ? 'on' : 'off';
        this.shared_functions.openSnackBar('List myProfile on Jaldee.com ' + status + 'd successfully', { ' panelclass': 'snackbarerror' });
        // this.getJaldeeOnlineStatus();
        this.getPublicSearch();

      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //this.getJaldeeOnlineStatus();
        this.getPublicSearch();
      });
  }

  // //without toggle
  // handle_searchstatus(event) {
  //   const is_jaldee_online = (event.checked) ? 'Enable' : 'Disable';
  //  // const changeTostatus = (this.normal_search_active === true) ? 'DISABLE' : 'ENABLE';
  //   this.provider_services.updatePublicSearch(is_jaldee_online)
  //     .subscribe(() => {
  //      // const status = (this.normal_search_active === true) ? 'disable' : 'enable';
  //       this.shared_functions.openSnackBar('Public Search ' + is_jaldee_online + 'd successfully', { ' panelclass': 'snackbarerror' });
  //      // this.getJaldeeOnlineStatus();
  //       this.getPublicSearch();

  //     }, error => {
  //       this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       //this.getJaldeeOnlineStatus();
  //       this.getPublicSearch();
  //     });
  // }

  getJaldeeIntegrationSettings() {
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        this.onlinepresence_status = data.onlinePresence;
        // this.walkinConsumer_status = data.walkinConsumer;
        // this.jaldeeintegration_status = data.onlinePresence;
        // this.walkinConsumer_statusstr = (this.walkinConsumer_status) ? 'On' : 'Off';
        this.onlinepresence_statusstr = (this.onlinepresence_status) ? 'On' : 'Off';
        this.profile_status = this.onlinepresence_status ? true : false;
        this.profile_status_str = this.profile_status ? 'On' : 'Off';
        // this.jaldeeintegration_statusstr = (this.jaldeeintegration_status) ? 'On' : 'Off';
      }
    );
  }
  handle_jaldeeOnlinePresence() {

    const is_check = this.onlinepresence_status ? 'Disable' : 'Enable';

    // this.businessProfile_status=(is_check==='Disable'? false: true);
    // this.businessProfile_status_str=(this.businessProfile_status===true? 'On':'Off');
    const data = {
      'onlinePresence': !this.onlinepresence_status
    };
    this.provider_services.setJaldeeIntegration(data)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Jaldee Online ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        }
      );
  }
  handle_opsearchstatus() {
    const changeTostatus = (this.normal_search_active === true) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe(() => {
        this.getPublicSearch();
      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getBusinessProfile() {
    this.bProfile = [];
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.mandatoryfieldArray = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
            domainfields => {
              this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['subDomain']).subscribe(
                subdomainfields => {
                  this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields, this.bProfile['serviceSubSector']['subDomain']);
                  this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
                  this.additionalInfoDomainFields = this.provider_shared_functions.getAdditionalNonDomainMandatoryFields();
                  this.additionalInfoSubDomainFields = this.provider_shared_functions.getAdditionalNonSubDomainMandatoryFields();
                  this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
                  this.getProviderLogo();
                  this.getDomainVirtualFields();
                  if (this.bProfile['serviceSubSector']['subDomain']) {
                    this.getSubDomainVirtualFields();
                  }

                });



            });
          this.provider_datastorage.set('bProfile', this.bProfile);

          for (let i = 0; i < this.businessConfig.length; i++) {
            if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
              if (this.businessConfig[i].multipleLocation) {
                this.multipeLocationAllowed = true;
              }
            }

          }

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
          if (this.bProfile.baseLocation) {
            this.parkingType = this.bProfile.baseLocation.parkingType;
            if (this.parkingType) {
              this.park_type = this.parkingType.charAt(0).toUpperCase() + this.parkingType.substring(1);
            }
            if ((this.bProfile.baseLocation.parkingType && this.bProfile.baseLocation.parkingType !== 'none') || this.bProfile.baseLocation.open24hours
              || this.objectKeys(this.bProfile.baseLocation.locationVirtualFields).length > 0) {
              this.normal_locationamenities_show = 3;
            } else {
              this.normal_locationamenities_show = 2;
            }
          } else {
            this.normal_locationamenities_show = 2;
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
          // check whether normal location section can be displayed
          this.normal_locationinfo_show = 2;
          if (this.bProfile.baseLocation) {
            if (this.bProfile.baseLocation.place === '') { // case if base location name is blank
              this.normal_locationinfo_show = 4;
            } else {
              this.normal_locationinfo_show = 3;
            }
            if (this.bProfile.baseLocation.bSchedule) {
              if (this.bProfile.baseLocation.bSchedule.timespec) {
                if (this.bProfile.baseLocation.bSchedule.timespec.length > 0) {
                  this.schedule_arr = [];
                  // extracting the schedule intervals
                  for (let i = 0; i < this.bProfile.baseLocation.bSchedule.timespec.length; i++) {
                    for (let j = 0; j < this.bProfile.baseLocation.bSchedule.timespec[i].repeatIntervals.length; j++) {
                      // pushing the schedule details to the respective array to show it in the page
                      this.schedule_arr.push({
                        day: this.bProfile.baseLocation.bSchedule.timespec[i].repeatIntervals[j],
                        sTime: this.bProfile.baseLocation.bSchedule.timespec[i].timeSlots[0].sTime,
                        eTime: this.bProfile.baseLocation.bSchedule.timespec[i].timeSlots[0].eTime
                      });
                    }
                  }
                }
              }
            }
            this.display_schedule = [];
            this.display_schedule = this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
          }
          this.normal_customid_show = 2;
          if (this.bProfile.customId) {
            this.normal_customid_show = 3;
          }
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


          // check whether domain fields exists
          const statusCode = this.provider_shared_functions.getProfileStatusCode(this.bProfile);
          this.provider_datastorage.setBusinessProfileWeightage(this.bProfile);
          this.sharedfunctionobj.setitemToGroupStorage('isCheckin', statusCode);

        },
        () => {

        }
      );
  }

  getGalleryImages() {
    this.provider_services.getGalleryImages()
      .subscribe(
        data => {
          this.image_list = data;
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

  showBPrimary() {
    this.primarydialogRef = this.dialog.open(ProviderBprofileSearchPrimaryComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: 'edit',
        bprofile: this.bProfile
      }
    });
    this.primarydialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
          this.shared_functions.sendMessage({ 'ttype': 'profileChange' });
        }
      }
    });
  }
  getLocationBadges() {
    this.provider_services.getLocationBadges()
      .subscribe(data => {
        this.loc_badges = data;
        for (const badge of this.loc_badges) {
          this.badge_map_arr[badge.name] = badge.displayName;
        }
      });
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
          forbadge: true
        }
      });
      this.loceditdialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result === 'reloadlist') {
            this.getBusinessProfile();
            this.getProviderLocations();
          }
        }
      });
    } else if (this.bProfile.baseLocation) {
      const locid = this.bProfile.baseLocation.id;
      if (locid) {
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'editbase' }
        };
        this.routerobj.navigate(['provider', 'settings', 'general',
          'locations', locid], navigationExtras);
      }
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { action: 'add' }
      };
      this.routerobj.navigate(['provider', 'settings', 'general',
        'locations', 'add'], navigationExtras);
    }
  }
  editQueue() {
    if (this.bProfile.baseLocation) {
      const locid = this.bProfile.baseLocation.id;
      if (locid) {
        this.routerobj.navigate(['/provider/settings/q-manager/location-detail/' + locid]);
      }
    }
  }
  addLocation() {
    // this.addlocdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
    //   disableClose: true,
    //   autoFocus: true,
    //   data: {
    //     // location : this.base_loc,
    //     badges: this.loc_badges,
    //     type: 'add',
    //     source: 'bprofile'
    //   }
    // });
    // this.addlocdialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if (result === 'reloadlist') {
    //       this.getBusinessProfile();
    //       this.getProviderLocations();
    //     }
    //   }
    // });
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'addbase' }
    };
    this.routerobj.navigate(['provider', 'settings', 'general',
      'locations', 'add'], navigationExtras);
  }
  // get the list of locations added for the current provider
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(data => {
        this.loc_list = data;
        for (const loc of this.loc_list) {
          if (loc['baseLocation']) {
            this.base_loc = loc;
            this.mapurl = null;
            if (this.base_loc.lattitude !== '' &&
              this.base_loc.longitude !== '') {
              this.mapurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?zoom=11&center=' + this.base_loc.lattitude + ',' + this.base_loc.longitude + '&key=' + projectConstants.GOOGLEAPIKEY);
            }
          }
        }
      });
  }
  getmapurl() {
    return this.base_loc.googleMapUrl; // 'https://www.google.com/maps/embed/v1/view?zoom=11&center=10.5276,76.2144&key=AIzaSyARtnqchjx36syKsRJyO_fWZHI4Fuv-SW4';
  }
  // display logo
  showimg() {
    let logourl = '';
    this.profimg_exists = false;
    if (this.item_pic.base64) {
      this.profimg_exists = true;

      return this.item_pic.base64;
    } else {
      if (this.blogo[0]) {
        this.profimg_exists = true;
        logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }

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
          if (this.bProfile.status === 'ACTIVE' || this.bProfile.status === 'INACTIVE') { // case now in bprofile edit page
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
  // get the logo url for the provider
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
          let logoExist;
          const cnow = new Date();
          const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
          this.cacheavoider = dd;
          let logo = '';
          if (this.blogo[0]) {
            logoExist = true;
            logo = this.blogo[0].url;
          } else {
            logo = '';
            logoExist = false;
          }
          this.provider_datastorage.updateProfilePicWeightage(logoExist);
          const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          // calling function which saves the business related details to show in the header
          this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
            || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', logo);

          const pdata = { 'ttype': 'updateuserdetails' };
          this.sharedfunctionobj.sendMessage(pdata);
        },
        () => {

        }
      );
  }
  // Upload logo
  uploadLogo(passdata) {
    this.provider_services.uploadLogo(passdata)
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
          this.provider_datastorage.updateProfilePicWeightage(true);
          this.sharedfunctionobj.sendMessage(pdata);
          /// this.api_success = Messages.BPROFILE_LOGOUPLOADED;
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.api_error = error.error;
        }
      );
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
        this.provider_datastorage.updateProfilePicWeightage(this.profimg_exists);
        const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
        this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
          || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '', true);

        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedfunctionobj.sendMessage(pdata);
        this.myInputVariable.nativeElement.value = '';
      },
        () => {

        });
  }
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }
  change_schedulepopup() {
    this.scheduledialogRef = this.dialog.open(ProviderBprofileSearchSchedulepopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        schedule_arr: this.schedule_arr,
        bProfile: this.bProfile,
        type: 'edit'
      }
    });
    this.scheduledialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
          this.getProviderLocations();
        }
      }
    });
  }
  objectKeys(obj) {
    return Object.keys(obj);
  }
  getLicenseDetails() {
    this.provider_services.getLicenseDetails()
      .subscribe(data => {
        this.currentlicense_details = data;
        this.license_details = this.currentlicense_details;
        this.current_license = this.currentlicense_details.accountLicense.name;
      });
  }
  getTotalAllowedAdwordsCnt() {
    this.provider_services.getTotalAllowedAdwordsCnt()
      .subscribe(data => {
        this.currentlicense_details = data;
        this.adwordsmaxcount = this.currentlicense_details;
        this.adword_loading = false;
        this.getAdwords();
      });
  }
  getAdwords() {
    this.adwordshow_list = [];
    this.provider_services.getAdwords()
      .subscribe(data => {
        this.adword_list = data;
        if (this.adword_list.length > 2) {
          for (let i = 0; i < 2; i++) {
            this.adwordshow_list.push(this.adword_list[i]);
          }
        } else {
          this.adwordshow_list = this.adword_list;
        }
        this.normal_adworkds_active = true;
        this.adwords_maxremaining = this.adwordsmaxcount - this.adword_list.length;
        this.adwords_remaining = this.adword_list.length - 2;
      });
  }

  addAdwords() {
    this.adworddialogRef = this.dialog.open(AddProviderBprofileSearchAdwordsComponent, {
      width: '50%',
      data: {
        type: 'add'
      },
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true
    });

    this.adworddialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getAdwords();
      }
    });
  }
  buyAdwords() {
    this.routerobj.navigate(['provider', 'settings', 'license']);
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
  editCustomId(customId?) {
    this.normal_customid_show = 1;
    if (customId) {
      this.editMode = 1;
      this.customForm.setValue({ 'customid': customId });
    } else {
      this.editMode = 0;
    }
  }
  customizeId() {
    if (this.normal_customid_show === 2 && !this.showCustomId) {
      this.licence_warn = true;
    } else {
      this.is_customized = true;
      this.editCustomId();
    }
  }
  deleteCustomId(customId) {
    this.provider_services.removeCustomId(customId).subscribe(
      data => {
        delete this.bProfile['customId'];
        this.normal_customid_show = 2;
      });
    this.customForm.setValue({ 'customid': '' });
    this.is_customized = false;
  }
  cancelCusUpdt() {
    this.customForm.setValue({ 'customid': '' });
    if (this.editMode === 0) {
      this.normal_customid_show = 2;
    } else {
      this.normal_customid_show = 3;
    }
    this.editMode = 3;
    this.is_customized = false;
  }
  add_updateCustomId(submit_data) {
    const customId = submit_data.customid;
    if (this.editMode === 0) {
      this.provider_services.addCustomId(customId).subscribe(
        data => {
          this.bProfile.customId = customId;
          this.normal_customid_show = 3;
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.normal_customid_show = 2;
        });
    } else {
      this.provider_services.editCustomId(customId).subscribe(
        data => {
          this.bProfile.customId = customId;
          this.normal_customid_show = 3;
        },
        error => {
          this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.normal_customid_show = 3;
        });
    }
    this.editMode = 3;
  }
  // copyInputMessage(inputElement) {
  //   inputElement.select();
  //   document.execCommand('copy');
  //   inputElement.setSelectionRange(0, 0);
  // }

  copyInputMessage(valuetocopy) {
    const path = projectConstants.PATH + valuetocopy;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = path;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.shared_functions.openSnackBar('Link copied to clipboard');
  }
  qrCodegenerateOnlineID(valuetogenerate) {
    this.qr_value = projectConstants.PATH + valuetogenerate;
    this.qr_code_oId = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
    }, 50);
  }
  qrCodegenerateCustID(valuetogenerate) {
    this.qr_value = projectConstants.PATH + valuetogenerate;
    this.qr_code_cId = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.qrCodePath = this.qrCodeParent.nativeElement.getElementsByTagName('img')[0].src;
    }, 50);
  }
  closeOnlineQR() {
    this.qr_code_oId = false;
  }
  closeCustomQR() {
    this.qr_code_cId = false;
  }
  printQr(printSectionId) {
    const printContent = document.getElementById(printSectionId);
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<html><head><title></title>');
    WindowPrt.document.write('</head><body style="border-style: dashed;width:500px;height:600px">');
    WindowPrt.document.write('<div style="padding-left:190px;padding-top: 50px;">');
    WindowPrt.document.write('<p style="font-size: xx-large;padding-left:24px;font-weight: 700;color: #183e7a;">Jaldee</p>');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('</div>');
    WindowPrt.document.write('</body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  showPasscode() {
    this.show_passcode = !this.show_passcode;
  }
  downloadQR() {

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

  //specilization

  initSpecializations() {
    this.bProfile = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          this.provider_datastorage.updateSpecilizationWeightage(this.bProfile.specialization);
          this.getSpecializations(data['serviceSector']['domain'], data['serviceSubSector']['subDomain']);
          this.specialization_title = (data['serviceSubSector']['displayName']) ?
            data['serviceSubSector']['displayName'] : '';
          if (this.bProfile.specialization) {
            if (this.bProfile.specialization.length > 0) {
              this.normal_specilization_show = 3;
            } else {
              this.normal_specilization_show = 2;
            }
          } else {
            this.normal_specilization_show = 2;
          }
        });

  }
  getSpecializations(domain, subdomain) {
    this.provider_services.getSpecializations(domain, subdomain)
      .subscribe(data => {
        this.specialization_arr = data;

      });
  }
  getSpecializationName(n) {
    for (let i = 0; i < this.specialization_arr.length; i++) {
      if (this.specialization_arr[i].name === n) {
        return this.specialization_arr[i].displayName;
      }
    }
  }

  handleSpecialization() {
    let holdselspec;
    if (this.bProfile && this.bProfile.specialization) {
      holdselspec = JSON.parse(JSON.stringify(this.bProfile.specialization)); // to avoid pass by reference
    } else {
      holdselspec = [];
    }

    const bprof = holdselspec;
    const special = this.specialization_arr;
    this.specialdialogRef = this.dialog.open(AddProviderBprofileSpecializationsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        selspecializations: bprof,
        specializations: special
      }
    });

    this.specialdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['mod'] === 'reloadlist') {
          // this.getBusinessProfile();
          this.bProfile = result['data'];
          this.initSpecializations();
          if (this.bProfile && this.bProfile.selspecializations) {
            if (this.bProfile.selspecializations.length > 0) {
              this.normal_specilization_show = 3;
            } else {
              this.normal_specilization_show = 2;
            }
          } else {
            this.normal_specilization_show = 2;
          }
        }
      }
    });
  }



  //mandatory fields

  getDomainVirtualFields() {
    let weightageObjectOfDomain: any = {};
    let checkArray = [];
    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          // this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
          //  this.additionalInfoFields = this.provider_shared_functions.getAdditionalNonMandatoryFields();
          let mandatorydomain = false;
          let mandatorydomainFilled = false;
          let additionalInfoFilledStatus = false
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          this.domain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.mandatoryfieldArray.length != 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            mandatorydomain = true
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
        if (!dom['value'] || (dom.value == undefined || dom.value == null)) {
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
              if (!data_object['value'] || (data_object.value == undefined || data_object.value == null)) {
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
    let checkArray = [];
    let weightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          let mandatorysubdomain = false;
          let mandatorySubDomainFilled = false;
          let additionalInfoFilledStatus = false
          this.subdomain_fields = data['fields'];
          this.subdomain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.subdomain_questions = data['questions'] || [];
          if (this.mandatoryfieldArray.length != 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
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


  //gallery



  deleteImage(file) {
    this.provider_services.deleteProviderGalleryImage(file)
      .subscribe(
        () => {
          this.getGalleryImages();
        },
        () => {

        }
      );
  }

  getSocialdet(key, field) {
    const retdet = this.orgsocial_list.filter(
      soc => soc.key === key);
    const returndet = retdet[0][field];
    return returndet;
  }

  check_alreadyexists(v) {
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Sockey === v) {
        return true;
      }
    }
    return false;
  }
  handleSocialmedia(key) {
    this.socialdialogRef = this.dialog.open(ProviderBprofileSearchSocialMediaComponent, {
      width: '50%',
      // panelClass: 'socialmediamainclass',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        bprofile: this.bProfile,
        editkey: key || ''
      }
    });
    this.socialdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
        }
      }
    });
  }
  deleteSocialmedia(sockey) {
    const post_data: any = [];
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Sockey !== sockey) {
        post_data.push({ 'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl });
      }
    }
    const submit_data = {
      'socialMedia': post_data
    };
    this.provider_services.updateSocialMediaLinks(submit_data)
      .subscribe(
        () => {
          this.getBusinessProfile();
        },
        () => {

        }
      );

  }
  editSocialmedia(key) {
    this.handleSocialmedia(key);
  }

  //languages known

  setLanguages() {
    this.bProfile = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          if (this.bProfile.languagesSpoken) {
            this.provider_datastorage.updateLanguagesWeightage(this.bProfile.languagesSpoken);
            if (this.bProfile.languagesSpoken.length > 0) {
              this.normal_language_show = 3;
            } else {
              this.normal_language_show = 2;
            }
          } else {
            this.normal_language_show = 2;
          }
        });
  }
  getSpokenLanguages() {
    this.provider_services.getSpokenLanguages()
      .subscribe(data => {
        this.languages_arr = data;
        //this.provider_datastorage.updateLanguagesWeightage(this.languages_arr);
      });
  }
  getlanguageName(n) {
    for (let i = 0; i < this.languages_arr.length; i++) {
      if (this.languages_arr[i].name === n) {
        return this.languages_arr[i].displayName;
      }
    }
  }
  handleSpokenLanguages() {
    let holdsellang;
    if (this.bProfile.languagesSpoken) {
      holdsellang = JSON.parse(JSON.stringify(this.bProfile.languagesSpoken)); // to avoid pass by reference
    } else {
      holdsellang = [];
    }

    const bprof = holdsellang;
    const lang = this.languages_arr;
    this.langdialogRef = this.dialog.open(AddProviderBprofileSpokenLanguagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        sellanguages: bprof,
        languagesSpoken: lang
      }
    });
    this.langdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['mod'] === 'reloadlist') {
          // this.getBusinessProfile();
          this.bProfile = result['data'];
          this.setLanguages();
          if (this.bProfile.sellanguages) {
            if (this.bProfile.sellanguages.length > 0) {
              this.normal_language_show = 3;
            } else {
              this.normal_language_show = 2;
            }
          } else {
            this.normal_language_show = 2;
          }
        }
      }
    });
  }
}
