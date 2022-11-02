import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GroupStorageService } from '../../shared/services/group-storage.service';
// import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PartnerService } from '../partner.service';
// import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalStorageService } from '../../shared/services/local-storage.service';



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
  partnerParentId: any;
  filter_sidebar: any;
  statusList: FormGroup;
  selectedLabels: any;
  filterapplied = false;
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
  spInternalStatus: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private activated_route: ActivatedRoute,
    private partnerService: PartnerService,
    private statusListFormBuilder: FormBuilder,
    private dateTimeProcessor: DateTimeProcessor,
    private lStorageService: LocalStorageService
  ) {
    this.statusList = this.statusListFormBuilder.group({
      status: [null]
    });

    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.spInternalStatus) {
        this.spInternalStatus = qparams.spInternalStatus;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.partnerParentId = this.lStorageService.getitemfromLocalStorage('partnerParentId');
    this.getLoans()
  }

  updateLoan(id, action, status) {
    if (status == 'New') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
          action: action
        }
      };
      this.router.navigate([this.partnerParentId, 'partner', 'loans', 'update'], navigationExtras);
    }
    else if (status == 'PartnerAccepted') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'partnerAccepted',
          uid: id
        }
      };
      this.router.navigate([this.partnerParentId, 'partner', 'loans', 'approved'], navigationExtras);

    }
    else if (status == 'ConsumerAccepted' || status == 'ApprovalRequired' || status == 'partnerAccepted' || status == 'rejected' || (status == 'ApprovalPending' && this.user.userType == 2)) {
      this.loanDetails(id)
    }
    else if (status == 'ApprovalPending' && this.user.userType != 2) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'approved',
          uid: id
        }
      };
      this.router.navigate([this.partnerParentId, 'partner', 'loans', 'approved'], navigationExtras);
    }
    else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'autoapproved',
          uid: id,
          timetype: 2
        }
      };
      this.router.navigate([this.partnerParentId, 'partner', 'loans', 'approved'], navigationExtras);
    }

  }


  statusChange(event) {
    if (event.value == 'All') {
      this.getLoans();
    }
    else {
      let api_filter = {}
      if (event.value == 'Rejected') {
        api_filter['applicationStatus-eq'] = event.value;
      }
      else {
        api_filter['spInternalStatus-eq'] = event.value;
      }
      this.getLoansByFilter(api_filter);
    }
  }

  getLoans() {
    if (this.spInternalStatus) {
      this.loading = true;
      const api_filter = {};
      api_filter['spInternalStatus-eq'] = this.spInternalStatus;
      this.partnerService.getLoansByFilter(api_filter).subscribe((data) => {
        this.loansList = data;
        this.loans = this.loansList;
        this.loading = false;
      });
    }
    else {
      this.loading = true;
      this.partnerService.getLoans().subscribe((data) => {
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
              this.partnerService.getLoansByFilter(api_filter).subscribe((data: any) => {
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



  goBack() {
    this.router.navigate([this.partnerParentId, 'partner']);
    // this.location.back();
  }

  loanDetails(id) {
    this.router.navigate([this.partnerParentId, 'partner', 'loans', id]);
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
    this.partnerService.getLoansByFilter(filter).subscribe((data) => {
      this.loans = data;
      console.log("this.loans", this.loans)
    })
  }

}
