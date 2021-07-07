import { Component, Input, OnInit } from '@angular/core';
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
  todayOrders: any = [];
  futureOrders: any = [];
  newOrders: any = [];
  donations: any = [];
  customers: any = [];
  bname;
  bills: any = [];
  userData;
  @Input() providerId;
  userDetails;
  customer_label;
  subscription: Subscription;
  admin = false;
  qParams;
  nextWaitlist;
  nextAppt;
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions,
    private locationobj: Location) {
    this.activated_route.params.subscribe(params => {
      this.qParams = params;
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
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.userData.accountType !== 'BRANCH') {
      this.admin = true;
      this.getCustomers();
      this.getDonations();
    }
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
                if (!this.qParams.userid) {
                this.groupService.setitemToGroupStorage('newWaitlists', this.newWaitlists);
                this.groupService.setitemToGroupStorage('newAppts', this.newAppts);
                }
              });
            });
          });
        });
      });
    });
    this.getProviderSettings();
    this.getProviderBills();
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
    let filter = {};
    filter['apptStatus-neq'] = 'prepaymentPending,failed';
    if (this.providerId) {
      filter['provider-eq'] = this.providerId ;
    }
    return filter;
  }
  getTodayAppts() {
    return new Promise((resolve) => {
      const filter = this.setApptFilters();
      this.provider_services.getTodayAppointments(filter)
        .subscribe(
          (data: any) => {
            this.todayAppts = data;
            if (this.todayAppts[0]) {
              this.nextAppt = this.todayAppts[0];
            }
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
    let filter = {};
    filter['waitlistStatus-neq'] =  'prepaymentPending,failed';
    if (this.providerId) {
      filter['provider-eq'] = this.providerId ;
    }
    return filter;
  }
  getTodayWatilists() {
    return new Promise((resolve) => {
      const filter = this.setWaitlistFilters();
      this.provider_services.getTodayWaitlist(filter)
        .subscribe(
          (data: any) => {
            this.todayWaitlists = data;
            if (this.todayWaitlists[0]) {
              this.nextWaitlist = this.todayWaitlists[0];
            }
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
  getProviderBills() {
    let filter = {};
    if (this.providerId) {
      filter = { 'provider-eq': this.providerId };
    }
    this.provider_services.getProviderBills(filter).subscribe(data => {
      this.bills = data;
    })
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
