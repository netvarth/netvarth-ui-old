import { Component, OnInit, AfterViewInit } from '@angular/core';
import { projectConstants } from '../../../../../app.component';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { ImagesviewComponent } from '../imagesview/imagesview.component';
import { MatDialog } from '@angular/material/dialog';
import { MedicalrecordService } from '../../medicalrecord.service';
import { ConfirmBoxComponent } from '../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';

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
  uploadImages: any =[] ;

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

  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private medicalrecord_service: MedicalrecordService
  ) {



  }

  ngOnInit() {
    this.providerId = this.medicalrecord_service.getDoctorId();
    console.log(this.providerId);
    if (!this.providerId) {
      const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
      this.providerId = user.id;
    }
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    this.getDigitalSign();
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from signature_pad API
  }

  drawComplete() {
    // will be notified signature_pad's onEnd event
    const signName = 'sign' + this.providerId + '.jpeg';
    const propertiesDetob = {};
    let i = 0;
    const blob = this.sharedfunctionObj.b64toBlobforSign(this.signaturePad.toDataURL());
      console.log(blob);
       const submit_data: FormData = new FormData();
      submit_data.append('files', blob, signName);
      console.log(submit_data);
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
    // will be notified signature_pad's onBegin event
    console.log('begin drawing');
  }
  goBack() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }
  uploadSignature() {
    const navigationExtras: NavigationExtras = {
      queryParams: { providerId: this.providerId }
    };
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'uploadsignature'], navigationExtras);
  }
  manualSignature(){
    const navigationExtras: NavigationExtras = {
      queryParams: { providerId: this.providerId }
    };
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'manualsignature'], navigationExtras);
  }

  getDigitalSign() {
    if (this.providerId) {
      this.provider_services.getDigitalSign(this.providerId)
        .subscribe((data: any) => {
          this.loading = false;
          console.log(data);
          this.digitalSign = true;
                  this.selectedMessage.files.push(JSON.parse(data));
          console.log(this.selectedMessage.files);
        },
          error => {
            this.digitalSign = false;
            this.loading = false;
            // this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
        this.provider_services.deleteUplodedsign(img.keyName , this.providerId)
      .subscribe((data) => {
        this.selectedMessage.files.splice(index, 1);
        this.getDigitalSign();
       },
      error => {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
      }
    });
    }


  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
       if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.sharedfunctionObj.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
          this.sharedfunctionObj.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
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
      console.log(pic);
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
        this.sharedfunctionObj.openSnackBar('Digital sign uploaded successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
        console.log(result);
      }
    });
  }
}
