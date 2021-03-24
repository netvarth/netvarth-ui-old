import { Component, Inject, OnInit, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
// import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
// import { Router } from '@angular/router';


@Component({
    selector: 'app-shoppinglistupload',
    templateUrl: './shoppinglistupload.component.html'
})

export class ShoppinglistuploadComponent implements OnInit, OnChanges {
    header_caption = 'You can upload shopping list image now';
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
    @ViewChild('imagefile') filed: ElementRef;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ShoppinglistuploadComponent>,
        public sharedfunctionObj: SharedFunctions,
        // private provider_services: ProviderServices,
        // private router: Router,
    ) {

    }
    ngOnChanges() { }
    ngOnInit() {
        if (this.data.source) {
          let  list_pic = {
                files: [],
                base64: [],
                caption: []
            };
            console.log(this.data.source);
            list_pic = this.data.source;
            this.item_pic =  list_pic;
        }
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
    close() {
        this.dialogRef.close();
    }
    imageSelect(event) {
        this.error_msg = '';
        this.error_list = [];
        const input = event.target.files;
        if (input) {
            for (const file of input) {
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
                    } else if (this.error_list[0].size) {
                        this.error_msg = 'Please upload images with size < 15mb';
                    }
                }
            }
            console.log(this.item_pic.files);
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
        this.dialogRef.close(this.item_pic);
    }
    actionCompleted() {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.canceldisabled = false;
    }
}
