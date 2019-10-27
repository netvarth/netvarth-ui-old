import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Image, ImageModalEvent, PlainGalleryConfig, PlainGalleryStrategy, Description, DescriptionStrategy
} from 'angular-modal-gallery';
import { ProviderBprofileSearchPrimaryComponent } from '../provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { AddProviderWaitlistLocationsComponent } from '../add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { AddProviderBprofilePrivacysettingsComponent } from '../provider-bprofile-privacysettings/provider-bprofile-privacysettings.component';
import { ProviderBprofileSearchSocialMediaComponent } from '../provider-bprofile-search-socialmedia/provider-bprofile-search-socialmedia.component';
import { ProviderBprofileSearchGalleryComponent } from '../provider-bprofile-search-gallery/provider-bprofile-search-gallery.component';
import { ProviderBprofileSearchSchedulepopupComponent } from '../provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSpokenLanguagesComponent } from '../add-provider-bprofile-spoken-languages/add-provider-bprofile-spoken-languages.component';
import { AddProviderBprofileSpecializationsComponent } from '../add-provider-bprofile-specializations/add-provider-bprofile-specializations.component';
// import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProviderBprofileSearchDynamicComponent } from '../provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.component';
import { AddProviderBprofileSearchAdwordsComponent } from '../add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-provider-bprofile-search',
  templateUrl: './provider-bprofile-search.component.html',
  styleUrls: ['./provider-bprofile-search.component.scss']
})

export class ProviderBprofileSearchComponent implements OnInit, OnDestroy {

  you_have_cap = Messages.YOU_HAVE_CAP;
  more_cap = Messages.MORE_CAP;
  add_cap = Messages.ADD_BTN;
  location_cap = Messages.LOCATION_CAP;
  working_hours_cap = Messages.WORKING_HRS_CAP;
  edit_cap = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  click_here_cap = Messages.CLICK_HERE_CAP;
  email_cap = Messages.SERVICE_EMAIL_CAP;
  lang_known_cap = Messages.LANG_KNOWN_CAP;
  gallery_cap = Messages.GALLERY_CAP;
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
  have_not_add_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  basic_info_cap = Messages.BPROFILE_BASIC_INFORMATION_CAP;
  such_as_cap = Messages.BPROFILE_SUCH_AS_CAP;
  name_summary_cap = Messages.BPROFILE_BUSINESS_NAME_CAP;
  profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
  add_it_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
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
  privacy_sett_cap = Messages.BPROFILE_PRIVACY_SETTINGS_CAP;
  phone_cap = Messages.BPROFILE_PHONE_CAP;
  visible_cap = Messages.BPROFILE_VISIBLE_CAP;
  special_cap = Messages.BPROFILE_SPECIAL_CAP;
  additional_info_cap = Messages.BPROFILE_ADDOTIONAL_INFO_CAP;
  additional_cap = Messages.BPROFILE_ADDITIONAL_CAP;
  add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
  photos_to_cap = Messages.BPROFILE_PHOTOS_CAP;
  photo_cap = Messages.BPROFILE_PHOT0_CAP;
  social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
  add_social_media = Messages.BPROFILE_ADD_SOCIAL_MEDIA_CAP;
  no_social_media = Messages.NO_SOCIAL_MEDIA;
  name_cap = Messages.PRO_NAME_CAP;
  description_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  adword_maxcount = Messages.ADWORD_MAXCOUNT;
  verified_level_change = Messages.VERIFIED_LEVEL_CHANGE;
  verified_level_basic = Messages.VERIFIED_LEVEL_BASIC;
  verified_level_basicplus = Messages.VERIFIED_LEVEL_BASICPLUS;
  verified_level_premium = Messages.VERIFIED_LEVEL_PREMIUM;
  custm_id = Messages.CUSTM_ID;
  path = window.location.host;

  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;
  error_msg = '';
  vkeyNameMap = {};
  loc_badges: any = [];
  badge_map_arr: any = [];
  loc_list: any = [];
  mapurl;
  base_loc: any = [];
  image_list: any = [];
  image_list_popup: Image[];
  image_showlist: any = [];
  schedule_arr: any = [];
  display_schedule: any = [];
  social_arr: any = [];
  social_list: any = [];
  orgsocial_list: any = [];
  currentlicense_details: any = [];
  // imagesArray: Array<Image>;
  // images: Observable<Array<Image>>;
  image_remaining_cnt = 0;
  blogo: any = [];
  item_pic = {
    files: [],
    base64: null
  };
  selitem_pic = '';
  profimg_exists = false;
  badgeIcons: any = [];
  badgeArray: any = [];
  phonearr: any = [];
  emailarr: any = [];
  adword_list: any = [];
  license_metadata: any = [];
  adwordsmaxcount = 0;
  license_details: any = [];
  adwords_maxremaining = 0;
  adwords_remaining = 0;
  adwordshow_list: any = [];
  privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
  searchquestiontooltip = '';
  tooltipcls = projectConstants.TOOLTIP_CLS;
  breadcrumb_moreoptions: any = [];
  languages_arr: any = [];
  specialization_arr: any = [];

