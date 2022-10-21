import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PartnerService } from '../../../partner/partner.service';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {

  loanId: any;
  accountId: any;
  phoneNumber: any;
  email: any;
  constructor(
    private activatedroute: ActivatedRoute,
    private partnerservice: PartnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      if (params && params.uid) {
        this.loanId = params.uid;
      }
      if (params && params.account) {
        this.accountId = params.account;
      }
    })

    this.partnerservice.getLoanFromOutside(this.loanId, this.accountId).subscribe((data: any) => {
      console.log("LoanData", data);
      if (data && data.customer && data.customer.phoneNo && data.customer.email) {
        this.phoneNumber = data.customer.phoneNo
        this.email = data.customer.email
      }
    })
  }


  accept() {
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        phoneNo: this.phoneNumber,
        email: this.email,
        uid: this.loanId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });

  }


}
