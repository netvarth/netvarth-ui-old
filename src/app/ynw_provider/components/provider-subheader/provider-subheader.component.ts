import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddProviderCustomerComponent } from '../add-provider-customer/add-provider-customer.component';


@Component({
    selector: 'app-provider-subheader',
    templateUrl: './provider-subheader.component.html',
    // styleUrls: ['./home.component.scss']
})



export class ProviderSubeaderComponent implements OnInit {

  @Input() activeTab: string;
  userdet: any = [];
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  createCustomer() {

    const dialogRef = this.dialog.open(AddProviderCustomerComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass'],
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
