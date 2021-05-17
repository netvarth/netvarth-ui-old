import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { Router } from '@angular/router';
import { AddInboxMessagesComponent } from '../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsumerRateServicePopupComponent } from '../../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../../../ynw_consumer/services/consumer-services.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit,OnDestroy {

private subs=new SubSink();
  loading = true;
  entire_history: any = [];
  service_provider_cap = Messages.SERV_PROVIDER_CAP;
  location_cap = Messages.LOCATION_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  bill_cap = Messages.BILL_CAPTION;
  rate_your_visit = Messages.RATE_YOU_VISIT;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  notedialogRef: any;
  ratedialogRef: any;
  screenWidth;
  small_device_display = false;
  entire_history_data: any = [];

  constructor(
    public location: Location,
    public router: Router,
    public dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private consumer_services: ConsumerServices,
  ) {
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

  ngOnInit() {
    this.loading = false; // delete
     this.getHistroy();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goback() {
    this.location.back();
  }
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  addOrderMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.uid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['appt'] = 'appt';
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.notedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });

    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }
  getOrderBill(waitlist) {
    
  }
  isRated(wait) {
    if (wait.hasOwnProperty('rating')) {
      return true;
    } else {
      return false;
    }
  }
  rateOrderService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': 'order'
      }
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
         this.getHistroy();
      }
    });
  }
  getHistroy() {
    this.subs.sink=this.consumer_services.getOrderHistory()
      .subscribe(
        data => {
          this.entire_history = data;
          this.entire_history.forEach(order_history_details => {
            this.entire_history_data = order_history_details;
          });
          this.loading = false;
          
        },
        error => {
          this.loading = false;
        }
      );
  }

}
