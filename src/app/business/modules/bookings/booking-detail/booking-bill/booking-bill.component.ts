import { Component, OnInit, Input, HostListener } from '@angular/core';
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
  loading = false;
  small_device_display = false;
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
    this.onResize();
    this.getPaymentSettings();
    if (this.bookingType === 'checkin') {
      if (this.pos && this.waitlist_data.waitlistStatus !== 'blocked' && (this.waitlist_data.waitlistStatus !== 'cancelled' || (this.waitlist_data.waitlistStatus === 'cancelled' && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
        this.loading = true;
        this.getWaitlistBill();
      }
    } else {
      if (this.pos && this.waitlist_data.apptStatus !== 'blocked' && ((this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected') || ((this.waitlist_data.apptStatus === 'Cancelled' || this.waitlist_data.apptStatus === 'Rejected') && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
        this.loading = true;
        this.getWaitlistBill();
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getWaitlistBill(type?) {
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
          if (this.bill_data.amountDue < 0) {
            this.refund_value = Math.abs(this.bill_data.amountDue);
          }
          this.loading = false;
          if (type) {
            if (this.bookingType == 'appointment') {
              this.router.navigate(['provider', 'bill', uid], { queryParams: { source: 'appt' } });
            } else {
              this.router.navigate(['provider', 'bill', uid]);
            }
          }
        },
        error => {
          if (error.status === 422) {
            this.bill_data = [];
          }
          this.loading = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
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
  checkDisable() {
    if (!this.loading) {
      if (!this.pos) {
        return true;
      }
      if (this.bookingType === 'checkin' && ((this.waitlist_data.waitlistStatus === 'cancelled' && this.waitlist_data.paymentStatus === 'NotPaid') || this.waitlist_data.waitlistStatus === 'blocked')) {
        return true;
      }
      if (this.bookingType === 'appointment' && ((this.waitlist_data.apptStatus === 'Cancelled' && this.waitlist_data.paymentStatus === 'NotPaid') || this.waitlist_data.apptStatus === 'blocked')) {
        return true;
      }
    }
    return false;
  }
}
