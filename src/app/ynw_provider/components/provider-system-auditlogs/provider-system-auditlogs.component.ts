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
  selector: 'app-provider-system-auditlogs',
  templateUrl: './provider-system-auditlogs.component.html'
  /*
  styleUrls: ['./provider-auditlogs.component.css']*/
})
export class ProviderSystemAuditLogComponent implements OnInit {

    auditlog_details: any = [] ;
    load_complete = 0;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    logCategories = projectConstants.AUDITLOG_FILTER_CATEGORIES;
    logSubcategories: any = [];
    logActions = projectConstants.AUDITLOG_FILTER_ACTION;
    logSelcat = '';
    logSelsubcat = '';
    logSeldate = '';
    logSelaction = '';

    holdlogSelcat = '';
    holdlogSelsubcat = '';
    holdlogSeldate = '';
    holdlogSelaction = '';

    auditStatus = 1;
    startpageval;
    totalCnt;
    perPage = projectConstants.PERPAGING_LIMIT;
    tday = new Date();
    breadcrumbs = [
        {
          title: 'Dashboard',
          url: '/provider'
        },
        {
        title: 'System Audit Logs'
        }
    ];
    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions,
      private locationobj: Location,
      private shared_services: SharedServices
    ) {}

    ngOnInit() {
      // this.getAuditList();
      this.logSelcat = '';
      this.logSelsubcat = '';
      this.logSeldate = '';
      this.logSelaction = '';
      this.setSubcategories('');
      this.auditStatus = 4;

      this.holdlogSelcat = this.logSelcat;
      this.holdlogSelsubcat = this.logSelsubcat;
      this.holdlogSeldate = this.logSeldate;
      this.holdlogSelaction = this.logSelaction;
      this.getAuditListTotalCnt('', '' , '', '');
    }
    getAuditListTotalCnt(cat, subcat, action, sdate) {
      this.shared_services.getAuditLogsTotalCnt(cat, subcat, action, sdate)
        .subscribe(data => {
          this.totalCnt = data;
          if (this.totalCnt === 0) {
            this.auditStatus = 2;
          } else {
            this.auditStatus = 1;
            this.getAuditList(cat, subcat, action, sdate);
          }
        },
      error => {

      });
    }
    getAuditList(cat, subcat, action, sdate) {
      let pageval;
      if (this.startpageval) {
          pageval = (this.startpageval - 1) * this.perPage;
      } else {
          pageval = 0;
      }
      this.auditlog_details = [];
      this.shared_services.getAuditLogs(cat, subcat, action, sdate, Number(pageval), this.perPage)
        .subscribe(data => {
          this.auditlog_details = data;
          this.auditStatus = 3;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          this.load_complete = 2;
          this.auditStatus = 0;
        });
    }

    goback() {
      this.locationobj.back();
    }
    selectCategory() {
      // console.log('selCat', this.logSelcat);
      this.logSelsubcat = '';
      this.setSubcategories(this.logSelcat);
    }
    setSubcategories(catid) {
      this.logSubcategories = [];
      if (catid === '') {
        for (let i = 0; i < this.logCategories.length; i++) {
          for (let j = 0; j < this.logCategories[i].subcat.length; j++) {
            this.logSubcategories.push({name: this.logCategories[i].subcat[j].name, dispName: this.logCategories[i].subcat[j].dispName});
          }
        }
      } else {
        for (let j = 0; j < this.logCategories[catid].subcat.length; j++) {
          this.logSubcategories.push({name: this.logCategories[catid].subcat[j].name, dispName: this.logCategories[catid].subcat[j].dispName});
        }
      }
    }
    do_search(pagecall) {

      if (pagecall === false) {
        // console.log('search false');
        this.holdlogSelcat = this.logSelcat;
        this.holdlogSelsubcat = this.logSelsubcat;
        this.holdlogSeldate = this.logSeldate;
        this.holdlogSelaction = this.logSelaction;
        this.startpageval = 1;
      }
      let seldate = '';
      if (this.holdlogSeldate) {
        const mon = this.holdlogSeldate['_i']['month'] + 1 ;
        let mn = '';
        if (mon < 10) {
          mn = '0' + mon;
        } else {
          mn = mon;
        }
        seldate = this.holdlogSeldate['_i']['year'] + '-' + mn + '-' + this.holdlogSeldate['_i']['date'];
      }
      /*if (pagecall === false && this.holdlogSelcat === '' && this.holdlogSelsubcat === '' && this.holdlogSelaction === '' && seldate === '') {
        this.sharedfunctionObj.openSnackBar('Please select atleast one filter option', {'panelClass': 'snackbarerror'});
      } else { */
        let ccat = '';
        if (this.holdlogSelcat !== '') {
          ccat = this.logCategories[this.holdlogSelcat].name;
        }
        if (pagecall === false) {
          this.getAuditListTotalCnt(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
        } else {
          this.getAuditList(ccat || '', this.holdlogSelsubcat || '', this.holdlogSelaction || '', seldate);
        }
      // }
      // // console.log('search', this.logSelcat, this.logSelsubcat, this.logSelaction, 'seldate', seldate, this.startpageval);
    }
    handle_pageclick(pg) {
      this.startpageval = pg;
      // console.log('page', pg);
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
