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
  customers: any = [];
  customer_label;
  subscription: Subscription;
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor) {
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      if (message.ttype === 'todayWl') {
        this.todayWaitlists = message.data;
      }
      if (message.ttype === 'futureWl') {
        this.futureWaitlists = message.data;
      }
      if (message.ttype === 'todayAppt') {
        this.todayAppts = message.data;
      }
      if (message.ttype === 'futureAppt') {
        this.futureAppts = message.data;
      }
      this.newWaitlists = [];
      this.newAppts = [];
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
    this.getTodayAppts();
    this.getTodayWatilists();
    this.getCustomers();
    this.getProviderSettings();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
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
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.todayAppts = data;
          this.todayAppts.map((obj) => {
            obj.type = 1;
            return obj;
          });
          this.getFutureAppts(filter);
        });
  }
  getFutureAppts(filter) {
    this.provider_services.getFutureAppointments(filter)
      .subscribe(
        (data: any) => {
          this.futureAppts = data;
          this.futureAppts.map((obj) => {
            obj.type = 2;
            return obj;
          });
          this.newAppts = this.todayAppts.concat(this.futureAppts);
        });
  }
  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.todayWaitlists = data;
          this.getFutureWatilists(filter);
        });
  }
  getFutureWatilists(filter) {
    this.provider_services.getFutureWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.futureWaitlists = data;
          this.newWaitlists = this.todayWaitlists.concat(this.futureWaitlists);
        });
  }
  getCustomers() {
    this.provider_services.getProviderCustomers()
      .subscribe(
        data => {
          this.customers = data;
        });
  }
}
