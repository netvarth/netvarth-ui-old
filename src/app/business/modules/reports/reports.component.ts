import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ReportDataService } from './reports-data.service';
import { ProviderServices } from '../../services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { CriteriaDialogComponent } from './generated-report/criteria-dialog/criteria-dialog.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  msg = 'Do you really want to delete this report ? ';
  order_criteria: any[];
  crm_criteria: any[];
  crm_lead_status_criteria: any[];
  consolidated_criteria: any[];
  tat_criteria: any[];
  recommended_status_criteria: any[];
  login_criteria: any[];
  processing_files_criteria: any[];
  enquiry_criteria: any[];
  HO_lead_criteria: any[];
  sanctioned_status_criteria: any[];
  sanctionedReports = [];
  enquiryReports = [];
  monthlyActivityReports = [];
  monthly_criteria: any[];
  appointmentReports = [];
  donationReports = [];
  paymentReports = [];
  checkinReports = [];
  orderReports = [];
  crmReports = [];
  leadStatusReports = [];
  processingFilesReports = [];
  consolidatedReports = [];
  tatReports = [];
  recommendedStatusReports = [];
  HOLeadsReports = [];
  employee_activity_criteria: any[];
  employeeActivityReports = [];
  daily_activity_criteria: any[];
  dailyActivityReports = [];
  customer_report_criteria: any[];
  customerReports = [];
  customer_wise_enquiry_criteria: any[];
  customerWiseEnquiryReports = [];
  document_collection_criteria: any[];
  documentCollectedReports = [];
  loan_application_criteria: any[];
  loanApplicatioinReports = [];
  loan_user_criteria: any[];
  loanUserReports = [];
  loan_partner_wise_criteria: any[];
  loanPartnerWiseReports = [];
  customer_crif_Status_criteria: any;
  customerCrifStatusReports = [];
  loginReports = [];
  settings: any = [];
  showToken = false;
  criteria_list;
  appt_criteria = [];
  payment_criteria = [];
  token_criteria = [];
  donation_criteria = [];
  reprtdialogRef: any;
  active_user: any;
  taskStatus;
  constructor(private router: Router, private report_dataService: ReportDataService,
    private provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService) {
    this.report_dataService.updateCustomers('All');
    this.report_dataService.updatedQueueDataSelection('All');
    this.report_dataService.updatedScheduleDataSelection('All');
    this.report_dataService.updatedServiceDataSelection('All');
    this.report_dataService.storeSelectedValues({});
  }

  ngOnInit() {
    this.getProviderSettings();
    this.getCriteriaList();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getGlobalSettings()
  }
  getGlobalSettings() {
    this.provider_services.getAccountSettings().then(
      (data: any) => {
        console.log("Global settings :", data)
        this.taskStatus = data.enableTask;
      });
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .then(data => {
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
    this.crm_criteria = [];
    this.crm_lead_status_criteria = [];
    this.consolidated_criteria = [];
    this.tat_criteria = [];
    this.login_criteria = [];
    this.recommended_status_criteria = [];
    this.processing_files_criteria = [];
    this.HO_lead_criteria = [];
    this.sanctioned_status_criteria = [];
    this.employee_activity_criteria = [];
    this.daily_activity_criteria = [];
    this.customer_report_criteria = [];
    this.customer_wise_enquiry_criteria = [];
    this.document_collection_criteria = [];
    this.loan_application_criteria = [];
    this.loan_partner_wise_criteria = [];
    this.loan_user_criteria = [];
    this.customer_crif_Status_criteria = [];
    this.payment_criteria = [];
    this.token_criteria = [];
    this.donation_criteria = [];
    this.enquiry_criteria = [];
    this.monthly_criteria = []
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
          case 'CRM_TASK': {
            this.crm_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'CRM_LEAD': {
            this.crm_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'LEAD_STATUS': {
            this.crm_lead_status_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'ENQUIRY_REPORT': {
            this.enquiry_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'MONTHLY_ACTIVITY': {
            this.monthly_criteria.push(this.criteria_list[i])
            break;
          }
          case 'PROCESSING_FILES_REPORT': {
            this.processing_files_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'TAT_REPORT': {
            this.tat_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'CONSOLIDATED_REPORT': {
            this.consolidated_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'RECOMMENDED_STATUS_REPORT': {
            this.recommended_status_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'LOGIN_REPORT': {
            this.login_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'HO_LEADS_STATUS': {
            this.HO_lead_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'SANCTIONED_STATUS': {
            this.sanctioned_status_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'EMPLOYEE_AVERAGE_TAT': {
            this.employee_activity_criteria.push(this.criteria_list[i]);
            break;
          }

          case 'DAILY_ACTIVITY': {
            this.daily_activity_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'CUST_REPORT': {
            this.customer_report_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'CUST_CRIF_STATUS': {
            this.customer_crif_Status_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'CUST_ENQUIRY': {
            this.customer_wise_enquiry_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'DOCUMENT_COLLECTION': {
            this.document_collection_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'LOAN_REPORT': {
            this.loan_application_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'LOAN_USER_REPORT': {
            this.loan_user_criteria.push(this.criteria_list[i]);
            break;
          }
          case 'LOAN_PARTENER_REPORT': {
            this.loan_partner_wise_criteria.push(this.criteria_list[i]);
            break;
          }

        }
      }
    });
  }
  deletCriteria(del_item) {
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.msg
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
        this.provider_services.deleteCriteria(del_item).subscribe(data => {
          if (data) {
            this.getCriteriaList();
            this.snackbarService.openSnackBar('Report Deleted');
          }
        });
      }
    });

  }
  viewCriteria(details) {
    console.log("Detailssssss....", details)
    this.reprtdialogRef = this.dialog.open(CriteriaDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        content: details,

      }
    });
    this.reprtdialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
    console.log("View Details :", details.reportName, details.reportType, details.donorName);

    //   this.reprtdialogRef = this.dialog.open(CriteriaDialogComponent, {
    //     width: '50%',

    //     panelClass: ['popup-class', 'commonpopupmainclass'],
    //     disableClose: true,
    //     data: {
    //       purpose : 'view',
    //       content : details

    //     }
    //   });
    //  this.reprtdialogRef.afterClosed().subscribe(
    //     result => {
    //       if (result) {
    //         // this.getCriteriaList();
    //         // console.log("Criteria List : ",result, this.getCriteriaList())
    //       }
    //     }
    //   );
    // this.reprtdialogRef.afterClosed().subscribe(result => {

    // });
  }

  // recreateReport(data) {
  //   const request_payload: any = {};
  //   request_payload.reportType = data.reportType;
  //   request_payload.reportDateCategory = data.reportDateCategory;
  //   request_payload.filter = data.reportCriteria;
  //   request_payload.responseType = 'INLINE';
  //   this.generateReportByCriteria(request_payload).then(res => {
  //     this.generatedReport(res);
  //   },
  //     (error) => {
  //       this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
  //     });

  // }
  recreateReport(data) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        token: data.reportToken
      }
    };
    // this.lStorageService.setitemonLocalStorage('report', JSON.stringify(report));
    this.router.navigate(['provider', 'reports', 'generated-report'], navigationExtras);

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
            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          }
        );
    });

  }
  generatedReport(report) {
    this.lStorageService.setitemonLocalStorage('report', JSON.stringify(report));
    this.router.navigate(['provider', 'reports', 'generated-report'], { queryParams: { reportRecreate: 'recreateReport' } });
  }
}
