import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderBprofileSearchPrimaryComponent } from '../../../../../ynw_provider/components/provider-bprofile-search-primary/provider-bprofile-search-primary.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-manageonlineprofile',
    templateUrl: './manageonlineprofile.component.html'
})
export class ManageOnlineProfileComponent implements OnInit {
    breadcrumbs_init = [
        {
            url: '/provider/settings',
            title: 'Settings'
        },
        {
            url: '/provider/settings/miscellaneous',
            title: 'Miscellaneous'
        },
        {
            title: 'Users',
            url: '/provider/settings/miscellaneous/users'
        }
        
    ];
    domain;
    breadcrumbs = this.breadcrumbs_init;
    isCorp = false;
    isMultilevel = false;
    accountType: any;
    cust_domain_name = '';
    provider_domain_name = '';
    customer_label = '';
    provider_label = '';
    userName;

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
    businessConfig: any = [];
 // customer_label = '';
  maintooltip = this.sharedfunctionObj.getProjectMesssages('BPROFILE_TOOPTIP');
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
 // domain;


    constructor(
        private router: Router,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private shared_services: SharedServices,
        private provider_datastorage: ProviderDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    private dialog: MatDialog,
        private activatedRoot: ActivatedRoute,
    ) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        this.provider_label = this.sharedfunctionObj.getTerminologyTerm('provider');
        this.activatedRoot.queryParams.subscribe(data => {
            this.userName = data;
            console.log( this.userName.id);

        });
    }
    ngOnInit() {
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
        });
        breadcrumbs.push({
            title: this.userName.type.charAt(0).toUpperCase() + this.userName.type.slice(1)
            
        });
        breadcrumbs.push({
            title: 'Online profile'
        });
        this.breadcrumbs = breadcrumbs;
        this.getDomainSubdomainSettings();
        this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]',this.customer_label);
        this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]',this.provider_label);
        this.frm_lang_cap = Messages.FRM_LEVEL_LANG_MSG.replace('[customer]', this.customer_label);
    this.frm_additional_cap = Messages.FRM_LEVEL_ADDITIONAL_MSG.replace('[customer]', this.customer_label);
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.badgeIcons = projectConstants.LOCATION_BADGE_ICON;
    this.getBusinessConfiguration();
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
        console.log('businessprofile');
        this.bProfile = [];
        this.getBussinessProfileApi()
          .then(
            data => {
              this.bProfile = data;
              console.log(this.bProfile);
              this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
                domainfields => {
                  this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
                    subdomainfields => {
                      this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields);
                    });
                });
              this.provider_datastorage.set('bProfile', data);
    
              const loginuserdata = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
              // setting the status of the customer from the profile details obtained from the API call
              loginuserdata.accStatus = this.bProfile.status;
              // Updating the status (ACTIVE / INACTIVE) in the local storage
              this.sharedfunctionObj.setitemToGroupStorage('ynw-user', loginuserdata);
              this.serviceSector = data['serviceSector']['displayName'] || null;
              if (this.bProfile.status === 'ACTIVE') {
                this.normal_profile_active = 3;
              } else {
                this.normal_profile_active = 2;
              }
    
              if (this.bProfile['serviceSector'] && this.bProfile['serviceSector']['domain']) {
                const subsectorname = this.sharedfunctionObj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
                // calling function which saves the business related details to show in the header
                this.sharedfunctionObj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
                  || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '');
                const pdata = { 'ttype': 'updateuserdetails' };
                this.sharedfunctionObj.sendMessage(pdata);
                this.getProviderLogo();
              }
    
    
              // check whether normal business profile section can be displayed
              if ((this.bProfile.businessName !== '' && this.bProfile.businessName !== undefined)
                || (this.bProfile.businessDesc !== '' && this.bProfile.businessDesc !== undefined)) {
                this.normal_basicinfo_show = 3;
              } else {
                this.normal_basicinfo_show = 2;
              }
    
              // check whether domain fields exists
              const statusCode = this.provider_shared_functions.getProfileStatusCode(this.bProfile);
              this.sharedfunctionObj.setitemToGroupStorage('isCheckin', statusCode);
    
            },
            () => {
    
            }
          );
      }

      getBussinessProfileApi() {
        console.log("api");
        const _this = this;
        return new Promise(function (resolve, reject) {
          _this.provider_services.getUserBussinessProfile(_this.userName.id)
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
    
      // handles the image display on load and on change
      imageSelect(input) {
        this.success_error = null;
        this.error_list = [];
        if (input.files && input.files[0]) {
          for (const file of input.files) {
            this.success_error = this.sharedfunctionObj.imageValidation(file);
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
              this.sharedfunctionObj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
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
              const subsectorname = this.sharedfunctionObj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
              // calling function which saves the business related details to show in the header
              this.sharedfunctionObj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
                || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', logo);
    
              const pdata = { 'ttype': 'updateuserdetails' };
              this.sharedfunctionObj.sendMessage(pdata);
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
              const subsectorname = this.sharedfunctionObj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
              this.sharedfunctionObj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
                || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', blogo || '');
    
              const pdata = { 'ttype': 'updateuserdetails' };
              this.sharedfunctionObj.sendMessage(pdata);
              /// this.api_success = Messages.BPROFILE_LOGOUPLOADED;
            },
            error => {
              this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              // this.api_error = error.error;
            }
          );
      }
      confirmLogoremove(keyname) {
        this.sharedfunctionObj.confirmLogoImageDelete(this, keyname);
      }
      removeLogo(keyname) {
        this.provider_services.deleteLogo(keyname)
          .subscribe(() => {
            // calling function which saves the business related details to show in the header
            this.blogo = [];
            this.profimg_exists = false;
            const subsectorname = this.sharedfunctionObj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            this.sharedfunctionObj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
              || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', '', true);
    
            const pdata = { 'ttype': 'updateuserdetails' };
            this.sharedfunctionObj.sendMessage(pdata);
          },
            () => {
    
            });
      }
    //   learnmore_clicked(mod, e) {
    //     e.stopPropagation();
    //     this.routerobj.navigate(['/provider/' + this.domain + '/profile-search->' + mod]);
    //   }


    onlineProfile() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile']);
    }
    specializations() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','specializations']);
    }
    additionalInfo() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','additionalinfo']);
    }
    languagesKnown() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','languages']);
    }
    galerySocialmedia() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users','manageonlineprofile','bprofile','media']);
    }
    
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
    }
    getDomainSubdomainSettings() {
        const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.accountType = user_data.accountType;
        this.domain = user_data.sector || null;
        const sub_domain = user_data.subSector || null;
        return new Promise((resolve, reject) => {
            this.provider_services.domainSubdomainSettings(this.domain, sub_domain)
                .subscribe(
                    (data: any) => {
                        this.isCorp = data.isCorp;
                        this.isMultilevel = data.isMultilevel;
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }
}
