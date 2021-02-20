import { Component, Inject, OnInit, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MedicalrecordService } from '../../medicalrecord.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
// import { Router } from '@angular/router';


@Component({
    selector: 'app-mrfileuploadpopup',
    templateUrl: './mrfileuploadpopup.component.html'
})

export class MrfileuploadpopupComponent implements OnInit, OnChanges {
    header_caption = 'You can upload files now';
    select_image_cap = 'Click here to select the files';
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
    bookingId: any;
  bookingType: any;
  patientId: any;
  mrId;
    subscription: Subscription;
    @ViewChild('imagefile') filed: ElementRef;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<MrfileuploadpopupComponent>,
        public sharedfunctionObj: SharedFunctions,
        private medicalrecord_service: MedicalrecordService,
        private provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor
        // private router: Router,
    ) {

    }
    ngOnChanges() { }
    ngOnInit() {
        if (this.data) {
            this.mrId = this.data.mrid;
            this.patientId = this.data.patientid;
            this.bookingType = this.data.bookingtype;
            this.bookingId = this.data.bookingid;
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
        const submit_data: FormData = new FormData();
        const propertiesDetob = {};
        let i = 0;
        for (const pic of this.item_pic.files) {
          console.log(pic);
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
        if (this.mrId) {
            this.uploadMrfiles(this.mrId, submit_data);
          } else {
            let passingId ;
            if (this.bookingType === 'FOLLOWUP') {
              passingId = this.patientId;
            } else {
              passingId = this.bookingId;
            }
            this.medicalrecord_service.createMRForUploadPrescription(this.bookingType, passingId)
              .then((data: number) => {
                this.mrId = data;
                console.log(this.mrId);
                this.uploadMrfiles(data, submit_data);
              },
                error => {
                  this.savedisabled = false;
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
          }
        
    }

    uploadMrfiles(id, submit_data) {
        this.provider_services.uploadMRfiles(id, submit_data)
          .subscribe((data) => {
            this.snackbarService.openSnackBar('files uploaded successfully');
            this.dialogRef.close(this.item_pic);
          },
            error => {
              this.savedisabled = false;
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }
    actionCompleted() {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.canceldisabled = false;
    }
}
