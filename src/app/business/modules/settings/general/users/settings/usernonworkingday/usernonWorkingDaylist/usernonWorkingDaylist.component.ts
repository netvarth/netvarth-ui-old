import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import * as moment from 'moment';
import { projectConstants } from '../../../../../../../../app.component';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../../../../../../shared/components/confirm-box/confirm-box.component';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../../../../../../shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-usernonworkingdaylist',
  templateUrl: './usernonWorkingDaylist.component.html'

})
export class UsernonWorkingDaylistComponent implements OnInit, OnDestroy {

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
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  breadcrumb_moreoptions: any = [];
  frm_non_wrkg_cap = Messages.FRM_LEVEL_NON_WORKING_MSG;
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: Messages.GENERALSETTINGS,
      url: '/provider/settings/general'
  },
    {
      url: '/provider/settings/general/users',
      title: 'Users'

    },
  ];
  breadcrumbs = this.breadcrumbs_init;
  addholdialogRef;
  editholdialogRef;
  remholdialogRef;
  active_user;
  domain;
  qAvailability: any = [];
  userId: any;

  constructor(
    private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private activated_route: ActivatedRoute,
    private router: Router,
    public shared_functions: SharedFunctions,
    public sharedfunctionObj: SharedFunctions,
    private groupService: GroupStorageService,
    public dateformat: DateFormatPipe,
        private wordProcessor: WordProcessor
  ) {
    this.activated_route.params.subscribe(params => {
      this.userId = params.id;
    }
    );
    this.emptyMsg = this.wordProcessor.getProjectMesssages('HOLIDAY_LISTEMPTY');
  }

  ngOnInit() {
    this.getUser();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getNonworkingdays();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }

  getUser() {
    this.provider_servicesobj.getUser(this.userId)
      .subscribe((data: any) => {
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
          breadcrumbs.push(e);
        });
        breadcrumbs.push({
          title: data.firstName,
          url: '/provider/settings/general/users/add?type=edit&val=' + this.userId
        });
        breadcrumbs.push({
          title: 'Settings',
          url: '/provider/settings/general/users/' + this.userId + '/settings'
        });
        breadcrumbs.push({
          title: 'Non Working Day/Hour '
        });
        this.breadcrumbs = breadcrumbs;
      });
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
      this.router.navigate(['/provider/' + this.domain + '/general->nonworking']);
    }
  }
  getNonworkingdays() {
    // this.provider_servicesobj.getProviderNonworkingdays()
    this.provider_servicesobj.getUserProviderNonworkingdays(this.userId)
      .subscribe(data => {
        this.nonworking_list = data;
        this.query_executed = true;
        this.isAvailableNow();
      });
  }

  addHolidays() {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { action: action }
    // };
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'holidays', 'add']);
  }

  editHolidays(holiday, ) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
    };
    this.router.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'holidays', holiday.id], navigationExtras);
  }

  doRemoveHolidays(holiday) {
    const id = holiday.id;
    if (!id) {
      return false;
    }
    const date = new Date(holiday.startDay);
    // const date_format = moment(date).format(projectConstants.DISPLAY_DATE_FORMAT);
    const date_format = this.dateformat.transformToMonthlyDate(date);
    this.remholdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.wordProcessor.getProjectMesssages('HOLIDAY_DELETE').replace('[date]', date_format)
      }
    });
    this.remholdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteHolidays(id);
      }
    });
  }

  deleteHolidays(id) {
    // this.provider_servicesobj.deleteHoliday(id)
    this.provider_servicesobj.deleteUserHoliday(id)
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
    this.router.navigate(['/provider/' + this.domain + '/general->' + mod]);
  }

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
  redirecToUserSettings() {
    this.router.navigate(['provider', 'settings', 'general' , 'users' , this.userId , 'settings']);
  }
}
