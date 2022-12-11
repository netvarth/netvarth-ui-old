import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
// import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdlService } from '../cdl.service';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { FormGroup, FormBuilder } from '@angular/forms';



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
  statusList: FormGroup;
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
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private statusListFormBuilder: FormBuilder,
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

  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getLoans()

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
                this.headerName = "Approved Loans";
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
