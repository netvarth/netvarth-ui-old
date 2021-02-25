import { Component, OnInit } from '@angular/core';
import '../../../../../../../assets/js/pages/custom/wizard/wizard-3';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { projectConstants } from '../../../../../../app.component';
import { TimewindowPopupComponent } from '../../../ordermanager/catalog/timewindowpopup/timewindowpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { ServiceListDialogComponent } from '../../../../../shared/service-list-dialog/service-list-dialog.component';


@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css', '../../../../../../../assets/css/style.bundle.css', '../../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../../assets/css/pages/wizard/wizard-3.css']

})
export class CreateCouponComponent implements OnInit {
  servicedialogRef: any;
  showServiceSection: boolean;
  showCatalogSection: boolean;
  active_user: any;
  deptObj;
  department_list: any = [];
  service_list: any = [];
  item_list: any = [];
  customer_label_list: any = [];
  customer_group_list: any = [];
  user_list: any = [];
  catalog_list: any = [];
  enddateError: boolean;
  startdateError: boolean;
  timewindow_list: any = [];
  timewindowdialogRef: any;
  max_char_count: any;
  char_count: number;
  isfocused: boolean;
  public couponForm: FormGroup;
  step = 1;
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  weekdays = projectConstants.myweekdaysSchedule;
  bookingMode = projectConstants.BOOKING_MODE;
  constructor(private formbuilder: FormBuilder,
    public fed_service: FormMessageDisplayService,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    public dialog: MatDialog, ) {
    this.createForm();
  }

  ngOnInit(): void {


    this.getItems();
    this.getCustomerLabels();
    this.getCustomerGroups();
    this.getCatalogs();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.active_user.type === 'BRANCH') {
      this.getUsers();
      this.getDepartments();
    }

  }

  createForm() {
    this.couponForm = this.formbuilder.group({
      couponName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      couponCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      couponDesc: [''],
      calculationType: [''],
      amount: [''],
      couponRules: this.formbuilder.group({
        validFrom: ['', [Validators.required]],
        validTo: ['', [Validators.required]],
        firstCheckinOnly: [''],
        minBillAmount: [''],
        maxDiscountValue: [''],
        isproviderAcceptCoupon: [''],
        maxProviderUseLimit: [''],
        departments: ['', [Validators.required]],
        services: ['', [Validators.required]],
        users: ['', [Validators.required]],
        catalogues: ['', [Validators.required]],
        consumerGroups: ['', [Validators.required]],
        consumerLabels: ['', [Validators.required]],
        items: ['', [Validators.required]],
        couponBasedOn: [''],
        isDepartment: [''],
        isUser: [''],
        isService: [''],
        isCatalog: [''],
        isItem: [''],
        isCustomerGroup: [''],
        isCustomerLabel: [''],
        isCatalogBased: [''],
        isServiceBased: ['']
      }),

      bookingChannel: ['']
    });

  }
  handleCalculationType(event) {

  }
  handleBaseChange(event) {
    if (event.value === 'ServiceBased') {
      this.showServiceSection = true;
      this.showCatalogSection = false;
    } else {
      this.showCatalogSection = true;
      this.showServiceSection = false;
    }
  }
  onSubmit(form) {
    console.log(form);
    console.log(form.value);
    console.log(JSON.stringify(form.value));
  }
  showTimewindow() {
    this.timewindowdialogRef = this.dialog.open(TimewindowPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        windowlist: this.timewindow_list
      }
    });
    this.timewindowdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.timewindow_list.push(result);
      }
    });
  }
  deletetimeslot(index) {
    this.timewindow_list.splice(index, 1);
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.couponForm.get('couponDesc').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.couponForm.get('couponDesc').value.length;
  }
  gotoNext() {
    this.step = this.step + 1;
  }
  // wizard
  gotoPrevious() {
    this.step = this.step - 1;
  }
  resetApiErrors() {
  }
  compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.couponForm.get('validFrom').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
        return this.startdateError = true;
      }
      return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
        return this.enddateError = true;
      }
      return this.enddateError = false;
    }
  }
  handleDaychange(index) {

  }
  getDepartments() {

    this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.department_list = this.deptObj.departments;

        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }

  getItems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;

      });
  }
  getCustomerLabels() {

    this.provider_services.getLabelList()
      .subscribe(
        (data: any) => {
          this.customer_label_list = data;
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  getCustomerGroups() {

    this.provider_services.getCustomerGroup().subscribe((data: any) => {
      this.customer_group_list = data;

    });
  }
  getCatalogs() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;

      });
  }
  getUsers() {
    this.provider_services.getUsers().subscribe(
      (data: any) => {
        this.user_list = data;
      },

      (error: any) => {
        this.wordProcessor.apiErrorAutoHide(this, error);
      });
  }
  openServiceDialog() {
    this.servicedialogRef = this.dialog.open(ServiceListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,

    });
    this.servicedialogRef.afterClosed().subscribe(result => {

    });
  }
  openItemDialog() {

  }
  openDepartmentDialog() {

  }
  openCustomerGroupDialog() {

  }
  openCustomerLabelDialog() {

  }
  openUserDialog() {

  }
}

