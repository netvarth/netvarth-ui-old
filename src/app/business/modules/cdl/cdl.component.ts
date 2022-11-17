import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
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
  loanStatus = projectConstantsLocal.LOAN_STATUS;
  allLoansCount: any;
  dealers: any;
  customersList: any;
  customers: any;
  statusdealersList: any;
  statusDisplayName: any;
  approvedLoansCount: any = 0;
  pendingLoansCount: any = 0;
  rejectedLoansCount: any = 0;
  lineChartData: any;
  lineChartOptions: any;
  pieChartData: any;
  pieChartOptions: any;
  leadsCount: any = 0;
  allDealersCount: any = 0;
  approvedDealersCount: any = 0;
  requestedDealersCount: any = 0;
  rejectedDealersCount: any = 0;
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

  carousalImages = [
    {
      "url": "./assets/images/cdl/carousal-1.jpg"
    },
    {
      "url": "./assets/images/cdl/carousal-2.png"
    },
    {
      "url": "./assets/images/cdl/carousal-3.png"
    }
  ]
  approvedDealers: any;
  dealersRequested: any;


  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private dialog: MatDialog,
    private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);

    this.getApprovedloansCount();
    this.getPendingloansCount();
    this.getRejectedloansCount();
    this.getLinearChartData();
    this.getLeadsCount();
    this.getLoans();
    this.getDealers();
    this.getCustomers();
    this.getApprovedDealers();
    this.getRequestedDealers();
  }

  getDealers() {
    this.cdlservice.getDealers().subscribe((data: any) => {
      this.dealers = data;
      this.allDealersCount = data.length;
    });
  }

  getDealersByFilter(api_filter) {
    this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
      this.dealers = data;
      this.allDealersCount = data.length;
    });
  }

  getApprovedDealers() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Approved';
    this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
      this.approvedDealers = data;
      this.approvedDealersCount = data.length;
    });
  }


  getRequestedDealers() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'ApprovalPending';
    this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
      this.dealersRequested = data;
      this.requestedDealersCount = data.length;
    });
  }

  getCustomers() {
    this.cdlservice.getCustomers().subscribe((data: any) => {
      this.customers = data;
    });
  }


  getPieChartData() {
    this.pieChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079'
          }
        }
      }
    };


    this.pieChartData = {
      labels: ['Leads', 'Approved', 'Pending', 'Rejected'],
      datasets: [
        {
          data: [this.leadsCount, this.approvedLoansCount, this.pendingLoansCount, this.rejectedLoansCount],
          backgroundColor: [
            "orange",
            "#3CB698",
            "#FF9567",
            "#F96565"
          ],
          hoverBackgroundColor: [
            "#64B5F6",
            "#64B5F6",
            "#64B5F6",
            "#64B5F6"
          ]
        }
      ]
    };
  }


  getLinearChartData() {
    this.lineChartData = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [
        {
          label: 'Loans Analytics',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: 'rgba(202, 30, 30, 1)',
          tension: .4,
          backgroundColor: 'rgba(238, 108, 77, 0.2)'
        }
      ]
    }

    this.lineChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
    };
  }

  reports() {
    this.router.navigate(['provider', 'cdl', 'reports']);
  }

  viewAllCustomers() {
    this.router.navigate(['provider', 'customers']);
  }

  continueApplication() {
    this.router.navigate(['provider', 'cdl', 'loans', 'create']);
  }

  openEmiCalci() {
    this.router.navigate(['provider', 'cdl', 'emicalci']);
  }

  getLeadsCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Draft';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.leadsCount = data.length
        this.getPieChartData();
      }
    });
  }


  showLeads() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        spInternalStatus: 'Draft'
      }
    };
    this.router.navigate(['cdl', 'provider', 'loans'], navigationExtras);
  }


  statusChange(event) {
    if (event.value.name == 'All') {
      this.getLoans();
    }
    else {
      let api_filter = {}
      if (event.value.name == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value.name;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value.name;
      }
      this.getLoansByFilter(api_filter);
    }
  }

  getLoans() {
    this.cdlservice.getLoans().subscribe((data: any) => {
      this.statusLoansList = data
      this.allLoansCount = data.length
      this.loans = data;
    });
  }


  getLoansByFilter(api_filter) {
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.loans = data;
      }
    });
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
        spInternalStatus: 'ApprovalPending'
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
        spInternalStatus: 'Draft'
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans'], navigationExtras);
  }


  getApprovedloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Approved';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.approvedLoansCount = data.length
      }
    });
  }

  getPendingloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'ApprovalPending';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.pendingLoansCount = data.length
      }
    });
  }

  getRejectedloansCount() {
    const api_filter = {};
    api_filter['applicationStatus-eq'] = 'Rejected';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.rejectedLoansCount = data.length
      }
    });
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
    this.router.navigate(['provider', 'cdl', 'schemes']);
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

