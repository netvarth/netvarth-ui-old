import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Subscription } from 'rxjs/Subscription';
import { Messages } from '../../../shared/constants/project-messages';
@Component({
  selector: 'app-provider-waitlist',
  templateUrl: './provider-waitlist-component.html'
})
export class ProviderWaitlistComponent implements OnInit, OnDestroy {
  accept_online_cap = Messages.WAITLIST_ACCEPT_ONLINE_CAP;
  locations_cap = Messages.WAITLIST_LOCATIONS_CAP;
  services_cap = Messages.WAITLIST_SERVICES_CAP;
  ser_time_windows_cap = Messages.SERVICE_TIME_CAP;
  bProfile = null;
  online_checkin = false;
  waitlist_manager: any = null;
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;
  instant_count: any = 0;
  departmentCount: any = 0;
  multipeLocationAllowed = false;
  locName;
  businessConfig: any = [];
  checkin_label = '';
  prevcheckstatus;
  loc_list: any = [];
  active_user;
  customer_label = '';
  loading = true;
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: Messages.WAITLIST_MANAGE_CAP
    }
  ];
  breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'checkinmanager', 'subKey': 'settings' };
  subscription: Subscription;
  isCheckin;
  futureDateWaitlist = false;
  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private router: Router,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private shared_services: SharedServices) {
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }
  frm_set_ser_cap = '';
  frm_set_loc_cap = Messages.FRM_LEVEL_SETT_LOC_MSG;
  frm_set_working_hr_cap = Messages.FRM_LEVEL_SETT_WORKING_HR_MSG;
  ngOnInit() {
    this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.loading = true;
    this.getBusinessProfile();
    this.getWaitlistMgr();
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getDepartmentsCount();
    this.getBusinessConfiguration();
    this.frm_set_ser_cap = Messages.FRM_LEVEL_SETT_SERV_MSG.replace('[customer]', this.customer_label);
    // Update from footer
    this.subscription = this.shared_functions.getMessage()
      .subscribe(
        data => {
          if (data.ttype === 'online_checkin_status') {
            this.getWaitlistMgr();
          }
        });
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  getWaitlistMgr() {
    this.loading = true;
    this.waitlist_manager = null;
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_manager = data;
          this.online_checkin = data['onlineCheckIns'];
          this.futureDateWaitlist = data['futureDateWaitlist'];
          this.provider_datastorage.set('waitlistManage', data);
        });
    this.loading = false;
  }
  getBusinessProfile() {
    this.loading = true;
    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bProfile = data;
          this.provider_datastorage.set('bProfile', data);

        });
    this.loading = false;
  }
  changAcceptOnlineCheckin(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.prevcheckstatus = (this.online_checkin) ? false : true;
    this.online_checkin = event.checked;
    this.setAcceptOnlineCheckin(is_check);
  }
  setAcceptOnlineCheckin(is_check) {
    this.provider_services.setAcceptOnlineCheckin(is_check)
      .subscribe(
        () => {
          this.getWaitlistMgr();
        },
        error => {
          this.online_checkin = this.prevcheckstatus;
        }
      );
  }
  goLocation() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'locations']);
  }
  goService() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'services']);
  }
  goQueue() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'queues']);
  }
  goDepartments() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'departments']);
  }
  getLocationCount() {
    this.loading = true;
    this.provider_services.getLocationCount()
      .subscribe(
        data => {
          this.location_count = data;
        });
    this.loading = false;
  }
  getServiceCount() {
    this.loading = true;
    this.provider_services.getServiceCount()
      .subscribe(
        data => {
          this.service_count = data;
        });
    this.loading = false;
  }
  getQueuesCount() {
    this.loading = true;
    this.provider_services.getQueuesCount()
      .subscribe(
        data => {
          this.queues_count = data;
        });
    this.loading = false;
  }

  getBusinessConfiguration() {
    this.loading = true;
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBussinessProfile();
      });
    this.loading = false;
  }
  getBussinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
            if (this.multipeLocationAllowed === true) {
              this.locName = this.shared_functions.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
            }
            if (this.multipeLocationAllowed === false) {
              this.locName = this.shared_functions.getProjectMesssages('WIZ_LOCATION_CAP');
            }
          }
        }
      });
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/learnmore/checkinmanager->' + mod]);
    // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    // this.shared_functions.sendMessage(pdata);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager', 'subKey': mod };
  //   return moreOptions;
  // }
  handle_waitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setAcceptOnlineCheckin(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Same day online check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getWaitlistMgr();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getWaitlistMgr();
        }
      );
  }

  handleFuturewaitlist(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setFutureCheckinStatus(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Future check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getWaitlistMgr();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getDepartmentsCount() {
    this.loading = true;
    this.provider_services.getDepartmentCount()
      .subscribe(
        data => {
          this.departmentCount = data;
        });
    this.loading = false;
  }
}
