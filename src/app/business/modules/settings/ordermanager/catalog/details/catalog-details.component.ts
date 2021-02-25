import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
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
import {FormControl} from '@angular/forms';
import { EditcatalogitemPopupComponent } from '../editcatalogitempopup/editcatalogitempopup.component';
import { CreateItemPopupComponent } from '../createItem/createitempopup.component';

@Component({
    selector: 'app-catalogdetail',
    templateUrl: './catalog-details.component.html',
    styleUrls: ['./catalog-details.component.css', '../../../../../../../assets/css/style.bundle.css', '../../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../../assets/css/pages/wizard/wizard-1.css']

})
export class CatalogdetailComponent implements OnInit {
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
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
    amItemForm: FormGroup;
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
    maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
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
    showAddItem = false;
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
    selectedMessageMain = {
        files: [],
        base64: [],
        caption: []
    };
    showCustomlabel = false;
    haveMainImg = false;
    mainImage = false;
    isnotefocused = false;
    notechar_count = 0;
    valueCaption = 'Enter the discounted price you offer';
    curtype = 'FIXED';
    @ViewChild('closebutton') closebutton;
    mainimage_list_popup: Image[];
    itmId;
    imageList: any = [];
    item_id;
    customPlainGalleryRowConfig: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.CUSTOM,
        layout: new AdvancedLayout(-1, true)
    };
    customPlainMainGalleryRowConfig: PlainGalleryConfig = {
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
    selectedStatus;
    uploadcatalogImages: any = [];
    payAdvance = 'NONE';
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
    createitemdialogRef;
    itemsforadd: any = [];
    catalogItem: any = [];
    selectedCount = 0;
    selecteditemCount = 0;
    catalogItemsSelected: any = [];
    seletedCatalogItems1: any = {};
    catalogSelectedItemsadd: any = [];
    seletedCatalogItemsadd: any = {};
    screenWidth: number;
    no_of_grids: number;
    itemaction = '';
    addCatalogItems: any = [];
    editcataItemdialogRef: any;
    removeitemdialogRef: any;
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
        this.onResize();
        // this.activated_route.queryParams.subscribe(
        //     (qParams) => {
        //         this.isFromadd = qParams.isFrom;
        //         if (this.isFromadd) {
        //             this.prefillData = this.lStorageService.getitemfromLocalStorage('prefilldata');
        //         }
        //     });
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
                                this.getItems().then(
                                    (data) => {
                                        this.getCatalog(this.catalog_id).then(
                                            (catalog) => {
                                                this.catalog = catalog;
                                                this.catalogcaption = this.catalog.catalogName;
                                                if (this.action === 'edit') {
                                                    this.createForm();
                                                    this.api_loading = false;
                                                } 
                                                if (this.catalog.catalogItem) {
                                                    this.catalogItems = this.catalog.catalogItem;
                                                    console.log(this.catalogItems);
                                                    this.setItemFromCataDetails();
                                                }
                                                // else if (this.action === 'view') {
                                                //     this.catalogcaption = 'Catalog Details';
                                                //     this.api_loading = false;
                                                // }
                                               
                                            }
                                        );
                                    });
                            }
                        );
                    }
                    this.getProviderLocations();
                }
            }
        );
    }
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = window.innerWidth;
        let divider;
        const divident = this.screenWidth / 37.8;
        if (this.screenWidth > 1500) {
            divider = divident / 4;
        } else if (this.screenWidth > 1000 && this.screenWidth < 1500) {
            divider = divident / 3;
        } else if (this.screenWidth > 400 && this.screenWidth < 1000) {
            divider = divident / 2;
        } else if (this.screenWidth < 400) {
            divider = divident / 1;
        }
        this.no_of_grids = Math.round(divident / divider);
    }

    ngOnInit() {
        if (this.action === 'add') {
            this.getItems().then(
                (data) => {
                    this.addCatalogItems = this.lStorageService.getitemfromLocalStorage('selecteditems');
                    if (this.action === 'edit' || this.action === 'add' && this.catalog_id !== 'add') {
                        this.getCatalog(this.catalog_id).then(
                            (catalog) => {

                            }
                        );
                    } else {
                        if (this.addCatalogItems && this.addCatalogItems.length > 0) {
                            this.selectedCount = this.addCatalogItems.length;
                            for (const itm of this.catalogItem) {
                                for (const selitem of this.addCatalogItems) {
                                    if (itm.itemId === selitem.item.itemId) {
                                        itm.selected = true;
                                        itm.id = selitem.id;
                                        itm.minQuantity = selitem.minQuantity;
                                        itm.maxQuantity = selitem.maxQuantity;
                                    }
                                }
                            }
                        }
                    }
                }
            );
        }
    }
    gotoNext() {
        if (this.step === 1 && this.amForm.get('orderType').value === 'SHOPPINGLIST') {
            this.step = 3;
        } else {
            this.step = this.step + 1;
        }
        
        if (this.step === 3 && this.amForm.get('orderType').value === 'SHOPPINGCART') {
            console.log(this.amForm.get('orderType').value);
            if(this.cataId){
                this.selectedaddItems();
            } else {
                this.selectedItems();
            }
            
        }
    }
    gotoPrev() {
        if (this.step === 3 && this.amForm.get('orderType').value === 'SHOPPINGLIST') {
            this.step = 1;
        } else {
            this.step = this.step - 1;
        }
       
        if (this.step === 2 && this.amForm.get('orderType').value === 'SHOPPINGCART') {
            this.addCatalogItems = this.lStorageService.getitemfromLocalStorage('selecteditems');
            if(this.cataId){
                if (this.addCatalogItems && this.addCatalogItems.length > 0 ) {
                    this.selecteditemCount = this.addCatalogItems.length;
                    for (const itm of this.itemsforadd) {
                      for (const selitem of this.addCatalogItems) {
                         if (itm.itemId === selitem.item.itemId) {
                          itm.selected = true;
                          itm.id = selitem.id;
                          itm.minQuantity = selitem.minQuantity;
                          itm.maxQuantity = selitem.maxQuantity;
                         }
                    }
                  }
            
                   }
        } else {
            if (this.addCatalogItems && this.addCatalogItems.length > 0) {
                this.selectedCount = this.addCatalogItems.length;
                for (const itm of this.catalogItem) {
                    for (const selitem of this.addCatalogItems) {
                        if (itm.itemId === selitem.item.itemId) {
                            itm.selected = true;
                            itm.id = selitem.id;
                            itm.minQuantity = selitem.minQuantity;
                            itm.maxQuantity = selitem.maxQuantity;
                        }
                    }
                }
            }
        }
        }
    }

    getItems() {
        const apiFilter = {};
        apiFilter['itemStatus-eq'] = 'ACTIVE';
        return new Promise((resolve, reject) => {
            this.provider_services.getProviderfilterItems(apiFilter)
                .subscribe(
                    data => {
                        this.item_list = data;
                        this.item_count = this.item_list.length;
                        this.catalogItem = data;
                        for (const itm of this.catalogItem) {
                            itm.minQuantity = 1;
                            itm.maxQuantity = 5;
                        }
                        resolve(data);
                    },
                    error => {
                        // this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    }
                );
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
        const startDate = this.convertDate(form_data.startdate);
        if (form_data.enddate) {
            endDate = this.convertDate(form_data.enddate);
        } else {
            endDate = '';
        }
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
        if (this.image_list_popup) {
            seltedimgpopup = this.image_list_popup;
        }
        if (this.selectedMessage.base64.length > 0) {
            seltedimgbase = this.selectedMessage.base64;
        }

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
        this.lStorageService.setitemonLocalStorage('prefilldata', postdata);
        //  this.provider_services.setCatalogPrefilledDetails(postdata);
    }

    addItemstoCart(type, data) {
        this.setCatalogPrefillfields(data);
        const navigationExtras: NavigationExtras = {
            queryParams: {
                action: type,
                id: this.catalog_id || 0
            }
        };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add', 'items'], navigationExtras);
    }
    getCatalog(cataId?) {
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
                advancePayment: ['', Validators.compose([Validators.maxLength(this.maxNumbers)])],
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
                //Add item form controls
                // itemCode: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // itemName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // displayName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // shortDec: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // note: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                // displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                // showOnLandingpage: [true],
                // stockAvailable: [true],
                // taxable: [false],
                // price: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                // promotionalPrice: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                // promotionalPriceType: [],
                // promotionallabel: [],
                // customlabel: []
            });
            this.amForm.get('orderType').setValue('SHOPPINGCART');
            const dt = new Date();
            dt.setFullYear(dt.getFullYear() + 2);
            this.amForm.get('startdate').setValue(new Date());
            this.amForm.get('enddate').setValue(dt);
            this.amForm.get('startdatestore').setValue(new Date());
            this.amForm.get('startdatehome').setValue(new Date());
            this.amForm.get('orderStatuses').setValue(['Order Received', 'Order Confirmed', 'Cancelled']);
            this.amForm.get('advancePaymentStatus').setValue('NONE');
            this.amForm.get('cancelationPolicy').setValue('If cancellation is necessary, we require that you call at least 2 hour in advance.');
           this.createItemform();
            // if (this.action === 'add' && this.isFromadd) {
            //     this.updateprefillForm();
            // }
        } else {
            console.log(this.action);
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
                advancePayment: ['', Validators.compose([Validators.maxLength(this.maxNumbers)])],
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
                //add item
                // itemCode: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // itemName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // displayName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // shortDec: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                // note: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                // displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                // showOnLandingpage: [true],
                // stockAvailable: [true],
                // taxable: [false],
                // price: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                // promotionalPrice: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                // promotionalPriceType: [],
                // promotionallabel: [],
                // customlabel: []
            });
            this.createItemform();
        }
        setTimeout(() => {
            if (this.action === 'edit') {
                this.updateForm();
            } 
            // else if (this.action === 'edit' && this.isFromadd) {
            //     this.updateprefillForm();
            // }
        }, 200);

    }
    createItemform(){
        this.amItemForm = this.fb.group({
            itemCode: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
            itemNameInLocal: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
            itemName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
            displayName: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
            shortDec: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
            note: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
            displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
            showOnLandingpage: [true],
            stockAvailable: [true],
            taxable: [false],
            price: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
            promotionalPrice: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
            promotionalPriceType: [],
            promotionallabel: [],
            customlabel: []
        });
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
        if (homeDeliverystartdate && this.hometimewindow_list.length > 0 && this.selday_arrhomedelivery.length > 0) {
            this.homedeliveryinfo = true;
        }
console.log(this.catalog.catalogName);
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
        if (homeDeliverystartdate && this.hometimewindow_list.length > 0 && this.selday_arrhomedelivery.length > 0) {
            this.homedeliveryinfo = true;
        }
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
    showAddItemSection(type) {
        this.itemaction = type;
        if (this.showAddItem === false) {
            this.showAddItem = true;
        } else {
            this.showAddItem = false;
        }

    }
    onSubmit(form_data) {
console.log('hi submit');
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
        const storedaystr: any = [];
        for (const cday of this.selday_arrstorepickup) {
            storedaystr.push(cday);
        }
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
            // postdata['catalogItem'] = this.seletedCatalogItems;
            postdata['catalogItem'] = this.catalogItemsSelected;
            this.addCatalog(postdata);
        } else if (this.action === 'edit') {
            // postdata['catalogItem'] = this.catalogItems;
            //postdata['catalogItem'] = this.seletedCatalogItems;
           // const additems = this.catalogItems.concat(this.catalogSelectedItemsadd);
            postdata['catalogItem'] = this.catalogSelectedItemsadd;
            console.log(postdata);
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
                if (this.action === 'edit') {
                    const imgDetails = this.uploadcatalogImages.filter(image => image.url === img.modal.img);
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

    itemimageSelect(event, type?) {
        this.api_loading = true;
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                if (projectConstants.IMAGE_FORMATS.indexOf(file.type) === -1) {
                    this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
                } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
                    this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
                } else {
                    if (type) {
                        this.selectedMessageMain.files.push(file);
                    } else {
                        this.selectedMessage.files.push(file);
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (type) {
                            this.selectedMessageMain.base64.push(e.target['result']);
                            this.mainimage_list_popup = [];
                            for (let i = 0; i < this.selectedMessageMain.files.length; i++) {
                                const imgobj = new Image(i,
                                    {
                                        img: this.selectedMessageMain.base64[i],
                                        description: ''
                                    });
                                this.mainimage_list_popup.push(imgobj);
                            }
                        } else {
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
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
            if (this.itmId && (this.selectedMessageMain.files.length > 0 || this.selectedMessage.files.length > 0)) {
                this.saveImages(this.itmId);
            } else {
                this.api_loading = false;
                if (type) {
                    this.mainImage = true;
                }
            }
        }
    }

    openmainImageModalRow(image: Image) {
        const index: number = this.getCurrentIndexCustomLayout(image, this.mainimage_list_popup);
        this.customPlainMainGalleryRowConfig = Object.assign({}, this.customPlainMainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
    }

    deleteTempItemImage(img, index, type?) {
        if (this.action === 'edit') {
            this.removeimgdialogRef = this.dialog.open(ConfirmBoxComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                    'message': 'Do you really want to remove the item image?'
                }
            });
            this.removeimgdialogRef.afterClosed().subscribe(result => {
                if (result) {
                    const imgDetails = this.imageList.filter(image => image.url === img.modal.img);
                    this.provider_services.deleteUplodeditemImage(imgDetails[0].keyName, this.item_id)
                        .subscribe((data) => {
                            if (type) {
                                this.mainimage_list_popup = [];
                                this.selectedMessageMain.files.splice(index, 1);
                                this.selectedMessageMain.base64.splice(index, 1);
                                this.haveMainImg = false;
                            } else {
                                this.image_list_popup.splice(index, 1);
                                this.selectedMessage.files.splice(index, 1);
                                this.selectedMessage.base64.splice(index, 1);
                            }
                        },
                            error => {
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                            });
                }
            });
        } else {
            this.mainImage = false;
            if (type) {
                this.mainimage_list_popup = [];
                this.selectedMessageMain.files.splice(index, 1);
                this.selectedMessageMain.base64.splice(index, 1);
            } else {
                this.image_list_popup.splice(index, 1);
                this.selectedMessage.files.splice(index, 1);
                this.selectedMessage.base64.splice(index, 1);
            }
        }
    }

    showStep(step, form_data) {
        // if (step === 2) {
        if (form_data.catalogName) {
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
                if (type === 'store') {
                    this.storetimewindow_list.push(result);
                } else {
                    this.hometimewindow_list.push(result);
                }
            }
        });
    }
    showCreateItemPopup (){
        this.addtimewindowdialogRef = this.dialog.open(CreateItemPopupComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
            }
        });
    }
    deletetimeslot(type, index) {
        if (type === 'store') {
            this.storetimewindow_list.splice(index, 1);
        } else {
            this.hometimewindow_list.splice(index, 1);
        }
    }

    selectItem(index) {
        if (this.catalogItem[index].selected === undefined || this.catalogItem[index].selected === false) {
            this.catalogItem[index].selected = true;
            this.selectedCount++;
        } else {
            if(this.cataId){
                this.catalogItem[index].selected = true; 
            } else {
                this.catalogItem[index].selected = false;
            }
            this.selectedCount--;
        }
    }
    selectaddItem(index) {
        if (this.itemsforadd[index].selected === undefined || this.itemsforadd[index].selected === false) {
            this.itemsforadd[index].selected = true;
            this.selecteditemCount++;
        } else {
            this.itemsforadd[index].selected = false;
            this.selecteditemCount--;
        }
    }

    getItemImg(item) {
        if (item.itemImages) {
            const img = item.itemImages.filter(image => image.displayImage);
            if (img[0]) {
                return img[0].url;
            } else {
                return '../../../../assets/images/order/Items.svg';
            }
        } else {
            return '../../../../assets/images/order/Items.svg';
        }
    }
    selectedItems() {
        this.catalogItemsSelected = [];
        for (let ia = 0; ia < this.catalogItem.length; ia++) {
            this.seletedCatalogItems1 = {};
            let minqty = '';
            let maxqty = '';
            if (this.catalogItem[ia].selected === true) {
                minqty = (<HTMLInputElement>document.getElementById('minquty_' + this.catalogItem[ia].itemId + '')).value;
                maxqty = (<HTMLInputElement>document.getElementById('maxquty_' + this.catalogItem[ia].itemId + '')).value;
                if (minqty > maxqty) {
                    this.snackbarService.openSnackBar('' + this.catalogItem[ia].displayName + ' maximum quantity should be greater than equal to minimum quantity', { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    return;
                }
                this.seletedCatalogItems1.minQuantity = (<HTMLInputElement>document.getElementById('minquty_' + this.catalogItem[ia].itemId + '')).value || '1';
                this.seletedCatalogItems1.maxQuantity = (<HTMLInputElement>document.getElementById('maxquty_' + this.catalogItem[ia].itemId + '')).value || '5';
                this.seletedCatalogItems1.item = this.catalogItem[ia];
                this.catalogItemsSelected.push(this.seletedCatalogItems1);
            }
        }
        console.log(this.catalogItemsSelected);
        this.lStorageService.setitemonLocalStorage('selecteditems', this.catalogItemsSelected);
        //     const navigationExtras: NavigationExtras = {
        //       queryParams: { action: 'add',
        //                       isFrom: true }
        // };
        //     this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add'], navigationExtras);
    }
    selectedaddItems() {
        this.catalogSelectedItemsadd = [];
        for (let ia = 0; ia < this.itemsforadd.length; ia++) {
            this.seletedCatalogItemsadd = {};
            let minqty = '';
            let maxqty = '';
            if (this.itemsforadd[ia].selected === true) {
                minqty = (<HTMLInputElement>document.getElementById('minquty_' + this.itemsforadd[ia].itemId + '')).value;
                maxqty = (<HTMLInputElement>document.getElementById('maxquty_' + this.itemsforadd[ia].itemId + '')).value;
                if (minqty > maxqty) {
                    this.snackbarService.openSnackBar('' + this.itemsforadd[ia].displayName + ' maximum quantity should be greater than equal to minimum quantity', { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    return;
                }
                this.seletedCatalogItemsadd.minQuantity = (<HTMLInputElement>document.getElementById('minquty_' + this.itemsforadd[ia].itemId + '')).value || '1';
                this.seletedCatalogItemsadd.maxQuantity = (<HTMLInputElement>document.getElementById('maxquty_' + this.itemsforadd[ia].itemId + '')).value || '5';
                this.seletedCatalogItemsadd.item = this.itemsforadd[ia];
                this.catalogSelectedItemsadd.push(this.seletedCatalogItemsadd);
            }
        }
        const additems = this.catalogItems.concat(this.catalogSelectedItemsadd);
        console.log(additems);
        if(additems.length == 0){
            this.snackbarService.openSnackBar('Please add items to catalog', { 'panelClass': 'snackbarerror' });
            return;
        }
        if (this.catalogSelectedItemsadd.length > 0) {
            this.lStorageService.setitemonLocalStorage('selecteditems', this.catalogSelectedItemsadd);
            //   const navigationExtras: NavigationExtras = {
            //     queryParams: { action: 'edit',
            //                     isFrom: true }
            //   };
            //   this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', this.cataId], navigationExtras);
            //  this.addItems(this.catalogSelectedItemsadd);
        } else {
            this.lStorageService.removeitemfromLocalStorage('selecteditems');
        }
    }
    createItem(form_data, isfrom?) {
        if (this.showPromotionalPrice && (!form_data.promotionalPrice || form_data.promotionalPrice == 0)) {
            // this.api_error = 'Please enter valid promotional value';
            this.snackbarService.openSnackBar('Please enter valid promotional value', { 'panelClass': 'snackbarerror' });
            return;
        }
        if (!this.showPromotionalPrice) {
            form_data.promotionalPrice = '';
        }
        if (this.showPromotionalPrice && form_data.promotionallabel === 'CUSTOM' && !form_data.customlabel) {
            // this.api_error = 'Please enter custom label';
            this.snackbarService.openSnackBar('Please enter custom label', { 'panelClass': 'snackbarerror' });
            return;
        }
        const iprice = parseFloat(form_data.price);
        if (!iprice || iprice === 0) {
            // this.api_error = 'Please enter valid price';
            this.snackbarService.openSnackBar('Please enter valid price', { 'panelClass': 'snackbarerror' });
            return;
        }
        if (iprice < 0) {
            //this.api_error = 'Price should not be a negative value';
            this.snackbarService.openSnackBar('Price should not be a negative value', { 'panelClass': 'snackbarerror' });
            return;
        }
        if (form_data.promotionalPrice) {
            const proprice = parseFloat(form_data.price);
            if (proprice < 0) {
                //  this.api_error = 'Price should not be a negative value';
                this.snackbarService.openSnackBar('Price should not be a negative value', { 'panelClass': 'snackbarerror' });
                return;
            }
        }
        //  this.saveImagesForPostinstructions();
        if (this.action === 'add') {
            const post_itemdata = {
                'itemCode': form_data.itemCode,
                'itemNameInLocal' : form_data.itemNameInLocal,
                'itemName': form_data.itemName,
                'displayName': form_data.displayName,
                'shortDesc': form_data.shortDec,
                'itemDesc': form_data.displayDesc,
                'note': form_data.note,
                'taxable': form_data.taxable,
                'price': form_data.price,
                'showPromotionalPrice': this.showPromotionalPrice,
                'isShowOnLandingpage': form_data.showOnLandingpage,
                'isStockAvailable': form_data.stockAvailable,
                'promotionalPriceType': form_data.promotionalPriceType,
                'promotionLabelType': form_data.promotionallabel,
                'promotionLabel': form_data.customlabel || '',
                'promotionalPrice': form_data.promotionalPrice || 0,
                'promotionalPrcnt': form_data.promotionalPrice || 0
            };
            if (!this.showPromotionalPrice) {
                post_itemdata['promotionalPriceType'] = 'NONE';
                post_itemdata['promotionLabelType'] = 'NONE';
            }
            // if (form_data.promotionalPriceType === 'FIXED') {
            //     post_itemdata['promotionalPrice'] = form_data.promotionalPrice || 0;
            // }
            // if (form_data.promotionalPriceType === 'PCT') {
            //     post_itemdata['promotionalPrcnt'] = form_data.promotionalPrice || 0;
            // }
            this.addItem(post_itemdata);
        }
    }
    addItem(post_data) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        this.provider_services.addItem(post_data)
            .subscribe(
                (data) => {
                    if (this.selectedMessage.files.length > 0 || this.selectedMessageMain.files.length > 0) {
                        this.saveImages(data);
                    }
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ITEM_CREATED'));
                    this.api_loading = false;
                    this.disableButton = false;
                    this.showPromotionalPrice = false;
                    this.showCustomlabel = false;
                    // this.amForm.reset();
                    this.haveMainImg = false;
                    this.mainImage = false;
                    this.closeGroupDialog();

                    if (this.selectedMessage.files.length > 0 || this.selectedMessageMain.files.length > 0) {
                        // const route = 'list';
                        this.saveImages(data);
                    } else if (this.selectedMessage.files.length == 0 || this.selectedMessageMain.files.length == 0) {

                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    setnoteFocus() {
        this.isnotefocused = true;
        this.notechar_count = this.max_char_count - this.amForm.get('note').value.length;
    }
    lostnoteFocus() {
        this.isnotefocused = false;
    }

    handleTypechange(typ) {
        if (typ === 'FIXED') {
            this.valueCaption = 'Enter the discounted price you offer';
            this.curtype = typ;
        } else {
            this.curtype = typ;
            this.valueCaption = 'Enter the discounted price you offer';
        }

    }

    handleLabelchange(type) {
        if (type === 'Other') {
            this.showCustomlabel = true;
        } else {
            this.showCustomlabel = false;
        }
    }
    handleTaxablechange() {
        this.resetApiErrors();
        if (this.taxpercentage <= 0) {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
            setTimeout(() => {
                this.api_error = null;
            }, projectConstants.TIMEOUT_DELAY_LARGE);
            this.amForm.get('taxable').setValue(false);
        } else {
            this.api_error = null;
        }
    }
    closeGroupDialog() {
        this.closebutton.nativeElement.click();
        this.resetApiErrors();
    }



    // New functions
    setItemFromCataDetails() {
        this.itemsforadd = [];
        this.itemsforadd = this.catalogItem.filter(o1 => this.catalog.catalogItem.filter(o2 => o2.item.itemId === o1.itemId).length === 0);
       
        // for (let j = 0; j < this.catalogItem.length; j++) {
        //     const itemArr = this.catalog.catalogItem.filter(item => item.item.itemId === this.catalogItem[j].itemId);
        //     if (itemArr.length > 0) {
        //         this.catalogItem[j].minQuantity = itemArr[0].minQuantity;
        //         this.catalogItem[j].maxQuantity = itemArr[0].maxQuantity;
        //         this.catalogItem[j].id = itemArr[0].id;
        //         this.selectItem(j);
        //     }
        // }
    }

    editCatalogItem(item) {
        this.editcataItemdialogRef = this.dialog.open(EditcatalogitemPopupComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            id: item.itemId,
            maxquantity: item.maxQuantity,
            minquantity: item.minQuantity
          }
        });
        this.editcataItemdialogRef.afterClosed().subscribe(result => {
          if (result) {
           this.api_loading = true;
           this.updateItems(result, item.id);
          }
        });
    }

    updateItems(updatelist, id) {
        const passlist: any = {};
          passlist.id = id;
          passlist.maxQuantity = updatelist.maxquantity;
          passlist.minQuantity = updatelist.minquantity;
         this.provider_services.updateCatalogItem(passlist).subscribe(
          (data) => {
            // this.getCatalog();
           // this.getItems();
            this.getUpdatedItems();
            this.api_loading = false;
          }, error => {
            this.api_loading = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
         );
    }

    deleteCatalogItem(itm) {
        console.log(itm);
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you really want to remove this item from catalog?'
          }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            console.log(result);
          if (result) {
            this.api_loading = true;
            this.provider_services.deleteCatalogItem(this.cataId, itm.item.itemId).subscribe(
              (data) => {
               // this.getCatalog();
               this.getUpdatedItems();
                this.api_loading = false;
              }, error => {
                this.api_loading = false;
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
                );
          }
        });
    }
    stopprop(event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
      }

    getUpdatedItems() {
        this.getItems().then(
            (data) => {
                this.getCatalog(this.catalog_id).then(
                    (catalog) => {
                        this.catalog = catalog;
                        this.catalogcaption = this.catalog.catalogName;
                        if (this.catalog.catalogItem) {
                            this.catalogItems = this.catalog.catalogItem;
                            this.setItemFromCataDetails();
                        }
                    }
                );
            });
    }


}
