import { Component, Inject, OnInit } from '@angular/core';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ConfirmBoxComponent } from '../../../../shared/confirm-box/confirm-box.component';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
// import { Location } from '@angular/common';


@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent implements OnInit {

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
  heading = 'Create Prescription';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  removeprescriptiondialogRef;
  imagesviewdialogRef;
  image_list_popup: Image[];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadprescriptionRef: MatDialogRef<UploadPrescriptionComponent>,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    // private location: Location,
    private medicalrecord_service: MedicalrecordService) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (this.data.mode) {
        const type = this.data.mode;
        if (type === 'view') {
          this.heading = 'Update Prescription';
        }
      }
    });
  }
  ngOnInit() {
    this.patientDetails = this.medicalrecord_service.getPatientDetails();
    if (this.patientDetails.memberJaldeeId) {
      this.display_PatientId = this.patientDetails.memberJaldeeId;
    } else if (this.patientDetails.jaldeeId) {
      this.display_PatientId = this.patientDetails.jaldeeId;
    }
    // const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    // this.mrId = parseInt(medicalrecordId, 0);
    // this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    // this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    // this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    this.mrId = this.data.mrid;
    this.patientId = this.data.patientid;
    this.bookingType = this.data.bookingtype;
    this.bookingId = this.data.bookingid;
    if (this.mrId) {
      this.getMrprescription(this.mrId);
    }
  }
  goBack() {
    this.uploadprescriptionRef.close();
    let currentUrl = this.router.url.split('/');
    let currentLocation = currentUrl[currentUrl.length - 1];
    if (currentLocation == 'prescription') {
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'clinicalnotes']);
    }
    else {
      this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
    }

  }
  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        if (Object.keys(data).length !== 0 && data.constructor === Object) {
          this.uploadImages = data['prescriptionsList'];
          this.image_list_popup = [];
          for (const pic of this.uploadImages) {
            const imgdet = { 'name': pic.originalName, 'keyName': pic.keyName, 'size': pic.imageSize, 'view': true, 'url': pic.url, 'type': pic.type };
            this.selectedMessage.files.push(imgdet);
            const imgobj = new Image(0,
              { // modal
                img: imgdet.url,
                description: ''
              });
            this.image_list_popup.push(imgobj);
          }
        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  openImageModalRow(image: Image) {
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
        if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected file type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.IMAGE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload files with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
            this.image_list_popup = [];
            const imgobj = new Image(0,
              { // modal
                img: this.selectedMessage.base64[0],
                description: ''
              });
            this.image_list_popup.push(imgobj);
            this.heading='Prescription'
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
  showimgPopup(file) {
    console.log(file);
    if (file.view) {
      file.title = 'Uploaded Prescription';
      this.imagesviewdialogRef = this.dialog.open(ImagesviewComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: file,
      });
      this.imagesviewdialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    } else {
      const fileselected = { url: '', title: '' };
      fileselected.url = this.selectedMessage.base64[0];
      fileselected.title = 'Upload Prescription';
      this.imagesviewdialogRef = this.dialog.open(ImagesviewComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: fileselected,
      });
      this.imagesviewdialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    }
  }
  saveImages() {
    this.disable = true;
    for (let ia = 0; ia < this.selectedMessage.files.length; ia++) {
      if (this.selectedMessage.files[ia].view !== true) {
        this.temarry.files.push(this.selectedMessage.files[ia]);
      }
    }
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.temarry.files) {
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
      let passingId;
      if (this.bookingType === 'FOLLOWUP') {
        passingId = this.patientId;
      } else {
        passingId = this.bookingId;
      }
      this.medicalrecord_service.createMRForUploadPrescription(this.bookingType, passingId)
        .then((data: number) => {
          this.mrId = data;
          this.uploadMrPrescription(data, submit_data);
          this.goBack()
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
        this.goBack()
        // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
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
        'message': 'Do you really want to remove the prescription?',
        'type': 'prescription'
      }
    });
    this.removeprescriptiondialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (img.view && img.view === true) {
          console.log('img',img)
          console.log('img.keyName',img.keyName)
          this.provider_services.deleteUplodedprescription(img.keyName, this.mrId)
            .subscribe((data) => {
              this.selectedMessage.files.splice(index, 1);
              this.heading='Create Prescription';
            },
              error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
              });
        } else {
          this.selectedMessage.files.splice(index, 1);
          this.selectedMessage.base64.splice(index, 1);
          this.heading='Create Prescription';
        }
      }
    });
  }
  somethingChanged() {
    this.showSave = true;
  }
  shareRximage() {
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        userId: this.userId
      }
    });
    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
