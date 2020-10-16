import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalrecordService } from '../../medicalrecord.service';
import { AddDrugComponent } from '../add-drug/add-drug.component';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { projectConstants } from '../../../../../app.component';

@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css']
})
export class DrugListComponent implements OnInit {

  today = new Date();
  patientDetails;
  userId;
  drugList: any = [];
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
  addDrugdialogRef;
  drugData: any = [];
  providerId;
  digitalSign = false;
  deleteFromDb = false;
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    public dialog: MatDialog,
    private activatedRoot: ActivatedRoute,
    private router: Router,
    private medicalrecord_service: MedicalrecordService) {
    this.medicalrecord_service.patient_data.subscribe(data => {
      this.patientDetails = JSON.parse(data.customerDetail);
      this.userId = this.patientDetails.id;
    });
    this.activatedRoot.queryParams.subscribe(queryParams => {
      const data = JSON.parse(queryParams.details);
      this.drugList = data;

    });
  }

  ngOnInit() {
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.providerId = user.id;
    this.getDigitalSign();
    // this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      if (mrId !== 0) {
        this.mrId = mrId;
      }
    });
    this.getMrprescription();
  }
  goBack() {
    this.router.navigate(['provider', 'medicalrecord', 'prescription']);
  }
  getDigitalSign() {
    if (this.providerId) {
      this.provider_services.getDigitalSign(this.providerId)
        .subscribe((data) => {
          console.log(data);
          this.digitalSign = true;
        },
          error => {
            this.digitalSign = false;
            // this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }

  getMrprescription() {
    if (this.mrId) {
      this.provider_services.getMRprescription(this.mrId)
        .subscribe((data) => {
          console.log(data);
          this.drugList = data;
          this.deleteFromDb = true;
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  addDrug() {
    this.addDrugdialogRef = this.dialog.open(AddDrugComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });
    this.addDrugdialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        for (const det of result) {
          this.drugList.push(det);
        }
      }
    });
  }

  editDrug(drug, index) {
    this.editedIndex = index;
    this.addDrugdialogRef = this.dialog.open(AddDrugComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'edit',
        drugDetails: drug
      }
    });
    this.addDrugdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drugList.splice(index, 1);
        for (const det of result) {
          this.drugList.push(det);
        }
      }
      console.log(this.drugList);
    });
  }

  deleteDrug(index) {
    this.drugList.splice(index, 1);
    console.log(this.drugList);
    this.showSave = true;
   if (this.deleteFromDb) {
    if (this.mrId) {
      this.provider_services.updateMRprescription(this.drugList, this.mrId).
        subscribe(res => {
          console.log(this.drugList);
        });
    }
   }
  }
  saveRx() {
    if (this.mrId) {
      this.provider_services.updateMRprescription(this.drugList, this.mrId).
        subscribe(res => {
          console.log(this.drugList);
          this.showSave = false;
          this.router.navigate(['provider', 'medicalrecord', 'prescription']);
        });
    } else {

      this.medicalrecord_service.createMR('prescriptions', this.drugList)
        .then(data => {
          this.medicalrecord_service.setCurrentMRID(data);
          this.showSave = false;
          this.sharedfunctionObj.openSnackBar('Prescription Saved Successfully');
          this.router.navigate(['provider', 'medicalrecord', 'prescription']);
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);

  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  saveDigitalSignImages(index) {
    this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
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
      this.uploadMrDigitalsign(this.providerId, submit_data, index);
    }
  }

  uploadMrDigitalsign(id, submit_data, val) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
      .subscribe((data) => {
        this.digitalSign = true;
        this.deleteTempImage(val);
        this.sharedfunctionObj.openSnackBar('Digital sign uploaded successfully');
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

  shareManualRx() {
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
  redirecToPrescriptionHome() {
    this.router.navigate(['provider', 'medicalrecord', 'prescription']);
  }
}
