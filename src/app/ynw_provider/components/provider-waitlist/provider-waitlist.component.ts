import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Subscription, SubscriptionLike as ISubscription } from 'rxjs';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-waitlist',
  templateUrl: './provider-waitlist-component.html'
})

export class ProviderWaitlistComponent implements OnInit, OnDestroy {

  accept_online_cap = Messages.WAITLIST_ACCEPT_ONLINE_CAP;
  locations_cap = Messages.WAITLIST_LOCATIONS_CAP;
  services_cap = Messages.WAITLIST_SERVICES_CAP;
  ser_time_windows_cap = Messages.WAITLIST_SER_TIME_WINDOWS_CAP;

  bProfile = null;
  online_checkin = false;
  waitlist_manager: any = null;
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;
  multipeLocationAllowed = false;
  locName;
  businessConfig: any = [];
  checkin_label = '';
  prevcheckstatus;
  loc_list: any = [];

  customer_label = '';
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Waitlist Manager'
    }
  ];
  breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager' };

  subscription: Subscription;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private router: Router,
    private shared_functions: SharedFunctions,
    private shared_services: SharedServices) {
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  
  frm_set_ser_cap = '';
  frm_set_loc_cap = Messages.FRM_LEVEL_SETT_LOC_MSG;
  frm_set_working_hr_cap = Messages.FRM_LEVEL_SETT_WORKING_HR_MSG;

  ngOnInit() {
    this.getBusinessProfile();
    this.getWaitlistMgr();
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getBusinessConfiguration();

    
    this.frm_set_ser_cap = Messages.FRM_LEVEL_SETT_SERV_MSG.replace('[customer]',this.customer_label);

    // Update from footer
    this.subscription = this.shared_functions.getMessage()
      .subscribe(
        data => {
          if (data.ttype === 'online_checkin_status') {
            this.getWaitlistMgr();
          }
        },
        error => {

        }
      );


  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }



  getWaitlistMgr() {
    this.waitlist_manager = null;
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_manager = data;
          // this.online_checkin = data['enabledWaitlist'];
          this.online_checkin = data['onlineCheckIns'];

          // console.log(this.online_checkin);
          this.provider_datastorage.set('waitlistManage', data);
        },
        error => {

        }
      );

  }

  getBusinessProfile() {

    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bProfile = data;
          this.provider_datastorage.set('bProfile', data);

        },
        error => {

        }
      );

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
        data => {
          this.getWaitlistMgr();
        },
        error => {
          const snackBarRef = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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

  getLocationCount() {
    this.provider_services.getLocationCount()
      .subscribe(
        data => {
          this.location_count = data;
        },
        error => {

        }
      );
  }

  getServiceCount() {
    this.provider_services.getServiceCount()
      .subscribe(
        data => {
          this.service_count = data;

        },
        error => {

        }
      );
  }

  getQueuesCount() {

    this.provider_services.getQueuesCount()
      .subscribe(
        data => {
          this.queues_count = data;
        },
        error => {

        }
      );
  }

  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBussinessProfile();
      },
        error => {

        });
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
            if (this.multipeLocationAllowed == true) {
              this.locName = this.shared_functions.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
            }
            if (this.multipeLocationAllowed == false) {
              this.locName = this.shared_functions.getProjectMesssages('WIZ_LOCATION_CAP');
            }
          }
        }
      },
        error => {

        });
  }
  learnmore_clicked(mod, e) {
    /* const dialogRef = this.dialog.open(LearnmoreComponent, {
           width: '50%',
           panelClass: 'commonpopupmainclass',
           autoFocus: true,
           data: {
               moreOptions : this.getMode(mod)
           }
         });
         dialogRef.afterClosed().subscribe(result => {
         });*/
    e.stopPropagation();
    const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    this.shared_functions.sendMessage(pdata);
  }
  getMode(mod) {
    let moreOptions = {};
    moreOptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager', 'subKey': mod };
    return moreOptions;
  }
}
