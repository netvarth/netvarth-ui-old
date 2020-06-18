import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ProviderServices } from '../../services/provider-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderNonworkingdaysComponent } from '../add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-nonworkingdays',
  templateUrl: './provider-nonworkingdays.component.html',
  styleUrls: ['./provider-nonworkingdays.component.css']
})
export class ProviderNonworkingdaysComponent implements OnInit, OnDestroy {

  non_working_cap = Messages.NON_WORK_DAY_HI_CAP;
  add_cap = Messages.ADD_BTN;
  date_cap = Messages.DATE_COL_CAP;
  reason_cap = Messages.REASON_CAP;
  time_cap = Messages.TIME_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  nonworking_list: any = [];
  query_executed = false;
  emptyMsg = '';
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  breadcrumb_moreoptions: any = [];
  frm_non_wrkg_cap = Messages.FRM_LEVEL_NON_WORKING_MSG;
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/general',
      title: Messages.GENERALSETTINGS
  },
    {
      title: 'Non Working Day/Hour',
      url: '/provider/settings/general/holidays'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  addholdialogRef;
  editholdialogRef;
  remholdialogRef;
  active_user;
  domain;
  qAvailability: any = [];
  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('HOLIDAY_LISTEMPTY');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.getNonworkingdays();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
  }

  ngOnDestroy() {
    if (this.addholdialogRef) {
      this.addholdialogRef.close();
    }
    if (this.editholdialogRef) {
      this.editholdialogRef.close();
    }
    if (this.remholdialogRef) {
      this.remholdialogRef.close();
    }
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->nonworking']);
    }
}
  getNonworkingdays() {
    this.provider_servicesobj.getProviderNonworkingdays()
      .subscribe(data => {
        this.nonworking_list = data;
        this.query_executed = true;
        this.isAvailableNow();
      });
  }
  addHolidays() {
    this.addholdialogRef = this.dialog.open(AddProviderNonworkingdaysComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });

    this.addholdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getNonworkingdays();
      }
    });
  }
  editHolidays(obj) {
    this.editholdialogRef = this.dialog.open(AddProviderNonworkingdaysComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        holiday: obj,
        type: 'edit'
      }
    });

    this.editholdialogRef.afterClosed().subscribe(result => {
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
    const date = new Date(holiday.startDay);
    const date_format = moment(date).format(projectConstants.DISPLAY_DATE_FORMAT);
    this.remholdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('HOLIDAY_DELETE').replace('[date]', date_format)
      }
    });
    this.remholdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteHolidays(id);
      }
    });
  }
  deleteHolidays(id) {
    this.provider_servicesobj.deleteHoliday(id)
      .subscribe(
        () => {
          this.getNonworkingdays();
        },
        () => {

        }
      );
  }
  showEdit(ddate) {
    const pdate = new Date(ddate + ' 00:00:00');
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    const tday = new Date(this.sharedfunctionObj.addZero(yyyy) + '-' + this.sharedfunctionObj.addZero(mm) + '-' + this.sharedfunctionObj.addZero(dd) + ' 00:00:00');
    if (pdate.getTime() < tday.getTime()) {
      return false;
    } else {
      return true;
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'miscellaneous', 'subKey': mod };
  //   return moreOptions;
  // }
  isAvailableNow() {
    this.provider_servicesobj.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
        const message = {};
        message['ttype'] = 'instant_q';
        message['qAvailability'] = this.qAvailability;
        this.shared_functions.sendMessage(message);
      },
        (error) => {
        });
  }
}
