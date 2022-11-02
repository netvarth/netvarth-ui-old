import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OtpVerifyComponent } from '../otp-verify/otp-verify.component';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { PartnerService } from '../../partner.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {
  timetype: number = 1;
  from: any;
  type: any;
  scheme: any;
  loanId: any;
  verification = false;
  accountverification = false;
  user: any;
  loanSchemes: any;
  schemeSelected: any;
  partnerParentId: any;
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private activated_route: ActivatedRoute,
    private groupService: GroupStorageService,
    private partnerService: PartnerService,
    private lStorageService: LocalStorageService


  ) { }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');

    this.activated_route.queryParams.subscribe((params) => {
      if (params && params.timetype) {
        this.timetype = params.timetype;
      }
      if (params && params.from) {
        this.from = params.from;
      }
      if (params && params.type) {
        this.type = params.type;
      }
      if (params && params.uid) {
        this.loanId = params.uid;
      }
    });

    this.getLoanSchemes();

  }

  resetErrors() {

  }

  selectedScheme(scheme) {
    this.schemeSelected = scheme;
    if (this.schemeSelected) {
      this.gotoNext();
    }
  }

  goNext() {
    if (this.timetype == 1 && this.user.userType == 2) {
      this.timetype = 3;
    }
    else if (this.timetype >= 1) {
      this.timetype = this.timetype + 1;
      console.log("this.timetype", this.timetype);
    }
    return true;
  }
  goBack() {
    if (this.timetype > 1 && (this.from && this.from != 'creditofficer' && this.from != 'schemeslist')) {
      this.timetype = this.timetype - 1;
    }
    else {
      this.location.back();
    }
  }

  goHome() {
    this.router.navigate([this.partnerParentId, 'partner']);
  }


  refreshCustomerAcceptance() {
    // this.partnerService.changeInternalStatus(this.loanId, 'ConsumerAccepted').subscribe((data) => {
    //   if (data) {
    // this.router.navigate([this.partnerParentId, 'partner', 'loans']);
    //   };
    // })

    this.partnerService.getLoanById(this.loanId).subscribe((data: any) => {
      if (data && data.spInternalStatus) {
        if (data.spInternalStatus == 'ConsumerAccepted') {
          this.router.navigate([this.partnerParentId, 'partner', 'loans']);
        }
      };
    })
  }


  getLoanSchemes() {
    this.partnerService.getLoanSchemes().subscribe((data) => {
      this.loanSchemes = data;
      console.log("this.loanSchemes", this.loanSchemes)
    })
  }


  gotoNext() {
    this.partnerService.changeScheme(this.loanId, this.schemeSelected.id).subscribe((data: any) => {
      if (data) {
        if (this.timetype == 1) {
          this.timetype = 2
        }
      }
    })
  }

  verifyAccount() {
    let can_remove = false;
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: 'Account Number'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result = "verified") {
          this.accountverification = true;
        }
      }
      else {
        console.log("Data Not Saved")
      }
    });
    return can_remove;
  }

}
