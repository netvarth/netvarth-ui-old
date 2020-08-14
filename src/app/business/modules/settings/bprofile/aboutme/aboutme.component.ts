import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../app.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProPicPopupComponent } from '../../bprofile/pro-pic-popup/pro-pic-popup.component';
import {Location} from '@angular/common';

@Component({
    selector: 'app-aboutme',
    templateUrl: './aboutme.component.html'
})
export class AboutMeComponent implements OnInit {
    profile_name_summary_cap = Messages.SEARCH_PRI_PROF_NAME_SUMMARY_CAP;
    business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
    profile_summary_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    aboutmeForm: FormGroup;
    api_error = null;
    api_success = null;
    show_schedule_selection = false;
    bProfile: any = [];
    formfields;
    disabled_field = false;
    prov_curstatus = '';
    disableButton = false;
    api_loading = true;
    add_cap = Messages.ADD_BTN;
    profile_pic_cap = Messages.PROFILE_PICTURE_CAP;
    pic_cap = Messages.BPROFILE_PICTURE_CAP;
    blogo: any = [];
    profimg_exists = false;
    item_pic = {
      files: [],
      base64: null
    };
    cacheavoider = '';
    notedialogRef: any;
    logoExist = false;
    success_error = null;
    error_list = [];
    selitem_pic = '';
    error_msg = '';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_servicesobj: ProviderServices,
        public sharedfunctionObj: SharedFunctions,
        private routerobj: Router,
        private dialog: MatDialog,
        private _location: Location,
        private provider_datastorageobj: ProviderDataStorageService,
        @Inject(DOCUMENT) public document,
    ) {
    }
    ngOnInit() {
       // this.bProfile = this.provider_datastorageobj.get('bProfile');
       this.getBusinessProfile();
    }
     // Creates the form element
  createForm() {
    this.formfields = {
      bname: [{ value: this.bProfile.businessName, disabled: false }, Validators.compose([Validators.required])],
      // shortname: [{ value: this.bProfile.shortName, disabled: false }],
      // bdesc: [{ value: this.bProfile.businessDesc, disabled: false }, Validators.compose([Validators.required])]
      bdesc: [{ value: this.bProfile.businessDesc, disabled: false }]
    };
    this.prov_curstatus = this.bProfile.status;
    this.aboutmeForm = this.fb.group(this.formfields);
  }

    // resets the error messages holders
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
      }
      // Method to handle the add / edit for bprofile
      onSubmit(form_data) {
        const blankpatterm = projectConstantsLocal.VALIDATOR_BLANK;
        form_data.bname = form_data.bname.trim();
        if (blankpatterm.test(form_data.bname)) {
          this.api_error = 'Please enter the business name';
          this.document.getElementById('bname').focus();
          return;
        }
        //   if (form_data.bdesc !== '' && form_data.bdesc.trim() === '') {
        //   this.api_error = 'Please enter the business description';
        //   this.document.getElementById('bdesc').focus();
        //   return;
        //  }
        if (form_data.bdesc) {
          form_data.bdesc = form_data.bdesc.trim();
        }
        /*if (blankpatterm.test(form_data.bdesc)) {
         this.api_error = 'Please enter the business description';
         this.document.getElementById('bdesc').focus();
         return;
        }*/
        if (form_data.bname.length > projectConstants.BUSINESS_NAME_MAX_LENGTH) {
          this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
        } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
          this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
        } else {
          const post_itemdata = {
            'businessName': form_data.bname,
            'businessDesc': form_data.bdesc
            // ,
            // 'shortName': form_data.shortname
          };
          // calling the method to update the primarty fields in bProfile edit page
          this.UpdatePrimaryFields(post_itemdata);
        }
      }
      // saving the primary fields from the bprofile create page
      createPrimaryFields(pdata) {
        this.provider_servicesobj.createPrimaryFields(pdata)
          .subscribe(
            () => {
              this.api_success = this.sharedfunctionObj.getProjectMesssages('BPROFILE_CREATED');
              this.getBusinessProfile();
            },
            error => {
              this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
            }
          );
      }
      uploadLogo(passdata) {
        this.provider_servicesobj.uploadLogo(passdata)
          .subscribe(
            data => {
              this.provider_datastorageobj.updateProfilePicWeightage(true);
           //   this.data.logoExist  = true;
            });
      }
      // updating the primary field from the bprofile edit page
      UpdatePrimaryFields(pdata) {
        this.disableButton = true;
        this.provider_servicesobj.updatePrimaryFields(pdata)
          .subscribe(
            () => {
             // this.api_success = this.sharedfunctionObj.getProjectMesssages('BPROFILE_UPDATED');
              this.sharedfunctionObj.openSnackBar(Messages.BPROFILE_UPDATED);
              setTimeout(() => {
                this.redirecToBprofile();
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
              this.disableButton = false;
            }
          );
      }
      // gets the bprofile details
      getBusinessProfile() {
        this.provider_servicesobj.getBussinessProfile()
          .subscribe(
            data => {
              this.bProfile = data;
              console.log(this.bProfile);
              if (this.bProfile) {
                  this.createForm();
              }
              this.provider_datastorageobj.set('bProfile', data);
              // getting the user details saved in local storage
              const loginuserdata = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
              // setting the status of the customer from the profile details obtained from the API call
              loginuserdata.accStatus = this.bProfile.status;
              // Updating the status (ACTIVE / INACTIVE) in the local storage
              this.sharedfunctionObj.setitemToGroupStorage('ynw-user', loginuserdata);
              this.getProviderLogo();
            },
            () => {
            }
          );
      }

      redirecToBprofile() {
       this.routerobj.navigate(['provider', 'settings', 'bprofile']);
      //  this._location.back();
        }
        // get the logo url for the provider
      getProviderLogo() {
        this.provider_servicesobj.getProviderLogo()
          .subscribe(
            data => {
              this.blogo = data;
              console.log(this.blogo);
              const cnow = new Date();
              const dd = cnow.getHours() + '' + cnow.getMinutes() + '' + cnow.getSeconds();
              this.cacheavoider = dd;
              let logo = '';
              if (this.blogo[0]) {
                this.logoExist = true;
                logo = this.blogo[0].url;
              } else {
                logo = '';
                this.logoExist = false;
              }
              this.provider_datastorageobj.updateProfilePicWeightage(this.logoExist);
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
          return this.sharedfunctionObj.showlogoicon(logourl);
        }
      }
      // profile pic popup section
      changeProPic() {
        this.notedialogRef = this.dialog.open(ProPicPopupComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: { 'userdata': this.bProfile }
        });
        this.notedialogRef.afterClosed().subscribe(result => {
          this.getBusinessProfile();
        });
      }
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
}
