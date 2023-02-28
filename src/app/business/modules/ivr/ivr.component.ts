import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { IvrService } from './ivr.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-ivr',
  templateUrl: './ivr.component.html',
  styleUrls: ['./ivr.component.css']
})
export class IvrComponent implements OnInit {
  user: any;
  capabilities: any;
  lineChartOptions: any;
  lineChartData: any;
  doughnutChartData: any;
  doughnutChartOptions: any;
  calls: any;
  totalCallsCount: any;
  statusDisplayName: any;
  ivrCallsStatus = projectConstantsLocal.IVR_CALL_STATUS;

  customers: any;
  customerMoreActionMenuItems: MenuItem[];
  customer_label: any;
  constructor(
    private groupService: GroupStorageService,
    private ivrService: IvrService,
    private snackbarService: SnackbarService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private wordProcessor: WordProcessor
  ) { }

  ngOnInit(): void {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.getAnalyticsChartOptions();
    this.getAnalyticsDoughnutChartOptions();
    this.getIvrCalls();
    this.getCustomers();

    this.primengConfig.ripple = true;

    this.customerMoreActionMenuItems = [{
      label: 'Options',
      items: [{
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {

        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {

        }
      }
      ]
    },
    {
      label: 'Navigate',
      items: [{
        label: 'Angular Website',
        icon: 'pi pi-external-link',
        url: 'http://angular.io'
      },
      {
        label: 'Router',
        icon: 'pi pi-upload'
      }
      ]
    }
    ];
  }

  viewCustomer(id) {
    this.router.navigate(['provider', 'customers', id])
  }

  editCustomer(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'edit',
        id: id
      }
    };
    this.router.navigate(['provider', 'customers', 'create'], navigationExtras)
  }

  createToken() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        checkin_type: 'WALK_IN_CHECKIN',
        calmode: "NoCalc",
        showtoken: true,
        source: 'ivr'
      }
    };
    this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras)

  }

  viewAllCustomers() {
    this.router.navigate(['provider', 'customers'])
  }

  getAnalyticsChartOptions() {
    this.lineChartData = {
      labels: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      datasets: [
        {
          label: 'Calls Analytics',
          data: [20, 30, 10, 40, 20, 35, 65, 15],
          fill: true,
          borderColor: 'rgba(202, 30, 30, 1)',
          tension: .4,
          backgroundColor: 'rgba(238, 108, 77, 0.2)'
        }
      ]
    }


    this.lineChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#1E4079'
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


  getAnalyticsDoughnutChartOptions() {
    this.doughnutChartData = {
      // labels: ['All Calls', 'Missed Calls', 'Answered Calls'],
      datasets: [
        {
          data: [150, 50, 100],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
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
          labels: {
            color: "#495057",
          },
        },
      },
    };

  }



  getIvrCalls() {
    this.ivrService.getAllIvrCalls().subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }

  getIvrCallsbyFilter(filter) {
    this.ivrService.getAllIvrCallsbyFilter(filter).subscribe((data: any) => {
      this.calls = data;
    },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
      });
  }


  statusChange(event) {
    let api_filter = {}
    if (event.value.name == 'All') {
      this.getIvrCallsbyFilter(api_filter);
    }
    else {
      if (event.value.name) {
        api_filter['callStatus-eq'] = event.value.name;
      }
      this.getIvrCallsbyFilter(api_filter);
    }
  }


  getCustomers() {
    this.ivrService.getCustomers().subscribe((data: any) => {
      this.customers = data;
    });
  }



}
