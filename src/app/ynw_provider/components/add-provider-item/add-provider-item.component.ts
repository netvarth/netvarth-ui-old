import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  file_error_msg = '';
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
        taxable: ['1', Validators.compose([Validators.required])],
        /*file: ['', Validators.compose([Validators.required])],*/
        caption: ['Itempic']
      });
    } else {
      this.amForm = this.fb.group({
        displayName: ['', Validators.compose([Validators.required])],
        shortDesc: ['', Validators.compose([Validators.required])],
        displayDesc: ['', Validators.compose([Validators.required])],
        taxable: ['1', Validators.compose([Validators.required])]
      });
    }

    if (this.data.type === 'edit') {
      this.updateForm();
    }
  }
  showimg() {
    if (this.item_pic.base64) {
        return this.item_pic.base64;
    } else {
      return this.sharedfunctionObj.showlogoicon('');
    }
  }
  onSubmit (form_data) {
    let taxable = false;
    if (form_data.taxable === '1') {
      taxable = true;
    }
    if (this.data.type === 'add') {
        if (!this.selitem_pic) {
          this.file_error_msg = 'Please select the file';
          return;
        }
        const submit_data: FormData = new FormData();

        const post_itemdata = {
                                'displayName': form_data.displayName,
                                'shortDesc': form_data.shortDesc,
                                'displayDesc': form_data.displayDesc,
                                'taxable': taxable
        };

        const blob_itemdata = new Blob([JSON.stringify(post_itemdata)], { type: 'application/json' });

        submit_data.append('item', blob_itemdata);

        submit_data.append('files', this.selitem_pic, this.selitem_pic['name']);
        const propertiesDet = {
                                'caption' : form_data.caption
        };
        const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
        submit_data.append('properties', blobPropdata);

        this.addItem(submit_data);

    } else {
          const post_itemdata = {
            'displayName': form_data.displayName,
            'shortDesc': form_data.shortDesc,
            'displayDesc': form_data.displayDesc,
            'taxable': taxable
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
  updateForm() {
    let taxable = '0';
    if (this.data.item.taxable === true) {
      taxable = '1';
    }
    this.amForm.setValue({
      'displayName': this.data.item.displayName || null,
      'shortDesc': this.data.item.shortDesc || null,
      'displayDesc': this.data.item.displayDesc || null,
      'taxable': taxable
    });
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  imageSelect(input, ev) {
    if (input.files && input.files[0]) {
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

}
