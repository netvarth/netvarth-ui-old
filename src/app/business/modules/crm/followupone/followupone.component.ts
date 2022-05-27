import { Component, OnInit } from '@angular/core';
// import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../src/app/app.component';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
// import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';
import {ActivatedRoute } from '@angular/router';
// Router,NavigationExtras,
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../crm.service';
// import { projectConstants } from 'src/app/app.component';
// import { WordProcessor } from '../../../../../../src/app/shared/services/word-processor.service';
// import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-followupone',
  templateUrl: './followupone.component.html',
  styleUrls: ['./followupone.component.css']
})
export class FollowUpOneComponent implements OnInit{
  public headerName:string='';
  public api_loading:boolean=false;
  public no_tasks_cap = Messages.AUDIT_NO_TASKS_CAP;
  public totalFollowUpList:any=[];
  public followUpStatusList:any=[];
  public filtericonTooltip:any = '';
  public filter:any = {
    // status: '',
    // category: '',
    // type: '',
    // dueDate: '',
    title: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  public  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  totalCount: any;
  public totalFollowUpTwoList:any=[]
  loadComplete = false;
  public type:any;

    constructor(
        private locationobj: Location,
    // private groupService: GroupStorageService,
    // public router: Router,
    // private dialog: MatDialog,
    // private lStorageService: LocalStorageService,
    // private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
    ){

    }
    ngOnInit(): void {
      this.api_loading = false;
      this.activated_route.queryParams.subscribe(qparams => {
        console.log('qparams',qparams)
        if (qparams.type) {
            this.type = qparams.type;
        }
      });
      this.getFollowUpStatusListData()
      this.getFollowUpData()
      this.getFollowUTwoData()
      if(this.type==='followUpOne'){
        this.headerName==='Follow Up 1'
      }
      else{
        this.headerName==='Follow Up 2'
      }
    }
    goback() {
      this.locationobj.back();
    }
    getColor(status){
      if(status){
      if(status === 'New'){
        return 'blue'
      }
      else if(status === 'Assigned'){
        return 'pink';
      }
      else if(status === 'In Progress'){
        return '#fcce2b';
      }
      else if(status === 'Cancelled'){
        return 'red';
      }
      else if(status === 'Suspended'){
        return 'orange';
      }
      else if(status === 'Completed'){
        return 'green';
      }
      else{
        return 'black'
      }
    }
    }
    getFollowUpStatusListData(){
      this.crmService.getTaskStatus().subscribe((taskStatus:any)=>{
        console.log('taskStatus',taskStatus);
        this.followUpStatusList.push(
          {
            id:0,   name:'Total Activity',image:'./assets/images/crmImages/total.png',
          },
          {
            id: 1, name: 'New',image:'./assets/images/crmImages/new.png',
          },
          {
            id: 2, name: 'Assigned',image:'./assets/images/tokenDetailsIcon/assignedTo.png',
          },
          {
            id: 3, name: 'In Progress',image:'./assets/images/crmImages/inProgress2.png',
          },
          {
            id: 4, name: 'Cancelled',image:'./assets/images/crmImages/cancelled.png',
          },
          {
            id: 5, name: 'Completed',image:'./assets/images/crmImages/completed2.png',
          },
          {
            id: 12, name: 'Suspended',image:'./assets/images/crmImages/suspended.png',
          },
          );
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
    }
    getFollowUpData(){
      this.crmService.getFollowUPOne().subscribe((res:any)=>{
        console.log('res1',res)
        this.totalFollowUpList= res;
        this.pagination.totalCnt = res;
        this.totalCount = this.pagination.totalCnt;
      })
    }
    getFollowUTwoData(){
      this.crmService.getFollowUPTwo().subscribe((res:any)=>{
        console.log('res2',res)
        this.totalFollowUpTwoList= res;
        this.pagination.totalCnt = res;
        this.totalCount = this.pagination.totalCnt;
      })
    }
    handle_pageclick(pg) {
      this.pagination.startpageval = pg;
      this.filter.page = pg;
      this.getFollowUpData();
    }
    setPaginationFilter(api_filter) {
      api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
      api_filter['count'] = this.filter.page_count;
      return api_filter;
    }
    // getFollowUpData(from_oninit = true) {
    //   let filter = this.setFilterForApi();
    //   console.log("filter is : ",filter)
    //   this.getTotalFollowUPOneCount(filter)
    //     .then(
    //       result => {
    //         if (from_oninit) { 
    //           console.log("Lead Count : ",result)
    //           this.totalCount = result; }
    //         filter = this.setPaginationFilter(filter);
    //         this.crmService.getFollowUPOne(filter)
    //           .subscribe(
    //             data => {
    //               this.totalFollowUpList = data;
    //               console.log('totalFollowUpList',this.totalFollowUpList.length)
    //               // this.totalFollowUpList = this.totalFollowUpList.filter(obj => !obj.originId);
    //               this.loadComplete = true;
    //             },
    //             error => {
    //               this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //               this.loadComplete = true;
               
    //             }
    //           );
    //       },
    //       error => {
    //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //       }
    //     );
    // } 
    // getTotalFollowUPOneCount(filter) {
    //   return new Promise((resolve, reject) => {
    //     this.crmService.getTotalFollowUPOneCount(filter)
    //       .subscribe(
    //         data => {
    //           this.pagination.totalCnt = data;
    //           this.totalCount = this.pagination.totalCnt;
    //           resolve(data);
    //         },
    //         error => {
    //           reject(error);
    //         }
    //       );
    //   });
    // }
    setFilterForApi() {
      const api_filter = {};
     
      // if (this.statuses.length > 0) {
      //   api_filter['status-eq'] = this.statuses.toString();
      // }
      // if (this.types.length > 0) {
      //   api_filter['type-eq'] = this.types.toString();
      // }
      // if (this.categories.length > 0) {
      //   api_filter['category-eq'] = this.categories.toString();
      // }
      if (this.filter.title !== '') {
        api_filter['title-eq'] = this.filter.title;
      }
      console.log(api_filter)
      return api_filter;
    }
  

}