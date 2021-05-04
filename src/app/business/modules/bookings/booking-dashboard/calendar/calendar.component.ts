import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { startOfDay, addHours, isSameMonth, isSameDay, endOfDay, addMinutes } from 'date-fns';

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
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  waitlists: any = [];
  appts: any = [];
  constructor(
    private provider_services: ProviderServices) { }
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    alert(action);
    console.log(event);
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
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
          this.appts = this.appts.concat(data);
          console.log(this.appts);
          for (let appt of this.appts) {
            this.events.push({
              start: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getSingleTime(appt.appmtTime, 'start', 'minute')), this.getSingleTime(appt.appmtTime, 'start', 'hour')),
              end: addHours(addMinutes(startOfDay(new Date(appt.appmtDate)), this.getSingleTime(appt.appmtTime, 'end', 'minute')), this.getSingleTime(appt.appmtTime, 'end', 'hour')),
              title: appt.apptStatus,
              color: colors.yellow,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              }
            })
          }
          console.log(this.events);
        });
  }
  getSingleTime(slot, type, time) {
    // console.log(slot);
    // console.log(type);
    // console.log(time);
    const slots = slot.split('-');
    // console.log(slots);
    let dTime;
    if (type === 'start') {
      dTime = slots[0].split(':');
    } else {
      dTime = slots[1].split(':');
    }
    // if (time[0].startsWith(0)) {
    //   console.log(time[0]);
    // }
    // console.log(dTime);
    if (time === 'hour') {
      return dTime[0];
    } else {
      return dTime[1];
    }
  }
}
