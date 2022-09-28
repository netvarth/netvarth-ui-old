import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  phone: any = '';
  name: any = '';
  email: any = '';
  aadhar: any = '';
  pan: any = '';
  salary: any = '';
  office: any = '';
  emi: any = '';
  remarks: any = '';
  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute


  ) {

  }

  ngOnInit(): void {
    this.activated_route.queryParams.subscribe((params) => {
      console.log('params', params);
      if (params) {
        if (params.type == 'action') {
          this.phone = '9854785868';
          this.name = 'Adarsh';
          this.email = 'adarshk@gmail.com';
          this.aadhar = 254878548956;
          this.address1 = 'Vellara Building';
          this.address2 = 'Museum CrossLane';
          this.city = 'Thrissur';
          this.state = 'Kerala';
          this.pincode = '518510';
          this.addresscheck = true;
          this.pan = 'SDERF2541K';
          this.salary = '45000';
          this.office = 'Thrissur';
          this.emi = '3';
          this.remarks = "Aadhar and Pan are Verified";
          this.aadharverification = true;
          this.verification = true;
          this.emailverification = true;
          this.panverification = true;
        }
      }
    });
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
    if (this.totalPayment == 0) {
      this.snackbarService.openSnackBar("Please Fill All Fields", { 'panelClass': 'snackbarerror' });
    }
    else {
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          from: 'loancreate'
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
