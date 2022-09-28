import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  aadharverification = false;
  verification = false;
  panverification = false;
  emailverification = false;
  address1: any = '';
  address2: any = '';
  city: any = '';
  state: any = '';
  pincode: any = '';
  addresscheck: any = false;
  showaddressfields: any = false;
  loanAmount: any = 0;
  totalPayment: any = 0;
  downPayment: any = 0;
  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService


  ) { }

  ngOnInit(): void {
  }

  resetErrors() {

  }





  goBack() {
    this.location.back();
  }

  goNext() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved'])
  }

  filesSelected(event) {
    console.log('event', event)
    const input = event.target.files;
    console.log('input', input)
    if (input) {
      for (const file of input) {
        this.selectedMessage.files.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedMessage.base64.push(e.target['result']);
        };
        reader.readAsDataURL(file);
        // }
      }
    }
  }

  imageSelect(event) {

  }

  saveAsDraft() {
    this.snackbarService.openSnackBar("Saved to Draft Successfully");
    this.router.navigate(['provider', 'cdl', 'leads']);
  }

  checkELigibility() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "eligible") {
          if (this.totalPayment <= 50000) {
            this.snackbarService.openSnackBar("Eligibility Calculation Done");
            this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
          }
          else if (this.totalPayment > 50000 && this.totalPayment <= 200000) {
            this.router.navigate(['provider', 'cdl', 'loans', 'additionalqa']);
          }
          else {
            this.snackbarService.openSnackBar("Sorry,This Loan Was Rejected", { 'panelClass': 'snackbarerror' });
            const navigationExtras: NavigationExtras = {
              queryParams: {
                type: 'rejected'
              }
            }
            this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
          }

        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
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
          this.address1 = "Vellara Building";
          this.address2 = "Museum CrossLane";
          this.city = "Thrissur";
          this.state = "Kerala";
          this.pincode = "680020";
          this.addresscheck = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }


  payment(event) {
    this.totalPayment = event.target.value;
    this.downPayment = Math.round(this.totalPayment * 0.2);
    this.loanAmount = Math.round(this.totalPayment - this.downPayment);
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


  addresschange(event) {
    if (event.target.checked) {
      this.showaddressfields = false;
    }
    else {
      this.showaddressfields = true;
    }
  }

}
