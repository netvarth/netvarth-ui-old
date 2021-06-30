import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, addHours, isSameMonth, isSameDay, addMinutes } from 'date-fns';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { Router } from '@angular/router';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  styleUrls: ['./calendar.component.css', '../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  @Input() waitlists;
  customer_label = '';
  constructor(private router: Router,
    private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    console.log(new Date());
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action);
    console.log(event);
    this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: event.meta.uid, timetype: event.meta.timeType, type: 'appointment' } });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit(): void {
    console.log('cal waitlists', this.waitlists);
    if (this.waitlists) {
      for (let appt of this.waitlists) {
        let name;
        if (appt.appmtFor[0].firstName || appt.appmtFor[0].lastName) {
          name = appt.appmtFor[0].firstName + ' ' + appt.appmtFor[0].lastName;
        } else {
          name = this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' id: ' + appt.appmtFor[0].memberJaldeeId;
        }
        this.events.push({
          start: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getTime(appt.appmtTime, 'start', 'minute')), this.getTime(appt.appmtTime, 'start', 'hour')),
          end: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getTime(appt.appmtTime, 'end', 'minute')), this.getTime(appt.appmtTime, 'end', 'hour')),
          title: '<div class="calender-name">' + name + '</div><div>' + this.getSingleTime(appt.appmtTime) + '</div>',
          color: colors.red,
          meta: {
            uid: appt.uid,
            timeType: appt.type
          },
        })
      }
    }

  }
  getTime(slot, type, time) {
    const slots = slot.split('-');
    let dTime;
    if (type === 'start') {
      dTime = slots[0].split(':');
    } else {
      dTime = slots[1].split(':');
    }
    if (time === 'hour') {
      return dTime[0];
    } else {
      return dTime[1];
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
}
