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
    auditStatus = 1;
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
      this.auditStatus = 3;
    }

    getAuditList(cat, subcat, action, sdate) {
      this.shared_services.getAuditLogs(cat, subcat, action, sdate)
        .subscribe(data => {
          this.auditlog_details = data;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
          this.load_complete = 1;
        },
      () => {
        this.load_complete = 1;
      });
    }
    goback() {
      this.locationobj.back();
    }
    selectCategory() {
      console.log('selCat', this.logSelcat);
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
    do_search() {
      let seldate = '';
      if (this.logSeldate) {
        const mon = this.logSeldate['_i']['month'] + 1 ;
        let mn = '';
        if (mon < 10) {
          mn = '0' + mon;
        } else {
          mn = mon;
        }
        seldate = this.logSeldate['_i']['year'] + '-' + mn + '-' + this.logSeldate['_i']['date'];
      }
      if (this.logSelcat === '' && this.logSelsubcat === '' && this.logSelaction === '' && seldate === '') {
        this.sharedfunctionObj.openSnackBar('Please select atleast one option', {'panelClass': 'snackbarerror'});
      } else {
        this.getAuditList(this.logCategories[this.logSelcat].name, this.logSelsubcat, this.logSelaction, seldate);
      }
      console.log('search', this.logSelcat, this.logSelsubcat, this.logSelaction, 'seldate', seldate);
    }
}
