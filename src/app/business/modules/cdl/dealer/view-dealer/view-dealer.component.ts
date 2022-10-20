import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CdlService } from '../../cdl.service';
@Component({
  selector: 'app-view-dealer',
  templateUrl: './view-dealer.component.html',
  styleUrls: ['./view-dealer.component.css']
})
export class ViewDealerComponent implements OnInit {
  dealerId: any;
  status: any;
  dealerData: any;
  active: any = "inactive";
  users: any;
  statusLoansList: any = [
    {
      'loanId': 101,
      'customerName': 'David',
      'amount': '40000',
      'status': 'approved',
      'updated': '28/09/2022'
    },
    {
      'loanId': 105,
      'customerName': 'Babu',
      'amount': '65000',
      'status': 'redirected',
      'updated': '28/09/2022'
    },
    {
      'loanId': 107,
      'customerName': 'Davika',
      'amount': '100000',
      'status': 'rejected',
      'updated': '28/09/2022'
    },
  ];
  constructor(
    private location: Location,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private cdlservice: CdlService
  ) {
    this.activatedroute.params.subscribe(qparams => {
      if (qparams && qparams.id) {
        this.dealerId = qparams.id;
      }
    });
  }

  ngOnInit(): void {

    this.cdlservice.getDealerById(this.dealerId).subscribe(data => {
      this.dealerData = data
      console.log("this.dealerData", this.dealerData)
    });

    this.cdlservice.getDealerUsers(this.dealerId).subscribe(data => {
      this.users = data
    });
  }

  goBack() {
    this.location.back();
  }

  changeActive(event) {
    this.active = (event.checked) ? 'active' : 'inactive';
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
  dealerApproved() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }
}
