import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-full-view-calendar',
  templateUrl: './full-view-calendar.component.html',
  styleUrls: ['./full-view-calendar.component.css']
})
export class FullViewCalendarComponent implements OnInit {
  @Input() futureBookings;
  @Input() todayBookings;
  showWeekends: any = false;
  bookingsForCalendar: any = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekends: true,
    events: [
      { title: 'event 1', date: '2023-03-01', author: "Narendra" },
      { title: 'event 2', date: '2023-03-02' }
    ]
  };
  eventsPromise: Promise<EventInput>;
  totalBookings: any = [];

  constructor() { }

  handleDateClick(arg) {
    console.log('date click! ', arg)
  }

  ngOnInit(): void {
    this.totalBookings = this.totalBookings.concat(this.todayBookings, this.futureBookings);
    console.log("this.totalBookings", this.totalBookings)

    if (this.totalBookings) {
      for (let i = 0; i < this.totalBookings.length; i++) {
        this.bookingsForCalendar.push({ title: this.totalBookings[i].appointmentEncId, date: this.totalBookings[i].appmtDate, bookingData: this.totalBookings[i], backgroundColor: "#1e4079" })
      }
    }
    console.log("this.bookingsForCalendar", this.bookingsForCalendar)
    this.calendarOptions.events = this.bookingsForCalendar;
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends
  }

  bookingClicked(event) {
    console.log("Booking Clicked", event.event.extendedProps)
  }

}
