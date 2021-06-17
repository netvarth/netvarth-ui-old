import { Component, OnInit, HostListener } from '@angular/core';
import { MedicalrecordService } from '../medicalrecord.service';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { MrfileuploadpopupComponent } from './mrfileuploadpopup/mrfileuploadpopup.component';
import { ShowuploadfileComponent } from './showuploadfile/showuploadfile.component';
import { Messages } from '../../../../shared/constants/project-messages';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-upload-file',
  templateUrl: './uploadfile.component.html'
})
export class UploadFileComponent implements OnInit {

  bookingId: any;
  bookingType: any;
  delete_btn = Messages.DELETE_BTN;
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
  heading = 'Uploaded Files';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  removeprescriptiondialogRef;
  imagesviewdialogRef;
  image_list_popup: Image[];
  uploadfiledialogRef;
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
  customer_label = '';
  msgDisplay = 'media';
  loading = false;
  windowScrolled: boolean;
  topHeight = 0;
  typeofFiles: any = [];
  uploadFiles: any = [];
  mediafiles: any = [];
  docfiles: any = [];
  fileviewdialogRef: any;
  removefiledialogRef: any;
  private subscriptions = new SubSink();
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private medicalrecord_service: MedicalrecordService) {
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');


    

  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    const header = document.getElementById('childActionBar');
    let qHeader = 0;
    let tabHeader = 0;
    if (document.getElementById('qHeader')) {
      qHeader = document.getElementById('qHeader').offsetHeight;
    }
    if (document.getElementById('tabHeader')) {
      tabHeader = document.getElementById('tabHeader').offsetHeight;
    }
    this.topHeight = qHeader + tabHeader;
    if (header) {
 
    }
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  ngOnInit() {

    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    if (this.mrId !== 0) {
      this.getMedicalRecordUsingId(this.mrId);
    }
    this.getPatientDetails(this.patientId);

  }
  getImageSource(file) {
    let imgsrc='/assets/images/pdf.png';
   // console.log(file);
    let type = '';
              type = file.type.split("/");
             // console.log(type[0]);
              if(type[0] == 'video'){
                imgsrc='/assets/images/video.png';
              } else if( type[0] == 'audio') {
                imgsrc='/assets/images/audio.png';
              }else if( type[0] == 'image') {
                imgsrc='/assets/images/imageexamle.png';
              }

    return imgsrc;

  }
  goBack() {
    this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
  }
  deleteFile(file) {
    this.removefiledialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
          'message': 'Do you really want to delete this file?'
      }
  });
  this.subscriptions.sink = this.removefiledialogRef.afterClosed().subscribe(result => {
      if (result) {
      
              this.subscriptions.sink = this.provider_services.deleteMRFile(this.mrId,file.uid)
                  .subscribe((data) => {
                    this.getMedicalRecordUsingId(this.mrId);
                  },
                      error => {
                          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                      });
          } 
      
  });
  }
  getPatientDetails(uid) {

    const filter = { 'id-eq': uid };
    this.subscriptions.sink=this.provider_services.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          this.patientDetails = response[0];
          this.patientId = this.patientDetails.id;
          if (this.patientDetails.memberJaldeeId) {
            this.display_PatientId = this.patientDetails.memberJaldeeId;
          } else if (this.patientDetails.jaldeeId) {
            this.display_PatientId = this.patientDetails.jaldeeId;
          }
          this.medicalrecord_service.setPatientDetails(this.patientDetails);


        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

  getMedicalRecordUsingId(mrId) {
    this.loading = true;
    this.mediafiles=[];
    this.docfiles=[];
   this.subscriptions.sink= this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          if (data.mrVideoAudio) {
            this.uploadFiles = data.mrVideoAudio;
            //console.log(this.uploadFiles);
            for (let file of this.uploadFiles) {
              let type = '';
              type = file.type.split("/");
             // console.log(type[0]);
              if(type[0] == 'video' || type[0] =='audio'|| type[0] =='image'){
                this.mediafiles.push(file);
              } else {
                this.docfiles.push(file);
              }
          }
          this.loading = false;
          }
        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
 
  

  uploadpopup() {
    this.uploadfiledialogRef = this.dialog.open(MrfileuploadpopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        mrid: this.mrId,
        patientid: this.patientId,
        bookingid: this.bookingId,
        bookingtype: this.bookingType
      }
    });
    this.uploadfiledialogRef.afterClosed().subscribe(result => {
      if (result) {
       
      }
    });
  }

 
showFile(file){
  //let type = file.type.split("/");
  //console.log(type[0]);
  this.fileviewdialogRef = this.dialog.open(ShowuploadfileComponent, {
    width: '50%',
    panelClass: ['popup-class', 'commonpopupmainclass', 'uploadfilecomponentclass'],
    disableClose: true,
    data: {
      file: file,
      source: 'mr'
    }
  });
  this.fileviewdialogRef.afterClosed().subscribe(result => {
    if (result) {

    }
  });
}
  

  somethingChanged() {
    this.showSave = true;
  }
  changemsgDisplayType(type) {
    this.msgDisplay = type;
    
  }
   scrollToTop() {
    // this.chekinSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  tabChange(event) {
   
    //this.loading = true;
  }

}
