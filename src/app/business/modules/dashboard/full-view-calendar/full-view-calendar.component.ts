import { Component, OnInit } from '@angular/core';
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
  showWeekends: any = false;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekends: true,
    events: [
      { title: 'event 1', date: '2023-03-01' },
      { title: 'event 2', date: '2023-03-02' }
    ]
  };
  eventsPromise: Promise<EventInput>;

  constructor() { }

  handleDateClick(arg) {
    console.log('date click! ', arg)
  }

  ngOnInit(): void {
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends
  }

}
