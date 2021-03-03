import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-service-list-dialog',
  templateUrl: './service-list-dialog.component.html',
  styleUrls: ['./service-list-dialog.component.css']
})
export class ServiceListDialogComponent implements OnInit {

  former_chosen_services: any = [];
  service_list: any = [];
  selectedServices: any = [];
loading=true;
  constructor(public dialogRef: MatDialogRef<ServiceListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {

  }

  ngOnInit(): void {
    this.former_chosen_services = this.data.services;
    this.getServices();

  }

  getServices() {
    const filter1 = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.service_list = data;
          this.loading=false;

        },
        () => { }
      );
  }
  close() {
    this.dialogRef.close();
  }
  onServiceChange(event) {
    console.log(event);
  }

  onConfirm(serviceObject) {
    const selected_service_obj = serviceObject.selected.map(service => service.value);
    const result = selected_service_obj.map(a => a.id);
    console.log('selected service', result);
   this.dialogRef.close(result);
  }
  isSelected(service) {

    if (this.former_chosen_services.some(e => e === service.id)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
