import { Component, OnInit } from '@angular/core';
// import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { CdlService } from '../cdl.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {
  user: any;
  dealers: any = [];
  headerName: string = ''
  type: any;
  dealerList: any;
  filter_sidebar: any;
  selectedLabels: any;
  filterapplied = false;
  tooltipcls = projectConstantsLocal.TOOLTIP_CLS;
  labelFilterData: any;
  filter = {
    name: '',
    id: '',
    date: ''
  };
  statusDisplayName: any;
  filters: any;
  dealerStatus = projectConstantsLocal.DEALER_STATUS;
  statusList: UntypedFormGroup;
  spInternalStatus: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  loading: any = false;
  capabilities: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    // private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      // console.log('qparams',qparams)
      if (qparams && qparams.type) {
        this.type = qparams.type;
      }
      if (qparams && qparams.spInternalStatus) {
        this.spInternalStatus = qparams.spInternalStatus;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
    if (this.user) {
      this.capabilities = this.cdlservice.getCapabilitiesConfig(this.user);
    }
    this.getDealers();
  }
  goBack() {
    this.router.navigate(['provider', 'cdl']);
    // this.location.back();
  }


  updateDealer(id, action, status?) {
    if (action == 'update') {
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
    else if (status == 'Approved') {
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




  getDealers() {
    this.loading = true;
    if (this.spInternalStatus) {
      console.log("this.spInternalStatus")
      const api_filter = {};
      api_filter['spInternalStatus-eq'] = this.spInternalStatus;
      this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
        this.dealerList = data;
        this.dealers = this.dealerList;
        this.loading = false;
        console.log("this.dealerList", this.dealerList)
      });
    }
    else {
      this.cdlservice.getDealers().subscribe((data) => {
        this.dealerList = data;
        this.loading = false;
        if (this.dealerList) {
          this.activated_route.queryParams.subscribe((params) => {
            if (params) {
              if (params && (params.type === 'approved')) {
                this.headerName = "Approved Dealers";
              }
              else if (params && (params.type === 'redirected')) {
                this.headerName = "Redirected Dealers";
              }
              else if (params && (params.type === 'rejected')) {
                this.headerName = "Rejected Dealers";
              }
              else if (params && (params.type === 'Draft')) {
                this.headerName = "All Leads";
              }
              else {
                this.headerName = "All Dealers";
              }

            }

            else {
              this.headerName = params.type;
              return this.headerName;
            }


            if (params.type && params.type != 'all') {
              const api_filter = {};
              api_filter['partnerStatus-eq'] = params.type;
              this.cdlservice.getDealersByFilter(api_filter).subscribe((data: any) => {
                this.dealers = data;
                console.log("Dealers List : ", this.dealers);
              })
            }
            else {
              this.dealers = this.dealerList;
            }

          });
        }
        console.log("dealers List : ", this.dealerList);

      })
    }

  }




  setFilterForApi() {
    const api_filter = {};
    if (this.filter.name !== '') {
      api_filter['partnerName-eq'] = this.filter.name;
    }
    if (this.filter.id !== '') {
      api_filter['id-eq'] = this.filter.id;
    }

    if (this.filter.date !== '') {
      api_filter['createdDate-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.date);
    }
    return api_filter;
  }




  statusChange(event) {
    if (event.value.name == 'All') {
      this.getDealers();
    }
    else {
      let api_filter = {}
      api_filter['spInternalStatus-eq'] = event.value.name;
      this.getDealersByFilter(api_filter);
    }
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
      'name': false,
      'id': false,
      'date': false
    };
    this.filter = {
      id: '',
      name: '',
      date: ''
    };
    this.getDealers()
  }



  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
  }


  keyPress() {
    if (this.filter.id || this.filter.name || this.filter.date) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }



  doSearch() {
    let api_filter = this.setFilterForApi();
    this.getDealersByFilter(api_filter);
  }


  getDealersByFilter(filter) {
    this.loading = true;
    this.cdlservice.getDealersByFilter(filter).subscribe((data) => {
      this.dealers = data;
      this.loading = false;
      console.log("this.dealers", this.dealers)
    })
  }


}