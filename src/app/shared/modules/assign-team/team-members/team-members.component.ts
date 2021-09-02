import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  users_list: any = [];
  constructor(
    public dialogRef: MatDialogRef<TeamMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    if (data.userData) {
      if (data.userData.users) {
        this.users_list = data.userData.users;
      } else {
        this.users_list = data.userData
      }
    }
    // this.users_list = data.userData.users;
    console.log(this.users_list);
  }

  ngOnInit(): void {
  }
  getUserImg(user) {
    if (user.profilePicture) {
      const proImage = user.profilePicture;
      return proImage.url;
    }
    else if (user.gender === 'male') {
      return '../../../.././assets/images/Asset1@300x.png';
    }
    else if (user.gender === 'female') {
      return '../../../.././assets/images/Asset2@300x.png';
    }
    else {
      return '../../../.././assets/images/Asset1@300x(1).png';
    }
  }
}