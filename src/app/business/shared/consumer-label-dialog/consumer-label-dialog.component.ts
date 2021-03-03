import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-consumer-label-dialog',
  templateUrl: './consumer-label-dialog.component.html',
  styleUrls: ['./consumer-label-dialog.component.css']
})
export class ConsumerLabelDialogComponent implements OnInit {

loading=true;
  former_chosen_consumerLables: any = [];
  consumer_labels: any = [];
  selectedLabels: any = [];

  constructor(
    public dialogRef: MatDialogRef<ConsumerLabelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private provider_services: ProviderServices) {

  }

  ngOnInit(): void {
    this.former_chosen_consumerLables = this.data.labels;
    this.getConsumerLabels();

  }

  getConsumerLabels() {

    this.provider_services.getLabelList()
    .subscribe(
      (data: any) => {
        this.consumer_labels = data;
        this.loading=false;
      },
      error => {

      }
    );
  }
  close() {
    this.dialogRef.close();
  }
  onLabelChange(event) {
    console.log(event);
  }

  onConfirm(labelObject) {
  const labels = labelObject.selected.map(label => label.value);
  const result = labels.map(a => a.id);
   this.dialogRef.close(result);
  }
  isSelected(group) {

    if (this.former_chosen_consumerLables.some(e => e === group.id)) {
      /* former_chosen_services contains the service we're looking for */

      return true;
    } else {

      return false;
    }
  }
}