  normal_adworkds_active = false;
  normal_search_display = false;
  normal_search_active = false;

  normal_profile_active = 1;  // [1 - loading]  [2 - no info] [3 - info available]
  normal_basicinfo_show = 1;
  normal_locationinfo_show = 1;
  normal_privacy_settings_show = 1;
  normal_gallery_show = 1;
  normal_socialmedia_show = 1;
  normal_locationamenities_show = 1;
  normal_language_show = 1;
  normal_specilization_show = 1;
  normal_customid_show = 1;
  loadingParams: any = { 'diameter': 40, 'strokewidth': 15 };
  showaddsocialmedia = false;
  customernormal_label = this.sharedfunctionobj.getTerminologyTerm('customer');

  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
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

  domain_fields = [];
  domain_questions = [];
  normal_domainfield_show = 1;

  subdomain_fields = [];
  subdomain_questions = [];
  normal_subdomainfield_show = 1;
  specialization_title = '';
  subdomain = null;
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

  customer_label = '';
  maintooltip = this.sharedfunctionobj.getProjectMesssages('BPROFILE_TOOPTIP');
  primarydialogRef;
  loceditdialogRef;
  addlocdialogRef;
  privacydialogRef;
  socialdialogRef;
  specialdialogRef;
  langdialogRef;
  gallerydialogRef;
  scheduledialogRef;
  dynamicdialogRef;
  adworddialogRef;
  delgaldialogRef;
  cacheavoider = '';
  frm_public_search_cap = '';
  frm_public_search_off_cap = '';
  frm_adword_cap = '';
  frm_loc_amen_cap = '';
  frm_lang_cap = '';
  frm_additional_cap = '';
  frm_gallery_cap = '';
  frm_social_cap = '';
  frm_profile_name_cap = Messages.FRM_LEVEL_PROFILE_NAME_CAP;
  frm_loc_cap = Messages.FRM_LEVEL_LOC_MSG;
  frm_working_hr_cap = Messages.FRM_LEVEL_WORKING_MSG;
  frm_privacy_cap = Messages.FRM_LEVEL_PRIVACY_MSG;
  frm_specialization_cap = Messages.FRM_LEVEL_SPEC_MSG;
  frm_verified_cap = Messages.FRM_LEVEL_VERI_MSG;
  verified_level = Messages.VERIFIED_LEVEL;
  isCheckin;
  success_error = null;
  error_list = [];
  editMode = 3;
  customForm: FormGroup;
  custId;
  active_user;
  current_license;

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
    private service: QuestionService) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.searchquestiontooltip = this.sharedfunctionobj.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
  }

  ngOnInit() {
    this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.custm_id = Messages.CUSTM_ID.replace('[customer]', this.customer_label);
    this.customForm = this.fb.group({
      // customid: ['', Validators.compose([Validators.required])]
      customid: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_ALPHANUMERIC_HYPHEN)])]
    });
    this.getSpokenLanguages();
    this.getLicenseDetails();
    // this.getLicenseMetadata();
    this.getTotalAllowedAdwordsCnt();
    this.getLocationBadges();
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // this.display_schedule =  this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    this.getPublicSearch();
    // this.getBusinessProfile();
    this.getBusinessConfiguration();
    this.getGalleryImages();
    this.getProviderLocations();
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'profile-search->public-search' };

    this.frm_public_search_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_off_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_adword_cap = Messages.FRM_LEVEL_ADWORDS_MSG.replace('[customer]', this.customer_label);
    this.frm_loc_amen_cap = Messages.FRM_LEVEL_LOC_AMENITIES_MSG.replace('[customer]', this.customer_label);
    this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
    this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);

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
    if (this.privacydialogRef) {
      this.privacydialogRef.close();
    }
    if (this.socialdialogRef) {
      this.socialdialogRef.close();
    }
    if (this.specialdialogRef) {
      this.specialdialogRef.close();
    }
    if (this.langdialogRef) {
      this.langdialogRef.close();
    }
    if (this.gallerydialogRef) {
      this.gallerydialogRef.close();
    }
    if (this.scheduledialogRef) {
      this.scheduledialogRef.close();
    }
    if (this.dynamicdialogRef) {
      this.dynamicdialogRef.close();
    }
    if (this.adworddialogRef) {
      this.adworddialogRef.close();
    }
    if (this.delgaldialogRef) {
      this.delgaldialogRef.close();
    }
  }
  getPublicSearch() {
    this.provider_services.getPublicSearch()
      .subscribe(
        data => {
          this.public_search = (data && data.toString() === 'true') ? true : false;
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
    } else {
      this.handle_searchstatus();
    }
  }
  handle_searchstatus() {
    const changeTostatus = (this.normal_search_active === true) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe(() => {
        this.getPublicSearch();
      }, error => {
        this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }

  getBusinessProfile() {
    this.showaddsocialmedia = false;
    this.bProfile = [];

    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          this.provider_datastorage.set('bProfile', data);
          for (let i = 0; i < this.businessConfig.length; i++) {
            if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
              if (this.businessConfig[i].multipleLocation) {
                this.multipeLocationAllowed = true;
              }
            }
          }
          const loginuserdata = this.sharedfunctionobj.getitemfromLocalStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionobj.setitemonLocalStorage('ynw-user', loginuserdata);

          this.serviceSector = data['serviceSector']['displayName'] || null;
          this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
          this.getSpecializations(data['serviceSector']['domain'], data['serviceSubSector']['subDomain']);
          this.specialization_title = (data['serviceSubSector']['displayName']) ?
            data['serviceSubSector']['displayName'] : '';
          if (this.bProfile.status === 'ACTIVE') {
            this.normal_profile_active = 3;
          } else {
            this.normal_profile_active = 2;
          }
          if (this.bProfile.languagesSpoken) {
            if (this.bProfile.languagesSpoken.length > 0) {
              this.normal_language_show = 3;
            } else {
              this.normal_language_show = 2;
            }
          } else {
            this.normal_language_show = 2;
          }

          if (this.bProfile.specialization) {
            if (this.bProfile.specialization.length > 0) {
              this.normal_specilization_show = 3;
            } else {
              this.normal_specilization_show = 2;
            }
          } else {
            this.normal_specilization_show = 2;
          }

          if (this.bProfile.baseLocation) {
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

            if (this.bProfile['domainVirtualFields'] &&
              Object.keys(this.bProfile['domainVirtualFields']).length === 0) {
              this.normal_domainfield_show = 2;
            }
            const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            // calling function which saves the business related details to show in the header
            this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
              || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');

            const pdata = { 'ttype': 'updateuserdetails' };
            this.sharedfunctionobj.sendMessage(pdata);

            this.getProviderLogo();
            this.getDomainVirtualFields();

            if (this.bProfile['subDomainVirtualFields'] &&
              Object.keys(this.bProfile['subDomainVirtualFields']).length === 0) {
              this.normal_subdomainfield_show = 2;
            }

            if (this.bProfile['serviceSubSector']['subDomain']) {
              this.getSubDomainVirtualFields();
            }

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
                    if (this.bProfile.baseLocation.bSchedule.timespec[i].repeatIntervals) {
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
            }

            this.display_schedule = [];
            this.display_schedule = this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
          }

          // check whether normal privacy settings can be displayed or not
          this.normal_privacy_settings_show = 2;
          this.setPrivacyDetails();

          // check whether social media details exists
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
          // this.prepare_sociallist();

          this.normal_customid_show = 2;
          if (this.bProfile.customId) {
            this.normal_customid_show = 3;
          }



          // check whether domain fields exists

          const statusCode = this.provider_shared_functions.getProfileStatusCode(this.bProfile);
          this.sharedfunctionobj.setitemonLocalStorage('isCheckin', statusCode);

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

  setPrivacyDetails() {
    if (this.bProfile.phoneNumbers || this.bProfile.emails) {
      this.normal_privacy_settings_show = 3;
      if (this.bProfile.phoneNumbers) {
        this.phonearr = [];
        for (let i = 0; i < this.bProfile.phoneNumbers.length; i++) {
          this.phonearr.push(
            {
              'label': this.bProfile.phoneNumbers[i].label,
              'number': this.bProfile.phoneNumbers[i].instance,
              'permission': this.bProfile.phoneNumbers[i].permission
            }
          );
        }
      }

      if (this.bProfile.emails) {
        this.emailarr = [];
        for (let i = 0; i < this.bProfile.emails.length; i++) {
          this.emailarr.push(
            {
              'label': this.bProfile.emails[i].label,
              'emailid': this.bProfile.emails[i].instance,
              'permission': this.bProfile.emails[i].permission
            }
          );
        }
      }
    }
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
  /*prepare_sociallist() {
    this.social_list = [];
    for (const soc of this.orgsocial_list) {
      if (!this.check_alreadyexists(soc.key)) {
        this.social_list.push({ key: soc.key, iconClass: soc.iconClass, iconImg: soc.iconImg, displayName: soc.displayName });
      }
    }
  }*/
  getGalleryImages() {
    this.provider_services.getGalleryImages()
      .subscribe(
        data => {
          this.image_list = data;
          this.image_showlist = [];
          this.image_list_popup = [];
          this.image_remaining_cnt = 0;
          if (this.image_list.length > 0) {
            for (let i = 0; i < this.image_list.length; i++) {
              const imgobj = new Image(
                i,
                { // modal
                  img: this.image_list[i].url,
                  description: this.image_list[i].caption || ''
                });
              this.image_list_popup.push(imgobj);
            }
            this.normal_gallery_show = 3;
          } else {
            this.normal_gallery_show = 2;
          }
        },
        () => {

        }
      );

  }
  confirmDelete(file, indx) {
    const skey = this.image_list[indx].keyName;
    file.keyName = skey;
    this.sharedfunctionobj.confirmGalleryImageDelete(this, file);
  }

  deleteImage(file, bypassgetgallery?) {
    this.provider_services.deleteProviderGalleryImage(file.keyName)
      .subscribe(
        () => {
          // this.sharedfunctionobj.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_DELETE);
          if (!bypassgetgallery) {
            this.getGalleryImages();
          }
        },
        () => {

        }
      );

  }
  onButtonBeforeHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }

    // Invoked after a click on a button, but before that the related
    // action is applied.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.

    // if (event.button.type === ButtonType.DELETE) {
    if (event.button.type === ButtonType.DELETE) {
      // remove the current image and reassign all other to the array of images
      const knamearr = event.image.modal.img.split('/');
      const kname = knamearr[(knamearr.length - 1)];
      const file = {
        id: event.image.id,
        keyName: kname,
        modal: {
          img: event.image.modal.img
        },
        plain: undefined
      };
      // this.confirmDelete(file, event.image.id);
      this.deleteImage(file, true);
      this.image_list_popup = this.image_list_popup.filter((val: Image) => event.image && val.id !== event.image.id);
    }
  }

  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }
    // Invoked after both a click on a button and its related action.
  }
  onVisibleIndex() {
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
    if (this.bProfile.baseLocation) {
      const locid = this.bProfile.baseLocation.id;
      if (locid) {
        // this.routerobj.navigate(['/provider/settings/q-manager/location-detail/' + locid]);
        this.loceditdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
          disableClose: true,
          autoFocus: false,
          data: {
            location: this.base_loc,
            badges: this.loc_badges,
            type: 'edit',
            // source: 'bprofile',
            source: 'waitlist',
            forbadge: (badge) ? true : false
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
      }
    } else {
      // come to base profile from wizard and profile is disabled
      // chance for no base profile
      this.addLocation();
    }
    // the following section is commented as client told that they wanted the provider
    // to be taken to the location details page under Check-In manager when clicked on
    // edit button, rather than editing the location here itself

    /* const dialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
      autoFocus: false,
      data: {
        location : this.base_loc,
        badges: this.loc_badges,
        type : 'edit',
        source: 'bprofile',
        forbadge: (badge) ? true : false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
          this.getProviderLocations();
      }
    }
    });*/
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
    this.addlocdialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'locationoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        // location : this.base_loc,
        badges: this.loc_badges,
        type: 'add',
        source: 'bprofile'
      }
    });
    this.addlocdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
          this.getProviderLocations();
        }
      }
    });
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
  handlePrivacysettings(typ?, peditindx?) {
    this.privacydialogRef = this.dialog.open(AddProviderBprofilePrivacysettingsComponent, {
      width: '50%',
      // panelClass: 'privacysettingsmainclass',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        bprofile: this.bProfile,
        editindx: peditindx,
        curtype: typ
      }
    });
    this.privacydialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.message === 'reloadlist') {
          this.bProfile = result.data;
          this.setPrivacyDetails();
        }
      }
    });
  }
  editSocialmedia(key) {
    this.handleSocialmedia(key);
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
    if (this.bProfile.specialization) {
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
          if (this.bProfile.specialization) {
            if (this.bProfile.specialization.length > 0) {
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
  getSpokenLanguages() {
    this.provider_services.getSpokenLanguages()
      .subscribe(data => {
        this.languages_arr = data;
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
    /*const holdsellang = [];
    if (this.bProfile.languagesSpoken) {
      for (let i = 0; i < this.bProfile.languagesSpoken.length; i++) {
        holdsellang.push(this.bProfile.languagesSpoken[i]);
      }
    }*/
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
          if (this.bProfile.languagesSpoken) {
            if (this.bProfile.languagesSpoken.length > 0) {
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

  handleGalleryImages() {
    this.gallerydialogRef = this.dialog.open(ProviderBprofileSearchGalleryComponent, {
      width: '50%',
      // panelClass: 'gallerymainclass',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        bprofile: this.bProfile,
        type: 'edit'
      }
    });
    this.gallerydialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getGalleryImages();
        }
      }
    });
  }
  // get the logo url for the provider
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
          const cnow = new Date();
          const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
          this.cacheavoider = dd;
          let logo = '';
          if (this.blogo[0]) {
            logo = this.blogo[0].url;
          } else {
            logo = '';
          }
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
        const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
        this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
          || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '', true);

        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedfunctionobj.sendMessage(pdata);
      },
        () => {

        });
  }
  // handles the image display on load and on change
  imageSelect(input) {
    this.success_error = null;
    this.error_list = [];
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
          }
          // else if (this.error_list[0].size) {
          //   this.error_msg = 'Please upload images with size less than 5mb';
          // }
          // this.error_msg = 'Please upload images with size < 5mb';
          this.sharedfunctionobj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
        }
      }
    }
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
        const today = new Date();
        // logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
        logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + this.cacheavoider : '';
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }
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
  deletePrivacysettingsConfirm(mod, indx) {
    let msg = '';
    if (mod === 'phone') {
      msg = Messages.BPROFILE_PRIVACY_PHONE_DELETE;
      msg = msg.replace('[DATA]', this.phonearr[indx].number);
    } else if (mod === 'email') {
      msg = Messages.BPROFILE_PRIVACY_EMAIL_DELETE;
      msg = msg.replace('[DATA]', this.emailarr[indx].emailid);
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': msg,
        'heading': 'Delete Confirmation'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePrivacysettings(mod, indx);
      }
    });
  }
  deletePrivacysettings(mod, indx) {
    const temparr = [];
    let post_itemdata: any = [];
    if (mod === 'phone') {
      for (let i = 0; i < this.phonearr.length; i++) {
        if (i !== indx) {
          temparr.push({
            'label': this.phonearr[i].label,
            'resource': 'Phoneno',
            'instance': this.phonearr[i].number,
            'permission': this.phonearr[i].permission
          });
        }
      }
      post_itemdata = {
        'phoneNumbers': temparr
      };
    } else if (mod === 'email') {
      for (let i = 0; i < this.emailarr.length; i++) {
        if (i !== indx) {
          temparr.push({
            'label': this.emailarr[i].label,
            'resource': 'Email',
            'instance': this.emailarr[i].emailid,
            'permission': this.emailarr[i].permission
          });
        }
      }
      post_itemdata = {
        'emails': temparr
      };
    }
    this.UpdatePrimaryFields(post_itemdata);
  }
  // updating the phone number and email ids
  UpdatePrimaryFields(pdata) {
    this.provider_services.updatePrimaryFields(pdata)
      .subscribe(
        data => {
          this.bProfile = data;
          this.setPrivacyDetails();
        },
        () => {
          // this.api_error = error.error;
        }
      );
  }
  /*getLicenseMetadata() {
    this.provider_services.getLicenseMetadata()
      .subscribe (data => {
        this.license_metadata = data;
        this.adwordsmaxcount = this.getLicenseMeticvalue(8, 'anyTimeValue');
        this.getAdwords();
      });
  }*/
  /*getLicenseMeticvalue(metricid, fieldname) {
    const packageid = this.currentlicense_details.accountLicense.licPkgOrAddonId;
    for (let i = 0; i < this.license_metadata.length; i++) {
      if (this.license_metadata[i].pkgId === packageid) {
        for (let j = 0; j < this.license_metadata[i].metrics.length ; j++) {
          if (this.license_metadata[i].metrics[j].id === metricid) {
            return this.license_metadata[i].metrics[j][fieldname];
          }
        }
      }
    }
  }*/
  getLicenseDetails() {
    this.provider_services.getLicenseDetails()
      .subscribe(data => {
        this.currentlicense_details = data;
        this.license_details = this.currentlicense_details;
        this.current_license = this.currentlicense_details.accountLicense.licPkgOrAddonId;
      });
  }
  getTotalAllowedAdwordsCnt() {
    this.provider_services.getTotalAllowedAdwordsCnt()
      .subscribe(data => {
        this.currentlicense_details = data;
        this.adwordsmaxcount = this.currentlicense_details;
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
        // this.query_executed = true;
        this.adwords_maxremaining = this.adwordsmaxcount - this.adword_list.length;
        this.adwords_remaining = this.adword_list.length - 2;
      });
  }

  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }

  getDomainVirtualFields() {

    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          // this.domain_questions = data;
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          // normal_domainfield_show = 4 // no data
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
                  // commented bcoz update not effect without refresh
                  // this.domain_fields = this.setFieldValue(this.domain_fields, null);
                } else {
                  // commented bcoz update not effect without refresh
                  this.getSubDomainVirtualFields();
                  // this.subdomain_fields = this.setFieldValue(this.subdomain_fields, this.bProfile['serviceSubSector']['subDomain']);
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
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          this.subdomain_fields = data['fields'];
          this.subdomain_questions = data['questions'] || [];
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
          // normal_subdomainfield_show = 4 // no data
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
  show_privacyText(txt) {
    let rettxt = '';
    if (txt === 'customersOnly') {
      if (this.customernormal_label !== '' && this.customernormal_label !== undefined && this.customernormal_label !== null) {
        rettxt = 'My ' + this.sharedfunctionobj.firstToUpper(this.customernormal_label) + 's Only';
      } else {
        rettxt = 'My ' + this.privacypermissiontxt[txt] + 's Only';
      }
    } else if (txt === 'all') {
      rettxt = 'Public';
    } else {
      rettxt = 'Private';
    }
    return rettxt;
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/learnmore/profile-search->' + mod]);
    // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    // this.sharedfunctionobj.sendMessage(pdata);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'bprofile', 'subKey': mod };
  //   return moreOptions;
  // }

  editCustomId(customId?) {
    this.normal_customid_show = 1;
    if (customId) {
      this.editMode = 1;
      this.customForm.setValue({ 'customid': customId });
    } else {
      this.editMode = 0;
    }
  }

  deleteCustomId(customId) {
    this.provider_services.removeCustomId(customId).subscribe(
      data => {
        delete this.bProfile['customId'];
        this.normal_customid_show = 2;
      });
    this.customForm.setValue({ 'customid': '' });
  }
  cancelCusUpdt() {
    this.customForm.setValue({ 'customid': '' });
    if (this.editMode === 0) {
      this.normal_customid_show = 2;
    } else {
      this.normal_customid_show = 3;
    }
    this.editMode = 3;
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

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
