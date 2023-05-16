import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
// import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../cdl.service';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
// import { ColumnFilterFormElement } from 'primeng/table';



@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  user: any;
  headerName: string = 'Loans'
  loans: any;
  loansList: any;
  filter_sidebar: any;
  statusList: UntypedFormGroup;
  selectedLabels: any;
  filterapplied = false;
  statusDisplayName: any;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
  loanStatus = projectConstantsLocal.LOAN_STATUS;
  labelFilterData: any;
  filter = {
    firstName: '',
    id: '',
    lastName: '',
    date: ''
  };
  filters: any = {};
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any;
  config: any;
  spInternalStatus: any;
  totalLoansCount: any;
  statusDropdownClicked: any = false;
  loanGlobalSearchActive: any = false;
  globalSearchValue: any;
  cols: any[];
  _selectedColumns: any[];
  filterConfig: any;
  capabilities: any;
  branches: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private statusListFormBuilder: UntypedFormBuilder
  ) {
    this.statusList = this.statusListFormBuilder.group({
      status: [null]
    });

    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.spInternalStatus) {
        this.spInternalStatus = qparams.spInternalStatus;
      }
    });

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

    this.getBranchesByFilter().then((data) => {
      this.branches = data;
    });

    this.filterConfig = [
      { field: 'referenceNo', title: 'Loan Id', type: 'text', filterType: 'like' },
      { field: 'customerFirstName', title: 'Customer First Name', type: 'text', filterType: 'like' },
      { field: 'customerLastName', title: 'Customer Last Name', type: 'text', filterType: 'like' },
      { field: 'customerMobile', title: 'Customer Phone', type: 'text', filterType: 'like' },
      { field: 'partnerName', title: 'Dealer Name', type: 'text', filterType: 'like' },
      { field: 'createdDate', title: 'Created Date', type: 'date', filterType: 'eq' },
      { field: 'createdDate', title: 'Date From', type: 'date', filterType: 'ge' },
      { field: 'createdDate', title: 'Date To', type: 'date', filterType: 'le' }
      // { field: 'branch', title: 'Branch', type: 'dropdown', filterType: 'eq', options: this.branches, value: 'id', label: 'branchName' }
    ]



  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
    }
    // this.getLoans()


    this.cols = [
      // { field: 'referenceNo', title: 'Loan Id', value: '[referenceNo]', haveColumnFilter: true },
      { field: 'customerFirstName', title: 'Customer Name', value: '[customer.firstName,customer.lastName]', haveColumnFilter: true, type: 'text' },
      { field: 'partnerName', title: 'Dealer', value: '[partner.partnerName]', haveColumnFilter: true, type: 'text' },
      { field: 'createdDate', title: 'Created Date', value: '[createdDate]', haveColumnFilter: true, type: 'date' },
      { field: 'spInternalStatus', title: 'Status', value: '[spInternalStatusDisplyName]', haveColumnFilter: false, type: 'text' }
    ];

    this._selectedColumns = this.cols;

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }


  getBranchesByFilter(api_filter = {}) {
    return new Promise((resolve, reject) => {
      this.cdlservice.getBranchesByFilter(api_filter).subscribe((data: any) => {
        resolve(data);
      });
    })

  }

  showColumn(column) {
    if (this.selectedColumns) {
      for (let i = 0; i < this.selectedColumns.length; i++) {
        if (this.selectedColumns[i].field == column) {
          return true;
        }
      }
      return false
    }

    // return this.selectedColumns.filter(col => col.field == column) ? true : false;
    // console.log("selectedColumns", this.selectedColumns)
  }

  updateLoan(id, action, status) {
    if (status == 'Draft') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
          action: action
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
    }
    else if (status == 'PartnerAccepted') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'partnerAccepted',
          uid: id
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
    }
    else if (status == 'Sanctioned' || status == 'ApprovalRequired' || status == 'rejected' || (status == 'ApprovalPending' && this.user.userType == 2)) {
      this.loanDetails(id, status)
    }
    else if (status == 'ConsumerAccepted') {
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
    else if (status == 'ApprovalPending' && this.user.userType != 2) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'approved',
          uid: id
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'autoapproved',
          uid: id,
          timetype: 2
        }
      };
      this.router.navigate(['provider', 'cdl', 'loans', 'approved'], navigationExtras);
    }

  }

  applyFilters(event) {
    console.log("event", event)
    let api_filter = event;
    this.filters = api_filter;
    if (api_filter) {
      this.getTotalLoansCount(api_filter)
      this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
        this.loans = data;
      })
    }
  }

  loadLoans(event) {
    // this.getTotalLoansCount()
    let api_filter = this.cdlservice.setFiltersFromPrimeTable(event);
    if (this.filters && Object.keys(this.filters).length > 0) {
      api_filter = { ...this.filters, ...api_filter }
    }
    if (this.statusDropdownClicked) {
      if (this.statusDisplayName && this.statusDisplayName.name) {
        console.log("this.statusDisplayName.name", this.statusDisplayName.name)
        if (this.statusDisplayName.name != 'All' && this.statusDisplayName.name != 'rejected') {
          if (this.statusDisplayName.name == 'Rejected') {
            // api_filter['applicationStatus-eq'] = 'Rejected';
            api_filter['isRejected-eq'] = true;
          }
          else if (this.statusDisplayName.name == 'Redirected') {
            api_filter['isRejected-eq'] = false;
            api_filter['isActionRequired-eq'] = true;
          }
          else {
            api_filter['isRejected-eq'] = false;
            api_filter['spInternalStatus-eq'] = this.statusDisplayName.name;
          }
        }
      }
    }
    // if (this.loanGlobalSearchActive) {
    //   api_filter['referenceNo-like'] = this.statusDisplayName.name;
    // }
    if (api_filter) {
      this.getTotalLoansCount(api_filter)
      this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
        this.loans = data;
      })
    }
  }


  editLoan(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        action: "update",
        from: "edit"
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras)
  }

  statusChange(event) {
    this.statusDropdownClicked = true;
    let api_filter = {}
    if (event.value.name == 'All') {
      api_filter['from'] = 0;
      api_filter['count'] = 10;
    }
    else {
      if (event.value.name == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value.name;
      }
      else if (event.value.name == 'Redirected') {
        api_filter['isRejected-eq'] = false;
        api_filter['isActionRequired-eq'] = true;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value.name;
        api_filter['applicationStatus-neq'] = 'Rejected';
      }
    }
    this.getTotalLoansCount(api_filter);
    api_filter['from'] = 0;
    api_filter['count'] = 10;
    this.getLoansByFilter(api_filter);
  }

  getLoans() {
    if (this.spInternalStatus) {
      this.loading = true;
      const api_filter = {};
      api_filter['spInternalStatus-eq'] = this.spInternalStatus;
      this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
        this.loans = data;
        this.loading = false;
      });
    }
    else {
      this.loading = true;
      this.cdlservice.getLoans().subscribe((data) => {
        this.loansList = data;
        if (this.loansList) {
          this.activated_route.queryParams.subscribe((params) => {
            if (params) {
              if (params && (params.type === 'approved')) {
                this.headerName = "Scheme Confirmed Loans";
              }
              else if (params && (params.type === 'redirected')) {
                this.headerName = "Redirected Loans";
              }
              else if (params && (params.type === 'rejected')) {
                this.headerName = "Rejected Loans";
              }
              else if (params && (params.type === 'ApprovalPending')) {
                this.headerName = "Approval Pending Loans";
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
              const api_filter = {};
              if (params.type == 'rejected') {
                api_filter['applicationStatus-eq'] = 'Rejected';
              }
              else if (params.type == 'redirected') {
                api_filter['isRejected-eq'] = false;
                api_filter['isActionRequired-eq'] = true;
              }
              else {
                api_filter['spInternalStatus-eq'] = params.type;
              }
              this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
                this.loans = data;
                console.log("Loans List : ", this.loans);
                this.loading = false;
              })
            }
            else {
              this.loans = this.loansList;
              this.loading = false;
            }
          });
        }
        console.log("Loans List : ", this.loansList);
      })
    }
  }

  loanGlobalSearch(globalSearchValue) {
    if (globalSearchValue != '') {
      this.loanGlobalSearchActive = true;
      let api_filter = {}
      // api_filter['spInternalStatus-like'] = globalSearchValue;
      // form_data.search_input + ',firstName-eq=' + form_data.search_input;
      api_filter['or=referenceNo-like'] = globalSearchValue + ',customerFirstName-like=' + globalSearchValue + ',partnerName-like=' + globalSearchValue;
      // api_filter['or=customerFirstName-like'] = globalSearchValue;
      // api_filter['or=partnerName-like'] = globalSearchValue;
      this.getLoansByFilter(api_filter);
      this.getTotalLoansCount(api_filter);
    }
  }

  goBack() {
    this.router.navigate(['provider', 'cdl']);
    // this.location.back();
  }

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
    else if (status == 'CreditApproved' && this.capabilities.canCreateLoan) {
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

  getTotalLoansCount(filter?) {
    if (!filter) {
      filter = {}
    }
    this.cdlservice.getLoansCountByFilter(filter).subscribe((data: any) => {
      this.totalLoansCount = data;
    });
  }

  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }


  getLoansByFilter(filter) {
    this.loading = true;
    this.cdlservice.getLoansByFilter(filter).subscribe((data) => {
      this.loans = data;
      this.loading = false;
      console.log("this.loans", this.loans)
    })
  }

}
