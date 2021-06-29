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
  bills: any = [];
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService) { }

  ngOnInit(): void {
    this.getProviderSettings();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getViews();
    if (this.active_user.accountType === 'BRANCH') {
      this.getUsers();
    }
    this.getConsumerBills();
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
      console.log(this.users);
    });
  }
  getViews() {
    this.provider_services.getCustomViewList().subscribe(data => {
      this.views = data;
    });
  }
  getConsumerBills() {
    this.provider_services.getProviderBills().subscribe(data => {
      this.bills = data;
    })
  }
}
