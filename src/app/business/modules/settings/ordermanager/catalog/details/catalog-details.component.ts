import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import {  Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
 import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as moment from 'moment';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy , Image , ButtonType} from 'angular-modal-gallery';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-catalogdetail',
  templateUrl: './catalog-details.component.html'
})
export class CatalogdetailComponent implements OnInit {
  catalog_id;
  rupee_symbol = '₹';
  item_hi_cap = Messages.ITEM_HI_CAP;
  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detailed_dec_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  item_status = projectConstants.ITEM_STATUS;
  detail_desc_cap = Messages.DETAIL_DESC_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  item_detail_cap = Messages.ITEM_DETAIL_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  selitem_pic = '';
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  item_pic = {
      files: [],
      base64: null
  };
  taxpercentage = 0;
  price = 0;
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX6;
  max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
  api_loading = true;
  disableButton = false;
  customer_label;
  action;
  breadcrumbs_init = [
      {
          title: 'Settings',
          url: '/provider/settings'
      },
      {
          title: 'Jaldee Billing',
          url: '/provider/settings/pos'
      },
      {
          title: 'Items',
          url: '/provider/settings/pos/items'
      }
  ];
  breadcrumbs = this.breadcrumbs_init;
  image_list: any = [];
  catalog;
  taxDetails: any = [];
  catalogname: any;
  catalogcaption = 'Add Catalog';
  showPromotionalPrice = false;
  galleryDialog;
  gallery_view_caption = Messages.GALLERY_CAP;
  havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  photo_cap = Messages.SERVICE_PHOTO_CAP;
  delete_btn = Messages.DELETE_BTN;
  removeimgdialogRef;
  startdateError = false;
  enddateError = false;
  preInfoEnabled = false;
  postInfoEnabled = false;
  preInfoText = '';
  postInfoText = '';
  preInfoTitle = '';
  postInfoTitle = '';
  showInfo = false;
    tempPreInfoEnabled = false;
    tempPostInfoEnabled = false;
    tempPreInfoText = '';
    tempPostInfoText = '';
    tempPreInfoTitle = '';
    tempPostInfoTitle = '';
    public Editor = DecoupledEditor;
    seletedCatalogItems = [];
    Selall = false;
    selday_arr: any = [];
    Selallstorepickup  = false;
    selday_arrstorepickup: any = [];
    Selallhomedelivery = false;
    selday_arrhomedelivery: any = [];
  weekdays = projectConstants.myweekdaysSchedule;
  select_All = Messages.SELECT_ALL;
  holdloc_list: any = [];
  loc_list: any = [];
  selected_location;
  selected_locationId;
  //itemPriceInfo = true;
  advancePaymentStat = false;
  cancelationPolicyStatus = true;
  advancePayment;
  showpolicy = false;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  dstart_time;
  dend_time;
  dstart_timestore;
  dend_timestore;
  dstart_timehome;
  dend_timehome;
  cataId;
  image_list_popup: Image[];
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
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

  constructor(private provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private activated_route: ActivatedRoute,
    public fed_service: FormMessageDisplayService) {
      this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
      this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
      this.dstart_timestore = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
      this.dend_timestore = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
      this.dstart_timehome = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
      this.dend_timehome = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
      this.activated_route.params.subscribe(
        (params) => {
            this.catalog_id = params.id;
            this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
            if (this.catalog_id) {
                if (this.catalog_id === 'add') {
                    this.action = 'add';
                    this.createForm();
                } else {
                    this.activated_route.queryParams.subscribe(
                        (qParams) => {
                            this.action = qParams.action;
                            this.cataId = this.catalog_id;
                            this.getItem(this.catalog_id).then(
                                (catalog) => {
                                    this.catalog = catalog;
                                    this.catalogname = this.catalog.displayName;
                                    if (this.action === 'edit') {
                                        this.createForm();
                                    } else if (this.action === 'view') {
                                        this.catalogcaption = 'Catalog Details';
                                    }
                                }
                            );
                        }
                    );
                }
                this.api_loading = false;
                this.getProviderLocations();
            }
        }
    );
     }

