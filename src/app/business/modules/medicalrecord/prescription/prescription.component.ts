import { Component, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../medicalrecord.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ImagesviewComponent } from './imagesview/imagesview.component';
import { projectConstants } from '../..../../../../../app.component';
import { ShareRxComponent } from './share-rx/share-rx.component';


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
  dateFormatSp = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  disable = false;
  imagesviewdialogRef: any;
  providerId;
  digitalSign = false;
  sharedialogRef;
  navigations: any;
  provider_user_Id: any;
  constructor(
    // private activatedRoot: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private medicalrecord_service: MedicalrecordService,
  ) {
     this.medicalrecord_service.patient_data.subscribe(res => {
      this.navigations = res;
      console.log(this.navigations);
      this.provider_user_Id = res.provider_id;
      if (!this.provider_user_Id) {
        const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
        this.provider_user_Id = user.id;
      }
     
    });
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      this.mrId = mrId;
      console.log(this.mrId);

    });


  }

  ngOnInit() {
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.providerId = user.id;
   // this.getDigitalSign();
    if (this.mrId === 0) {
      this.loading = false;

    } else {
      this.getMrprescription(this.mrId);
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

  getDigitalSign() {
    if (this.provider_user_Id) {
      this.provider_services.getDigitalSign(this.provider_user_Id)
        .subscribe((data) => {
          console.log(data);
          this.digitalSign = true;
        },
          error => {
            this.digitalSign = false;
            //this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
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
    if (this.provider_user_Id) {
      this.uploadMrDigitalsign(this.provider_user_Id, submit_data, index);
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

  uploadRx() {
    this.router.navigate(['provider', 'customers', 'medicalrecord', 'uploadRx']);
  }

  shareManualRx(type) {
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        userId: this.provider_user_Id,
        provider_user_Id: this.provider_user_Id,
        type: type
      }
    });
    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  getMrprescription(mrId) {
    console.log(mrId);
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        if (data === null) {
          this.loading = false;
        }
        if (data[0].keyName) {
          this.uploadlist = data;
          console.log(this.uploadlist);
        } else {
          this.drugList = data;
          this.getDigitalSign();
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
    this.disable = true;
    const navigationExtras: NavigationExtras = {
      queryParams: { mode: 'view' }
    };
    this.router.navigate(['/provider/customers/medicalrecord/addrxlist'], navigationExtras);
  }
  updatePaperPrescription() {
    this.disable = true;
    const navigationExtras: NavigationExtras = {
      queryParams: { mode: 'view' }
    };
    this.router.navigate(['/provider/customers/medicalrecord/uploadRx'],navigationExtras);
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
  showimgPopup(file) {
    this.imagesviewdialogRef = this.dialog.open(ImagesviewComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: file,
    });
    this.imagesviewdialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
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
