import { Component, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../medicalrecord.service';
import { InstructionsComponent } from './instructions/instructions.component';


@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {

  instructiondialogRef: any;
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
  loading = true;
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
      console.log(this.mrId);

    });


  }

  ngOnInit() {
    if (this.mrId === 0) {
      this.loading = false;

    } else {
      this.getMrprescription(this.mrId);
    }

  }
  uploadRx() {
    this.router.navigate(['provider', 'customers', 'medicalrecord', 'uploadRx']);

  }

  getMrprescription(mrId) {
    console.log(mrId);
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        console.log(data);
        if (data[0].keyName) {
          this.uploadlist = data;
          console.log(this.uploadlist);
        } else {
          this.drugList = data;
        }
        this.loading = false;
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
        const navigationExtras: NavigationExtras = {
          queryParams: { details: JSON.stringify(result) }
        };
        this.router.navigate(['/provider/customers/medicalrecord/addrxlist'], navigationExtras);
      }
    });
  }

  updatePrescription() {
    this.router.navigate(['/provider/customers/medicalrecord/addrxlist']);
  }
  updatePaperPrescription() {
    this.router.navigate(['/provider/customers/medicalrecord/uploadRx']);
  }
  imageSize(val) {
    let imgsize;
    imgsize = Math.round((val / 1024));
    return imgsize;
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
    console.log(drug);
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
}
