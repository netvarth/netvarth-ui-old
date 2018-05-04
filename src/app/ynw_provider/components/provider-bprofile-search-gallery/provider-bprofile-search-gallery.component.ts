import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-provider-bprofile-search-gallery',
  templateUrl: './provider-bprofile-search-gallery.component.html',
  styleUrls: ['./provider-bprofile-search-gallery.scss']
})

export class ProviderBprofileSearchGalleryComponent implements OnInit {

  item_pic = {
    files: [],
    base64: [],
    caption: []
  };

  image_list: any = [];
  success_error = null;
  error_list = [];
  api_success = '';
  imagesArray: Array<Image>;
  images: Observable<Array<Image>>;
  openModalWindow = false;
  imagePointer = 0;
  savedisabled = false;
  img_save_caption = 'Save';

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private router: Router,
    private shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<ProviderBprofileSearchGalleryComponent>,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.getGalleryImages();
  }

  resetVariables() {

    this.item_pic = {
      files: [],
      base64: [],
      caption: []
    };
    this.api_success = '';
    this.success_error = null;
  }

  getGalleryImages() {


    this.provider_services.getGalleryImages()
    .subscribe(
      data => {
        this.image_list = data;
        this.loadGalleryImages(this.image_list);
      },
      error => {

      }
    );

  }

  confirmDelete(file) {
    this.shared_functions.confirmGalleryImageDelete(this, file);
  }

  deleteImage(file) {

    this.error_list = [];
    this.provider_services.deleteProviderGalleryImage(file.keyName)
    .subscribe(
      data => {
        this.shared_functions.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_DELETE);
        this.dialogRef.close('reloadlist');
        // this.getGalleryImages();
      },
      error => {
        this.error_list.push(error.error);
      }
    );

  }

  imageSelect(input, ev) {

    this.success_error = null;
    this.error_list = [];

    // console.log(input.files);
    if (input.files) {


      for ( const file of input.files) {
        this.success_error = this.shared_functions.imageValidation(file);
        if (this.success_error === true) {
          this.item_pic.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.item_pic.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        } else {
         // console.log(this.success_error);
          this.error_list.push(this.success_error);
        }


      }

    }
  }

  deleteTempImage(i) {

    this.item_pic.files.splice(i, 1);
    this.item_pic.base64.splice(i, 1);
    this.item_pic.caption.splice(i, 1);

  }

  saveImages() {
    // console.log(this.item_pic);
    this.savedisabled = true;
    this.img_save_caption = 'Uploading .. ';
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for ( const pic of this.item_pic.files) {

      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption' :  this.item_pic.caption[i] || ''
      };
      propertiesDetob[i] = properties;
      i++;
    }
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };

    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    // console.log(JSON.stringify(propertiesDet));
    submit_data.append('properties', blobPropdata);

    this.uploadApi(submit_data);

  }

  uploadApi(submit_data) {

    this.error_list = [];

    this.provider_services.uploadGalleryImages(submit_data)
    .subscribe(
      data => {
        this.resetVariables();
        this.getGalleryImages();
        this.shared_functions.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_UPLOAD);
        this.savedisabled = false;
        this.img_save_caption = 'Save';
        this.dialogRef.close('reloadlist');
      },
      error => {
        this.error_list.push(error.error);
      }
    );

  }

  showSuccessMessage(message) {

    this.api_success = message;

    setTimeout(() => {
      this.api_success = '';
    }, 2000);
  }

  loadGalleryImages(all_images) {

    this.imagesArray = [];
    let i = 0;
      for (const image of all_images) {

        const img = new Image(i, {
          img: image.url,
          description: ''
        });
        i++;
        this.imagesArray.push(img);
      }

    // this.images = Observable.of(this.imagesArray).delay(300);
  }

  openImageModal(index) {
    this.imagePointer = index; // this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  onCloseImageModal(event: ImageModalEvent) {
    this.openModalWindow = false;
    // this.openModalWindowObservable = false;
  }
}
