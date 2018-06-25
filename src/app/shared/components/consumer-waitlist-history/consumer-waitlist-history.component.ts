import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Location } from '@angular/common';


import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';


@Component({
  selector: 'app-consumerwaitlist-history',
  templateUrl: './consumer-waitlist-history.component.html'
  /*,
  styleUrls: ['./provider-inbox.component.scss']*/
})
export class ConsumerWaitlistHistoryComponent implements OnInit {

    kwdet: any = [];
    messages: any = [];
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    selectedMsg = -1;
    userDet;
    provider_id = null;
    params = {};

  constructor(
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions,
    private locationobj: Location,
    private activaterouterobj: ActivatedRoute) {}

  ngOnInit() {
    this.userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    console.log('user', this.userDet);
    this.activaterouterobj.params
    .subscribe(paramsv => {
      this.provider_id = paramsv.id;
      this.params = {'account-eq' : this.provider_id};
    });

  }
  backtoProviderDetails() {
    this.locationobj.back();
  }

  handlesearchClick(obj) {
  }
}
