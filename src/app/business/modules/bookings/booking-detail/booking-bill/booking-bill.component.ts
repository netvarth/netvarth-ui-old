import { Component, OnInit, Input } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ConfirmPatmentLinkComponent } from '../../../../../ynw_provider/shared/component/confirm-paymentlink/confirm-paymentlink.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-bill',
  templateUrl: './booking-bill.component.html',
  styleUrls: ['./booking-bill.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class BookingBillComponent implements OnInit {

  @Input() waitlist_data;
  @Input() bookingType;
  @Input() pos;
  bill_data: any = [];
  refund_value;
  paymentOnline;
  constructor(
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
    });
  }
  ngOnInit(): void {
    this.getPaymentSettings();
    if (this.bookingType === 'checkin') {
      if (this.pos && this.waitlist_data.waitlistStatus !== 'blocked' && (this.waitlist_data.waitlistStatus !== 'cancelled' || (this.waitlist_data.waitlistStatus === 'cancelled' && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
        this.getWaitlistBill();
      }
    } else {
      if (this.pos && this.waitlist_data.apptStatus !== 'blocked' && ((this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected') || ((this.waitlist_data.apptStatus === 'Cancelled' || this.waitlist_data.apptStatus === 'Rejected') && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
        this.getWaitlistBill();
      }
    }
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
          console.log(this.bill_data);
          if (this.bill_data.amountDue < 0) {
            this.refund_value = Math.abs(this.bill_data.amountDue);
          }
        },
        error => {
          if (error.status === 422) {
            this.bill_data = [];
          }
        });
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
    } else if (this.bookingType == 'checkin') {
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
  paymentlink() {
    let uid;
    let email;
    let phoneNo;
    if (this.bookingType == 'appointment') {
      uid = this.waitlist_data.uid;
      email = this.waitlist_data.appmtFor[0].email ? this.waitlist_data.appmtFor[0].email : '';
      phoneNo = this.waitlist_data.phoneNumber ? this.waitlist_data.phoneNumber : '';
    }
    else if (this.bookingType == 'checkin') {
      uid = this.waitlist_data.ynwUuid;
      email = this.waitlist_data.waitlistingFor[0].email ? this.waitlist_data.waitlistingFor[0].email : '';
      phoneNo = this.waitlist_data.waitlistPhoneNumber ? this.waitlist_data.waitlistPhoneNumber : '';
    }
    this.dialog.open(ConfirmPatmentLinkComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        emailId: email,
        mobilenumber: phoneNo,
        uuid: uid
      }
    });
  }
  getPaymentSettings() {
    this.provider_services.getPaymentSettings()
      .subscribe(
        (data: any) => {
          this.paymentOnline = data.onlinePayment;
        },
        () => {
        });
  }
}
