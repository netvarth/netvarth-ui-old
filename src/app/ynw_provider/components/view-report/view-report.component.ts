import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';

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
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  viewreport: any [];
public id;


  constructor(private router: Router, private provider_servicesobj: ProviderServices) { }

  ngOnInit() {
    this.getjaldeeReport();
  }

  // goBack() {
  //   this.router.navigate(['provider', 'settings', 'coupons', 'report']);
  // }
getjaldeeReport() {
this.viewreport = this.provider_servicesobj.getJaldeeCouponReportsbyId(this.id);
const breadcrumbs = [];
this.breadcrumbs_init.map((e) => {
  breadcrumbs.push(e);
});
breadcrumbs.push({
    title: this.viewreport.invoiceId
});
this.breadcrumbs = breadcrumbs;
}
}



