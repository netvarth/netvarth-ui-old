import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import {  Router } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
 import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-catalogdetail',
  templateUrl: './catalog-details.component.html'
})
export class CatalogdetailComponent implements OnInit {
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
  item;
  taxDetails: any = [];
  itemname: any;
  itemcaption = 'Add Item';
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

  constructor(private provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
     }

  ngOnInit() {
    this.createForm();
    this.api_loading = false;
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
    // if (this.action === 'add') {
        this.amForm = this.fb.group({
          catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
          startdate: [''],
                enddate: [''],
            orderType: []
        });
    // } else {
    //     this.amForm = this.fb.group({
    //       catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
    //       catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
    //       catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
    //         taxable: [false, Validators.compose([Validators.required])],
    //         price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
    //         promotionalPrice: ['', Validators.compose([ Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
    //     });
    // }
    // if (this.action === 'edit') {
    //     this.itemcaption = 'Edit Item';
    //     this.updateForm();
    // }
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

updateForm() {
    console.log(this.item);
    if (this.item.taxable === true) {
        this.holdtaxable = true;
    }
    this.amForm.setValue({
        'catalogName': this.item.catalogName || null,
        'itemName': this.item.itemName || null,
        'catalogshortDesc': this.item.catalogshortDesc || null,
        'catalogDesc': this.item.displayDesc || null,
        'price': this.item.price || null,
        'taxable': this.holdtaxable,
        'showPromotionalPrice': this.item.showPromotionalPrice,
        'promotionalPrice': this.item.promotionalPrice || null
    });
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
        'catalogs']);
    this.api_loading = false;
}
onSubmit(form_data) {
    if (this.showPromotionalPrice && !form_data.promotionalPrice) {
        this.api_error = 'Please enter promotional price';
        return;
    }
    if (!this.showPromotionalPrice) {
        form_data.promotionalPrice = '';
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
            'catalogName': form_data.catalogName,
            'itemName': form_data.itemName,
            'catalogshortDesc': form_data.catalogshortDesc,
            'catalogDesc': form_data.catalogDesc,
            'taxable': form_data.taxable,
            'price': form_data.price,
            'showPromotionalPrice': this.showPromotionalPrice,
            'promotionalPrice': form_data.promotionalPrice
        };
        this.addItem(post_itemdata);
    } else if (this.action === 'edit') {
        const post_itemdata = {
            'catalogName': form_data.catalogName,
            'itemName': form_data.itemName,
            'catalogshortDesc': form_data.catalogshortDesc,
            'catalogDesc': form_data.catalogDesc,
            'taxable': form_data.taxable,
            'price': form_data.price,
            'showPromotionalPrice': this.showPromotionalPrice,
            'promotionalPrice': form_data.promotionalPrice
        };
        this.editItem(post_itemdata);
    }
}
addItem(post_data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.addItem(post_data)
        .subscribe(
            () => {
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED'));
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
                this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
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

}
