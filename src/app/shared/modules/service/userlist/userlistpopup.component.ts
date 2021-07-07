import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-userlistpopup',
  templateUrl: './userlistpopup.component.html'
})
export class UserlistpopupComponent implements OnInit {
  order: any = [];
  displayusers: any= [];
    users: any;
    userslist: any;
  constructor(
    public dialogRef: MatDialogRef<UserlistpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.users = this.data.ids;
    this.userslist = this.data.userlist
    console.log(this.users);
    for (let user of this.users) {
        let details = this.userslist.filter(usr => usr.id == user);
        if (details && details.length > 0) {
            this.displayusers.push(details[0].firstName + ' ' + details[0].lastName );
        }
    }  
  }
  ngOnInit() {
    //this.locationMessage = this.medicine.instructions;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
