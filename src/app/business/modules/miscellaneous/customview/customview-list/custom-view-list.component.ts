import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ConfirmBoxComponent } from '../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-custom-view-list',
    templateUrl: './custom-view-list.component.html'
})

export class CustomViewListComponent implements OnInit {
    customViewList: any = [];
    removeitemdialogRef;
    breadcrumbs = [
        {
            title: 'Dashboard',
            url: '/provider'
        },
        {
            title: 'Custom View List'
        }
    ];

    constructor(private _formBuilder: FormBuilder,
      private router: Router,
        public shared_functions: SharedFunctions,
        private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions,
        private provider_services: ProviderServices) {
    }
    ngOnInit() {
        this.getCustomViewList();
    }

    getCustomViewList() {
        this.provider_services.getCustomViewList().subscribe(
            (data: any) => {
                this.customViewList = data;
                console.log(this.customViewList)
            }
        );
    }
    doRemoveView(view) {
        const id = view.id;
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            'message': 'Do you want to delete this custom view?'
          }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.deleteItem(id);
          }
        });
      }
      deleteItem(id) {
        this.provider_services.deleteCustomView(id)
          .subscribe(
            () => {
              this.getCustomViewList();
            },
            error => {
              this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
      addView() {
        this.router.navigate(['provider/settings/miscellaneous/customview/add']);
    }
}