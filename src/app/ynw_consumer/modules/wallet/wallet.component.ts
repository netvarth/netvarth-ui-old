import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SubSink } from '../../../../../node_modules/subsink';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SpentListComponent } from './jaldee-cash/spent-list/spent-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  remainamount;
  cashbalanceInfo:any ;
  loading = true;
  private subs = new SubSink();
  constructor(private location: Location,
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private consumer_services: ConsumerServices,
    public router: Router) { 
    
  }

  ngOnInit(): void {
    this.jaldeecashbalance();
  }
  jaldeecashbalance() {
    this.subs.sink=this.consumer_services.getConsumerCashbalanceDetails()
      .subscribe(
        data => {
         console.log(data);
         this.cashbalanceInfo = data;
         this.remainamount= this.cashbalanceInfo.totCashAvailable;
        //  for(let info of this.cashbalanceInfo){
        //   this.remainamount= info.remainingAmt;
        //  }
        this.loading = false;
        
        },
        error => {
          this.loading = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  goBack () {
    this.location.back();
  }
  gotoJaldeeCashdetails(){
    console.log('in ')
    this.router.navigate(['consumer', 'mywallet', 'jaldee-cash']);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  spentlist(id?){
    const dialogref = this.dialog.open(SpentListComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'cashid': id
      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
        }
      });
  }
}
