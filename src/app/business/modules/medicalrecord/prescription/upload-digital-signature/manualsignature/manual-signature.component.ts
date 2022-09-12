import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { ProviderServices } from '../../../../../services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import {  NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manual-signature',
  templateUrl: './manual-signature.component.html',
  styleUrls: ['./manual-signature.component.css']

})
export class ManualSignatureComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  smallsignaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 200,
    'canvasHeight': 150
  };
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
  heading = 'Create digital signature';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  providerId;
  digitalSign = false;
  signatureviewdialogRef;
  bookingId: any;
  bookingType: any;
  patientId: any;
  sign = true;
  screenWidth;
  small_device_display = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadmanualsignatureRef: MatDialogRef<ManualSignatureComponent>,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private location: Location,
    private router: Router,
    // private activatedRoot: ActivatedRoute,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
    // private medicalrecord_service: MedicalrecordService
  ) {
    // console.log('this.data',this.data)
    this.mrId = this.data.mrid;
    this.patientId = this.data.patientid;
    this.bookingType = this.data.bookingtype;
    this.bookingId = this.data.bookingid;
    if (this.data.providerid) {
      this.providerId = this.data.providerid;
    }

  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    // console.log('window widht', window.innerWidth)
    if (this.screenWidth <= 780) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }

  ngOnInit() {
    this.onResize()
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from signature_pad API

  }

  drawComplete() {
    // will be notified signature_pad's onEnd event
    const signName = 'sign' + this.providerId + '.jpeg';
    const propertiesDetob = {};
    let i = 0;
    const blob = this.sharedfunctionObj.b64toBlobforSign(this.signaturePad.toDataURL());
    const submit_data: FormData = new FormData();
    submit_data.append('files', blob, signName);
    const properties = {
      'caption': this.selectedMessage.caption[i] || ''
    };
    propertiesDetob[i] = properties;
    i++;
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (this.providerId) {
      this.uploadMrDigitalsign(this.providerId, submit_data);
    }

  }
  clearSign() {
    this.signaturePad.clear();
  }

  drawStart() {
    // console.log('jjjj')
    this.sign = false;
  }
  goBack() {
    // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'uploadsign' ]);
    this.location.back();

  }

  uploadMrDigitalsign(id, submit_data) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
      .subscribe((data) => {
        // console.log('data',data)
        this.snackbarService.openSnackBar('Digital sign uploaded successfully');
        this.uploadmanualsignatureRef.close(data);
        this.router.navigate(['provider', 'customers', this.patientId, 'FOLLOWUP', 0, 'medicalrecord', this.mrId, 'prescription']);
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  resizeSignaturePad() {
    this.signaturePad.set('canvasWidth', document.getElementById("sign_canvas").offsetWidth);
    const canvas:any = document.querySelector("canvas");
    const ratio =  Math.max(window.devicePixelRatio || 2, 2);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    // this.signaturePad.clear();
    // const signaturePad = new SignaturePad(canvas);
    // console.log('signaturePad',signaturePad)
// signaturePad.minWidth = 5;
// signaturePad.maxWidth = 10;
// signaturePad.penColor = "rgb(66, 133, 244)";
}
resizeSignaturePadMobile(){
  // const ratio =  Math.max(window.devicePixelRatio || 1, 1);
  //   canvas.width = canvas.offsetWidth * ratio;
  //   canvas.height = canvas.offsetHeight * ratio;
  //   canvas.getContext("2d").scale(ratio, ratio);
  //   signaturePad.clear(); // otherwise isEmpty() might return incorrect value
}



}
