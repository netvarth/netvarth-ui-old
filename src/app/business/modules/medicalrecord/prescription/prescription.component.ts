import { Component, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { NavigationExtras, Router } from '@angular/router';
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
  uploadlist: any = [];
  constructor(
    // private activatedRoot: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private medicalrecord_service: MedicalrecordService,
  ) {
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      this.mrId = mrId;
    });


  }

  ngOnInit() {
    if (this.mrId === 0) {
      console.log('mrIdis zero');

    } else {
      this.getMrprescription(this.mrId);
    }

  }
  uploadRx() {
    this.router.navigate(['/provider/medicalrecord/uploadRx']);

  }

  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        console.log(data);
        if (data[0].keyName) {
          this.uploadlist = data;
          console.log(this.uploadlist);
        } else {
          this.drugList = data;
        }
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
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

  updatePrescription() {
    this.router.navigate(['/provider/medicalrecord/addrxlist']);
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
