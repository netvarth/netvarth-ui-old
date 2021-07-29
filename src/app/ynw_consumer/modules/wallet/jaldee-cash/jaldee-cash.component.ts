import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SubSink } from '../../../../../../node_modules/subsink';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConsumerServices } from '../../../../ynw_consumer/services/consumer-services.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { SpentListComponent } from './spent-list/spent-list.component';


@Component({
  selector: 'app-jaldee-cash',
  templateUrl: './jaldee-cash.component.html',
  styleUrls: ['./jaldee-cash.component.css']
})
export class JaldeeCashComponent implements OnInit {
  private subs = new SubSink();
  screenWidth;
  small_device_display = false;
  cashbalanceInfo:any = [];
  cashbalanceInfodetail: any;
  wallet_notes = projectConstantsLocal.WALLET_NOTES;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  cashbalanceInfoExpireddetail:any = [];
  expiredcash = false;
  loading = true;
  constructor(private location: Location,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private consumer_services: ConsumerServices,
    public shared_functions: SharedFunctions) { 
      this.onResize();
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 767) {
        this.small_device_display = true;
      } else {
        this.small_device_display = false;
      }
    }

  ngOnInit(): void {
   this.cashInfo();
   this.jaldeecashbalance();
   this.jaldeecashExpired();
  }
  cashInfo() {
    this.subs.sink=this.consumer_services.getConsumerCashbalance()
    .subscribe(
      data => {
       console.log(data);
       this.cashbalanceInfo = data;
       this.loading = false;
      },
      error => {
        this.loading = false;
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
         this.loading = false;
        },
        error => {
          this.loading = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  jaldeecashExpired(){
    this.subs.sink=this.consumer_services.getConsumerCashbalanceExpiredDetails()
    .subscribe(
      data => {
       console.log(data);
       this.cashbalanceInfoExpireddetail = data;
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
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  termsAndCondition(displayNote){
    const dialogref = this.dialog.open(TermsConditionComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        'messages': displayNote
      }
    });
    dialogref.afterClosed().subscribe(
      result => {
        if (result) {
        }
      });
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
  expiredCash(){
    if(this.expiredcash){
      this.expiredcash = false;
      } else {
        this.expiredcash = true;
      }
    }
}