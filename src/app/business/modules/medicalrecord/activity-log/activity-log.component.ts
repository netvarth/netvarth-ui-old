import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
  activity_log_count: any;
  activity_log: any = [];
  auditlogs: any;
  mrId;
  // loading = true;
  public log_dataSource = new MatTableDataSource<any>([]);
  auditlogs_displayedColumns = ['Action', 'Description', 'Date/Time', 'userName'];
  aditlogs: any = {};

  constructor(
    public dialogRef: MatDialogRef<ActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
  ) {
    this.auditlogs = this.data.activity_log;
    // IF CONDITION
    this.activity_log.push(JSON.parse(this.auditlogs.clinicalNotes));
    this.activity_log.push(JSON.parse(this.auditlogs.medicalRecord));
    this.activity_log.push(JSON.parse(this.auditlogs.prescription));
    this.activity_log_count = this.activity_log.length;

  }

  ngOnInit() {


  }
}
