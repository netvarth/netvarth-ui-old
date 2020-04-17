import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material';
import { ConfirmBoxComponent } from '../../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { Router } from '@angular/router';
import { Messages } from '../../../../../../shared/constants/project-messages';

@Component({
  selector: 'app-custom-view-list',
  templateUrl: './custom-view-list.component.html'
})

export class CustomViewListComponent implements OnInit {
  api_loading: boolean;
  customViewList: any = [];
  removeitemdialogRef;
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      url: '/provider/settings/general',
      title: Messages.GENERALSETTINGS
    },
    {
      title: 'Custom Views'
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
    this.api_loading = true;
    this.getCustomViewList();
  }

  getCustomViewList() {
    this.provider_services.getCustomViewList().subscribe(
      (data: any) => {
        this.customViewList = data;
        this.api_loading = false;
        console.log(this.customViewList);
      },
      (error: any) => {
        this.api_loading = false;
      });
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
    this.router.navigate(['provider/settings/general/customview/add']);
  }
}
