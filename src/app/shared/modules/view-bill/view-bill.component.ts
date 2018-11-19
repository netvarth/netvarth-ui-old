import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { ProviderRefundComponent } from '../../../ynw_provider/components/provider-refund/provider-refund.component';
// import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';



@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html'/*,
  styleUrls: ['./view-bill.component.css']*/
})

export class ViewBillComponent implements OnInit, OnChanges {

  @Input('checkin') checkin;
  @Input('billdata') billdata;
  @Input('prepaymentlog') prepaymentlog;
  @Input() source;

  @Output() makepayment = new EventEmitter<any>();
  @Output() settlebill = new EventEmitter<any>();
  @Output() emailbill = new EventEmitter<any>();
  @Output() updatebill = new EventEmitter<any>();

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  bill_data = null;
  message = '';
  bname;
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = 'h:mm a';
  services: any = [];
  coupons: any = [];
  discounts: any = [];
  items: any = [];
  pre_payment_log: any = [];
  payment_options: any = [];
  close_msg = 'close';
  showPaidlist = false;
  showHeading = true;
  selectedItems = [];
  cart = {
    'items': [],
    'prepayment_amount' : 0,
    'sub_total': 0,
    'discount': null,
    'coupon': null,
    'total': 0
  };
  bill_load_complete = 0;
  item_service_tax: any = 0;
  item_service_gst = '';
  Pipe_disp_date = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  billdate = '';
  billtime = '';
  subtotalwithouttax = 0;
  taxtotal = 0;
  taxabletotal = 0;
  taxpercentage = 0;
  billDatedisp;
  constructor(
    public dialogRef: MatDialogRef<ViewBillComponent>,
    public dialogrefundRef: MatDialogRef<ProviderRefundComponent>,
    private dialog: MatDialog,
    // public provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sharedfunctionObj: SharedFunctions,
    public shareServicesobj: SharedServices

    ) {



     }

  ngOnInit() {
    // this.getTaxDetails();
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    const bildatesarr = this.bill_data.createdDate.split(' ');
    const billdatearr = bildatesarr[0].split('-');
    this.billDatedisp = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0] + ' ' + bildatesarr[1] + ' ' + bildatesarr[2];
    // console.log('billdata', this.bill_data);

    if (this.bill_data['passedProvname']) {
      this.bname = this.bill_data['passedProvname'];
    } else {
      const bdetails = this.sharedfunctionObj.getitemfromLocalStorage('ynwbp');
      if (bdetails) {
        this.bname = bdetails.bn || '';
      }
    }

    this.getGstandDate();
    this.pre_payment_log = this.prepaymentlog || null;
    this.bill_data.amount_to_pay = this.bill_data.netRate -  this.bill_data.totalAmountPaid;

    if (this.bill_data.service.length) {
      for (let i = 0; i < this.bill_data.service.length; i++) {
        this.bill_data.service[i]['rowtotal'] = (this.bill_data.service[i].price * this.bill_data.service[i].quantity);
        const rtotal = (this.bill_data.service[i].price * this.bill_data.service[i].quantity) - this.bill_data.service[i].discountValue - this.bill_data.service[i].couponValue;
        this.subtotalwithouttax += rtotal;
        this.bill_data.service[i].isTaxable = false;
        if (this.bill_data.service[i].GSTpercentage > 0) {
          this.bill_data.service[i].isTaxable = true;
          this.taxpercentage = this.bill_data.service[i].GSTpercentage;
          this.taxtotal += ((this.bill_data.service[i].price * this.bill_data.service[i].quantity) - (this.bill_data.service[i].discountValue + this.bill_data.service[i].couponValue) * this.bill_data.service[i].GSTpercentage / 100);
          this.taxabletotal += rtotal;
        }
      }
    }

    if (this.bill_data.items.length) {
      for (let i = 0; i < this.bill_data.items.length; i++) {
        this.bill_data.items[i]['rowtotal'] = (this.bill_data.items[i].price * this.bill_data.items[i].quantity);
        const rtotal = (this.bill_data.items[i].price * this.bill_data.items[i].quantity) - this.bill_data.items[i].discountValue - this.bill_data.items[i].couponValue;
        this.subtotalwithouttax += rtotal;
        this.bill_data.items[i].isTaxable = false;
        if (this.bill_data.items[i].GSTpercentage > 0) {
          this.bill_data.items[i].isTaxable = true;
          this.taxpercentage = this.bill_data.items[i].GSTpercentage;
         // console.log('tax', this.bill_data.items[i].itemId, this.bill_data.items[i].GSTpercentage);
          this.taxtotal += (((this.bill_data.items[i].price * this.bill_data.items[i].quantity) - ( this.bill_data.items[i].discountValue + this.bill_data.items[i].couponValue)) * this.bill_data.items[i].GSTpercentage / 100);
          this.taxabletotal += rtotal;
        }
      }
    }
    // console.log('taxable total', this.taxabletotal);

