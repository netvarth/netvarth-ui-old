import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { CdlService } from '../../cdl.service';
import { SelectSchemeComponent } from '../select-scheme/select-scheme.component';
import { FileService } from '../../../../../shared/services/file-service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  from: any;
  remarks: any;
  schemeSelected: any;
  loanApplication: any;
  loanSchemes: any;
  sanctionAmount: any = false;
  type: any;
  dealerData: any;
  loanId: any;
  downloadsrc = "https://scale.jaldee.com/shortUrl/Njg5My0xLTI3MTM3";
  loanData: any;
  sanctionedAmount: any = 0;
  dealerAutoApprove: any = false;
  districtWiseRestriction: any = false;
  autoApprovalUptoAmount: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  cibilScore: any;
  customerIntegrationId: any;
  totalPayment: any = 0;
  downPayment: any = 0;
  loanAmount: any = 0;
  equifaxReportData: any;
  equifaxScore: any;
  equifaxFormData: any;
  equifaxId: any;
  filesToUpload: any = [];
  selectedFiles = {
    "cibil": { files: [], base64: [], caption: [] }
  }
  user: any;
  kycId: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cdlservice: CdlService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private fileService: FileService,
    private groupService: GroupStorageService
  ) {

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.from = this.data.from;
    if (this.from && this.from == 'creditofficer') {
      if (this.data && this.data.type) {
        this.type = this.data.type
        if (this.type == 'sanction') {
          this.sanctionAmount = true;
          if (this.data && this.data.loanId) {
            this.loanId = this.data.loanId;
            if (this.loanId) {
              console.log("this.data", this.data)
              this.getLoans(this.loanId);
              this.getLoanSchemes();
              this.getDefaultScheme();
            }
          }
        }
      }

    }

    if (this.data && this.data.equifaxData) {
      this.equifaxReportData = this.data.equifaxData;
      this.equifaxScore = this.equifaxReportData.score;
      console.log("this.equifaxReportData", this.equifaxReportData)
    }

    if (this.data && this.data.equifaxFormData) {
      this.equifaxFormData = this.data.equifaxFormData;
    }

    if (this.data && this.data.equifaxId) {
      this.equifaxId = this.data.equifaxId;
    }

    if (this.data && this.data.kycId) {
      this.kycId = this.data.kycId;
    }

    if (this.from && this.from == 'loancreate') {
      setTimeout(() => {
        this.checked()
      }, 3500);
    }

    if (this.from && this.from == 'analyzebank') {
      setTimeout(() => {
        this.downloadExcel()
      }, 3500);
    }

    if (this.from && this.from == 'customerIntegrationId') {
      if (this.data && this.data.customerIntegrationId) {
        this.customerIntegrationId = this.data.customerIntegrationId;
      }
    }

    if (this.data && this.data.dealerId) {
      this.getDealer(this.data.dealerId);
    }


  }

  saveCibilScore() {
    let cibilData = {
      "id": this.kycId,
      "cibilScore": this.cibilScore
    }
    cibilData['cibilReport'] = [];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'cibil') {
        cibilData['cibilReport'].push(this.filesToUpload[i]);
      }
    }
    this.cdlservice.generateCibilScore(cibilData).subscribe((data: any) => {
      if (data.length > 0) {
        this.uploadAudioVideo(data).then(
          (dataS3Url) => {
            console.log(dataS3Url);
          });
      }
      this.dialogRef.close({ msg: "success" });
    })
  }

  saveCustomerIntegrationId() {
    let data = {
      "customerIntegrationId": this.customerIntegrationId
    }
    this.dialogRef.close(data);
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


  uploadFiles(file, url) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.cdlservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          resolve(true);
        }, (error) => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }



  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }

  deleteTempImage(i, type, deleteText) {
    let files = this.filesToUpload.filter((fileObj) => {
      // console.log('fileObj',fileObj)
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });
    console.log("files", files, i)
    if (files && files.length > 0) {
      console.log(this.filesToUpload.indexOf(files[0]));
      if (this.filesToUpload && (this.filesToUpload.indexOf(files[0]) || this.filesToUpload.indexOf(files[0]) == 0)) {
        const index = this.filesToUpload.indexOf(files[0]);
        this.filesToUpload.splice(index, 1);
      }
    }
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);
  }

  convertToLoan() {
    this.close();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'equifax',
        equifaxId: this.equifaxId
      }
    }
    this.router.navigate(['provider', 'cdl', 'loans', 'create'], navigationExtras);
  }

  getDefaultScheme() {
    this.cdlservice.getDefaultScheme(this.loanId).subscribe((data) => {
      if (data && data[0]) {
        this.schemeSelected = data[0]
      }
    })
  }

  goHome() {
    this.close();
    this.router.navigate(['provider', 'cdl'])
  }

  resetErrors() {

  }


  approveStatusChange(value) {
    this.dealerAutoApprove = value;
  }

  districtStatusChange(value) {
    this.districtWiseRestriction = value;
  }


  downloadExcel() {
    window.open(this.downloadsrc, "_self");
    this.dialogRef.close();
  }
  payment(event) {
    this.sanctionedAmount = event.target.value;
    this.downPayment = this.totalPayment - this.sanctionedAmount;
  }

  onOtpChange(event) {

  }

  getLoans(id) {
    this.cdlservice.getLoanById(id).subscribe((data) => {
      this.loanData = data;
      this.totalPayment = this.loanData.invoiceAmount;
      this.downPayment = this.loanData.downpaymentAmount;
      this.loanAmount = this.loanData.requestedAmount;
      this.sanctionedAmount = this.loanData.requestedAmount;
    })
  }


  getDealer(id) {
    this.cdlservice.getDealerById(id).subscribe((data: any) => {
      this.dealerData = data;
      this.dealerAutoApprove = data.autoApproval;
      this.autoApprovalUptoAmount = data.autoApprovalUptoAmount;
      this.districtWiseRestriction = data.districtWiseRestriction;
      console.log("this.dealerData", this.dealerData)
    })
  }


  openSchemes() {
    const dialogRef = this.dialog.open(SelectSchemeComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        schemes: this.loanSchemes
      }
    });
    dialogRef.afterClosed().subscribe(scheme => {
      if (scheme) {
        console.log("selected", scheme);
        this.schemeSelected = scheme;
      }
    });
  }

  checked() {
    let data = {
      remarks: this.remarks,
      type: "remarks"
    }
    this.dialogRef.close(data);
  }

  approveDealer() {
    let data = {
      // "autoApproval": this.dealerAutoApprove,
      // "autoApprovalUptoAmount": this.autoApprovalUptoAmount,
      // "districtWiseRestriction": this.districtWiseRestriction,
      "approvedNote": this.remarks
    }
    console.log("Approve Dealer Data", data)
    this.dialogRef.close(data);
  }

  getLoanSchemes() {
    this.cdlservice.getLoanSchemes(this.loanId).subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }

  close() {
    this.dialogRef.close();
  }



  sanctionLoan() {
    this.loanApplication = {
      "loanScheme": {
        "id": this.schemeSelected.id
      },
      "invoiceAmount": this.totalPayment,
      "downpaymentAmount": this.downPayment,
      "requestedAmount": this.loanAmount,
      "sanctionedAmount": Number(this.sanctionedAmount),
      "note": this.remarks
    }

    this.cdlservice.manualLoanApproval(this.loanId, this.loanApplication).subscribe((data: any) => {
      if (data) {
        this.dialogRef.close(this.loanId);
        this.snackbarService.openSnackBar("Loan Approved Successfully")
        this.router.navigate(['provider', 'cdl']);
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })

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


}
