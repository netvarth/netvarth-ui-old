import { Component, OnInit } from '@angular/core';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { projectConstants } from '../../../../../app.component';
import { MedicalrecordService } from '../../medicalrecord.service';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent implements OnInit {

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
  showSave = true;
  sharedialogRef;
  uploadImages: any = [];

  upload_status = 'Added to list';
  disable = false;
  heading = 'Create prescription';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoot: ActivatedRoute,
    private medicalrecord_service: MedicalrecordService) {
    this.medicalrecord_service.patient_data.subscribe(data => {
      this.patientDetails = JSON.parse(data.customerDetail);
      this.userId = this.patientDetails.id;
    });
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      if (mrId !== 0) {
        this.mrId = mrId;
      }
    });
    this.activatedRoot.queryParams.subscribe(queryParams => {
    if (queryParams.mode) {
      const type = queryParams.mode;
      if (type === 'view') {
        this.heading = 'Update Prescription';
      }
     }
    });

  }

  ngOnInit() {
    if (this.mrId) {
      this.getMrprescription(this.mrId);
    }


  }
  goBack() {
    this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription']);
  }

  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        this.uploadImages = data;
        console.log(data);
        for (const pic of this.uploadImages) {
          const imgdet = {'name': pic.originalName, 'keyName': pic.keyName , 'size': pic.imageSize, 'view': true};
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
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
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

  saveImages() {
    this.disable = true;
    for (let ia = 0; ia < this.selectedMessage.files.length; ia++) {
      if (this.selectedMessage.files[ia].view === true) {
        this.selectedMessage.files.splice(ia, 1);
      }
    }
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
    if (this.mrId) {
      this.uploadMrPrescription(this.mrId, submit_data);
    } else {
      this.medicalrecord_service.createMRForUploadPrescription()
        .then(data => {
          console.log(data);

          this.medicalrecord_service.setCurrentMRID(data);
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
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription']);
      },
        error => {
          this.disable = false;
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  deleteTempImage(img, index) {
    this.showSave = true;
    if (img.view && img.view === true) {
      this.provider_services.deleteUplodedprescription(img.keyName , this.mrId)
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
