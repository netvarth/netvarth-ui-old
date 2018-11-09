import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import { Router, NavigationEnd } from '@angular/router';

import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
@Component({
  selector: 'app-addprovider-wailist-service',
  templateUrl: './add-provider-waitlist-service.component.html'
})

export class AddProviderWaitlistServiceComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  error_msg = null;
  number_decimal_pattern = '^[0-9]+\.?[0-9]*$';
  number_pattern = projectConstants.VALIDATOR_NUMBERONLY;
  service;
  base_licence = false;
  gallery: any = [];
  images: Observable<Array<Image>>;
  openModalWindow = false;
  imagePointer = 0;
  item_pic = {
    files: [],
    base64: [],
    caption: []
  };
  success_error = null;
  error_list = [];
  type = 'add';
  button_title = 'Save';
  payment_loading = false;
  payment_settings: any = [];
  tooltip = Messages.NEW_SERVICE_TOOLTIP;
  mode = 'normal';
  normaladd_msg1 = this.shared_functions.getProjectMesssages('SERVICE_ADDED1');
  normaladd_msg2 = this.shared_functions.getProjectMesssages('SERVICE_ADDED2');
  disable_price = true;
  taxDetails: any = [];
  taxpercentage = 0;

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public router: Router
    ) {}

  ngOnInit() {

     const user = this.shared_functions.getitemfromLocalStorage('ynw-user');
     this.type = this.data.type;
     const package_id = (user['accountLicenseDetails']['accountLicense']['licPkgOrAddonId']) ?
     user['accountLicenseDetails']['accountLicense']['licPkgOrAddonId'] : null;
     this.base_licence = (package_id === 1) ? true : false;
     if (user['sector'] === 'foodJoints') { // this is to decide whether the price field is to be displayed or not
        this.disable_price = true;
     } else {
       this.disable_price = false;
     }

     this.getTaxpercentage();
     this.createForm();
     if (this.data.type === 'edit') {
      this.service = this.data.service;
      this.setValue(this.service);
      this.getGalleryImages();
      this.button_title = 'Update';
     }
  }

  getGalleryImages () {
    const service_id = this.service.id;
    this.provider_services.getServiceGallery(service_id)
    .subscribe(
      data => {
        this.gallery = data;
        this.loadGalleryImages(this.gallery);
      },
      error => {

      }
    );
  }
  getTaxpercentage() {
    this.provider_services.getTaxpercentage()
        .subscribe (data => {
            this.taxDetails = data;
            this.taxpercentage = this.taxDetails.taxPercentage;
            console.log('tax percentage', this.taxpercentage);
        },
    error => {

    });
  }

  taxapplicableChange() {
    // console.log('tax applicable', this.taxpercentage);
    if (this.taxpercentage <= 0) {
      // console.log('reached here', this.taxpercentage);
      this.api_error = this.shared_functions.getProjectMesssages('SERVICE_TAX_ZERO_ERROR');
      setTimeout(() => {
        this.api_error = null;
      }, projectConstants.TIMEOUT_DELAY_LARGE);
      this.amForm.get('taxable').setValue(false);
    } else {
      this.api_error = null;
    }
  }

  createForm() {
    if (this.disable_price) {
      this.amForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        description: ['', Validators.compose([Validators.maxLength(500)])],
        // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
        serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
       // totalAmount: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
       // isPrePayment: [{'value': false , 'disabled': this.base_licence }],
       // taxable: [false],
        notification: [false]
        });
    } else {
      this.amForm = this.fb.group({
          name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
          description: ['', Validators.compose([Validators.maxLength(500)])],
          // serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])],
          serviceDuration: ['', Validators.compose([Validators.required, Validators.pattern(this.number_pattern), Validators.maxLength(10)])],
          totalAmount: ['', Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern), Validators.maxLength(10)])],
          isPrePayment: [{'value': false , 'disabled': this.base_licence }],
          taxable: [false],
          notification: [false]
          });
      }
  }

  setValue(data) {
    // console.log(data, data['taxable'] );
    if (this.disable_price) {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        /*'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value,
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
                                data['minPrePaymentAmount'] !== 0
                                ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,*/
        'notification': data['notification'] || this.amForm.get('notification').value,
      });
    } else {
      this.amForm.setValue({
        'name': data['name'] || this.amForm.get('name').value,
        'description': data['description'] || this.amForm.get('description').value,
        'serviceDuration': data['serviceDuration'] || this.amForm.get('serviceDuration').value,
        'totalAmount': data['totalAmount'] || this.amForm.get('totalAmount').value,
        'isPrePayment': (!this.base_licence && data['minPrePaymentAmount'] &&
                                data['minPrePaymentAmount'] !== 0
                                ) ? true : false,
        'taxable': data['taxable'] || this.amForm.get('taxable').value,
        'notification': data['notification'] || this.amForm.get('notification').value,
      });
    }
    this.changeNotification();
    this.changePrepayment();
  }

  onSubmit (form_data) {
    this.resetApiErrors();
    form_data.bType = 'Waitlist';
    if (this.disable_price) {
      form_data['totalAmount'] = 0;
      form_data['isPrePayment'] = false;
      form_data['taxable'] = false;
    } else {
      form_data.minPrePaymentAmount = (!form_data.isPrePayment || form_data.isPrePayment === false) ?
                                      0 : form_data.minPrePaymentAmount;
      form_data.isPrePayment = (!form_data.isPrePayment || form_data.isPrePayment === false) ? false : true;
    }
    if (this.data.type === 'add') {
       this.createService(form_data);
    } else if (this.data.type === 'edit') {
      form_data.id = this.service.id;
      this.updateService(form_data);
      // this.saveImages();
    }
  }

  createService(post_data) {

    this.provider_services.createService(post_data)
    .subscribe(
      data => {
        const service_id = data;
        this.service = [];
        this.service['id'] = service_id;
        if (this.item_pic.files.length > 0) {
          this.saveImages('add');
        } else {
          // this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_ADDED'));
          this.mode = 'afteradd';
        }

      },
      error => {
        this.api_error = this.shared_functions.getProjectErrorMesssages(error);
      }
    );
  }

  updateService(post_data) {
    this.provider_services.updateService(post_data)
    .subscribe(
      data => {
        if (this.item_pic.files.length > 0) {
          this.saveImages('edit');
        } else {
          this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_UPDATED'));
        }
      },
      error => {
        this.api_error = this.shared_functions.getProjectErrorMesssages(error);
      }
    );
  }

  changeNotification() {
    if (this.amForm.get('notification').value === false) {
      this.amForm.removeControl('notificationType');
    } else {

      const value = (this.data.type === 'edit' && this.service['notificationType']) ?
      this.service['notificationType'] : 'email';
      this.amForm.addControl('notificationType',
      new FormControl(value));
    }
  }

  changePrepayment() {
    if (!this.disable_price) {
      if (this.amForm.get('isPrePayment').value === false) {
        this.amForm.removeControl('minPrePaymentAmount');
      } else {
        if (this.amForm.get('isPrePayment').value === true) {
          this.getPaymentSettings();
        }
        const value = (this.data.type === 'edit' && this.service['minPrePaymentAmount']) ?
        this.service['minPrePaymentAmount'] : '';

        this.amForm.addControl('minPrePaymentAmount',
      new FormControl(value, Validators.compose([Validators.required, Validators.pattern(this.number_decimal_pattern)])));
      }
    }
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
            console.log(this.success_error);
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

  saveImages(from) {
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

    this.uploadApi(submit_data, from);

  }

  uploadApi(submit_data, from) {

    this.provider_services.uploadServiceGallery(this.service.id, submit_data)
    .subscribe(
      data => {
        this.getGalleryImages();
        this.resetVariables();
        if (from === 'add') {
          // this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_ADDED'));
          this.mode = 'afteradd';
        } else if (from === 'edit') {
          this.closePopup(this.shared_functions.getProjectMesssages('SERVICE_UPDATED'));
        }
      },
      error => {

      }
    );

  }

  loadGalleryImages(all_images) {

        const imagesArray = [];
          let i = 0;
          for (const image of all_images) {

            // const img =  new Image(
            //               image.url,
            //               image.thumbUrl, // no thumb
            //               image.caption, // no description
            //               null
            //             );
            const img = new Image(i, {
              img: image.url,
              description: ''
            });
            i++;
            imagesArray.push(img);
          }

        this.images = Observable.of(imagesArray).delay(300);
  }

  openImageModal(index) {
    this.imagePointer = index; // this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  onCloseImageModal(event: ImageModalEvent) {
    this.openModalWindow = false;
    // this.openModalWindowObservable = false;
  }

  confirmDelete(file) {
    this.shared_functions.confirmGalleryImageDelete(this, file);
  }

  deleteImage(file) {
    this.provider_services.deleteServiceGalleryImage(this.service.id, file.keyName)
    .subscribe(
      data => {
        this.shared_functions.apiSuccessAutoHide(this, Messages.SERVICE_IMAGE_DELETED);
        this.getGalleryImages();
      },
      error => {
        this.shared_functions.apiErrorAutoHide(this, error);
      }
    );

  }

  deleteTempImage(i) {

    this.item_pic.files.splice(i, 1);
    this.item_pic.base64.splice(i, 1);
    this.item_pic.caption.splice(i, 1);

  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
    this.error_msg = null;
    this.error_list = [];
  }

  resetVariables() {
    this.item_pic = {
      files: [],
      base64: [],
      caption: []
    };
    this.resetApiErrors();
    this.success_error = null;
  }

  closePopup(message) {
    this.api_success = message;
    setTimeout(() => {
      this.dialogRef.close('reloadlist');
      }, projectConstants.TIMEOUT_DELAY);
  }

  getPaymentSettings() {
    this.payment_loading = true;
    this.provider_services.getPaymentSettings()
    .subscribe(
      data => {
        // console.log('paysettings', data);
        this.payment_settings = data;
        this.payment_loading = false;
        if (!this.payment_settings.onlinePayment) {
          this.shared_functions.apiErrorAutoHide(this, Messages.SERVICE_PRE_PAY_ERROR);
          if (!this.disable_price) {
            this.amForm.get('isPrePayment').setValue(false);
            this.changePrepayment();
          }
        }
      },
      error => {
        // this.shared_functions.apiErrorAutoHide(this, error);
        // this.amForm.get('isPrePayment').setValue(false);
      }
    );
  }
  gotoManageQueue() {
    this.dialogRef.close('reloadlist');
    this.router.navigate(['/provider/settings/waitlist-manager/queues']);
  }

}
