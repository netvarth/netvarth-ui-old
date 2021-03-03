import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { projectConstants } from '../../../../../..//app.component';
import { AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import { ConfirmBoxComponent } from '../../../../../../shared/components/confirm-box/confirm-box.component';


@Component({
  selector: 'app-createitempopup',
  templateUrl: './createitempopup.component.html'
})
export class CreateItemPopupComponent implements OnInit {
    amItemForm: FormGroup;
    api_error = null;
    api_success = null;
    api_loading = true;
    api_loading1 = true;
    maxChars = projectConstantsLocal.VALIDATOR_MAX50;
    maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
    maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
    char_count = 0;
    max_char_count = 500;
    isfocused = false;
    isnotefocused = false;
    notechar_count = 0;
    price_cap = Messages.PRICES_CAP;
    showPromotionalPrice = false;
    valueCaption = 'Enter the discounted price you offer';
    curtype = 'FIXED';
    showCustomlabel = false;
    taxable_cap = Messages.TAXABLE_CAP;
    holdtaxable = false;
    taxpercentage = 0;
    haveMainImg = false;
    mainImage = false;
    selectedMessageMain = {
      files: [],
      base64: [],
      caption: []
  };
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
};
mainimage_list_popup: Image[];
image_list_popup: Image[];
itmId;
catalog;
uploadcatalogImages: any = [];
action = 'add';
disableButton = false;

removeimgdialogRef;
imageList: any = [];
item_id;
delete_btn = Messages.DELETE_BTN;
customPlainMainGalleryRowConfig: PlainGalleryConfig = {
  strategy: PlainGalleryStrategy.CUSTOM,
  layout: new AdvancedLayout(-1, true)
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
  constructor(
    public dialogRef: MatDialogRef<CreateItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,

  ) {
  }
  
  ngOnInit() {
   
    this.api_loading = false;
    this.createForm();
  }

  createForm(){
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
onSubmit(form_data) {
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
            'itemNameInLocal' :form_data.itemNameInLocal,
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
                this.dialogRef.close();

                if (this.selectedMessage.files.length > 0 || this.selectedMessageMain.files.length > 0) {
                  
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
 
  close() {
      this.dialogRef.close();
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amItemForm.get('catalogDesc').value.length;
}
lostDescFocus() {
    this.isfocused = false;
}
setCharCount() {
    this.char_count = this.max_char_count - this.amItemForm.get('catalogDesc').value.length;
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
      this.amItemForm.get('taxable').setValue(false);
  } else {
      this.api_error = null;
  }
}
resetApiErrors() {
  this.api_error = null;
  this.api_success = null;
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

openImageModalRow(image: Image) {
  const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
  this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
}
}



