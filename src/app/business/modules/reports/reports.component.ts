import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportDataService } from './reports-data.service';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { CriteriaDialogComponent } from './generated-report/criteria-dialog/criteria-dialog.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  order_criteria: any[];
  appointmentReports = [];
  donationReports = [];
  paymentReports = [];
  checkinReports = [];
  orderReports = [];
  settings: any = [];
  showToken = false;
  criteria_list;
  appt_criteria = [];
  payment_criteria = [];
  token_criteria = [];
  donation_criteria = [];
  reprtdialogRef: any;
  constructor(private router: Router, private report_dataService: ReportDataService,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog) {
    this.report_dataService.updateCustomers('All');
    this.report_dataService.updatedQueueDataSelection('All');
    this.report_dataService.updatedScheduleDataSelection('All');
    this.report_dataService.updatedServiceDataSelection('All');
    this.report_dataService.storeSelectedValues({});
  }

  ngOnInit() {
    this.getProviderSettings();
    this.getCriteriaList();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
      });
  }
  newReport(report_type) {
    this.report_dataService.updateCustomers('All');
    this.report_dataService.updatedQueueDataSelection('All');
    this.report_dataService.updatedScheduleDataSelection('All');
    this.report_dataService.updatedServiceDataSelection('All');
    this.report_dataService.storeSelectedValues({});
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: report_type } });


  }

  getCriteriaList() {
    this.criteria_list = '';
    this.appt_criteria = [];
    this.order_criteria = [];
    this.payment_criteria = [];
    this.token_criteria = [];
    this.donation_criteria = [];
    this.provider_services.getCriteriaList().subscribe(data => {
      this.criteria_list = data;
      for (let i = 0; i < this.criteria_list.length; i++) {
        switch (this.criteria_list[i].reportType) {
          case 'DONATION': {
            this.donation_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'TOKEN': {
            this.token_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'PAYMENT': {
            this.payment_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'APPOINTMENT': {
            this.appt_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'ORDER': {
            this.order_criteria.push(this.criteria_list[i]);
            break;
          }
        }
      }
    });
  }
  deletCriteria(del_item) {
    this.provider_services.deleteCriteria(del_item.reportName, del_item.reportType).subscribe(data => {
      if (data) {
        this.getCriteriaList();
        this.shared_functions.openSnackBar('Report Deleted');
      }
    });
  }
  viewCriteria(details) {
    this.reprtdialogRef = this.dialog.open(CriteriaDialogComponent, {
      width: '400px',
      // panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        purpose : 'view',
        content : details
      }
    });
    this.reprtdialogRef.afterClosed().subscribe(result => {
    });
  }
  recreateReport(data) {
    const request_payload: any = {};
    request_payload.reportType = data.reportType;
    request_payload.reportDateCategory = data.reportDateCategory;
    request_payload.filter = data.reportCriteria;
    request_payload.responseType = 'INLINE';
    this.generateReportByCriteria(request_payload).then(res => {
      this.generatedReport(res);
    },
      (error) => {
        this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
      });

  }
  generateReportByCriteria(payload) {
    return new Promise((resolve, reject) => {
      this.provider_services.generateReport(payload)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
            this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          }
        );
    });

  }
  generatedReport(report) {
      localStorage.setItem('report', JSON.stringify(report));
      this.router.navigate(['provider', 'reports', 'generated-report'], { queryParams: { reportRecreate: 'recreateReport' } });
  }
}
