import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-bookings',
  templateUrl: './upcoming-bookings.component.html',
  styleUrls: ['./upcoming-bookings.component.css', '../../../../../../assets/css/style.bundle.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class UpcomingBookingsComponent implements OnInit {
  @Input() nextWaitlists: any = [];
  @Input() nextAppts: any = [];
  loading = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  gotoDetails(type) {
    const uid = (type === 'checkin') ? this.nextWaitlists[0].ynwUuid : this.nextAppts[0].uid;
    console.log(uid);
    this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: uid, timetype: 1, type: type } });
  }
}
