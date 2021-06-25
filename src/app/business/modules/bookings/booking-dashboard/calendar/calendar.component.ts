import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { startOfDay, addHours, isSameMonth, isSameDay, addMinutes } from 'date-fns';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { Router } from '@angular/router';

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
  styleUrls: ['./calendar.component.css', '../../../../../../assets/plugins/custom/fullcalendar/fullcalendar.bundle.css']
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  waitlists: any = [];
  appts: any = [];
  loading = true;
  constructor(private router: Router,
    private provider_services: ProviderServices) { }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    console.log(events);
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
    this.router.navigate(['provider', 'bookings', event.meta.uid], { queryParams: { timetype: event.meta.timeType, type: 'appointment' } });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit(): void {
    // this.getTodayWatilists();
    this.getTodayAppts();
  }

  getTodayWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    this.provider_services.getTodayWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.waitlists = data;
          console.log(this.waitlists);
          this.getFutureWatilists();
        });
  }
  getTodayAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getTodayAppointments(filter)
      .subscribe(
        (data: any) => {
          this.appts = data;
          this.appts.map((obj) => {
            obj.type = 1;
            return obj;
          });
          console.log(this.appts);
          this.getFutureAppts();
        });
  }
  getFutureWatilists() {
    const filter = {
      'waitlistStatus-eq': 'checkedIn,arrived'
    };
    this.provider_services.getFutureWaitlist(filter)
      .subscribe(
        (data: any) => {
          this.waitlists = this.waitlists.concat(data);
          console.log(this.waitlists);
        });
  }
  getFutureAppts() {
    const filter = {
      'apptStatus-eq': 'Confirmed,Arrived'
    };
    this.provider_services.getFutureAppointments(filter)
      .subscribe(
        (data: any) => {
          data.map((obj) => {
            obj.type = 2;
            return obj;
          });
          this.appts = this.appts.concat(data);
          console.log(this.appts);
          for (let appt of this.appts) {
            this.events.push({
              start: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getSingleTime(appt.appmtTime, 'start', 'minute')), this.getSingleTime(appt.appmtTime, 'start', 'hour')),
              end: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getSingleTime(appt.appmtTime, 'end', 'minute')), this.getSingleTime(appt.appmtTime, 'end', 'hour')),
              title: appt.appmtFor[0].firstName + ' ' + appt.appmtFor[0].lastName,
              color: colors.blue,
              meta: {
                uid: appt.uid,
                timeType: appt.type
              }
            })
          }
          this.loading = false;
          // this.setView(CalendarView.Month);
          console.log(this.events);
        });
  }
  getSingleTime(slot, type, time) {
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
}
