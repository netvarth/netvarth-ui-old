import { Component, OnInit } from '@angular/core';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { projectConstants } from '../../../../../app.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

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
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private medicalrecord_service: MedicalrecordService) {

    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.mode) {
        const type = queryParams.mode;
        if (type === 'view') {
          this.heading = 'Update Prescription';
        }
      }
    });

  }

  ngOnInit() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    if (this.mrId) {
      this.getMrprescription(this.mrId);
    }


  }
  goBack() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }

  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        this.uploadImages = data;
        console.log(data);
        for (const pic of this.uploadImages) {
          const imgdet = { 'name': pic.originalName, 'keyName': pic.keyName, 'size': pic.imageSize, 'view': true };
          this.selectedMessage.files.push(imgdet);
        }
        console.log(this.selectedMessage.files);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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



  deletePrevUploadRx() {
    return new Promise((resolve, reject) => {
      for (let ia = 0; ia < this.selectedMessage.files.length; ia++) {
        if (this.selectedMessage.files[ia].view === true) {
          this.selectedMessage.files.splice(ia, 1);
        }
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
      this.medicalrecord_service.createMRForUploadPrescription()
        .then((data: number) => {
          this.mrId = data;

          this.uploadMrPrescription(data, submit_data);
        },
          error => {
            this.disable = false;
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }

  }
  uploadMrPrescription(id, submit_data) {
    this.provider_services.uploadMRprescription(id, submit_data)
      .subscribe((data) => {
        this.showSave = false;
        this.upload_status = 'Uploaded';
        this.sharedfunctionObj.openSnackBar('Prescription uploaded successfully');
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.disable = false;
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  deleteTempImage(img, index) {
    this.showSave = true;
    if (img.view && img.view === true) {
      this.provider_services.deleteUplodedprescription(img.keyName, this.mrId)
        .subscribe((data) => {
          this.selectedMessage.files.splice(index, 1);
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    } else {
      this.selectedMessage.files.splice(index, 1);
    }
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
        console.log(result);


      }


    });

  }

}