  ngOnInit() {
    this.seletedCatalogItems = this.sharedfunctionObj.getitemfromLocalStorage('selecteditems');
    console.log(this.seletedCatalogItems);
    // this.createForm();
    // this.api_loading = false;
  }
  addItemstoCart() {
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs' , 'add', 'items']);
  }
  getItem(itemId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
        _this.provider_services.getProviderItems(itemId)
            .subscribe(
                data => {
                    resolve(data);
                },
                () => {
                    reject();
                }
            );
    });
}
goBack() {
    this.router.navigate(['provider', 'settings', 'ordermanager',
        'catalogs']);
    this.api_loading = false;
}
createForm() {
     if (this.action === 'add') {
        this.amForm = this.fb.group({
          catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
          catalogdays: [],
          startdate: [''],
          enddate: [''],
          qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
          qendtime: [this.dend_time, Validators.compose([Validators.required])],
            orderType: [],
            itemPriceInfo: [true],
            advancePaymentStatus: [false],
            advancePayment: [''],
            cancelationPolicyStatus: [true],
            cancelationPolicy: [''],
            storepickup: [false],
            storepickupdays: [],
            startdatestore: [''],
            enddatestore: [''],
            qstarttimestore: [this.dstart_timestore, Validators.compose([Validators.required])],
            qendtimestore: [this.dend_timestore, Validators.compose([Validators.required])],
            storeotpverify: [false],
            homedelivery: [false],
            homedeliverydays: [],
            startdatehome: [''],
            enddatehome: [''],
            qstarttimehome: [this.dstart_timehome, Validators.compose([Validators.required])],
            qendtimehome: [this.dend_timehome, Validators.compose([Validators.required])],
            homeotpverify: [false],
            deliverykms: [''],
            deliverycharge: ['']
                  });
        this.amForm.get('orderType').setValue('SHOPPINGCART');
    } else {
      this.amForm = this.fb.group({
        catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
        catalogdays: [],
        startdate: [''],
        enddate: [''],
        qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
        qendtime: [this.dend_time, Validators.compose([Validators.required])],
          orderType: [],
          itemPriceInfo: [true],
          advancePaymentStatus: [false],
          advancePayment: [''],
          cancelationPolicyStatus: [true],
          cancelationPolicy: [''],
          storepickup: [false],
          storepickupdays: [],
          startdatestore: [''],
          enddatestore: [''],
          qstarttimestore: [this.dstart_timestore, Validators.compose([Validators.required])],
          qendtimestore: [this.dend_timestore, Validators.compose([Validators.required])],
          storeotpverify: [false],
          homedelivery: [false],
          homedeliverydays: [],
          startdatehome: [''],
          enddatehome: [''],
          qstarttimehome: [this.dstart_timehome, Validators.compose([Validators.required])],
          qendtimehome: [this.dend_timehome, Validators.compose([Validators.required])],
          homeotpverify: [false],
          deliverykms: [''],
          deliverycharge: ['']
                });
    }
    if (this.action === 'edit') {
        this.catalogcaption = 'Edit Catalog';
        this.updateForm();
    }
}
setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
}
lostDescFocus() {
    this.isfocused = false;
}
setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
}
handleadvancePayment(event) {
  if (event.checked) {
    this.advancePaymentStat = true;
  } else {
    this.advancePaymentStat = false;
  }
  console.log(event);

}
compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.amForm.get('startdate').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
        if (new Date(UserDate) < new Date(l)) {
            return this.startdateError = true;
        }
        return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
        if (new Date(UserDate) < new Date(l2)) {
            return this.enddateError = true;
        }
        return this.enddateError = false;
    }
}
compareDatestore(dateValue, startOrend) {
  const UserDate = dateValue;
  this.startdateError = false;
  this.enddateError = false;
  const ToDate = new Date().toString();
  const l = ToDate.split(' ').splice(0, 4).join(' ');
  const sDate = this.amForm.get('startdatestore').value;
  const sDate1 = new Date(sDate).toString();
  const l2 = sDate1.split(' ').splice(0, 4).join(' ');
  if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
          return this.startdateError = true;
      }
      return this.startdateError = false;
  } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
          return this.enddateError = true;
      }
      return this.enddateError = false;
  }
}

