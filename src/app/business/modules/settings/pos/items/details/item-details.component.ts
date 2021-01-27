import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';

@Component({
    'selector': 'app-item-details',
    'templateUrl': './item-details.component.html'
})
export class ItemDetailsComponent implements OnInit {
    item_id;
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
    notechar_count = 0;
    max_char_count = 500;
    isfocused = false;
    isnotefocused = false;
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

    // @ViewChild('caption', { static: false }) private captionRef: ElementRef;
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
    item;
    taxDetails: any = [];
    itemname: any;
    itemcaption = 'Add Item';
    showPromotionalPrice = false;
    image_list_popup: Image[];
    mainimage_list_popup: Image[];
    galleryDialog;
    gallery_view_caption = Messages.GALLERY_CAP;
    havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    photo_cap = Messages.SERVICE_PHOTO_CAP;
    delete_btn = Messages.DELETE_BTN;
    removeimgdialogRef;
    valueCaption = 'Enter the discounted price you offer';
    curtype = 'FIXED';
    showCustomlabel = false;
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
    itmId;
    data: any;
    haveMainImg = false;
    imageList: any = [];
    mainImage = false;
    iscmFrom;
    constructor(private provider_services: ProviderServices,
        private sharedfunctionObj: SharedFunctions,
        private activated_route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor) {
        this.activated_route.queryParams.subscribe(
            (qParams) => {
                this.iscmFrom = qParams.type;
            });
        this.activated_route.params.subscribe(
            (params) => {
                this.item_id = params.id;
                this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
                if (this.item_id) {
                    if (this.item_id === 'add') {
                        const breadcrumbs = [];
                        this.breadcrumbs_init.map((e) => {
                            breadcrumbs.push(e);
                        });
                        breadcrumbs.push({
                            title: 'Add'
                        });
                        this.breadcrumbs = breadcrumbs;
                        this.action = 'add';
                        this.createForm();
                        this.api_loading = false;
                    } else {
                        this.activated_route.queryParams.subscribe(
                            (qParams) => {
                                this.action = qParams.action;
                                this.itmId = this.item_id;
                                this.getItem(this.item_id).then(
                                    (item) => {
                                        this.item = item;
                                        this.api_loading = false;
                                        if (this.item.itemImages) {
                                            this.imageList = this.item.itemImages;
                                            this.loadImages(this.item.itemImages);
                                        }
                                        this.itemname = this.item.displayName;
                                        if (this.action === 'edit') {
                                            const breadcrumbs = [];
                                            this.breadcrumbs_init.map((e) => {
                                                breadcrumbs.push(e);
                                            });
                                            breadcrumbs.push({
                                                title: this.itemname
                                            });
                                            this.breadcrumbs = breadcrumbs;
                                            this.createForm();
                                        } else if (this.action === 'view') {
                                            this.itemcaption = 'Item Details';
                                            const breadcrumbs = [];
                                            this.breadcrumbs_init.map((e) => {
                                                breadcrumbs.push(e);
                                            });
                                            breadcrumbs.push({
                                                title: this.itemname
                                            });
                                            this.breadcrumbs = breadcrumbs;
                                        }
                                    }
                                );
                            }
                        );
                    }
                }
            }
        );
    }
    loadImages(imagelist) {
        this.image_list_popup = [];
        this.mainimage_list_popup = [];
        if (imagelist.length > 0) {
            for (let i = 0; i < imagelist.length; i++) {
                if (imagelist[i].displayImage) {
                    this.haveMainImg = true;
                    const imgobj = new Image(
                        i,
                        { // modal
                            img: imagelist[i].url,
                            description: imagelist[i].caption || ''
                        });
                    this.mainimage_list_popup.push(imgobj);
                } else {
                    const imgobj = new Image(
                        i,
                        { // modal
                            img: imagelist[i].url,
                            description: imagelist[i].caption || ''
                        });
                    this.image_list_popup.push(imgobj);
                }
            }
        }
    }
    ngOnInit() {
        this.getTaxpercentage();
    }
    getItem(itemId) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderItems(itemId)
                .subscribe(
                    (data) => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    goBack() {
        if (this.iscmFrom === 'ordermanager') {
            const navigatExtras: NavigationExtras = {
                queryParams: {
                    type: this.iscmFrom ? this.iscmFrom : ''
                }
            };
            this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
        } else {
            this.router.navigate(['provider', 'settings', 'pos', 'items']);
        }

        this.api_loading = false;
    }
    createForm() {
        if (this.action === 'add') {
            this.amForm = this.fb.group({
                itemCode: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                itemName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDec: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                note: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                showOnLandingpage: [true],
                stockAvailable: [true],
                taxable: [false],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPrice: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPriceType: [],
                promotionallabel: [],
                customlabel: []
            });
            this.amForm.get('promotionalPriceType').setValue('FIXED');
            this.amForm.get('promotionallabel').setValue('ONSALE');
        } else {
            // this.itemcaption = 'Item Details';
            this.amForm = this.fb.group({
                itemCode: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                itemName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDec: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                note: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                showOnLandingpage: [true],
                stockAvailable: [true],
                taxable: [false, Validators.compose([Validators.required])],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPrice: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPriceType: [],
                promotionallabel: [],
                customlabel: []
            });
            this.amForm.get('promotionalPriceType').setValue('FIXED');
        }
        if (this.action === 'edit') {
            this.itemcaption = this.item.displayName;
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
    setnoteFocus() {
        this.isnotefocused = true;
        this.notechar_count = this.max_char_count - this.amForm.get('note').value.length;
    }
    lostnoteFocus() {
        this.isnotefocused = false;
    }
    setnoteCharCount() {
        this.notechar_count = this.max_char_count - this.amForm.get('note').value.length;
    }
    updateForm() {
        if (this.item.taxable) {
            // taxable = '1';
            this.holdtaxable = true;
        }
        let value;
        if (this.item.promotionalPriceType === 'PCT') {
            value = this.item.promotionalPrcnt;
        } else {
            value = this.item.promotionalPrice;
        }
        let note;
        if (this.item.notes && this.item.notes.length > 0) {
            note = this.item.notes[0].note;
        } else {
            note = '';
        }
        // this.amForm.get('itemName').setValue(this.item.itemName);
        this.amForm.patchValue({
            'itemCode': this.item.itemCode || '',
            'itemName': this.item.itemName || '',
            'displayName': this.item.displayName || '',
            'shortDec': this.item.shortDesc || '',
            'displayDesc': this.item.itemDesc || '',
            'note': note,
            'price': this.item.price || '',
            'taxable': this.holdtaxable,
           'showOnLandingpage': this.item.isShowOnLandingpage,
            'stockAvailable': this.item.isStockAvailable,
            'promotionalPrice': value || 0,
            'promotionalPriceType': this.item.promotionalPriceType === 'NONE' ? 'FIXED' : this.item.promotionalPriceType,
            'promotionallabel': this.item.promotionLabelType || 'ONSALE',
            'customlabel': this.item.promotionLabel || ''
        });
        this.showPromotionalPrice = this.item.showPromotionalPrice;
        this.curtype = this.item.promotionalPriceType === 'NONE' ? 'FIXED' : this.item.promotionalPriceType;
        if (this.amForm.get('promotionallabel').value === 'CUSTOM') {
            this.showCustomlabel = true;
        }

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
    showimg() {
        if (this.item_pic.base64) {
            return this.item_pic.base64;
        } else {
            return this.sharedfunctionObj.showitemimg('');
        }
    }
    onCancel() {
        if (this.iscmFrom === 'ordermanager') {
            const navigatExtras: NavigationExtras = {
                queryParams: {
                    type: this.iscmFrom ? this.iscmFrom : ''
                }
            };
            this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
        } else {
            this.router.navigate(['provider', 'settings', 'pos', 'items']);
        }
        this.api_loading = false;
    }
    onSubmit(form_data, isfrom?) {
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
            this.addItem(post_itemdata, isfrom);
        } else if (this.action === 'edit') {
            const post_itemdata = {
                'itemCode': form_data.itemCode,
                'itemName': form_data.itemName,
                'displayName': form_data.displayName,
                'shortDesc': form_data.shortDec || '',
                'itemDesc': form_data.displayDesc || '',
                'note': form_data.note || '',
                'taxable': form_data.taxable || false,
                'price': form_data.price || 0,
                'showPromotionalPrice': this.showPromotionalPrice,
                'isShowOnLandingpage': form_data.showOnLandingpage || false,
                'isStockAvailable': form_data.stockAvailable || false,
                'promotionalPrice': form_data.promotionalPrice || 0,
                'promotionalPriceType': form_data.promotionalPriceType,
                'promotionLabelType': form_data.promotionallabel,
                'promotionLabel': form_data.customlabel || '',
                'promotionalPrcnt': form_data.promotionalPrice || 0,
                'status': this.item.status
            };
            if (!this.showPromotionalPrice) {
                post_itemdata['promotionalPriceType'] = 'NONE';
                post_itemdata['promotionLabelType'] = 'NONE';
            }
            this.editItem(post_itemdata);
        }
    }
    // saveandAdd(form_data) {

    // }
    addItem(post_data, isFrom?) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        this.provider_services.addItem(post_data)
            .subscribe(
                (data) => {
                    if (this.selectedMessage.files.length > 0 || this.selectedMessageMain.files.length > 0 && isFrom === 'saveadd') {
                        this.saveImages(data, isFrom);
                    }
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ITEM_CREATED'));
                    this.api_loading = false;
                    if (isFrom === 'saveadd') {
                        this.disableButton = false;
                        this.showPromotionalPrice = false;
                        this.showCustomlabel = false;
                        this.amForm.reset();
                        this.haveMainImg = false;
                        this.mainImage = false;
                    } else if (this.selectedMessage.files.length > 0 || this.selectedMessageMain.files.length > 0 && !isFrom) {
                        const route = 'list';
                        this.saveImages(data, route);
                    } else if (this.selectedMessage.files.length == 0 || this.selectedMessageMain.files.length == 0) {
                        if (this.iscmFrom === 'ordermanager') {
                            const navigatExtras: NavigationExtras = {
                                queryParams: {
                                    type: this.iscmFrom ? this.iscmFrom : ''
                                }
                            };
                            this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
                        } else {
                            this.router.navigate(['provider', 'settings', 'pos', 'items']);
                        }
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    editItem(post_itemdata) {
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        post_itemdata.itemId = this.item.itemId;
        this.provider_services.editItem(post_itemdata)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ITEM_UPDATED'));
                    this.api_loading = false;
                    if (this.iscmFrom === 'ordermanager') {
                        const navigatExtras: NavigationExtras = {
                            queryParams: {
                                type: this.iscmFrom ? this.iscmFrom : ''
                            }
                        };
                        this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
                    } else {
                        this.router.navigate(['provider', 'settings', 'pos', 'items']);
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
        this.disableButton = false;
    }
    isNumeric(evt) {
        return this.sharedfunctionObj.isNumeric(evt);
    }
    isvalid(evt) {
        return this.sharedfunctionObj.isValid(evt);
    }
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe(data => {
                if (data) {
                    this.taxDetails = data;
                    this.taxpercentage = this.taxDetails.taxPercentage;
                }
            });
        this.api_loading = false;
    }
    editViewedItem(item) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'pos', 'items', item.itemId], navigationExtras);
    }
    redirecToJaldeeOrdermanager() {
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': 'Do you want to exit?'
            }
        });
        dialogrefd.afterClosed().subscribe(result => {
            if (result) {
                if (this.iscmFrom === 'ordermanager') {
                    const navigatExtras: NavigationExtras = {
                        queryParams: {
                            type: this.iscmFrom ? this.iscmFrom : ''
                        }
                    };
                    this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
                } else {
                    this.router.navigate(['provider', 'settings', 'pos', 'items']);
                }
            }
        });
    }
    saveImages(id, routeTo?) {
        const submit_data: FormData = new FormData();
        const propertiesDetob = {};
        let i = 0;
        for (const pic of this.selectedMessageMain.files) {
            submit_data.append('files', pic, pic['name']);
            let properties = {};
            properties = {
                'caption': this.selectedMessageMain.caption[i] || '',
                'displayImage': true
            };
            propertiesDetob[i] = properties;
            i++;
        }
        for (const pic of this.selectedMessage.files) {
            submit_data.append('files', pic, pic['name']);
            let properties = {};
            properties = {
                'caption': this.selectedMessage.caption[i] || '',
                'displayImage': false
            };
            propertiesDetob[i] = properties;
            i++;
        }
        const propertiesDet = {
            'propertiesMap': propertiesDetob
        };
        const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
        submit_data.append('properties', blobPropdata);
        this.provider_services.uploadItemImages(id, submit_data).subscribe((data) => {
            this.selectedMessage = {
                files: [],
                base64: [],
                caption: []
            };
            this.selectedMessageMain = {
                files: [],
                base64: [],
                caption: []
            };
            this.image_list_popup = [];
            this.mainimage_list_popup = [];
            if (routeTo === 'list') {
                if (this.iscmFrom === 'ordermanager') {
                    const navigatExtras: NavigationExtras = {
                        queryParams: {
                            type: this.iscmFrom ? this.iscmFrom : ''
                        }
                    };
                    this.router.navigate(['provider', 'settings', 'pos', 'items'], navigatExtras);
                } else {
                    this.router.navigate(['provider', 'settings', 'pos', 'items']);
                }
            }
            if (routeTo !== 'saveadd') {
                this.getItem(id).then(
                    (item) => {
                        this.item = item;
                        if (this.item.itemImages) {
                            this.imageList = this.item.itemImages;
                            this.loadImages(this.item.itemImages);
                        }
                    });
            }
            this.api_loading = false;
        },
            error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.getItem(id).then(
                    (item) => {
                        this.item = item;
                        if (this.item.itemImages) {
                            this.imageList = this.item.itemImages;
                            this.loadImages(this.item.itemImages);
                        }
                        this.api_loading = false;
                    });
            });
    }
    saveImagesForPostinstructions() {
        const files = this.selectedMessage.files;
        const propertiesDetob = {};

        for (let pic of this.selectedMessage.files) {

            const properties = {
                'caption': this.selectedMessage.caption[pic] || '',

            };
            propertiesDetob[pic] = properties;
            pic++;
        }
        const propertiesDet = {
            'propertiesMap': propertiesDetob
        };
        const preInstructionGallery = {
            'files': files,
            'information': propertiesDet
        };

        this.data = preInstructionGallery;
    }

    openImageModalRow(image: Image) {
        const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
        this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
    }
    openmainImageModalRow(image: Image) {
        const index: number = this.getCurrentIndexCustomLayout(image, this.mainimage_list_popup);
        this.customPlainMainGalleryRowConfig = Object.assign({}, this.customPlainMainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
    }
    private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
        return image ? images.indexOf(image) : -1;
    }
    onButtonBeforeHook() {
    }
    onButtonAfterHook() { }

    imageSelect(event, type?) {
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

    deleteTempImage(img, index, type?) {
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
}
