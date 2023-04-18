import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {
  from: any;
  remarks: any;
  schemeSelected: any;
  loanApplication: any;
  loanSchemes: any;
  sanctionAmount: any = false;
  type: any;
  dealerData: any;
  loanId: any;
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
  totalPayment: any = 0;
  downPayment: any = 0;
  loanAmount: any = 0;
  equifaxReportData: any;
  equifaxScore: any;
  equifaxFormData: any;
  equifaxId: any;
  constructor(
    public dialogRef: MatDialogRef<RemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.type = this.data.type;
  }

  goHome() {
    this.close();
    this.router.navigate(['provider', 'ivr'])
  }

  resetErrors() {

  }

  addRemarks() {
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
