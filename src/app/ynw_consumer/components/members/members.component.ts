import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { AddMembersHolderComponent } from '../../components/add-members-holder/add-members-holder.component';
// import { AddMemberComponent } from '../add-member/add-member.component';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-consumer-members',
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit,OnDestroy {
  
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
  breadcrumbs_init = [
    {
      title: 'Family Members',
      // url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/members'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  emptyMsg = 'No Family members added yet';
 private subs=new SubSink();
  constructor(private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private location: Location) { }

  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.getMembers();
  }
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }

  getMembers() {

    this.subs.sink=this.consumer_services.getMembers()
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
    this.subs.sink=this.consumer_services.deleteMember(id)
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


}
