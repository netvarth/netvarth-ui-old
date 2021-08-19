import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  qParams;
  nextWaitlist;
  nextAppt;
  nextOrder;
  active_user;
  settings;
  bdetails;
  blogo;
  admin = false;
  loading = true;
  locations: any = [];
  selected_location;
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions,
    private router: Router,
    private locationobj: Location) {
    this.activated_route.params.subscribe(params => {
      this.qParams = params;
      if (params.userid) {
        this.providerId = JSON.parse(params.userid);
        this.getUserData();
      }
    });
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
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
    this.selected_location = this.groupService.getitemFromGroupStorage('loc_id');
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.settings = this.groupService.getitemFromGroupStorage('settings');
    this.bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.userData.accountType !== 'BRANCH' || (this.userData.accountType === 'BRANCH' && this.userData.adminPrivilege)) {
      this.getCustomers();
      this.admin = true;
    }
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    if (this.bdetails) {
      if (this.userData.accountType === 'BRANCH' && !this.userData.adminPrivilege) {
        this.bname = this.userData.userName || 'User';
        this.getUserData();
      } else {
        this.bname = this.bdetails.bn || 'User';
        this.blogo = this.bdetails.logo || 'assets/images/img-null.svg';
      }
    }
    this.getProviderLocations();
    this.getProviderSettings();
    this.getProviderBills();
  }
  initDashboard() {
    if (this.userData.accountType !== 'BRANCH') {
      this.getDonations();
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
                setTimeout(() => {
                  this.loading = false;
                }, 500);
              });
            });
          });
        });
      });
    });
  }
  getUserData() {
    this.provider_services.getUser(this.providerId)
      .subscribe(
        res => {
          this.userDetails = res;
          this.bname = (this.userDetails.businessName) ? this.userDetails.businessName : this.userDetails.firstName + ' ' + this.userDetails.lastName;
          if (this.userDetails.profilePicture && this.userDetails.profilePicture.url) {
            this.blogo = this.userDetails.profilePicture.url;
          } else {
            if (this.qParams.userid) {
              this.blogo = 'assets/images/Asset1@300x(1).png';
            } else {
              this.blogo = this.bdetails.logo || 'assets/images/img-null.svg';
            }
          }
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
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0) {
        filter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.providerId;
      } else {
        filter['provider-eq'] = this.providerId;
      }
    }
    if (this.selected_location && this.selected_location.id) {
      filter['location-eq'] = this.selected_location.id;
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
    let filter = {};
    filter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    if (this.providerId) {
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0) {
        filter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.providerId;
      } else {
        filter['provider-eq'] = this.providerId;
      }
    }
    if (this.selected_location) {
      filter['location-eq'] = this.selected_location.id;
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
          if (this.todayOrders[0]) {
            this.nextOrder = this.todayOrders[0];
          }
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
    let filter = {};
    if (this.selected_location) {
      filter['location-eq'] = this.selected_location.id;
    }
    this.provider_services.getDonations(filter)
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
  goBack() {
    this.locationobj.back();
  }
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(
        (data: any) => {
          const locations = data;
          this.locations = locations.filter(location => location.status === 'ACTIVE');
          if (!this.groupService.getitemFromGroupStorage('loc_id')) {
            this.selected_location = this.locations[0];
            this.groupService.setitemToGroupStorage('loc_id', this.selected_location);
          }
          this.initDashboard();
        });
  }
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  onChangeLocationSelect(location) {
    this.selected_location = location;
    this.groupService.setitemToGroupStorage('loc_id', this.selected_location);
    this.initDashboard();
  }
}
