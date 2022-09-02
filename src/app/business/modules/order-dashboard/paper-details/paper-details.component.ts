import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { SubSink } from 'subsink';
import { OrderActionsComponent } from '../order-actions/order-actions.component';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';


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
  private subs = new SubSink();
  allLabels: any;
  users: any;
  selectedUser: any;
  constructor(
    private dialog: MatDialog,
    private provider_services: ProviderServices,
    public router: Router,
    private groupService: GroupStorageService,

  ) { }

  ngOnInit(): void {
    this.getProviders();
  }

  stopprop(event) {
    event.stopPropagation();
  }


  showActionPopup(order?, timetype?) {
    if (order) {
      this.selectedOrders = order;
    }
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.selectedOrders,
        type: timetype
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
    this.subs.sink = this.provider_services.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }


  getProviders() {
    const apiFilter = {};
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      console.log("this.users", this.users);
      if (this.groupService.getitemFromGroupStorage('appt-selectedUser')) {
        this.selectedUser = this.groupService.getitemFromGroupStorage('appt-selectedUser');
        console.log("If selected user", this.selectedUser)
      } else {
        if (this.users && this.users[0]) {
          this.selectedUser = this.users[0];
          console.log("else selected user", this.selectedUser)
        }
        else {
          this.selectedUser = false;
          console.log("else else selected user", this.selectedUser)
        }
      }
    });
  }

  gotoDetails(order) {
    this.router.navigate(['provider', 'orders', order.uid]);
  }

}
