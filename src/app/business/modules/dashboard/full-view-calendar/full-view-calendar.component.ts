import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DashboardService } from '../dashboard.service';
import { BookingActionsComponent } from '../booking-actions/booking-actions.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-full-view-calendar',
  templateUrl: './full-view-calendar.component.html',
  providers: [DialogService],
  styleUrls: ['./full-view-calendar.component.css']
})
export class FullViewCalendarComponent implements OnInit {
  @Input() type;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  private calendarApi;
  showWeekends: any = false;
  bookingsForCalendar: any = [];
  backgroundColors: any = ["#FBFFB1", "#FFEBB4", "#ECF9FF", "#AEE2FF", "#FFF1DC"];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    datesSet: this.handleMonthChange.bind(this),
    events: [],
    selectable: true,
    // contentHeight: 999,
    selectMirror: true,
    dayMaxEvents: true,
    dayMaxEventRows: true,
    views: {
      dayGrid: {
        dayMaxEventRows: 3 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    }
  };
  eventsPromise: Promise<EventInput>;
  totalBookings: any = [];

  constructor(
    private dashboardService: DashboardService,
    public dialogService: DialogService
  ) { }

  handleDateClick(event) {
    console.log('date click! ', event)
  }

  handleMonthChange(event) {
    if (event.endStr) {
      const currentDateEnd = new Date(event.endStr);
      let currentMonth = currentDateEnd.getMonth() == 0 ? 12 : ('0' + currentDateEnd.getMonth()).slice(-2);
      let nextMonth = currentDateEnd.getMonth() + 1 == 0 ? 12 : ('0' + (currentDateEnd.getMonth() + 1)).slice(-2);
      currentDateEnd.setMonth(currentDateEnd.getMonth() - 1);
      let currentYear = currentDateEnd.getFullYear();
      let nextYear = currentMonth == 12 ? currentDateEnd.getFullYear() + 1 : currentDateEnd.getFullYear();
      let currentMonthDate = currentYear + '-' + currentMonth + '-' + '01';
      let nextMonthDate = nextYear + '-' + nextMonth + '-' + '01';
      let api_filter = {};
      api_filter['date-ge'] = currentMonthDate;
      api_filter['date-le'] = nextMonthDate;

      var date = new Date(currentMonthDate);
      var varDate = new Date(date); //dd-mm-YYYY
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      let history_filter = {};
      if (!(varDate >= today)) {
        history_filter['date-ge'] = currentMonthDate;
        history_filter['date-le'] = nextMonthDate;
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

  }

  handleAppointments(filter, history_filter) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.dashboardService.getTodayAppointments().subscribe((todayData: any) => {
        _this.dashboardService.getFutureAppointments().subscribe((futureData: any) => {
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

  ngOnInit(): void {

  }

  setTotalBookings() {
    if (this.totalBookings) {
      this.bookingsForCalendar = [];
      for (let i = 0; i < this.totalBookings.length; i++) {
        const randomColor = this.backgroundColors[this.randomIntFromInterval(0, this.backgroundColors.length - 1)];
        this.bookingsForCalendar.push(
          {
            title: this.totalBookings[i].appointmentEncId,
            date: this.totalBookings[i].appmtDate,
            bookingData: this.totalBookings[i],
            time: this.totalBookings[i].appmtTime,
            backgroundColor: randomColor,
            borderColor: randomColor
          })
      }
    }
    console.table(this.bookingsForCalendar)
    this.calendarOptions.events = this.bookingsForCalendar;

  }

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
    let currentDate = this.calendarApi.view.currentEnd;
    this.handleMonthChange({ event: currentDate });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends
  }

  bookingClicked(event) {
    const ref = this.dialogService.open(BookingActionsComponent, {
      data: {
        id: '51gF3'
      },
      header: 'Select an action to Perform',
      width: '50%'
    });
    ref.onClose.subscribe((data: any) => {
      if (data) {

      }
    });

  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

}
