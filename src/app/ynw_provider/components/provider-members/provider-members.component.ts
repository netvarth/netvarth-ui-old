import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { AddProviderMemberComponent } from '../add-provider-member/add-provider-member.component';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-members',
  templateUrl: './provider-members.component.html'
})
export class ProviderMembersComponent implements OnInit {

  first_name = Messages.FIRST_NAME_CAP;
  last_name = Messages.LAST_NAME_CAP;
  mobile_num_cap = Messages.MOBILE_NUMBER_CAP;
  add_btn = Messages.ADD_BTN;
  family_member = Messages.FAMILY_MEMEBER;
  member_list: any = [];
  query_executed = false;

  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog, private shared_functions: SharedFunctions) { }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    const userdet = this.shared_functions.getitemfromSessionStorage('ynw-user');
    this.provider_servicesobj.getMembers(userdet.id)
      .subscribe(data => {
        this.member_list = data;
        this.query_executed = true;
      });
  }

  addMember() {
    const dialogRef = this.dialog.open(AddProviderMemberComponent, {
      width: '50%',
      data: {
        member: this.member_list[0],
        type: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.respose === 'reloadlist') {
        this.getMembers();
      }
    });
  }

}
