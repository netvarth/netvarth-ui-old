import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { DentalHomeService } from '../dental-home.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileService } from '../../../../shared/services/file-service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

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
  surfaceClicked= false;
  surfaceSelected: any;
  isFileUploading = false;
  constructor(
    private createTeethFormBuilder: UntypedFormBuilder,
    private location: Location,
    private fileService: FileService,
    private activated_route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private dental_homeservice: DentalHomeService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private router: Router,
  ) {
    this.activated_route.queryParams.subscribe(params => {
      if (params['mrid']) {
        this.mrid = params['mrid'];
        this.getTeethDetails()
      }
      if (params['action']) {
        // alert(params['action'])
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

    });

  }
  ngOnInit(): void {
   
    const medicalRecordCustId = this.activatedRoute.parent.snapshot.params['id'];
    this.toothId = medicalRecordCustId;
    // else {
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
    // }
    if (this.action === 'edit') {
      if( this.teethId !== undefined){
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
    // alert('1')
    console.log(this.teethDetailsById)
    if (this.teethDetailsById && this.teethDetailsById.surface) {
      if (this.teethDetailsById.surface['mesial']) {
        this.isMesial = true;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;

      }
      if (this.teethDetailsById.surface['distal']) {
        this.isDistal = true;
        this.isMesial = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;
       
      }
      if (this.teethDetailsById.surface['buccal']) {
        this.isBuccal = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isLingual = false;
        this.isIncisal = false;
        this.isMissing = false;
      }
      if (this.teethDetailsById.surface['lingual']) {
        this.isLingual = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isIncisal = false;
        this.isMissing = false;
      }
      if (this.teethDetailsById.surface['incisal']) {
        this.isIncisal = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isMissing = false;
       
      }
      if (this.teethDetailsById.surface['occlusal']) {
        this.isMissing = true;
        this.isMesial = false;
        this.isDistal = false;
        this.isBuccal = false;
        this.isLingual = false;
        this.isIncisal = false;
       
       
      }
    }
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
      this.showChiefIssue = true;
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
    this.isFileUploading = true;
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
              this.isFileUploading = false;
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
    if (this.isMesial) {
      mesial = {
        "description": this.createTeeth.controls['notes_mesial'].value,
        "symptoms": this.createTeeth.controls['symptoms_mesial'].value,
        "observations": this.createTeeth.controls['observations_mesial'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_mesial'].value,
        "procedure": this.createTeeth.controls['procedure_mesial'].value,
      }
      surface["mesial"] = mesial;
    }
    if (this.isDistal) {
      distal = {
        "description": this.createTeeth.controls['notes_distal'].value,
        "symptoms": this.createTeeth.controls['symptoms_distal'].value,
        "observations": this.createTeeth.controls['observations_distal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_distal'].value,
        "procedure":  this.createTeeth.controls['procedure_distal'].value,
      }
      surface["distal"] = distal
    }
    if (this.isBuccal) {
      buccal = {
        "description": this.createTeeth.controls['notes_buccal'].value,
        "symptoms": this.createTeeth.controls['symptoms_buccal'].value,
        "observations": this.createTeeth.controls['observations_buccal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_buccal'].value,
        "procedure": this.createTeeth.controls['procedure_buccal'].value,
      }
      surface["buccal"] = buccal
    }
    if (this.isLingual) {
      lingual = {
        "description": this.createTeeth.controls['notes_lingual'].value,
        "symptoms": this.createTeeth.controls['symptoms_lingual'].value,
        "observations": this.createTeeth.controls['observations_lingual'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_lingual'].value,
        "procedure":  this.createTeeth.controls['procedure_lingual'].value,
      }
      surface["lingual"] = lingual
    }
    if (this.isIncisal) {
      incisal = {
        "description": this.createTeeth.controls['notes_incisal'].value,
        "symptoms": this.createTeeth.controls['symptoms_incisal'].value,
        "observations": this.createTeeth.controls['observations_incisal'].value,
        "diagnosis": this.createTeeth.controls['diagnosis_incisal'].value,
        "procedure":  this.createTeeth.controls['procedure_incisal'].value,
      }
      surface["incisal"] = incisal
    }
    if (this.isMissing) {
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
    // if(symptoms.length>0){
    //   this.newData= {
    //     'attachments':symptoms
    //   }
    //   // payload.splice(payload.findIndex(e => e.type === "photo"),1);
    //   // payload.push(this.newData)
    // }

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
            custId: this.customerId
          }
        };
        this.router.navigate(['provider', 'dental'], navigationExtras);
        // this.routingService.handleRoute('', navigationExtras);
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
              custId: this.customerId
            }
          };
          this.router.navigate(['provider', 'dental'], navigationExtras);
          // this.routingService.handleRoute('', navigationExtras);
          this.goBack()
        })

      }
      else {

        this.dental_homeservice.createMedicalRecordForFollowUp(this.customerId, payload).subscribe((data) => {
          this.mrid = data;

          const navigationExtras: NavigationExtras = {
            queryParams: {
              mrid: this.mrid,
              custId: this.customerId
            }
          };
          this.router.navigate(['provider', 'dental'], navigationExtras);
          // this.routingService.handleRoute('', navigationExtras);
          // this.goBack()
        })

      }

    }

    // this.dental_homeservice.createMR('dental', payload).then((res: any) => {
    //   this.mrId = res;
    //   console.log('this.mrId::', this.mrId)
    //   this.snackbarService.openSnackBar('Dental Chart Created Successfully');
    //   this.routingService.handleRoute(patientId + '/' + bookingType + '/' + bookingId + '/medicalrecord/' + this.mrId + '/dental-chart', null);
    // })
  }
  surfaceClick(surfaceCheck) {
    this.surfaceSelected = surfaceCheck;
    if(this.surfaceSelected === 'mesial'){
      this.isMesial = true;
      this.isDistal = false;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = false;
    }
    else if(this.surfaceSelected === 'distal'){
      this.isMesial = false;
      this.isDistal = true;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = false;
    }
    else if(this.surfaceSelected === 'buccal'){
      this.isMesial = false;
      this.isDistal = false;
      this.isBuccal = true;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = false;
    }
    else if(this.surfaceSelected === 'lingual'){
      this.isMesial = false;
      this.isDistal = false;
      this.isBuccal = false;
      this.isLingual = true;
      this.isIncisal = false;
      this.isMissing = false;
    }
    else if(this.surfaceSelected === 'incisal'){
      this.isMesial = false;
      this.isDistal = false;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = true;
      this.isMissing = false;
    }
    else if(this.surfaceSelected === 'occlusal'){
      this.isMesial = false;
      this.isDistal = false;
      this.isBuccal = false;
      this.isLingual = false;
      this.isIncisal = false;
      this.isMissing = true;
    }
  }
  
  resetErrors() {

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
}
