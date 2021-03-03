import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-consumer-group-dialog',
  templateUrl: './consumer-group-dialog.component.html',
  styleUrls: ['./consumer-group-dialog.component.css']
})
export class ConsumerGroupDialogComponent implements OnInit {

  loading=true;
  former_chosen_consumerGrps: any = [];
  consumer_group: any = [];
  selectedGroups: any = [];

  constructor(
    public dialogRef: MatDialogRef<ConsumerGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {

  }

  ngOnInit(): void {
    this.former_chosen_consumerGrps = this.data.groups;
    this.getConsumerGroups();

  }

  getConsumerGroups() {

    this.provider_services.getCustomerGroup().subscribe((data: any) => {
      this.consumer_group = data;
      this.loading =false;

    });
  }
  close() {
    this.dialogRef.close();
  }
  onGroupChange(event) {
    console.log(event);
  }

  onConfirm(groupObject) {
  const groups = groupObject.selected.map(group => group.value);
  const result = groups.map(a => a.id);
  this.dialogRef.close(result);

  }
  isSelected(group) {

    if (this.former_chosen_consumerGrps.some(e => e === group.id)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
