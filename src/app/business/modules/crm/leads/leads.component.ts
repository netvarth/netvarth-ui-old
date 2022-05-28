import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import { Router,NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
// import { CrmMarkasDoneComponent } from '../../../../../../src/app/business/shared/crm-markas-done/crm-markas-done.component';
// import { MatDialog } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CrmSelectMemberComponent } from '../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  tooltipcls = '';
  select_cap = Messages.SELECT_CAP;
  search_cap = Messages.SEARCH_CAP;
  date_time_cap = Messages.DATE_TIME_CAP;
  date_time_auditcap = Messages.DATE_TIME_AUDIT_CAP;
  text_cap = Messages.TEXT_CAP;
  subject_cap = Messages.SUBJECT_CAP;
  user_name_cap = Messages.USER_NAME_CAP;
  category_cap = Messages.AUDIT_CATEGORY_CAP;
  sub_category_cap = Messages.AUDIT_SUB_CTAEGORY_CAP;
  action_cap = Messages.AUDIT_ACTION_CAP;
  select_date_cap = Messages.AUDIT_SELECT_DATE_CAP;
  no_leads_cap = Messages.AUDIT_NO_LEADS_CAP;
  auditlog_details: any = [];
  load_complete = 0;
  api_loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  auditStatus = 1;
  time_type = 1;
  filterapplied;
  filter_sidebar = false;
  open_filter = false;
  ackStatus = false;
  notAckStatus = false;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  tday = new Date();
  minday = new Date(2015, 0, 1);
  endminday = new Date(1900, 0, 1);
  maxDate = new Date();
  dateFilter = false;
  auditSelAck = [];
  dueDate = null;
  auditEnddate = null;
  holdauditSelAck = null;
  holdauditStartdate = null;
  holdauditEnddate = null;
  leadList: any = [];
  totalLeadList: any = [];
  totalInprogressList: any = [];
  totalCompletedList: any = [];
  totalDelayedList: any = [];
  selectedTab;
  filtericonTooltip = '';
  filter = {
    status: '',
    category: '',
    type: '',
    dueDate: '',
    title: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  // filters = {
  //   status: false,
  //   category: false,
  //   type: false,
  //   dueDate: false,
  //   title: false,
  // };
  filters: any = {
    'status': false,
    'category': false,
    'type': false,
    'dueDate': false,
    // 'email': false
    'title': false
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  msg = 'Do you really want to mark as done this activity? ';
  totalCount: any;
  inprogressCount: any;
  completedCount: any;
  delayedCount: any;
  inprogress = false;
  completed= false;
  public leadStatusList:any=[];
  public categoryListData:any=[];
  public leadTypeList:any=[];
  types: any = [];
  statuses: any = [];
  categories: any = [];
  
  isCheckin;
  maxday = new Date();
  date_cap = Messages.DATE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  apiloading = false;
  selected = 0;
  showCustomers = false;
  selectedGroup;
  groupCustomers;
  donationsSelected: any = [];
  donations: any = [];
  selectedIndex: any = [];
  donationServices: any = [];
  customer_label = '';
  donations_count;
  selectedDonations: any;
  show_loc = false;
  locations: any;
  selected_loc_id: any;
  services: any = [];
  selected_location = null;
  screenWidth;
  small_device_display = false;
  selectAll = false;
  filtericonclearTooltip: any;
  loadComplete = false;
  loadComplete1 = false;
  loadComplete2 = false;
  loadComplete3 = false;
  public leadMasterList:any=[];
  public arr:any;
  FailedCount: any;
  totalFailedList: any;
  TransferredCount: any;
  totalTransferredList: any;
  loadComplete4: boolean;
  public bTransferredLead:boolean=false;
  public bFailedLead:boolean=false;
  public bSucessLead:boolean=false;
  public bInProgressLead:boolean=false;
  public bTotalLead:boolean=true;
  public statusFilter:any;
  public assignedLeadList:any=[]
  public bUnassigned:boolean=true
  public bAssigned:boolean=false;
  public UnassignedLeadList:any=[]
  public sucessListLead:any=[]
  public totalActivity:any='Total leads';
  constructor(
    private locationobj: Location,
    private groupService: GroupStorageService,
    public router: Router,
    private dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,

  ) {
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');

  }

  ngOnInit() {
    this.api_loading = false;
    if (this.groupService.getitemFromGroupStorage('tabIndex')) {
      this.selectedTab = this.groupService.getitemFromGroupStorage('tabIndex');
    } else {
      this.selectedTab = 1;
    }
    this.getLeadStatusListData();
    this.getCategoryListData();
    this.getLeadTypeListData();
    this.getTotalLead();
    this.getInprogressLead();
    this.getCompletedLead();
    this.getDelayedLead();
    this.getFailedLead();
    this.getTransferredLead();
    this.getLeadmaster()
    // this.getUnassignedLead()
    // this.getAssignedLead()
    // this.getSucessListLead()
    // this.getNewGenerateLead()
    // this.getLeadStatusListData();
    // this.getCategoryListData();
    // this.getLeadTypeListData();
    // this.getTotalLead();
    // this.getInprogressLead();
    // this.getCompletedLead();
    // this.getDelayedLead();
    // this.getFailedLead();
    // this.getTransferredLead();
    this.getLeadmaster()
    // this.getUnassignedLead()
    // this.getAssignedLead()
    // this.getSucessListLead()
    this.getNewGenerateLead()
  }
  getTotalLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    console.log("filter is : ",filter)
    this.getTotalLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { 
            console.log("Lead Count : ",result)
            this.totalCount = result; }
          filter = this.setPaginationFilter(filter);
          this.crmService.getTotalLead(filter)
            .subscribe(
              data => {
                this.totalLeadList = data;
                console.log('totalLeadList',this.totalLeadList)
                // this.getUnassignedLead()
                this.getAssignedLead()
                this.getSucessListLead()
                this.getTransferredLead()
                this.getFailedLead()
                this.getInprogressLead()
                this.getNewGenerateLead()
                this.totalLeadList = this.totalLeadList.filter(obj => !obj.originId);
                this.loadComplete = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  } 
  getTotalLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getTotalLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.totalCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getTotalLead();
  }
  getInprogressLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getInprogressLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.inprogressCount = result; }
          filter = this.setPaginationInprogressFilter(filter);
          this.crmService.getInprogressLead(filter)
            .subscribe(
              data => {
                this.totalInprogressList = data;
                this.loadComplete1 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete1 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getInprogressLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getInprogressLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.inprogressCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationInprogressFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_inprogress(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getInprogressLead();
  }


  handle_pageclick_Transferred(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getTransferredLead();
  }

  getCompletedLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getCompletedLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.completedCount = result; }
          filter = this.setPaginationCompletedFilter(filter);
          this.crmService.getCompletedLead(filter)
            .subscribe(
              data => {
                this.totalCompletedList = data;
                this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCompletedLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getCompletedLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.completedCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getUnassignedLead(){
    // this.UnassignedLeadList=[]
    // this.totalLeadList.forEach((unassigned)=>{
    //   if(unassigned.status.name ==='New'){
    //     this.UnassignedLeadList.push(unassigned)
    //   }
      
    // })
  }
  getNewGenerateLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getNewLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.completedCount = result; }
          filter = this.setPaginationCompletedFilter(filter);
          this.crmService.getNewLead(filter)
            .subscribe(
              data => {
                console.log('dataNew',data)
                this.UnassignedLeadList = data;
                this.loadComplete2 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete2 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getNewLeadCount(filter){
    return new Promise((resolve, reject) => {
      this.crmService.getNewLeadCount(filter)
        .subscribe(
          data => {
            console.log('dataUnassigned',data)
            this.pagination.totalCnt = data;
            // this. = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationNewFilter(api_filter){
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  getAssignedLead(){
    this.assignedLeadList=[]
    this.totalLeadList.forEach((assigned)=>{
      // console.log('assigned',assigned)
      if(assigned.status.name ==='Assigned'){
        this.assignedLeadList.push(assigned)
      }
      
    })
  }
  getSucessListLead(){
    this.sucessListLead=[]
    this.totalLeadList.forEach((Success)=>{
      console.log('Success',Success)
      if(Success.status.name ==='Success'){
        this.sucessListLead.push(Success)
      }
      console.log('this.sucessListLead',this.sucessListLead)
      
    })
  }



  getFailedLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getFailedLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.FailedCount = result; }
          filter = this.setPaginationFailedFilter(filter);
          console.log("Failed List data 1")
          this.crmService.getFailedLead(filter)
            .subscribe(
              data => {
                this.totalFailedList = data;
                this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getFailedLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getFailedLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.FailedCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  setPaginationCompletedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }


  getTransferredLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getTransferredLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.TransferredCount = result; }
          filter = this.setPaginationTransferredFilter(filter);
          console.log("Transferred List data 1")
          this.crmService.getTransferredLead(filter)
            .subscribe(
              data => {
                this.totalTransferredList = data;
                this.loadComplete4 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.loadComplete4 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getTransferredLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getTransferredLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.TransferredCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  setPaginationTransferredFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }

  setPaginationFailedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }

  handle_pageclick_completed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getCompletedLead();
  }

  handle_pageclick_failed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getFailedLead();
  }


  getDelayedLead(from_oninit = true) {
    let filter = this.setFilterForApi();
    this.getDelayedLeadCount(filter)
      .then(
        result => {
          if (from_oninit) { this.delayedCount = result; }
          filter = this.setPaginationDelayedFilter(filter);
          this.crmService.getDelayedLead(filter)
            .subscribe(
              data => {
                this.totalDelayedList = data;
                // this.loadComplete3 = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                // this.loadComplete3 = true;
             
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getDelayedLeadCount(filter) {
    return new Promise((resolve, reject) => {
      this.crmService.getDelayedLeadCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.delayedCount = this.pagination.totalCnt;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setPaginationDelayedFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  handle_pageclick_delayed(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getDelayedLead();
  }
  handle_pageclick_Unassigned(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    // this.getUnassignedLead();
    this.getNewGenerateLead()
  }
  handle_pageclick_ASsigned(pg){
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.getAssignedLead();
  }
  goback() {
    this.locationobj.back();
  }


  doSearch() {
    this.lStorageService.removeitemfromLocalStorage('leadfilter');
    if (this.filter.status || this.filter.category || this.filter.type || this.filter.dueDate) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }

  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  tabChange(event) {
    this.setTabSelection(event.index + 1);
  }
  setTabSelection(type) {
    this.selectedTab = type;
    this.groupService.setitemToGroupStorage('tabIndex', this.selectedTab);
    switch (type) {
      case 1: {
        this.getTotalLead();
        break;
      }
      case 2: {
        this.getInprogressLead();
        break;
      }
      case 3: {
        this.getCompletedLead();

        break;
      }
      case 4: {
        this.getFailedLead();
        break;
      }
      case 5: {
        this.getTransferredLead();
        break;
      }
    }
  }

  // viewLead(leadUid,leadData:any) {
  //   this.crmService.leadToCraeteViaServiceData = leadData;
  //   this.router.navigate(['/provider/viewlead/' + leadUid]);

  // }
  viewLead(leadUid,leadData:any) {
    this.crmService.leadToCraeteViaServiceData = leadData;
    this.router.navigate(['/provider/viewleadqnr/' + leadUid]);

  }
  getLeadmaster(){
    this.crmService.getLeadMasterList().subscribe((response)=>{
      console.log('LeadMasterList :',response);
      this.leadMasterList.push(response)
    })
  }

  createLead(createText: any) {
      if(this.leadMasterList.length>0){
      console.log('........')
      // this.router.navigate(['provider','lead', 'leadtemplate'])
      if(this.leadMasterList[0].length>0){
        const navigationExtras: NavigationExtras = {
          queryParams: {
            type: 'leadCreateTemplate',
          }
        }
        this.router.navigate(['provider','lead', 'leadtemplate'],navigationExtras)
      }
      // const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      //   width:'100%',
      //   panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      //   disableClose: true,
      //   data:{
      //     requestType:'leadMasterList',
      //     leadMasterFullList:this.leadMasterList
      //   }
  
      // })
      // dialogRef.afterClosed().subscribe((res)=>{
      //   console.log('selectLeadMaster',res);
      //   const selectLeadMaster= res;
      // if(selectLeadMaster==='CreatE'){
      //   this.crmService.leadActivityName = 'CreatE';
      //   this.crmService.leadMasterToCreateServiceData=selectLeadMaster
      //   this.router.navigate(['provider', 'lead', 'create-lead'])
      // }
      // else if(selectLeadMaster==='Close'){
      //   this.router.navigate(['provider', 'lead'])
      //   // this.ngOnInit()
      // }
      // else{
      //   this.crmService.leadActivityName = createText;
      //   this.crmService.leadMasterToCreateServiceData= selectLeadMaster;
      //   this.router.navigate(['provider', 'lead', 'create-lead'])
      // }
      // })
    }else{
      console.log('kkkk')
      this.crmService.leadActivityName = 'CreteLeadMaster'
      this.router.navigate(['provider', 'lead', 'create-lead'])
    }

    
    // this.crmService.leadActivityName = createText;
    // this.router.navigate(['provider', 'lead', 'create-lead'])
  }
  stopprop(event) {
    event.stopPropagation();
  }
  openEditLead(leaddata: any, editText: any) {
    this.crmService.leadToCraeteViaServiceData = leaddata
    const newLeadData = this.crmService.leadToCraeteViaServiceData
    setTimeout(() => {
      this.crmService.leadActivityName = editText;
      newLeadData;
      this.router.navigate(['provider', 'lead', 'create-lead']);
    }, projectConstants.TIMEOUT_DELAY);

  }
  resetFilter() {
    this.filters = {
      status: false,
      category: false,
      type: false,
      dueDate: false,
      title: false,
    };
    this.filter = {
      status: '',
      category: '',
      type: '',
      dueDate: '',
      title: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
  }
  keyPressed() {
    if (this.filter.title
      || this.statuses.length > 0 || this.categories.length > 0 || this.types.length > 0 ) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  setFilterForApi() {
    const api_filter = {};
   
    if (this.statuses.length > 0) {
      api_filter['status-eq'] = this.statuses.toString();
    }
    if (this.types.length > 0) {
      api_filter['type-eq'] = this.types.toString();
    }
    if (this.categories.length > 0) {
      api_filter['category-eq'] = this.categories.toString();
    }
    if (this.filter.title !== '') {
      api_filter['title-eq'] = this.filter.title;
    }
    console.log(api_filter)
    return api_filter;
  }
  setFilterDataCheckbox(type, value?, event?) {
   
    if (type === 'status') {
      const indx = this.statuses.indexOf(value);
      this.statuses = [];
      if (indx === -1) {
        this.statuses.push(value);
      }
    }
    if (type === 'type') {
      const indx = this.types.indexOf(value);
      this.types = [];
      if (indx === -1) {
        this.types.push(value);
      }
    }
    if (type === 'category') {
      const indx = this.categories.indexOf(value);
      this.categories = [];
      if (indx === -1) {
        this.categories.push(value);
      }
    }
    this.keyPressed()
  }
 
  clearFilter() {
    this.statuses = [];
    this.types = [];
    this.categories = [];
    this.resetFilter();
    this.filterapplied = false;
    this.getTotalLead();
  }
  handleLeadStatus(statusValue:any,statusText,statusFilter){
    console.log('statusValue',statusValue);
    console.log('statusValue',statusText);
    console.log('statusFilter',statusFilter)
    console.log('this.leadStatusList',this.leadStatusList)
    if(statusValue===6){
      this.bUnassigned=true;
      this.bTransferredLead=false
      this.bFailedLead=false;
      this.bSucessLead=false;
      this.bInProgressLead=false;
      this.bTotalLead=false;
      this.bAssigned=false;
      // this.getUnassignedLead()
      this.getNewGenerateLead()
    }
    else if(statusValue===7){
      this.bUnassigned=false;
      this.bTransferredLead=false
      this.bFailedLead=false;
      this.bSucessLead=false;
      this.bInProgressLead=false;
      this.bTotalLead=false;
      this.bAssigned=true
      this.getAssignedLead()
      
    }
    else if(statusValue===8){
      this.bUnassigned=false;
      this.bTransferredLead=false
      this.bFailedLead=false;
      this.bSucessLead=false;
      this.bInProgressLead=true;
      this.bTotalLead=false;
      this.bAssigned=false;
      this.getInprogressLead()
      
    }
    else if(statusValue===9){
      this.bUnassigned=false;
      this.bTransferredLead=false
      this.bFailedLead=true;
      this.bSucessLead=false;
      this.bInProgressLead=false;
      this.bTotalLead=false;
      this.bAssigned=false;
      this.getFailedLead()
      
    }
    else if(statusValue===10){
      this.bUnassigned=false;
      this.bTransferredLead=false
      this.bFailedLead=false;
      this.bSucessLead=true;
      this.bInProgressLead=false;
      this.bTotalLead=false;
      this.bAssigned=false
      this.getCompletedLead();
      
      
    }
    else if(statusValue===11){
      this.bUnassigned=false;
      this.bTransferredLead=true
      this.bFailedLead=false;
      this.bSucessLead=false;
      this.bInProgressLead=false;
      this.bTotalLead=false;
      this.bAssigned=false
      this.getTransferredLead()
    }
    else{
      this.bUnassigned=false;
      this.bTransferredLead=false
      this.bFailedLead=false;
      this.bSucessLead=false;
      this.bInProgressLead=false;
      this.bTotalLead=true;
      this.bAssigned=false
      this.getTotalLead()
      
    }
  }
  // getNewGenerateLead(){
  //   this.crmService.getNewLead()
  // }
  
  getLeadStatusListData(){
    this.crmService.getLeadStatus().subscribe((leadStatus:any)=>{
      console.log('leadStatus',leadStatus);
      this.leadStatusList.push(
        {
        id:0,   name:'Total Lead',image:'./assets/images/crmImages/total.png',
      },
      {
        id: 6, name: 'New',image:'./assets/images/crmImages/unassigned.png',
      },
      {
        id: 7, name: 'Assigned',image:'./assets/images/tokenDetailsIcon/assignedTo.png',
      },
      {
        id: 8, name: 'In Progress',image:'./assets/images/crmImages/inProgress2.png',
      },
      {
        id: 9, name: 'Failed',image:'./assets/images/crmImages/cancelled.png',
      },
      {
        id: 10, name: 'Success',image:'./assets/images/crmImages/completed2.png',
      },
      {
        id: 11, name: 'Transferred',image:'./assets/images/crmImages/transferred.png',
      },
      );
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  getCategoryListData(){
    this.crmService.getLeadCategoryList().subscribe((categoryList:any)=>{
      this.categoryListData.push(categoryList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    }
    )
  }
  getLeadTypeListData(){
    this.crmService.getLeadType().subscribe((leadTypeList:any)=>{
      this.leadTypeList.push(leadTypeList)
    },
    (error:any)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }

  openLeadCompletion(leadData:any){
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'leadComplete',
        leadName:leadData,
      }
    });
    dialogRef.afterClosed().subscribe((res)=>{
      console.log('resssssssssCom',res);
       if(res==='Completed'){
        this.getCompletedLead()
        // this.completedCount=this.completedCount+1
      }
    })
  
  }
  openDialogStatusChange(leadData:any){
    console.log('openDialogStatusChange',leadData)
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'LeadstatusChange',
        leadDetails:leadData,
      }
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      console.log('resssssssss',res);
      // this.getCompletedLead();
      if(res==='In Progress'){
        this.ngOnInit()   
      }
      else if(res==='Success'){
        this.ngOnInit()
      }
      else if(res==='Failed'){
        this.ngOnInit()
      }
      else if(res==='Transferred'){
        this.ngOnInit()
      }
      else if(res === 'Unassigned'){
        this.ngOnInit()
      }
      else if(res === 'Assigned'){
        this.ngOnInit()
      }
      else{
        this.ngOnInit()
      }
      
    })
  }
}
