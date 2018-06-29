import { Component, Inject, OnInit, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-rate-visit',
  templateUrl: './rate-visit.component.html'
})

export class RateVisitComponent implements OnInit {

  @Input() passedInData: any =  [];
  api_error = null;
  api_success = null;

  user_id = null;
  uuid = null;
  message = '';
  source = null;
  loc: any = [];
  locid;
  changeOccured = false;

  constructor(
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog
    ) {

     }

  ngOnInit() {
    console.log('passedin', this.passedInData);
  }

}
