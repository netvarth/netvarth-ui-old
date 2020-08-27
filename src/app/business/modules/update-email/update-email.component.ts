import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html'
})
export class UpdateEmailComponent implements OnInit {
  email;
  api_error = '';
  constructor(public dialogRef: MatDialogRef<UpdateEmailComponent>) { }

  ngOnInit() {
  }
  closeDialog() {
    if (this.email) {
      const stat = this.validateEmail(this.email);
      if (!stat) {
        this.api_error = 'Please enter a valid email';
      } else {
        this.dialogRef.close(this.email);
      }
    } else {
      this.api_error = 'Please enter your email.';
      // this.dialogRef.close();
    }
  }
  validateEmail(mail) {
    const emailField = mail;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) === false) {
      return false;
    }
    return true;
  }
  resetError() {
    this.api_error = '';
  }
}
