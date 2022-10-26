import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';
import { CdlService } from './cdl.service';
import { ViewFileComponent } from './loans/loan-details/view-file/view-file.component';
@Component({
  selector: 'app-cdl',
  templateUrl: './cdl.component.html',
  styleUrls: ['./cdl.component.css']
})
export class CdlComponent implements OnInit {
  user: any;
  loans: any = 0;
  viewmore: any = false;
  currentstatus: any = "all";
  status = "all";
  seacrchFilterOrder: any;
  statusList = ['all', 'approved', 'redirected', 'rejected'];
  statusLoansList: any;
  dealers: any;
  customersList: any;
  customers: any;
  statusdealersList: any;
  customOptions = {
    loop: true,
    margin: 10,
    autoHeight: true,
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
    private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);

    this.cdlservice.getLoans().subscribe(data => {
      this.statusLoansList = data
      this.loans = this.statusLoansList.slice(0, 4);
    });

    this.cdlservice.getDealers().subscribe(data => {
      this.statusdealersList = data
      this.dealers = this.statusdealersList.slice(0, 4);
    });

    this.cdlservice.getCustomers().subscribe(data => {
      this.customersList = data
      this.customers = this.customersList.slice(0, 10);
    });
  }

  viewMore() {
    this.loans = this.statusLoansList;
    this.viewmore = true;
  }

  viewLess() {
    this.loans = this.statusLoansList.slice(0, 4);
    this.viewmore = false;
  }

  reports() {
    this.router.navigate(['provider', 'cdl', 'reports']);
  }



  continueApplication() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }


  loanDetails(data) {
    this.router.navigate(['provider', 'cdl', 'loans', data]);
  }

  viewMoreLoans() {
    this.router.navigate(['provider', 'cdl', 'loans']);
  }


  viewMoreDealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }


  CreateLoan() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  createDealer() {
    this.router.navigate(['provider', 'cdl', 'dealers', 'create']);
  }
  allLoans() {
    this.router.navigate(['provider', 'cdl', 'loans']);
  }
  alldealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }
  allDealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }
  createLead() {
    this.router.navigate(['provider', 'cdl', 'dealers', 'create']);
  }

  requestedDealers() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'requested'
      }
    };
    this.router.navigate(['provider', 'cdl', 'dealers'], navigationExtras);
  }
  approvedLoans() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'approved'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }
  redirectedLoans() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'redirected'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }

  rejectedLoans() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'rejected'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }


  pendingLoans() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'ApprovalPending'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }

  allLeads() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'Draft'
      }
    };
    this.router.navigate(['provider', 'cdl', 'dealers'], navigationExtras);
  }

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
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: "schemeslist"
      }
    }
    this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
  }


  showDealer(dealer) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: dealer
      }
    }
    this.router.navigate(['provider', 'cdl', 'dealers', 'approve'], navigationExtras);
  }


}

