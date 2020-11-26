import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy , Image , ButtonType} from 'angular-modal-gallery';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';

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
    galleryDialog;
    gallery_view_caption = Messages.GALLERY_CAP;
    havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
    add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
    photo_cap = Messages.SERVICE_PHOTO_CAP;
    delete_btn = Messages.DELETE_BTN;
    removeimgdialogRef;
    valueCaption = 'Enter value';
    curtype = 'FIXED';
    showCustomlabel = false;
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
        private activated_route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService) {
        this.activated_route.params.subscribe(
            (params) => {
                this.item_id = params.id;
                this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
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
                    } else {
                        this.activated_route.queryParams.subscribe(
                            (qParams) => {
                                this.action = qParams.action;
                                this.getItem(this.item_id).then(
                                    (item) => {
                                        this.item = item;
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
                    this.api_loading = false;
                }
            }
        );
    }
    ngOnInit() {
       // this.getTaxpercentage();
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
            'items']);
        this.api_loading = false;
    }
    createForm() {
        if (this.action === 'add') {
            this.amForm = this.fb.group({
                itemCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                itemName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDec: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                note: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                showOnLandingpage: [false],
                taxable: [false, Validators.compose([Validators.required])],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPrice: ['', Validators.compose([ Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPriceType: [],
                promotionallabel: []
            });
            this.amForm.get('promotionalPriceType').setValue('FIXED');
            this.amForm.get('promotionallabel').setValue('Sale');
        } else {
            // this.itemcaption = 'Item Details';
            this.amForm = this.fb.group({
                itemCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                itemName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
                shortDec: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                note: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
                displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
                showOnLandingpage: [false],
                taxable: [false, Validators.compose([Validators.required])],
                price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPrice: ['', Validators.compose([ Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
                promotionalPriceType: [],
                promotionallabel: []
            });
        }
        if (this.action === 'edit') {
            this.itemcaption = 'Edit Item';
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
        console.log(this.item);
        if (this.item.taxable === true) {
            // taxable = '1';
            this.holdtaxable = true;
        }
        this.amForm.setValue({
            'itemCode': this.item.itemCode || null,
            'itemName': this.item.itemName || null,
            'displayName': this.item.displayName || null,
            'shortDec': this.item.shortDec || null,
            'displayDesc': this.item.itemDesc || null,
            'note': this.item.note || null,
            'price': this.item.price || null,
            'taxable': this.holdtaxable,
            'showOnLandingpage': this.item.showOnLandingpage,
            'showPromotionalPrice': this.item.showPromotionalPrice,
            'promotionalPrice': this.item.promotionalPrice || null,
            'promotionalPriceType': this.item.promotionalPriceType || 'FIXED',
            'promotionallabel': this.item.promotionallabel || 'Sale'
        });
        this.curtype = this.item.promotionalPriceType || 'FIXED';
    }
    handleTypechange(typ) {
        if (typ === 'FIXED') {
          this.valueCaption = 'Enter value';
          this.curtype = typ;
        } else {
          this.curtype = typ;
          this.valueCaption = 'Enter percentage value';
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
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
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
        this.router.navigate(['provider', 'settings', 'ordermanager',
            'items']);
        this.api_loading = false;
    }
    onSubmit(form_data, isfrom?) {
        if (this.showPromotionalPrice && !form_data.promotionalPrice) {
            this.api_error = 'Please enter promotional value';
            return;
        }
        if (!this.showPromotionalPrice) {
            form_data.promotionalPrice = '';
        }
        if (this.showPromotionalPrice && form_data.promotionallabel === 'Other' && !form_data.customlabel) {
            this.api_error = 'Please enter custom label';
            return;
        }
        const iprice = parseFloat(form_data.price);
        if (!iprice || iprice === 0) {
            this.api_error = 'Please enter valid price';
            return;
        }
        if (iprice < 0) {
            this.api_error = 'Price should not be a negative value';
            return;
        }
        if (form_data.promotionalPrice) {
            const proprice = parseFloat(form_data.price);
            if (proprice < 0) {
                this.api_error = 'Price should not be a negative value';
                return;
            }
        }
        if (this.action === 'add') {
            const post_itemdata = {
                'itemCode': form_data.itemCode,
                'itemName': form_data.itemName,
                'displayName': form_data.displayName,
                'shortDec': form_data.shortDec,
                'itemDesc': form_data.displayDesc,
                'note': form_data.note,
                'taxable': form_data.taxable,
                'price': form_data.price,
                'showPromotionalPrice': this.showPromotionalPrice,
                'showOnLandingpage': form_data.showOnLandingpage,
                'promotionalPrice': form_data.promotionalPrice,
                'promotionalPriceType': form_data.promotionalPriceType
            };
            this.addItem(post_itemdata, isfrom);
        } else if (this.action === 'edit') {
            const post_itemdata = {
                'itemCode': form_data.itemCode,
                'itemName': form_data.itemName,
                'displayName': form_data.displayName,
                'shortDec': form_data.shortDec,
                'itemDesc': form_data.displayDesc,
                'note': form_data.note,
                'taxable': form_data.taxable,
                'price': form_data.price,
                'showPromotionalPrice': this.showPromotionalPrice,
                'showOnLandingpage': form_data.showOnLandingpage,
                'promotionalPrice': form_data.promotionalPrice,
                'promotionalPriceType': form_data.promotionalPriceType
            };
            this.editItem(post_itemdata);
        }
    }
    // saveandAdd(form_data) {

    // }
    addItem(post_data, isFrom?) {
        console.log(isFrom);
        this.disableButton = true;
        this.resetApiErrors();
        this.api_loading = true;
        this.provider_services.addItem(post_data)
            .subscribe(
                () => {
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED'));
                    this.api_loading = false;
                    if (isFrom === 'saveadd') {
                        this.amForm.reset();
                        this.selectedMessage = {
                            files: [],
                            base64: [],
                            caption: []
                          };
                          this.image_list_popup = [];
                    } else {
                        this.router.navigate(['provider', 'settings', 'ordermanager', 'items']);
                    }
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
                    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_UPDATED'));
                    this.api_loading = false;
                    this.router.navigate(['provider', 'settings', 'ordermanager', 'items']);
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.api_loading = false;
                    this.disableButton = false;
                }
            );
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
        this.router.navigate(['provider', 'settings', 'ordermanager', 'items', item.itemId], navigationExtras);
    }
    redirecToJaldeeOrdermanager() {
        this.router.navigate(['provider', 'settings', 'ordermanager' , 'items']);
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
        this.provider_services.uploadItemImages(id, submit_data).subscribe((data) => {
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
        }
      }

      deleteTempImage(img, index) {
        this.removeimgdialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you really want to remove the prescription?'
          }
        });
        this.removeimgdialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (img.view && img.view === true) {
              this.provider_services.deleteUplodedprescription(img.keyName, this.item_id)
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
