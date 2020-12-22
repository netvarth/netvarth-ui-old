import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { OrderActionsComponent } from '../order-actions/order-actions.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  uid;
  loading = false;
  orderDetails: any = [];
  selectedType = 'list';
  customerLabel = '';
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  screenWidth;
  small_device_display = false;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices, private dialog: MatDialog,
    public location: Location, public sharedFunctions: SharedFunctions) {
    this.activaterouter.params.subscribe(param => {
      this.uid = param.id;
      this.customerLabel = this.sharedFunctions.getTerminologyTerm('customer');
      this.getOrderDetails(this.uid);
    });
  }

  ngOnInit() {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getOrderDetails(uid) {
    this.loading = true;
    this.providerservice.getProviderOrderById(uid).subscribe(data => {
      this.orderDetails = data;
      this.loading = false;
    });
  }
  goBack() {
    this.location.back();
  }
  selectViewType(type) {
    this.selectedType = type;
  }
  showOrderActions() {
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.orderDetails,
        source: 'details'
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      this.getOrderDetails(this.uid);
    });
  }
  getItemImg(item) {
    if (item.itemImages) {
      const image = item.itemImages.filter(img => img.displayImage);
      if (image[0]) {
        return image[0].url;
      } else {
        return '../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }
  showConsumerNote(item) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: item,
        type: 'order-details'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
}
