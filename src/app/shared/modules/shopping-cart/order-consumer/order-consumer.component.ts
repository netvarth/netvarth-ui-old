import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ConfirmBoxComponent } from '../../../components/confirm-box/confirm-box.component';
import { LocalStorageService } from '../../../../../../src/app/shared/services/local-storage.service';
import { SharedServices } from '../../../../../../src/app/shared/services/shared-services';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateTimeProcessor } from '../../../../../../src/app/shared/services/datetime-processor.service';
import { projectConstants } from '../../../../app.component';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { projectConstantsLocal } from '../../../constants/project-constants';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Messages } from '../../../constants/project-messages';
import { MatDialog } from '@angular/material/dialog';
import { AddItemNotesComponent } from '../add-item-notes/add-item-notes.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SubSink } from 'subsink';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItemOptionsComponent } from '../item-options/item-options.component';

@Component({
  selector: 'app-order-consumer',
  templateUrl: './order-consumer.component.html',
  styleUrls: ['./order-consumer.component.css']
})
export class OrderConsumerComponent implements OnInit {
  private subs = new SubSink();
  itemOptionsRef: DynamicDialogRef;
  @Input() catalog;
  @Input() business;
  @Input() orderList;
  catalogItems: any;
  orders: any = [];
  disabledConfirmbtn: any;
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  showCouponWB: boolean;
  price: any;
  order_count: any;
  seacrchFilterOrder: any;
  isfutureAvailableTime = false;
  chosenDateDetails: any;
  delivery_type: any;
  choose_type: any;
  store_pickup: any;
  tooltipcls = '';
  storeChecked: any;
  home_delivery: any;
  order_date: any;
  sel_checkindate: any;
  nextAvailableTime: any;
  selected_coupons: any;
  couponsList: any;
  couponvalid: any;
  action: any;
  todaydate: any;
  isFuturedate: any;
  nextAvailableTimeQueue: any;
  queue: any;
  futureAvailableTime: string;
  homeAvailableDates: any = [];
  store_availables: any;
  home_availables: any;
  mobileView: any;
  desktopView: any;
  account_id: any;
  provider_id: any;
  from: string;
  customId: any;
  businessId: any;
  source: any;
  server_date: any;
  catalog_loading: any;
  catalog_details: any;
  catalog_Id: any;
  catalog_type: any;
  deliveryCharge: any;
  advance_amount: any;
  storeAvailableDates: any;
  apiloading: any;
  storeContact: any;
  showfuturediv: boolean;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  today: any;
  minDate: any;
  maxDate: any;
  ddate: Date;
  businessPhoneNumber: any;
  s3CouponsList: any = {
    JC: [], OWN: []
  };
  api_cp_error: any;
  selected_coupon: string;
  coupon_status: any;
  canceldialogRef: any;
  addItemNotesdialogRef: any;
  provider_account_id: any;
  orderItems: any[];
  orderstatus: boolean;
  userId: any = null;
  activeCatalog: any;
  orderType: any;
  catalogImage: any;
  catalogimage_list_popup: any[];
  itemCount: any;
  deviceInfo: any;
  tempRes: any;
  serviceOptionQuestionnaireList: any;
  serviceOptionApptt: any;
  itemOptionsData: any = [];
  lastCustomization: any;
  itemsListWithItemOptions: any;
  itemDetails: any;
  updatedItemOptionsData: any;
  selectedIndex: any;
  newOrderList: any = [];
  repeatSelectedIndex: any;
  constructor(
    private location: Location,
    private lStorageService: LocalStorageService,
    private shared_services: SharedServices,
    public route: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessor,
    private snackbarService: SnackbarService,
    public router: Router,
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private dialogService: DialogService

  ) {
    this.route.queryParams.subscribe(
      params => {
        this.provider_account_id = params.account_id;
        this.account_id = this.provider_account_id;
        if (params.unique_id) {
          this.provider_id = params.unique_id;
        }
        if (params.isFrom && params.isFrom == 'providerdetail') {
          this.from = 'providerdetail';
        }
        if (params.customId) {
          this.customId = params.customId;
          this.businessId = this.account_id;
        }
        if (params.source) {
          this.source = params.source;
        }
        if (!this.lStorageService.getitemfromLocalStorage('sysdate')) {
          this.setSystemDate();
        }
      });
  }

