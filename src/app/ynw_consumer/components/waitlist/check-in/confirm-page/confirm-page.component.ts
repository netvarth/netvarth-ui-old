import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit {
  breadcrumbs = [
    {
      title: 'My Jaldee',
      url: '/consumer'
    },
    {
      title: 'Payment'
    }
  ];
  infoParams;
  waitlist: any = [];
  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  email;
  apiloading = true;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public shared_functions: SharedFunctions
  ) {
    this.route.queryParams.subscribe(
      params => {
        // this.shared_functions.setitemonLocalStorage('inPostInfo', true);
        this.infoParams = params;
        if (params.uuid && params.account_id) {
          this.shared_services.getCheckinByConsumerUUID(params.uuid, params.account_id).subscribe(
            (waitlist: any) => {
              this.waitlist = waitlist;
              this.apiloading = false;
            });
        }
      });
  }

  ngOnInit() {
  }
  okClick() {
    if (this.waitlist.service.livetrack) {
      this.router.navigate(['consumer', 'checkin', 'track', this.infoParams.uuid], { queryParams: { account_id: this.infoParams.account_id } });
    } else {
      this.router.navigate(['consumer']);
    }
    // this.shared_functions.removeitemfromLocalStorage('inPostInfo');
  }
  updateEmail() {
    // console.log(this.email);
  }
  getWaitTime(waitlist) {
    if (waitlist.calculationMode !== 'NoCalc') {
      if (waitlist.appxWaitingTime === 0) {
        return 'Now';
      } else if (waitlist.appxWaitingTime !== 0) {
        return this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);
      }
    }
  }
}
