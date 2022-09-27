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
  seacrchFilterOrder: any;
  statusList = ['all', 'approved', 'redirected', 'rejected'];
  viewmoreleads: any;
  statusLoansList: any = [
    {
      'loanId': 101,
      'customerName': 'David',
      'amount': '40000',
      'status': 'redirected',
      'date': '28/09/2022'
    },
    {
      'loanId': 102,
      'customerName': 'Aswin',
      'amount': '50000',
      'status': 'redirected',
      'date': '27/09/2022'
    },
    {
      'loanId': 109,
      'customerName': 'Adarsh',
      'amount': '40000',
      'status': 'redirected',
      'date': '27/09/2022'
    },
    {
      'loanId': 103,
      'customerName': 'Atul',
      'amount': '35000',
      'status': 'in progress',
      'date': '26/09/2022'
    },
    {
      'loanId': 111,
      'customerName': 'Krishna',
      'amount': '35000',
      'status': 'in progress',
      'date': '24/09/2022'
    },
    {
      'loanId': 124,
      'customerName': 'Sravan',
      'amount': '35000',
      'status': 'in progress',
      'date': '26/09/2022'
    },
    {
      'loanId': 131,
      'customerName': 'Davika',
      'amount': '75000',
      'status': 'approved',
      'date': '25/09/2022'
    },
    {
      'loanId': 105,
      'customerName': 'Babu',
      'amount': '65000',
      'status': 'approved',
      'date': '24/09/2022'
    },
    {
      'loanId': 121,
      'customerName': 'Adarsh',
      'amount': '65000',
      'status': 'approved',
      'date': '24/09/2022'
    },
    {
      'loanId': 106,
      'customerName': 'Atul',
      'amount': '674000',
      'status': 'rejected',
      'date': '23/09/2022'
    },
    {
      'loanId': 107,
      'customerName': 'Davika',
      'amount': '100000',
      'status': 'rejected',
      'date': '22/09/2022'
    },
    {
      'loanId': 127,
      'customerName': 'Narendra',
      'amount': '100000',
      'status': 'rejected',
      'date': '22/09/2022'
    }
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
    // private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);

    // this.cdlservice.getJSON().subscribe(data => {
    //   console.log("data printed", data);
    // });
    this.loans = this.statusLoansList.slice(0, 4);
    this.leads = this.statusLeadsList.slice(0, 4);
  }

  viewMore() {
    this.loans = this.statusLoansList;
    this.viewmore = true;
  }

  viewLess() {
    this.loans = this.statusLoansList.slice(0, 4);
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
      this.loans = this.statusLoansList.filter(x => x.customerName.toLowerCase().includes(event.target.value.toLowerCase()));
    }
    else {
      this.loans = this.statusLoansList.slice(0, 4);
    }
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

