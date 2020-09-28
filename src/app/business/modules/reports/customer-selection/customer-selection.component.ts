import { Component, OnInit } from '@angular/core';
import { ReportDataService } from '../reports-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.css']
})
export class CustomerSelectionComponent implements OnInit {
  placeHolder_msg: string;
  customer_label: any;
  reportType: any;
  customerList = '';
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private report_data_service: ReportDataService,
    private shared_functions: SharedFunctions) {
    this.activated_route.queryParams.subscribe(qparams => {

      this.reportType = qparams.report_type;
      if (qparams.data !== 0) {
        this.customerList = qparams.data;
      }

    });
  }


  ngOnInit() {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    const placeholder = 'Enter customer id seperated by comm;Ex 1,2,3';
    this.placeHolder_msg = placeholder.replace('customer', this.customer_label);
  }
  passCustomersToReports() {
    this.report_data_service.updateCustomers(this.customerList);
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }
  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }
}
