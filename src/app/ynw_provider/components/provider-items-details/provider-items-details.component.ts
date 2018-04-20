import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { AddProviderItemImageComponent } from '../add-provider-item-image/add-provider-item-image.component';

@Component({
  selector: 'app-provider-items-details',
  templateUrl: './provider-items-details.component.html',
  styleUrls: ['./provider-items-details.component.css']
})
export class ProviderItemsDetailsComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Items',
      url: '/provider/settings/items'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  constructor( private provider_servicesobj: ProviderServices,
        private router: ActivatedRoute, private dialog: MatDialog,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        private sharedfunctionObj: SharedFunctions,
        private provider_shared_functions: ProviderSharedFuctions) {}

    public itemId;
    public selfile: File;
    obtainedimg = false;
    item_list: any = [] ;
    item_pic = {
        files: [],
        base64: null,
        binary: null
      };
      img_msg = '';
      image_exists = false;
      itemimg = '';

        ngOnInit() {
          this.router.params
            .subscribe(params => {
              this.itemId = params.id;
              this.getitemDetails();
            });

            /*this.amForm = this.fb.group({
              file: [''],
              caption: 'Itempic'
            });*/
        }
        getitemDetails() {
            this.provider_servicesobj.getProviderItems(this.itemId)
              .subscribe(data => {
                this.item_list = data;

              // remove multiple end breadcrumb on edit function
              const breadcrumbs = [];
              this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
              });
              breadcrumbs.push({
                  title: this.item_list.displayName
              });
              this.breadcrumbs = breadcrumbs;

                if (this.item_list.picBig) {
                  this.image_exists = true;
                  const rand = Math.random();
                  if (this.item_list.picBig !== '') {
                    this.itemimg = this.item_list.picBig + '?r=' +  rand;
                  }
                }
              });
        }
        editItem() {
          const dialogRef = this.dialog.open(AddProviderItemComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass'],
            data: {
              item : this.item_list,
              type : 'edit'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            this.getitemDetails();
          });
        }
        showimg() {
          if (this.item_pic.base64) {
              return this.item_pic.base64;
          } else {
              const rand = Math.random();
              let showimgs = '';
              if (this.item_list.picBig !== '') {
                showimgs = this.item_list.picBig + '?r=' +  rand;
              }
              this.obtainedimg = true;
              // return this.sharedfunctionObj.showitemimg(showimg);
              return showimgs;
          }
        }

        editImage(obj, mod) {
          const dialogRef = this.dialog.open(AddProviderItemImageComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass'],
            autoFocus: false,
            data: {
              item : obj,
              type : mod
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
              this.getitemDetails();
            }
          });
      }

        imageSelect(input) {
            if (input.files && input.files[0]) {
              const reader = new FileReader();
              this.item_pic.files = input.files[0];
              this.selfile = input.files[0];

              const fileobj = input.files[0];
              reader.onload = (e) => {
                this.item_pic.base64 =  e.target['result'];
              };
             reader.readAsDataURL(fileobj);
            }
            this.img_msg = '';
        }


       onSubmit (form_data) {
          const formData: FormData = new FormData();
          formData.append('files', this.selfile, this.selfile.name);
          const propertiesDet = {
                                  'caption' : form_data.caption
                                };
          const blobdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
          formData.append('properties', blobdata);
          this.uploadImage(formData);
        }

        uploadImage(passdata) {
          this.provider_servicesobj.uploadItemImage(this.itemId, passdata)
            .subscribe(data => {
              // this.getitemDetails();
              this.item_list = data;
              this.img_msg = 'Image updated';
              this.image_exists = true;
              this.getitemDetails();
            });
        }

        doremoveImage() {
          const dialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
            data: {
              'message' : 'Do you really want to remove the image?'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeImage();
            }
          });
        }

        removeImage() {
          this.provider_servicesobj.removeItemImage(this.item_list)
            .subscribe(data => {
              this.getitemDetails();
              this.provider_shared_functions.openSnackBar(Messages.ITEM_IMGREMOVED);
              this.image_exists = false;
            });
        }
}
