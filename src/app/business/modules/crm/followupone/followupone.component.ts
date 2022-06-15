import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CrmService } from '../crm.service';
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

  constructor(
    private locationobj: Location,
    public router: Router,
    private crmService: CrmService,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      console.log('qparams', qparams)
      if (qparams.type) {
        this.type = qparams.type;
      }
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
    filter['originFrom-eq'] = 'Enquire';
    filter['title-eq'] = this.headerName;
    filter['statusName-neq']='Rejected';
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
    this.crmService.getFollowups(filter).subscribe((res: any) => {
      this.followups = res;
      this.api_loading = false;
    });
  }
  followupClicked(task) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        dataType: 'UpdateFollowUP'
      }
    }
    this.router.navigate(['/provider/viewtask/' + task.taskUid], navigationExtras);
  }
  ngOnInit(): void {
    const _this = this;
    this.api_loading = false;
    this.headerName = 'Follow Up 1';
    if (this.type === 'followUpTwo') {
      this.headerName = 'Follow Up 2';
    }
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