    if ( !this.checkin) {
      setTimeout(() => {
        this.dialogRef.close('error');
        }, projectConstants.TIMEOUT_DELAY);
    }

    this.getPaymentModes();
    this.bill_load_complete = 1;

    /*this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close(this.close_msg);
    });*/
  }
  getGstandDate() {
    if (this.bill_data.gstNumber) {
      this.item_service_gst = this.bill_data.gstNumber;
    } else {
      this.item_service_gst = '';
    }
    if (this.bill_data.createdDate) {
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate =  billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
    }
  }
  ngOnChanges() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    this.getGstandDate();
    this.pre_payment_log = this.prepaymentlog || null;
  }

  getPaymentModes() {
    this.shareServicesobj.getPaymentModesofProvider(this.checkin.provider.id)
    .subscribe(
      data => {
        this.payment_options = data;
      },
      error => {
        // this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }


  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  // getTaxDetails() {
  //   return new Promise((resolve, reject) => {
  //     this.shareServicesobj.getTaxpercentage()
  //     .subscribe(
  //       data => {
  //         this.item_service_tax = data['taxPercentage'];
  //         this.item_service_gst = data['gstNumber'];
  //         if (this.item_service_gst !== '' && this.item_service_gst !== undefined && this.item_service_gst !== null) {
  //           this.item_service_gst = '(' + this.item_service_gst + ')';
  //         }
  //         resolve();
  //       },
  //       error => {
  //         this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});

  //         reject(error);
  //       }
  //     );
  //   });

  // }

  updateBill() {
    this.updatebill.emit('updateBill');
  }

  makePayment() {
    this.makepayment.emit('makePayment');
  }

  settleBill() {
    this.settlebill.emit('settleBill');
  }

  confirmSettleBill() {
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message' : this.sharedfunctionObj.getProjectMesssages('PROVIDER_BILL_SETTLE_CONFIRM')
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
          this.settleBill();
      }
    });
  }

  emailBill() {
    this.emailbill.emit('emailBill');
  }

  showRefund(payment) {

   const dialogrefundRef = this.dialog.open(ProviderRefundComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        payment_det: payment
      }
    });

    dialogrefundRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getPrePaymentDetails();
      }
    });
  }

  getPrePaymentDetails() {
    this.shareServicesobj.getPaymentDetail(this.checkin.ynwUuid, 'provider')
      .subscribe(
        data => {
          this.pre_payment_log = data;
          // console.log('payment log', this.pre_payment_log);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );

  }
  stringtoDate(dt, mod) {
    let dtsarr;
    if (dt) {
      // const dts = new Date(dt);
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      let retval = '';
      if (mod === 'all') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else if (mod === 'date') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
      } else if (mod === 'time') {
        retval = dtsarr[1] + ' ' + dtsarr[2];
      }

      return retval;
      // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
    } else {
      return;
    }
  }
  showpaidSection() {
    if (this.showPaidlist) {
      this.showPaidlist = false;
    } else {
      this.showPaidlist = true;
    }
  }
  printMe() {
    // this.showHeading = false;
    window.print();
    // this.showHeading = true;
    // this.printToCart();
    // this.printElement(document.getElementById('forPrint'));
  }
  printElement(elem) {
    const domClone = elem.cloneNode(true);
    let printSection = document.getElementById('printSection');
    if (!printSection) {
        printSection = document.createElement('div');
        printSection.id = 'printSection';
        document.body.appendChild(printSection);
    }

    printSection.innerHTML = '';
    printSection.appendChild(domClone);
    window.print();
}
  /*private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
      const htmlStr: string[] = [];
      const elements = document.getElementsByTagName(tagName);
      for (let idx = 0; idx < elements.length; idx++) {
          htmlStr.push(elements[idx].outerHTML);
      }

      return htmlStr.join('\r\n');
  }
  printToCart() {
    let popupWinindow;
    const innerContents = document.getElementById('forPrint').innerHTML;
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    console.log(stylesHtml);
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" />' + stylesHtml + '</head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  }*/

}


