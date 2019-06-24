import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { Image } from 'angular-modal-gallery';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-add-provider-waitlist-service-gallery',
  templateUrl: './add-provider-waitlist-service-gallery.html',
})
export class AddProviderWaitlistServiceGalleryComponent implements OnInit {
  item_pic = {
    files: [],
    base64: [],
    caption: []
  };
  select_image_cap = Messages.SELECT_IMAGE_CAP;
  delete_btn = Messages.DELETE_BTN;
  cancel_btn = Messages.CANCEL_BTN;
  service_gallery_cap = Messages.SERVICE_GALLERY_CAP;
  image_list: any = [];
  success_error = null;
  error_list = [];
  error_msg = '';
  api_success = '';
  imagesArray: Array<Image>;
  images: Observable<Array<Image>>;
  openModalWindow = false;
  imagePointer = 0;
  savedisabled = false;
  img_save_caption = 'Save';
  canceldisabled = false;
  api_loading = true;
  service_id = null;
  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<AddProviderWaitlistServiceGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.service_id) {
      this.service_id = this.data.service_id;
    } else {
      this.dialogRef.close();
    }
    this.api_loading = false;
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
  confirmDelete(file) {
    this.shared_functions.confirmGalleryImageDelete(this, file);
  }
  imageSelect(input) {
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
            this.error_msg = 'Please upload images with size < 5mb';
          }
        }
      }
    }
  }
  deleteTempImage(i) {
    this.item_pic.files.splice(i, 1);
    this.item_pic.base64.splice(i, 1);
    this.item_pic.caption.splice(i, 1);
    this.error_msg = '';
  }
  saveImages() {
    this.error_msg = '';
    this.error_list = [];
    this.savedisabled = true;
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
    this.error_msg = '';
    this.canceldisabled = true;
    this.provider_services.uploadServiceGallery(this.service_id, submit_data)
      .subscribe(
        () => {
          this.resetVariables();
          this.shared_functions.apiSuccessAutoHide(this, Messages.BPROFILE_IMAGE_UPLOAD);
          this.savedisabled = false;
          this.img_save_caption = 'Save';
          this.canceldisabled = false;
          this.dialogRef.close('reloadlist');
        },
        error => {
          this.error_list.push('error');
          this.img_save_caption = 'Save';
          this.savedisabled = false;
          this.canceldisabled = false;
          this.error_msg = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }
  showSuccessMessage(message) {
    this.api_success = message;
    setTimeout(() => {
      this.api_success = '';
    }, 2000);
  }
}
