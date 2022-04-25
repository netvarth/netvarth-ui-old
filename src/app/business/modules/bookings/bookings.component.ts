import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  admin = false;
  providerId;
  constructor(private groupService: GroupStorageService) { }

  ngOnInit(): void {
    const userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    if (userDet.accountType === 'BRANCH') {
      if (userDet.adminPrivilege || userDet.userType === 5) {
        this.admin = true;
      } else {
        this.providerId = userDet.id;
      }
    }
  }
}
