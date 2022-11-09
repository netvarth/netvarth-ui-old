import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../../loans/otp-verify/otp-verify.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { FileService } from '../../../../../shared/services/file-service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-create-dealer',
  templateUrl: './create-dealer.component.html',
  styleUrls: ['./create-dealer.component.css']
})
export class CreateDealerComponent implements OnInit {
  createDealer: FormGroup;
  partnerTypes: any;
  partnerCategories: any;
  dealerData: any;
  dealerApplication: any;
  bankverification: any = false;
  verifyingUID: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  selectedFiles = {
    "photo": { files: [], base64: [], caption: [] },
    "store": { files: [], base64: [], caption: [] },
    "aadhar": { files: [], base64: [], caption: [] },
    "pan": { files: [], base64: [], caption: [] },
    "cheque": { files: [], base64: [], caption: [] }
  }
  filesToUpload: any = [];
  actionText: any;
  bankData: any;
  aadharverification = false;
  gstverification = false;
  headerText: any = "Create Dealer";
  btnText: any = "Create Dealer";
  action: any;
  dealerId: any;
  from: any;
  verification = false;
  panverification = false;
  emailverification = false;
  businessId: any;
  businessDetails: any;
  partnerSizes = [
    {
      name: "Small"
    },
    {
      name: "Medium"
    },
    {
      name: "Large"
    }
  ];
  partnerTrades = [
    {
      name: "Wholesale"
    },
    {
      name: "Retail"
    }
  ];
  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private createDealerFormBuilder: FormBuilder,
    private cdlservice: CdlService,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    private fileService: FileService,
    private wordProcessor: WordProcessor

  ) {
    this.createDealer = this.createDealerFormBuilder.group({
      phone: [null],
      name: [null],
      email: [null],
      type: [null],
      photo: [null],
      storephoto: [null],
      aadhar: [null],
      aadharattachment: [null],
      address1: [null],
      address2: [null],
      city: [null],
      state: [null],
      pincode: [null],
      pan: [null],
      panattachment: [null],
      category: [null],
      description: [null],
      gst: [null],
      size: [null],
      trade: [null],
      cheque: [null],
      bank: [null],
      account: [null],
      ifsc: [null]
    });




    this.activated_route.queryParams.subscribe((params) => {
      if (params.id) {
        // const filter = { 'uid-eq': params.id };
        this.cdlservice.getDealerById(params.id).subscribe((data) => {
          this.dealerData = data;
          this.action = params.action;
          this.dealerId = params.id;
          this.from = params.from;
          console.log("this.dealerData", this.dealerData)
          if (params.action == 'update' && this.dealerData) {
            if (this.from && this.from == 'create') {
              this.verification = true;
            }
            this.headerText = "Update Dealer";
            this.btnText = "Update Dealer";
            this.createDealer.controls.name.setValue(this.dealerData.partnerName);
            this.createDealer.controls.phone.setValue(this.dealerData.partnerMobile);
            this.createDealer.controls.email.setValue(this.dealerData.partnerEmail);
            this.createDealer.controls.description.setValue(this.dealerData.description);
            this.createDealer.controls.aadhar.setValue(this.dealerData.aadhaar);
            this.createDealer.controls.pan.setValue(this.dealerData.pan);
            this.createDealer.controls.gst.setValue(this.dealerData.gstin);
            this.createDealer.controls.address1.setValue(this.dealerData.partnerAddress1);
            this.createDealer.controls.address2.setValue(this.dealerData.partnerAddress2);
            this.createDealer.controls.pincode.setValue(this.dealerData.partnerPin);
            this.createDealer.controls.city.setValue(this.dealerData.partnerCity);
            this.createDealer.controls.state.setValue(this.dealerData.partnerState);
            if (this.dealerData && this.dealerData.type && this.dealerData.type.id) {
              this.createDealer.controls.type.setValue(this.dealerData.type.id);
            }
            if (this.dealerData && this.dealerData.category && this.dealerData.category.id) {
              this.createDealer.controls.category.setValue(this.dealerData.category.id);
            }
            this.createDealer.controls.size.setValue(this.dealerData.partnerSize);
            this.createDealer.controls.trade.setValue(this.dealerData.partnerTrade);


            this.selectedFiles['photo'].files = this.dealerData.partnerAttachments;
            this.selectedFiles['aadhar'].files = this.dealerData.aadhaarAttachments;
            this.selectedFiles['pan'].files = this.dealerData.panAttachments;
            this.selectedFiles['store'].files = this.dealerData.storeAttachments;
            this.selectedFiles['cheque'].files = this.dealerData.bankAttachments;

            if (this.dealerData && this.dealerData.partnerMobileVerified) {
              this.verification = true;
            }

            if (this.dealerData && this.dealerData.gstinVerified) {
              this.gstverification = true;
            }


            if (this.dealerData && this.dealerData.bankName) {
              this.createDealer.controls.bank.setValue(this.dealerData.bankName);
            }

            if (this.dealerData && this.dealerData.bankAccountNo) {
              this.createDealer.controls.account.setValue(this.dealerData.bankAccountNo);
            }

            if (this.dealerData && this.dealerData.bankIfsc) {
              this.createDealer.controls.ifsc.setValue(this.dealerData.bankIfsc);
            }

            if (this.dealerData && this.dealerData.partnerEmailVerified) {
              this.emailverification = true;
            }

            if (this.dealerData && this.dealerData.bankAccountVerified) {
              this.bankverification = true;
            }

            if (this.dealerData && this.dealerData.isPanVerified) {
              this.panverification = true;
            }

            if (this.dealerData && this.dealerData.isAadhaarVerified) {
              this.aadharverification = true;
            }



            this.cdlservice.getBankDetailsById(params.id).subscribe((data) => {
              this.bankData = data;
              console.log("this.bankData", this.bankData)
              if (this.bankData) {
                this.createDealer.controls.bank.setValue(this.bankData.bankName);
                this.createDealer.controls.account.setValue(this.bankData.bankAccountNo);
                this.createDealer.controls.ifsc.setValue(this.bankData.bankIfsc);
                // this.accountverification = this.bankData.bankAccountVerified;
                this.selectedFiles['cheque'].files = this.bankData.bankAttachments;
              }
            });



          }
        })
      }
    });
  }

  ngOnInit(): void {

    this.getPartnerCategories();
    this.getPartnerTypes();
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
  }

  resetErrors() {

  }



  idVerification(type) {

    this.dealerApplication = {
      "uid": this.dealerId
    }

    if (type == 'Pan') {
      this.dealerApplication["pan"] = this.createDealer.controls.pan.value;
    }
    else if (type == 'UID') {
      this.dealerApplication["aadhaar"] = this.createDealer.controls.aadhar.value;
    }

    this.cdlservice.getDealerById(this.dealerId).subscribe((data: any) => {
      if (data && data.dealerApplicationKycList && data.dealerApplicationKycList[0] && data.dealerApplicationKycList[0].id) {
        this.dealerApplication["id"] = data.dealerApplicationKycList[0].id
      }
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.filesToUpload[i]['order'] = i;
        if (this.filesToUpload[i]["type"] == 'pan' && type == 'Pan') {
          this.dealerApplication['panAttachments'] = [];
          this.dealerApplication['panAttachments'].push(this.filesToUpload[i]);
        }
        if (this.filesToUpload[i]["type"] == 'aadhar' && type == 'UID') {
          this.dealerApplication['aadhaarAttachments'] = [];
          this.dealerApplication['aadhaarAttachments'].push(this.filesToUpload[i]);
        }
      }

      this.cdlservice.verifyPartnerIds(type, this.dealerApplication).subscribe((s3urls: any) => {
        if (s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        if (type == 'Pan') {
          this.panverification = true;
          this.snackbarService.openSnackBar(type + " Verified Successfully")
        }
        else if (type == 'UID') {
          this.verifyingUID = true;
          this.snackbarService.openSnackBar("We have sent the verification link to mobile.Please Verify and click on refresh")
        }
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
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
            owner: this.businessId,
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

  verifyemail() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Email',
        email: this.createDealer.controls.email.value,
        dealerId: this.dealerData.id,
        from: 'partner'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.emailverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }

  verifyaadhar() {

    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Aadhar Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.aadharverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }



  verifygst() {
    let gstDetails = {
      "gstin": this.createDealer.controls.gst.value
    }
    this.cdlservice.gstVerify(this.dealerId, gstDetails).subscribe((data) => {
      if (data) {
        this.gstverification = true;
        this.snackbarService.openSnackBar("Gst Verified Successfully")
      }
      else {
        this.snackbarService.openSnackBar("Enter Valid GST Number", { 'panelClass': 'snackbarerror' })
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }

  verifypan() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Pan Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.panverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }

  goBack() {
    this.location.back();
  }

  goNext() {
    this.router.navigate(['provider', 'cdl', 'dealers', 'approved'])
  }

  imageSelect(event) {

  }

  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }


  getPartnerTypes() {
    this.cdlservice.getPartnerTypes().subscribe((data) => {
      this.partnerTypes = data;
      console.log("this.partnerTypes", this.partnerTypes)
    })
  }


  getPartnerCategories() {
    this.cdlservice.getPartnerCategories().subscribe((data) => {
      this.partnerCategories = data;
      console.log("this.partnerCategories", this.partnerCategories)
    })
  }



  verifyotp() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Mobile Number',
        phoneNumber: this.createDealer.controls.phone.value,
        name: this.createDealer.controls.name.value,
        from: 'partner'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.uid) {
        this.dealerId = result.uid;
        this.verification = true;
        this.updateDealer(this.dealerId, 'update')
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }



  updateDealer(id, action) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        action: action,
        from: 'create'
      }
    };
    this.router.navigate(['provider', 'cdl', 'dealers', 'update'], navigationExtras);
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
    // console.log("files",files,i)
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
    // if (type === 'aadhar') {
    //   this.dealerData.aadharAttachments.splice(i, 1);
    //   this.actionText = 'Delete';

    // } else if (type === 'pan') {
    //   this.dealerData.panAttachments.splice(i, 1);
    //   this.actionText = 'Delete';
    // }
    // else if (type === 'photo') {
    //   this.dealerData.partnerAttachments.splice(i, 1);
    //   this.actionText = 'Delete';
    // }
    // else if (type === 'store') {
    //   this.dealerData.storeAttachments.splice(i, 1);
    //   this.actionText = 'Delete';
    // }
    // else if (type === 'cheque') {
    //   this.dealerData.bankAttachments.splice(i, 1);
    //   this.actionText = 'Delete';
    // }
  }


  saveBankDetails() {

    let bankInfo = {
      "uid": this.dealerData.uid,
      "bankName": this.createDealer.controls.bank.value,
      "bankAccountNo": this.createDealer.controls.account.value,
      "bankIfsc": this.createDealer.controls.ifsc.value
    }

    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'cheque') {
        bankInfo['bankAttachments'] = [];
        bankInfo['bankAttachments'].push(this.filesToUpload[i]);
      }
    }
    if (this.dealerData && this.dealerData.id) {
      bankInfo['id'] = this.dealerData.id
    }

    const verifyBank = {
      "id": this.dealerData.id,
      "uid": this.dealerData.uid,
      "bankName": this.createDealer.controls.bank.value,
      "bankAccountNo": this.createDealer.controls.account.value,
      "bankIfsc": this.createDealer.controls.ifsc.value
    }



    // if (this.bankData == null) {
    //   this.cdlservice.savePartnerBankDetails(bankInfo).subscribe((s3urls: any) => {
    //     if (s3urls.length > 0) {
    //       this.uploadAudioVideo(s3urls).then(
    //         (dataS3Url) => {
    //           console.log(dataS3Url);
    //         });
    //     }
    //     this.cdlservice.verifyBankDetails(verifyBank).subscribe((data: any) => {
    //       if (data) {
    //         this.cdlservice.getBankDetailsById(this.dealerId).subscribe((bankInfo) => {
    //           this.bankData = bankInfo;
    //         });
    //       }
    //       this.snackbarService.openSnackBar("Bank Details Verified and Saved Successfully")

    //     }),
    //       (error) => {
    //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
    //       }
    //   }), (error) => {
    //     this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
    //   }
    // }
    // else {

    this.cdlservice.verifyPartnerBankDetails(verifyBank).subscribe((data: any) => {
      if (data) {
        this.cdlservice.updatePartnerBankDetails(bankInfo).subscribe((s3urls: any) => {
          if (s3urls.length > 0) {
            this.uploadAudioVideo(s3urls).then(
              (dataS3Url) => {
                console.log(dataS3Url);
              });
          }
          this.bankverification = true;
          this.snackbarService.openSnackBar("Bank Details Verified Successfully")
        }), (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        }
      }
    }),
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      }


    // }
  }

  createPartner() {
    this.dealerData = {
      "partnerName": this.createDealer.controls.name.value,
      "partnerMobile": this.createDealer.controls.phone.value,
      "partnerEmail": this.createDealer.controls.email.value,
      "description": this.createDealer.controls.description.value,
      "type": { "id": this.createDealer.controls.type.value },
      "category": { "id": this.createDealer.controls.category.value },
      "partnerAddress1": this.createDealer.controls.address1.value,
      "partnerAddress2": this.createDealer.controls.address2.value,
      "partnerPin": this.createDealer.controls.pincode.value,
      "partnerCity": this.createDealer.controls.city.value,
      "partnerState": this.createDealer.controls.state.value,
      "aadhaar": this.createDealer.controls.aadhar.value,
      "pan": this.createDealer.controls.pan.value,
      "gstin": this.createDealer.controls.gst.value,
      "partnerSize": this.createDealer.controls.size.value,
      "partnerTrade": this.createDealer.controls.trade.value,
    }

    console.log("This.dealerData", this.dealerData);
    console.log("This.Files", this.filesToUpload);


    if (this.dealerData) {
      console.log("Loan Application Data : ", this.dealerData)
      if (this.action != 'update') {
        for (let i = 0; i < this.filesToUpload.length; i++) {
          this.filesToUpload[i]['order'] = i;
          if (this.filesToUpload[i]["type"] == 'photo') {
            this.dealerData['partnerAttachments'] = [];
            this.dealerData['partnerAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'aadhar') {
            this.dealerData['aadhaarAttachments'] = [];
            this.dealerData['aadhaarAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'pan') {
            this.dealerData['panAttachments'] = [];
            this.dealerData['panAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'store') {
            this.dealerData['storeAttachments'] = [];
            this.dealerData['storeAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'cheque') {
            this.dealerData['bankAttachments'] = [];
            this.dealerData['bankAttachments'].push(this.filesToUpload[i]);
          }
        }

        this.cdlservice.createPartner(this.dealerData).subscribe((s3urls: any) => {
          if (s3urls && s3urls.length > 0) {
            this.uploadAudioVideo(s3urls).then(
              (dataS3Url) => {
                console.log(dataS3Url);
              });
          }
          this.snackbarService.openSnackBar("Dealer Created Successfully")
          this.router.navigate(['provider', 'cdl', 'dealers', 'approved'])
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
      else {

        for (let i = 0; i < this.filesToUpload.length; i++) {
          this.filesToUpload[i]['order'] = i;
          if (this.filesToUpload[i]["type"] == 'photo') {
            this.dealerData['partnerAttachments'] = [];
            this.dealerData['partnerAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'store') {
            this.dealerData['storeAttachments'] = [];
            this.dealerData['storeAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'aadhar') {
            this.dealerData['aadhaarAttachments'] = [];
            this.dealerData['aadhaarAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'pan') {
            this.dealerData['panAttachments'] = [];
            this.dealerData['panAttachments'].push(this.filesToUpload[i]);
          }
          if (this.filesToUpload[i]["type"] == 'cheque') {
            this.dealerData['bankAttachments'] = [];
            this.dealerData['bankAttachments'].push(this.filesToUpload[i]);
          }
        }
        console.log("filesToUpload", this.filesToUpload)
        this.dealerData['uid'] = this.dealerId;
        this.cdlservice.updateDealer(this.dealerId, this.dealerData).subscribe((s3urls: any) => {
          if (s3urls && s3urls.length > 0) {
            this.uploadAudioVideo(s3urls).then(
              (dataS3Url) => {
                console.log(dataS3Url);
              });
          }
          this.cdlservice.dealerApprovalRequest(this.dealerId).subscribe((s3urls: any) => {
            this.snackbarService.openSnackBar("Dealer Updated Successfully")
            this.router.navigate(['provider', 'cdl', 'dealers'])
          })
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
    }

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
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }



  refreshAadharVerify() {
    this.cdlservice.refreshPartnerAadharVerify(this.dealerId).subscribe((data: any) => {
      if (data) {
        this.aadharverification = true;
        this.cdlservice.getDealerById(this.dealerId).subscribe((data: any) => {
          if (data) {
            this.createDealer.controls.address1.setValue(data.partnerAddress1);
            this.createDealer.controls.address2.setValue(data.partnerAddress2);
            this.createDealer.controls.city.setValue(data.partnerCity);
            this.createDealer.controls.state.setValue(data.partnerState);
            this.createDealer.controls.pincode.setValue(data.partnerPin);
          }
          this.verifyingUID = false;
        })
      }
    });
  }


  saveAsLead() {
    this.dealerData = {
      "uid": this.dealerId,
      "partnerName": this.createDealer.controls.name.value,
      "partnerMobile": this.createDealer.controls.phone.value,
      "partnerEmail": this.createDealer.controls.email.value,
      "description": this.createDealer.controls.description.value,
      "type": { "id": this.createDealer.controls.type.value },
      "category": { "id": this.createDealer.controls.category.value },
      "partnerAddress1": this.createDealer.controls.address1.value,
      "partnerAddress2": this.createDealer.controls.address2.value,
      "partnerPin": this.createDealer.controls.pincode.value,
      "partnerCity": this.createDealer.controls.city.value,
      "partnerState": this.createDealer.controls.state.value,
      "aadhaar": this.createDealer.controls.aadhar.value,
      "pan": this.createDealer.controls.pan.value,
      "gstin": this.createDealer.controls.gst.value,
      "partnerSize": this.createDealer.controls.size.value,
      "partnerTrade": this.createDealer.controls.trade.value,
    }

    console.log("This.dealerData", this.dealerData);
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.filesToUpload[i]['order'] = i;
      if (this.filesToUpload[i]["type"] == 'photo') {
        this.dealerData['partnerAttachments'] = [];
        this.dealerData['partnerAttachments'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'store') {
        this.dealerData['storeAttachments'] = [];
        this.dealerData['storeAttachments'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'aadhar') {
        this.dealerData['aadhaarAttachments'] = [];
        this.dealerData['aadhaarAttachments'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'pan') {
        this.dealerData['panAttachments'] = [];
        this.dealerData['panAttachments'].push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'cheque') {
        this.dealerData['bankAttachments'] = [];
        this.dealerData['bankAttachments'].push(this.filesToUpload[i]);
      }
    }

    if (this.dealerData) {
      console.log("Loan Application Data : ", this.dealerData)
      this.cdlservice.updateDealer(this.dealerId, this.dealerData).subscribe((s3urls: any) => {
        if (s3urls && s3urls.length > 0) {
          this.uploadAudioVideo(s3urls).then(
            (dataS3Url) => {
              console.log(dataS3Url);
            });
        }
        this.snackbarService.openSnackBar("Dealer Saved As Draft Successfully")
        this.router.navigate(['provider', 'cdl', 'dealers'])
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    }
  }

}
