import { Component, OnDestroy, OnInit } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { FormBuilder } from '@angular/forms';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { UserBprofileSearchPrimaryComponent } from './user-bprofile-search-primary/user-bprofile-search-primary.component';

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
  
  current_status_cap = Messages.BPROFILE_CURRENT_STATUS;
  on_cap = Messages.BPROFILE_ON_CAP;
  off_cap = Messages.BPROFILE_OFF_CAP;
  profile_visible_cap = Messages.BPROFILE_VISIBILITY_CAP;
  online_jaldee_cap = Messages.BPROFILE_ONLINE_JALDEE_CAP;
  offline_cap = Messages.BPROFILE_OFFLINE_CAP;
  
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
      url: '/provider/settings/miscellaneous',
      title: 'Miscellaneous'
    },
    {
      url: '/provider/settings/miscellaneous/users',
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
  userdata;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private sharedfunctionobj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions,
    private sanitizer: DomSanitizer, private fb: FormBuilder,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    private activated_route: ActivatedRoute,
    public fed_service: FormMessageDisplayService,
    private shared_services: SharedServices) {
    this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    this.activated_route.queryParams.subscribe(data => {
      // console.log(data);
      this.userdata = data;
      console.log(this.userdata.id);
  }
  );

  }

  ngOnInit() {
    
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
                title: this.userdata.type
            });
            this.breadcrumbs = breadcrumbs;
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

  getBusinessProfile() {
    this.bProfile = [];
    this.getBussinessProfileApi()
      .then(
        data => {
          this.bProfile = data;
          console.log(this.bProfile);
          // this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
          //   domainfields => {
          //     this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
          //       subdomainfields => {
          //         this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields);
          //       });
          //   });
         // this.provider_datastorage.set('bProfile', data);

          //const loginuserdata = this.sharedfunctionobj.getitemFromGroupStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          //loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          //this.sharedfunctionobj.setitemToGroupStorage('ynw-user', loginuserdata);
         // this.serviceSector = data['serviceSector']['displayName'] || null;
          if (this.bProfile.status === 'ACTIVE') {
            this.normal_profile_active = 3;
          } else {
            this.normal_profile_active = 2;
          }

          // if (this.bProfile['serviceSector'] && this.bProfile['serviceSector']['domain']) {
          //   const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          //   // calling function which saves the business related details to show in the header
          //   this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
          //     || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
          //   const pdata = { 'ttype': 'updateuserdetails' };
          //   this.sharedfunctionobj.sendMessage(pdata);
          //   this.getProviderLogo();
          // }


          // check whether normal business profile section can be displayed
          if ((this.bProfile.businessName !== '' && this.bProfile.businessName !== undefined)
            || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined)) {
              this.getProviderLogo();
            this.normal_basicinfo_show = 3;
          } else {
            this.normal_basicinfo_show = 2;
          }

          // check whether domain fields exists
         // const statusCode = this.provider_shared_functions.getProfileStatusCode(this.bProfile);
          //this.sharedfunctionobj.setitemToGroupStorage('isCheckin', statusCode);

        },
        () => {
          this.normal_basicinfo_show = 2;
        }
      );
  }
  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getUserBussinessProfile(_this.userdata.id)
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


  showBPrimary() {
    this.primarydialogRef = this.dialog.open(UserBprofileSearchPrimaryComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        type: 'edit',
        bprofile: this.bProfile,
        userId: this.userdata.id
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
        //  const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
          // calling function which saves the business related details to show in the header
          this.sharedfunctionobj.setBusinessDetailsforHeaderDisp('', '', '', logo);
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
  

  




  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
  }




specializations() {
  console.log(this.userdata);
  const navigationExtras: NavigationExtras = {
    queryParams: {
        id: this.userdata.id
        }

};
    this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users',this.userdata.id,'bprofile','specializations'], navigationExtras);
}
additionalInfo() {
  const navigationExtras: NavigationExtras = {
    queryParams: {
        id: this.userdata.id
    }
};
    this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users',this.userdata.id,'bprofile','additionalinfo'], navigationExtras);
}
languagesKnown() {
    this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users',this.userdata.id,'bprofile','languages']);
}
galerySocialmedia() {
    this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users',this.userdata.id,'bprofile','media']);
}
  
}
