import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-items',
  templateUrl: './provider-items.component.html',
  styleUrls: ['./provider-items.component.css']
})
export class ProviderItemsComponent implements OnInit, OnDestroy {

  name_cap = Messages.PRO_NAME_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_item_cap = Messages.ADD_ITEM_CAP;
  item_enable_btn = Messages.ITEM_ENABLE_CAP;
  item_list: any = [];
  query_executed = false;
  emptyMsg = '';
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Items',
      url: '/provider/settings/items'
    }
  ]
  item_status = projectConstants.ITEM_STATUS;
  breadcrumbs = this.breadcrumbs_init;
  itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
  additemdialogRef;
  edititemdialogRef;
  statuschangedialogRef;
  removeitemdialogRef;
  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('ITEM_LISTEMPTY');
  }

  ngOnInit() {
    this.getitems();
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
      panelClass: ['commonpopupmainclass'],
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
      panelClass: ['commonpopupmainclass'],
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
        data => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    }
    else {
      this.provider_servicesobj.enableItem(item.itemId).subscribe(
        data => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    }
  }
  changeStatus(itemid, tochstatus) {
    this.provider_servicesobj.enableItem(itemid)
      .subscribe(
        data => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  //   disableService(service, msg) {
  //     this.provider_services.disableService(service.id)
  //         .subscribe(
  //             data => {
  //                 this.getServiceDetail();
  //                 const snackBarRef = this.shared_Functionsobj.openSnackBar(msg);
  //             },
  //             error => {
  //                 const snackBarRef = this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //                 this.getServiceDetail();
  //             });
  // }

  // enableService(service, msg) {
  //     this.provider_services.enableService(service.id)
  //         .subscribe(
  //             data => {
  //                 this.getServiceDetail();
  //                 const snackBarRef = this.shared_Functionsobj.openSnackBar(msg);
  //             },
  //             error => {
  //                 const snackBarRef = this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //                 this.getServiceDetail();
  //             });
  // }


  showDetails(id) {
    if (!id) {
      return;
    }
    this.router.navigate(['provider', 'settings', 'items', id]);
  }

  doRemoveItem(item) {
    const id = item.itemId;
    if (!id) {
      return false;
    }
    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
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
        data => {
          this.getitems();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }

}
