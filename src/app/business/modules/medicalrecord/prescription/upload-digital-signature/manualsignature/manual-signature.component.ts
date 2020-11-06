import { Component, OnInit, ViewChild } from '@angular/core';
import { MedicalrecordService } from '../../../medicalrecord.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-manual-signature',
  templateUrl: './manual-signature.component.html'
})
export class ManualSignatureComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 250,
    'canvasHeight': 250,
    'canvasstyle': 'background-color: gainsboro',
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
  uploadImages: any =[] ;

  upload_status = 'Added to list';
  disable = false;
  heading = 'Upload digital signature';
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  navigationParams: any;
  navigationExtras: NavigationExtras;
  providerId;
  digitalSign = false;
  signatureviewdialogRef;
  digitalsignature = {};
  sign = true;
  
  constructor(public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    private activatedRoot: ActivatedRoute,
    public dialog: MatDialog,
    private medicalrecord_service: MedicalrecordService) {
    this.medicalrecord_service.patient_data.subscribe(res => {
      this.navigationParams = res;
      this.navigationExtras = this.navigationParams;
    });
    this.medicalrecord_service.patient_data.subscribe(data => {
      this.patientDetails = JSON.parse(data.customerDetail);
      if (this.patientDetails.memberJaldeeId) {
        this.display_PatientId = this.patientDetails.memberJaldeeId;
      } else if (this.patientDetails.jaldeeId) {
        this.display_PatientId = this.patientDetails.jaldeeId;
      }
      this.userId = this.patientDetails.id;
    });
    this.medicalrecord_service._mrUid.subscribe(mrId => {
      if (mrId !== 0) {
        this.mrId = mrId;
      }
    });
    this.activatedRoot.queryParams.subscribe(queryParams => {
      if (queryParams.providerId) {
        this.providerId = queryParams.providerId;
      }
    });

  }

  ngOnInit() {
   
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
      console.log(blob);
       const submit_data: FormData = new FormData();
      submit_data.append('files', blob, signName);
      console.log(submit_data);
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

  drawStart() {
    // will be notified signature_pad's onBegin event
    this.sign = false;
    console.log('begin drawing');
  }
  goBack() {
   // this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], { queryParams: this.navigationParams });
  }
  clearSign() {
    this.signaturePad.clear();
  }

  uploadMrDigitalsign(id, submit_data) {
    this.provider_services.uploadMrDigitalsign(id, submit_data)
      .subscribe((data) => {
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], { queryParams: this.navigationParams });
        this.sharedfunctionObj.openSnackBar('Digital sign uploaded successfully');
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

 
}
