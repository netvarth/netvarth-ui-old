import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-quick-actions',
  templateUrl: './booking-quick-actions.component.html',
  styleUrls: ['./booking-quick-actions.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
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
      class: 'appt-icon'
    }, {
      name: 'mr',
      displayName: 'MR',
      class: 'appt-icon'
    }];
  selectedActions: any = [];
  selectedActionsTemp: any = [];
  @ViewChild('closebutton') closebutton;
  loading = true;
  constructor(private provider_services: ProviderServices,
    private router: Router,
    private groupService: GroupStorageService) { }

  ngOnInit(): void {
    if (this.groupService.getitemFromGroupStorage('actions')) {
      this.selectedActions = this.groupService.getitemFromGroupStorage('actions');
      this.loading = false;
    } else {
      this.selectedActions = this.quickActions.slice(0, 2);
      this.groupService.setitemToGroupStorage('actions', this.selectedActions);
      this.loading = false;
    }
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
  addShortcutClicked() {
    this.selectedActionsTemp = this.selectedActions;
  }
  selectAction(action) {
    const selAction = this.selectedActionsTemp.filter(act => act.name === action.name);
    const index = (selAction[0]) ? this.selectedActionsTemp.indexOf(selAction[0]) : -1;
    if (index === -1) {
      this.selectedActionsTemp.push(action);
    } else {
      this.selectedActionsTemp.splice(index, 1);
    }
    this.selectedActions = this.groupService.getitemFromGroupStorage('actions');
  }
  isSelected(action) {
    const selAction = this.selectedActionsTemp.filter(act => act.name === action.name);
    if (selAction[0]) {
      return true;
    } else {
      return false;
    }
  }
  addActions() {
    this.selectedActions = this.selectedActionsTemp;
    this.groupService.setitemToGroupStorage('actions', this.selectedActions);
    this.closebutton.nativeElement.click();
  }
  actionClicked(action) {
    console.log('action', action)
    if (action === 'appt') {
      this.apptClicked();
    } else if (action === 'token') {
      this.checkinClicked();
    } else if (action === 'qManager') {
      this.router.navigate(['provider', 'settings']);
    } else if (action === 'apptManager') {
      this.router.navigate(['provider', 'settings']);
    } else if (action === 'reports') {
      this.router.navigate(['provider', 'settings']);
    } else if (action === 'mr') {
      this.router.navigate(['provider', 'settings']);
    }
  }
}
