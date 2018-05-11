import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { AddProviderMemberComponent } from '../add-provider-member/add-provider-member.component';

@Component({
  selector: 'app-provider-members',
  templateUrl: './provider-members.component.html'
})
export class ProviderMembersComponent implements OnInit {

    member_list: any = [] ;
    query_executed = false;

    constructor( private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog) {}

    ngOnInit() {
      this.getMembers();
    }

    getMembers() {
      const userdet = JSON.parse(localStorage.getItem('ynw-user'));
      this.provider_servicesobj.getMembers(userdet.id)
        .subscribe (data => {
            this.member_list = data;
            this.query_executed = true;
        });
    }

    addMember() {
      const dialogRef = this.dialog.open(AddProviderMemberComponent, {
        width: '50%',
        data: {
          member : this.member_list[0],
          type : 'add'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if ( result.respose === 'reloadlist') {
          this.getMembers();
        }
      });
    }

}
