import { Component, OnInit, Inject } from '@angular/core';
import { ReportDataService } from '../../reports-data.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-criteria-dialog',
  templateUrl: './criteria-dialog.component.html',
  styleUrls: ['./criteria-dialog.component.css']
})
export class CriteriaDialogComponent implements OnInit {
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
    public shared_Functionsobj: SharedFunctions
  ) { }

  ngOnInit() {
    this.report_criteria_ip = this.report_data_service.getReportCriteriaInput();
    if (this.data.content) {
      this.for_view = true;
    } else {
      this.for_view = false;
    }
  }
  saveCriteria() {
    if (this.criteria_name && this.criteria_name.trim() !== '') {
      this.provider_services.saveReportCriteria(this.criteria_name, this.report_criteria_ip).subscribe(data => {
        this.api_success = true;
        setTimeout(() => {
          this.dialogRef.close();
        }, 2000);
      },
      error => {
        this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    } else {
      this.api_error = true;
    }
  }
  keyPress() {
    this.api_error = false;
  }
}
