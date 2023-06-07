import { Component, Inject, OnInit } from '@angular/core';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { FileService } from '../../../../../../../src/app/shared/services/file-service';
import { DentalHomeService } from '../../../dental-home/dental-home.service';
import { CdlService } from '../../../cdl/cdl.service';
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
  selectedFiles = {
    "photo": { files: [], base64: [], caption: [] }
  }
  filesToUpload: any = [];
  businessDetails: any;
  businessId: any;
  apiloading: any = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadprescriptionRef: MatDialogRef<UploadPrescriptionComponent>,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    public dialog: MatDialog,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    // private location: Location,
    private dental_homeservice: DentalHomeService,
    private cdlservice: CdlService,
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
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
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
  // filesSelected(event) {
  //   const input = event.target.files;
  //   if (input) {
  //     for (const file of input) {
  //       if (projectConstantsLocal.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
  //         this.snackbarService.openSnackBar('Selected file type not supported', { 'panelClass': 'snackbarerror' });
  //       } else if (file.size > projectConstantsLocal.IMAGE_MAX_SIZE) {
  //         this.snackbarService.openSnackBar('Please upload files with size < 10mb', { 'panelClass': 'snackbarerror' });
  //       } else {
  //         this.selectedMessage.files.push(file);
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           this.selectedMessage.base64.push(e.target['result']);
  //           this.image_list_popup = [];
  //           const imgobj = new Image(0,
  //             { // modal
  //               img: this.selectedMessage.base64[0],
  //               description: ''
  //             });
  //           this.image_list_popup.push(imgobj);
  //           this.heading='Prescription'
  //         };
  //         reader.readAsDataURL(file);
  //         this.showSave = true;
  //       }
  //     }
  //   }
  // }
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
    let presaAttach=[];
  
    for (let i = 0; i < this.filesToUpload.length; i++) {
      console.log('clinicalNotesAddListxx', this.filesToUpload);
      
      if (this.filesToUpload[i]["type"] == 'photo') {
        presaAttach.push(this.filesToUpload[i])
      }
    }
             let submit_data = {
             'bookingType': this.bookingType,
             'consultationMode': 'OP',
             'prescriptionAttachments': presaAttach,
             'prescriptions': {}          
}          
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
          this.uploadMrPrescription(this.mrId, submit_data);
          // this.goBack()
        },
          error => {
            this.disable = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }

  }
  uploadMrPrescription(id, submit_data) {
    this.provider_services.createMedicalRecordPrescription(id, submit_data)
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
  // deleteTempImage(img, index) {
  //   this.showSave = true;
  //   this.removeprescriptiondialogRef = this.dialog.open(ConfirmBoxComponent, {
  //     width: '50%',
  //     panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
  //     disableClose: true,
  //     data: {
  //       'message': 'Do you really want to remove the prescription?',
  //       'type': 'prescription'
  //     }
  //   });
  //   this.removeprescriptiondialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       if (img.view && img.view === true) {
  //         console.log('img',img)
  //         console.log('img.keyName',img.keyName)
  //         this.provider_services.deleteUplodedprescription(img.keyName, this.mrId)
  //           .subscribe((data) => {
  //             this.selectedMessage.files.splice(index, 1);
  //             this.heading='Create Prescription';
  //           },
  //             error => {
  //               this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //             });
  //       } else {
  //         this.selectedMessage.files.splice(index, 1);
  //         this.selectedMessage.base64.splice(index, 1);
  //         this.heading='Create Prescription';
  //       }
  //     }
  //   });
  // }
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
  filesSelected(event, type) {
    const input = event.target.files;

    let fileUploadtoS3 = [];
    const _this = this;
    this.fileService.filesSelected(event, _this.selectedFiles[type]).then(
      () => {
        let index = _this.filesToUpload && _this.filesToUpload.length > 0 ? _this.filesToUpload.length : 0;
        for (const pic of input) {
          const size = pic["size"] / 1024;
          let fileObj = {
            owner: _this.businessId,
            ownerType: "Provider",
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            action: 'add'
          }
          console.log("pic", pic)
          fileObj['file'] = pic;
          fileObj['type'] = type;
          fileObj['order'] = index;
          _this.filesToUpload.push(fileObj);
          fileUploadtoS3.push(fileObj);
          index++;
        }

        _this.dental_homeservice.uploadFilesToS3(fileUploadtoS3).subscribe(
          (s3Urls: any) => {
            if (s3Urls && s3Urls.length > 0) {
              _this.uploadAudioVideo(s3Urls).then(
                (dataS3Url) => {

                  _this.apiloading = false;
                  console.log("Sending Attachment Success");
                });
            }
          }, error => {
            _this.apiloading = false;
            _this.snackbarService.openSnackBar(error,
              { panelClass: "snackbarerror" }
            );
          }
        );

      }).catch((error) => {
        _this.apiloading = false;
        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }
  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;

    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log('_this.filesToUpload', _this.filesToUpload)
        let file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          file['driveId'] = s3UrlObj.driveId;
          await _this.uploadFiles(file['file'], s3UrlObj.url, s3UrlObj.driveId).then(
            () => {
              count++;
              if (count === data.length) {
                resolve(true);
                console.log('_this.filesToUpload', _this.filesToUpload)
              }
            }
          );
        }
        else {
          resolve(true);
        }
      }
    })
  }
  uploadFiles(file, url, driveId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.dental_homeservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          console.log("Final Attchment Sending Attachment Success", file)
          _this.dental_homeservice.videoaudioS3UploadStatusUpdate('COMPLETE', driveId).subscribe((data: any) => {
            resolve(true);
          })
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  deleteTempImage(i, type, file) {
    console.log("this.selectedFiles[type]", file)
    console.log('file', file);
    delete file['s3path'];
    delete file['uid'];
    if (file.driveId) {
      file["action"] = "remove";
      file["type"] = type;
      this.filesToUpload.push(file);
    }
    let files = this.filesToUpload.filter((fileObj) => {
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });

    if (files && files.length > 0) {
      let fileIndex = this.filesToUpload.indexOf(files[0])
      if (!file.driveId) {
        this.filesToUpload.splice(fileIndex, 1);
      }
    }
    console.log("this.filesToUpload", this.filesToUpload)
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
  }
  getImagefromUrl(url, file) {
    if (file.fileType == 'pdf') {
      return './assets/images/pdf.png';
    } else if (file.fileType == 'application/vnd.ms-excel' || file.fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return './assets/images/xls.png';
    } else if (file.fileType == 'audio/mp3' || file.fileType == 'audio/mpeg' || file.fileType == 'audio/ogg') {
      return './assets/images/audio.png';
    } else if (file.fileType == 'video/mp4' || file.fileType == 'video/mpeg') {
      return './assets/images/video.png';
    } else if (file.fileType == 'application/msword' || file.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.fileType.includes('docx') || file.fileType.includes('doc')) {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (file.fileType.includes('txt')) {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return url;
    }
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
}
