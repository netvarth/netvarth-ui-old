import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfilePopupComponent } from '../shared/components/update-profile-popup/update-profile-popup.component';
import { SharedServices } from '../shared/services/shared-services';
import { GroupStorageService } from '../shared/services/group-storage.service';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html'
})
export class ConsumerComponent implements OnInit {
  // title = 'consumer';
  constructor(public shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    public shared_services: SharedServices) {
    this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
  }
  userProfile: any = [];
  ngOnInit() {
    this.getProfile();
  }
  getProfile() {
    this.shared_functions.getProfile()
      .then(
        (data: any) => {
          this.userProfile = data;
          if (this.userProfile.userProfile.firstName === 'undefined' && this.userProfile.userProfile.lastName === 'undefined') {
            this.updateProfilePopup();
          }
        });
  }
  updateProfilePopup() {
    const dialogref = this.dialog.open(UpdateProfilePopupComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
          this.updateProfile(result);
        }
      });
  }
  updateProfile(data) {
    const post_data = {
      // 'id': this.userProfile.id,
      'firstName': data.firstName,
      'lastName': data.lastName
    };
    this.shared_services.updateProfile(post_data, 'consumer')
      .subscribe(
        () => {
          const curuserdetexisting = this.groupService.getitemFromGroupStorage('ynw-user');
          curuserdetexisting['userName'] = data.firstName + ' ' + data.lastName;
          curuserdetexisting['firstName'] = data.firstName;
          curuserdetexisting['lastName'] = data.lastName;
          this.groupService.setitemToGroupStorage('ynw-user', curuserdetexisting);
          const pdata = { 'ttype': 'updateuserdetails' };
          this.shared_functions.sendMessage(pdata);
        });
  }
}
