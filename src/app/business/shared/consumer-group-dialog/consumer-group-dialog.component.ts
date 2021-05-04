import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-consumer-group-dialog',
  templateUrl: './consumer-group-dialog.component.html',
  styleUrls: ['./consumer-group-dialog.component.css']
})
export class ConsumerGroupDialogComponent implements OnInit,OnDestroy {

  loading=true;
  former_chosen_consumerGrps: any = [];
  consumer_group: any = [];
  selectedGroups: any = [];
  subscription:Subscription;
  mode: any;

  constructor(
    public dialogRef: MatDialogRef<ConsumerGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {
      this.mode=this.data.mode;
  }

  ngOnInit(): void {
    this.former_chosen_consumerGrps = this.data.groups;
    this.getConsumerGroups();

  }
 ngOnDestroy(){
this.subscription.unsubscribe();
 }
  getConsumerGroups() {

    this.subscription=this.provider_services.getCustomerGroup().subscribe((data: any) => {
      this.consumer_group = data;
      console.log(this.consumer_group.length);
      this.loading =false;

    },
    error => {
      this.loading = false;
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
