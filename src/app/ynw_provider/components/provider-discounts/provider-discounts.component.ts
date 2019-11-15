import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderDiscountsComponent } from '../add-provider-discounts/add-provider-discounts.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-discounts',
  templateUrl: './provider-discounts.component.html',
  styleUrls: ['./provider-discounts.component.css']
})
export class ProviderDiscountsComponent implements OnInit, OnDestroy {

  value_cap = Messages.VALUE_CAP;
  name_cap = Messages.DISC_NAME_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  desc_cap = Messages.DESCRIPTION_CAP;
  add_disc_cap = Messages.ADD_DISCOUNT_CAP;
  discount_list: any = [];
  query_executed = false;
  emptyMsg = '';
  breadcrumb_moreoptions: any = [];
  frm_dicounts_cap = Messages.FRM_LEVEL_DISCOUNTS_MSG;
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
      title: 'Discounts',
      url: '/provider/settings/pos/discounts'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  accountdialogRef;
  adddiscdialogRef;
  remdiscdialogRef;
  isCheckin;
  active_user;
  domain;
  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private router: Router,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('DISCOUNT_LISTEMPTY');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.getDiscounts(); // Call function to get the list of discount lists
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
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
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/billing->discount']);
    }
}

  addDiscounts() {
    this.accountdialogRef = this.dialog.open(AddProviderDiscountsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
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
      panelClass: ['popup-class', 'commonpopupmainclass'],
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
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
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
        () => {
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

  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'billing', 'subKey': mod };
  //   return moreOptions;
  // }
}
