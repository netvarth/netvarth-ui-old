import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SubSink } from '../../../../../node_modules/subsink';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../services/consumer-services.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  remainamount;
  cashbalanceInfo:any ;
  private subs = new SubSink();
  constructor(private location: Location,
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
         
        
        },
        error => {
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
}