compareDatehome(dateValue, startOrend) {
  const UserDate = dateValue;
  this.startdateError = false;
  this.enddateError = false;
  const ToDate = new Date().toString();
  const l = ToDate.split(' ').splice(0, 4).join(' ');
  const sDate = this.amForm.get('startdatehome').value;
  const sDate1 = new Date(sDate).toString();
  const l2 = sDate1.split(' ').splice(0, 4).join(' ');
  if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
          return this.startdateError = true;
      }
      return this.startdateError = false;
  } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
          return this.enddateError = true;
      }
      return this.enddateError = false;
  }
}

updateForm() {
    console.log(this.catalog);
    const sttime = {
      hour: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('mm'), 10)
    };
    const edtime = {
      hour: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('mm'), 10)
    };
    this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
    this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
    this.selday_arr = [];
    // extracting the selected days
    for (let j = 0; j < this.catalog.catalogSchedule.repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arr.push(Number(this.catalog.catalogSchedule.repeatIntervals[j]));
    }
    if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
    const sttimestore = {
      hour: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('mm'), 10)
    };
    const edtimestore = {
      hour: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('mm'), 10)
    };
    this.dstart_timestore = sttimestore; // moment(sttime, ['h:mm A']).format('HH:mm');
    this.dend_timestore = edtimestore; // moment(edtime, ['h:mm A']).format('HH:mm');
    this.selday_arrstorepickup = [];
    // extracting the selected days
    for (let j = 0; j < this.catalog.pickUp.pickUpSchedule.repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arrstorepickup.push(Number(this.catalog.pickUp.pickUpSchedule.repeatIntervals[j]));
    }
    if (this.selday_arrstorepickup.length === 7) {
      this.Selallstorepickup = true;
    } else {
      this.Selallstorepickup = false;
    }

    const sttimehome = {
      hour: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].sTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].sTime,
        ['h:mm A']).format('mm'), 10)
    };
    const edtimehome = {
      hour: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        ['h:mm A']).format('HH'), 10),
      minute: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        ['h:mm A']).format('mm'), 10)
    };
    this.dstart_timehome = sttimehome; // moment(sttime, ['h:mm A']).format('HH:mm');
    this.dend_timehome = edtimehome; // moment(edtime, ['h:mm A']).format('HH:mm');
    this.selday_arrhomedelivery = [];
    // extracting the selected days
    for (let j = 0; j < this.catalog.homeDelivery.deliverySchedule.repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arrhomedelivery.push(Number(this.catalog.homeDelivery.deliverySchedule.repeatIntervals[j]));
    }
    if (this.selday_arrhomedelivery.length === 7) {
      this.Selallhomedelivery = true;
    } else {
      this.Selallhomedelivery = false;
    }
  



    let status;
    if (this.catalog.paymentType === 'FIXED') {
      status = true;
    } else {
      status = false;
    }
    this.amForm.setValue({
        'catalogName': this.catalog.catalogName || '',
        'catalogshortDesc': this.catalog.catalogshortDesc || '',
        'catalogDesc': this.catalog.catalogDesc || '',
          'startdate': this.catalog.catalogSchedule.startDate || '',
          'enddate': this.catalog.catalogSchedule.terminator.endDate || '',
          'qstarttime': sttime,
          'qendtime': edtime,
            'orderType': this.catalog.orderType,
            'itemPriceInfo': this.catalog.showPrice,
            'advancePaymentStatus': status,
            'advancePayment': this.catalog.advanceAmount || '',
            'cancelationPolicy': this.catalog.cancellationPolicy,
            'storepickup': this.catalog.pickUp.orderPickUp,
            'startdatestore': this.catalog.pickUp.orderPickUp.startDate || '',
            'enddatestore': this.catalog.pickUp.orderPickUp.terminator.endDate || '',
            'qstarttimestore': sttimestore,
            'qendtimestore': edtimestore,
            'storeotpverify': this.catalog.pickUp.pickUpOtpVerification,
            'homedelivery': this.catalog.homeDelivery.homeDelivery,
            'startdatehome': this.catalog.homeDelivery.deliverySchedule.startDate || '',
            'enddatehome': this.catalog.homeDelivery.deliverySchedule.terminator.endDate || '',
            'qstarttimehome': sttimehome,
            'qendtimehome': edtimehome,
            'homeotpverify': this.catalog.homeDelivery.deliveryOtpVerification || '',
            'deliverykms': this.catalog.homeDelivery.deliveryRadius || '',
            'deliverycharge': this.catalog.homeDelivery.deliveryCharge || ''
    });
}

