import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { GroupStorageService } from '../../shared/services/group-storage.service';
import { CdlService } from '../../business/modules/cdl/cdl.service';
import { DateTimeProcessor } from '../../shared/services/datetime-processor.service';
// import { projectConstants } from '../../../../app.component';



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
  selectedLabels: any;
  filterapplied = false;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
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

  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private dateTimeProcessor: DateTimeProcessor
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getLoans()

  }

  updateLoan(id, action) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        action: action
      }
    };
    this.router.navigate(['provider', 'cdl', 'loans', 'update'], navigationExtras);
  }

  getLoans() {
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
            else {
              this.headerName = "All Loans";
            }

          }

          else {
            this.headerName = params.type;
            return this.headerName;
          }


          if (params.type && params.type != 'all') {
            this.loans = this.loansList.filter(i => i.status == params.type)
            console.log("Loans List : ", this.loans);
            this.loading = false;
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



  goBack() {
    this.location.back();
  }

  loanDetails(id) {
    this.router.navigate(['provider', 'cdl', 'loans', id]);
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
    this.cdlservice.getLoansByFilter(filter).subscribe((data) => {
      this.loans = data;
      console.log("this.loans", this.loans)
    })
  }

}
