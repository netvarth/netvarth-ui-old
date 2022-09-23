import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';

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

  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog


  ) { }

  ngOnInit(): void {
  }

  resetErrors() {

  }

  verifyaadhar() {
    this.aadharverification = true;
  }

  verifypan() {
    this.panverification = true;
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


  verifyotp() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
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

}
