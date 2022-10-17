import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../../loans/otp-verify/otp-verify.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { FileService } from '../../../../../shared/services/file-service';

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
  aadharverification = false;
  headerText: any = "Create Dealer";
  btnText: any = "Create Dealer";
  action: any;
  dealerId: any;
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
    private fileService: FileService

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
      trade: [null]
    });




    this.activated_route.queryParams.subscribe((params) => {
      if (params.id) {
        // const filter = { 'uid-eq': params.id };
        this.cdlservice.getDealerById(params.id).subscribe((data) => {
          this.dealerData = data;
          this.action = params.action;
          this.dealerId = params.id;
          console.log("this.dealerData", this.dealerData)
          if (params.action == 'update' && this.dealerData) {
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
            this.createDealer.controls.type.setValue(this.dealerData.type.id);
            this.createDealer.controls.category.setValue(this.dealerData.category.id);
            this.createDealer.controls.size.setValue(this.dealerData.partnerSize);
            this.createDealer.controls.trade.setValue(this.dealerData.partnerTrade);


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
      if (result) {
        if (result = "verified") {
          this.verification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
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
    if (type === 'aadhar') {
      this.dealerData.loanApplicationKycList[0].aadharAttachments.splice(i, 1);
      this.actionText = 'Delete';

    } else if (type === 'pan') {
      this.dealerData.loanApplicationKycList[0].panAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'photo') {
      this.dealerData.consumerPhoto.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'store') {
      this.dealerData.otherAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
    else if (type === 'cheque') {
      this.dealerData.otherAttachments.splice(i, 1);
      this.actionText = 'Delete';
    }
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


    if (this.dealerData) {
      console.log("Loan Application Data : ", this.dealerData)
      if (this.action != 'update') {
        this.cdlservice.createPartner(this.dealerData).subscribe((response: any) => {
          console.log("response", response);
          this.snackbarService.openSnackBar("Dealer Created Successfully")
          this.router.navigate(['provider', 'cdl', 'dealers', 'approved'])
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
      else {
        this.dealerData['uid'] = this.dealerId;
        this.cdlservice.updateDealer(this.dealerId, this.dealerData).subscribe((response: any) => {
          console.log("response", response);
          this.snackbarService.openSnackBar("Dealer Updated Successfully")
          this.router.navigate(['provider', 'cdl', 'dealers'])
        },
          (error) => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
          })
      }
    }

  }



  saveAsDraft() {
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


    if (this.dealerData) {
      console.log("Loan Application Data : ", this.dealerData)
      this.cdlservice.savePartner(this.dealerData).subscribe((response: any) => {
        console.log("response", response);
        this.snackbarService.openSnackBar("Dealer Saved As Draft Successfully")
        this.router.navigate(['provider', 'cdl', 'dealers'])
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
    }
  }

}
