import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DashboardService } from '../dashboard.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-full-view-calendar',
  templateUrl: './full-view-calendar.component.html',
  styleUrls: ['./full-view-calendar.component.css']
})
export class FullViewCalendarComponent implements OnInit {
  @Input() type;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  private calendarApi;
  showWeekends: any = false;
  bookingsForCalendar: any = [];
  backgroundColors: any = ["#FBFFB1", "#FFEBB4", "#ECF9FF", "#AEE2FF", "#FFF1DC"];
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   dateClick: this.handleDateClick.bind(this),
  //   plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  //   headerToolbar: {
  //     // left: 'prev,next today',
  //     // center: 'title',
  //     // right: 'dayGridMonth,timeGridWeek,timeGridDay'
  //   },
  //   weekends: true,
  //   datesSet: this.handleMonthChange.bind(this),
  //   events: [],
  //   selectable: true,
  //   // contentHeight: 999,
  //   selectMirror: true,
  //   dayMaxEvents: true,
  //   dayMaxEventRows: true,
  //   views: {
  //     dayGrid: {
  //       dayMaxEventRows: 3 // adjust to 6 only for timeGridWeek/timeGridDay
  //     }
  //   }
  // };

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin,
      // listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    // editable: true,
    // selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dayMaxEventRows: true,
    events: [],
    datesSet: this.handleMonthChange.bind(this),
    eventOverlap: function(stillEvent, movingEvent) {
      return stillEvent.allDay && movingEvent.allDay;
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      meridiem: false
    },
    views: {
      dayGrid: {
        dayMaxEventRows: 1 // adjust to 6 only for timeGridWeek/timeGridDay
      },
      timeGridWeek: {
        dayMaxEventRows: 1 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    },
    select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  eventsPromise: Promise<EventInput>;
  totalBookings: any = [];
  startedAppointmentsChecked: any = [];
  appointmentsChecked: any = [];
  apptStartedMultiSelection: any;
  apptMultiSelection: any;
  providerLabels: any[];
  allLabels: any;
  chkSelectAppointments: any;
  chkAppointments: any;
  selectedAppt: any[];
  apptSingleSelection: any;
  check_in_filtered_list: any[];
  appt_request_list: any[];
  startedChkAppointments: {};
  apptStartedSingleSelection: any;
  time_type: number;
  statusAction: any;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    // private dialog: MatDialog,
    private router: Router
  ) {

  }

  handleDateClick(event) {
    console.log('date click! ', event)
  }

  handleMonthChange(event) {
    if (event.endStr) {
      console.log('event.endStr', event)
      let currentDateStart = event.startStr.split('T')[0];
      let currentDateEnd = event.endStr.split('T')[0];
      console.log('currentDateStart', currentDateStart);
      console.log('currentDateEnd', currentDateEnd);
      // let currentMonth = currentDateEnd.getMonth() == 0 ? 12 : ('0' + currentDateEnd.getMonth()).slice(-2);
      // let nextMonth = currentDateEnd.getMonth() + 1 == 0 ? 12 : ('0' + (currentDateEnd.getMonth() + 1)).slice(-2);
      // currentDateEnd.setMonth(currentDateEnd.getMonth() - 1);
      // let currentYear = currentDateEnd.getFullYear();
      // let nextYear = currentMonth == 12 ? currentDateEnd.getFullYear() + 1 : currentDateEnd.getFullYear();
      // let currentMonthDate = currentYear + '-' + currentMonth + '-' + '01';
      // let nextMonthDate = nextYear + '-' + nextMonth + '-' + '01';
      let api_filter = {};
      api_filter['date-ge'] = currentDateStart;
      api_filter['date-le'] = currentDateEnd;

      var date = new Date(currentDateStart);
      var varDate = new Date(date); //dd-mm-YYYY
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      let history_filter = {};
      if (!(varDate >= today)) {
        history_filter['date-ge'] = currentDateStart;
        history_filter['date-le'] = currentDateEnd;
      }
      this.handleBookings(api_filter, history_filter);
    }
  }


