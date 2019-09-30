import { Component, OnDestroy, OnInit } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { Image, PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, ButtonEvent } from 'angular-modal-gallery';
import { projectConstants } from '../../../shared/constants/project-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderBprofileSearchPrimaryComponent } from '../../../ynw_provider/components/provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { AddProviderWaitlistLocationsComponent } from '../../../ynw_provider/components/add-provider-waitlist-locations/add-provider-waitlist-locations.component';
import { ProviderBprofileSearchSchedulepopupComponent } from '../../../ynw_provider/components/provider-bprofile-search-schedulepopup/provider-bprofile-search-schedulepopup';
import { AddProviderBprofileSearchAdwordsComponent } from '../../../ynw_provider/components/add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';

@Component({
  selector: 'app-bprofile',
  templateUrl: './bprofile.component.html'
})

export class BProfileComponent implements OnInit, OnDestroy {
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
  path = window.location.host;

  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;
  error_msg = '';

  loc_badges: any = [];
  badge_map_arr: any = [];
  loc_list: any = [];
  mapurl;
  base_loc: any = [];

  schedule_arr: any = [];
  display_schedule: any = [];


  currentlicense_details: any = [];

  blogo: any = [];
  item_pic = {
    files: [],
    base64: null
  };
  selitem_pic = '';
  profimg_exists = false;
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
      title: 'Profile & Search'
    }
  ];
  businessConfig: any = [];
  multipeLocationAllowed = false;
  customer_label = '';
  maintooltip = this.sharedfunctionobj.getProjectMesssages('BPROFILE_TOOPTIP');
  primarydialogRef;
  loceditdialogRef;
  addlocdialogRef;
  scheduledialogRef;
  adworddialogRef;
  cacheavoider = '';
  frm_public_search_cap = '';
  frm_public_search_off_cap = '';
  frm_adword_cap = '';
  frm_loc_amen_cap = '';
  frm_profile_name_cap = Messages.FRM_LEVEL_PROFILE_NAME_CAP;
  frm_loc_cap = Messages.FRM_LEVEL_LOC_MSG;
  frm_working_hr_cap = Messages.FRM_LEVEL_WORKING_MSG;
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
    private shared_services: SharedServices) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.custm_id = Messages.CUSTM_ID.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.customForm = this.fb.group({
      // customid: ['', Validators.compose([Validators.required])]
      customid: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_ALPHANUMERIC_HYPHEN)])]
    });

    this.getLicenseDetails();
    // this.getLicenseMetadata();
    this.getTotalAllowedAdwordsCnt();
    this.getLocationBadges();
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // this.display_schedule =  this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
    this.getPublicSearch();
    // this.getBusinessProfile();
    this.getBusinessConfiguration();
    this.getProviderLocations();
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'profile-search->public-search' };
    this.frm_public_search_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_public_search_off_cap = Messages.FRM_LEVEL_PUBLIC_SEARCH_MSG_OFF.replace('[customer]', this.customer_label);
    this.frm_adword_cap = Messages.FRM_LEVEL_ADWORDS_MSG.replace('[customer]', this.customer_label);
    this.frm_loc_amen_cap = Messages.FRM_LEVEL_LOC_AMENITIES_MSG.replace('[customer]', this.customer_label);
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
          if (this.bProfile.status === 'ACTIVE') {
            this.normal_profile_active = 3;
          } else {
            this.normal_profile_active = 2;
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
            const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            // calling function which saves the business related details to show in the header
            this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
              || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
            const pdata = { 'ttype': 'updateuserdetails' };
            this.sharedfunctionobj.sendMessage(pdata);
            this.getProviderLogo();
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
        // this.routerobj.navigate(['/provider/settings/waitlist-manager/location-detail/' + locid]);
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
  }
  editQueue() {
    if (this.bProfile.baseLocation) {
      const locid = this.bProfile.baseLocation.id;
      if (locid) {
        this.routerobj.navigate(['/provider/settings/waitlist-manager/location-detail/' + locid]);
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
          } else if (this.error_list[0].size) {
            this.error_msg = 'Please upload images with size less than 5mb';
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
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/learnmore/profile-search->' + mod]);
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
  // copyInputMessage(inputElement) {
  //   inputElement.select();
  //   document.execCommand('copy');
  //   inputElement.setSelectionRange(0, 0);
  // }

  copyInputMessage(valuetocopy) {
    const path = this.path + '/#' + valuetocopy;
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
}
