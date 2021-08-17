import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  @Input() nextWaitlist: any = [];
  @Input() nextAppt: any = [];
  @Input() nextOrder: any = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
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
