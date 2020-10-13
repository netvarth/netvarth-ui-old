import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MedicalrecordService } from '../../medicalrecord.service';
import { AddDrugComponent } from '../add-drug/add-drug.component';
import { ShareRxComponent } from '../share-rx/share-rx.component';

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


  constructor( public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    public dialog: MatDialog,
    private activatedRoot: ActivatedRoute,
    private medicalrecord_service: MedicalrecordService) {
      this.medicalrecord_service.patient_data.subscribe(data => {
        this.patientDetails = data;
        this.userId = this.patientDetails.id;
      });
      this.activatedRoot.queryParams.subscribe(queryParams => {
          console.log(JSON.parse(queryParams.details));
        const data = JSON.parse(queryParams.details);
        console.log(data);
        this.drugList = data;
          console.log(this.drugList);
          console.log(this.drugList.length);
        });
    }

  ngOnInit() {
    this.mrId = this.sharedfunctionObj.getitemfromLocalStorage('mrId');
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.providerId = user.id;
    this.getMrprescription();
    this.getDigitalSign();
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
    // delete this.drugList[index];
  }
  saveRx() {
    if (this.mrId) {
        this.provider_services.updateMRprescription(this.drugList, this.mrId).
        subscribe(res => {
            console.log(this.drugList);
            this.showSave = false;
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
                this.sharedfunctionObj.setitemonLocalStorage('mrId', data );
                this.showSave = false;
              },
                  error => {
                      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  });
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    this.showSave = true;
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


}
