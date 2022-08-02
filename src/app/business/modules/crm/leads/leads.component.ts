import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '../crm.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import * as moment from 'moment';
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
/**
 * 
 */
export class LeadsComponent implements OnInit {
  tooltipcls = '';
  type: any; // To store the filter type param
  locations: any; // to hold the locations
  leads: any = []; // To store the leads
  statuses: any; // To store statuses
  selected_location: any //To store the selected location
  headerName = 'Leads';
  filtericonTooltip = '';
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.crmService.PERPAGING_LIMIT
  };

  filter = {
    status: '',
    category: '',
    type: '',
    dueDate: '',
    title: '',
    check_in_start_date: null,
    check_in_end_date: null,
    page: 1
  };
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
    'title': false,
    'check_in_start_date': false,
    'check_in_end_date': false
  };

  api_loading = true;
  no_leads_cap = Messages.AUDIT_NO_LEADS_CAP;
  config: any;
  filterapplied: boolean;
  endminday: any;
  maxday: any;
  server_date: any;
  tomorrowDate: Date;
  yesterdayDate: Date;
  endmaxday: Date;
  filter_sidebar: boolean;
  bStatusTableHead: boolean;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  dataUrl:any;
  dataId:any;
  dataStatus;
  tempaltename: any;
  constructor(
    private groupService: GroupStorageService,
    public router: Router,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
    private providerServices: ProviderServices

  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      // console.log('qparams',qparams)
      if (qparams && qparams.type) {
        this.type = qparams.type;
      }
      if(qparams && qparams.dataUrl){
        console.log('qparams.dataUrl',qparams.dataUrl);
        this.dataUrl= qparams.dataUrl;
      }
      if(qparams && qparams.dataId){
        console.log('qparams.dataId',qparams.dataId);
        this.dataId= qparams.dataId;
      }
      if(qparams && qparams.dataStatus){
        console.log('dataStatus',qparams.dataStatus);
        this.dataStatus= qparams.dataStatus;
      }
      if(qparams && qparams.templateName){
        this.tempaltename = qparams.templateName
      }
    });
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
  }
  /**
   * 
   */
  ngOnInit() {
    const _this = this;
    _this.getLocationList().then(() => {
      console.log("Locations:", _this.locations);
      _this.selected_location = _this.locations[0];
      _this.getStatus().then(
        (statuses: any) => {
          _this.statuses = statuses;
          const filter = _this.setFilter();
          _this.getLeadsCount(filter).then(
            (count) => {
              if (count > 0) {
                _this.getLeads(filter);
              } else {
                _this.api_loading = false;
              }
            }
          )
        }
      )
    });
  }
  /**
   * 
   */
  goBack() {
    this.router.navigate(['provider', 'crm']);
  }
  /**
   * 
   * @param filter 
   * @returns 
   */
  getLeadsCount(filter) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getTotalLeadCount(filter)
        .subscribe(
          data => {
            _this.pagination.totalCnt = data;
            this.config.totalItems = data;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  hideFilterSidebar() {
    this.filter_sidebar = false;
  }


  /**
   * 
   * @param filter 
   */
  getLeads(filter) {
    this.crmService.getTotalLead(filter).subscribe((res: any) => {
      this.leads = res;
      console.log('this.leads',this.leads)
      this.api_loading = false;
    });
  }
  /**
   * 
   */
  getStatus() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.crmService.getLeadStatus().subscribe((leadstatuses: any) => {
        resolve(leadstatuses);
      });
    })
  }
  /**
   * 
   * @param pg 
   */
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    const filter = this.setFilter();
    this.getLeads(filter);
  }
  /**
   * 
   * @returns 
   */
  setFilter() {
    let filter = {}
    filter['location-eq'] = this.selected_location.id;
    if (this.filter.check_in_start_date != null) {
      filter['createdDate-ge'] = moment(this.filter.check_in_start_date).format("YYYY-MM-DD");
    }
    if (this.filter.check_in_end_date != null) {
      filter['createdDate-le'] = moment(this.filter.check_in_end_date).format("YYYY-MM-DD");
    }
    if(this.type){
      if(this.type==='Rejected'){
        if(this.dataId){
          // filter['status-eq'] = this.dataId;
          filter['isRejected-eq']= true;
        }
        if(this.tempaltename){
          this.headerName = this.tempaltename;
        }
        if(this.selected_location && this.selected_location.id){
          filter['location-eq'] = this.selected_location.id;
        }
        if(this.tempaltename==='Rejected'){
          this.bStatusTableHead = false;
        }
      }
      else{
        if(this.dataId){
          filter['status-eq'] = this.dataId;
          filter['isRejected-eq']= false;
        }
        if(this.tempaltename){
          this.headerName = this.tempaltename;
          console.log('this.tempaltename::',this.tempaltename)
          if(this.tempaltename==='Leads' || this.tempaltename==='Login'){
            this.bStatusTableHead = true; 
          }
          else{
            this.bStatusTableHead = false;
          }
        }
        if(this.selected_location && this.selected_location.id){
          filter['location-eq'] = this.selected_location.id;
        }
      }
    }

    // switch (this.type) {
    //   // case this.type !== 'Rejected':
    //   //   filter['statusName-eq'] = this.dataStatus;
    //   //   filter['isRejected-eq']= false;
    //   //   this.bStatusTableHead = true;
    //   //   this.headerName = this.tempaltename;
    //   //   break;
    //   // case this.type === 'Rejected':
    //   //   filter['statusName-eq'] = this.dataStatus;
    //   //   filter['isRejected-eq']= true;
    //   //   this.headerName = this.tempaltename;
    //   //   // this.bStatusTableHead = true;
    //   //   break;
    //   // case 'SALESVERIFICATION':
    //   //   filter['statusName-eq'] = 'Credit Score Generated';
    //   //   this.headerName = 'Sales  Verification';
    //   //   break;
    //   // case 'DOCUMENTUPLOD':
    //   //   filter['statusName-eq'] = 'Sales Verified';
    //   //   this.bStatusTableHead = true;
    //   //   this.headerName = 'Login';
    //   //   break;
    //   // case 'LOGIN':
    //   //   filter['statusName-eq'] = 'Login';
    //   //   this.headerName = 'Login Verification';
    //   //   break;
    //   // case 'CreditRecommendation':
    //   //   filter['statusName-eq'] = 'Login Verified';
    //   //   this.headerName = 'Credit Recommendation';
    //   //   break;
    //   // case 'LoanSanction':
    //   //   filter['statusName-eq'] = 'Credit Recommendation';
    //   //   this.headerName = 'Loan Sanction';
    //   //   break;
    //   // case 'LoanDisbursement':
    //   //   filter['statusName-eq'] = 'Loan Sanction';
    //   //   this.headerName = 'Loan Disbursement';
    //   //   break;
    //   // case 'Rejected':
    //     // filter['statusName-eq'] = 'rejected';
    //     // this.headerName = 'Rejected';
    //     // break;
    // }
    return filter;
  }
  /**
   * 
   * @param leadUID 
   */
  openLead(leadUID) {
    if (this.type === 'LoanDisbursement') {
      return false;
    }
    else if (this.type === 'Rejected') {
      return false;
    }
    this.router.navigate(['/provider/viewleadqnr/' + leadUID]);
  }

  /**
 * Router Navigations
 */
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  /**
   * 
   * @param event 
   */
  onChangeLocationSelect(event) {
    const _this = this;
    const value = event;
    _this.selected_location = _this.locations[value];
    console.log(_this.selected_location);
    _this.leads = [];
    const filter = _this.setFilter();
    _this.getLeadsCount(filter).then(
      (count) => {
        if (count > 0) {
          _this.getLeads(filter);
        } else {
          _this.api_loading = false;
        }
      }
    )
  }

  applyFilter() {
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    const filter = this.setFilter()
    this.getLeadsCount(filter);
    this.getLeads(filter);
    this.filter_sidebar = false;
  }

  clearFilter() {
    this.resetFilter();
    const filter = this.setFilter();
    this.getLeadsCount(filter);
    this.getLeads(filter);
    this.filterapplied = false;
  }


  resetFilter() {
    this.filters = {
      status: false,
      category: false,
      type: false,
      dueDate: false,
      title: false,
      check_in_start_date: false,
      check_in_end_date: false,
    };
    this.filter = {
      status: '',
      category: '',
      type: '',
      dueDate: '',
      title: '',
      check_in_start_date: null,
      check_in_end_date: null,
      page: 1
    };
  }

  showFilterSidebar() {
    this.filter_sidebar = true;
  }


  keyPressed() {
    console.log("this.filter", this.filter)
    if (this.filter.check_in_start_date || this.filter.check_in_end_date) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  /**
   * 
   * @returns 
   */
  getLocationList() {
    const self = this;
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    return new Promise<void>(function (resolve, reject) {
      self.selected_location = null;
      self.providerServices.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                if (loggedUser.accountType === 'BRANCH' || loggedUser.adminPrivilege) {
                  const userObject = loggedUser.bussLocs.filter(id => parseInt(id) === loc.id);
                  if (userObject.length > 0) {
                    self.locations.push(loc);
                  }
                } else {
                  self.locations.push(loc);
                }
              }
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
}
