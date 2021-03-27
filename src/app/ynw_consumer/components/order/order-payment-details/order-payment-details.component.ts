import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-order-payment-details',
  templateUrl: './order-payment-details.component.html',
  styleUrls: ['./order-payment-details.component.css']
})
export class OrderPaymentDetailsComponent implements OnInit ,OnDestroy{
   
  payments: any;
  breadcrumbs;
  date_cap = Messages.DATE_CAP;
  time_cap = Messages.TIME_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  status_cap = Messages.PAY_STATUS;
  mode_cap = Messages.MODE_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  private subs=new SubSink();
  constructor(public shared_functions: SharedFunctions,
      private router: Router,
      private dateTimeProcessor: DateTimeProcessor,
      private shared_services: SharedServices) {

  }
  ngOnInit() {
      this.breadcrumbs = [
          {
              title: 'My Jaldee',
              url: 'consumer'
          },
          {
              title: 'Payment Logs'
          }
      ];
      this.getPayments();
  }
  ngOnDestroy(): void {
   this.subs.unsubscribe();
}
  stringtoDate(dt, mod) {
      let dtsarr;
      if (dt) {
          dtsarr = dt.split(' ');
          const dtarr = dtsarr[0].split('-');
          let retval = '';
          if (mod === 'all') {
              retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
          } else if (mod === 'date') {
              retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
          } else if (mod === 'time') {
              retval = dtsarr[1] + ' ' + dtsarr[2];
              const slots = retval.split('-');
              retval = this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
          }
          return retval;
          // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else {
          return;
      }
  }
  getPayments() {
     this.subs.sink= this.shared_services.getConsumerPayments().subscribe(
          (payments) => {
              this.payments = payments;
          }
      );
  }
  gotoPayment(id) {
      this.router.navigate(['consumer', 'payments', id]);
  }
  providerDetail(id, event) {
      event.stopPropagation();
      this.router.navigate(['searchdetail', id]);
    }

}
