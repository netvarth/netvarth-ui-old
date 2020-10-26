import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportDataService } from './reports-data.service';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  appointmentReports = [];
  donationReports = [];
  paymentReports = [];
  checkinReports = [];
  settings: any = [];
  showToken = false;
  constructor(private router: Router, private report_dataService: ReportDataService,
    private provider_services: ProviderServices, ) {
    this.report_dataService.updateCustomers('All');
    this.report_dataService.updatedQueueDataSelection('All');
    this.report_dataService.updatedScheduleDataSelection('All');
    this.report_dataService.updatedServiceDataSelection('All');
    this.report_dataService.storeSelectedValues({});
   }

  ngOnInit() {
    this. getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId; }); }
    newReport(report_type) {
    this.report_dataService.updateCustomers('All');
    this.report_dataService.updatedQueueDataSelection('All');
    this.report_dataService.updatedScheduleDataSelection('All');
    this.report_dataService.updatedServiceDataSelection('All');
    this.report_dataService.storeSelectedValues({});
    this.router.navigate(['provider', 'reports', 'new-report'], {queryParams: {report_type: report_type}});


  }
}
