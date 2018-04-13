import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';
import { Location } from '@angular/common';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-auditlogs',
  templateUrl: './provider-auditlogs.component.html' ,
  styleUrls: ['./provider-auditlogs.component.css']
})
export class ProviderAuditLogComponent implements OnInit {

    auditlog_details: any = [] ;
    dateFormat = projectConstants.DISPLAY_DATE_FORMAT;
    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions,
      private locationobj: Location
    ) {}

    ngOnInit() {
      this.getAuditList();
    }


    getAuditList() {
      this.provider_servicesobj.getAuditList()
        .subscribe(data => {
          this.auditlog_details = data;
        });
    }
    goback() {
      this.locationobj.back();
    }
}
