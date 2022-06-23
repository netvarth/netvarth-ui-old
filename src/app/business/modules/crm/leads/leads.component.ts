import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '../crm.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
/**
 * 
 */
export class LeadsComponent implements OnInit {
  type: any; // To store the filter type param
  locations: any; // to hold the locations
  leads: any = []; // To store the leads
  statuses: any; // To store statuses
  selected_location: any //To store the selected location
  headerName = 'Leads';
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.crmService.PERPAGING_LIMIT
  };
  api_loading = true;
  no_leads_cap = Messages.AUDIT_NO_LEADS_CAP;
  constructor(
    private groupService: GroupStorageService,
    public router: Router,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
    private providerServices: ProviderServices

  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.type) {
        this.type = qparams.type;
      }
    });
  }
  /**
   * 
   */
  ngOnInit() {
    const _this = this;
    this.getLocationList().then(() => {
      console.log("Locations:", this.locations);
      this.selected_location = this.locations[0];
      this.getStatus().then(
        (statuses: any) => {
          _this.statuses = statuses;
          const filter = this.setFilter();
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
    this.router.navigate(['provider','crm']);
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
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
/**
 * 
 * @param filter 
 */
  getLeads(filter) {
    this.crmService.getTotalLead(filter).subscribe((res: any) => {
      this.leads = res;
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
    filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    filter['count'] = this.pagination.perPage;
    filter['location-eq'] = this.selected_location.id;
    switch (this.type) {
      case 'NEWLEAD':
        filter['statusName-eq'] = 'New';
        break;
      case 'CRIF':
        filter['statusName-eq'] = 'KYC Updated';
        this.headerName = 'CRIF';
        break;
      case 'SALESVERIFICATION':
        filter['statusName-eq'] = 'Credit Score Generated';
        this.headerName = 'Sales Field Verification';
        break;
      case 'DOCUMENTUPLOD':
        filter['statusName-eq'] = 'Sales Verified';
        this.headerName = 'Login';
        break;
      case 'LOGIN':
        filter['statusName-eq'] = 'Login';
        this.headerName = 'Login Verification';
        break;
      case 'CreditRecommendation':
        filter['statusName-eq'] = 'Login Verified';
        this.headerName = 'Credit Recommendation';
        break;
        case 'LoanSanction':
        filter['statusName-eq'] = 'Credit Recommendation';
        this.headerName = 'Loan Sanction';
        break;
        case 'LoanDisbursement':
        filter['statusName-eq'] = 'Loan Sanction';
        this.headerName = 'Loan Disbursement';
        break;
        case 'Redirect':
        filter['isRedirected-eq'] = true;
        this.headerName = 'Redirect';
        break;
        case 'Rejected':
        filter['statusName-eq'] = 'rejected';
        this.headerName = 'Rejected';
        break;
    }
    return filter;
  }
  /**
   * 
   * @param leadUID 
   */
  openLead(leadUID) {
    if (this.type === 'LoanDisbursement' || 'Rejected'){
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
    this.selected_location = this.locations[value];
    console.log(this.selected_location);
    this.leads = [];
    const filter = this.setFilter();
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
                if (loggedUser.accountType === 'BRANCH' && !loggedUser.adminPrivilege) {
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
