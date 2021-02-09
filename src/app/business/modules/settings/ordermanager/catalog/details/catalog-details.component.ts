import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as moment from 'moment';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { AddcatalogimageComponent } from '../addcatalogimage/addcatalogimage.component';
import { TimewindowPopupComponent } from '../timewindowpopup/timewindowpopup.component';
import { LocalStorageService } from '../../../../../../shared/services/local-storage.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'app-catalogdetail',
    templateUrl: './catalog-details.component.html'
})
export class CatalogdetailComponent implements OnInit {
    catalog_id;
    rupee_symbol = 'â‚¹';
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
    seletedCatalogItems: any;
    catalogItems: any = [];
    Selall = false;
    selday_arr: any = [];
    Selallstorepickup = false;
    selday_arrstorepickup: any = [];
    Selallhomedelivery = false;
    selday_arrhomedelivery: any = [];
    weekdays = projectConstants.myweekdaysSchedule;
    select_All = Messages.SELECT_ALL;
    holdloc_list: any = [];
    loc_list: any = [];
    selected_location;
    selected_locationId;
    itemPriceInfo = true;
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
    storepickupStat = false;
    homedeliveryStat = false;
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
    showadditems = true;
    status: any = projectConstantsLocal.ORDER_STATUS_FILTER;
    // status: any = ['Order Received',
    //     'Order Acknowledged',
    //     'Order Confirmed',
    //     'Preparing',
    //     'Packing',
    //     'Payment Required',
    //     'Ready For Pickup',
    //     'Ready For Shipment',
    //     'Ready For Delivery',
    //     'Completed',
    //     'In Transit',
    //     'Shipped',
    //     'Cancelled'
    // ];
    selectedStatus;
    uploadcatalogImages: any = [];
    payAdvance = 'NONE';
    isFromadd = false;
    prefillData: any = [];
    step = 1;
    item_count = 0;
    item_list: any = [];
    basic = false;
    workinghours = false;
    paymentinformation = true;
    storepickupinfo = false;
    homedeliveryinfo = false;
    addcataimgdialogRef;
    addcatalogimagedialogRef;
    storetimewindow_list: any = [];
    hometimewindow_list: any = [];
    addtimewindowdialogRef;
    constructor(private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private activated_route: ActivatedRoute,
        private wordProcessor: WordProcessor,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
        public fed_service: FormMessageDisplayService) {
        this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
        this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
        this.dstart_timestore = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
        this.dend_timestore = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
        this.dstart_timehome = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
        this.dend_timehome = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
        this.seletedCatalogItems = this.lStorageService.getitemfromLocalStorage('selecteditems');
        console.log(this.seletedCatalogItems);
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.isFromadd = qParams.isFrom;
                if (this.isFromadd) {
                    this.prefillData = this.lStorageService.getitemfromLocalStorage('prefilldata');
                    //  this.prefillData = this.provider_services.getCatalogPrefiledDetails();
                    console.log(this.prefillData);
                }
            });
        this.activated_route.params.subscribe(
            (params) => {
                this.catalog_id = params.id;
                this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
                if (this.catalog_id) {
                    if (this.catalog_id === 'add') {
                        this.action = 'add';
                        this.createForm();
                        this.api_loading = false;
                    } else {
                        this.activated_route.queryParams.subscribe(
                            (qParams) => {
                                this.action = qParams.action;
                                this.cataId = this.catalog_id;
                                this.getCatalog(this.catalog_id).then(
                                    (catalog) => {
                                        this.catalog = catalog;
                                        this.catalogcaption = this.catalog.catalogName;
                                        if (this.catalog.catalogItem) {
                                            this.catalogItems = this.catalog.catalogItem;
                                            console.log(this.catalogItems);
                                           // this.lStorageService.setitemonLocalStorage('selecteditems', this.catalogItems);
                                        }
                                        if (this.action === 'edit') {
                                            this.createForm();
                                            this.api_loading = false;
                                        } else if (this.action === 'view') {
                                            this.catalogcaption = 'Catalog Details';
                                            this.api_loading = false;
                                        }
                                        // if (!this.seletedCatalogItems) {
                                        //     if (this.catalog.catalogItem) {
                                        //         this.seletedCatalogItems = this.catalog.catalogItem;
                                        //         console.log(this.seletedCatalogItems);
                                        //         this.lStorageService.setitemonLocalStorage('selecteditems', this.seletedCatalogItems);
                                        //     }
                                        // }
                                    }
                                );
                            }
                        );
                    }
                    this.getProviderLocations();
                }
            }
        );
    }

    ngOnInit() {
        this.getItems();
    }
    getItems() {
        const apiFilter = {};
    apiFilter['itemStatus-eq'] = 'ACTIVE';
        this.provider_services.getProviderfilterItems(apiFilter)
          .subscribe(data => {
            this.item_list = data;
            this.item_count = this.item_list.length;
          },
            (error) => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
      }

      gotoItems() {
        const navigatExtras: NavigationExtras = {
            queryParams: {
              type: 'ordermanager'
            }
          };
        this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
      }

    setCatalogPrefillfields(form_data) {
        // const daystr: any = [];
        // for (const cday of this.selday_arr) {
        //     daystr.push(cday);
        // }
        let endDate;
        console.log(form_data.startdate);
        const startDate = this.convertDate(form_data.startdate);
        console.log(startDate);
        if (form_data.enddate) {
            endDate = this.convertDate(form_data.enddate);
        } else {
            endDate = '';
        }
        console.log(endDate);
        // const curdate = new Date();
        // curdate.setHours(this.dstart_time.hour);
        // curdate.setMinutes(this.dstart_time.minute);
        // const enddate = new Date();
        // enddate.setHours(this.dend_time.hour);
        // enddate.setMinutes(this.dend_time.minute);
        // const starttime_format = moment(curdate).format('hh:mm A') || null;
        // const endtime_format = moment(enddate).format('hh:mm A') || null;

        //store pickup

        const storedaystr: any = [];
        for (const cday of this.selday_arrstorepickup) {
            storedaystr.push(cday);
        }
        console.log(this.selday_arrstorepickup.length);
        let storeendDate;
        const storestartDate = this.convertDate(form_data.startdatestore);
        if (form_data.enddatestore) {
            storeendDate = this.convertDate(form_data.enddatestore);
        } else {
            storeendDate = '';
        }

        // const curdatestore = new Date();
        // curdatestore.setHours(this.dstart_timestore.hour);
        // curdatestore.setMinutes(this.dstart_timestore.minute);
        // const enddatestore = new Date();
        // enddatestore.setHours(this.dend_timestore.hour);
        // enddatestore.setMinutes(this.dend_timestore.minute);
        // const starttime_formatstore = moment(curdatestore).format('hh:mm A') || null;
        // const endtime_formatstore = moment(enddatestore).format('hh:mm A') || null;

        //home delivery
        const homedaystr: any = [];
        for (const cday of this.selday_arrhomedelivery) {
            homedaystr.push(cday);
        }

        let homeendDate;
        const homestartDate = this.convertDate(form_data.startdatehome);
        if (form_data.enddatehome) {
            homeendDate = this.convertDate(form_data.enddatehome);
        } else {
            homeendDate = '';
        }
        // check whether the start and end times are selected

        // const curdatehome = new Date();
        // curdatehome.setHours(this.dstart_timehome.hour);
        // curdatehome.setMinutes(this.dstart_timehome.minute);
        // const enddatehome = new Date();
        // enddatehome.setHours(this.dend_timehome.hour);
        // enddatehome.setMinutes(this.dend_timehome.minute);
        // const starttime_formathome = moment(curdatehome).format('hh:mm A') || null;
        // const endtime_formathome = moment(enddatehome).format('hh:mm A') || null;


        let seltedimg = [];
        let seltedimgpopup = [];
        let seltedimgbase = [];
        if (this.selectedMessage.files.length > 0) {
            seltedimg = this.selectedMessage.files;
        }
        console.log(seltedimg);
        if (this.image_list_popup) {
            seltedimgpopup = this.image_list_popup;
        }
        console.log(seltedimgpopup);
        if (this.selectedMessage.base64.length > 0) {
            seltedimgbase = this.selectedMessage.base64;
        }
        console.log(seltedimgbase);

        const postdata = {
            'catalogName': form_data.catalogName || '',
            'catalogDesc': form_data.catalogDesc || '',
            'catalogSchedule': {
                'repeatIntervals': [1, 2, 3, 4, 5, 6, 7],
                'startDate': startDate || '',
                'terminator': {
                    'endDate': endDate || ''
                },
                'timeSlots': [
                    {
                        'sTime': '12:01 AM',
                        'eTime': '11:59 PM'
                    }
                ]
            },
            'orderType': form_data.orderType,
            'orderStatuses': form_data.orderStatuses,
            'pickUp': {
                'orderPickUp': form_data.storepickup,
                'pickUpSchedule': {
                    'repeatIntervals': storedaystr || [],
                    'startDate': storestartDate || '',
                    'terminator': {
                        'endDate': storeendDate || ''
                    },
                    'timeSlots': this.storetimewindow_list
                    //  [
                    //     {
                    //         'sTime': starttime_formatstore,
                    //         'eTime': endtime_formatstore
                    //     }
                    // ]
                }
               // 'pickUpOtpVerification': form_data.storeotpverify,
            },
            'homeDelivery': {
                'homeDelivery': form_data.homedelivery,
                'deliverySchedule': {
                    'repeatIntervals': homedaystr || [],
                    'startDate': homestartDate || '',
                    'terminator': {
                        'endDate': homeendDate || ''
                    },
                    'timeSlots': this.hometimewindow_list
                    // [
                    //     {
                    //         'sTime': starttime_formathome,
                    //         'eTime': endtime_formathome
                    //     }
                    // ]
                },
              //  'deliveryOtpVerification': form_data.homeotpverify,
                'deliveryRadius': form_data.deliverykms || '',
                'deliveryCharge': form_data.deliverycharge || ''
            },
            'showPrice': form_data.itemPriceInfo,
            'paymentType': this.payAdvance,
            'advanceAmount': form_data.advancePayment ? form_data.advancePayment : 0,
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
            'cancellationPolicy': form_data.cancelationPolicy,
            'image': seltedimg || [],
            'imagepop': seltedimgpopup || [],
            'imagebase64': seltedimgbase || []
        };
        console.log(postdata);
        this.lStorageService.setitemonLocalStorage('prefilldata', postdata);
        //  this.provider_services.setCatalogPrefilledDetails(postdata);
    }

    addItemstoCart(type, data) {
        console.log(data);
        console.log(type);
        this.setCatalogPrefillfields(data);
        const navigationExtras: NavigationExtras = {
            queryParams: {
                action: type,
                id: this.catalog_id || 0
            }
        };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add', 'items'], navigationExtras);
    }
    getCatalog(cataId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderCatalogs(cataId)
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
                catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                startdate: [''],
                enddate: [''],
               // qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
              //  qendtime: [this.dend_time, Validators.compose([Validators.required])],
                orderType: [],
                orderStatuses: [''],
               itemPriceInfo: [true],
                advancePaymentStatus: [],
                advancePayment: [''],
                cancelationPolicyStatus: [true],
                cancelationPolicy: [''],
                storepickup: [false],
                startdatestore: [''],
                enddatestore: [''],
               // qstarttimestore: [this.dstart_timestore, Validators.compose([Validators.required])],
              //  qendtimestore: [this.dend_timestore, Validators.compose([Validators.required])],
              //  storeotpverify: [false],
                homedelivery: [false],
                startdatehome: [''],
                enddatehome: [''],
               // qstarttimehome: [this.dstart_timehome, Validators.compose([Validators.required])],
               // qendtimehome: [this.dend_timehome, Validators.compose([Validators.required])],
               // homeotpverify: [false],
                deliverykms: [''],
                deliverycharge: ['']
            });
            this.amForm.get('orderType').setValue('SHOPPINGCART');
           const dt = new Date();
           dt.setFullYear(dt.getFullYear() + 2);
            this.amForm.get('startdate').setValue(new Date());
         this.amForm.get('enddate').setValue(dt);
                    console.log(dt);
            this.amForm.get('startdatestore').setValue(new Date());
            this.amForm.get('startdatehome').setValue(new Date());
            this.amForm.get('orderStatuses').setValue(['Order Received', 'Order Confirmed', 'Cancelled']);
            this.amForm.get('advancePaymentStatus').setValue('NONE');
            this.amForm.get('cancelationPolicy').setValue('If cancellation is necessary, we require that you call at least 2 hour in advance.');
            if (this.action === 'add' && this.isFromadd) {
                this.updateprefillForm();
            }
        } else {
            this.amForm = this.fb.group({
                catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                startdate: [''],
                enddate: [''],
                //qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
               // qendtime: [this.dend_time, Validators.compose([Validators.required])],
                orderType: [],
                orderStatuses: [''],
               itemPriceInfo: [true],
                advancePaymentStatus: [],
                advancePayment: [''],
                cancelationPolicyStatus: [true],
                cancelationPolicy: [''],
                storepickup: [false],
                startdatestore: [''],
                enddatestore: [''],
               // qstarttimestore: [this.dstart_timestore, Validators.compose([Validators.required])],
               // qendtimestore: [this.dend_timestore, Validators.compose([Validators.required])],
               // storeotpverify: [false],
                homedelivery: [false],
                startdatehome: [''],
                enddatehome: [''],
               // qstarttimehome: [this.dstart_timehome, Validators.compose([Validators.required])],
               // qendtimehome: [this.dend_timehome, Validators.compose([Validators.required])],
               // homeotpverify: [false],
                deliverykms: [''],
                deliverycharge: ['']
            });
        }
        if (this.action === 'edit' && !this.isFromadd) {
            this.updateForm();
        } else if (this.action === 'edit' && this.isFromadd) {
            this.updateprefillForm();
        }
    }
    setDescFocus() {
        this.isfocused = true;
        this.char_count = this.max_char_count - this.amForm.get('catalogDesc').value.length;
    }
    lostDescFocus() {
        this.isfocused = false;
    }
    setCharCount() {
        this.char_count = this.max_char_count - this.amForm.get('catalogDesc').value.length;
    }
    handleadvancePayment(event) {
        if (event.checked) {
            this.payAdvance = 'FIXED';
        } else {
            this.payAdvance = 'NONE';
        }
        console.log(this.payAdvance);

    }
    handlestorepickup(event) {
        if (event.checked) {
            this.storepickupStat = true;
        } else {
            this.storepickupStat = false;
        }
    }
    handlehomedelivery(event) {
        if (event.checked) {
            this.homedeliveryStat = true;
        } else {
            this.homedeliveryStat = false;
        }
    }
    handleshoppingChange(event) {
        if (event.value === 'SHOPPINGLIST') {
            this.showadditems = false;
        } else {
            this.showadditems = true;
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
        // const sttime = {
        //     hour: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].sTime,
        //         ['h:mm A']).format('HH'), 10),
        //     minute: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].sTime,
        //         ['h:mm A']).format('mm'), 10)
        // };
        // const edtime = {
        //     hour: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].eTime,
        //         ['h:mm A']).format('HH'), 10),
        //     minute: parseInt(moment(this.catalog.catalogSchedule.timeSlots[0].eTime,
        //         ['h:mm A']).format('mm'), 10)
        // };
        // this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
        // this.selday_arr = [];
        // // extracting the selected days
        // for (let j = 0; j < this.catalog.catalogSchedule.repeatIntervals.length; j++) {
        //     // pushing the day details to the respective array to show it in the page
        //     this.selday_arr.push(Number(this.catalog.catalogSchedule.repeatIntervals[j]));
        // }
        // if (this.selday_arr.length === 7) {
        //     this.Selall = true;
        // } else {
        //     this.Selall = false;
        // }


       // let sttimestore;
        
        if (this.catalog.pickUp && this.catalog.pickUp.pickUpSchedule) {
            this.storetimewindow_list = this.catalog.pickUp.pickUpSchedule.timeSlots;
            // sttimestore = {
            //     hour: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('HH'), 10),
            //     minute: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('mm'), 10)
            // };
        }
       // console.log(sttimestore);
        // let edtimestore;
        // if (this.catalog.pickUp && this.catalog.pickUp.pickUpSchedule) {
        //     edtimestore = {
        //         hour: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('HH'), 10),
        //         minute: parseInt(moment(this.catalog.pickUp.pickUpSchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('mm'), 10)
        //     };
        // }
        // console.log(edtimestore);
        // this.dstart_timestore = sttimestore ? sttimestore : this.dstart_timestore; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_timestore = edtimestore ? edtimestore : this.dend_timestore; // moment(edtime, ['h:mm A']).format('HH:mm');
        // console.log(this.dstart_timestore);
        // console.log(this.dend_timestore);
        this.selday_arrstorepickup = [];
        // extracting the selected days
        if (this.catalog.pickUp && this.catalog.pickUp.pickUpSchedule) {
            for (let j = 0; j < this.catalog.pickUp.pickUpSchedule.repeatIntervals.length; j++) {
                // pushing the day details to the respective array to show it in the page
                this.selday_arrstorepickup.push(Number(this.catalog.pickUp.pickUpSchedule.repeatIntervals[j]));
            }
            if (this.selday_arrstorepickup.length === 7) {
                this.Selallstorepickup = true;
            } else {
                this.Selallstorepickup = false;
            }
        }

        //let sttimehome;
        if (this.catalog.homeDelivery && this.catalog.homeDelivery.deliverySchedule) {
            this.hometimewindow_list = this.catalog.homeDelivery.deliverySchedule.timeSlots;
            // sttimehome = {
            //     hour: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('HH'), 10),
            //     minute: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('mm'), 10)
            // };
        }

        // let edtimehome;
        // if (this.catalog.homeDelivery && this.catalog.homeDelivery.deliverySchedule) {
        //     edtimehome = {
        //         hour: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('HH'), 10),
        //         minute: parseInt(moment(this.catalog.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('mm'), 10)
        //     };
        // }
        // this.dstart_timehome = sttimehome ? sttimehome : this.dstart_timehome; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_timehome = edtimehome ? edtimehome : this.dend_timehome; // moment(edtime, ['h:mm A']).format('HH:mm');
        // console.log(this.dstart_timehome);
        // console.log(this.dend_timehome);
        this.selday_arrhomedelivery = [];
        // extracting the selected days
        if (this.catalog.homeDelivery && this.catalog.homeDelivery.deliverySchedule) {
            for (let j = 0; j < this.catalog.homeDelivery.deliverySchedule.repeatIntervals.length; j++) {
                // pushing the day details to the respective array to show it in the page
                this.selday_arrhomedelivery.push(Number(this.catalog.homeDelivery.deliverySchedule.repeatIntervals[j]));
            }
            if (this.selday_arrhomedelivery.length === 7) {
                this.Selallhomedelivery = true;
            } else {
                this.Selallhomedelivery = false;
            }
        }
        if (this.catalog.paymentType === 'FIXED') {
            this.payAdvance = 'FIXED';
        } else if (this.catalog.paymentType === 'NONE') {
            this.payAdvance = 'NONE';
        } else {
            this.payAdvance = 'FULLAMOUNT';
        }

        let orderpickUpstat;
        let orderpickUpstartdate;
        let orderpickUpenddate;
       // let orderpickUpotp;
        if (this.catalog.pickUp) {
            orderpickUpstat = this.catalog.pickUp.orderPickUp;
            orderpickUpstartdate = this.catalog.pickUp.pickUpSchedule.startDate || '';
            orderpickUpenddate = this.catalog.pickUp.pickUpSchedule.terminator.endDate || '';
        //    orderpickUpotp = this.catalog.pickUp.pickUpOtpVerification || false;
        } else {
            orderpickUpstat = false;
            orderpickUpstartdate = new Date();
            orderpickUpenddate = '';
         //   orderpickUpotp = false;
        }

        let homeDeliverystat;
        let homeDeliverystartdate;
        let homeDeliveryenddate;
       // let homeDeliveryotp;
        let homeDeliveryradius;
        let homeDeliverycharge;
        if (this.catalog.homeDelivery) {
            homeDeliverystat = this.catalog.homeDelivery.homeDelivery;
            homeDeliverystartdate = this.catalog.homeDelivery.deliverySchedule.startDate || '';
            homeDeliveryenddate = this.catalog.homeDelivery.deliverySchedule.terminator.endDate || '';
          //  homeDeliveryotp = this.catalog.homeDelivery.deliveryOtpVerification || false;
            homeDeliveryradius = this.catalog.homeDelivery.deliveryRadius || '';
            homeDeliverycharge = this.catalog.homeDelivery.deliveryCharge || '';
        } else {
            homeDeliverystat = false;
            homeDeliverystartdate = new Date();
            homeDeliveryenddate = '';
         //   homeDeliveryotp = false;
            homeDeliveryradius = '';
            homeDeliverycharge = '';
        }
if (this.catalog.catalogName && this.catalog.catalogSchedule.startDate && this.catalog.catalogSchedule.terminator.endDate) {
    this.basic = true;
}
// if (this.catalog.catalogSchedule.startDate && sttime && edtime && this.selday_arr.length > 0) {
//     this.workinghours = true;
// }
if (this.catalog.cancellationPolicy) {
    this.paymentinformation = true;
}

if (orderpickUpstartdate && this.storetimewindow_list.length > 0 && this.selday_arrstorepickup.length > 0) {
    this.storepickupinfo = true;
}
if (homeDeliverystartdate  && this.hometimewindow_list.length > 0 && this.selday_arrhomedelivery.length > 0) {
    this.homedeliveryinfo = true;
}

        this.amForm.setValue({
            'catalogName': this.catalog.catalogName,
            'catalogDesc': this.catalog.catalogDesc || '',
            'startdate': this.catalog.catalogSchedule.startDate || '',
            'enddate': this.catalog.catalogSchedule.terminator.endDate || '',
            //'qstarttime': sttime,
            //'qendtime': edtime,
            'orderType': this.catalog.orderType,
            'orderStatuses': this.catalog.orderStatuses,
            'itemPriceInfo': this.catalog.showPrice,
            'advancePaymentStatus': this.catalog.paymentType,
            'advancePayment': this.catalog.advanceAmount || '',
            'cancelationPolicyStatus': true,
            'cancelationPolicy': this.catalog.cancellationPolicy,
            'storepickup': orderpickUpstat,
            'startdatestore': orderpickUpstartdate,
            'enddatestore': orderpickUpenddate,
          //  'qstarttimestore': sttimestore || this.dstart_timestore,
          //  'qendtimestore': edtimestore || this.dend_timestore,
           // 'storeotpverify': orderpickUpotp,
            'homedelivery': homeDeliverystat,
            'startdatehome': homeDeliverystartdate || '',
            'enddatehome': homeDeliveryenddate,
           // 'qstarttimehome': sttimehome || this.dstart_timehome,
            //'qendtimehome': edtimehome || this.dend_timehome,
           // 'homeotpverify': homeDeliveryotp,
            'deliverykms': homeDeliveryradius,
            'deliverycharge': homeDeliverycharge
        });
        if (this.catalog.orderType === 'SHOPPINGLIST') {
            this.showadditems = false;
        }
        if (this.catalog.pickUp && this.catalog.pickUp.orderPickUp) {
            this.storepickupStat = true;
        }
        if (this.catalog.homeDelivery && this.catalog.homeDelivery.homeDelivery) {
            this.homedeliveryStat = true;
        }
        this.preInfoEnabled = this.catalog.preInfo.preInfoEnabled;
        this.postInfoEnabled = this.catalog.postInfo.postInfoEnabled;
        this.preInfoTitle = this.catalog.preInfo.preInfoTitle || '';
        this.preInfoText = this.catalog.preInfo.preInfoText || '';
        this.postInfoTitle = this.catalog.postInfo.postInfoTitle || '';
        this.postInfoText = this.catalog.postInfo.postInfoText || '';
        if (this.catalog.catalogImages) {
            this.uploadcatalogImages = this.catalog.catalogImages;
            this.image_list_popup = [];
            for (const pic of this.uploadcatalogImages) {
                this.selectedMessage.files.push(pic);
                const imgobj = new Image(0,
                    { // modal
                        img: pic.url,
                        description: ''
                    });
                this.image_list_popup.push(imgobj);
            }
        }
    }
    updateprefillForm() {
        // const sttime = {
        //     hour: parseInt(moment(this.prefillData.catalogSchedule.timeSlots[0].sTime,
        //         ['h:mm A']).format('HH'), 10),
        //     minute: parseInt(moment(this.prefillData.catalogSchedule.timeSlots[0].sTime,
        //         ['h:mm A']).format('mm'), 10)
        // };
        // const edtime = {
        //     hour: parseInt(moment(this.prefillData.catalogSchedule.timeSlots[0].eTime,
        //         ['h:mm A']).format('HH'), 10),
        //     minute: parseInt(moment(this.prefillData.catalogSchedule.timeSlots[0].eTime,
        //         ['h:mm A']).format('mm'), 10)
        // };
        // this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
        // this.selday_arr = [];
        // // extracting the selected days
        // for (let j = 0; j < this.prefillData.catalogSchedule.repeatIntervals.length; j++) {
        //     // pushing the day details to the respective array to show it in the page
        //     this.selday_arr.push(Number(this.prefillData.catalogSchedule.repeatIntervals[j]));
        // }
        // if (this.selday_arr.length === 7) {
        //     this.Selall = true;
        // } else {
        //     this.Selall = false;
        // }
        //let sttimestore;
        if (this.prefillData.pickUp && this.prefillData.pickUp.pickUpSchedule) {
            this.storetimewindow_list = this.prefillData.pickUp.pickUpSchedule.timeSlots;
            // sttimestore = {
            //     hour: parseInt(moment(this.prefillData.pickUp.pickUpSchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('HH'), 10),
            //     minute: parseInt(moment(this.prefillData.pickUp.pickUpSchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('mm'), 10)
            // };
        }
        // console.log(sttimestore);
        // let edtimestore;
        // if (this.prefillData.pickUp && this.prefillData.pickUp.pickUpSchedule) {
        //     edtimestore = {
        //         hour: parseInt(moment(this.prefillData.pickUp.pickUpSchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('HH'), 10),
        //         minute: parseInt(moment(this.prefillData.pickUp.pickUpSchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('mm'), 10)
        //     };
        // }
        // console.log(edtimestore);
        // this.dstart_timestore = sttimestore ? sttimestore : this.dstart_timestore; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_timestore = edtimestore ? edtimestore : this.dend_timestore; // moment(edtime, ['h:mm A']).format('HH:mm');
        // console.log(this.dstart_timestore);
        // console.log(this.dend_timestore);
        this.selday_arrstorepickup = [];
        // extracting the selected days
        if (this.prefillData.pickUp && this.prefillData.pickUp.pickUpSchedule) {
            for (let j = 0; j < this.prefillData.pickUp.pickUpSchedule.repeatIntervals.length; j++) {
                // pushing the day details to the respective array to show it in the page
                this.selday_arrstorepickup.push(Number(this.prefillData.pickUp.pickUpSchedule.repeatIntervals[j]));
            }
            if (this.selday_arrstorepickup.length === 7) {
                this.Selallstorepickup = true;
            } else {
                this.Selallstorepickup = false;
            }
        }

       // let sttimehome;
        if (this.prefillData.homeDelivery && this.prefillData.homeDelivery.deliverySchedule) {
            this.hometimewindow_list = this.prefillData.homeDelivery.deliverySchedule.timeSlots;
            // sttimehome = {
            //     hour: parseInt(moment(this.prefillData.homeDelivery.deliverySchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('HH'), 10),
            //     minute: parseInt(moment(this.prefillData.homeDelivery.deliverySchedule.timeSlots[0].sTime,
            //         ['h:mm A']).format('mm'), 10)
            // };
        }

        // let edtimehome;
        // if (this.prefillData.homeDelivery && this.prefillData.homeDelivery.deliverySchedule) {
        //     edtimehome = {
        //         hour: parseInt(moment(this.prefillData.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('HH'), 10),
        //         minute: parseInt(moment(this.prefillData.homeDelivery.deliverySchedule.timeSlots[0].eTime,
        //             ['h:mm A']).format('mm'), 10)
        //     };
        // }
        // this.dstart_timehome = sttimehome ? sttimehome : this.dstart_timehome; // moment(sttime, ['h:mm A']).format('HH:mm');
        // this.dend_timehome = edtimehome ? edtimehome : this.dend_timehome; // moment(edtime, ['h:mm A']).format('HH:mm');
        // console.log(this.dstart_timehome);
        // console.log(this.dend_timehome);
        this.selday_arrhomedelivery = [];
        // extracting the selected days
        if (this.prefillData.homeDelivery && this.prefillData.homeDelivery.deliverySchedule) {
            for (let j = 0; j < this.prefillData.homeDelivery.deliverySchedule.repeatIntervals.length; j++) {
                // pushing the day details to the respective array to show it in the page
                this.selday_arrhomedelivery.push(Number(this.prefillData.homeDelivery.deliverySchedule.repeatIntervals[j]));
            }
            if (this.selday_arrhomedelivery.length === 7) {
                this.Selallhomedelivery = true;
            } else {
                this.Selallhomedelivery = false;
            }
        }

        if (this.prefillData.paymentType === 'FIXED') {
            this.payAdvance = 'FIXED';
        } else if (this.prefillData.paymentType === 'NONE') {
            this.payAdvance = 'NONE';
        } else {
            this.payAdvance = 'FULLAMOUNT';
        }

        let orderpickUpstat;
        let orderpickUpstartdate;
        let orderpickUpenddate;
      //  let orderpickUpotp;
        if (this.prefillData.pickUp) {
            orderpickUpstat = this.prefillData.pickUp.orderPickUp;
            orderpickUpstartdate = this.prefillData.pickUp.pickUpSchedule.startDate || '';
            orderpickUpenddate = this.prefillData.pickUp.pickUpSchedule.terminator.endDate || '';
          //  orderpickUpotp = this.prefillData.pickUp.pickUpOtpVerification || false;
        } else {
            orderpickUpstat = false;
            orderpickUpstartdate = '';
            orderpickUpenddate = '';
          //  orderpickUpotp = false;
        }

        let homeDeliverystat;
        let homeDeliverystartdate;
        let homeDeliveryenddate;
       // let homeDeliveryotp;
        let homeDeliveryradius;
        let homeDeliverycharge;
        if (this.prefillData.homeDelivery) {
            homeDeliverystat = this.prefillData.homeDelivery.homeDelivery;
            homeDeliverystartdate = this.prefillData.homeDelivery.deliverySchedule.startDate || '';
            homeDeliveryenddate = this.prefillData.homeDelivery.deliverySchedule.terminator.endDate || '';
         //   homeDeliveryotp = this.prefillData.homeDelivery.deliveryOtpVerification || false;
            homeDeliveryradius = this.prefillData.homeDelivery.deliveryRadius || '';
            homeDeliverycharge = this.prefillData.homeDelivery.deliveryCharge || '';
        } else {
            homeDeliverystat = false;
            homeDeliverystartdate = '';
            homeDeliveryenddate = '';
          //  homeDeliveryotp = false;
            homeDeliveryradius = '';
            homeDeliverycharge = '';
        }
        if (this.prefillData.image.length > 0) {
            this.selectedMessage.files = this.prefillData.image;
        }
        if (this.prefillData.imagepop.length > 0) {
            this.image_list_popup = this.prefillData.imagepop;
        }
        if (this.prefillData.imagebase64.length > 0) {
            this.selectedMessage.base64 = this.prefillData.imagebase64;
        }
        if (this.prefillData.catalogName && this.prefillData.catalogSchedule.startDate && this.prefillData.catalogSchedule.terminator.endDate) {
            this.basic = true;
        }
        // if (this.prefillData.catalogSchedule.startDate && sttime && edtime && this.selday_arr.length > 0) {
        //     this.workinghours = true;
        // }
        if (this.prefillData.cancellationPolicy) {
            this.paymentinformation = true;
        }
        
        if (orderpickUpstartdate && this.storetimewindow_list.length > 0 && this.selday_arrstorepickup.length > 0) {
            this.storepickupinfo = true;
        }
        if (homeDeliverystartdate  && this.hometimewindow_list.length > 0 && this.selday_arrhomedelivery.length > 0) {
            this.homedeliveryinfo = true;
        }
        console.log(this.prefillData.catalogSchedule.terminator.endDate);
        this.amForm.setValue({
            'catalogName': this.prefillData.catalogName,
            'catalogDesc': this.prefillData.catalogDesc || '',
            'startdate': this.prefillData.catalogSchedule.startDate || '',
            'enddate': this.prefillData.catalogSchedule.terminator.endDate || '',
          //  'qstarttime': sttime,
          //  'qendtime': edtime,
            'orderType': this.prefillData.orderType,
            'orderStatuses': this.prefillData.orderStatuses,
           'itemPriceInfo': this.prefillData.showPrice,
            'advancePaymentStatus': this.prefillData.paymentType,
            'advancePayment': this.prefillData.advanceAmount || '',
            'cancelationPolicyStatus': true,
            'cancelationPolicy': this.prefillData.cancellationPolicy,
            'storepickup': orderpickUpstat,
            'startdatestore': orderpickUpstartdate,
            'enddatestore': orderpickUpenddate,
           // 'qstarttimestore': sttimestore || this.dstart_timestore,
            //'qendtimestore': edtimestore || this.dend_timestore,
           // 'storeotpverify': orderpickUpotp,
            'homedelivery': homeDeliverystat,
            'startdatehome': homeDeliverystartdate || '',
            'enddatehome': homeDeliveryenddate,
            //'qstarttimehome': sttimehome || this.dstart_timehome,
            //'qendtimehome': edtimehome || this.dend_timehome,
           // 'homeotpverify': homeDeliveryotp,
            'deliverykms': homeDeliveryradius,
            'deliverycharge': homeDeliverycharge
        });
        if (this.prefillData.orderType === 'SHOPPINGLIST') {
            this.showadditems = false;
        }
        if (this.prefillData.pickUp && this.prefillData.pickUp.orderPickUp) {
            this.storepickupStat = true;
        }
        if (this.prefillData.homeDelivery && this.prefillData.homeDelivery.homeDelivery) {
            this.homedeliveryStat = true;
        }
        this.preInfoEnabled = this.prefillData.preInfo.preInfoEnabled;
        this.postInfoEnabled = this.prefillData.postInfo.postInfoEnabled;
        this.preInfoTitle = this.prefillData.preInfo.preInfoTitle || '';
        this.preInfoText = this.prefillData.preInfo.preInfoText || '';
        this.postInfoTitle = this.prefillData.postInfo.postInfoTitle || '';
        this.postInfoText = this.prefillData.postInfo.postInfoText || '';

    }


    showimg() {
        if (this.item_pic.base64) {
            return this.item_pic.base64;
        } else {
            return this.sharedfunctionObj.showitemimg('');
        }
    }
    handlePaymentchange(val) {
        if (val === 'fixed') {
            this.payAdvance = 'FIXED';
        } else if (val === 'none') {
            this.payAdvance = 'NONE';
        } else {
            this.payAdvance = 'FULLAMOUNT';
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
       
        // const daystr: any = [];
        // for (const cday of this.selday_arr) {
        //     daystr.push(cday);
        // }
        // if (this.selday_arr.length === 0) {
        //     const error = 'Please select the days';
        //     this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        let endDate;
        const startDate = this.convertDate(form_data.startdate);
        if (form_data.enddate) {
            endDate = this.convertDate(form_data.enddate);
        } else {
            endDate = '';
        }
        // check whether the start and end times are selected
        // if (!this.dstart_time || !this.dend_time) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // // today
        // if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // const curdate = new Date();
        // curdate.setHours(this.dstart_time.hour);
        // curdate.setMinutes(this.dstart_time.minute);
        // const enddate = new Date();
        // enddate.setHours(this.dend_time.hour);
        // enddate.setMinutes(this.dend_time.minute);
        // const starttime_format = moment(curdate).format('hh:mm A') || null;
        // const endtime_format = moment(enddate).format('hh:mm A') || null;

        //store pickup
        console.log(this.selday_arrstorepickup);
        const storedaystr: any = [];
        for (const cday of this.selday_arrstorepickup) {
            storedaystr.push(cday);
        }
        console.log(this.selday_arrstorepickup.length);
        if (this.storepickupStat && this.selday_arrstorepickup.length === 0) {
            const error = 'Please select the storepickup days';
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            return;
        }
        if (this.storepickupStat && this.storetimewindow_list.length === 0) {
            const error = 'Please add the storepickup timewindow';
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        // if (!this.dstart_timestore || !this.dend_timestore) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // today
        // if (this.sharedfunctionObj.getminutesOfDay(this.dstart_timestore) > this.sharedfunctionObj.getminutesOfDay(this.dend_timestore)) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // const curdatestore = new Date();
        // curdatestore.setHours(this.dstart_timestore.hour);
        // curdatestore.setMinutes(this.dstart_timestore.minute);
        // const enddatestore = new Date();
        // enddatestore.setHours(this.dend_timestore.hour);
        // enddatestore.setMinutes(this.dend_timestore.minute);
        // const starttime_formatstore = moment(curdatestore).format('hh:mm A') || null;
        // const endtime_formatstore = moment(enddatestore).format('hh:mm A') || null;

        //home delivery
        const homedaystr: any = [];
        for (const cday of this.selday_arrhomedelivery) {
            homedaystr.push(cday);
        }
        if (this.homedeliveryStat && this.selday_arrhomedelivery.length === 0) {
            const error = 'Please select the homedelivery days';
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            return;
        }
        if (this.homedeliveryStat && this.hometimewindow_list.length === 0) {
            const error = 'Please add the homedelivery timewindow';
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        // if (!this.dstart_timehome || !this.dend_timehome) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // today
        // if (this.sharedfunctionObj.getminutesOfDay(this.dstart_timehome) > this.sharedfunctionObj.getminutesOfDay(this.dend_timehome)) {
        //     this.snackbarService.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelClass': 'snackbarerror' });
        //     return;
        // }
        // const curdatehome = new Date();
        // curdatehome.setHours(this.dstart_timehome.hour);
        // curdatehome.setMinutes(this.dstart_timehome.minute);
        // const enddatehome = new Date();
        // enddatehome.setHours(this.dend_timehome.hour);
        // enddatehome.setMinutes(this.dend_timehome.minute);
        // const starttime_formathome = moment(curdatehome).format('hh:mm A') || null;
        // const endtime_formathome = moment(enddatehome).format('hh:mm A') || null;
        if (form_data.orderType === 'SHOPPINGLIST' && form_data.advancePaymentStatus === 'FULLAMOUNT') {
                this.snackbarService.openSnackBar('Shopping list not supported fullamount advance payment', { 'panelClass': 'snackbarerror' });
                return;
        }
        if (this.payAdvance === 'FIXED') {
            if (form_data.advancePayment === '') {
                this.snackbarService.openSnackBar('Please enter advance amount', { 'panelClass': 'snackbarerror' });
                return;
            }
        }
        console.log(this.seletedCatalogItems);
        const postdata = {
            'catalogName': form_data.catalogName,
            'catalogDesc': form_data.catalogDesc,
            'catalogSchedule': {
                'recurringType': 'Weekly',
                'repeatIntervals': [1, 2, 3, 4, 5, 6, 7],
                'startDate': startDate,
                'terminator': {
                    'endDate': endDate,
                    'noOfOccurance': 0
                },
                'timeSlots': [
                    {
                        'sTime': '12:01 AM',
                        'eTime': '11:59 PM'
                    }
                ]
            },
            'catalogStatus': 'ACTIVE',
            'orderType': form_data.orderType,
            'orderStatuses': form_data.orderStatuses,
            'pickUp': {
                'orderPickUp': form_data.storepickup,
                'pickUpSchedule': {
                    'recurringType': 'Weekly',
                    'repeatIntervals': storedaystr,
                    'startDate': storestartDate,
                    'terminator': {
                        'endDate': storeendDate,
                        'noOfOccurance': 0
                    },
                    'timeSlots': this.storetimewindow_list
                    // [
                    //     {
                    //         'sTime': starttime_formatstore,
                    //         'eTime': endtime_formatstore
                    //     }
                    // ]
                },
                'pickUpOtpVerification': false,
                'pickUpScheduledAllowed': true,
                'pickUpAsapAllowed': false
            },
            'homeDelivery': {
                'homeDelivery': form_data.homedelivery,
                'deliverySchedule': {
                    'recurringType': 'Weekly',
                    'repeatIntervals': homedaystr,
                    'startDate': homestartDate,
                    'terminator': {
                        'endDate': homeendDate,
                        'noOfOccurance': 0
                    },
                    'timeSlots': this.hometimewindow_list
                    // [
                    //     {
                    //         'sTime': starttime_formathome,
                    //         'eTime': endtime_formathome
                    //     }
                    // ]
                },
                'deliveryOtpVerification': false,
                'deliveryRadius': form_data.deliverykms,
                'scheduledHomeDeliveryAllowed': true,
                'asapHomeDeliveryAllowed': false,
                'deliveryCharge': form_data.deliverycharge
            },
            'showPrice': form_data.itemPriceInfo,
            'paymentType': form_data.advancePaymentStatus,
            'advanceAmount': form_data.advancePaymentStatus === 'FIXED' ? form_data.advancePayment : 0,
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
            'location': {
                'id': this.selected_locationId
            },
            'minNumberItem': 1,
            'maxNumberItem': 100,
            'cancellationPolicy': form_data.cancelationPolicy

        };
        if (this.action === 'add') {
            postdata['catalogItem'] = this.seletedCatalogItems;
            console.log(postdata);
            this.addCatalog(postdata);
        } else if (this.action === 'edit') {
           // postdata['catalogItem'] = this.catalogItems;
           postdata['catalogItem'] = this.seletedCatalogItems;
           console.log(postdata);
           this.editCatalog(postdata);
        }
    }
    addCatalog(post_data) {
        this.disableButton = true;
        this.resetApiErrors();
        console.log('add');
       this.api_loading = true;
        this.provider_services.addCatalog(post_data)
            .subscribe(
                (data) => {
                   // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CATALOG_CREATED'));
                    this.lStorageService.removeitemfromLocalStorage('selecteditems');
                    this.api_loading = false;
                            this.addcatalogimagedialogRef = this.dialog.open(AddcatalogimageComponent, {
                                width: '50%',
                                panelClass: ['popup-class', 'commonpopupmainclass'],
                                disableClose: true,
                                data: {
                                    source_id: data
                                }
                            });
                            this.addcatalogimagedialogRef.afterClosed().subscribe(result => {
                                if (result === 1) {
                                 console.log(result);
                                 this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
                                }
                              });
               },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    editCatalog(post_itemdata) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        post_itemdata.id = this.catalog.id;
        this.provider_services.editCatalog(post_itemdata)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CATALOG_UPDATED'));
                    this.lStorageService.removeitemfromLocalStorage('selecteditems');
                    this.api_loading = false;
                    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
            console.log(cdate);
        } else {
            cdate = new Date();
        }
        mon = (cdate.getMonth() + 1);
        if (mon < 10) {
            mon = '0' + mon;
        }
        return (cdate.getFullYear() + '-' + mon + '-' + ('0' + cdate.getDate()).slice(-2));
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
                // this.loc_name = this.queue_data.location.place;
                // } else if (this.loc_list.length === 1) {
                // this.loc_name = this.loc_list[0];
                // }
                //if (this.action === 'add') {
                    this.selected_location = this.loc_list[0];
                    this.selected_locationId = this.loc_list[0].id;
               // }
                // if (this.action === 'add' && this.params.source === 'location_detail' && this.params.locationId) {
                // this.selected_locationId = this.params.locationId;
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
    isNumber(evt) {
        return this.sharedfunctionObj.isNumber(evt);
    }

    isvalid(evt) {
        return this.sharedfunctionObj.isValid(evt);
    }
    redirecToJaldeeOrdrmnagrCatalog() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
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
                this.snackbarService.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
            } else if (this.postInfoEnabled && this.postInfoTitle.trim() === '') {
                this.snackbarService.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
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
    backToCatalog() {
        this.showInfo = false;
    }

    saveImages(id) {
        this.api_loading = true;
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
            this.getCatalog(id).then(
                (catalog) => {
                    this.catalog = catalog;
                    if (this.catalog.catalogImages) {
                        this.uploadcatalogImages = this.catalog.catalogImages;
                        this.selectedMessage = {
                            files: [],
                            base64: [],
                            caption: []
                        };
                        this.image_list_popup = [];
                        for (const pic of this.uploadcatalogImages) {
                            this.selectedMessage.files.push(pic);
                            const imgobj = new Image(0,
                                { // modal
                                    img: pic.url,
                                    description: ''
                                });
                            this.image_list_popup.push(imgobj);
                        }
                    }
                }
            );
            this.api_loading = false;
            this.snackbarService.openSnackBar('Image uploaded successfully');
        },
            error => {
                this.api_loading = false;
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
        this.api_loading = true;
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                if (projectConstants.IMAGE_FORMATS.indexOf(file.type) === -1) {
                    this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
                } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
                    this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
                } else {
                    this.selectedMessage.files.push(file);
                    console.log(this.selectedMessage.files);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.selectedMessage.base64.push(e.target['result']);
                        this.image_list_popup = [];
                        for (let i = 0; i < this.selectedMessage.files.length; i++) {
                            const imgobj = new Image(i,
                                {
                                    img: this.selectedMessage.base64[i],
                                    description: ''
                                });
                            this.image_list_popup.push(imgobj);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
            this.api_loading = false;
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
                console.log(result);
                console.log(img);
                if (this.action === 'edit') {
                    console.log(this.uploadcatalogImages);
                    const imgDetails = this.uploadcatalogImages.filter(image => image.url === img.modal.img);
                    console.log(imgDetails);
                    this.provider_services.deleteUplodedCatalogImage(imgDetails[0].keyName, this.catalog_id)
                        .subscribe((data) => {
                            this.selectedMessage.files.splice(index, 1);
                            this.selectedMessage.base64.splice(index, 1);
                            this.image_list_popup.splice(index, 1);
                        },
                            error => {
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            });
                } else {
                    this.selectedMessage.files.splice(index, 1);
                    this.selectedMessage.base64.splice(index, 1);
                    this.image_list_popup.splice(index, 1);
                }
            }
        });
    }
    showStep(step, form_data) {
        console.log(step);
        console.log(form_data);
    // if (step === 2) {
        if (form_data.catalogName ) {
        this.basic = true;
        } else {
            this.basic = false;
         }
    // } else if (step === 3) {
        if (this.selday_arr.length > 0 && form_data.startdate && form_data.qstarttime && form_data.qendtime) {
        this.workinghours = true;
         } else {
            this.workinghours = false;
         }
    // } else if (step === 5) {
        if (this.payAdvance === 'FIXED') {
            if (form_data.advancePayment) {
                this.paymentinformation = true;
            } else {
                this.paymentinformation = false;
            }
        } else {
            this.paymentinformation = true;
        }
    // } else if (step === 6) {
        if (this.selday_arrstorepickup.length > 0 && form_data.startdatestore && this.storetimewindow_list.length > 0) {
            this.storepickupinfo = true;
             } else {
                this.storepickupinfo = false;
             }

    // } else if (step === 7) {
        if (this.selday_arrhomedelivery.length > 0 && form_data.startdatehome && this.hometimewindow_list.length > 0) {
            this.homedeliveryinfo = true;
             } else {
                this.homedeliveryinfo = false;
             }
  //  }
        this.step = step;
}
showTimewindow(type) {
    let list = [];
    if (type === 'store') {
        list = this.storetimewindow_list;
    } else {
        list = this.hometimewindow_list;
    }
        this.addtimewindowdialogRef = this.dialog.open(TimewindowPopupComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
            windowlist: list
        }
    });
    this.addtimewindowdialogRef.afterClosed().subscribe(result => {
        if (result) {
         console.log(result);
         if (type === 'store') {
         this.storetimewindow_list.push(result);
         console.log(this.storetimewindow_list);
         } else {
            this.hometimewindow_list.push(result);
            console.log(this.hometimewindow_list);
         }
        }
      });
}
    deletetimeslot(type, index) {
        if (type === 'store') {
            this.storetimewindow_list.splice(index, 1);
            console.log(this.storetimewindow_list);
            } else {
               this.hometimewindow_list.splice(index, 1);
               console.log(this.hometimewindow_list);
            }
    }
}
