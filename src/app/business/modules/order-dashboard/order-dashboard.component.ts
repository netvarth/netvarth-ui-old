import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { OrderActionsComponent } from './order-actions/order-actions.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DisplaylabelpopupComponent } from './displaylabel/displaylabel.component';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss']
})
export class OrderDashboardComponent implements OnInit {
  businessName;
  historyOrders: any = [];
  orders: any = [];
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_STARTS_MONTH;
  historyOrdersCount;
  loading = false;
  orderSelected: any = [];
  showFilterSection = false;
  filterapplied = false;
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    patientId: '',
    payment_status: 'all',
    orderNumber: '',
    orderStatus: 'all',
    orderMode: 'all'
  }; // same in resetFilter Fns
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    patientId: false,
    payment_status: false,
    orderNumber: false,
    orderStatus: false,
    orderMode: false
  };

  customerIdTooltip = '';
  customer_label = '';
  selected_type = 'all';
  orderStatusFilter: any = [];
  orderModesList = projectConstantsLocal.ORDER_MODES;
  paymentStatusList = projectConstantsLocal.PAYMENT_STATUSES;
  orderStatuses: any = [];
  orderModes: any = [];
  paymentStatuses: any = [];
  selectedOrders: any = [];
  selectedTab;
  historyOrdertype = '';
  todayOrdersCount;
  futureOrdersCount;
  payStatusClassList = projectConstantsLocal.PAYMENT_STATUS_CLASS;
  billPaymentStatuses = projectConstantsLocal.BILL_PAYMENT_STATUS_WITH_DISPLAYNAME;
  pos: any;
  allLabels: any = [];
  providerLabels: any = [];
  tooltipcls = '';
  labelMultiCtrl: any = [];
  labelFilter: any = [];
  labelFilterData = '';
  labelsCount: any = [];
  selectedLabels: any = [];
  allLabelSelected: any = [];
  displayLabeldialogRef;
  filterHeight;
  constructor(public sharedFunctions: SharedFunctions,
    public router: Router, private dialog: MatDialog,
    public providerservices: ProviderServices,
    public shared_functions: SharedFunctions,
    public dateformat: DateFormatPipe,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService) {
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenHeight = window.innerHeight;
    this.filterHeight = screenHeight - 60;
  }
  ngOnInit() {
    const businessdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    this.businessName = businessdetails.bn;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' id';
    if (this.groupService.getitemFromGroupStorage('orderTab')) {
      this.selectedTab = this.groupService.getitemFromGroupStorage('orderTab');
    } else {
      this.selectedTab = 1;
    }
    this.getPos();
    this.getLabel();
    this.getDefaultCatalogStatus();
    this.doSearch();
    this.getProviderTodayOrdersCount();
    this.getProviderFutureOrdersCount();
    this.getProviderHistoryOrdersCount();
  }
  setTabSelection(type) {
    this.selectedTab = type;
    this.groupService.setitemToGroupStorage('orderTab', this.selectedTab);
    switch (type) {
      case 1: {
        this.getProviderTodayOrders();
        this.getProviderTodayOrdersCount();

        break;
      }
      case 2: {
        this.getProviderFutureOrders();
        this.getProviderFutureOrdersCount();

        break;
      }
      case 3: {
        this.getProviderHistoryOrders();
        this.getProviderHistoryOrdersCount();

        break;
      }
    }
  }
  tabChange(event) {
    this.hideFilterSidebar();
    this.resetFilter();
    this.resetFilterValues();
    this.resetLabelFilter();
    this.filterapplied = false;
    this.setTabSelection(event.index + 1);
  }
  gotoDetails(order) {
    this.router.navigate(['provider', 'orders', order.uid]);
  }
  showActionPopup(order?) {
    if (order) {
      this.selectedOrders = order;
    }
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.selectedOrders
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      this.resetList();
      this.doSearch();
    });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  getProviderTodayOrders() {
    this.loading = true;
    let filter = {};
    filter = this.setFilterForApi();
    this.providerservices.getProviderTodayOrders(filter).subscribe(data => {
      this.orders = data;
      this.loading = false;
    });
  }

  getProviderFutureOrders() {
    this.loading = true;
    let filter = {};
    filter = this.setFilterForApi();
    this.providerservices.getProviderFutureOrders(filter).subscribe(data => {
      this.orders = data;
      this.loading = false;
    });
  }
  getProviderFutureOrdersCount() {
    let filter = {};
    filter = this.setFilterForApi();
    this.providerservices.getProviderFutureOrdersCount(filter).subscribe(data => {
      this.futureOrdersCount = data;
    });
  }
  getProviderTodayOrdersCount() {
    let filter = {};
    filter = this.setFilterForApi();
    this.providerservices.getProviderTodayOrdersCount(filter).subscribe(data => {
      this.todayOrdersCount = data;
    });
  }
  getProviderHistoryOrders() {
    this.loading = true;
    let filter = {};
    filter = this.setFilterForApi();
    console.log(filter);
    this.providerservices.getProviderHistoryOrders(filter).subscribe(data => {
      this.historyOrders = data;
      this.loading = false;
    });
  }
  getProviderHistoryOrdersCount() {
    let filter = {};
    filter = this.setFilterForApi();
    this.providerservices.getProviderHistoryOrdersCount(filter).subscribe(data => {
      this.historyOrdersCount = data;
    });
  }
  checkOrder(order, index) {
    if (!this.orderSelected[index]) {
      this.orderSelected[index] = true;
      this.selectedOrders.push(order);
    } else {
      this.orderSelected[index] = false;
      const indx = this.selectedOrders.indexOf(order);
      this.selectedOrders.splice(indx, 1);
    }
  }
  showFilter() {
    this.showFilterSection = true;
  }
  hideFilterSidebar() {
    this.showFilterSection = false;
  }
  clearFilter() {
    this.resetFilter();
    this.resetFilterValues();
    this.resetLabelFilter();
    this.filterapplied = false;
    this.doSearch();
  }
  resetList() {
    this.selectedOrders = [];
    this.orderSelected = [];
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      patientId: false,
      orderNumber: false,
      orderStatus: false,
      orderMode: false,
      payment_status: false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      patientId: '',
      payment_status: 'all',
      orderNumber: '',
      orderStatus: 'all',
      orderMode: 'all'
    };
  }
  doSearch() {
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.patientId ||
      this.filter.payment_status !== 'all' || this.filter.orderNumber || this.orderStatuses.length > 0 || this.orderModes.length > 0 || this.paymentStatuses.length > 0 || this.labelFilterData !== '') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.setTabSelection(this.selectedTab);
  }
  keyPressed(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  handleOrderType(type) {
    this.selected_type = type;
    this.doSearch();
  }
  resetFilterValues() {
    this.orderStatuses = [];
    this.orderModes = [];
    this.paymentStatuses = [];
    this.selectedLabels = [];
    this.allLabelSelected = [];
  }
  setFilterDataCheckbox(type, value?) {
    if (type === 'homeDelivery' || 'storePickup') {
      this.historyOrdertype = type;
    }
    if (type === 'orderStatus') {
      const indx = this.orderStatuses.indexOf(value);
      this.orderStatuses = [];
      if (indx === -1) {
        this.orderStatuses.push(value);
      }
    }
    if (type === 'orderMode') {
      const indx = this.orderModes.indexOf(value);
      this.orderModes = [];
      if (indx === -1) {
        this.orderModes.push(value);
      }
    }
    if (type === 'payment') {
      const indx = this.paymentStatuses.indexOf(value);
      this.paymentStatuses = [];
      if (indx === -1) {
        this.paymentStatuses.push(value);
      }
    }
    this.doSearch();
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.selectedTab === 3) {
      if (this.historyOrdertype === 'homeDelivery') {
        api_filter['homeDelivery-eq'] = true;
      }
      if (this.historyOrdertype === 'storePickup') {
        api_filter['storePickup-eq'] = true;
      }
    } else {
      if (this.selected_type === 'homeDelivery') {
        api_filter['homeDelivery-eq'] = true;
      }
      if (this.selected_type === 'storePickup') {
        api_filter['storePickup-eq'] = true;
      }
    }
    if (this.orderStatuses.length > 0) {
      api_filter['orderStatus-eq'] = this.orderStatuses.toString();
    }
    if (this.orderModes.length > 0) {
      api_filter['orderMode-eq'] = this.orderModes.toString();
    }
    if (this.paymentStatuses.length > 0) {
      api_filter['paymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.orderNumber !== '') {
      api_filter['orderNumber-eq'] = this.filter.orderNumber;
    }
    if (this.filter.patientId !== '') {
      api_filter['jaldeeId-eq'] = this.filter.patientId;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNumber-eq'] = this.filter.phone_number;
    }
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
    }
    return api_filter;
  }
  getDefaultCatalogStatus() {
    this.providerservices.getDefaultCatalogStatuses().subscribe(data => {
      this.orderStatusFilter = data;
    });
  }
  refresh() {
    if (this.selectedTab === 1) {
      this.getProviderTodayOrders();
      this.getProviderTodayOrdersCount();
    }
    if (this.selectedTab === 2) {
      this.getProviderFutureOrders();
      this.getProviderFutureOrdersCount();
    }
  }
  getPayClass(order) {
    if (order.bill) {
      const retdet = this.payStatusClassList.filter(
        soc => soc.value === order.bill.billPaymentStatus);
      const returndet = retdet[0].class;
      return returndet;
    } else {
      return 'red';
    }
  }
  gotoBill(order) {
    if (this.pos && (order.orderStatus !== 'Cancelled' || (order.orderStatus === 'Cancelled' && order.bill && order.bill.billPaymentStatus !== 'NotPaid'))) {
      this.providerservices.getWaitlistBill(order.uid)
        .subscribe(
          data => {
            this.router.navigate(['provider', 'bill', order.uid], { queryParams: { source: 'order' } });
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    } else {
      this.gotoDetails(order);
    }
  }
  getPaymentTooltip(order) {
    if (order.bill && order.bill.billPaymentStatus) {
      return this.billPaymentStatuses[order.bill.billPaymentStatus];
    } else {
      return 'Not Paid';
    }
  }
  showConsumerNote(order) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: order,
        type: 'order'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  getPos() {
    this.providerservices.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }

  resetLabelFilter() {
    this.labelMultiCtrl = [];
    this.labelFilter = [];
    this.labelFilterData = '';
  }
  // labelClick() {
  //   this.showLabels = true;
  // }
  getLabel() {
    this.providerLabels = [];
    this.providerservices.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }
  getDisplayname(label) {
    for (let i = 0; i < this.allLabels.length; i++) {
      if (this.allLabels[i].label === label) {
        return this.allLabels[i].displayName;
      }
    }
  }
  getDisplayformatOflabel(labeldetails) {
    if (labeldetails.label) {
      let labelString = ' ';
      let len;
      Object.keys(labeldetails.label).forEach(key => {
        labelString = labelString + key + ' ';
      });
      if (labelString.length > 40) {
        len = 0;
      } else {
        len = 1;
      }
      return len;
    }
  }

  
  getDisplayformatTruncateLabel(labeldetails) {
    let labelString = ' ';
    Object.keys(labeldetails.label).forEach(key => {
      labelString = labelString + this.getDisplayname(key) + ' ';
    });
    if (labelString.length > 40) {
      labelString = labelString.substr(0, 40);
    }
    return labelString;
  }
  displayLabel(order) {
    this.displayLabeldialogRef = this.dialog.open(DisplaylabelpopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: order

    });
    this.displayLabeldialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  labelfilterClicked(index, label) {
    delete this.labelMultiCtrl[label];
    this.labelFilter[index] = !this.labelFilter[index];
    if (!this.labelFilter[index]) {
      this.doSearch();
    }
  }
  labelSelection() {
    this.labelFilterData = '';
    this.labelsCount = [];
    let count = 0;
    Object.keys(this.selectedLabels).forEach(key => {
      if (this.selectedLabels[key].length > 0) {
        count++;
        if (!this.labelFilterData.includes(key)) {
          // const labelvalues = this.selectedLabels[key].join(',');
          // const labelvaluesArray = labelvalues.split(',');
          // for (const value of labelvaluesArray) {
          //   const lblFilter = key + '::' + value;
          //   const Mfilter = this.setFilterForApi();
          //   Mfilter['label-eq'] = lblFilter;
          //   const promise = this.getHistoryWLCount(Mfilter);
          //   promise.then(
          //     result => {
          //       if (this.labelsCount.indexOf(value + ' - ' + result) === -1) {
          //         this.labelsCount.push(value + ' - ' + result);
          //       }
          //     });
          // }
          if (count === 1) {
            this.labelFilterData = this.labelFilterData + key + '::' + this.selectedLabels[key].join(',');
          } else {
            this.labelFilterData = this.labelFilterData + '$' + key + '::' + this.selectedLabels[key].join(',');
          }
        }
      } else {
        delete this.selectedLabels[key];
      }
    });
  }
  // labels(checkin) {
  //   for (let i = 0; i < this.providerLabels.length; i++) {
  //     for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
  //       this.providerLabels[i].valueSet[j].selected = false;
  //     }
  //   }
  //   setTimeout(() => {
  //     const values = [];
  //     if (checkin.label) {
  //       for (const value of Object.values(checkin.label)) {
  //         values.push(value);
  //       }
  //       for (let i = 0; i < this.providerLabels.length; i++) {
  //         for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
  //           for (let k = 0; k < values.length; k++) {
  //             if (this.providerLabels[i].valueSet[j].value === values[k]) {
  //               this.providerLabels[i].valueSet[j].selected = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }, 100);
  // }
  // addLabelvalue(source, label?) {
  //   const _this = this;
  //   const appts = [];
  //   Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
  //     appts.push(_this.appointmentsChecked[apptIndex]);
  //   });
  //   this.labeldialogRef = this.dialog.open(ApplyLabelComponent, {
  //     width: '50%',
  //     panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
  //     disableClose: true,
  //     autoFocus: true,
  //     data: {
  //       checkin: appts[0],
  //       source: source,
  //       label: label
  //     }
  //   });
  //   this.labeldialogRef.afterClosed().subscribe(data => {
  //     if (data) {
  //       setTimeout(() => {
  //         this.labels(appts[0]);
  //         this.labelMap = new Object();
  //         this.labelMap[data.label] = data.value;
  //         this.addLabel(appts[0].ynwUuid);
  //         this.getDisplayname(data.label);
  //         this.loadApiSwitch('');
  //       }, 500);
  //     }
  //     this.getLabel();
  //   });
  // }
  // addLabel(checkinId) {
  //   this.provider_services.addLabeltoCheckin(checkinId, this.labelMap).subscribe(data => {
  //     this.loadApiSwitch('');
  //   },
  //     error => {
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
  // }
  // deleteLabel(label, checkinId) {
  //   this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
  //     this.loadApiSwitch('');
  //   },
  //     error => {
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
  // }

  // changeLabelvalue(labelname, value) {
  //   this.showLabels = false;
  //   const _this = this;
  //   const appts = [];
  //   Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
  //     appts.push(_this.appointmentsChecked[apptIndex]);
  //   });
  //   if (appts.length === 1) {
  //     this.labelMap = new Object();
  //     this.labelMap[labelname] = value;
  //     for (let i = 0; i < this.providerLabels.length; i++) {
  //       for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
  //         if (this.providerLabels[i].valueSet[j].value === value) {
  //           if (!this.providerLabels[i].valueSet[j].selected) {
  //             this.providerLabels[i].valueSet[j].selected = true;
  //             this.addLabel(appts[0].ynwUuid);
  //           } else {
  //             this.providerLabels[i].valueSet[j].selected = false;
  //             this.deleteLabel(labelname, appts[0].ynwUuid);
  //           }
  //         } else {
  //           if (this.providerLabels[i].label === labelname) {
  //             this.providerLabels[i].valueSet[j].selected = false;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  setLabelFilter(label, event) {
    const value = event.checked;
    if (label === 'all') {
      this.allLabelSelected = false;
      if (event.checked) {
        for (const lbl of this.providerLabels) {
          if (!this.selectedLabels[lbl.label]) {
            this.selectedLabels[lbl.label] = [];
            this.selectedLabels[lbl.label].push(true);
          }
        }
        this.allLabelSelected = true;
      } else {
        this.selectedLabels = [];
        this.allLabelSelected = false;
      }
    } else {
      this.allLabelSelected = false;
      if (this.selectedLabels[label.label]) {
        delete this.selectedLabels[label.label];
      } else {
        this.selectedLabels[label.label] = [];
        this.selectedLabels[label.label].push(value);
      }
      if (Object.keys(this.selectedLabels).length === this.providerLabels.length) {
        this.allLabelSelected = true;
      }
    }
    this.doSearch();
  }
}
