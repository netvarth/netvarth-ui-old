import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../services/group-storage.service';
import { Title } from '@angular/platform-browser';
import { TeleBookingService } from '../../services/tele-bookings-service';
import { AddInboxMessagesComponent } from '../../components/add-inbox-messages/add-inbox-messages.component';
import { ConsumerAuthService } from '../../services/consumer-auth-service';
import { findPhoneNumbersInText } from 'libphonenumber-js';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-tele-home',
  templateUrl: './tele-home.component.html',
  styleUrls: ['./tele-home.component.css']
})
export class TeleHomeComponent implements OnInit {
  path = projectConstants.PATH;
  elementType = 'url';
  qr_value: string;
  load_complete = 0;
  api_loading = true;
  newDateFormat = projectConstants.DATE_MM_DD_YY_FORMAT;
  videoList: any = [];
  phoneNumber;
  videoCall: any;
  phone: any;
  uuid: any;
  meetingList: any = [];
  video: any;
  isLoggedIn: boolean;
  gBookings: any;
  messageDialog: any;
  isToday = false;
  noBookings = true;
  loggedUser;
  password;
  countryCode: string;
  phoneObj: any;
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private teleService: TeleBookingService,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public router: Router,
    private groupService: GroupStorageService,
    public date_format: DateFormatPipe,
    private titleService: Title,
    private authService: ConsumerAuthService,
    private snackbarService: SnackbarService
  ) {
    this.titleService.setTitle('Jaldee - Meetings');
    this.activated_route.params.subscribe(
      qparams => {
        if (qparams.phonenumber !== 'new') {
          this.phoneObj = findPhoneNumbersInText('+' + qparams.phonenumber);
        }
      });
    this.activated_route.queryParams.subscribe(
      qparams => {
        if (qparams.pwd) {
          this.password = qparams.pwd;
        }
        // this.password = qparams.pwd;
      });
  }
  ngOnInit() {
    this.api_loading = true;
    if (this.phoneObj.length > 0) {
      this.phone = this.phoneObj[0].number.nationalNumber;
      this.countryCode = this.phoneObj[0].number.countryCallingCode;

      if (this.password) {
        this.authService.goThroughConsumerLogin(this.phone, this.countryCode, this.password).then(
          () => {
            this.isLoggedIn = true;
            const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
            this.isLoggedIn = true;
            this.loggedUser = activeUser;
            this.getVideo();
          }
        )
      } else {
        this.isLoggedIn = false;
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        if (activeUser) {
          this.isLoggedIn = true;
          this.loggedUser = activeUser;
          this.getVideo();
        }
        else {
          this.api_loading = false;
          this.doLogin('consumer');
        }
      }




    } else {
      this.snackbarService.openSnackBar("Meeting Room not available for this number", { 'panelClass': 'snackbarerror' });
    }


  }
  doLogin(origin?, passParam?) {
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.isLoggedIn = true;
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        this.loggedUser = activeUser;
        this.getVideo();
      } else if (result === 'showsignup') {
      }
    });
  }

  /**
   * 
   */
  getVideo() {
    this.api_loading = true;
    this.teleService.getAvailableBookings(this.countryCode, this.phone)
      .then((bookings: any) => {
        this.api_loading = false;
        console.log(bookings);
        if (bookings.length > 0) {
          this.noBookings = false;
          this.gBookings = this.shared_functions.groupBy(bookings, 'bookingDate');
          console.log(new Date());
          let myDate = this.date_format.transformTofilterDate(new Date());
          console.log("MyDate:" + myDate);
          if (Object.keys(this.gBookings)[0] === myDate) {
            this.isToday = true;
          }
          console.log(Object.keys(this.gBookings)[0]);
        } else {
          this.noBookings = true;
        }
      },
        () => {
          this.api_loading = false;
        });
  }

  /**
   * 
   */
  startVideo() {
    this.router.navigate(['meeting', this.phoneNumber, this.videoCall.uid]);
  }

  /**
   * 
   * @param booking 
   */
  viewBooking(booking) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: booking.id,
        providerId: booking.businessId
      }
    };
    if (booking.bookingType === 'appt') {
      this.router.navigate(['consumer', 'apptdetails'], navigationExtras);
    } else {
      this.router.navigate(['consumer', 'checkindetails'], navigationExtras);
    }
  }

  /**
   * 
   * @param booking 
   */
  joinJaldeeVideo(booking) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        src: 'room'
      }
    };
    this.router.navigate(['meeting', this.countryCode + "" + this.phone, booking.id], navigationExtras);
  }

  // cancelBooking(booking) {

  //     this.shared_functions.doCancelWaitlist(booking, this)
  //       .then(
  //         data => {
  //           this.gBookings = {};
  //           this.getVideo();
  //         },
  //         error => {
  //           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //         }
  //       );
  // }

  /**
   * 
   * @param booking 
   */
  sendMessage(booking) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['user_id'] = booking.businessId;
    pass_ob['name'] = booking.businessName;
    pass_ob['typeOfMsg'] = 'single';
    if (booking.bookingType === 'appt') {
      pass_ob['appt'] = booking.bookingType;
      pass_ob['uuid'] = booking.id;
    } else if (booking.type === 'orders') {
      pass_ob['orders'] = booking.bookingType;
      pass_ob['uuid'] = booking.id;
    } else {
      pass_ob['uuid'] = booking.id;
    }
    this.openMessageDialog(pass_ob);
  }

  /**
   * 
   * @param pass_ob 
   */
  openMessageDialog(pass_ob) {
    this.messageDialog = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.messageDialog.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
}

