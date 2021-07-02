import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

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
    private shared_functions: SharedFunctions) {
    this.activated_route.params.subscribe(params => {
      if (params.userid) {
        this.providerId = JSON.parse(params.userid);
        this.getUserData();
      }
    });
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      if (message.ttype === 'todayWl') {
        this.todayWaitlists = message.data;
        if (this.providerId) {
          this.todayWaitlists = this.todayWaitlists.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      if (message.ttype === 'futureWl') {
        this.futureWaitlists = message.data;
        if (this.providerId) {
          this.futureWaitlists = this.futureWaitlists.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      if (message.ttype === 'todayAppt') {
        this.todayAppts = message.data;
        if (this.providerId) {
          this.todayAppts = this.todayAppts.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
      }
      if (message.ttype === 'futureAppt') {
        this.futureAppts = message.data;
        if (this.providerId) {
          this.futureAppts = this.futureAppts.filter(waitlist => waitlist.provider && waitlist.provider.id === this.providerId);
        }
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
    this.getTodayAppts();
    this.getTodayWatilists();
    this.getProviderSettings();
    this.getProviderBills();
    this.getCustomers();
  }
  getUserData() {
    this.provider_services.getUser(this.providerId)
      .subscribe(
        res => {
          this.userDetails = res;
          this.bname = (this.userData.businessName) ? this.userData.businessName : this.userData.firstName + ' ' + this.userData.lastName;
        });
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
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
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
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
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
}
