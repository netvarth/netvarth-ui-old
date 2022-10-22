import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { CdlService } from '../cdl.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

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
  filters: any;
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private location: Location,
    private activated_route: ActivatedRoute,
    private cdlservice: CdlService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      // console.log('qparams',qparams)
      if (qparams && qparams.type) {
        this.type = qparams.type;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log("User is", this.user);
    console.log(this.router);
    this.getDealers();



  }
  goBack() {
    this.location.back();
  }


  updateDealer(id, action) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        action: action
      }
    };
    this.router.navigate(['provider', 'cdl', 'dealers', 'update'], navigationExtras);
  }

  showDealer(dealerId, status, spInternalStatus) {

    if (status == 'New' && spInternalStatus == 'Approved') {
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
    this.cdlservice.getDealers().subscribe((data) => {
      this.dealerList = data;
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
            else {
              this.headerName = "All Dealers";
            }

          }

          else {
            this.headerName = params.type;
            return this.headerName;
          }


          if (params.type && params.type != 'all') {
            this.dealers = this.dealerList.filter(i => i.status == params.type)
            console.log("dealers List : ", this.dealers);
          }
          else {
            this.dealers = this.dealerList;
          }

        });
      }
      console.log("dealers List : ", this.dealerList);

    })
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
    this.getLoansByFilter(api_filter);
  }


  getLoansByFilter(filter) {
    this.cdlservice.getDealersByFilter(filter).subscribe((data) => {
      this.dealers = data;
      console.log("this.dealers", this.dealers)
    })
  }


}
