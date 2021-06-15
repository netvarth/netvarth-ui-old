
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from '../../../../../../../node_modules/subsink';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';

@Component({
  selector: 'app-spentlistwithid',
  templateUrl: './spentlistwithidpopup.component.html'
})

export class SpentlistwithidComponent implements OnInit {
    private subs = new SubSink();
    loading = true;
    cashspentInfo:any =[];
    totalCashspentInfo:any = [];

  constructor(public dialogRef: MatDialogRef<SpentlistwithidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private consumer_services: ConsumerServices) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.cashid) {
        this.spentlist();
    }
    this.totalSpentlist();
  }
    spentlist() {
        this.subs.sink=this.consumer_services.getConsumerCashspentWithIdDetails(this.data.cashid)
    .subscribe(
      data => {
       console.log(data);
       this.cashspentInfo = data;
       this.loading = false;
      },
      error => {
        this.loading = false;
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
    }
    totalSpentlist() {
      this.subs.sink=this.consumer_services.getConsumerTotalCashspent()
  .subscribe(
    data => {
     console.log(data);
     this.cashspentInfo = data;
     this.loading = false;
    },
    error => {
      this.loading = false;
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    }
  );
  }
  close(){
    this.dialogRef.close();  
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
