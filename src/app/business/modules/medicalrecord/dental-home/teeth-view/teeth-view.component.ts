import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { FileService } from 'jaldee-framework/file';
import { DentalHomeService } from '../dental-home.service';
import { SnackbarService } from 'jaldee-framework/snackbar';
import { WordProcessor } from 'jaldee-framework/word-processor';
import { ActivatedRoute,NavigationExtras} from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { RoutingService } from 'jaldee-framework/routing';
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
  constructor(
    private location: Location,
    private fileService: FileService,
    private dental_homeservice: DentalHomeService,
    private snackbarService: SnackbarService,
    private routingService: RoutingService,
    private wordProcessor: WordProcessor,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mrid']) {
        this.mrid = params['mrid'];
        this.getTeethDetails()
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
console.log( this.selectedTeethDetails)
    })
  }
  filesSelected(event, type) {
    this.apiloading = true;
    console.log("Event ", event, type)
    const input = event.target.files;
    console.log("input ", input)
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
                  console.log(dataS3Url);
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
    console.log("DAta:", data);
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
  onSelect(teeth){
      this.selectedTeethDetails = teeth;
    }
    toothEdit(teeth) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          // patientId: this.customerId,
          mrid: this.mrid,
          action: 'edit',
          teethId : this.selectedTeethDetails.toothId,
          type: this.type,
        }
      };
      this.routingService.setFeatureRoute('dental')
      this.routingService.handleRoute('teeth/' + this.selectedTeethDetails.toothId, navigationExtras);
  
    }
}
