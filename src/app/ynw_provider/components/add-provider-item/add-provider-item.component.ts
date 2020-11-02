import { Component, Inject, OnInit, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ViewChild, ElementRef } from '@angular/core';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';

import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-item-add',
  templateUrl: './add-provider-item.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderItemComponent implements OnInit {

  rupee_symbol = '₹';
  item_hi_cap = Messages.ITEM_HI_CAP;
  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detailed_dec_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
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
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
  max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
  api_loading = true;
  api_loading1 = true;
  disableButton = false;

  // @ViewChild('caption', {static: false}) private captionRef: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<AddProviderItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions
  ) {
  }
  taxDetails: any = [];
  ngOnInit() {
    this.api_loading = false;
    this.createForm();
    this.getTaxpercentage();
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
  }

  createForm() {
    if (this.data.type === 'add') {
      this.amForm = this.fb.group({
        displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        shortDesc: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
        displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
        taxable: [false, Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
        // price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT)]), Validators.maxLength(projectConstantsLocal.VALIDATOR_MAX10)] // ,
        /*file: ['', Validators.compose([Validators.required])],*/
        // caption: ['Itempic']
      });
    } else {
      this.amForm = this.fb.group({
        displayName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
        shortDesc: ['', Validators.compose([Validators.maxLength(this.maxChars)])],
        displayDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
        taxable: [false, Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
      });
    }
    if (this.data.type === 'edit') {
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
  updateForm() {
    // let taxable = '0';
    if (this.data.item.taxable === true) {
      // taxable = '1';
      this.holdtaxable = true;
    }
    this.amForm.setValue({
      'displayName': this.data.item.displayName || null,
      'shortDesc': this.data.item.shortDesc || null,
      'displayDesc': this.data.item.displayDesc || null,
      'price': this.data.item.price || null,
      'taxable': this.holdtaxable
    });
  }
  showimg() {
    if (this.item_pic.base64) {
      return this.item_pic.base64;
    } else {
      return this.sharedfunctionObj.showitemimg('');
    }
  }
  onSubmit(form_data) {
    // }
    // let imgcaption = '';
    const iprice = parseFloat(form_data.price);
    if (!iprice || iprice === 0) {
      this.api_error = 'Please enter the price';
      return;
    }
    if (iprice < 0) {
      this.api_error = 'Price should not be a negative value';
      return;
    }
    if (this.data.type === 'add') {
      /*if (!this.selitem_pic) {
        this.api_error = 'Please select the file';
        return;
      }*/
      // if (this.selitem_pic) {
      //   if (this.captionRef.nativeElement) {
      //     imgcaption = this.captionRef.nativeElement.value || '';
      //   }
      //   imgcaption = (imgcaption === '') ? 'Itempic' : imgcaption;
      // }
      // const submit_data: FormData = new FormData();
      const post_itemdata = {
        'displayName': form_data.displayName,
        'shortDesc': form_data.shortDesc,
        'displayDesc': form_data.displayDesc,
        'taxable': form_data.taxable,
        'price': form_data.price
      };
      // const blob_itemdata = new Blob([JSON.stringify(post_itemdata)], { type: 'application/json' });
      // submit_data.append('item', blob_itemdata);
      // if (this.selitem_pic) {
      //   submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
      //   const propertiesDet = {
      //     'caption': imgcaption // form_data.caption
      //   };
      //   const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
      //   submit_data.append('properties', blobPropdata);
      // }
      this.addItem(post_itemdata);
    } else {
      const post_itemdata = {
        'displayName': form_data.displayName,
        'shortDesc': form_data.shortDesc,
        'displayDesc': form_data.displayDesc,
        'taxable': form_data.taxable,
        'price': form_data.price
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
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  editItem(post_itemdata) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    post_itemdata.itemId = this.data.item.itemId;
    this.provider_services.editItem(post_itemdata)
      .subscribe(
        () => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ITEM_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  imageSelect(input) {
    this.resetApiErrors();
    if (input.files && input.files[0]) {
      this.img_exists = true;
      const reader = new FileReader();
      this.item_pic.files = input.files[0];
      this.selitem_pic = input.files[0];
      const fileobj = input.files[0];
      reader.onload = (e) => {
        this.item_pic.base64 = e.target['result'];
      };
      reader.readAsDataURL(fileobj);
    }
    this.file_error_msg = '';
  }

  deleteTempImage() {
    this.img_exists = false;
    this.item_pic.files = [];
    this.item_pic.base64 = '';
    this.selitem_pic = '';
  }

  handleTaxablechange() {
    // this.holdtaxable = !this.holdtaxable;
    this.resetApiErrors();
    if (this.taxpercentage <= 0) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('SERVICE_TAX_ZERO_ERROR');
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY_LARGE);
      this.amForm.get('taxable').setValue(false);
    } else {
      this.api_error = null;
    }
  }

  getTaxpercentage() {
    this.provider_services.getTaxpercentage()
      .subscribe(data => {
        this.taxDetails = data;
        this.taxpercentage = this.taxDetails.taxPercentage;
      },
        () => {
        });
    this.api_loading1 = false;
  }
}
