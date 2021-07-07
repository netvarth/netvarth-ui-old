import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking-dashboard',
  templateUrl: './booking-dashboard.component.html',
  styleUrls: ['./booking-dashboard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class BookingDashboardComponent implements OnInit {
  waitlistMgrSettings;
  todayAppts: any = [];
  futureAppts: any = [];
  newAppts: any = [];
  todayWaitlists: any = [];
  futureWaitlists: any = [];
  newWaitlists: any = [];
  bname;
  bills: any = [];
  userData;
  providerId;
  userDetails;
  customer_label;
  customers: any = [];
  subscription: Subscription
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions,
    private locationobj: Location) {
    this.activated_route.params.subscribe(params => {
      if (params.userid) {
        this.providerId = JSON.parse(params.userid);
        this.getUserData();
      }
    });
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'todayWl':
          this.todayWaitlists = this.todayWaitlists.concat(message.data);
          break;
        case 'futureWl':
          this.futureWaitlists = this.futureWaitlists.concat(message.data);
          break;
        case 'todayAppt':
          this.todayWaitlists = this.todayWaitlists.concat(message.data);
          break;
        case 'futureAppt':
          this.futureWaitlists = this.futureWaitlists.concat(message.data);
          break;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    if (bdetails) {
      if (this.userData.accountType === 'BRANCH' && this.userData.userType !== 2) {
        this.bname = this.userData.userName || 'User';
      } else {
        this.bname = bdetails.bn || 'User';
      }
    }
    this.getTodayWatilists().then(data => {
      this.getFutureWatilists().then(data => {
        this.getTodayAppts().then(data => {
          this.getFutureAppts().then(data => {
            this.newWaitlists = this.todayWaitlists.concat(this.futureWaitlists);
            this.newAppts = this.todayAppts.concat(this.futureAppts);
          });
        });
      });
    });
    this.getProviderSettings();
    this.getProviderBills();
    this.getCustomers();
  }
  getUserData() {
    this.provider_services.getUser(this.providerId)
      .subscribe(
        res => {
          this.userDetails = res;
          this.bname = (this.userDetails.businessName) ? this.userDetails.businessName : this.userDetails.firstName + ' ' + this.userDetails.lastName;
        });
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistMgrSettings = data;
      });
  }
  setApptFilters() {
    const filter = {
      'apptStatus-neq': 'prepaymentPending,failed'
    };
    return filter;
  }
  getTodayAppts() {
    return new Promise((resolve) => {
      const filter = this.setApptFilters();
      this.provider_services.getTodayAppointments(filter)
        .subscribe(
          (data: any) => {
            this.todayAppts = data;
            resolve(data);
          });
    });
  }
  getFutureAppts() {
    return new Promise((resolve) => {
      const filter = this.setApptFilters();
      this.provider_services.getFutureAppointments(filter)
        .subscribe(
          (data: any) => {
            this.futureAppts = data;
            resolve(data);
          });
    });
  }
  setWaitlistFilters() {
    const filter = {
      'waitlistStatus-neq': 'prepaymentPending,failed'
    };
    return filter;
  }
  getTodayWatilists() {
    return new Promise((resolve) => {
      const filter = this.setWaitlistFilters();
      this.provider_services.getTodayWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.todayWaitlists = data;
            resolve(data);
          });
    });
  }
  getFutureWatilists() {
    return new Promise((resolve) => {
      const filter = this.setWaitlistFilters();
      this.provider_services.getFutureWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.futureWaitlists = data;
            resolve(data);
          });
    });
  }

  getProviderBills() {
    let filter = {};
    if (this.providerId) {
      filter = { 'provider-eq': this.providerId };
    }
    this.provider_services.getProviderBills(filter).subscribe(data => {
      this.bills = data;
    })
  }
  getCustomers() {
    this.provider_services.getProviderCustomers()
      .subscribe(
        data => {
          this.customers = data;
        });
  }
  getUserImg() {
    if (this.userDetails && this.userDetails.profilePicture) {
      return this.userDetails.profilePicture.url;
    }
    return 'assets/images/Asset1@300x(1).png';
  }
  goBack() {
    this.locationobj.back();
  }
}
