import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { GroupStorageService } from '../../services/group-storage.service';

@Component({
  selector: 'app-consumerwaitlist-history',
  templateUrl: './consumer-waitlist-history.component.html'
})
export class ConsumerWaitlistHistoryComponent implements OnInit {

  kwdet: any = [];
  messages: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  selectedMsg = -1;
  userDet;
  provider_id = null;
  params = {};
  domain;
  back_to_cap = Messages.BACK_TO_CAP;
  provider_details = Messages.PROVIDER_DETAILS_CAP;

  constructor(
    public shared_functions: SharedFunctions,
    private groupService: GroupStorageService,
    private locationobj: Location,
    private activaterouterobj: ActivatedRoute) { }

  ngOnInit() {
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.activaterouterobj.params
      .subscribe(paramsv => {
        this.provider_id = paramsv.id;
        this.params = { 'account-eq': this.provider_id };
      });

  }
  backtoProviderDetails() {
    this.locationobj.back();
  }
  handlesearchClick() {
  }
}
