import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { DentalHomeService } from '../dental-home.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileService } from '../../../../shared/services/file-service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { MatDialog } from '@angular/material/dialog';
// import { SurfaceConfirmComponent } from '../surface-confirm/surface-confirm.component';

@Component({
  selector: 'app-teeth-question',
  templateUrl: './teeth-question.component.html',
  styleUrls: ['./teeth-question.component.scss']
})
export class TeethQuestionComponent implements OnInit {
  createTeeth: UntypedFormGroup;
  isAdult = true;
  isChild = false;
  isMixed = false;
  type: string;
  apiloading: any = false;
  selectedFiles = {
    "photo": { files: [], base64: [], caption: [] }
  }
  filesToUpload: any = [];
  businessDetails: any;
  businessId: any;
  isMesial = true;
  isDistal = false;
  isBuccal = false;
  isLingual = false;
  isIncisal = false;
  isMissing = false;
  isMesialData = false;
  isDistalData = false;
  isBuccalData= false;
  isLingualData= false;
  isIncisalData= false;
  isMissingData= false;
  mrId = 0;
  customerId: any;
  customerDetails: any;
  toothId: any;
  mrid;
  teethDetails: any;
  selectedTeeth: any;
  newData: { attachments: any[]; };
  dentalType: any;
  dentalState: string;
  teethId: any;
  teethDetailsById;
  action: any;
  showChiefIssue = false
  teethIndex: any;
  isMesialComplete: boolean;
  teeth_loading = false;
  bookingType: any;
  bookingId: any;
  calledfrom: any;
  constructor(
    private createTeethFormBuilder: UntypedFormBuilder,
    private location: Location,
    private fileService: FileService,
    private activated_route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private dental_homeservice: DentalHomeService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
    // public dialogRef: MatDialogRef<SurfaceConfirmComponent>
  ) {
    this.activated_route.queryParams.subscribe(params => {
      if (params['mrid']) {
        this.mrid = params['mrid'];
        this.getTeethDetails()
      }
      if (params['action']) {
        this.action = params['action'];
      }
      if (params['teethId']) {
        this.teethId = params['teethId'];
      }
      if (params['custId']) {
        this.customerId = params['custId'];
      }
      if (params['teethIndex']) {
        this.teethIndex = params['teethIndex'];
      }
      this.customerId = params['patientId'];
      this.dentalType = params['type'];
      if (params['bookingType']) {
        this.bookingType = params['bookingType'];
      }
      if (params['bookingId']) {
        this.bookingId = params['bookingId'];
      }
      if (params['calledfrom']) {
        this.calledfrom = params['calledfrom'];
      }
    });

  }
  ngOnInit(): void {

    const medicalRecordCustId = this.activatedRoute.parent.snapshot.params['id'];
    this.toothId = medicalRecordCustId;
    this.createTeeth = this.createTeethFormBuilder.group({
      symptoms_mesial: [null],
      observations_mesial: [null],
      diagnosis_mesial: [null],
      notes_mesial: [null],
      procedure_mesial: [null],
      symptoms_distal: [null],
      observations_distal: [null],
      diagnosis_distal: [null],
      notes_distal: [null],
      procedure_distal: [null],
      symptoms_buccal: [null],
      observations_buccal: [null],
      diagnosis_buccal: [null],
      notes_buccal: [null],
      procedure_buccal: [null],
      symptoms_lingual: [null],
      observations_lingual: [null],
      diagnosis_lingual: [null],
      notes_lingual: [null],
      procedure_lingual: [null],
      symptoms_incisal: [null],
      observations_incisal: [null],
      diagnosis_incisal: [null],
      notes_incisal: [null],
      procedure_incisal: [null],
      symptoms_missing: [null],
      observations_missing: [null],
      diagnosis_missing: [null],
      notes_missing: [null],
      procedure_missing: [null],
      chiefIssue: [null],
      chiefComplaint: [null],
    });
    if (this.action === 'edit') {
      this.teeth_loading = true;
      if(this.teethId){
        this.dental_homeservice.getTeethDetailsById(this.mrid, this.teethId).subscribe((data) => {
          this.teethDetailsById = data;
          
          this.setTeethValues();
          
       
        });
      }
    

    }
    this.dental_homeservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
  }
  setTeethValues() {
   
    console.log(this.teethDetailsById)
    if (this.teethDetailsById && this.teethDetailsById.surface) {
      if (this.teethDetailsById.surface.mesial) {
        this.isMesialData = true;
        this.isMesial = true;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;

      }
      if (this.teethDetailsById.surface['distal']) {
        this.isDistalData = true;
        this.isMesial = false;
        this.isDistal = true;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;

       
      }
      if (this.teethDetailsById.surface['buccal']) {
        this.isBuccalData = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = true;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;
     
      }
      if (this.teethDetailsById.surface['lingual']) {
        this.isLingualData = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = true;
        this.isIncisal = false;
        this.isMissing = false;
      }
      if (this.teethDetailsById.surface['incisal']) {
        this.isIncisalData = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = true;
        this.isMissing = false;
       
      }
      if (this.teethDetailsById.surface['occlusal']) {
        this.isMissingData = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = true;
       
      }
    }
    this.teeth_loading = false;
    // this.createTeeth.controls['chiefComplaint'].setValue(this.teethDetailsById.chiefComplaint);
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.mesial && this.teethDetailsById.surface.mesial.symptoms) {
      this.createTeeth.controls['symptoms_mesial'].setValue(this.teethDetailsById.surface.mesial.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.mesial && this.teethDetailsById.surface.mesial.observations) {
      this.createTeeth.controls['observations_mesial'].setValue(this.teethDetailsById.surface.mesial.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.mesial && this.teethDetailsById.surface.mesial.diagnosis) {
      this.createTeeth.controls['diagnosis_mesial'].setValue(this.teethDetailsById.surface.mesial.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.mesial && this.teethDetailsById.surface.mesial.description) {
      this.createTeeth.controls['notes_mesial'].setValue(this.teethDetailsById.surface.mesial.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.mesial && this.teethDetailsById.surface.mesial.procedure) {
      this.createTeeth.controls['procedure_mesial'].setValue(this.teethDetailsById.surface.mesial.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.distal && this.teethDetailsById.surface.distal.symptoms) {
      this.createTeeth.controls['symptoms_distal'].setValue(this.teethDetailsById.surface.distal.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.distal && this.teethDetailsById.surface.distal.observations) {
      this.createTeeth.controls['observations_distal'].setValue(this.teethDetailsById.surface.distal.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.distal && this.teethDetailsById.surface.distal.diagnosis) {
      this.createTeeth.controls['diagnosis_distal'].setValue(this.teethDetailsById.surface.distal.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.distal && this.teethDetailsById.surface.distal.description) {
      this.createTeeth.controls['notes_distal'].setValue(this.teethDetailsById.surface.distal.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.distal && this.teethDetailsById.surface.distal.procedure) {
      this.createTeeth.controls['procedure_distal'].setValue(this.teethDetailsById.surface.distal.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.buccal && this.teethDetailsById.surface.buccal.symptoms) {
      this.createTeeth.controls['symptoms_buccal'].setValue(this.teethDetailsById.surface.buccal.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.buccal && this.teethDetailsById.surface.buccal.observations) {
      this.createTeeth.controls['observations_buccal'].setValue(this.teethDetailsById.surface.buccal.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.buccal && this.teethDetailsById.surface.buccal.diagnosis) {
      this.createTeeth.controls['diagnosis_buccal'].setValue(this.teethDetailsById.surface.buccal.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.buccal && this.teethDetailsById.surface.buccal.description) {
      this.createTeeth.controls['notes_buccal'].setValue(this.teethDetailsById.surface.buccal.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.buccal && this.teethDetailsById.surface.buccal.procedure) {
      this.createTeeth.controls['procedure_buccal'].setValue(this.teethDetailsById.surface.buccal.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.lingual && this.teethDetailsById.surface.lingual.symptoms) {
      this.createTeeth.controls['symptoms_lingual'].setValue(this.teethDetailsById.surface.lingual.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.lingual && this.teethDetailsById.surface.lingual.observations) {
      this.createTeeth.controls['observations_lingual'].setValue(this.teethDetailsById.surface.lingual.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.lingual && this.teethDetailsById.surface.lingual.diagnosis) {
      this.createTeeth.controls['diagnosis_lingual'].setValue(this.teethDetailsById.surface.lingual.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.lingual && this.teethDetailsById.surface.lingual.description) {
      this.createTeeth.controls['notes_lingual'].setValue(this.teethDetailsById.surface.lingual.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.lingual && this.teethDetailsById.surface.lingual.procedure) {
      this.createTeeth.controls['procedure_lingual'].setValue(this.teethDetailsById.surface.lingual.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.incisal && this.teethDetailsById.surface.incisal.symptoms) {
      this.createTeeth.controls['symptoms_incisal'].setValue(this.teethDetailsById.surface.incisal.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.incisal && this.teethDetailsById.surface.incisal.observations) {
      this.createTeeth.controls['observations_incisal'].setValue(this.teethDetailsById.surface.incisal.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.incisal && this.teethDetailsById.surface.incisal.diagnosis) {
      this.createTeeth.controls['diagnosis_incisal'].setValue(this.teethDetailsById.surface.incisal.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.incisal && this.teethDetailsById.surface.incisal.description) {
      this.createTeeth.controls['notes_incisal'].setValue(this.teethDetailsById.surface.incisal.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.incisal && this.teethDetailsById.surface.incisal.procedure) {
      this.createTeeth.controls['procedure_incisal'].setValue(this.teethDetailsById.surface.incisal.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.occlusal && this.teethDetailsById.surface.occlusal.symptoms) {
      this.createTeeth.controls['symptoms_missing'].setValue(this.teethDetailsById.surface.occlusal.symptoms);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.occlusal && this.teethDetailsById.surface.occlusal.observations) {
      this.createTeeth.controls['observations_missing'].setValue(this.teethDetailsById.surface.occlusal.observations);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.occlusal && this.teethDetailsById.surface.occlusal.diagnosis) {
      this.createTeeth.controls['diagnosis_missing'].setValue(this.teethDetailsById.surface.occlusal.diagnosis);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.occlusal && this.teethDetailsById.surface.occlusal.description) {
      this.createTeeth.controls['notes_missing'].setValue(this.teethDetailsById.surface.occlusal.description);
    }
    if (this.teethDetailsById && this.teethDetailsById.surface && this.teethDetailsById.surface.occlusal && this.teethDetailsById.surface.occlusal.procedure) {
      this.createTeeth.controls['procedure_missing'].setValue(this.teethDetailsById.surface.occlusal.procedure);
    }
    if (this.teethDetailsById && this.teethDetailsById.chiefIssue) {
      this.createTeeth.controls['chiefIssue'].setValue(this.teethDetailsById.chiefIssue);
    }
    if (this.teethDetailsById && this.teethDetailsById.chiefComplaint) {
      this.createTeeth.controls['chiefComplaint'].setValue(this.teethDetailsById.chiefComplaint);
    }

    if (this.teethDetailsById && this.teethDetailsById.attachments) {
      this.selectedFiles['photo'].files = this.teethDetailsById.attachments;
    }
  }
  getTeethDetails() {
    this.dental_homeservice.getTeethDetails(this.mrid).subscribe((data) => {
      this.teethDetails = data;
      this.selectedTeeth = this.teethDetails.teeth;

    });

  }
  goBack() {
    this.location.back();
  }
  filesSelected(event, type) {
    this.apiloading = true;

    const input = event.target.files;

    let fileUploadtoS3 = [];
    const _this = this;
    this.fileService.filesSelected(event, _this.selectedFiles[type]).then(
      () => {
        let index = _this.filesToUpload && _this.filesToUpload.length > 0 ? _this.filesToUpload.length : 0;
        for (const pic of input) {
          const size = pic["size"] / 1024;
          let fileObj = {
            owner: _this.businessId,
            ownerType: "Provider",
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            action: 'add'
          }
          console.log("pic", pic)
          fileObj['file'] = pic;
          fileObj['type'] = type;
          fileObj['order'] = index;
          _this.filesToUpload.push(fileObj);
          fileUploadtoS3.push(fileObj);
          index++;
        }

        _this.dental_homeservice.uploadFilesToS3(fileUploadtoS3).subscribe(
          (s3Urls: any) => {
            if (s3Urls && s3Urls.length > 0) {
              _this.uploadAudioVideo(s3Urls).then(
                (dataS3Url) => {

                  _this.apiloading = false;
                  console.log("Sending Attachment Success");
                });
            }
          }, error => {
            _this.apiloading = false;
            _this.snackbarService.openSnackBar(error,
              { panelClass: "snackbarerror" }
            );
          }
        );

      }).catch((error) => {
        _this.apiloading = false;
        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })
  }
  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;

    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log('_this.filesToUpload', _this.filesToUpload)
        let file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          file['driveId'] = s3UrlObj.driveId;
          await _this.uploadFiles(file['file'], s3UrlObj.url, s3UrlObj.driveId).then(
            () => {
              count++;
              if (count === data.length) {
                resolve(true);
                console.log('_this.filesToUpload', _this.filesToUpload)
              }
            }
          );
        }
        else {
          resolve(true);
        }
      }
    })
  }
  uploadFiles(file, url, driveId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.dental_homeservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          console.log("Final Attchment Sending Attachment Success", file)
          _this.dental_homeservice.videoaudioS3UploadStatusUpdate('COMPLETE', driveId).subscribe((data: any) => {
            resolve(true);
          })
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  saveTeeth() {

    // const bookingId = 0;
    // const bookingType = 'FOLLOWUP';
    // const patientId = this.customerId;

    switch (this.dentalType) {
      case "adult":
        this.dentalState = "PERMANENT";
        break;
      case "child":
        this.dentalState = "TEMPORARY";
        break;
      case "mixed":
        this.dentalState = "MIXED";
        break;
      default:
        break;
    }
    console.log(this.dentalState)
    let symptoms = [];
    let payload: any = []
    let surface = {}
    let mesial = {};
    let distal = {};
    let buccal = {};
    let lingual = {};
    let incisal = {};
    let occlusal = {};
    if (this.isMesialData) {
      mesial = {
        "description": this.createTeeth.controls['notes_mesial'].value,
        "symptoms": this.createTeeth.controls['symptoms_mesial'].value,
        "observations": this.createTeeth.controls['observations_mesial'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_mesial'].value,
        "procedure": this.createTeeth.controls['procedure_mesial'].value,
      }
      surface["mesial"] = mesial;
    }
    if (this.isDistalData) {
      distal = {
        "description": this.createTeeth.controls['notes_distal'].value,
        "symptoms": this.createTeeth.controls['symptoms_distal'].value,
        "observations": this.createTeeth.controls['observations_distal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_distal'].value,
        "procedure":  this.createTeeth.controls['procedure_distal'].value,
      }
      surface["distal"] = distal
    }
    if (this.isBuccalData) {
      buccal = {
        "description": this.createTeeth.controls['notes_buccal'].value,
        "symptoms": this.createTeeth.controls['symptoms_buccal'].value,
        "observations": this.createTeeth.controls['observations_buccal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_buccal'].value,
        "procedure": this.createTeeth.controls['procedure_buccal'].value,
      }
      surface["buccal"] = buccal
    }
    if (this.isLingualData) {
      lingual = {
        "description": this.createTeeth.controls['notes_lingual'].value,
        "symptoms": this.createTeeth.controls['symptoms_lingual'].value,
        "observations": this.createTeeth.controls['observations_lingual'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_lingual'].value,
        "procedure":  this.createTeeth.controls['procedure_lingual'].value,
      }
      surface["lingual"] = lingual
    }
    if (this.isIncisalData) {
      incisal = {
        "description": this.createTeeth.controls['notes_incisal'].value,
        "symptoms": this.createTeeth.controls['symptoms_incisal'].value,
        "observations": this.createTeeth.controls['observations_incisal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_incisal'].value,
        "procedure":  this.createTeeth.controls['procedure_incisal'].value,
      }
      surface["incisal"] = incisal
    }
    if (this.isMissingData) {
      occlusal = {
        "description": this.createTeeth.controls['notes_missing'].value,
        "symptoms": this.createTeeth.controls['symptoms_missing'].value,
        "observations": this.createTeeth.controls['observations_missing'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_missing'].value,
        "procedure":  this.createTeeth.controls['procedure_missing'].value,
      }
      surface["occlusal"] = occlusal
    }

    for (let i = 0; i < this.filesToUpload.length; i++) {
      console.log('clinicalNotesAddListxx', this.filesToUpload);

      if (this.filesToUpload[i]["type"] == 'photo') {
        symptoms.push(this.filesToUpload[i])
      }

    }
    if (this.teethDetails?.teeth) {
      payload = {
        "dentalState": this.dentalState,
        "teeth": [
          {
            "toothId": this.toothId,
            "surface": surface,
            "status": "missing",
            "chiefIssue": this.createTeeth.controls['chiefIssue'].value,
            "chiefComplaint": this.createTeeth.controls['chiefComplaint'].value,
            "notes": "notes",
            "attachments": symptoms
          }
        ],
      }

    }
    else {
      payload = {
        "bookingType": "FOLLOWUP",
        "consultationMode": "OP",
        "dentalChart": {
          "dentalState": this.dentalState,
          "teeth": [
            {
              "toothId": this.toothId,
              "surface": surface,
              "status": "missing",
              "chiefIssue": this.createTeeth.controls['chiefIssue'].value,
              "chiefComplaint": this.createTeeth.controls['chiefComplaint'].value,
              "notes": "notes",
              "attachments": symptoms
            }
          ],
        }
      }
    }
    if (this.action === 'edit') {
      this.dental_homeservice.updateMR(this.mrid, payload).subscribe((data) => {
        this.mrid = data;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            mrid: this.mrid,
            custId: this.customerId,
            bookingType : this.bookingType,
            bookingId : this.bookingId,
            calledfrom : this.calledfrom
          }
        };
        this.router.navigate(['provider', 'dental'], navigationExtras);
        this.goBack()
      })
    }
    else {
      if (this.teethDetails?.teeth) {
        this.dental_homeservice.updateMR(this.mrid, payload).subscribe((data) => {
          this.mrid = data;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              mrid: this.mrid,
              custId: this.customerId,
              bookingType : this.bookingType,
              bookingId : this.bookingId,
              calledfrom : this.calledfrom
            }
          };
          this.router.navigate(['provider', 'dental'], navigationExtras);
          this.goBack()
        })
      }
      else {
        this.dental_homeservice.createMedicalRecordForFollowUp(this.customerId, payload).subscribe((data) => {
          this.mrid = data;

          const navigationExtras: NavigationExtras = {
            queryParams: {
              mrid: this.mrid,
              custId: this.customerId,
              bookingType : this.bookingType,
              bookingId : this.bookingId,
              calledfrom : this.calledfrom
            }
          };
          this.router.navigate(['provider', 'dental'], navigationExtras);
        })
      }
    }
  }
  mesialClick() {
 
   
      this.isMesial = true;
      this.isDistal = false;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = false;
      this.isMesialData = true;
      // if(!this.isMesialData){
      //   const dialogref = this.dialog.open(SurfaceConfirmComponent, {
      //     width: "30%",
      //     panelClass: [
      //       "popup-class",
      //       "commonpopupmainclass",
      //       "confirmationmainclass"
      //     ],
      //     disableClose: true,
      //     data: {
      //     }
      //   });
      //   dialogref.afterClosed().subscribe(result => {
        
      //     if(result === 'not'){
      //       this.isMesialData = true;
      //     }
      //     else if(result === 'same'){
      //       this.isMesialData = false;
      //       // this.amForm.reset();
      //       this.createTeeth.controls['notes_mesial'].reset();
      //       this.createTeeth.controls['symptoms_mesial'].reset();
      //       this.createTeeth.controls['observations_mesial'].reset();
      //       this.createTeeth.controls['diagnosis_mesial'].reset();
      //       this.createTeeth.controls['procedure_mesial'].reset();
           
      //     }
      //   });
      // }
    
    
  }
  distalClick() {
   
  
      this.isMesial = false;
      this.isDistal = true;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = false;
      this.isDistalData = true;
      // if(!this.isDistalData){
      //   const dialogref = this.dialog.open(SurfaceConfirmComponent, {
      //     width: "30%",
      //     panelClass: [
      //       "popup-class",
      //       "commonpopupmainclass",
      //       "confirmationmainclass"
      //     ],
      //     disableClose: true,
      //     data: {
      //     }
      //   });
      //   dialogref.afterClosed().subscribe(result => {
        
      //     if(result === 'not'){
      //       this.isDistalData = true;
      //     }
      //     else if(result === 'same'){
      //       this.isDistalData = false;
      //       this.createTeeth.controls['notes_distal'].reset();
      //       this.createTeeth.controls['symptoms_distal'].reset();
      //       this.createTeeth.controls['observations_distal'].reset();
      //       this.createTeeth.controls['diagnosis_distal'].reset();
      //       this.createTeeth.controls['procedure_distal'].reset();
           
      //     }
      //   });
      // }
    
    
  }
  buccalClick() {
    
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = true;
    this.isLingual = false;
    this.isIncisal = false;
    this.isMissing = false;
    this.isBuccalData = true;
  //   if(!this.isBuccalData){
  //     const dialogref = this.dialog.open(SurfaceConfirmComponent, {
  //       width: "30%",
  //       panelClass: [
  //         "popup-class",
  //         "commonpopupmainclass",
  //         "confirmationmainclass"
  //       ],
  //       disableClose: true,
  //       data: {
  //       }
  //     });
  //     dialogref.afterClosed().subscribe(result => {
       
  //       if(result === 'not'){
  //         this.isBuccalData = true;
  //       }
  //       else if(result === 'same'){
  //         this.isBuccalData = false;
  //         this.createTeeth.controls['notes_buccal'].reset();
  //         this.createTeeth.controls['symptoms_buccal'].reset();
  //         this.createTeeth.controls['observations_buccal'].reset();
  //         this.createTeeth.controls['diagnosis_buccal'].reset();
  //         this.createTeeth.controls['procedure_buccal'].reset();
         
  //       }
  //     });
    
  // }
  }
  lingualClick() {
    
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = true;
    this.isIncisal = false;
    this.isMissing = false;
    this.isLingualData = true;
    // if(!this.isLingualData){
    //   const dialogref = this.dialog.open(SurfaceConfirmComponent, {
    //     width: "30%",
    //     panelClass: [
    //       "popup-class",
    //       "commonpopupmainclass",
    //       "confirmationmainclass"
    //     ],
    //     disableClose: true,
    //     data: {
    //     }
    //   });
    //   dialogref.afterClosed().subscribe(result => {
      
    //     if(result === 'not'){
    //       this.isLingualData = true;
    //     }
    //     else if(result === 'same'){
    //       this.isLingualData = false;
    //       this.createTeeth.controls['notes_lingual'].reset();
    //       this.createTeeth.controls['symptoms_lingual'].reset();
    //       this.createTeeth.controls['observations_lingual'].reset();
    //       this.createTeeth.controls['diagnosis_lingual'].reset();
    //       this.createTeeth.controls['procedure_lingual'].reset();
         
    //     }
    //   });
    // }
  
  }
  incisalClick() {
   
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = true;
    this.isMissing = false;
    this.isIncisalData = true;
    // if(!this.isIncisalData){
    //   const dialogref = this.dialog.open(SurfaceConfirmComponent, {
    //     width: "30%",
    //     panelClass: [
    //       "popup-class",
    //       "commonpopupmainclass",
    //       "confirmationmainclass"
    //     ],
    //     disableClose: true,
    //     data: {
    //     }
    //   });
    //   dialogref.afterClosed().subscribe(result => {
     
    //     if(result === 'not'){
    //       this.isIncisalData = true;
    //     }
    //     else if(result === 'same'){
    //       this.isIncisalData = false;
    //       this.createTeeth.controls['notes_incisal'].reset();
    //       this.createTeeth.controls['symptoms_incisal'].reset();
    //       this.createTeeth.controls['observations_incisal'].reset();
    //       this.createTeeth.controls['diagnosis_incisal'].reset();
    //       this.createTeeth.controls['procedure_incisal'].reset();
         
    //     }
    //   });
    // }
  
  }
  misingClick() {
   
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = false;
    this.isMissing = true;
    this.isMissingData = true;
  
  }
  resetErrors() {
    if ((this.createTeeth.controls['notes_incisal'].value === '') && (this.createTeeth.controls['symptoms_incisal'].value === '') && (this.createTeeth.controls['procedure_incisal'].value === '') && (this.createTeeth.controls['diagnosis_incisal'].value === '') && (this.createTeeth.controls['observations_incisal'].value === '')) {
      this.isIncisalData = false;
    }
    if ((this.createTeeth.controls['notes_mesial'].value === '') && (this.createTeeth.controls['symptoms_mesial'].value === '') && (this.createTeeth.controls['observations_mesial'].value === '') && (this.createTeeth.controls['diagnosis_mesial'].value === '') && (this.createTeeth.controls['procedure_mesial'].value === '')) {
      this.isMesialData = false;
    }
   if ((this.createTeeth.controls['notes_distal'].value === '') && (this.createTeeth.controls['symptoms_distal'].value === '') && (this.createTeeth.controls['observations_distal'].value === '') && (this.createTeeth.controls['diagnosis_distal'].value === '') && (this.createTeeth.controls['procedure_distal'].value === '')) {
      this.isDistalData = false;
    }

   if ((this.createTeeth.controls['notes_buccal'].value === '') && (this.createTeeth.controls['symptoms_buccal'].value === '') && (this.createTeeth.controls['observations_buccal'].value === '') && (this.createTeeth.controls['diagnosis_buccal'].value === '') && (this.createTeeth.controls['procedure_buccal'].value === '')) {
      this.isBuccalData = false;
    }
    if ((this.createTeeth.controls['notes_lingual'].value === '') && (this.createTeeth.controls['symptoms_lingual'].value === '') && (this.createTeeth.controls['observations_lingual'].value === '') && (this.createTeeth.controls['diagnosis_lingual'].value === '') && (this.createTeeth.controls['procedure_lingual'].value === '')) {
      this.isLingualData = false;
    }
    if ((this.createTeeth.controls['notes_missing'].value === '') && (this.createTeeth.controls['symptoms_missing'].value === '') && (this.createTeeth.controls['observations_missing'].value === '') && (this.createTeeth.controls['diagnosis_missing'].value === '') && (this.createTeeth.controls['procedure_missing'].value === '')) {
      this.isMissingData = false;
    }
  }
  getImagefromUrl(url, file) {
    if (file.fileType == 'pdf') {
      return './assets/images/pdf.png';
    } else if (file.fileType == 'application/vnd.ms-excel' || file.fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return './assets/images/xls.png';
    } else if (file.fileType == 'audio/mp3' || file.fileType == 'audio/mpeg' || file.fileType == 'audio/ogg') {
      return './assets/images/audio.png';
    } else if (file.fileType == 'video/mp4' || file.fileType == 'video/mpeg') {
      return './assets/images/video.png';
    } else if (file.fileType == 'application/msword' || file.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.fileType.includes('docx') || file.fileType.includes('doc')) {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (file.fileType.includes('txt')) {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return url;
    }
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  changeChiefComplaint(event) {
    if (event.checked) {
      this.showChiefIssue = true;

    } else {
      this.showChiefIssue = false;
    }
  }
  deleteTempImage(i, type, file) {
    console.log("this.selectedFiles[type]", file)
    console.log('file', file);
    delete file['s3path'];
    delete file['uid'];
    if (file.driveId) {
      file["action"] = "remove";
      file["type"] = type;
      this.filesToUpload.push(file);
    }
    let files = this.filesToUpload.filter((fileObj) => {
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });

    if (files && files.length > 0) {
      let fileIndex = this.filesToUpload.indexOf(files[0])
      if (!file.driveId) {
        this.filesToUpload.splice(fileIndex, 1);
      }
    }
    console.log("this.filesToUpload", this.filesToUpload)
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
  }
  // closeDialog() {
  //   this.dialogRef.close();
  // }
}
