import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';


@Component({
  selector: 'app-last-visit',
  templateUrl: './last-visit.component.html',
  styleUrls: ['./last-visit.component.css']
})
export class LastVisitComponent implements OnInit {
  PatientId: any;
  public lastVisit_dataSource = new MatTableDataSource<any>();
  lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'userName', 'mr_createdDate'];
  providerid: any;
  accountType: any;
  constructor(public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    public dialogRef: MatDialogRef<LastVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.PatientId = this.data.patientId;
    console.log(this.PatientId);
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    if (this.accountType !== 'BRANCH') {
      this.lastVisit_displayedColumns = ['consultationDate', 'serviceName', 'mr_createdDate'];
    }
  }

  ngOnInit() {
    this.getPatientVisitList();
    // this.getproviderVisitList();
  }
  getPatientVisitList() {
    this.provider_services.getPatientVisitList(this.PatientId)
      .subscribe((data: any) => {
        this.lastVisit_dataSource = data;
        console.log(this.lastVisit_dataSource);
        this.providerid = data.providerId;
        console.log(this.providerid);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getUserName(userId) {

  }
  viewMedicalRecord(visitDetails) {
    console.log(JSON.stringify(visitDetails));
    console.log(this.PatientId);
    this.dialogRef.close();

  }
}
