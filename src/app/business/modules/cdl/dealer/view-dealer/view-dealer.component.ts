import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
@Component({
  selector: 'app-view-dealer',
  templateUrl: './view-dealer.component.html',
  styleUrls: ['./view-dealer.component.css']
})
export class ViewDealerComponent implements OnInit {
  dealerId: any;
  status: any = false;
  dealerData: any;
  active: any = "inactive";
  users: any;
  loans: any;
  customersList: any;
  customers: any;
  statusLoansList: any;
  constructor(
    private location: Location,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private cdlservice: CdlService,
    private snackbarService: SnackbarService
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
      console.log("this.users", this.users)
    });

    this.cdlservice.getCustomers().subscribe(data => {
      this.customersList = data
      this.customers = this.customersList.slice(0, 10);
    });

    this.getPartnerLoans();

  }


  viewAllCustomers() {
    this.router.navigate(['provider', 'customers']);
  }

  getPartnerLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.loans = data;
      console.log("Loans List : ", this.statusLoansList);
    })
  }

  goBack() {
    this.location.back();
  }

  goBacktoDealers() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }

  changeActive(event) {
    let statusChange = (event.checked) ? true : false;
    this.cdlservice.partnerAccountStatus(this.dealerId, statusChange).subscribe((data: any) => {
      if (data == true) {
        this.status = (event.checked) ? true : false;
        this.active = (event.checked) ? 'Active' : 'Inactive';
        this.snackbarService.openSnackBar("Dealer is " + this.active)
      }
    }, (error) => {
      this.status = false;
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
    })

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
