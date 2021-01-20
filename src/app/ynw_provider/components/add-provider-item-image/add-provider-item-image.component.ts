import { Component, Inject, OnInit, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-provider-item-image-add',
  templateUrl: './add-provider-item-image.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderItemImageComponent implements OnInit {

  delete_btn = Messages.DELETE_BTN;
  item_image_cap = Messages.ITEM_IMAGE_CAP;
  change_image = Messages.CHANGE_IMAGE;
  select_image = Messages.SELECT_IMAGE;
  cancel_btn = Messages.CANCEL_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  selitem_pic = '';
  item_pic = {
    files: [],
    base64: null
  };
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  show_img_select = true;
  upload_button_caption = 'Upload';
  uploading = false;
  @ViewChild('caption') private captionRef: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<AddProviderItemImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
        private wordProcessor: WordProcessor,
  ) {
  }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
    });
  }
  showimg() {
    if (this.item_pic.base64) {
      return this.item_pic.base64;
    } else {
      return this.sharedfunctionObj.showitemimg('');
    }
  }

  onSubmit() {
    this.resetApiErrors();
    if (!this.selitem_pic) {
      this.api_error = 'Please select the file';
      return;
    }
    this.show_img_select = false;
    this.uploading = true;
    this.upload_button_caption = 'Uploading ...';
    let imgcaption = '';
    if (this.captionRef.nativeElement) {
      imgcaption = this.captionRef.nativeElement.value || '';
    }
    imgcaption = (imgcaption === '') ? 'Itempic' : imgcaption;


    const submit_data: FormData = new FormData();

    submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
    const propertiesDet = {
      'caption': imgcaption // form_data.caption
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);

    this.provider_services.uploadItemImage(this.data.item.itemId, submit_data)
      .subscribe(() => {
        this.api_success = this.wordProcessor.getProjectMesssages('ITEMIMAGE_UPLOADED');
        setTimeout(() => {
          this.dialogRef.close('reloadlist');
        }, projectConstants.TIMEOUT_DELAY);
      }, error => {
        this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        this.upload_button_caption = 'Upload';
        this.uploading = false;
      });
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
    this.holdtaxable = !this.holdtaxable;
  }

}
