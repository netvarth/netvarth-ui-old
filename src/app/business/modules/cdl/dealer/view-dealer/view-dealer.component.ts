import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
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
  totalLoansCount: any = 0;
  loans: any;
  customersList: any;
  customers: any;
  statusLoansList: any;
  Approvedloans: any;
  totalApprovedCount: any = 0;
  ApprovedPendingloans: any;
  totalApprovedPendingCount: any = 0;
  RejectedLoans: any;
  RejectedLoansCount: any = 0;
  partnerLeadsCount: any = 0;
  partnerLeads: any;
  user: any;
  constructor(
    private location: Location,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private cdlservice: CdlService,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService
  ) {
    this.activatedroute.params.subscribe(qparams => {
      if (qparams && qparams.id) {
        this.dealerId = qparams.id;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');

    this.cdlservice.getDealerById(this.dealerId).subscribe(data => {
      this.dealerData = data
      if (data && this.dealerData.active) {
        this.status = this.dealerData.active;
      }
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
    this.getPartnerApprovedLoans();
    this.getPartnerRejectedLoans();
    this.getPartnerRejectedLoans();
    this.getPartnerLeads();
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
      this.totalLoansCount = data.length;
    })
  }

  getPartnerApprovedLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    api_filter['spInternalStatus-eq'] = "Approved";
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.Approvedloans = data;
      this.totalApprovedCount = data.length;
    })
  }

  getPartnerPendingLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    api_filter['spInternalStatus-eq'] = "ApprovalPending";
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.ApprovedPendingloans = data;
      this.totalApprovedPendingCount = data.length;
    })
  }


  getPartnerLeads() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    api_filter['spInternalStatus-eq'] = "Draft";
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.partnerLeads = data;
      this.partnerLeadsCount = data.length;
    })
  }
  getPartnerRejectedLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    api_filter['applicatrionStatus-eq'] = "Rejected";
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.RejectedLoans = data;
      this.RejectedLoansCount = data.length;
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
      if (data) {
        this.status = (event.checked) ? true : false;
        let statusDisplayName = this.status ? 'Active' : 'Inactive';
        this.snackbarService.openSnackBar("Dealer is " + statusDisplayName)
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
