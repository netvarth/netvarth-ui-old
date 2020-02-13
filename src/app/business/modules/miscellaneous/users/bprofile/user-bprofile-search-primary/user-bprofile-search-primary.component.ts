import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../../ynw_provider/services/provider-datastorage.service';
import { projectConstants } from '../../../../../../shared/constants/project-constants';
import { SharedServices } from '../../../../../../shared/services/shared-services';

@Component({
    selector: 'app-user-bprofile-search-primary',
    templateUrl: './user-bprofile-search-primary.component.html'
})

export class UserBprofileSearchPrimaryComponent implements OnInit {
    select_subdomain_cap;
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
    subDomains: any = [];
    user_arr;

    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_servicesobj: ProviderServices,
        public sharedfunctionObj: SharedFunctions,
        private shared_services: SharedServices,
        private provider_datastorageobj: ProviderDataStorageService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject(DOCUMENT) public document,
        public dialogRef: MatDialogRef<UserBprofileSearchPrimaryComponent>
    ) { }

    ngOnInit() {
        this.bProfile = this.data.bprofile;
        this.getUser();
        // calling method to create the form
        this.createForm();
        // this.elementRef.nativeElement.focus();
        const bConfig = this.sharedfunctionObj.getitemfromLocalStorage('ynw-bconf');
        const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
        // if (bConfig && bConfig.bdata) {
        //     for (let i = 0; i < bConfig.bdata.length; i++) {
        //         if (user.sector === bConfig.bdata[i].domain) {
        //             for (let j = 0; j < bConfig.bdata[i].subDomains.length; j++) {
        //                 if (!bConfig.bdata[i].subDomains[j].isMultilevel) {
        //                     this.subDomains.push(bConfig.bdata[i].subDomains[j]);
        //                 }
        //             }
        //             break;
        //         }
        //     }
        // } else {
        //     this.shared_services.bussinessDomains()
        //         .subscribe(
        //             res => {
        //                 const today = new Date();
        //                 const postdata = {
        //                     cdate: today,
        //                     bdata: res
        //                 };
        //                 this.sharedfunctionObj.setitemonLocalStorage('ynw-bconf', postdata);
        //             }
        //         );
        // }
    }

    // Creates the form element
    createForm() {
        this.formfields = {
            bname: [{ value: '' }, Validators.compose([Validators.required])],
            bdesc: [{ value: '' }]
        };
        this.amForm = this.fb.group(this.formfields);
        // this.prov_curstatus = this.bProfile.status;
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
    })
}
    // resets the error messages holders
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    getUser(){
        this.provider_servicesobj.getUser(this.data.userId)
        .subscribe(data => {
            this.user_arr = data;
            console.log(this.user_arr.subdomain);
        });
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
        if (form_data.bdesc) {
            form_data.bdesc = form_data.bdesc.trim();
        }
        if (form_data.bname.length > projectConstants.BUSINESS_NAME_MAX_LENGTH) {
            this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_NAME_MAX_LENGTH_MSG');
        } else if (form_data.bdesc && form_data.bdesc.length > projectConstants.BUSINESS_DESC_MAX_LENGTH) {
            this.api_error = this.sharedfunctionObj.getProjectMesssages('BUSINESS_DESC_MAX_LENGTH_MSG');
        } else {
            const post_itemdata = {
                'businessName': form_data.bname,
                'businessDesc': form_data.bdesc,
                'userSubdomain': this.user_arr.subdomain
            };
            // calling the method to update the primarty fields in bProfile edit page
            this.UpdatePrimaryFields(post_itemdata);
        }
    }

   

    // updating the primary field from the bprofile edit page
    UpdatePrimaryFields(pdata) {
        this.disableButton = true;
        this.provider_servicesobj.patchUserbProfile(pdata, this.data.userId)
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
                    const loginuserdata = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
                    // setting the status of the customer from the profile details obtained from the API call
                    loginuserdata.accStatus = this.bProfile.status;
                    // Updating the status (ACTIVE / INACTIVE) in the local storage
                    this.sharedfunctionObj.setitemToGroupStorage('ynw-user', loginuserdata);
                },
                () => {

                }
            );

    }
}
