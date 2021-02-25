import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../../app.component';
import { MedicalrecordService } from '../medicalrecord.service';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { MrfileuploadpopupComponent } from './mrfileuploadpopup/mrfileuploadpopup.component';


@Component({
  selector: 'app-upload-file',
  templateUrl: './uploadfile.component.html'
})
export class UploadFileComponent implements OnInit {

  bookingId: any;
  bookingType: any;
  patientId: any;
  display_PatientId: any;
  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  temarry = {
    files: [],
    base64: [],
    caption: []
  };
  showSave = true;
  sharedialogRef;
  uploadImages: any = [];

  upload_status = 'Added to list';
  disable = false;
  heading = 'Upload file';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  removeprescriptiondialogRef;
  imagesviewdialogRef;
  image_list_popup: Image[];
  uploadfiledialogRef;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  customer_label = '';
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private medicalrecord_service: MedicalrecordService) {
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    // this.activatedRoute.queryParams.subscribe(queryParams => {
    //   if (queryParams.mode) {
    //     const type = queryParams.mode;
    //     if (type === 'view') {
    //       this.heading = 'Update Prescription';
    //     }
    //   }
    // });

  }

  ngOnInit() {
    this.patientDetails = this.medicalrecord_service.getPatientDetails();
    if (this.patientDetails.memberJaldeeId) {
      this.display_PatientId = this.patientDetails.memberJaldeeId;
    } else if (this.patientDetails.jaldeeId) {
      this.display_PatientId = this.patientDetails.jaldeeId;
    }
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    // if (this.mrId) {
    //   this.getMrprescription(this.mrId);
    // }


  }
  goBack() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }

  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        this.uploadImages = data;
        console.log(data);
        this.image_list_popup = [];
        for (const pic of this.uploadImages) {
          const imgdet = { 'name': pic.originalName, 'keyName': pic.keyName, 'size': pic.imageSize, 'view': true , 'url': pic.url , 'type': pic.type};
          this.selectedMessage.files.push(imgdet);
          const imgobj = new Image(0,
            { // modal
              img: imgdet.url,
              description: ''
            });
          this.image_list_popup.push(imgobj);
        }
        console.log(this.selectedMessage.files);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });

  }
  openImageModalRow(image: Image) {
    console.log(image);
    console.log(this.image_list_popup[0]);
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }

  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          console.log(this.selectedMessage.files);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
            console.log(this.selectedMessage.base64[0]);
            this.image_list_popup = [];
            const imgobj = new Image(0,
              { // modal
                img: this.selectedMessage.base64[0],
                description: ''
              });
            this.image_list_popup.push(imgobj);
          };
          reader.readAsDataURL(file);
          this.showSave = true;
        }
      }
    }
  }
  imageSize(val) {
    let imgsize;
    imgsize = Math.round((val / 1024));
    return imgsize;
  }

  uploadpopup() {
    this.uploadfiledialogRef = this.dialog.open(MrfileuploadpopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType
      }
    });
    this.uploadfiledialogRef.afterClosed().subscribe(result => {
      if (result) {
       
      }
    });
  }

 

  saveImages() {
    this.disable = true;

    for (let ia = 0; ia < this.selectedMessage.files.length; ia++) {
      if (this.selectedMessage.files[ia].view !== true) {
        this.temarry.files.push(this.selectedMessage.files[ia]);

      }
    }
    console.log(this.temarry.files);
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.temarry.files) {
      console.log(pic);
      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption': this.temarry.caption[i] || ''
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
      this.uploadMrPrescription(this.mrId, submit_data);
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
          this.uploadMrPrescription(data, submit_data);
        },
          error => {
            this.disable = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }

  }
  uploadMrPrescription(id, submit_data) {
    this.provider_services.uploadMRprescription(id, submit_data)
      .subscribe((data) => {
        this.showSave = false;
        this.upload_status = 'Uploaded';
        this.snackbarService.openSnackBar('Prescription uploaded successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.disable = false;
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  deleteTempImage(img, index) {
    this.showSave = true;

    this.removeprescriptiondialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to remove the prescription?'
      }
    });
    this.removeprescriptiondialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (img.view && img.view === true) {
          this.provider_services.deleteUplodedprescription(img.keyName, this.mrId)
            .subscribe((data) => {
              this.selectedMessage.files.splice(index, 1);
            },
              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              });
        } else {
          this.selectedMessage.files.splice(index, 1);
          this.selectedMessage.base64.splice(index, 1);
        }
      }
    });

   
  }

  somethingChanged() {
    this.showSave = true;
  }
  

}
