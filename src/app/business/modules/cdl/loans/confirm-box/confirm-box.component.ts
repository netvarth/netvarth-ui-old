import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { CdlService } from '../../cdl.service';
import { SelectSchemeComponent } from '../select-scheme/select-scheme.component';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  from: any;
  remarks: any;
  schemeSelected: any;
  loanApplication: any;
  loanSchemes: any;
  sanctionAmount: any = false;
  type: any;
  dealerData: any;
  loanId: any;
  downloadsrc = "https://scale.jaldee.com/shortUrl/Njg5My0xLTI3MTM3";
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
  totalPayment: any = 0;
  downPayment: any = 0;
  loanAmount: any = 0;
  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cdlservice: CdlService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {

  }

  ngOnInit(): void {
    this.from = this.data.from;
    if (this.from && this.from == 'creditofficer') {
      if (this.data && this.data.type) {
        this.type = this.data.type
        if (this.type == 'sanction') {
          this.sanctionAmount = true;
          if (this.data && this.data.loanId) {
            this.loanId = this.data.loanId;
            if (this.loanId) {
              console.log("this.data", this.data)
              this.getLoans(this.loanId);
            }
          }
        }
      }
    }

    if (this.from && this.from == 'loancreate') {
      setTimeout(() => {
        this.checked()
      }, 3500);
    }

    if (this.from && this.from == 'analyzebank') {
      setTimeout(() => {
        this.downloadExcel()
      }, 3500);
    }

    if (this.data && this.data.dealerId) {
      this.getDealer(this.data.dealerId);
    }

    this.getLoanSchemes();
  }

  goHome() {
    this.close();
    this.router.navigate(['provider', 'cdl'])
  }

  resetErrors() {

  }


  approveStatusChange(value) {
    this.dealerAutoApprove = value;
  }

  districtStatusChange(value) {
    this.districtWiseRestriction = value;
  }


  downloadExcel() {
    window.open(this.downloadsrc, "_self");
    this.dialogRef.close();
  }
  payment(event) {
    this.sanctionedAmount = event.target.value;
    this.downPayment = this.totalPayment - this.sanctionedAmount;
  }

  onOtpChange(event) {

  }

  getLoans(id) {
    this.cdlservice.getLoanById(id).subscribe((data) => {
      this.loanData = data;
      this.totalPayment = this.loanData.invoiceAmount;
      this.downPayment = this.loanData.downpaymentAmount;
      this.loanAmount = this.loanData.requestedAmount;
      this.sanctionedAmount = this.loanData.requestedAmount;
      this.schemeSelected = this.loanData.loanScheme;
      console.log(this.loanData)
    })
  }


  getDealer(id) {
    this.cdlservice.getDealerById(id).subscribe((data: any) => {
      this.dealerData = data;
      this.dealerAutoApprove = data.autoApproval;
      this.autoApprovalUptoAmount = data.autoApprovalUptoAmount;
      this.districtWiseRestriction = data.districtWiseRestriction;
      console.log("this.dealerData", this.dealerData)
    })
  }


  openSchemes() {
    const dialogRef = this.dialog.open(SelectSchemeComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        schemes: this.loanSchemes
      }
    });
    dialogRef.afterClosed().subscribe(scheme => {
      if (scheme) {
        console.log("selected", scheme);
        this.schemeSelected = scheme;
      }
    });
  }

  checked() {
    let data = {
      remarks: this.remarks,
      type: "remarks"
    }
    this.dialogRef.close(data);
  }

  approveDealer() {
    let data = {
      "autoApproval": this.dealerAutoApprove,
      "autoApprovalUptoAmount": this.autoApprovalUptoAmount,
      "districtWiseRestriction": this.districtWiseRestriction,
      "approvedNote": this.remarks
    }
    console.log("Approve Dealer Data", data)
    this.dialogRef.close(data);
  }

  getLoanSchemes() {
    this.cdlservice.getLoanSchemes().subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }

  close() {
    this.dialogRef.close();
  }



  sanctionLoan() {
    this.loanApplication = {
      "loanScheme": {
        "id": this.schemeSelected.id
      },
      "invoiceAmount": this.totalPayment,
      "downpaymentAmount": this.downPayment,
      "requestedAmount": this.loanAmount,
      "sanctionedAmount": Number(this.sanctionedAmount)
    }

    this.cdlservice.manualLoanApproval(this.loanId, this.loanApplication).subscribe((data: any) => {
      if (data) {
        this.dialogRef.close();
        this.snackbarService.openSnackBar("Loan Approved Successfully")
        this.router.navigate(['provider', 'cdl']);
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })

  }


}
