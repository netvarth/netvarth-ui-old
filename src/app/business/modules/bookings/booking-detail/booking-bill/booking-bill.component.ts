import { Component, OnInit, Input } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-booking-bill',
  templateUrl: './booking-bill.component.html',
  styleUrls: ['./booking-bill.component.css','../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class BookingBillComponent implements OnInit {

  @Input() waitlist_data;
  bill_data: any = [];
  bookingType;
  deliveryCharge = 0;
  changedDate;
  billNotesExists = false;
  discountPrivateNotes = false;
  discountDisplayNotes = false;
  spname: any;
  showPayWorkBench = false;
  displayNoteedit = false;
  billDisplayNote = '';
  privateNoteedit = false;
  billPrivateNote = '';
  refund_value;
  bill_load_complete = 0;
  amountpay;
  billdate = '';
  billtime = '';
  gstnumber = '';
  billnumber = '';

  constructor(
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
    });
  }

  getWaitlistBill() {
    let uid;
    if (this.bookingType == 'appointment') {
      uid = this.waitlist_data.uid;
    }
    else if (this.bookingType == 'checkin') {
      uid = this.waitlist_data.ynwUuid;
    }
    this.provider_services.getWaitlistBill(uid)
      .subscribe(
        data => {
          this.bill_data = data;
          this.deliveryCharge = this.bill_data.deliveryCharges;
          this.changedDate = this.changeDate(this.bill_data.createdDate);
          this.billNotesExists = false;
          for (let i = 0; i < this.bill_data.discount.length; i++) {
            if (this.bill_data.discount[i].privateNote) {
              this.discountPrivateNotes = true;
            }
            if (this.bill_data.discount[i].displayNote) {
              this.discountDisplayNotes = true;
            }
          }
          if (this.bill_data.displayNotes || this.bill_data.privateNotes || this.discountDisplayNotes || this.discountPrivateNotes) {
            this.billNotesExists = true;
          }
          if (this.bill_data.accountProfile.providerBusinessName) {
            this.spname = this.bill_data.accountProfile.providerBusinessName;
          }
          if (this.showPayWorkBench) {
            this.showPayment();
          }
          if (this.bill_data.displayNotes) {
            this.displayNoteedit = true;
            this.billDisplayNote = this.bill_data.displayNotes.displayNotes;
          }
          if (this.bill_data.privateNotes) {
            this.privateNoteedit = true;
            this.billPrivateNote = this.bill_data.privateNotes.privateNotes;
          }
          if (this.bill_data.amountDue < 0) {
            this.refund_value = Math.abs(this.bill_data.amountDue);
          }
          this.getBillDateandTime();
          console.log('Bill');
          console.log(this.bill_data);
        },
        error => {
          if (error.status === 422) {
            this.bill_data = [];
          }
          this.bill_load_complete = 1;
        },
        () => {
          this.bill_load_complete = 1;
        }
      );
  }

  changeDate(time) {
    const r = time.match(/^\s*([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)(.*)$/);
    return r[3] + '-' + r[2] + '-' + r[1] + r[4];
  }

  showPayment() {
    this.amountpay = this.bill_data.amountDue;
    this.showPayWorkBench = true;
  }

  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      this.billdate = this.bill_data.createdDate;
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate = billdatearr[0] + '-' + billdatearr[1] + '-' + billdatearr[2];
      console.log(this.billdate);
    } else {
      this.billdate = this.bill_data.createdDate;
    }
    // const gethrs = this.today.getHours();
    // const amOrPm = (gethrs < 12) ? 'AM' : 'PM';
    // let hour = 0;
    // if (gethrs === 12) {
    //   hour = 12;
    // } else if (gethrs > 12) {
    //   hour = gethrs - 12;
    // } else {
    //   hour = gethrs;
    // }
    const bill_time = this.bill_data.createdDate.split(" ");
    this.billtime = bill_time[1] + ' ' + bill_time[2];
    // this.billtime = this.dateTimeProcessor.addZero(hour) + ':' + this.dateTimeProcessor.addZero(this.today.getMinutes()) + ' ' + amOrPm;
    if (this.bill_data.hasOwnProperty('gstNumber')) {
      this.gstnumber = this.bill_data.gstNumber;
    }
    if (this.bill_data.hasOwnProperty('billId')) {
      this.billnumber = this.bill_data.billId;
    }
  }

  viewBillPage() {
    let uid;
    if (this.bookingType == 'appointment') {
      uid = this.waitlist_data.uid;
    }
    else if (this.bookingType == 'checkin') {
      uid = this.waitlist_data.ynwUuid;
    }
    this.getBill(uid);
  }
  getBill(uid) {
    if (this.bookingType == 'appointment') {
      this.provider_services.getWaitlistBill(uid)
        .subscribe(
            data => {
                this.router.navigate(['provider', 'bill', uid], { queryParams: { source: 'appt' } });
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }

    else if (this.bookingType == 'checkin') {
      this.provider_services.getWaitlistBill(uid)
        .subscribe(
            data => {
                this.router.navigate(['provider', 'bill', uid]);
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
  }

  ngOnInit(): void {
    console.log(this.bookingType);
    console.log('Data');
    console.log(this.waitlist_data);
    if((this.bookingType == 'checkin' && this.waitlist_data.waitlistStatus != 'cancelled') ||
       (this.bookingType == 'appointment' && this.waitlist_data.apptStatus != 'Cancelled')) {
      this.getWaitlistBill();
    }
  }

}
