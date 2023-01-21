import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
// import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../services/group-storage.service';
import { Title } from '@angular/platform-browser';
import { TeleBookingService } from '../../services/tele-bookings-service';
import { AddInboxMessagesComponent } from '../../components/add-inbox-messages/add-inbox-messages.component';
import { ConsumerAuthService } from '../../services/consumer-auth-service';
import { findPhoneNumbersInText } from 'libphonenumber-js';
import { SnackbarService } from '../../services/snackbar.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { AuthService } from '../../services/auth-service';
import { SharedServices } from '../../services/shared-services';
import { SubSink } from 'subsink';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { DomainConfigGenerator } from '../../services/domain-config-generator.service';
@Component({
  selector: 'app-tele-home',
  templateUrl: './tele-home.component.html',
  styleUrls: ['./tele-home.component.css']
})
export class TeleHomeComponent implements OnInit {
  path = projectConstantsLocal.PATH;
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
  isJaldeeConsumer: boolean;
  loggedUser;
  password;
  countryCode: string;
  phoneObj: any;
  customId: any;
  private subscriptions = new SubSink();
  accountId: any;
  accountConfig: any;
  constructor(
    private sharedFunctions: SharedFunctions,
    private teleService: TeleBookingService,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public router: Router,
    private groupService: GroupStorageService,
    public date_format: DateFormatPipe,
    private titleService: Title,
    private cAuthService: ConsumerAuthService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private sharedServices: SharedServices,
    private s3Processor: S3UrlProcessor,
    private lStorageService: LocalStorageService,
    private configService: DomainConfigGenerator,
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
        if(qparams.customId && !qparams.pwd) {
          this.customId = qparams.customId;
          this.isJaldeeConsumer = false;
        } else {
          this.isJaldeeConsumer = true;
          
        }
      });
  }
  ngOnInit() {
    this.api_loading = true;
    if (this.phoneObj.length > 0) {
      this.phone = this.phoneObj[0].number.nationalNumber;
      this.countryCode = this.phoneObj[0].number.countryCallingCode;
      if (this.isJaldeeConsumer) {
        this.initJaldeeConsumerSettings();
      } else {
        this.initProviderConsumer();
      }
    } else {
      this.snackbarService.openSnackBar("Meeting Room not available for this number", { 'panelClass': 'snackbarerror' });
    }
  }
  actionPerformed(status) {
    if (status === 'success') {
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        this.isLoggedIn = true;
        this.loggedUser = activeUser;
        this.getVideo();
    }
  }
  initProviderConsumer() {
    const _this = this;
    if (!this.lStorageService.getitemfromLocalStorage('reqFrom')) {
      this.lStorageService.setitemonLocalStorage('reqFrom', 'WEB_LINK');
    }
    this.getAccountIdFromEncId(this.customId).then(
      (uniqueId: any)=> {
        _this.configService.getUIAccountConfig(uniqueId).subscribe(
          (uiconfig: any) => {
            _this.accountConfig = uiconfig;
          });
        _this.getBusinessInfo(uniqueId).then((businessProfile: any)=> {
          _this.authService.goThroughLogin().then(
            (status) => {
              if (status) {
                _this.isLoggedIn = true;
                const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
                _this.isLoggedIn = true;
                _this.loggedUser = activeUser;
                _this.getVideo();
              } else {
                _this.isLoggedIn = false;
                _this.api_loading = false;
              }
            }
          );
        })
      }
    )
    
    
  }
  getBusinessInfo(uniqueId) {
    const self = this;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'businessProfile';
      self.subscriptions.sink = self.s3Processor.getJsonsbyTypes(uniqueId,
        null, accountS3List).subscribe(
          (accountS3s: any) => {
            self.accountId = accountS3s.businessProfile.id;
            self.api_loading = false;
            
            // let accountIdFromStorage = self.lStorageService.getitemfromLocalStorage('accountId');
            // if (accountIdFromStorage && accountIdFromStorage != accountS3s.businessProfile.id && self.groupService.getitemFromGroupStorage('ynw-user')) {
            //   self.authService.doLogout().then(
            //     () => {
            //       self.setSystemDate();
            //       if (self.providercustomId) {
                    self.lStorageService.setitemonLocalStorage('customId', self.customId);
                    self.lStorageService.setitemonLocalStorage('accountId', accountS3s.businessProfile.id);
            //       } else {
            //         self.lStorageService.setitemonLocalStorage('customId', self.provideraccEncUid);
            //       }
            //       self.lStorageService.setitemonLocalStorage('accountId', accountS3s.businessProfile.id);
            //       resolve(true);
            //     }
            //   )
            // } else {
            //   if (self.providercustomId) {
            //     self.lStorageService.setitemonLocalStorage('customId', self.providercustomId);
            //   } else {
            //     self.lStorageService.setitemonLocalStorage('customId', self.provideraccEncUid);
            //   }
            //   self.lStorageService.setitemonLocalStorage('accountId', accountS3s.businessProfile.id);
              resolve(true);
            // }
          });
    })

  }
  /**
   * 
   * @param encId encId/customId which represents the Account
   * @returns the unique provider id which will gives access to the s3
   */
   getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.sharedServices.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            _this.router.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }
  initJaldeeConsumerSettings() {
    const _this= this;
    if (_this.password) {
      _this.cAuthService.goThroughConsumerLogin(_this.phone, _this.countryCode, _this.password).then(
        () => {
          _this.isLoggedIn = true;
          const activeUser = _this.groupService.getitemFromGroupStorage('ynw-user');
          _this.isLoggedIn = true;
          _this.loggedUser = activeUser;
          _this.getVideo();
        }
      )
    } else {
      _this.api_loading =false;
      _this.isLoggedIn = false;
      const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
      if (activeUser) {
        _this.isLoggedIn = true;
        _this.loggedUser = activeUser;
        _this.getVideo();
      }
      else {
        _this.api_loading = false;
        _this.isLoggedIn = false;
        // this.doLogin('consumer');
      }
    }
  }
  // doLogin(origin?, passParam?) {
  //   const is_test_account = true;
  //   const dialogRef = this.dialog.open(ConsumerJoinComponent, {
  //     width: '40%',
  //     panelClass: ['loginmainclass', 'popup-class'],
  //     disableClose: true,
  //     data: {
  //       type: origin,
  //       is_provider: false,
  //       modal: 'dialog',
  //       test_account: is_test_account,
  //       moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'success') {
  //       this.isLoggedIn = true;
  //       const pdata = { 'ttype': 'updateuserdetails' };
  //       this.sharedFunctions.sendMessage(pdata);
  //       this.sharedFunctions.sendMessage({ ttype: 'main_loading', action: false });
  //       const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
  //       this.loggedUser = activeUser;
  //       this.getVideo();
  //     } else if (result === 'showsignup') {
  //     }
  //   });
  // }
  /**
   * 
   */
  getVideo() {
    const _this= this;
    _this.api_loading = true;
    _this.teleService.getAvailableBookings(_this.countryCode, _this.phone)
      .then((bookings: any) => {
        _this.api_loading = false;
        console.log(bookings);
        if (bookings.length > 0) {
          _this.noBookings = false;
          _this.gBookings = _this.sharedFunctions.groupBy(bookings, 'bookingDate');
          console.log(new Date());
          let myDate = _this.date_format.transformTofilterDate(new Date());
          console.log("MyDate:" + myDate);
          if (Object.keys(_this.gBookings)[0] === myDate) {
            _this.isToday = true;
          }
          console.log(Object.keys(_this.gBookings)[0]);
        } else {
          _this.noBookings = true;
        }
      },
        () => {
          _this.api_loading = false;
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
    console.log(booking);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        src: 'room',
        account: booking.businessId
      }
    };
    this.router.navigate(['meeting', this.countryCode + "" + this.phone, booking.id], navigationExtras);
  }
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
      panelClass: ['commonpopupmainclass', 'popup-class', 'loginmainclass', 'smallform'],
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

