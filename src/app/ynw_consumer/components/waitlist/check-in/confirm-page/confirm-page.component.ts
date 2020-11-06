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
  provider_label;
  type;
  uuids: any = [];
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public shared_functions: SharedFunctions
  ) {
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    this.route.queryParams.subscribe(
      params => {
        // this.shared_functions.setitemonLocalStorage('inPostInfo', true);
        this.infoParams = params;
        if (this.infoParams.type === 'waitlistreschedule') {
          this.type = this.infoParams.type;
        }
        if (params.uuid && params.account_id) {
          this.uuids = params.uuid;
          if (params.multiple) {
            for (const uuid of this.uuids) {
              this.shared_services.getCheckinByConsumerUUID(uuid, params.account_id).subscribe(
                (waitlist: any) => {
                  this.waitlist.push(waitlist);
                  this.apiloading = false;
                });
            }
          } else {
            this.shared_services.getCheckinByConsumerUUID(this.uuids, params.account_id).subscribe(
              (waitlist: any) => {
                this.waitlist.push(waitlist);
                this.apiloading = false;
              });
          }
        }
      });
  }

  ngOnInit() {
  }
  okClick(waitlist) {
    if (waitlist.service.livetrack) {
      this.router.navigate(['consumer', 'checkin', 'track', waitlist.ynwUuid], { queryParams: { account_id: this.infoParams.account_id } });
    } else {
      this.router.navigate(['consumer']);
    }
    // this.shared_functions.removeitemfromLocalStorage('inPostInfo');
  }
  updateEmail() {
    console.log(this.email);
  }
  getWaitTime(waitlist) {
    if (waitlist.calculationMode !== 'NoCalc') {
      if (waitlist.serviceTime) {
        return waitlist.serviceTime;
      } else if (waitlist.appxWaitingTime === 0) {
        return 'Now';
      } else if (waitlist.appxWaitingTime !== 0) {
        return this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);
      }
    }
  }
}
