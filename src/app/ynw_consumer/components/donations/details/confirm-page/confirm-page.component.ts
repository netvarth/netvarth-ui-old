import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent {
  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  apiloading = true;
  donation: any = [];
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public shared_functions: SharedFunctions
  ) {
    this.route.queryParams.subscribe(
      params => {
        if (params.uuid) {
          this.getDonations(params.uuid);
        }
      });
  }
  getDonations(uuid) {
    this.shared_services.getConsumerDonationByUid(uuid).subscribe(
      (donations) => {
        this.donation = donations;
        this.apiloading = false;
      }
    );
  }
  okClick() {
    this.router.navigate(['consumer', 'donations'])
  }
}
