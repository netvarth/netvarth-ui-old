import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderItemComponent } from '../add-provider-item/add-provider-item.component';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-items',
  templateUrl: './provider-items.component.html',
  styleUrls: ['./provider-items.component.css']
})
export class ProviderItemsComponent implements OnInit, OnDestroy {

    item_list: any = [] ;
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
    ];
    breadcrumbs = this.breadcrumbs_init;
    itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
    additemdialogRef;
    edititemdialogRef;
    statuschangedialogRef;
    removeitemdialogRef;
    constructor( private provider_servicesobj: ProviderServices,
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
          type : 'add'
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
          item : obj,
          type : 'edit'
        }
      });

      this.edititemdialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          this.getitems();
        }
      });
    }

    dochangeStatus(item) {
      if (!item) {
        return false;
      }
      let status_condition = '';
      switch (item.status) {
        case 'ACTIVE':
          status_condition = 'INACTIVE';
        break;
        case 'INACTIVE':
          status_condition = 'ACTIVE';
        break;
      }
      this.statuschangedialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        data: {
          'message' : this.sharedfunctionObj.getProjectMesssages('ITEM_ENABLE').replace('[status]', status_condition)
        }
      });
      this.statuschangedialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.changeStatus(item.itemId, status_condition);
        }
      });
    }
    changeStatus(itemid, tochstatus) {
      this.provider_servicesobj.enableItem(itemid)
       .subscribe(
          data => {
            this.getitems();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          }
        );
    }
    showDetails(id) {
      if (!id) {
        return ;
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
        panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message' : this.sharedfunctionObj.getProjectMesssages('ITEM_DELETE').replace('[name]', item.displayName)
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
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );

    }

}
