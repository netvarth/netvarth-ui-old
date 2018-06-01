import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Location } from '@angular/common';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-system-alerts',
  templateUrl: './provider-system-alerts.component.html'
})
export class ProviderSystemAlertComponent implements OnInit {

    alert_details: any = [] ;
    load_complete = 0;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    alertSelAck = '';
    alertSeldate = '';

    holdalertSelAck = '';
    holdalertSeldate = '';

    alertStatus = 1;
    startpageval;
    totalCnt;
    perPage = projectConstants.PERPAGING_LIMIT;
    breadcrumbs = [
        {
          title: 'Dashboard',
          url: '/provider'
        },
        {
        title: 'System Alerts'
        }
    ];
    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions,
      private locationobj: Location,
      private shared_services: SharedServices
    ) {}

    ngOnInit() {
      // this.getAlertList();
      this.alertSelAck = '';
      this.alertSeldate = '';
      this.alertStatus = 4;

      this.holdalertSelAck = this.alertSelAck;
      this.holdalertSeldate = this.alertSeldate;
      this.getAlertListTotalCnt('', '');
    }
    getAlertListTotalCnt(ackStatus, sdate) {
      this.shared_services.getAlertsTotalCnt(ackStatus, sdate)
        .subscribe(data => {
          this.totalCnt = data;
          if (this.totalCnt === 0) {
            this.alertStatus = 2;
          } else {
            this.alertStatus = 1;
            this.getAlertList(ackStatus, sdate);
          }
        },
      error => {

      });
    }
    getAlertList(ackStatus, sdate) {
      let pageval;
      if (this.startpageval) {
          pageval = (this.startpageval - 1) * this.perPage;
      } else {
          pageval = 0;
      }
      this.alert_details = [];
      this.shared_services.getAlerts(ackStatus, sdate, Number(pageval), this.perPage)
        .subscribe(data => {
          this.alert_details = data;
          this.alertStatus = 3;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
          this.load_complete = 2;
          this.alertStatus = 0;
        });
    }

    goback() {
      this.locationobj.back();
    }

    do_search(pagecall) {

      if (pagecall === false) {
        console.log('search false');
        this.holdalertSelAck = this.alertSelAck;
        this.holdalertSeldate = this.alertSeldate;
      }
      let seldate = '';
      if (this.holdalertSeldate) {
        const mon = this.holdalertSeldate['_i']['month'] + 1 ;
        let mn = '';
        if (mon < 10) {
          mn = '0' + mon;
        } else {
          mn = mon;
        }
        seldate = this.holdalertSeldate['_i']['year'] + '-' + mn + '-' + this.holdalertSeldate['_i']['date'];
      }
      /*if (pagecall === false && this.holdalertSelAck === '' && seldate === '') {
        this.sharedfunctionObj.openSnackBar('Please select atleast one option', {'panelClass': 'snackbarerror'});
      } else {*/
        if (pagecall === false) {
          this.getAlertListTotalCnt(this.holdalertSelAck || '', seldate);
        } else {
          this.getAlertList(this.holdalertSelAck || '', seldate);
        }
      // }
    }
    handle_pageclick(pg) {
      this.startpageval = pg;
      console.log('page', pg);
      this.do_search(true);
    }
    getperPage() {
      return this.perPage;
    }
    gettotalCnt() {
      return this.totalCnt;
    }
    getcurpageVal() {
      return this.startpageval;
    }
}
