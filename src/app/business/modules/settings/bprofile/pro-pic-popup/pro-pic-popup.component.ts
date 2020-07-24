import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';


@Component({
    selector: 'app-pro-pic-pop',
    templateUrl: './pro-pic-popup.component.html'
})
export class ProPicPopupComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    success_error = null;
    error_list = [];
    error_msg = '';
    item_pic = {
        files: [],
        base64: null
    };
    selitem_pic = '';
    bProfile;
    blogo: any = [];
    constructor(public activateroute: ActivatedRoute,
        private sharedfunctionobj: SharedFunctions,
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ProPicPopupComponent>) {

    }
    ngOnInit() {
        this.getBusinessProfile();
    }

    imageSelect(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    getBusinessProfile() {
        this.bProfile = [];
        this.getBussinessProfileApi()
            .then(
                data => {
                    this.bProfile = data;
                });
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

    saveImages() {
        const input = this.imageChangedEvent;
        this.success_error = null;
        this.error_list = [];
        this.error_msg = '';
        if (input.target.files && input.target.files[0]) {
            for (const file of input.target.files) {
                this.success_error = this.sharedfunctionobj.imageValidation(file);
                if (this.success_error === true) {
                    const reader = new FileReader();
                    this.item_pic.files = input.target.files[0];
                    this.selitem_pic = input.target.files[0];
                    const fileobj = input.target.files[0];
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
                        //this.uploadLogo(submit_data);
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

            //   const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            //   this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
            //     || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', blogo || '');
            //   const pdata = { 'ttype': 'updateuserdetails' };
            //   this.provider_datastorage.updateProfilePicWeightage(true);
            //   this.sharedfunctionobj.sendMessage(pdata);

              /// this.api_success = Messages.BPROFILE_LOGOUPLOADED;
            },
            error => {
              this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              // this.api_error = error.error;
            }
          );
      }
}
