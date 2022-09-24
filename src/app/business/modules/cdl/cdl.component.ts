import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';
@Component({
  selector: 'app-cdl',
  templateUrl: './cdl.component.html',
  styleUrls: ['./cdl.component.css']
})
export class CdlComponent implements OnInit {
  user: any;
  loans: any;
  leads: any;
  viewmore: any = false;
  currentstatus: any = "all";
  status = "all";
  statusList = ['all', 'approved', 'redirected', 'rejected'];
  viewmoreleads: any;
  statusLoansList: any = [
    {
      'loanId': 101,
      'customerName': 'David',
      'amount': '40000',
      'status': 'approved'
    },
    {
      'loanId': 102,
      'customerName': 'Aswin',
      'amount': '50000',
      'status': 'approved'
    },
    {
      'loanId': 103,
      'customerName': 'Atul',
      'amount': '35000',
      'status': 'approved'
    },
    {
      'loanId': 104,
      'customerName': 'Davika',
      'amount': '75000',
      'status': 'approved'
    },
    {
      'loanId': 105,
      'customerName': 'Babu',
      'amount': '65000',
      'status': 'redirected'
    },
    {
      'loanId': 106,
      'customerName': 'Atul',
      'amount': '674000',
      'status': 'rejected'
    },
    {
      'loanId': 107,
      'customerName': 'Davika',
      'amount': '100000',
      'status': 'rejected'
    },
  ];
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
    // private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);

    // this.cdlservice.getJSON().subscribe(data => {
    //   console.log("data printed", data);
    // });
    this.loans = this.statusLoansList.slice(0, 3);
    this.leads = this.statusLeadsList.slice(0, 3);
  }

  viewMore() {
    this.loans = this.statusLoansList;
    this.viewmore = true;
  }

  viewLess() {
    this.loans = this.statusLoansList.slice(0, 3);
    this.viewmore = false;
  }

  viewMoreLeads() {
    this.leads = this.statusLeadsList;
    this.viewmoreleads = true;
  }

  continueApplication() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  viewLessLeads() {
    this.leads = this.statusLeadsList.slice(0, 3);
    this.viewmoreleads = false;
  }

  loanDetails(data) {
    console.log(data);
    const status = data['status'];
    const customerName = data['CustomerName']
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'loanDetails',
        status: status,
        customerName: customerName
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


}

