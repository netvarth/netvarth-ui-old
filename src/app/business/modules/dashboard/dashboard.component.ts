import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { DashboardService } from './dashboard.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';

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
  shareLink: any;
  appointmentsCount: number = 0;
  appointmentsCountStop: any;
  tokensCount: number = 0;
  tokensCountStop: any;
  ordersCount: number = 0;
  ordersCountStop: any;
  remindersCount: number = 0;
  remindersCountStop: any;

  windowPath = projectConstantsLocal.PATH;
  greet: any;
  constructor(
    private groupService: GroupStorageService,
    private router: Router,
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService
  ) {
    this.getBusinessProfile();


    this.getTotalAppointmentsCount().then((totalAppointments) => {
      this.appointmentsCountStop = setInterval(() => {
        this.appointmentsCount++;
        this.appointmentsCount == totalAppointments ? clearInterval(this.appointmentsCountStop) : null;
      }, 10);
    });

    this.getTotalTokensCount().then((totalTokens) => {
      this.tokensCountStop = setInterval(() => {
        this.tokensCount++;
        this.tokensCount == totalTokens ? clearInterval(this.tokensCountStop) : null;
      }, 10);
    });

    this.getTotalOrdersCount().then((totalOrders) => {
      this.ordersCountStop = setInterval(() => {
        this.ordersCount++;
        this.ordersCount == totalOrders ? clearInterval(this.ordersCountStop) : null;
      }, 10);
    });

  }

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
    this.greet = this.getGreetings();

  }

  getBusinessProfile() {
    this.dashboardService.getBussinessProfile().subscribe((bProfile: any) => {
      if (bProfile) {
        console.log("Business Profile Data", bProfile);
        if (bProfile.customId) {
          this.shareLink = this.windowPath + bProfile.customId + '/';
        } else {
          this.shareLink = this.windowPath + bProfile.accEncUid + '/';
        }

        console.log("this.shareLink", this.shareLink);
      }
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      })
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
            "#2E37A4",
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
          backgroundColor: '#5A6ACF',
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

  getGreetings() {
    var myDate = new Date();
    var hrs = myDate.getHours();
    var greet;
    if (hrs < 12)
      greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
      greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
      greet = 'Good Evening';
    return greet;
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
          borderColor: '#2E37A4'
        },
        {
          label: 'Customers',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: '#5A6ACF',
          tension: .4,
          backgroundColor: '#E4E6EF'
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


  getTotalAppointmentsCount() {
    return new Promise((resolve, reject) => {
      let totalAppointments = 0
      this.dashboardService.getTodayAppointmentsCount().subscribe((todayAppointmentsCount: any) => {
        totalAppointments += todayAppointmentsCount
        this.dashboardService.getFutureAppointmentsCount().subscribe((futureAppointmentsCount: any) => {
          totalAppointments += futureAppointmentsCount
          this.dashboardService.getHistoryAppointmentsCount().subscribe((historyAppointmentsCount: any) => {
            totalAppointments += historyAppointmentsCount;
            resolve(totalAppointments);
          })
        })
      })
    })
  }

  getTotalTokensCount() {
    return new Promise((resolve, reject) => {
      let totalTokens = 0
      this.dashboardService.getTodayCheckinCount().subscribe((todayCheckinCount: any) => {
        totalTokens += todayCheckinCount
        this.dashboardService.getFutureCheckinCount().subscribe((futureCheckinCount: any) => {
          totalTokens += futureCheckinCount
          this.dashboardService.getHistoryCheckinCount().subscribe((historyCheckinCount: any) => {
            totalTokens += historyCheckinCount;
            resolve(totalTokens);
          })
        })
      })
    })
  }

  getTotalOrdersCount() {
    return new Promise((resolve, reject) => {
      let totalOrders = 0
      this.dashboardService.getTodayOrdersCount().subscribe((todayOrdersCount: any) => {
        totalOrders += todayOrdersCount
        this.dashboardService.getFutureOrdersCount().subscribe((futureOrdersCount: any) => {
          totalOrders += futureOrdersCount
          this.dashboardService.getHistoryOrdersCount().subscribe((historyOrdersCount: any) => {
            totalOrders += historyOrdersCount;
            resolve(totalOrders);
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
