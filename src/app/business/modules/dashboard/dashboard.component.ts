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

  constructor(
    private groupService: GroupStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getDoughnutChartData();
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

}
