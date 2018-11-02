import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {

  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/coupons'
    },
    {
      title: 'Report',
      url: '/provider/settings/coupons/report'
    },
    {
      title: '',
      url: '/provider/settings/coupons/report/view_report'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;




  constructor(private router: Router) { }

  ngOnInit() {
  }

  // goBack() {
  //   this.router.navigate(['provider', 'settings', 'coupons', 'report']);
  // }

}