showimg() {
    if (this.item_pic.base64) {
        return this.item_pic.base64;
    } else {
        return this.sharedfunctionObj.showitemimg('');
    }
}

handleDaychecbox(dayindx) {
    const selindx = this.selday_arr.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arr.push(dayindx);
    } else {
      this.selday_arr.splice(selindx, 1);
    }
    if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
  }

  handleselectall() {
    this.Selall = true;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecbox(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnone() {
    this.Selall = false;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
  check_existsinArray(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }
  
  handleDaychecboxstorepickup(dayindx) {
    const selindx = this.selday_arrstorepickup.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arrstorepickup.push(dayindx);
    } else {
      this.selday_arrstorepickup.splice(selindx, 1);
    }
    if (this.selday_arrstorepickup.length === 7) {
      this.Selallstorepickup = true;
    } else {
      this.Selallstorepickup = false;
    }
  }
  handleselectallstorepickup() {
    this.Selallstorepickup = true;
    this.selday_arrstorepickup = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecboxstorepickup(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnonestorepickup() {
    this.Selallstorepickup = false;
    this.selday_arrstorepickup = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
  check_existsinArraystorepickup(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }
  handleDaychecboxhomedelivery(dayindx) {
    const selindx = this.selday_arrhomedelivery.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arrhomedelivery.push(dayindx);
    } else {
      this.selday_arrhomedelivery.splice(selindx, 1);
    }
    if (this.selday_arrhomedelivery.length === 7) {
      this.Selallhomedelivery = true;
    } else {
      this.Selallhomedelivery = false;
    }
  }
  handleselectallhomedelivery() {
    this.Selallhomedelivery = true;
    this.selday_arrhomedelivery = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecboxhomedelivery(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnonehomedelivery() {
    this.Selallhomedelivery = false;
    this.selday_arrhomedelivery = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
  check_existsinArrayhomedelivery(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }


  changetime(src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_time = passtime;
        break;
      case 'end':
        this.dend_time = passtime;
        break;
    }
  }
  changestoretime(src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_timestore = passtime;
        break;
      case 'end':
        this.dend_timestore = passtime;
        break;
    }
  }
  changehometime(src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_timehome = passtime;
        break;
      case 'end':
        this.dend_timehome = passtime;
        break;
    }
  }
onCancel() {
    this.router.navigate(['provider', 'settings', 'ordermanager',
        'catalogs']);
    this.api_loading = false;
}
addcancelpolicy() {
  if (this.showpolicy === false) {
    this.showpolicy = true;
  } else {
    this.showpolicy = false;
  }

}
onSubmit(form_data) {
    const daystr: any = [];
      for (const cday of this.selday_arr) {
        daystr.push(cday);
      }
      if (this.selday_arr.length === 0) {
        const error = 'Please select the days';
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
      }
      let endDate;
      const startDate = this.convertDate(form_data.startdate);
      if (form_data.enddate) {
        endDate = this.convertDate(form_data.enddate);
      } else {
        endDate = '';
      }
       // check whether the start and end times are selected
       if (!this.dstart_time || !this.dend_time) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelclass': 'snackbarerror' });
        return;
      }
      // today
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelclass': 'snackbarerror' });
        return;
      }
      const curdate = new Date();
      curdate.setHours(this.dstart_time.hour);
      curdate.setMinutes(this.dstart_time.minute);
      const enddate = new Date();
      enddate.setHours(this.dend_time.hour);
      enddate.setMinutes(this.dend_time.minute);
      const starttime_format = moment(curdate).format('hh:mm A') || null;
      const endtime_format = moment(enddate).format('hh:mm A') || null;

      //store pickup
      const storedaystr: any = [];
      for (const cday of this.selday_arrstorepickup) {
        storedaystr.push(cday);
      }
      if (this.selday_arrstorepickup.length === 0) {
        const error = 'Please select the storepickup days';
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
      }
      let storeendDate;
      const storestartDate = this.convertDate(form_data.startdatestore);
      if (form_data.enddatestore) {
        storeendDate = this.convertDate(form_data.enddatestore);
      } else {
        storeendDate = '';
      }

       // check whether the start and end times are selected
       if (!this.dstart_timestore || !this.dend_timestore) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelclass': 'snackbarerror' });
        return;
      }
      // today
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_timestore) > this.sharedfunctionObj.getminutesOfDay(this.dend_timestore)) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelclass': 'snackbarerror' });
        return;
      }
      const curdatestore = new Date();
      curdatestore.setHours(this.dstart_timestore.hour);
      curdatestore.setMinutes(this.dstart_timestore.minute);
      const enddatestore = new Date();
      enddatestore.setHours(this.dend_timestore.hour);
      enddatestore.setMinutes(this.dend_timestore.minute);
      const starttime_formatstore = moment(curdatestore).format('hh:mm A') || null;
      const endtime_formatstore = moment(enddatestore).format('hh:mm A') || null;

      //home delivery
      const homedaystr: any = [];
      for (const cday of this.selday_arrhomedelivery) {
        homedaystr.push(cday);
      }
      if (this.selday_arrhomedelivery.length === 0) {
        const error = 'Please select the storepickup days';
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
      }
      let homeendDate;
      const homestartDate = this.convertDate(form_data.startdatehome);
      if (form_data.enddatehome) {
        homeendDate = this.convertDate(form_data.enddatehome);
      } else {
        homeendDate = '';
      }
       // check whether the start and end times are selected
       if (!this.dstart_timehome || !this.dend_timehome) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelclass': 'snackbarerror' });
        return;
      }
      // today
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_timehome) > this.sharedfunctionObj.getminutesOfDay(this.dend_timehome)) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelclass': 'snackbarerror' });
        return;
      }
      const curdatehome = new Date();
      curdatehome.setHours(this.dstart_timehome.hour);
      curdatehome.setMinutes(this.dstart_timehome.minute);
      const enddatehome= new Date();
      enddatehome.setHours(this.dend_timehome.hour);
      enddatehome.setMinutes(this.dend_timehome.minute);
      const starttime_formathome = moment(curdatehome).format('hh:mm A') || null;
      const endtime_formathome = moment(curdatehome).format('hh:mm A') || null;
      let payAdvance;
      if (form_data.advancePaymentStatus === 'true') {
        payAdvance = 'FIXED';
      } else {
        payAdvance = 'NONE';
      }
   
       
        const postdata = {
            'catalogName': form_data.catalogName,
            'catalogDesc':  form_data.catalogDesc,
            'catalogSchedule': {
              'recurringType': 'Weekly',
              'repeatIntervals': daystr,
              'startDate': startDate,
              'terminator': {
                'endDate': endDate,
                'noOfOccurance': 0
              },
              'timeSlots': [
                {
                  'sTime': starttime_format,
                  'eTime': endtime_format
                }
              ]
            },
            'catalogStatus': 'ACTIVE',
            'orderType': form_data.orderType,
            'pickUp': {
              'orderPickUp': true,
              'pickUpSchedule': {
                'recurringType': 'Weekly',
                'repeatIntervals': storedaystr,
                'startDate': storestartDate,
                'terminator': {
                  'endDate': storeendDate,
                  'noOfOccurance': 0
                },
                'timeSlots': [
                  {
                    'sTime': starttime_formatstore,
                    'eTime': endtime_formatstore
                  }
                ]
              },
              'pickUpOtpVerification': form_data.storeotpverify,
              'pickUpScheduledAllowed': true,
              'pickUpAsapAllowed': false
            },
            'homeDelivery': {
              'homeDelivery': true,
              'deliverySchedule': {
                'recurringType': 'Weekly',
                'repeatIntervals': homedaystr,
                'startDate': homestartDate,
                'terminator': {
                  'endDate': homeendDate,
                  'noOfOccurance': 0
                },
                'timeSlots': [
                  {
                    'sTime': starttime_formathome,
                    'eTime': endtime_formathome
                  }
                ]
              },
              'deliveryOtpVerification': form_data.homeotpverify,
              'deliveryRadius': form_data.deliverykms,
              'scheduledHomeDeliveryAllowed': true,
              'asapHomeDeliveryAllowed': false,
              'deliveryCharge': form_data.deliverycharge
            },
            'showPrice': form_data.itemPriceInfo,
            'paymentType': payAdvance,
            'advanceAmount': form_data.advancePayment,
            'preInfo': {
              'preInfoEnabled': this.preInfoEnabled,
              'preInfoTitle': this.preInfoEnabled ? this.preInfoTitle.trim() : '',
              'preInfoText': this.preInfoEnabled ? this.preInfoText : ''
            },
            'postInfo': {
              'postInfoEnabled': this.postInfoEnabled,
              'postInfoTitle': this.postInfoEnabled ? this.postInfoTitle.trim() : '',
              'postInfoText': this.postInfoEnabled ? this.postInfoText : ''
            },
            'catalogItem': this.seletedCatalogItems,
            'location': {
              'id': this.selected_locationId
            },
            'cancellationPolicy': form_data.cancelationPolicy
          };
          if (this.action === 'add') {
           this.addCatalog(postdata);
           console.log(postdata);
            } else if (this.action === 'edit') {
            this.editCatalog(postdata);
    }
}
addCatalog(post_data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.addCatalog(post_data)
        .subscribe(
            (data) => {
              if (this.selectedMessage.files.length > 0) {
                this.saveImages(data);
              }
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('CATALOG_CREATED'));
                this.api_loading = false;
                this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
            },
            error => {
                this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
}
editCatalog(post_itemdata) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    post_itemdata.itemId = this.catalog.itemId;
    this.provider_services.editCatalog(post_itemdata)
        .subscribe(
            () => {
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('CATALOG_UPDATED'));
                this.api_loading = false;
                this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
            },
            error => {
                this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
}
convertDate(date?) {
    // let today;
    let mon;
    let cdate;
    if (date) {
      cdate = new Date(date);
    } else {
      cdate = new Date();
    }
    mon = (cdate.getMonth() + 1);
    if (mon < 10) {
      mon = '0' + mon;
    }
    return (cdate.getFullYear() + '-' + mon + '-' + cdate.getDate());
  }
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(data => {
        this.holdloc_list = data;
        this.loc_list = [];
        for (let i = 0; i < this.holdloc_list.length; i++) {
          if (this.holdloc_list[i].status === 'ACTIVE') {
            this.loc_list.push(this.holdloc_list[i]);
          }
        }
        // if (this.queue_data) {
        //   this.loc_name = this.queue_data.location.place;
        // } else if (this.loc_list.length === 1) {
        //   this.loc_name = this.loc_list[0];
        // }
        if (this.action === 'add') {
          this.selected_location = this.loc_list[0];
          this.selected_locationId = this.loc_list[0].id;
        }
        // if (this.action === 'add' && this.params.source === 'location_detail' && this.params.locationId) {
        //   this.selected_locationId = this.params.locationId;
        // } else 
        if (this.action === 'add' && this.loc_list.length === 1) {
          // this.amForm.get('qlocation').setValue(this.loc_list[0].id);
          this.selected_locationId = this.loc_list[0].id;
        }
      });

  }
resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
}
isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
}
isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
}
redirecToJaldeeOrdrmnagrCatalog() {
    this.router.navigate(['provider', 'settings', 'ordermanager' , 'catalogs']);
}
showInfoSection() {
    if (!this.showInfo) {
        this.tempPreInfoEnabled = this.preInfoEnabled;
        this.tempPreInfoText = this.preInfoText;
        this.tempPreInfoTitle = this.preInfoTitle;
        this.tempPostInfoEnabled = this.postInfoEnabled;
        this.tempPostInfoText = this.postInfoText;
        this.tempPostInfoTitle = this.postInfoTitle;
        this.showInfo = true;
       // this.sharedfunctionObj.sendMessage({ 'ttype': 'hide-back' });
    } else {
        if (this.preInfoEnabled && this.preInfoTitle.trim() === '') {
            this.sharedfunctionObj.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
        } else if (this.postInfoEnabled && this.postInfoTitle.trim() === '') {
            this.sharedfunctionObj.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
        } else {
            this.showInfo = false;
           // this.sharedfunctionObj.sendMessage({ 'ttype': 'show-back' });
        }
    }
}

cancelChanges() {
    this.preInfoEnabled = this.tempPreInfoEnabled;
    this.preInfoText = this.tempPreInfoText;
    this.preInfoTitle = this.tempPreInfoTitle;
    this.postInfoEnabled = this.tempPostInfoEnabled;
    this.postInfoText = this.tempPostInfoText;
    this.postInfoTitle = this.tempPostInfoTitle;
    this.showInfo = false;
    //this.sharedfunctionObj.sendMessage({ 'ttype': 'show-back' });
}
public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
    editor.getData();

}

