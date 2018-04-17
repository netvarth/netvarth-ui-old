import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderNonworkingdaysComponent } from '../add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import {Messages} from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-nonworkingdays',
  templateUrl: './provider-nonworkingdays.component.html',
  styleUrls: ['./provider-nonworkingdays.component.css']
})
export class ProviderNonworkingdaysComponent implements OnInit {
    nonworking_list: any = [] ;
    query_executed = false;
    emptyMsg = Messages.HOLIDAY_LISTEMPTY;
    breadcrumbs_init = [
      {
        url: '/provider/settings',
        title: 'Settings'
      },
      {
        title: 'Non Working Days Coupons',
        url: '/provider/settings/holidays'
      }
    ];
    breadcrumbs = this.breadcrumbs_init;
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
        this.getNonworkingdays();
    }

    getNonworkingdays() {
        this.provider_servicesobj.getProviderNonworkingdays()
        .subscribe(data => {
            this.nonworking_list = data;
            this.query_executed = true;
        });
    }
    addHolidays() {
        const dialogRef = this.dialog.open(AddProviderNonworkingdaysComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          data: {
            type : 'add'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getNonworkingdays();
          }
        });
    }
    editHolidays(obj) {
        const dialogRef = this.dialog.open(AddProviderNonworkingdaysComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          data: {
            holiday : obj,
            type : 'edit'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getNonworkingdays();
          }
        });
    }
    doRemoveHolidays(holiday) {
        const id = holiday.id;
        if (!id) {
          return false;
        }
        const date =  new Date(holiday.startDay);
        const date_format = moment(date).format('DD/MM/YYYY');
        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
          data: {
            'message' : Messages.HOLIDAY_DELETE.replace('[date]', date_format )
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.deleteHolidays(id);
          }
        });
      }
      deleteHolidays(id) {
        this.provider_servicesobj.deleteHoliday(id)
        .subscribe(
          data => {
            this.getNonworkingdays();
          },
          error => {

          }
        );
      }
}
