import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SubSink } from '../../../../../../node_modules/subsink';
import { TermsconditionComponent } from './termscondition/termsconditionpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../../../ynw_consumer/services/consumer-services.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';


@Component({
  selector: 'app-jaldee-cash',
  templateUrl: './jaldee-cash.component.html',
  styleUrls: ['./jaldee-cash.component.css']
})
export class JaldeeCashComponent implements OnInit {
  private subs = new SubSink();
  screenWidth: number;
  small_device_display: boolean;
  cashbalanceInfo:any = [];
  cashbalanceInfodetail: any;
  wallet_notes = projectConstantsLocal.WALLET_NOTES;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  constructor(private location: Location,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private consumer_services: ConsumerServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit(): void {
   this.cashInfo();
   this.jaldeecashbalance();
  }
  cashInfo() {
    this.subs.sink=this.consumer_services.getConsumerCashbalance()
    .subscribe(
      data => {
       console.log(data);
       this.cashbalanceInfo = data;
       
      
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  jaldeecashbalance() {
    this.subs.sink=this.consumer_services.getConsumerCashbalanceDetails()
      .subscribe(
        data => {
         console.log(data);
         this.cashbalanceInfodetail = data;
        
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
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  termsAndCondition(){
    const dialogref = this.dialog.open(TermsconditionComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        'messages': 'terms and conditions'
      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
        }
      });
  }
}
