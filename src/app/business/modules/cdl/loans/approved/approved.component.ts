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
  totalPayment: any;
  sanctionedAmount: any;
  downPayment: any;
  loanData: any;
  partnerParentId: any;
  loanTenure: any;
  filesToUpload: any = [];
  tenureNumbers = Array(7);
  advanceEmiNumbers = Array(6);
  emiDueNumbers = Array(20);
  advanceEmi: any;
  selectedFiles = {
    "invoice": { files: [], base64: [], caption: [] },
    "postDatedCheque": { files: [], base64: [], caption: [] },
    "securityPostDatedCheque": { files: [], base64: [], caption: [] },
    "salarySlip": { files: [], base64: [], caption: [] },
    "taxReceipt": { files: [], base64: [], caption: [] },
    "attachments": { files: [], base64: [], caption: [] }
  }
  approvedScheme: any;
  approvedSchemeId: any;
  emiDueDate: any;
  loanTenures: any;
  dealers: any;
  partnerName: any;
  loanKycId: any;
  disableBtn: any = false;
  businessDetails: any;
  businessId: any;
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
    this.getPartners();

    this.cdlService.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })

  }

  getPartners() {
    let api_filter = {
      'isApproved-eq': true,
      'isActive-eq': true,
      'salesOfficers-eq': 'userId::' + this.user.id
    }
    this.cdlService.getDealersByFilter(api_filter).subscribe((data) => {
      this.dealers = data;
      console.log("this.dealers", this.dealers)
    })
  }


  creditOfficerApprovalRefresh() {
    this.getLoanData();
    if (this.loanData) {
      if (this.loanData.spInternalStatus == 'CreditApproved') {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            type: 'creditApproved',
            uid: this.loanId
          }
        };
        this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
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

  sendDigitalDocument() {
    this.cdlService.sendDigitalDocument(this.loanId).subscribe((data) => {
      if (data) {
        this.snackbarService.openSnackBar("Successfully Sent Document for Digital Signature")
      }
    })
  }

  loanDetails(id) {
    this.router.navigate(['provider', 'cdl', 'loans', id]);
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
    this.router.navigate(['provider', 'cdl']);
  }


  approveLoan() {
    this.disableBtn = true;
    let loanData = {
      "uid": this.loanId,
    }
    console.log("filestoUpload", this.filesToUpload)
    // loanData['partnerAcceptanceAttachments'] = [];
    loanData['productImages'] = [];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'invoice') {
        // loanData['partnerAcceptanceAttachments'].push(this.filesToUpload[i]);
        loanData['productImages'].push(this.filesToUpload[i]);
      }
    }

    this.cdlService.partnerAcceptance(loanData).subscribe((s3urls: any) => {
      if (s3urls) {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              this.disableBtn = false;
              console.log(dataS3Url);

            }).catch(() => {
              this.disableBtn = false;
            });

        }
        this.snackbarService.openSnackBar("Loan Approved Successfully")
        this.router.navigate(['provider', 'cdl', 'loans']);

      };
    },
      (error) => {
        this.disableBtn = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  approveLoanBySalesOfficer() {
    let data = {
      "loanScheme": { "id": this.approvedSchemeId },
      "partner": { "id": this.partnerName },
      "noOfEmi": this.loanTenure,
      "noOfAdvanceEmi": this.advanceEmi,
      "emiDueDay": this.emiDueDate
    }

    let attachmentsData = {}

    attachmentsData['postDatedCheque'] = [];
    attachmentsData['securityPostDatedCheque'] = [];
    attachmentsData['salarySlip'] = [];
    attachmentsData['taxReceipt'] = [];
    attachmentsData['attachments'] = [];

    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;

      if (this.filesToUpload[i]["type"] == 'postDatedCheque') {
        attachmentsData['postDatedCheque'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'securityPostDatedCheque') {
        attachmentsData['securityPostDatedCheque'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'salarySlip') {
        attachmentsData['salarySlip'].push(this.filesToUpload[i]);
      }

      if (this.filesToUpload[i]["type"] == 'taxReceipt') {
        attachmentsData['taxReceipt'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'attachments') {
        attachmentsData['attachments'].push(this.filesToUpload[i]);
      }
    }



    console.log("Data", data)

    this.cdlService.salesOfficerApproval(data, this.loanId).subscribe((data: any) => {
      if (data) {
        this.cdlService.AttachmentsOnsalesOfficerApproval(this.loanId, this.loanKycId, attachmentsData).subscribe((data: any) => {
          if (data) {
            if (data.length > 0) {
              this.uploadAudioVideo(data).then(
                (dataS3Url) => {
                  console.log(dataS3Url);
                  this.snackbarService.openSnackBar("Loan Application Updated successfully")
                  this.router.navigate(['provider', 'cdl', 'loans']);
                });
            }
            else {
              this.snackbarService.openSnackBar("Loan Application Updated successfully")
              this.router.navigate(['provider', 'cdl', 'loans']);
            }
          }
        });
      };
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }

  // uploadFiles(file, url) {
  //   const _this = this;
  //   return new Promise(function (resolve, reject) {
  //     _this.cdlService.videoaudioS3Upload(file, url)
  //       .subscribe(() => {
  //         resolve(true);
  //       }, error => {
  //         console.log('error', error)
  //         _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  //         resolve(false);
  //       });
  //   })
  // }

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
      _this.cdlService.videoaudioS3Upload(file, url)
        .subscribe(() => {
          console.log("Final Attchment Sending Attachment Success", file)
          _this.cdlService.videoaudioS3UploadStatusUpdate('COMPLETE', driveId).subscribe((data: any) => {
            resolve(true);
          })
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }


  // deleteTempImage(i, type, deleteText) {
  //   let files = this.filesToUpload.filter((fileObj) => {
  //     if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
  //       if (fileObj.type) {
  //         return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
  //       }
  //     }
  //   });
  //   if (files && files.length > 0) {
  //     console.log(this.filesToUpload.indexOf(files[0]));
  //     if (this.filesToUpload && this.filesToUpload.indexOf(files[0])) {
  //       const index = this.filesToUpload.indexOf(files[0]);
  //       this.filesToUpload.splice(index, 1);
  //     }
  //   }
  //   this.selectedFiles[type].files.splice(i, 1);
  //   this.selectedFiles[type].base64.splice(i, 1);
  //   this.selectedFiles[type].caption.splice(i, 1);
  //   if (type === 'invoice') {
  //     this.loanData.productImages.splice(i, 1);
  //   }
  // }

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
    if (type === 'invoice') {
      this.loanData.productImages.splice(i, 1);
    }
  }


  // filesSelected(event, type) {
  //   console.log("Event ", event, type)
  //   const input = event.target.files;
  //   console.log("input ", input)
  //   this.fileService.filesSelected(event, this.selectedFiles[type]).then(
  //     () => {
  //       for (const pic of input) {
  //         const size = pic["size"] / 1024;
  //         let fileObj = {
  //           owner: this.user.id,
  //           fileName: pic["name"],
  //           fileSize: size / 1024,
  //           caption: "",
  //           fileType: pic["type"].split("/")[1],
  //           action: 'add'
  //         }
  //         fileObj['file'] = pic;
  //         fileObj['type'] = type;
  //         this.filesToUpload.push(fileObj);
  //       }
  //     }).catch((error) => {
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     })


  // }


  filesSelected(event, type) {
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

        _this.cdlService.uploadFilesToS3(fileUploadtoS3).subscribe(
          (s3Urls: any) => {
            if (s3Urls && s3Urls.length > 0) {
              _this.uploadAudioVideo(s3Urls).then(
                (dataS3Url) => {
                  console.log(dataS3Url);
                  console.log("Sending Attachment Success");
                });
            }
          }, error => {
            _this.snackbarService.openSnackBar(error,
              { panelClass: "snackbarerror" }
            );
          }
        );

      }).catch((error) => {
        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
          this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
        }
      };
    })
  }


  getLoanSchemes() {
    this.cdlService.getLoanSchemes(this.loanId).subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }



  getLoanData() {
    this.cdlService.getLoanById(this.loanId).subscribe((data) => {
      this.loanData = data;
      if (this.loanData) {
        this.totalPayment = this.loanData.invoiceAmount;
        this.downPayment = this.loanData.downpaymentAmount;
        if (this.loanData.sanctionedAmount) {
          this.sanctionedAmount = this.loanData.sanctionedAmount;
        }
        if (this.loanData.loanScheme && this.loanData.loanScheme.schemeName) {
          this.approvedScheme = this.loanData.loanScheme.schemeName;
        }
        this.approvedSchemeId = this.loanData.loanScheme.id;
        if (this.loanData.partner && this.loanData.partner.id) {
          this.partnerName = this.loanData.partner.id;
        }
        if (this.loanData.loanApplicationKycList && this.loanData.loanApplicationKycList[0] && this.loanData.loanApplicationKycList[0].id) {
          this.loanKycId = this.loanData.loanApplicationKycList[0].id;
        }
        if (this.approvedSchemeId) {
          this.cdlService.getLoanTenures(this.approvedSchemeId).subscribe((data) => {
            this.loanTenures = data;
            console.log("this.loanTenures", this.loanTenures)
          })
        }
      }
    })
  }



  viewLoan() {
    this.router.navigate(['provider', 'cdl', 'loans', this.loanId]);
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
