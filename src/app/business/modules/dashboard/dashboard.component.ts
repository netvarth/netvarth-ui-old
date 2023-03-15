import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

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

  constructor(
    private groupService: GroupStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getDoughnutChartData();
    this.getBarChartData();
    this.getLineChartData();
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
          data: [300, 50, 100],
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

}
