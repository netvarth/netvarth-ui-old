import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-quick-actions',
  templateUrl: './booking-quick-actions.component.html',
  styleUrls: ['./booking-quick-actions.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class BookingQuickActionsComponent implements OnInit {
  showToken = false;
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
    console.log('appt');
    this.router.navigate(['provider', 'appointments', 'appointment'],
    { queryParams: { checkinType: 'WALK_IN_APPOINTMENT' } });
  }
  checkinClicked() {
    console.log('check');
    this.router.navigate(['provider', 'check-ins', 'add'],
    { queryParams: { waitlistMode: 'WALK_IN_CHECKIN' } });
  }
}
