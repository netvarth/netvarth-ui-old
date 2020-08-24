import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-profile-popup',
  templateUrl: './update-profile-popup.component.html'
})
export class UpdateProfilePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpdateProfilePopupComponent>) { }
  fname = '';
  lname = '';
  api_error = '';
  ngOnInit() {
  }
  closeDialog() {
    if (this.fname === '') {
      this.api_error = 'Please enter your first name';
    } else if (this.fname && this.fname.trim().length < 3) {
      this.api_error = 'First name is too short';
    } else if (this.lname === '') {
      this.api_error = 'Please enter your last name';
    } else {
      const post_data = {
        'firstName': this.fname.trim(),
        'lastName': this.lname.trim()
      };
      this.dialogRef.close(post_data);
    }
  }
  resetError() {
    this.api_error = '';
  }
}
