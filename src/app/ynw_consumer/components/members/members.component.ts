import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { AddMembersHolderComponent } from '../../components/add-members-holder/add-members-holder.component';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-consumer-members',
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit, OnDestroy {

  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  add_fam_memb_cap = Messages.ADD_FAMILY_MEMBER;
  first_name_cap = Messages.FIRST_NAME_CAP;
  last_name_cap = Messages.LAST_NAME_CAP;
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  gender_cap = Messages.GENDER_CAP;
  date_of_birth = Messages.DOB_CAP;
  edit_btn_cap = Messages.EDIT_BTN;
  delete_btn_cap = Messages.DELETE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_password_cap = Messages.CHANGE_PASSWORD_CAP;
  change_mob_no_cap = Messages.CHANGE_MOB_CAP;
  add_change_email_cap = Messages.ADD_CHANGE_EMAIL;
  curtype;
  member_list: any = [];
  query_executed = false;
  emptyMsg = 'No Family members added yet';
  private subs = new SubSink();
  customId: any;
  accountId: any;
  constructor(private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    public translate: TranslateService,
    private location: Location,
    public router: Router,
    private activated_route: ActivatedRoute
  ) {
    this.subs.sink = this.activated_route.queryParams.subscribe(qparams => {
      if (qparams && qparams.accountId) {
        this.accountId = qparams.accountId;
      }
      if (qparams && qparams.customId) {
        this.customId = qparams.customId;
      }
    });
  }

  ngOnInit() {
    this.translate.use(JSON.parse(localStorage.getItem('myData')))  
    this.translate.stream('DASHBOARD_TITLE').subscribe(v => {this.dashboard_cap=v});
    this.translate.stream('FIRST_NAME_CAP').subscribe(v=> {this.first_name_cap=v});
    this.translate.stream('LAST_NAME_CAP').subscribe(lastname=>{ this.last_name_cap=lastname});
    this.translate.stream('GENDER_CAP').subscribe(v=>{this.gender_cap=v});
    this.translate.stream('RELATED_LINKS').subscribe(v => {this.related_links_cap = v});
    this.translate.stream('CHANGE_PASSWORD_CAP').subscribe(v=> {this.change_password_cap = v});
    this.translate.stream('CHANGE_MOB_CAP').subscribe(v=>{this.change_mob_no_cap = v});
    this.translate.stream('DOB_CAP').subscribe(v=>{this.date_of_birth=v});
    this.translate.stream('EDIT_BTN').subscribe(v=> {this.edit_btn_cap=v});
    this.translate.stream('DELETE_BTN').subscribe(v=>{this.delete_btn_cap=v});
    this.translate.stream('USER_PROF_CAP').subscribe(v=>this.user_profile_cap=v);

    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.getMembers();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getMembers() {
    this.subs.sink = this.consumer_services.getMembers()
      .subscribe(
        data => {
          this.member_list = data;
          this.query_executed = true;
        },
        () => {
        }
      );
  }
  goBack() {
    this.location.back();
  }
  doRemoveMember(member) {
    if (!member.user) {
      return false;
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to delete this Member?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeMember(member.user);
      }
    });
  }
  removeMember(id) {
    this.subs.sink = this.consumer_services.deleteMember(id)
      .subscribe(
        () => {
          this.getMembers();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  addMember() {
    const dialogRef = this.dialog.open(AddMembersHolderComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: 'add',
        moreparams: { source: 'memberadd' }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getMembers();
      }
    });
  }
  editMember(member) {
    const dialogRef = this.dialog.open(AddMembersHolderComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        member: member,
        type: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getMembers();
      }
    });
  }
  redirectto(mod, usertype) {
    let queryParams = {};
    if (this.customId) {
      queryParams['customId'] = this.customId;
    }
    if (this.accountId) {
      queryParams['accountId'] = this.accountId;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    switch (mod) {
      case 'profile':
        this.router.navigate([usertype, 'profile'], navigationExtras);
        break;
      case 'change-password':
        this.router.navigate([usertype, 'change-password'], navigationExtras);
        break;
      case 'change-mobile':
        this.router.navigate([usertype, 'change-mobile'], navigationExtras);
        break;
      case 'dashboard':
        this.router.navigate([usertype], navigationExtras);
        break;
    }
  }
}
