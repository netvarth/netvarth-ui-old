import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalrecordService } from '../../medicalrecord.service';
import { AddDrugComponent } from '../add-drug/add-drug.component';
import { ShareRxComponent } from '../share-rx/share-rx.component';
import { projectConstants } from '../../../../../app.component';
import { InstructionsComponent } from '../instructions/instructions.component';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';


@Component({
  selector: 'app-drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css']
})
export class DrugListComponent implements OnInit {

  bookingId: any;
  bookingType: any;
  patientId: any;
  display_PatientId: any;
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
  instructiondialogRef;
  loading = true;
  disable = false;
  heading = 'Create Prescription';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;

  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private medicalrecord_service: MedicalrecordService) {

    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.details) {
        const data = JSON.parse(queryParams.details);
        this.drugList = data;
      }
      if (queryParams.mode) {
        const type = queryParams.mode;
        if (type === 'view') {
          this.heading = 'Update Prescription';
        }
      }
    });
  }

  ngOnInit() {
    this.patientDetails = this.medicalrecord_service.getPatientDetails();
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.providerId = user.id;

    this.getMrprescription();
  }
  goBack() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
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
        .subscribe((data: any) => {
          if (data && data.length !== 0) {
            this.drugList = data;
            this.loading = false;
          } else {
            this.loading = false;
          }
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
    this.disable = true;
    if (this.mrId) {
      this.provider_services.updateMRprescription(this.drugList, this.mrId).
        subscribe(res => {
          console.log(this.drugList);
          this.showSave = false;
<<<<<<< HEAD
          this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
=======
          this.sharedfunctionObj.openSnackBar('Prescription updated Successfully');
          this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'] ,  { queryParams: this.navigationParams });
>>>>>>> refs/remotes/origin/1.6.x
        },
          error => {
            this.disable = false;
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    } else {
      this.medicalrecord_service.createMR('prescriptions', this.drugList)
        .then((data: number) => {
          this.mrId = data;

          this.showSave = false;
          this.sharedfunctionObj.openSnackBar('Prescription Saved Successfully');
          this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
        },
          error => {
            this.disable = false;
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
  instrutionType(val) {
    const detail = val.length;
    let len;
    if (detail > 25) {
      len = 0;
    } else {
      len = 1;
    }
    return len;
  }
  truncateInst(val) {
    const inst = val.substr(0, 25);
    return inst;
  }
  instructPopUp(drug) {
    this.instructiondialogRef = this.dialog.open(InstructionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: drug

    });
    this.instructiondialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
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
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }
}
