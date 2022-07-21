import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CrmService } from '../crm.service';
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";

@Component({
  selector: 'app-followupone',
  templateUrl: './followupone.component.html',
  styleUrls: ['./followupone.component.css']
})
export class FollowUpOneComponent implements OnInit {
  headerName;
  public api_loading: boolean = false;
  public no_tasks_cap = Messages.AUDIT_NO_TASKS_CAP;
  followups: any = [];
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.crmService.PERPAGING_LIMIT
  };
  public type: any;
  public enquiryId:any;
  public enquiryName:any;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  constructor(
    private locationobj: Location,
    public router: Router,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.type) {
        this.type = qparams.type;
      }
      if(qparams.id){
        this.enquiryId= qparams.id;
      }
      if(qparams.name){
        this.enquiryName= qparams.name
      }
      console.log(' this.type', this.type)
    });
  }

  /**
* 
* @returns 
*/
  setFilter() {
    let filter = {}
    filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    filter['count'] = this.pagination.perPage;
    if(this.type=== this.enquiryName){
      filter['status-eq'] =this.enquiryId;
      filter['isRejected-eq']= false;
      this.headerName =  this.enquiryName;
    } 
    else if(this.type=== this.enquiryName){
      filter['status-eq'] =this.enquiryId;
      filter['isRejected-eq']= false;
      this.headerName =  this.enquiryName;
    }
    else if(this.type=== this.enquiryName){
      filter['status-eq'] =this.enquiryId;
      filter['isRejected-eq']= false;
      this.headerName =  this.enquiryName;
    }
    else if(this.type=== this.enquiryName){
      filter['status-eq'] =this.enquiryId;
      filter['isRejected-eq']= false;
      this.headerName =  this.enquiryName;
    }
    return filter;
  }
  /**
   * 
   * @param filter 
   * @returns 
   */
  getFollowupsCount(filter) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.crmService.getFollowupsCount(filter)
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
  getFollowups(filter) {
    const _this = this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getFollowups(filter).subscribe((res: any) => {
        resolve(res)
        console.log('res',res)
        if(res){
          _this.followups=res;     
          _this.api_loading = false;
        }
      }),
      ((error)=>{
        reject(error);
      })
      
    })
    
  }
  followupClicked(task) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        dataType: 'UpdateFollowUP'
      }
    }
    this.router.navigate(['/provider/viewtask/' + task.uid], navigationExtras);
  }
  ngOnInit(): void {
    const _this = this;
    this.api_loading = false;
    const filter = this.setFilter();
    this.getFollowupsCount(filter).then(
      (count) => {
        if (count > 0) {
          _this.getFollowups(filter);
        } else {
          _this.api_loading = false;
        }
      }
    )
  }
  goback() {
    this.locationobj.back();
  }
  getColor(status) {
    if (status) {
      if (status === 'New') {
        return 'blue'
      }
      else if (status === 'Assigned') {
        return 'pink';
      }
      else if (status === 'In Progress') {
        return '#fcce2b';
      }
      else if (status === 'Cancelled') {
        return 'red';
      }
      else if (status === 'Suspended') {
        return 'orange';
      }
      else if (status === 'Completed') {
        return 'green';
      }
      else {
        return 'black'
      }
    }
  }
  /**
   * 
   * @param pg 
   */
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    const filter = this.setFilter();
    this.getFollowups(filter);
  }
}