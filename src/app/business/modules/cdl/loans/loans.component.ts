import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
// import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../cdl.service';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
// import { ColumnFilterFormElement } from 'primeng/table';



@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  user: any;
  headerName: string = ''
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
  filters: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any;
  config: any;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: 10
  };
  spInternalStatus: any;
  totalLoansCount: any;
  statusDropdownClicked: any = false;
  loanGlobalSearchActive: any = false;
  globalSearchValue: any;
  cols: any[];
  _selectedColumns: any[];
  capabilities: { canCreateLoan: any; canUpdateLoan: any; canViewLoan: any; canCreatePartner: any; canUpdatePartner: any; canViewPartner: any; canViewSchemes: any; canApprovePartnerLoan: any; canRejectLoan: any; canApprovePartner: any; canApproveLoan: any; canContactPartner: any; canActionRequired: any; canCreditScoreCheck: any; canAnalyseBankStatement: any; canGenerateMafilScore: any; canLoanDisbursement: any; canUpdateCreditOfficer: any; canUpdateSalesOfficer: any; canUpdatePartnerSettings: any; canMakePartnerInactive: any; canCreateLocation: any; canUpdateLocation: any; canCreateBranch: any; canUpdateBranch: any; canCreateUser: any; canUpdateUser: any; canSuspendPartner: any; canDisableUser: any; canDisablePartner: any; canEnablePartner: any; canVerification: any; canCreditVerification: any; canDocumentVerification: any; canInvoiceUpdation: any; canCreateLead: any; canUpdateLead: any; canViewLead: any; canTransformLeadtoLoan: any; canLoanApplicationOperationsVerification: any; canViewCustomerPhoneNumber: any; canViewKycReport: any; canLoanApplicationBranchVerification: any; };
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private statusListFormBuilder: UntypedFormBuilder,
    private dateTimeProcessor: DateTimeProcessor
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

    // ColumnFilterFormElement.prototype.onModelChange = function (value) {
    //   this.filterConstraint.value = value;
    //   if (this.type || value === '') {
    //     this.dt._filter();
    //   }
    // }

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
    }
    this.getLoans()


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


  loadLoans(event) {
    this.getTotalLoansCount()
    let api_filter = this.cdlservice.setFiltersFromPrimeTable(event);
    if (this.statusDropdownClicked) {
      if (this.statusDisplayName && this.statusDisplayName.name) {
        if (this.statusDisplayName.name != 'All') {
          api_filter['spInternalStatus-eq'] = this.statusDisplayName.name;
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




  statusChange(event) {
    this.statusDropdownClicked = true;
    if (event.value.name == 'All') {
      this.getLoans();
    }
    else {
      let api_filter = {}
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
      this.getLoansByFilter(api_filter);
    }
  }

  getLoans() {
    if (this.spInternalStatus) {
      this.loading = true;
      const api_filter = {};
      api_filter['spInternalStatus-eq'] = this.spInternalStatus;
      this.cdlservice.getLoansByFilter(api_filter).subscribe((data: any) => {
        this.loansList = data;
        this.loans = this.loansList;
        this.pagination.totalCnt = data.length;
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
                this.pagination.totalCnt = data.length;
                console.log("Loans List : ", this.loans);
                this.loading = false;
              })
            }
            else {
              this.loans = this.loansList;
              this.pagination.totalCnt = this.loansList.length;
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
      api_filter['or=referenceNo-like'] = globalSearchValue;
      api_filter['or=customerFirstName-like'] = globalSearchValue;
      api_filter['or=partnerName-like'] = globalSearchValue;
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

  setFilterForApi() {
    const api_filter = {};
    if (this.filter.firstName !== '') {
      api_filter['customerFirstName-eq'] = this.filter.firstName;
    }
    if (this.filter.id !== '') {
      api_filter['id-eq'] = this.filter.id;
    }

    if (this.filter.date !== '') {
      api_filter['createdDate-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.date);
    }
    return api_filter;
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

  resetFilter() {
    this.labelFilterData = '';
    this.selectedLabels = [];
    this.filters = {
      'firstName': false,
      'id': false,
      'lastName': false,
      'date': false
    };
    this.filter = {
      id: '',
      firstName: '',
      lastName: '',
      date: ''
    };
    this.getLoans()
  }



  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
  }


  keyPress() {
    if (this.filter.id || this.filter.firstName || this.filter.lastName || this.filter.date) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }



  doSearch() {
    let api_filter = this.setFilterForApi();
    this.getLoansByFilter(api_filter);
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
