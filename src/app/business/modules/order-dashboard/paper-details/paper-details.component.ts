import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { SubSink } from 'subsink';
import { OrderActionsComponent } from '../order-actions/order-actions.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-paper-details',
  templateUrl: './paper-details.component.html',
  styleUrls: ['./paper-details.component.css']
})
export class PaperDetailsComponent implements OnInit {
@Input() orders;
@Input() loading;
  selectedOrders: any;
  orderSelected: any[];
  providerLabels: any[];
  private subs=new SubSink();
  allLabels: any;
  constructor(
    private dialog: MatDialog,
    private provider_services: ProviderServices,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  stopprop(event) {
    event.stopPropagation();
  }


  showActionPopup(order?,timetype?) {
    if (order) {
      this.selectedOrders = order;
    }
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.selectedOrders,
        type:timetype
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      this.resetList();
      this.getLabel();
    });
  }

  resetList() {
    this.selectedOrders = [];
    this.orderSelected = [];
  }


  getLabel() {
    this.providerLabels = [];
    this.subs.sink=this.provider_services.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }


  gotoDetails(order) {
    this.router.navigate(['provider', 'orders', order.uid]);
  }

}
