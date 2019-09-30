import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderServices } from '../../services/provider-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { AddProviderItemImageComponent } from '../add-provider-item-image/add-provider-item-image.component';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-items-details',
  templateUrl: './provider-items-details.component.html',
  styleUrls: ['./provider-items-details.component.css']
})
export class ProviderItemsDetailsComponent implements OnInit, OnDestroy {

  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detail_desc_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  item_detail_cap = Messages.ITEM_DETAIL_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  item_status = projectConstants.ITEM_STATUS;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Billing/POS',
      url: '/provider/settings/pos'
  },
    {
      title: 'Items',
      url: '/provider/settings/pos/items'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  editdialogRef;
  editimgdialogRef;
  remimgdialogRef;
  isCheckin;
  constructor(private provider_servicesobj: ProviderServices,
    private router: ActivatedRoute, private dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    private sharedfunctionObj: SharedFunctions) { }

  public itemId;
  public selfile: File;
  obtainedimg = false;
  item_list: any = [];
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
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
  }
  ngOnDestroy() {
    if (this.editdialogRef) {
      this.editdialogRef.close();
    }
    if (this.editimgdialogRef) {
      this.editimgdialogRef.close();
    }
    if (this.remimgdialogRef) {
      this.remimgdialogRef.close();
    }
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
            this.itemimg = this.item_list.picBig + '?r=' + rand;
          }
        }
      });
  }
  editItem() {
    this.editdialogRef = this.dialog.open(AddProviderItemComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        item: this.item_list,
        type: 'edit'
      }
    });

    this.editdialogRef.afterClosed().subscribe(() => {
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
        showimgs = this.item_list.picBig + '?r=' + rand;
      }
      this.obtainedimg = true;
      // return this.sharedfunctionObj.showitemimg(showimg);
      return showimgs;
    }
  }

  editImage(obj, mod) {
    this.editimgdialogRef = this.dialog.open(AddProviderItemImageComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: false,
      data: {
        item: obj,
        type: mod
      }
    });

    this.editimgdialogRef.afterClosed().subscribe(result => {
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
        this.item_pic.base64 = e.target['result'];
      };
      reader.readAsDataURL(fileobj);
    }
    this.img_msg = '';
  }


  onSubmit(form_data) {
    const formData: FormData = new FormData();
    formData.append('files', this.selfile, this.selfile.name);
    const propertiesDet = {
      'caption': form_data.caption
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
    this.remimgdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to remove the image?'
      }
    });
    this.remimgdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeImage();
      }
    });
  }

  removeImage() {
    this.provider_servicesobj.removeItemImage(this.item_list)
      .subscribe(() => {
        this.getitemDetails();
        this.sharedfunctionObj.openSnackBar(Messages.ITEM_IMGREMOVED);
        this.image_exists = false;
      });
  }
}
