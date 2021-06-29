import { Component, OnInit } from '@angular/core';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-dashboard',
  templateUrl: './booking-dashboard.component.html',
  styleUrls: ['./booking-dashboard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class BookingDashboardComponent implements OnInit {
  waitlistMgrSettings;
  loading = true;
  appts: any = [];
  bname;
  views: any = [];
  bills: any = [];
  userData;
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService) { }

  ngOnInit(): void {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log('this.userData', this.userData);
    if (bdetails) {
      if (this.userData.accountType === 'BRANCH' && this.userData.userType !== 2) {
        this.bname = this.userData.userName || 'User';
      } else {
        this.bname = bdetails.bn || 'User';
      }
    }
    this.getTodayAppts();
    this.getProviderSettings();
    this.getProviderBills();
    this.getViews();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }

  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.appts = data;
          this.appts.map((obj) => {
            obj.type = 1;
            return obj;
          });
          this.getFutureAppts();
        });
  }
  getFutureAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getFutureAppointments(filter)
      .subscribe(
        (data: any) => {
          data.map((obj) => {
            obj.type = 2;
            return obj;
          });
          this.appts = this.appts.concat(data);
          console.log(this.appts);
          this.loading = false;
        });
  }
  getViews() {
    this.provider_services.getCustomViewList().subscribe(data => {
      this.views = data;
    });
  }
  getProviderBills() {
    let filter = {};
    if (this.userData.accountType === 'BRANCH') {
      filter = { 'provider-eq': this.userData.id };
    }
    this.provider_services.getProviderBills(filter).subscribe(data => {
      this.bills = data;
    })
  }
}
