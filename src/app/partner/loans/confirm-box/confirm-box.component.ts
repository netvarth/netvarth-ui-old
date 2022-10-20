import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  from: any;
  remarks: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.from = this.data.from;
    if (this.from && this.from == 'loancreate') {
      setTimeout(() => {
        this.checked()
      }, 3500);
    }
  }

  goHome() {
    this.close();
    this.router.navigate(['provider', 'cdl'])
  }

  onOtpChange(event) {

  }

  checked() {
    let data = {
      remarks: this.remarks,
      type: "remarks"
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }
}
