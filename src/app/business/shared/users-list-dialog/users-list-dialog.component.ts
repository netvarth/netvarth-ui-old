import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-users-list-dialog',
  templateUrl: './users-list-dialog.component.html',
  styleUrls: ['./users-list-dialog.component.css']
})
export class UsersListDialogComponent implements OnInit {

  user_list: any;
  former_chosen_users: any = [];

  selectedUsers: any = [];

  constructor(public dialogRef: MatDialogRef<UsersListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {
    this.former_chosen_users = this.data.users;



  }

  ngOnInit(): void {
    this.getUsers();

  }

  getUsers() {
    this.provider_services.getUsers().subscribe(
      (data: any) => {
        this.user_list = data;
      },

      (error: any) => {
       //  this.wordProcessor.apiErrorAutoHide(this, error);
      });
  }
  close() {
    this.dialogRef.close();
  }
  onUserChange(event) {
    console.log(event);
  }
  onConfirm(userObject) {
    const selected_user_obj = userObject.selected.map(user => user.value);
    const result = selected_user_obj.map(a => a.id);
    this.dialogRef.close(result);

  }
  isSelected(user) {
    if (this.former_chosen_users.some(e => e === user.id)) {
      /* former_chosen_services contains the service we're looking for */
      return true;
    } else {
      return false;
    }
  }
}
