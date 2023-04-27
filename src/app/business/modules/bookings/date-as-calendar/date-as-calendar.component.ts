import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-as-calendar',
  templateUrl: './date-as-calendar.component.html',
  styleUrls: ['./date-as-calendar.component.css']
})
export class DateAsCalendarComponent implements OnInit {
  @Input() bookingDate;
  month: any;
  week: any;
  day: any;
  constructor() { }

  ngOnInit(): void {
    console.log("this.bookingDate", this.bookingDate);
    var bookingDate = new Date(this.bookingDate);
    this.month = bookingDate.toLocaleString('default', { month: 'short' });
    this.week = bookingDate.toLocaleString('default', { weekday: 'short' });
    this.day = bookingDate.toLocaleString('default', { day: '2-digit' });

  }

}
