import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-users-list-dialog',
  templateUrl: './users-list-dialog.component.html',
  styleUrls: ['./users-list-dialog.component.css']
})
export class UsersListDialogComponent implements OnInit,OnDestroy {

  user_list: any;
  former_chosen_users: any = [];

  selectedUsers: any = [];
loading=true;
subscription:Subscription;
  mode: any;
  constructor(public dialogRef: MatDialogRef<UsersListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {
    this.former_chosen_users = this.data.users;
    this.mode=this.data.mode;


  }

  ngOnInit(): void {
    this.getUsers();

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  getUsers() {
   this.subscription= this.provider_services.getUsers().subscribe(
      (data: any) => {
        this.user_list = data.filter(obj=>obj.userType==='PROVIDER');
        this.loading=false;
      },

      (error: any) => {
      this.loading=false;
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
