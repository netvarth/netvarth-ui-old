import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-service-list-dialog',
  templateUrl: './service-list-dialog.component.html',
  styleUrls: ['./service-list-dialog.component.css']
})
export class ServiceListDialogComponent implements OnInit {

  service_list :any   = [];
  constructor(public dialogRef: MatDialogRef<ServiceListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) { }

  ngOnInit(): void {
    this.getServices();
  }
  getServices() {
    const filter1 = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.service_list = data;
        },
        () => { }
      );
  }
  close() {
    this.dialogRef.close();
  }

}
