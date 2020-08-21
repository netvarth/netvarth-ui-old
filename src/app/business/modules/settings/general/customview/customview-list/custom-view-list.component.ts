import { Component, OnInit } from '@angular/core';
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
  breadcrumb_moreoptions: any = [];
  domain: any;
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

  constructor(
    private router: Router,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions,
    private provider_services: ProviderServices) {
  }
  ngOnInit() {
    this.api_loading = true;
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = {
      'show_learnmore': true, 'scrollKey': 'general->customview', 'classname': 'b-service',
      'actions': [
        { 'title': 'Help', 'type': 'learnmore' }]
    };
    this.getCustomViewList();
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/general->customview']);
    }
  }

  getCustomViewList() {
    this.customViewList = [];
    this.api_loading = true;
    this.provider_services.getCustomViewList().subscribe(
      (data: any) => {
        this.customViewList = data;
        this.api_loading = false;
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
    this.api_loading = true;
    this.provider_services.deleteCustomView(id)
      .subscribe(
        () => {
          this.getCustomViewList();
          this.api_loading = false;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }
  addView() {
    this.router.navigate(['provider/settings/general/customview/add']);
  }
}
