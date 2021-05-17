
import { interval as observableInterval, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ConsumerRateServicePopupComponent } from '../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddManagePrivacyComponent } from '../add-manage-privacy/add-manage-privacy.component';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { CouponsComponent } from '../../../shared/components/coupons/coupons.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MeetingDetailsComponent } from '../meeting-details/meeting-details.component';
import { ViewRxComponent } from './view-rx/view-rx.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GalleryImportComponent } from '../../../shared/modules/gallery/import/gallery-import.component';
import { GalleryService } from '../../../shared/modules/gallery/galery-service';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { SubSink } from '../../../../../node_modules/subsink';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  styleUrls: ['./consumer-home.component.css'],
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, height: '100%' })),
      state('false', style({ opacity: 0, height: 0 })),
      transition('0 <=> 1', animate('.5s ease-out'))
    ])
  ]
})
export class ConsumerHomeComponent implements OnInit, OnDestroy {
  active_cap = Messages.ACTIVE_CHECKINS_CAP;
  no_checkins_cap = Messages.NO_CHECKINS_CAP;
  send_msg_cap = Messages.SEND_MSG_CAP;
  make_pay_cap = Messages.MAKE_PAYMENT_CAP;
  status_cancelled_cap = Messages.STATUS_CANCELLED;
  status_started_cap = Messages.STATUS_STARTED;
  status_done_cap = Messages.STATUS_DONE;
  persons_ahead = Messages.PERSONS_AHEAD;
  token_no = Messages.TOKEN_NO;
  party_size = Messages.PARTY_SIZE;
  bill_cap = Messages.BILL_CAPTION;
  add_to_fav = Messages.ADD_TO_FAV;
  rate_visit = Messages.RATE_VISIT;
  cancel_checkin_cap = Messages.CANCEL_CHECKIN;
  my_fav_cap = Messages.MY_FAV_CAP;
  remove_fav_cap = Messages.REMOVE_FAV;
  view_cap = Messages.VIEW_CAP;
  manage_privacy_cap = Messages.MANAGE_PRIVACY;
  open_now_cap = Messages.OPEN_NOW_CAP;
  checkindisablemsg = Messages.DASHBOARD_PREPAY_MSG;
  checkindisablemsg1 = Messages.DASHBOARD_PREPAY_MSG1;
  appointmentdisablemsg = Messages.DASHBOARD_PREPAY_MSG2;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date_cap = Messages.DIFFERENT_DATE_CAP;
  you_hav_added_caption = Messages.YOU_HAVENT_ADDED_CAP;
  history_cap = Messages.HISTORY_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  first_person = Messages.FIRST_PEOPLE_AHEAD;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  server_date;
  trackMode: any = [];
  trackModeAppt: any = [];
  waitlists;
  appointments: any = [];
  fav_providers: any = [];
  history;
  fav_providers_id_list = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  monthFormat = projectConstantsLocal.DATE_FORMAT_STARTS_MONTH;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;
  loadcomplete = { waitlist: false, fav_provider: false, history: false, donations: false, appointment: false };
  tooltipcls = projectConstants.TOOLTIP_CLS;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: projectConstants.PERPAGING_LIMIT
  };

  s3url = null;
  settingsjson = null;
  settings_exists = false;
  futuredate_allowed = false;
  waitlistestimatetimetooltip = Messages.SEARCH_ESTIMATE_TOOPTIP;
  public searchfields: SearchFields = new SearchFields();
  reload_history_api = { status: true };
  subscription: Subscription;
  cronHandle: Subscription;
  countercronHandle: Subscription;
  tracksubscription: Subscription;
  cronHandleTrack: Subscription;
  cronHandleApptTrack: Subscription;
  cronStarted;
  refreshTime = projectConstants.CONSUMER_DASHBOARD_REFRESH_TIME;
  refreshTimeForTracking = 600000;
  counterrefreshTime = 60; // seconds, set to reduce the counter every minute, if required
  open_fav_div = null;
  hideShowAnimator = false;
  currentcheckinsTooltip = '';
  favTooltip = '';
  historyTooltip = '';
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  estimatesmallCaption = Messages.ESTIMATED_TIME_SMALL_CAPTION;
  checkinCaption = Messages.CHECKIN_TIME_CAPTION;
  notificationdialogRef;
  addnotedialogRef;
  checkindialogRef;
  // billdialogRef;
  // paydialogRef;
  ratedialogRef;
  privacydialogRef;
  canceldialogRef;
  remfavdialogRef;
  // payment_popup = null;
  servicesjson: any = [];
  public time = 300;
  public mode = 'horizontal';
  public perspective = 2000;
  public init = 0;
  isCheckinEnabled = true;
  coupondialogRef: MatDialogRef<{}, any>;
  nextAvailDate;
  terminologiesJson: any = [];
  mins;
  trackData: any;
  distance: any;
  KmOrMe: any;
  travelTime: any;
  timeUnit: any;
  changemode: any = [];
  changemodeAppt: any = [];
  lat_lng = {
    latitude: 0,
    longitude: 0
  };
  driving: boolean;
  walking: boolean;
  statusOfTrack: any = [];
  statusOfApptTrack: any = [];
  status: Boolean;
  pollingSet: any = [];
  pollingApptSet: any = [];
  callingModesDisplayName = projectConstants.CALLING_MODES;
  breadcrumbs;
  donations: any = [];
  rupee_symbol = 'â‚¹';
  appttime_arr: any = [];
  api_error: any;
  api_loading = false;
  futureAllowed = true;
  usr_details: any;
  future_appointments: any = [];
  future_waitlists: any = [];
  todayDate = new Date();
  tDate: any;
  path = projectConstants.PATH;
  locationholder: any;
  today_totalbookings: any = [];
  future_totalbookings: any = [];
  todayBookings: any = [];
  todayBookings_more: any = [];
  more_tdybookingsShow = false;
  more_tdyOrdersShow = false;
  futureBookings: any = [];
  futureBookings_more: any = [];
  more_futrbookingsShow = false;
  more_futrOrdersShow = false;
  appointmentslist: any = [];
  tdyDate: string;
  loading = true;
  provider_label: any;
  viewrxdialogRef;
  today_orders;
  future_orders;
  tomorrowDate: Date;
  total_tdy_order: any = [];
  todayOrderslst: any = [];
  todayOrderslst_more: any = [];
  total_future_order: any;
  futureOrderslst_more: any = [];
  futureOrderslst: any = [];
  orders;
  showOrder = false;
  screenWidth: number;
  no_of_grids: number;
  bookingStatusClasses = projectConstantsLocal.BOOKING_STATUS_CLASS;
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  galleryDialog: any;
  gallerysubscription: Subscription;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  image_list_popup: Image[];
  image_list_popup_temp: Image[];
  imageAllowed = ['JPEG', 'JPG', 'PNG'];

  extras: any;

  private subs = new SubSink();
  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
    @Inject(DOCUMENT) public document,
    private activated_route: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private galleryService: GalleryService,
    private dateTimeProcessor: DateTimeProcessor,
    public _sanitizer: DomSanitizer) {
    this.onResize();
    this.subs.sink = this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.source && (qparams.source === 'checkin_prepayment' || qparams.source === 'appt_prepayment')) {
        this.api_loading = true;
        setTimeout(() => {
          this.api_loading = false;
        }, 8000);
      }
      if (qparams && qparams.source) {
        this.showOrder = true;
      }
    });
  }
  // public carouselOne: NgxCarousel;
  public carouselOne;
  public carouselDonations;
  public carouselAppointments;


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    // else if (this.screenWidth > 700 && this.screenWidth < 900) {
    //   divider = divident / 2;
    // } 
    if (this.screenWidth > 1000) {
      divider = divident / 3;
    } else if (this.screenWidth > 600 && this.screenWidth < 1000) {
      divider = divident / 2;
    } else if (this.screenWidth < 600) {
      divider = divident / 1;
    }
    this.no_of_grids = Math.round(divident / divider);
    console.log(this.screenWidth);
    console.log(this.no_of_grids);
  }

  ngOnInit() {
    console.log(this.bookingStatusClasses);
    this.usr_details = this.groupService.getitemFromGroupStorage('ynw-user');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.locationholder = this.lStorageService.getitemfromLocalStorage('ynw-locdet');
    let stat;
    stat = this.lStorageService.getitemfromLocalStorage('orderStat');
    if (stat === true) {
      this.showOrder = true;
    }
    //  else {
    //   this.showOrder = false;
    // }
    this.breadcrumbs = [
      {
        title: 'My Jaldee'
      }
    ];
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.carouselOne = {
      dots: false,
      nav: true,
      navContainer: '.custom-nav',
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ],
      autoplay: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: false,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 3 }, 1200: { items: 3 } }
    };
    this.carouselDonations = {
      dots: false,
      nav: true,
      navContainer: '.custom-don-nav',
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ],
      autoplay: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: false,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 3 }, 1200: { items: 3 } }
    };
    this.carouselAppointments = {
      dots: false,
      nav: true,
      navContainer: '.custom-appt-nav',
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ],
      autoplay: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: false,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 3 }, 1200: { items: 3 } }
    };
    this.currentcheckinsTooltip = this.wordProcessor.getProjectMesssages('CURRENTCHECKINS_TOOLTIP');
    this.favTooltip = this.wordProcessor.getProjectMesssages('FAVORITE_TOOLTIP');
    this.historyTooltip = this.wordProcessor.getProjectMesssages('HISTORY_TOOLTIP');
    // this.gets3curl();
    this.getFavouriteProvider();
    this.getAppointmentToday();
    // this.getAppointmentFuture();
    // this.getTdyOrder();
    this.subs.sink = observableInterval(this.refreshTime * 1000).subscribe(x => {
      this.reloadAPIs();
    });

    this.subs.sink = observableInterval(this.counterrefreshTime * 1000).subscribe(x => {
      this.recheckwaitlistCounters();
    });
    this.subs.sink = observableInterval(this.refreshTime * 1000).subscribe(x => {
      this.liveTrackPolling();
    });
    this.subs.sink = observableInterval(this.refreshTime * 1000).subscribe(x => {
      this.liveTrackApptPolling();
    });

    this.subs.sink = this.shared_functions.getSwitchMessage().subscribe(message => {
      switch (message.ttype) {
        case 'fromconsumer': {
          this.closeCounters();
        }
      }
    });

    this.subs.sink = this.galleryService.getMessage().subscribe(input => {
      console.log(input);
      if (input && input.accountId && input.uuid && input.type === 'appt') {
        console.log(input);
        this.shared_services.addConsumerAppointmentAttachment(input.accountId, input.uuid, input.value)
          .subscribe(
            () => {
              this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
              this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
            },
            error => {
              this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
              this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
            }
          );
      } else {
        console.log(input);
        if (input && input.accountId && input.uuid && input.type === 'checkin') {
          this.shared_services.addConsumerWaitlistAttachment(input.accountId, input.uuid, input.value)
            .subscribe(
              () => {
                this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
              },
              error => {
                this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
              }
            );
        }
      }
    });
  }
  paymentsClicked() {
    this.router.navigate(['consumer', 'payments']);
  }
  orderpaymentsClicked() {
    this.router.navigate(['consumer', 'order', 'order-payments']);
  }
  showcheckindetails(waitlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: waitlist.ynwUuid,
        providerId: waitlist.providerAccount.id
      }
    };
    this.router.navigate(['consumer', 'checkindetails'], navigationExtras);
  }
  showApptdetails(apptlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: apptlist.uid,
        providerId: apptlist.providerAccount.id
      }
    };
    this.router.navigate(['consumer', 'apptdetails'], navigationExtras);
  }
  showBookingDetails(booking, type?) {
    if (booking.apptStatus) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          uuid: booking.uid,
          providerId: booking.providerAccount.id,
          type: type
        }
      };
      this.router.navigate(['consumer', 'apptdetails'], navigationExtras);
    } else if (booking.waitlistStatus) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          uuid: booking.ynwUuid,
          providerId: booking.providerAccount.id,
          type: type
        }
      };
      this.router.navigate(['consumer', 'checkindetails'], navigationExtras);
    } else {
      console.log('this is order');
      console.log(booking);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          uuid: booking.uid,
          providerId: booking.providerAccount.id
        }
      };
      this.router.navigate(['consumer', 'orderdetails'], navigationExtras);
    }
  }

  closeCounters() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.countercronHandle) {
      this.countercronHandle.unsubscribe();
    }

  }
  ngOnDestroy() {

    if (this.notificationdialogRef) {
      this.notificationdialogRef.close();
    }
    if (this.addnotedialogRef) {
      this.addnotedialogRef.close();
    }
    if (this.checkindialogRef) {
      this.checkindialogRef.close();
    }
    // if (this.billdialogRef) {
    //   this.billdialogRef.close();
    // }
    // if (this.paydialogRef) {
    //   this.paydialogRef.close();
    // }
    if (this.ratedialogRef) {
      this.ratedialogRef.close();
    }
    if (this.privacydialogRef) {
      this.privacydialogRef.close();
    }
    if (this.canceldialogRef) {
      this.canceldialogRef.close();
    }
    if (this.remfavdialogRef) {
      this.remfavdialogRef.close();
    }

    this.subs.unsubscribe();
  }
  setSystemDate() {
    const _this = this;
    return new Promise<void>(function (resolve, reject) {
      _this.subs.sink = _this.shared_services.getSystemDate()
        .subscribe(
          res => {
            _this.server_date = res;
            _this.lStorageService.setitemonLocalStorage('sysdate', res);
            resolve();
          },
          () => {
            reject();
          }
        );
    });
  }
  getWaitlist() {
    this.pollingSet = [];
    this.loadcomplete.waitlist = false;
    this.tDate = this.dateTimeProcessor.transformToYMDFormat(this.todayDate);
    const params = {
      'waitlistStatus-neq': 'failed,prepaymentPending', 'date-eq': this.tDate, 'account-eq': projectConstantsLocal.PROVIDER_ACCOUNT_ID
    };
    this.subs.sink = this.consumer_services.getWaitlist(params)
      .subscribe(
        data => {
          this.waitlists = data;
          this.today_totalbookings = this.appointments.concat(this.waitlists);
          this.loading = false;
          this.getAppointmentFuture();
          // more case
          this.todayBookings = [];
          console.log(this.todayBookings);
          this.todayBookings_more = [];
          // tslint:disable-next-line:no-shadowed-variable
          for (let i = 0; i < this.today_totalbookings.length; i++) {
            if (i <= 2) {
              this.todayBookings.push(this.today_totalbookings[i]);
              console.log(this.todayBookings);
            } else {
              this.todayBookings_more.push(this.today_totalbookings[i]);
            }
          }

          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          let i = 0;
          let retval;
          for (const waitlist of this.waitlists) {
            if (waitlist.service.livetrack) {
              this.getCurrentLocation().then(
                (lat_long: any) => {
                  waitlist['differofDistanc'] = Math.round(this.getDistanceFromLatLonInKm(lat_long.latitude, lat_long.longitude, waitlist.queue.location.lattitude, waitlist.queue.location.longitude));
                }, (error) => {
                  this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
                  this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
                }
              );
            }
            this.trackMode[i] = false;
            this.changemode[i] = false;
            const waitlist_date = new Date(waitlist.date);
            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);
            this.waitlists[i].future = false;
            retval = this.getAppxTime(waitlist);
            if (today.valueOf() < waitlist_date.valueOf()) {
              this.waitlists[i].future = true;
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_timenow = retval.timenow;
              this.waitlists[i].estimated_timeslot = retval.timeslot;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
            } else {
              if (waitlist.jaldeeWaitlistDistanceTime && waitlist.waitlistStatus === 'checkedIn') {
                this.statusOfLiveTrack(waitlist, i);
                this.pollingSet.push(waitlist);
              }
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_timenow = retval.timenow;
              this.waitlists[i].estimated_timeslot = retval.timeslot;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
              this.waitlists[i].estimated_timeinmins = retval.time_inmins;
            }
            this.waitlists[i].cancelled_caption = retval.cancelled_caption;
            this.waitlists[i].cancelled_date = retval.cancelled_date;
            this.waitlists[i].cancelled_time = retval.cancelled_time;
            // if (waitlist.waitlistStatus === 'prepaymentPending') {
            //   this.waitlists[i].counter = this.prepaymentCounter(waitlist);
            // }
            i++;
          }
          this.loadcomplete.waitlist = true;
        },
        error => {
          this.loadcomplete.waitlist = true;
        }
      );
  }

  getAppxTime(waitlist) {
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'timenow': '', 'timeslot': '', 'autoreq': false, 'time_inmins': waitlist.appxWaitingTime, 'cancelled_time': '', 'cancelled_date': '', 'cancelled_caption': '' };
    if (waitlist.waitlistStatus !== 'cancelled') {
      if (waitlist.hasOwnProperty('serviceTime') || waitlist.calculationMode === 'NoCalc') {
        appx_ret.caption = 'Checked in for'; // 'Check-In Time';
        if (waitlist.calculationMode === 'NoCalc') {
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.time = waitlist.serviceTime;
        }
        const waitlist_date = new Date(waitlist.date);
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
          appx_ret.date = waitlist.date;
          appx_ret.date_type = 'date';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.date = 'Today';
          appx_ret.date_type = 'string';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        }
      } else {
        if (waitlist.appxWaitingTime === 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
          appx_ret.timenow = 'Now';
        } else if (waitlist.appxWaitingTime !== 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.date = '';
          appx_ret.time = this.dateTimeProcessor.convertMinutesToHourMinute(waitlist.appxWaitingTime);
          appx_ret.autoreq = true;
        }
      }
    } else {
      let time = [];
      let time1 = [];
      let t2;
      appx_ret.caption = 'Checked in for';
      appx_ret.date = waitlist.date;
      appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
      appx_ret.cancelled_date = moment(waitlist.statusUpdatedTime, 'YYYY-MM-DD').format();
      time = waitlist.statusUpdatedTime.split('-');
      time1 = time[2].trim();
      t2 = time1.slice(2);
      appx_ret.cancelled_time = t2;
      appx_ret.cancelled_caption = 'Cancelled on ';
    }
    return appx_ret;
  }

  getApptlist() {
    this.pollingApptSet = [];
    this.loadcomplete.appointment = false;
    const params = { 'apptStatus-neq': 'failed,prepaymentPending' };
    this.subs.sink = this.consumer_services.getApptlist(params)
      .subscribe(
        data => {
          this.appointments = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          let i = 0;
          let retval;
          for (const appointment of this.appointments) {
            if (appointment.service.livetrack) {
              this.getCurrentLocation().then(
                (lat_long: any) => {
                  appointment['differceofDistance'] = Math.round(this.getDistanceFromLatLonInKm(lat_long.latitude, lat_long.longitude, appointment.location.lattitude, appointment.location.longitude));
                }, (error) => {
                  this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
                  this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
                }
              );
            }
            this.trackModeAppt[i] = false;
            this.changemodeAppt[i] = false;
            const waitlist_date = new Date(appointment.appmtDate);
            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);
            this.appointments[i].future = false;
            retval = this.getApptAppxTime(appointment);
            if (today.valueOf() < waitlist_date.valueOf()) {
              this.appointments[i].future = true;
              this.appointments[i].estimated_time = retval.time;
              this.appointments[i].estimated_timeslot = retval.timeslot;
              this.appointments[i].estimated_caption = retval.caption;
              this.appointments[i].estimated_date = retval.date;
              this.appointments[i].estimated_date_type = retval.date_type;
              this.appointments[i].estimated_autocounter = retval.autoreq;
            } else {
              if (appointment.jaldeeApptDistanceTime && appointment.apptStatus === 'Confirmed') {
                this.statusOfApptLiveTrack(appointment, i);
                this.pollingApptSet.push(appointment);
              }
              this.appointments[i].estimated_time = retval.time;
              this.appointments[i].estimated_timeslot = retval.timeslot;
              this.appointments[i].estimated_caption = retval.caption;
              this.appointments[i].estimated_date = retval.date;
              this.appointments[i].estimated_date_type = retval.date_type;
              this.appointments[i].estimated_autocounter = retval.autoreq;
            }
            this.appointments[i].cancelled_caption = retval.cancelled_caption;
            this.appointments[i].cancelled_date = retval.cancelled_date;
            this.appointments[i].cancelled_time = retval.cancelled_time;
            // if (appointment.apptStatus === 'prepaymentPending') {
            //   this.appointments[i].counter = this.prepaymentCounterAppt(appointment);
            // }
            i++;
          }
          this.loadcomplete.appointment = true;
        },
        error => {
          this.loadcomplete.appointment = true;
        }
      );
  }

  getApptAppxTime(appointment) {
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'timeslot': '', 'autoreq': false, 'cancelled_time': '', 'cancelled_date': '', 'cancelled_caption': '' };
    if (appointment.apptStatus !== 'Cancelled' && appointment.apptStatus !== 'Rejected') {
      appx_ret.caption = 'Appointment for'; // 'Check-In Time';
      appx_ret.time = appointment.appmtTime;
      const waitlist_date = new Date(appointment.appmtDate);
      const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
      const today = new Date(todaydt);
      today.setHours(0, 0, 0, 0);
      waitlist_date.setHours(0, 0, 0, 0);
      if (today.valueOf() < waitlist_date.valueOf()) {
        appx_ret.date = appointment.appmtDate;
        appx_ret.date_type = 'date';
        appx_ret.timeslot = appointment.schedule.apptSchedule.timeSlots[0].sTime + ' - ' + appointment.schedule.apptSchedule.timeSlots[0].eTime;
      } else {
        appx_ret.date = 'Today';
        appx_ret.date_type = 'string';
        appx_ret.timeslot = appointment.schedule.apptSchedule.timeSlots[0].sTime + ' - ' + appointment.schedule.apptSchedule.timeSlots[0].eTime;
      }
    } else {
      let time = [];
      let time1 = [];
      let t2;
      appx_ret.caption = 'Appointment for';
      appx_ret.date = appointment.appmtDate;
      appx_ret.time = appointment.appmtTime;
      if (appointment.statusUpdatedTime) {
        appx_ret.cancelled_date = moment(appointment.statusUpdatedTime, 'YYYY-MM-DD').format();
        time = appointment.statusUpdatedTime.split('-');
        time1 = time[2].trim();
        t2 = time1.slice(2);
        appx_ret.cancelled_time = t2;
      }
      if (appointment.apptStatus === 'Rejected') {
        appx_ret.cancelled_caption = 'Rejected on ';
      } else {
        appx_ret.cancelled_caption = 'Cancelled on ';
      }
    }
    return appx_ret;
  }

  formatTime(time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  AMHourto24(date, time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    const sHours = hours;
    const sMinutes = minutes;
    const mom_date = moment(date);
    mom_date.set('hour', sHours);
    mom_date.set('minute', sMinutes);
    return mom_date;
  }
  getFavouriteProvider() {
    // console.log('In Get Favourites');
    const _this = this;
    // return new Promise(function (resolve, reject) {
      _this.loadcomplete.fav_provider = false;
      _this.subs.sink = _this.shared_services.getFavProvider()
        .subscribe(
          data => {
            _this.loadcomplete.fav_provider = true;
            _this.fav_providers = data;
            _this.fav_providers_id_list = [];
            _this.setWaitlistTimeDetails();
            this.extras = {
              'favourites': _this.fav_providers_id_list
            }
            // resolve(_this.fav_providers_id_list);
          },
          error => {
            _this.loadcomplete.fav_provider = true;
            this.extras = {
              'favourites': []
            }
            // resolve([]);
          }
        );
    // });
  }

  setWaitlistTimeDetails() {
    // let k = 0;
    for (const x of this.fav_providers) {
      this.fav_providers_id_list.push(x.id);
      // this.toogleDetail(x, k);
      // k++;
    }
  }

  setWaitlistTimeDetailsProvider(provider, k) {
    if (this.s3url) {
      // this.getbusinessprofiledetails_json(provider.uniqueId, 'settings', true, k);
      // this.getbusinessprofiledetails_json(provider.uniqueId, 'terminologies', true, k);
    }
    const locarr = [];
    let i = 0;
    for (const loc of provider.locations) {
      locarr.push({ 'locid': provider.id + '-' + loc.id, 'locindx': i });
      i++;
    }
    this.getWaitingTime(locarr, k);
    this.getApptTime(locarr, k);
  }

  getApptTime(provids_locid, index) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.subs.sink = this.consumer_services.getApptTime(post_provids_locid)
        .subscribe(data => {
          this.appttime_arr = data;
          let locindx;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          for (let i = 0; i < this.appttime_arr.length; i++) {
            if (provids_locid[i]) {
              locindx = provids_locid[i].locindx;
              this.fav_providers[index]['locations'][locindx]['apptAllowed'] = this.appttime_arr[i]['apptEnabled'];
              if (this.appttime_arr[i]['availableSchedule']) {
                this.fav_providers[index]['locations'][locindx]['futureAppt'] = this.appttime_arr[i]['availableSchedule']['futureAppt'];
                this.fav_providers[index]['locations'][locindx]['todayAppt'] = this.appttime_arr[i]['availableSchedule']['todayAppt'];
                this.fav_providers[index]['locations'][locindx]['apptopennow'] = this.appttime_arr[i]['availableSchedule']['openNow'];
                if (dtoday === this.appttime_arr[i]['availableSchedule']['availableDate']) {
                  this.fav_providers[index]['locations'][locindx]['apptAvailableToday'] = true;
                } else {
                  this.fav_providers[index]['locations'][locindx]['apptAvailableToday'] = false;
                }
              }
            }
          }
        });
    }
  }
  getWaitingTime(provids_locid, index) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.subs.sink = this.consumer_services.getEstimatedWaitingTime(post_provids_locid)
        .subscribe(data => {
          let waitlisttime_arr: any = data;
          // const locationjson: any = [];
          if (waitlisttime_arr === '"Account doesn\'t exist"') {
            waitlisttime_arr = [];
          }
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          // const ctoday = cday + '/' + cmon + '/' + yyyy;
          let locindx;
          // const check_dtoday = new Date(dtoday);
          // let cdate;
          for (let i = 0; i < waitlisttime_arr.length; i++) {
            locindx = provids_locid[i].locindx;
            this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];
            this.fav_providers[index]['locations'][locindx]['waitlist'] = waitlisttime_arr[i]['waitlistEnabled'];
            if (waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.fav_providers[index]['locations'][locindx]['isCheckinAllowed'] = waitlisttime_arr[i]['isCheckinAllowed'];
              this.fav_providers[index]['locations'][locindx]['personAhead'] = waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              this.fav_providers[index]['locations'][locindx]['calculationMode'] = waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              // this.fav_providers[index]['locations'][locindx]['waitlist'] = waitlisttime_arr[i]['nextAvailableQueue']['waitlistEnabled'];
              this.fav_providers[index]['locations'][locindx]['showToken'] = waitlisttime_arr[i]['nextAvailableQueue']['showToken'];
              this.fav_providers[index]['locations'][locindx]['onlineCheckIn'] = waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              this.fav_providers[index]['locations'][locindx]['isAvailableToday'] = waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              this.fav_providers[index]['locations'][locindx]['opennow'] = waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['cdate'] = waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 1;
              // cdate = new Date(waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                this.fav_providers[index]['locations'][locindx]['availableToday'] = true;
              } else {
                this.fav_providers[index]['locations'][locindx]['availableToday'] = false;
              }
              if (!this.fav_providers[index]['locations'][locindx]['opennow']) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = this.dateTimeProcessor.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date']
                    + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.dateTimeProcessor.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.dateTimeProcessor.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['nextAvailDate'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] + ',' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = this.dateTimeProcessor.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date']
                    + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  // this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.dateTimeProcessor.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
              }
            } else {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 0;
            }
            if (waitlisttime_arr[i]['message']) {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['message'] = waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }

  doCancelWaitlist(waitlist, type) {
    // if (!waitlist.ynwUuid || !waitlist.providerAccount.id || !waitlist.uid) {
    //   return false;
    // }
    this.shared_functions.doCancelWaitlist(waitlist, type, this)
      .then(
        data => {
          if (data === 'reloadlist' && type === 'checkin') {
            this.today_totalbookings = [];
            this.future_totalbookings = [];
            this.todayBookings = [];
            this.todayBookings_more = [];
            this.futureBookings = [];
            this.futureBookings_more = [];
            this.appointmentslist = [];
            //  this.getDonations();
            this.getAppointmentToday();
            this.getAppointmentFuture();
            //  this.getWaitlist();
            //    this.getWaitlistFuture();
            // this.getWaitlist();
          } else if (data === 'reloadlist' && type === 'appointment') {
            //  this.getApptlist();
            this.today_totalbookings = [];
            this.future_totalbookings = [];
            this.todayBookings = [];
            this.todayBookings_more = [];
            this.futureBookings = [];
            this.futureBookings_more = [];
            this.appointmentslist = [];
            // this.getDonations();
            this.getAppointmentToday();
            this.getAppointmentFuture();
            //  this.getWaitlist();
            // this.getWaitlistFuture();
          }

        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  doDeleteFavProvider(fav) {
    if (!fav.id) {
      return false;
    }
    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getFavouriteProvider();
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }
    this.subs.sink = this.shared_services.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }

  goWaitlistDetail(waitlist) {
    this.router.navigate(['consumer/waitlist', waitlist.providerAccount.id, waitlist.ynwUuid]);
  }
  gotoAptmtReschedule(apptlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: apptlist.uid,
        type: 'reschedule',
        account_id: apptlist.providerAccount.id,
        unique_id: apptlist.providerAccount.uniqueId
      }
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
  }
  gotoWaitlistReschedule(waitlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: waitlist.ynwUuid,
        type: 'waitlistreschedule',
        account_id: waitlist.providerAccount.id,
        unique_id: waitlist.providerAccount.uniqueId
      }
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
  }

  openNotification(data) {
    if (!data) {
      return false;
    }
    this.notificationdialogRef = this.dialog.open(NotificationListBoxComponent, {
      width: '50%',
      disableClose: true,
      data: {
        'messages': data
      }
    });
    this.notificationdialogRef.afterClosed().subscribe(result => {
    });
  }

  checkIfFav(id) {
    let fav = false;
    this.fav_providers_id_list.map((e) => {
      if (e === id) {
        fav = true;
      }
    });
    return fav;
  }

  addWaitlistMessage(waitlist, type?) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['typeOfMsg'] = 'single';
    if (type === 'appt') {
      pass_ob['appt'] = type;
      pass_ob['uuid'] = waitlist.uid;
    } else if (type === 'orders') {
      pass_ob['orders'] = type;
      pass_ob['uuid'] = waitlist.uid;
    } else {
      pass_ob['uuid'] = waitlist.ynwUuid;
    }
    this.addNote(pass_ob);
  }

  addCommonMessage(provider) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-common';
    pass_ob['user_id'] = provider.id;
    pass_ob['name'] = provider.businessName;
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      minHeight: '100vh',
      minWidth: '100vw',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass', 'service-detail-bor-rad-0'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    // this.getHistroy();
  }

  setPaginationFilter() {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;
    return api_filter;
  }

  providerDetail(provider, event) {
    console.log('In ProviderDetail');
    // console.log('order');
    // event.stopPropagation();
    this.router.navigate([provider.uniqueId]);
  }

  goCheckin(data, location, type) {
    let provider_data = null;
    if (type === 'fav_provider') {
      provider_data = data;
    } else {
      provider_data = data.provider || null;
    }
    let chdatereq;
    if (location['onlineCheckIn'] && location['isAvailableToday'] && location['availableToday']) {
      chdatereq = false;
    } else {
      chdatereq = false;
    }
    this.setCheckinData(provider_data, location, location['estimatedtime_det']['cdate'], chdatereq);
  }
  // showCheckin(locid, locname, curdate, origin?) {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       loc_id: locid,
  //       sel_date: curdate,
  //       cur: this.changedate_req,
  //       unique_id: this.provider_id,
  //       account_id: this.provider_bussiness_id
  //      }
  //   };
  //   this.routerobj.navigate(['consumer', 'checkin'], navigationExtras);
  // }
  setCheckinData(provider, location, currdate, chdatereq = false) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: location.id,
        sel_date: currdate,
        cur: chdatereq,
        unique_id: provider.uniqueId,
        account_id: provider.id,
        tel_serv_stat: provider.virtulServiceStatus
      }
    };
    this.router.navigate(['consumer', 'checkin'], navigationExtras);
    // const post_data = {
    //   'provider_data': null,
    //   'location_data': null,
    //   'sel_date': currdate,
    //   'chdatereq': chdatereq
    // };
    // post_data.provider_data = {
    //   'unique_id': provider.uniqueId,
    //   'account_id': provider.id,
    //   'name': provider.businessName
    // };
    // post_data.location_data = {
    //   'id': location.id,
    //   'name': location.place
    // };
    // this.showCheckin(post_data);
  }
  gets3curl() {
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          this.s3url = res;
          // this.getFavouriteProvider();
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  // getbusinessprofiledetails_json(provider_id, section, modDateReq: boolean, index) {
  //   let UTCstring = null;
  //   if (section === 'settings' && this.fav_providers[index] && this.fav_providers[index]['settings']) {
  //     return false;
  //   }
  //   if (modDateReq) {
  //     UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
  //   }
  //   this.subs.sink=this.shared_services.getbusinessprofiledetails_json(provider_id, this.s3url, section, UTCstring)
  //     .subscribe(res => {
  //       switch (section) {
  //         case 'settings': {
  //           this.fav_providers[index]['settings'] = res;
  //           break;
  //         }
  //         case 'terminologies': {
  //           this.terminologiesJson = res;
  //           break;
  //         }
  //       }
  //     },
  //       error => {
  //       }
  //     );
  // }
  gotoDonations() {
    this.router.navigate(['consumer', 'donations']);
  }
  getDonations() {
    const filter = {};
    if (this.server_date) {
      filter['date-eq'] = moment(this.server_date).format('YYYY-MM-DD');
    }
    this.subs.sink = this.shared_services.getConsumerDonations(filter).subscribe(
      (donations) => {
        this.donations = donations;
        this.loadcomplete.donations = true;
        // this.getAppointmentToday();
      }
    );
  }
  showcheckInButton(provider) {
    if (provider.settings && provider.settings.onlineCheckIns) {
      return true;
    }
  }
  reloadAPIs() {
    this.getAppointmentToday();
    this.getAppointmentFuture();
    this.reload_history_api = { status: true };
  }

  prepaymentCounter(list) {
    // this.setSystemDate();
    let server_time;
    let checkinTime;
    let currentTime;
    this.subs.sink = this.shared_services.getSystemDate()
      .subscribe(
        res => {
          server_time = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
    checkinTime = moment(list.checkInTime, ['h:mm A']).format('HH:mm:ss');
    currentTime = moment(server_time).format('HH:mm:ss');
    this.mins = moment.utc(moment(currentTime, 'HH:mm').diff(moment(checkinTime, 'HH:mm'))).format('mm');
    this.mins = 15 - this.mins;
    return this.mins;
  }
  prepaymentCounterAppt(list) {
    // this.setSystemDate();
    let server_time;
    let checkinTime;
    let currentTime;
    this.subs.sink = this.shared_services.getSystemDate()
      .subscribe(
        res => {
          server_time = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
    checkinTime = moment(list.apptTakenTime, ['h:mm A']).format('HH:mm:ss');
    currentTime = moment(server_time).format('HH:mm:ss');
    this.mins = moment.utc(moment(currentTime, 'HH:mm').diff(moment(checkinTime, 'HH:mm'))).format('mm');
    this.mins = 15 - this.mins;
    return this.mins;
  }
  recheckwaitlistCounters() {
    for (let i = 0; i < this.waitlists.length; i++) {
      if (this.waitlists[i].estimated_autocounter) {
        if (this.waitlists[i].estimated_timeinmins > 0) {
          this.waitlists[i].estimated_timeinmins = (this.waitlists[i].estimated_timeinmins - 1);
          if (this.waitlists[i].estimated_timeinmins === 0) {
            this.waitlists[i].estimated_time = 'Now';
          } else {
            this.waitlists[i].estimated_time = this.dateTimeProcessor.convertMinutesToHourMinute(this.waitlists[i].estimated_timeinmins);
          }
        }
      }
    }
  }
  btnJoinVideoClicked(checkin, event) {
    event.stopPropagation();
    if (checkin.videoCallButton && checkin.videoCallButton !== 'DISABLED') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          account: checkin.providerAccount.id,
        }
      };
      if (checkin.uid) {
        this.router.navigate(['meeting', this.usr_details.primaryPhoneNumber, checkin.uid], navigationExtras);
      } else {
        this.router.navigate(['meeting', this.usr_details.primaryPhoneNumber, checkin.ynwUuid], navigationExtras);
      }
    } else {
      return false;
    }

  }
  viewBill(checkin, type, event) {
    event.stopPropagation();
    if (type === 'appointment') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          uuid: checkin.uid,
          accountId: checkin.providerAccount.id,
          type: 'appointment',
          'paidStatus': false
        }
      };
      this.router.navigate(['consumer', 'appointment', 'bill'], navigationExtras);
    } else if (type === 'checkin') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          uuid: checkin.ynwUuid,
          accountId: checkin.providerAccount.id,
          type: 'waitlist',
          'paidStatus': false
        }
      };
      this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras);
    }
  }
  getMapUrl(latitude, longitude) {
    const mapurl = projectConstants.MAP_BASE_URL + latitude + ',' + longitude + '/@' + latitude + ',' + longitude + ',15z';
    return mapurl;
  }
  rateService(waitlist, type) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': type
      }
    });
    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist' && type === 'checkin') {
        this.getWaitlist();
      } else if (result === 'reloadlist' && type === 'appointment') {
        this.getApptlist();
      }
    });
  }
  isRated(wait) {
    if (wait.hasOwnProperty('rating')) {
      return true;
    } else {
      return false;
    }
  }
  toogleDetail(provider, i) {
    let open_fav_div = null;
    if (this.open_fav_div === i) {
      this.hideShowAnimator = false;
      open_fav_div = null;
    } else {
      this.hideShowAnimator = true;
      open_fav_div = i;
      this.setWaitlistTimeDetailsProvider(provider, i);
    }
    setTimeout(() => {
      this.open_fav_div = open_fav_div;
    }, 500);
  }
  providerManagePrivacy(provider, i) {
    this.privacydialogRef = this.dialog.open(AddManagePrivacyComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: { 'provider': provider }
    });
    this.privacydialogRef.afterClosed().subscribe(result => {
      if (result.message === 'reloadlist') {
        this.fav_providers[i]['revealPhoneNumber'] = result.data.revealPhoneNumber;
      }
    });
  }
  openCoupons() {
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {}
    });
    this.coupondialogRef.afterClosed().subscribe(result => {
    });
  }
  makeFailedPayment(waitlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: { account_id: waitlist.providerAccount.id }
    };
    this.router.navigate(['consumer', 'checkin', 'payment', waitlist.ynwUuid], navigationExtras);
  }

  makeApptFailedPayment(waitlist) {
    const navigationExtras: NavigationExtras = {
      queryParams: { account_id: waitlist.providerAccount.id }
    };
    this.router.navigate(['consumer', 'appointment', 'payment', waitlist.uid], navigationExtras);
  }
  getTerminologyTerm(term) {
    if (this.terminologiesJson) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (this.terminologiesJson) {
        return this.wordProcessor.firstToUpper((this.terminologiesJson[term_only]) ? this.terminologiesJson[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.wordProcessor.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return term;
    }
  }
  editmodeOn(i) {
    this.changemode[i] = true;
  }
  getTravelMod(uid, id, type, i) {
    const passdata = {
      'travelMode': type
    };
    this.subs.sink = this.shared_services.updateTravelMode(uid, id, passdata)
      .subscribe(data => {
        this.changemode[i] = false;
        this.getWaitlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  getAppointmentTravelMod(uid, id, type, i) {
    const passdata = {
      'travelMode': type
    };
    this.shared_services.updateAppointmentTravelMode(uid, id, passdata)
      .subscribe(data => {
        this.changemodeAppt[i] = false;
        this.getApptlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  getMintuesToHour(time) {
    return this.dateTimeProcessor.providerConvertMinutesToHourMinute(time);
  }
  statusOfLiveTrack(waitlist, i) {
    this.subs.sink = this.shared_services.statusOfLiveTrack(waitlist.ynwUuid, waitlist.providerAccount.id)
      .subscribe(data => {
        this.statusOfTrack[i] = data;
        waitlist.trackStatus = data;
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  statusOfApptLiveTrack(appointment, i) {
    this.subs.sink = this.shared_services.statusOfApptLiveTrack(appointment.uid, appointment.providerAccount.id)
      .subscribe(data => {
        this.statusOfApptTrack[i] = data;
        appointment.appttrackStatus = data;
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  // getCurrentLocation() {
  //   if (navigator) {
  //     navigator.geolocation.getCurrentPosition(pos => {
  //       this.lat_lng.longitude = +pos.coords.longitude;
  //       this.lat_lng.latitude = +pos.coords.latitude;
  //     },
  //       error => {
  //         this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
  //         this.snackbarService.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
  //       });
  //   }
  // }
  getCurrentLocation() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (navigator) {
        _this.lat_lng = {
          latitude: 0,
          longitude: 0
        };
        navigator.geolocation.getCurrentPosition(pos => {
          _this.lat_lng.longitude = +pos.coords.longitude;
          _this.lat_lng.latitude = +pos.coords.latitude;
          resolve(_this.lat_lng);
        },
          error => {
            reject();
          });
      }
    });
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
  deg2rad(deg) {
    return deg * Math.PI / 180;
  }
  updateLatLong(uid, id, passdata) {
    this.subs.sink = this.shared_services.updateLatLong(uid, id, passdata)
      .subscribe(data => {
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });

  }
  changeTrackstatus(uid, id, i, event) {
    if (event.checked === true) {
      this.startTracking(uid, id, i);
    } else {
      this.stopTracking(uid, id, i);
    }
  }
  startTracking(uid, id, i) {
    this.subs.sink = this.shared_services.startLiveTrack(uid, id)
      .subscribe(data => {
        this.getWaitlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  stopTracking(uid, id, i) {
    this.subs.sink = this.shared_services.stopLiveTrack(uid, id)
      .subscribe(data => {
        this.getWaitlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  changeAppointmentTrackstatus(uid, id, i, event) {
    if (event.checked === true) {
      this.startApptTracking(uid, id, i);
    } else {
      this.stopApptTracking(uid, id, i);
    }
  }
  startApptTracking(uid, id, i) {
    this.subs.sink = this.shared_services.startApptLiveTrack(uid, id)
      .subscribe(data => {
        this.getApptlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  stopApptTracking(uid, id, i) {
    this.subs.sink = this.shared_services.stopApptLiveTrack(uid, id)
      .subscribe(data => {
        this.getApptlist();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  getTrackMessage(waitlist) {
    let message = '';
    if (waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.distance === 0) {
      message += 'You are about to reach ' + waitlist.providerAccount.businessName;
    } else {
      message += 'You are ' + waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.distance + ' ' + projectConstants.LIVETRACK_CONST[waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.unit] + ' away and will take around';
      message += ' ' + this.getMintuesToHour(waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeelTravelTime.travelTime);
      message += ' to reach ' + waitlist.providerAccount.businessName;
    }
    return message;
  }
  liveTrackPolling() {
    const _this = this;
    if (_this.pollingSet && _this.pollingSet.length > 0) {
      _this.setSystemDate().then(
        () => {
          for (const waitlist of _this.pollingSet) {
            if (waitlist.jaldeeWaitlistDistanceTime) {
              let pollingDtTim = '';
              let pollingDateTime = '';
              if (waitlist.jaldeeStartTimeType !== 'AFTERSTART') {
                pollingDtTim = waitlist.date + ' ' + waitlist.jaldeeWaitlistDistanceTime.pollingTime;
                pollingDateTime = moment(pollingDtTim).format('YYYY-MM-DD HH:mm');
                const serverDateTime = moment(_this.server_date).format('YYYY-MM-DD HH:mm');
                if (serverDateTime >= pollingDateTime) {
                  _this.getCurrentLocation();
                  _this.subs.sink = _this.shared_services.updateLatLong(waitlist.ynwUuid, waitlist.providerAccount.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              } else {
                if (waitlist.trackStatus) {
                  _this.subs.sink = _this.shared_services.updateLatLong(waitlist.ynwUuid, waitlist.providerAccount.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              }
            }
          }
        },
        () => {

        });
    }
  }

  liveTrackApptPolling() {
    const _this = this;
    if (_this.pollingApptSet && _this.pollingApptSet.length > 0) {
      _this.setSystemDate().then(
        () => {
          for (const apptlist of _this.pollingApptSet) {
            if (apptlist.jaldeeApptDistanceTime) {
              let pollingDtTim = '';
              let pollingDateTime = '';
              if (apptlist.jaldeeStartTimeType !== 'AFTERSTART') {
                pollingDtTim = apptlist.date + ' ' + apptlist.jaldeeApptDistanceTime.pollingTime;
                pollingDateTime = moment(pollingDtTim).format('YYYY-MM-DD HH:mm');
                const serverDateTime = moment(_this.server_date).format('YYYY-MM-DD HH:mm');
                if (serverDateTime >= pollingDateTime) {
                  _this.getCurrentLocation();
                  _this.subs.sink = _this.shared_services.updateLatLong(apptlist.uid, apptlist.providerAccount.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              } else {
                if (apptlist.appttrackStatus) {
                  _this.subs.sink = _this.shared_services.updateLatLong(apptlist.uid, apptlist.providerAccount.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              }
            }
          }
        },
        () => {

        });
    }
  }
  goAppointment(data, location, type) {
    this.futureAllowed = true;
    let provider_data = null;
    if (type === 'fav_provider') {
      provider_data = data;
    } else {
      provider_data = data.provider || null;
    }
    let chdatereq;
    if (location.todayAppt && location['apptAvailableToday']) {
      chdatereq = false;
    } else {
      chdatereq = true;
    }
    if (!location.futureAppt) {
      this.futureAllowed = false;
    }
    this.setAppointmentData(provider_data, location, location['estimatedtime_det']['cdate'], chdatereq);
  }
  setAppointmentData(provider, location, currdate, chdatereq = false) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: location.id,
        sel_date: currdate,
        cur: chdatereq,
        unique_id: provider.uniqueId,
        account_id: provider.id,
        tel_serv_stat: provider.virtulServiceStatus,
        futureAppt: this.futureAllowed
      }
    };
    this.router.navigate(['consumer', 'appointment'], navigationExtras);
  }
  gotoHistory() {
    console.log(this.showOrder);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        is_orderShow: this.showOrder
      }
    };
    this.router.navigate(['consumer', 'checkin', 'history'], navigationExtras);
  }
  gotoApptmentHistory() {
    this.router.navigate(['consumer', 'appointment', 'history']);
  }
  gotoOrderHistory() {
    this.router.navigate(['consumer', 'order', 'order-history']);
  }

  getAppointmentToday() {
    const params = { 'apptStatus-neq': 'failed,prepaymentPending', 'account-eq': projectConstantsLocal.PROVIDER_ACCOUNT_ID };
    this.subs.sink = this.consumer_services.getAppointmentToday(params)
      .subscribe(
        data => {
          this.appointmentslist = data;
          this.appointments = [];
          this.appointments = this.appointmentslist;
          this.getWaitlist();
        },
        error => {
        }
      );
  }
  getAppointmentFuture() {
    const params = { 'apptStatus-neq': 'failed,prepaymentPending', 'account-eq': projectConstantsLocal.PROVIDER_ACCOUNT_ID };
    this.subs.sink = this.consumer_services.getAppointmentFuture(params)
      .subscribe(
        data => {
          this.future_appointments = data;
          this.getWaitlistFuture();
        },
        error => {
        }
      );
  }
  getWaitlistFuture() {
    const params = { 'waitlistStatus-neq': 'failed,prepaymentPending', 'account-eq': projectConstantsLocal.PROVIDER_ACCOUNT_ID };
    this.subs.sink = this.consumer_services.getWaitlistFuture(params)
      .subscribe(
        data => {
          this.future_waitlists = data;
          this.future_totalbookings = this.future_waitlists.concat(this.future_appointments);
          this.loading = false;
          this.futureBookings = [];
          this.futureBookings_more = [];
          for (let i = 0; i < this.future_totalbookings.length; i++) {
            if (i <= 2) {
              this.futureBookings.push(this.future_totalbookings[i]);
            } else {
              this.futureBookings_more.push(this.future_totalbookings[i]);
            }
          }
        },
        error => {
        }
      );
  }

  gotoLivetrack(uid, accountid, stat) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account_id: accountid,
        status: stat
      }
    };
    this.router.navigate(['consumer', 'appointment', 'track', uid], navigationExtras);

  }
  gotoLivetrackchekin(uid, accountid, stat) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account_id: accountid,
        status: stat
      }
    };
    this.router.navigate(['consumer', 'checkin', 'track', uid], navigationExtras);

  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  getMeetingDetails(details, source) {
    const passData = {
      'type': source,
      'details': details
    };
    this.addnotedialogRef = this.dialog.open(MeetingDetailsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: passData
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
    });
  }

  getmyfavourites() {
    this.router.navigate(['consumer', 'myfav']);
  }

  do_search() {
    const passparam = {
      do: 'All',
      la: this.locationholder.lat || '',
      lo: this.locationholder.lon || '',
      lon: this.locationholder.name || '',
      lontyp: this.locationholder.typ || '',
      lonauto: this.locationholder.autoname || ''
    };
    this.router.navigate(['/searchdetail', passparam]);
  }
  showMoreTdyBookings() {
    this.more_tdybookingsShow = true;
  }
  showlessTdyBookings() {
    this.more_tdybookingsShow = false;
  }
  showMoreFutrBookings() {
    this.more_futrbookingsShow = true;
  }
  showlessFutrBookings() {
    this.more_futrbookingsShow = false;
  }
  stopprop(event) {
    event.stopPropagation();
  }

  gotoLivetrackPage(stat, bookingDetails) {
    let uid;
    if (bookingDetails.appointmentEncId) {
      uid = bookingDetails.uid;
    } else {
      uid = bookingDetails.ynwUuid;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account_id: bookingDetails.providerAccount.id,
        status: stat
      }
    };
    if (bookingDetails.appointmentEncId) {
      this.router.navigate(['consumer', 'appointment', 'track', uid], navigationExtras);
    } else {
      this.router.navigate(['consumer', 'checkin', 'track', uid], navigationExtras);
    }

  }
  getTimeToDisplay(min) {
    return this.dateTimeProcessor.convertMinutesToHourMinute(min);
  }
  viewprescription(checkin) {
    this.viewrxdialogRef = this.dialog.open(ViewRxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        accencUid: checkin.prescUrl
      }
    });
  }

  showBookings() {
    this.showOrder = false;
    this.lStorageService.setitemonLocalStorage('orderStat', false);
  }
  getBookingStatusClass(status) {
    const retdet = this.bookingStatusClasses.filter(
      soc => soc.value === this.wordProcessor.firstToUpper(status));
    if (retdet[0]) {
      return retdet[0].class;
    } else {
      return '';
    }
  }
  sendAttachment(booking, type) {
    console.log(booking);
    console.log(type);
    const pass_ob = {};
    pass_ob['user_id'] = booking.providerAccount.id;
    if (type === 'appt') {
      pass_ob['type'] = type;
      pass_ob['uuid'] = booking.uid;
    } else if (type === 'checkin') {
      pass_ob['type'] = type;
      pass_ob['uuid'] = booking.ynwUuid;
    } else {
      pass_ob['type'] = type;
      pass_ob['uuid'] = booking.uid;
    }
    this.addattachment(pass_ob);
  }

  addattachment(pass_ob) {
    console.log(pass_ob);
    this.galleryDialog = this.dialog.open(GalleryImportComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source_id: 'consumerimages',
        accountId: pass_ob.user_id,
        uid: pass_ob.uuid,
        type: pass_ob.type
      }
    });
    this.galleryDialog.afterClosed().subscribe(result => {
      this.reloadAPIs();
    });
  }

  viewAttachment(booking, type) {
    if (type === 'appt') {
      console.log(type);
      this.subs.sink = this.shared_services.getConsumerAppointmentAttachmentsByUuid(booking.uid, booking.providerAccount.id).subscribe(
        (communications: any) => {
          this.image_list_popup_temp = [];
          this.image_list_popup = [];
          let count = 0;
          for (let comIndex = 0; comIndex < communications.length; comIndex++) {
            const thumbPath = communications[comIndex].thumbPath;
            let imagePath = thumbPath;
            const description = communications[comIndex].s3path;
            const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
            if (this.imageAllowed.includes(thumbPathExt.toUpperCase())) {
              imagePath = communications[comIndex].s3path;
            }
            const imgobj = new Image(
              count,
              {
                img: imagePath,
                // description: description
              },
            );
            this.image_list_popup_temp.push(imgobj);
            count++;
          }
          if (count > 0) {
            this.image_list_popup = this.image_list_popup_temp;
            setTimeout(() => {
              this.openImageModalRow(this.image_list_popup[0]);
            }, 500);
          }
        },
        error => { }
      );
    } else if (type === 'checkin') {
      this.subs.sink = this.shared_services.getConsumerWaitlistAttachmentsByUuid(booking.ynwUuid, booking.providerAccount.id).subscribe(
        (communications: any) => {
          this.image_list_popup_temp = [];
          this.image_list_popup = [];
          let count = 0;
          for (let comIndex = 0; comIndex < communications.length; comIndex++) {
            const thumbPath = communications[comIndex].thumbPath;
            let imagePath = thumbPath;
            const description = communications[comIndex].s3path;
            const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
            if (this.imageAllowed.includes(thumbPathExt.toUpperCase())) {
              imagePath = communications[comIndex].s3path;
            }
            const imgobj = new Image(
              count,
              {
                img: imagePath,
                // description: description
              },
            );
            this.image_list_popup_temp.push(imgobj);
            count++;
          }
          if (count > 0) {
            this.image_list_popup = this.image_list_popup_temp;
            setTimeout(() => {
              this.openImageModalRow(this.image_list_popup[0]);
            }, 500);
          }
        },
        error => { }
      );
    }
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  onButtonBeforeHook() { }
  onButtonAfterHook() { }
  gotoQuestionnaire(booking) {
    console.log(booking);
    let uuid;
    let type;
    if (booking.waitlistingFor) {
      uuid = booking.ynwUuid;
      type = 'consCheckin';
    } else {
      uuid = booking.uid;
      type = 'consAppt';
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: uuid,
        providerId: booking.providerAccount.id,
        type: type
      }
    };
    this.router.navigate(['consumer', 'questionnaire'], navigationExtras);
  }

  cardClicked(actionObj) {
    console.log(actionObj);
    switch (actionObj['type']) {
      case 'appt':
        this.performApptActions(actionObj['action'], actionObj['booking'], actionObj['event']);
        break;
      case 'wl':
        this.performWLActions(actionObj['action'], actionObj['booking'], actionObj['event']);
        break;
    }
  }
  performWLActions(actionString, booking, event) {
    switch (actionString) {
      case 'reschedule':
        this.gotoWaitlistReschedule(booking);
        break;
      case 'rating':
        this.rateService(booking, 'checkin');
        break;
      case 'cancel':
        this.doCancelWaitlist(booking, 'checkin');
        break;
      case 'sendMessage':
        this.addWaitlistMessage(booking);
        break;
      case 'sendAttachment':
        this.sendAttachment(booking, 'checkin');
        break;
      case 'viewAttachment':
        this.viewAttachment(booking, 'checkin');
        break;
      case 'meetingDetails':
        this.getMeetingDetails(booking, 'waitlist');
        break;
      case 'removeFavourite':
        this.doDeleteFavProvider(booking.providerAccount);
        break;
      case 'addToFavourites':
        this.addFavProvider(booking.providerAccount.id);
        break;
      case 'moreInfo':
        this.gotoQuestionnaire(booking);
        break;
      case 'viewPrescription':
        this.viewprescription(booking);
        break;
      case 'liveTrack':
        this.gotoLivetrackPage('true', booking);
        break;
      case 'liveTrackId':
        this.gotoLivetrackchekin(booking.ynwUuid, booking.providerAccount.id, 'false');
        break;
      case 'viewBill':
        this.viewBill(booking, 'checkin', event);
        break;
      case 'joinVideo':
        this.btnJoinVideoClicked(booking, event);
        break;
      case 'providerDetails':
        this.providerDetail(booking.providerAccount, event);
        break;
    }
  }
  performApptActions(actionString, booking, event) {
    switch (actionString) {
      case 'reschedule':
        this.gotoAptmtReschedule(booking);
        break;
      case 'rating':
        this.rateService(booking, 'appointment');
        break;
      case 'cancel':
        this.doCancelWaitlist(booking, 'appointment');
        break;
      case 'sendMessage':
        this.addWaitlistMessage(booking, 'appt');
        break;
      case 'sendAttachment':
        this.sendAttachment(booking, 'appt');
        break;
      case 'viewAttachment':
        this.viewAttachment(booking, 'appt');
        break;
      case 'meetingDetails':
        this.getMeetingDetails(booking, 'appt');
        break;
      case 'removeFavourite':
        this.doDeleteFavProvider(booking.providerAccount);
        break;
      case 'addToFavourites':
        this.addFavProvider(booking.providerAccount.id);
        break;
      case 'moreInfo':
        this.gotoQuestionnaire(booking);
        break;
      case 'viewPrescription':
        this.viewprescription(booking);
        break;
      case 'liveTrack':
        this.gotoLivetrackPage('true', booking);
        break;
      case 'liveTrackId':
        this.gotoLivetrack(booking.uid, booking.providerAccount.id, 'false');
        break;
      case 'viewBill':
        this.viewBill(booking, 'appointment', event);
        break;
      case 'joinVideo':
        this.btnJoinVideoClicked(booking, event);
        break;
      case 'providerDetails':
        this.providerDetail(booking.providerAccount, event);
        break;
    }
  }
  gotoDetails() {
    this.router.navigate([projectConstantsLocal.ACCOUNTENC_ID]);
  }
}
