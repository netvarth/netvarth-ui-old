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
  @Input() source;
  customer_label = '';
  constructor(private router: Router,
    private dateTimeProcessor: DateTimeProcessor,
    private wordProcessor: WordProcessor) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
    if (this.source === 'order') {
      this.router.navigate(['provider', 'orders', event.meta.uid]);
    } else {
      this.router.navigate(['provider', 'bookings', 'details'], { queryParams: { uid: event.meta.uid, timetype: event.meta.timeType, type: this.source } });
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit(): void {
    if (this.waitlists) {
      for (let waitlist of this.waitlists) {
        if (this.source === 'appointment') {
          let name;
          if (waitlist.appmtFor[0].firstName || waitlist.appmtFor[0].lastName) {
            name = waitlist.appmtFor[0].firstName + ' ' + waitlist.appmtFor[0].lastName;
          } else {
            name = this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' id: ' + waitlist.appmtFor[0].memberJaldeeId;
          }
          this.events.push({
            start: addHours(addMinutes(startOfDay(new Date(waitlist.appmtDate)), this.getTime(waitlist.appmtTime, 'start', 'minute')), this.getTime(waitlist.appmtTime, 'start', 'hour')),
            end: addHours(addMinutes(startOfDay(new Date(waitlist.appmtDate)), this.getTime(waitlist.appmtTime, 'end', 'minute')), this.getTime(waitlist.appmtTime, 'end', 'hour')),
            title: '<div class="calender-name">' + name + '</div><div>' + this.getSingleTime(waitlist.appmtTime) + '</div>',
            color: colors.red,
            meta: {
              uid: waitlist.uid,
              timeType: waitlist.type
            },
          });
        } else if (this.source === 'order') {
          let name;
          if (waitlist.orderFor.firstName || waitlist.orderFor.lastName) {
            name = waitlist.orderFor.firstName + ' ' + waitlist.orderFor.lastName;
          } else {
            name = this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' id: ' + waitlist.orderFor.jaldeeId;
          }
          this.events.push({
            start: startOfDay(new Date(waitlist.orderDate)),
            title: '<div class="calender-name">' + name + '</div>',
            color: colors.red,
            meta: {
              uid: waitlist.uid
            },
          });
        } else if (this.source === 'checkin') {
          let name;
          if (waitlist.waitlistingFor[0].firstName || waitlist.waitlistingFor[0].lastName) {
            name = waitlist.waitlistingFor[0].firstName + ' ' + waitlist.waitlistingFor[0].lastName;
          } else {
            name = this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' id: ' + waitlist.waitlistingFor[0].memberJaldeeId;
          }
          this.events.push({
            start: startOfDay(new Date(waitlist.date)),
            title: '<div class="calender-name">' + name + '</div>',
            color: colors.red,
            meta: {
              uid: waitlist.ynwUuid,
              timeType: waitlist.type
            },
          });
        }
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
