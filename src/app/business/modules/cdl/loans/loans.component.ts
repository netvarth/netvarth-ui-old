import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  user: any;
  statusLoansList: any = [
    {
      'loanId': 101,
      'CustomerName': 'David',
      'Dealer': 'Venus',
      'status': 'approved'
    },
    {
      'loanId': 102,
      'CustomerName': 'Aswin',
      'Dealer': 'Magnus',
      'status': 'approved'
    },
    {
      'loanId': 103,
      'CustomerName': 'Atul',
      'Dealer': 'Asian Choice',
      'status': 'approved'
    },
    {
      'loanId': 104,
      'CustomerName': 'Davika',
      'Dealer': 'T Mobiles',
      'status': 'approved'
    },
    {
      'loanId': 105,
      'CustomerName': 'Babu',
      'Dealer': 'T Mobiles',
      'status': 'redirected'
    },
    {
      'loanId': 106,
      'CustomerName': 'Atul',
      'Dealer': 'Asian Choice',
      'status': 'rejected'
    },
    {
      'loanId': 107,
      'CustomerName': 'Davika',
      'Dealer': 'T Mobiles',
      'status': 'rejected'
    },
  ]
  headerName: string = ''
  loans: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    // console.log("User is", this.user);
    // console.log(this.router);
    this.activated_route.queryParams.subscribe((params) => {
      // console.log(params);
      if (params) {
        if (params && (params.type === 'approved')) {
          this.headerName = "Approved Loans";
        }
        else if (params && (params.type === 'redirected')) {
          this.headerName = "Redirected Loans";
        }
        else if (params && (params.type === 'rejected')) {
          this.headerName = "Rejected Loans";
        }
        else {
          this.headerName = "All Loans";
        }

      }

      else {
        this.headerName = params.type;
        return this.headerName;
      }


      if (params.type && params.type != 'all') {
        this.loans = this.statusLoansList.filter(i => i.status == params.type)
        console.log("Loans List : ", this.loans);
      }
      else {
        this.loans = this.statusLoansList;
      }

    });

  }
  goBack() {
    this.location.back();
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

}
