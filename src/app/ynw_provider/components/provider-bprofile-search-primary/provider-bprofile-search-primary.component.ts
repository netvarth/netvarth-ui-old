import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-provider-bprofile-search-primary',
  templateUrl: './provider-bprofile-search-primary.component.html',
  styleUrls: ['./provider-bprofile-search-primary.component.css']
})

export class ProviderBprofileSearchPrimaryComponent implements OnInit {

  profile_name_summary_cap = Messages.SEARCH_PRI_PROF_NAME_SUMMARY_CAP;
  business_name_cap = Messages.SEARCH_PRI_BUISINESS_NAME_CAP;
  profile_summary_cap = Messages.SEARCH_PRI_PROF_SUMMARY_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  show_schedule_selection = false;
  bProfile: any = [];
  formfields;
  disabled_field = false;
  prov_curstatus = '';
  disableButton = false;

  constructor(
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_servicesobj: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private provider_datastorageobj: ProviderDataStorageService,
    @Inject(DOCUMENT) public document,
    public dialogRef: MatDialogRef<ProviderBprofileSearchPrimaryComponent>
  ) { }

  ngOnInit() {
    this.bProfile = this.provider_datastorageobj.get('bProfile');
    // calling method to create the form
    this.createForm();
    // this.elementRef.nativeElement.focus();
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
    this.amForm = this.fb.group(this.formfields);
  }

  // resets the error messages holders
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
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

  // updating the primary field from the bprofile edit page
  UpdatePrimaryFields(pdata) {
    this.disableButton = true;
    this.provider_servicesobj.updatePrimaryFields(pdata)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('BPROFILE_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
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
          this.provider_datastorageobj.set('bProfile', data);
          // getting the user details saved in local storage
          const loginuserdata = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
          // setting the status of the customer from the profile details obtained from the API call
          loginuserdata.accStatus = this.bProfile.status;
          // Updating the status (ACTIVE / INACTIVE) in the local storage
          this.sharedfunctionObj.setitemonLocalStorage('ynw-user', loginuserdata);
        },
        () => {

        }
      );

  }
}
