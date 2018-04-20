import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

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
export class ProviderItemsComponent implements OnInit {

    item_list: any = [] ;
    query_executed = false;
    emptyMsg = Messages.ITEM_LISTEMPTY;
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
    constructor( private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
      this.getitems();
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
      const dialogRef = this.dialog.open(AddProviderItemComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass'],
        data: {
          type : 'add'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'reloadlist') {
          this.getitems();
        }
      });
    }
    editItem(obj) {
      const dialogRef = this.dialog.open(AddProviderItemComponent, {
        width: '50%',
          panelClass: ['commonpopupmainclass'],
        data: {
          item : obj,
          type : 'edit'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
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
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        data: {
          'message' : Messages.ITEM_ENABLE.replace('[status]', status_condition)
        }
      });
      dialogRef.afterClosed().subscribe(result => {
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

          }
        );
    }
    showDetails(id) {
      console.log('i am here', id);
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
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
        data: {
          'message' : Messages.ITEM_DELETE.replace('[name]', item.displayName)
        }
      });
      dialogRef.afterClosed().subscribe(result => {
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

        }
      );

    }

}
