import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { AddMemberComponent } from '../../../shared/modules/add-member/add-member.component';
import { AddMembersHolderComponent } from '../../components/add-members-holder/add-members-holder.component';
// import { AddMemberComponent } from '../add-member/add-member.component';

@Component({
  selector: 'app-consumer-members',
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit {

  member_list: any = [] ;
  query_executed = false;
  breadcrumbs_init = [
    {
      title: 'Dashboard',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    },
    {
      title: 'Family Members',
      // url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/members'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  emptyMsg = 'No Family members added yet';

  constructor( private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
  private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {

    this.consumer_services.getMembers()
    .subscribe(
      data => {
          this.member_list = data;
          this.query_executed = true;
      },
      error => {

      }
    );

  }

  doRemoveMember(member) {

        if (!member.user) {
          return false;
        }

        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass : ['consumerpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message' : 'Do you really want to delete this Member?'
          }
        });

        dialogRef.afterClosed().subscribe(result => {

          if (result) {
             this.removeMember(member.user);
          }

        });

  }

  removeMember(id) {
    this.consumer_services.deleteMember(id)
    .subscribe(
      data => {
        this.getMembers();
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  addMember() {
    const dialogRef = this.dialog.open(AddMembersHolderComponent, {
      width: '50%',
      panelClass: 'consumerpopupmainclass',
      disableClose: true,
      data: {
        type : 'add',
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
      panelClass: 'consumerpopupmainclass',
      disableClose: true,
      data: {
        member : member,
        type : 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getMembers();
      }
    });
  }


}
