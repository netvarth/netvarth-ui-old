import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { DentalHomeService } from '../dental-home.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FileService } from '../../../../shared/services/file-service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
// import { RoutingService } from 'jaldee-framework/routing';
@Component({
  selector: 'app-teeth-view',
  templateUrl: './teeth-view.component.html',
  styleUrls: ['./teeth-view.component.scss']
})
export class TeethViewComponent {
  createTeeth: UntypedFormGroup;
  isAdult = true;
  isChild = false;
  isMixed = false;
  type: string;
  apiloading: any = false;
  selectedFiles = {
    "photo": { files: [], base64: [], caption: [] }
  }
  surfaceConstants = {
    'mesial': 'Mesial',
    'distal': 'Distal',
    'buccal': 'Buccal',
    'lingual': 'Lingual',
    'incisal': 'Incisal',
    'occlusal': 'Occlusal'
  }
  filesToUpload: any = [];
  businessDetails: any;
  businessId: any;
  mrid: any;
  teethDetails: any;
  selectedTeeth: any;
  userHeight = 703;
  custSelect = true;
  teeth_loading = true;
  selectedTeethDetails: any;
  selectedSurface;
  private subscriptions = new SubSink();
  loading = true;
  customerDetails: any;
  firstName: any;
  medicalInfo: any;
  mrNumber: any;
  mrCreatedDate;
  doctorName; teethNumber: any;
  patientId: any;
  dentalState: any;
  state: string;
  bookingType: any;
  bookingId: any;
  isMesial = false;
  isDistal = false;
  isBuccal = false;
  isLingual = false;
  isIncisal = false;
  isOcclusal = false;
  constructor(
    private location: Location,
    private fileService: FileService,
    private dental_homeservice: DentalHomeService,
    private snackbarService: SnackbarService,
    // private routingService: RoutingService,
    private router: Router,
    private wordProcessor: WordProcessor,
    private route: ActivatedRoute,
    private providerService: ProviderServices,
    public provider_services: ProviderServices
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mrid']) {
        this.mrid = params['mrid'];
        this.getTeethDetails()
        this.getMedicalRecordUsingId(this.mrid);
      }
      if (params['patientId']) {
        this.patientId = params['patientId'];
        this.getPatientDetails(this.patientId);
      }
      if (params['bookingType']) {
        this.bookingType = params['bookingType'];
      }
      if (params['bookingId']) {
        this.bookingId = params['bookingId'];
      }
    });
  }
  ngOnInit(): void {

    this.dental_homeservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })

  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.subscriptions.sink = this.providerService.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          if (response && response[0]) {
            this.customerDetails = response[0];
          }
          if (this.customerDetails.firstName) {
            this.firstName = this.customerDetails.firstName;
          }

        },
        error => {
          // alert('getPatientDetails')
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }

  getMedicalRecordUsingId(mrId) {
    this.subscriptions.sink = this.provider_services.GetMedicalRecord(mrId)
      .subscribe((data: any) => {
        if (data) {
          this.loading = false;
          this.medicalInfo = data;
          this.mrNumber = data.mrNumber;

          if (data.mrCreatedDate) {
            this.mrCreatedDate = data.mrCreatedDate;
          }
          if (data.provider && data.provider.id) {
            this.doctorName = data.provider.firstName + ' ' + data.provider.lastName;
          }
          if (data && data.dentalChart && data.dentalChart.teeth.length > 0) {
            this.teethNumber = data.dentalChart.teeth.length;
          }
          if (data && data.dentalChart && data.dentalChart.dentalState) {
            this.dentalState = data.dentalChart.dentalState;
            if (this.dentalState === 'PERMANENT') {
              this.state = 'Adult';
            }
            else if (this.dentalState === 'TEMPORARY') {
              this.state = 'Child';
            }
            else if (this.dentalState === 'MIXED') {
              this.state = 'Mixed';
            }
          }
        }
      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  goBack() {
    this.location.back();
  }
  getTeethDetails() {
    this.teeth_loading = true;
    this.dental_homeservice.getTeethDetails(this.mrid).subscribe((data) => {
      this.teethDetails = data;
      this.selectedTeeth = this.teethDetails.teeth;
      this.teeth_loading = false;

      this.selectedTeethDetails = this.teethDetails.teeth[0];
      // if(this.selectedTeethDetails.)
      let keys = Object.keys(this.selectedTeethDetails.surface);

      this.selectedSurface = this.selectedTeethDetails.surface[keys[0]];
      if (keys[0]=== 'distal') {
        this.distalClick()
      }
      else if (keys[0] === 'mesial') {
        this.mesialClick()
      }
      else if (keys[0] === 'buccal') {
        this.buccalClick()
      }
      else if (keys[0] === 'lingual') {
        this.lingualClick()
      }
      else if (keys[0] === 'incisal') {
        this.incisalClick()
      }
      else if (keys[0] === 'occlusal') {
        this.misingClick()
      }
      this.selectedSurface['key'] = keys[0];

      console.log(this.selectedTeethDetails)
    })
  }
  setSurface(surface, key) {
    this.selectedSurface = surface;
    this.selectedSurface['key'] = key;
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

        let file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
        })[0];

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
  // onSelect(teeth, event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   if (value) {
  //     this.selectedTeethDetails = teeth;
  //   }

  //   event.chipInput!.clear();
  // }
  onSelect(teeth) {
    this.selectedTeethDetails = teeth;
    console.log('this.selectedTeethDetails', this.selectedTeethDetails)
    let keys = Object.keys(this.selectedTeethDetails.surface);
    if (keys[0]=== 'distal') {
      this.distalClick()
    }
    else if (keys[0] === 'mesial') {
      this.mesialClick()
    }
    else if (keys[0] === 'buccal') {
      this.buccalClick()
    }
    else if (keys[0] === 'lingual') {
      this.lingualClick()
    }
    else if (keys[0] === 'incisal') {
      this.incisalClick()
    }
    else if (keys[0] === 'occlusal') {
      this.misingClick()
    }
  }
  toothEdit() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        // patientId: this.customerId,
        mrid: this.mrid,
        action: 'edit',
        teethId: this.selectedTeethDetails.toothId,
        type: this.state,
        bookingType: this.bookingType,
        bookingId: this.bookingId
      }
    };
    this.router.navigate(['provider', 'dental', 'teeth', this.selectedTeethDetails.toothId], navigationExtras);
    // this.routingService.setFeatureRoute('dental')
    // this.routingService.handleRoute('teeth/' + this.selectedTeethDetails.toothId, navigationExtras);

  }
  backtoHome() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        mrid: this.mrid,
        custId: this.patientId,
        bookingType: this.bookingType,
        bookingId: this.bookingId
      }
    };
    this.router.navigate(['provider', 'dental'], navigationExtras);
  }
  mesialClick() {
    this.isMesial = true;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = false;
    this.isOcclusal = false;
  }
  distalClick() {
    this.isMesial = false;
    this.isDistal = true;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = false;
    this.isOcclusal = false;
  }
  buccalClick() {
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = true;
    this.isLingual = false;
    this.isIncisal = false;
    this.isOcclusal = false;
  }
  lingualClick() {
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = true;
    this.isIncisal = false;
    this.isOcclusal = false;
  }
  incisalClick() {
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = true;
    this.isOcclusal = false;
  }
  misingClick() {
    this.isMesial = false;
    this.isDistal = false;
    this.isBuccal = false;
    this.isLingual = false;
    this.isIncisal = false;
    this.isOcclusal = true;
  }
}

