import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
export class ProviderDiscountsComponent implements OnInit {

    discount_list: any = [] ;
    query_executed = false;
    emptyMsg = Messages.DISCOUNT_LISTEMPTY;
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
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
        this.getDiscounts(); // Call function to get the list of discount lists
    }

    getDiscounts() {
        this.provider_servicesobj.getProviderDiscounts()
        .subscribe(data => {
            this.discount_list = data;
            this.query_executed = true;
        });
    }
    addDiscounts() {
        const dialogRef = this.dialog.open(AddProviderDiscountsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          autoFocus: false,
          data: {
            type : 'add'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getDiscounts();
          }
        });
    }
    editDiscounts(obj) {
        const dialogRef = this.dialog.open(AddProviderDiscountsComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass'],
          autoFocus: false,
          data: {
            discount : obj,
            type : 'edit'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
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
      const dialogRef = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
        data: {
          'message' : Messages.DISCOUNT_DELETE.replace('[name]', discount.name),
          'heading' : 'Delete Confirmation'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
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

        }
      );

    }
    formatPrice(price) {
      return this.sharedfunctionObj.print_PricewithCurrency(price);
    }

}
