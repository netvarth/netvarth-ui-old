import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderDiscountsComponent } from '../add-provider-discounts/add-provider-discounts.component';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-discounts',
  templateUrl: './provider-discounts.component.html',
  styleUrls: ['./provider-discounts.component.css']
})
export class ProviderDiscountsComponent implements OnInit, OnDestroy {

  value_cap = Messages.VALUE_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_disc_cap = Messages.ADD_DISCOUNT_CAP;
  discount_list: any = [];
  query_executed = false;
  emptyMsg = '';
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Bill Discounts',
      url: '/provider/settings/discounts'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  accountdialogRef;
  adddiscdialogRef;
  remdiscdialogRef;
  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('DISCOUNT_LISTEMPTY');
  }

  ngOnInit() {
    this.getDiscounts(); // Call function to get the list of discount lists
  }

  ngOnDestroy() {
    if (this.accountdialogRef) {
      this.accountdialogRef.close();
    }
    if (this.adddiscdialogRef) {
      this.adddiscdialogRef.close();
    }
    if (this.remdiscdialogRef) {
      this.remdiscdialogRef.close();
    }
  }

  getDiscounts() {
    this.provider_servicesobj.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.query_executed = true;
      });
  }
  addDiscounts() {
    this.accountdialogRef = this.dialog.open(AddProviderDiscountsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });

    this.accountdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getDiscounts();
      }
    });
  }
  editDiscounts(obj) {
    this.adddiscdialogRef = this.dialog.open(AddProviderDiscountsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        discount: obj,
        type: 'edit'
      }
    });

    this.adddiscdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getDiscounts();
      }
    });
  }
  doRemoveDiscounts(discount) {
    const id = discount.id;
    if (!id) {
      return false;
    }
    this.remdiscdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('DISCOUNT_DELETE').replace('[name]', discount.name),
        'heading': 'Delete Confirmation'
      }
    });
    this.remdiscdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDiscounts(id);
      }
    });
  }


  deleteDiscounts(id) {
    this.provider_servicesobj.deleteDiscount(id)
      .subscribe(
        data => {
          this.sharedfunctionObj.openSnackBar(Messages.DISCOUNT_DELETED);
          this.getDiscounts();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }
  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

}
