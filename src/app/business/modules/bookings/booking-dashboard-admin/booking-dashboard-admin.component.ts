import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-dashboard-admin',
  templateUrl: './booking-dashboard-admin.component.html',
  styleUrls: ['./booking-dashboard-admin.component.css']
})
export class BookingDashboardAdminComponent implements OnInit {
  waitlistMgrSettings;
  views: any = [];
  active_user;
  users: any = [];
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService) { }

  ngOnInit(): void {
    this.getProviderSettings();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getViews();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
  getUsers() {
    const apiFilter = {};
    apiFilter['userType-eq'] = 'PROVIDER';
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      if (this.active_user.adminPrivilege) {
        for (let i = 0; i < this.users.length; i++) {
          this.views.push(this.users[i]);
        }
      }
      console.log('view', this.views);
    });
  }
  getViews() {
    this.provider_services.getCustomViewList().subscribe(data => {
      this.views = data;
      if (this.active_user.accountType === 'BRANCH') {
        this.getUsers();
      }
    });
  }
}
