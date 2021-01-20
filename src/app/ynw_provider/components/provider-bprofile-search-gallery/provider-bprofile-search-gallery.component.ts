import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { Image } from '@ks89/angular-modal-gallery';
import { Observable } from 'rxjs';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-provider-bprofile-search-gallery',
  templateUrl: './provider-bprofile-search-gallery.component.html',
  styleUrls: ['./provider-bprofile-search-gallery.scss']
})

export class ProviderBprofileSearchGalleryComponent implements OnInit {

  gallery_cap = Messages.SEARCH_GALLERY_CAP;
  delete_btn_cap = Messages.DELETE_BTN;
  select_img_file_cap = Messages.SEARCH_GALLERY_SELEC_IMG_FILE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;

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
  canceldisabled = false;
  img_save_caption = 'Upload';
  error_msg = '';
  uploading = false;

  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    public dialogRef: MatDialogRef<ProviderBprofileSearchGalleryComponent>) { }

  ngOnInit() {
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
        });
  }
  confirmDelete(file) {
    this.shared_functions.confirmGalleryImageDelete(this, file);
  }
  deleteImage(file) {
    this.error_list = [];
    this.provider_services.deleteProviderGalleryImage(file.keyName)
      .subscribe(
        () => {
          this.wordProcessor.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_DELETE);
          this.dialogRef.close('reloadlist');
        },
        error => {
          this.error_list.push(this.shared_functions.getApiError(error));
        }
      );
  }
  imageSelect(input, ev) {
    this.success_error = null;
    this.error_list = [];
    if (input.files) {
      for (const file of input.files) {
        this.success_error = this.shared_functions.imageValidation(file);
        if (this.success_error === true) {
          this.item_pic.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.item_pic.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        } else {
          this.error_list.push(this.success_error);
          if (this.error_list[0].type) {
            this.error_msg = 'Selected image type not supported';
          } else if (this.error_list[0].size) {
            this.error_msg = 'Please upload images with size less than 15mb';
          }
        }
      }
    }
  }
  deleteTempImage(i) {
    this.item_pic.files.splice(i, 1);
    this.item_pic.base64.splice(i, 1);
    this.item_pic.caption.splice(i, 1);
    this.savedisabled = false;
    this.img_save_caption = 'Upload';
    this.error_msg = null;
  }
  saveImages() {
    this.savedisabled = true;
    this.canceldisabled = true;
    this.img_save_caption = 'Uploading .. ';
    const submit_data: FormData = new FormData();
    const propertiesDetob = {};
    let i = 0;
    for (const pic of this.item_pic.files) {
      submit_data.append('files', pic, pic['name']);
      const properties = {
        'caption': this.item_pic.caption[i] || ''
      };
      propertiesDetob[i] = properties;
      i++;
    }
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    this.uploadApi(submit_data);
  }
  uploadApi(submit_data) {
    this.error_list = [];
    this.uploading = true;
    this.provider_services.uploadGalleryImages(submit_data)
      .subscribe(
        () => {
          this.resetVariables();
          this.getGalleryImages();
          this.wordProcessor.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_UPLOAD);
          this.savedisabled = false;
          this.canceldisabled = false;
          this.img_save_caption = 'Upload';
          this.dialogRef.close('reloadlist');
          this.uploading = false;
        },
        error => {
          this.error_list.push(this.wordProcessor.getProjectErrorMesssages(error));
          this.error_msg = this.wordProcessor.getProjectErrorMesssages(error);
          this.canceldisabled = false;
          this.uploading = false;
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
  }
  openImageModal(index) {
    this.imagePointer = index; // this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }
  onCloseImageModal() {
    this.openModalWindow = false;
  }
}
