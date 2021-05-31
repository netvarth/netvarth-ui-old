import { Component, OnInit } from '@angular/core';
import { AddDrugComponent } from './add-drug/add-drug.component';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MedicalrecordService } from '../medicalrecord.service';
import { InstructionsComponent } from './instructions/instructions.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ImagesviewComponent } from './imagesview/imagesview.component';
import { projectConstants } from '../..../../../../../app.component';
import { ShareRxComponent } from './share-rx/share-rx.component';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { AddNoteComponent } from './add-note/add-note.component';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  bookingId: any;
  bookingType: any;
  patientId: any;
  prescriptionSharedTimestamp: any;
  prescriptionShared = false;
  instructiondialogRef: any;
  addDrugdialogRef;
  drugList: any = [];
  today = new Date();
  patientDetails;
  userId;
  drugtype;
  editedIndex;
  drugdet;
  mrId = 0;
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
  image_list_popup: Image[];
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  addnotedialogRef: any;
  note = '';
  prescList = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private medicalrecord_service: MedicalrecordService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService
  ) {

  }
  ngOnInit() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    this.provider_user_Id = this.medicalrecord_service.getDoctorId();
    if (!this.provider_user_Id) {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      this.provider_user_Id = user.id;
    }
    if (this.mrId === 0) {
      this.loading = false;
    } else {
      this.getMrprescription(this.mrId);
      this.getMedicalRecord(this.mrId);
    }
  }

  getMedicalRecord(mrId) {
    this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          this.prescriptionShared = data.prescShared;
          this.prescriptionSharedTimestamp = data.lastSharedTime;

        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.wordProcessor.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.wordProcessor.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
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
  uploadSign() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'uploadsign' ]);

  }
  getDigitalSign() {
     
      this.provider_services.getDigitalSign(this.provider_user_Id)
        .subscribe((data) => {
          this.digitalSign = true;
        },
          error => {
            this.digitalSign = false;

          });

  }


  uploadRx() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'uploadRx' ]);
  }

  shareManualRx(type) {
    this.sharedialogRef = this.dialog.open(ShareRxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrId: this.mrId,
        type: type,
        patientId: this.patientId
      }
    });
    this.sharedialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  getMrprescription(mrId) {
    this.provider_services.getMRprescription(mrId)
      .subscribe((data) => {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          this.loading = false;
          this.prescList = true;
        }else{
        if (data['prescriptionsList'] && data['prescriptionsList'][0].keyName) {
          this.uploadlist = data['prescriptionsList'];
          this.prescList = false;
          this.image_list_popup = [];
          const imgobj = new Image(0,
            { // modal
              img: this.uploadlist[0].url,
              description: this.uploadlist[0].caption || ''
            });
          this.image_list_popup.push(imgobj);

        } else {
          this.drugList = data['prescriptionsList'];
          this.prescList = false;
          this.note = data['notes'];
          this.getDigitalSign();
        }
        this.loading = false;
      }
    },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }

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
        this.saveRx(result);
    //     setTimeout(() => {       
    //     const addnotedialogRef = this.dialog.open(AddNoteComponent, {
    //       width: '50%',
    //       panelClass: ['popup-class', 'commonpopupmainclass'],
    //       disableClose: true,
    //       data: {
    //         message:''
    //       }
    //   });
    //   addnotedialogRef.afterClosed().subscribe(result1 => {
    //       if(result1){
    //         console.log(result1);
    //         this.note = result1.message;
    //       }
    //       
    //   });
    // }, 500);
      }
    });
  }

  saveRx(result) {
    this.loading = true;
    let passdata = {
      "prescriptionsList":result,
      "notes": this.note
    }
    if (this.mrId) {
      this.provider_services.updateMRprescription(passdata, this.mrId).
        subscribe(res => {
          this.snackbarService.openSnackBar('Prescription Saved Successfully');
          this.getMrprescription(this.mrId);
          this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

        },
          error => {
            this.loading = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    } else {
      this.medicalrecord_service.createMR('prescriptions', passdata)
        .then((data: number) => {
          this.mrId = data;
          this.snackbarService.openSnackBar('Prescription Saved Successfully');
          this.getMrprescription(this.mrId);
          this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

        },
          error => {
            this.loading = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
    }
  }
  addNote(){
    const addnotedialogRef = this.dialog.open(AddNoteComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
              message:''
            }
        });
        addnotedialogRef.afterClosed().subscribe(result1 => {
            if(result1){
              console.log(result1);
             // this.note = result1.message;
              this.loading = true;
              let passdata = {
                "prescriptionsList":this.drugList,
                "notes": result1.message
              }
              this.provider_services.updateMRprescription(passdata, this.mrId).
              subscribe(res => {
                this.snackbarService.openSnackBar('Prescription updated Successfully');
                this.getMrprescription(this.mrId);
                this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      
              },
                error => {
                  this.loading = false;
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
            }
            
        });
  }
  updatePrescription() {
    this.disable = true;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      queryParams: { mode: 'view' }
    };
    this.router.navigate(['../addrxlist'], navigationExtras);


  }
  updatePaperPrescription() {
    this.disable = true;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      queryParams: { mode: 'view' }
    };
    this.router.navigate(['../uploadRx'], navigationExtras);
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
    file.title = 'Uploaded Prescription';
    this.imagesviewdialogRef = this.dialog.open(ImagesviewComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: file,
    });
    this.imagesviewdialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
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

      }
    });
  }
}
