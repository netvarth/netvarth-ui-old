import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { CdlService } from '../business/modules/cdl/cdl.service';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { AuthService } from '../shared/services/auth-service';
import { GroupStorageService } from '../shared/services/group-storage.service';
// import { LocalStorageService } from '../shared/services/local-storage.service';
import { ViewFileComponent } from './loans/loan-details/view-file/view-file.component';

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
  statusLoansList: any;
  customId: any;
  statusLeadsList: any = [
    {
      'loanId': 48235,
      'CustomerName': 'David',
      'phone': '5784589456',
      'email': 'david@gmail.com'
    },
    {
      'loanId': 48236,
      'CustomerName': 'Aswin',
      'phone': '6987453214',
      'email': 'aswin@gmail.com'
    },
    {
      'loanId': 48237,
      'CustomerName': 'Atul',
      'phone': '8645784586',
      'email': 'atul@gmail.com'
    },
    {
      'loanId': 48238,
      'CustomerName': 'Davika',
      'phone': '9854762587',
      'email': 'davika@gmail.com'
    }
  ];
  dealersList = [
    {
      'dealerId': 101,
      'dealer': 'david',
      'status': 'active',
      'issuedDate': '19/08/2022'
    },
    {
      'dealerId': 102,
      'dealer': 'aswin',
      'status': 'inactive',
      'issuedDate': '19/08/2022'
    },
    {
      'dealerId': 103,
      'dealer': 'mani',
      'status': 'active',
      'issuedDate': '19/08/2022'
    },
    {
      'dealerId': 104,
      'dealer': 'krishna',
      'status': 'requested',
      'issuedDate': '19/08/2022'
    },
  ];
  customOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    navSpeed: 200,
    dots: true,
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
    // private lStorageService: LocalStorageService,
    private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
    this.accountId = '125479';
    this.customId = 'mafil';

    this.cdlservice.getLoans().subscribe(data => {
      this.statusLoansList = data
      this.loans = this.statusLoansList.slice(0, 4);
    });

    this.cdlservice.getDealers().subscribe(data => {
      this.statusLeadsList = data
      this.leads = this.statusLeadsList.slice(0, 4);
    });
  }

  viewMore() {
    this.loans = this.statusLoansList;
    this.viewmore = true;
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

  viewLess() {
    this.loans = this.statusLoansList.slice(0, 4);
    this.viewmore = false;
  }
  showMenu() {

  }
  reports() {
    this.router.navigate(['provider', 'cdl', 'reports']);
  }

  viewMoreLeads() {
    this.leads = this.statusLeadsList;
    this.viewmoreleads = true;
  }



  continueApplication() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  viewLessLeads() {
    this.leads = this.statusLeadsList.slice(0, 4);
    this.viewmoreleads = false;
  }

  loanDetails(data) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'loanDetails',
        status: data.status,
        customerName: data.customerName
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'loanDetails'], navigationExtras);
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
  allLeads() {
    this.router.navigate(['provider', 'cdl', 'leads']);
  }
  allDealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }
  createLead() {
    this.router.navigate(['provider', 'cdl', 'leads', 'create']);
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
        dealer: dealer.dealer,
        status: dealer.status
      }
    }
    this.router.navigate(['provider', 'cdl', 'dealers', 'view'], navigationExtras);
  }



}
