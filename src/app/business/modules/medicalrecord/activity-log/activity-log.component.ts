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
  mrId;
  // loading = true;
  public lastVisit_dataSource = new MatTableDataSource<any>([]);
  auditlogs_displayedColumns = ['Action', 'Description',  'Date/Time', 'userName' ];
  aditlogs: any;

  constructor(
  public dialogRef: MatDialogRef<ActivityLogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public sharedfunctionObj: SharedFunctions,
  public provider_services: ProviderServices,
  ) {
    this.mrId = this.data.mrId;
    console.log(this.mrId);
    
  }

  ngOnInit() {
    if (this.mrId !== 0) {
      this.getMedicalRecordUsingMR(this.mrId);
    }
  }
  getMedicalRecordUsingMR(mrId: any) {
    this.provider_services.GetMedicalRecord(mrId)
    .subscribe((data: any) => {
      this.aditlogs = data;
      console.log(this.aditlogs);
      const mraditlogs = [];
      mraditlogs.push(this.aditlogs.auditLogs);
      // console.log(JSON.stringify(data.auditLogs.medicalRecord));
      // console.log(mraditlogs.Actions);

      // this.loading = false;
    },
      error => {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
  }
}