saveImages(id) {
  const submit_data: FormData = new FormData();
  const propertiesDetob = {};
  let i = 0;
  for (const pic of this.selectedMessage.files) {
    console.log(pic);
    submit_data.append('files', pic, pic['name']);
    const properties = {
      'caption': this.selectedMessage.caption[i] || ''
    };
    propertiesDetob[i] = properties;
    i++;
  }
  const propertiesDet = {
    'propertiesMap': propertiesDetob
  };
  const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
  submit_data.append('properties', blobPropdata);
  this.provider_services.uploadCatalogImages(id, submit_data).subscribe((data) => {
  this.sharedfunctionObj.openSnackBar('Image uploaded successfully');
   },
  error => {
    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
  });
}


openImageModalRow(image: Image) {
  console.log(image);
  console.log(this.image_list_popup[0]);
  const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
  this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
}
private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
  return image ? images.indexOf(image) : -1;
}
onButtonBeforeHook() {
}
onButtonAfterHook() { }

imageSelect(event) {
    console.log('sel');
  const input = event.target.files;
  if (input) {
    for (const file of input) {
      if (projectConstants.IMAGE_FORMATS.indexOf(file.type) === -1) {
        this.sharedfunctionObj.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
      } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
        this.sharedfunctionObj.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
      } else {
        this.selectedMessage.files.push(file);
        console.log(this.selectedMessage.files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedMessage.base64.push(e.target['result']);
          this.image_list_popup = [];
          for (let i = 0; i < this.selectedMessage.files.length; i++) {
          const imgobj = new Image(i,
            { img: this.selectedMessage.base64[i],
              description: ''
            });
          this.image_list_popup.push(imgobj);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    if (this.cataId && this.selectedMessage.files.length > 0) {
      this.saveImages(this.cataId);
    }
  }
}

deleteTempImage(img, index) {
  this.removeimgdialogRef = this.dialog.open(ConfirmBoxComponent, {
    width: '50%',
    panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
    disableClose: true,
    data: {
      'message': 'Do you really want to remove the catalog image?'
    }
  });
  this.removeimgdialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (img.view && img.view === true) {
        this.provider_services.deleteUplodedCatalogImage(img.keyName, this.catalog_id)
          .subscribe((data) => {
            this.selectedMessage.files.splice(index, 1);
          },
            error => {
              this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
      } else {
        this.selectedMessage.files.splice(index, 1);
        this.selectedMessage.base64.splice(index, 1);
        this.image_list_popup.splice(index, 1);
      }
    }
  });
}

}
