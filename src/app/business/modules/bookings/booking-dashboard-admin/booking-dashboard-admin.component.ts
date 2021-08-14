import { Component, OnInit } from '@angular/core';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-booking-dashboard-admin',
  templateUrl: './booking-dashboard-admin.component.html',
  styleUrls: ['./booking-dashboard-admin.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class BookingDashboardAdminComponent implements OnInit {
  waitlistMgrSettings;
  active_user;
  users: any = [];
  bills: any = [];
  provider_label = '';
  todayAppts: any = [];
  futureAppts: any = [];
  newAppts: any = [];
  todayWaitlists: any = [];
  futureWaitlists: any = [];
  newWaitlists: any = [];
  todayOrders: any = [];
  futureOrders: any = [];
  newOrders: any = [];
  donations: any = [];
  customers: any = [];
  customer_label;
  subscription: Subscription;
  loading = true;
  nextWaitlist;
  nextAppt;
  settings;
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor) {
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'todayWl':
          this.todayWaitlists = this.todayWaitlists.concat(message.data);
          break;
        case 'futureWl':
          this.futureWaitlists = this.futureWaitlists.concat(message.data);
          break;
        case 'todayAppt':
          this.todayAppts = this.todayAppts.concat(message.data);
          break;
        case 'futureAppt':
          this.futureAppts = this.futureAppts.concat(message.data);
          break;
      }
      this.newWaitlists = this.todayWaitlists.concat(this.futureWaitlists);
      this.newAppts = this.todayAppts.concat(this.futureAppts);
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.settings = this.groupService.getitemFromGroupStorage('settings');
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getProviderSettings();
    this.getTodayWatilists().then(data => {
      this.getFutureWatilists().then(data => {
        this.getTodayAppts().then(data => {
          this.getFutureAppts().then(data => {
            this.getTodayOrders().then(data => {
              this.getFutureOrders().then(data => {
                this.todayAppts.map((obj) => {
                  obj.type = 1;
                  return obj;
                });
                this.futureAppts.map((obj) => {
                  obj.type = 2;
                  return obj;
                });
                this.todayWaitlists.map((obj) => {
                  obj.type = 1;
                  return obj;
                });
                this.futureWaitlists.map((obj) => {
                  obj.type = 2;
                  return obj;
                });
                this.newWaitlists = this.todayWaitlists.concat(this.futureWaitlists);
                this.newAppts = this.todayAppts.concat(this.futureAppts);
                this.newOrders = this.todayOrders.concat(this.futureOrders);
                this.loading = false;
                this.groupService.setitemToGroupStorage('newWaitlists', this.newWaitlists);
                this.groupService.setitemToGroupStorage('newAppts', this.newAppts);
              });
            });
          });
        });
      });
    });
    this.getCustomers();
    this.getDonations();
    this.getProviderSettings();
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
    });
  }
  getConsumerBills() {
    this.provider_services.getProviderBills().subscribe(data => {
      this.bills = data;
    })
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
            this.nextAppt = this.todayAppts.filter(waitlist => waitlist.apptStatus === 'Confirmed' || waitlist.apptStatus === 'Arrived');
            this.nextAppt = this.nextAppt[0];
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
            this.nextWaitlist = this.todayWaitlists.filter(waitlist => waitlist.waitlistStatus === 'checkedIn' || waitlist.waitlistStatus === 'arrived');
            this.nextWaitlist = this.nextWaitlist[0];
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
  getTodayOrders() {
    return new Promise((resolve) => {
      this.provider_services.getProviderTodayOrders()
        .subscribe(data => {
          this.todayOrders = data;
          resolve(data);
        });
    });
  }
  getFutureOrders() {
    return new Promise((resolve) => {
      this.provider_services.getProviderFutureOrders().subscribe(data => {
        this.futureOrders = data;
        resolve(data);
      });
    });
  }
  getCustomers() {
    this.provider_services.getProviderCustomers()
      .subscribe(
        data => {
          this.customers = data;
        });
  }
  getDonations() {
    this.provider_services.getDonations()
      .subscribe(
        data => {
          this.donations = data;
        });
  }
}
