import { Component, Inject, OnInit, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';


@Component({
    selector: 'app-addcatalogimage',
    templateUrl: './addcatalogimage.component.html'
})

export class AddcatalogimageComponent implements OnInit, OnChanges {
    header_caption = 'Catalog created successfully,you can upload catalog image now';
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
    @ViewChild('imagefile') fileInput: ElementRef;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddcatalogimageComponent>,
        public sharedfunctionObj: SharedFunctions,
        private provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private router: Router,
    ) {

    }
    ngOnChanges() { }
    ngOnInit() {
        if (this.data.source_id) {
            this.source_id = this.data.source_id;
        } else {
            this.dialogRef.close();
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
        this.dialogRef.close(1);
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
        this.fileInput.nativeElement.value = '';
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
        this.provider_services.uploadCatalogImages(this.source_id, submit_data).subscribe((data) => {
            this.snackbarService.openSnackBar('Image uploaded successfully');
            this.close();
            this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
        },
            error => {
                this.error_msg = this.wordProcessor.getProjectErrorMesssages(error);
                this.savedisabled = false;
                this.img_save_caption = 'Save';
            });
    }
    actionCompleted() {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.canceldisabled = false;
    }
}
