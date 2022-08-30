import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ProviderServices } from '../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicalrecordService } from '../../medicalrecord.service';
import { ConfirmBoxComponent } from '../../../../shared/confirm-box/confirm-box.component';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
// import { Location } from '@angular/common';
import { UploadSignatureComponent } from './uploadsignature/upload-signature.component';
import { ManualSignatureComponent } from './manualsignature/manual-signature.component';

@Component({
  selector: 'app-upload-digital-signature',
  templateUrl: './upload-digital-signature.component.html',
  styleUrls: ['./upload-digital-signature.component.css']
})
export class UploadDigitalSignatureComponent implements OnInit, AfterViewInit {

  signaturePad: any;
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
  heading = 'Upload digital signature';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  providerId;
  digitalSign = false;
  signatureviewdialogRef;
  digitalsignature = {};
  removedsigndialogRef;
  loading = true;
  uploadsignatureRef: MatDialogRef<unknown, any>;
  uploadmanualsignatureRef: MatDialogRef<unknown, any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadsignRef: MatDialogRef<UploadDigitalSignatureComponent>,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    // private location: Location,
    private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private medicalrecord_service: MedicalrecordService
  ) {



  }

  ngOnInit() {
    this.providerId = this.medicalrecord_service.getDoctorId();
    if (!this.providerId) {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      this.providerId = user.id;
    }
    console.log('this.data',this.data)
    this.mrId = this.data.mrid;
    this.patientId = this.data.patientid;
    this.bookingType = this.data.bookingtype;
    this.bookingId = this.data.bookingid;
    this.getDigitalSign();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 5); // set signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from signature_pad API
    }
  }

  drawComplete() {
    // will be notified signature_pad's onEnd event
    const signName = 'sign' + this.providerId + '.jpeg';
    const propertiesDetob = {};
    let i = 0;
    const blob = this.sharedfunctionObj.b64toBlobforSign(this.signaturePad.toDataURL());
    const submit_data: FormData = new FormData();
    submit_data.append('files', blob, signName);
    const properties = {
      'caption': this.selectedMessage.caption[i] || ''
    };
    propertiesDetob[i] = properties;
    i++;
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (this.providerId) {
      this.uploadMrDigitalsign(this.providerId, submit_data);
    }

  }

  drawStart() {
  }
  goBack() {
    this.uploadsignRef.close();
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
    // this.location.back();

  }
  uploadSignature() {
    this.uploadsignatureRef = this.dialog.open(UploadSignatureComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        providerid: this.providerId
      }
    });
    this.uploadsignatureRef.afterClosed().subscribe(() => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        // this.ngOnInit();
        this.getDigitalSign();
      }, 100);
    }
    );
  }
  manualSignature() {
    this.uploadmanualsignatureRef = this.dialog.open(ManualSignatureComponent, {
      width: '100%',
      height:'75%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType,
        providerid: this.providerId
      }
    });
    this.uploadmanualsignatureRef.afterClosed().subscribe((res) => {
      this.loading = true;
      console.log('resuploadmanualsignatureRef',res)
      setTimeout(() => {
        this.loading = false;
        this.ngOnInit();
        // this.getDigitalSign();
      }, 100);
    }
    );
  }

  getDigitalSign() {
    if (this.providerId) {
      this.provider_services.getDigitalSign(this.providerId)
        .subscribe((data: any) => {
          this.loading = false;
          this.digitalSign = true;
          if (data && data !== null) {
            this.selectedMessage.files.push(data);
          }
        },
          error => {
            this.digitalSign = false;
            this.loading = false;
            // this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }

  deleteTempImagefrmdb(img, index) {
    this.removedsigndialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to remove the digital signature?',
        'type': 'digitalSignature'
      }
    });
    this.removedsigndialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.provider_services.deleteUplodedsign(img.keyName, this.providerId)
          .subscribe((data) => {
            this.selectedMessage.files.splice(index, 1);
            this.getDigitalSign();
          },
            error => {
              this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      }
    });
  }


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
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }


  saveDigitalSignImages() {
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.selectedMessage.files) {
      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption': this.selectedMessage.caption[i] || ''
      };
      propertiesDetob[i] = properties;
      i++;
    }
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (this.providerId) {
      this.uploadMrDigitalsign(this.providerId, submit_data);
    }
  }

  uploadMrDigitalsign(id, submit_data) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
      .subscribe((data) => {
        this.snackbarService.openSnackBar('Digital sign uploaded successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

  showimgPopup(file) {
    file.title = 'Your digital signature';
    this.signatureviewdialogRef = this.dialog.open(ImagesviewComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: file,
    });
    this.signatureviewdialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
