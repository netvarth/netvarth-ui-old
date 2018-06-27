import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html'
})

export class ServiceDetailComponent implements OnInit {

  api_error = null;
  api_success = null;

  service;

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog
    ) {

     }

  ngOnInit() {
      console.log('received', this.data);
    this.service = this.data.serdet;
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
