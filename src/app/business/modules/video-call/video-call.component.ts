import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import * as itemjson from '../../assets/json/item.json';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
//  import { ConsumerServices } from '../../../ynw_consumer/services/consumer-services.service';
import { projectConstants } from '../../../app.component';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { TeleServiceConfirmBoxComponent } from '../teleservice/teleservice-confirm-box/teleservice-confirm-box.component';
import { WordProcessor } from '../../../shared/services/word-processor.service';


@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallSharedComponent implements OnInit, OnDestroy {
  businessDetails: any;
  isFuturedate = false;
  sel_checkindate;
  showfuturediv;
  today;
  server_date;
  minDate;
  maxDate;
  todaydate;
  home_delivery: boolean;
  store_pickup: boolean;
  nextAvailableTime: string;
  customer_email: any;
  customer_phoneNumber: any;
  selectedAddress: string;
  orderSummary: any[];
  taxAmount: any;
  orderAmount: any;
  catlog: any;
  catalogItem: any;
  addressDialogRef: any;
  orderList: any = [];
  price: number;
  orders: any[];
  delivery_type: any;
  catlog_id: any;
  selectedQsTime;
  selectedQeTime;
  order_date;
  customer_data: any = [];
  added_address: any = [];
  advance_amount: any;
  account_id: any;
  choose_type;
  selectedRowIndex = -1;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;

  linear: boolean;
  catalog_details: any;
  trackUuid;
  screenWidth: number;
  no_of_grids: number;
  isLinear = true;
  loginForm: FormGroup;
  storeContact: FormGroup;
  api_loading = true;
  checkin: any;
  custId: any = [];
  customer: any;
  meet_data: any;
  id: any;
  providerMeetingUrl: any;
  startTeledialogRef: any;
  starting_url: string;
  starting: string;
  phoneNum: any;
  whatsapBt;
  is_android: boolean;
  is_ios: boolean;
  is_web = false;
  notSupported: any;
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private activated_route: ActivatedRoute,
    public provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private wordProcessor: WordProcessor,

  ) {
    this.onResize();
    this.activated_route.queryParams.subscribe(qparams => {
      // console.log(qparams)
      this.custId = qparams.id;
      this.phoneNum = qparams.phoneNum;
      // console.log(this.phoneNum);
      this.getCustomers(this.custId)
    })
    if(this.phoneNum === 'undefined'){
      this.whatsapBt = false;
    }
    else{
      this.whatsapBt = true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
      divider = divident / 2;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 2;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 2;
    } else if (this.screenWidth < 375) {
      divider = divident / 1;
    }
    this.no_of_grids = Math.round(divident / divider);

  }
  getCustomers(customerId) {
    const filter = { 'id-eq': customerId };
    this.provider_services.getProviderCustomers(filter)
      .subscribe(
        data => {
          // console.log(data)
          this.customer = data;
        },
        () => {
        }
      );
  }
  ngOnInit() {
    const isMobile = {
      Android: function () {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
  };
  if (isMobile.Android()) {
      this.is_android = true;
  } else if (isMobile.iOS()) {
      this.is_ios = true;
  } else {
      this.is_web = true;
  }
  this.notSupported = this.wordProcessor.getProjectMesssages('WATSAPP_NOT_SUPPORTED');
  }

  ngOnDestroy() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
  }
  goBack() {
    this.location.back();
  }
  gotoMeet() {
    this.provider_services.meetReady(this.custId).subscribe(data => {
      this.meet_data = data;
      this.providerMeetingUrl = this.meet_data.providerMeetingUrl;
      // this.subs.sink = observableInterval(this.refreshTime * 500).subscribe(() => {
      //     this.getMeetingStatus();
      // });
      const retcheckarr = this.providerMeetingUrl.split('/');
      this.id = retcheckarr[4]
      const navigationExtras: NavigationExtras = {
        queryParams: {
          custId: this.custId,
        }
      };
      // const path = 'meet/' + this.id ;
      // window.open(path, '_blank');          
      this.router.navigate(['meet', this.id], navigationExtras);
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  asktoLaunch() {
    this.startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
            message: 'Are you ready to start',
            readymsg: 'teleserviceStart',
            meetingLink: this.starting_url,
        }
    });
    this.startTeledialogRef.afterClosed().subscribe(result => {
       
    });
}
getAge(age) {
  age = age.split(',');
  return age[0];
}
redirecToPreviousPage() {
  // if (this.step === 1) {
      this.location.back();
}
amReady() {
  if(!this.is_web){
    const path = 'https://wa.me/' + this.phoneNum
    window.open(path, '_blank');
  }
  
//  this.starting =  'https://wa.me/91' + this.phoneNum
//  console.log(this.starting)
  // this.dialogRef.close();
}
}
