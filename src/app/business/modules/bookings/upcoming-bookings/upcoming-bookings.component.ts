import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  @Input() nextWaitlist: any = [];
  @Input() nextAppt: any = [];
  @Input() nextOrder: any = [];
  @Input() admin;
  settings;
  providerId;
  constructor(private router: Router,
    private groupService: GroupStorageService,
    private activated_route: ActivatedRoute) {
    this.activated_route.params.subscribe(params => {
      if (params.userid) {
        this.providerId = params.userid;
      }
    });
  }

  ngOnInit(): void {
    this.settings = this.groupService.getitemFromGroupStorage('settings');
  }
  gotoDetails(type) {
    const uid = (type === 'checkin') ? this.nextWaitlist.ynwUuid : (type === 'appointment') ? this.nextAppt.uid : this.nextOrder.uid;
    if (type === 'order') {
      this.router.navigate(['provider', 'orders', this.nextOrder.uid]);
    } else {
      this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: uid, timetype: 1, type: type } });
    }
  }
}
