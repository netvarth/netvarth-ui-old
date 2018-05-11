import { Component, Inject, OnInit,  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-item-add',
  templateUrl: './add-provider-item.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderItemComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id ;
  selitem_pic = '';
  item_pic = {
    files: [],
    base64: null
  };
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  @ViewChild('caption') private captionRef: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<AddProviderItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
       // console.log(data);
     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    if (this.data.type === 'add') {
      this.amForm = this.fb.group({
        displayName: ['', Validators.compose([Validators.required])],
        shortDesc: ['', Validators.compose([Validators.required])],
        displayDesc: ['', Validators.compose([Validators.required])],
        taxable: [false, Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])] // ,
        /*file: ['', Validators.compose([Validators.required])],*/
        // caption: ['Itempic']
      });
    } else {
      this.amForm = this.fb.group({
        displayName: ['', Validators.compose([Validators.required])],
        shortDesc: ['', Validators.compose([Validators.required])],
        displayDesc: ['', Validators.compose([Validators.required])],
        taxable: [false, Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT)])]
      });
    }

    if (this.data.type === 'edit') {
      this.updateForm();
    }
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
  onSubmit (form_data) {
    let taxable = false;
    // console.log( this.captionRef.nativeElement.value);
    // if (form_data.taxable === '1') {
    taxable = this.holdtaxable;
   // }
    if (this.data.type === 'add') {
        if (!this.selitem_pic) {
          this.api_error = 'Please select the file';
          return;
        }
        let imgcaption = '';
        if (this.captionRef.nativeElement) {
          imgcaption = this.captionRef.nativeElement.value || '';
        }
        imgcaption = (imgcaption === '') ? 'Itempic' : imgcaption;


        const submit_data: FormData = new FormData();

        const post_itemdata = {
                                'displayName': form_data.displayName,
                                'shortDesc': form_data.shortDesc,
                                'displayDesc': form_data.displayDesc,
                                'taxable': taxable,
                                'price': form_data.price
        };

        const blob_itemdata = new Blob([JSON.stringify(post_itemdata)], { type: 'application/json' });

        submit_data.append('item', blob_itemdata);

        submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
        const propertiesDet = {
                                'caption' : imgcaption // form_data.caption
        };
        const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
        submit_data.append('properties', blobPropdata);

        this.addItem(submit_data);

    } else {
          const post_itemdata = {
            'displayName': form_data.displayName,
            'shortDesc': form_data.shortDesc,
            'displayDesc': form_data.displayDesc,
            'taxable': taxable,
            'price': form_data.price
          };
          this.editItem(post_itemdata);
    }
  }

  addItem(post_data) {
    this.provider_services.addItem(post_data)
        .subscribe(
          data => {
            this.api_success = Messages.ITEM_CREATED;
            setTimeout(() => {
            this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
    );
  }
  editItem(post_data) {
    post_data.itemId =  this.data.item.itemId;
    this.provider_services.editItem(post_data)
        .subscribe(
          data => {
            this.api_success = Messages.ITEM_UPDATED;
            setTimeout(() => {
            this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
    );
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  imageSelect(input, ev) {
    this.resetApiErrors();
    if (input.files && input.files[0]) {
      this.img_exists = true;
      const reader = new FileReader();
      this.item_pic.files = input.files[0];
      this.selitem_pic = input.files[0];

      const fileobj = input.files[0];
      reader.onload = (e) => {
        this.item_pic.base64 =  e.target['result'];
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
