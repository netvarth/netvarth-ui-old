import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../../shared/constants/project-constants';
@Component({
    selector: 'app-linkprofile',
    templateUrl: './linkProfile.component.html'
})
export class LinkProfileComponent implements OnInit {
    UserID = Messages.UserProfileID;
    cancel_btn_cap = Messages.CANCEL_BTN;
    save_btn_cap = Messages.SAVE_BTN;
    amForm: FormGroup;
    api_error: any;
    api_success: any;
    api_loading = true;
    disableButton = false;
    profId;
    provId: any;


    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sharedservices: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        public dialogRef: MatDialogRef<LinkProfileComponent>,
        @Inject(DOCUMENT) public document,
        @Inject(MAT_DIALOG_DATA) public data: any,


    ) { }

    ngOnInit() {
        this.provId = this.data.provId;
        console.log(this.provId);
        this.createForm();
        this.api_loading = false;

    }
    createForm() {
        this.amForm = this.fb.group({
            profileId: ['', Validators.compose([Validators.required])]

        });
    }
    onSubmit(input) {
        this.resetApiErrors();
        if (input.profileId === 0) {
            this.api_error = this.sharedfunctionObj.openSnackBar('Please enter a valid Provider ProfileId', { 'panelClass': 'snackbarerror' });
        } else {
            this.addlink(this.provId, input.profileId);
        }

    }
    addlink(provId, profileId) {
        this.resetApiErrors();
        this.api_loading = true;
        this.disableButton = true;
        this.sharedservices.updateuserlinkProfile(provId, profileId).subscribe(
            () => {
                this.api_success = this.sharedfunctionObj.openSnackBar(Messages.Profile_Created);
                this.api_loading = false;
                setTimeout(() => {
                    this.dialogRef.close('reloadlist');

                }, projectConstants.TIMEOUT_DELAY);
                this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
            },
            error => {
                this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
    }
    onCancel() {
        this.router.navigate(['provider', 'settings', 'miscellaneous', 'users']);
        this.api_loading = false;
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
}