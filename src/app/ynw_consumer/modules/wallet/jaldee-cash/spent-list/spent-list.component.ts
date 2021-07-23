
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from '../../../../../../../node_modules/subsink';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-spentlist',
  templateUrl: './spent-list.component.html',
   styleUrls: ['./spent-list.component.css'],
})

export class SpentListComponent implements OnInit {
    private subs = new SubSink();
    loading = true;
    cashspentInfo:any =[];
    totalCashspentInfo:any = [];
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
   

  constructor(public dialogRef: MatDialogRef<SpentListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private consumer_services: ConsumerServices) { }

  ngOnInit() {
    //this.totalSpentlist();

    if (this.data && this.data.cashid!==undefined) {
        this.spentlist();
    } else{
    this.totalSpentlist();
    }
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
    (data:any) => {
      console.log('hai');
     console.log(data);
     this.cashspentInfo = data;
    // this.loading = false;
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
