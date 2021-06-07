import { Component, Inject, OnInit, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MedicalrecordService } from '../../medicalrecord.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Router } from '@angular/router';


@Component({
    selector: 'app-mrfileuploadpopup',
    templateUrl: './mrfileuploadpopup.component.html'
})

export class MrfileuploadpopupComponent implements OnInit, OnChanges {
    header_caption = 'You can upload files now';
    select_image_cap = 'Click here to select the files';
    delete_btn = Messages.DELETE_BTN;
    cancel_btn = Messages.CANCEL_BTN;
    supported_files = 'Upload any files valid extensions jpg,png,jpeg,bmp,gif,webp,doc,docx,pdf,mov,mp4,mp3,mpeg,ogg';
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
    bookingId: any = 0;
  bookingType: any;
  patientId: any;
  mrId = 0;
    subscription: Subscription;
    @ViewChild('imagefile') filed: ElementRef;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<MrfileuploadpopupComponent>,
        public sharedfunctionObj: SharedFunctions,
        private medicalrecord_service: MedicalrecordService,
        private provider_services: ProviderServices,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private router: Router
    ) {

    }
    ngOnChanges() { }
    ngOnInit() {
        if (this.data) { 
            this.mrId = this.data.mrid;
            this.patientId = this.data.patientid;
            this.bookingType = this.data.bookingtype;
            this.bookingId = this.data.bookingid;
            console.log(this.mrId);
            console.log(this.patientId);
            console.log(this.bookingType);
            console.log(this.bookingId);
            
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
        this.dialogRef.close(this.mrId);
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);
    }
    closeUploadFile() {
      this.dialogRef.close();
      this.router.navigate(['provider', 'license','addons']);
    }
    imageSelect(event) {
        this.error_msg = '';
        this.error_list = [];
        const input = event.target.files;
        if (input) {
          for (const file of input) {
            console.log(file);
            if (projectConstantsLocal.MRFILETYPES_UPLOAD.indexOf(file.type) === -1) {
              this.error_msg ='Selected file type not supported';
            } else if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
              this.error_msg ='Please upload file with size < 100 mb';
            } else {
              this.item_pic.files.push(file);
              console.log(this.item_pic.files);
              const reader = new FileReader();
              reader.onload = (e) => {
                this.item_pic.base64.push(e.target['result']);
                console.log(this.item_pic.base64);
              reader.readAsDataURL(file);
            }
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
      console.log(this.mrId);
        this.error_msg = '';
        this.error_list = [];
        this.img_save_caption = 'Uploading .. ';
        this.savedisabled = true;        
        if (this.mrId) {
          console.log(this.mrId);
            this.uploadMrfiles();
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
                this.uploadMrfiles();
              },
                error => {
                  this.savedisabled = false;
                  this.img_save_caption = 'Save';
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
          }
        
    }
   reloadCurrentRoute() {
     console.log('inisde');
      let currentUrl = 'provider/customers/'+this.patientId+'/' + this.bookingType+'/' + this.bookingId + '/medicalrecord/'+ this.mrId+ '/clinicalnotes';
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
      });
  }
    uploadMrfiles() {
      let passdata = {};
      let file;
      for (const pic of this.item_pic.files) {
           file = pic;
           console.log(file);
           const imgsize=pic['size'];
           const sizeinkb=(imgsize/1024).toFixed(0);
           console.log(sizeinkb);
           passdata = {
            "url": pic['name'],
            "type": pic['type'],
          "imageSize":sizeinkb
          };
       }
      this.provider_services.videoaudioUploadurl(this.mrId, passdata)
      .subscribe((data) => {
      let details = data['url'];
      let uid = {"uid":data['uid']};
      this.provider_services.videoaudioS3Upload(file, details)
      .subscribe(() => {
      this.provider_services.videoaudioUploadconfirm(this.mrId, uid)
      .subscribe((data) => {
        this.dialogRef.close(this.mrId);
        this.snackbarService.openSnackBar('File Uploaded Successfully');
        console.log(this.patientId);
        console.log(this.bookingType);
        console.log(this.bookingId);
        console.log(this.mrId);
       this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId]);
       // this.reloadCurrentRoute();
    
       },
       error => {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
         });
       },
       error => {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
         });
       },
       error => {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
       });
      }
    actionCompleted() {
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.canceldisabled = false;
    }
}
