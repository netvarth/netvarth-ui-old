import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnDestroy {

  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  apiloading = true;
  donation: any = [];
  private subs = new SubSink();
  customId: any;
  accountId: any;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public shared_functions: SharedFunctions
  ) {
    this.subs.sink = this.route.queryParams.subscribe(
      params => {
        if (params.account_id) {
          this.accountId = params.account_id;
        }
        if (params.customId) {
          this.customId = params.customId;
        }
        if (params.uuid) {
          this.getDonations(params.uuid);
        }
      });
  }
  getDonations(uuid) {
    this.subs.sink = this.shared_services.getConsumerDonationByUid(uuid).subscribe(
      (donations) => {
        this.donation = donations;
        this.apiloading = false;
      }
    );
  }
  okClick() {
    let queryParams = {};
    if(this.customId) {
      queryParams['customId']= this.customId;
      queryParams['accountId'] = this.accountId;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams,
    };
    if(this.customId) {
      this.router.navigate(['consumer'], navigationExtras);
    } else {
      this.router.navigate(['consumer'])
    }


    
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
