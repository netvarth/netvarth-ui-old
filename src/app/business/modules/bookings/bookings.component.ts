import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class BookingsComponent implements OnInit {
  step;
  constructor() { }

  ngOnInit() {
    this.step = 1;
  }
  openCalendar() {
    this.step = 2;
  }

}
