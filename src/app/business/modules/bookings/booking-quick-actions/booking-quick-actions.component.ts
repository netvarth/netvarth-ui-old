import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-quick-actions',
  templateUrl: './booking-quick-actions.component.html',
  styleUrls: ['./booking-quick-actions.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class BookingQuickActionsComponent implements OnInit {
  showToken = false;
  quickActions: any = [
    {
      name: 'appt',
      displayName: 'New Appt',
      class: 'appt-icon'
    }, {
      name: 'token',
      displayName: 'New Token',
      class: 'token-icon'
    }, {
      name: 'qManager',
      displayName: 'Q Mgr',
      class: 'appt-icon'
    }, {
      name: 'apptManager',
      displayName: 'Appt Mgr',
      class: 'appt-icon'
    }, {
      name: 'reports',
      displayName: 'reports',
      class: 'fa fa-file'
    }, {
      name: 'orderManager',
      displayName: 'order Manager',
      class: 'fa fa-shopping-cart'
    }];
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    this.getWaitlistMgr();
  }
  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
      .subscribe((data: any) => {
        this.showToken = data.showTokenId;
      });
  }
  apptClicked() {
    this.router.navigate(['provider', 'appointments', 'appointment'],
      { queryParams: { checkinType: 'WALK_IN_APPOINTMENT' } });
  }
  checkinClicked() {
    this.router.navigate(['provider', 'check-ins', 'add'],
      { queryParams: { waitlistMode: 'WALK_IN_CHECKIN' } });
  }
  actionClicked(action) {
    if (action === 'appt') {
      this.apptClicked();
    } else if (action === 'token') {
      this.checkinClicked();
    } else if (action === 'qManager') {
      this.router.navigate(['provider', 'settings', 'q-manager']);
    } else if (action === 'apptManager') {
      this.router.navigate(['provider', 'settings', 'appointmentmanager']);
    } else if (action === 'reports') {
      this.router.navigate(['provider', 'reports']);
    } else if (action === 'orderManager') {
      this.router.navigate(['provider', 'settings', 'ordermanager']);
    }
  }
  addActions() {

  }
  selectAction(action) {

  }
}
