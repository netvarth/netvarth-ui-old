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
  userAvailableStatus = [
    { name: 'Online', displayName: 'Online' },
    { name: 'Away', displayName: 'Away' },
    { name: 'NotAvailable', displayName: 'Not Available' }
  ];
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
  branchSelected: any;
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
      "url": "./assets/images/cdl/Slide_1.png"
    },
    {
      "url": "./assets/images/cdl/Slide_2.png"
    },
    {
      "url": "./assets/images/cdl/Slide_3.png"
    },
    {
      "url": "./assets/images/cdl/Slide_4.png"
    },
    {
      "url": "./assets/images/cdl/Slide_5.png"
    }
  ]

  statsImages = [
    {
      "url": "./assets/images/cdl/lead_generated.png"
    },
    {
      "url": "./assets/images/cdl/application.png"
    },
    {
      "url": "./assets/images/cdl/loan_converted.png"
    },
    {
      "url": "./assets/images/cdl/rejected.png"
    }
  ]

  approvedDealers: any;
  dealersRequested: any;
  roleId: any;
  capabilities: any;
  dashboardStats: any;
  users: any;
  branches: any;
  dealersRejected: any;


  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private dialog: MatDialog,
    private cdlservice: CdlService

  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
      console.log("Capabilities", this.capabilities);
    }
    this.getApprovedloansCount();
    this.getPendingloansCount();
    this.getRejectedloansCount();
    this.getLeadsCount();
    this.getLoans();
    this.getDealers();
    this.getCustomers();
    this.getApprovedDealers();
    this.getRequestedDealers();
    this.getRejectedDealers();
    this.getBarChartData();
    this.getUsers();
    this.getDashboardStats();
    if (this.user && this.user.roles && this.user.roles[0] && this.user.roles[0].roleId && this.user.roles[0].roleId == 1 || this.user.roles[0].roleId == 2) {
      this.getBranchesByFilter();
    }
  }


  getDashboardStats() {
    this.cdlservice.getDashboardStats().subscribe((data: any) => {
      this.dashboardStats = data;
    });
  }

  getBarChartData() {
    let data = {
      "category": "WEEKLY",
      "type": "BARCHART",
      "filter": {
        "generatedBy-eq": this.user.id
      }
    }

    this.cdlservice.getGraphAnalyticsData(data).subscribe((data: any) => {
      if (data) {
        if (data.labels) {
          this.lineChartData = {
            labels: data.labels,
            datasets: [
              {
                label: 'Loans Count',
                data: data.datasets[0].data,
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
                  precision: 0,
                  color: '#1E4079'
                },
                grid: {
                  color: '#ebedef'
                }
              }
            },
          };
        }
      }
    });
  }



  getDealers() {
    let api_filter = {};
    api_filter['spInternalStatus-neq'] = 'Draft';
    this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
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


  getRejectedDealers() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Rejected';
    this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
      this.dealersRejected = data;
      this.rejectedDealersCount = data.length;
    });
  }

  getCustomers() {
    this.cdlservice.getCustomers().subscribe((data: any) => {
      this.customers = data;
    });
  }


  getUsers() {
    // let params = 'sort_userAvailable=asc';
    this.cdlservice.getUsersByOrder().subscribe((data: any) => {
      this.users = data;
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


  reports() {
    this.router.navigate(['provider', 'cdl', 'reports']);
  }

  viewAllCustomers() {
    this.router.navigate(['provider', 'customers']);
  }

  viewAllUsers() {
    this.router.navigate(['provider', 'settings', 'general', 'users']);
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
    let api_filter = {}
    if (event.value.name == 'All') {
      api_filter['branch-eq'] = this.branchSelected.id;
      this.getLoansByFilter(api_filter);
    }
    else {
      if (event.value.name == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value.name;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value.name;
        api_filter['applicationStatus-neq'] = 'Rejected';
      }
      if (this.branchSelected && this.branchSelected.id) {
        api_filter['branch-eq'] = this.branchSelected.id;
      }
      this.getLoansByFilter(api_filter);
    }
  }


  // userAvailableStatusChange(event) {
  //   let api_filter = {}
  //   api_filter['userAvailable-eq'] = event.value.name;
  //   this.getUsersByFilter(api_filter);
  // }


  branchChange(event) {
    console.log(this.statusDisplayName)
    let api_filter = {}
    api_filter['branch-eq'] = this.branchSelected.id;
    if (this.statusDisplayName && this.statusDisplayName.name) {
      if (this.statusDisplayName.name == 'All') {
        this.getLoansByFilter(api_filter);
      }
      else {
        if (this.statusDisplayName.name == 'Rejected') {
          api_filter['applicationStatus-eq'] = this.statusDisplayName.name;
        }
        else {
          api_filter['spInternalStatus-eq'] = this.statusDisplayName.name;
        }
      }
    }
    this.getLoansByFilter(api_filter);
  }

  getLoans() {
    let api_filter = {};
    api_filter['spInternalStatus-neq'] = 'Draft';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data
      this.allLoansCount = data.length
      this.loans = data;
      this.getBarChartData();
    });
  }

  getBranchesByFilter(api_filter = {}) {
    this.cdlservice.getBranchesByFilter(api_filter).subscribe((data: any) => {
      this.branches = data
      if (this.branches && this.branches.length > 0) {
        this.branchSelected = this.branches[0]
      }
    });
  }


  getLoansByFilter(api_filter) {
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data) {
        this.loans = data;
        this.getBarChartData();
      }
    });
  }

  // getUsersByFilter(api_filter) {
  //   this.cdlservice.getUsersByFilter(api_filter).subscribe((data: any) => {
  //     if (data) {
  //       this.users = data;
  //     }
  //   });
  // }

  loanDetails(id, status) {
    if (status == 'ConsumerAccepted') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'consumerAccepted',
          uid: id
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
    }
    else if (status == 'CreditApproved') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'creditApproved',
          uid: id
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
    }
    else {
      this.router.navigate(['provider', 'cdl', 'loans', id]);
    }
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
    this.router.navigate(['provider', 'cdl', 'leads', 'create']);
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
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     spInternalStatus: 'Draft'
    //   }
    // };
    this.router.navigate(['provider', 'cdl', 'leads']);
  }


  getApprovedloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'Approved';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.approvedLoansCount = data.length
        this.getBarChartData();
        this.getPieChartData();
      }
    });
  }

  getPendingloansCount() {
    const api_filter = {};
    api_filter['spInternalStatus-eq'] = 'ApprovalRequired';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.pendingLoansCount = data.length
        this.getBarChartData();
        this.getPieChartData();

      }
    });
  }

  getRejectedloansCount() {
    const api_filter = {};
    api_filter['applicationStatus-eq'] = 'Rejected';
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.rejectedLoansCount = data.length
        this.getBarChartData();
        this.getPieChartData();

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


  // updateDealer(id, action, status?) {
  // if (status == 'ApprovalPending') {
  //   this.showDealer(id, status)
  // }
  // else if (status == 'Approved') {
  // this.router.navigate(['provider', 'cdl', 'dealers', id]);
  // }
  // else {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       id: id,
  //       action: action
  //     }
  //   };
  //   this.router.navigate(['provider', 'cdl', 'dealers', 'update'], navigationExtras);
  // }

  // }


  updateDealer(id, action, status?) {
    if (action == 'update' && !status) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
          action: action
        }
      };
      this.router.navigate(['provider', 'cdl', 'dealers', 'update'], navigationExtras);
    }
    else if (status == 'ApprovalPending') {
      this.showDealer(id, status)
    }
    else if (status == 'Approved' || status == 'Suspended') {
      this.router.navigate(['provider', 'cdl', 'dealers', 'view', id]);
    }
    else {
      this.showDealer(id, status)
    }
  }

  showDealer(dealerId, spInternalStatus) {

    if (spInternalStatus == 'Approved') {
      this.router.navigate(['provider', 'cdl', 'dealers', 'view', dealerId]);
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: dealerId
        }
      };
      this.router.navigate(['provider', 'cdl', 'dealers', 'approve'], navigationExtras);
    }

  }





}

