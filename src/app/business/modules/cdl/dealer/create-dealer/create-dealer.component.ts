import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../../loans/otp-verify/otp-verify.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

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
  aadharverification = false;
  verification = false;
  panverification = false;
  emailverification = false;
  businessId: any;
  businessDetails: any;

  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private createDealerFormBuilder: FormBuilder,
    private cdlservice: CdlService,
    private snackbarService: SnackbarService

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
      partneraddress1: [null],
      partneraddress2: [null],
      partnercity: [null],
      partnerstate: [null],
      partnerpincode: [null],
      pan: [null],
      panattachment: [null],
      category: [null],
      description: [null],
      gst: [null],
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

  verifyemail() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Email'
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
        type: 'Mobile Number'
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




  createPartner() {


    this.dealerData = {
      "account": this.businessId,
      "parentId": null,
      "parentName": null,
      "partnerName": this.createDealer.controls.name.value,
      "partnerMobile": this.createDealer.controls.phone.value,
      "partnerEmail": this.createDealer.controls.email.value,
      "description": this.createDealer.controls.description.value,
      "type": { "id": this.createDealer.controls.type.value },
      "category": { "id": this.createDealer.controls.category.value },
      "partnerAddress1": this.createDealer.controls.partneraddress1.value,
      "partnerAddress2": this.createDealer.controls.partneraddress2.value,
      "partnerPin": this.createDealer.controls.partnerpincode.value,
      "partnerCity": this.createDealer.controls.partnercity.value,
      "partnerState": this.createDealer.controls.partnerstate.value,
      "aadhaar": this.createDealer.controls.aadhar.value,
      "pan": this.createDealer.controls.pan.value,
      "gst": this.createDealer.controls.gst.value,
    }

    console.log("This.dealerData", this.dealerData);


    if (this.dealerData) {
      console.log("Loan Application Data : ", this.dealerData)
      // if (this.action == "update") {
      //   this.dealerData['status'] = {
      //     "id": this.loanData.status.id
      //   };
      //   this.dealerData.customer = {
      //     "id": this.loanData.customer.id
      //   };
      //   this.dealerData.dealerDataKycList[0]['id'] = this.loanData.dealerDataKycList[0].id;
      //   console.log("response");
      //   this.cdlservice.updateLoan(this.loanId, this.dealerData).subscribe((response: any) => {
      //     console.log("response", response);
      //     this.snackbarService.openSnackBar("Loan Application Updated Successfully")
      //     this.router.navigate(['provider', 'cdl', 'loans'])
      //   },
      //     (error) => {
      //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      //     })
      //   console.log("response");
      // }
      // else {
      this.cdlservice.createPartner(this.dealerData).subscribe((response: any) => {
        console.log("response", response);
        this.snackbarService.openSnackBar("Dealer Created Successfully")
        this.router.navigate(['provider', 'cdl', 'dealers'])
      },
        (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
        })
      // }
    }

  }



  saveAsDraft() {

  }

}
