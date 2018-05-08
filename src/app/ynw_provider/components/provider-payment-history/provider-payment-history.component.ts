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
  selector: 'app-provider-payment-history',
  templateUrl: './provider-payment-history.component.html'
})
export class ProviderPaymentHistoryComponent implements OnInit {

    payment_history: any = [] ;
    load_complete = 0;
    dateFormat = projectConstants.DISPLAY_DATE_FORMAT;
    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions,
      private locationobj: Location
    ) {}

    ngOnInit() {
      this.getPaymentHistory();
    }


    getPaymentHistory() {
      this.provider_servicesobj.getPaymentHistory(12)
        .subscribe(data => {
          this.payment_history = data;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});

        },
      () => {
        this.load_complete = 1;
      });
    }

    goback() {
      this.locationobj.back();
    }
}
