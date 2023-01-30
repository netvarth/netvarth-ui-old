import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { CdlService } from '../../cdl.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { FileService } from '../../../../../shared/services/file-service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  scheme: any;
  loanId: any;
  verification = false;
  accountverification = false;
  user: any;
  loanSchemes: any;
  schemeSelected: any;
  loanData: any;
  partnerParentId: any;
  filesToUpload: any = [];
  selectedFiles = {
    "invoice": { files: [], base64: [], caption: [] }
  }
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private cdlService: CdlService,
    private lStorageService: LocalStorageService,
    private fileService: FileService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor


  ) { }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }



  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');

    this.activated_route.queryParams.subscribe((params) => {
      if (params && params.timetype) {
        this.timetype = params.timetype;
      }
      if (params && params.from) {
        this.from = params.from;
      }
      if (params && params.type) {
        this.type = params.type;
      }
      if (params && params.uid) {
        this.loanId = params.uid;
        this.getLoanData();
      }
    });

    this.getLoanSchemes();

  }


  creditOfficerApprovalRefresh() {
    this.getLoanData();
    if (this.loanData) {
      if (this.loanData.spInternalStatus == 'SchemeConfirmed') {
        this.router.navigate(['provider', 'tl', 'loans', this.loanId]);
      }
    }
  }

  resetErrors() {

  }

  selectedScheme(scheme) {
    this.schemeSelected = scheme;
    if (this.schemeSelected) {
      this.gotoNext();
    }
  }


  loanDetails(id) {
    this.router.navigate(['provider', 'tl', 'loans', id]);
  }

  goNext() {
    if (this.timetype == 1 && this.user.userType == 2) {
      this.timetype = 3;
    }
    else if (this.timetype >= 1) {
      this.timetype = this.timetype + 1;
      console.log("this.timetype", this.timetype);
    }
    return true;
  }
  goBack() {
    if (this.timetype > 1 && (this.from && this.from != 'creditofficer' && this.from != 'schemeslist')) {
      this.timetype = this.timetype - 1;
    }
    else {
      this.location.back();
    }
  }

  goHome() {
    this.router.navigate(['provider', 'tl']);
  }


  approveLoan() {
    let loanData = {
      "uid": this.loanId,
    }
    console.log("filestoUpload", this.filesToUpload)
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'invoice') {
        loanData['partnerAcceptanceAttachments'] = [];
        loanData['partnerAcceptanceAttachments'].push(this.filesToUpload[i]);
      }
    }

    this.cdlService.partnerAcceptance(loanData).subscribe((s3urls: any) => {
      if (s3urls) {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
              this.snackbarService.openSnackBar("Loan Approved Successfully")
              this.router.navigate(['provider', 'tl', 'loans']);
            });
        }

      };
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }

  uploadFiles(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.cdlService.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }

  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;
    console.log("DAta:", data);
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log("S3URLOBJ:", s3UrlObj);
        console.log('_this.filesToUpload', _this.filesToUpload)
        const file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          await _this.uploadFiles(file['file'], s3UrlObj.url).then(
            () => {
              count++;
              console.log("Count", count);
              console.log("Count", data.length);
              if (count === data.length) {
                console.log("HERE");
                resolve(true);
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


  deleteTempImage(i, type, deleteText) {
    let files = this.filesToUpload.filter((fileObj) => {
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });
    if (files && files.length > 0) {
      console.log(this.filesToUpload.indexOf(files[0]));
      if (this.filesToUpload && this.filesToUpload.indexOf(files[0])) {
        const index = this.filesToUpload.indexOf(files[0]);
        this.filesToUpload.splice(index, 1);
      }
    }
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
    if (type === 'invoice') {
      this.loanData.partnerAcceptanceAttachments.splice(i, 1);
    }
  }


  filesSelected(event, type) {
    console.log("Event ", event, type)
    const input = event.target.files;
    console.log("input ", input)
    this.fileService.filesSelected(event, this.selectedFiles[type]).then(
      () => {
        for (const pic of input) {
          const size = pic["size"] / 1024;
          let fileObj = {
            owner: this.user.id,
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            action: 'add'
          }
          fileObj['file'] = pic;
          fileObj['type'] = type;
          this.filesToUpload.push(fileObj);
        }
      }).catch((error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })


  }


  refreshCustomerAcceptance() {
    this.cdlService.getLoanById(this.loanId).subscribe((data: any) => {
      if (data && data.spInternalStatus) {
        if (data.spInternalStatus == 'ConsumerAccepted') {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              type: 'consumerAccepted',
              uid: this.loanId
            }
          };
          this.router.navigate(['provider', 'tl', 'loans', 'approved'], navigationExtras);
        }
      };
    })
  }


  getLoanSchemes() {
    this.cdlService.getLoanSchemes().subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }


  getLoanData() {
    this.cdlService.getLoanById(this.loanId).subscribe((data) => {
      this.loanData = data;
    })
  }

  viewLoan() {
    this.router.navigate(['provider', 'tl', 'loans', this.loanId]);
  }

  gotoNext() {
    let schemeData = {
      "loanScheme": { "id": this.schemeSelected.id }
    }
    this.cdlService.changeScheme(this.loanId, schemeData).subscribe((data: any) => {
      if (data) {
        if (this.timetype == 1) {
          this.timetype = 2
        }
      }
    })
  }

  verifyAccount() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Account Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.accountverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }

}
