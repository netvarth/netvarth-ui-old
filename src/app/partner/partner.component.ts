import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { AuthService } from '../shared/services/auth-service';
import { GroupStorageService } from '../shared/services/group-storage.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { ViewFileComponent } from './loans/loan-details/view-file/view-file.component';
import { PartnerService } from './partner.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {

  user: any;
  loans: any = 0;
  leads: any;
  accountId: any;
  viewmore: any = false;
  currentstatus: any = "all";
  status = "all";
  seacrchFilterOrder: any;
  statusList = ['all', 'approved', 'redirected', 'rejected'];
  viewmoreleads: any;
  partnerParentId: any;
  partnerId: any;
  desktopView: any;
  mobileView: any;
  deviceInfo: any;
  statusLoansList: any;
  approvedLoansCount: any = 0;
  pendingLoansCount: any = 0;
  rejectedLoansCount: any = 0;
  allLoansCount: any = 0;
  customId: any;
  customOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    navSpeed: 200,
    dots: false,
    center: true,
    checkVisible: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      700: {
        items: 1
      },
      970: {
        items: 1
      }
    }
  }

  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private dialog: MatDialog,
    public sharedFunctionobj: SharedFunctions,
    private authService: AuthService,
    private lStorageService: LocalStorageService,
    private partnerservice: PartnerService,
    private deviceService: DeviceDetectorService


  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
    this.customId = this.partnerParentId;
    this.partnerId = this.lStorageService.getitemfromLocalStorage('partnerId');

    console.log("User is", this.user);
    this.partnerservice.getLoans().subscribe((data: any) => {
      this.statusLoansList = data
      this.allLoansCount = data.length
      this.loans = this.statusLoansList.slice(0, 10);
    });

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.mobileView = this.deviceService.isMobile() || this.deviceService.isTablet();
    this.desktopView = this.deviceService.isDesktop();


    this.getApprovedloansCount();
    this.getPendingloansCount();
    this.getRejectedloansCount();

  }


  getApprovedloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Approved';
    this.partnerservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.approvedLoansCount = data.length
      }
    });
  }

  getPendingloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'ApprovalPending';
    this.partnerservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.pendingLoansCount = data.length
      }
    });
  }

  customers() {
    this.router.navigate([this.partnerParentId, 'partner', 'customers']);
  }
  getRejectedloansCount() {
    const api_filter = {};
    api_filter['applicationStatus-eq'] = 'Rejected';
    this.partnerservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.rejectedLoansCount = data.length
      }
    });
  }

  viewMore() {
    this.router.navigate([this.partnerParentId, 'partner', 'loans']);
  }

  getProfile() {
    this.sharedFunctionobj.getProfile()
      .then(
        (data: any) => {
          console.log(data)
        },
      );
  }

  doLogout() {
    this.authService.logoutFromJaldee().then();
  }

  showMenu() {

  }


  loanDetails(data) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'loanDetails',
        status: data.status,
        customerName: data.customerName
      }
    };
    this.router.navigate([this.partnerParentId, 'partner', 'loans', 'loanDetails'], navigationExtras);
  }


  CreateLoan() {
    this.router.navigate([this.partnerParentId, 'partner', 'loans', 'create']);
  }

  allLoans() {
    this.router.navigate([this.partnerParentId, 'partner', 'loans']);
  }

  // approvedLoans() {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       type: 'approved'
  //     }
  //   };
  //   this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  // }
  // redirectedLoans() {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       type: 'redirected'
  //     }
  //   };
  //   this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  // }

  // rejectedLoans() {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       type: 'rejected'
  //     }
  //   };
  //   this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  // }

  transform(event) {
    if (event.target.value != 'all') {
      this.loans = this.statusLoansList.filter(i => i.status == event.target.value);
    }
    else {
      this.loans = this.statusLoansList.slice(0, 4);
    }
  }
  searchText(event) {
    console.log("event.target.value", event.target.value)
    if (event.target.value != '') {
      this.loans = this.statusLoansList.filter(x => x.customer.firstName.toLowerCase().includes(event.target.value.toLowerCase()));
    }
    else {
      this.loans = this.statusLoansList.slice(0, 4);
    }
  }


  viewFile(file) {
    const dialogRef = this.dialog.open(ViewFileComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        type: file
      }
    });
    dialogRef.afterClosed();
  }

  allSchemes() {
    this.router.navigate([this.partnerParentId, 'partner', 'schemes']);
  }



}
