import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ImageTransform } from './interfaces/index';
//import { UserDataStorageService } from './../../general/users/settings/user-datastorage.service';


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
    fileToReturn: any;
    api_success: string;
    img_save_caption = 'Save';
    savedisabled = false;
    canvasRotation = 0;
    transform: ImageTransform = {};
    scale = 1;
    constructor(public activateroute: ActivatedRoute,
        private sharedfunctionobj: SharedFunctions,
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
       // private user_datastorage: UserDataStorageService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ProPicPopupComponent>) {

    }
    ngOnInit() {
        this.bProfile = this.data.userdata;
    }

    imageSelect(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64; // preview
        this.fileToReturn = this.base64ToFile(
            event.base64,
            this.imageChangedEvent.target.files[0].name,
        );
        return this.fileToReturn;
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
    base64ToFile(imgdata, filename) {
        const arr = imgdata.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }
    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }
    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }
    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }
    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }

    // getBusinessProfile() {
    //     this.bProfile = [];
    //     this.getBussinessProfileApi()
    //         .then(
    //             data => {
    //                 this.bProfile = data;
    //             });
    // }

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
        const file = this.fileToReturn;
        this.success_error = null;
        this.error_list = [];
        this.error_msg = '';
        this.img_save_caption = 'Uploading .. ';
        this.savedisabled = true;
        if (file) {
            this.success_error = this.sharedfunctionobj.imageValidation(file);
            if (this.success_error === true) {
                const reader = new FileReader();
                this.item_pic.files = file;
                this.selitem_pic = file;
                const fileobj = file;
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
                    if (this.data.userId) {
                        this.uploadUserLogo(submit_data);
                    } else {
                        this.uploadLogo(submit_data);
                    }
                }
            } else {
                this.error_list.push(this.success_error);
                if (this.error_list[0].type) {
                    this.error_msg = 'Selected image type not supported';
                    this.dialogRef.close();
                } else if (this.error_list[0].size) {
                    this.error_msg = 'Please upload images with size less than 15mb';
                    this.dialogRef.close();
                }
                // this.error_msg = 'Please upload images with size < 5mb';
                this.sharedfunctionobj.openSnackBar(this.error_msg, { 'panelClass': 'snackbarerror' });
            }
        }
    }

    uploadLogo(passdata) {
        this.provider_services.uploadLogo(passdata)
            .subscribe(
                data => {
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
                    this.provider_datastorage.updateProfilePicWeightage(true);
                    this.sharedfunctionobj.sendMessage(pdata);
                    this.api_success = Messages.BPROFILE_LOGOUPLOADED;
                    this.img_save_caption = 'Uploaded';
                    setTimeout(() => {
                        this.dialogRef.close();
                    }, projectConstantsLocal.TIMEOUT_DELAY);
                },
                error => {
                    this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    // this.api_error = error.error;
                }
            );
    }

    uploadUserLogo(passdata) {
        this.provider_services.uploaduserLogo(passdata, this.data.userId)
          .subscribe(
            data => {
            //   this.blogo = [];
            //   this.blogo = data;
            //   console.log(this.blogo);
              // calling function which saves the business related details to show in the header
            //   const today = new Date();
            //   const tday = today.toString().replace(/\s/g, '');
            //   const blogo = this.blogo.url + '?' + tday;
            //   const subsectorname = this.sharedfunctionobj.retSubSectorNameifRequired(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['displayName']);
            //   this.sharedfunctionobj.setBusinessDetailsforHeaderDisp(this.bProfile['businessName']
            //     || '', this.bProfile['serviceSector']['displayName'] || '', subsectorname || '', blogo || '');
            //   const pdata = { 'ttype': 'updateuserdetails' };
            //   this.user_datastorage.updateProfilePicWeightage(true);
            //   this.sharedfunctionobj.sendMessage(pdata);
              this.api_success = Messages.BPROFILE_LOGOUPLOADED;
              this.img_save_caption = 'Uploaded';
              setTimeout(() => {
                this.dialogRef.close();
            }, projectConstantsLocal.TIMEOUT_DELAY);
            },
            error => {
              this.sharedfunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
}
