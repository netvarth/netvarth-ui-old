import { Component, OnInit } from '@angular/core';
import { ReportDataService } from '../reports-data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.css']
})
export class CustomerSelectionComponent implements OnInit {
  reportType: any;
  customerList = '';
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private report_data_service: ReportDataService) {
    this.activated_route.queryParams.subscribe(qparams => {

      this.reportType = qparams.report_type;
      if (qparams.data !== 0) {
        this.customerList = qparams.data;
      }

    });
  }


  ngOnInit() {
  }
  passCustomersToReports() {
    this.report_data_service.updateCustomers(this.customerList);
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }
  redirecToReports(){
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }
}
