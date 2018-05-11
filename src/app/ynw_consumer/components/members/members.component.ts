import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { AddMemberComponent } from '../add-member/add-member.component';

@Component({
  selector: 'app-consumer-members',
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit {

  member_list: any = [] ;

  constructor( private consumer_services: ConsumerServices,
  private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {

    this.consumer_services.getMembers()
    .subscribe(
      data => {
          this.member_list = data;
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
          data: {
            'message' : 'Do you really want to remove this Member?'
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

      }
    );
  }

  addMember() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '50%',
      data: {
        /*member : this.member_list[0],*/
        type : 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMembers();
    });
  }

  editMember(member) {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '50%',
      data: {
        member : member,
        type : 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMembers();
    });
  }


}