  handleBookings(filter, history_filter) {
    if (this.type == 'appointments') {
      this.handleAppointments(filter, history_filter).then((data: any) => {
        this.totalBookings = [];
        console.log("data", data)
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.totalBookings = data[i] instanceof Array ? this.totalBookings = this.totalBookings.concat(data[i]) : this.totalBookings.push(data[i]);
          }
        }
        console.log("this.totalBookings", this.totalBookings)
        this.setTotalBookings()
      });
    }
    else if (this.type == 'tokens') {
      this.handleTokens(filter, history_filter).then((data: any) => {
        this.totalBookings = [];
        console.log("data", data)
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.totalBookings = data[i] instanceof Array ? this.totalBookings = this.totalBookings.concat(data[i]) : this.totalBookings.push(data[i]);
          }
        }
        console.log("this.totalBookings", this.totalBookings)
        this.setTotalBookings()
      });
    }

  }

  handleAppointments(filter, history_filter) {
    const _this = this;
    let api_filter = { "apptStatus-neq": "prepaymentPending,failed" };
    filter["apptStatus-neq"] = "prepaymentPending,failed";
    return new Promise((resolve, reject) => {
      _this.dashboardService.getTodayAppointments(api_filter).subscribe((todayData: any) => {
        _this.dashboardService.getFutureAppointments(api_filter).subscribe((futureData: any) => {
          if (history_filter) {
            _this.dashboardService.getHistoryAppointments(filter).subscribe((historyData: any) => {
              resolve([todayData, futureData, historyData]);
            })
          }
          else {
            resolve([todayData, futureData]);
          }

        })
      })
    })
  }

  handleTokens(filter, history_filter) {
    const _this = this;
    let api_filter = { "waitlistStatus-neq": "prepaymentPending,failed" };
    filter["waitlistStatus-neq"] = "prepaymentPending,failed";
    return new Promise((resolve, reject) => {
      _this.dashboardService.getTodayTokens(api_filter).subscribe((todayData: any) => {
        _this.dashboardService.getFutureTokens(api_filter).subscribe((futureData: any) => {
          if (history_filter) {
            _this.dashboardService.getHistoryTokens(filter).subscribe((historyData: any) => {
              resolve([todayData, futureData, historyData]);
            })
          }
          else {
            resolve([todayData, futureData]);
          }

        })
      })
    })
  }

  ngOnInit(): void {

  }

  setTotalBookings() {
    if (this.totalBookings) {
      this.bookingsForCalendar = [];
      for (let i = 0; i < this.totalBookings.length; i++) {
        const randomColor = this.backgroundColors[this.randomIntFromInterval(0, this.backgroundColors.length - 1)];
        if (this.type == 'appointments') {
          this.bookingsForCalendar.push(
            {
              // title: this.totalBookings[i].appointmentEncId,
              title: this.totalBookings[i].consumer.userProfile.firstName + ' ' + this.totalBookings[i].consumer.userProfile.lastName,
              date: this.totalBookings[i].appmtDate,
              start: this.totalBookings[i].appmtDate + 'T' + this.totalBookings[i].appmtTime.split('-')[0] + ":00",
              end: this.totalBookings[i].appmtDate + 'T' + this.totalBookings[i].appmtTime.split('-')[1] + ":00",
              bookingData: this.totalBookings[i],
              time: this.totalBookings[i].appmtTime,
              status: this.totalBookings[i].apptStatus,
              allDay: false,
              display: 'block',
              backgroundColor: randomColor,
              borderColor: randomColor,
            })
        }
        else if (this.type == 'tokens') {
          this.bookingsForCalendar.push(
            {
              title: this.totalBookings[i].checkinEncId,
              date: this.totalBookings[i].date,
              bookingData: this.totalBookings[i],
              time: this.totalBookings[i].checkInTime,
              status: this.totalBookings[i].waitlistStatus,
              backgroundColor: randomColor,
              borderColor: randomColor
            })
        }

      }
    }
    console.table(this.bookingsForCalendar)
    this.calendarOptions.events = this.bookingsForCalendar;

  }

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
    let currentDate = this.calendarApi.view.currentEnd;
    this.handleMonthChange({ endStr: currentDate });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends
  }

  bookingClicked(event) {
    console.log("event.event.context", event.event._context.calendarApi.currentData.currentViewType)
    let checkin;
    let type;
    if (this.type == "appointments") {
      type = "appointments";
      checkin = event.event.extendedProps.bookingData.uid;
    }
    else if (this.type == "tokens") {
      type = "check-ins";
      checkin = event.event.extendedProps.bookingData.ynwUuid;
    }
    // console.log("checkin data", checkin)
    // let waitlist = [];
    // if (checkin) {
    //   waitlist = checkin;
    //   console.log("Appointment action clicked :", waitlist);
    // }
    // const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
    //   disableClose: true,
    //   data: {
    //     checkinData: waitlist
    //   }
    // });
    // actiondialogRef.afterClosed().subscribe(data => {
    //   console.log("data", data)
    //   this.ngAfterViewInit();
    // });
    const navigationExtras: NavigationExtras = {
      queryParams: {
        timetype: 2,
        source: 'calendarView'
      }
    };
    this.router.navigate(['provider', type, checkin], navigationExtras)
  }

  getCalendarType(event) {
    return event.event._context.calendarApi.currentData.currentViewType;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  handleDateSelect(selectInfo) {
    console.log("selectInfo", selectInfo)
  }

  handleEventClick(clickInfo) {
    console.log("Event Clicked", clickInfo)
  }

  handleEvents(events) {
    console.log("events", events)
  }

}
