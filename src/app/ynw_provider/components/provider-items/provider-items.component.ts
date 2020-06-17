import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';

@Component({
  selector: 'app-provider-items',
  templateUrl: './provider-items.component.html',
  styleUrls: ['./provider-items.component.css']
})
export class ProviderItemsComponent implements OnInit, OnDestroy {

  name_cap = Messages.ITEM_NAME_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_item_cap = Messages.ADD_ITEM_CAP;
  item_enable_btn = Messages.ITEM_ENABLE_CAP;
  item_list: any = [];
  query_executed = false;
  emptyMsg = '';
  domain;
  breadcrumb_moreoptions: any = [];
  frm_items_cap = Messages.FRM_LEVEL_ITEMS_MSG;
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
  item_status = projectConstants.ITEM_STATUS;
  breadcrumbs = this.breadcrumbs_init;
  itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
  additemdialogRef;
  edititemdialogRef;
  statuschangedialogRef;
  removeitemdialogRef;
  isCheckin;
  active_user;

  constructor(private provider_servicesobj: ProviderServices,
    public shared_functions: SharedFunctions,
    private router: Router, private dialog: MatDialog,
    private routerobj: Router,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('ITEM_LISTEMPTY');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    
    this.getitems();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
  }
  ngOnDestroy() {
    if (this.additemdialogRef) {
      this.additemdialogRef.close();
    }
    if (this.edititemdialogRef) {
      this.edititemdialogRef.close();
    }
    if (this.statuschangedialogRef) {
      this.statuschangedialogRef.close();
    }
    if (this.removeitemdialogRef) {
      this.removeitemdialogRef.close();
    }
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/billing->items']);
    }
}

  getitems() {
    this.provider_servicesobj.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.query_executed = true;
      });
  }
  getItemPic(img) {
    return this.sharedfunctionObj.showlogoicon(img);
  }

  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

  addItem() {
    this.additemdialogRef = this.dialog.open(AddProviderItemComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });

    this.additemdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getitems();
      }
    });
  }
  editItem(obj) {
    this.edititemdialogRef = this.dialog.open(AddProviderItemComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        item: obj,
        type: 'edit'
      }
    });

    this.edititemdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getitems();
      }
    });
  }

  dochangeStatus(item) {
    if (item.status === 'ACTIVE') {
      this.provider_servicesobj.disableItem(item.itemId).subscribe(
        () => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    } else {
      this.provider_servicesobj.enableItem(item.itemId).subscribe(
        () => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    }
  }
  changeStatus(itemid) {
    this.provider_servicesobj.enableItem(itemid)
      .subscribe(
        () => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  showDetails(id) {
    if (!id) {
      return;
    }
    this.router.navigate(['provider', 'settings', 'pos', 'items', id]);
  }

  doRemoveItem(item) {
    const id = item.itemId;
    if (!id) {
      return false;
    }
    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('ITEM_DELETE').replace('[name]', item.displayName)
      }
    });
    this.removeitemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteItem(id);
      }
    });
  }

  deleteItem(id) {
    this.provider_servicesobj.deleteItem(id)
      .subscribe(
        () => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
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
