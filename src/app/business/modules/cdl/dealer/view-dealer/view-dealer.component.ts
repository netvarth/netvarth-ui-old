import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdlService } from '../../cdl.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
@Component({
  selector: 'app-view-dealer',
  templateUrl: './view-dealer.component.html',
  styleUrls: ['./view-dealer.component.css']
})
export class ViewDealerComponent implements OnInit {
  dealerUid: any;
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
  dealerId: any;
  lineChartOptions: any;
  lineChartData: any;
  pieChartOptions: any;
  pieChartData: any;
  creditLimit: any = 5000;
  salesOfficersList: any;
  creditOfficersList: any;
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
        this.dealerUid = qparams.id;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');

    this.cdlservice.getDealerById(this.dealerUid).subscribe((data: any) => {
      this.dealerData = data
      if (this.dealerData && this.dealerData.id) {
        this.dealerId = this.dealerData.id;
        this.getPartnerLoans();
        this.getPartnerApprovedLoans();
        this.getPartnerRejectedLoans();
        this.getPartnerRejectedLoans();
        this.getPartnerLeads();
        this.getBarChartData();
      }
      if (data && this.dealerData.active) {
        this.status = this.dealerData.active;
      }
      console.log("this.dealerData", this.dealerData)
    });

    this.cdlservice.getDealerUsers(this.dealerUid).subscribe(data => {
      this.users = data
      console.log("this.users", this.users)
    });

    this.cdlservice.getCustomers().subscribe(data => {
      this.customersList = data
      this.customers = this.customersList.slice(0, 10);
    });

    this.getStaffList('Sales Officer');
    this.getStaffList('Branch Credit Head');
  }


  getBarChartData() {
    let data = {
      "category": "WEEKLY",
      "type": "BARCHART",
      "filter": {
        "generatedBy-eq": this.user.id,
        "partner-eq": this.dealerData.id,
      }
    }

    this.cdlservice.getGraphAnalyticsData(data).subscribe((data: any) => {
      if (data) {
        if (data.labels) {
          this.lineChartData = {
            labels: data.labels,
            datasets: [
              {
                label: 'Loans Analytics',
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

  getStaffList(role) {
    const api_filter = {};
    api_filter['userRoles-eq'] = "roleName::" + role;
    this.cdlservice.getStaffList(api_filter).subscribe((data: any) => {
      if (role == 'Sales Officer') {
        this.salesOfficersList = data;
        console.log("this.salesOfficersList", this.salesOfficersList)
      }
      else {
        this.creditOfficersList = data;
        console.log("this.creditOfficersList", this.creditOfficersList)
      }
    })
    return null;
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
          data: [this.partnerLeadsCount, this.totalApprovedCount, this.ApprovedPendingloans, this.RejectedLoansCount],
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


  viewAllCustomers() {
    this.router.navigate(['provider', 'customers']);
  }

  getPartnerLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    console.log('Dealer Id', this.dealerId)
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.loans = data;
      this.totalLoansCount = data.length;
      this.getPieChartData();

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
      this.getPieChartData();

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
      this.getPieChartData();

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
      this.getPieChartData();

    })
  }
  getPartnerRejectedLoans() {
    const api_filter = {};
    api_filter['partner-eq'] = this.dealerId;
    api_filter['applicationStatus-eq'] = "Rejected";
    this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
      this.statusLoansList = data;
      this.RejectedLoans = data;
      this.RejectedLoansCount = data.length;
      console.log("Loans List : ", this.statusLoansList);
      this.getPieChartData();
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
    this.cdlservice.partnerAccountStatus(this.dealerUid, statusChange).subscribe((data: any) => {
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
    this.router.navigate(['provider', 'cdl', 'loans', data]);
  }
  dealerApproved() {
    this.router.navigate(['provider', 'cdl', 'dealers']);
  }
}
