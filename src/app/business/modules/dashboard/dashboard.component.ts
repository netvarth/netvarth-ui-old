import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  doughnutChartData: any;
  doughnutChartOptions: any;
  barChartData: any;
  barChartOptions: any;
  lineChartData: any;
  lineChartOptions: any;
  bookings: any = [
    {
      name: "Aswin",
      phone: "+91 9633360166",
      service: "Request Service",
      time: "09:00 -09:30"
    },
    {
      name: "Adarsh K K",
      phone: "+91 9633360166",
      service: "Request Service",
      time: "11:00 -11:30"
    }
  ]
  totalUsers: any = 0;
  totalCustomers: any = 0;
  totalBookings: any = 0;
  appointmentsInweek: any;
  checkinsInweek: any;
  ordersInweek: any;

  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getBookingsCount().then((totalBookings) => {
      this.totalBookings = totalBookings;
      this.getOrdersCount().then((totalOrders) => {
        this.ordersInweek = totalOrders;
        this.getDoughnutChartData();
      })
    });
    this.getBarChartData();
    this.getLineChartData();
    this.getUsersCount();
    this.getCustomersCount();

  }

  gotoAppointments() {
    this.router.navigate(['provider', 'appointments'])
  }

  gotoTokens() {
    this.router.navigate(['provider', 'check-ins'])
  }

  gotoOrders() {
    this.router.navigate(['provider', 'orders'])
  }

  getDoughnutChartData() {
    this.doughnutChartData = {
      labels: ['Appointments', 'Tokens', 'Orders'],
      datasets: [
        {
          data: [this.appointmentsInweek, this.checkinsInweek, this.ordersInweek],
          backgroundColor: [
            "#5A6ACF",
            "#F1416C",
            "#E4E6EF"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }
      ]
    };

    this.doughnutChartOptions = {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#495057'
          }
        }
      }
    };
  }

  getBarChartData() {
    this.barChartData = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Earnings',
          backgroundColor: '#5BA6FF',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        },
      }
    };
  }

  getLineChartData() {
    this.lineChartData = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Bookings',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: .4,
          borderColor: '#42A5F5'
        },
        {
          label: 'Customers',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: '#FFA726',
          tension: .4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    }

    this.lineChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079',
            usePointStyle: true
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            precision: 0,
            color: '#1E4079'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
    };
  }



  getUsersCount() {
    this.dashboardService.getUsersCount().subscribe((data: any) => {
      if (data) {
        this.totalUsers = data;
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  getCustomersCount() {
    this.dashboardService.getCustomersCount().subscribe((data: any) => {
      if (data) {
        this.totalCustomers = data;
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
  }


  getBookingsCount() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const lastWeekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      let finalDate = lastWeekDate.getFullYear() + '-' + lastWeekDate.getMonth() + '-' + lastWeekDate.getDate()
      let api_filter = {};
      api_filter['date-ge'] = finalDate;
      let totalBookings = 0
      this.dashboardService.getTodayAppointmentsCount().subscribe((todayAppointmentsCount: any) => {
        totalBookings += todayAppointmentsCount
        this.dashboardService.getFutureAppointmentsCount().subscribe((futureAppointmentsCount: any) => {
          totalBookings += futureAppointmentsCount
          this.dashboardService.getHistoryAppointmentsCount(api_filter).subscribe((historyAppointmentsCount: any) => {
            totalBookings += historyAppointmentsCount;
            this.appointmentsInweek = totalBookings;
            this.dashboardService.getTodayCheckinCount().subscribe((todayCheckinCount: any) => {
              totalBookings += todayCheckinCount
              this.dashboardService.getFutureCheckinCount().subscribe((futureCheckinCount: any) => {
                totalBookings += futureCheckinCount
                this.dashboardService.getHistoryCheckinCount(api_filter).subscribe((historyCheckinCount: any) => {
                  totalBookings += historyCheckinCount
                  this.checkinsInweek = totalBookings;
                  resolve(totalBookings);
                })
              })
            })
          })
        })
      })
    })
  }


  getOrdersCount() {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const lastWeekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      let finalDate = lastWeekDate.getFullYear() + '-' + lastWeekDate.getMonth() + '-' + lastWeekDate.getDate()
      console.log("finalDate", finalDate)
      let api_filter = {};
      api_filter['orderDate-ge'] = finalDate;

      let totalOrders = 0

      this.dashboardService.getTodayOrdersCount().subscribe((todayOrdersCount: any) => {
        totalOrders += todayOrdersCount
        this.dashboardService.getFutureOrdersCount().subscribe((futureOrdersCount: any) => {
          totalOrders += futureOrdersCount
          this.dashboardService.getHistoryOrdersCount(api_filter).subscribe((historyOrdersCount: any) => {
            totalOrders += historyOrdersCount;
            resolve(totalOrders);
          })
        })
      })
    })
  }
}
