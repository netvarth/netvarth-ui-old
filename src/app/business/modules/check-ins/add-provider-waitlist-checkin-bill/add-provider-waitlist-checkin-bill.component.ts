import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { ConfirmPaymentBoxComponent } from '../../../../ynw_provider/shared/component/confirm-paymentbox/confirm-paymentbox.component';
import { ActivatedRoute } from '@angular/router';
import { JcCouponNoteComponent } from '../../../../ynw_provider/components/jc-Coupon-note/jc-Coupon-note.component';
import { ConfirmPatmentLinkComponent } from '../../../../ynw_provider/shared/component/confirm-paymentlink/confirm-paymentlink.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
// import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

export interface ItemServiceGroup {
  type: string;
  values: string[];
}

@Component({
  selector: 'app-provider-waitlist-checkin-bill',
  templateUrl: './add-provider-waitlist-checkin-bill.component.html',
  styleUrls: ['../../../../../assets/css/style.bundle.css', './add-provider-waitlist-checkin-bill.component.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})

export class AddProviderWaitlistCheckInBillComponent implements OnInit {
  paynot = '';
  tooltipcls = '';
  new_cap = Messages.NEW_CAP;
  bill_cap = Messages.BILL_CAPTION;
  date_cap = Messages.SYS_ALERTS_DATE_CAP;
  time_cap = Messages.TIME_CAP;
  bill_no_cap = Messages.BILL_NO_CAP;
  gstin_cap = Messages.GSTIN_CAP;
  ad_ser_item_cap = Messages.ADD_SER_ITEM_CAP;
  no_cap = Messages.NO_CAP;
  available_cap = Messages.AVAILABLE_CAP;
  qty_cap = Messages.QTY_CAPITAL_CAP;
  add_btn_cap = Messages.ADD_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;
  qnty_cap = Messages.QTY_CAP;
  select_discount_cap = Messages.SEL_DISC_CAP;
  select_coupon_cap = Messages.SEL_COUPON_CAP;
  select_jcoupon_cap = Messages.SEL_JCOUPON_CAP;
  done_btn_cap = Messages.DONE_BTN;
  discount_cap = Messages.DISCOUNT_CAP;
  coupon_cap = Messages.COUPON_CAP;
  sub_tot_cap = Messages.SUB_TOT_CAP;
  dis_coupons_cap = Messages.DISCOUNTS_COUPONS_CAP;
  delete_btn_cap = Messages.DELETE_BTN;
  gross_amnt_cap = Messages.AMOUNT_CAP;
  bill_disc_cap = Messages.BILL_DISCOUNT_CAP;
  tax_cap = Messages.TAX_CAP;
  amount_paid_cap = Messages.AMNT_PAID_CAP;
  amount_to_pay_cap = Messages.AMNT_TO_PAY_CAP;
  nettotal_cap = Messages.NETTOTAL;
  apply_cap = Messages.APPLY_CAP;
  value_cap = Messages.VALUE_CAP;
  back_to_bill_cap = Messages.BACK_TO_BILL_CAP;
  amountdue_cap = Messages.AMOUNTDUE;
  back_cap = Messages.BACK_CAP;
  payment_logs_cap = Messages.PAY_LOGS_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  status_cap = Messages.PAY_STATUS;
  mode_cap = Messages.MODE_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  save_btn_cap = Messages.SAVE_BTN;
  settle_bill_cap = Messages.SETTLE_BILL_CAP;
  print_bill_cap = Messages.PRINT_BILL_CAP;
  accept_payment_cap = Messages.ACCEPT_PAY_CAP;
  make_payment_cap = Messages.MAKE_PAYMENT_CAP;
  applydiscount_cap = Messages.APPLY_DISCOUNT;
  changeqty_cap = Messages.CHANGE_QTY;
  removeservice_cap = Messages.REMOVE_SERVICE;
  removeitem_cap = Messages.REMOVE_ITEM;
  coupon_notes = projectConstants.COUPON_NOTES;
  paybycash_cap = Messages.PAYBYCASH;
  paybyothers_cap = Messages.PAYBYOTHERS;
  paybycashothers_cap = Messages.PAYBYCASH_OTHERS;
  jaldeepay_cap = Messages.JALDEEPAY;
  email_bill_cap = Messages.EMAILBILL;
  wbamount_cap = Messages.WBAMOUNT;
  apply_jc_cap = Messages.APPLYJC;
  applyorderdisc_cap = Messages.APPLYORDERDISC;
  applycoupon_cap = Messages.APPLYCOUPON;
  notesfor_cap = Messages.NOTESFOR;
  privatenote_cap = Messages.PROVIDER_NOTE_CAP;
  price_limit = projectConstants.PRICE_MAX_VALUE;
  qty_limit = projectConstants.QTY_MAX_VALUE;
  add_display_note = Messages.ADD_DISPLAY_NOTE;
  add_private_note = Messages.ADD_PRIVATE_NOTE;
  add_note_btn = Messages.ADD_NOTE_CAP;
  update_display_note = Messages.UPDATE_DISPLAY_NOTE;
  update_private_note = Messages.UPDATE_PRIVATE_NOTE;
  update_note_btn = Messages.UPDATE_NOTE;
  @ViewChild('itemservicesearch') item_service_search;
  @ViewChild('itemserviceqty') item_service_qty;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin = null;
  bill_data: any = [];
  message = '';
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  timeFormat = 'h:mm a';
  itemServiceSearch: FormControl = new FormControl();
  services: any = [];
  all_services: any = [];
  coupons: any = [];
  discounts: any = [];
  itemdiscounts: any = [];
  items: any = [];
  totdisc_val = 0;
  totcoup_val = 0;
  isServiceBillable = true;
  showAddItemsec = false;
  showmainDiscSelsec = false;
  taxabletotal = 0;
  tottaxvalue = 0;
  totpaid = 0;
  curSelItm = { indx: 0, typ: '', qty: 1, price: 0 };
  bname;
  selectedItemService;
  showPaidlist = false;
  actiontype;
  isCheckin;
  jaldeeCoupon;
  ItemServiceGroupOptions: Observable<ItemServiceGroup[]>;
  itemServicesGroup: ItemServiceGroup[] = [{
    'type': 'Services',
    'values': []
  },
  {
    'type': 'Items',
    'values': []
  }];
  pay_data = {
    'uuid': null,
    'acceptPaymentBy': 'cash',
    'amount': 0,
    'paymentNote': ''
  };
  selectedItems = [];
  bill_load_complete = 0;
  item_service_tax: any = 0;
  pre_payment_log: any = [];
  refund_value;

  customer_label = '';
  billdate = '';
  billtime = '';
  gstnumber = '';
  billnumber = '';
  showDiscountSection;
  showPCouponSection;
  showJCouponSection;
  showDisplaynoteSection;
  showPrivatenoteSection;
  showAddItemMenuSection = true;
  jCoupon;
  selOrderProviderCoupon: any = '';
  selOrderDiscount: any = '';
  selOrderProviderjCoupon: any = '';
  discAmount = '';
  discProvNote = '';
  discConsNote = '';
  billDisplayNote = '';
  billPrivateNote = '';
  isConsNote = false;
  isProvNote = false;
  displayNoteedit = false;
  privateNoteedit = false;
  displaybuttondisabled = true;
  privatebuttondisabled = true;
  uuid;
  jCouponsList: any = [];
  makPaydialogRef;
  qty = '';
  breadcrumbs = [];
  showPayWorkBench = false;
  amountpay;
  paymentOnline = false;
  couponLoaded: number;
  disableButton = false;
  disableDiscountbtn = false;
  disableCouponbtn = false;
  disableitembtn = false;
  disableJCouponbtn = false;
  jcMessages: any[];
  showBillNotes = false;
  billNotesExists = false;
  discountPrivateNotes = false;
  discountDisplayNotes = false;
  changedDate;
  abc: any;
  isService;
  mode;
  isItem;
  source;
  pos = false;
  emailId: any;
  settings: any = [];
  showToken = false;
  spname: any;
  provider_label: any;
  mobilenumber: any;
  jaldeeConsumer: any;
  showRefundSection = false;
  amounttoRefund = '';
  selectedPayment;
  showDeliveryChargeSection = false;
  deliveryCharge = 0;
  discountClicked = false;
  discountId_servie: any;
  discountid;
  applydisc = false;
  walkinConsumer_status = false;
  @ViewChild('closebutton') closebutton;
  @ViewChild('itemdiscountapply') itemdiscountapply;
  @ViewChild('itemserviceqtynew') itemserviceqtynew;
  @ViewChild('closeJcDiscPc') closeJcDiscPc;
  @ViewChild('closenotesdialog') closenotesdialog;
  @ViewChild('closeDelivery') closeDelivery;
  discount_type: any = '';
  selectedservice: any;
  selectedItem: any;
  refund_show;
  btn_hide = false;
  is_policy = false;
  location: any;


  constructor(
    private dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    public sharedfunctionObj: SharedFunctions,
    private locationobj: Location,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    // private dateTimeProcessor: DateTimeProcessor,
    @Inject(DOCUMENT) public document
  ) {
    this.activated_route.params.subscribe(params => {
      this.uuid = params.id;
    });
    this.activated_route.queryParams.subscribe(qparams => {
      this.source = qparams.source;
      if (this.source === 'appt') {
        this.breadcrumbs = [
          {
            title: 'Appointments',
            url: '/provider/appointments'
          },
          {
            title: 'Bill'
          }
        ];
        this.getApptDetails();
      } else if (this.source === 'order') {
        this.ad_ser_item_cap = 'Add Item';
        this.getOrderDetails();
      } else {
        this.breadcrumbs = [
          {
            title: 'Check-ins',
            url: '/provider/check-ins'
          },
          {
            title: 'Bill'
          }
        ];
        this.getCheckinDetails();
      }
    });
  }
  ngOnInit() {
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    this.getPaymentSettings();
    this.getPos();
    this.getJaldeeActiveCoupons();
    this.getCoupons();
    this.getDiscounts();
    this.getServiceList();
    this.getItemsList();
    this.getDomainSubdomainSettings()
      .then(
        () => {
          this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        }
      );
    this.bill_load_complete = 1;
    this.getProviderSettings();
    this.getJaldeeIntegrationSettings();
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }
  selectChangeHandler(event: any) {
    this.discountId_servie = event;
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        if (this.source === 'appt') {
          this.breadcrumbs = [
            {
              title: 'Appointments',
              url: '/provider/appointments'
            },
            {
              title: 'Bill'
            }
          ];
          this.getApptDetails();
        } else if (this.source === 'order') {
          this.getOrderDetails();
        } else {
          if (this.showToken) {
            this.breadcrumbs = [
              {
                title: 'Tokens',
                url: '/provider/check-ins'
              },
              {
                title: 'Bill'
              }
            ];
            this.getCheckinDetails();
          } else {
            this.breadcrumbs = [
              {
                title: 'Check-ins',
                url: '/provider/check-ins'
              },
              {
                title: 'Bill'
              }
            ];
            this.getCheckinDetails();
          }
        }
      }, () => {
      });
  }
  gotoPrev() {
    this.locationobj.back();
  }
  getJaldeeActiveCoupons() {
    this.jCouponsList = [];
    let couponList: any = [];
    this.provider_services.getJaldeeCoupons()
      .subscribe(
        (list) => {
          couponList = list;
          for (let index = 0; index < couponList.length; index++) {
            if (couponList[index].couponState === 'ENABLED') {
              this.jCouponsList.push(couponList[index]);
            }
          }
        });
  }

  getOrderDetails() {
    this.provider_services.getProviderOrderById(this.uuid)
      .subscribe(
        data => {
          this.checkin = data;
          console.log(JSON.stringify(this.checkin));
          this.jaldeeConsumer = this.checkin.jaldeeConsumer ? true : false;
          this.emailId = this.checkin.email;
          this.mobilenumber = this.checkin.phoneNumber;
          this.getWaitlistBill();
          this.getPrePaymentDetails()
            .then(
              () => {
                this.bill_load_complete = 1;
              },
              () => {
                this.bill_load_complete = 0;
              }
            );
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getApptDetails() {
    this.provider_services.getAppointmentById(this.uuid)
      .subscribe(
        data => {
          this.checkin = data;
          this.jaldeeConsumer = this.checkin.consumer ? true : false;
          this.emailId = this.checkin.providerConsumer.email;
          this.mobilenumber = this.checkin.phoneNumber;
          this.getWaitlistBill();
          this.getPrePaymentDetails()
            .then(
              () => {
                this.bill_load_complete = 1;
              },
              () => {
                this.bill_load_complete = 0;
              }
            );
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }

  getCheckinDetails() {
    this.provider_services.getProviderWaitlistDetailById(this.uuid)
      .subscribe(
        data => {
          this.checkin = data;
          this.jaldeeConsumer = this.checkin.jaldeeConsumer ? true : false;
          this.mobilenumber = this.checkin.waitlistPhoneNumber,
            this.emailId = this.checkin.waitlistingFor[0].email;
          this.getWaitlistBill();
          this.getPrePaymentDetails()
            .then(
              () => {
                this.bill_load_complete = 1;
              },
              () => {
                this.bill_load_complete = 0;
              }
            );
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getUserName(user) {
    let userDetails = '';
    if (user.firstName && user.firstName !== null && user.firstName !== undefined && user.firstName !== '') {
      userDetails = user.firstName +' '+ user.lastName;
    } else {
      if (user.memberJaldeeId) {
        userDetails = 'Patient id : ' + user.memberJaldeeId;
      }
      if (user.jaldeeId) {
        userDetails = 'Patient id : ' + user.jaldeeId;
      }
    }
    return userDetails;
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
  filterGroup(val: string): ItemServiceGroup[] {
    if (val) {
      return this.itemServicesGroup
        .map(group => ({ type: group.type, values: this._filter(group.values, val) }))
        .filter(group => group.values.length > 0);
    }
    return this.itemServicesGroup;
  }
  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
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

  getWaitlistBill() {
    this.provider_services.getWaitlistBill(this.uuid)
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
          if (this.bill_data.accountProfile.location && this.bill_data.accountProfile.location.place) {
            this.location = this.bill_data.accountProfile.location.place;
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
  getDomainSubdomainSettings() {
    const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(user_data);
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    return new Promise<void>((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
        .subscribe(
          (data: any) => {
            if (data.serviceBillable === false) {
              this.isServiceBillable = false;
              reject();
            } else {
              this.isServiceBillable = true;
              resolve();
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getServiceList() {
    this.provider_services.getServicesList()
      .subscribe(
        (data: any) => {
          this.all_services = data;
          for (const ser of data) {
            if (ser.status === 'ACTIVE' && ser.serviceType !== 'donationService') {
              this.services.push(ser);
            }
          }
          const services = this.services.map((ob) => ob.name);
          if (this.source !== 'order') {
            this.itemServicesGroup[0]['values'] = services;
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCoupons() {
    return new Promise<void>((resolve, reject) => {
      this.provider_services.getProviderCoupons()
        .subscribe(
          data => {
            this.coupons = data;
            this.coupons = this.coupons.filter(obj => obj.status === 'ACTIVE');
            resolve();
          },
          error => {
            this.coupons = [];
          }
        );
    });
  }
  getDiscounts() {
    return new Promise<void>((resolve, reject) => {
      this.provider_services.getProviderDiscounts()
        .subscribe(
          data => {
            this.discounts = data;
            this.itemdiscounts = Array.from(this.discounts);
            this.itemdiscounts.splice(0, 1);
            resolve();
          },
          error => {
            this.discounts = [];
          }
        );
    });
  }

  getItemsList() {
    this.provider_services.getProviderItems()
      .subscribe(
        (data: any) => {
          for (const ser of data) {
            if (ser.status === 'ACTIVE') {
              this.items.push(ser);
            }
          }
          const itemslist = this.items.map((ob) => ob.displayName);
          this.itemServicesGroup[1]['values'] = itemslist;
        },
        error => {
          this.items.push(null);
        }
      );
  }

  getPrePaymentDetails() {
    return new Promise<void>((resolve, reject) => {
      let uid;
      if (this.source === 'appt' || this.source === 'order') {
        uid = this.checkin.uid;
      } else {
        uid = this.checkin.ynwUuid;
      }
      this.provider_services.getPaymentDetail(uid)
        .subscribe(
          data => {
            this.pre_payment_log = data;
            this.refund_show = this.pre_payment_log.filter(obj => (obj.refundableAmount > 0) && (obj.status === 'SUCCESS') && (!obj.fullyRefunded) && (obj.paymentPurpose == 'prePayment'));
            resolve();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });

            reject(error);
          }
        );
    });
  }
  getIndexFromId(array, id) {
    let index = '';
    array
      .map((ob, i) => {
        if (ob.id === id) {
          index = i;
        }
      });
    return index;
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
      }
      return retval;
    } else {
      return;
    }
  }
  showAddItem() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = true;
    this.actiontype = null;
    this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterGroup(val))
      );
    setTimeout(() => {
      this.item_service_search.nativeElement.focus();
    }, 500);
  }
  hideAddItem() {
    this.actiontype = null;
    this.showAddItemsec = false;
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1, price: 0 };
  }
  getAddedServcOrItem(name) {
    if (name) {
      this.isService = false;
      this.isItem = false;
      for (let i = 0; i < this.all_services.length; i++) {
        if (this.all_services[i].name === name) {
          this.isService = true;
          break;
        }
      }
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].displayName === name) {
          this.isItem = true;
          break;
        }
      }
    }
  }

  /**
   * Returns Service Id
   * @param serviceName Service Name
   */
  getSelectedServiceId(serviceName) {
    let serviceId = 0;
    for (let i = 0; i < this.all_services.length; i++) {
      if (this.all_services[i].name === serviceName) {
        serviceId = this.all_services[i].id;
        break;
      }
    }
    return serviceId;
  }
  /**
   * Return Item Id
   * @param itemName Item Name
   */
  getSelectedItemId(itemName) {
    let itemId = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].displayName === itemName) {
        itemId = this.items[i].itemId;
        break;
      }
    }
    return itemId;
  }
  getSelectedServicePrice(serviceName) {
    let servicePrice = 0;
    for (let i = 0; i < this.all_services.length; i++) {
      if (this.all_services[i].name === serviceName) {
        servicePrice = this.all_services[i].totalAmount;
        break;
      }
    }
    return servicePrice;
  }
  getSelectedItemPrice(itemName) {
    let itemPrice = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].displayName === itemName) {
        itemPrice = (this.items[i].showPromotionalPrice) ? this.items[i].promotionalPrice : this.items[i].price;
        break;
      }
    }
    return itemPrice;
  }
  /**
   * Toggle Item Discount/Coupon Section
   * @param indx Index
   */
  itemDiscCoupSec(indx, item?) {
    this.selectedItem = item
    this.bill_data.items[indx].itemDiscount = '';
    if (this.bill_data.items[indx]) {
      if (this.bill_data.items[indx].showitemdisccoup) {
        this.bill_data.items[indx].showitemdisccoup = false;
      } else {
        this.bill_data.items[indx].showitemdisccoup = true;
        this.disableitembtn = false;
      }
    }
  }
  /**
   * Toggle Service Discount/Coupon section
   * @param indx Index
   */
  serviceDiscCoupSec(indx, service?) {
    this.selectedservice = service;
    this.bill_data.service[indx].serviceDiscount = '';
    if (this.bill_data.service[indx]) {
      if (this.bill_data.service[indx].showservicedisccoup) {
        this.bill_data.service[indx].showservicedisccoup = false;
      } else {
        this.bill_data.service[indx].showservicedisccoup = true;
        this.disableButton = false;
      }
    }
  }
  showpaidSection() {
    if (this.showPaidlist) {
      this.showPaidlist = false;
    } else {
      this.showPaidlist = true;
    }
  }
  blurQty(val, itm) {
    if (isNaN(val) || val < 0) {
      itm.qty = 1;
    } else {
      const vv = parseInt(val, 10);
      itm.qty = vv;
    }
  }
  showDeliveryCharge() {
    this.showDiscountSection = false;
    this.disableDiscountbtn = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDeliveryChargeSection = true;
  }
  orderDiscountSelected() {
    this.showDiscountSection = true;
    this.disableDiscountbtn = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDeliveryChargeSection = false;
    this.selOrderDiscount='';
  }
  orderPCouponSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = true;
    this.disableCouponbtn = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDeliveryChargeSection = false;
    this.selOrderProviderCoupon='';
  }
  jCouponSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = true;
    this.disableJCouponbtn = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDeliveryChargeSection = false;
    this.selOrderProviderjCoupon='';
  }

  disaplynoteSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDisplaynoteSection = true;
    this.showPrivatenoteSection = false;
    this.showDeliveryChargeSection = false;
  }

  privatenoteSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
    this.showDisplaynoteSection = false;
    this.showPrivatenoteSection = true;
    this.showDeliveryChargeSection = false;
  }

  itemServiceManualAdd(type, name) {
    if (type === '') {
      this.getAddedServcOrItem(name.value);
      if (this.isService) {
        type = 'Services';
      } else if (this.isItem) {
        type = 'Items';
      }
      this.itemServiceSelected(type, name.value);
    }
  }
  /**
   * Set Item/Service
   * @param type Category Services/Items
   * @param name Service/Item Name
   */
  itemServiceSelected(type, name) {

    this.curSelItm = { indx: 0, typ: '', qty: 1, price: 0 };

    if (type === 'Services') {
      this.selectedItemService = name;
      this.curSelItm.indx = this.getSelectedServiceId(name);
      this.curSelItm.typ = 'Services';
      this.curSelItm.qty = 1;
      this.curSelItm.price = this.getSelectedServicePrice(name);
    } else if (type === 'Items') {
      this.selectedItemService = name;
      this.curSelItm.indx = this.getSelectedItemId(name);
      this.curSelItm.typ = 'Items';
      this.curSelItm.qty = 1;
      this.curSelItm.price = this.getSelectedItemPrice(name);
    }
  }
  /**
   * Perform Bill Actions
   * @param action Action Type
   * @param uuid Bill Id
   * @param data Data to be sent as request body
   */
  applyAction(action, uuid, data, closecheck?) {
    return new Promise<void>((resolve, reject) => {
      if (uuid) {
        this.provider_services.setWaitlistBill(action, uuid, data, { 'Content-Type': 'application/json' }).subscribe
          (billInfo => {
            this.bill_data = billInfo;
            this.getPrePaymentDetails();
            this.hideWorkBench();
            this.actiontype = null;
            this.curSelItm.typ = 'Services';
            this.curSelItm.qty = 1;
            this.getWaitlistBill();
            resolve();
            if (closecheck === 'applyitemDisc') {
              this.closeGroupDialogitem();
            } else if (closecheck === 'closeJcDiscPc') {
              this.closeGroupDialogcoupons();
            } else if (closecheck === 'noteclose') {
              this.closeGroupnotesdialog();
            } else if (closecheck === 'delivery') {
              this.closeGroupdelivery();
            }
            else {
              this.closeGroupDialog();
            }

          },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              this.disableButton = false;
              this.disableDiscountbtn = false;
              this.disableCouponbtn = false;
              this.disableitembtn = false;
              this.disableJCouponbtn = false;
              reject(error);
            });
      }
    });
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  isNumber(evt) {
    return this.sharedfunctionObj.isNumber(evt);
  }
  isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
  }
  /**
   * Add/Adjust Service/Item to the Bill
   */
  addService_Item() {
    const type = this.curSelItm.typ;
    const itemId = this.curSelItm.indx;
    let action = this.actiontype;
    if (type === 'Services' && action === null) {
      action = 'addService';
    } else if (action === null) {
      action = 'addItem';
    }
    if (isNaN(this.curSelItm.qty)) {
      this.curSelItm.qty = 1;
    }
    const data = {};
    if (type === 'Services') {
      data['serviceId'] = itemId;
      data['quantity'] = this.curSelItm.qty;
      if (this.curSelItm.qty === 0) {
        action = 'removeService';
      }
      // if (this.actiontype !== 'adjustService') {
      data['price'] = this.curSelItm.price;
      // }
    } else if (type === 'Items') {
      data['itemId'] = itemId;
      data['quantity'] = this.curSelItm.qty;
      // if (this.actiontype !== 'adjustItem') {
      data['price'] = this.curSelItm.price;
      // }
      if (this.curSelItm.qty === 0) {
        action = 'removeItem';
      }
    }
    if (this.bill_data.uuid) {
      this.provider_services.setWaitlistBill(action, this.bill_data.uuid, data, null).subscribe
        (billInfo => {
          this.bill_data = billInfo;
          this.itemserviceqtynew.nativeElement.click();
          this.hideAddItem();
          this.getWaitlistBill();
        }, error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    }
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1, price: 0 };
  }
  /**
   * Remove a particular Service from the bill
   * @param id Service Id
   * @param qty Service Quantity
   */
  removeService(id, qty) {
    const action = 'removeService';
    const data = {};
    data['quantity'] = qty;
    data['serviceId'] = id;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Adjust Service Qty (show the Workbench)
   * @param name of service
   * @param qty service qty
   */
  adjustService(name, qty) {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showDeliveryChargeSection = false;
    this.showAddItemsec = true;
    this.showAddItemMenuSection = true;
    this.itemServiceSelected('Services', name);
    this.itemServiceSearch.setValue(name);
    this.curSelItm.qty = qty;
    this.actiontype = 'adjustService';
    setTimeout(() => {
      this.item_service_qty.nativeElement.focus();
    }, 500);
    // this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Adjust Item Qty (show the Workbench)
   * @param name item name
   * @param qty item qty
   */
  adjustItem(name, qty) {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showDeliveryChargeSection = false;
    this.showAddItemsec = true;
    this.itemServiceSelected('Items', name);
    this.itemServiceSearch.setValue(name);
    this.curSelItm.qty = qty;
    this.actiontype = 'adjustItem';
    setTimeout(() => {
      this.item_service_qty.nativeElement.focus();
    }, 500);

    // this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove an Item from the Bill
   * @param id Item Id
   * @param qty Item Quantity
   */
  removeItem(id, qty) {
    const action = 'removeItem';
    const data = {};
    data['quantity'] = qty;
    data['itemId'] = id;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Apply Service Level Discount
   * @param service Service Details
   */


  applyServiceDiscount(service) {
    const action = 'addServiceLevelDiscount';
    const discountIds = [];
    discountIds.push(this.discountId_servie);
    // discountIds.push(service.serviceDiscount.id);
    const data = {};
    // data['serviceId'] = service.serviceId;
    // data['discountIds'] = discountIds;
    data['serviceId'] = this.selectedservice.serviceId;
    data['discountIds'] = discountIds;
    this.disableButton = true;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove Service Level Discount
   * @param serviceId Service Id
   * @param discountId Discount Id
   */
  removeServiceDiscount(serviceId, discountId) {
    const action = 'removeServiceLevelDiscount';
    const discountIds = [];
    discountIds.push(discountId);
    const data = {};
    data['serviceId'] = serviceId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove Item Level Discount
   * @param itemId Item Id
   * @param discountId Discount Id
   */
  removeItemDiscount(itemId, discountId) {
    const action = 'removeItemLevelDiscount';
    const discountIds = [];
    discountIds.push(discountId);
    const data = {};
    data['itemId'] = itemId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Apply Item Level Discount
   * @param item Item
   */
  applyItemDiscount(item) {
    const action = 'addItemLevelDiscount';
    const discountIds = [];
    discountIds.push(this.discountId_servie);
    // discountIds.push(item.itemDiscount.id);
    const data = {};
    // data['itemId'] = item.itemId;
    data['itemId'] = this.selectedItem.itemId;
    data['discountIds'] = discountIds;
    this.disableitembtn = true;
    this.applyAction(action, this.bill_data.uuid, data, 'applyitemDisc');
  }

  addDisplaynote() {
    const action = 'addDisplayNotes';
    const data = {};
    data['displayNotes'] = this.billDisplayNote;
    this.applyAction(action, this.bill_data.uuid, data, 'noteclose');
    this.displayNoteedit = true;
  }

  addPrivatenote() {
    const action = 'addPrivateNotes';
    const data = {};
    data['privateNotes'] = this.billPrivateNote;
    this.applyAction(action, this.bill_data.uuid, data, 'noteclose');
    this.privateNoteedit = true;
  }

  handledisplaykeyup() {
    if (this.billDisplayNote === '') {
      this.displaybuttondisabled = true;
    } else {
      this.displaybuttondisabled = false;
    }
  }

  handleprivatekeyup() {
    if (this.billPrivateNote === '') {
      this.privatebuttondisabled = true;
    } else {
      this.privatebuttondisabled = false;
    }
  }


  /**
   * Remove Jaldee Coupon
   * @param jCouponCode Coupon Code
   */
  removeJCoupon(jCouponCode) {
    const action = 'removeJaldeeCoupons';
    let jaldeeCoupon: string;
    jaldeeCoupon = '"' + jCouponCode + '"';
    this.applyAction(action, this.bill_data.uuid, jaldeeCoupon);
  }
  /**
   * Remove Order Level Discounts
   * @param discount Discount Info
   */
  removeOrderDiscount(discount) {
    const action = 'removeBillLevelDiscount';
    const discountIds = [];
    const discountObj = {};
    discountObj['id'] = discount.id;
    discountIds.push(discountObj);
    const data = {};
    data['id'] = this.bill_data.id;
    data['discounts'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
    this.discountDisplayNotes = false;
    this.discountPrivateNotes = false;
  }
  /**
   * Remove Provider Coupons
   * @param coupon Coupon Info
   */
  removeProviderCoupon(couponCode) {
    const action = 'removeProviderCoupons';
    let coupon: string;
    coupon = '"' + couponCode + '"';
    this.applyAction(action, this.bill_data.uuid, coupon);
  }
  hideWorkBench() {
    this.jCoupon = '';
    this.showJCouponSection = false;
    this.showDiscountSection = false;
    this.showDeliveryChargeSection = false;
    this.showPCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = true;
    this.showDisplaynoteSection = false;
    this.showPrivatenoteSection = false;
    this.discAmount = '';
    this.discProvNote = '';
    this.discConsNote = '';
    if (this.bill_data.displayNotes) {
      this.billDisplayNote = this.bill_data.displayNotes.displayNotes;
    } else {
      this.billDisplayNote = '';
      this.displaybuttondisabled = true;
    }
    if (this.bill_data.privateNotes) {
      this.billPrivateNote = this.bill_data.privateNotes.privateNotes;
    } else {
      this.billPrivateNote = '';
      this.privatebuttondisabled = true;
    }
  }

  applyDeliveryCharge() {
    const data = { 'deliveryCharges': this.deliveryCharge };
    this.applyAction('updateDeliveryCharges', this.bill_data.uuid, data, 'delivery');
  }
  applyOrderDiscount() {
    const action = 'addBillLevelDiscount';
    const data = {};
    data['id'] = this.bill_data.id;
    const discounts = [];
    const discount = {};
    discount['id'] = this.selOrderDiscount;
    // discount['id'] = this.selOrderDiscount.id;
    // applyOrderDiscount
    if (this.discount_type.discType === 'OnDemand') {
      console.log(this.discAmount);
     
      // const len = this.discAmount.split('.').length;
      // if (len > 2) {
      //   this.snackbarService.openSnackBar('Please enter valid discount amount', { 'panelClass': 'snackbarerror' });
      // } else {
      //   discount['discValue'] = this.discAmount;
      // }
      
      if (this.discAmount) {
        discount['discValue'] = this.discAmount;
      }
      if(!this.discAmount){
        this.snackbarService.openSnackBar('Please enter valid discount amount', { 'panelClass': 'snackbarerror' });
      }

    }
    if (this.discProvNote) {
      discount['privateNote'] = this.discProvNote;
    }
    if (this.discConsNote) {
      discount['displayNote'] = this.discConsNote;
    }
    discounts.push(discount);
    data['discounts'] = discounts;
    this.disableDiscountbtn = true;
    if ((this.discount_type.discType === 'OnDemand' && discount['discValue']) || this.discount_type.discType !== 'OnDemand') {
      this.applyAction(action, this.bill_data.uuid, data, 'closeJcDiscPc');
      this.discount_type  = '';
    } else {
      this.disableDiscountbtn = false;
    }
  }
  applyOrderCoupon() {
    const action = 'addProviderCoupons';
    let couponCode: string;
    couponCode = '"' + this.selOrderProviderCoupon + '"';
    this.disableCouponbtn = true;
    this.applyAction(action, this.bill_data.uuid, couponCode, 'closeJcDiscPc');
  }
  /**
  * Apply Jaldee Coupon
  * @param jCoupon Coupon Code
  */
  applyJCoupon() {
    const action = 'addJaldeeCoupons';
    let jaldeeCoupon: string;
    // jaldeeCoupon = '"' + jCoupon.jaldeeCouponCode + '"';    
    jaldeeCoupon = '"' + this.selOrderProviderjCoupon + '"';
    this.disableJCouponbtn = true;
    this.applyAction(action, this.bill_data.uuid, jaldeeCoupon, 'closeJcDiscPc');
  }

  initPayment(mode, amount, paynot) {
    let len;
    if (typeof amount === 'string') {
      len = amount.split('.').length;
    }
    if (len > 2) {
      this.snackbarService.openSnackBar('Please enter valid amount', { 'panelClass': 'snackbarerror' });
    } else {
      let status = 0;
      const canceldialogRef = this.dialog.open(ConfirmPaymentBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Proceed with payment ?',
          'heading': 'Confirm',
          'type': 'yes/no',
          'status': this.checkin.waitlistStatus
        }
      });
      canceldialogRef.afterClosed().subscribe(result => {
        status = result;
        if (status === 1) {
          this.makePayment(mode, amount, paynot);
        }
        if (status === 2) {
          this.makePayment(mode, amount, paynot, status);
        }
      });
    }
  }
  showPayment() {
    this.amountpay = this.bill_data.amountDue.toFixed(2);
    this.showPayWorkBench = true;
  }
  hidePayWorkBench() {
    this.showPayWorkBench = false;
  }
  makePayment(mode, amount, paynot?, status?) {
    if (this.source === 'appt' || this.source === 'order') {
      this.pay_data.uuid = this.checkin.uid;
    } else {
      this.pay_data.uuid = this.checkin.ynwUuid;
    }
    this.pay_data.acceptPaymentBy = mode;
    this.pay_data.amount = amount;
    this.pay_data.paymentNote = paynot;

    this.provider_services.acceptPayment(this.pay_data)
      .subscribe(
        data => {
          this.paynot = '';
          if (this.pay_data.acceptPaymentBy === 'self_pay') {
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT_SELFPAY);
          } else {
            if (status === 2) {
              if (this.source === 'appt') {
                this.getApptDetails();
              } else if (this.source === 'order') {
                this.getOrderDetails();
              } else {
                this.getCheckinDetails();
              }
              this.provider_shared_functions.changeWaitlistStatus(this, this.checkin, 'DONE');
            }
            this.hidePayWorkBench();
            this.getWaitlistBill();
            this.getPrePaymentDetails();
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          // this.loadApiSwitch(result);
        }
      );
  }

  // checkAmount(evt) {
  //   if (evt.which !== 8 && evt.which !== 0 &&
  //     ((evt.which < 48 || evt.which > 57) &&
  //       (evt.which < 96 || evt.which > 105) && (evt.which !== 110)) ||
  //     isNaN(this.amountpay) || this.amountpay < 0) {
  //     evt.preventDefault();
  //   }
  // }
  settleBill() {
    this.provider_services.settleWaitlistBill(this.uuid)
      .subscribe(
        () => {
          this.getWaitlistBill();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  confirmSettleBill(amount) {
    if (amount.amountDue > 0 || this.bill_data.amountDue < 0) {
      let msg = '';
      // if (this.bill_data.amountDue < 0) {
      //   msg = 'Do you really want to settle the bill which is in refund status, this will be moved to paid status once settled';
      // } else {
      msg = this.wordProcessor.getProjectMesssages('PROVIDER_BILL_SETTLE_CONFIRM');
      // }
      const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': msg,
          'type': 'yes/no'
        }
      });
      dialogrefd.afterClosed().subscribe(result => {
        if (result) {
          this.settleBill();
        }
      });
    } else {
      this.settleBill();
    }
  }
  paymentlink() {
    this.dialog.open(ConfirmPatmentLinkComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        emailId: this.emailId,
        mobilenumber: this.mobilenumber,
        uuid: this.uuid
      }
    });
  }

  changeDate(time) {
    const r = time.match(/^\s*([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)(.*)$/);
    return r[3] + '-' + r[2] + '-' + r[1] + r[4];
  }

  emailBill() {
    this.provider_services.emailWaitlistBill(this.uuid)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_EMAIL);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  /**
   * To Print Receipt
   */
  printMe() {
    // window.print();
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    let bill_html = '';
    bill_html += '<table width="100%">';
    bill_html += '<tr><td	style="text-align:center;font-weight:bold; color:#000000; font-size:11pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-bottom:10px;">' + this.checkin.providerAccount['businessName'] + '</td></tr>';
    bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
    bill_html += '<table width="100%">';
    bill_html += '	<tr style="line-height:20px">';
    if (!this.source) {
      bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName + '</td>';
    } else if (this.source === 'appt') {
      bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.appmtFor[0].firstName + ' ' + this.checkin.appmtFor[0].lastName + '</td>';
    } else {
      bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.orderFor.firstName + ' ' + this.checkin.orderFor.lastName + '</td>';
    }
    bill_html += '<td width="50%"	style="text-align:right;color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.changedDate + '</td>';
    bill_html += '	</tr>';
    bill_html += '	<tr>';
    bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Bill # ' + this.bill_data.billId + '</td>';
    bill_html += '<td style="text-align:right;color:#000000; font-size:10pt;font-family:Ubuntu, Arial,sans-serif;">';
    if (this.bill_data.gstNumber) {
      bill_html += 'GSTIN ' + this.bill_data.gstNumber;
    }
    bill_html += '</td>';
    bill_html += '	</tr>';
    bill_html += '	<tr>';
    // if (this.source === 'order') {
    //   bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Order Id ' + this.checkin.orderNumber + '</td>';
    // }
    bill_html += '	</tr>';
    bill_html += '</table>';
    bill_html += '	</td></tr>';
    for (const service of this.bill_data.service) {
      bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
      bill_html += '	<tr >';
      bill_html += '<td width="50%"';
      bill_html += '	style="text-align:left;font-weight:bold;">';
      bill_html += service.serviceName + ' &#x20b9;' + parseFloat(service.price).toFixed(2);
      if (service.getGSTpercentage > 0) {
        bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
      }
      bill_html += '</td>';
      bill_html += '<td width="20%"';
      bill_html += '	style="text-align:right">Qty ' + service.quantity;
      bill_html += '</td>';
      bill_html += '<td width="30%"';
      bill_html += '	style="text-align:right">&#x20b9;' + (service.quantity * service.price).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      // List<Discount> serviceDisounts = mapper.readValue(service.getDiscount().toString(), new TypeReference<List<Discount>>(){});
      if (service.discount && service.discount.length > 0) {
        for (const serviceDiscount of service.discount) {
          bill_html += '	<tr style="color:#aaa">';
          bill_html += '<td style="text-align:right;"';
          bill_html += '	colspan="2">' + serviceDiscount.name + '</td>';
          bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(serviceDiscount.discountValue).toFixed(2);
          bill_html += '</td>';
          bill_html += '	</tr>';
        }
        bill_html += '	<tr style="line-height:0;">';
        bill_html += '<td style="text-align:right" colspan="2"></td>';
        bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd"> </td>';
        bill_html += '	</tr>';
        bill_html += '	<tr style="font-weight:bold">';
        bill_html += '<td style="text-align:right"colspan="2">Sub Total</td>';
        bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(service.netRate).toFixed(2) + '</td>';
        bill_html += '	</tr>';
      }
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    for (const item of this.bill_data.items) {
      bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
      bill_html += '	<tr>';
      bill_html += '<td width="50%" style="text-align:left;font-weight:bold;">' + item.itemName + '  &#x20b9;' + parseFloat(item.price).toFixed(2);
      if (item.GSTpercentage > 0) {
        bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
      }
      bill_html += '</td>';
      bill_html += '<td width="20%" style="text-align:right">Qty ' + item.quantity + '</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + (item.quantity * item.price).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      // List<Discount> itemDiscounts = mapper.readValue(item.getDiscount().toString(), new TypeReference<List<Discount>>(){};
      if (item.discount && item.discount.length > 0) {
        for (const itemDiscount of item.discount) {
          bill_html += '	<tr style="color:#aaa">';
          bill_html += '<td style="text-align:right" colspan="2">' + itemDiscount.name + '</td>';
          bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(itemDiscount.discountValue).toFixed(2) + '</td>';
          bill_html += '	</tr>';
        }
        bill_html += '	<tr style="line-height:0;">';
        bill_html += '<td style="text-align:right" colspan="2"></td>';
        bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd">Ã‚Â </td>';
        bill_html += '	</tr>';
        bill_html += '	<tr style="font-weight:bold">';
        bill_html += '<td style="text-align:right" colspan="2">Sub Total</td>';
        bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(item.netRate).toFixed(2) + '</td>';
        bill_html += '	</tr>';
      }
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    bill_html += '	<tr><td>';
    bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:5px">                                                                             ';
    bill_html += '	<tr style="font-weight: bold">';
    bill_html += '<td width="70%" style="text-align:right">Gross Amount</td>';
    bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netTotal).toFixed(2) + '</td>';
    bill_html += '	</tr>                                                                           ';
    bill_html += '</table>';
    bill_html += '	</td></tr>';

    if (this.bill_data.jdn && this.bill_data.jdn.discount) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">JDN</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(this.bill_data.jdn.discount).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }

    // List<Discount> billDisounts = mapper.readValue(bill.getDiscount().toString(), new TypeReference<List<Discount>>(){});
    for (const billDiscount of this.bill_data.discount) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">' + billDiscount.name + '</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(billDiscount.discValue).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    // List<Coupon> providerCoupons = mapper.readValue(bill.getProviderCoupon().toString(), new TypeReference<List<Coupon>>(){});
    if (this.bill_data.providerCoupon) {
   // for (const providerCoupon of this.bill_data.providerCoupon) {
    for (const [key, value] of Object.entries(this.bill_data.providerCoupon)) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt;  font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">' +  key + '</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
  }
    // List<JaldeeCoupon> jCoupons = new ArrayList<>();
    // if(bill.getjCoupon()!=null) {
    // 	jCoupons = mapper.readValue(bill.getjCoupon().toString(), new TypeReference<List<JaldeeCoupon>>(){});
    // }
    if (this.bill_data.jCoupon) {
      for (const [key, value] of Object.entries(this.bill_data.jCoupon)) {
        bill_html += '	<tr><td>';
        bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
        bill_html += '	<tr style="color:#aaa">';
        bill_html += '<td width="70%" style="text-align:right">' + key + ' (Jaldee Coupon)</td>';
        bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
        bill_html += '	</tr>                                                                           ';
        bill_html += '</table>';
        bill_html += '	</td></tr>';
      }
    }
    if (this.bill_data && this.bill_data.taxPercentage && this.bill_data.taxableTotal !== 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr>';
      bill_html += '<td width="70%" style="text-align:right">Tax ' + this.bill_data.taxPercentage + ' % of &#x20b9;' + parseFloat(this.bill_data.taxableTotal).toFixed(2) + '(CGST-' + (this.bill_data.taxPercentage / 2) + '%, SGST-' + (this.bill_data.taxPercentage / 2) + '%)</td>';
      bill_html += '<td width="30%" style="text-align:right">(+) &#x20b9;' + parseFloat(this.bill_data.totalTaxAmount).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.netRate > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;">';
      bill_html += '<td width="70%" style="text-align:right">Net Total</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netRate).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.totalAmountPaid > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;">';
      bill_html += '<td width="70%" style="text-align:right">Amount Paid</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.totalAmountPaid).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.amountDue >= 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Amount Due</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.amountDue).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.amountDue < 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Amount to refund</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.refund_value).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.refundedAmount > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Amount refunded</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.refundedAmount).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    bill_html += '</table>';
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(bill_html);
    printWindow.document.write('</body></html>');
    printWindow.moveTo(0, 0);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
  showJCCouponNote(coupon) {
    if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
    } else {
      if (coupon.value.value === '0.0') {
        this.dialog.open(JcCouponNoteComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'jcouponmessagepopupclass'],
          disableClose: true,
          data: {
            jCoupon: coupon
          }
        });
      }
    }
  }
  billNotesClicked() {
    if (!this.showBillNotes) {
      this.showBillNotes = true;
    } else {
      this.showBillNotes = false;
    }
  }
  refundPayment(mode) {

    if (this.amounttoRefund) {
      const postData = {
        'refundAmount': this.amounttoRefund,
        'refundBy': mode,
        'paymentRefId': this.selectedPayment.paymentRefId,
        'purpose': 'prePayment'
      };
      if (mode === 'online') {
        postData['paymentId'] = this.selectedPayment.transactionId;
      }
      let status = 0;
      const canceldialogRef = this.dialog.open(ConfirmPaymentBoxComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Proceed with refund ?',
          'heading': 'Confirm',
          'type': 'yes/no'
        }
      });
      canceldialogRef.afterClosed().subscribe(result => {
        this.applydisc = false;
        status = result;
        if (status === 1) {
          this.provider_services.paymentRefund(postData)
            .subscribe(
              () => {
                this.getPrePaymentDetails();
                this.getWaitlistBill();
                this.showRefundSection = false;
                this.amounttoRefund = '';
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        }
      });
    } else {
      this.snackbarService.openSnackBar('Please enter the refund amount', { 'panelClass': 'snackbarerror' });
    }
  }
  showRefund(payment?) {
    if (payment) {
      this.selectedPayment = payment;
      this.amounttoRefund = payment.refundableAmount.toFixed(2);
      this.showRefundSection = true;
    } else {
      this.selectedPayment = [];
      this.showRefundSection = false;
    }
  }

  sampleDiscount() {
    this.discountClicked = true;
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
  }
  closeGroupDialogitem() {
    this.itemdiscountapply.nativeElement.click();
  }
  closeGroupDialogcoupons() {
    this.closeJcDiscPc.nativeElement.click();
  }
  closeGroupnotesdialog() {
    this.closenotesdialog.nativeElement.click();
  }
  closeGroupdelivery() {
    this.closeDelivery.nativeElement.click();
  }
  applyRefund(payment) {
    this.applydisc = true;
    if (payment) {
      this.selectedPayment = payment;
      this.amounttoRefund = payment.refundableAmount.toFixed(2);
      // this.showRefundSection = true;
    } else {
      this.selectedPayment = [];
      // this.showRefundSection = false;
    }
  }
  revokeRefund() {
    this.applydisc = false;
  }
  onChange() {
    const dsic_type = this.discounts.filter(obj => obj.id === JSON.parse(this.selOrderDiscount));
    this.discount_type = dsic_type[0];
  }
  getJaldeeIntegrationSettings() {
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        this.walkinConsumer_status = data.walkinConsumerBecomesJdCons;
      }
    );
  }
  refundBtnShow(value) {
    if (value === 'refund') {
      this.btn_hide = true;
    } else {
      this.btn_hide = false;
    }
  }

  refundPolicy() {
    this.is_policy = true;
  }
  refundBack() {
    this.is_policy = false;
  }

}
