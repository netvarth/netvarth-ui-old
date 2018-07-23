import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
// import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {
  AccessibilityConfig, Action, AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Description, DescriptionStrategy,
  DotsConfig, GridLayout, Image, ImageModalEvent, LineLayout, PlainGalleryConfig, PlainGalleryStrategy, PreviewConfig
} from 'angular-modal-gallery';


import { HeaderComponent } from '../../../shared/modules/header/header.component';
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
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Local } from 'protractor/built/driverProviders';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';



@Component({
    selector: 'app-provider-bprofile-search',
    templateUrl: './provider-bprofile-search.component.html',
    styleUrls: ['./provider-bprofile-search.component.scss']
})

export class ProviderBprofileSearchComponent implements OnInit {
  checked = false;
  bProfile = null;
  serviceSector = null;
  public_search = false;

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
  adwords_maxremaining = 0;
  adwords_remaining = 0;
  adwordshow_list: any = [];
  privacypermissiontxt = projectConstants.PRIVACY_PERMISSIONS;
  searchquestiontooltip = '';
  tooltipcls = projectConstants.TOOLTIP_CLS;
  breadcrumb_moreoptions: any =  [];
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
  loadingParams: any = {'diameter' : 40, 'strokewidth': 15};

  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy:  ButtonsStrategy.CUSTOM,
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
      title: 'Profile & Search'
    }
  ];

  customer_label = '';

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private sharedfunctionobj: SharedFunctions,
  private sanitizer: DomSanitizer,
  private dialog: MatDialog,
  private routerobj: Router,
  private service: QuestionService) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.searchquestiontooltip = this.sharedfunctionobj.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
  }

  ngOnInit() {
    this.getSpokenLanguages();
    // this.getLicenseDetails();
    // this.getLicenseMetadata();
    this.getTotalAllowedAdwordsCnt();
    this.getLocationBadges();
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    // console.log('icons', this.badgeIcons);
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
    // this.display_schedule =  this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
    this.getPublicSearch();
    this.getBusinessProfile();
    this.getGalleryImages();
    this.getProviderLocations();
    this.breadcrumb_moreoptions = {'show_learnmore': true};
  }
  getPublicSearch() {
    this.provider_services.getPublicSearch()
    .subscribe(
      data => {
       this.public_search = (data && data.toString() === 'true') ? true : false;
       this.normal_search_active = this.public_search;
       // console.log('search_status', this.normal_search_active);
      },
      error => {

      }
    );
  }
  handle_searchstatus() {
    const changeTostatus = (this.normal_search_active === true) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe (data => {
          this.getPublicSearch();
      });
  }

  getBusinessProfile() {
    this.bProfile = [];

    this.getBussinessProfileApi()
    .then(
      data => {
        this.bProfile = data;
        this.provider_datastorage.set('bProfile', data);
        const loginuserdata = this.sharedfunctionobj.getitemfromLocalStorage('ynw-user');
        // setting the status of the customer from the profile details obtained from the API call
        loginuserdata.accStatus = this.bProfile.status;
        // Updating the status (ACTIVE / INACTIVE) in the local storage
        this.sharedfunctionobj.setitemonLocalStorage('ynw-user', loginuserdata);

        this.serviceSector = data['serviceSector']['displayName'] || null;
        this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
        this.getSpecializations(data['serviceSector']['domain'], data['serviceSubSector']['subDomain']);
        this.specialization_title = (data['serviceSubSector']['displayName'])  ?
         data['serviceSubSector']['displayName'] : '';

        // console.log('bprofile', this.bProfile);
        // console.log('bprofile - status', this.bProfile.status);
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
          if (this.bProfile.baseLocation.parkingType || this.bProfile.baseLocation.open24hours
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
              Object.keys(this.bProfile['domainVirtualFields']) .length === 0) {
                this.normal_domainfield_show = 2;
          }

          // calling function which saves the business related details to show in the header
          this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
           || '', this.bProfile['serviceSector']['displayName'] || '', '');

           const pdata = { 'ttype': 'updateuserdetails' };
           this.sharedfunctionobj.sendMessage(pdata);

          this.getProviderLogo();
          this.getDomainVirtualFields();

          if (this.bProfile['subDomainVirtualFields'] &&
          Object.keys(this.bProfile['subDomainVirtualFields']) .length === 0) {
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
         || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined) ) {
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
            this.display_schedule =  this.sharedfunctionobj.arrageScheduleforDisplay(this.schedule_arr);
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
                 this.social_arr.push({'Sockey': this.bProfile.socialMedia[i].resource, 'Socurl': this.bProfile.socialMedia[i].value });
              }
            }
          }
        }
        // this.prepare_sociallist();

        // check whether domain fields exists


      },
      error => {

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
        error => {
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
          this.phonearr.push (
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
          this.emailarr.push (
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
        // console.log(this.image_list);
        this.image_showlist = [];
        this.image_list_popup = [];
        this.image_remaining_cnt = 0;
        if (this.image_list.length > 0) {
          for (let i = 0; i < this.image_list.length; i++) {
              const imgobj = new Image(
                i,
                { // modal
                  img: this.image_list[i].url
                });
              this.image_list_popup.push(imgobj);
            }
          this.normal_gallery_show = 3;
        } else {
          this.normal_gallery_show = 2;
        }
      },
      error => {

      }
    );

  }
  confirmDelete(file, indx) {
    // console.log('delete', file);
    const skey = this.image_list[indx].keyName;
    file.keyName = skey;
    // console.log('from confirm', file, indx);
    this.sharedfunctionobj.confirmGalleryImageDelete(this, file);
  }

  deleteImage(file, bypassgetgallery?) {
    this.provider_services.deleteProviderGalleryImage(file.keyName)
    .subscribe(
      data => {
      // this.sharedfunctionobj.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_DELETE);
        if (!bypassgetgallery) {
          this.getGalleryImages();
        }
      },
      error => {

      }
    );

  }
  onButtonBeforeHook(event: ButtonEvent) {

    // console.log('onButtonBeforeHook ', event);

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

      // console.log('delete in app with images count ' + this.images.length);
      // console.log('event', event.image, event.image.id);
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
      // console.log('delete lightbox', file);
      // this.confirmDelete(file, event.image.id);
      this.deleteImage(file, true);
      this.image_list_popup = this.image_list_popup.filter((val: Image) => event.image && val.id !== event.image.id);
    }
  }

  onButtonAfterHook(event: ButtonEvent) {
    // console.log('onCustomButtonAfterHook ', event);
    if (!event || !event.button) {
      return;
    }
    // Invoked after both a click on a button and its related action.
  }
  onVisibleIndex(event: ImageModalEvent) {
    // console.log('onVisibleIndex action: ' + Action[event.action]);
    // console.log('onVisibleIndex result:' + event.result);
  }

  changePublicSearch(event) {
    const is_check = (event.checked) ? 'ENABLE' : 'DISABLE';
    this.provider_services.updatePublicSearch(is_check)
    .subscribe(
      data => {},
      error => {}
    );
  }

  showBPrimary() {
    const dialogRef = this.dialog.open(ProviderBprofileSearchPrimaryComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: {
        type : 'edit',
        bprofile: this.bProfile
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
        }
      }
    });
  }
  getLocationBadges() {
    this.provider_services.getLocationBadges()
     .subscribe (data => {
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
        const dialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
          autoFocus: false,
          data: {
            location : this.base_loc,
            badges: this.loc_badges,
            type : 'edit',
            // source: 'bprofile',
            source: 'waitlist',
            forbadge: (badge) ? true : false
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('edit location return', result);
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
    // to be taken to the location details page under waitlist manager when clicked on
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
        this.routerobj.navigate(['/provider/settings/waitlist-manager/location-detail/' + locid]);
      }
    }
  }
  addLocation() {
    const dialogRef = this.dialog.open(AddProviderWaitlistLocationsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'locationoutermainclass'],
      autoFocus: true,
      data: {
        // location : this.base_loc,
        badges: this.loc_badges,
        type : 'add',
        source: 'bprofile'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
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
         // console.log('base', loc['place'], loc['baseLocation']);
          if (loc['baseLocation']) {
            this.base_loc = loc;
            // console.log(this.base_loc);
            this.mapurl = null;
            if (this.base_loc.lattitude !== '' &&
            this.base_loc.longitude !== '') {
              this.mapurl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?zoom=11&center=' + this.base_loc.lattitude + ',' + this.base_loc.longitude + '&key=AIzaSyBy0c2wXOnE16A7Xr4NKrELGa_m_8KCy6U');
            }

            // console.log(this. mapurl);
          }
        }
        // console.log('base loc', this.base_loc);
      });
  }
  getmapurl() {
    return this.base_loc.googleMapUrl; // 'https://www.google.com/maps/embed/v1/view?zoom=11&center=10.5276,76.2144&key=AIzaSyARtnqchjx36syKsRJyO_fWZHI4Fuv-SW4';
  }
  handlePrivacysettings(typ?, peditindx?) {
    // console.log('indx before', peditindx);
    const dialogRef = this.dialog.open(AddProviderBprofilePrivacysettingsComponent, {
      width: '50%',
      // panelClass: 'privacysettingsmainclass',
      panelClass: ['commonpopupmainclass', 'privacyoutermainclass'],
      autoFocus: true,
      data: {
        bprofile : this.bProfile,
        editindx : peditindx,
        curtype: typ
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.message === 'reloadlist') {
          this.bProfile = result.data;
          this.setPrivacyDetails();
      }
      console.log(result);
    }
    });
  }
  editSocialmedia(key) {
    this.handleSocialmedia(key);
  }
  handleSocialmedia(key) {
    const dialogRef = this.dialog.open(ProviderBprofileSearchSocialMediaComponent, {
      width: '50%',
      // panelClass: 'socialmediamainclass',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: {
        bprofile : this.bProfile,
        editkey : key || ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'reloadlist') {
          this.getBusinessProfile();
      }
    }
    });
  }
  deleteSocialmedia(sockey) {
    const temparr: any = [];
    const post_data: any = [];
    for (let i = 0; i < this.social_arr.length; i++) {
      if (this.social_arr[i].Sockey !== sockey) {
        post_data.push({'resource': this.social_arr[i].Sockey, 'value': this.social_arr[i].Socurl});
      }
    }
      const submit_data = {
        'socialMedia': post_data
      };
      this.provider_services.updateSocialMediaLinks(submit_data)
      .subscribe(
        data => {
            this.getBusinessProfile();
        },
        error => {

        }
      );

  }
  getSpecializations(domain, subdomain) {
    this.provider_services.getSpecializations(domain, subdomain)
      .subscribe ( data => {
        this.specialization_arr = data;
      });
  }
  getSpecializationName(n) {
    for ( let i = 0; i < this.specialization_arr.length; i++) {
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
    // console.log('indx before', peditindx);
    const dialogRef = this.dialog.open(AddProviderBprofileSpecializationsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'privacyoutermainclass'],
      autoFocus: false,
      data: {
        selspecializations : bprof,
        specializations: special
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('returned', result);
        if (result['mod'] === 'reloadlist') {
          // this.getBusinessProfile();
        //  console.log('org bprofile', this.bProfile);
       //   console.log('returned bprofile', result['data']);
          this.bProfile = result['data'];
         // console.log('returned', result);

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
      .subscribe ( data => {
        this.languages_arr = data;
      });
  }
  getlanguageName(n) {
    for ( let i = 0; i < this.languages_arr.length; i++) {
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
    // console.log('indx before', peditindx);
    const dialogRef = this.dialog.open(AddProviderBprofileSpokenLanguagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'privacyoutermainclass'],
      autoFocus: false,
      data: {
        sellanguages : bprof,
        languagesSpoken: lang
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('returned', result);
        if (result['mod'] === 'reloadlist') {
          // this.getBusinessProfile();
        //  console.log('org bprofile', this.bProfile);
       //   console.log('returned bprofile', result['data']);
          this.bProfile = result['data'];
         // console.log('returned', result);

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
    const dialogRef = this.dialog.open(ProviderBprofileSearchGalleryComponent, {
      width: '50%',
      // panelClass: 'gallerymainclass',
      panelClass: 'commonpopupmainclass',
      autoFocus: false,
      data: {
        bprofile : this.bProfile,
        type : 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
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
        // console.log('here logo', this.blogo);
        let logo = '';
        if (this.blogo[0]) {
          logo = this.blogo[0].url;
        } else {
          logo = '';
        }
        // calling function which saves the business related details to show in the header
        this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
         || '', this.bProfile['serviceSector']['displayName'] || '', logo );

        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedfunctionobj.sendMessage(pdata);
      },
      error => {

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
        // console.log('after upload logo', this.blogo);
       // calling function which saves the business related details to show in the header

       const today = new Date();
       const tday = today.toString().replace(/\s/g, '');
       const blogo = this.blogo[0].url + '?' + tday;

       this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
        || '', this.bProfile['serviceSector']['displayName'] || '', blogo || '' );

        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedfunctionobj.sendMessage(pdata);
       /// this.api_success = Messages.BPROFILE_LOGOUPLOADED;
      },
      error => {
       // this.api_error = error.error;
      }
      );
  }
  // handles the image display on load and on change
  imageSelect(input, ev) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      this.item_pic.files = input.files[0];
      this.selitem_pic = input.files[0];

      const fileobj = input.files[0];
      reader.onload = (e) => {
        this.item_pic.base64 = e.target['result'];
      };
      reader.readAsDataURL(fileobj);
    }
    // Handles the case of uploading the logo from bProfile edit page
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
        const tday = today.toString().replace(/\s/g, '');
        // logourl = (this.blogo[0].url) ? this.blogo[0].url + '?' + tday : '';
        logourl = (this.blogo[0].url) ? this.blogo[0].url : '';
      }
      return this.sharedfunctionobj.showlogoicon(logourl);
    }
  }

  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

  change_schedulepopup() {
    // console.log('change schedule');
    const dialogRef = this.dialog.open(ProviderBprofileSearchSchedulepopupComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: false,
      data: {
        schedule_arr : this.schedule_arr,
        bProfile: this.bProfile,
        type : 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
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

  deletePrivacysettings(mod, indx) {
    const temparr = [];
    let post_itemdata: any = [];
    if (mod === 'phone') {
      // console.log('delete ', this.phonearr[indx]);
      for (let i = 0; i < this.phonearr.length; i++) {
        if (i !== indx ) {
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
      // console.log('here', post_itemdata);
    } else if (mod === 'email') {
      // console.log('delete ', this.emailarr[indx]);
      for (let i = 0; i < this.emailarr.length; i++) {
        if (i !== indx ) {
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
      // console.log('here', post_itemdata);
    }
    this.UpdatePrimaryFields(post_itemdata, indx);
  }
  // updating the phone number and email ids
  UpdatePrimaryFields(pdata, indx) {
    this.provider_services.updatePrimaryFields(pdata)
      .subscribe(
      data => {
        this.bProfile = data;
        this.setPrivacyDetails();
      },
      error => {
        // this.api_error = error.error;
      }
      );
  }
  /*getLicenseMetadata() {
    this.provider_services.getLicenseMetadata()
      .subscribe (data => {
        this.license_metadata = data;
        this.adwordsmaxcount = this.getLicenseMeticvalue(8, 'anyTimeValue');
        // console.log('adword count', this.adwordsmaxcount);
        this.getAdwords();
      });
  }*/
  /*getLicenseMeticvalue(metricid, fieldname) {
    const packageid = this.currentlicense_details.accountLicense.licPkgOrAddonId;
    // console.log('packageid', packageid);
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
  /*getLicenseDetails() {
    this.provider_services.getLicenseDetails()
      .subscribe(data => {
        this.currentlicense_details = data;
        // console.log('license', this.currentlicense_details);
        this.getLicenseMetadata();
      });
  }*/
  getTotalAllowedAdwordsCnt() {
    this.provider_services.getTotalAllowedAdwordsCnt()
      .subscribe (data => {
        this.currentlicense_details = data;
        // console.log('this', this.currentlicense_details);
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
            this.adwordshow_list.push (this.adword_list[i]);
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
    // console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
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
           // console.log(data);
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

  deleteGridDynamicField(field_name,  type = 'domain_questions', index = 0) {
    const pre_value =  (type === 'domain_questions') ?  JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields'])) :
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

  editDynamicField(field_name , type) {

    const field = this.getFieldQuestion(field_name, type);
    this.showDynamicFieldPopup(field, type);

  }

  showDynamicFieldPopup(field, type, grid_row_index= null ) {


    const dialogRef = this.dialog.open(ProviderBprofileSearchDynamicComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: {
        type: type,
        questions: field,
        bProfile: this.bProfile,
        grid_row_index: grid_row_index
      }
    });
    dialogRef.afterClosed().subscribe(result => {
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
            error => {

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
         // console.log(data);
          this.subdomain_fields = data['fields'];
          this.subdomain_questions = data['questions'] || [];
          this.normal_subdomainfield_show = (this.normal_subdomainfield_show === 2) ? 4 : 3;
          // normal_subdomainfield_show = 4 // no data
      }
    );

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
        error => {
          reject();
        }
      );

    });

  }

  setFieldValue(data, subdomin) {

        let fields = [];
        // console.log(data, subdomin);
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
                delete data[i]['value'] ;
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
        if (que.key === field_key ) {
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
      data => {
        this.getBusinessProfile();
      },
      error => {
        this.getBusinessProfile(); // refresh data ;
      }
    );

  }

  onSubDomainFormSubmit(post_data) {

      this.provider_services.updateDomainSubDomainFields(post_data, null,
        this.bProfile['serviceSubSector']['subDomain'])
      .subscribe(
          data => {
            this.getBusinessProfile();
          },
          error => {
            this.getBusinessProfile(); // refresh data ;
          }
        );

  }

  addAdwords() {
    const dialogRef = this.dialog.open(AddProviderBprofileSearchAdwordsComponent, {
      width: '50%',
      data: {
        type : 'add'
      },
      panelClass: ['commonpopupmainclass']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getAdwords();
      }
    });
  }

  buyAdwords() {
      this.routerobj.navigate(['provider' , 'settings', 'license']);
  }

}