  ngOnInit(): void {
    if (this.catalog) {
      console.log("Catalog Details : ", this.catalog)
      if (this.catalog.catalogItem) {
        this.catalogItems = this.catalog.catalogItem
        console.log("Catalog catalogItems ", this.catalogItems)
      }
    }
    if (this.business) {
      console.log("Business Details : ", this.business)
    }
    if (this.orderList) {
      console.log("orderList Details : ", this.orderList)
    }
    this.fetchCatalog();
    this.getCatalogs(this.provider_account_id);
    if (this.lStorageService.getitemfromLocalStorage('businessPhoneNumber')) {
      this.businessPhoneNumber = this.lStorageService.getitemfromLocalStorage('businessPhoneNumber');
    }

    this.deviceInfo = this.deviceService.getDeviceInfo();

    // this.mobileView = this.deviceService.isMobile() || this.deviceService.isTablet();
    // this.desktopView = this.deviceService.isDesktop();
    // this.mobileView = this.deviceService.isDesktop();

  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  changeTime() {
    this.action = 'timeChange';
    this.getAvailabilityByDate(this.sel_checkindate);
  }

  getItemQty(item, index?) {
    let qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
    if (this.haveItemOptions(item) && itemOptionsData && index) {
      qty = this.orderList.filter(i => i.itemOptionsIndex === index).length;
    }
    if (qty === 0) {
      this.removeItemFromCart(item);
    }
    return qty;
  }

  getItemPrice(item, index) {
    let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
    if (this.haveItemOptions(item) && itemOptionsData && index) {
      for (let i = 0; i < itemOptionsData.length; i++) {
        if (itemOptionsData[i] && itemOptionsData[i].itemData && itemOptionsData[i].itemData.itemOptionsIndex === index) {
          return Number(itemOptionsData[i].postData.totalPrice)
        }
      }
    }
    else {
      return item.item.price
    }
  }


  getCatalogs(bprovider_id) {
    const account_Id = this.provider_account_id;
    this.shared_services.setaccountId(account_Id);
    this.orderItems = [];

    this.shared_services.getConsumerCatalogs(account_Id).subscribe(
      (catalogs: any) => {
        if (catalogs.length !== 0) {
          this.catalog_loading = true;
          this.activeCatalog = catalogs[0];
          console.log("this.activeCatalog", this.activeCatalog)
          this.orderType = this.activeCatalog.orderType;
          if (this.activeCatalog.catalogImages && this.activeCatalog.catalogImages[0]) {
            this.catalogImage = this.activeCatalog.catalogImages[0].url;
            this.catalogimage_list_popup = [];
            // const imgobj = new Image(0,
            //   { // modal
            //     img: this.activeCatalog.catalogImages[0].url,
            //     description: ''
            //   });
            // this.catalogimage_list_popup.push(imgobj);
          }
          // this.updateLocalStorageItems();
          this.catlogArry();
          this.advance_amount = this.activeCatalog.advanceAmount;
          if (this.activeCatalog.pickUp) {
            if (this.activeCatalog.pickUp.orderPickUp && this.activeCatalog.nextAvailablePickUpDetails) {
              this.store_pickup = true;
              this.choose_type = 'store';
              this.sel_checkindate = this.activeCatalog.nextAvailablePickUpDetails.availableDate;
              this.nextAvailableTime = this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
            }
          }
          if (this.activeCatalog.homeDelivery) {
            if (this.activeCatalog.homeDelivery.homeDelivery && this.activeCatalog.nextAvailableDeliveryDetails) {
              this.home_delivery = true;

              if (!this.store_pickup) {
                this.choose_type = 'home';
                this.deliveryCharge = this.activeCatalog.homeDelivery.deliveryCharge;
                this.sel_checkindate = this.activeCatalog.nextAvailableDeliveryDetails.availableDate;
                this.nextAvailableTime = this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
              }
            }
          }
          this.shared_services.setOrderDetails(this.activeCatalog);
          for (let itemIndex = 0; itemIndex < this.activeCatalog.catalogItem.length; itemIndex++) {
            const catalogItemId = this.activeCatalog.catalogItem[itemIndex].itemId;
            const minQty = this.activeCatalog.catalogItem[itemIndex].minQuantity;
            const maxQty = this.activeCatalog.catalogItem[itemIndex].maxQuantity;
            const showpric = this.activeCatalog.showPrice;
            if (this.activeCatalog.catalogItem[itemIndex].item.isShowOnLandingpage) {
              this.orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.activeCatalog.catalogItem[itemIndex].item, 'showpric': showpric });
              this.itemCount++;
            }
          }
          // this.orderItems = orderItems;
        }
      });
    this.catalogItems = this.orderItems;
    this.isPhysicalItemsPresent();

  }


  getServiceOptions(id) {
    this.subs.sink = this.shared_services.getServiceoptionsOrder(id, this.account_id).subscribe(
      (data: any) => {
        if (data) {
          this.serviceOptionQuestionnaireList = data;
          if (this.serviceOptionQuestionnaireList && this.serviceOptionQuestionnaireList.questionnaireId) {
            this.serviceOptionApptt = true;
          }
        }
      },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }

  catlogArry() {
    if (this.lStorageService.getitemfromLocalStorage('order') !== null) {
      this.orderList = this.lStorageService.getitemfromLocalStorage('order');
    }
    this.getTotalItemAndPrice();
  }
  handleFutureDateChange(e) {
    const tdate = e.targetElement.value;
    const newdate = tdate.split('/').reverse().join('-');
    const futrDte = new Date(newdate);
    const obtmonth = (futrDte.getMonth() + 1);
    let cmonth = '' + obtmonth;
    if (obtmonth < 10) {
      cmonth = '0' + obtmonth;
    }
    const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
    this.sel_checkindate = seldate;
    const dt0 = this.todaydate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    const dte0 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
    const datee2 = new Date(dte2);
    if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    this.handleFuturetoggle();
    this.getAvailabilityByDate(this.sel_checkindate);
  }

  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }

  applyCoupons(jCoupon) {
    this.api_cp_error = null;
    this.couponvalid = true;
    const couponInfo = {
      'couponCode': '',
      'instructions': ''
    };
    if (jCoupon) {
      const jaldeeCoupn = jCoupon.trim();
      if (this.checkCouponExists(jaldeeCoupn)) {
        this.api_cp_error = 'Coupon already applied';
        this.couponvalid = false;
        return false;
      }
      this.couponvalid = false;
      let found = false;
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.JC.length; couponIndex++) {
        if (this.s3CouponsList.JC[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList.JC[couponIndex].jaldeeCouponCode);
          couponInfo.couponCode = this.s3CouponsList.JC[couponIndex].jaldeeCouponCode;
          couponInfo.instructions = this.s3CouponsList.JC[couponIndex].consumerTermsAndconditions;
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.OWN.length; couponIndex++) {
        if (this.s3CouponsList.OWN[couponIndex].couponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList.OWN[couponIndex].couponCode);
          couponInfo.couponCode = this.s3CouponsList.OWN[couponIndex].couponCode;
          if (this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions) {
            couponInfo.instructions = this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions;
          }
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      if (found) {
        this.couponvalid = true;
        this.snackbarService.openSnackBar('Promocode applied', { 'panelclass': 'snackbarerror' });
        this.action = '';
      } else {
        this.api_cp_error = 'Coupon invalid';
      }
    } else {
      this.api_cp_error = 'Enter a Coupon';
    }
  }

  checkCouponExists(couponCode) {
    let found = false;
    for (let index = 0; index < this.selected_coupons.length; index++) {
      if (couponCode === this.selected_coupons[index]) {
        found = true;
        break;
      }
    }
    return found;
  }

  calculateDate(days) {
    const dte = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const ndate1 = y + '-' + mm + '-' + dd;
    const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
    const strtDt1 = this.todaydate + ' 00:00:00';
    const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
    const nDt = new Date(ndate);
    if (nDt.getTime() >= strtDt.getTime()) {
      this.sel_checkindate = ndate;
      this.getAvailabilityByDate(this.sel_checkindate);
    }
    const dt = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt1 = moment(dt, 'YYYY-MM-DD HH:mm').format();
    const date1 = new Date(dt1);
    const dt0 = this.todaydate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    const day1 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
  }

  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }

  toggleterms(i) {
    if (this.couponsList[i].showme) {
      this.couponsList[i].showme = false;
    } else {
      this.couponsList[i].showme = true;
    }
  }

  removeJCoupon(i) {
    this.selected_coupons.splice(i, 1);
    this.couponsList.splice(i, 1);
  }

  handleQueueSelection(queue, index) {
    console.log(queue);
    console.log(index);
    this.queue = queue;
    console.log(this.queue);
  }

  goBackCart(selectedTimeslot, queue) {
    console.log(queue);
    console.log(selectedTimeslot);
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    console.log(selectqueue);
    this.nextAvailableTime = selectqueue;
    this.action = '';
  }

  Cancel() {
    this.action = '';
  }

  clearCouponErrors() {
    this.couponvalid = true;
    this.api_cp_error = null;
  }

  removeItemFromCart(item) {
    this.orderList = this.orderList.filter(Item => Item.item.itemId !== item.item.itemId);
    this.orders = [...new Map(this.orderList.map(Item => [Item.item['itemId'], Item])).values()];
    if (this.orders.length === 0) {
      this.disabledConfirmbtn = true;
    }

    this.getNewOrderList()
  }
  goBack() {
    this.location.back();
  }
  // transform(seacrchFilterOrder) {
  //   console.log('seacrchFilterOrder', this.seacrchFilterOrder)
  // }

  dateClass(date: Date): MatCalendarCellCssClasses {
    if (this.choose_type === 'store') {
      return (this.storeAvailableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    } else {
      return (this.homeAvailableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
  }

  haveItemOptions(item) {
    if (this.itemsListWithItemOptions && this.itemsListWithItemOptions.length > 0) {
      var haveItemOptions = false;
      this.itemsListWithItemOptions.forEach(element => {
        if (element.item.itemId == item.item.itemId) {
          haveItemOptions = true;
        }
      });

      if (haveItemOptions) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  increment(item) {
    this.subs.sink = this.shared_services.getServiceoptionsOrder(item.item.itemId, this.account_id).subscribe(
      (data: any) => {
        if (data) {
          this.serviceOptionQuestionnaireList = data;
          if (this.serviceOptionQuestionnaireList && this.serviceOptionQuestionnaireList.questionnaireId) {
            this.serviceOptionApptt = true;
            this.addItemOptions(data, item, true)
          }
          else {
            this.addToCart(item);
          }
        }
      },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }

  getItemsListWithItemOptions() {
    this.subs.sink = this.shared_services.getItemsListWithItemOptions(this.catalog_Id, this.account_id).subscribe(
      (data: any) => {
        if (data) {
          this.itemsListWithItemOptions = data;
        }
      },
      (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }


  addItemOptions(data, item, repeatBool?) {
    this.itemDetails = Object.assign({}, item);
    var datatoSend = { data: data, type: 'add', itemDetails: this.itemDetails };

    let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
    var repeat = false;

    if (repeatBool) {
      if (itemOptionsData) {
        for (let i = 0; i < itemOptionsData.length; i++) {
          if (itemOptionsData[i] && itemOptionsData[i].itemData && itemOptionsData[i].itemData.id === item.id) {
            this.lastCustomization = itemOptionsData[i];
            repeat = true;
            this.repeatSelectedIndex = i
          }
        }
      }
      if (repeat) {
        var datatoSend = { data: data, type: 'repeat', itemDetails: item };
        if (this.lastCustomization) {
          datatoSend['lastCustomization'] = this.lastCustomization
        }
        console.log("Coming to Repeat", this.lastCustomization)
        if (this.lastCustomization && this.lastCustomization.itemData && this.lastCustomization.itemData.itemOptionsIndex)
        {
          this.itemDetails['itemOptionsIndex'] = this.lastCustomization.itemData.itemOptionsIndex;
        }
      }
    }



    if (!repeat) {
      console.log("Coming Here")
      var itemOptionsIndex = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      this.itemDetails['itemOptionsIndex'] = itemOptionsIndex;
      datatoSend = { data: data, type: 'add', itemDetails: this.itemDetails };
      console.log("datatoSend", datatoSend)
    }

    this.itemOptionsRef = this.dialogService.open(ItemOptionsComponent, {
      header: 'Choose Item Options',
      width: '90%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
      data: datatoSend
    });

    this.itemOptionsRef.onClose.subscribe((result: any) => {
      if (result) {
        if (result.postData && result.fileData && (!result.type || result.type && (result.type == 'addNew' || result.type == 'repeatLast'))) {
          let itemOptionsJson = {
            "itemData": this.itemDetails,
            "postData": result.postData,
            "fileData": result.fileData,
            "answersData": result.answersData,
            "questionnaireData": data
          }
          this.addToCart(this.itemDetails);
          let previousItemOptionsData = this.lStorageService.getitemfromLocalStorage("itemOptionsData")
          if (previousItemOptionsData) {
            this.itemOptionsData = previousItemOptionsData;
          }
          this.itemOptionsData.push(itemOptionsJson)
          console.log("this.itemOptionsData", this.itemOptionsData)
          this.lStorageService.setitemonLocalStorage('itemOptionsData', this.itemOptionsData)
        }
        else if (result.type) {
          if (result && result.type == 'addNew') {
            this.addItemOptions(data, item, false)
          }
          else if (result && result.type == 'repeatLast') {
            if (result && result.lastCustomization) {
              this.addToCart(this.itemDetails);
              if (this.repeatSelectedIndex != 'undefined') {
                let repeatItemOptions = result.lastCustomization;
                let repeatItemOptionsPostData = result.lastCustomization.postData;
                if (repeatItemOptionsPostData && repeatItemOptionsPostData.answerLine && repeatItemOptionsPostData.answerLine[0].answer && repeatItemOptionsPostData.answerLine[0].answer.dataGridList[0]
                  && repeatItemOptionsPostData.answerLine[0].answer.dataGridList[0].dataGridListColumn) {
                  let repeatItemOptionsPostDataAnswers = result.lastCustomization.postData.answerLine[0].answer.dataGridList[0].dataGridListColumn;
                  if (repeatItemOptionsPostDataAnswers) {
                    repeatItemOptionsPostDataAnswers.forEach(element => {
                      element.quantity = element.quantity + 1;
                      element.price = element.price * 2;
                    });
                  }
                  // repeatItemOptionsPostData.totalPrice = repeatItemOptionsPostData.totalPrice * 2;
                }
                let itemOptionsDataNew = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
                itemOptionsDataNew[this.repeatSelectedIndex] = repeatItemOptions;
                this.lStorageService.setitemonLocalStorage('itemOptionsData', itemOptionsDataNew)
              }
            }
          }
        }
      }
    });
  }



  editItemOptions(item, index) {
    console.log("index", index)
    this.itemDetails = Object.assign({}, item);
    let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
    for (let i = 0; i < itemOptionsData.length; i++) {
      if (itemOptionsData[i].itemData.itemOptionsIndex == index) {
        this.updatedItemOptionsData = itemOptionsData[i];
        this.selectedIndex = i;
      }
    }
    // itemOptionsData.forEach(element => {
    //   if (element.itemData.itemOptionsIndex == index) {
    //     this.updatedItemOptionsData = element;
    //     this.selectedIndex = itemOptionsData.indexOf(element);
    //   }
    // });
    this.itemOptionsRef = this.dialogService.open(ItemOptionsComponent, {
      header: 'Edit Item Options',
      width: '90%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
      data: { data: this.updatedItemOptionsData, type: 'edit', itemDetails: this.itemDetails }
    });

    this.itemOptionsRef.onClose.subscribe((result: any) => {
      if (result) {
        if (result.postData && result.fileData) {
          console.log("result.postData", result.postData)
          let itemOptionsJson = {
            "itemData": this.itemDetails,
            "postData": result.postData,
            "fileData": result.fileData,
            "answersData": result.answersData,
            "questionnaireData": this.updatedItemOptionsData.questionnaireData
          }
          itemOptionsData[this.selectedIndex] = itemOptionsJson;
          this.lStorageService.removeitemfromLocalStorage('itemOptionsData')
          this.lStorageService.setitemonLocalStorage('itemOptionsData', itemOptionsData)
          this.getTotalItemAndPrice()
        }
      }
    });
  }


  // qnrPopup(question, value) {

  //   this.showqnr = true;
  //   this.sequenceId = question.sequnceId;

  //   // this.questionnaireList= question;
  //   const removeitemdialogRef = this.dialog.open(QnrDialogComponent, {
  //     width: '50%',
  //     panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
  //     disableClose: true,
  //     data: {
  //       data: question,
  //       qnr_type: 'service_option',
  //       view: 'qnrView',
  //       isEdit: 'add'
  //     }
  //   });
  //   removeitemdialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dataGridList = result.data.answerLine;
  //       this.post_Data = result.data;
  //       this.showItem = true;
  //       this.item = result.data.answerLine[0].answer.dataGridList[0].dataGridListColumn[0].column.list[0];

  //       if (result.data.totalPrice) {
  //         this.totalPrice = result.data.totalPrice
  //       }
  //       let dummyArray = { id: this.id, sequenceId: this.sequenceId, item: this.item, price: this.totalPrice, columnItem: this.dataGridList }
  //       this.itemArray.push(dummyArray)

  //       if (this.itemArray) {
  //         this.lStorageService.setitemonLocalStorage('itemArray', this.itemArray);
  //       }
  //       this.serviceTotalPrice = 0;
  //       this.itemArray.forEach((item: any) => {


  //         this.serviceTotalPrice = this.serviceTotalPrice + item.price;
  //         this.lStorageService.setitemonLocalStorage('serviceTotalPrice', this.serviceTotalPrice);
  //       });


  //       this.id = this.id + 1
  //       let obj = { sequenceId: this.sequenceId, dgList: this.post_Data.answerLine };
  //       this.finalObjectList.push(obj);
  //       this.onSubmit('serviceOption')

  //     }
  //   });
  // }

  // addToCart(Item) {
  //   this.orderList.push(Item);
  //   this.getTotalItemAndPrice();
  //   this.getItemQty(Item);
  // }



  addToCart(itemObj) {
    console.log(itemObj);
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    console.log("spId", typeof (spId), typeof (this.provider_account_id));
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.account_id);
     
  
  if(!itemObj.item.isStockAvailable){
    this.snackbarService.openSnackBar('Out of stock', { 'panelClass': 'snackbarerror' });
   }
   if(itemObj.item.isStockAvailable){
    this.orderList.push(itemObj);
   }
      this.orderList.push(itemObj);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.getTotalItemAndPrice();
      this.getItemQty(itemObj);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId != this.provider_account_id) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          
           if(!itemObj.item.isStockAvailable){
            this.snackbarService.openSnackBar('Out of stock', { 'panelClass': 'snackbarerror' });
           }
           if(itemObj.item.isStockAvailable){
            this.orderList.push(itemObj);
           }
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
          this.getTotalItemAndPrice();
          console.log("Testing order catalog", this.lStorageService.getitemfromLocalStorage('order'));
          this.getItemQty(itemObj);
        }
      } else {
        
         if(!itemObj.item.isStockAvailable){
          this.snackbarService.openSnackBar('Out of stock', { 'panelClass': 'snackbarerror' });
         }
         if(itemObj.item.isStockAvailable){
          this.orderList.push(itemObj);
         }
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        this.getTotalItemAndPrice();
        this.getItemQty(itemObj);
      }
    }
    // this.newOrderList = this.orderList.filter((item, index) => this.orderList.indexOf(item) === index);
    this.getNewOrderList();

  }

  getNewOrderList() {
    let itemOptionsIds = [];
    let itemsIds = [];
    this.newOrderList = [];
    if (this.orderList && this.orderList.length > 0) {
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.haveItemOptions(this.orderList[i])) {
          if (itemOptionsIds.indexOf(this.orderList[i].itemOptionsIndex) === -1) {
            itemOptionsIds.push(this.orderList[i].itemOptionsIndex);
            this.newOrderList.push(this.orderList[i]);
          }
        }
        else {
          if (itemsIds.indexOf(this.orderList[i].id) === -1) {
            itemsIds.push(this.orderList[i].id);
            this.newOrderList.push(this.orderList[i]);
          }
        }
      }
    }
  }

  getConfirmation() {
    let can_remove = false;
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        can_remove = true;
        this.orderList = [];
        this.lStorageService.removeitemfromLocalStorage('order_sp');
        this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
        this.lStorageService.removeitemfromLocalStorage('order_spId');
        this.lStorageService.removeitemfromLocalStorage('order');
        return true;
      } else {
        can_remove = false;

      }
    });
    return can_remove;
  }
  // removeFromCart(itemObj) {
  //   const item = itemObj.item;

  //   for (const i in this.orderList) {
  //     if (this.orderList[i].item.itemId === item.itemId) {
  //       this.orderList.splice(i, 1);
  //       if (this.orderList.length > 0 && this.orderList !== null) {
  //         this.lStorageService.setitemonLocalStorage('order', this.orderList);
  //       } else {
  //         this.lStorageService.removeitemfromLocalStorage('order_sp');
  //         this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
  //         this.lStorageService.removeitemfromLocalStorage('order_spId');
  //         this.lStorageService.removeitemfromLocalStorage('order');
  //       }

  //       break;
  //     }
  //   }
  //   this.getTotalItemAndPrice();
  // }

  decrement(item, index?) {
    this.removeFromCart(item, index);
  }


  removeFromCart(itemObj, index?) {
    const item = itemObj.item;
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        break;
      }
    }
    let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');

    let Itemindex = itemOptionsData.findIndex(x => x.itemData.itemOptionsIndex === itemObj.itemOptionsIndex);
    if (Itemindex > -1) {
      console.log("index", itemOptionsData[index])
      if (this.getItemQty(itemOptionsData[index]) == 1) {
        itemOptionsData.splice(index, 1);
      }
      else {
        let items = itemOptionsData[index].postData.answerLine[0].answer.dataGridList[0].dataGridListColumn;
        for (let i = 0; i < items.length; i++) {
          items[i].quantity = items[i].quantity - 1;
        }
      }
      if (itemOptionsData) {
        this.lStorageService.setitemonLocalStorage('itemOptionsData', itemOptionsData);
      }
    }
    // if (this.haveItemOptions(itemObj) && index && itemOptionsData) {
    //   for (let i = 0; i < itemOptionsData.length; i++) {
    //     if (itemOptionsData[i] && itemOptionsData[i].itemData.itemOptionsIndex === index) {
    //       let quantity = itemOptionsData[i].postData.answerLine[0].answer.dataGridList[0].dataGridListColumn;
    //       for (let i = 0; i < quantity.length; i++) {
    //         quantity[i].quantity = quantity[i].quantity - 1;
    //         if (quantity[i].quantity == 0) {
    //           itemOptionsData.splice(i, 1);
    //           break;
    //         }
    //       }
    //       this.lStorageService.setitemonLocalStorage('itemOptionsData', itemOptionsData);
    //       break;
    //     }
    //   }
    // }
    // this.getTotalItemAndPrice();
    // this.getItemQty(itemObj);
    // this.getNewOrderList();
  }

  getTotalItemAndPrice() {
    this.price = 0;
    this.order_count = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (this.haveItemOptions(itemObj)) {
        let itemOptionsData = this.lStorageService.getitemfromLocalStorage('itemOptionsData');
        if (itemOptionsData) {
          for (let i = 0; i < itemOptionsData.length; i++) {
            if (itemOptionsData[i].itemData.itemOptionsIndex == itemObj.itemOptionsIndex) {
              item_price = itemOptionsData[i].postData.totalPrice;
            }
          }
        }
      }
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
      this.order_count = this.order_count + 1;
    }

    console.log("Price : ", this.price, this.orderList)
    return this.price;
  }

  getCatalogDetails(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getConsumerCatalogs(accountId)
        .subscribe(
          (data: any) => {
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });
  }
  fetchCatalog() {
    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_loading = true;
      this.catalog_details = data;
      console.log(this.catalog_details);
      if (this.catalog_details) {
        this.catalog_Id = this.catalog_details.id;
        if (this.catalog_Id && this.account_id) {
          this.getItemsListWithItemOptions()
        }
        this.catalog_type = this.catalog_details.catalogType;
        if (this.catalog_details.pickUp) {
          if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
            this.store_pickup = true;
            this.choose_type = 'store';
            this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
            this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
          }
        }
        if (this.catalog_details.homeDelivery) {
          if (this.catalog_details.homeDelivery.homeDelivery && this.catalog_details.nextAvailableDeliveryDetails) {
            this.home_delivery = true;

            if (!this.store_pickup) {
              this.choose_type = 'home';
              this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
              this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
              this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];

            }
          }
        }
        this.advance_amount = this.catalog_details.advanceAmount;
      }
      this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
      this.getOrderAvailableDatesForPickup();
      this.getOrderAvailableDatesForHome();
      this.fillDateFromLocalStorage();
      this.getStoreContact();
      this.showfuturediv = false;
      this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
      this.today = new Date(this.today);
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
      this.minDate = new Date(this.minDate);
      const dd = this.today.getDate();
      const mm = this.today.getMonth() + 1; // January is 0!
      const yyyy = this.today.getFullYear();
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
      this.todaydate = dtoday;
      this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
      if (this.todaydate === this.sel_checkindate) {
        this.isFuturedate = false;
      } else {
        this.isFuturedate = true;
      }
      this.isAuthordemy();
    });
  }


  getStoreContact() {
    this.shared_services.getStoreContact(this.account_id)
      .subscribe((data: any) => {
        this.storeContact = data;
      });
  }

  getOrderAvailableDatesForHome() {
    const _this = this;
    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        this.home_availables = data.filter(obj => obj.isAvailable);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates = this.home_availables.map(function (a) { return a.date; });
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  isAuthordemy() {
    if (this.catalog_type === 'submission') {
      this.apiloading = true;
      this.source = 'paper';
      setTimeout(() => this.confirmOrder(), projectConstants.TIMEOUT_DELAY);
    }
  }

  getOrderAvailableDatesForPickup() {
    const _this = this;
    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        this.store_availables = data.filter(obj => obj.isAvailable);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates = this.store_availables.map(function (a) { return a.date; });
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  isPhysicalItemsPresent() {
    let physical_item_present = true;

    const virtualItems = this.orderList.filter(orderitem => orderitem.item.itemType === 'VIRTUAL')
    if (virtualItems.length > 0 && this.orderList.length === virtualItems.length) {
      physical_item_present = false;
      this.isfutureAvailableTime = true;
    }
    return physical_item_present;
  }


  fillDateFromLocalStorage() {
    this.chosenDateDetails = this.lStorageService.getitemfromLocalStorage('chosenDateTime');
    if (this.chosenDateDetails !== null) {
      this.delivery_type = this.chosenDateDetails.delivery_type;
      this.choose_type = this.delivery_type;
      if (this.delivery_type === 'store') {
        this.store_pickup = true;
        this.choose_type = 'store';
        this.storeChecked = true;
      } else if (this.delivery_type === 'home') {
        this.home_delivery = true;
        this.choose_type = 'home';
        this.storeChecked = false;
      }
      this.sel_checkindate = this.chosenDateDetails.order_date;
      this.nextAvailableTime = this.chosenDateDetails.nextAvailableTime;
      if (this.chosenDateDetails.selected_coupons.length > 0) {
        this.selected_coupons = this.chosenDateDetails.selected_coupons;
        this.couponsList = this.chosenDateDetails.couponsList;
        this.couponvalid = true;
        this.action = '';
      }
    } else {
      this.storeChecked = true;
    }
  }


  changeType(event) {
    this.choose_type = event.value;
    if (event.value === 'store') {
      this.store_pickup = true;
      this.choose_type = 'store';
      this.storeChecked = true;
      this.sel_checkindate = this.catalog.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    } else {
      this.home_delivery = true;
      this.choose_type = 'home';
      this.storeChecked = false;
      this.sel_checkindate = this.catalog.nextAvailableDeliveryDetails.availableDate;
      this.nextAvailableTime = this.catalog.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    }
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }



  getAvailabilityByDate(date) {
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    if (this.choose_type === 'store') {
      const storeIntervals = (this.catalog.pickUp.pickUpSchedule.repeatIntervals).map(Number);
      const last_date = moment().add(30, 'days');
      const thirty_date = moment(last_date, 'YYYY-MM-DD HH:mm').format();
      if ((storeIntervals.includes(currentday)) && (date > thirty_date)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog.pickUp.pickUpSchedule.timeSlots;
        this.queue = this.catalog.pickUp.pickUpSchedule.timeSlots[0];
        this.futureAvailableTime = this.catalog.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
        console.log('greater than 30');
      }
      else if ((storeIntervals.includes(currentday)) && (date < thirty_date)) {
        console.log('less than 30');
        console.log(this.store_availables);
        const sel_check_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        if (this.store_availables) {
          const availability = this.store_availables.filter(obj => obj.date === sel_check_date);
          if (availability.length > 0) {
            this.isfutureAvailableTime = true;
            this.nextAvailableTimeQueue = availability[0].timeSlots;
            this.queue = availability[0].timeSlots[0];
            this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' + availability[0].timeSlots[0]['eTime'];
          } else {
            this.isfutureAvailableTime = false;
          }
        }
      }
      else {
        this.isfutureAvailableTime = false;
      }
    }
    else {
      const homeIntervals = (this.catalog.homeDelivery.deliverySchedule.repeatIntervals).map(Number);
      const last_date = moment().add(30, 'days');
      const thirty_date = moment(last_date, 'YYYY-MM-DD HH:mm').format();
      console.log(homeIntervals);
      console.log(JSON.stringify(homeIntervals));
      if (homeIntervals.includes(currentday) && (date > thirty_date)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog.homeDelivery.deliverySchedule.timeSlots;
        this.queue = this.catalog.homeDelivery.deliverySchedule.timeSlots[0];
        this.futureAvailableTime = this.catalog.homeDelivery.deliverySchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog.homeDelivery.deliverySchedule.timeSlots[0]['eTime'];
        console.log('greater than 30');
      } else if (homeIntervals.includes(currentday) && (date < thirty_date)) {
        console.log(this.home_availables);
        const sel_check_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const availability = this.home_availables.filter(obj => obj.date === sel_check_date);
        if (availability.length > 0) {
          this.isfutureAvailableTime = true;
          this.nextAvailableTimeQueue = availability[0].timeSlots;
          this.queue = availability[0].timeSlots[0];
          this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' + availability[0].timeSlots[0]['eTime'];
        } else {
          this.isfutureAvailableTime = false;
        }
      }
      else {
        this.isfutureAvailableTime = false;
      }
    }
  }

  checkMinimumQuantityofItems() {
    let all_itemsSet = true;
    this.orders.forEach(item => {
      if (this.getItemQty(item) < item.minqty) {
        this.snackbarService.openSnackBar(item.item.displayName + ' required atleast qty ' + item.minqty + ' as minimum to checkout', { 'panelClass': 'snackbarerror' });
        all_itemsSet = false;
      }
    });
    return all_itemsSet;
  }

  addNotes(item, index) {
    this.addItemNotesdialogRef = this.dialog.open(AddItemNotesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: item

    });
    this.addItemNotesdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderList.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            Item['consumerNote'] = result;
          }
        });
        this.orders.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            Item['consumerNote'] = result;
          }
        });
      }
    });
  }
  deleteNotes(item, index) {
    console.log(this.orderList);
    this.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to Delete this Note?',
      }
    });
    this.canceldialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.orderList);
        this.orderList.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            console.log(Item.consumerNote);
            Item['consumerNote'] = Item.consumerNote.splice;
          }
        });
      }
    });
  }

  getTotalItemPrice() {
    this.price = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
    }
    return this.price.toFixed(2);
  }

  getSubTotal() {
    let subtotal = 0;
    let deliveryCharge = 0;
    if (this.orderList.length !== 0) {
      if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
        deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
      }
    }
    subtotal = subtotal + this.price + deliveryCharge;
    return subtotal.toFixed(2);
  }

  getDeliveryCharge() {
    let deliveryCharge = 0;
    if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    return deliveryCharge.toFixed(2);
  }

  confirmOrder() {
    console.log("CustomId:", this.customId);
    if (this.checkMinimumQuantityofItems()) {
      this.lStorageService.setitemonLocalStorage('consumerorders', this.orderList);
      const chosenDateTime = {
        delivery_type: this.choose_type,
        catlog_id: this.catalog_details.id,
        nextAvailableTime: this.nextAvailableTime,
        order_date: this.sel_checkindate,
        advance_amount: this.catalog_details.advance_amount,
        account_id: this.account_id,
        selected_coupons: this.selected_coupons,
        couponsList: this.couponsList
      };
      let queryParam = {
        providerId: this.provider_id,
      };
      if (this.businessId) {
        queryParam['customId'] = this.customId;
      }
      if (this.from) {
        queryParam['isFrom'] = 'providerdetail'
      }
      if (this.catalog_Id) {
        queryParam['catalog_Id'] = this.catalog_Id;
      }
      if (this.source == 'paper') {
        queryParam['source'] = this.source;
      }
      const navigationExtras: NavigationExtras = {
        queryParams: queryParam,
      };
      this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
      console.log("Order Deatils", this.lStorageService.getitemfromLocalStorage('consumerorders'))
      this.router.navigate(['order', 'shoppingcart', 'ordercheckout'], navigationExtras);
    }
  }


  transform(seacrchFilterOrder) {
    // console.log('seacrchFilterOrder', seacrchFilterOrder);
    this.getCataLogDetails(seacrchFilterOrder)
  }
  handleSearchSelect(cataItem, searchFilter) {
    // console.log(cataItem);
    // console.log('searchFilter',searchFilter);

  }
  getCataLogDetails(searchFilter) {
    let tempCatValue = 'displayName';
    this.shared_services.getSearchCatalogItem(this.account_id, tempCatValue, searchFilter).subscribe((res: any) => {
      // console.log(res);
      // console.log(' this.catalogItems', this.catalogItems);
      if (res.length === 0) {
        this.catalogItems = res;
        this.tempRes = res;
        if (searchFilter.charAt(0) === '') {
          this.catalogItems = this.catalog.catalogItem
        }
      }
      else {
        this.catalogItems = []
        console.log('this.catalog', this.catalog.catalogItem)
        for (let x = 0; x < this.catalog.catalogItem.length; x++) {
          for (let i = 0; i < res.length; i++) {
            if (this.catalog.catalogItem[x].item.itemId === res[i].itemId) {
              this.catalogItems.push({
                item: {
                  'adhoc': this.catalog.catalogItem[x].item.adhoc,
                  'displayName': this.catalog.catalogItem[x].item.displayName,
                  'isShowOnLandingpage': this.catalog.catalogItem[x].item.isShowOnLandingpage,
                  'isStockAvailable': this.catalog.catalogItem[x].item.isStockAvailable,
                  'itemCode': this.catalog.catalogItem[x].item.itemCode,
                  'itemId': this.catalog.catalogItem[x].item.itemId,
                  'itemName': this.catalog.catalogItem[x].item.itemName,
                  'itemNameInLocal': this.catalog.catalogItem[x].item.itemNameInLocal,
                  'promotionalPrcnt': this.catalog.catalogItem[x].item.promotionalPrcnt,
                  'showPrice': this.catalog.catalogItem[x].item.showPrice,
                  'showPromotionalPrice': this.catalog.catalogItem[x].item.showPromotionalPrice,
                  'taxable': this.catalog.catalogItem[x].item.taxable,
                  'itemDesc': this.catalog.catalogItem[x].item.itemDesc,
                  'itemType': this.catalog.catalogItem[x].item.itemType,
                  'notes': [],
                  'price': this.catalog.catalogItem[x].item.price,
                  'promotionalPriceType': this.catalog.catalogItem[x].item.promotionalPriceType,
                  'shortDesc': this.catalog.catalogItem[x].item.shortDesc,
                  'status': this.catalog.catalogItem[x].item.status,
                }
              });
            }
          }
        }
      }

    })
  }
  myMethod(data) {
    console.log(data);
    // if(data===undefined){
    //   this.catalogItems=[]
    // }

  }

}




