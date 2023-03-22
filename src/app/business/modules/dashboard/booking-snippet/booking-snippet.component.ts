import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-booking-snippet',
  templateUrl: './booking-snippet.component.html',
  styleUrls: ['./booking-snippet.component.css']
})
export class BookingSnippetComponent implements OnInit {
  @Input() type;
  @Input() title;
  @Input() bookings;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUpcomingBookings(this.type).then((bookingsData) => {
      this.bookings = bookingsData;
      console.log("bookingsData", bookingsData)
    })
  }

  getUpcomingBookings(type) {
    const _this = this;
    if (type == 'appointments') {
      return new Promise((resolve, reject) => {
        _this.dashboardService.getTodayAppointments().subscribe((todayData: any) => {
          _this.dashboardService.getFutureAppointments().subscribe((futureData: any) => {
            resolve(todayData.concat(futureData));
          })
        })
      })
    }
    else if (type == 'tokens') {
      return new Promise((resolve, reject) => {
        _this.dashboardService.getTodayTokens().subscribe((todayData: any) => {
          _this.dashboardService.getFutureTokens().subscribe((futureData: any) => {
            resolve(todayData.concat(futureData));
          })
        })
      })
    }
  }


  viewAllBookings() {
    if (this.type == "appointments") {
      this.router.navigateByUrl('provider/appointments');
    }
    else if (this.type == "tokens") {
      this.router.navigateByUrl('provider/check-ins');
    }
  }


  goToBooking(uId) {
    if (this.type == "appointments") {
      this.router.navigateByUrl('provider/appointments/' + uId + '?timetype=1')
    }
    else if (this.type == "tokens") {
      this.router.navigateByUrl('provider/check-ins/' + uId + '?timetype=1')
    }
  }

}
