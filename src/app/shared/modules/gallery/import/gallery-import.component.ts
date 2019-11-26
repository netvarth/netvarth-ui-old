import { Component, Inject, OnInit, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GalleryService } from '../galery-service';
import { Subscription } from 'rxjs/Subscription';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';


@Component({
    selector: 'app-gallery-import',
    templateUrl: './gallery-import.component.html'
})

export class GalleryImportComponent implements OnInit, OnChanges, OnDestroy {
    header_caption = 'Add images';
    select_image_cap = Messages.SELECT_IMAGE_CAP;
    delete_btn = Messages.DELETE_BTN;
    cancel_btn = Messages.CANCEL_BTN;
    performUpload = new EventEmitter<any>();
    img_exists = false;
    item_pic = {
        files: [],
        base64: [],
        caption: []
    };
    selitem_pic = '';
    file_error_msg = '';
    api_error = null;
    api_success = null;
    success_error = null;
    error_msg = '';
    error_list = [];
    img_save_caption = 'Save';
    savedisabled = false;
    canceldisabled = false;
    source_id;
    subscription: Subscription;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<GalleryImportComponent>,
        public sharedfunctionObj: SharedFunctions,
        public galleryService: GalleryService
    ) {

    }
    ngOnChanges() { }
    ngOnInit() {
        if (this.data.source_id) {
            this.source_id = this.data.source_id;
        } else {
            this.dialogRef.close();
        }
        this.subscription = this.galleryService.getMessage().subscribe(
            (response) => {
                if (response.ttype === 'upload') {
                    if (response.status === 'success') {
                        this.resetVariables();
                        this.dialogRef.close();
                    } else {
                        this.actionCompleted();
                    }
                }
            }
        );
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    resetVariables() {
        this.item_pic = {
            files: [],
            base64: [],
            caption: []
        };
        this.api_success = '';
        this.success_error = null;
    }
    confirmDelete(file) {
        this.sharedfunctionObj.confirmGalleryImageDelete(this, file);
    }
    imageSelect(input) {
        if (input.files) {
            for (const file of input.files) {
                this.success_error = this.sharedfunctionObj.imageValidation(file);
                if (this.success_error === true) {
                    this.item_pic.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.item_pic.base64.push(e.target['result']);
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.error_list.push(this.success_error);
                    if (this.error_list[0].type) {
                        this.error_msg = 'Selected image type not supported';
                    }
                    //  else if (this.error_list[0].size) {
                    //     this.error_msg = 'Please upload images with size < 5mb';
                    // }
                }
            }
        }
    }
    deleteTempImage(i) {
        this.item_pic.files.splice(i, 1);
        this.item_pic.base64.splice(i, 1);
        this.item_pic.caption.splice(i, 1);
    }
    saveImages() {
        this.error_msg = '';
        this.error_list = [];
        this.img_save_caption = 'Uploading .. ';
        this.savedisabled = true;
        const submit_data: FormData = new FormData();
        const propertiesDetob = {};
        let i = 0;
        for (const pic of this.item_pic.files) {
            submit_data.append('files', pic, pic['name']);
            const properties = {
                'caption': this.item_pic.caption[i] || ''
            };
            propertiesDetob[i] = properties;
            i++;
        }
        const propertiesDet = {
            'propertiesMap': propertiesDetob
        };
        const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
        submit_data.append('properties', blobPropdata);
        // this.uploadApi(submit_data);
        const input = {
            ttype: 'image-upload',
            value: submit_data,
            sourceId: this.source_id
        };
        this.galleryService.sendMessage(input);
    }
    actionCompleted() {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.canceldisabled = false;
    }
}
