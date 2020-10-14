import { Component, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../medicalrecord.service';


@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {

  addDrugdialogRef;
  drugList: any = [];
  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId;
  optionsForRx = true;
  uploadRxstat = false;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
};
  constructor(
  // private activatedRoot: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  public sharedfunctionObj: SharedFunctions,
  public provider_services: ProviderServices,
  private medicalrecord_service: MedicalrecordService,
   ) {
  this.medicalrecord_service.patient_data.subscribe(data => {
    this.patientDetails = data;
    this.userId = this.patientDetails.id;
    console.log(this.userId);

  });

}

ngOnInit() {
  this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
  this.getMrprescription();
}
uploadRx() {
  this.router.navigate(['/provider/medicalrecord/uploadRx']);

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
saveImages() {
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
  if (this.mrId) {
    this.uploadMrPrescription(this.mrId, submit_data);
  } else {
    const passingdata = {
      'bookingType': 'NA',
      'consultationMode': 'EMAIL',
      'mrConsultationDate': this.today
    };

    this.provider_services.createMedicalRecord(passingdata, this.userId)
      .subscribe((data) => {
        console.log(data);
        this.sharedfunctionObj.setitemonLocalStorage('mrId', data);
        this.uploadMrPrescription(data, submit_data);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });

  }
}
uploadMrPrescription(id, submit_data) {
  this.provider_services.uploadMRprescription(id, submit_data)
    .subscribe((data) => {
      this.sharedfunctionObj.openSnackBar('Prescription created successfully');
    },
      error => {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
}

deleteTempImage(index) {
  this.selectedMessage.files.splice(index, 1);
}
addDrug() {

  this.addDrugdialogRef = this.dialog.open(AddDrugComponent, {
    width: '50%',
    panelClass: ['popup-class', 'commonpopupmainclass'],
    disableClose: true,
    data: {
      type: 'add',
      isFrom: 'manualAddrx'
    }
  });

  this.addDrugdialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log(result);
      const navigationExtras: NavigationExtras = {
        queryParams: { details: JSON.stringify(result) }
      };
      this.router.navigate(['/provider/medicalrecord/addrxlist'], navigationExtras);
    }
  });
}
getMrprescription() {
  if (this.mrId) {
    this.provider_services.getMRprescription(this.mrId)
      .subscribe((data) => {
        console.log(data);
        this.drugList = data;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });

  }
}

deleteDrug(index) {
  this.drugList.splice(index, 1);
  // delete this.drugList[index];
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
      this.drugList.push(result);
    }
    console.log(this.drugList);
  });
}

savePrescription() {
  this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
  if (this.mrId) {
    this.provider_services.updateMRprescription(this.drugList, this.mrId).
      subscribe(res => {

      });
  } else {
    const passingdata = {
      'bookingType': 'NA',
      'consultationMode': 'EMAIL',
      'prescriptions': this.drugList,
      'mrConsultationDate': this.today
    };
    console.log(passingdata, this.userId);
    this.provider_services.createMedicalRecord(passingdata, this.userId)
      .subscribe((data) => {
        this.sharedfunctionObj.setitemonLocalStorage('mrId', data);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
}
}
