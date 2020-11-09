import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { projectConstants } from '../../../../app.component';


@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  auditLogs: any = {};
  activity_log_count: any;
  activity_log: any = [];

  mrId;
  // loading = true;
  public auditlogs_dataSource = new MatTableDataSource<any>([]);
  // auditlogs_displayedColumns = ['Action'];
  auditlogs_displayedColumns = ['Action', 'Date/Time', 'userName'];
  aditlogs: any = {};
  action: any;
  loading = true;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;

  constructor(
    public dialogRef: MatDialogRef<ActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private datePipe: DateFormatPipe
  ) {
    this.mrId = this.data.mrId;

  }

  ngOnInit() {
    this.getMedicalRecordUsingMR(this.mrId);

  }
  getDate(dateTime) {
    return this.datePipe.transformToDateWithTime(new Date(dateTime));
  }
  // getDateTime(auditlogs) {
  //   console.log(auditlogs);
  //   let date = '';
  //     date = auditlogs.DateTime;
  //     console.log(date);
  //   return  this.datePipe.transformToDateWithTime(date);
  
  // }
  getMedicalRecordUsingMR(mrId) {


    this.provider_services.getMRAudits(mrId)
      .subscribe((data: any) => {
        this.loading = false;
        if (data) {
          this.auditlogs_dataSource = data;

        }
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
}

