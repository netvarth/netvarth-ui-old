import { Component, OnInit, Inject } from '@angular/core';
import { ReportDataService } from '../../reports-data.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-criteria-dialog',
  templateUrl: './criteria-dialog.component.html',
  styleUrls: ['./criteria-dialog.component.css']
})
export class CriteriaDialogComponent implements OnInit {
  time_period: any = [];
  api_success_msg: string;
  api_error_msg: string;
  criteria_name = '';
  report_criteria_ip: any;
  for_view = false;
  api_success = false;
  api_error = false;
  constructor(
    private report_data_service: ReportDataService,
    private provider_services: ProviderServices,
    public dialogRef: MatDialogRef<CriteriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.time_period = projectConstantsLocal.REPORT_TIMEPERIOD;
    this.report_criteria_ip = this.report_data_service.getReportCriteriaInput();
    if (this.data.content) {
      this.for_view = true;
    } else {
      this.for_view = false;
    }

  }

  saveCriteria() {

    this.api_success = false;
    this.api_error = false;
    if (this.criteria_name && this.criteria_name.trim() !== '') {
      if (/^[A-Za-z0-9\s@]*$/.test(this.criteria_name) !== true) {
        this.api_error = true;
        this.api_error_msg = 'Only letters numbers and spacess allowed';
      } else {

        this.provider_services.saveReportCriteria(this.criteria_name, this.report_criteria_ip).subscribe(data => {
          this.api_success = true;
          this.api_success_msg = 'Report saved successfully';
          setTimeout(() => {
            this.dialogRef.close();
          }, 2000);
        },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
      }
    } else {
      this.api_error = true;
      this.api_error_msg = 'Please enter the report name';
    }
  }
  getReportDateCategoryName(name) {
    const timePeriodObject = this.time_period.find(x => x.value === name);
    return timePeriodObject.displayName;
  }
  keyPress() {
    this.api_error = false;
  }
}
