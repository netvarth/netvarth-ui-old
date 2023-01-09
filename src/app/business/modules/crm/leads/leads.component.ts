import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '../crm.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import * as moment from 'moment';
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";
import { CrmSelectMemberComponent } from "../../../../business/shared/crm-select-member/crm-select-member.component";
import { MatDialog } from "@angular/material/dialog";

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
  first_name = Messages.FIRST_NAME_CAP;
  last_name = Messages.LAST_NAME_CAP;
  first_name_Assignee=Messages.FIRST_NAME_CAP;
  last_name_Assignee=Messages.LAST_NAME_CAP;
  filter = {
    status: '',
    category: '',
    type: '',
    dueDate: '',
    title: '',
    check_in_start_date: null,
    check_in_end_date: null,
    check_in_start_date_LoanSanction:null,
    check_in_end_date_LoanSanction:null,
    check_in_start_date_RejectedLoan:null,
    check_in_end_date_RejectedLoan:null,
    page: 1,
    first_name:'',
    last_name:'',
    first_name_Assignee:'',
    last_name_Assignee:''
  };
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
    'title': false,
    'check_in_start_date': false,
    'check_in_end_date': false,
    'check_in_start_date_LoanSanction':false,
    'check_in_end_date_LoanSanction':false,
    'check_in_start_date_RejectedLoan':false,
    'check_in_end_date_RejectedLoan':false,
    'first_name':false,
    'last_name ':false,
    'first_name_Assignee':false,
    'last_name_Assignee':false
  };

  api_loading = true;
  no_leads_cap = Messages.AUDIT_NO_LEADS_CAP;
  config: any;
  filterapplied: boolean;
  endminday: any;
  endmindayLoanSanction:any;
  endmindayLoanReject:any;
  maxday: any;
  maxdayLoanSanction:any;
  maxdayLoanReject:any;
  server_date: any;
  tomorrowDate: Date;
  yesterdayDate: Date;
  endmaxday: Date;
  endmaxdayLoanSanction:Date;
  endmaxdayLoanReject:Date;
  filter_sidebar: boolean;
  bStatusTableHead: boolean;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  dataUrl:any;
  dataId:any;
  dataStatus;
  tempaltename: any;
  tempLeads;
  totalDisbursmentCount: any;
  constructor(
    private groupService: GroupStorageService,
    public router: Router,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
    private providerServices: ProviderServices,
    private dialog: MatDialog,
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
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
              console.log('count',count)
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
    if(_this.tempaltename==='Loan Disbursement'){
      this.getLeadsWithoutLocCount().then((count)=>{
        console.log('count',count);
      });
    }
  }
  getCurrentMonthInfo() {
    var currentdate = new Date();
    var firstDay = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1);
    // var lastDay = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, 0);
    console.log('firstDay',firstDay)
    console.log('lastDay',currentdate)
    if(firstDay){
      // this.filter.check_in_start_date=firstDay;
      this.filter.check_in_start_date_LoanSanction= moment(firstDay).format("YYYY-MM-DD");;
     
    }
    if(currentdate){
      // this.filter.check_in_end_date=currentdate;
      this.filter.check_in_end_date_LoanSanction= moment(currentdate).format("YYYY-MM-DD");
    }

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
            console.log('totalcount',data)
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
  // getLeadsWithoutLoc() {
  //   const _this = this;
  //   const filter = {}
  //   filter['status-eq'] = _this.dataId;
  //   filter['isRejected-eq'] = false;
  //   filter['sort_lastStatusUpdatedDate'] = 'dsc';
  //   // delete filter['location-eq'];
  //   return new Promise((resolve,reject)=>{
  //     _this.crmService.getTotalLead(filter).subscribe((res: any) => {
  //       _this.tempLeads = res;
  //       console.log('_this.leadsWithoutFilter', _this.tempLeads)
  //       if(this.filterapplied){
  //         this.tempLeads=this.leads
  //       }
  //       resolve(res)
  //       _this.api_loading = false;
  //     },
  //     ((error)=>{
  //       reject(error)
  //     }));
  //   })
    
  // }
  getLeadsWithoutLocCount() {
    const _this = this;
    return new Promise((resolve, reject) => {
      const filter = _this.setFilter();
      delete filter['location-eq'];
      _this.crmService.getTotalLeadCount(filter)
        .subscribe(
          data => {
            console.log('totalcountWithOutLoc', data)
            _this.totalDisbursmentCount=data;
            _this.pagination.totalCnt = data;
            _this.config.totalItems = data;
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
    // filter['location-eq'] = this.selected_location.id;
    if (this.filter.check_in_start_date != null) {
      filter['createdDate-ge'] = moment(this.filter.check_in_start_date).format("YYYY-MM-DD");
    }
    if (this.filter.check_in_end_date != null) {
      filter['createdDate-le'] = moment(this.filter.check_in_end_date).format("YYYY-MM-DD");
    }
    if (this.filter && this.filter.first_name && this.filter.first_name !== '') {
      filter['customerFirstName-eq'] = this.filter.first_name;
    }
    if (this.filter && this.filter.last_name && this.filter.last_name !== '') {
      filter['customerLastName-eq'] = this.filter.last_name;
    }
    if (this.filter && this.filter.first_name_Assignee && this.filter.first_name_Assignee !== '') {
      filter['assigneeFirstName-eq'] = this.filter.first_name_Assignee;
    }
    if (this.filter && this.filter.last_name_Assignee && this.filter.last_name_Assignee !== '') {
      filter['assigneeLastName-eq'] = this.filter.last_name_Assignee;
    }
    if(this.type){
      if(this.type==='Rejected'){
        if(this.dataId){
          filter['isRejected-eq']= true;
          filter['sort_lastStatusUpdatedDate']='dsc';
          if(this.filter && this.filter.check_in_start_date_RejectedLoan && this.filter.check_in_start_date_RejectedLoan !=null){
            filter['rejectDate-ge']=moment(this.filter.check_in_start_date_RejectedLoan).format("YYYY-MM-DD");
          }
          if(this.filter && this.filter.check_in_end_date_RejectedLoan && this.filter.check_in_end_date_RejectedLoan !=null){
            filter['rejectDate-le']=moment(this.filter.check_in_end_date_RejectedLoan).format("YYYY-MM-DD");
          }
          filter['sort_rejectDate']='dsc';
          delete filter['sanctionedDate-ge'];
          delete filter['sanctionedDate-le'];
          delete filter['sort_lastStatusUpdatedDate'];
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
      } else {
        if(this.dataId){
          filter['status-eq'] = this.dataId;
          filter['isRejected-eq']= false;
          filter['sort_lastStatusUpdatedDate']='dsc'
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
        if(this.tempaltename && this.tempaltename==='Loan Disbursement'){
          if(this.filter && this.filter.check_in_start_date_LoanSanction && this.filter.check_in_start_date_LoanSanction !=null){
            filter['sanctionedDate-ge'] = moment(this.filter.check_in_start_date_LoanSanction).format("YYYY-MM-DD");
          }
          if(this.filter && this.filter.check_in_end_date_LoanSanction && this.filter.check_in_end_date_LoanSanction !=null){
            filter['sanctionedDate-le'] = moment(this.filter.check_in_end_date_LoanSanction).format("YYYY-MM-DD");
          }
        }
        else{
          delete  filter['sanctionedDate-ge'];
          delete  filter['sanctionedDate-le'];
        }
      }
    }
    return filter;
  }
  /**
   * 
   * @param leadUID 
   */
  openLead(leadUID) {
    console.log('leadUID',leadUID)
    if ( this.type==='Loan Application Verified') {
      return false;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: this.type
      }
    };
    this.router.navigate(['/provider/viewleadqnr/' + leadUID], navigationExtras);
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
    console.log('_this.locations',_this.locations[value])
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
    if(this.filter.check_in_start_date){
      this.endminday = this.filter.check_in_start_date;
    }
    if(this.filter.check_in_start_date_LoanSanction){
      this.endmindayLoanSanction= this.filter.check_in_start_date_LoanSanction
    }
    if(this.filter.check_in_end_date_LoanSanction){
      this.maxdayLoanSanction= this.filter.check_in_end_date_LoanSanction
    }
    else{
      this.maxdayLoanSanction=this.yesterdayDate;
    }
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    if(this.filter.check_in_start_date_RejectedLoan){
      this.endmindayLoanReject= this.filter.check_in_start_date_LoanSanction;
    }
    if(this.filter.check_in_end_date_RejectedLoan){
      this.maxdayLoanReject= this.filter.check_in_end_date_RejectedLoan
    }
    else{
      this.maxdayLoanReject= this.yesterdayDate
    }
    this.getLeadsWithoutLocCount()
    const filter = this.setFilter()
    this.getLeadsCount(filter);
    this.getLeads(filter);
    this.filter_sidebar = false;
  }

  clearFilter() {
    this.resetFilter();
    this.getLeadsWithoutLocCount()
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
      check_in_end_date_LoanSanction:false,
      check_in_start_date_LoanSanction:false,
      check_in_start_date_RejectedLoan:false,
      check_in_end_date_RejectedLoan:false,
      first_name: false,
      last_name: false,
      first_name_Assignee:false,
      last_name_Assignee:false
    };
    this.filter = {
      status: '',
      category: '',
      type: '',
      dueDate: '',
      title: '',
      check_in_start_date: null,
      check_in_end_date: null,
      check_in_end_date_LoanSanction:null,
      check_in_start_date_LoanSanction:null,
      page: 1,
      check_in_start_date_RejectedLoan:null,
      check_in_end_date_RejectedLoan:null,
      first_name: '',
      last_name: '',
      first_name_Assignee:'',
      last_name_Assignee:''
    };
  }

  showFilterSidebar() {
    this.filter_sidebar = true;
    this.getCurrentMonthInfo();
    this.filterapplied = true;
  }


  keyPressed(text) {
    if(text==='noLoanSanction'){
      console.log("this.filter1", this.filter)
      if (this.filter.check_in_start_date !==null || this.filter.check_in_end_date !==null) {
        this.filterapplied = true;
      } else {
        this.filterapplied = false;
      }
    }
    else if(text==='loanSanction'){
      console.log("this.filter2", this.filter)
      if (this.filter.check_in_start_date_LoanSanction !== null || this.filter.check_in_end_date_LoanSanction !==null) {
        this.filterapplied = true;
      } else {
        this.filterapplied = false;
      }
    }
    else if(text==='rejected'){
      console.log("this.filter3rejected", this.filter)
      if (this.filter.check_in_start_date_RejectedLoan !=null || this.filter.check_in_end_date_RejectedLoan !==null) {
        this.filterapplied = true;
      } else {
        this.filterapplied = false;
      }
    }
    else if((text==='nameFilter' || 'nameFilterAssignee')){
      if (this.filter.first_name !=='' || this.filter.last_name!=='' || this.filter.first_name_Assignee!=='' || this.filter.last_name_Assignee!=='') {
        this.filterapplied = true;
      } else {
        this.filterapplied = false;
      }
    }
   
  }
  /**
   * 
   * @returns 
   */
  getLocationList() {
    const self = this;
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(loggedUser)
    return new Promise<void>(function (resolve, reject) {
      self.selected_location = null;
      self.providerServices.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                if (loggedUser.accountType === 'BRANCH' || loggedUser.adminPrivilege || loggedUser.userType === 3) {
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
  openRejectedNotes(data,event,type){
    event.stopPropagation();
    console.log(data);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent,{
      width:"100%",
      panelClass: ["popup-class", "confirmationmainclass"],
      data:{
        requestType:'createUpdateNotes',
        info:data.rejectNotes,
        header: "View remarks",
        type:type
      }
    })
    dialogRef.afterClosed().subscribe((response)=>{
      console.log(response);
    })
  }
}
