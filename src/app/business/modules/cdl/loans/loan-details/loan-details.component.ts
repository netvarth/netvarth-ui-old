import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ViewFileComponent } from './view-file/view-file.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { CdlService } from '../../cdl.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { FileService } from '../../../../../shared/services/file-service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
// import { ViewReportComponent } from './view-report/view-report.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  status: any;
  user: any;
  headerName: string = ''
  customerName: string = ''
  customerphNo: string = ''
  employeeEmail: string = '';
  employeeMartialStatus: string = '';
  employeephNo: string = '';
  employeeEmployeeTYpe: string = '';
  employeeSalary: number;
  employeeOffAdd: string = '';
  employeeCityWork: string = '';
  employeeREsidence: string = '';
  employeeHomeAdd: string = '';
  adharNumber: number;
  panCardNumber: string = '';
  accountNumber: string = '';
  IFSCCode: string = '';
  bankName: string = '';
  emiPaidNo: number;
  perfiosError: any;
  cibilScore: any;
  mafilScore: number;
  perfiosScore: number;
  totalScore: number;
  loanStatus = projectConstantsLocal.TIMELINE_STATUS; perfiosData: any;
  equifaxScore: any = 0;
  equifaxScoreData: any;
  paramsValue: any;
  address1: string;
  address2: string;
  city: string;
  bankData: any;
  loanId: any;
  state: string;
  pincode: string;
  loanData: any;
  loanApplicationStatus: any;
  statusIndex: any;
  capabilities: any;
  mafilScoreData: any;
  loanEmiDetailsData: any;
  accountaggregatingStatus: any;
  accountaggregatingStatusShowing: boolean;
  showEquifaxScore: any = false;
  customerPhoneNo: any;
  digitalDocumenId: any;
  digitalInsuranceId: any;
  mafilScorePercentange: any;
  btnLoading: any = false;
  selectedFiles = {
    "invoice": { files: [], base64: [], caption: [] },
    "bankStatements": { files: [], base64: [], caption: [] }
  }
  businessDetails: any;
  businessId: any;
  filesToUpload: any = [];
  loanKycId: any;
  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private dialog: MatDialog,
    private cdlservice: CdlService,
    private fileService: FileService,
    private wordProcessor: WordProcessor
  ) { }
  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("user", this.user)
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
    }

    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })

    this.activated_route.params.subscribe((params) => {
      if (params) {
        if (params && params.id) {
          this.loanId = params.id;

          this.cdlservice.getLoanById(params.id).subscribe((data) => {
            this.loanData = data;
            this.loanKycId = this.loanData.loanApplicationKycList[0].id;
            if (this.loanId && this.loanData && this.loanData.isAccountAggregated) {
              this.getAccountAggregatorStatus(this.loanId, 0)
            }
            if (this.loanData && this.loanData.customer && this.loanData.customer.phoneNo) {
              this.customerPhoneNo = this.loanData.customer.phoneNo;
            }
            if (this.loanData && this.loanData.digitalDocumenId) {
              this.digitalDocumenId = this.loanData.digitalDocumenId;
            }
            if (this.loanData && this.loanData.digitalInsuranceId) {
              this.digitalInsuranceId = this.loanData.digitalInsuranceId;
            }
            this.checkMafilScore();
            this.checkPerfiosScore();
            if (this.loanData && this.loanData.spInternalStatus && this.loanData.spInternalStatus == 'Sanctioned' || this.loanData.spInternalStatus == 'OperationsVerified') {
              this.getLoanEmiDetails(this.loanId);
            }
            console.log("LoanData", this.loanData)
            if (this.loanData && this.loanData.spInternalStatus) {
              this.loanApplicationStatus = this.loanData.spInternalStatus;
            }
            this.cdlservice.getBankDetailsById(params.id).subscribe((data) => {
              this.bankData = data;
              console.log("BankData", this.bankData)
            });
            if (this.loanApplicationStatus) {
              this.checkTimeline();
            }
          });

        }
      }
    })
  }

  checkMafilScore() {
    let data =
    {
      "loanApplicationUid": this.loanId,
      "loanApplicationKycId": this.loanData.loanApplicationKycList[0].id
    }
    this.cdlservice.getMafilScore(data).subscribe((data: any) => {
      console.log("Mafil Score Data : ", data);
      this.mafilScoreData = data
      if (data && data.creditScore) {
        this.mafilScore = data.creditScore;
        this.mafilScorePercentange = data.creditScorePercentage.toFixed(2);
      }
    });
  }

  generateCibilScore(id) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        kycId: id,
        type: "cibil",
        from: "cibil"
      }
    });
    dialogRef.afterClosed().subscribe(
      (response: any) => {
        if (response.msg == "success") {
          this.ngOnInit();
          this.snackbarService.openSnackBar("Cibil Saved Successfully");
        }
      });

  }

  getImagefromUrl(url, file) {
    if (file.fileType) {
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
    return url;
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
  //       if (type == 'invoice') {
  //         this.uploadInvoice()
  //       }
  //       if (type == 'bankStatements') {
  //         this.uploadBankStatements()
  //       }
  //     }).catch((error) => {
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     })
  // }


  filesSelected(event, type) {
    this.btnLoading = true;
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

        _this.cdlservice.uploadFilesToS3(fileUploadtoS3).subscribe(
          (s3Urls: any) => {
            if (s3Urls && s3Urls.length > 0) {
              _this.uploadAudioVideo(s3Urls).then(
                (dataS3Url) => {
                  console.log(dataS3Url);
                  console.log("Sending Attachment Success");
                  if (type == 'invoice') {
                    this.uploadInvoice()
                  }
                  if (type == 'bankStatements') {
                    this.uploadBankStatements()
                  }
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


  // uploadAudioVideo(data) {
  //   const _this = this;
  //   let count = 0;
  //   console.log("DAta:", data);
  //   return new Promise(async function (resolve, reject) {
  //     for (const s3UrlObj of data) {
  //       console.log("S3URLOBJ:", s3UrlObj);
  //       console.log('_this.filesToUpload', _this.filesToUpload)
  //       const file = _this.filesToUpload.filter((fileObj) => {
  //         return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
  //       })[0];
  //       console.log("File:", file);
  //       if (file) {
  //         await _this.uploadFiles(file['file'], s3UrlObj.url).then(
  //           () => {
  //             count++;
  //             console.log("Count", count);
  //             console.log("Count", data.length);
  //             if (count === data.length) {
  //               console.log("HERE");
  //               resolve(true);
  //             }
  //           }
  //         );
  //       }
  //       else {
  //         resolve(true);
  //       }
  //     }
  //   })
  // }


  // uploadFiles(file, url) {
  //   const _this = this;
  //   return new Promise(function (resolve, reject) {
  //     _this.cdlservice.videoaudioS3Upload(file, url)
  //       .subscribe(() => {
  //         resolve(true);
  //       }, (error) => {
  //         console.log('error', error)
  //         _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
      _this.cdlservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          console.log("Final Attchment Sending Attachment Success", file)
          _this.cdlservice.videoaudioS3UploadStatusUpdate('COMPLETE', driveId).subscribe((data: any) => {
            resolve(true);
          })
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
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
      // this.loanData.partnerAcceptanceAttachments.splice(i, 1);
      this.loanData.productImages.splice(i, 1);
    }
  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }

  uploadInvoice() {
    let loanData = {
      "uid": this.loanId,
    }
    loanData['partnerAcceptanceAttachments'] = [];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'invoice') {
        loanData['partnerAcceptanceAttachments'].push(this.filesToUpload[i]);
      }
    }

    this.cdlservice.uploadInvoice(this.loanId, loanData).subscribe((s3urls: any) => {
      if (s3urls) {
        // if (s3urls.length > 0) {
        // this.uploadAudioVideo(s3urls).then(
        //   (dataS3Url) => {
        //     console.log(dataS3Url);
        this.btnLoading = false;
        this.snackbarService.openSnackBar("Invoice Uploaded Successfully")
        // this.router.navigate(['provider', 'cdl', 'loans']);
        this.ngOnInit();
        // }).catch(() => {
        // });
        // }

      };
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }

  uploadBankStatements() {
    let loanData = {
      // "uid": this.loanId,
    }
    loanData['bankStatementAttachments'] = [];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'bankStatements') {
        loanData['bankStatementAttachments'].push(this.filesToUpload[i]);
      }
    }
    console.log("coming here to here", loanData)
    this.cdlservice.uploadBankStatements(this.loanId, loanData).subscribe((s3urls: any) => {
      if (s3urls) {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
              this.snackbarService.openSnackBar("Bank Statement Uploaded Successfully")
              // this.router.navigate(['provider', 'cdl', 'loans']);
              this.ngOnInit();
            }).catch(() => {
            });
        }

      };
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  editLoan() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.loanId,
        action: "update",
        from: "edit"
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras)
  }

  getAccountAggregatorStatus(uId, kycId) {
    this.cdlservice.getAccountAggregatorStatus(uId, 0).subscribe((data) => {
      this.accountaggregatingStatus = data;
      this.accountaggregatingStatusShowing = true;
    })
  }


  refreshAccountAggregator() {
    this.cdlservice.refreshAccountAggregator(this.loanId).subscribe((data) => {
      this.cdlservice.getBankDetailsById(this.loanId).subscribe((data) => {
        this.bankData = data;
        this.snackbarService.openSnackBar("Statement Fetched Successfully");
      });
    })
  }

  checkEquifaxScore() {
    let data =
    {
      "loanApplicationUid": this.loanId,
      "customerPhone": this.loanData.customer.phoneNo,
      "id": this.loanData.loanApplicationKycList[0].id
    }
    this.cdlservice.getEquifaxScore(data).subscribe((data: any) => {
      this.equifaxScoreData = data;
      console.log("Equifax Score Data : ", data);
      if (data && (data.equifaxScore || data.equifaxScore == 0)) {
        this.equifaxScore = data.equifaxScore;
        this.totalScore = this.totalScore + Number(this.equifaxScore);
        this.showEquifaxScore = true;
      }
    });
  }

  updateCustomerIntegrationId(id?) {
    let data = {
      type: "customerIntegrationId",
      from: "customerIntegrationId"
    }
    if (id) {
      data['customerIntegrationId'] = id;
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: data
    });
    dialogRef.afterClosed().subscribe(
      (response: any) => {
        if (response && response.customerIntegrationId) {
          this.cdlservice.updateCustomerIntegrationId(this.loanId, this.loanKycId, response).subscribe((data: any) => {
            if (data) {
              this.ngOnInit();
              this.snackbarService.openSnackBar("Customer Integration Id Updated Successfully");
            }
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            });

        }
      });



  }


  viewDigitalDocument() {
    this.cdlservice.getDigitalDocument(this.loanId).subscribe((data: any) => {
      if (data) {
        if (!data.isSigned) {
          this.snackbarService.openSnackBar("Digital Document Not Signed Yet", { 'panelClass': 'snackbarerror' })
        }
        else if (data.isSigned) {
          if (data.digitalDocumenthPath) {
            window.open(data.digitalDocumenthPath, "_blank");
          }
        }
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  sendDigitalAgreement() {
    this.cdlservice.sendDigitalDocument(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Digital Document Sent Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  resendConsumerAgreement() {
    this.cdlservice.resendConsumerAgreement(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Consumer Agreement Resent Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  resendSPDC_DPN() {
    this.cdlservice.resendSPDC_DPN_Document(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("SPDC & DPN Documents Resent Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  sendInsuranceDocument() {
    this.cdlservice.sendInsuranceDocument(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Insurance Document Sent Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  sendEnach() {
    this.cdlservice.sendEnach(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Enach Link Sent Successfully")
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  viewInsuranceDocument() {
    this.cdlservice.getInsuranceDocument(this.loanId).subscribe((data: any) => {
      if (data) {
        if (!data.isSigned) {
          this.snackbarService.openSnackBar("Digital Insurance Not Signed Yet", { 'panelClass': 'snackbarerror' })
        }
        else if (data.isSigned) {
          if (data.digitalDocumenthPath) {
            window.open(data.digitalDocumenthPath, "_blank");
          }
        }
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  viewReport(type, data) {
    // const dialogRef = this.dialog.open(ViewReportComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
    //   disableClose: true,
    //   data: {
    //     type: type,
    //     data: data
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // })
    let inputData: any;
    inputData = JSON.stringify(data);
    if (type == 'equifax') {
      let sampleData = {
        "loanId": this.loanId,
        "equifaxId": this.loanData.loanApplicationKycList[0].equifaxId,
        "equifaxScore": this.loanData.loanApplicationKycList[0].equifaxScore
      }
      inputData = JSON.stringify(sampleData);
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: type,
        data: inputData
      }
    };
    this.router.navigate(['provider', 'cdl', 'report'], navigationExtras);
  }

  viewEquifaxScore() {
    this.checkEquifaxScore();
  }

  viewDpnSpdcLetter() {
    // this.router.navigate(['provider', 'cdl', 'dpn-letter', this.loanId]);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uid: this.loanId,
        account: this.loanData.accountId,
        type: 'provider'
      }
    };
    this.router.navigate(['consumer', 'agreement', 'document-letter'], navigationExtras);
  }

  viewSdcLetter() {
    // this.router.navigate(['provider', 'cdl', 'spdc-letter', this.loanId]);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uid: this.loanId,
        account: this.loanData.accountId,
        type: 'provider'
      }
    };
    this.router.navigate(['consumer', 'agreement', 'spdc-letter'], navigationExtras);
  }
  viewconsumerAgreementLetter() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uid: this.loanId,
        account: this.loanData.accountId,
        type: 'provider'
      }
    };
    this.router.navigate(['consumer', 'agreement'], navigationExtras);
  }


  checkPerfiosScore() {
    let data =
    {
      "loanApplicationUid": this.loanId,
      "id": this.loanData.loanApplicationKycList[0].id,
      "customerPhone": this.customerPhoneNo
    }
    this.cdlservice.getPerfiosScore(data).subscribe((data: any) => {
      console.log("Perfios Score Data : ", data);
      if (data) {
        this.perfiosData = data;
      }
    }, (error) => {
      this.perfiosError = error.error;
      console.log("error", error)
      // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
    });
  }

  checkTimeline() {
    this.statusIndex = this.loanStatus.filter((data) => data.name == this.loanApplicationStatus)[0].index
    console.log("this.statusIndex", this.statusIndex)
  }

  getStringWithSpaces(string) {
    return string.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
  }

  goBack() {
    this.location.back();
  }
  sanctionLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        loanId: this.loanId,
        type: "sanction",
        from: "creditofficer"
      }
    });
    dialogRef.afterClosed().subscribe(
      (id) => {
        if (id) {
          this.snackbarService.openSnackBar("Loan Verified Successfully");
          this.router.navigate(['provider', 'cdl', 'loans', id]);
        }
      });
  }


  approveLoan() {
    this.cdlservice.ApprovalRequest(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Loan Approved Successfully");
        this.router.navigate(['provider', 'cdl', 'loans']);
      }
    });
  }

  pushToLms() {
    this.cdlservice.pushToLms(this.loanId).subscribe((data: any) => {
      if (data) {
        this.snackbarService.openSnackBar("Loan Pushed to LMS Successfully");
      }
    });
  }

  approveLoanByBranchManager() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus && this.loanData.spInternalStatus == "SchemeConfirmed") {
            this.cdlservice.approveLoanByBranchManager(this.loanId, notes).subscribe((data: any) => {
              if (true) {
                this.snackbarService.openSnackBar("Loan Approved Successfully");
                this.router.navigate(['provider', 'cdl', 'loans']);
              }
            });
          }
        }
      });
  }

  analyze() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: 'analyzebank'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "eligible") {

        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
  }

  redirectLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus) {
            this.cdlservice.redirectLoan(this.loanId, notes, this.loanData.spInternalStatus).subscribe((data: any) => {
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  type: 'redirected'
                }
              };
              this.snackbarService.openSnackBar("Loan Redirected Successfully");
              this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
            });
          }
        }
      });


  }

  completeLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          if (this.loanData && this.loanData.spInternalStatus) {
            this.cdlservice.completeLoan(this.loanId, notes).subscribe((data: any) => {
              this.snackbarService.openSnackBar("Loan Action Completed Successfully");
              this.router.navigate(['provider', 'cdl', 'loans']);
            });
          }
        }
      });
  }


  rejectLoan() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          this.cdlservice.rejectLoan(this.loanId, notes).subscribe((data: any) => {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                type: 'rejected'
              }
            };
            this.snackbarService.openSnackBar("Loan Rejected Successfully");
            this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
          });
        }
      });


  }

  showKycDoc() {
    this.router.navigate(['provider', 'cdl', 'kycdoc', this.loanId]);
  }


  showLoanDetailsDoc() {
    this.router.navigate(['provider', 'cdl', 'loandetailsdoc', this.loanId]);
  }


  verifyLoanByOps() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: "remarks"
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data && data.remarks && data.type == 'remarks') {
          let notes = {
            note: data.remarks
          }
          this.cdlservice.verifyLoanByOps(this.loanId, notes).subscribe((data: any) => {
            if (data) {
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  type: 'OperationsVerified'
                }
              };
              this.snackbarService.openSnackBar("Loan Verified Successfully");
              this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
            }
          },
            (error) => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
            });
        }
      });
  }

  redirectLoanByOps() {

  }


  getLoanEmiDetails(id) {
    this.cdlservice.getLoanEmiDetails(id).subscribe((data: any) => {
      if (data) {
        this.loanEmiDetailsData = data
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }



  viewFile(file, s3path?) {
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: file,
        url: s3path
      }
    });
    dialogRef.afterClosed();
  }

  takeAction() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'action'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

  ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

}
