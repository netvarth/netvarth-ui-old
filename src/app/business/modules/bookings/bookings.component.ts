import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {
  userDet;
  constructor(private groupService: GroupStorageService) { }

  ngOnInit(): void {
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
  }

}
