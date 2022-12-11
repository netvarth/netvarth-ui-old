import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportType: any = [
    {
      id: 1, type: 'Loan Application Report',
    },
    {
      id: 2, type: 'Loan Application User Report'
    },
    {
      id: 3, type: 'Loan Application Partner Wise Report'
    }

  ]
  constructor(
    private router: Router,
    private location: Location,

  ) { }

  ngOnInit(): void {
  }

  reportActionType(data) {
    if (data) {
      switch (data.type) {
        case 'Loan Application Report':
          const navigationExtras: NavigationExtras = {
            queryParams: {
              report_type: 'loan application'
            }
          }
          if (navigationExtras) {
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
          }
          break;
        case 'Loan Application User Report':
          const navigationToLoanUser: NavigationExtras = {
            queryParams: {
              report_type: 'loan user'
            }
          }
          if (navigationToLoanUser) {
            this.router.navigate(['provider', 'reports', 'new-report'], navigationToLoanUser);
          }
          break;
        case 'Loan Application Partner Wise Report':
          const navigationExtrasToLoanPartner: NavigationExtras = {
            queryParams: {
              report_type: 'loan partner wise'
            }
          }
          if (navigationExtrasToLoanPartner) {
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToLoanPartner);
          }

          break;
      }
    }
  }


  goBack() {
    this.location.back();
  }



  getImage(data) {
    if (data) {
      let imgSrc: any;
      switch (data.type) {
        case 'Loan Application Report':
          imgSrc = './assets/images/crmImages/craeteActivity.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Loan Application User Report':
          imgSrc = './assets/images/crmImages/leadReporterMob.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Loan Application Partner Wise Report':
          imgSrc = './assets/images/crmImages/leadReporterMob.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
      }

    }
  }

}
